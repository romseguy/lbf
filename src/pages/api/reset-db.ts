import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { db } from "database";
const { getEnv } = require("utils/env");

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<NextApiRequest, NextApiResponse>(async function resetDb(req, res) {
  if (getEnv() === "production") return res.status(404).send("Not Found");

  let collectionsToDrop: string[] | undefined;

  try {
    collectionsToDrop =
      typeof req.query.list === "string"
        ? req.query.list.split(" ")
        : (await db.listCollections().toArray()).map(
            (collection) => collection.name
          );

    for (let i = 0; i < collectionsToDrop.length; i++) {
      if (collectionsToDrop[i] === "users" && !req.query.list) continue;
      await db.dropCollection(collectionsToDrop[i]);
    }

    return res.status(200).send("Database reset");
  } catch (error) {
    console.error("GET /reset-db: error", error);
    res.status(200).send("Database already reset");
  }
});

export default handler;
