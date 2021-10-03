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

handler.get<NextApiRequest & { query: { topicId?: string } }, NextApiResponse>(
  async function getSubscriptions(req, res) {
    const {
      query: { topicId }
    } = req;

    const array: ISubscription[] = [];
    const subscriptions = await models.Subscription.find({});

    for (const subscription of subscriptions) {
      for (const topicSubscription of subscription.topics) {
        if (equals(topicSubscription.topic, topicId)) {
          const s = await subscription
            .populate("user", "-userImage -email -password -securityCode")
            .execPopulate();
          array.push(s);
          break;
        }
      }
    }

    res.status(200).json(array);
  }
);

handler.post<
  NextApiRequest & {
    body: ISubscription;
  },
  NextApiResponse
>(async function postSubscription(req, res) {
  const session = await getSession({ req });

  try {
    const {
      body
    }: {
      body: ISubscription;
    } = req;
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
        console.log("user already got org subscriptions");
        //const staleOrgSubscriptionOrgIds: string[] = [];

        for (const newOrgSubscription of newOrgSubscriptions) {
          const org = await models.Org.findOne({
            _id: newOrgSubscription.orgId
          });

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

          let isFollower = false;
          let isSub = false;

          for (const orgSubscription of userSubscription.orgs) {
            if (equals(org._id, orgSubscription.orgId)) {
              if (orgSubscription.type === SubscriptionTypes.FOLLOWER) {
                isFollower = true;
                console.log("user is already following org");
              } else if (
                orgSubscription.type === SubscriptionTypes.SUBSCRIBER
              ) {
                isSub = true;
                console.log("user is already subscribed to org");
              }
              break;
            }
          }

          if (newOrgSubscription.type === SubscriptionTypes.FOLLOWER) {
            if (isFollower) {
              userSubscription.orgs = userSubscription.orgs.map(
                (orgSubscription) => {
                  if (
                    orgSubscription.type === SubscriptionTypes.FOLLOWER &&
                    equals(orgSubscription.orgId, newOrgSubscription.orgId)
                  ) {
                    return newOrgSubscription;
                  }
                  return orgSubscription;
                }
              );
            } else {
              userSubscription.orgs.push(newOrgSubscription);
            }
          }

          if (newOrgSubscription.type === SubscriptionTypes.SUBSCRIBER) {
            if (isSub) {
              userSubscription.orgs = userSubscription.orgs.map(
                (orgSubscription) => {
                  if (
                    orgSubscription.type === SubscriptionTypes.SUBSCRIBER &&
                    equals(orgSubscription.orgId, newOrgSubscription.orgId)
                  ) {
                    return newOrgSubscription;
                  }
                  return orgSubscription;
                }
              );
            } else {
              userSubscription.orgs.push(newOrgSubscription);
            }
          }

          if (
            !org.orgSubscriptions.find((orgSubscription) =>
              equals(orgSubscription._id, userSubscription!._id)
            )
          ) {
            org.orgSubscriptions.push(userSubscription);
            await org.save();
            console.log("org updated with new subscription");
          }

          // if (staleOrgSubscriptionOrgIds.length > 0) {
          //   userSubscription.orgs = userSubscription.orgs.filter(
          //     (orgSubscription) =>
          //       !staleOrgSubscriptionOrgIds.find((id) =>
          //         equals(id, orgSubscription.orgId)
          //       )
          //   );
        }
      } else if (userSubscription) {
        console.log("first time user subscribes to any org");
        userSubscription.orgs = newOrgSubscriptions;

        for (const newOrgSubscription of newOrgSubscriptions) {
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

          if (
            !org.orgSubscriptions.find((orgSubscription) =>
              equals(orgSubscription._id, userSubscription!._id)
            )
          ) {
            org.orgSubscriptions.push(userSubscription);
            await org.save();
            console.log("org updated with new subscription");
          }
        }
      }
    } else if (body.events) {
      const { events: newEventSubscriptions } = body;

      if (userSubscription.events.length > 0) {
        const staleEventSubscriptionEventIds: string[] = [];

        for (const newEventSubscription of newEventSubscriptions) {
          const event = await models.Event.findOne({
            _id: newEventSubscription.eventId
          });

          if (!event) {
            // userSub.events contains stale event subscription
            staleEventSubscriptionEventIds.push(newEventSubscription.eventId);
            continue;
          }

          let isAdded;

          for (const eventSubscription of userSubscription.events) {
            if (equals(event._id, eventSubscription.eventId)) {
              isAdded = true;
              break;
            }
          }

          if (isAdded) continue;

          await models.Event.updateOne(
            { _id: event._id },
            { $push: { orgSubscriptions: userSubscription } }
          );

          userSubscription.events.push(newEventSubscription);
        }

        if (staleEventSubscriptionEventIds.length > 0) {
          userSubscription.events = userSubscription.events.filter(
            (eventSubscription) =>
              !staleEventSubscriptionEventIds.find((id) =>
                equals(id, eventSubscription.eventId)
              )
          );
        }
      } else if (userSubscription) {
        const newEventSubscription = newEventSubscriptions[0];
        let event = await models.Event.findOne({
          _id: newEventSubscription.event._id
        }).populate("eventSubscriptions");

        if (!event) {
          return res
            .status(400)
            .json(
              createServerError(
                new Error(
                  "Vous ne pouvez pas vous abonner à une eventanisation inexistante"
                )
              )
            );
        }

        userSubscription.events = newEventSubscriptions;

        let found = false;

        for (const eventSubscription of event.eventSubscriptions) {
          if (equals(eventSubscription._id, userSubscription._id)) {
            found = true;
            break;
          }
        }

        if (!found) {
          event.eventSubscriptions.push(userSubscription);
          await event.save();
        }
      }
    }

    if (body.topics) {
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
          userSubscription.topics.push({
            topic,
            emailNotif: true,
            pushNotif: true
          });
        }
      } else {
        userSubscription.topics = body.topics;
      }
    }

    await userSubscription.save();
    res.status(200).json(userSubscription);
  } catch (error) {
    res.status(500).json(createServerError(error));
  }
});

export default handler;
