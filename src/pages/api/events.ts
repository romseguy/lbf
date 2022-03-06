import { Document, Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import {
  createServerError,
  databaseErrorCodes,
  duplicateError
} from "utils/errors";
import { getSession } from "hooks/useAuth";
import { sendToAdmin } from "api/email";
import { equals, normalize } from "utils/string";
import { IEvent, EEventVisibility } from "models/Event";
import { IOrg } from "models/Org";
import api from "utils/api";
import { randomNumber } from "utils/randomNumber";
import { AddEventPayload } from "features/events/eventsApi";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<
  NextApiRequest & { query: { createdBy?: string } },
  NextApiResponse
>(async function getEvents(req, res) {
  const {
    query: { createdBy }
  } = req;
  let events;
  let selector = {};

  if (createdBy) selector = { createdBy };

  try {
    events = await models.Event.find(selector)
      .sort({
        eventMinDate: "ascending"
      })
      .populate("eventOrgs")
      .populate("createdBy", "userName");

    for (const event of events) {
      if (event.forwardedFrom?.eventId) {
        const e = await models.Event.findOne({
          _id: event.forwardedFrom?.eventId
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

handler.post<NextApiRequest & { body: AddEventPayload }, NextApiResponse>(
  async function addEvent(req, res) {
    const session = await getSession({ req });

    if (!session) {
      return res
        .status(403)
        .json(createServerError(new Error("Vous devez être identifié")));
    }

    try {
      let { body }: { body: AddEventPayload } = req;
      const eventName = body.eventName.trim();
      const eventUrl = normalize(eventName);
      let newEvent = {
        ...body,
        createdBy: session.user.userId,
        eventName,
        eventUrl
      };

      let event: (IEvent & Document<any, IEvent>) | null = null;
      let eventOrgs: IOrg[] = [];

      if (body.forwardedFrom) {
        event = await models.Event.findOne({ eventUrl: body.eventUrl });

        for (const eventOrg of body.eventOrgs) {
          const o = await models.Org.findOne({ _id: eventOrg._id }).populate(
            "orgEvents"
          );

          if (
            o &&
            !o.orgEvents.find((orgEvent) =>
              equals(orgEvent.eventUrl, body.eventUrl)
            )
          ) {
            eventOrgs.push(o);
          }
        }

        if (eventOrgs.length > 0) {
          if (event) {
            console.log(
              "event has already been forwarded => adding new eventOrgs"
            );
            event.eventOrgs = event.eventOrgs.concat(eventOrgs);
            await event.save();
          } else {
            newEvent = { ...newEvent, eventOrgs };
            event = await models.Event.create(newEvent);
          }
        }
      } else {
        event = await models.Event.findOne({ eventUrl });
        const org = await models.Org.findOne({ orgUrl: eventUrl });
        const user = await models.User.findOne({ userName: eventUrl });

        if (event || org || user) {
          const uid = randomNumber(2);
          newEvent = {
            ...newEvent,
            eventName: eventName + "-" + uid,
            eventUrl: eventUrl + "-" + uid
          };
        }

        let isApproved = session.user.isAdmin;

        for (const eventOrg of body.eventOrgs) {
          const o = await models.Org.findOne({ _id: eventOrg._id });

          if (!o) {
            console.log("POST /events: skipping unknown eventOrg");
            continue;
          } else {
            eventOrgs.push(o);

            if (o.isApproved) {
              isApproved = true;
            }
          }
        }

        console.log("POST /events: creating event with eventOrgs", eventOrgs);

        newEvent = {
          ...newEvent,
          eventOrgs,
          isApproved
        };
        event = await models.Event.create(newEvent);

        if (!isApproved) {
          const admin = await models.User.findOne({ isAdmin: true });

          if (admin && event.eventVisibility === EEventVisibility.PUBLIC) {
            sendToAdmin({ event: newEvent });

            if (admin.userSubscription)
              await api.sendPushNotification({
                subscription: admin.userSubscription,
                message: "Appuyez pour ouvrir la page de l'événement",
                title: "Un événement attend votre approbation",
                url: newEvent.eventUrl
              });
          }
        }
      }

      if (event) {
        await models.Org.updateMany(
          {
            _id: {
              $in: eventOrgs.map((eventOrg) =>
                typeof eventOrg === "object" ? eventOrg._id : eventOrg
              )
            }
          },
          {
            $push: {
              orgEvents: event._id
            }
          }
        );
      }

      res.status(200).json(event);
    } catch (error: any) {
      res.status(500).json(createServerError(error));
    }
  }
);

export default handler;
