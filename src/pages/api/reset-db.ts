import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { collectionKeys, db } from "database";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<NextApiRequest, NextApiResponse>(async function resetDb(req, res) {
  if (process.env.NODE_ENV === "production")
    return res.status(404).send("Not Found");

  try {
    for (const key of collectionKeys) {
      if (key === "users") continue;

      await db.dropCollection(key);
    }

    return res.status(200).send("Database reset");
  } catch (error) {
    res.status(200).send("Database already reset");
  }
});

export default handler;
