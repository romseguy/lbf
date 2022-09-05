import { ArrowBackIcon, SettingsIcon } from "@chakra-ui/icons";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Link } from "features/common";
import { Forum } from "features/forum/Forum";
import { Layout } from "features/layout";
import { SubscribePopover } from "features/subscriptions/SubscribePopover";
import { PageProps } from "main";
import { getRefId } from "models/Entity";
import { IOrg } from "models/Org";
import { getFollowerSubscription, ISubscription } from "models/Subscription";
import { selectOrgRefetch } from "store/orgSlice";
import { AppQuery, AppQueryWithData } from "utils/types";
import { OrgConfigPanel, OrgConfigVisibility } from "./OrgConfigPanel";
import { OrgPageTabs } from "./OrgPageTabs";

let cachedRefetchOrg = false;

export interface IsEditConfig {
  isAddingChild?: boolean;
  isAddingDescription?: boolean;
  isAddingInfo?: boolean;
}

export const OrgPage = ({
  isMobile,
  orgQuery,
  subQuery,
  session,
  tab,
  tabItem
}: PageProps & {
  orgQuery: AppQueryWithData<IOrg>;
  subQuery: AppQuery<ISubscription>;
  tab?: string;
  tabItem?: string;
}) => {
  //#region org
  const org = orgQuery.data;
  const isCreator =
    org.orgUrl === "nom_de_votre_planete" || // demo page
    session?.user.userId === getRefId(org) ||
    session?.user.isAdmin ||
    false;
  const orgCreatedByUserName =
    typeof org.createdBy === "object"
      ? org.createdBy.userName || org.createdBy._id
      : org.createdBy;
  //#endregion

  //#region sub
  const isFollowed = !!getFollowerSubscription({ org, subQuery });
  //#endregion

  //#region local state
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

  //#region cross refetch
  const refetchOrg = useSelector(selectOrgRefetch);
  useEffect(() => {
    if (refetchOrg !== cachedRefetchOrg) {
      console.log("refetching org");
      cachedRefetchOrg = refetchOrg;
      orgQuery.refetch();
    }
  }, [refetchOrg]);
  //#endregion

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

  const configButtons = () => {
    if (!isCreator) return null;

    return (
      <>
        {/* <Column mb={3}>
         <Heading mb={3}>Configuration {orgTypeFull(org.orgType)}</Heading> */}

        {!isConfig && !isEdit && (
          <Flex flexDirection={isMobile ? "column" : "row"}>
            <Flex mb={isMobile ? 3 : 3}>
              <Button
                colorScheme="red"
                leftIcon={
                  <SettingsIcon boxSize={6} data-cy="org-settings-button" />
                }
                onClick={() => setIsConfig(true)}
              >
                Configurer
              </Button>
            </Flex>
          </Flex>
        )}

        {(isConfig || isEdit) && (
          <Button
            canWrap
            colorScheme="teal"
            leftIcon={<ArrowBackIcon boxSize={6} />}
            onClick={() => {
              if (isEdit) setIsEdit(false);
              else setIsConfig(false);
            }}
            mb={3}
          >
            {/* {`Revenir à ${orgTypeFull5(org.orgType)}`} */}
            Retour
          </Button>
        )}
        {/* </Column> */}
      </>
    );
  };

  const subscribeButtons = () => {
    if (orgQuery.isLoading || isConfig || isEdit) return null;

    if (subQuery.isLoading) return <Spinner />;

    return (
      <Flex flexWrap="wrap" mt={-3}>
        {isFollowed && (
          <Box mr={3} mt={3}>
            <SubscribePopover org={org} query={orgQuery} subQuery={subQuery} />
          </Box>
        )}

        <Box mt={3}>
          <SubscribePopover
            isDisabled={org.orgUrl === "nom_de_votre_planete" && !session}
            org={org}
            query={orgQuery}
            subQuery={subQuery}
            notifType="push"
          />
        </Box>
      </Flex>
    );
  };

  if (org.orgUrl === "forum") {
    return (
      <Layout entity={org} isMobile={isMobile} session={session}>
        {configButtons()}

        {!isConfig && !isEdit && (
          <Forum orgQuery={orgQuery} subQuery={subQuery} tabItem={tabItem} />
        )}

        {session && isCreator && (isConfig || isEdit) && (
          <OrgConfigPanel
            session={session}
            orgQuery={orgQuery}
            subQuery={subQuery}
            isEdit={isEdit}
            isMobile={isMobile}
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
    <Layout entity={org} isMobile={isMobile} session={session}>
      {configButtons()}

      {subscribeButtons()}

      {!isEdit && !isConfig && (
        <Box my={3}>
          <Text fontSize="smaller">
            Organisation ajoutée le{" "}
            {format(parseISO(org.createdAt!), "eeee d MMMM yyyy", {
              locale: fr
            })}{" "}
            par :{" "}
            <Link variant="underline" href={`/${orgCreatedByUserName}`}>
              {orgCreatedByUserName}
            </Link>{" "}
            {isCreator && session && !session.user.isAdmin && "(Vous)"}
          </Text>
        </Box>
      )}

      {!isConfig && !isEdit && (
        <OrgPageTabs
          currentItemName={tabItem}
          currentTabLabel={tab}
          isCreator={isCreator}
          isFollowed={isFollowed}
          isMobile={isMobile}
          orgQuery={orgQuery}
          session={session}
          setIsConfig={setIsConfig}
          setIsEdit={setIsEdit}
          subQuery={subQuery}
        />
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
            isMobile={isMobile}
            isVisible={isVisible}
            setIsConfig={setIsConfig}
            setIsEdit={setIsEdit}
            toggleVisibility={toggleVisibility}
          />
        )}
    </Layout>
  );
};
