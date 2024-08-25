import { ArrowBackIcon, EditIcon, Icon, SettingsIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Checkbox,
  Flex,
  FlexProps,
  Input,
  Text
} from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import { useRouter } from "next/router";
import React, { useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useSelector } from "react-redux";
import { useDeleteOrgMutation } from "features/api/orgsApi";
import { Button, DeleteButton } from "features/common";
import {
  EOrgType,
  IOrg,
  orgTypeFull,
  orgTypeFull2,
  orgTypeFull4,
  orgTypeFull5
} from "models/Org";
import { selectIsMobile } from "store/uiSlice";
import { hasItems } from "utils/array";
import { AppQueryWithData } from "utils/types";
import { OrgConfigVisibility } from "./OrgConfigPanel";
import { IsEditConfig } from "./OrgPage";

export const OrgConfigButtons = ({
  orgQuery,
  isConfig,
  setIsConfig,
  isEdit,
  setIsEdit,
  toggleVisibility,
  ...props
}: FlexProps &
  Omit<OrgConfigVisibility, "isVisible"> & {
    orgQuery: AppQueryWithData<IOrg>;
    isConfig: boolean;
    setIsConfig: (isConfig: boolean) => void;
    isEdit: boolean;
    setIsEdit: (isEdit: boolean) => void;
  }) => {
  const { showBoundary } = useErrorBoundary();
  const isMobile = useSelector(selectIsMobile);
  const router = useRouter();
  const toast = useToast({ position: "top" });
  const org = orgQuery.data;
  const [deleteOrg, deleteQuery] = useDeleteOrgMutation();
  const [isDisabled, setIsDisabled] = useState(true);
  const [isDeleteOrgEvents, setIsDeleteOrgEvents] = useState(false);

  const onDelete = async () => {
    try {
      const deletedOrg = await deleteOrg({
        orgId: org._id,
        isDeleteOrgEvents
      }).unwrap();

      if (deletedOrg) {
        await router.push(`/`);
        toast({
          title: `${orgTypeFull5(deletedOrg.orgType, true)} ${
            deletedOrg.orgName
          } a été ${
            deletedOrg.orgType === EOrgType.NETWORK ? "supprimée" : "déraciné"
          } !`,
          status: "success"
        });
      }
    } catch (error) {
      showBoundary(error);
    }
  };

  const onEdit = () => {
    setIsConfig(false);
    setIsEdit(!isEdit);
    toggleVisibility();
  };

  return (
    <Flex flexDirection={isMobile ? "column" : "row"} {...props}>
      {!isConfig && (
        <Flex my={isMobile ? 3 : 3}>
          <Button
            colorScheme="teal"
            leftIcon={<Icon as={isEdit ? ArrowBackIcon : EditIcon} />}
            mr={3}
            onClick={onEdit}
            data-cy="orgEdit"
          >
            {!isEdit ? "Modifier" : "Retour"}
          </Button>
        </Flex>
      )}

      {!isEdit && (
        <Flex mb={isMobile ? 3 : 3}>
          <Button
            colorScheme="orange"
            leftIcon={<Icon as={isConfig ? ArrowBackIcon : SettingsIcon} />}
            mr={3}
            onClick={() => {
              setIsEdit(false);
              setIsConfig(!isConfig);
            }}
          >
            {!isConfig ? "Paramètres" : "Retour"}
          </Button>
        </Flex>
      )}

      {/*<Flex mb={isMobile ? 3 : 3}>
         <DeleteButton
          isDisabled={isDisabled}
          isLoading={deleteQuery.isLoading}
          label={`Supprimer`}
          header={
            <>
              Vous êtes sur le point de{" "}
              {`supprimer ${orgTypeFull5(org.orgType)}`}{" "}
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
                  Toutes les données associées {orgTypeFull2(org.orgType)}{" "}
                  seront supprimées. Cette action est{" "}
                  <strong>irréversible</strong> !
                </Box>
              </Alert>

              <Text mb={1} mt={3}>
                <strong>Confirmez</strong> en saisissant le nom{" "}
                {orgTypeFull(org.orgType)} :
              </Text>
              <Input
                autoComplete="off"
                onChange={(e) =>
                  setIsDisabled(
                    e.target.value.toLowerCase() !== org.orgName.toLowerCase()
                  )
                }
              />

              {hasItems(org.orgEvents) && (
                <Checkbox
                  onChange={(e) => setIsDeleteOrgEvents(e.target.checked)}
                >
                  Supprimer les événements associés à{" "}
                  {orgTypeFull4(org.orgType)}
                </Checkbox>
              )}
            </>
          }
          onClick={onDelete}
        /> 
      </Flex>*/}
    </Flex>
  );
};
