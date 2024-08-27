import type { Db } from "mongodb";
import mongoose, { Model } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import { IEvent } from "models/Event";
import { EventSchema } from "models/Event/EventSchema";
import { IOrg } from "models/Org";
import { OrgSchema } from "models/Org/OrgSchema";
import { IProject } from "models/Project";
import { ProjectSchema } from "models/Project/ProjectSchema";
import { ISubscription } from "models/Subscription";
import { SubscriptionSchema } from "models/Subscription/SubscriptionSchema";
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
  autoIndex: false
});
const clientPromise = connection.then((connection) => connection.getClient());
const modelsPromise = connection.then((connection) => {
  return {
    Event: connection.model<IEvent>("Event", EventSchema),
    Org: connection.model<IOrg>("Org", OrgSchema),
    Project: connection.model<IProject>("Project", ProjectSchema),
    Subscription: connection.model<ISubscription>(
      "Subscription",
      SubscriptionSchema
    ),
    Setting: connection.model<ISetting>("Setting", SettingSchema),
    Topic: connection.model<ITopic>("Topic", TopicSchema),
    User: connection.model<IUser>("User", UserSchema)
  };
});

export let db: Db;
export let models: {
  Event: Model<IEvent, {}, {}>;
  Org: Model<IOrg, {}, {}>;
  Project: Model<IProject, {}, {}>;
  Subscription: Model<ISubscription, {}, {}>;
  Setting: Model<ISetting, {}, {}>;
  Topic: Model<ITopic, {}, {}>;
  User: Model<IUser, {}, {}>;
};
export default async function database(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) {
  if (!cached.promise) {
    cached.promise = (await clientPromise).connect().then((client) => {
      const db = client.db(getEnv() === "test" ? "testing" : "assolidaires");

      return {
        client,
        db
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
