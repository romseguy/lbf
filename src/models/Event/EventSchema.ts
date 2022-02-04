import { Schema } from "mongoose";
import { IEvent, StatusTypes, Visibility } from "./IEvent";

export const EventSchema = new Schema<IEvent>(
  {
    eventName: {
      type: String,
      required: true,
      trim: true
    },
    eventUrl: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    eventCategory: Number,
    eventMinDate: {
      type: String,
      required: true
    },
    eventMaxDate: {
      type: String,
      required: true
    },
    eventDescription: {
      type: String,
      trim: true
    },
    eventDescriptionHtml: {
      type: String,
      trim: true
    },
    eventVisibility: {
      type: String,
      enum: Object.keys(Visibility).map((key) => Visibility[key])
    },
    eventOrgs: [{ type: Schema.Types.ObjectId, ref: "Org" }],
    eventAddress: [{ address: { type: String, trim: true } }],
    eventCity: String,
    eventLat: Number,
    eventLng: Number,
    eventEmail: [{ email: { type: String, trim: true } }],
    eventPhone: [{ phone: { type: String, trim: true } }],
    eventWeb: [
      {
        url: { type: String, trim: true },
        prefix: { type: String, trim: true }
      }
    ],
    eventSubscriptions: [
      { type: Schema.Types.ObjectId, ref: "Subscription", required: true }
    ],
    eventNotifications: [
      {
        email: String,
        phone: String,
        user: {
          type: Schema.Types.ObjectId,
          ref: "User"
        },
        status: {
          type: String,
          enum: Object.keys(StatusTypes).map((key) => StatusTypes[key])
        }
      }
    ],
    eventTopics: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
    eventTopicsCategories: [String],
    eventBanner: {
      type: {
        base64: String,
        height: Number,
        headerHeight: Number,
        width: Number,
        mode: String,
        url: { type: String, trim: true }
      },
      select: false
    },
    eventLogo: {
      type: {
        base64: String,
        width: Number,
        height: Number,
        url: { type: String, trim: true }
      },
      select: false
    },
    forwardedFrom: {
      eventId: {
        type: Schema.Types.ObjectId,
        ref: "Event"
      },
      eventUrl: String
    },
    isApproved: Boolean,
    otherDays: [
      {
        dayNumber: Number,
        startDate: String,
        endTime: String,
        monthRepeat: [Number]
      }
    ],
    repeat: Number,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
