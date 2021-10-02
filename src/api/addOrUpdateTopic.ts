import type { IEvent } from "models/Event";
import type { IOrg } from "models/Org";
import type { ITopic } from "models/Topic";
import { models } from "database";
import { Document, Types } from "mongoose";
import { NextApiResponse } from "next";
import { createServerError } from "utils/errors";
import { toString } from "utils/string";
import { sendMessageToTopicFollowers, sendTopicToFollowers } from "utils/email";
import { subscribeUserToTopic } from "api";

export const addOrUpdateTopic = async ({
  body,
  event,
  org,
  transport,
  res
}: {
  body: { topic?: ITopic; topicNotif?: boolean };
  event?: IEvent & Document<any, any, any>;
  org?: IOrg & Document<any, any, any>;
  transport: any;
  res: NextApiResponse;
}) => {
  if (!body.topic || (!event && !org)) {
    return;
  }

  let createdBy: string;
  let topic: (ITopic & Document<any, any, any>) | null;

  if (body.topic._id) {
    // existing topic: must have a message to add
    console.log("existing topic");

    if (!body.topic.topicMessages || !body.topic.topicMessages.length) {
      return res.status(200).json(event || org);
    }

    topic = await models.Topic.findOne({ _id: body.topic._id });

    if (!topic) {
      return res
        .status(404)
        .json(
          createServerError(
            new Error("Impossible d'ajouter un message à un topic inexistant")
          )
        );
    }

    createdBy = toString(topic.createdBy);

    const newMessage = body.topic.topicMessages[0];
    topic.topicMessages.push(newMessage);
    await topic.save();

    // getting subscriptions of users subscribed to this topic
    const subscriptions = await models.Subscription.find({
      "topics.topic": Types.ObjectId(topic._id),
      user: { $ne: newMessage.createdBy }
    }).populate("user");

    sendMessageToTopicFollowers({
      event,
      org,
      subscriptions,
      topic,
      transport
    });
  } else {
    console.log("new topic");
    topic = await models.Topic.create(body.topic);
    createdBy = toString(topic.createdBy);

    if (event) {
      event.eventTopics.push(topic);
      await event.save();

      // getting subscriptions of users subscribed to this event
      const subscriptions = await models.Subscription.find({
        "events.event": Types.ObjectId(event._id)
      }).populate("user");

      sendTopicToFollowers({
        event,
        subscriptions,
        topic,
        transport
      });
    } else if (org) {
      org.orgTopics.push(topic);
      await org.save();

      const subscriptions = await models.Subscription.find({
        "orgs.org": Types.ObjectId(org._id)
      }).populate("user");

      if (body.topicNotif) {
        const emailList = await sendTopicToFollowers({
          org,
          subscriptions,
          topic,
          transport
        });

        topic.topicNotified = emailList.map((email) => ({ email }));
        await topic.save();
      }
    }
  }

  await subscribeUserToTopic(createdBy, topic);

  return topic;
};
