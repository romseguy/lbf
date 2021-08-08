import type { IEvent } from "models/Event";
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
import { sendToFollowers, sendToTopicFollowers } from "utils/email";
import { addOrUpdateSub } from "api/shared";

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.EMAIL_API_KEY
  })
);

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<NextApiRequest & { query: { eventUrl: string } }, NextApiResponse>(
  async function getEvent(req, res) {
    const eventUrl = req.query.eventUrl;

    try {
      const event = await models.Event.findOne({
        eventUrl
      })
        .populate("createdBy", "-email -password -securityCode -userImage")
        .populate("eventOrgs eventTopics")
        .populate({
          path: "eventTopics",
          populate: [
            {
              path: "topicMessages",
              populate: {
                path: "createdBy",
                select: "-email -password -securityCode"
              }
            },
            { path: "createdBy", select: "-email -password -securityCode" }
          ]
        });

      if (event) {
        res.status(200).json(event);
      } else {
        res
          .status(404)
          .json(
            createServerError(
              new Error(`L'événement ${eventUrl} n'a pas pu être trouvé`)
            )
          );
      }
    } catch (error) {
      res.status(500).json(createServerError(error));
    }
  }
);

handler.post<
  NextApiRequest & {
    query: { eventUrl: string };
    body: { topic?: ITopic };
  },
  NextApiResponse
>(async function postEventDetails(req, res) {
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
      const eventUrl = req.query.eventUrl;

      const event = await models.Event.findOne({ eventUrl });

      if (!event) {
        return res
          .status(404)
          .json(
            createServerError(
              new Error(`L'événement ${eventUrl} n'a pas pu être trouvé`)
            )
          );
      }

      const { body }: { body: { topic?: ITopic } } = req;

      if (body.topic) {
        let createdBy: string;
        let topic: (ITopic & Document<any, any, any>) | null;

        if (body.topic._id) {
          if (!body.topic.topicMessages || !body.topic.topicMessages.length) {
            return res.status(200).json(event);
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

          sendToTopicFollowers(event, subscriptions, topic, transport);
        } else {
          // new topic
          topic = await models.Topic.create(body.topic);
          createdBy = topic.createdBy.toString();
          event.eventTopics.push(topic);
          await event.save();
        }

        await addOrUpdateSub(createdBy, topic);
      }

      res.status(200).json(event);
    } catch (error) {
      res.status(400).json(createServerError(error));
    }
  }
});

handler.put<
  NextApiRequest & {
    query: { eventUrl: string };
    body: IEvent;
  },
  NextApiResponse
>(async function editEvent(req, res) {
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
      const { body }: { body: IEvent } = req;
      const eventUrl = req.query.eventUrl;
      body.eventNameLower = body.eventName.toLowerCase();
      body.eventUrl = body.eventName
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");

      const event = await models.Event.findOne({ eventUrl });

      if (!event) {
        return res
          .status(404)
          .json(
            createServerError(
              new Error(`L'événement ${eventUrl} n'a pas pu être trouvé`)
            )
          );
      }

      if (event.createdBy.toString() !== session.user.userId) {
        return res
          .status(403)
          .json(
            createServerError(
              new Error(
                "Vous ne pouvez pas modifier un événement que vous n'avez pas créé."
              )
            )
          );
      }

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

      const emailList = await sendToFollowers(body, transport);

      const { n, nModified } = await models.Event.updateOne({ eventUrl }, body);

      if (nModified === 1) {
        res.status(200).json({ emailList });
      } else {
        res
          .status(400)
          .json(
            createServerError(new Error("L'événement n'a pas pu être modifié"))
          );
      }
    } catch (error) {
      res.status(500).json(createServerError(error));
    }
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
    res
      .status(403)
      .json(
        createServerError(
          new Error("Vous devez être identifié pour accéder à ce contenu.")
        )
      );
  } else {
    try {
      const eventUrl = decodeURIComponent(req.query.eventUrl);
      const event = await models.Event.findOne({ eventUrl });

      if (!event) {
        return res
          .status(404)
          .json(
            createServerError(
              new Error(`L'événement ${eventUrl} n'a pas pu être trouvé`)
            )
          );
      }

      if (event.createdBy.toString() !== session.user.userId) {
        return res
          .status(403)
          .json(
            createServerError(
              new Error(
                "Vous ne pouvez pas supprimer un événement que vous n'avez pas créé."
              )
            )
          );
      }

      const { deletedCount } = await models.Event.deleteOne({ eventUrl });

      if (deletedCount === 1) {
        res.status(200).json(event);
      } else {
        res
          .status(400)
          .json(
            createServerError(
              new Error(`L'événement ${eventUrl} n'a pas pu être supprimé`)
            )
          );
      }
    } catch (error) {
      res.status(500).json(createServerError(error));
    }
  }
});

export default handler;
