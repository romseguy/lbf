import type { ITopic } from "models/Topic";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import { createServerError } from "utils/errors";
import { getSession } from "hooks/useAuth";
import { emailR } from "utils/email";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<NextApiRequest, NextApiResponse>(async function getSubscription(
  req,
  res
) {
  const query: { userId?: string } = req.query;

  try {
    const subscription = await models.Subscription.findOne({
      user: query.userId
    });

    if (subscription) {
      res.status(200).json(subscription);
    } else {
      res
        .status(404)
        .json(
          createServerError(new Error("Le document n'a pas pu être trouvé"))
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
        query: { subscriptionName }
      } = req;

      let body = req.body;

      if (
        typeof body.subscriptionName === "string" &&
        !body.subscriptionNameLower
      ) {
        body.subscriptionNameLower = body.subscriptionName.toLowerCase();
      }

      if (
        Array.isArray(body.subscriptionEmailList) &&
        body.subscriptionEmailList.length > 0
      ) {
        body.subscriptionEmailList = body.subscriptionEmailList.filter(
          (email: string) => {
            if (!emailR.test(email)) {
              return false;
            }
            return true;
          }
        );

        //await models.
      }

      const { n, nModified } = await models.Subscription.updateOne(
        { subscriptionName },
        body
      );

      if (nModified === 1) {
        res.status(200).json({});
      } else {
        res
          .status(400)
          .json(
            createServerError(
              new Error(
                `L'subscriptionanisation ${subscriptionName} n'a pas pu être modifiée`
              )
            )
          );
      }
    } catch (error) {
      res.status(400).json(createServerError(error));
    }
  }
});

handler.delete(async function removeSubscription(req, res) {
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
    const {
      query: { subscriptionName }
    } = req;

    try {
      const subscription = await models.Subscription.findOne({
        subscriptionName
      });
      const { deletedCount } = await models.Subscription.deleteOne({
        subscriptionName
      });

      if (deletedCount === 1) {
        res.status(200).json(subscription);
      } else {
        res
          .status(400)
          .json(
            createServerError(
              new Error(
                `L'subscriptionanisation ${subscriptionName} n'a pas pu être supprimé`
              )
            )
          );
      }
    } catch (error) {
      res.status(500).json(createServerError(error));
    }
  }
});

export default handler;
