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
  useDisclosure
} from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { IoIosGitNetwork, IoIosPeople } from "react-icons/io";
import { useSelector } from "react-redux";
import { EntityButton, Link } from "features/common";
import { OrgFormModal } from "features/modals/OrgFormModal";
import { useGetOrgsQuery } from "features/orgs/orgsApi";
import { useGetSubscriptionQuery } from "features/subscriptions/subscriptionsApi";
import { selectUserEmail } from "features/users/userSlice";
import { EOrgType } from "models/Org";
import {
  getFollowerSubscription,
  getSubscriberSubscription,
  ISubscription
} from "models/Subscription";
import { hasItems } from "utils/array";
import { AppQuery } from "utils/types";

const OrgPopoverContent = ({
  orgType,
  session,
  onClose
}: {
  orgType?: EOrgType;
  session: Session;
  onClose: () => void;
}) => {
  const router = useRouter();
  const userEmail = useSelector(selectUserEmail) || session.user.email;

  //#region orgs
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

  //#region my sub
  const subQuery = useGetSubscriptionQuery({
    email: userEmail,
    populate: "orgs"
  }) as AppQuery<ISubscription>;
  //#endregion

  //#region local state
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose
  } = useDisclosure();
  const [showOrgs, setShowOrgs] = useState<
    "showOrgsAdded" | "showOrgsFollowed" | "showOrgsSubscribed"
  >("showOrgsAdded");
  //#endregion

  useEffect(() => {
    orgsQuery.refetch();
    myOrgsQuery.refetch();
    subQuery.refetch();
  }, []);

  return (
    <>
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
            Les {orgType === EOrgType.NETWORK ? "réseaux" : "organisations"} que
            j'ai ajouté
          </option>
          <option value="showOrgsFollowed">
            Les {orgType === EOrgType.NETWORK ? "réseaux" : "organisations"} où
            je suis abonné
          </option>
          <option value="showOrgsSubscribed">
            Les {orgType === EOrgType.NETWORK ? "réseaux" : "organisations"} où
            je suis adhérent
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
          onClick={onModalOpen}
          data-cy="org-add-button"
        >
          Ajouter{" "}
          {orgType === EOrgType.NETWORK ? "un réseau" : "une organisation"}
        </Button>
      </PopoverFooter>

      {isModalOpen && (
        <OrgFormModal
          session={session}
          orgType={orgType}
          onCancel={onModalClose}
          onClose={onModalClose}
          onSubmit={async (orgUrl) => {
            onModalClose();
            await router.push(`/${orgUrl}`, `/${orgUrl}`, {
              shallow: true
            });
          }}
        />
      )}
    </>
  );
};

export const OrgPopover = ({
  boxSize,
  orgType,
  session,
  ...props
}: BoxProps & {
  orgType?: EOrgType;
  session: Session;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box {...props}>
      <Popover isLazy isOpen={isOpen} offset={[-140, 0]} onClose={onClose}>
        <PopoverTrigger>
          <IconButton
            aria-label="Organisations"
            bg="transparent"
            _hover={{ bg: "transparent" }}
            icon={
              <Icon
                as={
                  orgType === EOrgType.NETWORK ? IoIosGitNetwork : IoIosPeople
                }
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
