import { Document } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import {
  createServerError,
  databaseErrorCodes,
  duplicateError
} from "utils/errors";
import { getSession } from "hooks/useAuth";
import { logJson, normalize } from "utils/string";
import { IOrg, Visibility } from "models/Org";
import { randomNumber } from "utils/randomNumber";

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

    let orgs: (IOrg & Document<any, any, IOrg>)[] = [];
    const selector = createdBy
      ? { createdBy }
      : { orgVisibility: Visibility[Visibility.PUBLIC] };

    logJson(`GET /orgs: selector`, selector);

    if (populate)
      orgs = await models.Org.find(selector, "-orgBanner -orgLogo").populate(
        populate
      );
    else orgs = await models.Org.find(selector, "-orgBanner -orgLogo");

    res.status(200).json(orgs);
  } catch (error) {
    res.status(500).json(createServerError(error));
  }
});

handler.post<NextApiRequest & { body: IOrg }, NextApiResponse>(
  async function postOrg(req, res) {
    const session = await getSession({ req });

    if (!session)
      return res
        .status(403)
        .json(createServerError(new Error("Vous devez être identifié")));

    try {
      let { body }: { body: IOrg } = req;
      body = {
        ...body,
        isApproved: session.user.isAdmin,
        orgName: body.orgName.trim(),
        orgUrl: normalize(body.orgName)
      };

      const org = await models.Org.findOne({ orgUrl: body.orgUrl });
      const user = await models.User.findOne({ userName: body.orgUrl });
      const event = await models.Event.findOne({ eventUrl: body.orgUrl });

      if (org || user || event) {
        const uid = randomNumber(2);
        body = {
          ...body,
          orgName: body.orgName + "-" + uid,
          orgUrl: body.orgUrl + "-" + uid
        };
      }

      logJson(`POST /orgs: create`, body);
      const doc = await models.Org.create(body);

      res.status(200).json(doc);
    } catch (error: any) {
      res.status(500).json(createServerError(error));
    }
  }
);

export default handler;
