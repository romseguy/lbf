import mongodb from "mongodb";
import mongoose, { Connection, Document, Model } from "mongoose";
import nextConnect from "next-connect";
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

declare const global: NodeJS.Global &
  typeof globalThis & {
    _mongoClientPromise: Promise<mongodb.MongoClient>;
  };

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
export let clientPromise: Promise<mongodb.MongoClient>;
export let db: mongodb.Db;
export let models: AppModels;

const middleware = nextConnect();
middleware.use(async (req, res, next) => {
  await connectToDatabase();
  return next();
});

export default middleware;

let connection: Connection;

async function connectToDatabase() {
  if (!connection) {
    mongoose.set("useFindAndModify", true);
    mongoose.set("useNewUrlParser", true);
    mongoose.set("useUnifiedTopology", true);
    connection = await mongoose.createConnection(process.env.DATABASE_URL);
  }

  models = {
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

  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = connection.getClient().connect();
      clientPromise = global._mongoClientPromise;
    }
  } else {
    clientPromise = connection.getClient().connect();
  }

  db = connection.db;
}
