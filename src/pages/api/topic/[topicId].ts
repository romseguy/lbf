import { Document } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";
import { EditTopicParams } from "api/forum";
import database, { models } from "database";
import { getSession } from "hooks/useAuth";
import { IEvent } from "models/Event";
import { getSubscriptions, IOrg } from "models/Org";
import { createServerError } from "utils/errors";
import { sendTopicNotifications } from "api/email";
import { equals } from "utils/string";
import { ISubscription, SubscriptionTypes } from "models/Subscription";
import { ITopicNotification } from "models/INotification";

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.EMAIL_API_KEY
  })
);

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.post<
  NextApiRequest & {
    query: { topicId: string };
    body: {
      event?: IEvent;
      orgListsNames?: string[];
      email?: string;
    };
  },
  NextApiResponse
>(async function postTopicNotif(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res
      .status(403)
      .json(createServerError(new Error("Vous devez être identifié")));
  }

  try {
    const {
      query: { topicId },
      body
    }: {
      query: { topicId: string };
      body: {
        org?: IOrg;
        event?: IEvent;
        orgListsNames?: string[];
        email?: string;
      };
    } = req;

    const topic = await models.Topic.findOne({ _id: topicId });

    if (!topic) {
      return res
        .status(404)
        .json(
          createServerError(new Error(`La discussion ${topicId} n'existe pas`))
        );
    }

    if (!equals(topic.createdBy, session.user.userId) && !session.user.isAdmin)
      return res
        .status(403)
        .json(
          createServerError(
            new Error(
              "Vous ne pouvez pas envoyer des notifications pour une discussion que vous n'avez pas créé."
            )
          )
        );

    let notifications: ITopicNotification[] = [];

    if (body.event) {
      let event = await models.Event.findOne({ _id: body.event._id });
      if (!event) return res.status(400).json("Événement introuvable");
      event = await event
        .populate({
          path: "eventSubscriptions",
          populate: { path: "user", select: "email phone userSubscription" }
        })
        .execPopulate();

      notifications = await sendTopicNotifications({
        event,
        subscriptions: event.eventSubscriptions,
        topic,
        transport
      });
    } else if (body.orgListsNames) {
      console.log(`POST /topic/${topicId}: orgListsNames`, body.orgListsNames);
      for (const orgListName of body.orgListsNames) {
        const [_, listName, orgId] = orgListName.match(/([^\.]+)\.(.+)/) || [];
        let org: (IOrg & Document<any, any, IOrg>) | null | undefined;
        org = await models.Org.findOne({ _id: orgId });
        if (!org) return res.status(400).json("Organisation introuvable");

        let subscriptions: ISubscription[] = [];

        if (["Abonnés", "Adhérents"].includes(listName)) {
          org = await org
            .populate({
              path: "orgSubscriptions",
              populate: {
                path: "user",
                select: "email userSubscription"
              }
            })
            .execPopulate();
          subscriptions = subscriptions.concat(
            getSubscriptions(
              org,
              listName === "Abonnés"
                ? SubscriptionTypes.FOLLOWER
                : SubscriptionTypes.SUBSCRIBER
            )
          );
        } else {
          org = await org
            .populate({
              path: "orgLists",
              populate: [
                {
                  path: "subscriptions",
                  populate: { path: "user", select: "email userSubscription" }
                }
              ]
            })
            .execPopulate();

          const list = org.orgLists?.find(
            (orgList) => orgList.listName === listName
          );

          if (list && list.subscriptions) subscriptions = list.subscriptions;
        }

        notifications = await sendTopicNotifications({
          org,
          subscriptions,
          topic,
          transport
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
    query: { topicId: string };
    body: EditTopicParams;
  },
  NextApiResponse
>(async function editTopic(req, res) {
  const session = await getSession({ req });

  if (!session)
    return res
      .status(403)
      .json(createServerError(new Error("Vous devez être identifié")));

  try {
    const {
      body
    }: {
      body: EditTopicParams;
    } = req;

    const topicId = req.query.topicId;
    let topic = await models.Topic.findOne({ _id: topicId });

    if (!topic)
      return res
        .status(404)
        .json(
          createServerError(new Error(`La discussion ${topicId} n'existe pas`))
        );

    if (body.topic) {
      if (body.topicMessage) {
        if (
          !equals(body.topicMessage.createdBy, session.user.userId) &&
          !session.user.isAdmin
        )
          return res
            .status(403)
            .json(
              createServerError(
                new Error(
                  "Vous ne pouvez pas modifier le message d'une autre personne."
                )
              )
            );

        topic.topicMessages = topic.topicMessages.map((topicMessage) => {
          if (!body.topicMessage) return topicMessage; // dumb ts
          if (equals(topicMessage._id, body.topicMessage._id)) {
            return {
              ...body.topicMessage,
              _id: topicMessage._id,
              createdAt: topicMessage.createdAt,
              createdBy: topicMessage.createdBy
            };
          }

          return topicMessage;
        });
        await topic.save();
      } else if (body.topic.topicMessages) {
        topic.topicMessages = body.topic.topicMessages;
        await topic.save();
      } else {
        if (
          !equals(topic.createdBy, session.user.userId) &&
          !session.user.isAdmin
        )
          return res
            .status(403)
            .json(
              createServerError(
                new Error(
                  "Vous ne pouvez pas modifier une discussion que vous n'avez pas créé."
                )
              )
            );

        const { n, nModified } = await models.Topic.updateOne(
          { _id: topicId },
          body.topic
        );

        if (nModified !== 1)
          throw new Error("La discussion n'a pas pu être modifié");
      }
    }

    res.status(200).json({});
  } catch (error) {
    res.status(500).json(createServerError(error));
  }
});

handler.delete<
  NextApiRequest & {
    query: { topicId: string };
  },
  NextApiResponse
>(async function removeTopic(req, res) {
  const session = await getSession({ req });

  if (!session)
    return res
      .status(403)
      .json(createServerError(new Error("Vous devez être identifié")));

  try {
    const topicId = req.query.topicId;
    const topic = await models.Topic.findOne({ _id: topicId });

    if (!topic)
      return res
        .status(404)
        .json(
          createServerError(new Error(`La discussion n'a pas pu être trouvée`))
        );

    if (!equals(topic.createdBy, session.user.userId) && !session.user.isAdmin)
      return res
        .status(403)
        .json(
          createServerError(
            new Error(
              "Vous ne pouvez pas supprimer une discussion que vous n'avez pas créé."
            )
          )
        );

    //#region org reference
    let nModified;

    if (topic.org) {
      console.log("deleting org reference to topic", topic.org);
      const mutation = await models.Org.updateOne(
        { _id: typeof topic.org === "object" ? topic.org._id : topic.org },
        {
          $pull: { orgTopics: topic._id }
        }
      );
      nModified = mutation.nModified;
    } else if (topic.event) {
      console.log("deleting event reference to topic", topic.event);
      const mutation = await models.Event.updateOne(
        {
          _id: typeof topic.event === "object" ? topic.event._id : topic.event
        },
        {
          $pull: { eventTopics: topic._id }
        }
      );
      nModified = mutation.nModified;
    }

    if (nModified === 1) console.log("org reference to topic deleted");
    //#endregion

    //#region subscription reference
    const subscriptions = await models.Subscription.find({});
    let count = 0;
    for (const subscription of subscriptions) {
      subscription.topics = subscription.topics.filter((topicSubscription) => {
        if (equals(topicSubscription.topic._id, topic._id)) {
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

    const { deletedCount } = await models.Topic.deleteOne({ _id: topicId });
    if (deletedCount !== 1)
      throw new Error(`La discussion n'a pas pu être supprimée`);
    res.status(200).json(topic);
  } catch (error) {
    res.status(500).json(createServerError(error));
  }
});

export default handler;
