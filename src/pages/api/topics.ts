import { Document, Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";
import database, { models } from "database";
import { getSession } from "hooks/useAuth";
import { IEvent } from "models/Event";
import { getSubscriptions, IOrg } from "models/Org";
import { SubscriptionTypes } from "models/Subscription";
import { ITopic } from "models/Topic";
import { hasItems } from "utils/array";
import {
  sendTopicMessageEmailNotifications,
  sendTopicEmailNotifications
} from "utils/email";
import { createServerError } from "utils/errors";
import { equals, log, toString } from "utils/string";

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
          topic: Partial<ITopic>;
          topicNotif?: boolean;
          event?: IEvent;
          org?: IOrg;
        };
      } = req;
      const topic = body.topic;
      const topicNotif = body.topicNotif || false;

      let event: (IEvent & Document<any, any, any>) | null = null;
      let org: (IOrg & Document<any, any, any>) | null = null;

      if (body.event) {
        event = await models.Event.findOne({ _id: body.event._id });
      } else if (body.org) {
        org = await models.Org.findOne({ _id: body.org._id });
      } else {
        return res
          .status(400)
          .json(
            createServerError(
              new Error(
                "Le sujet de discussion doit être associé à une organisation ou à un événément"
              )
            )
          );
      }

      let createdBy: string;
      let doc: (ITopic & Document<any, any, any>) | null = null;

      if (topic._id) {
        console.log(`POST /topics: existing topic`);

        if (
          !Array.isArray(topic.topicMessages) ||
          !topic.topicMessages.length
        ) {
          return res.status(200).json({});
        }

        const newMessage = topic.topicMessages[0];

        doc = await models.Topic.findOne({ _id: topic._id });

        if (!doc) {
          return res
            .status(404)
            .json(
              createServerError(
                new Error(
                  "Impossible d'ajouter un message à un topic inexistant"
                )
              )
            );
        }

        createdBy = toString(doc.createdBy);
        doc.topicMessages.push(newMessage);
        await doc.save();

        // getting subscriptions of users subscribed to this topic
        const subscriptions = await models.Subscription.find({
          "topics.topic": Types.ObjectId(topic._id),
          user: { $ne: newMessage.createdBy }
        }).populate("user");

        sendTopicMessageEmailNotifications({
          event,
          org,
          subscriptions,
          topic: doc,
          transport
        });
      } else {
        log(`POST /topics: new topic`, topic);

        doc = await models.Topic.create({
          ...topic,
          event: event || undefined,
          org: org || undefined
        });
        createdBy = toString(doc.createdBy);

        if (event) {
          event.eventTopics.push(doc);
          await event.save();

          if (topicNotif) {
            // getting subscriptions of users subscribed to this event
            const subscriptions = await models.Subscription.find({
              phone: { $exists: false },
              "events.event": Types.ObjectId(event._id)
            }).populate("user");

            const emailList = await sendTopicEmailNotifications({
              event,
              subscriptions,
              topic: doc,
              transport
            });

            doc.topicNotified = emailList.map((email) => ({ email }));
            await doc.save();
          }
        } else if (org) {
          org.orgTopics.push(doc);
          await org.save();

          if (topicNotif && body.topic.topicVisibility) {
            org = org.populate({
              path: "orgLists",
              populate: {
                path: "subscriptions",
                populate: { path: "user", select: "-password -securityCode" }
              }
            });

            if (
              body.topic.topicVisibility.find((listName) =>
                ["Abonnés", "Adhérents"].includes(listName)
              )
            )
              org = org.populate({
                path: "orgSubscriptions",
                populate: {
                  path: "user"
                }
              });

            org = await org.execPopulate();

            let subscriptions = (org.orgLists || [])
              .filter((orgList) =>
                body.topic.topicVisibility?.find(
                  (listName) => listName === orgList.listName
                )
              )
              .flatMap(({ subscriptions }) => subscriptions);

            for (const listName of body.topic.topicVisibility)
              if (["Abonnés", "Adhérents"].includes(listName))
                subscriptions = subscriptions.concat(
                  getSubscriptions(
                    org,
                    listName === "Abonnés"
                      ? SubscriptionTypes.FOLLOWER
                      : SubscriptionTypes.SUBSCRIBER
                  )
                );

            if (hasItems(subscriptions)) {
              const emailList = await sendTopicEmailNotifications({
                org,
                subscriptions,
                topic: doc,
                transport
              });

              doc.topicNotified = emailList.map((email) => ({ email }));
              await doc.save();
            }
          }
        }
      }

      const user = await models.User.findOne({ _id: createdBy });

      if (user) {
        const subscription = await models.Subscription.findOne({ user });

        if (!subscription) {
          // console.log("no sub for this user => adding one");
          await models.Subscription.create({
            user,
            topics: [{ topic, emailNotif: true, pushNotif: true }]
          });
        } else {
          const topicSubscription = subscription.topics.find(({ topic: t }) =>
            equals(t._id, topic!._id)
          );

          if (!topicSubscription) {
            // console.log("no sub for this topic => adding one", subscription);
            subscription.topics = subscription.topics.concat([
              {
                topic: doc._id,
                emailNotif: true,
                pushNotif: true
              }
            ]);
            await subscription.save();
            // console.log("subscription saved", subscription);
          }
        }
      }

      res.status(200).json(topic);
    } catch (error: any) {
      res.status(500).json(createServerError(error));
    }
  }
});

export default handler;
