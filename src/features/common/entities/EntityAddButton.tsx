import { AddIcon } from "@chakra-ui/icons";
import { Button, ButtonProps, Icon } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { FaGlobeEurope, FaTree } from "react-icons/fa";
import { EOrgType } from "models/Org";

export const EntityAddButton = ({
  label,
  orgType = EOrgType.GENERIC,
  onClose,
  ...props
}: ButtonProps & {
  label?: string;
  orgType?: EOrgType;
  onClose?: () => void;
}) => {
  const router = useRouter();

  if (orgType === EOrgType.NETWORK)
    return (
      <Button
        colorScheme="teal"
        leftIcon={
          <>
            <AddIcon mr={1} />
            <Icon as={FaGlobeEurope} color="lightblue" />
          </>
        }
        mt={1}
        size="sm"
        onClick={() => {
          onClose && onClose();
          router.push("/planetes/ajouter", "/planetes/ajouter", {
            shallow: true
          });
        }}
        data-cy="org-add-button"
        {...props}
      >
        {label || "Ajouter une planète"}
      </Button>
    );

  return (
    <Button
      colorScheme="teal"
      leftIcon={
        <>
          <AddIcon color="brown.50" mr={1} />
          <Icon as={FaTree} color="lightgreen" />
        </>
      }
      mt={1}
      size="sm"
      onClick={() => {
        onClose && onClose();
        router.push("/arbres/ajouter", "/arbres/ajouter", {
          shallow: true
        });
      }}
      data-cy="org-add-button"
      {...props}
    >
      {label || "Ajouter un arbre"}
    </Button>
  );
};
