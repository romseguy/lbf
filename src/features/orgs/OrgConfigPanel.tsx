import { ArrowBackIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Icon, Input, Text, useToast } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  Column,
  DeleteButton,
  EntityConfigBannerPanel,
  EntityConfigLogoPanel,
  EntityConfigCategoriesPanel,
  EntityConfigStyles,
  Heading
} from "features/common";
import { OrgForm } from "features/forms/OrgForm";
import { useDeleteOrgMutation } from "features/orgs/orgsApi";
import {
  EOrgType,
  getOrgEventCategories,
  IOrg,
  orgTypeFull,
  orgTypeFull5
} from "models/Org";
import { ISubscription } from "models/Subscription";
import { AppQuery, AppQueryWithData, TypedMap } from "utils/types";
import { OrgConfigListsPanel } from "./OrgConfigListsPanel";
import { OrgConfigSubscribersPanel } from "./OrgConfigSubscribersPanel";

export type OrgConfigVisibility = {
  isVisible: TypedMap<string, boolean>;
  toggleVisibility: (
    key?: keyof OrgConfigVisibility["isVisible"],
    bool?: boolean
  ) => void;
};

export const OrgConfigPanel = ({
  session,
  orgQuery,
  subQuery,
  isEdit,
  setIsConfig,
  setIsEdit
}: {
  session: Session;
  orgQuery: AppQueryWithData<IOrg>;
  subQuery: AppQuery<ISubscription>;
  isEdit: boolean;
  setIsConfig: (isConfig: boolean) => void;
  setIsEdit: (isEdit: boolean) => void;
}) => {
  const [deleteOrg, deleteQuery] = useDeleteOrgMutation();
  const org = orgQuery.data;
  const router = useRouter();
  const toast = useToast({ position: "top" });

  //#region local state
  const [isDisabled, setIsDisabled] = useState(true);
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

  return (
    <>
      {isEdit && (
        <Column>
          <OrgForm
            session={session}
            orgQuery={orgQuery as AppQuery<IOrg>}
            onCancel={() => {
              setIsEdit(false);
              setIsConfig(true);
            }}
            onSubmit={async (orgUrl: string) => {
              if (orgUrl !== org.orgUrl) {
                await router.push(`/${orgUrl}`, `/${orgUrl}`, {
                  shallow: true
                });
              } else {
                setIsEdit(false);
                setIsConfig(false);
              }
            }}
          />
        </Column>
      )}

      {!isEdit && (
        <>
          <Box mb={3}>
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

            <DeleteButton
              isDisabled={isDisabled}
              isLoading={deleteQuery.isLoading}
              label={`${
                org.orgType === EOrgType.NETWORK ? "Détruire" : "Déraciner"
              } ${orgTypeFull5(org.orgType)} ${org.orgName}`}
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
                  Saisissez le nom {orgTypeFull(org.orgType)} pour confimer{" "}
                  {org.orgType === EOrgType.NETWORK
                    ? "sa destruction"
                    : "son déracinement"}{" "}
                  :
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
                      title: `${deletedOrg.orgName} a été détruite !`,
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
          </Box>

          <Column mb={3} pt={1}>
            <Heading>Apparence</Heading>

            <EntityConfigStyles query={orgQuery} mt={3} mb={2} />

            <EntityConfigLogoPanel
              query={orgQuery}
              isVisible={isVisible}
              toggleVisibility={toggleVisibility}
              mb={3}
            />

            <EntityConfigBannerPanel
              query={orgQuery}
              isVisible={isVisible}
              toggleVisibility={toggleVisibility}
            />
          </Column>

          <Column mb={3} pt={1}>
            <Heading mb={1}>Membres & Listes</Heading>
            <OrgConfigSubscribersPanel
              orgQuery={orgQuery}
              subQuery={subQuery}
              isVisible={isVisible}
              toggleVisibility={toggleVisibility}
              mb={3}
            />

            <OrgConfigListsPanel
              orgQuery={orgQuery}
              isVisible={isVisible}
              toggleVisibility={toggleVisibility}
            />
          </Column>

          <Column mb={3} pt={1}>
            <Heading>Discussions</Heading>

            <EntityConfigCategoriesPanel
              fieldName="orgTopicCategories"
              categories={org.orgTopicCategories}
              query={orgQuery}
              isVisible={isVisible}
              toggleVisibility={toggleVisibility}
            />
          </Column>

          <Column pt={1}>
            <Heading>Événements</Heading>

            <EntityConfigCategoriesPanel
              fieldName="orgEventCategories"
              categories={getOrgEventCategories(org)}
              query={orgQuery}
              isVisible={isVisible}
              toggleVisibility={toggleVisibility}
            />
          </Column>
        </>
      )}
    </>
  );
};
