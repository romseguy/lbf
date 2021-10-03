import type { HookNextFunction } from "mongoose";
import { Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";
import { randomNumber } from "utils/randomNumber";
import { Base64Image } from "utils/image";
import { normalize } from "utils/string";

const HASH_ROUNDS = 10;

export interface IUser {
  _id: string;
  email?: string;
  isOnline: boolean;
  password: string;
  securityCode: string;
  userName: string;
  userImage?: Base64Image;
  userSubscription?: any;
  isAdmin: boolean;
  validatePassword(password: string): boolean;
}

export const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true
    },
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
    isAdmin: Boolean
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

UserSchema.index({ email: 1, userName: 1 }, { unique: true });

UserSchema.methods.validatePassword = async function (pass: string) {
  return bcrypt.compare(pass, this.password);
};

UserSchema.pre("save", async function (next: HookNextFunction) {
  // here we need to retype 'this' because by default it is
  // of type Document from which the 'IUser' interface is inheriting
  // but the Document does not know about our password property
  const thisObj = this as IUser;

  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(HASH_ROUNDS);
      const hash = await bcrypt.hash(thisObj.password, salt);
      thisObj.password = hash;
    } catch (error: any) {
      return next(error);
    }
  }

  if (this.isModified("email")) {
    try {
      // const name = normalize(thisObj.email.replace(/@.+/, ""));
      // const userName = name.match(/[0-9]/) === null ? name + randomNumber(4) : name;
      thisObj.userName = normalize(thisObj.email!.replace(/@.+/, ""));
    } catch (error: any) {
      return next(error);
    }
  }

  return next();
});

UserSchema.pre("updateOne", async function (next: HookNextFunction) {
  // this.set({ updatedAt: new Date() });
  const { password } = this.getUpdate();

  if (!password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(HASH_ROUNDS);
    const hash = await bcrypt.hash(password, salt);
    this.update({}, { password: hash }).exec();
    next();
  } catch (error: any) {
    return next(error);
  }

  return next();
});
