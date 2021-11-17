import mongodb from "mongodb";
import mongoose, { Connection, Document, Model } from "mongoose";
import nextConnect from "next-connect";
import { IEvent, EventSchema } from "models/Event";
import { IOrg, OrgSchema } from "models/Org";
import { IProject, ProjectSchema } from "models/Project";
import { ISubscription, SubscriptionSchema } from "models/Subscription";
import { ITopic, TopicSchema } from "models/Topic";
import { IUser, UserSchema } from "models/User";

export type IEntity = IEvent | IOrg | IProject | ISubscription | ITopic | IUser;
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

export const collectionKeys = [
  "events",
  "orgs",
  "projects",
  "subscriptions",
  "topics",
  "users"
];
export const collectionToModelKeys: { [key: string]: AppModelKey } = {
  events: "Event",
  orgs: "Org",
  projects: "Project",
  subscriptions: "Subscription",
  topics: "Topic",
  users: "User"
};
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
    connection = await mongoose.createConnection(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
  }

  db = connection.db;
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
}
