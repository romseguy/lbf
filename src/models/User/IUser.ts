import { Base64Image } from "utils/image";
import { IProject } from "models/Project";

export interface IUser {
  _id: string;
  email: string;
  phone?: string;
  password: string;
  securityCode: string;
  userName: string;
  userImage?: Base64Image;
  userSubscription?: unknown;
  isAdmin: boolean;
  isOnline: boolean;
  suggestedCategoryAt?: string;
  userDescription?: string;
  userProjects?: IProject[];
}
