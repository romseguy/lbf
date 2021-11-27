import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database from "database";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<NextApiRequest, NextApiResponse>(async function postOrg(req, res) {
  res.status(200).json({});
});

export default handler;
