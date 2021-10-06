import { AddIcon } from "@chakra-ui/icons";
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
  IconButton,
  Spinner,
  Button,
  Box,
  Heading,
  BoxProps,
  Text
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { IoIosPeople, IoIosPerson } from "react-icons/io";
import { useSelector } from "react-redux";
import { Link } from "features/common";
import { OrgModal } from "features/modals/OrgModal";
import { useGetOrgsQuery } from "features/orgs/orgsApi";
import { selectOrgsRefetch } from "features/orgs/orgSlice";
import { useGetSubscriptionQuery } from "features/subscriptions/subscriptionsApi";
import {
  isSubscribedBy,
  selectSubscriptionRefetch
} from "features/subscriptions/subscriptionSlice";
import { selectUserEmail } from "features/users/userSlice";
import { useSession } from "hooks/useAuth";
import { IOrg } from "models/Org";

export const OrgPopover = ({
  boxSize,
  setIsLoginModalOpen,
  ...props
}: BoxProps & {
  setIsLoginModalOpen: (isLogin: boolean) => void;
}) => {
  const router = useRouter();
  const { data: session, loading: isSessionLoading } = useSession();
  const userEmail = useSelector(selectUserEmail) || session?.user.email;

  //#region myOrgs
  const orgsQuery = useGetOrgsQuery({});
  const myOrgs =
    (Array.isArray(orgsQuery.data) &&
      orgsQuery.data.length > 0 &&
      orgsQuery.data.filter(
        (org) => session?.user.userId === org?.createdBy
      )) ||
    [];
  const refetchOrgs = useSelector(selectOrgsRefetch);
  useEffect(() => {
    orgsQuery.refetch();
  }, [refetchOrgs]);
  const hasOrgs = Array.isArray(myOrgs) && myOrgs.length > 0;
  //#endregion

  //#region sub
  const subQuery = useGetSubscriptionQuery(userEmail);
  const subscriptionRefetch = useSelector(selectSubscriptionRefetch);
  useEffect(() => {
    console.log("refetching subscription");
    subQuery.refetch();
  }, [subscriptionRefetch, userEmail]);

  const subscribedOrgs =
    (Array.isArray(orgsQuery.data) &&
      orgsQuery.data.length > 0 &&
      orgsQuery.data.filter((org) => isSubscribedBy(org, subQuery))) ||
    [];
  const hasSubscribedOrgs =
    Array.isArray(subscribedOrgs) && subscribedOrgs.length > 0;
  //#endregion

  //#region local state
  const [isOpen, setIsOpen] = useState(false);
  const [orgModalState, setOrgModalState] = useState<{
    isOpen: boolean;
    org?: IOrg;
  }>({ isOpen: false, org: undefined });
  const iconHoverColor = useColorModeValue("white", "lightgreen");
  //#endregion

  return (
    <Box {...props}>
      <Popover isLazy isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <PopoverTrigger>
          <IconButton
            onClick={() => {
              if (!isOpen) {
                orgsQuery.refetch();
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
            <Box>
              <Heading size="sm" mb={1}>
                ...où je suis administrateur :
              </Heading>
              {orgsQuery.isLoading || orgsQuery.isFetching ? (
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
                        href={`/${org.orgUrl}`}
                        shallow
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
                ...où je suis adhérent :
              </Heading>
              {orgsQuery.isLoading || orgsQuery.isFetching ? (
                <Spinner />
              ) : hasSubscribedOrgs ? (
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
                        href={`/${org.orgUrl}`}
                      >
                        {org.orgName}
                      </Link>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Text fontSize="smaller" ml={3} my={2}>
                  Personne ne vous a inscrit en tant qu'adhérent, bientôt
                  peut-être ?
                </Text>
              )}
            </Box>

            <Button
              onClick={() => {
                if (!isSessionLoading) {
                  if (session) {
                    setOrgModalState({ isOpen: true });
                  } else {
                    setIsLoginModalOpen(true);
                  }
                }
              }}
              leftIcon={<AddIcon />}
              data-cy="addOrg"
              mt={1}
            >
              Ajouter une organisation
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>

      {session && orgModalState.isOpen && (
        <OrgModal
          session={session}
          onCancel={() => setOrgModalState({ isOpen: false })}
          onClose={() => setOrgModalState({ isOpen: false })}
          onSubmit={async (orgUrl: string) => {
            await router.push(`/${orgUrl}`);
          }}
        />
      )}
    </Box>
  );
};
