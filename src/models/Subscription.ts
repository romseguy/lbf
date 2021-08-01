import type { IEvent } from "./Event";
import type { IOrg } from "./Org";
import type { IUser } from "models/User";
import { Schema } from "mongoose";
import { ITopic, TopicSchema } from "./Topic";

export interface IOrgSubscription {
  orgId: string;
  org: IOrg /* | string*/;
  topics?: ITopic[];
  type: string;
}
export interface ISubscription {
  _id: string;
  user?: IUser;
  email?: string;
  events?: [
    {
      event: IEvent;
      topics?: ITopic[];
    }
  ];
  orgs?: IOrgSubscription[];
}

export const SubscriptionTypes: { [key: string]: string } = {
  SUBSCRIBER: "SUBSCRIBER",
  FOLLOWER: "FOLLOWER",
  BOTH: "BOTH"
};

export const SubscriptionSchema = new Schema<ISubscription>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    email: String,
    events: [
      {
        event: {
          type: Schema.Types.ObjectId,
          ref: "Event"
        },
        topics: {
          type: Schema.Types.ObjectId,
          ref: "Topic"
        }
      }
    ],
    orgs: [
      {
        orgId: {
          type: Schema.Types.ObjectId,
          required: true
        },
        org: {
          type: Schema.Types.ObjectId,
          ref: "Org"
        },
        topics: {
          type: Schema.Types.ObjectId,
          ref: "Topic"
        },
        type: {
          type: String,
          enum: Object.keys(SubscriptionTypes).map(
            (key) => SubscriptionTypes[key]
          ),
          required: true
        }
      }
    ]
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
