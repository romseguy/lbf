import type { HookNextFunction } from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { randomNumber } from "utils/randomNumber";
import { Base64Image } from "utils/image";

const HASH_ROUNDS = 10;

export interface IUser {
  _id: string;
  email: string;
  isOnline: boolean;
  password: string;
  securityCode: string;
  userName: string;
  userNameLower?: string;
  userImage?: Base64Image;
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
      type: Schema.Types.Boolean
    },
    password: {
      type: String,
      required: true
    },
    securityCode: String,
    userName: {
      type: String,
      // required: true,
      trim: true,
      unique: true
      // index: {
      //   unique: true,
      //   collation: { locale: "fr", strength: 2 }
      // }
    },
    userNameLower: String,
    userImage: {
      base64: String,
      width: Number,
      height: Number
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

// UserSchema.index(
//   { userName: 1, email: 1 },
//   {
//     unique: true,
//     background: true,
//     collation: { locale: "fr", strength: 2 }
//   }
// );

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
    } catch (error) {
      return next(error);
    }
  }

  if (this.isModified("email")) {
    try {
      const nameParts = thisObj.email.replace(/@.+/, "");
      const name = nameParts.replace(/[&/\\#,+()$~%._@'":*?<>{}]/g, "");
      const userName = name + randomNumber(4);
      thisObj.userName = userName;
      thisObj.userNameLower = userName.toLowerCase();
    } catch (error) {
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
  } catch (error) {
    return next(error);
  }

  return next();
});
