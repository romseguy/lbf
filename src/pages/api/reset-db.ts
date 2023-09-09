import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { db } from "server/database";
const { getEnv } = require("utils/env");

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<NextApiRequest, NextApiResponse>(async function resetDb(req, res) {
  if (getEnv() === "production") return res.status(404).send("Not Found");

  try {
    const collections = await db.collections();
    // console.log(
    // "🚀 ~ file: reset-db.ts:15 ~ resetDb ~ collections:",
    // collections
    // );

    for (const collection of collections) {
      // console.log(
      // "🚀 ~ file: reset-db.ts:21 ~ resetDb ~ collection:",
      // collection
      // );

      if (typeof req.query.list === "string") {
        if (req.query.list.split(" ").includes(collection.collectionName)) {
          console.log("🚀 ~ dropping collection:", collection.collectionName);
          collection.drop();
        }
      } else if (collection.collectionName !== "users") {
        console.log("🚀 ~ dropping collection:", collection.collectionName);
        collection.drop();
      }
    }

    return res.status(200).send("Database reset");
  } catch (error) {
    console.error("GET /reset-db: error", error);
    res.status(200).send("Database reset error");
  }
});

export default handler;
