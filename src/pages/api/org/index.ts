import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import { createServerError } from "utils/errors";
import { getSession } from "hooks/useAuth";

interface Response {}

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<NextApiRequest, NextApiResponse>(async function getOrgs(req, res) {
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
    const createdBy = req.query.userId || session.user.userId;

    try {
      const orgs = await models.Org.find({ createdBy }).populate(
        "orgSubscriptions"
      );

      if (orgs) {
        res.status(200).json(orgs);
      } else {
        res
          .status(404)
          .json(
            createServerError(
              new Error("Aucune organisation pour cet utilisateur")
            )
          );
      }
    } catch (error) {
      res.status(400).json(createServerError(error));
    }
  }
});

export default handler;
