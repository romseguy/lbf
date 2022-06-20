import { ChatIcon, CalendarIcon, SettingsIcon } from "@chakra-ui/icons";
import { FaHome, FaTools, FaImages } from "react-icons/fa";
import { EOrgSubscriptionType } from "models/Subscription";
import { hasItems } from "utils/array";
import { capitalize, equals } from "utils/string";
import {
  EOrgType,
  EOrgVisibility,
  IOrg,
  IOrgList,
  IOrgEventCategory,
  IOrgTabWithIcon
} from "./IOrg";

export * from "./IOrg";

//#region categories
export const getOrgEventCategories = (org?: IOrg): IOrgEventCategory[] => {
  return org ? org.orgEventCategories : [];
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
      subscriptions: getSubscriptions(org, EOrgSubscriptionType.FOLLOWER)
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
export const orgTypeFull = (orgType: EOrgType = EOrgType.GENERIC): string => {
  return `${
    [EOrgType.GENERIC].includes(orgType) ? "de l'" : "de la "
  }${OrgTypes[orgType].toLowerCase()}`;
};

export const orgTypeFull2 = (orgType: EOrgType = EOrgType.GENERIC): string =>
  `${[EOrgType.GENERIC].includes(orgType) ? "à l'" : "à la "}${OrgTypes[
    orgType
  ].toLowerCase()}`;

export const orgTypeFull3 = (orgType: EOrgType = EOrgType.GENERIC): string => {
  return `${[EOrgType.GENERIC].includes(orgType) ? "un " : "une "}${OrgTypes[
    orgType
  ].toLowerCase()}`;
};

export const orgTypeFull4 = (orgType: EOrgType = EOrgType.GENERIC): string =>
  `${[EOrgType.GENERIC].includes(orgType) ? "cette " : "ce "}${OrgTypes[
    orgType
  ].toLowerCase()}`;

export const orgTypeFull5 = (
  orgType: EOrgType = EOrgType.GENERIC,
  isCapitalized?: boolean
): string => {
  const str = `${[EOrgType.NETWORK].includes(orgType) ? "la " : "l'"}${OrgTypes[
    orgType
  ].toLowerCase()}`;

  if (isCapitalized) return capitalize(str);

  return str;
};

export const OrgTypes: Record<EOrgType, string> = {
  [EOrgType.GENERIC]: "Arbre",
  [EOrgType.NETWORK]: "Planète"
};

export const OrgVisibilities: Record<EOrgVisibility, string> = {
  [EOrgVisibility.PUBLIC]: "Publique",
  [EOrgVisibility.PRIVATE]: "Protégée par un mot de passe"
};
//#endregion
