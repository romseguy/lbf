import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  IconButton,
  Spinner,
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
  getFollowerSubscription,
  getSubscriberSubscription,
  IOrgSubscription,
  ISubscription,
  SubscriptionTypes
} from "models/Subscription";
import router from "next/router";
import React from "react";
import { IoIosPerson } from "react-icons/io";
import { useAppDispatch } from "store";
import { AppQuery } from "utils/types";
import { SubscriptionEditPopover } from "./SubscriptionEditPopover";
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
  orgQuery: AppQuery<IOrg>;
  subscription: ISubscription;
  subQuery: AppQuery<ISubscription>;
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
  const followerSubscription = getFollowerSubscription({
    org,
    subscription
  }) as IOrgSubscription;
  const subscriberSubscription = getSubscriberSubscription({
    org,
    subscription
  }) as IOrgSubscription;

  let { phone, user, orgs = [] } = subscription;
  let userEmail: string | undefined, userName: string | undefined;

  if (typeof user === "object") {
    userEmail = user.email;
    userName = user.userName;
  }

  const email = subscription.email || userEmail;

  return (
    <Tr>
      {orgQuery.isLoading ? (
        <Td>
          <Spinner />
        </Td>
      ) : (
        <>
          <Td whiteSpace="nowrap">
            <Tooltip
              placement="top"
              hasArrow
              label={`${
                followerSubscription ? "Retirer de" : "Ajouter à"
              } la liste des abonnés`}
            >
              <Tag
                variant={followerSubscription ? "solid" : "outline"}
                colorScheme="green"
                cursor="pointer"
                mr={3}
                onClick={() =>
                  onTagClick({
                    type: SubscriptionTypes.FOLLOWER,
                    followerSubscription,
                    email,
                    phone,
                    user,
                    subscription
                  })
                }
                data-cy={
                  followerSubscription
                    ? "orgSubscriberUnfollow"
                    : "orgSubscriberFollow"
                }
              >
                <TagLabel>Abonné</TagLabel>
              </Tag>
            </Tooltip>

            <Tooltip
              placement="top"
              hasArrow
              label={`${
                subscriberSubscription ? "Retirer de" : "Ajouter à"
              } la liste des adhérents`}
            >
              <Tag
                variant={subscriberSubscription ? "solid" : "outline"}
                colorScheme="purple"
                cursor="pointer"
                mr={3}
                onClick={() =>
                  onTagClick({
                    type: SubscriptionTypes.SUBSCRIBER,
                    subscriberSubscription,
                    email,
                    phone,
                    user,
                    subscription
                  })
                }
                data-cy={
                  subscriberSubscription
                    ? "orgSubscriberUnsubscribe"
                    : "orgSubscriberSubscribe"
                }
              >
                <TagLabel>Adhérent</TagLabel>
              </Tag>
            </Tooltip>
          </Td>

          <Td whiteSpace="nowrap">
            {followerSubscription && email && (
              <>
                <SubscriptionEditPopover
                  org={org}
                  userEmail={email}
                  isIconOnly
                  isSelf={false}
                  buttonProps={{ mr: 3, "data-cy": "orgSubscriberFollow" }}
                />
                <SubscriptionEditPopover
                  org={org}
                  notifType="push"
                  userEmail={email}
                  isIconOnly
                  isSelf={false}
                  buttonProps={{ mr: 3, "data-cy": "orgSubscriberFollow" }}
                />
              </>
            )}
          </Td>

          <Td width="100%">{phone || email}</Td>

          <Td whiteSpace="nowrap" textAlign="right">
            {/* {isSubscriptionLoading[subscription._id] ? (
          <Spinner boxSize={4} />
        ) : ( */}
            <Box>
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
                  height="auto"
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
                            phone
                              ? "ce numéro de téléphone"
                              : "cette adresse-email"
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
                  height="auto"
                  minWidth={0}
                  onClick={async () => {
                    setIsSubscriptionLoading({
                      ...isSubscriptionLoading,
                      [subscription._id]: true
                    });

                    const unsubscribe = confirm(
                      `Êtes-vous sûr de vouloir supprimer ${
                        phone || email
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
            </Box>
            {/* )} */}
          </Td>
        </>
      )}
    </Tr>
  );
};
