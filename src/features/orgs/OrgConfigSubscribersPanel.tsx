import { IOrg, orgTypeFull } from "models/Org";
import type { Visibility } from "./OrgPage";
import tw, { css } from "twin.macro";
import React, { useState } from "react";
import {
  Box,
  Heading,
  IconButton,
  Grid,
  FormLabel,
  Tag,
  TagLabel,
  Tooltip,
  Table,
  Tr,
  Td,
  Tbody
} from "@chakra-ui/react";
import {
  AddIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DeleteIcon
} from "@chakra-ui/icons";
import { Button, GridHeader, GridItem, Link, Textarea } from "features/common";
import { emailR } from "utils/email";
import {
  useAddSubscriptionMutation,
  useDeleteSubscriptionMutation
} from "features/subscriptions/subscriptionsApi";
import {
  IOrgSubscription,
  ISubscription,
  SubscriptionTypes
} from "models/Subscription";
import { IUser } from "models/User";

type OrgConfigSubscribersPanelProps = Visibility & {
  org: IOrg;
  orgQuery: any;
  subQuery: any;
};

export const OrgConfigSubscribersPanel = ({
  org,
  orgQuery,
  subQuery,
  isVisible,
  setIsVisible
}: OrgConfigSubscribersPanelProps) => {
  const [addSubscription, addSubscriptionMutation] =
    useAddSubscriptionMutation();
  const [deleteSubscription, deleteSubscriptionMutation] =
    useDeleteSubscriptionMutation();

  const [isLoading, setIsLoading] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [emailList, setEmailList] = useState("");

  const hasSubscriptions =
    Array.isArray(org.orgSubscriptions) && org.orgSubscriptions.length > 0;
  // !!org.orgSubscriptions.find(
  //   (orgSubscription) =>
  //     Array.isArray(orgSubscription.orgs) &&
  //     !!orgSubscription.orgs.find(
  //       ({ type }) =>
  //         type === SubscriptionTypes.SUBSCRIBER ||
  //         type === SubscriptionTypes.FOLLOWER
  //     )
  // );

  const onTagClick = async ({
    type,
    following,
    subscribing,
    email,
    user,
    subscription
  }: {
    type: string;
    following?: any;
    subscribing?: any;
    email?: string;
    user?: IUser | string;
    subscription: ISubscription;
  }) => {
    if (
      addSubscriptionMutation.isLoading ||
      deleteSubscriptionMutation.isLoading
    )
      return;

    setIsLoading(true);

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

    setIsLoading(false);
  };

  return (
    <>
      <GridHeader
        borderTopRadius="lg"
        cursor={hasSubscriptions ? "pointer" : "default"}
        onClick={() => {
          if (!hasSubscriptions) return;
          setIsAdd(false);
          setIsVisible({
            ...isVisible,
            subscribers: !isVisible.subscribers,
            banner: false
          });
        }}
      >
        <Grid templateColumns="1fr auto" alignItems="center">
          <GridItem
            css={css`
              @media (max-width: 730px) {
                & {
                  padding-top: 12px;
                  padding-bottom: 12px;
                }
              }
            `}
          >
            <Heading size="sm">
              Adhérents & Abonnés{" "}
              {hasSubscriptions && (
                <>
                  {isVisible.subscribers ? (
                    <ChevronDownIcon />
                  ) : (
                    <ChevronRightIcon />
                  )}
                </>
              )}
            </Heading>
          </GridItem>

          <GridItem
            css={css`
              @media (max-width: 730px) {
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
              Ajouter des e-mails
            </Button>
          </GridItem>
        </Grid>
      </GridHeader>

      {isAdd && (
        <GridItem light={{ bg: "orange.50" }} dark={{ bg: "gray.700" }}>
          <Box p={5}>
            <FormLabel htmlFor="emailList">
              Entrez les e-mails séparées par un espace ou un retour à la ligne
              :
            </FormLabel>
            <Textarea
              id="emailList"
              dark={{ _hover: { borderColor: "white" } }}
              onChange={(e) => setEmailList(e.target.value)}
              value={emailList}
            />
            <Button
              mt={3}
              isLoading={addSubscriptionMutation.isLoading}
              onClick={async () => {
                const emailArray = emailList
                  .split(/(\s+)/)
                  .filter((e: string) => e.trim().length > 0)
                  .filter((email) => emailR.test(email));

                if (!emailArray.length) {
                  setEmailList("");
                  return;
                }

                const promises = emailArray.map((email) => {
                  return addSubscription({
                    email,
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
                });

                await Promise.all(promises);

                setEmailList("");
                setIsVisible({ ...isVisible, subscribers: true });
                setIsAdd(false);
                orgQuery.refetch();
                subQuery.refetch();
              }}
              data-cy="orgAddSubscribersSubmit"
            >
              Ajouter
            </Button>
          </Box>
        </GridItem>
      )}

      {isVisible.subscribers && hasSubscriptions && (
        <GridItem light={{ bg: "orange.100" }} dark={{ bg: "gray.500" }}>
          <Box overflowX="auto">
            <Table>
              <Tbody
                css={css`
                  @media (max-width: 452px) {
                    & > tr {
                      td {
                        padding: 0;
                      }

                      td:first-of-type {
                        padding: 4px 0 4px 4px;

                        & > span:first-of-type {
                          margin-bottom: 4px;
                        }
                      }
                    }
                  }

                  @media (min-width: 453px) and (max-width: 604px) {
                    & > tr {
                      td:first-of-type {
                        & > span:first-of-type {
                          margin-bottom: 4px;
                        }
                      }
                    }
                  }
                `}
              >
                {org.orgSubscriptions
                  // .filter(
                  //   ({ orgs = [] }) =>
                  //     !!orgs.find(
                  //       ({ orgId, type }) =>
                  //         orgId === org._id &&
                  //         (type === SubscriptionTypes.SUBSCRIBER ||
                  //           type === SubscriptionTypes.FOLLOWER)
                  //     )
                  // )
                  .map((subscription, index) => {
                    const { email, user, orgs = [] } = subscription;
                    const userEmail =
                      typeof user === "object" ? user.email : email;

                    const userName =
                      typeof user === "object" ? user.userName : "";
                    let following: IOrgSubscription | null = null;
                    let subscribing: IOrgSubscription | null = null;

                    for (const orgSubscription of orgs) {
                      const { type } = orgSubscription;
                      if (!type) continue;

                      if (type === SubscriptionTypes.FOLLOWER)
                        following = orgSubscription;
                      else if (type === SubscriptionTypes.SUBSCRIBER)
                        subscribing = orgSubscription;
                    }

                    return (
                      <Tr key={`email-${index}`}>
                        <Td>
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
                              cursor={
                                isLoading ||
                                addSubscriptionMutation.isLoading ||
                                deleteSubscriptionMutation.isLoading
                                  ? "not-allowed"
                                  : "pointer"
                              }
                              _hover={{ textDecoration: "underline" }}
                              onClick={() =>
                                onTagClick({
                                  type: SubscriptionTypes.FOLLOWER,
                                  following,
                                  email,
                                  user,
                                  subscription
                                })
                              }
                              data-cy={
                                following
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
                              subscribing ? "Retirer de" : "Ajouter à"
                            } la liste des adhérents`}
                          >
                            <Tag
                              variant={subscribing ? "solid" : "outline"}
                              colorScheme="purple"
                              mr={3}
                              cursor={
                                isLoading ||
                                addSubscriptionMutation.isLoading ||
                                deleteSubscriptionMutation.isLoading
                                  ? "not-allowed"
                                  : "pointer"
                              }
                              _hover={{ textDecoration: "underline" }}
                              onClick={() =>
                                onTagClick({
                                  type: SubscriptionTypes.SUBSCRIBER,
                                  subscribing,
                                  email,
                                  user,
                                  subscription
                                })
                              }
                              data-cy={
                                subscribing
                                  ? "orgSubscriberUnsubscribe"
                                  : "orgSubscriberSubscribe"
                              }
                            >
                              <TagLabel>Adhérent</TagLabel>
                            </Tag>
                          </Tooltip>
                        </Td>

                        <Td>
                          {email || (
                            <Link href={`/${userName}`} variant="underline">
                              {userEmail}
                            </Link>
                          )}
                        </Td>

                        <Td textAlign="right">
                          {!user && (
                            <Tooltip
                              label="Créer un compte"
                              hasArrow
                              placement="top"
                            >
                              <IconButton
                                aria-label="Créer un compte"
                                bg="transparent"
                                _hover={{ bg: "transparent", color: "green" }}
                                icon={<AddIcon />}
                                height="auto"
                              >
                                Créer un compte
                              </IconButton>
                            </Tooltip>
                          )}

                          <Tooltip
                            label="Supprimer de la liste"
                            hasArrow
                            placement="top"
                          >
                            <IconButton
                              aria-label="Désinscrire"
                              bg="transparent"
                              _hover={{ bg: "transparent", color: "red" }}
                              icon={<DeleteIcon />}
                              height="auto"
                              cursor={
                                deleteSubscriptionMutation.isLoading
                                  ? "not-allowed"
                                  : "pointer"
                              }
                              onClick={async () => {
                                const unsubscribe = confirm(
                                  `Êtes vous sûr de vouloir supprimer l'abonnement ${userEmail} de ${orgTypeFull(
                                    org.orgType
                                  )} ${org.orgName} ?`
                                );

                                if (unsubscribe) {
                                  await deleteSubscription({
                                    subscriptionId: subscription._id,
                                    orgId: org._id
                                  });
                                  orgQuery.refetch();
                                  subQuery.refetch();
                                }
                              }}
                              data-cy="orgUnsubscribe"
                            />
                          </Tooltip>
                        </Td>
                      </Tr>
                    );
                  })}
              </Tbody>
            </Table>
          </Box>
        </GridItem>
      )}
    </>
  );
};
