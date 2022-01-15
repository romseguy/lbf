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
