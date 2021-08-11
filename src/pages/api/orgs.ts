import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import {
  createServerError,
  databaseErrorCodes,
  duplicateError
} from "utils/errors";
import { getSession } from "hooks/useAuth";
import { normalize } from "utils/string";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<
  NextApiRequest & {
    query: { populate: string };
  },
  NextApiResponse
>(async function getOrgs(req, res) {
  try {
    const {
      query: { populate }
    } = req;

    let orgs = await models.Org.find({}, { orgBanner: 0 });

    if (populate) {
      for (let org of orgs) {
        org = await org.populate(populate).execPopulate();
      }
    }

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
          new Error("Vous devez être identifié pour accéder à ce contenu")
        )
      );
  } else {
    try {
      const orgUrl = normalize(req.body.orgName);
      const org = await models.Org.findOne({ orgUrl });
      if (org) throw duplicateError;
      const user = await models.User.findOne({ userName: req.body.orgName });
      if (user) throw duplicateError;
      const event = await models.Event.findOne({ eventUrl: orgUrl });
      if (event) throw duplicateError;
      const doc = await models.Org.create({
        ...req.body,
        orgNameLower: req.body.orgName.toLowerCase(),
        orgUrl
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
