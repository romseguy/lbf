import type { Visibility } from "./OrgPage";
import type { IOrg } from "models/Org";
import React from "react";
import Router, { useRouter } from "next/router";
import {
  Box,
  Text,
  Heading,
  useToast,
  IconButton,
  Icon,
  Grid
} from "@chakra-ui/react";
import { useDeleteOrgMutation } from "features/orgs/orgsApi";
import { DeleteButton } from "features/common";
import { EditIcon, WarningIcon } from "@chakra-ui/icons";
import tw, { css } from "twin.macro";
import { OrgForm } from "features/forms/OrgForm";
import { OrgConfigBannerPanel } from "./OrgConfigBannerPanel";
import { OrgConfigSubscribersPanel } from "./OrgConfigSubscribersPanel";

export const OrgConfigPanel = ({
  org,
  orgQuery,
  setIsEdit,
  isEdit,
  isVisible,
  setIsVisible
}: Visibility & {
  org: IOrg;
  orgQuery: any;
  setIsEdit: (isEdit: boolean) => void;
  isEdit: boolean;
}) => {
  const router = useRouter();
  const toast = useToast({ position: "top" });
  const [deleteOrg, deleteQuery] = useDeleteOrgMutation();

  return (
    <>
      <Heading size="lg" mb={3}>
        Configuration
      </Heading>

      <Box mb={3}>
        <IconButton
          aria-label="Modifier"
          icon={<Icon as={EditIcon} />}
          mr={3}
          onClick={() => {
            setIsEdit(!isEdit);
            setIsVisible({ ...isVisible, banner: false, subscribers: false });
          }}
          css={css`
            &:hover {
              ${tw`bg-green-300`}
            }
            ${isEdit && tw`bg-green-300`}
          `}
          data-cy="orgEdit"
        />

        <DeleteButton
          isLoading={deleteQuery.isLoading}
          body={
            <Box p={5} lineHeight={2}>
              <WarningIcon color="red" /> Êtes vous certain(e) de vouloir
              supprimer l'organisation{" "}
              <Text display="inline" color="red" fontWeight="bold">
                {org.orgName}
              </Text>{" "}
              ?
            </Box>
          }
          onClick={async () => {
            try {
              const deletedOrg = await deleteOrg(org.orgName).unwrap();

              if (deletedOrg) {
                await Router.push(`/`);
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
      </Box>

      {isEdit ? (
        <OrgForm
          org={org}
          onCancel={() => setIsEdit(false)}
          onSubmit={async (orgName) => {
            if (org && orgName !== org.orgName) {
              await router.push(`/${encodeURIComponent(orgName)}`);
            } else {
              orgQuery.refetch();
              setIsEdit(false);
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
