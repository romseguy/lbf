import { SettingsIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { Flex, Button, ButtonProps } from "@chakra-ui/react";
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

  return (
    <>
      {!isConfig && !isEdit && (
        <Flex flexDirection={isMobile ? "column" : "row"}>
          <Button
            colorScheme="red"
            leftIcon={
              <SettingsIcon boxSize={6} data-cy="org-settings-button" />
            }
            onClick={() => setIsConfig(true)}
            {...props}
          >
            {children || "Configurer"}
          </Button>
        </Flex>
      )}

      {(isConfig || isEdit) && (
        <Button
          //canWrap
          colorScheme="teal"
          leftIcon={<ArrowBackIcon boxSize={6} />}
          onClick={() => {
            if (isEdit) setIsEdit(false);
            else setIsConfig(false);
          }}
          {...props}
        >
          Retour
        </Button>
      )}
    </>
  );
};
