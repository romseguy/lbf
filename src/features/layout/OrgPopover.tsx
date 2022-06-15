import {
  Box,
  BoxProps,
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
  useDisclosure
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaGlobeEurope, FaTree } from "react-icons/fa";
import { useSelector } from "react-redux";
import { EntityAddButton, EntityButton } from "features/common";
import { useGetOrgsQuery } from "features/orgs/orgsApi";
import { useGetSubscriptionQuery } from "features/subscriptions/subscriptionsApi";
import { selectSubscriptionRefetch } from "features/subscriptions/subscriptionSlice";
import { selectUserEmail } from "features/users/userSlice";
import { EOrgType } from "models/Org";
import {
  getFollowerSubscription,
  getSubscriberSubscription,
  ISubscription
} from "models/Subscription";
import { hasItems } from "utils/array";
import { Session } from "utils/auth";
import { AppQuery } from "utils/types";

let cachedRefetchSubscription = false;

const OrgPopoverContent = ({
  orgType,
  session,
  onClose
}: {
  orgType: EOrgType;
  session: Session;
  onClose: () => void;
}) => {
  const router = useRouter();
  const userEmail = useSelector(selectUserEmail) || session.user.email;

  //#region my sub
  const subQuery = useGetSubscriptionQuery({
    email: userEmail,
    populate: "orgs"
  }) as AppQuery<ISubscription>;
  //#endregion

  //#region orgs
  const myOrgsQuery = useGetOrgsQuery(
    { createdBy: session.user.userId },
    {
      selectFromResult: (query) => ({
        ...query,
        data:
          [...(query.data || [])]
            .sort((a, b) => {
              if (a.createdAt && b.createdAt) {
                if (a.createdAt < b.createdAt) return 1;
                else if (a.createdAt > b.createdAt) return -1;
              }
              return 0;
            })
            .filter(
              (org) => org.orgUrl !== "forum" && org.orgType === orgType
            ) || []
      })
    }
  );
  const orgsQuery = useGetOrgsQuery();
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
  const [showOrgs, setShowOrgs] = useState<
    "showOrgsAdded" | "showOrgsFollowed" | "showOrgsSubscribed"
  >("showOrgsAdded");
  //#endregion

  const refetchSubscription = useSelector(selectSubscriptionRefetch);
  useEffect(() => {
    if (refetchSubscription !== cachedRefetchSubscription) {
      cachedRefetchSubscription = refetchSubscription;
      subQuery.refetch();
    }
  }, [refetchSubscription]);

  return (
    <>
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
            Les {orgType === EOrgType.NETWORK ? "planètes" : "arbres"} que j'ai{" "}
            {orgType === EOrgType.NETWORK ? "créé" : "planté"}
          </option>
          <option value="showOrgsFollowed">
            Les {orgType === EOrgType.NETWORK ? "planètes" : "arbres"} où je me
            suis abonné
          </option>
          <option value="showOrgsSubscribed">
            Les {orgType === EOrgType.NETWORK ? "planètes" : "arbres"} où j'ai
            adhéré
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
                      onClose();
                      router.push(`/${org.orgUrl}`, `/${org.orgUrl}`, {
                        shallow: true
                      });
                    }}
                  />
                ))}
              </VStack>
            ) : (
              <Text fontSize="smaller">
                Vous n'avez{" "}
                {orgType === EOrgType.NETWORK
                  ? "créé aucune planètes"
                  : "planté aucun arbres"}
                .
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
                Vous n'êtes abonné{" "}
                {orgType === EOrgType.NETWORK
                  ? "aucune planètes"
                  : "aucun arbres"}
                .
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
        {orgType === EOrgType.NETWORK ? (
          <EntityAddButton orgType={EOrgType.NETWORK} mt={1} />
        ) : (
          <EntityAddButton mt={1} />
        )}
      </PopoverFooter>
    </>
  );
};

export const OrgPopover = ({
  boxSize,
  orgType = EOrgType.GENERIC,
  session,
  ...props
}: BoxProps & {
  orgType?: EOrgType;
  session: Session;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box {...props}>
      <Popover isLazy isOpen={isOpen} offset={[10, 25]} onClose={onClose}>
        <PopoverTrigger>
          <IconButton
            aria-label="Mes arbres"
            bg="transparent"
            color={isOpen ? "green" : undefined}
            _hover={{ bg: "transparent" }}
            icon={
              <Icon
                as={orgType === EOrgType.NETWORK ? FaGlobeEurope : FaTree}
                boxSize={boxSize}
                _hover={{ color: "green" }}
              />
            }
            minWidth={0}
            onClick={onOpen}
            data-cy="org-popover-button"
          />
        </PopoverTrigger>
        <PopoverContent>
          <OrgPopoverContent
            orgType={orgType}
            session={session}
            onClose={onClose}
          />
        </PopoverContent>
      </Popover>
    </Box>
  );
};
