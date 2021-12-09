import { equals } from "utils/string";
import { IOrg, OrgType, OrgTypes, OrgTypesV } from "./IOrg";

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
    [OrgTypes.ASSO, OrgTypes.GENERIC].includes(orgType) ? "de l'" : "du "
  }${OrgTypesV[orgType].toLowerCase()}`;
};

export const orgTypeFull2 = (orgType: OrgType): string =>
  `${
    [OrgTypes.ASSO, OrgTypes.GENERIC].includes(orgType) ? "à l'" : "au "
  }${OrgTypesV[orgType].toLowerCase()}`;

export const orgTypeFull3 = (orgType: OrgType): string => {
  if (!orgType) return "une organisation";

  return `${
    [OrgTypes.ASSO, OrgTypes.GENERIC].includes(orgType) ? "une " : "un "
  }${OrgTypesV[orgType].toLowerCase()}`;
};

export const orgTypeFull4 = (orgType: OrgType): string =>
  `${
    [OrgTypes.ASSO, OrgTypes.GENERIC].includes(orgType) ? "cette " : "ce "
  }${OrgTypesV[orgType].toLowerCase()}`;

export const orgTypeFull5 = (orgType: OrgType): string =>
  `${
    [OrgTypes.ASSO, OrgTypes.GENERIC].includes(orgType) ? "l'" : "le "
  }${OrgTypesV[orgType].toLowerCase()}`;
