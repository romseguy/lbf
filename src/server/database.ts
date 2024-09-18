import type { Db } from "mongodb";
import mongoose, { Model } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import { IEvent } from "models/Event";
import { EventSchema } from "models/Event/EventSchema";
import { IOrg } from "models/Org";
import { OrgSchema } from "models/Org/OrgSchema";
import { IGallery } from "models/Gallery";
import { GallerySchema } from "models/Gallery/GallerySchema";
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
import { DocumentSchema } from "models/Document/DocumentSchema";
import { IDocument } from "models/Document";

let cached = global.mongo;
if (!cached) {
  cached = global.mongo = { conn: null, promise: null, models: null };
}

export let db = cached.conn?.db as unknown as Db;
//@ts-ignore
export let models: {
  Document: Model<IDocument, {}, {}>;
  Event: Model<IEvent, {}, {}>;
  Org: Model<IOrg, {}, {}>;
  Gallery: Model<IGallery, {}, {}>;
  Project: Model<IProject, {}, {}>;
  Subscription: Model<ISubscription, {}, {}>;
  Setting: Model<ISetting, {}, {}>;
  Topic: Model<ITopic, {}, {}>;
  User: Model<IUser, {}, {}>;
} = cached.models || {
  Event: {},
  Org: {},
  Project: {},
  Subscription: {},
  Setting: {},
  Topic: {},
  User: {}
};

export default async function database(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) {
  if (cached.conn) db = cached.conn.db;

  if (!cached.models && cached.conn) {
    cached.models = models = {
      Document: cached.conn.model<IDocument>("Document", DocumentSchema),
      Event: cached.conn.model<IEvent>("Event", EventSchema),
      Org: cached.conn.model<IOrg>("Org", OrgSchema),
      Gallery: cached.conn.model<IGallery>("Gallery", GallerySchema),
      Project: cached.conn.model<IProject>("Project", ProjectSchema),
      Subscription: cached.conn.model<ISubscription>(
        "Subscription",
        SubscriptionSchema
      ),
      Setting: cached.conn.model<ISetting>("Setting", SettingSchema),
      Topic: cached.conn.model<ITopic>("Topic", TopicSchema),
      User: cached.conn.model<IUser>("User", UserSchema)
    };
  }

  if (cached.conn && next) return next();

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    // const options = {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   useFindAndModify: false,
    //   bufferCommands: false
    // };
    const options = {
      autoIndex: false,
      useUnifiedTopology: true,
      useNewUrlParser: true
    };

    cached.promise = mongoose.createConnection(
      process.env.DATABASE_URL,
      options
    );
    // cached.promise = mongoose
    //   .connect(process.env.DATABASE_URL, options)
    //   .then((mongoose) => {
    //     return mongoose;
    //   });
  }

  cached.conn = await cached.promise;
  db = cached.conn.db;

  if (!cached.models)
    cached.models = models = {
      Document: cached.conn.model<IDocument>("Document", DocumentSchema),
      Event: cached.conn.model<IEvent>("Event", EventSchema),
      Org: cached.conn.model<IOrg>("Org", OrgSchema),
      Gallery: cached.conn.model<IGallery>("Gallery", GallerySchema),
      Project: cached.conn.model<IProject>("Project", ProjectSchema),
      Subscription: cached.conn.model<ISubscription>(
        "Subscription",
        SubscriptionSchema
      ),
      Setting: cached.conn.model<ISetting>("Setting", SettingSchema),
      Topic: cached.conn.model<ITopic>("Topic", TopicSchema),
      User: cached.conn.model<IUser>("User", UserSchema)
    };

  return next ? next() : cached.conn;
}
