import { ArrowBackIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Input, Text, useToast, Icon } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useState } from "react";
import tw, { css } from "twin.macro";
import { IOrg } from "models/Org";
import { DeleteButton, PageContainer } from "features/common";
import { useDeleteOrgMutation } from "features/orgs/orgsApi";
import { OrgConfigBannerPanel } from "./OrgConfigBannerPanel";
import { OrgConfigListsPanel } from "./OrgConfigListsPanel";
import { OrgConfigLogoPanel } from "./OrgConfigLogoPanel";
import { OrgConfigSubscribersPanel } from "./OrgConfigSubscribersPanel";
import { OrgForm } from "features/forms/OrgForm";
import { Visibility } from "./OrgPage";

export const OrgConfigPanel = ({
  session,
  org,
  orgQuery,
  subQuery,
  isConfig,
  isEdit,
  isVisible,
  setIsConfig,
  setIsEdit,
  setIsVisible
}: Visibility & {
  session: Session;
  org: IOrg;
  orgQuery: any;
  subQuery: any;
  isConfig: boolean;
  isEdit: boolean;
  setIsConfig: (isConfig: boolean) => void;
  setIsEdit: (isEdit: boolean) => void;
}) => {
  const router = useRouter();
  const toast = useToast({ position: "top" });
  const [deleteOrg, deleteQuery] = useDeleteOrgMutation();
  const [isDisabled, setIsDisabled] = useState(true);

  return (
    <>
      <Box mb={3}>
        {isConfig && !isEdit && (
          <>
            <Button
              aria-label="Modifier"
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
              css={css`
                &:hover {
                  ${tw`bg-green-300`}
                }
              `}
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
            org={org}
            orgQuery={orgQuery}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            mb={3}
          />

          <OrgConfigBannerPanel
            org={org}
            orgQuery={orgQuery}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            mb={3}
          />

          <OrgConfigSubscribersPanel
            org={org}
            orgQuery={orgQuery}
            subQuery={subQuery}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            mb={3}
          />

          <OrgConfigListsPanel
            org={org}
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
