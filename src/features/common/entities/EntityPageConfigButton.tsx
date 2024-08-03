import { SettingsIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { Flex, Button, ButtonProps } from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import React from "react";
import { useSelector } from "react-redux";
import { IsEditConfig } from "features/orgs/OrgPage";
import { selectIsMobile } from "store/uiSlice";

interface EntityPageConfigButtonProps extends ButtonProps {
  isConfig: boolean;
  isEdit: boolean;
  setIsConfig: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEdit:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((arg: boolean | IsEditConfig) => void);
}

export const EntityPageConfigButton = ({
  children,
  isConfig,
  isEdit,
  setIsConfig,
  setIsEdit,
  ...props
}: React.PropsWithChildren<EntityPageConfigButtonProps>) => {
  const isMobile = useSelector(selectIsMobile);

  return;
};
