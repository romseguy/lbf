import type { ITopic } from "models/Topic";
import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import { createServerError } from "utils/errors";
import { getSession } from "hooks/useAuth";
import { emailR } from "utils/email";
import mongoose from "mongoose";

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.EMAIL_API_KEY
  })
);

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<NextApiRequest, NextApiResponse>(async function getOrg(req, res) {
  const query: { orgName?: string | string[] } = req.query;
  let orgNameLower;

  if (query.orgName && typeof query.orgName === "string") {
    orgNameLower = query.orgName.toLowerCase();
  }

  try {
    const org = await models.Org.findOne({ orgNameLower })
      .populate("createdBy", "-email -password -userImage")
      .populate("orgEvents orgSubscriptions orgTopics")
      .populate({
        path: "orgTopics",
        populate: [
          {
            path: "topicMessages",
            populate: { path: "createdBy", select: "-email -password" }
          },
          { path: "createdBy", select: "-email -password" }
        ]
      })
      .populate({
        path: "orgSubscriptions",
        populate: { path: "user", select: "-email -password" }
      });

    if (org) {
      res.status(200).json(org);
    } else {
      res
        .status(404)
        .json(
          createServerError(new Error("Le document n'a pas pu être trouvé"))
        );
    }
  } catch (error) {
    res.status(400).json(createServerError(error));
  }
});

handler.post<NextApiRequest, NextApiResponse>(async function postOrgDetails(
  req,
  res
) {
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
      const {
        query: { orgName },
        body
      } = req;

      const org = await models.Org.findOne({ orgName });

      if (!org) {
        return res
          .status(404)
          .json(createServerError(new Error("Organisation introuvable")));
      }

      const addOrUpdateSub = async (userId: string, topic: ITopic) => {
        if (!userId) return;

        const user = await models.User.findOne({ _id: userId });

        if (!user) return;

        let subscription = await models.Subscription.findOne({ user });

        if (!subscription) {
          subscription = await models.Subscription.create({
            user,
            topics: [{ topic }]
          });
        } else {
          let topicSubscription = subscription.topics.find(
            (topic: ITopic) => topic._id === body.topic._id
          );

          if (!topicSubscription) {
            console.log("no sub for this topic");
            subscription.topics.push({ topic });
            await subscription.save();
          }
        }
      };

      if (body.topic) {
        let createdBy;
        let topic = body.topic;

        if (body.topic._id) {
          if (!body.topic.topicMessages || !body.topic.topicMessages.length) {
            return res.status(200).json(org);
          }

          topic = await models.Topic.findOne({ _id: topic._id });

          if (!topic) {
            if (!org) {
              return res
                .status(404)
                .json(createServerError(new Error("Topic introuvable")));
            }
          }

          // existing topic => adding 1 message
          const newMessage = body.topic.topicMessages[0];

          // get subscriptions of users other than poster
          const subscriptions = await models.Subscription.find({
            "topics.topic": mongoose.Types.ObjectId(topic._id),
            user: { $ne: newMessage.createdBy }
          }).populate("user");

          const subject = `Nouveau commentaire sur la discussion : ${topic.topicName}`;

          for (const subscription of subscriptions) {
            let url = `${process.env.NEXTAUTH_URL}/${org.orgName}`;
            let html = `<h1>${subject}</h1><p>Rendez-vous sur la page de <a href="${url}">${org.orgName}</a> pour lire la discussion.</p>`;

            if (org.orgName === "aucourant") {
              url = `${process.env.NEXTAUTH_URL}/forum`;
              html = `<h1>${subject}</h1><p>Rendez-vous sur le forum de <a href="${url}">${process.env.NEXT_PUBLIC_SHORT_URL}</a> pour lire la discussion.</p>`;
            }

            const mail = {
              from: process.env.EMAIL_FROM,
              to: `<${subscription.user.email}>`,
              subject,
              html
            };

            if (process.env.NODE_ENV === "production")
              await transport.sendMail(mail);
            else if (process.env.NODE_ENV === "development")
              console.log("mail", mail);
          }

          topic.topicMessages.push(newMessage);
          await topic.save();
        } else {
          // new topic
          topic = await models.Topic.create(body.topic);
          createdBy = topic.createdBy;
          org.orgTopics.push(topic);
          await org.save();
        }

        addOrUpdateSub(createdBy, topic);
      }

      res.status(200).json(org);
    } catch (error) {
      res.status(400).json(createServerError(error));
    }
  }
});

handler.put<NextApiRequest, NextApiResponse>(async function editOrg(req, res) {
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
      const {
        query: { orgName }
      } = req;

      let body = req.body;

      if (typeof body.orgName === "string" && !body.orgNameLower) {
        body.orgNameLower = body.orgName.toLowerCase();
      }

      const { n, nModified } = await models.Org.updateOne({ orgName }, body);

      if (nModified === 1) {
        res.status(200).json({});
      } else {
        res
          .status(400)
          .json(
            createServerError(
              new Error(`L'organisation ${orgName} n'a pas pu être modifiée`)
            )
          );
      }
    } catch (error) {
      res.status(400).json(createServerError(error));
    }
  }
});

handler.delete(async function removeOrg(req, res) {
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
    const {
      query: { orgName }
    } = req;

    try {
      const org = await models.Org.findOne({ orgName });
      const { deletedCount } = await models.Org.deleteOne({ orgName });

      if (deletedCount === 1) {
        res.status(200).json(org);
      } else {
        res
          .status(400)
          .json(
            createServerError(
              new Error(`L'organisation ${orgName} n'a pas pu être supprimé`)
            )
          );
      }
    } catch (error) {
      res.status(500).json(createServerError(error));
    }
  }
});

export default handler;
