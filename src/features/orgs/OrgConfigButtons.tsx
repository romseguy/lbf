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

  const onEdit = () => {
    setIsConfig(false);
    setIsEdit(!isEdit);
    toggleVisibility();
  };

  return (
    <Flex
      flexDirection={isMobile ? "column" : "row"}
      alignItems="center"
      {...props}
    >
      {!isConfig && (
        <Button
          colorScheme="teal"
          leftIcon={<Icon as={isEdit ? ArrowBackIcon : EditIcon} />}
          mb={isMobile ? 3 : 0}
          mr={isMobile ? 0 : 3}
          onClick={onEdit}
        >
          {!isEdit ? "Modifier" : "Retour"}
        </Button>
      )}

      {!isEdit && (
        <Button
          colorScheme="orange"
          leftIcon={<Icon as={isConfig ? ArrowBackIcon : SettingsIcon} />}
          onClick={() => {
            setIsEdit(false);
            setIsConfig(!isConfig);
          }}
        >
          {!isConfig ? "Paramètres" : "Retour"}
        </Button>
      )}
    </Flex>
  );
};
