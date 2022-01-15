import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import { getSession } from "hooks/useAuth";
import { IOrg, orgTypeFull } from "models/Org";
import {
  createServerError,
  databaseErrorCodes,
  duplicateError
} from "utils/errors";
import { equals, logJson, normalize } from "utils/string";
import { getSubscriberSubscription } from "models/Subscription";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<
  NextApiRequest & {
    query: { orgUrl: string; hash?: string; populate?: string };
  },
  NextApiResponse
>(async function getOrg(req, res) {
  try {
    const session = await getSession({ req });
    const {
      query: { orgUrl, hash, populate }
    } = req;

    let org = await models.Org.findOne({ orgUrl });

    if (!org)
      return res
        .status(404)
        .json(
          createServerError(
            new Error(`L'organisation ${orgUrl} n'a pas pu être trouvé`)
          )
        );

    // hand emails to org creator only
    const isCreator =
      equals(org.createdBy, session?.user.userId) || session?.user.isAdmin;

    if (!isCreator && org.orgPassword) {
      if (!hash) return res.status(200).json({ orgSalt: org.orgSalt });

      if (org.orgPassword === hash) return res.status(200).json(org);
    }

    let select = isCreator
      ? "-password -securityCode"
      : "-email -password -securityCode";

    if (populate) {
      if (populate.includes("orgs")) org = org.populate("orgs");

      if (populate.includes("orgEvents")) org = org.populate("orgEvents");

      if (populate.includes("orgLists"))
        org = org.populate({
          path: "orgLists",
          populate: {
            path: "subscriptions",
            populate: { path: "user", select }
          }
        });

      if (populate.includes("orgProjects"))
        org = org.populate({
          path: "orgProjects",
          populate: [
            { path: "projectOrgs" },
            { path: "createdBy", select: "_id userName" }
          ]
        });

      if (populate.includes("orgTopics"))
        org = org.populate({
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
        });

      if (populate.includes("orgSubscriptions"))
        org = org.populate({
          path: "orgSubscriptions",
          select: isCreator
            ? "_id email phone events orgs topics"
            : "_id events orgs topics",
          populate: {
            path: "user",
            select: isCreator ? "_id userName email" : "_id userName"
          }
        });
    }

    org = await org.populate("createdBy", "_id userName").execPopulate();

    if (!populate || !populate.includes("orgLogo")) {
      org.orgLogo = undefined;
    }
    if (!populate || !populate.includes("orgBanner")) {
      org.orgBanner = undefined;
    }

    for (const orgEvent of org.orgEvents) {
      if (orgEvent.forwardedFrom?.eventId) {
        const e = await models.Event.findOne({
          _id: orgEvent.forwardedFrom.eventId
        });
        if (e) {
          orgEvent.forwardedFrom.eventUrl = orgEvent._id;
          orgEvent.eventName = e.eventName;
          orgEvent.eventUrl = e.eventUrl;
        }
      }
    }

    for (const orgTopic of org.orgTopics) {
      if (orgTopic.topicMessages) {
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
    }

    res.status(200).json(org);
  } catch (error) {
    res.status(500).json(createServerError(error));
  }
});

handler.put<
  NextApiRequest & {
    query: { orgUrl: string };
    body: Partial<IOrg> | string[];
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

    if (!org)
      return res
        .status(404)
        .json(
          createServerError(
            new Error(`L'organisation ${orgUrl} n'a pas pu être trouvé`)
          )
        );

    let { body }: { body: Partial<IOrg> | string[] } = req;
    const orgTopicsCategories =
      !Array.isArray(body) && body.orgTopicsCategories;

    if (!orgTopicsCategories) {
      if (!equals(org.createdBy, session.user.userId) && !session.user.isAdmin)
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
          // orgTopicsCategories=string
          const matches = key.match(/([^=]+)=(.+)/);

          if (matches && matches.length === 3) {
            update = {
              $pull: { [matches[1]]: matches[2] }
            };

            if (matches[1] === "orgTopicsCategories") {
              await models.Topic.updateMany(
                { topicCategory: matches[2] },
                { topicCategory: null }
              );
            }
          }
        } else update = { $unset: { [key]: 1 } };
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

      if (orgTopicsCategories) {
        const subscription = await models.Subscription.findOne({
          email: session?.user.email
        });

        if (
          !session.user.isAdmin &&
          (!subscription || !getSubscriberSubscription({ org, subscription }))
        )
          return res
            .status(400)
            .json(
              createServerError(
                new Error(
                  `Vous devez être adhérent ${orgTypeFull(org.orgType)} "${
                    org.orgName
                  }" pour créer une catégorie de discussions`
                )
              )
            );
      }
    }

    logJson(`PUT /org/${orgUrl}:`, update || body);

    const { n, nModified } = await models.Org.updateOne(
      { orgUrl },
      update || body
    );

    if (nModified !== 1) {
      return res
        .status(400)
        .json(
          createServerError(
            new Error(`L'organisation ${orgUrl} n'a pas pu être modifiée`)
          )
        );
    }

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
    res
      .status(403)
      .json(createServerError(new Error("Vous devez être identifié")));
  } else {
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

      if (
        !equals(org.createdBy, session.user.userId) &&
        !session.user.isAdmin
      ) {
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

      // todo delete references to this org

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
  }
});

export default handler;
