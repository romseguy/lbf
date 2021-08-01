import React, { useEffect, useState } from "react";
import { IoIosPeople, IoMdCheckmarkCircle, IoMdPeople } from "react-icons/io";
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
  Box,
  Heading,
  BoxProps
} from "@chakra-ui/react";
import { OrgForm } from "features/forms/OrgForm";
import { getOrgsByCreator } from "features/orgs/orgsApi";
import { Link } from "features/common";
import { useSession } from "hooks/useAuth";
import { AddIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { FaPeopleCarry } from "react-icons/fa";

export const OrgPopover = (props: BoxProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const { isOpen: isOrgModalOpen, onOpen, onClose } = useDisclosure();
  const iconHoverColor = useColorModeValue("white", "lightgreen");

  const {
    data: myOrgs = [],
    refetch,
    isLoading
  } = getOrgsByCreator.useQuery(session?.user.userId);

  useEffect(() => {
    refetch();
  }, [router.asPath]);

  return (
    <Box {...props}>
      <Popover isLazy isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <PopoverTrigger>
          <IconButton
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Social"
            mr={2}
            bg="transparent"
            _hover={{ bg: "transparent" }}
            icon={
              <Icon
                as={IoIosPeople}
                boxSize={14}
                _hover={{ color: iconHoverColor }}
              />
            }
            data-cy="orgPopover"
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <Heading size="md">Mes organisations</Heading>
          </PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <Box>
              {isLoading ? (
                <Spinner />
              ) : (
                <List>
                  {myOrgs.map(({ orgName }, index) => (
                    <ListItem
                      display="flex"
                      alignItems="center"
                      mb={1}
                      key={index}
                    >
                      <ListIcon
                        boxSize={6}
                        as={IoIosPeople}
                        color="green.500"
                      />{" "}
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
    </Box>
  );
};
