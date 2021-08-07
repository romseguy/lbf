import type { IEvent } from "models/Event";
import type { IOrg } from "models/Org";
import type { ISubscription } from "models/Subscription";
import type { IUser } from "models/User";
import mongodb from "mongodb";
import nextConnect from "next-connect";
import mongoose, { Connection, Model } from "mongoose";
import { EventSchema } from "models/Event";
import { OrgSchema } from "models/Org";
import { UserSchema } from "models/User";
import { SubscriptionSchema } from "models/Subscription";
import { TopicSchema } from "models/Topic";

let connection: Connection;
export let db: mongodb.Db;
export let models: { [key: string]: Model<any> } = {};
// export let models: {
//   Event: Model<IEvent>;
//   Org: Model<IOrg>;
//   Subscription: Model<ISubscription>;
//   User: Model<IUser>;
// } = {
//   Event: mongoose.model("Event", EventSchema),
//   Org: mongoose.model("Org", OrgSchema),
//   Subscription: mongoose.model("Subscription", SubscriptionSchema),
//   User: mongoose.model("User", UserSchema)
// };
const middleware = nextConnect();

export const connectToDatabase = async () => {
  if (!connection) {
    connection = await mongoose.createConnection(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });

    db = connection.db;

    models = {
      Event: connection.model("Event", EventSchema),
      Org: connection.model("Org", OrgSchema),
      Subscription: connection.model("Subscription", SubscriptionSchema),
      Topic: connection.model("Topic", TopicSchema),
      User: connection.model("User", UserSchema)
    };
  }

  return connection;
};

middleware.use(async (req, res, next) => {
  await connectToDatabase();
  return next();
});

export default middleware;
