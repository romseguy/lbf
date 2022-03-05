import { IEvent, EEventInviteStatus } from "./Event";
import { EProjectInviteStatus } from "./Project";
import { ITopic } from "./Topic";

export interface INotification {
  _id?: string;
  email?: string;
  phone?: string;
  user?: string;
  createdAt: string;
}

export interface IEventNotification extends INotification {
  status: EEventInviteStatus;
}

export interface IProjectNotification extends INotification {
  status: EProjectInviteStatus;
}

export interface ITopicNotification extends INotification {}

export interface IEmailNotification extends INotification {
  entity: IEvent | ITopic;
  status?: "PENDING" | "OK" | "NOK";
}

export interface IPushNotification extends INotification {
  entity: IEvent | ITopic;
  status?: "PENDING" | "OK" | "NOK";
}
