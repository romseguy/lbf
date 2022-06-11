import { ArrowBackIcon, EditIcon, Icon, SettingsIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  Input,
  Text,
  useToast
} from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, DeleteButton, Link } from "features/common";
import { Forum } from "features/forum/Forum";
import { Layout } from "features/layout";
import { SubscribePopover } from "features/subscriptions/SubscribePopover";
import { getRefId } from "models/Entity";
import { EOrgType, IOrg, orgTypeFull, orgTypeFull5 } from "models/Org";
import {
  getFollowerSubscription,
  getSubscriberSubscription,
  ISubscription
} from "models/Subscription";
import { PageProps } from "pages/_app";
import { AppQuery, AppQueryWithData } from "utils/types";
import { OrgConfigPanel, OrgConfigVisibility } from "./OrgConfigPanel";
import { OrgPageTabs } from "./OrgPageTabs";
import { selectOrgRefetch } from "./orgSlice";
import { useDeleteOrgMutation } from "./orgsApi";

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
  const [deleteOrg, deleteQuery] = useDeleteOrgMutation();
  const router = useRouter();
  const toast = useToast({ position: "top" });

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
  const isSubscribed = !!getSubscriberSubscription({ org, subQuery });
  //#endregion

  //#region local state
  const [isConfig, setIsConfig] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
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
        {!isConfig && !isEdit && (
          <Flex flexDirection={isMobile ? "column" : "row"} mb={3}>
            <Flex mb={isMobile ? 3 : 0}>
              <Button
                colorScheme="teal"
                leftIcon={
                  <SettingsIcon boxSize={6} data-cy="org-settings-button" />
                }
                mr={3}
                onClick={() => setIsConfig(true)}
              >
                Paramètres
              </Button>
            </Flex>

            <Flex mb={isMobile ? 3 : 0}>
              <Button
                colorScheme="teal"
                leftIcon={<Icon as={isEdit ? ArrowBackIcon : EditIcon} />}
                mr={3}
                onClick={() => {
                  setIsEdit(true);
                  toggleVisibility();
                }}
                data-cy="orgEdit"
              >
                Modifier
              </Button>
            </Flex>

            <Flex>
              <DeleteButton
                isDisabled={isDisabled}
                isLoading={deleteQuery.isLoading}
                label={`${
                  org.orgType === EOrgType.NETWORK ? "Détruire" : "Déraciner"
                } ${orgTypeFull5(org.orgType)}`}
                header={
                  <>
                    Vous êtes sur le point de{" "}
                    {org.orgType === EOrgType.NETWORK
                      ? "détruire la planète"
                      : "déraciner l'arbre"}{" "}
                    <Text display="inline" color="red" fontWeight="bold">
                      {` ${org.orgName}`}
                    </Text>
                  </>
                }
                body={
                  <>
                    <Alert status="warning">
                      <AlertIcon />
                      <Box>
                        Les <b>discussions</b>, les <b>projets</b> et les
                        adresses e-mail associés seront supprimés.
                      </Box>
                    </Alert>
                    <Text mb={1} mt={3}>
                      Confirmez en saisissant le nom {orgTypeFull(org.orgType)}{" "}
                      :
                    </Text>
                    <Input
                      autoComplete="off"
                      onChange={(e) =>
                        setIsDisabled(
                          e.target.value.toLowerCase() !==
                            org.orgName.toLowerCase()
                        )
                      }
                    />
                  </>
                }
                onClick={async () => {
                  try {
                    const deletedOrg = await deleteOrg(org._id).unwrap();

                    if (deletedOrg) {
                      await router.push(`/`);
                      toast({
                        title: `${
                          deletedOrg.orgType === EOrgType.NETWORK
                            ? "La planète"
                            : "L'arbre"
                        } ${deletedOrg.orgName} a été ${
                          deletedOrg.orgType === EOrgType.NETWORK
                            ? "détruite"
                            : "déraciné"
                        } !`,
                        status: "success"
                      });
                    }
                  } catch (error: any) {
                    toast({
                      title: error.data ? error.data.message : error.message,
                      status: "error"
                    });
                  }
                }}
              />
            </Flex>
          </Flex>
        )}

        {!isConfig && !isEdit && <Flex></Flex>}

        {isEdit && (
          <Button
            colorScheme="teal"
            leftIcon={<ArrowBackIcon boxSize={6} />}
            onClick={() => setIsEdit(false)}
            mb={3}
          >
            Retour
          </Button>
        )}

        {!isEdit && isConfig && (
          <Button
            canWrap
            colorScheme="teal"
            leftIcon={<ArrowBackIcon boxSize={6} />}
            onClick={() => setIsConfig(false)}
            mb={2}
          >
            {/* {`Revenir à ${orgTypeFull5(org.orgType)}`} */}
            Retour
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
              isDisabled={org.orgUrl === "nom_de_votre_planete" && !session}
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
          {isCreator && session && !session.user.isAdmin && "(Vous)"}
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
          isMobile={isMobile}
          setIsLogin={setIsLogin}
          orgQuery={orgQuery}
          session={session}
          setIsConfig={setIsConfig}
          setIsEdit={setIsEdit}
          subQuery={subQuery}
        />
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
};
