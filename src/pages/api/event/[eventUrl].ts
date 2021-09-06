import type { Document } from "mongoose";
import { IEvent, StatusTypes, Visibility } from "models/Event";
import type { ITopic } from "models/Topic";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import { createServerError } from "utils/errors";
import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";
import { getSession } from "hooks/useAuth";
import { sendEventToOrgFollowers } from "utils/email";
import { equals, normalize } from "utils/string";
import { addOrUpdateTopic } from "api";

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.EMAIL_API_KEY
  })
);

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<NextApiRequest & { query: { eventUrl: string } }, NextApiResponse>(
  async function getEvent(req, res) {
    try {
      const session = await getSession({ req });
      const {
        query: { eventUrl }
      } = req;

      let event = await models.Event.findOne({
        eventUrl
      });

      if (!event) {
        event = await models.Event.findOne({
          _id: eventUrl
        });

        if (!event)
          return res
            .status(404)
            .json(
              createServerError(
                new Error(`L'événement ${eventUrl} n'a pas pu être trouvé`)
              )
            );
      }

      const isCreator = equals(event.createdBy, session?.user.userId);

      if (event.eventVisibility === Visibility.SUBSCRIBERS && !isCreator) {
        if (session) {
          const sub = await models.Subscription.findOne({
            user: session.user.userId
          });

          let isSubscribed = false;

          if (sub) {
            for (const eventOrg of event.eventOrgs) {
              for (const org of sub.orgs) {
                if (equals(org.orgId, eventOrg)) {
                  isSubscribed = true;
                }
              }
            }
          }

          if (!isSubscribed) {
            return res
              .status(403)
              .json(
                createServerError(
                  new Error(
                    `Cet événement est réservé aux adhérents des organisateurs`
                  )
                )
              );
          }
        }
      }

      // hand emails to event creator only
      let select =
        session && isCreator
          ? "-password -securityCode"
          : "-email -password -securityCode";

      event = await event
        .populate("createdBy", select + " -userImage")
        .populate("eventOrgs eventTopics")
        .populate({
          path: "eventTopics",
          populate: [
            {
              path: "topicMessages",
              populate: {
                path: "createdBy",
                select
              }
            },
            { path: "createdBy", select: select + " -userImage" }
          ]
        })
        .execPopulate();

      if (event) {
        res.status(200).json(event);
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
          new Error("Vous devez être identifié pour accéder à ce contenu")
        )
      );
  } else {
    try {
      const {
        query: { eventUrl },
        body
      }: {
        query: { eventUrl: string };
        body: { topic?: ITopic; event?: IEvent };
      } = req;

      let event = await models.Event.findOne({ eventUrl });

      if (!event) {
        event = await models.Event.findOne({ _id: eventUrl });

        if (!event)
          return res
            .status(404)
            .json(
              createServerError(
                new Error(`L'événement ${eventUrl} n'a pas pu être trouvé`)
              )
            );
      }

      if (body.topic) {
        const topic = await addOrUpdateTopic({ body, event, transport, res });
        res.status(200).json(topic);
      } else if (body.event) {
        // todo: check we're not reposting to already existing eventOrg?
        event = await event.populate("eventOrgs").execPopulate();
        event.eventNotif = body.event.eventNotif;

        if (event.forwardedFrom) {
          const e = await models.Event.findOne({
            _id: event.forwardedFrom.eventId
          });
          if (e) {
            event.forwardedFrom.eventUrl = event.eventUrl;
            event.eventName = e.eventName;
            event.eventUrl = e.eventUrl;
          }
        }

        const emailList = await sendEventToOrgFollowers(event, transport);

        const { n, nModified } = await models.Event.updateOne(
          {
            eventUrl: event.forwardedFrom.eventUrl || event.eventUrl
          },
          {
            eventNotified: event.eventNotified.concat(
              emailList.map((email) => ({
                email,
                status: StatusTypes.PENDING
              }))
            )
          }
        );

        if (nModified === 1) {
          res.status(200).json({ emailList });
        } else {
          res
            .status(400)
            .json(
              createServerError(
                new Error("L'événement n'a pas pu être modifié")
              )
            );
        }
      }
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
          new Error("Vous devez être identifié pour accéder à ce contenu")
        )
      );
  } else {
    try {
      const { body }: { body: IEvent } = req;
      const eventUrl = req.query.eventUrl;

      if (body.eventName) body.eventUrl = normalize(body.eventName);

      const event = await models.Event.findOne({ eventUrl }).populate(
        "eventOrgs"
      );

      if (!event) {
        return res
          .status(404)
          .json(
            createServerError(
              new Error(`L'événement ${eventUrl} n'a pas pu être trouvé`)
            )
          );
      }

      if (
        !body.eventNotified &&
        !equals(event.createdBy, session.user.userId) &&
        !session.user.isAdmin
      ) {
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

      if (body.eventOrgs) {
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
      }

      event.eventNotif = body.eventNotif || [];
      const emailList = await sendEventToOrgFollowers(event, transport);

      let eventNotified;

      if (body.eventNotified) {
        eventNotified = body.eventNotified;
      } else if (emailList.length > 0) {
        eventNotified = event.eventNotified.concat(
          emailList.map((email) => ({
            email,
            status: StatusTypes.PENDING
          }))
        );
      }

      const { n, nModified } = await models.Event.updateOne(
        { eventUrl },
        {
          ...body,
          eventNotified
        }
      );

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
          new Error("Vous devez être identifié pour accéder à ce contenu")
        )
      );
  } else {
    try {
      const eventUrl = req.query.eventUrl;
      let event = await models.Event.findOne({ eventUrl });

      if (!event) {
        event = await models.Event.findOne({ _id: eventUrl });

        if (!event) {
          return res
            .status(404)
            .json(
              createServerError(
                new Error(`L'événement ${eventUrl} n'a pas pu être trouvé`)
              )
            );
        }
      }

      if (
        !equals(event.createdBy, session.user.userId) &&
        !session.user.isAdmin
      ) {
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
      const deleteOrgRef = async () => {
        if (event && event.eventOrgs) {
          for (const eventOrg of event.eventOrgs) {
            const o = await models.Org.findOne({ _id: eventOrg });

            if (o) {
              o.orgEvents = o.orgEvents.filter(
                (orgEvent) => !equals(orgEvent, event?._id)
              );
              o.save();
            }
          }
        }
      };

      if (deletedCount === 1) {
        await deleteOrgRef();
        res.status(200).json(event);
      } else {
        if (
          (await models.Event.deleteOne({ _id: eventUrl })).deletedCount === 1
        ) {
          await deleteOrgRef();
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
      }
    } catch (error) {
      res.status(500).json(createServerError(error));
    }
  }
});

export default handler;
