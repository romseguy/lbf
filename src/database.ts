import { IncomingMessage, ServerResponse } from "http";
import type { Db } from "mongodb";
import mongoose, { Model } from "mongoose";
import nextConnect, { NextHandler } from "next-connect";
import { IEvent } from "models/Event";
import { EventSchema } from "models/Event/EventSchema";
import { IOrg } from "models/Org";
import { OrgSchema } from "models/Org/OrgSchema";
import { IProject } from "models/Project";
import { ProjectSchema } from "models/Project/ProjectSchema";
import { ISubscription } from "models/Subscription";
import { SubscriptionSchema } from "models/Subscription/SubscriptionSchema";
import { ITopic } from "models/Topic";
import { TopicSchema } from "models/Topic/TopicSchema";
import { IUser } from "models/User";
import { UserSchema } from "models/User/UserSchema";

export type AppModelKey =
  | "Event"
  | "Org"
  | "Project"
  | "Subscription"
  | "Topic"
  | "User";
export type AppModels = {
  Event: Model<IEvent, {}, {}>;
  Org: Model<IOrg, {}, {}>;
  Project: Model<IProject, {}, {}>;
  Subscription: Model<ISubscription, {}, {}>;
  Topic: Model<ITopic, {}, {}>;
  User: Model<IUser, {}, {}>;
};

export const collectionToModelKeys: { [key: string]: AppModelKey } = {
  events: "Event",
  orgs: "Org",
  projects: "Project",
  subscriptions: "Subscription",
  topics: "Topic",
  users: "User"
};
export let db: Db;
export let models: AppModels;

const connection = mongoose.createConnection(process.env.DATABASE_URL);
export const clientPromise = connection.then((connection) =>
  connection.getClient()
);
const modelsPromise = connection.then((connection) => {
  return {
    Event: connection.model<IEvent>("Event", EventSchema),
    Org: connection.model<IOrg>("Org", OrgSchema),
    Project: connection.model<IProject>("Project", ProjectSchema),
    Subscription: connection.model<ISubscription>(
      "Subscription",
      SubscriptionSchema
    ),
    Topic: connection.model<ITopic>("Topic", TopicSchema),
    User: connection.model<IUser>("User", UserSchema)
  };
});

let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

async function database(
  req: IncomingMessage,
  res: ServerResponse,
  next: NextHandler
) {
  if (!cached.promise) {
    cached.promise = (await clientPromise).connect().then((client) => {
      const db = client.db("assolidaires");

      return {
        client,
        db
      };
    });
    cached.conn = await cached.promise;

    if (process.env.NODE_ENV === "production") models = await modelsPromise;
  }

  if (process.env.NODE_ENV === "development") models = await modelsPromise;

  if (cached.conn?.db) db = cached.conn.db;
  // req.dbClient = cached.conn.client;
  // req.db = cached.conn.db;

  return next();
}

const middleware = nextConnect();
middleware.use(database);
export default middleware;
