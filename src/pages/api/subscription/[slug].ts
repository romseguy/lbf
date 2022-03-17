import type { IEventSubscription, IOrgSubscription } from "models/Subscription";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import { createServerError } from "utils/errors";
import { getSession } from "hooks/useAuth";
import { equals, logJson } from "utils/string";
import { emailR } from "utils/email";
import { IUser } from "models/User";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<
  NextApiRequest & { query: { slug: string; populate?: string } },
  NextApiResponse
>(async function getSubscription(req, res) {
  try {
    const {
      query: { slug, populate }
    } = req;

    let selector: { user?: IUser; email?: string; _id?: string } = {};

    if (emailR.test(slug)) {
      const user = await models.User.findOne({ email: slug });
      selector = user ? { user } : { email: slug };
    } else {
      const user = await models.User.findOne({ _id: slug });

      if (user) selector = { user };
      else selector = { _id: slug };
    }

    let subscription = await models.Subscription.findOne(selector);

    if (!subscription) {
      return res
        .status(404)
        .json(
          createServerError(
            new Error(`L'abonnement ${slug} n'a pas pu être trouvé`)
          )
        );
    }

    if (populate) {
      if (populate.includes("events"))
        subscription = subscription.populate({
          path: "events",
          populate: { path: "event" }
        });

      if (populate.includes("orgs"))
        subscription = subscription.populate({
          path: "orgs",
          populate: { path: "org" }
        });

      if (populate.includes("topics"))
        subscription = subscription.populate({
          path: "topics",
          populate: {
            path: "topic"
          }
        });

      const subPopulate = [];

      if (populate.includes("topics.topic.org"))
        subPopulate.push({ path: "org" });
      if (populate.includes("topics.topic.event"))
        subPopulate.push({ path: "event" });

      if (subPopulate.length > 0)
        subscription = subscription.populate({
          path: "topics",
          populate: {
            path: "topic",
            populate: subPopulate
          }
        });

      // if (populate.includes("topics.topic.event"))
      //   subscription = subscription.populate({
      //     path: "topics",
      //     populate: {
      //       path: "topic",
      //       populate: {
      //         path: "event"
      //       }
      //     }
      //   });
    } else
      subscription = subscription
        .populate({
          path: "events",
          populate: { path: "event" }
        })
        .populate({
          path: "orgs",
          populate: { path: "org" }
        })
        .populate({
          path: "topics",
          populate: { path: "topic" }
        });

    subscription = await subscription.execPopulate();
    res.status(200).json(subscription);
  } catch (error) {
    console.log("error", error);
    res.status(500).json(createServerError(error));
  }
});

handler.put<NextApiRequest & { query: { slug: string } }, NextApiResponse>(
  async function editSubscription(req, res) {
    const session = await getSession({ req });

    if (!session) {
      return res
        .status(401)
        .json(createServerError(new Error("Vous devez être identifié")));
    }

    try {
      const {
        query: { slug }
      } = req;

      let body = req.body;

      await models.Subscription.updateOne({ _id: slug }, body);

      // if (nModified === 1) {
      res.status(200).json({});
      // } else {
      //   res
      //     .status(400)
      //     .json(
      //       createServerError(
      //         new Error(`L'abonnement n'a pas pu être modifié`)
      //       )
      //     );
      // }
    } catch (error) {
      res.status(500).json(createServerError(error));
    }
  }
);

handler.delete<
  NextApiRequest & {
    query: { slug: string };
    body: {
      events?: IEventSubscription[];
      orgs?: IOrgSubscription[];
      orgId?: string;
      topicId?: string;
    };
  },
  NextApiResponse
>(async function removeSubscription(req, res) {
  const {
    query: { slug: subscriptionId },
    body
  }: {
    query: { slug: string };
    body: {
      events?: IEventSubscription[];
      orgs?: IOrgSubscription[];
      orgId?: string;
      topicId?: string;
    };
  } = req;

  try {
    let subscription = await models.Subscription.findOne({
      _id: subscriptionId
    });

    if (!subscription) {
      return res
        .status(404)
        .json(
          createServerError(
            new Error(`L'abonnement ${subscriptionId} n'a pas pu être trouvé`)
          )
        );
    }

    if (body.orgs) {
      const { orgId, type } = body.orgs[0];
      logJson(`DELETE /subscription/${subscriptionId}: orgId`, orgId);

      const org = await models.Org.findOne({ _id: orgId }).populate(
        "orgSubscriptions"
      );

      if (!org)
        return res
          .status(400)
          .json(
            createServerError(
              new Error(`L'organisation ${orgId} n'a pas pu être trouvé`)
            )
          );

      logJson(
        `DELETE /subscription/${subscriptionId}: subscription`,
        subscription
      );
      subscription.orgs = subscription.orgs?.filter(
        (orgSubscription: IOrgSubscription) => {
          let keep = true;
          if (
            equals(orgSubscription.orgId, orgId) &&
            orgSubscription.type === type
          ) {
            keep = false;
          }
          return keep;
        }
      );
      await subscription.save();
      logJson(
        `DELETE /subscription/${subscriptionId}: subscription saved`,
        subscription
      );

      return res.status(200).json(subscription);
    }

    //#region remove subscription from org
    if (body.orgId) {
      let org = await models.Org.findOne({ _id: body.orgId });

      if (!org)
        return res
          .status(400)
          .json(
            createServerError(
              new Error(`L'organisation ${body.orgId} n'a pas pu être trouvé`)
            )
          );

      org = org.populate("orgSubscriptions");
      org = org.populate({
        path: "orgLists",
        populate: [{ path: "subscriptions" }]
      });
      org = await org.execPopulate();

      //log("> org.orgSubscriptions", org.orgSubscriptions);
      org.orgSubscriptions = org.orgSubscriptions.filter(
        ({ _id }) => !equals(_id, subscriptionId)
      );
      //log("> org.orgSubscriptions", org.orgSubscriptions);

      //log("> org.orgLists", org.orgLists);
      org.orgLists = org.orgLists.map((orgList) => ({
        listName: orgList.listName,
        subscriptions: orgList.subscriptions?.filter(
          ({ _id }) => !equals(_id, subscriptionId)
        )
      }));
      //log("> org.orgLists", org.orgLists);

      await org.save();

      //console.log("> subscription.orgs", subscription.orgs);
      subscription.orgs = subscription.orgs?.filter(
        (orgSubscription: IOrgSubscription) =>
          !equals(orgSubscription.orgId, body.orgId)
      );
      //console.log("> subscription.orgs", subscription.orgs);

      await subscription.save();

      return res.status(200).json(subscription);
      // .json(
      //   await subscription
      //     .populate("user", "-securityCode -password")
      //     .execPopulate()
      // );
    }
    //#endregion

    if (body.events) {
      const { eventId } = body.events[0];
      logJson(`DELETE /subscription/${subscriptionId}: eventId`, eventId);

      const event = await models.Event.findOne({ _id: eventId }).populate(
        "eventSubscriptions"
      );

      if (!event)
        return res
          .status(400)
          .json(
            createServerError(
              new Error(`L'événement ${eventId} n'a pas pu être trouvé`)
            )
          );

      logJson(
        `DELETE /subscription/${subscriptionId}: subscription`,
        subscription
      );
      subscription.events = subscription.events?.filter(
        (eventSubscription: IEventSubscription) => {
          let keep = true;
          if (equals(eventSubscription.eventId, eventId)) {
            keep = false;
          }
          return keep;
        }
      );
      await subscription.save();
      logJson(
        `DELETE /subscription/${subscriptionId}: subscription saved`,
        subscription
      );

      logJson(
        `DELETE /subscription/${subscriptionId}: event.eventSubscriptions`,
        event.eventSubscriptions
      );
      event.eventSubscriptions = event.eventSubscriptions.filter(
        (s) => !equals(s._id, subscription!._id)
      );
      await event.save();
      logJson(
        `DELETE /subscription/${subscriptionId}: event.eventSubscriptions`,
        event.eventSubscriptions
      );

      return res.status(200).json(subscription);
    }

    if (body.topicId) {
      subscription = await subscription
        .populate("topics", "topic")
        .execPopulate();

      logJson(
        `DELETE /subscription/${subscriptionId}: body.topicId`,
        body.topicId
      );
      logJson(
        `DELETE /subscription/${subscriptionId}: subscription`,
        subscription
      );

      subscription.topics = subscription.topics?.filter((topicSubscription) => {
        if (!topicSubscription.topic) return false;
        return !equals(topicSubscription.topic._id, body.topicId);
      });

      await subscription.save();
      logJson(
        `DELETE /subscription/${subscriptionId}: subscription saved`,
        subscription
      );

      return res.status(200).json(subscription);
    }

    logJson(
      `DELETE /subscription/${subscription._id}: subscription`,
      subscription
    );

    if (subscription.events)
      for (const eventSubscription of subscription.events) {
        const event = await models.Event.findOne({
          _id: eventSubscription.eventId
        });
        if (!event) continue;
        event.eventSubscriptions = event.eventSubscriptions.filter(
          (subscription) => {
            let keep = true;
            if (
              subscription.events?.find((eventSubscription) =>
                equals(eventSubscription.eventId, event._id)
              )
            )
              keep = false;
            return keep;
          }
        );
        logJson(
          `DELETE /subscription/${subscription._id}: event.eventSubscriptions`,
          event.eventSubscriptions
        );
        await event.save();
      }

    if (subscription.orgs)
      for (const orgSubscription of subscription.orgs) {
        const org = await models.Org.findOne({ _id: orgSubscription.orgId });
        if (!org) continue;
        org.orgSubscriptions = org.orgSubscriptions.filter((subscription) => {
          let keep = true;
          if (
            subscription.orgs?.find((orgSubscription) =>
              equals(orgSubscription.orgId, org._id)
            )
          )
            keep = false;
          return keep;
        });
        logJson(
          `DELETE /subscription/${subscription._id}: org.orgSubscriptions`,
          org.orgSubscriptions
        );
        await org.save();
      }

    const { deletedCount } = await models.Subscription.deleteOne({
      _id: subscriptionId
    });

    if (deletedCount !== 1) {
      subscription = await subscription
        .populate("user", "-securityCode -password")
        .execPopulate();

      const email =
        typeof subscription.user === "object"
          ? subscription.user.email
          : subscription.email;

      return res
        .status(400)
        .json(
          createServerError(
            new Error(`L'abonnement de ${email} n'a pas pu être supprimé`)
          )
        );
    }

    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json(createServerError(error));
  }
});

export default handler;
