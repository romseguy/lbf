import type { AppSession } from "hooks/useAuth";
import type { Visibility } from "./OrgPage";
import type { IOrg } from "models/Org";
import React, { useState } from "react";
import tw, { css } from "twin.macro";
import { useRouter } from "next/router";
import { Box, Text, useToast, Icon, Grid } from "@chakra-ui/react";
import { ArrowBackIcon, EditIcon } from "@chakra-ui/icons";
import { Button, DeleteButton, Input } from "features/common";
import { useDeleteOrgMutation } from "features/orgs/orgsApi";
import { OrgForm } from "features/forms/OrgForm";
import { OrgConfigBannerPanel } from "./OrgConfigBannerPanel";
import { OrgConfigSubscribersPanel } from "./OrgConfigSubscribersPanel";

export const OrgConfigPanel = ({
  session,
  org,
  orgQuery,
  isConfig,
  isEdit,
  isVisible,
  setIsConfig,
  setIsEdit,
  setIsVisible
}: Visibility & {
  session: AppSession;
  org: IOrg;
  orgQuery: any;
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
        {!isEdit && (
          <>
            <Button
              aria-label="Modifier"
              leftIcon={<Icon as={isEdit ? ArrowBackIcon : EditIcon} />}
              mr={3}
              onClick={() => {
                setIsEdit(!isEdit);
                setIsVisible({
                  ...isVisible,
                  banner: false,
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
                    {` ${org.orgUrl}`}
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
                } catch (error) {
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

      {isEdit ? (
        <OrgForm
          session={session}
          org={org}
          onCancel={() => setIsEdit(false)}
          onSubmit={async (orgUrl) => {
            if (org && orgUrl !== org.orgUrl) {
              await router.push(`/${orgUrl}`);
            } else {
              orgQuery.refetch();
              setIsEdit(false);
              setIsConfig(false);
            }
          }}
        />
      ) : (
        <Grid gridGap={5}>
          <Grid>
            <OrgConfigBannerPanel
              org={org}
              orgQuery={orgQuery}
              isVisible={isVisible}
              setIsVisible={setIsVisible}
            />
          </Grid>

          <Grid>
            <OrgConfigSubscribersPanel
              org={org}
              orgQuery={orgQuery}
              isVisible={isVisible}
              setIsVisible={setIsVisible}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};
