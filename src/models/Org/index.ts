import { ChatIcon, CalendarIcon, SettingsIcon } from "@chakra-ui/icons";
import { FaHome, FaTools, FaImages } from "react-icons/fa";
import { ESubscriptionType } from "models/Subscription";
import { hasItems } from "utils/array";
import { equals } from "utils/string";
import { TypedMap } from "utils/types";
import {
  EOrgType,
  EOrgVisibility,
  IOrg,
  IOrgList,
  IOrgEventCategory,
  IOrgTabWithIcon
} from "./IOrg";
import { defaultEventCategories } from "models/Event";

export * from "./IOrg";

//#region categories
export const getOrgEventCategories = (org?: IOrg): IOrgEventCategory[] => {
  let arr = defaultEventCategories;

  if (org && hasItems(org.orgEventCategories)) {
    if (!org.orgEventCategories.find(({ catId }) => catId === "0"))
      return arr.concat(org.orgEventCategories);

    return org.orgEventCategories;
  }

  return arr;
};
//#endregion

//#region lists
export const addOrReplaceList = (org: IOrg, list: IOrgList) => {
  let orgListExists = false;
  let orgLists: IOrgList[] = [];

  orgLists = org.orgLists.map((orgList) => {
    if (orgList.listName === list.listName) {
      orgListExists = true;
      return list;
    }
    return orgList;
  });

  if (!orgListExists) orgLists = org.orgLists.concat([list]);

  return orgLists;
};

export const editList = (
  org: IOrg,
  listToEdit: IOrgList,
  newList: IOrgList
) => {
  if (!hasItems(org.orgLists)) return [newList];

  return org.orgLists.map((orgList) => {
    if (orgList.listName === listToEdit.listName) return newList;
    return orgList;
  });
};

export const getLists = (org?: IOrg): IOrgList[] => {
  if (!org) return [];

  let lists = org.orgLists;

  if (!lists.find(({ listName }) => listName === "Abonnés"))
    lists.push({
      listName: "Abonnés",
      subscriptions: getSubscriptions(org, ESubscriptionType.FOLLOWER)
    });

  if (!lists.find(({ listName }) => listName === "Adhérents"))
    lists.push({
      listName: "Adhérents",
      subscriptions: getSubscriptions(org, ESubscriptionType.SUBSCRIBER)
    });

  return lists;
};
//#endregion

//#region subscriptions
export const getSubscriptions = (org: IOrg, type: string) => {
  if (!Array.isArray(org.orgSubscriptions) || !org.orgSubscriptions.length)
    return [];

  if (
    typeof org.orgSubscriptions[0] === "string" ||
    !org.orgSubscriptions[0].createdAt
  )
    throw new Error("getSubscriptions: org.orgSubscriptions must be populated");

  return org.orgSubscriptions.filter((subscription) =>
    subscription.orgs?.find(
      (orgSubscription) =>
        equals(orgSubscription.orgId, org._id) && orgSubscription.type === type
    )
  );
};
//#endregion

//#region tabs
export const defaultTabs: IOrgTabWithIcon[] = [
  { label: "Accueil", icon: FaHome, url: "/accueil" },
  { label: "Discussions", icon: ChatIcon, url: "/discussions" },
  { label: "Événements", icon: CalendarIcon, url: "/evenements" },
  { label: "Projets", icon: FaTools, url: "/projets" },
  { label: "Galerie", icon: FaImages, url: "/galerie" },
  { label: "", icon: SettingsIcon, url: "/parametres" }
];
//#endregion

//#region toString
export const orgTypeFull = (orgType: EOrgType): string => {
  if (!orgType) return "";

  return `${
    [EOrgType.ASSO, EOrgType.GENERIC].includes(orgType) ? "de l'" : "du "
  }${OrgTypes[orgType].toLowerCase()}`;
};

export const orgTypeFull2 = (orgType: EOrgType): string =>
  `${
    [EOrgType.ASSO, EOrgType.GENERIC].includes(orgType) ? "à l'" : "au "
  }${OrgTypes[orgType].toLowerCase()}`;

export const orgTypeFull3 = (orgType: EOrgType): string => {
  if (!orgType) return "une organisation";

  return `${
    [EOrgType.ASSO, EOrgType.GENERIC].includes(orgType) ? "une " : "un "
  }${OrgTypes[orgType].toLowerCase()}`;
};

export const orgTypeFull4 = (orgType: EOrgType): string =>
  `${
    [EOrgType.ASSO, EOrgType.GENERIC].includes(orgType) ? "cette " : "ce "
  }${OrgTypes[orgType].toLowerCase()}`;

export const orgTypeFull5 = (orgType: EOrgType): string =>
  `${
    [EOrgType.ASSO, EOrgType.GENERIC].includes(orgType) ? "l'" : "le "
  }${OrgTypes[orgType].toLowerCase()}`;

export const OrgTypes: TypedMap<EOrgType, string> = {
  [EOrgType.ASSO]: "Association",
  [EOrgType.GENERIC]: "Organisation",
  [EOrgType.GROUP]: "Groupe",
  [EOrgType.NETWORK]: "Réseau"
};

export const OrgVisibilities: TypedMap<EOrgVisibility, string> = {
  [EOrgVisibility.PUBLIC]: "Publique",
  [EOrgVisibility.PRIVATE]: "Protégée par un mot de passe"
};
//#endregion
