import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Button, Heading, Grid, GridProps, Text, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaFolder, FaFolderOpen } from "react-icons/fa";
import { css } from "twin.macro";
import { GridHeader, GridItem, Link, SubscriptionForm } from "features/common";
import { refetchEvent } from "features/events/eventSlice";
import {
  useAddSubscriptionMutation,
  useDeleteSubscriptionMutation
} from "features/subscriptions/subscriptionsApi";
import { SubscriptionsList } from "features/subscriptions/SubscriptionsList";
import { IOrg, orgTypeFull } from "models/Org";
import { ISubscription, SubscriptionTypes } from "models/Subscription";
import { IUser } from "models/User";
import { useAppDispatch } from "store";
import { breakpoints } from "theme/theme";
import { hasItems } from "utils/array";
import { AppQuery } from "utils/types";
import { Visibility } from "./OrgPage";

export const OrgConfigSubscribersPanel = ({
  orgQuery,
  subQuery,
  isVisible,
  setIsVisible,
  ...props
}: GridProps &
  Visibility & {
    orgQuery: AppQuery<IOrg>;
    subQuery: any;
  }) => {
  const org = orgQuery.data;
  const dispatch = useAppDispatch();

  //#region subscription
  const [addSubscription, addSubscriptionMutation] =
    useAddSubscriptionMutation();
  const [deleteSubscription, deleteSubscriptionMutation] =
    useDeleteSubscriptionMutation();
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
  useEffect(() => {
    if (!hasItems(org.orgSubscriptions))
      setIsVisible({ ...isVisible, subscribers: false });
  }, [org.orgSubscriptions]);
  //#endregion

  const onTagClick = async ({
    type,
    following,
    subscribing,
    email,
    phone,
    user,
    subscription
  }: {
    type: string;
    following?: any;
    subscribing?: any;
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

    if (type === SubscriptionTypes.FOLLOWER) {
      if (following) {
        const unsubscribe = confirm(
          `Êtes vous sûr de vouloir retirer ${userEmail} de la liste des abonnés ${orgTypeFull(
            org.orgType
          )} ${org.orgName} ?`
        );
        if (unsubscribe) {
          await deleteSubscription({
            subscriptionId: subscription._id,
            payload: {
              orgs: [following]
            }
          });
          orgQuery.refetch();
        }
      } else {
        await addSubscription({
          email,
          phone,
          user,
          payload: {
            orgs: [
              {
                orgId: org._id,
                org,
                type: SubscriptionTypes.FOLLOWER
              }
            ]
          }
        });
        orgQuery.refetch();
      }
    } else if (type === SubscriptionTypes.SUBSCRIBER) {
      if (subscribing) {
        const unsubscribe = confirm(
          `Êtes vous sûr de vouloir retirer ${userEmail} de la liste des adhérents ${orgTypeFull(
            org.orgType
          )} ${org.orgName} ?`
        );
        if (unsubscribe) {
          await deleteSubscription({
            subscriptionId: subscription._id,
            payload: {
              orgs: [subscribing]
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
          payload: {
            orgs: [
              {
                orgId: org._id,
                org,
                type: SubscriptionTypes.SUBSCRIBER
              }
            ]
          }
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
          if (!hasItems(org.orgSubscriptions)) setIsAdd(!isAdd);
          setIsVisible({
            banner: false,
            lists: false,
            logo: false,
            subscribers: hasItems(org.orgSubscriptions)
              ? !isVisible.subscribers
              : false
          });
        }}
      >
        <GridHeader
          borderTopRadius="lg"
          borderBottomRadius={!isVisible.subscribers ? "lg" : undefined}
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
                {isVisible.subscribers ? <FaFolderOpen /> : <FaFolder />}
                <Heading size="sm" ml={2}>
                  Adhérents & Abonnés
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
                rightIcon={isAdd ? <ChevronDownIcon /> : <ChevronRightIcon />}
                colorScheme={isAdd ? "green" : "teal"}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAdd(!isAdd);
                  setIsVisible({ ...isVisible, subscribers: false });
                }}
                m={1}
                data-cy="orgAddSubscribers"
              >
                Ajouter
              </Button>
            </GridItem>
          </Grid>
        </GridHeader>
      </Link>

      {isAdd && (
        <GridItem light={{ bg: "orange.50" }} dark={{ bg: "gray.700" }} p={5}>
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
              setIsVisible({ ...isVisible, subscribers: true });
              dispatch(refetchEvent());
            }}
          />
        </GridItem>
      )}

      {isVisible.subscribers &&
        (orgQuery.isLoading ? (
          <Text>Chargement de la liste des adhérents & abonnés...</Text>
        ) : (
          <SubscriptionsList
            org={org}
            orgQuery={orgQuery}
            subQuery={subQuery}
            isSubscriptionLoading={isSubscriptionLoading}
            setIsSubscriptionLoading={setIsSubscriptionLoading}
            onTagClick={onTagClick}
          />
        ))}
    </Grid>
  );
};
