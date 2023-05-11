import { ChatIcon, CalendarIcon, SettingsIcon } from "@chakra-ui/icons";
import { FaHome, FaTools, FaImages } from "react-icons/fa";
import { getOrgs, useGetOrgsQuery } from "features/api/orgsApi";
import { EOrgSubscriptionType } from "models/Subscription";
import { hasItems } from "utils/array";
import { Session } from "utils/auth";
import { capitalize, equals } from "utils/string";
import {
  EOrgType,
  EOrgVisibility,
  IOrg,
  IOrgList,
  IOrgEventCategory,
  IOrgTabWithIcon
} from "./IOrg";
import { AppDispatch } from "store";

export * from "./IOrg";

//#region categories
export const getEventCategories = (org?: IOrg): IOrgEventCategory[] => {
  return org ? org.orgEventCategories : [];
};
//#endregion

//#region descriptions
export const getOrgDescriptionByType = (orgType?: EOrgType): string => {
  if (orgType === EOrgType.TREETOOLS)
    return `<p>- D&eacute;broussailleuse<br /><br />- Tron&ccedil;onneuse : &agrave; aiguiser<br /><br /><strong>Conditions d'&eacute;change :</strong><br /><br />Tarif fixe, libre, troc, ...<br /><br /><strong>Dur&eacute;e d'emprunt :</strong><br /><br />3 jours &agrave; partir de la remise en main propre</p>`;
  // return `
  // <b>Liste du matériel disponible :</b><br/><br/>
  // - Débroussailleuse<br/><br/>
  // - Tronçonneuse : à aiguiser<br/><br/>
  // <b>Conditions d'échange :</b><br/><br/>
  // Tarif fixe, libre, troc, ...<br /><br />
  // <b>Durée d'emprunt :</b><br/><br/>
  // 3 jours à partir de la remise en main propre
  // `;
  return "";
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

//#region networks
export const getNetworks = async (
  org: IOrg,
  session: Session | null,
  dispatch: AppDispatch
) => {
  const { data: myOrgs } = await dispatch(
    getOrgs.initiate({
      createdBy: session?.user.userId,
      populate: "orgs"
    })
  );

  const { data: orgs } = await dispatch(
    getOrgs.initiate({
      populate: "orgs"
    })
  );

  let orgNetworks = orgs;

  if (myOrgs && orgs) {
    orgNetworks = myOrgs.concat(
      orgs.filter(({ _id }) => !myOrgs.find((myOrg) => myOrg._id === _id))
    );
  }

  return orgNetworks?.filter(
    (o) =>
      o.orgName !== org.orgName &&
      o.orgType === EOrgType.NETWORK &&
      !!o.orgs?.find(({ orgName }) => orgName === org.orgName)
  );
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
    [EOrgType.GENERIC].includes(orgType)
      ? "de l'"
      : [EOrgType.TREETOOLS].includes(orgType)
      ? "du "
      : "de la "
  }${OrgTypes[orgType].toLowerCase()}`;
};

export const orgTypeFull2 = (orgType: EOrgType = EOrgType.GENERIC): string =>
  `${
    [EOrgType.GENERIC].includes(orgType)
      ? "à l'"
      : [EOrgType.TREETOOLS].includes(orgType)
      ? "au "
      : "à la "
  }${OrgTypes[orgType].toLowerCase()}`;

export const orgTypeFull3 = (orgType: EOrgType = EOrgType.GENERIC): string => {
  return `${
    [EOrgType.GENERIC, EOrgType.TREETOOLS].includes(orgType) ? "un " : "une "
  }${OrgTypes[orgType].toLowerCase()}`;
};

export const orgTypeFull4 = (orgType: EOrgType = EOrgType.GENERIC): string =>
  `${
    [EOrgType.GENERIC].includes(orgType)
      ? "cet "
      : [EOrgType.TREETOOLS].includes(orgType)
      ? "ce "
      : "cette "
  }${OrgTypes[orgType].toLowerCase()}`;

export const orgTypeFull5 = (
  orgType: EOrgType = EOrgType.GENERIC,
  isCapitalized?: boolean
): string => {
  const str = `${
    [EOrgType.NETWORK].includes(orgType)
      ? "la "
      : [EOrgType.TREETOOLS].includes(orgType)
      ? "le "
      : "l'"
  }${OrgTypes[orgType].toLowerCase()}`;

  if (isCapitalized) return capitalize(str);

  return str;
};

export const OrgTypes: Record<EOrgType, string> = {
  [EOrgType.GENERIC]: "Arbre",
  [EOrgType.NETWORK]: "Planète",
  [EOrgType.TREETOOLS]: "Noisettier"
};

export const OrgVisibilities: Record<EOrgVisibility, string> = {
  [EOrgVisibility.PUBLIC]: "Publique",
  [EOrgVisibility.PRIVATE]: "Protégée par un mot de passe"
};
//#endregion
