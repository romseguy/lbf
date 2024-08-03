import { Document, Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "server/database";
import {
  sendTopicMessageNotifications,
  sendTopicNotifications
} from "server/email";
import { AddTopicPayload } from "features/api/topicsApi";
import { getSession } from "server/auth";
import { getRefId } from "models/Entity";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { ITopic } from "models/Topic";
import { getCurrentId } from "store/utils";
import { hasItems } from "utils/array";
import { createEndpointError } from "utils/errors";
import { equals, logJson, toString } from "utils/string";
import { randomNumber } from "utils/randomNumber";
import { logEvent, ServerEventTypes } from "server/logging";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<
  NextApiRequest & {
    query: { createdBy?: string };
  },
  NextApiResponse
>(async function getTopics(req, res) {
  try {
    const {
      query: { populate, createdBy }
    } = req;

    const selector = createdBy ? { createdBy } : {};
    //logJson(`GET /topics: selector`, selector);

    let topics: (ITopic & Document<any, ITopic>)[] = [];

    if (populate?.includes("topicMessages.createdBy")) {
      topics = await models.Topic.find(
        selector,
        "-topicMessages.message"
      ).populate([
        {
          path: "topicMessages",
          populate: [{ path: "createdBy", select: "_id" }]
        }
      ]);
    } else {
      topics = await models.Topic.find(selector);
    }

    if (hasItems(topics)) {
      if (populate?.includes("org")) {
        // topics = await Promise.all(
        //   topics.map((topic) => topic.populate(populate).execPopulate())
        for (const topic of topics) {
          await topic.populate({ path: "org" }).execPopulate();
        }
      }
      if (populate?.includes("event")) {
        // topics = await Promise.all(
        //   topics.map((topic) => topic.populate(populate).execPopulate())
        for (const topic of topics) {
          await topic.populate({ path: "event" }).execPopulate();
        }
      }
    }

    logJson(`GET /topics: topics`, topics);
    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json(createEndpointError(error));
  }
});

handler.post<NextApiRequest & { body: AddTopicPayload }, NextApiResponse>(
  async function addTopic(req, res) {
    const prefix = `🚀 ~ ${new Date().toLocaleString()} ~ POST /topics `;
    console.log(prefix + "body", req.body);

    const session = await getSession({ req });

    if (!session) {
      return res
        .status(401)
        .json(createEndpointError(new Error("Vous devez être identifié")));
    }

    try {
      const {
        body
      }: {
        body: AddTopicPayload;
      } = req;

      let event: (IEvent & Document<any, IEvent>) | null | undefined;
      let org: (IOrg & Document<any, IOrg>) | null | undefined;

      if (body.event)
        event = await models.Event.findOne({ _id: body.event._id });
      else if (body.org) org = await models.Org.findOne({ _id: body.org._id });

      if (!event && !org) {
        //org = await models.Org.findOne({ orgUrl: "photo" });
        // if (!org) {
        return res
          .status(400)
          .json(
            createEndpointError(
              new Error(
                "La discussion doit être associée à un atelier ou à un événément"
              )
            )
          );
        //}
      }

      let topic: (ITopic & Document<any, ITopic>) | null | undefined;

      //#region existing topic
      if (body.topic._id) {
        if (
          !Array.isArray(body.topic.topicMessages) ||
          !body.topic.topicMessages[0]
        ) {
          return res
            .status(400)
            .json(
              createEndpointError(
                new Error(
                  "Vous devez indiquer la réponse à ajouter à cette discussion"
                )
              )
            );
        }

        topic = await models.Topic.findOne(
          { _id: body.topic._id },
          "topicName topicMessages"
        );

        if (!topic) {
          return res
            .status(404)
            .json(
              createEndpointError(
                new Error(
                  "Impossible d'ajouter une réponse à une discussion inexistante"
                )
              )
            );
        }

        const newMessage = {
          ...body.topic.topicMessages[0],
          createdBy: session.user.userId
        };
        topic.topicMessages.push(newMessage);
        await topic.save();

        const subscriptions = await models.Subscription.find({
          "topics.topic": body.topic._id,
          user: { $ne: session.user.userId }
        }).populate({ path: "user", select: "email phone userSubscription" });

        sendTopicMessageNotifications({
          event: event ? event : undefined,
          org,
          subscriptions,
          topic
        });
      }
      //#endregion
      //#region new topic
      else {
        let topicName = body.topic.topicName;
        // const topicWithSameName = await models.Topic.findOne({
        //   topicName
        // });
        // if (topicWithSameName) {
        //   const uid = org
        //     ? org.orgTopics.length + 1
        //     : event
        //     ? event.eventTopics.length + 1
        //     : randomNumber(3);
        //   topicName = `${topicName}-${uid}`;
        // }

        topic = await models.Topic.create({
          ...body.topic,
          topicName,
          topicMessages: body.topic.topicMessages?.map((topicMessage) => ({
            ...topicMessage,
            createdBy: session.user.userId
          })),
          event,
          org,
          createdBy: session.user.userId
        });

        //#region add topic to entity and notify entity subscribers
        if (event) {
          event.eventTopics.push(topic);
          await event.save();
          //log(`POST /topics: event`, event);
        } else if (org) {
          await models.Org.updateOne(
            { _id: org._id },
            {
              $push: { orgTopics: topic._id }
            }
          );
          const subscriptions = await models.Subscription.find(
            {
              orgs: { $elemMatch: { orgId: org._id } },
              user: { $ne: session.user.userId }
            },
            "user email events orgs"
          ).populate([{ path: "user", select: "email userSubscription" }]);
          await sendTopicNotifications({ org, subscriptions, topic });
        }
        //#endregion

        //#region subscribe self to topic
        const user = await models.User.findOne({
          _id: session.user.userId
        });

        if (user) {
          let subscription = await models.Subscription.findOne({ user });

          if (!subscription)
            subscription = await models.Subscription.create({
              user,
              topics: [{ topic: topic._id, emailNotif: true, pushNotif: true }]
            });
          else {
            const topicSubscription = subscription.topics?.find(
              ({ topic: t }) => equals(getRefId(t), topic!._id)
            );

            if (!topicSubscription) {
              await models.Subscription.updateOne(
                { _id: subscription._id },
                {
                  $push: {
                    topics: {
                      topic: topic._id,
                      emailNotif: true,
                      pushNotif: true
                    }
                  }
                }
              );
            }
          }
        }
        //#endregion
      }
      //#endregion

      res.status(200).json(topic);
    } catch (error: any) {
      logEvent({
        type: ServerEventTypes.API_ERROR,
        metadata: {
          error,
          method: "POST",
          url: `/api/topics`
        }
      });
      res.status(500).json(createEndpointError(error));
    }
  }
);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb"
    }
  }
};

export default handler;
