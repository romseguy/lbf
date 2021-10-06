import { addOrUpdateTopic } from "api";
import database, { models } from "database";
import { getSession } from "hooks/useAuth.test";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { ITopic } from "models/Topic";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";
import { createServerError } from "utils/errors";

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.EMAIL_API_KEY
  })
);

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.post<NextApiRequest, NextApiResponse>(async function postTopic(
  req,
  res
) {
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
      const {
        body
      }: {
        body: {
          topic: ITopic;
          topicNotif?: boolean;
          event?: IEvent;
          org?: IOrg;
        };
      } = req;
      let event = null;
      let org = null;

      if (body.event) {
        event = await models.Event.findOne({ _id: body.event._id });
      } else if (body.org) {
        org = await models.Org.findOne({ _id: body.org._id });
      }

      const topic = await addOrUpdateTopic({
        body,
        event,
        org,
        transport,
        res
      });

      res.status(200).json(topic);
    } catch (error: any) {
      res.status(500).json(createServerError(error));
    }
  }
});

export default handler;
