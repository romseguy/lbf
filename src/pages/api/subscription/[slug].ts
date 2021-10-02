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

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<NextApiRequest & { query: { slug: string } }, NextApiResponse>(
  async function getSubscription(req, res) {
    try {
      const session = await getSession({ req });
      const {
        query: { slug }
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

      subscription = await subscription
        .populate({ path: "events", populate: { path: "event" } })
        .populate({ path: "orgs", populate: { path: "org" } })
        .populate({ path: "topics", populate: { path: "topic" } })
        .execPopulate();

      res.status(200).json(subscription);
    } catch (error) {
      res.status(500).json(createServerError(error));
    }
  }
);

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
    body: { orgs?: IOrgSubscription[]; orgId?: string; topicId?: string };
  },
  NextApiResponse
>(async function removeSubscription(req, res) {
  const session = await getSession({ req });

  const {
    query: { slug: _id },
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
      _id
    });

    if (!subscription) {
      return res
        .status(404)
        .json(
          createServerError(
            new Error(`L'abonnement ${_id} n'a pas pu être trouvé`)
          )
        );
    }

    if (body.orgs) {
      // console.log("unsubbing from org", body.orgs[0]);
      const { orgId, type } = body.orgs[0];
      subscription.orgs = subscription.orgs.filter(
        (orgSubscription: IOrgSubscription) => {
          let allow = true;

          if (equals(orgSubscription.orgId, orgId)) {
            if (orgSubscription.type === type) {
              allow = false;
            }
          }

          return allow;
        }
      );
      await subscription.save();
      res.status(200).json(subscription);
    } else if (body.events) {
      // console.log("unsubbing from event", body.events[0]);
      const { eventId } = body.events[0];
      subscription.events = subscription.events.filter(
        (eventSubscription: IEventSubscription) => {
          let keep = true;

          if (equals(eventSubscription.eventId, eventId)) {
            keep = false;
          }

          return keep;
        }
      );
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
      await subscription.save();
      res.status(200).json(subscription);
    } else {
      // console.log("unsubbing user");
      const { deletedCount } = await models.Subscription.deleteOne({
        _id
      });

      if (body.orgId) {
        const org = await models.Org.findOne({
          _id: body.orgId
        });

        if (org) {
          org.orgSubscriptions = org.orgSubscriptions.filter(
            (subscription: ISubscription) => {
              return !equals(subscription._id, _id);
            }
          );
          await org.save();
        }
      }

      if (deletedCount === 1) {
        res.status(200).json(subscription);
      } else {
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
