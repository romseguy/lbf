import { Schema } from "mongoose";
import { IEvent, EEventInviteStatus, EEventVisibility } from "./IEvent";

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
    otherDays: [
      {
        dayNumber: {
          type: Number,
          required: true
        },
        startDate: String,
        endTime: String,
        monthRepeat: [Number]
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
    eventVisibility: {
      type: String,
      enum: EEventVisibility
    },
    eventOrgs: {
      type: [{ type: Schema.Types.ObjectId, ref: "Org" }],
      default: []
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
    eventNotifications: {
      type: [
        {
          email: String,
          phone: String,
          user: {
            type: Schema.Types.ObjectId,
            ref: "User"
          },
          status: {
            type: String,
            enum: EEventInviteStatus
          },
          createdAt: { type: String, required: true }
        }
      ],
      default: []
    },
    eventSubscriptions: {
      type: [
        { type: Schema.Types.ObjectId, ref: "Subscription", required: true }
      ],
      default: []
    },
    eventTopics: {
      type: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
      default: []
    },
    eventTopicsCategories: { type: [String], default: [] },
    eventStyles: {
      type: Schema.Types.Mixed,
      default: { showTitle: true }
    },
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
    repeat: Number,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
