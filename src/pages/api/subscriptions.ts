import type { Document } from "mongoose";
import type { IOrg } from "models/Org";
import { ISubscription, SubscriptionTypes } from "models/Subscription";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import { createServerError, databaseErrorCodes } from "utils/errors";
import { getSession } from "hooks/useAuth";

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

    let userSubscription: Document & ISubscription =
      await models.Subscription.findOne(selector);

    if (req.body.orgs) {
      const { orgs }: ISubscription = req.body;

      if (!userSubscription || !userSubscription.orgs) {
        userSubscription = await models.Subscription.create({
          ...selector,
          orgs
        });

        await models.Org.updateMany(
          {
            _id: orgs.map((orgSubscription) => orgSubscription.org._id)
          },
          {
            $push: {
              orgSubscriptions: userSubscription
            }
          }
        );
      }
      // user/email got a subscription
      else {
        for (const newOrgSubscription of orgs) {
          const org: Document & IOrg = await models.Org.findOne({
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

        await userSubscription.save();
      }
    }

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
