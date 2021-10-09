import {
  AddIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DeleteIcon
} from "@chakra-ui/icons";
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
  Tbody,
  FormControl,
  CheckboxGroup,
  Checkbox,
  Text,
  useColorMode,
  Alert,
  AlertIcon,
  Flex,
  FormErrorMessage,
  useToast,
  Spinner
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { css } from "twin.macro";
import {
  Button,
  ErrorMessageText,
  GridHeader,
  GridItem,
  Link,
  Textarea
} from "features/common";
import {
  useAddSubscriptionMutation,
  useDeleteSubscriptionMutation
} from "features/subscriptions/subscriptionsApi";
import { IOrg, orgTypeFull } from "models/Org";
import {
  IOrgSubscription,
  ISubscription,
  SubscriptionTypes
} from "models/Subscription";
import { IUser } from "models/User";
import { emailR } from "utils/email";
import { handleError } from "utils/form";
import type { Visibility } from "./OrgPage";
import { hasItems } from "utils/array";

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
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const toast = useToast();

  //#region subscription
  const [addSubscription, addSubscriptionMutation] =
    useAddSubscriptionMutation();
  const [deleteSubscription, deleteSubscriptionMutation] =
    useDeleteSubscriptionMutation();
  //#endregion

  //#region form state
  const {
    control,
    register,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    watch,
    setValue,
    getValues,
    trigger
  } = useForm({
    mode: "onChange"
  });
  //#endregion

  //#region local state
  const [isLoading, setIsLoading] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  //#endregion

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
    <Grid>
      <Link
        variant="no-underline"
        onClick={() => {
          if (!hasItems(org.orgSubscriptions)) {
            setIsAdd(true);
          } else {
            setIsAdd(false);
            setIsVisible({
              ...isVisible,
              subscribers: !isVisible.subscribers,
              banner: false
            });
          }
        }}
      >
        <GridHeader
          borderTopRadius="lg"
          borderBottomRadius={!isVisible.subscribers ? "lg" : undefined}
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
              <Flex flexDirection="row" alignItems="center">
                {isVisible.subscribers ? (
                  <ChevronDownIcon />
                ) : (
                  <ChevronRightIcon />
                )}
                <Heading size="sm">Adhérents & Abonnés</Heading>
              </Flex>
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
                  clearErrors();
                  setValue("subscriptionType", []);
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
      </Link>

      {isAdd && (
        <GridItem light={{ bg: "orange.50" }} dark={{ bg: "gray.700" }}>
          <Box p={5}>
            <form
              onChange={() => clearErrors("formErrorMessage")}
              onSubmit={handleSubmit(async (form) => {
                try {
                  setIsLoading(true);
                  console.log("submitted", form);
                  const { emailList, subscriptionType } = form;

                  const emailArray: string[] = emailList
                    .split(/(\s+)/)
                    .filter((e: string) => e.trim().length > 0)
                    .filter((email: string) => emailR.test(email));

                  if (!emailArray.length) {
                    throw new Error("Aucune adresse e-mail valide");
                  }

                  for (const email of emailArray) {
                    for (const type of subscriptionType) {
                      await addSubscription({
                        email,
                        payload: {
                          orgs: [
                            {
                              orgId: org._id,
                              org,
                              type
                            }
                          ]
                        }
                      });
                    }
                  }

                  setIsVisible({ ...isVisible, subscribers: true });
                  setIsAdd(false);
                  orgQuery.refetch();
                  subQuery.refetch();
                } catch (error) {
                  handleError(error, (message, field) => {
                    if (field) {
                      setError(field, { type: "manual", message });
                    } else {
                      setError("formErrorMessage", { type: "manual", message });
                    }
                  });
                } finally {
                  setIsLoading(false);
                }
              })}
            >
              <ErrorMessage
                errors={errors}
                name="formErrorMessage"
                render={({ message }) => (
                  <Alert status="error" mb={3}>
                    <AlertIcon />
                    <ErrorMessageText>{message}</ErrorMessageText>
                  </Alert>
                )}
              />

              <FormControl id="emailList" isInvalid={!!errors.emailList} mb={3}>
                <FormLabel>
                  Entrez les e-mails séparées par un espace ou un retour à la
                  ligne :{" "}
                  <Text display="inline" color="red">
                    *
                  </Text>
                </FormLabel>
                <Textarea
                  ref={register({
                    required: "Veuillez entrer une adresse e-mail au minimum"
                  })}
                  name="emailList"
                  dark={{ _hover: { borderColor: "white" } }}
                />
                <FormErrorMessage>
                  <ErrorMessage errors={errors} name="emailList" />
                </FormErrorMessage>
              </FormControl>

              <FormControl
                id="subscriptionType"
                isRequired
                isInvalid={!!errors.subscriptionType}
                mb={3}
              >
                <FormLabel>Ajouter les e-mails en tant que :</FormLabel>
                <CheckboxGroup>
                  <Box
                    display="flex"
                    flexDirection="column"
                    css={css`
                      .chakra-checkbox__control {
                        border-color: black;
                      }
                    `}
                    color="black"
                  >
                    <Checkbox
                      ref={register({ required: true })}
                      name="subscriptionType"
                      value={SubscriptionTypes.SUBSCRIBER}
                      bg={"purple.100"}
                      borderRadius="lg"
                      p={3}
                      mb={3}
                    >
                      Adhérent
                      <Text fontSize="smaller">
                        La personne aura accès aux discussions et événements
                        réservées aux adhérents.
                      </Text>
                    </Checkbox>
                    <Checkbox
                      ref={register({ required: true })}
                      name="subscriptionType"
                      value={SubscriptionTypes.FOLLOWER}
                      bg={"green.100"}
                      borderRadius="lg"
                      p={3}
                    >
                      Abonné
                      <Text fontSize="smaller">
                        La personne recevra les e-mails d'invitation aux
                        événements.
                      </Text>
                    </Checkbox>
                  </Box>
                </CheckboxGroup>

                <FormErrorMessage>
                  <ErrorMessage
                    errors={errors}
                    name="subscriptionType"
                    message="Veuillez cocher une case au minimum"
                  />
                </FormErrorMessage>
              </FormControl>

              <Flex>
                <Button onClick={() => setIsAdd(false)} mr={3}>
                  Annuler
                </Button>
                <Button
                  colorScheme="green"
                  type="submit"
                  isLoading={isLoading || addSubscriptionMutation.isLoading}
                  data-cy="orgAddSubscribersSubmit"
                >
                  Ajouter
                </Button>
              </Flex>
            </form>
          </Box>
        </GridItem>
      )}

      {isVisible.subscribers &&
        (orgQuery.isLoading || orgQuery.isFetching ? (
          <Text>Chargement de la liste des adhérents & abonnés...</Text>
        ) : (
          <GridItem
            light={{ bg: "orange.100" }}
            dark={{ bg: "gray.500" }}
            overflowX="auto"
            aria-hidden
          >
            <Table>
              <Tbody
                css={css`
                  /*
                  @media (max-width: 452px) {
                    & > tr {
                      td {
                        padding: 0 12px 0 0;
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
                */
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
                      const { type, orgId } = orgSubscription;
                      if (orgId !== org._id || !type) continue;

                      if (type === SubscriptionTypes.FOLLOWER)
                        following = orgSubscription;
                      else if (type === SubscriptionTypes.SUBSCRIBER)
                        subscribing = orgSubscription;
                    }

                    return (
                      <Tr key={`email-${index}`}>
                        <Td whiteSpace="nowrap">
                          <Link
                            variant="no-underline"
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

                        <Td width="100%">
                          {email || (
                            <Link href={`/${userName}`} variant="underline">
                              {userEmail}
                            </Link>
                          )}
                        </Td>

                        <Td textAlign="right">
                          {!user && false && (
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
                              isLoading={
                                isLoading ||
                                addSubscriptionMutation.isLoading ||
                                deleteSubscriptionMutation.isLoading
                              }
                              height="auto"
                              minWidth={0}
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
          </GridItem>
        ))}
    </Grid>
  );
};
