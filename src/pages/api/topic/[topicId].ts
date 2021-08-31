import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import { createServerError } from "utils/errors";
import { getSession } from "hooks/useAuth";
import { equals } from "utils/string";
import { ITopicSubscription } from "models/Subscription";
import { ITopic } from "models/Topic";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.put<
  NextApiRequest & {
    query: { topicId: string };
    body: ITopic;
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
      const { body }: { body: ITopic } = req;
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

      if (!equals(topic.createdBy, session.user.userId)) {
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

      if (!equals(topic.createdBy, session.user.userId)) {
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

      const subscription = await models.Subscription.findOne({
        user: session.user.userId
      });

      if (subscription) {
        subscription.topics = subscription.topics.filter(
          (topicSubscription: ITopicSubscription) =>
            !equals(topicSubscription.topic, topic._id)
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
