import type { IEvent } from "models/Event";
import type { IOrg } from "models/Org";
import type { ISubscription } from "models/Subscription";
import type { ITopic } from "models/Topic";
import type { IUser } from "models/User";
import mongodb from "mongodb";
import mongoose, { Connection, Document, Model } from "mongoose";
import nextConnect from "next-connect";
import { EventSchema } from "models/Event";
import { OrgSchema } from "models/Org";
import { UserSchema } from "models/User";
import { SubscriptionSchema } from "models/Subscription";
import { TopicSchema } from "models/Topic";

let connection: Connection;
export let db: mongodb.Db;
export let models: {
  Event: Model<IEvent & Document<any, any, any>, {}, {}>;
  Org: Model<IOrg & Document<any, any, any>, {}, {}>;
  Subscription: Model<ISubscription & Document<any, any, any>, {}, {}>;
  Topic: Model<ITopic & Document<any, any, any>, {}, {}>;
  User: Model<IUser & Document<any, any, any>, {}, {}>;
};
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
      Event: connection.model<IEvent & Document>("Event", EventSchema),
      Org: connection.model<IOrg & Document>("Org", OrgSchema),
      Subscription: connection.model<ISubscription & Document>(
        "Subscription",
        SubscriptionSchema
      ),
      Topic: connection.model<ITopic & Document>("Topic", TopicSchema),
      User: connection.model<IUser & Document>("User", UserSchema)
    };
  }

  return connection;
};

middleware.use(async (req, res, next) => {
  await connectToDatabase();
  return next();
});

export default middleware;
