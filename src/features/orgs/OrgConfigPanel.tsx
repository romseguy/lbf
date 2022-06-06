import { ArrowBackIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Icon, Input, Text, useToast } from "@chakra-ui/react";
import { Session } from "lib/SessionContext";
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
  isVisible,
  setIsConfig,
  setIsEdit,
  toggleVisibility
}: OrgConfigVisibility & {
  session: Session;
  orgQuery: AppQueryWithData<IOrg>;
  subQuery: AppQuery<ISubscription>;
  isEdit: boolean;
  setIsConfig: (isConfig: boolean) => void;
  setIsEdit: (isEdit: boolean) => void;
}) => {
  const org = orgQuery.data;
  const router = useRouter();

  //#region local state
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
              setIsConfig(false);
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
