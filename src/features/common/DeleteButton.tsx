import { DeleteIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  IconButton,
  IconButtonProps,
  PlacementWithLogical,
  Tooltip,
  useColorMode,
  useDisclosure
} from "@chakra-ui/react";
import React from "react";

export const DeleteButton = ({
  "aria-label": ariaLabel = "Supprimer",
  isDisabled,
  isIconOnly,
  isLoading,
  isSmall = true,
  header = "Confirmez la suppression",
  body,
  onClick,
  hasArrow,
  label = "Supprimer",
  placement = "left",
  ...props
}: Omit<IconButtonProps, "aria-label"> & {
  "aria-label"?: string;
  header?: React.ReactNode;
  body?: React.ReactNode;
  isDisabled?: boolean;
  isIconOnly?: boolean;
  isLoading?: boolean;
  isSmall?: boolean;
  onClick?: () => void;
  // tooltip props
  hasArrow?: boolean;
  label?: string;
  placement?: PlacementWithLogical;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { onOpen, onClose, isOpen } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  let styleProps = {};

  if (isIconOnly && isSmall)
    styleProps = {
      ...styleProps,
      bg: "transparent",
      color: isDark ? "white" : "black",
      _hover: { bg: "transparent", color: "red" },
      height: "auto",
      minWidth: 0
    };

  return (
    <>
      {isIconOnly ? (
        <Tooltip label={label} placement={placement} hasArrow={hasArrow}>
          <IconButton
            aria-label={ariaLabel}
            colorScheme="red"
            icon={<DeleteIcon />}
            isLoading={isLoading}
            {...styleProps}
            {...props}
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
          />
        </Tooltip>
      ) : (
        <Button
          {...props}
          aria-label="Supprimer"
          leftIcon={<DeleteIcon />}
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          colorScheme="red"
          // css={css`
          //   &:hover {
          //     background-color: red;
          //   }
          //   ${tw`bg-red-400`}
          // `}
        >
          {label}
        </Button>
      )}

      {isOpen && (
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              {header && (
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  {header}
                </AlertDialogHeader>
              )}

              <AlertDialogBody>{body}</AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Annuler
                </Button>
                <Button
                  isDisabled={isDisabled}
                  isLoading={isLoading}
                  colorScheme="red"
                  onClick={() => {
                    onClick && onClick();
                    onClose();
                  }}
                  ml={3}
                  data-cy="delete-submit-button"
                >
                  Supprimer
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
    </>
  );

  // const { onOpen, onClose, isOpen } = useDisclosure();
  // return (
  //   <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} isLazy>
  //     <PopoverTrigger>
  //     </PopoverTrigger>
  //     <PopoverContent ml={5}>
  //       <PopoverCloseButton />
  //       {isLoading ? (
  //         <Spinner />
  //       ) : (
  //         <>
  //           <PopoverBody>{body}</PopoverBody>
  //           <PopoverFooter d="flex" justifyContent="space-between">
  //             <Button
  //               colorScheme="green"
  //               onClick={() => {
  //                 onClick();
  //                 onClose();
  //               }}
  //             >
  //               Supprimer
  //             </Button>
  //             <Button onClick={onClose}>Annuler</Button>
  //           </PopoverFooter>
  //         </>
  //       )}
  //     </PopoverContent>
  //   </Popover>
  // );
};
