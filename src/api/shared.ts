import type { ITopic } from "models/Topic";
import type { IUser } from "models/User";
import { Types } from "mongoose";
import { models } from "database";

export const addOrUpdateSub = async (userId: string, topic: ITopic) => {
  if (!userId || !topic) return;

  const user = await models.User.findOne({ _id: userId });

  if (!user) return;

  let subscription = await models.Subscription.findOne({ user });

  if (!subscription) {
    subscription = await models.Subscription.create({
      user,
      topics: [{ topic }]
    });
  } else {
    let topicSubscription = subscription.topics.find(
      ({ topic: t }) => t._id === topic._id
    );

    if (!topicSubscription) {
      console.log("no sub for this topic");
      subscription.topics.push({ topic });
      await subscription.save();
    }
  }
};
