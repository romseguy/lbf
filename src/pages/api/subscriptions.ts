import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import { AddSubscriptionPayload } from "features/api/subscriptionsApi";
import { getSession } from "utils/auth";
import { IOrg } from "models/Org";
import {
  getFollowerSubscription,
  IOrgSubscription,
  ISubscription,
  setFollowerSubscriptionTagType,
  EOrgSubscriptionType
} from "models/Subscription";
import { IUser } from "models/User";
import { createServerError } from "utils/errors";
import { equals, logJson } from "utils/string";

function updateOrgSubscription(
  org: IOrg,
  subscription: ISubscription,
  subscriptionType: string,
  newOrgSubscription: IOrgSubscription
) {
  subscription.orgs = subscription.orgs?.map((orgSubscription) => {
    if (
      equals(orgSubscription.orgId, org._id) &&
      orgSubscription.type === subscriptionType
    ) {
      if (newOrgSubscription.eventCategories)
        orgSubscription.eventCategories = newOrgSubscription.eventCategories;

      if (newOrgSubscription.tagTypes) {
        if (
          Array.isArray(orgSubscription.tagTypes) &&
          orgSubscription.tagTypes.length > 0
        ) {
          for (const newTagType of newOrgSubscription.tagTypes) {
            setFollowerSubscriptionTagType(newTagType, orgSubscription);
          }
        } else {
          orgSubscription.tagTypes = newOrgSubscription.tagTypes;
        }
      }
    }

    return orgSubscription;
  });
}

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
      if (!subscription.topics) continue;
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
    body: AddSubscriptionPayload;
  },
  NextApiResponse
>(async function addSubscription(req, res) {
  const session = await getSession({ req });

  try {
    const {
      body
    }: {
      body: AddSubscriptionPayload;
    } = req;
    const selector: { user?: IUser; email?: string; phone?: string } = {};

    if (body.email) {
      const user = await models.User.findOne({ email: body.email });

      if (user) {
        selector.user = user._id;
      } else {
        selector.email = body.email;
      }
    } else if (body.phone) {
      const user = await models.User.findOne({ phone: body.phone });

      if (user) {
        selector.user = user._id;
      } else {
        selector.phone = body.phone;
      }
    } else if (body.user) {
      const user = await models.User.findOne({
        _id: typeof body.user === "object" ? body.user._id : body.user
      });

      if (user) {
        selector.user = user._id;
      }
    } else if (session) {
      const user = await models.User.findOne({ _id: session.user.userId });

      if (user) {
        selector.user = user._id;
      }
    } else
      return res
        .status(400)
        .json(
          createServerError(
            new Error("Vous devez fournir une adresse e-mail pour vous abonner")
          )
        );

    logJson(`POST /subscriptions: selector`, selector);
    let subscription = await models.Subscription.findOne(selector);

    if (!subscription)
      subscription = await models.Subscription.create(selector);

    if (!subscription) throw new Error("Impossible de créer un abonnement");

    logJson(`POST /subscriptions: subscription`, subscription);

    if (body.orgs) {
      for (const newOrgSubscription of body.orgs) {
        let org = await models.Org.findOne({
          _id: newOrgSubscription.orgId
        });

        if (!org)
          return res
            .status(400)
            .json(
              createServerError(
                new Error(
                  "Vous ne pouvez pas vous abonner à une organisation inexistante"
                )
              )
            );

        org = await org.populate("orgSubscriptions").execPopulate();

        if (
          !org.orgSubscriptions.find((orgSubscription) =>
            equals(orgSubscription._id, subscription!._id)
          )
        ) {
          org.orgSubscriptions.push(subscription);
          await org.save();
        }

        if (!Array.isArray(subscription.orgs) || !subscription.orgs.length) {
          subscription.orgs = [newOrgSubscription];
          continue;
        }

        if (newOrgSubscription.type === EOrgSubscriptionType.FOLLOWER) {
          const followerSubscription = getFollowerSubscription({
            org,
            subscription
          });

          if (!followerSubscription) subscription.orgs.push(newOrgSubscription);
          else
            updateOrgSubscription(
              org,
              subscription,
              EOrgSubscriptionType.FOLLOWER,
              newOrgSubscription
            );
        }
      }
    } else if (body.events) {
      const { events: newEventSubscriptions } = body;

      if (subscription.events && subscription.events.length > 0) {
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

        const { emailNotif, pushNotif } = body.topics[i];
        const topicSubscription = subscription.topics?.find((topicS) =>
          typeof topicS.topic === "object"
            ? equals(topicS.topic._id, topicId)
            : equals(topicS.topic, topicId)
        );

        if (!topicSubscription) {
          subscription.topics?.push({
            topic,
            emailNotif,
            pushNotif
          });
        } else {
          (topicSubscription.emailNotif =
            emailNotif === undefined
              ? topicSubscription.emailNotif
              : emailNotif),
            (topicSubscription.pushNotif =
              pushNotif === undefined
                ? topicSubscription.pushNotif
                : pushNotif);
        }
      }
    }

    logJson(`POST /subscriptions: saving subscription`, subscription);
    await subscription.save();

    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json(createServerError(error));
  }
});

export default handler;
