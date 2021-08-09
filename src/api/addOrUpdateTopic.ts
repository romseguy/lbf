import type { IEvent } from "models/Event";
import type { IOrg } from "models/Org";
import type { ITopic } from "models/Topic";
import { models } from "database";
import { Document, Types } from "mongoose";
import { NextApiResponse } from "next";
import { createServerError } from "utils/errors";
import { toString } from "utils/string";
import { sendToTopicFollowers } from "utils/email";
import { subscribeUserToTopic } from "api";

export const addOrUpdateTopic = async (
  body: { topic?: ITopic },
  entity: (IEvent | IOrg) & Document<any, any, any>,
  transport: any,
  res: NextApiResponse
) => {
  if (!body.topic) {
    return;
  }

  let createdBy: string;
  let topic: (ITopic & Document<any, any, any>) | null;

  if (body.topic._id) {
    // existing topic: must have a message to add
    if (!body.topic.topicMessages || !body.topic.topicMessages.length) {
      return res.status(200).json(entity);
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

    // get subscriptions of users other than new message poster
    const subscriptions = await models.Subscription.find({
      "topics.topic": Types.ObjectId(topic._id),
      user: { $ne: newMessage.createdBy }
    }).populate("user");

    sendToTopicFollowers(entity, subscriptions, topic, transport);
  } else {
    // new topic
    topic = await models.Topic.create(body.topic);
    createdBy = toString(topic.createdBy);
    "eventName" in entity
      ? entity.eventTopics.push(topic)
      : entity.orgTopics.push(topic);
    await entity.save();
  }

  await subscribeUserToTopic(createdBy, topic);
};
