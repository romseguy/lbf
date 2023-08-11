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
import { DeleteButton, Link } from "features/common";
import { refetchEvent } from "store/eventSlice";
import { getUser } from "features/api/usersApi";
import { orgTypeFull } from "models/Org";
import {
  getFollowerSubscription,
  IOrgSubscription,
  ISubscription,
  EOrgSubscriptionType
} from "models/Subscription";
import router from "next/router";
import React from "react";
import { IoIosPerson } from "react-icons/io";
import { useAppDispatch } from "store";
import { SubscriptionEditPopover } from "./SubscriptionEditPopover";
import { useDeleteSubscriptionMutation } from "features/api/subscriptionsApi";
import { SubscriptionsListProps } from "./SubscriptionsList";
import { EditIcon } from "@chakra-ui/icons";

export const SubscriptionsListItem = ({
  org,
  orgQuery,
  subQuery,
  isSubscriptionLoading,
  setIsSubscriptionLoading,
  subscription
}: SubscriptionsListProps & {
  subscription: ISubscription;
}) => {
  const dispatch = useAppDispatch();
  const toast = useToast({ position: "top" });
  const [deleteSubscription, deleteSubscriptionMutation] =
    useDeleteSubscriptionMutation();
  const followerSubscription = getFollowerSubscription({
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

          <Td width="100%">
            <Tooltip
              label="Aller à la page de l'utilisateur"
              hasArrow
              placement="top"
            >
              <span>
                <Link
                  variant="underline"
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
                >
                  {phone || email}
                </Link>
              </span>
            </Tooltip>
          </Td>

          <Td whiteSpace="nowrap" textAlign="right">
            {/* {isSubscriptionLoading[subscription._id] ? (
          <Spinner boxSize={4} />
        ) : ( */}
            <>
              {/* <Tooltip label="Modifier" placement="left">
                <IconButton
                  aria-label="Modifier"
                  colorScheme="green"
                  icon={<EditIcon />}
                  variant="outline"
                  mr={3}
                  onClick={() => {
                  }}
                />
              </Tooltip> */}

              <DeleteButton
                header={
                  <>
                    Êtes-vous sûr de vouloir supprimer {phone || email}{" "}
                    {orgTypeFull(org.orgType)} {org.orgName} ?
                  </>
                }
                isIconOnly
                isSmall={false}
                variant="outline"
                onClick={async () => {
                  setIsSubscriptionLoading({
                    ...isSubscriptionLoading,
                    [subscription._id]: true
                  });

                  await deleteSubscription({
                    subscriptionId: subscription._id,
                    orgId: org._id
                  });
                  dispatch(refetchEvent());
                  setIsSubscriptionLoading({
                    ...isSubscriptionLoading,
                    [subscription._id]: false
                  });
                }}
                label="Supprimer"
                data-cy="orgUnsubscribe"
              />
            </>
            {/* )} */}
          </Td>
        </>
      )}
    </Tr>
  );
};
