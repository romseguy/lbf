import { Spinner, Td, Tooltip, Tr } from "@chakra-ui/react";
import { useDeleteSubscriptionMutation } from "features/api/subscriptionsApi";
import { getUser } from "features/api/usersApi";
import { DeleteButton, EditIconButton, Link } from "features/common";
import { useToast } from "hooks/useToast";
import { orgTypeFull } from "models/Org";
import {
  getEntitySubscription,
  IOrgSubscription,
  ISubscription
} from "models/Subscription";
import { useRouter } from "next/router";
import React from "react";
import { useAppDispatch } from "store";
import { SubscriptionEditPopover } from "./SubscriptionEditPopover";
import { SubscriptionsListProps } from "./SubscriptionsList";

export const SubscriptionsListItem = ({
  orgQuery,
  isSubscriptionLoading,
  setIsSubscriptionLoading,
  subscription,
  onEditClick
}: SubscriptionsListProps & {
  subscription: ISubscription;
  onEditClick: () => void;
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const toast = useToast({ position: "top" });
  const [deleteSubscription, deleteSubscriptionMutation] =
    useDeleteSubscriptionMutation();

  const org = orgQuery.data;
  const followerSubscription = getEntitySubscription({
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
                  isIconOnly
                  isSelf={false}
                  buttonProps={{ mr: 3, "data-cy": "orgSubscriberFollow" }}
                />
                <SubscriptionEditPopover
                  org={org}
                  notifType="push"
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

              <EditIconButton
                colorScheme="green"
                mr={3}
                onClick={onEditClick}
              />

              <DeleteButton
                hasTooltip={false}
                header={
                  <>
                    Êtes-vous sûr de vouloir supprimer {phone || email}{" "}
                    {orgTypeFull(org?.orgType)} {org?.orgName} ?
                  </>
                }
                isIconOnly
                isSmall={false}
                onClick={async () => {
                  try {
                    setIsSubscriptionLoading({
                      ...isSubscriptionLoading,
                      [subscription._id]: true
                    });

                    await deleteSubscription({
                      subscriptionId: subscription._id,
                      orgId: org?._id
                    });

                    toast({
                      title: "Le participant a été supprimé",
                      status: "success"
                    });

                    setIsSubscriptionLoading({
                      ...isSubscriptionLoading,
                      [subscription._id]: false
                    });
                  } catch (error) {
                    toast({
                      title: "Le participant n'a pas pu être supprimé",
                      status: "success"
                    });
                  }
                }}
              />
            </>
            {/* )} */}
          </Td>
        </>
      )}
    </Tr>
  );
};
