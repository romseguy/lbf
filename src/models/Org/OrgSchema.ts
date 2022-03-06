import { Schema } from "mongoose";
import { IOrg, EOrgType, EOrgVisibility } from "./IOrg";

export const OrgSchema = new Schema<IOrg>(
  {
    orgName: {
      type: String,
      required: true,
      trim: true
    },
    orgUrl: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    orgType: {
      type: String,
      enum: EOrgType,
      required: true
    },
    orgDescription: {
      type: String,
      trim: true
    },
    orgAddress: {
      type: [{ address: { type: String, trim: true } }],
      default: []
    },
    orgCity: { type: String, trim: true },
    orgLat: Number,
    orgLng: Number,
    orgEmail: { type: [{ email: { type: String, trim: true } }], default: [] },
    orgPhone: { type: [{ phone: { type: String, trim: true } }], default: [] },
    orgWeb: {
      type: [
        {
          url: { type: String, trim: true },
          prefix: { type: String, trim: true }
        }
      ],
      default: []
    },
    orgEventCategories: {
      type: [
        {
          index: { type: String, required: true, trim: true },
          label: { type: String, required: true, trim: true }
        }
      ],
      default: []
    },
    orgEvents: {
      type: [{ type: Schema.Types.ObjectId, ref: "Event" }],
      default: []
    },
    orgLists: {
      type: [
        {
          listName: { type: String, required: true, trim: true },
          subscriptions: {
            type: [
              {
                type: Schema.Types.ObjectId,
                ref: "Subscription"
              }
            ],
            default: []
          }
        }
      ],
      default: []
    },
    orgProjects: {
      type: [{ type: Schema.Types.ObjectId, ref: "Project" }],
      default: []
    },
    orgSubscriptions: {
      type: [
        { type: Schema.Types.ObjectId, ref: "Subscription", required: true }
      ],
      default: []
    },
    orgTopics: {
      type: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
      default: []
    },
    orgTopicsCategories: { type: [String], default: [] },
    orgStyles: {
      type: Schema.Types.Mixed,
      default: { showTitle: true }
    },
    orgBanner: {
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
    orgLogo: {
      type: {
        base64: String,
        width: Number,
        height: Number,
        url: { type: String, trim: true }
      },
      select: false
    },
    orgPassword: { type: String, select: false },
    orgSalt: String,
    orgTabs: {
      type: [{ label: { type: String, trim: true }, url: String }],
      default: undefined
    },
    orgVisibility: {
      type: String,
      enum: EOrgVisibility,
      required: true
    },
    orgs: { type: [{ type: Schema.Types.ObjectId, ref: "Org" }], default: [] },
    isApproved: Boolean,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
