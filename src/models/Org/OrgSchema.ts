import { Schema } from "mongoose";
import { IOrg, OrgType, Visibility } from "./IOrg";

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
      enum: OrgType,
      required: true
    },
    orgAddress: [{ address: { type: String, trim: true } }],
    orgCity: String,
    orgLat: Number,
    orgLng: Number,
    orgEmail: [{ email: { type: String, trim: true } }],
    orgPhone: [{ phone: { type: String, trim: true } }],
    orgWeb: [
      {
        url: { type: String, trim: true },
        prefix: { type: String, trim: true }
      }
    ],
    orgEventCategories: {
      type: [
        { label: { type: String, required: true, trim: true }, bgColor: String }
      ],
      default: undefined
    },
    orgDescription: {
      type: String,
      trim: true
    },
    orgDescriptionHtml: {
      type: String,
      trim: true
    },
    orgEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    orgLists: [
      {
        listName: { type: String, required: true, trim: true },
        subscriptions: [
          {
            type: Schema.Types.ObjectId,
            ref: "Subscription"
          }
        ]
      }
    ],
    orgProjects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    orgSubscriptions: [
      { type: Schema.Types.ObjectId, ref: "Subscription", required: true }
    ],
    orgTopics: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
    orgTopicsCategories: [String],
    orgLogo: {
      type: {
        base64: String,
        width: Number,
        height: Number,
        url: { type: String, trim: true }
      },
      select: false
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
    orgPassword: { type: String, select: false },
    orgSalt: String,
    orgTabs: {
      type: [{ label: { type: String, trim: true }, url: String }],
      default: undefined
    },
    orgVisibility: {
      type: String,
      enum: Visibility,
      required: true
    },
    orgs: [{ type: Schema.Types.ObjectId, ref: "Org" }],
    isApproved: Boolean,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
