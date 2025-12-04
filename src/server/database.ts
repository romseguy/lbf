import type { Db } from "mongodb";
import mongoose, { Model } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import { IOrg } from "models/Org";
import { OrgSchema } from "models/Org/OrgSchema";
import { ISetting } from "models/Setting";
import { SettingSchema } from "models/Setting/SettingSchema";
import { ITopic } from "models/Topic";
import { TopicSchema } from "models/Topic/TopicSchema";
import { IUser } from "models/User";
import { UserSchema } from "models/User/UserSchema";
const { getEnv } = require("utils/env");

let cached = global.mongo;
if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}
console.log(process.env.DATABASE_URL);
const connection = mongoose.createConnection(process.env.DATABASE_URL, {
  autoIndex: false,
});
const clientPromise = connection.then((connection) => connection.getClient());
const modelsPromise = connection.then((connection) => {
  return {
    Org: connection.model<IOrg>("Org", OrgSchema),
    Setting: connection.model<ISetting>("Setting", SettingSchema),
    Topic: connection.model<ITopic>("Topic", TopicSchema),
    User: connection.model<IUser>("User", UserSchema),
  };
});

export let db: Db;
export let models: {
  Org: Model<IOrg, {}, {}>;
  Setting: Model<ISetting, {}, {}>;
  Topic: Model<ITopic, {}, {}>;
  User: Model<IUser, {}, {}>;
};
export default async function database(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler,
) {
  if (!cached.promise) {
    cached.promise = (await clientPromise).connect().then((client) => {
      const db = client.db(getEnv() === "test" ? "testing" : "assolidaires");

      return {
        client,
        db,
      };
    });
    cached.conn = await cached.promise;

    if (getEnv() === "production") models = await modelsPromise;
  }

  if (getEnv() === "development" || getEnv() === "test")
    models = await modelsPromise;

  if (cached.conn?.db) db = cached.conn.db;
  // req.dbClient = cached.conn.client;
  // req.db = cached.conn.db;

  return next();
}
