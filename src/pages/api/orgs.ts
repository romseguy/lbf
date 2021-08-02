import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import {
  createServerError,
  databaseErrorCodes,
  duplicateError
} from "utils/errors";
import { getSession } from "hooks/useAuth";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<NextApiRequest, NextApiResponse>(async function getOrgs(req, res) {
  try {
    const orgs = await models.Org.find({}).sort({
      orgName: "ascending"
    });

    res.status(200).json(orgs);
  } catch (error) {
    res.status(500).json(createServerError(error));
  }
});

handler.post<NextApiRequest, NextApiResponse>(async function postOrg(req, res) {
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
      const org = await models.Org.findOne({ orgName: req.body.orgName });
      if (org) throw duplicateError;
      const user = await models.User.findOne({ userName: req.body.orgName });
      if (user) throw duplicateError;
      const event = await models.Event.findOne({ eventName: req.body.orgName });
      if (event) throw duplicateError;
      const doc = await models.Org.create({
        ...req.body,
        orgNameLower: req.body.orgName.toLowerCase()
      });
      res.status(200).json(doc);
    } catch (error) {
      if (error.code && error.code === databaseErrorCodes.DUPLICATE_KEY) {
        res.status(400).json({
          orgName: "Ce nom n'est pas disponible"
        });
      } else {
        res.status(500).json(createServerError(error));
      }
    }
  }
});

export default handler;
