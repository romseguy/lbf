import type { IEvent } from "./Event";
import type { IOrg } from "./Org";
import type { ITopic } from "./Topic";
import type { IUser } from "models/User";
import { Schema } from "mongoose";

export interface IOrgSubscription {
  orgId: string;
  org: IOrg /* | string*/;
  type: string;
}
export interface ISubscription {
  _id: string;
  user?: IUser;
  email?: string;
  events: [{ event: IEvent }];
  orgs: IOrgSubscription[];
  topics: [{ topic: ITopic }];
}

export const SubscriptionTypes: { [key: string]: string } = {
  SUBSCRIBER: "SUBSCRIBER",
  FOLLOWER: "FOLLOWER"
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
        type: {
          type: String,
          enum: Object.keys(SubscriptionTypes).map(
            (key) => SubscriptionTypes[key]
          ),
          required: true
        }
      }
    ],
    topics: [
      {
        topic: {
          type: Schema.Types.ObjectId,
          ref: "Topic"
        }
      }
    ]
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
