import {
  IEntity,
  IEntityBanner,
  IEntityLogo,
  IEntityStyles,
} from "models/Entity";
import { IOrg } from "models/Org";
import { ETopicsListOrder, ITopic } from "models/Topic";

export enum EEventInviteStatus {
  PENDING = "PENDING",
  OK = "OK",
  NOK = "NOK",
}

export enum EEventVisibility {
  FOLLOWERS = "FOLLOWERS",
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
  SUBSCRIBERS = "SUBSCRIBERS", // deprecated
}

export interface IEvent<T = string> extends IEntity {
  eventName: string;
  eventUrl: string;
  eventCategory?: string;
  eventMinDate: T;
  eventMaxDate?: T;
  otherDays?: {
    dayNumber: number;
    startDate?: string;
    endTime?: string;
    monthRepeat?: number[];
  }[];
  eventDescription?: string;
  eventDescriptionHtml?: string;
  eventVisibility?: string;
  eventOrgs: IOrg[];
  eventAddress?: { address: string }[];
  eventCity?: string;
  eventLat?: number;
  eventLng?: number;
  eventEmail?: { email: string }[];
  eventPhone?: { phone: string }[];
  eventWeb?: { url: string; prefix: string }[];
  eventTopicCategories: IEventTopicCategory[];
  eventTopicOrder?: ETopicsListOrder;
  eventTopics: ITopic[];
  eventStyles: IEntityStyles;
  eventBanner?: IEntityBanner;
  eventLogo?: IEntityLogo;
  eventDistance?: string;
  forwardedFrom?: {
    eventId: string;
    eventUrl?: string;
  };
  isApproved?: boolean;
  repeat?: number;
}

export interface IEventTopicCategory {
  catId: string;
  label: string;
}
