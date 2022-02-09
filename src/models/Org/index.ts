import { equals } from "utils/string";
import { IOrg, OrgType, OrgTypes } from "./IOrg";

export * from "./IOrg";

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

export const orgTypeFull = (orgType: OrgType): string => {
  if (!orgType) return "";
  return `${
    [OrgType.ASSO, OrgType.GENERIC].includes(orgType) ? "de l'" : "du "
  }${OrgTypes[orgType].toLowerCase()}`;
};

export const orgTypeFull2 = (orgType: OrgType): string =>
  `${
    [OrgType.ASSO, OrgType.GENERIC].includes(orgType) ? "à l'" : "au "
  }${OrgTypes[orgType].toLowerCase()}`;

export const orgTypeFull3 = (orgType: OrgType): string => {
  if (!orgType) return "une organisation";

  return `${
    [OrgType.ASSO, OrgType.GENERIC].includes(orgType) ? "une " : "un "
  }${OrgTypes[orgType].toLowerCase()}`;
};

export const orgTypeFull4 = (orgType: OrgType): string =>
  `${
    [OrgType.ASSO, OrgType.GENERIC].includes(orgType) ? "cette " : "ce "
  }${OrgTypes[orgType].toLowerCase()}`;

export const orgTypeFull5 = (orgType: OrgType): string =>
  `${
    [OrgType.ASSO, OrgType.GENERIC].includes(orgType) ? "l'" : "le "
  }${OrgTypes[orgType].toLowerCase()}`;
