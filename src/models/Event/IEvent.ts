import { IEventNotification } from "models/INotification";
import { IOrg } from "models/Org";
import { ISubscription } from "models/Subscription";
import { ITopic } from "models/Topic";
import { Base64Image } from "utils/image";
import { IEntity } from "utils/models";
import { StringMap } from "utils/types";

export interface IEvent<T = string> extends IEntity {
  eventName: string;
  eventUrl: string;
  eventCategory?: number;
  eventMinDate: T;
  eventMaxDate: T;
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
  eventSubscriptions: ISubscription[];
  eventNotifications?: IEventNotification[]; // list of emails the invitation has been sent to
  eventTopics: ITopic[];
  eventTopicsCategories?: string[];
  eventBanner?: Base64Image & {
    headerHeight: number;
    mode: "light" | "dark";
    url?: string;
  };
  eventLogo?: Base64Image & {
    url?: string;
  };
  eventDistance?: string;
  forwardedFrom?: {
    eventId: string;
    eventUrl?: string;
  };
  isApproved?: boolean;
  otherDays?: {
    dayNumber: number;
    startDate?: string;
    endTime?: string;
    monthRepeat?: number[];
  }[];
  repeat?: number;
}

export enum InviteStatus {
  PENDING = "PENDING",
  OK = "OK",
  NOK = "NOK"
}
export const InviteStatuses: StringMap<InviteStatus, string> = {
  [InviteStatus.PENDING]: "La personne n'a pas encore indiqué participer",
  [InviteStatus.OK]: "Participant",
  [InviteStatus.NOK]: "Invitation refusée"
};

export enum Visibility {
  FOLLOWERS = "FOLLOWERS",
  PUBLIC = "PUBLIC",
  SUBSCRIBERS = "SUBSCRIBERS"
}
export const Visibilities: StringMap<Visibility, string> = {
  [Visibility.FOLLOWERS]: "Abonnés",
  [Visibility.PUBLIC]: "Publique",
  [Visibility.SUBSCRIBERS]: "Adhérents"
};
