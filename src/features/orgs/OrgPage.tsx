import { ArrowBackIcon, SettingsIcon } from "@chakra-ui/icons";
import { Alert, AlertIcon, Box, Button, Flex, Text } from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "features/common";
import { Forum } from "features/forum/Forum";
import { Layout } from "features/layout";
import { SubscribePopover } from "features/subscriptions/SubscribePopover";
import { IOrg, orgTypeFull } from "models/Org";
import {
  getFollowerSubscription,
  getSubscriberSubscription,
  ISubscription
} from "models/Subscription";
import { PageProps } from "pages/_app";
import { getRefId } from "utils/models";
import { AppQuery, AppQueryWithData } from "utils/types";
import { OrgConfigPanel } from "./OrgConfigPanel";
import { OrgPageTabs } from "./OrgPageTabs";
import { selectOrgRefetch } from "./orgSlice";

let cachedRefetchOrg = false;

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
    session?.user.userId === getRefId(org) || session?.user.isAdmin || false;
  const orgCreatedByUserName =
    typeof org.createdBy === "object"
      ? org.createdBy.userName || org.createdBy._id
      : org.createdBy;
  //#endregion

  //#region sub
  const isFollowed = !!getFollowerSubscription({ org, subQuery });
  const isSubscribed = !!getSubscriberSubscription({ org, subQuery });
  //#endregion

  //#region local state
  const [isConfig, setIsConfig] = useState(false);
  const [isLogin, setIsLogin] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
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

  const configButtons = () => {
    return (
      <>
        {isCreator && !isConfig && !isEdit && (
          <Button
            colorScheme="teal"
            leftIcon={
              <SettingsIcon boxSize={6} data-cy="org-settings-button" />
            }
            onClick={() => setIsConfig(true)}
            mb={2}
          >
            Configuration {orgTypeFull(org.orgType)}
          </Button>
        )}

        {isEdit && (
          <Button
            colorScheme="teal"
            leftIcon={<ArrowBackIcon boxSize={6} />}
            onClick={() => setIsEdit(false)}
            mb={2}
          >
            Retour
          </Button>
        )}

        {!isEdit && isConfig && (
          <Button
            colorScheme="teal"
            leftIcon={<ArrowBackIcon boxSize={6} />}
            onClick={() => setIsConfig(false)}
            mb={2}
          >
            {`Revenir à la page ${orgTypeFull(org.orgType)}`}
          </Button>
        )}
      </>
    );
  };

  if (org.orgUrl === "forum") {
    return (
      <Layout org={org} isLogin={isLogin} isMobile={isMobile} session={session}>
        {configButtons()}
        {!isConfig && !isEdit && (
          <Forum
            isLogin={isLogin}
            setIsLogin={setIsLogin}
            orgQuery={orgQuery}
            subQuery={subQuery}
            tabItem={tabItem}
          />
        )}
        {session && isCreator && (
          <OrgConfigPanel
            session={session}
            orgQuery={orgQuery}
            subQuery={subQuery}
            isConfig={isConfig}
            isEdit={isEdit}
            setIsConfig={setIsConfig}
            setIsEdit={setIsEdit}
          />
        )}
      </Layout>
    );
  }

  return (
    <Layout org={org} isLogin={isLogin} isMobile={isMobile} session={session}>
      {configButtons()}

      {!isConfig && !isEdit && !subQuery.isLoading && (
        <Flex flexDirection="row" flexWrap="wrap" mt={-3}>
          {isFollowed && (
            <Box mr={3} mt={3}>
              <SubscribePopover
                org={org}
                query={orgQuery}
                subQuery={subQuery}
              />
            </Box>
          )}

          <Box mt={3}>
            <SubscribePopover
              org={org}
              query={orgQuery}
              subQuery={subQuery}
              notifType="push"
            />
          </Box>
        </Flex>
      )}

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
          {isCreator && !session?.user.isAdmin && "(Vous)"}
        </Text>
      </Box>

      {isSubscribed && !isConfig && (
        <Alert status="info" mb={3}>
          <AlertIcon />
          <Box>
            Vous êtes adhérent {orgTypeFull(org.orgType)} {org.orgName}.
            <Text fontSize="smaller">
              Vous avez donc également accès aux événements, discussions et
              projets réservés aux adhérents.
            </Text>
          </Box>
        </Alert>
      )}

      {!isConfig && !isEdit && (
        <OrgPageTabs
          currentItemName={tabItem}
          currentTabLabel={tab}
          isCreator={isCreator}
          isFollowed={isFollowed}
          isSubscribed={isSubscribed}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          orgQuery={orgQuery}
          session={session}
          setIsEdit={setIsEdit}
          subQuery={subQuery}
        />
      )}

      {session && isCreator && (
        <OrgConfigPanel
          session={session}
          orgQuery={orgQuery}
          subQuery={subQuery}
          isConfig={isConfig}
          isEdit={isEdit}
          setIsConfig={setIsConfig}
          setIsEdit={setIsEdit}
        />
      )}
    </Layout>
  );
};
