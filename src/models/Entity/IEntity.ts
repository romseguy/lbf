import { IUser } from "models/User";
import { Base64Image } from "utils/image";

export interface IEntity {
  _id: string;
  createdAt?: string;
  createdBy: IUser | string;
}

export interface IEntityBanner extends Base64Image {
  headerHeight: number;
  mode: "light" | "dark";
  url?: string;
}

export interface IEntityLogo extends Base64Image {
  url?: string;
}

export interface IEntityStyles {
  showTitle: boolean;
}
