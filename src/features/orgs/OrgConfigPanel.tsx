import { ArrowBackIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Input,
  Text,
  useToast,
  Icon,
  Switch,
  FormControl,
  FormLabel
} from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  Column,
  DeleteButton,
  EntityConfigBannerPanel,
  EntityConfigLogoPanel,
  EntityConfigStyles,
  Heading
} from "features/common";
import { OrgForm } from "features/forms/OrgForm";
import { useDeleteOrgMutation } from "features/orgs/orgsApi";
import { IOrg } from "models/Org";
import { ISubscription } from "models/Subscription";
import { useAppDispatch } from "store";
import { AppQuery, AppQueryWithData } from "utils/types";
import { OrgConfigListsPanel } from "./OrgConfigListsPanel";
import { OrgConfigSubscribersPanel } from "./OrgConfigSubscribersPanel";
import { refetchOrgs } from "./orgSlice";

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
  session: Session | null;
  orgQuery: AppQueryWithData<IOrg>;
  subQuery: AppQuery<ISubscription>;
  isConfig: boolean;
  isEdit: boolean;
  setIsConfig: (isConfig: boolean) => void;
  setIsEdit: (isEdit: boolean) => void;
}) => {
  const dispatch = useAppDispatch();
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
                    dispatch(refetchOrgs());
                    await router.push(`/`);
                    toast({
                      title: `${deletedOrg.orgName} a été supprimé !`,
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
          </>
        )}
      </Box>

      {isEdit && (
        <Column m={undefined}>
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
        </Column>
      )}

      {isConfig && !isEdit && (
        <Column m="">
          <Heading mb={1}>Gestion des membres</Heading>
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
          />

          <Heading mb={1} mt={3}>
            Apparence
          </Heading>

          <EntityConfigStyles query={orgQuery} my={3} />

          <EntityConfigLogoPanel
            query={orgQuery}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            mb={3}
          />
          <EntityConfigBannerPanel
            query={orgQuery}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            mb={3}
          />
        </Column>
      )}
    </>
  );
};
