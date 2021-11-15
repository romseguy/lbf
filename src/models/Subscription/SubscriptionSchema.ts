import { Schema } from "mongoose";
import { ISubscription, SubscriptionTypes } from "./ISubscription";

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
