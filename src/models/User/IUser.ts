import { Base64Image } from "utils/image";
import { IProject } from "models/Project";

export interface IUser {
  _id: string;
  createdAt?: string;
  email: string;
  phone?: string;
  password: string;
  securityCode: string;
  userName: string;
  userImage?: Base64Image;
  userSubscription?: PushSubscription | null;
  // userSubscription?: {
  //   endpoint: string;
  //   expirationTime: string | null;
  //   keys: {
  //     p256dh: string;
  //     auth: string;
  //   };
  // };
  isAdmin: boolean;
  isOnline: boolean;
  suggestedCategoryAt?: string;
  userDescription?: string;
  userProjects: IProject[];
}
