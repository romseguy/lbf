import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "server/database";
import { EditTopicPayload } from "features/api/topicsApi";
import { getRefId } from "models/Entity";
import { getSession } from "server/auth";
import { createEndpointError } from "utils/errors";
import { equals } from "utils/string";
import { logEvent, ServerEventTypes } from "server/logging";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

// handler.post<
//   NextApiRequest & {
//     query: { topicId: string };
//     body: AddTopicNotifPayload;
//   },
//   NextApiResponse
// >(async function addTopicNotif(req, res) {
//   const session = await getSession({ req });

//   if (!session) {
//     return res
//       .status(401)
//       .json(createEndpointError(new Error("Vous devez être identifié")));
//   }

//   try {
//     const {
//       query: { topicId },
//       body
//     }: {
//       query: { topicId: string };
//       body: AddTopicNotifPayload;
//     } = req;

//     const topic = await models.Topic.findOne({ _id: topicId });

//     if (!topic) {
//       return res
//         .status(404)
//         .json(
//           createEndpointError(
//             new Error(`La discussion ${topicId} n'existe pas`)
//           )
//         );
//     }

//     if (!equals(topic.createdBy, session.user.userId) && !session.user.isAdmin)
//       return res
//         .status(403)
//         .json(
//           createEndpointError(
//             new Error(
//               "Vous ne pouvez pas envoyer des notifications pour une discussion que vous n'avez pas créé"
//             )
//           )
//         );

//     let notifications: ITopicNotification[] = [];

//     if (typeof body.email === "string" && body.email.length > 0) {
//       let subscription = await models.Subscription.findOne({
//         email: body.email
//       });

//       if (!subscription) {
//         const user = await models.User.findOne({ email: body.email });

//         if (user)
//           subscription = await models.Subscription.findOne({ user: user._id });
//       }

//       const mail = createTopicEmailNotif({
//         email: body.email,
//         event: body.event,
//         org: body.org,
//         topic,
//         subscriptionId: subscription?._id || session.user.userId
//       });

//       try {
//         await sendMail(mail);
//       } catch (error: any) {
//         const { getEnv } = require("utils/env");
//         if (getEnv() === "development") {
//           if (error.command !== "CONN") {
//             throw error;
//           }
//         }
//       }

//       notifications = [
//         {
//           email: body.email,
//           createdAt: new Date().toISOString()
//         }
//       ];

//       if (body.email !== session.user.email) {
//         topic.topicNotifications =
//           topic.topicNotifications.concat(notifications);
//         await topic.save();
//       }
//     } else if (body.event) {
//       let event = await models.Event.findOne({ _id: body.event._id });
//       if (!event) return res.status(400).json("Événement introuvable");

//       event = await event
//         .populate({
//           path: "eventSubscriptions",
//           select: "+email +phone",
//           populate: { path: "user", select: "+email +phone +userSubscription" }
//         })
//         .execPopulate();

//       notifications = await sendTopicNotifications({
//         event,
//         subscriptions: event.eventSubscriptions,
//         topic
//       });
//     } else if (body.orgListsNames) {
//       //console.log(`POST /topic/${topicId}: orgListsNames`, body.orgListsNames);

//       for (const orgListName of body.orgListsNames) {
//         const [_, listName, orgId] = orgListName.match(/([^\.]+)\.(.+)/) || [];

//         let org: (IOrg & Document<any, IOrg>) | null | undefined;
//         org = await models.Org.findOne({ _id: orgId });
//         if (!org) return res.status(400).json("Organisation introuvable");

//         let subscriptions: ISubscription[] = [];

//         if (["Abonnés"].includes(listName)) {
//           org = await org
//             .populate({
//               path: "orgSubscriptions",
//               select: "+email +phone",
//               populate: {
//                 path: "user",
//                 select: "+email +phone +userSubscription"
//               }
//             })
//             .execPopulate();

//           if (listName === "Abonnés") {
//             subscriptions = subscriptions.concat(
//               getSubscriptions(org, EOrgSubscriptionType.FOLLOWER)
//             );
//           }
//         } else {
//           org = await org
//             .populate({
//               path: "orgLists",
//               populate: [
//                 {
//                   path: "subscriptions",
//                   select: "+email +phone",
//                   populate: {
//                     path: "user",
//                     select: "+email +phone +userSubscription"
//                   }
//                 }
//               ]
//             })
//             .execPopulate();

//           const list = org.orgLists.find(
//             (orgList) => orgList.listName === listName
//           );

//           if (list && list.subscriptions) subscriptions = list.subscriptions;
//         }

//         notifications = await sendTopicNotifications({
//           org,
//           subscriptions,
//           topic
//         });
//       }
//     }

//     res.status(200).json({ notifications });
//   } catch (error) {
//     res.status(500).json(createEndpointError(error));
//   }
// });

handler.put<
  NextApiRequest & {
    query: { topicId: string };
    body: EditTopicPayload;
  },
  NextApiResponse
>(async function editTopic(req, res) {
  const prefix = `🚀 ~ ${new Date().toLocaleString()} ~ PUT /topic/[topicId] `;
  console.log(prefix + "query", req.query);
  console.log(prefix + "body", req.body);

  const session = await getSession({ req });
  if (!session) {
    return res
      .status(401)
      .json(createEndpointError(new Error("Vous devez être identifié")));
  }

  try {
    const {
      body
    }: {
      body: EditTopicPayload;
    } = req;

    const topicId = req.query.topicId;
    let topic = await models.Topic.findOne({ _id: topicId }, "+topicMessages");

    if (!topic)
      return res
        .status(404)
        .json(
          createEndpointError(
            new Error(`La discussion ${topicId} n'existe pas`)
          )
        );

    if (body.topic) {
      if (body.topicMessage) {
        const topicMessage = body.topic.topicMessages?.find(
          ({ _id }) => _id === body.topicMessage!._id
        );

        if (!topicMessage || !topicMessage.createdBy)
          return res
            .status(404)
            .json(
              createEndpointError(new Error("Le message n'a pas été trouvé."))
            );

        const isCreator = equals(getRefId(topicMessage), session.user.userId);

        if (!isCreator && !session.user.isAdmin)
          return res
            .status(403)
            .json(
              createEndpointError(
                new Error(
                  "Vous ne pouvez pas modifier le message d'une autre personne."
                )
              )
            );

        topic.topicMessages = topic.topicMessages.map((topicMessage) => {
          if (!body.topicMessage) return topicMessage; // dumb ts
          if (equals(topicMessage._id, body.topicMessage._id)) {
            const newTM = {
              ...body.topicMessage,
              _id: topicMessage._id,
              createdAt: topicMessage.createdAt,
              createdBy: topicMessage.createdBy,
              updatedAt: new Date() // FIXME https://stackoverflow.com/questions/39495671/mongodb-mongoose-timestamps-not-updating
            };
            return newTM;
          }

          return topicMessage;
        });
        await topic.save();
      } else if (body.topic.topicMessages) {
        // console.log(
        //   prefix + "body.topic.topicMessages",
        //   body.topic.topicMessages
        // );
        topic.topicMessages = body.topic.topicMessages;
        await topic.save();
      } else {
        const isCreator = equals(topic.createdBy, session.user.userId);
        if (!isCreator && !session.user.isAdmin)
          return res
            .status(403)
            .json(
              createEndpointError(
                new Error(
                  "Vous ne pouvez pas modifier une discussion que vous n'avez pas créé"
                )
              )
            );

        await models.Topic.updateOne({ _id: topicId }, body.topic);
      }
    }

    res.status(200).json({});
  } catch (error) {
    res.status(500).json(createEndpointError(error));
  }
});

handler.delete<
  NextApiRequest & {
    query: { topicId: string };
  },
  NextApiResponse
>(async function removeTopic(req, res) {
  const prefix = `🚀 ~ ${new Date().toLocaleString()} ~ DELETE /topic/[topicId] `;
  console.log(prefix + "query", req.query);

  const session = await getSession({ req });

  if (!session) {
    return res
      .status(401)
      .json(createEndpointError(new Error("Vous devez être identifié")));
  }

  try {
    const _id = req.query.topicId;
    let topic = await models.Topic.findOne({ _id });

    if (!topic) {
      return res
        .status(404)
        .json(
          createEndpointError(
            new Error(`La discussion n'a pas pu être trouvée`)
          )
        );
    }

    topic = await topic.populate("org event").execPopulate();
    const isCreator = equals(
      getRefId(topic.org || topic.event),
      session.user.userId
    );
    const isTopicCreator = equals(getRefId(topic), session.user.userId);

    if (!isCreator && !isTopicCreator && !session.user.isAdmin)
      return res
        .status(403)
        .json(
          createEndpointError(
            new Error(
              "Vous ne pouvez pas supprimer une discussion que vous n'avez pas créé"
            )
          )
        );

    //#region entity references
    if (topic.org) {
      const orgId = getRefId(topic.org);
      console.log(prefix + "deleting topic from org", orgId);
      await models.Org.updateOne(
        { _id: orgId },
        {
          $pull: { orgTopics: _id }
        }
      );
    } else if (topic.event) {
      const eventId = getRefId(topic.event);
      console.log(prefix + "deleting topic from event", eventId);
      await models.Event.updateOne(
        {
          _id: eventId
        },
        {
          $pull: { eventTopics: _id }
        }
      );
    }
    //#endregion

    //#region subscription reference
    const subscriptions = await models.Subscription.find({});
    let count = 0;
    for (const subscription of subscriptions) {
      if (!subscription.topics) continue;
      subscription.topics = subscription.topics.filter((topicSubscription) => {
        if (topicSubscription.topic === null) return false;
        if (equals(topicSubscription.topic._id, topic!._id)) {
          count++;
          return false;
        }
        return true;
      });
      await subscription.save();
    }
    if (count > 0)
      console.log(count + " subscriptions references to topic deleted");
    //#endregion

    const { deletedCount } = await models.Topic.deleteOne({ _id });
    if (deletedCount !== 1)
      throw new Error(`La discussion n'a pas pu être supprimée`);

    logEvent({
      type: ServerEventTypes.TOPICS_DEL,
      metadata: { topic }
    });

    res.status(200).json(topic);
  } catch (error) {
    res.status(500).json(createEndpointError(error));
  }
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb"
    }
  }
};

export default handler;
