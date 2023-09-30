import { IUser } from "models/User";
import { Base64Image } from "utils/image";

export interface IEntity extends Record<string, any> {
  _id: string;
  createdAt?: string;
  createdBy?: IUser | string;
  updatedAt?: string;
}

export interface IEntityAddress {
  address: string;
}

export interface IEntityBanner extends Base64Image {
  headerHeight: number;
  mode: "light" | "dark";
  url?: string;
}

export interface IEntityCategory {
  catId: string;
  label: string;
}

export enum EEntityCategoryKey {
  "eventTopicCategories" = "eventTopicCategories",
  "orgEventCategories" = "orgEventCategories",
  "orgTopicCategories" = "orgTopicCategories"
}

export interface IEntityEmail {
  email: string;
}

export interface IEntityLogo extends Base64Image {
  url?: string;
}

export interface IEntityPhone {
  phone: string;
}

export interface IEntityStyles {
  showTitle: boolean;
}

export interface IEntityWeb {
  url: string;
  prefix: string;
}
