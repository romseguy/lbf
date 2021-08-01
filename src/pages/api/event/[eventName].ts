import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import { createServerError } from "utils/errors";
import { getSession } from "hooks/useAuth";
import type { IOrg } from "models/Org";
import { ITopic } from "models/Topic";
import { sendToEmailList } from "utils/email";

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.EMAIL_API_KEY
  })
);

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<NextApiRequest & { query: { eventName: string } }, NextApiResponse>(
  async function getEvent(req, res) {
    const eventName = decodeURIComponent(req.query.eventName);
    let eventNameLower;

    if (eventName && typeof eventName === "string") {
      eventNameLower = eventName.toLowerCase();
    }

    try {
      const event = await models.Event.findOne({
        eventNameLower
      })
        .populate({
          path: "eventTopics",
          populate: { path: "createdBy" }
        })
        .populate({
          path: "eventTopics.topicMessages",
          populate: { path: "createdBy" }
        })
        .populate("eventOrgs createdBy");

      if (event) {
        res.status(200).json(event);
      } else {
        res
          .status(404)
          .json(
            createServerError(
              new Error(`L'événement ${eventNameLower} n'a pas pu être trouvé`)
            )
          );
      }
    } catch (error) {
      res.status(500).json(createServerError(error));
    }
  }
);

handler.post<NextApiRequest, NextApiResponse>(async function postEventDetails(
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
        query: { eventName },
        body
      } = req;

      const event = await models.Event.findOne({ eventName });

      if (body.topic) {
        if (body.topic._id) {
          const eventTopic = event.eventTopics.find(
            (topic: ITopic) => topic.id === body.topic._id
          );

          for (const topicMessage of body.topic.topicMessages) {
            eventTopic.topicMessages.push(topicMessage);
          }
        } else {
          event.eventTopics.push(body.topic);
        }

        await event.save();
        res.status(200).json(event);
      } else {
        res.status(200).json(event);
      }
    } catch (error) {
      res.status(400).json(createServerError(error));
    }
  }
});

handler.put<NextApiRequest, NextApiResponse>(async function editEvent(
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
        query: { eventName }
      } = req;

      let body = req.body;

      if (typeof body.eventName === "string" && !body.eventNameLower) {
        body.eventNameLower = body.eventName.toLowerCase();
      }

      sendToEmailList(body, transport);
      const event = await models.Event.findOne({ eventName });

      const { n, nModified } = await models.Event.updateOne(
        { eventName },
        body
      );

      body.eventOrgs.forEach(async (eventOrg: IOrg) => {
        const org = await models.Org.findOne({ orgName: eventOrg.orgName });

        if (org.orgEvents.indexOf(event._id) === -1) {
          await models.Org.updateMany(
            { _id: body.eventOrgs },
            {
              $push: {
                orgEvents: event._id
              }
            }
          );
        }
      });

      if (nModified === 1) {
        res.status(200).json({});
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

handler.delete(async function removeEvent(req, res) {
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
      query: { eventName }
    } = req;

    try {
      const event = await models.Event.findOne({ eventName });
      const { deletedCount } = await models.Event.deleteOne({ eventName });

      if (deletedCount === 1) {
        res.status(200).json(event);
      } else {
        res
          .status(400)
          .json(
            createServerError(
              new Error(`L'événement ${eventName} n'a pas pu être supprimé`)
            )
          );
      }
    } catch (error) {
      res.status(500).json(createServerError(error));
    }
  }
});

export default handler;
