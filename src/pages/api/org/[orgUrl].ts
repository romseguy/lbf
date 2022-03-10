import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import { EditOrgPayload, GetOrgParams } from "features/orgs/orgsApi";
import { getSession } from "hooks/useAuth";
import { EEventVisibility } from "models/Event";
import { getLists, IOrg, orgTypeFull } from "models/Org";
import {
  ISubscription,
  getFollowerSubscription,
  getSubscriberSubscription
} from "models/Subscription";
import { hasItems } from "utils/array";
import {
  createServerError,
  databaseErrorCodes,
  duplicateError
} from "utils/errors";
import { getRefId } from "models/Entity";
import { equals, logJson, normalize } from "utils/string";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<
  NextApiRequest & {
    query: GetOrgParams;
  },
  NextApiResponse
>(async function getOrg(req, res) {
  try {
    let {
      query: { orgUrl, hash, populate = "" }
    } = req;

    const select = `+orgPassword ${
      populate.includes("orgLogo") ? "+orgLogo" : ""
    } ${populate.includes("orgBanner") ? "+orgBanner" : ""}`;

    let org = await models.Org.findOne({ orgUrl }, select);

    if (!org) {
      org = await models.Org.findOne({ _id: orgUrl }, select);

      if (!org) {
        return res
          .status(404)
          .json(
            createServerError(
              new Error(`L'organisation ${orgUrl} n'a pas pu être trouvé`)
            )
          );
      }
    }

    const session = await getSession({ req });
    const isCreator =
      orgUrl === "nom_de_votre_organisation" ||
      equals(getRefId(org), session?.user.userId) ||
      session?.user.isAdmin;

    if (!isCreator) {
      if (org.orgPassword) {
        if (!hash) return res.status(200).json({ orgSalt: org.orgSalt });

        if (org.orgPassword !== hash)
          return res
            .status(403)
            .json(createServerError(new Error("Mot de passe incorrect")));

        org.orgPassword = undefined;
      }
    }

    for (const modelKey of populate
      .split(/(\s+)/)
      .filter((e: string) => e.trim().length > 0)) {
      if (
        [
          "orgs",
          "orgEvents",
          "orgLists",
          "orgProjects",
          "orgTopics",
          "orgSubscriptions"
        ].includes(modelKey)
      ) {
        console.log(
          `GET /${orgUrl} populating ${modelKey} with custom behavior`
        );
        populate = populate.replace(modelKey, "");
      }

      if (modelKey === "orgs") {
        org = org.populate("orgs");
      }

      if (modelKey === "orgEvents") {
        org = await org
          .populate({
            path: "orgEvents",
            populate: { path: "eventOrgs" }
          })
          .execPopulate();

        for (const orgEvent of org.orgEvents) {
          if (orgEvent.forwardedFrom?.eventId) {
            const event = await models.Event.findOne({
              _id: orgEvent.forwardedFrom.eventId
            });
            if (event) {
              orgEvent.forwardedFrom.eventUrl = orgEvent._id;
              orgEvent.eventName = event.eventName;
              orgEvent.eventUrl = event.eventUrl;
            }
          }
        }

        if (!isCreator) {
          const subscription = await models.Subscription.findOne({
            user: session?.user.userId
          });
          const isFollowed = !!getFollowerSubscription({
            org,
            subscription: subscription as ISubscription
          });
          const isSubscribed = !!getSubscriberSubscription({
            org,
            subscription: subscription as ISubscription
          });

          org.orgEvents = org.orgEvents.filter(
            ({ eventVisibility }) =>
              eventVisibility === EEventVisibility.PUBLIC ||
              (eventVisibility === EEventVisibility.FOLLOWERS && isFollowed) ||
              (eventVisibility === EEventVisibility.SUBSCRIBERS && isSubscribed)
          );
        }
      }

      if (modelKey === "orgLists") {
        org = await org
          .populate({
            path: "orgLists",
            populate: {
              path: "subscriptions",
              select: isCreator ? "+email +phone" : undefined,
              populate: {
                path: "user",
                select: isCreator ? "+email" : undefined
              }
            }
          })
          .execPopulate();

        org = await org
          .populate({
            path: "orgSubscriptions",
            select: isCreator ? "+email +phone" : undefined,
            populate: {
              path: "user",
              select: isCreator ? "+email +phone" : undefined
            }
          })
          .execPopulate();

        org.orgLists = getLists(org);

        if (!isCreator) {
          const subscription = await models.Subscription.findOne({
            user: session?.user.userId
          });

          org.orgLists = subscription
            ? org.orgLists.filter(
                ({ subscriptions }) =>
                  !!subscriptions.find(({ _id }) =>
                    equals(_id, subscription._id)
                  )
              )
            : [];
        }
      }

      if (modelKey === "orgProjects") {
        org = org.populate({
          path: "orgProjects",
          populate: [
            { path: "projectOrgs" },
            { path: "createdBy", select: "_id userName" }
          ]
        });

        if (!isCreator) {
          org = await org.execPopulate();

          const subscription = await models.Subscription.findOne({
            user: session?.user.userId
          });
          const isFollowed = !!getFollowerSubscription({
            org,
            subscription: subscription as ISubscription
          });
          const isSubscribed = !!getSubscriberSubscription({
            org,
            subscription: subscription as ISubscription
          });

          org.orgProjects = org.orgProjects.filter(
            ({ projectVisibility }) =>
              !projectVisibility ||
              !hasItems(projectVisibility) ||
              (projectVisibility.includes("Abonnés") && isFollowed) ||
              (projectVisibility.includes("Adhérents") && isSubscribed)
          );
        }
      }

      if (modelKey === "orgTopics") {
        org = await org

          .populate({
            path: "orgTopics",
            populate: [
              {
                path: "topicMessages",
                populate: { path: "createdBy", select: "_id userName" }
              },
              { path: "createdBy", select: "_id userName" },
              {
                path: "org",
                select: "orgUrl"
              },
              { path: "event", select: "eventUrl" }
            ]
          })
          .execPopulate();

        for (const orgTopic of org.orgTopics) {
          for (const topicMessage of orgTopic.topicMessages) {
            if (typeof topicMessage.createdBy === "object") {
              if (
                !topicMessage.createdBy.userName &&
                topicMessage.createdBy.email
              ) {
                topicMessage.createdBy.userName =
                  topicMessage.createdBy.email.replace(/@.+/, "");
              }
              // todo: check this
              // topicMessage.createdBy.email = undefined;
            }
          }
        }

        if (!isCreator) {
          org = await org.execPopulate();

          const subscription = session
            ? await models.Subscription.findOne({
                user: session.user.userId
              })
            : null;

          org.orgTopics = subscription
            ? org.orgTopics.filter(({ topicVisibility }) => {
                if (!hasItems(topicVisibility)) return true;

                for (const listName of topicVisibility) {
                  if (listName === "Adhérents") {
                    if (
                      getSubscriberSubscription({
                        org: org as IOrg,
                        subscription
                      })
                    ) {
                      return true;
                    }
                  } else if (listName === "Abonnés") {
                    if (
                      getFollowerSubscription({
                        org: org as IOrg,
                        subscription
                      })
                    ) {
                      return true;
                    }
                  }

                  const orgList = org?.orgLists.find(
                    (orgList) => orgList.listName === listName
                  );

                  return !!orgList?.subscriptions?.find(({ _id }) =>
                    equals(_id, subscription._id)
                  );
                }
              })
            : org.orgTopics.filter(
                ({ topicVisibility }) => !hasItems(topicVisibility)
              );
        }
      }

      if (modelKey === "orgSubscriptions") {
        org = org.populate({
          path: "orgSubscriptions",
          select: isCreator ? "+email +phone" : undefined,
          populate: {
            path: "user",
            select: isCreator ? "+email" : undefined
          }
        });
      }
    }

    console.log(`GET /${orgUrl} unhandled keys: ${populate}`);
    org = await org.populate("createdBy", "_id userName").execPopulate();
    res.status(200).json(org);
  } catch (error) {
    res.status(500).json(createServerError(error));
  }
});

handler.put<
  NextApiRequest & {
    query: { orgUrl: string };
    body: EditOrgPayload;
  },
  NextApiResponse
>(async function editOrg(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res
      .status(403)
      .json(createServerError(new Error("Vous devez être identifié")));
  }

  try {
    const orgUrl = req.query.orgUrl;
    const org = await models.Org.findOne({ orgUrl });

    if (!org) {
      return res
        .status(404)
        .json(
          createServerError(
            new Error(`L'organisation ${orgUrl} n'a pas pu être trouvé`)
          )
        );
    }

    let { body }: { body: EditOrgPayload } = req;
    const isCreator =
      equals(getRefId(org), session?.user.userId) || session?.user.isAdmin;
    const orgTopicCategories = !Array.isArray(body) && body.orgTopicCategories;

    if (!isCreator && !orgTopicCategories) {
      return res
        .status(403)
        .json(
          createServerError(
            new Error(
              "Vous ne pouvez pas modifier un organisation que vous n'avez pas créé."
            )
          )
        );
    }

    let update:
      | {
          $unset?: { [key: string]: number };
          $pull?: { [key: string]: { [key: string]: string } | string };
        }
      | undefined;

    if (Array.isArray(body)) {
      for (const key of body) {
        if (key.includes(".") && key.includes("=")) {
          // orgLists.listName=string
          const matches = key.match(/([^\.]+)\.([^=]+)=(.+)/);

          if (matches && matches.length === 4) {
            update = {
              $pull: { [matches[1]]: { [matches[2]]: matches[3] } }
            };
          }
        } else if (key.includes("=")) {
          // orgTopicCategories=string
          const matches = key.match(/([^=]+)=(.+)/);

          if (matches && matches.length === 3) {
            update = {
              $pull: { [matches[1]]: matches[2] }
            };

            if (matches[1] === "orgTopicCategories") {
              await models.Topic.updateMany(
                { topicCategory: matches[2] },
                { topicCategory: null }
              );
            }
          }
        } else {
          update = { $unset: { [key]: 1 } };
        }
      }
    } else {
      if (body.orgName) {
        body = {
          ...body,
          orgName: body.orgName.trim(),
          orgUrl: normalize(body.orgName.trim())
        };

        if (
          body.orgName !== org.orgName &&
          (await models.Org.findOne({ orgName: body.orgName }))
        )
          throw duplicateError();
      }

      if (orgTopicCategories) {
        const subscription = await models.Subscription.findOne({
          email: session?.user.email
        });

        if (
          !isCreator &&
          (!subscription || !getSubscriberSubscription({ org, subscription }))
        ) {
          return res
            .status(400)
            .json(
              createServerError(
                new Error(
                  `Vous devez être adhérent ou créateur ${orgTypeFull(
                    org.orgType
                  )} "${org.orgName}" pour créer une catégorie de discussions`
                )
              )
            );
        }
      }
    }

    logJson(`PUT /org/${orgUrl}:`, update || body);

    await models.Org.updateOne({ orgUrl }, update || body);

    // if (nModified !== 1) {
    //   return res
    //     .status(400)
    //     .json(
    //       createServerError(
    //         new Error(`L'organisation ${orgUrl} n'a pas pu être modifiée`)
    //       )
    //     );
    // }

    res.status(200).json({});
  } catch (error: any) {
    if (error.code && error.code === databaseErrorCodes.DUPLICATE_KEY)
      return res.status(400).json({
        [error.field || "orgName"]: "Ce nom n'est pas disponible"
      });

    res.status(500).json(createServerError(error));
  }
});

handler.delete<
  NextApiRequest & {
    query: { orgUrl: string };
  },
  NextApiResponse
>(async function removeOrg(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res
      .status(403)
      .json(createServerError(new Error("Vous devez être identifié")));
  }

  try {
    const orgUrl = req.query.orgUrl;
    const org = await models.Org.findOne({ orgUrl });

    if (!org) {
      return res
        .status(404)
        .json(
          createServerError(
            new Error(`L'organisation ${orgUrl} n'a pas pu être trouvé`)
          )
        );
    }

    if (!equals(org.createdBy, session.user.userId) && !session.user.isAdmin) {
      return res
        .status(403)
        .json(
          createServerError(
            new Error(
              "Vous ne pouvez pas supprimer une organisation que vous n'avez pas créé."
            )
          )
        );
    }

    const { deletedCount } = await models.Org.deleteOne({ orgUrl });

    // todo delete references to this org?

    if (deletedCount === 1) {
      res.status(200).json(org);
    } else {
      res
        .status(400)
        .json(
          createServerError(
            new Error(`L'organisation ${orgUrl} n'a pas pu être supprimé`)
          )
        );
    }
  } catch (error) {
    res.status(500).json(createServerError(error));
  }
});

export default handler;
