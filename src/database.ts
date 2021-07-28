import mongodb from "mongodb";
import nextConnect from "next-connect";
import mongoose, { Connection, Model } from "mongoose";
import { EventSchema } from "models/Event";
import { OrgSchema } from "models/Org";
import { UserSchema } from "models/User";
import { TopicSchema } from "models/Topic";
import { TopicMessageSchema } from "models/TopicMessage";

let connection: Connection;
export let db: mongodb.Db;
export let models: { [key: string]: Model<any> } = {};
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
