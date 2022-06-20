import { AddIcon } from "@chakra-ui/icons";
import { Button, ButtonProps } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { FaGlobeEurope, FaTree } from "react-icons/fa";
import { EOrgType } from "models/Org";

export const EntityAddButton = ({
  orgType = EOrgType.GENERIC,
  onClose,
  ...props
}: ButtonProps & {
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
            <FaGlobeEurope />
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
        Ajouter une planète
      </Button>
    );

  return (
    <Button
      colorScheme="teal"
      leftIcon={
        <>
          <AddIcon mr={1} />
          <FaTree />
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
      Ajouter un arbre
    </Button>
  );
};
