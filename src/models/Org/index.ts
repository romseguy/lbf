import { equals } from "utils/string";
import { IOrg, OrgTypes, OrgTypesV } from "./IOrg";

export * from "./IOrg";

export const getSubscriptions = (org: IOrg, type: string) => {
  return org.orgSubscriptions.filter((subscription) =>
    subscription.orgs?.find(
      (orgSubscription) =>
        equals(orgSubscription.orgId, org._id) && orgSubscription.type === type
    )
  );
};

export const orgTypeFull = (orgType?: string): string => {
  if (!orgType) return "";
  return `${orgType === OrgTypes.ASSO ? "de l'" : "du "}${OrgTypesV[
    orgType
  ].toLowerCase()}`;
};

export const orgTypeFull2 = (orgType: string): string =>
  `${orgType === OrgTypes.ASSO ? "à l'" : "au "}${OrgTypesV[
    orgType
  ].toLowerCase()}`;

export const orgTypeFull3 = (orgType?: string): string => {
  if (!orgType) return "une organisation";

  return `${orgType === OrgTypes.ASSO ? "une " : "un "}${OrgTypesV[
    orgType
  ].toLowerCase()}`;
};

export const orgTypeFull4 = (orgType: string): string =>
  `${orgType === OrgTypes.ASSO ? "cette " : "ce "}${OrgTypesV[
    orgType
  ].toLowerCase()}`;
