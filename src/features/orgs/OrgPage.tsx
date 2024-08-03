import { Flex } from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AppHeading } from "features/common";
import { Layout } from "features/layout";
import { PageProps } from "main";
import { getRefId } from "models/Entity";
import { IOrg } from "models/Org";
import { getFollowerSubscription, ISubscription } from "models/Subscription";
import { AppQuery, AppQueryWithData } from "utils/types";
import { OrgConfigPanel, OrgConfigVisibility } from "./OrgConfigPanel";
import { OrgPageTabs } from "./OrgPageTabs";
import { useSession } from "hooks/useSession";
import { OrgConfigButtons } from "./OrgConfigButtons";

export interface IsEditConfig {
  isAddingChild?: boolean;
  isAddingDescription?: boolean;
  isAddingInfo?: boolean;
  isAddingToNetwork?: boolean;
}

//let isFirstLoad = true;

export const OrgPage = ({
  isMobile,
  orgQuery,
  subQuery,
  currentTabLabel,
  tabItem
}: PageProps & {
  orgQuery: AppQueryWithData<IOrg>;
  subQuery: AppQuery<ISubscription>;
  currentTabLabel?: string;
  tabItem?: string;
}) => {
  const router = useRouter();
  const { data: session } = useSession();

  //#region org
  const org = orgQuery.data;
  const isCreator =
    org.orgUrl === "nom_de_votre_forum" || // demo page
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
  useEffect(() => {
    if (isEdit) setIsEdit(false);
    if (isConfig) setIsConfig(false);
  }, [router.asPath]);
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

  const tabs = (
    <OrgPageTabs
      currentItemName={tabItem}
      currentTabLabel={currentTabLabel}
      isCreator={isCreator}
      isFollowed={isFollowed}
      orgQuery={orgQuery}
      isConfig={isConfig}
      setIsConfig={setIsConfig}
      isEdit={isEdit}
      setIsEdit={setIsEdit}
      subQuery={subQuery}
    />
  );

  return (
    <Layout
      entity={org}
      tab={currentTabLabel}
      tabItem={tabItem}
      isMobile={isMobile}
    >
      {isCreator && (
        <Flex ml={3}>
          <AppHeading>Admin :</AppHeading>
          <OrgConfigButtons
            orgQuery={orgQuery}
            isConfig={isConfig}
            setIsConfig={setIsConfig}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            toggleVisibility={toggleVisibility}
            mx={3}
          />
        </Flex>
      )}

      {!isConfig && !isEdit && (
        <>
          {/* <EntityPageSubscribeButton orgQuery={orgQuery} subQuery={subQuery} /> */}

          {tabs}
        </>
      )}

      {session && (isConfig || isEdit) && (
        <>
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

          {isMobile && tabs}
        </>
      )}
    </Layout>
  );
};
