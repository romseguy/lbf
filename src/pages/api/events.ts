import { Document } from "mongoose";
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
import { sendToAdmin, sendEventToOrgFollowers } from "utils/email";
import { equals, normalize } from "utils/string";
import { IEvent, Visibility } from "models/Event";
import { IOrg } from "models/Org";
import api from "utils/api";

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.EMAIL_API_KEY
  })
);

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<
  NextApiRequest & {
    query: { populate?: string };
  },
  NextApiResponse
>(async function getEvents(req, res) {
  try {
    const {
      query: { populate }
    } = req;

    let events;

    if (populate) {
      events = await models.Event.find({})
        .sort({
          eventMinDate: "ascending"
        })
        .populate(populate)
        .populate("createdBy", "userName");
    } else {
      events = await models.Event.find({}).sort({
        eventMinDate: "ascending"
      });
    }

    for (const event of events) {
      if (event.forwardedFrom.eventId) {
        const e = await models.Event.findOne({
          _id: event.forwardedFrom.eventId
        });
        if (e) {
          event.eventName = e.eventName;
          event.eventUrl = e.eventUrl;
        }
      }
    }

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
          new Error("Vous devez être identifié pour accéder à ce contenu")
        )
      );
  } else {
    try {
      const { body }: { body: IEvent } = req;
      const eventUrl = normalize(body.eventName);

      let event: (IEvent & Document<any, any, any>) | null;
      let eventOrgs: IOrg[] = body.eventOrgs;

      if (body.forwardedFrom) {
        event = await models.Event.findOne({ eventUrl });

        for (const eventOrg of body.eventOrgs) {
          const o = await models.Org.findOne({ _id: eventOrg._id }).populate(
            "orgEvents"
          );

          if (o) {
            if (
              !o.orgEvents.find((orgEvent) =>
                equals(orgEvent.eventUrl, eventUrl)
              )
            ) {
              eventOrgs.push(o._id);
            }
          }
        }

        if (eventOrgs.length > 0) {
          if (event) {
            console.log(
              "event has been forwarded once, update it with new orgs"
            );
          } else {
            event = await models.Event.create({ ...body, eventUrl, eventOrgs });
          }
        }
      } else {
        event = await models.Event.findOne({ eventUrl });
        if (event) throw duplicateError;
        const org = await models.Org.findOne({ orgUrl: eventUrl });
        if (org) throw duplicateError;
        const user = await models.User.findOne({ userName: body.eventName });
        if (user) throw duplicateError;

        let isApproved = false;
        for (const eventOrg of body.eventOrgs) {
          const o = await models.Org.findOne({ _id: eventOrg._id });
          if (o && o.isApproved) isApproved = true;
        }

        event = await models.Event.create({
          ...body,
          eventUrl,
          isApproved
        });

        if (!isApproved) {
          const admin = await models.User.findOne({ isAdmin: true });

          if (
            admin &&
            admin.userSubscription &&
            event.eventVisibility === Visibility.PUBLIC
          ) {
            await api.post("notification", {
              subscription: admin.userSubscription,
              notification: {
                title: "Un événement attend votre approbation",
                message: "Appuyez pour ouvrir la page de l'événement",
                url: `${process.env.NEXT_PUBLIC_URL}/${event.eventUrl}`
              }
            });
            sendToAdmin({ event: body, transport });
          }
        }
      }

      await models.Org.updateMany(
        { _id: eventOrgs },
        {
          $push: {
            orgEvents: event?._id
          }
        }
      );

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
