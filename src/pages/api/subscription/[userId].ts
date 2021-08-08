import type { IOrgSubscription, ISubscription } from "models/Subscription";
import type { ITopic } from "models/Topic";
import type { IUser } from "models/User";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import { createServerError } from "utils/errors";
import { getSession } from "hooks/useAuth";
import { emailR } from "utils/email";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<
  NextApiRequest & {
    query: { userId: string };
  },
  NextApiResponse
>(async function getSubscription(req, res) {
  try {
    const {
      query: { userId }
    } = req;

    let selector: { user?: IUser; email?: string } = {};

    if (emailR.test(userId)) {
      const user = await models.User.findOne({ email: userId });
      if (user) selector = { user };
      else selector = { email: userId };
    }

    const subscription = await models.Subscription.findOne(selector)
      .populate("user", "-email -password -securityCode -userImage")
      .populate({
        path: "orgs",
        populate: { path: "org" }
      })
      .populate({
        path: "topics",
        populate: { path: "topic" }
      });
    if (subscription) {
      res.status(200).json(subscription);
    } else {
      res
        .status(404)
        .json(
          createServerError(
            new Error("Aucun abonnement trouvé pour cette adresse e-mail")
          )
        );
    }
  } catch (error) {
    res.status(400).json(createServerError(error));
  }
});

handler.put<NextApiRequest, NextApiResponse>(async function editSubscription(
  req,
  res
) {
  const session = await getSession({ req });

  if (!session) {
    res
      .status(403)
      .json(
        createServerError(
          new Error("Vous devez être identifié pour accéder à ce contenu.")
        )
      );
  } else {
    try {
      const {
        query: { userId: subscriptionId }
      } = req;

      let body = req.body;

      const { n, nModified } = await models.Subscription.updateOne(
        { _id: subscriptionId },
        body
      );

      if (nModified === 1) {
        res.status(200).json({});
      } else {
        res
          .status(400)
          .json(
            createServerError(new Error(`L'abonnement n'a pas pu être modifié`))
          );
      }
    } catch (error) {
      res.status(400).json(createServerError(error));
    }
  }
});

handler.delete<
  NextApiRequest & {
    query: { userId: string };
    body: {
      orgs?: IOrgSubscription[];
      orgId?: string;
      topicId?: string;
    };
  },
  NextApiResponse
>(async function removeSubscription(req, res) {
  const session = await getSession({ req });

  const {
    query: { userId: subscriptionId },
    body
  }: {
    query: { userId: string };
    body: {
      orgs?: IOrgSubscription[];
      orgId?: string;
      topicId?: string;
    };
  } = req;

  try {
    const subscription = await models.Subscription.findOne({
      _id: subscriptionId
    }).populate({
      path: "topics",
      populate: "topic"
    });

    if (!subscription) {
      return res
        .status(404)
        .json(
          createServerError(new Error(`L'abonnement n'a pas pu être trouvé`))
        );
    }

    if (body.orgs) {
      console.log("unsubbing from org", body.orgs[0]);
      const { orgId, type } = body.orgs[0];
      subscription.orgs = subscription.orgs.filter(
        (orgSubscription: IOrgSubscription) => {
          let allow = true;

          if (orgSubscription.orgId.toString() === orgId) {
            if (orgSubscription.type === type) {
              allow = false;
            }
          }

          return allow;
        }
      );
      await subscription.save();
      res.status(200).json(subscription);
    } else if (body.topicId) {
      //console.log("unsubbing from topic", body.topicId);
      subscription.topics = subscription.topics.filter(
        ({ topic }: { topic: ITopic }) => {
          let allow = false;
          allow = topic._id?.toString() !== body.topicId;
          return allow;
        }
      );
      await subscription.save();
      res.status(200).json(subscription);
    } else {
      console.log("unsubbing user");
      const { deletedCount } = await models.Subscription.deleteOne({
        _id: subscriptionId
      });

      if (body.orgId) {
        const org = await models.Org.findOne({
          _id: body.orgId
        });

        if (org) {
          org.orgSubscriptions = org.orgSubscriptions.filter(
            (subscription: ISubscription) => {
              return subscription._id.toString() !== subscriptionId;
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
