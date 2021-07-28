import React, { useEffect, useState } from "react";
import { IoIosPeople, IoMdCheckmarkCircle } from "react-icons/io";
import {
  List,
  ListItem,
  ListIcon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  useColorModeValue,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  IconButton,
  Spinner,
  Button,
  Box
} from "@chakra-ui/react";
import { OrgForm } from "features/forms/OrgForm";
import { getOrgsByCreator } from "features/orgs/orgsApi";
import { Link } from "features/common";
import { useSession } from "hooks/useAuth";
import { AddIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

export const OrgPopover = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const { isOpen: isOrgModalOpen, onOpen, onClose } = useDisclosure();
  const iconHoverColor = useColorModeValue("white", "lightgreen");

  const {
    data: myOrgs = [],
    refetch,
    isLoading
  } = getOrgsByCreator.useQuery(session?.user.userId);
  const router = useRouter();

  useEffect(() => {
    refetch();
  }, [router.asPath]);

  return (
    <>
      <Popover isLazy isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <PopoverTrigger>
          <IconButton
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Social"
            mr={2}
            bg="transparent"
            _hover={{ bg: "transparent" }}
            w="48px"
            h="48px"
            icon={
              <Icon
                as={IoIosPeople}
                w="48px"
                h="48px"
                _hover={{ color: iconHoverColor }}
              />
            }
            data-cy="orgPopover"
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>Mes organisations</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <Box>
              {isLoading ? (
                <Spinner />
              ) : (
                <List>
                  {myOrgs.map(({ orgName }, index) => (
                    <ListItem mb={1} key={index}>
                      <ListIcon as={IoMdCheckmarkCircle} color="green.500" />{" "}
                      <Link
                        onClick={() => {
                          setIsOpen(false);
                        }}
                        href={`/${encodeURIComponent(orgName)}`}
                      >
                        {orgName}
                      </Link>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
            <Button
              onClick={onOpen}
              leftIcon={<AddIcon />}
              data-cy="addOrg"
              mt={1}
            >
              Ajouter une organisation
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>

      <Modal
        isOpen={isOrgModalOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ajouter une organisation</ModalHeader>
          <ModalCloseButton data-cy="orgPopoverCloseButton" />
          <ModalBody>
            <OrgForm
              onCancel={onClose}
              onSubmit={async (orgName) => {
                onClose();
                await router.push(`/${encodeURIComponent(orgName)}`);
              }}
              onClose={() => {
                onClose();
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
