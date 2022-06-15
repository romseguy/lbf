import { Box, Button, Heading, Grid, GridProps, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaFolder, FaFolderOpen } from "react-icons/fa";
import { css } from "twin.macro";
import {
  GridHeader,
  GridItem,
  Heading as AppHeading,
  Link
} from "features/common";
import { refetchEvent } from "store/eventSlice";
import {
  useAddSubscriptionMutation,
  useDeleteSubscriptionMutation
} from "features/api/subscriptionsApi";
import { SubscriptionsList } from "features/subscriptions/SubscriptionsList";
import { IOrg, orgTypeFull } from "models/Org";
import { ISubscription, ESubscriptionType } from "models/Subscription";
import { IUser } from "models/User";
import { useAppDispatch } from "store";
import { breakpoints } from "theme/theme";
import { hasItems } from "utils/array";
import { AppQuery, AppQueryWithData } from "utils/types";
import { OrgConfigVisibility } from "./OrgConfigPanel";
import { SubscriptionForm } from "features/forms/SubscriptionForm";

export const OrgConfigSubscribersPanel = ({
  orgQuery,
  subQuery,
  isVisible,
  toggleVisibility,
  ...props
}: GridProps &
  OrgConfigVisibility & {
    orgQuery: AppQueryWithData<IOrg>;
    subQuery: AppQuery<ISubscription>;
  }) => {
  const org = orgQuery.data;
  const dispatch = useAppDispatch();

  //#region subscription
  const [addSubscription] = useAddSubscriptionMutation();
  const [deleteSubscription] = useDeleteSubscriptionMutation();
  //#endregion

  //#region local state
  const [isAdd, setIsAdd] = useState(false);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState<{
    [key: string]: boolean;
  }>(
    org.orgSubscriptions.reduce((obj, subscription) => {
      return { ...obj, [subscription._id]: false };
    }, {})
  );
  useEffect(
    function onSubscriptionsChange() {
      if (!hasItems(org.orgSubscriptions))
        toggleVisibility("subscribers", false);
    },
    [org.orgSubscriptions]
  );
  //#endregion

  const onTagClick = async ({
    type,
    followerSubscription,
    subscriberSubscription,
    email,
    phone,
    user,
    subscription
  }: {
    type: string;
    followerSubscription?: any;
    subscriberSubscription?: any;
    email?: string;
    phone?: string;
    user?: IUser | string;
    subscription: ISubscription;
  }) => {
    if (isSubscriptionLoading[subscription._id]) return;

    setIsSubscriptionLoading({
      ...isSubscriptionLoading,
      [subscription._id]: true
    });

    const userEmail = typeof user === "object" ? user.email : email;

    if (type === ESubscriptionType.FOLLOWER) {
      if (followerSubscription) {
        const unsubscribe = confirm(
          `Êtes vous sûr de vouloir retirer ${userEmail} de la liste des abonnés ${orgTypeFull(
            org.orgType
          )} ${org.orgName} ?`
        );
        if (unsubscribe) {
          await deleteSubscription({
            subscriptionId: subscription._id,
            payload: {
              orgs: [followerSubscription]
            }
          });
          orgQuery.refetch();
        }
      } else {
        await addSubscription({
          email,
          phone,
          user,
          orgs: [
            {
              orgId: org._id,
              org,
              type: ESubscriptionType.FOLLOWER
            }
          ]
        });
        orgQuery.refetch();
      }
    } else if (type === ESubscriptionType.SUBSCRIBER) {
      if (subscriberSubscription) {
        const unsubscribe = confirm(
          `Êtes vous sûr de vouloir retirer ${userEmail} de la liste des adhérents ${orgTypeFull(
            org.orgType
          )} ${org.orgName} ?`
        );
        if (unsubscribe) {
          await deleteSubscription({
            subscriptionId: subscription._id,
            payload: {
              orgs: [subscriberSubscription]
            }
          });
          orgQuery.refetch();
          subQuery.refetch();
        }
      } else {
        await addSubscription({
          email,
          phone,
          user,
          orgs: [
            {
              orgId: org._id,
              org,
              type: ESubscriptionType.SUBSCRIBER
            }
          ]
        });
        orgQuery.refetch();
      }
    }

    setIsSubscriptionLoading({
      ...isSubscriptionLoading,
      [subscription._id]: false
    });
  };

  return (
    <Grid {...props}>
      <Link
        variant="no-underline"
        onClick={() => {
          toggleVisibility("subscribers");
          if (!hasItems(org.orgSubscriptions)) setIsAdd(!isAdd);
        }}
      >
        <GridHeader
          borderTopRadius="lg"
          borderBottomRadius={
            !isVisible.subscribers && !isAdd ? "lg" : undefined
          }
          light={{
            _hover: {
              bg: "orange.200"
            }
          }}
        >
          <Grid templateColumns="1fr auto" alignItems="center">
            <GridItem
              css={css`
                @media (max-width: ${breakpoints.nav}) {
                  & {
                    padding-top: 12px;
                    padding-bottom: 12px;
                  }
                }
              `}
            >
              <Flex alignItems="center">
                {isVisible.subscribers || isAdd ? (
                  <FaFolderOpen size={24} color="white" />
                ) : (
                  <FaFolder />
                )}
                <Heading size="sm" ml={2}>
                  {org.orgSubscriptions.length} membre
                  {org.orgSubscriptions.length !== 1 ? "s" : ""}
                </Heading>
              </Flex>
            </GridItem>

            <GridItem
              css={css`
                @media (max-width: ${breakpoints.nav}) {
                  & {
                    grid-column: 1;
                    padding-bottom: 12px;
                  }
                }
              `}
            >
              <Button
                colorScheme={isAdd ? "red" : "teal"}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAdd(!isAdd);
                  toggleVisibility("subscribers", false);
                }}
                m={1}
                data-cy="orgAddSubscribers"
              >
                {isAdd ? "Annuler" : "Ajouter"}
              </Button>
            </GridItem>
          </Grid>
        </GridHeader>
      </Link>

      {isAdd && (
        <GridItem light={{ bg: "orange.50" }} dark={{ bg: "gray.500" }}>
          <AppHeading>Ajouter des membres</AppHeading>

          <Box p={5}>
            <SubscriptionForm
              org={org}
              isSubscriptionLoading={isSubscriptionLoading}
              onCancel={() => {
                setIsAdd(false);
              }}
              onSubmit={() => {
                orgQuery.refetch();
                subQuery.refetch();
                setIsAdd(false);
                toggleVisibility("subscribers", true);
                dispatch(refetchEvent());
              }}
            />
          </Box>
        </GridItem>
      )}

      {isVisible.subscribers && (
        <GridItem
          light={{ bg: "orange.100" }}
          dark={{ bg: "gray.500" }}
          overflowX="auto"
          aria-hidden
        >
          <SubscriptionsList
            org={org}
            orgQuery={orgQuery}
            subQuery={subQuery}
            isSubscriptionLoading={isSubscriptionLoading}
            setIsSubscriptionLoading={setIsSubscriptionLoading}
            onTagClick={onTagClick}
          />
        </GridItem>
      )}
    </Grid>
  );
};
