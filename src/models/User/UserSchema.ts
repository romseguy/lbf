import { HookNextFunction, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { normalize } from "utils/string";
import { IUser } from "./IUser";

const HASH_ROUNDS = 10;

export const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true
    },
    phone: String,
    isOnline: {
      type: Boolean
    },
    password: {
      type: String,
      required: true
    },
    securityCode: String,
    userName: {
      type: String,
      // required: true,
      trim: true
    },
    userImage: {
      base64: String,
      width: Number,
      height: Number
    },
    userSubscription: Schema.Types.Mixed,
    isAdmin: Boolean,
    suggestedCategoryAt: String,
    userProjects: [{ type: Schema.Types.ObjectId, ref: "Project" }]
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

UserSchema.index({ email: 1, userName: 1 }, { unique: true });

UserSchema.pre("save", async function (next: HookNextFunction) {
  // here we need to retype 'this' because by default it is
  // of type Document from which the 'IUser' interface is inheriting
  // but the Document does not know about our password property
  const thisObj = this as IUser;

  if (this.isModified("email")) {
    try {
      thisObj.userName = normalize(thisObj.email!.replace(/@.+/, ""));
    } catch (error: any) {
      return next(error);
    }
  }

  return next();
});
