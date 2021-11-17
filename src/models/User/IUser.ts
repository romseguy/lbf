import { Base64Image } from "utils/image";
import { IProject } from "models/Project";

export interface IUser {
  _id: string;
  email: string;
  phone?: string;
  isOnline: boolean;
  password: string;
  securityCode: string;
  userName: string;
  userImage?: Base64Image;
  userSubscription?: any;
  isAdmin: boolean;
  suggestedCategoryAt?: string;
  userProjects?: IProject[];
  validatePassword(password: string): Promise<boolean>;
}
