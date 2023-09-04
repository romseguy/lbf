import {
  Popover,
  PopoverProps,
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
import { useGetOrgsQuery } from "features/api/orgsApi";
import { useGetSubscriptionQuery } from "features/api/subscriptionsApi";
import { selectSubscriptionRefetch } from "store/subscriptionSlice";
import { selectUserEmail } from "store/userSlice";
import { EOrgType } from "models/Org";
import { getFollowerSubscription, ISubscription } from "models/Subscription";
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
            .filter((org) => {
              if (org.orgUrl === "forum") return false;
              if (
                orgType === EOrgType.GENERIC &&
                org.orgType !== EOrgType.NETWORK
              )
                return true;
              return org.orgType === orgType;
            }) || []
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
            {orgType === EOrgType.NETWORK ? "ajouté" : "ajouté"}
          </option>
          <option value="showOrgsFollowed">
            Les {orgType === EOrgType.NETWORK ? "planètes" : "arbres"} où je me
            suis abonné
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
                  ? "ajouté aucune planètes"
                  : "ajouté aucun arbres"}
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
  label = "Mes arbres",
  isMobile,
  orgType = EOrgType.GENERIC,
  session,
  ...props
}: PopoverProps & {
  label?: string;
  isMobile: boolean;
  orgType?: EOrgType;
  session: Session;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Popover isLazy isOpen={isOpen} onClose={onClose} {...props}>
      <PopoverTrigger>
        <IconButton
          aria-label={label}
          bg="transparent"
          color={isOpen ? "cyan.600" : undefined}
          _hover={{ bg: "transparent" }}
          icon={
            <Icon
              as={orgType === EOrgType.NETWORK ? FaGlobeEurope : FaTree}
              boxSize={6}
              mx={3}
              _hover={{ color: "cyan.600" }}
            />
          }
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
  );
};
