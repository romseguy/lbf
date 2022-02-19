import { ArrowBackIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Input, Text, useToast, Icon } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { DeleteButton, PageContainer } from "features/common";
import { OrgForm } from "features/forms/OrgForm";
import { useDeleteOrgMutation } from "features/orgs/orgsApi";
import { IOrg } from "models/Org";
import { ISubscription } from "models/Subscription";
import { AppQuery } from "utils/types";
import { OrgConfigBannerPanel } from "./OrgConfigBannerPanel";
import { OrgConfigListsPanel } from "./OrgConfigListsPanel";
import { OrgConfigLogoPanel } from "./OrgConfigLogoPanel";
import { OrgConfigSubscribersPanel } from "./OrgConfigSubscribersPanel";

export type OrgConfigVisibility = {
  isVisible: {
    banner?: boolean;
    logo?: boolean;
    lists?: boolean;
    subscribers?: boolean;
    topics?: boolean;
  };
  setIsVisible: (obj: OrgConfigVisibility["isVisible"]) => void;
};

export const OrgConfigPanel = ({
  session,
  orgQuery,
  subQuery,
  isConfig,
  isEdit,
  setIsConfig,
  setIsEdit
}: {
  session: Session;
  orgQuery: AppQuery<IOrg>;
  subQuery: AppQuery<ISubscription>;
  isConfig: boolean;
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
  const [isVisible, setIsVisible] = useState<OrgConfigVisibility["isVisible"]>({
    logo: false,
    banner: false,
    topics: false,
    subscribers: false
  });
  //#endregion

  return (
    <>
      <Box mb={3}>
        {isConfig && !isEdit && (
          <>
            <Button
              colorScheme="teal"
              leftIcon={<Icon as={isEdit ? ArrowBackIcon : EditIcon} />}
              mr={3}
              onClick={() => {
                setIsEdit(true);
                setIsVisible({
                  banner: false,
                  lists: false,
                  logo: false,
                  subscribers: false
                });
              }}
              data-cy="orgEdit"
            >
              Modifier
            </Button>

            <DeleteButton
              isDisabled={isDisabled}
              isLoading={deleteQuery.isLoading}
              header={
                <>
                  Vous êtes sur le point de supprimer l'organisation
                  <Text display="inline" color="red" fontWeight="bold">
                    {` ${org.orgName}`}
                  </Text>
                </>
              }
              body={
                <>
                  Saisissez le nom de l'organisation pour confimer sa
                  suppression :
                  <Input
                    autoComplete="off"
                    onChange={(e) =>
                      setIsDisabled(e.target.value !== org.orgName)
                    }
                  />
                </>
              }
              onClick={async () => {
                try {
                  const deletedOrg = await deleteOrg(org.orgUrl).unwrap();

                  if (deletedOrg) {
                    await router.push(`/`);
                    toast({
                      title: `${deletedOrg.orgName} a bien été supprimé !`,
                      status: "success",
                      isClosable: true
                    });
                  }
                } catch (error: any) {
                  toast({
                    title: error.data ? error.data.message : error.message,
                    status: "error",
                    isClosable: true
                  });
                }
              }}
            />
          </>
        )}
      </Box>

      {isEdit && (
        <PageContainer m="">
          <OrgForm
            session={session}
            org={org}
            onCancel={() => {
              setIsEdit(false);
              setIsConfig(true);
            }}
            onSubmit={async (orgUrl: string) => {
              if (orgUrl !== org.orgUrl)
                await router.push(`/${orgUrl}`, `/${orgUrl}`, {
                  shallow: true
                });
              else {
                orgQuery.refetch();
                setIsEdit(false);
              }
            }}
          />
        </PageContainer>
      )}

      {isConfig && !isEdit && (
        <PageContainer m="">
          <OrgConfigLogoPanel
            orgQuery={orgQuery}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            mb={3}
          />

          <OrgConfigBannerPanel
            orgQuery={orgQuery}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            mb={3}
          />

          <OrgConfigSubscribersPanel
            orgQuery={orgQuery}
            subQuery={subQuery}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            mb={3}
          />

          <OrgConfigListsPanel
            orgQuery={orgQuery}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            session={session}
          />
        </PageContainer>
      )}
    </>
  );
};
