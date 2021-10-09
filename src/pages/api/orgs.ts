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
import { IOrg } from "models/Org";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<
  NextApiRequest & {
    query: { populate?: string; createdBy?: string };
  },
  NextApiResponse
>(async function getOrgs(req, res) {
  try {
    const {
      query: { populate, createdBy }
    } = req;

    let orgs;
    let select = createdBy ? { createdBy } : {};

    if (populate) {
      orgs = await models.Org.find(select, { orgBanner: 0 }).populate(populate);
    } else {
      orgs = await models.Org.find(select, { orgBanner: 0 });
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
      let { body }: { body: IOrg } = req;
      body = { ...body, orgName: body.orgName.trim() };
      const orgUrl = normalize(body.orgName);

      const org = await models.Org.findOne({ orgUrl });
      if (org) throw duplicateError;
      const user = await models.User.findOne({ userName: body.orgName });
      if (user) throw duplicateError;
      const event = await models.Event.findOne({ eventUrl: orgUrl });
      if (event) throw duplicateError;
      const doc = await models.Org.create({
        ...req.body,
        orgUrl,
        isApproved: false
      });
      res.status(200).json(doc);
    } catch (error: any) {
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
