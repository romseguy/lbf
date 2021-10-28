import {
  AddIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DeleteIcon
} from "@chakra-ui/icons";
import {
  Box,
  Button,
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
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosPerson } from "react-icons/io";
import { css } from "twin.macro";
import {
  ErrorMessageText,
  GridHeader,
  GridItem,
  Link,
  Textarea
} from "features/common";
import { refetchEvent } from "features/events/eventSlice";
import {
  useAddSubscriptionMutation,
  useDeleteSubscriptionMutation
} from "features/subscriptions/subscriptionsApi";
import { getUser } from "features/users/usersApi";
import { IOrg, orgTypeFull } from "models/Org";
import {
  IOrgSubscription,
  ISubscription,
  SubscriptionTypes
} from "models/Subscription";
import { IUser } from "models/User";
import { useAppDispatch } from "store";
import { hasItems } from "utils/array";
import { emailR } from "utils/email";
import { handleError } from "utils/form";
import { phoneR } from "utils/string";
import { Visibility } from "./OrgPage";

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
  const router = useRouter();
  const toast = useToast({ position: "top" });
  const dispatch = useAppDispatch();

  //#region subscription
  const [addSubscription, addSubscriptionMutation] =
    useAddSubscriptionMutation();
  const [deleteSubscription, deleteSubscriptionMutation] =
    useDeleteSubscriptionMutation();
  //#endregion

  //#region form
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
  const [isAdd, setIsAdd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState<{
    [key: string]: boolean;
  }>(
    org.orgSubscriptions.reduce((obj, subscription) => {
      return { ...obj, [subscription._id]: false };
    }, {})
  );
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

  const onSubmit = async (form: {
    emailList: string;
    phoneList: string;
    subscriptionType: string;
  }) => {
    try {
      setIsLoading(true);
      console.log("submitted", form);
      const { emailList, phoneList, subscriptionType } = form;

      const emailArray: string[] = emailList
        .split(/(\s+)/)
        .filter((e: string) => e.trim().length > 0)
        .filter((email: string) => emailR.test(email));

      const phoneArray: string[] = phoneList
        .split(/(\s+)/)
        .filter((e: string) => e.trim().length > 0)
        .filter((phone: string) => phoneR.test(phone));

      if (!emailArray.length && !phoneArray.length) {
        throw new Error("Aucune coordonnée valide");
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

      for (const phone of phoneArray) {
        for (const type of subscriptionType) {
          await addSubscription({
            phone,
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
      dispatch(refetchEvent());
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
                Ajouter des coordonnées
              </Button>
            </GridItem>
          </Grid>
        </GridHeader>
      </Link>

      {isAdd && (
        <GridItem light={{ bg: "orange.50" }} dark={{ bg: "gray.700" }} p={5}>
          <form
            onChange={() => clearErrors("formErrorMessage")}
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormControl id="emailList" isInvalid={!!errors.emailList} mb={3}>
              <FormLabel>
                Entrez les e-mails séparées par un espace ou un retour à la
                ligne :{" "}
              </FormLabel>
              <Textarea
                ref={register()}
                name="emailList"
                dark={{ _hover: { borderColor: "white" } }}
              />
              <FormErrorMessage>
                <ErrorMessage errors={errors} name="emailList" />
              </FormErrorMessage>
            </FormControl>

            <FormControl id="phoneList" isInvalid={!!errors.phoneList} mb={3}>
              <FormLabel>
                Entrez les numéros de téléphone mobile séparés par un espace ou
                un retour à la ligne :{" "}
              </FormLabel>
              <Textarea
                ref={register()}
                name="phoneList"
                dark={{ _hover: { borderColor: "white" } }}
              />
              <FormErrorMessage>
                <ErrorMessage errors={errors} name="phoneList" />
              </FormErrorMessage>
            </FormControl>

            <FormControl
              id="subscriptionType"
              isRequired
              isInvalid={!!errors.subscriptionType}
              mb={3}
            >
              <FormLabel>Ajouter les coordonnées en tant que :</FormLabel>
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

            <Flex>
              <Button onClick={() => setIsAdd(false)} mr={3}>
                Annuler
              </Button>
              <Button
                colorScheme="green"
                type="submit"
                isDisabled={
                  Object.keys(errors).length > 0 ||
                  Object.keys(isSubscriptionLoading).some(
                    (_id) => !!isSubscriptionLoading[_id]
                  )
                }
                isLoading={isLoading}
                data-cy="orgAddSubscribersSubmit"
              >
                Ajouter
              </Button>
            </Flex>
          </form>
        </GridItem>
      )}

      {isVisible.subscribers &&
        (orgQuery.isLoading ? (
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
                {org.orgSubscriptions.map((subscription, index) => {
                  let { email, phone, user, orgs = [] } = subscription;
                  let userEmail: string | undefined,
                    userName: string | undefined;

                  if (typeof user === "object") {
                    userEmail = user.email;
                    userName = user.userName;
                  }

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
                              phone,
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
                                  userEmail || subscription.phone
                                } de ${orgTypeFull(org.orgType)} ${
                                  org.orgName
                                } ?`
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
                })}
              </Tbody>
            </Table>
          </GridItem>
        ))}
    </Grid>
  );
};
