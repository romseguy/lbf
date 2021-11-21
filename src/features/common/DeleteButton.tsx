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
  Spinner,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Tooltip,
  useColorMode
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

export const DeleteButton = ({
  isDisabled,
  isLoading,
  isIconOnly,
  header,
  body,
  hasArrow,
  label = "Supprimer",
  placement = "left",
  onClick,
  ...props
}: any & {
  header: React.ReactNode;
  body: React.ReactNode;
  hasArrow?: boolean;
  label?: string;
  placement?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  isIconOnly?: boolean;
  onClick: () => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);

  return (
    <>
      {isIconOnly ? (
        <Tooltip label={label} placement={placement} hasArrow={hasArrow}>
          <IconButton
            aria-label="Supprimer"
            colorScheme="red"
            color={isDark ? "white" : "black"}
            bg="transparent"
            _hover={{ bg: "transparent", color: "red" }}
            height="auto"
            minWidth={0}
            icon={<DeleteIcon />}
            isLoading={isLoading}
            {...props}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
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
            setIsOpen(true);
          }}
          colorScheme="red"
          // css={css`
          //   &:hover {
          //     background-color: red;
          //   }
          //   ${tw`bg-red-400`}
          // `}
        >
          Supprimer
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
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                {header}
              </AlertDialogHeader>

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
                    onClick();
                    onClose();
                  }}
                  ml={3}
                  data-cy="deleteButtonSubmit"
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
