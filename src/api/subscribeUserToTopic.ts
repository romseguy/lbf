import type { ITopic } from "models/Topic";
import { models } from "database";
import { equals } from "utils/string";

export const subscribeUserToTopic = async (userId: string, topic: ITopic) => {
  if (!userId || !topic) return;

  const user = await models.User.findOne({ _id: userId });

  if (!user) return;

  let subscription = await models.Subscription.findOne({ user });

  if (!subscription) {
    subscription = await models.Subscription.create({
      user,
      topics: [{ topic }]
    });
    console.log(subscription);
  } else {
    const topicSubscription = subscription.topics.find(({ topic: t }) =>
      equals(t._id, topic._id)
    );

    if (!topicSubscription) {
      console.log("no sub for this topic");
      subscription.topics.push({ topic });
      await subscription.save();
      console.log(subscription);
    }
  }
};
