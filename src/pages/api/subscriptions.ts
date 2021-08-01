import type { Document } from "mongoose";
import type { IOrg } from "models/Org";
import {
  IOrgSubscription,
  ISubscription,
  SubscriptionTypes
} from "models/Subscription";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import {
  createServerError,
  databaseErrorCodes,
  duplicateError
} from "utils/errors";
import { getSession } from "hooks/useAuth";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.post<NextApiRequest, NextApiResponse>(async function postSubscription(
  req,
  res
) {
  const session = await getSession({ req });

  try {
    let userId = session?.user.userId;
    let email;

    if (req.body.email) {
      const user = await models.User.findOne({ email: req.body.email });

      if (user) {
        userId = user._id;
      } else {
        email = req.body.email;
      }
    }

    let selector: { user?: string; email?: string } = { user: userId };

    if (email) {
      selector = { email };
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
      // user/email got a subscription (TODO: move to PUT?)
      else {
        for (const newOrgSubscription of orgs) {
          const org: Document & IOrg = await models.Org.findOne({
            _id: newOrgSubscription.org._id
          });

          if (!org) continue;

          let found;
          let both = false;

          for (const orgSubscription of userSubscription.orgs) {
            if (org._id.equals(orgSubscription.org._id)) {
              if (orgSubscription.type === SubscriptionTypes.BOTH) both = true;
              else found = orgSubscription;
              break;
            }
          }

          if (both) continue;

          if (found) found.type = SubscriptionTypes.BOTH;
          else {
            userSubscription.orgs.push(newOrgSubscription);

            await models.Org.updateOne(
              { _id: org._id },
              { $push: { orgSubscriptions: userSubscription } }
            );
          }
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
