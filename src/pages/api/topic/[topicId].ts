import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";
import database, { models } from "database";
import { getSession } from "hooks/useAuth";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { ITopic } from "models/Topic";
import { createServerError } from "utils/errors";
import { sendTopicToFollowers } from "utils/email";
import { equals } from "utils/string";

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
    const { body }: { body: { org?: IOrg; event?: IEvent } } = req;
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
      // getting subscriptions of users subscribed to this event
      const subscriptions = await models.Subscription.find({
        "events.event": Types.ObjectId(body.event._id)
      }).populate("user");

      emailList = await sendTopicToFollowers({
        event: body.event,
        subscriptions,
        topic,
        transport
      });
    } else if (body.org) {
      // getting subscriptions of users subscribed to this org
      const subscriptions = await models.Subscription.find({
        "orgs.org": Types.ObjectId(body.org._id)
      }).populate("user");

      emailList = await sendTopicToFollowers({
        org: body.org,
        subscriptions,
        topic,
        transport
      });
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
    body: ITopic & { topicNotif?: boolean };
  },
  NextApiResponse
>(async function editTopic(req, res) {
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
      const { body }: { body: ITopic & { topicNotif?: boolean } } = req;
      const topicId = req.query.topicId;
      const topic = await models.Topic.findOne({ _id: topicId });

      if (!topic) {
        return res
          .status(404)
          .json(
            createServerError(
              new Error(`La discussion ${topicId} n'existe pas`)
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
                "Vous ne pouvez pas modifier une discussion que vous n'avez pas créé."
              )
            )
          );
      }

      const { n, nModified } = await models.Topic.updateOne(
        { _id: topicId },
        body
      );

      if (nModified === 1) {
        res.status(200).json({});
      } else {
        res
          .status(400)
          .json(
            createServerError(
              new Error("La discussion n'a pas pu être modifié")
            )
          );
      }
    } catch (error) {
      res.status(500).json(createServerError(error));
    }
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

      if (topic.org) {
        await models.Org.updateOne(
          { _id: topic.org },
          {
            $pull: { orgTopics: topic._id }
          }
        );
      } else if (topic.event) {
        await models.Event.updateOne(
          { _id: topic.event },
          {
            $pull: { eventTopics: topic._id }
          }
        );
      }

      const subscriptions = await models.Subscription.find({});

      for (const subscription of subscriptions) {
        subscription.topics = subscription.topics.filter(
          (topicSubscription) => !equals(topicSubscription.topic._id, topic._id)
        );
        await subscription.save();
      }

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
