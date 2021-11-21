import { IOrg } from "models/Org";
import { ISubscription } from "models/Subscription";
import { ITopic } from "models/Topic";
import { IUser } from "models/User";
import { Base64Image } from "utils/image";

export interface IEvent<T = string> {
  _id: string;
  eventName: string;
  eventUrl: string;
  eventMinDate: T;
  eventMaxDate: T;
  eventAddress?: { address: string }[];
  eventCity?: string;
  eventLat?: number;
  eventLng?: number;
  eventDistance?: string;
  eventEmail?: { email: string }[];
  eventPhone?: { phone: string }[];
  eventWeb?: { url: string; prefix: string }[];
  eventDescription?: string;
  eventDescriptionHtml?: string;
  eventCategory?: number;
  eventVisibility?: string;
  eventOrgs: IOrg[];
  eventSubscriptions: ISubscription[];
  eventNotified?: IEventNotified; // list of emails the invitation has been sent to
  eventTopics: ITopic[];
  eventTopicsCategories?: string[];
  repeat?: number;
  otherDays?: {
    dayNumber: number;
    startDate?: string;
    endTime?: string;
    monthRepeat?: number[];
  }[];
  isApproved?: boolean;
  forwardedFrom?: {
    eventId: string;
    eventUrl?: string;
  };
  eventLogo?: Base64Image & {
    url?: string;
  };
  eventBanner?: Base64Image & {
    headerHeight: number;
    mode: "light" | "dark";
    url?: string;
  };
  createdBy: IUser | string;
  createdAt?: string;
}

export type IEventNotified = {
  email?: string;
  phone?: string;
  status?: string;
}[];

export const StatusTypes: { [key: string]: string } = {
  PENDING: "PENDING",
  OK: "OK",
  NOK: "NOK"
};
export const StatusTypesV: { [key: string]: string } = {
  PENDING: "Invitation envoyée",
  OK: "Participant",
  NOK: "Invitation refusée"
};

export const Visibility: { [key: string]: string } = {
  PUBLIC: "PUBLIC",
  SUBSCRIBERS: "SUBSCRIBERS"
};
export const VisibilityV: { [key: string]: string } = {
  PUBLIC: "Publique",
  SUBSCRIBERS: "Adhérents"
};
