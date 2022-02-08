import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  BoxProps,
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Icon,
  IconButton,
  Select,
  Spinner,
  Text,
  VStack,
  useColorMode
} from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { IoIosGitNetwork, IoIosPeople } from "react-icons/io";
import { useSelector } from "react-redux";
import { EntityButton, Link } from "features/common";
import { OrgFormModal } from "features/modals/OrgFormModal";
import { useGetOrgsQuery } from "features/orgs/orgsApi";
import { selectOrgsRefetch } from "features/orgs/orgSlice";
import { useGetSubscriptionQuery } from "features/subscriptions/subscriptionsApi";
import { selectSubscriptionRefetch } from "features/subscriptions/subscriptionSlice";
import { selectUserEmail } from "features/users/userSlice";
import { OrgType, OrgTypes } from "models/Org";
import {
  getFollowerSubscription,
  getSubscriberSubscription,
  ISubscription
} from "models/Subscription";
import { hasItems } from "utils/array";
import { AppQuery } from "utils/types";

let cachedRefetchOrgs = false;
let cachedRefetchSubscription = false;

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
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const storedUserEmail = useSelector(selectUserEmail);
  const [email, setEmail] = useState(storedUserEmail || session.user.email);

  //#region orgs
  const orgsQuery = useGetOrgsQuery();
  const myOrgsQuery = useGetOrgsQuery(
    { createdBy: session.user.userId },
    {
      selectFromResult: (query) => ({
        ...query,
        data:
          [...(query.data || [])].sort((a, b) => {
            if (a.createdAt && b.createdAt) {
              if (a.createdAt < b.createdAt) return 1;
              else if (a.createdAt > b.createdAt) return -1;
            }
            return 0;
          }) || []
      })
    }
  );
  //#endregion

  //#region my sub
  const subQuery = useGetSubscriptionQuery({
    email,
    populate: "orgs"
  }) as AppQuery<ISubscription>;
  const followedOrgs =
    (Array.isArray(orgsQuery.data) &&
      orgsQuery.data.length > 0 &&
      orgsQuery.data.filter(
        (org) => !!getFollowerSubscription({ org, subQuery })
      )) ||
    [];
  const subscribedOrgs =
    (Array.isArray(orgsQuery.data) &&
      orgsQuery.data.length > 0 &&
      orgsQuery.data.filter(
        (org) => !!getSubscriberSubscription({ org, subQuery })
      )) ||
    [];
  //#endregion

  //#region local state
  const [isOpen, setIsOpen] = useState(false);
  const [isOrgFormModalOpen, setIsOrgFormModalOpen] = useState(false);

  const [showOrgs, setShowOrgs] = useState<
    "showOrgsAdded" | "showOrgsFollowed" | "showOrgsSubscribed"
  >("showOrgsAdded");
  //#endregion

  const refetchOrgs = useSelector(selectOrgsRefetch);
  useEffect(() => {
    if (refetchOrgs !== cachedRefetchOrgs) {
      cachedRefetchOrgs = refetchOrgs;
      console.log("refetching orgs");
      orgsQuery.refetch();
      myOrgsQuery.refetch();
    }
  }, [refetchOrgs]);

  const refetchSubscription = useSelector(selectSubscriptionRefetch);
  useEffect(() => {
    if (refetchSubscription !== cachedRefetchSubscription) {
      console.log("refetching subscription");
      subQuery.refetch();
    }
  }, [refetchSubscription]);

  useEffect(() => {
    const newEmail = storedUserEmail || session.user.email;

    if (newEmail !== email) {
      setEmail(newEmail);
      console.log("refetching subscription because of new email", newEmail);
      subQuery.refetch();
    }
  }, [storedUserEmail, session]);

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
            aria-label="Organisations"
            bg="transparent"
            _hover={{ bg: "transparent" }}
            icon={
              <Icon
                as={
                  orgType === OrgTypes.NETWORK ? IoIosGitNetwork : IoIosPeople
                }
                boxSize={boxSize}
                _hover={{ color: "green" }}
              />
            }
            minWidth={0}
            onClick={() => {
              if (!isOpen) {
                orgsQuery.refetch();
                myOrgsQuery.refetch();
                subQuery.refetch();
              }
              setIsOpen(!isOpen);
            }}
            data-cy="org-popover-button"
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
                  e.target.value as
                    | "showOrgsAdded"
                    | "showOrgsFollowed"
                    | "showOrgsSubscribed"
                )
              }
            >
              <option value="showOrgsAdded">
                Les {orgType === OrgTypes.NETWORK ? "réseaux" : "organisations"}{" "}
                que j'ai ajouté
              </option>
              <option value="showOrgsFollowed">
                Les {orgType === OrgTypes.NETWORK ? "réseaux" : "organisations"}{" "}
                où je suis abonné
              </option>
              <option value="showOrgsSubscribed">
                Les {orgType === OrgTypes.NETWORK ? "réseaux" : "organisations"}{" "}
                où je suis adhérent
              </option>
            </Select>

            {showOrgs === "showOrgsAdded" && (
              <>
                {myOrgsQuery.isLoading || myOrgsQuery.isFetching ? (
                  <Spinner />
                ) : hasItems(myOrgsQuery.data) ? (
                  <VStack
                    aria-hidden
                    alignItems="flex-start"
                    overflow="auto"
                    height="200px"
                    spacing={2}
                    py={1}
                    pl={1}
                  >
                    {myOrgsQuery.data.map((org) => (
                      <EntityButton
                        key={org._id}
                        org={org}
                        p={1}
                        onClick={() => {
                          setIsOpen(false);
                          router.push(org.orgUrl);
                        }}
                      />
                    ))}
                  </VStack>
                ) : (
                  <Text fontSize="smaller">
                    Vous n'avez ajouté aucune organisations.
                  </Text>
                )}
              </>
            )}

            {showOrgs === "showOrgsFollowed" && (
              <>
                {hasItems(followedOrgs) ? (
                  <VStack
                    alignItems="flex-start"
                    overflowX="auto"
                    height="200px"
                    spacing={2}
                  >
                    {followedOrgs.map((org, index) => (
                      <EntityButton key={org._id} org={org} p={1} />
                    ))}
                  </VStack>
                ) : (
                  <Text fontSize="smaller">
                    Vous n'êtes abonné à aucune organisations.
                  </Text>
                )}
              </>
            )}

            {showOrgs === "showOrgsSubscribed" && (
              <>
                {hasItems(subscribedOrgs) ? (
                  <VStack
                    alignItems="flex-start"
                    overflowX="auto"
                    height="200px"
                    spacing={2}
                  >
                    {subscribedOrgs.map((org, index) => (
                      <EntityButton key={org._id} org={org} p={1} />
                    ))}
                  </VStack>
                ) : (
                  <Text fontSize="smaller">
                    Personne ne vous a inscrit en tant qu'adhérent, bientôt
                    peut-être ?
                  </Text>
                )}
              </>
            )}
          </PopoverBody>
          <PopoverFooter>
            <Button
              colorScheme="teal"
              leftIcon={<AddIcon />}
              mt={1}
              size="sm"
              onClick={() => setIsOrgFormModalOpen(true)}
              data-cy="org-add-button"
            >
              Ajouter{" "}
              {orgType === OrgTypes.NETWORK ? "un réseau" : "une organisation"}
            </Button>
          </PopoverFooter>
        </PopoverContent>
      </Popover>

      {isOrgFormModalOpen && (
        <OrgFormModal
          session={session}
          orgType={orgType}
          onCancel={() => setIsOrgFormModalOpen(false)}
          onClose={() => setIsOrgFormModalOpen(false)}
          onSubmit={async (orgUrl) => {
            setIsOrgFormModalOpen(false);
            await router.push(`/${orgUrl}`, `/${orgUrl}`, {
              shallow: true
            });
          }}
        />
      )}
    </Box>
  );
};
