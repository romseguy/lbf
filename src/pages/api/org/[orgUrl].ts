import type { IOrg } from "models/Org";
import type { ITopic } from "models/Topic";
import type { IUser } from "models/User";
import { Document, Types } from "mongoose";
import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import { createServerError } from "utils/errors";
import { getSession } from "hooks/useAuth";
import { emailR, sendToTopicFollowers } from "utils/email";
import { addOrUpdateSub } from "api/shared";

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.EMAIL_API_KEY
  })
);

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<NextApiRequest & { query: { orgUrl: string } }, NextApiResponse>(
  async function getOrg(req, res) {
    const session = await getSession({ req });
    const orgUrl = req.query.orgUrl;

    try {
      let org = await models.Org.findOne({ orgUrl });

      if (!org) {
        return res
          .status(404)
          .json(
            createServerError(
              new Error(`L'organisation ${orgUrl} n'a pas pu être trouvé`)
            )
          );
      }

      // hand emails to org creator only
      let select =
        session && org.createdBy.toString() === session.user.userId
          ? "-password -securityCode"
          : "-email -password -securityCode";

      org = await org
        .populate("createdBy", "-email -password -userImage -securityCode")
        .populate("orgEvents orgSubscriptions orgTopics")
        .populate({
          path: "orgTopics",
          populate: [
            {
              path: "topicMessages",
              populate: { path: "createdBy", select }
            },
            { path: "createdBy", select }
          ]
        })
        .populate({
          path: "orgSubscriptions",
          populate: { path: "user", select }
        })
        .execPopulate();

      res.status(200).json(org);
    } catch (error) {
      res.status(500).json(createServerError(error));
    }
  }
);

handler.post<
  NextApiRequest & {
    query: { orgUrl: string };
    body: { topic?: ITopic };
  },
  NextApiResponse
>(async function postOrgDetails(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res
      .status(403)
      .json(
        createServerError(
          new Error("Vous devez être identifié pour accéder à ce contenu.")
        )
      );
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

      const { body }: { body: { topic?: ITopic } } = req;

      if (body.topic) {
        let createdBy: string;
        let topic: (ITopic & Document<any, any, any>) | null;

        if (body.topic._id) {
          if (!body.topic.topicMessages || !body.topic.topicMessages.length) {
            return res.status(200).json(org);
          }

          topic = await models.Topic.findOne({ _id: body.topic._id });

          if (!topic) {
            return res
              .status(404)
              .json(createServerError(new Error("Topic introuvable")));
          }

          createdBy = topic.createdBy.toString();

          // existing topic => adding 1 message
          const newMessage = body.topic.topicMessages[0];
          topic.topicMessages.push(newMessage);
          await topic.save();

          // get subscriptions of users other than new message poster
          const subscriptions = await models.Subscription.find({
            "topics.topic": Types.ObjectId(topic._id),
            user: { $ne: newMessage.createdBy }
          }).populate("user");

          sendToTopicFollowers(org, subscriptions, topic, transport);
        } else {
          // new topic
          topic = await models.Topic.create(body.topic);
          createdBy = topic.createdBy.toString();
          org.orgTopics.push(topic);
          await org.save();
        }

        await addOrUpdateSub(createdBy, topic);
      }

      res.status(200).json(org);
    } catch (error) {
      res.status(400).json(createServerError(error));
    }
  }
});

handler.put<
  NextApiRequest & {
    query: { orgUrl: string };
    body: IOrg;
  },
  NextApiResponse
>(async function editOrg(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res
      .status(403)
      .json(
        createServerError(
          new Error("Vous devez être identifié pour accéder à ce contenu.")
        )
      );
  } else {
    try {
      const { body }: { body: IOrg } = req;
      const orgUrl = decodeURIComponent(req.query.orgUrl);
      body.orgNameLower = body.orgName.toLowerCase();
      body.orgUrl = body.orgName
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");

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

      if (org.createdBy.toString() !== session.user.userId) {
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

      const { n, nModified } = await models.Org.updateOne({ orgUrl }, body);

      if (nModified === 1) {
        res.status(200).json({});
      } else {
        res
          .status(400)
          .json(
            createServerError(
              new Error(`L'organisation ${orgUrl} n'a pas pu être modifiée`)
            )
          );
      }
    } catch (error) {
      res.status(400).json(createServerError(error));
    }
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
      .json(
        createServerError(
          new Error("Vous devez être identifié pour accéder à ce contenu.")
        )
      );
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

      if (org.createdBy.toString() !== session.user.userId) {
        return res
          .status(403)
          .json(
            createServerError(
              new Error(
                "Vous ne pouvez pas supprimer un organisation que vous n'avez pas créé."
              )
            )
          );
      }

      const { deletedCount } = await models.Org.deleteOne({ orgUrl });

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
