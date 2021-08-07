import { Document, model } from "mongoose";
import type { IOrg } from "models/Org";
import {
  IOrgSubscription,
  ISubscription,
  SubscriptionTypes
} from "models/Subscription";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import { createServerError, databaseErrorCodes } from "utils/errors";
import { getSession } from "hooks/useAuth";
import { ITopic } from "models/Topic";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.post<NextApiRequest, NextApiResponse>(async function postSubscription(
  req,
  res
) {
  const session = await getSession({ req });

  try {
    const selector: { user?: string; email?: string } = {
      user: session?.user.userId
    };

    if (req.body.email) {
      const user = await models.User.findOne({ email: req.body.email });

      if (user) {
        selector.user = user._id;
      } else {
        selector.email = req.body.email;
      }
    } else if (req.body.user) {
      const user = await models.User.findOne({ _id: req.body.user._id });

      if (user) {
        selector.user = user._id;
      }
    }

    let userSubscription = await models.Subscription.findOne(selector);

    if (!userSubscription) {
      userSubscription = await models.Subscription.create({
        ...selector
      });
    }

    if (req.body.orgs) {
      const { orgs: newOrgSubscriptions }: { orgs: IOrgSubscription[] } =
        req.body;

      if (userSubscription.orgs) {
        for (const newOrgSubscription of newOrgSubscriptions) {
          const org = await models.Org.findOne({
            _id: newOrgSubscription.org._id
          });

          if (!org) continue;

          let isFollower = false;
          let isSub = false;

          for (const orgSubscription of userSubscription.orgs) {
            if (org._id.equals(orgSubscription.org._id)) {
              if (orgSubscription.type === SubscriptionTypes.FOLLOWER) {
                isFollower = true;
              } else if (
                orgSubscription.type === SubscriptionTypes.SUBSCRIBER
              ) {
                isSub = true;
              }
              break;
            }
          }

          if (isFollower && isSub) continue;

          // if (!isFollower && !isSub)
          //   await models.Org.updateOne(
          //     { _id: org._id },
          //     { $push: { orgSubscriptions: userSubscription } }
          //   );

          if (
            (!isFollower &&
              newOrgSubscription.type === SubscriptionTypes.FOLLOWER) ||
            (!isSub && newOrgSubscription.type === SubscriptionTypes.SUBSCRIBER)
          )
            userSubscription.orgs.push(newOrgSubscription);
        }
      } else {
        userSubscription.orgs = newOrgSubscriptions;
        await models.Org.updateMany(
          {
            _id: newOrgSubscriptions.map(
              (newOrgSubscription) => newOrgSubscription.org._id
            )
          },
          {
            $push: {
              orgSubscriptions: userSubscription
            }
          }
        );
      }
    } else if (req.body.topics) {
      const topicId = req.body.topics[0].topic._id;
      const topic = await models.Topic.findOne({ _id: topicId });

      if (!topic) {
        return res
          .status(404)
          .json(
            createServerError(
              new Error(`Vous ne pouvez pas vous abonner à un topic inexistant`)
            )
          );
      }

      if (userSubscription.topics) {
        if (
          !userSubscription.topics.find(
            ({ topic }: { topic: ITopic }) => topic._id === topicId
          )
        ) {
          userSubscription.topics.push({ topic });
        }
      } else {
        userSubscription.topics = req.body.topics;
      }
    }

    await userSubscription.save();
    res.status(200).json(userSubscription);
  } catch (error) {
    if (error.code && error.code === databaseErrorCodes.DUPLICATE_KEY) {
      res.status(400).json({
        message: "todo"
      });
    } else {
      res.status(500).json(createServerError(error));
    }
  }
});

export default handler;
