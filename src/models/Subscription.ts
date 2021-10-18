import type { IEvent } from "./Event";
import type { IOrg } from "./Org";
import type { ITopic } from "./Topic";
import type { IUser } from "models/User";
import { Schema, Types } from "mongoose";

export interface ISubscription {
  _id: string;
  user?: IUser | string;
  email?: string;
  phone?: string;
  events: IEventSubscription[];
  orgs: IOrgSubscription[];
  topics: ITopicSubscription[];
  createdBy: IUser | string;
}

export interface IEventSubscription {
  event: IEvent;
  eventId: string;
  tagTypes?: TagType[];
}

export interface IOrgSubscription {
  org: IOrg;
  orgId: string;
  type: string;
  tagTypes?: TagType[];
  eventCategories?: IOrgSubscriptionEventCategory[];
}

export const isOrgSubscription = (
  followerSubscription: IOrgSubscription | IEventSubscription
): followerSubscription is IOrgSubscription => {
  return (followerSubscription as IOrgSubscription).orgId !== undefined;
};

export type TagType = "Events" | "Topics";

export const addTagType = (
  tagType: TagType,
  followerSubscription: IOrgSubscription | IEventSubscription
): TagType[] => {
  return followerSubscription.tagTypes &&
    !followerSubscription.tagTypes.includes(tagType)
    ? [...followerSubscription.tagTypes, tagType]
    : [tagType];
};

export const removeTagType = (
  tagType: TagType,
  followerSubscription: IOrgSubscription | IEventSubscription
): TagType[] => {
  if (followerSubscription.tagTypes) {
    if (followerSubscription.tagTypes.includes(tagType)) {
      return followerSubscription.tagTypes.filter((t) => t !== tagType);
    }
  }

  return followerSubscription.tagTypes || [];
};

export interface IOrgSubscriptionEventCategory {
  catId: number;
  emailNotif?: boolean;
  pushNotif?: boolean;
}

export interface ITopicSubscription {
  emailNotif?: boolean;
  pushNotif?: boolean;
  topic: ITopic;
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
    phone: String,
    // IEventSubscription
    events: [
      {
        eventId: {
          type: Schema.Types.ObjectId,
          required: true
        },
        event: {
          type: Schema.Types.ObjectId,
          ref: "Event"
        },
        tagTypes: [String]
      }
    ],
    // IOrgSubscription
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
        },
        tagTypes: [String],
        eventCategories: {
          type: [
            {
              catId: Number,
              emailNotif: Boolean,
              pushNotif: Boolean
            }
          ],
          default: undefined
        }
      }
    ],
    // ITopicSubscription
    topics: [
      {
        emailNotif: Boolean,
        pushNotif: Boolean,
        topic: {
          type: Schema.Types.ObjectId,
          ref: "Topic"
        }
      }
    ]
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
