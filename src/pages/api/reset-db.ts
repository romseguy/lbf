import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { db } from "database";
import { createServerError } from "utils/errors";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<NextApiRequest, NextApiResponse>(async function resetDb(req, res) {
  if (!process.env.NEXT_PUBLIC_IS_TEST) {
    res.status(404).send("Not Found");
    return;
  }

  try {
    await Promise.all([db.dropCollection("events"), db.dropCollection("orgs")]);
    res.status(200).send("Database reset");
  } catch (error) {
    res.status(200).send("Database already reset");
  }
});

export default handler;
