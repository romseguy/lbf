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
  SpaceProps
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import tw, { css } from "twin.macro";

export const DeleteButton = ({
  onClick,
  isDisabled,
  isLoading,
  isIconOnly,
  header,
  body,
  ...props
}: SpaceProps & {
  header: React.ReactNode;
  body: React.ReactNode;
  onClick: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  isIconOnly?: boolean;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);

  return (
    <>
      {isIconOnly ? (
        <Tooltip label="Supprimer" placement="left">
          <DeleteIcon
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
