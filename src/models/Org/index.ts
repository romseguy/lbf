import { ESubscriptionType } from "models/Subscription";
import { equals } from "utils/string";
import { TypedMap } from "utils/types";
import { IOrg, IOrgList, EOrgType, EOrgVisibility } from "./IOrg";

export * from "./IOrg";

export const addOrReplaceList = (org: IOrg, list: IOrgList) => {
  let orgListExists = false;
  let orgLists: IOrgList[] = [];

  if (org.orgLists) {
    orgLists = org.orgLists.map((orgList) => {
      if (orgList.listName === list.listName) {
        orgListExists = true;
        return list;
      }
      return orgList;
    });
  }

  if (!org.orgLists || !orgListExists)
    orgLists = (org.orgLists || []).concat([list]);

  return orgLists;
};

export const editList = (
  org: IOrg,
  listToEdit: IOrgList,
  newList: IOrgList
) => {
  if (!org.orgLists) return [newList];

  return org.orgLists.map((orgList) => {
    if (orgList.listName === listToEdit.listName) return newList;
    return orgList;
  });
};

export const getLists = (org?: IOrg): IOrgList[] | undefined => {
  if (!org) return undefined;

  return (org.orgLists || []).concat([
    {
      listName: "Abonnés",
      subscriptions: getSubscriptions(org, ESubscriptionType.FOLLOWER)
    },
    {
      listName: "Adhérents",
      subscriptions: getSubscriptions(org, ESubscriptionType.SUBSCRIBER)
    }
  ]);
};

export const getSubscriptions = (org: IOrg, type: string) => {
  if (!Array.isArray(org.orgSubscriptions) || !org.orgSubscriptions.length)
    return [];

  if (typeof org.orgSubscriptions[0] === "string")
    throw new Error("getSubscriptions: org.orgSubscriptions must be populated");

  return org.orgSubscriptions.filter((subscription) =>
    subscription.orgs?.find(
      (orgSubscription) =>
        equals(orgSubscription.orgId, org._id) && orgSubscription.type === type
    )
  );
};

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
