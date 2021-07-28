import React from "react";
import {
  Button,
  IconButton,
  PopoverTrigger,
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverCloseButton,
  PopoverBody,
  PopoverFooter,
  useDisclosure,
  Spinner
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import tw, { css } from "twin.macro";

export const DeleteButton = ({
  onClick,
  isLoading,
  body
}: {
  onClick: () => void;
  isLoading?: boolean;
  body: any;
}) => {
  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} isLazy>
      <PopoverTrigger>
        <IconButton
          aria-label="Supprimer"
          icon={<DeleteIcon />}
          onClick={() => {
            onClose();
          }}
          css={css`
            &:hover {
              background-color: red;
            }
            ${isOpen && tw`bg-red-400`}
          `}
        />
      </PopoverTrigger>
      <PopoverContent ml={5}>
        <PopoverCloseButton />
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <PopoverBody>{body}</PopoverBody>
            <PopoverFooter d="flex" justifyContent="space-between">
              <Button
                colorScheme="green"
                onClick={() => {
                  onClick();
                  onClose();
                }}
              >
                Supprimer
              </Button>
              <Button onClick={onClose}>Annuler</Button>
            </PopoverFooter>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};
