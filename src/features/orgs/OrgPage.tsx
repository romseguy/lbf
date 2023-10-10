import { Box, Text } from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
//import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  EntityPageConfigButton,
  EntityPageSubscribeButton,
  Link
} from "features/common";
import { Forum } from "features/forum/Forum";
import { Layout } from "features/layout";
import { PageProps } from "main";
import { getRefId } from "models/Entity";
import { EOrgType, EOrgVisibility, IOrg } from "models/Org";
import { getFollowerSubscription, ISubscription } from "models/Subscription";
import { AppQuery, AppQueryWithData } from "utils/types";
import { OrgConfigPanel, OrgConfigVisibility } from "./OrgConfigPanel";
import { OrgPageTabs } from "./OrgPageTabs";
import { useSession } from "hooks/useSession";

export interface IsEditConfig {
  isAddingChild?: boolean;
  isAddingDescription?: boolean;
  isAddingInfo?: boolean;
}

//let isFirstLoad = true;

export const OrgPage = ({
  isMobile,
  orgQuery,
  subQuery,
  tab,
  tabItem
}: PageProps & {
  orgQuery: AppQueryWithData<IOrg>;
  subQuery: AppQuery<ISubscription>;
  tab?: string;
  tabItem?: string;
}) => {
  //const router = useRouter();
  const { data: session } = useSession();
  // useEffect(() => {
  //   if ((router.asPath.match(/\//g) || []).length > 1) {
  //     isFirstLoad = false;
  //     return;
  //   }
  //   isFirstLoad = false;
  // }, [router.asPath]);

  //#region org
  const org = orgQuery.data;
  const isCreator =
    org.orgUrl === "nom_de_votre_planete" || // demo page
    session?.user.userId === getRefId(org) ||
    session?.user.isAdmin ||
    false;
  const orgCreatedByUserName =
    typeof org.createdBy === "object"
      ? org.createdBy?.userName || org.createdBy?._id
      : org.createdBy;
  //#endregion

  //#region sub
  const isFollowed = !!getFollowerSubscription({ org, subQuery });
  //#endregion

  //#region config
  const [isConfig, setIsConfig] = useState(false);
  const [isEdit, _setIsEdit] = useState(false);
  const [isEditConfig, setIsEditConfig] = useState<IsEditConfig>({});
  const setIsEdit = (arg: boolean | IsEditConfig) => {
    if (typeof arg === "boolean") {
      _setIsEdit(arg);
      if (!arg) setIsEditConfig({});
    } else {
      setIsEdit(Object.keys(arg).length > 0);
      setIsEditConfig(arg);
    }
  };
  //#endregion

  //#region visibility
  const _isVisible = {
    logo: false,
    banner: false,
    lists: false,
    subscribers: false,
    eventCategories: false,
    topicCategories: false
  };
  const [isVisible, _setIsVisible] =
    useState<OrgConfigVisibility["isVisible"]>(_isVisible);
  const toggleVisibility = (
    key?: keyof OrgConfigVisibility["isVisible"],
    bool?: boolean
  ) => {
    _setIsVisible(
      !key
        ? _isVisible
        : Object.keys(isVisible).reduce((obj, objKey) => {
            if (objKey === key)
              return {
                ...obj,
                [objKey]: bool !== undefined ? bool : !isVisible[objKey]
              };

            return { ...obj, [objKey]: false };
          }, {})
    );
  };
  //#endregion

  if (org.orgUrl === "forum") {
    return (
      <Layout entity={org} isMobile={isMobile}>
        {isCreator && (
          <EntityPageConfigButton
            isConfig={isConfig}
            isEdit={isEdit}
            setIsConfig={setIsConfig}
            setIsEdit={setIsEdit}
          />
        )}

        {!isConfig && !isEdit && (
          <Forum orgQuery={orgQuery} subQuery={subQuery} tabItem={tabItem} />
        )}

        {session && isCreator && (isConfig || isEdit) && (
          <OrgConfigPanel
            session={session}
            orgQuery={orgQuery}
            subQuery={subQuery}
            isEdit={isEdit}
            isVisible={isVisible}
            setIsConfig={setIsConfig}
            setIsEdit={setIsEdit}
            toggleVisibility={toggleVisibility}
          />
        )}
      </Layout>
    );
  }

  return (
    <Layout entity={org} isMobile={isMobile}>
      {isCreator && (
        <EntityPageConfigButton
          isConfig={isConfig}
          isEdit={isEdit}
          setIsConfig={setIsConfig}
          setIsEdit={setIsEdit}
        />
      )}

      {!isConfig && !isEdit && (
        <>
          <EntityPageSubscribeButton orgQuery={orgQuery} subQuery={subQuery} />

          <Box my={3}>
            <Text fontSize="smaller">
              {org.orgType === EOrgType.GENERIC
                ? "Arbre créé"
                : `Planète ${
                    org.orgVisibility === EOrgVisibility.PRIVATE ? "privée" : ""
                  } créée`}{" "}
              le{" "}
              {format(parseISO(org.createdAt!), "eeee d MMMM yyyy", {
                locale: fr
              })}{" "}
              par :{" "}
              <Link variant="underline" href={`/${orgCreatedByUserName}`}>
                {orgCreatedByUserName}
              </Link>{" "}
              {isCreator && `(Vous ${session?.user.isAdmin && ": admin"})`}
            </Text>
          </Box>

          <OrgPageTabs
            currentItemName={tabItem}
            currentTabLabel={tab}
            isCreator={isCreator}
            isFollowed={isFollowed}
            orgQuery={orgQuery}
            session={session}
            setIsConfig={setIsConfig}
            setIsEdit={setIsEdit}
            subQuery={subQuery}
          />
        </>
      )}

      {session &&
        (isCreator || !!org.orgPermissions) &&
        (isConfig || isEdit) && (
          <OrgConfigPanel
            session={session}
            orgQuery={orgQuery}
            subQuery={subQuery}
            isCreator={isCreator}
            isEdit={isEdit}
            isEditConfig={isEditConfig}
            isVisible={isVisible}
            setIsConfig={setIsConfig}
            setIsEdit={setIsEdit}
            toggleVisibility={toggleVisibility}
          />
        )}
    </Layout>
  );
};
