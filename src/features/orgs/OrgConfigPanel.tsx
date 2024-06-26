import { useRouter } from "next/router";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  Column,
  EntityConfigBannerPanel,
  EntityConfigLogoPanel,
  EntityConfigCategoriesPanel,
  EntityConfigStyles,
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
import { OrgConfigButtons } from "./OrgConfigButtons";
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";
import { EEntityCategoryKey } from "models/Entity";
import { useToast } from "@chakra-ui/react";

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
  const isMobile = useSelector(selectIsMobile);
  const router = useRouter();
  const org = orgQuery.data;
  const buttons = (
    <OrgConfigButtons
      isEdit={isEdit}
      isVisible={isVisible}
      orgQuery={orgQuery}
      setIsEdit={setIsEdit}
      toggleVisibility={toggleVisibility}
    />
  );

  return (
    <>
      {isEdit && (
        <Column>
          <OrgForm
            isCreator={isCreator}
            isEditConfig={isEditConfig}
            session={session}
            orgQuery={orgQuery as AppQuery<IOrg>}
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
      )}

      {!isEdit && (
        <>
          {buttons}

          <Column mb={3} pt={1}>
            <AppHeading>Apparence</AppHeading>

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
            <AppHeading mb={1}>Membres & Listes</AppHeading>
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
            <AppHeading>Discussions</AppHeading>

            <EntityConfigCategoriesPanel
              categories={org.orgTopicCategories}
              categoryKey={EEntityCategoryKey.orgTopicCategories}
              query={orgQuery}
              isVisible={isVisible}
              toggleVisibility={toggleVisibility}
            />
          </Column>

          <Column pt={1}>
            <AppHeading>Événements</AppHeading>

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
