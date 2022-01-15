import { IOrgEventCategory } from "models/Org";
import { IEvent, StatusTypes } from "./IEvent";

export * from "./IEvent";

export const Category: { [key: number]: IOrgEventCategory } = [
  //{ index: 0, label: "À définir", bgColor: "gray" },
  { index: 1, label: "Atelier", bgColor: "red" },
  { index: 2, label: "Chantier participatif", bgColor: "orange" },
  //{ label: "Concert", bgColor: "green.300" },
  //{ label: "Exposition", bgColor: "green.600" },
  //{ label: "Fête", bgColor: "blue.300" },
  //{ label: "Festival", bgColor: "blue.600" },
  //{ label: "Jam session", bgColor: "purple.300" },
  //{ label: "Réunion", bgColor: "purple.600" },
  { index: 9, label: "Autre", bgColor: "transparent" }
].reduce((obj, cat) => ({ ...obj, [cat.index]: cat }), {});

export const isAttending = ({
  email,
  event
}: {
  email?: string;
  event: IEvent;
}) => {
  if (!email) return false;
  return !!event.eventNotified?.find(({ email: e, status }) => {
    return e === email && status === StatusTypes.OK;
  });
};

export const isNotAttending = ({
  email,
  event
}: {
  email?: string;
  event: IEvent;
}) => {
  if (!email) return false;
  return !!event.eventNotified?.find(({ email: e, status }) => {
    return e === email && status === StatusTypes.NOK;
  });
};

export const monthRepeatOptions: { [key: number]: string } = {
  0: "premier",
  1: "2ème",
  2: "3ème",
  3: "dernier"
};
