import { Document } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "server/database";
import { sendEventNotifications, sendMail } from "features/api/email";
import {
  AddEventNotifPayload,
  EditEventPayload,
  GetEventParams
} from "features/api/eventsApi";
import { getSession } from "utils/auth";
import { EEventInviteStatus, IEvent } from "models/Event";
import { IEventNotification } from "models/INotification";
import { getLists, getSubscriptions, IOrg } from "models/Org";
import { ISubscription, EOrgSubscriptionType } from "models/Subscription";
import { createServerError } from "utils/errors";
import { createEventEmailNotif } from "utils/email";
import { equals, logJson, normalize } from "utils/string";
import { getRefId } from "models/Entity";
const { getEnv } = require("utils/env");

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<
  NextApiRequest & {
    query: GetEventParams;
  },
  NextApiResponse
>(async function getEvent(req, res) {
  const {
    query: { eventUrl }
  } = req;

  const notFoundResponse = () =>
    res
      .status(404)
      .json(
        createServerError(
          new Error(`L'événement ${eventUrl} n'a pas pu être trouvé`)
        )
      );

  try {
    let event = await models.Event.findOne({
      eventUrl
    });

    if (!event) event = await models.Event.findOne({ _id: eventUrl });

    if (!event) return notFoundResponse();

    const session = await getSession({ req });
    const isCreator =
      session?.user.isAdmin || equals(event.createdBy, session?.user.userId);

    if (isCreator) {
      event = await event
        .populate({
          path: "eventOrgs",
          populate: [
            {
              path: "orgLists",
              populate: {
                path: "subscriptions",
                select: isCreator ? "+email +phone" : undefined,
                populate: {
                  path: "user",
                  select: isCreator ? "+email" : undefined
                }
              }
            },
            {
              path: "orgSubscriptions",
              select: isCreator ? "+email +phone" : undefined,
              populate: {
                path: "user",
                select: isCreator ? "+email" : undefined
              }
            }
          ]
        })
        .execPopulate();

      for (const eventOrg of event.eventOrgs) {
        eventOrg.orgLists = getLists(eventOrg);
      }
    } else {
      event = event.populate("eventOrgs");
    }

    event = await event
      .populate("createdBy", isCreator ? "_id email userName" : "_id userName")
      .populate({
        path: "eventTopics",
        populate: [
          {
            path: "topicMessages",
            populate: {
              path: "createdBy",
              select: "_id userName"
            }
          },
          { path: "createdBy", select: "_id userName" }
        ]
      })
      .execPopulate();

    res.status(200).json(event);
  } catch (error: any) {
    if (error.name === "CastError" && error.value === eventUrl)
      return notFoundResponse();

    res.status(500).json(createServerError(error));
  }
});

handler.post<
  NextApiRequest & {
    query: { eventUrl: string };
    body: AddEventNotifPayload;
  },
  NextApiResponse
>(async function addEventNotif(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res
      .status(401)
      .json(createServerError(new Error("Vous devez être identifié")));
  }

  try {
    const {
      query: { eventUrl: _id },
      body
    }: {
      query: { eventUrl: string };
      body: AddEventNotifPayload;
    } = req;

    let event = await models.Event.findOne({ _id });

    if (!event) {
      return res
        .status(404)
        .json(createServerError(new Error(`L'événement ${_id} n'existe pas`)));
    }

    if (
      !equals(event.createdBy, session.user.userId) &&
      !session.user.isAdmin
    ) {
      return res
        .status(403)
        .json(
          createServerError(
            new Error(
              "Vous ne pouvez pas envoyer des notifications pour un événement que vous n'avez pas créé"
            )
          )
        );
    }

    if (!event.isApproved) {
      return res
        .status(403)
        .json(
          createServerError(
            new Error(
              "Vous ne pouvez pas envoyer des notifications pour un événement qui n'est pas approuvé"
            )
          )
        );
    }

    let notifications: IEventNotification[] = [];

    if (typeof body.email === "string" && body.email.length > 0) {
      const subscription = await models.Subscription.findOne({
        email: body.email
      });

      event = await event.populate("eventOrgs").execPopulate();

      const mail = createEventEmailNotif({
        email: body.email,
        event,
        org: event.eventOrgs[0],
        subscriptionId: subscription?._id || session.user.userId
      });

      try {
        await sendMail(mail);
      } catch (error: any) {
        if (getEnv() === "development") {
          if (error.command !== "CONN") {
            throw error;
          }
        }
      }

      notifications = [
        {
          email: body.email,
          status: EEventInviteStatus.PENDING,
          createdAt: new Date().toISOString()
        }
      ];

      if (body.email !== session.user.email) {
        event.eventNotifications =
          event.eventNotifications.concat(notifications);
        await event.save();
      }
    } else if (body.orgListsNames) {
      //console.log(`POST /event/${_id}: orgListsNames`, body.orgListsNames);

      for (const orgListName of body.orgListsNames) {
        const [_, listName, orgId] = orgListName.match(/([^\.]+)\.(.+)/) || [];

        let org: (IOrg & Document<any, IOrg>) | null | undefined;
        org = await models.Org.findOne({ _id: orgId });
        if (!org) return res.status(400).json("Organisation introuvable");

        let subscriptions: ISubscription[] = [];

        if (["Abonnés"].includes(listName)) {
          org = await org
            .populate({
              path: "orgSubscriptions",
              select: "+email +phone",
              populate: {
                path: "user",
                select: "+email +phone +userSubscription"
              }
            })
            .execPopulate();
          subscriptions = subscriptions.concat(
            getSubscriptions(org, EOrgSubscriptionType.FOLLOWER)
          );
        } else {
          org = await org
            .populate({
              path: "orgLists",
              populate: [
                {
                  path: "subscriptions",
                  select: "+email +phone",
                  populate: {
                    path: "user",
                    select: "+email +phone +userSubscription"
                  }
                }
              ]
            })
            .execPopulate();

          const list = org.orgLists.find(
            (orgList) => orgList.listName === listName
          );

          if (list && list.subscriptions) subscriptions = list.subscriptions;
        }

        notifications = await sendEventNotifications({
          event,
          org,
          subscriptions
        });
      }
    }

    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json(createServerError(error));
  }
});

handler.put<
  NextApiRequest & {
    query: { eventUrl: string };
    body: EditEventPayload<string>;
  },
  NextApiResponse
>(async function editEvent(req, res) {
  const session = await getSession({ req });
  let { body }: { body: EditEventPayload<string> } = req;
  const eventNotifications = !Array.isArray(body) && body.eventNotifications;

  if (!session && !eventNotifications) {
    return res
      .status(401)
      .json(createServerError(new Error("Vous devez être identifié")));
  }

  try {
    const _id = req.query.eventUrl;
    let event = await models.Event.findOne({ _id }).populate("eventOrgs");

    if (!event) {
      return res
        .status(404)
        .json(
          createServerError(
            new Error(`L'événement ${_id} n'a pas pu être trouvé`)
          )
        );
    }

    const isCreator =
      equals(getRefId(event), session?.user.userId) || session?.user.isAdmin;
    const eventTopicCategories =
      !Array.isArray(body) && body.eventTopicCategories;

    if (!isCreator && !eventTopicCategories && session) {
      return res
        .status(403)
        .json(
          createServerError(
            new Error(
              "Vous ne pouvez pas modifier un événement que vous n'avez pas créé"
            )
          )
        );
    }

    let update: [{ $unset: string[] }] | undefined;
    // let update:
    //   | {
    //       $unset?: { [key: string]: number };
    //       $pull?: { [key: string]: { [key: string]: string } | string };
    //     }
    //   | undefined;

    if (Array.isArray(body)) {
      update = [{ $unset: [] }];
      for (const key of body) {
        if (key.includes(".") && key.includes("=")) {
          const matches = key.match(/([^\.]+)\.([^=]+)=(.+)/);

          if (matches && matches.length === 4) {
            // update = {
            //   $pull: { [matches[1]]: { [matches[2]]: matches[3] } }
            // };
          }
        } else if (key.includes("=")) {
          const matches = key.match(/([^=]+)=(.+)/);

          if (matches && matches.length === 3) {
            // update = {
            //   $pull: { [matches[1]]: matches[2] }
            // };

            if (matches[1] === "orgTopicCategories") {
              // await models.Topic.updateMany(
              //   { topicCategory: matches[2] },
              //   { topicCategory: null }
              // );
            }
          }
        } else {
          update[0].$unset.push(key);
          //update = { $unset: { [key]: 1 } };
        }
      }
    } else {
      if (body.eventName) {
        body = {
          ...body,
          eventName: body.eventName.trim(),
          eventUrl: normalize(body.eventName.trim())
        };
      }

      if (body.eventOrgs) {
        const staleEventOrgsIds: string[] = [];

        for (const { _id } of body.eventOrgs) {
          const org = await models.Org.findOne({ _id });

          if (!org) {
            staleEventOrgsIds.push(_id);
            continue;
          }

          if (org.orgEvents.indexOf(event._id) === -1) {
            await models.Org.updateOne(
              { _id: org._id },
              {
                $push: {
                  orgEvents: event._id
                }
              }
            );
          }
        }

        if (staleEventOrgsIds.length > 0) {
          body.eventOrgs = body.eventOrgs.filter(
            (eventOrg) => !staleEventOrgsIds.find((id) => id === eventOrg._id)
          );
        }
      }

      if (eventTopicCategories) {
        if (!isCreator) {
          return res
            .status(400)
            .json(
              createServerError(
                new Error(
                  `Vous devez être le créateur de l'événement "${event.eventName}" pour créer une catégorie de discussions`
                )
              )
            );
        }
      }
    }

    logJson(`PUT /event/${_id}:`, update || body);
    event = await models.Event.findOneAndUpdate({ _id }, update || body);

    if (!event) {
      return res
        .status(400)
        .json(
          createServerError(
            new Error(`L'événement ${_id} n'a pas pu être modifié`)
          )
        );
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json(createServerError(error));
  }
});

handler.delete<
  NextApiRequest & {
    query: { eventUrl: string };
  },
  NextApiResponse
>(async function removeEvent(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res
      .status(401)
      .json(createServerError(new Error("Vous devez être identifié")));
  }

  try {
    const _id = req.query.eventUrl;
    let event = await models.Event.findOne({ _id });

    if (!event) {
      return res
        .status(404)
        .json(
          createServerError(
            new Error(`L'événement ${_id} n'a pas pu être trouvé`)
          )
        );
    }

    if (
      !equals(event.createdBy, session.user.userId) &&
      !session.user.isAdmin
    ) {
      return res
        .status(403)
        .json(
          createServerError(
            new Error(
              "Vous ne pouvez pas supprimer un événement que vous n'avez pas créé"
            )
          )
        );
    }

    const { deletedCount } = await models.Event.deleteOne({ _id });

    if (deletedCount !== 1) {
      return res
        .status(400)
        .json(
          createServerError(
            new Error(`L'événement ${_id} n'a pas pu être supprimé`)
          )
        );
    }

    for (const eventOrgRef of event.eventOrgs) {
      const eventOrg = await models.Org.findOne({
        _id: getRefId(eventOrgRef)
      });

      if (eventOrg) {
        eventOrg.orgEvents = eventOrg.orgEvents.filter(
          (orgEvent) => !equals(orgEvent, event?._id)
        );
        await eventOrg.save();
      }
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json(createServerError(error));
  }
});

export default handler;
