import { Base64Image } from "utils/image";
import { IProject } from "models/Project";
import { IEntity } from "models/Entity";

export interface IUser extends Omit<IEntity, "createdBy"> {
  email: string;
  phone?: string;
  password: string;
  securityCode: string;
  userName: string;
  userImage?: Base64Image;
  userSubscription?: PushSubscription;
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
