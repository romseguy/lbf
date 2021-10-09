import type {
  IEventSubscription,
  IOrgSubscription,
  ISubscription
} from "models/Subscription";
import type { ITopic } from "models/Topic";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import { createServerError } from "utils/errors";
import { getSession } from "hooks/useAuth";
import { equals } from "utils/string";
import { emailR } from "utils/email";
import { IUser } from "models/User";
import { hasItems } from "utils/array";

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

    if (populate) subscription.populate(populate);

    subscription = subscription
      .populate({ path: "events", populate: { path: "event" } })
      .populate({ path: "orgs", populate: { path: "org" } })
      .populate({ path: "topics", populate: { path: "topic" } });

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
      res
        .status(403)
        .json(
          createServerError(
            new Error("Vous devez être identifié pour accéder à ce contenu")
          )
        );
    } else {
      try {
        const {
          query: { slug }
        } = req;

        let body = req.body;

        const { n, nModified } = await models.Subscription.updateOne(
          { _id: slug },
          body
        );

        if (nModified === 1) {
          res.status(200).json({});
        } else {
          res
            .status(400)
            .json(
              createServerError(
                new Error(`L'abonnement n'a pas pu être modifié`)
              )
            );
        }
      } catch (error) {
        res.status(500).json(createServerError(error));
      }
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
      let orgSubscription: IOrgSubscription | undefined;

      if (hasItems(body.orgs)) {
        orgSubscription = body.orgs[0];
      }

      // todo http status code unchanged
      if (!orgSubscription) return res.status(200).json(subscription);

      const { orgId, type } = orgSubscription;

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

      console.log("unsubbing from org", org);

      subscription = await subscription
        .populate("user", "-securityCode -password")
        .execPopulate();

      subscription.orgs = subscription.orgs.filter(
        (orgSubscription: IOrgSubscription) => {
          let keep = true;

          if (equals(orgSubscription.orgId, orgId)) {
            if (orgSubscription.type === type) {
              keep = false;
            }
          }

          return keep;
        }
      );

      console.log("saving subscription", subscription);
      await subscription.save();

      res.status(200).json(subscription);
    } else if (body.orgId) {
      const org = await models.Org.findOne({ _id: body.orgId }).populate(
        "orgSubscriptions"
      );

      if (!org)
        return res
          .status(400)
          .json(
            createServerError(
              new Error(`L'organisation ${body.orgId} n'a pas pu être trouvé`)
            )
          );

      console.log("unsubbing from org", org);

      org.orgSubscriptions = org.orgSubscriptions.filter((subscription) => {
        let keep = true;

        if (equals(subscription._id, subscriptionId)) {
          keep = false;
        }

        return keep;
      });

      console.log("saving org", org);
      await org.save();

      subscription = await subscription
        .populate("user", "-securityCode -password")
        .execPopulate();

      subscription.orgs = subscription.orgs.filter(
        (orgSubscription: IOrgSubscription) => {
          let keep = true;

          if (equals(orgSubscription.orgId, body.orgId)) {
            keep = false;
          }

          return keep;
        }
      );

      console.log("saving subscription", subscription);
      await subscription.save();

      res.status(200).json(subscription);
    } else if (body.events) {
      const { eventId } = body.events[0];
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

      console.log("unsubbing from event", event);

      subscription = await subscription
        .populate("user", "-securityCode -password")
        .execPopulate();

      event.eventSubscriptions = event.eventSubscriptions.filter(
        (subscription) => {
          let keep = true;
          if (
            subscription.events.find((eventSubscription) =>
              equals(eventSubscription.eventId, eventId)
            )
          )
            keep = false;
          return keep;
        }
      );
      await event.save();

      subscription.events = subscription.events.filter(
        (eventSubscription: IEventSubscription) => {
          let keep = true;

          if (equals(eventSubscription.eventId, eventId)) {
            keep = false;
          }

          return keep;
        }
      );

      console.log("saving subscription", subscription);
      await subscription.save();

      res.status(200).json(subscription);
    } else if (body.topicId) {
      // console.log("unsubbing from topic", body.topicId);
      subscription = await subscription
        .populate({ path: "topics", populate: { path: "topic" } })
        .execPopulate();

      subscription.topics = subscription.topics.filter(
        ({ topic }: { topic: ITopic }) => {
          let allow = false;
          allow = !equals(topic._id, body.topicId);
          return allow;
        }
      );

      console.log("saving subscription", subscription);
      await subscription.save();

      res.status(200).json(subscription);
    } else {
      console.log("deleting subscription", subscription);

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
        await event.save();
      }

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
        await org.save();
      }

      const { deletedCount } = await models.Subscription.deleteOne({
        _id: subscriptionId
      });

      if (deletedCount === 1) {
        res.status(200).json(subscription);
      } else {
        subscription = await subscription
          .populate("user", "-securityCode -password")
          .execPopulate();

        const email =
          typeof subscription.user === "object"
            ? subscription.user.email
            : subscription.email;
        res
          .status(400)
          .json(
            createServerError(
              new Error(
                `Les abonnements de ${email} n'ont pas pu être supprimés`
              )
            )
          );
      }
    }
  } catch (error) {
    res.status(500).json(createServerError(error));
  }
});

export default handler;
