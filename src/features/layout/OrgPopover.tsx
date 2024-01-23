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
import { selectUserEmail } from "store/userSlice";
import { EOrgType, IOrg } from "models/Org";
import { getFollowerSubscription, ISubscription } from "models/Subscription";
import { hasItems } from "utils/array";
import { Session } from "utils/auth";
import { AppQuery } from "utils/types";
import { EOrgsListOrder } from "features/orgs/OrgsList";

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
  const userEmail = useSelector(selectUserEmail);

  //#region my sub
  const subQuery = useGetSubscriptionQuery({
    email: userEmail,
    populate: "orgs"
  }) as AppQuery<ISubscription>;
  //#endregion

  //#region local state
  const [showOrgs, setShowOrgs] = useState<
    | "showOrgsAdded"
    | "showOrgsFollowed"
    | "showOrgsSubscribed"
    | "showOrgsArchived"
  >("showOrgsAdded");

  const defaultOrder = EOrgsListOrder.NEWEST;
  const [selectedOrder, setSelectedOrder] =
    useState<EOrgsListOrder>(defaultOrder);
  const bySelectedOrder = (orgA: IOrg, orgB: IOrg) => {
    if (selectedOrder === EOrgsListOrder.ALPHA)
      return orgA.orgName > orgB.orgName ? 1 : -1;

    if (selectedOrder === EOrgsListOrder.OLDEST)
      return orgA.createdAt! < orgB.createdAt! ? -1 : 1;

    return orgA.createdAt! > orgB.createdAt! ? -1 : 1;
  };
  //#endregion

  //#region my orgs
  const myOrgsQuery = useGetOrgsQuery(
    { createdBy: session.user.userId },
    {
      selectFromResult: ({ data = [], ...rest }) => ({
        ...rest,
        myOrgs: [...data]
          .sort(bySelectedOrder)
          .filter((org) => org.orgUrl !== "forum" && org.orgType === orgType)
      })
    }
  );
  const myOrgs = myOrgsQuery.myOrgs.filter(({ isArchived }) => !isArchived);
  const myArchivedOrgs = myOrgsQuery.myOrgs.filter(
    ({ isArchived }) => isArchived
  );
  //#endregion

  //#region orgs
  const orgsQuery = useGetOrgsQuery(
    { orgType },
    {
      selectFromResult: ({ data = [], ...rest }) => ({
        ...rest,
        followedOrgs: [...data]
          .sort(bySelectedOrder)
          .filter(
            (org) =>
              org.orgUrl !== "forum" &&
              !!getFollowerSubscription({ org, subQuery })
          )
      })
    }
  );
  //#endregion

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
          <option value="showOrgsArchived">
            Les {orgType === EOrgType.NETWORK ? "planètes" : "arbres"} que j'ai
            archivé
          </option>
        </Select>

        <Select
          fontSize="sm"
          height="auto"
          lineHeight={2}
          mb={2}
          defaultValue={defaultOrder}
          onChange={(e) => {
            //@ts-ignore
            setSelectedOrder(e.target.value);
          }}
        >
          <option value={EOrgsListOrder.ALPHA}>A-Z</option>
          {/*<option value={EOrgsListOrder.PINNED}>Épinglé</option>*/}
          <option value={EOrgsListOrder.NEWEST}>Plus récent</option>
          <option value={EOrgsListOrder.OLDEST}>Plus ancien</option>
        </Select>

        {showOrgs === "showOrgsAdded" && (
          <>
            {myOrgsQuery.isLoading || myOrgsQuery.isFetching ? (
              <Spinner />
            ) : Array.isArray(myOrgs) && myOrgs.length > 0 ? (
              <VStack
                aria-hidden
                alignItems="flex-start"
                overflow="auto"
                height="200px"
                spacing={2}
                py={1}
                pl={1}
              >
                {myOrgs.map((org) => (
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
            {hasItems(orgsQuery.followedOrgs) ? (
              <VStack
                alignItems="flex-start"
                overflowX="auto"
                height="200px"
                spacing={2}
              >
                {orgsQuery.followedOrgs.map((org, index) => (
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

        {showOrgs === "showOrgsArchived" && (
          <>
            {Array.isArray(myArchivedOrgs) && myArchivedOrgs.length > 0 ? (
              <VStack
                alignItems="flex-start"
                overflowX="auto"
                height="200px"
                spacing={2}
              >
                {myArchivedOrgs
                  .filter(({ isArchived }) => isArchived)
                  .map((org) => (
                    <EntityButton key={org._id} org={org} p={1} />
                  ))}
              </VStack>
            ) : (
              <Text fontSize="smaller">
                Vous n'avez archivé{" "}
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
        <EntityAddButton orgType={orgType} mt={1} />
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

{
  /*
    import { selectSubscriptionRefetch } from "store/subscriptionSlice";
    let cachedRefetchSubscription = false;

    const refetchSubscription = useSelector(selectSubscriptionRefetch);
    useEffect(() => {
      if (refetchSubscription !== cachedRefetchSubscription) {
        cachedRefetchSubscription = refetchSubscription;
      }
    }, [refetchSubscription]);
  */
}
