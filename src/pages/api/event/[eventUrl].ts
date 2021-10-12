import { parseISO } from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";
import database, { models } from "database";
import { toDateRange } from "features/common";
import { getSession } from "hooks/useAuth";
import { IEvent, StatusTypes } from "models/Event";
import { hasItems } from "utils/array";
import { createEventNotifEmail, sendEventToOrgFollowers } from "utils/email";
import { createServerError } from "utils/errors";
import { equals, normalize } from "utils/string";

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.EMAIL_API_KEY
  })
);

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<
  NextApiRequest & { query: { eventUrl: string; populate?: string } },
  NextApiResponse
>(async function getEvent(req, res) {
  try {
    const session = await getSession({ req });
    const {
      query: { eventUrl }
    } = req;
    let populate: any = req.query.populate;

    let event = await models.Event.findOne({
      eventUrl
    });

    if (!event) {
      // event was forwarded
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

    event = event.populate("eventOrgs");

    const isCreator =
      session?.user.isAdmin || equals(event.createdBy, session?.user.userId);

    // creator needs subscriptions to send invites
    if (isCreator) {
      populate = {
        path: "eventOrgs",
        populate: [{ path: "orgSubscriptions" }]
      };
      event = event.populate(populate);
    }

    // if (event.eventVisibility === Visibility.SUBSCRIBERS && !isCreator) {
    //   if (session) {
    //     const sub = await models.Subscription.findOne({
    //       user: session.user.userId
    //     });

    //     let isSubscribed = false;

    //     if (sub) {
    //       for (const eventOrg of event.eventOrgs) {
    //         for (const org of sub.orgs) {
    //           if (equals(org.orgId, eventOrg)) {
    //             isSubscribed = true;
    //           }
    //         }
    //       }
    //     }

    //     if (!isSubscribed) {
    //       return res
    //         .status(403)
    //         .json(
    //           createServerError(
    //             new Error(
    //               `Cet événement est réservé aux adhérents des organisateurs`
    //             )
    //           )
    //         );
    //     }
    //   }
    // }

    // hand emails to event creator only
    let select =
      session && isCreator
        ? "-password -securityCode"
        : "-email -password -securityCode";

    event = await event
      .populate("createdBy", select + " -userImage")
      .populate("eventTopics")
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

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json(createServerError(error));
  }
});

handler.post<
  NextApiRequest & {
    query: { eventUrl: string };
    body: { orgIds: string[]; email?: string };
  },
  NextApiResponse
>(async function postEventNotif(req, res) {
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
        body: { orgIds: string[]; email?: string };
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

      if (
        !equals(event.createdBy, session.user.userId) &&
        !session.user.isAdmin
      ) {
        return res
          .status(403)
          .json(
            createServerError(
              new Error(
                "Vous ne pouvez pas envoyer des notifications pour un événement que vous n'avez pas créé."
              )
            )
          );
      }

      event = await event
        .populate({
          path: "eventOrgs",
          populate: [{ path: "orgSubscriptions" }]
        })
        .execPopulate();

      let emailList: string[] = [];

      if (
        typeof body.email === "string" &&
        body.email.length > 0 &&
        hasItems(body.orgIds)
      ) {
        const org = await models.Org.findOne({ _id: body.orgIds[0] });
        const subscription = await models.Subscription.findOne({
          email: body.email
        });

        if (body.email && org) {
          const mail = createEventNotifEmail({
            email: body.email,
            event,
            org,
            subscription,
            isPreview: true
          });

          if (process.env.NODE_ENV === "production")
            await transport.sendMail(mail);

          emailList.push(body.email);

          const newEntries = emailList.map((email) => ({
            email,
            status: StatusTypes.PENDING
          }));

          if (!event.eventNotified) {
            event.eventNotified = newEntries;
          } else if (
            !event.eventNotified.find(({ email }) => email === body.email)
          ) {
            event.eventNotified = event.eventNotified.concat(newEntries);
          }

          await event.save();
          console.log(`sent event email notif to target ${body.email}`, mail);
        }
      } else {
        emailList = await sendEventToOrgFollowers(
          event,
          body.orgIds,
          transport
        );

        if (emailList.length > 0) {
          const newEntries = emailList.map((email) => ({
            email,
            status: StatusTypes.PENDING
          }));

          event.eventNotified = event.eventNotified
            ? event.eventNotified.concat(newEntries)
            : newEntries;

          await event.save();
        }
      }

      res.status(200).json({ emailList });
    } catch (error) {
      res.status(500).json(createServerError(error));
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
  let { body }: { body: IEvent } = req;

  if (!session && !body.eventNotified) {
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

      if (!body.eventNotified && session) {
        if (
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
      }

      if (body.eventName) {
        body = { ...body, eventName: body.eventName.trim() };
        body.eventUrl = normalize(body.eventName);
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

      const { n, nModified } = await models.Event.updateOne({ eventUrl }, body);

      if (nModified === 1) {
        res.status(200).json({});
      } else {
        res
          .status(400)
          .json(
            createServerError(
              new Error(`L'événement ${eventUrl} n'a pas pu être modifié`)
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
