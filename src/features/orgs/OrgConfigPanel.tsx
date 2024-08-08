import { Icon, Text, useColorMode } from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import { useRouter } from "next/router";
import React from "react";
import {
  Column,
  EntityConfigBannerPanel,
  EntityConfigLogoPanel,
  EntityConfigCategoriesPanel,
  AppHeading
} from "features/common";
import { OrgForm } from "features/forms/OrgForm";
import { getEventCategories, IOrg } from "models/Org";
import { ISubscription } from "models/Subscription";
import { Session } from "utils/auth";
import { AppQuery, AppQueryWithData } from "utils/types";
import { OrgConfigListsPanel } from "./OrgConfigListsPanel";
import { OrgConfigSubscribersPanel } from "./OrgConfigSubscribersPanel";
import { IsEditConfig } from "./OrgPage";
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";
import { EEntityCategoryKey } from "models/Entity";
import { EditIcon, SettingsIcon } from "@chakra-ui/icons";

export type OrgConfigVisibility = {
  isVisible: Record<string, boolean>;
  toggleVisibility: (
    key?: keyof OrgConfigVisibility["isVisible"],
    bool?: boolean
  ) => void;
};

export const OrgConfigPanel = ({
  session,
  orgQuery,
  subQuery,
  isCreator,
  isEdit,
  isEditConfig,
  isVisible,
  setIsConfig,
  setIsEdit,
  toggleVisibility
}: OrgConfigVisibility & {
  session: Session;
  orgQuery: AppQueryWithData<IOrg>;
  subQuery: AppQuery<ISubscription>;
  isCreator?: boolean;
  isEdit: boolean;
  isEditConfig?: IsEditConfig;
  setIsConfig: (isConfig: boolean) => void;
  setIsEdit: (arg: boolean | IsEditConfig) => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);
  const router = useRouter();
  const org = orgQuery.data;

  return (
    <>
      {!isEdit && (
        <>
          <AppHeading mx={3} mb={3}>
            <Icon
              as={SettingsIcon}
              color={isDark ? "white" : "black"}
              boxSize={10}
              mb={1}
              mr={3}
            />
            Paramètres de l'atelier
          </AppHeading>
        </>
      )}

      {isEdit && (
        <>
          <AppHeading mx={3} mb={3}>
            <Icon
              as={EditIcon}
              color={isDark ? "white" : "black"}
              boxSize={10}
              mb={1}
              mr={3}
            />
            Modifier l'atelier
          </AppHeading>

          <Column mx={3}>
            <OrgForm
              isCreator={isCreator}
              isEditConfig={isEditConfig}
              session={session}
              orgQuery={orgQuery}
              onCancel={() => {
                setIsEdit(false);
                //setIsConfig(false);
              }}
              onSubmit={async (orgUrl: string) => {
                setIsEdit(false);
                setIsConfig(false);

                if (orgUrl !== org.orgUrl) {
                  await router.push(`/${orgUrl}`, `/${orgUrl}`, {
                    shallow: true
                  });
                }
              }}
            />
          </Column>
        </>
      )}

      {!isEdit && (
        <>
          <Column mx={3} mb={3} pt={1}>
            <Text fontSize="3xl" mb={3}>
              Apparence
            </Text>

            {/* <EntityConfigStyles query={orgQuery} mt={3} mb={2} /> */}

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

          <Column mx={3} mb={3} pt={1}>
            <Text fontSize="3xl" mb={3}>
              Personnes & Listes
            </Text>

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

          <Column mx={3} mb={3} pt={1}>
            <Text fontSize="3xl" mb={3}>
              Discussions
            </Text>

            <EntityConfigCategoriesPanel
              categories={org.orgTopicCategories}
              categoryKey={EEntityCategoryKey.orgTopicCategories}
              query={orgQuery}
              isVisible={isVisible}
              toggleVisibility={toggleVisibility}
            />
          </Column>

          <Column mx={3} pt={1}>
            <Text fontSize="3xl" mb={3}>
              Événements
            </Text>

            <EntityConfigCategoriesPanel
              categories={getEventCategories(org)}
              categoryKey={EEntityCategoryKey.orgEventCategories}
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
