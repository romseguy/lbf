import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";
import database, { models } from "database";
import { getSession } from "hooks/useAuth";
import { IEvent } from "models/Event";
import { getSubscriptions, IOrg } from "models/Org";
import { ITopic } from "models/Topic";
import { createServerError } from "utils/errors";
import { sendTopicNotifications } from "api/email";
import { equals, logJson } from "utils/string";
import { ISubscription, SubscriptionTypes } from "models/Subscription";
import { hasItems } from "utils/array";
import { ITopicMessage } from "models/TopicMessage";

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
      org?: IOrg;
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
      .json(
        createServerError(
          new Error("Vous devez être identifié pour accéder à ce contenu")
        )
      );
  }

  try {
    const {
      body
    }: {
      body: {
        org?: IOrg;
        event?: IEvent;
        orgListsNames?: string[];
        email?: string;
      };
    } = req;
    const topicId = req.query.topicId;
    const topic = await models.Topic.findOne({ _id: topicId });

    if (!topic) {
      return res
        .status(404)
        .json(
          createServerError(new Error(`La discussion ${topicId} n'existe pas`))
        );
    }

    if (
      !equals(topic.createdBy, session.user.userId) &&
      !session.user.isAdmin
    ) {
      return res
        .status(403)
        .json(
          createServerError(
            new Error(
              "Vous ne pouvez pas envoyer des notifications pour une discussion que vous n'avez pas créé."
            )
          )
        );
    }

    let emailList: string[] = [];

    if (body.event) {
      emailList = await sendTopicNotifications({
        event: body.event,
        subscriptions: body.event.eventSubscriptions,
        topic,
        transport
      });
    } else if (body.org && body.orgListsNames) {
      console.log(`POST /topic/${topicId}: orgListsNames`, body.orgListsNames);
      const org = body.org;

      let subscriptions = (org.orgLists || [])
        .filter((orgList) =>
          topic.topicVisibility?.find(
            (listName) =>
              listName === orgList.listName &&
              Array.isArray(orgList.subscriptions) &&
              orgList.subscriptions.length > 0
          )
        )
        .flatMap(({ subscriptions }) => subscriptions) as ISubscription[];

      for (const orgListName of body.orgListsNames) {
        const [_, listName, orgId] = orgListName.match(/([^\.]+)\.(.+)/) || [];

        if (["Abonnés", "Adhérents"].includes(listName))
          subscriptions = subscriptions.concat(
            getSubscriptions(
              org,
              listName === "Abonnés"
                ? SubscriptionTypes.FOLLOWER
                : SubscriptionTypes.SUBSCRIBER
            )
          );
      }

      if (Array.isArray(subscriptions) && subscriptions.length > 0) {
        emailList = await sendTopicNotifications({
          org: body.org,
          subscriptions,
          topic,
          transport
        });
      }
    }

    const topicNotified = emailList.map((email) => ({ email }));

    if (topic.topicNotified) {
      topic.topicNotified = topic.topicNotified.concat(topicNotified);
    } else {
      topic.topicNotified = topicNotified;
    }

    await topic.save();

    res.status(200).json({ emailList });
  } catch (error) {
    res.status(500).json(createServerError(error));
  }
});

handler.put<
  NextApiRequest & {
    query: { topicId: string };
    body: { topic: ITopic; topicMessage: ITopicMessage; topicNotif?: boolean };
  },
  NextApiResponse
>(async function editTopic(req, res) {
  const session = await getSession({ req });

  if (!session)
    return res
      .status(403)
      .json(
        createServerError(
          new Error("Vous devez être identifié pour accéder à ce contenu")
        )
      );

  try {
    const {
      body
    }: {
      body: {
        topic: ITopic;
        topicMessage: ITopicMessage;
        topicNotif?: boolean;
      };
    } = req;

    const topicId = req.query.topicId;
    const topic = await models.Topic.findOne({ _id: topicId });

    if (!topic)
      return res
        .status(404)
        .json(
          createServerError(new Error(`La discussion ${topicId} n'existe pas`))
        );

    let update: Partial<ITopic> | undefined;

    if (body.topic) {
      if (body.topicMessage) {
        update = {
          topicMessages: topic.topicMessages.map((topicMessage) => {
            if (equals(topicMessage._id, body.topicMessage._id)) {
              return {
                ...body.topicMessage,
                _id: topicMessage._id,
                createdAt: topicMessage.createdAt,
                createdBy: topicMessage.createdBy
              };
            }
            return topicMessage;
          })
        };
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

        update = {
          ...body.topic
        };
      }
    }

    logJson(`PUT /topic/${topicId}: update`, update);

    if (update) {
      const { n, nModified } = await models.Topic.updateOne(
        { _id: topicId },
        update
      );

      if (nModified !== 1)
        return res
          .status(400)
          .json(
            createServerError(
              new Error("La discussion n'a pas pu être modifié")
            )
          );
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

  if (!session) {
    res
      .status(403)
      .json(
        createServerError(
          new Error("Vous devez être identifié pour accéder à ce contenu")
        )
      );
  } else {
    try {
      const topicId = req.query.topicId;
      const topic = await models.Topic.findOne({ _id: topicId });

      if (!topic) {
        return res
          .status(404)
          .json(
            createServerError(
              new Error(`La discussion n'a pas pu être trouvée`)
            )
          );
      }

      if (
        !equals(topic.createdBy, session.user.userId) &&
        !session.user.isAdmin
      ) {
        return res
          .status(403)
          .json(
            createServerError(
              new Error(
                "Vous ne pouvez pas supprimer une discussion que vous n'avez pas créé."
              )
            )
          );
      }

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
        subscription.topics = subscription.topics.filter(
          (topicSubscription) => {
            if (equals(topicSubscription.topic._id, topic._id)) {
              count++;
              return false;
            }
            return true;
          }
        );
        await subscription.save();
      }
      if (count > 0)
        console.log(count + " subscriptions references to topic deleted");

      //#endregion

      const { deletedCount } = await models.Topic.deleteOne({ _id: topicId });

      if (deletedCount === 1) {
        res.status(200).json(topic);
      } else {
        res
          .status(400)
          .json(
            createServerError(
              new Error(`La discussion n'a pas pu être supprimée`)
            )
          );
      }
    } catch (error) {
      res.status(500).json(createServerError(error));
    }
  }
});

export default handler;
