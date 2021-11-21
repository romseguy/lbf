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
    eventMinDate: {
      type: String,
      required: true
    },
    eventMaxDate: {
      type: String,
      required: true
    },
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
    eventDescription: {
      type: String,
      trim: true
    },
    eventDescriptionHtml: {
      type: String,
      trim: true
    },
    eventCategory: Number,
    eventVisibility: {
      type: String,
      enum: Object.keys(Visibility).map((key) => Visibility[key])
    },
    eventOrgs: [{ type: Schema.Types.ObjectId, ref: "Org" }],
    eventSubscriptions: [
      { type: Schema.Types.ObjectId, ref: "Subscription", required: true }
    ],
    eventTopics: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
    orgTopicsCategories: [String],
    eventNotified: [
      {
        email: String,
        phone: String,
        status: {
          type: String,
          enum: Object.keys(StatusTypes).map((key) => StatusTypes[key])
        }
      }
    ],
    eventLogo: {
      base64: String,
      width: Number,
      height: Number,
      url: { type: String, trim: true }
    },
    eventBanner: {
      base64: String,
      height: Number,
      headerHeight: Number,
      width: Number,
      mode: String,
      url: { type: String, trim: true }
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    repeat: Number,
    otherDays: [
      {
        dayNumber: Number,
        startDate: String,
        endTime: String,
        monthRepeat: [Number]
      }
    ],
    isApproved: Boolean,
    forwardedFrom: {
      eventId: {
        type: Schema.Types.ObjectId,
        ref: "Event"
      },
      eventUrl: String
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
