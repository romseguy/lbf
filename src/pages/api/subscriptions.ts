import type { ISubscription } from "models/Subscription";
import type { IUser } from "models/User";
import { SubscriptionTypes } from "models/Subscription";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import { createServerError, databaseErrorCodes } from "utils/errors";
import { getSession } from "hooks/useAuth";
import { ITopic } from "models/Topic";
import { equals } from "utils/string";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<NextApiRequest, NextApiResponse>(async function getSubscriptions(
  req,
  res
) {
  console.log("getSubscriptions");
});

handler.post<
  NextApiRequest & {
    body: ISubscription;
  },
  NextApiResponse
>(async function postSubscription(req, res) {
  const session = await getSession({ req });

  try {
    const { body }: { body: ISubscription } = req;
    const selector: { user?: IUser; email?: string } = {};

    if (body.email) {
      const user = await models.User.findOne({ email: body.email });

      if (user) {
        selector.user = user;
      } else {
        selector.email = body.email;
      }
    } else if (body.user) {
      const user = await models.User.findOne({
        _id: typeof body.user === "object" ? body.user._id : body.user
      });

      if (user) {
        selector.user = user;
      }
    } else if (session) {
      const user = await models.User.findOne({ _id: session.user.userId });

      if (user) {
        selector.user = user;
      }
    }

    let userSubscription = await models.Subscription.findOne(selector);

    if (!userSubscription) {
      userSubscription = await models.Subscription.create(selector);
    }

    if (body.orgs) {
      const { orgs: newOrgSubscriptions } = body;

      if (userSubscription.orgs.length > 0) {
        const staleOrgSubscriptionOrgIds: string[] = [];

        for (const newOrgSubscription of newOrgSubscriptions) {
          const org = await models.Org.findOne({
            _id: newOrgSubscription.org._id
          });

          if (!org) {
            staleOrgSubscriptionOrgIds.push(newOrgSubscription.org._id);
            continue;
          }

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

          if (!isFollower && !isSub)
            await models.Org.updateOne(
              { _id: org._id },
              { $push: { orgSubscriptions: userSubscription } }
            );

          if (
            (!isFollower &&
              newOrgSubscription.type === SubscriptionTypes.FOLLOWER) ||
            (!isSub && newOrgSubscription.type === SubscriptionTypes.SUBSCRIBER)
          )
            userSubscription.orgs.push(newOrgSubscription);
        }

        if (staleOrgSubscriptionOrgIds.length > 0) {
          userSubscription.orgs = userSubscription.orgs.filter(
            (orgSubscription) =>
              !staleOrgSubscriptionOrgIds.find((id) =>
                equals(id, orgSubscription.orgId)
              )
          );
        }
      } else if (userSubscription) {
        userSubscription.orgs = newOrgSubscriptions;
        const newOrgSubscription = newOrgSubscriptions[0];
        let org = await models.Org.findOne({
          _id: newOrgSubscription.org._id
        }).populate("orgSubscriptions");

        if (!org) {
          return res
            .status(400)
            .json(
              createServerError(
                new Error(
                  "Vous ne pouvez pas vous abonner à une organisation inexistante"
                )
              )
            );
        }

        let found = false;

        for (const orgSubscription of org.orgSubscriptions) {
          if (equals(orgSubscription._id, userSubscription._id)) {
            found = true;
            break;
          }
        }

        if (!found) {
          org.orgSubscriptions.push(userSubscription);
          await org.save();
        }
      }
    } else if (body.topics) {
      const topicId = body.topics[0].topic._id;
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
        userSubscription.topics = body.topics;
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
