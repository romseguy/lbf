import { DeleteIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Link,
  Tag,
  TagLabel,
  Td,
  Tooltip,
  Tr,
  useToast
} from "@chakra-ui/react";
import { refetchEvent } from "features/events/eventSlice";
import { getUser } from "features/users/usersApi";
import { IOrg, orgTypeFull } from "models/Org";
import {
  IOrgSubscription,
  ISubscription,
  SubscriptionTypes
} from "models/Subscription";
import router from "next/router";
import React from "react";
import { IoIosPerson } from "react-icons/io";
import { useAppDispatch } from "store";
import { useDeleteSubscriptionMutation } from "./subscriptionsApi";

export const SubscriptionsListItem = ({
  org,
  orgQuery,
  subscription,
  subQuery,
  isSubscriptionLoading,
  setIsSubscriptionLoading,
  onTagClick
}: {
  org: IOrg;
  orgQuery: any;
  subscription: ISubscription;
  subQuery: any;
  isSubscriptionLoading: {
    [key: string]: boolean;
  };
  setIsSubscriptionLoading: React.Dispatch<
    React.SetStateAction<{
      [key: string]: boolean;
    }>
  >;
  onTagClick: (arg0: any) => void;
}) => {
  const dispatch = useAppDispatch();
  const toast = useToast({ position: "top" });
  const [deleteSubscription, deleteSubscriptionMutation] =
    useDeleteSubscriptionMutation();

  let { email, phone, user, orgs = [] } = subscription;
  let userEmail: string | undefined, userName: string | undefined;

  if (typeof user === "object") {
    userEmail = user.email;
    userName = user.userName;
  }

  let following: IOrgSubscription | null = null;
  let subscribing: IOrgSubscription | null = null;

  for (const orgSubscription of orgs) {
    const { type, orgId } = orgSubscription;
    if (orgId !== org._id || !type) continue;

    if (type === SubscriptionTypes.FOLLOWER) following = orgSubscription;
    else if (type === SubscriptionTypes.SUBSCRIBER)
      subscribing = orgSubscription;
  }

  return (
    <Tr>
      <Td whiteSpace="nowrap">
        <Link
          variant="no-underline"
          onClick={() =>
            onTagClick({
              type: SubscriptionTypes.FOLLOWER,
              following,
              email,
              phone,
              user,
              subscription
            })
          }
          data-cy={following ? "orgSubscriberUnfollow" : "orgSubscriberFollow"}
        >
          <Tooltip
            placement="top"
            hasArrow
            label={`${
              following ? "Retirer de" : "Ajouter à"
            } la liste des abonnés`}
          >
            <Tag
              variant={following ? "solid" : "outline"}
              colorScheme="green"
              mr={3}
            >
              <TagLabel>Abonné</TagLabel>
            </Tag>
          </Tooltip>
        </Link>

        <Link
          variant="no-underline"
          onClick={() =>
            onTagClick({
              type: SubscriptionTypes.SUBSCRIBER,
              subscribing,
              email,
              phone,
              user,
              subscription
            })
          }
          data-cy={
            subscribing ? "orgSubscriberUnsubscribe" : "orgSubscriberSubscribe"
          }
        >
          <Tooltip
            placement="top"
            hasArrow
            label={`${
              subscribing ? "Retirer de" : "Ajouter à"
            } la liste des adhérents`}
          >
            <Tag
              variant={subscribing ? "solid" : "outline"}
              colorScheme="purple"
              mr={3}
            >
              <TagLabel>Adhérent</TagLabel>
            </Tag>
          </Tooltip>
        </Link>
      </Td>

      <Td width="100%">{phone || email || userEmail}</Td>

      <Td whiteSpace="nowrap" textAlign="right">
        {/* <Box> */}
        <Tooltip
          label="Aller à la page de l'utilisateur"
          hasArrow
          placement="top"
        >
          <IconButton
            aria-label="Aller à la page de l'utilisateur"
            bg="transparent"
            _hover={{ bg: "transparent", color: "green" }}
            icon={<IoIosPerson />}
            isLoading={isSubscriptionLoading[subscription._id]}
            height="auto"
            cursor={
              isSubscriptionLoading[subscription._id]
                ? "not-allowed"
                : undefined
            }
            onClick={async () => {
              setIsSubscriptionLoading({
                ...isSubscriptionLoading,
                [subscription._id]: true
              });
              if (userName) {
                setIsSubscriptionLoading({
                  ...isSubscriptionLoading,
                  [subscription._id]: false
                });
                router.push(`/${userName}`, `/${userName}`, {
                  shallow: true
                });
              } else {
                const query = await dispatch(
                  getUser.initiate({
                    slug: phone || email || ""
                  })
                );

                if (query.data) {
                  setIsSubscriptionLoading({
                    ...isSubscriptionLoading,
                    [subscription._id]: false
                  });
                  router.push(
                    `/${query.data.userName}`,
                    `/${query.data.userName}`,
                    {
                      shallow: true
                    }
                  );
                } else {
                  setIsSubscriptionLoading({
                    ...isSubscriptionLoading,
                    [subscription._id]: false
                  });
                  toast({
                    status: "warning",
                    title: `Aucun utilisateur associé à ${
                      phone ? "ce numéro de téléphone" : "cette adresse-email"
                    }`
                  });
                }
              }
            }}
          />
        </Tooltip>

        <Tooltip label="Supprimer de la liste" hasArrow placement="top">
          <IconButton
            aria-label="Désinscrire"
            bg="transparent"
            _hover={{ bg: "transparent", color: "red" }}
            icon={<DeleteIcon />}
            isLoading={isSubscriptionLoading[subscription._id]}
            height="auto"
            minWidth={0}
            cursor={
              isSubscriptionLoading[subscription._id]
                ? "not-allowed"
                : undefined
            }
            onClick={async () => {
              setIsSubscriptionLoading({
                ...isSubscriptionLoading,
                [subscription._id]: true
              });

              const unsubscribe = confirm(
                `Êtes-vous sûr de vouloir supprimer l'abonnement ${
                  phone || email || userEmail
                } ${orgTypeFull(org.orgType)} ${org.orgName} ?`
              );

              if (unsubscribe) {
                await deleteSubscription({
                  subscriptionId: subscription._id,
                  orgId: org._id
                });
                dispatch(refetchEvent());
                orgQuery.refetch();
                subQuery.refetch();
              }

              setIsSubscriptionLoading({
                ...isSubscriptionLoading,
                [subscription._id]: false
              });
            }}
            data-cy="orgUnsubscribe"
          />
        </Tooltip>
        {/* </Box> */}
      </Td>
    </Tr>
  );
};
