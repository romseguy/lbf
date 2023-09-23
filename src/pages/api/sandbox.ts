import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "server/database";
import { createServerError } from "utils/errors";

const handler = nextConnect<NextApiRequest, NextApiResponse>()
  .use(database)
  .get<NextApiRequest, NextApiResponse>(async function check(req, res) {
    try {
      const s = await models.Subscription.find(
        {
          orgs: { $elemMatch: { orgId: "62a349f45ab90133eb880f22" } }
        },
        "user email events orgs"
      );
      // .populate([
      //   { path: "orgs", populate: [{ path: "org", select: "_id" }] }
      // ]);
      res.status(200).json(s);
    } catch (error) {
      res.status(404).json(createServerError(error));
    }
  });

export default handler;
