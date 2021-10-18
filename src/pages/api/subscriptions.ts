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
  console.log("!!", session);

  try {
    const {
      body
    }: {
      body: ISubscription;
    } = req;
    const selector: { user?: IUser; email?: string; phone?: string } = {};

    if (body.email) {
      const user = await models.User.findOne({ email: body.email });

      if (user) {
        selector.user = user;
      } else {
        selector.email = body.email;
      }
    } else if (body.phone) {
      const user = await models.User.findOne({ phone: body.phone });

      if (user) {
        selector.user = user;
      } else {
        selector.phone = body.phone;
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
    } else {
      return res
        .status(400)
        .json(
          createServerError(
            new Error("Vous devez fournir une adresse e-mail pour vous abonner")
          )
        );
    }

    console.log("looking for subscription", selector);
    let subscription = await models.Subscription.findOne(selector);

    if (!subscription) {
      console.log("creating subscription", selector);
      subscription = await models.Subscription.create(selector);
    }

    if (body.orgs) {
      const { orgs: newOrgSubscriptions } = body;

      if (subscription.orgs.length > 0) {
        console.log("user already got org subscriptions");

        for (const newOrgSubscription of newOrgSubscriptions) {
          console.log("newOrgSubscription", newOrgSubscription);

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

          for (const orgSubscription of subscription.orgs) {
            if (equals(org._id, orgSubscription.orgId)) {
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

          if (newOrgSubscription.type === SubscriptionTypes.FOLLOWER) {
            if (isFollower) {
              console.log(
                "user is already following org => replacing old subscription with new one"
              );
              subscription.orgs = subscription.orgs.map((orgSubscription) => {
                if (
                  orgSubscription.type === SubscriptionTypes.FOLLOWER &&
                  equals(orgSubscription.orgId, newOrgSubscription.orgId)
                ) {
                  return newOrgSubscription;
                }
                return orgSubscription;
              });
            } else {
              subscription.orgs.push(newOrgSubscription);
            }
          }

          if (newOrgSubscription.type === SubscriptionTypes.SUBSCRIBER) {
            if (isSub) {
              console.log(
                "user is already subscribed to org => replacing old subscription with new one"
              );
              subscription.orgs = subscription.orgs.map((orgSubscription) => {
                if (
                  orgSubscription.type === SubscriptionTypes.SUBSCRIBER &&
                  equals(orgSubscription.orgId, newOrgSubscription.orgId)
                ) {
                  return newOrgSubscription;
                }
                return orgSubscription;
              });
            } else {
              subscription.orgs.push(newOrgSubscription);
            }
          }

          if (
            !org.orgSubscriptions.find((orgSubscription) =>
              equals(orgSubscription._id, subscription!._id)
            )
          ) {
            org.orgSubscriptions.push(subscription);
            await org.save();
            console.log("org updated with new subscription");
          }

          // if (staleOrgSubscriptionOrgIds.length > 0) {
          //   subscription.orgs = subscription.orgs.filter(
          //     (orgSubscription) =>
          //       !staleOrgSubscriptionOrgIds.find((id) =>
          //         equals(id, orgSubscription.orgId)
          //       )
          //   );
        }
      } else if (subscription) {
        console.log("first time user subscribes to any org");
        subscription.orgs = newOrgSubscriptions;

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
              equals(orgSubscription._id, subscription!._id)
            )
          ) {
            org.orgSubscriptions.push(subscription);
            await org.save();
            console.log("org updated with new subscription");
          }
        }
      }
    } else if (body.events) {
      const { events: newEventSubscriptions } = body;

      if (subscription.events.length > 0) {
        console.log("user already got event subscriptions");

        for (const newEventSubscription of newEventSubscriptions) {
          console.log("newEventSubscription", newEventSubscription);

          const event = await models.Event.findOne({
            _id: newEventSubscription.eventId
          });

          if (!event) {
            return res
              .status(400)
              .json(
                createServerError(
                  new Error(
                    "Vous ne pouvez pas vous abonner à un événement inexistant"
                  )
                )
              );
          }

          let isFollower;

          for (const eventSubscription of subscription.events) {
            if (equals(event._id, eventSubscription.eventId)) {
              isFollower = true;
              break;
            }
          }

          if (isFollower) {
            console.log(
              "user is already following event => replacing old subscription with new one"
            );
            subscription.events = subscription.events.map(
              (eventSubscription) => {
                if (
                  equals(
                    eventSubscription.eventId,
                    newEventSubscription.eventId
                  )
                )
                  return newEventSubscription;
                return eventSubscription;
              }
            );
          } else {
            subscription.events.push(newEventSubscription);
          }

          await models.Event.updateOne(
            { _id: event._id },
            { $push: { eventSubscriptions: subscription } }
          );
        }

        // if (staleEventSubscriptionEventIds.length > 0) {
        //   subscription.events = subscription.events.filter(
        //     (eventSubscription) =>
        //       !staleEventSubscriptionEventIds.find((id) =>
        //         equals(id, eventSubscription.eventId)
        //       )
        //   );
        // }
      } else if (subscription) {
        console.log("first time user subscribes to any event");

        const newEventSubscription = newEventSubscriptions[0];
        let event = await models.Event.findOne({
          _id: newEventSubscription.eventId || newEventSubscription.event._id
        }).populate("eventSubscriptions");

        if (!event) {
          return res
            .status(400)
            .json(
              createServerError(
                new Error(
                  "Vous ne pouvez pas vous abonner à un événement inexistant"
                )
              )
            );
        }

        subscription.events = newEventSubscriptions;

        let found = false;

        for (const eventSubscription of event.eventSubscriptions) {
          if (equals(eventSubscription._id, subscription._id)) {
            found = true;
            break;
          }
        }

        if (!found) {
          event.eventSubscriptions.push(subscription);
          await event.save();
        }
      }
    }

    if (body.topics) {
      if (!body.topics.length) {
        subscription.topics = [];
      }

      for (let i = 0; i < body.topics.length; i++) {
        const topicId = body.topics[i].topic._id;
        const topic = await models.Topic.findOne({ _id: topicId });

        if (!topic) {
          return res
            .status(404)
            .json(
              createServerError(
                new Error(
                  `Vous ne pouvez pas vous abonner à un topic inexistant`
                )
              )
            );
        }

        if (
          Array.isArray(subscription.topics) &&
          subscription.topics.length > 0
        ) {
          console.log("user already got topic subscriptions");

          if (
            !subscription.topics.find(({ topic }: { topic: ITopic }) =>
              typeof topic === "object"
                ? equals(topic._id, topicId)
                : equals(topic, topicId)
            )
          ) {
            subscription.topics.push({
              topic,
              emailNotif: true,
              pushNotif: true
            });
          }
        } else {
          console.log("first time user subscribes to any topic");
          subscription.topics = body.topics;
        }
      }
    }

    console.log("saving subscription", subscription);

    await subscription.save();
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json(createServerError(error));
  }
});

export default handler;
