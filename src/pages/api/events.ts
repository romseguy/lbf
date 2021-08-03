import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import {
  createServerError,
  databaseErrorCodes,
  duplicateError
} from "utils/errors";
import { getSession } from "hooks/useAuth";
import { sendToAdmin, sendToFollowers } from "utils/email";

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.EMAIL_API_KEY
  })
);

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<NextApiRequest, NextApiResponse>(async function getEvents(
  req,
  res
) {
  try {
    const events = await models.Event.find({}).sort({
      eventMinDate: "ascending"
    });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json(createServerError(error));
  }
});

handler.post<NextApiRequest, NextApiResponse>(async function postEvent(
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
      const org = await models.Org.findOne({ orgName: req.body.eventName });
      if (org) throw duplicateError;

      const user = await models.User.findOne({ userName: req.body.eventName });
      if (user) throw duplicateError;

      const event = await models.Event.create({
        ...req.body,
        eventNameLower: req.body.eventName.toLowerCase(),
        isApproved: false
      });
      await models.Org.updateMany(
        { _id: event.eventOrgs },
        {
          $push: {
            orgEvents: event._id
          }
        }
      );
      sendToFollowers(req.body, transport);
      sendToAdmin(req.body, transport);
      res.status(200).json(event);
    } catch (error) {
      if (error.code && error.code === databaseErrorCodes.DUPLICATE_KEY) {
        res.status(400).json({
          eventName: "Ce nom d'événement n'est pas disponible"
        });
      } else {
        res.status(500).json(createServerError(error));
      }
    }
  }
});

export default handler;
