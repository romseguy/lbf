import { Schema } from "mongoose";
import { IUser } from "./IUser";

export const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      select: false,
      trim: true,
      lowercase: true
    },
    phone: String,
    password: {
      type: String,
      required: true,
      select: false
    },
    securityCode: {
      type: String,
      select: false
    },
    userName: {
      type: String,
      unique: true,
      trim: true
    },
    userImage: {
      type: {
        base64: String,
        width: Number,
        height: Number
      },
      select: false
    },
    userSubscription: Schema.Types.Mixed,
    isAdmin: Boolean,
    isOnline: Boolean,
    suggestedCategoryAt: String,
    userDescription: String,
    userProjects: [{ type: Schema.Types.ObjectId, ref: "Project" }]
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

UserSchema.index({ email: 1, userName: 1 }, { unique: true });
