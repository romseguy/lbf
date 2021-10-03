import {
  BellIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  EmailIcon,
  QuestionIcon
} from "@chakra-ui/icons";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverFooter,
  Button,
  FormControl,
  InputGroup,
  InputLeftElement,
  Input,
  FormErrorMessage,
  Tooltip,
  Box,
  Checkbox,
  CheckboxGroup,
  VStack,
  FormLabel,
  useToast,
  PopoverHeader,
  Text,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link } from "features/common";
import { selectUserEmail, setUserEmail } from "features/users/userSlice";
import { useSession } from "hooks/useAuth";
import { Category, IEvent } from "models/Event";
import { IOrg, orgTypeFull4 } from "models/Org";
import {
  IEventSubscription,
  IOrgSubscription,
  ISubscription,
  ITopicSubscription,
  SubscriptionTypes
} from "models/Subscription";
import { useAppDispatch } from "store";
import { emailR } from "utils/email";
import {
  useAddSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useEditSubscriptionMutation
} from "./subscriptionsApi";
import { refetchSubscription } from "./subscriptionSlice";
import { ITopic } from "models/Topic";

const setAllItems = (payload: {
  checked: boolean;
  topic?: ITopic;
}): { [key: number]: { checked: boolean } } =>
  Object.keys(Category).reduce((obj, key) => {
    const k = parseInt(key);
    if (k === 0) return obj;
    return { ...obj, [k]: payload };
  }, {});

export const SubscriptionPopover = ({
  org,
  event,
  query,
  subQuery,
  followerSubscription,
  notifType = "email",
  ...props
}: {
  org?: IOrg;
  event?: IEvent;
  query: any;
  subQuery: any;
  email?: string;
  followerSubscription?: IOrgSubscription | IEventSubscription;
  notifType?: "email" | "push";
  isLoading?: boolean;
  onSubmit?: (subscribed: boolean) => void;
}) => {
  if (!org && !event) return null;

  const { data: session } = useSession();
  const toast = useToast({ position: "top" });
  const dispatch = useAppDispatch();
  const userEmail = useSelector(selectUserEmail) || session?.user.email;

  //#region subscription
  const [addSubscription, addSubscriptionMutation] =
    useAddSubscriptionMutation();
  const [editSubscription, editSubscriptionMutation] =
    useEditSubscriptionMutation();
  const [deleteSubscription, deleteSubscriptionMutation] =
    useDeleteSubscriptionMutation();
  //#endregion

  //#region local state
  const isStep1 = !userEmail;
  const isStep2 = !!userEmail;
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [tooltipProps, setTooltipProps] = useState<{
  //   label?: string;
  //   closeDelay?: number;
  //   openDelay?: number;
  // }>({
  //   label: org
  //     ? "S'abonner pour recevoir une notification quand un événement est publié par cette organisation, ou quand une discussion est ajoutée à cette organisation."
  //     : "S'abonner pour recevoir une notification quand une discussion est ajoutée à cet événement."
  // });
  //#endregion

  //#region form state
  const { clearErrors, errors, handleSubmit, register } = useForm({
    mode: "onChange"
  });

  const [showEventCategories, setShowEventCategories] = useState(false);
  const [eventCategories, setEventCategories] = useState<{
    [key: number]: {
      checked: boolean;
    };
  }>({});
  const isAllEventCategories = Object.keys(eventCategories).every(
    (key) => eventCategories[parseInt(key)].checked
  );

  const [showTopics, setShowTopics] = useState(false);
  const [topics, setTopics] = useState<{
    [key: string]: {
      checked: boolean;
      topic: ITopic;
    };
  }>({});
  const isDisabled = !Object.keys(topics).length;
  const isAllTopics =
    !isDisabled &&
    Object.keys(topics).every((topicId) => topics[topicId].checked);

  useEffect(() => {
    if (!subQuery.data) return;

    //#region event categories
    const newEventCategories: {
      [key: number]: {
        checked: boolean;
      };
    } = Object.keys(Category).reduce((obj, key) => {
      const k = parseInt(key);
      if (k === 0) return obj;
      if (!followerSubscription) {
        console.log("no follower subscription => unchecking all");
        return { ...obj, [k]: { checked: false } };
      }

      if (!("eventCategories" in followerSubscription)) {
        console.log(
          "follower subscription => undefined eventCategories => checking all"
        );
        return {
          ...obj,
          [k]: { checked: true }
        };
      }

      if (!Array.isArray(followerSubscription.eventCategories)) return obj;

      if (followerSubscription.eventCategories.length === 0) {
        console.log("follower subscription => no selection => unchecking all");
        return { ...obj, [k]: { checked: false } };
      }

      const checked = !!followerSubscription.eventCategories?.find(
        ({ catId, emailNotif, pushNotif }) => {
          return notifType === "email"
            ? catId === k && emailNotif
            : catId === k && pushNotif;
        }
      );

      return {
        ...obj,
        [k]: {
          checked
        }
      };
    }, {});

    setEventCategories(newEventCategories);

    if (
      Object.keys(newEventCategories).some(
        (key) => newEventCategories[parseInt(key)].checked
      )
    )
      setShowEventCategories(true);
    //#endregion

    //#region topics
    const newTopics: {
      [key: string]: {
        checked: boolean;
        topic: ITopic;
      };
    } = subQuery.data.topics.reduce(
      (
        obj: {
          [key: string]: {
            checked: boolean;
          };
        },
        { topic }: { topic: ITopic }
      ) => {
        const topicId = topic._id || "";

        if (
          (org && topic.org?._id === org._id) ||
          (event && topic.event?._id === event._id)
        ) {
          return {
            ...obj,
            [topicId]: {
              topic,
              checked: true
            }
          };
        }

        return obj;
      },
      {}
    );

    setTopics(newTopics);

    if (Object.keys(newTopics).some((topicId) => newTopics[topicId].checked))
      setShowTopics(true);
    //#endregion
  }, [subQuery.data]);

  //#endregion

  const onChange = () => {
    //clearErrors("email");
  };

  const onStep1Submit = async ({ email }: { email?: string }) => {
    if (!email) return;
    setIsLoading(true);
    dispatch(setUserEmail(email));
    dispatch(refetchSubscription());
    setIsLoading(false);
    // setIsOpen(false);
    //props.onSubmit && props.onSubmit(true);
  };

  const step1 = (
    <PopoverContent ml={0}>
      {/* <PopoverCloseButton /> */}
      <PopoverBody>
        <form onChange={onChange} onSubmit={handleSubmit(onStep1Submit)}>
          <FormControl id="email" isRequired isInvalid={!!errors["email"]}>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={notifType === "email" ? <EmailIcon /> : <BellIcon />}
              />

              <Input
                name="email"
                placeholder="Entrez votre adresse e-mail"
                ref={register({
                  required: "Veuillez saisir votre adresse e-mail",
                  pattern: {
                    value: emailR,
                    message: "Adresse e-mail invalide"
                  }
                })}
              />
            </InputGroup>
            <FormErrorMessage>
              <ErrorMessage errors={errors} name="email" />
            </FormErrorMessage>
          </FormControl>
        </form>
      </PopoverBody>
      <PopoverFooter>
        <Button
          onClick={handleSubmit(onStep1Submit)}
          colorScheme="green"
          type="submit"
          isLoading={
            addSubscriptionMutation.isLoading || props.isLoading || isLoading
          }
          isDisabled={Object.keys(errors).length > 0}
        >
          Valider
        </Button>
      </PopoverFooter>
    </PopoverContent>
  );

  const onStep2Submit = async () => {
    let payload: Partial<ISubscription> = {};
    let topicSubscriptions: ITopicSubscription[] | undefined = Object.keys(
      topics
    )
      .filter((topicId) => topics[topicId].checked)
      .map((topicId) => {
        const { topic } = topics[topicId];
        return {
          topic,
          emailNotif: notifType === "email",
          pushNotif: notifType === "push"
        };
      });

    topicSubscriptions =
      topicSubscriptions.length > 0 ? topicSubscriptions : undefined;

    if (!subQuery.data || !followerSubscription) {
      if (org) {
        payload.orgs = [
          {
            org,
            orgId: org._id,
            type: SubscriptionTypes.FOLLOWER,
            eventCategories: Object.keys(eventCategories)
              .filter((key) => eventCategories[parseInt(key)].checked)
              .map((key) => {
                const k = parseInt(key);
                return {
                  catId: k,
                  emailNotif: notifType === "email",
                  pushNotif: notifType === "push"
                };
              })
          }
        ];

        payload.topics = topicSubscriptions;

        await addSubscription({ payload }).unwrap();
        toast({
          title: `Vous êtes maintenant abonné à ${
            org ? org.orgName : event!.eventName
          } !`,
          status: "success"
        });
      }
    } else if ("orgId" in followerSubscription) {
      payload.orgs = [
        {
          ...followerSubscription,
          eventCategories: Object.keys(eventCategories)
            .filter((key) => eventCategories[parseInt(key)].checked)
            .map((key) => {
              const k = parseInt(key);
              let eventCategory = followerSubscription.eventCategories?.find(
                ({ catId }) => catId === k
              );

              if (eventCategory) {
                console.log("already subscribed to category", eventCategory);
                if (notifType === "email")
                  return { ...eventCategory, emailNotif: true };
                else if (notifType === "push")
                  return { ...eventCategory, pushNotif: true };
                return eventCategory;
              }

              return {
                catId: k,
                emailNotif: notifType === "email",
                pushNotif: notifType === "push"
              };
            })
        }
      ];
    }

    payload.topics = topicSubscriptions;

    await addSubscription({
      payload,
      email: userEmail
    }).unwrap();
    query.refetch();
    toast({
      title: `Votre abonnement à ${
        org ? org.orgName : event!.eventName
      } a bien été modifié !`,
      status: "success"
    });
  };

  const step2 = (
    <PopoverContent>
      {/* <PopoverCloseButton /> */}
      <PopoverHeader>
        {subQuery.data && followerSubscription && (
          <Link
            href={`/unsubscribe/${
              org ? org.orgUrl : event?.eventUrl
            }?subscriptionId=${subQuery.data._id}`}
            fontSize="smaller"
            variant="underline"
          >
            Se désabonner de {org ? org.orgName : event?.eventName}
          </Link>
        )}
      </PopoverHeader>
      <PopoverBody>
        <form onChange={onChange} onSubmit={handleSubmit(onStep2Submit)}>
          <FormControl>
            <>
              {subQuery.isLoading || subQuery.isFetching ? (
                <Text>Chargement...</Text>
              ) : (
                <>
                  {org && (
                    <>
                      <Checkbox
                        mb={1}
                        isChecked={isAllEventCategories}
                        isIndeterminate={
                          !isAllEventCategories &&
                          Object.keys(eventCategories).some(
                            (key) => eventCategories[parseInt(key)].checked
                          )
                        }
                        onChange={(e) =>
                          setEventCategories(
                            setAllItems({ checked: e.target.checked })
                          )
                        }
                      >
                        Événements
                      </Checkbox>

                      <Box ml={3}>
                        <Link
                          onClick={() =>
                            setShowEventCategories(!showEventCategories)
                          }
                        >
                          <FormLabel mb={1} cursor="pointer">
                            {showEventCategories ? (
                              <ChevronDownIcon />
                            ) : (
                              <ChevronRightIcon />
                            )}{" "}
                            Catégories
                          </FormLabel>
                        </Link>

                        {showEventCategories && (
                          <>
                            {subQuery.isLoading || subQuery.isFetching ? (
                              <Text>Chargement...</Text>
                            ) : (
                              <CheckboxGroup>
                                <VStack alignItems="flex-start">
                                  {Object.keys(eventCategories).map((key) => {
                                    const k = parseInt(key);
                                    const cat = Category[k];

                                    return (
                                      <Checkbox
                                        key={k}
                                        isChecked={eventCategories[k].checked}
                                        onChange={(e) =>
                                          setEventCategories({
                                            ...eventCategories,
                                            [k]: { checked: e.target.checked }
                                          })
                                        }
                                      >
                                        {cat.label}
                                      </Checkbox>
                                    );
                                  })}
                                </VStack>
                              </CheckboxGroup>
                            )}
                          </>
                        )}
                      </Box>
                    </>
                  )}

                  <Checkbox
                    mt={3}
                    mb={1}
                    isChecked={isAllTopics}
                    isDisabled={isDisabled}
                    title={
                      isDisabled
                        ? `Vous êtes abonné à aucune discussion`
                        : undefined
                    }
                    isIndeterminate={
                      !isAllTopics &&
                      Object.keys(topics).some(
                        (topicId) => topics[topicId].checked
                      )
                    }
                    onChange={(e) =>
                      setTopics(
                        Object.keys(topics).reduce((obj, topicId) => {
                          const topic = topics[topicId];
                          return {
                            ...obj,
                            [topicId]: { ...topic, checked: e.target.checked }
                          };
                        }, {})
                      )
                    }
                  >
                    Discussions
                  </Checkbox>

                  {!isDisabled && (
                    <Box ml={3}>
                      <Link onClick={() => setShowTopics(!showTopics)}>
                        <FormLabel mb={1} cursor="pointer">
                          {showTopics ? (
                            <ChevronDownIcon />
                          ) : (
                            <ChevronRightIcon />
                          )}{" "}
                          Sujets de discussion
                        </FormLabel>
                      </Link>

                      {showTopics && (
                        <CheckboxGroup>
                          <VStack alignItems="flex-start">
                            {Object.keys(topics).map((topicId) => {
                              const checked = topics[topicId].checked;
                              const topic = topics[topicId].topic;
                              return (
                                <Checkbox
                                  key={topicId}
                                  isChecked={checked}
                                  onChange={(e) =>
                                    setTopics({
                                      ...topics,
                                      [topicId]: {
                                        ...topics[topicId],
                                        checked: e.target.checked
                                      }
                                    })
                                  }
                                >
                                  {topic.topicName}
                                </Checkbox>
                              );
                            })}
                          </VStack>
                        </CheckboxGroup>
                      )}
                    </Box>
                  )}
                </>
              )}
            </>
          </FormControl>

          {/* <FormControl>
            <Checkbox
              ref={register()}
              name="projectCategory"
              value="all"
              icon={<EmailIcon />}
            >
              Tous les projets
            </Checkbox>
          </FormControl> */}
        </form>
      </PopoverBody>

      <PopoverFooter>
        <Button
          onClick={handleSubmit(onStep2Submit)}
          colorScheme="green"
          type="submit"
          isDisabled={
            Object.keys(errors).length > 0 ||
            subQuery.isLoading ||
            subQuery.isFetching
          }
          isLoading={
            addSubscriptionMutation.isLoading || props.isLoading || isLoading
          }
        >
          Modifier l'abonnement
        </Button>
      </PopoverFooter>
    </PopoverContent>
  );

  return (
    <Popover isLazy isOpen={isOpen} onClose={() => setIsOpen(false)}>
      {/* <Tooltip {...tooltipProps} placement="top" hasArrow> */}
      <PopoverTrigger>
        <Button
          isLoading={props.isLoading || isLoading}
          leftIcon={notifType === "email" ? <EmailIcon /> : <BellIcon />}
          colorScheme="teal"
          onClick={async () => {
            // delete case
            // const subscriptionEntitySubscriptions = org
            //   ? subQuery.data?.orgs
            //   : subQuery.data?.events;
            // if (
            //   followerSubscription &&
            //   subQuery.data &&
            //   Array.isArray(subscriptionEntitySubscriptions) &&
            //   subscriptionEntitySubscriptions.length > 0
            // ) {
            //   setIsLoading(true);
            //   const payload = org
            //     ? { orgs: [followerSubscription as IOrgSubscription] }
            //     : { events: [followerSubscription as IEventSubscription] };

            //   await deleteSubscription({
            //     subscriptionId: subQuery.data._id,
            //     payload
            //   });
            //   dispatch(refetchSubscription());
            //   setIsLoading(false);
            //   props.onSubmit && props.onSubmit(false);
            //   return;
            // }

            // if (props.email || session) {
            //   onSubmit({
            //     email: props.email || session?.user.email
            //   });
            // } else
            if (isStep1) {
              setIsOpen(!isOpen);
            } else {
              setIsOpen(!isOpen);
            }
          }}
          data-cy="subscribeToOrg"
        >
          {notifType === "email"
            ? "Notifications e-mail"
            : "Notifications mobile"}
        </Button>
      </PopoverTrigger>
      {/* </Tooltip> */}
      {isStep1 ? step1 : step2}
    </Popover>
  );
};
