import React, { useEffect, useState } from "react";
import { IoIosPeople, IoIosPerson } from "react-icons/io";
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
  IconButton,
  Spinner,
  Button,
  Box,
  Heading,
  BoxProps,
  Text
} from "@chakra-ui/react";
import { OrgForm } from "features/forms/OrgForm";
import { getOrgsByCreator, useGetOrgsQuery } from "features/orgs/orgsApi";
import { Link } from "features/common";
import { useSession } from "hooks/useAuth";
import { AddIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useGetSubscriptionQuery } from "features/subscriptions/subscriptionsApi";
import { useSelector } from "react-redux";
import {
  isSubscribedBy,
  selectSubscriptionRefetch
} from "features/subscriptions/subscriptionSlice";

export const OrgPopover = ({ boxSize, ...props }: BoxProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const query = useGetOrgsQuery();
  const myOrgs =
    (Array.isArray(query.data) &&
      query.data.length > 0 &&
      query.data.filter((org) => session?.user.userId === org?.createdBy)) ||
    [];
  const hasOrgs = Array.isArray(myOrgs) && myOrgs.length > 0;

  const subQuery = useGetSubscriptionQuery(session?.user.userId);
  const subscribedOrgs =
    (Array.isArray(query.data) &&
      query.data.length > 0 &&
      query.data.filter((org) => isSubscribedBy(org, subQuery))) ||
    [];
  const hasSubscribedOrgs =
    Array.isArray(subscribedOrgs) && subscribedOrgs.length > 0;
  const subscriptionRefetch = useSelector(selectSubscriptionRefetch);
  useEffect(() => {
    console.log("refetching subscription");
    subQuery.refetch();
  }, [subscriptionRefetch]);

  const [isOpen, setIsOpen] = useState(false);
  const { isOpen: isOrgModalOpen, onOpen, onClose } = useDisclosure();
  const iconHoverColor = useColorModeValue("white", "lightgreen");

  return (
    <Box {...props}>
      <Popover isLazy isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <PopoverTrigger>
          <IconButton
            onClick={() => {
              if (!isOpen) {
                query.refetch();
                subQuery.refetch();
              }
              setIsOpen(!isOpen);
            }}
            aria-label="Social"
            mr={2}
            bg="transparent"
            _hover={{ bg: "transparent" }}
            icon={
              <Icon
                as={IoIosPeople}
                boxSize={boxSize}
                _hover={{ color: iconHoverColor }}
              />
            }
            data-cy="orgPopover"
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <Heading size="md">Les organisations...</Heading>
          </PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <>
              <Heading size="sm" mb={1}>
                ...où je suis administrateur :
              </Heading>
              {query.isLoading ? (
                <Spinner />
              ) : hasOrgs ? (
                <List ml={3}>
                  {myOrgs.map((org, index) => (
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
                        href={`/${encodeURIComponent(org.orgName)}`}
                      >
                        {org.orgName}
                      </Link>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Text fontSize="smaller" ml={3} my={2}>
                  Vous n'avez ajouté aucune organisation.
                </Text>
              )}

              <Heading size="sm" mt={hasOrgs ? 2 : 0} mb={1}>
                ...où je suis adhérent(e) :
              </Heading>
              {hasSubscribedOrgs ? (
                <List ml={3} my={3}>
                  {subscribedOrgs.map((org, index) => (
                    <ListItem
                      display="flex"
                      alignItems="center"
                      mb={1}
                      key={index}
                    >
                      <ListIcon
                        boxSize={6}
                        as={IoIosPerson}
                        color="green.500"
                      />{" "}
                      <Link
                        onClick={() => {
                          setIsOpen(false);
                        }}
                        href={`/${encodeURIComponent(org.orgName)}`}
                      >
                        {org.orgName}
                      </Link>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Text fontSize="smaller" ml={3} my={2}>
                  Personne ne vous a inscrit(e) en tant qu'adhérent, bientôt
                  peut-être ?
                </Text>
              )}
            </>
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
