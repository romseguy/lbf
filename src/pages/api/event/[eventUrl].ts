import { Document } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";
import database, { models } from "database";
import { getSession } from "hooks/useAuth";
import { IEvent, StatusTypes } from "models/Event";
import { getSubscriptions, IOrg } from "models/Org";
import { ISubscription, SubscriptionTypes } from "models/Subscription";
import { hasItems } from "utils/array";
import { createEventEmailNotif } from "utils/email";
import { createServerError } from "utils/errors";
import { equals, log, normalize } from "utils/string";

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
      // maybe event was forwarded
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
    const select =
      session && isCreator
        ? "-password -securityCode"
        : "-email -password -securityCode";

    if (isCreator) {
      event = event.populate({
        path: "eventOrgs",
        populate: [
          {
            path: "orgLists",
            populate: {
              path: "subscriptions",
              populate: { path: "user", select }
            }
          },
          {
            path: "orgSubscriptions",
            populate: {
              path: "user",
              select
            }
          }
        ]
      });
    }

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
    body: { orgListsNames?: string[]; email?: string };
  },
  NextApiResponse
>(async function postEventNotif(req, res) {
  const session = await getSession({ req });

  if (!session)
    return res
      .status(403)
      .json(
        createServerError(
          new Error("Vous devez être identifié pour accéder à ce contenu")
        )
      );

  try {
    const {
      query: { eventUrl },
      body
    }: {
      query: { eventUrl: string };
      body: { orgListsNames?: string[]; email?: string };
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

    if (!equals(event.createdBy, session.user.userId) && !session.user.isAdmin)
      return res
        .status(403)
        .json(
          createServerError(
            new Error(
              "Vous ne pouvez pas envoyer des notifications pour un événement que vous n'avez pas créé"
            )
          )
        );

    if (!event.isApproved)
      return res
        .status(403)
        .json(
          createServerError(
            new Error(
              "Vous ne pouvez pas envoyer des notifications pour un événement qui n'est pas approuvé"
            )
          )
        );

    event = await event.populate("eventOrgs").execPopulate();

    let emailList: string[] = [];

    if (typeof body.email === "string" && body.email.length > 0) {
      const subscription = await models.Subscription.findOne({
        email: body.email
      });

      const mail = createEventEmailNotif({
        email: body.email,
        event,
        org: event.eventOrgs[0],
        subscription,
        isPreview: true
      });

      if (process.env.NODE_ENV === "production") await transport.sendMail(mail);
      else console.log(`sent event invite to ${body.email}`, mail);

      if (body.email !== session.user.email) {
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
      }

      emailList.push(body.email);
    } else if (body.orgListsNames) {
      for (const orgListName of body.orgListsNames) {
        const [_, listName, orgId] = orgListName.match(/([^\.]+)\.(.+)/) || [];
        let org: (IOrg & Document<any, any, IOrg>) | null | undefined;
        org = await models.Org.findOne({ _id: orgId });

        if (!org) return res.status(400).json("Organisation introuvable");

        let subscriptions: ISubscription[] = [];

        if (listName === "Abonnés") {
          org = await org
            .populate({
              path: "orgSubscriptions",
              populate: {
                path: "user"
              }
            })
            .execPopulate();

          subscriptions = [
            ...subscriptions,
            ...getSubscriptions(org, SubscriptionTypes.FOLLOWER)
          ];
        } else if (listName === "Adhérents") {
          org = await org
            .populate({
              path: "orgSubscriptions",
              populate: {
                path: "user"
              }
            })
            .execPopulate();
          subscriptions = [
            ...subscriptions,
            ...getSubscriptions(org, SubscriptionTypes.SUBSCRIBER)
          ];
        } else {
          org = await org
            .populate({
              path: "orgLists",
              populate: [{ path: "subscriptions", populate: { path: "user" } }]
            })
            .execPopulate();

          const list = org.orgLists?.find(
            (orgList) => orgList.listName === listName
          );

          if (list && list.subscriptions)
            subscriptions = [...subscriptions, ...list.subscriptions];
        }

        if (hasItems(subscriptions)) {
          log(`POST /event/${eventUrl}: subscriptions`, subscriptions);

          for (const subscription of subscriptions) {
            const email =
              subscription.email ||
              (typeof subscription.user === "object"
                ? subscription.user.email
                : "");

            const mail = createEventEmailNotif({
              email,
              event,
              org,
              subscription
            });

            if (process.env.NODE_ENV === "production")
              await transport.sendMail(mail);
            else console.log(`sent event invite to ${email}`, mail);

            emailList.push(email);
          }
        }
      }
    }

    if (emailList.length > 0) {
      event.eventNotified = [
        ...(event.eventNotified || []),
        ...emailList.map((email) => ({
          email,
          status: StatusTypes.PENDING
        }))
      ];
      await event.save();
    }

    res.status(200).json({ emailList });
  } catch (error) {
    res.status(500).json(createServerError(error));
  }
});

handler.put<
  NextApiRequest & {
    query: { eventUrl: string };
    body: Partial<IEvent> | string[];
  },
  NextApiResponse
>(async function editEvent(req, res) {
  const session = await getSession({ req });
  let { body }: { body: Partial<IEvent> | string[] } = req;
  const eventNotified = !Array.isArray(body) && body.eventNotified;

  if (!session && !eventNotified) {
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

      if (!eventNotified && session) {
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

      let update: [{ $unset: string[] }] | undefined;

      if (Array.isArray(body)) {
        update = [{ $unset: [] }];
        for (const key of body) {
          update[0].$unset.push(key);
        }
      } else {
        if (body.eventName) {
          body = {
            ...body,
            eventName: body.eventName.trim(),
            eventUrl: normalize(body.eventName.trim())
          };
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
      }

      const { n, nModified } = await models.Event.updateOne(
        { eventUrl },
        update || body
      );

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
            const o = await models.Org.findOne({
              _id: typeof eventOrg === "object" ? eventOrg._id : eventOrg
            });

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
