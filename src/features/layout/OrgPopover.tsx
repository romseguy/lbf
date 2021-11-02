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
  Select,
  Spinner,
  Button,
  Box,
  Heading,
  BoxProps,
  Text,
  PopoverFooter,
  VStack
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { IoIosGitNetwork, IoIosPeople, IoIosPerson } from "react-icons/io";
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
import { IOrg, OrgType, OrgTypes } from "models/Org";
import { hasItems } from "utils/array";
import { Session } from "next-auth";

let cachedRefetchOrgs = false;
let cachedRefetchSubscription = false;
let cachedEmail: string | undefined;

export const OrgPopover = ({
  boxSize,
  orgType,
  session,
  ...props
}: BoxProps & {
  orgType?: OrgType;
  session: Session;
}) => {
  const router = useRouter();
  const userEmail = useSelector(selectUserEmail) || session.user.email;

  //#region myOrgs
  const orgsQuery = useGetOrgsQuery(undefined, {
    selectFromResult: (query) => ({
      ...query,
      data: query.data?.filter((org) =>
        orgType
          ? org.orgType === orgType
          : org.orgType === OrgTypes.ASSO || org.orgType === OrgTypes.GROUP
      )
    })
  });
  const refetchOrgs = useSelector(selectOrgsRefetch);
  useEffect(() => {
    if (refetchOrgs !== cachedRefetchOrgs) {
      cachedRefetchOrgs = refetchOrgs;
      console.log("refetching orgs");
      orgsQuery.refetch();
    }
  }, [refetchOrgs]);
  const myOrgs =
    (Array.isArray(orgsQuery.data) &&
      orgsQuery.data.length > 0 &&
      orgsQuery.data.filter((org) => session.user.userId === org?.createdBy)) ||
    [];
  const hasOrgs = Array.isArray(myOrgs) && myOrgs.length > 0;
  //#endregion

  //#region sub
  const subQuery = useGetSubscriptionQuery(userEmail);
  const refetchSubscription = useSelector(selectSubscriptionRefetch);
  useEffect(() => {
    if (refetchSubscription !== cachedRefetchSubscription) {
      console.log("refetching subscription");
      subQuery.refetch();
    }
  }, [refetchSubscription]);
  useEffect(() => {
    if (userEmail !== cachedEmail) {
      cachedEmail = userEmail;
      console.log("refetching subscription with new email", userEmail);
      subQuery.refetch();
    }
  }, [userEmail]);

  const subscribedOrgs =
    (Array.isArray(orgsQuery.data) &&
      orgsQuery.data.length > 0 &&
      orgsQuery.data.filter((org) => isSubscribedBy(org, subQuery))) ||
    [];
  const hasSubscribedOrgs = hasItems(subscribedOrgs);
  //#endregion

  //#region local state
  const [isOpen, setIsOpen] = useState(false);
  const [showOrgs, setShowOrgs] = useState<
    "showOrgsAdded" | "showOrgsSubscribed"
  >("showOrgsAdded");
  const [orgModalState, setOrgModalState] = useState<{
    isOpen: boolean;
    org?: IOrg;
  }>({ isOpen: false, org: undefined });
  const iconHoverColor = useColorModeValue("white", "lightgreen");
  //#endregion

  return (
    <Box {...props}>
      <Popover
        isLazy
        isOpen={isOpen}
        offset={[-140, 0]}
        onClose={() => setIsOpen(false)}
      >
        <PopoverTrigger>
          <IconButton
            aria-label="Social"
            bg="transparent"
            _hover={{ bg: "transparent" }}
            icon={
              <Icon
                as={
                  orgType === OrgTypes.NETWORK ? IoIosGitNetwork : IoIosPeople
                }
                boxSize={boxSize}
                _hover={{ color: iconHoverColor }}
              />
            }
            minWidth={0}
            onClick={() => {
              if (!isOpen) {
                orgsQuery.refetch();
                subQuery.refetch();
              }
              setIsOpen(!isOpen);
            }}
            data-cy="orgPopover"
          />
        </PopoverTrigger>
        <PopoverContent>
          {/* <PopoverHeader>
            <Heading size="md">
              Les {orgType === OrgTypes.NETWORK ? "réseaux" : "organisations"}
              ...
            </Heading>
          </PopoverHeader>
          <PopoverCloseButton /> */}
          <PopoverBody>
            <Select
              fontSize="sm"
              height="auto"
              lineHeight={2}
              mb={2}
              defaultValue={showOrgs}
              onChange={(e) =>
                setShowOrgs(
                  e.target.value as "showOrgsAdded" | "showOrgsSubscribed"
                )
              }
            >
              <option value="showOrgsAdded">
                Les {orgType === OrgTypes.NETWORK ? "réseaux" : "organisations"}{" "}
                que j'ai ajouté
              </option>
              <option value="showOrgsSubscribed">
                Les {orgType === OrgTypes.NETWORK ? "réseaux" : "organisations"}{" "}
                où je suis abonné
              </option>
            </Select>

            {showOrgs === "showOrgsAdded" &&
              (hasOrgs ? (
                <VStack
                  alignItems="flex-start"
                  overflow="auto"
                  height="170px"
                  spacing={2}
                >
                  {myOrgs.map((org, index) => (
                    <Button
                      key={index}
                      fontSize="sm"
                      leftIcon={<Icon as={IoIosPeople} color="green.500" />}
                      height="auto"
                      p={1}
                      onClick={() => {
                        router.push(`/${org.orgUrl}`, `/${org.orgUrl}`, {
                          shallow: true
                        });
                        setIsOpen(false);
                      }}
                    >
                      {org.orgName}
                    </Button>
                  ))}
                </VStack>
              ) : (
                <Text fontSize="smaller" ml={3} my={2}>
                  Vous n'avez ajouté aucune organisation.
                </Text>
              ))}

            {showOrgs === "showOrgsSubscribed" &&
              (hasSubscribedOrgs ? (
                <VStack
                  alignItems="flex-start"
                  overflowX="auto"
                  height="170px"
                  spacing={2}
                >
                  {subscribedOrgs.map((org, index) => (
                    <Button
                      key={index}
                      fontSize="sm"
                      leftIcon={<Icon as={IoIosPeople} color="green.500" />}
                      height="auto"
                      p={1}
                      onClick={() => {
                        router.push(`/${org.orgUrl}`, `/${org.orgUrl}`, {
                          shallow: true
                        });
                        setIsOpen(false);
                      }}
                    >
                      {org.orgName}
                    </Button>
                  ))}
                </VStack>
              ) : (
                <Text fontSize="smaller" ml={3}>
                  Personne ne vous a inscrit en tant qu'adhérent, bientôt
                  peut-être ?
                </Text>
              ))}
          </PopoverBody>
          <PopoverFooter>
            <Button
              colorScheme="teal"
              leftIcon={<AddIcon />}
              mt={1}
              size="sm"
              onClick={() => {
                setOrgModalState({ isOpen: true });
              }}
              data-cy="addOrg"
            >
              Ajouter{" "}
              {orgType === OrgTypes.NETWORK ? "un réseau" : "une organisation"}
            </Button>
          </PopoverFooter>
        </PopoverContent>
      </Popover>

      {orgModalState.isOpen && (
        <OrgModal
          session={session}
          orgType={orgType}
          onCancel={() => setOrgModalState({ isOpen: false })}
          onClose={() => setOrgModalState({ isOpen: false })}
          onSubmit={async (orgUrl) => {
            await router.push(`/${orgUrl}`, `/${orgUrl}`, {
              shallow: true
            });
          }}
        />
      )}
    </Box>
  );
};
