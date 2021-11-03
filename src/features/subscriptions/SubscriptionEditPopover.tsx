import {
  BellIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  EmailIcon
} from "@chakra-ui/icons";
import {
  Text,
  PopoverContent,
  PopoverHeader,
  Link,
  PopoverBody,
  FormControl,
  Checkbox,
  Box,
  FormLabel,
  CheckboxGroup,
  VStack,
  PopoverFooter,
  Button,
  useToast,
  Switch,
  Popover,
  PopoverTrigger,
  Spinner
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Category, IEvent } from "models/Event";
import { IOrg, orgTypeFull, orgTypeFull4 } from "models/Org";
import {
  IEventSubscription,
  IOrgSubscription,
  IOrgSubscriptionEventCategory,
  ISubscription,
  ITopicSubscription,
  isOrgSubscription,
  TagType,
  addTagType,
  removeTagType
} from "models/Subscription";
import { ITopic } from "models/Topic";
import { useAddSubscriptionMutation } from "./subscriptionsApi";
import { hasItems } from "utils/array";

export type EventCategoriesType = {
  [key: number]: {
    checked: boolean;
  };
};

export type ITopicSubscriptionCheckboxes = {
  [topicId: string]: {
    checked: boolean;
    topic: ITopic;
  };
};

const setAllItems = (payload: {
  checked: boolean;
  topic?: ITopic;
}): { [key: number]: { checked: boolean } } =>
  Object.keys(Category).reduce((obj, key) => {
    const k = parseInt(key);
    if (k === 0) return obj;
    return { ...obj, [k]: payload };
  }, {});

export const SubscriptionEditPopover = ({
  event,
  org,
  notifType,
  subQuery,
  userEmail,
  ...props
}: {
  event?: IEvent;
  org?: IOrg;
  notifType: "email" | "push";
  subQuery: {
    data?: ISubscription;
    isLoading: boolean;
    isFetching: boolean;
    refetch: () => void;
  };
  followerSubscription: IOrgSubscription | IEventSubscription;
  userEmail: string;
}) => {
  const toast = useToast({ position: "top" });

  //#region local state
  let followerSubscription = { ...props.followerSubscription };
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  //#endregion

  //#region topics
  const [topics, setTopics] = useState<ITopicSubscriptionCheckboxes>({});
  const [isAllTopics, setIsAllTopics] = useState(
    !followerSubscription.tagTypes ||
      followerSubscription.tagTypes.includes("Topics")
  );

  useEffect(() => {
    let checkedCount = 0;
    const newTopics = !subQuery.data
      ? {}
      : subQuery.data.topics.reduce(
          (obj: ITopicSubscriptionCheckboxes, { topic }: { topic: ITopic }) => {
            const topicId = topic._id || "";
            let isChecked = false;

            if (org) {
              const orgId =
                typeof topic.org === "string" ? topic.org : topic.org?._id;
              isChecked = orgId === org._id;
            } else if (event) {
              const eventId =
                typeof topic.event === "string"
                  ? topic.event
                  : topic.event?._id;
              isChecked = eventId === event._id;
            }

            if (isChecked) {
              checkedCount++;
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
  }, [subQuery.data]);
  //#endregion

  //#region org/event follower subscription
  const [addSubscription, addSubscriptionMutation] =
    useAddSubscriptionMutation();
  const [isAllEvents, setIsAllEvents] = useState(
    !followerSubscription.tagTypes ||
      followerSubscription.tagTypes.includes("Events")
  );
  const [showEventCategories, setShowEventCategories] = useState(false);
  const [eventCategories, setEventCategories] = useState<EventCategoriesType>(
    {}
  );
  useEffect(() => {
    if (org) {
      const newEventCategories: EventCategoriesType = Object.keys(
        Category
      ).reduce((obj, key) => {
        if (!isOrgSubscription(followerSubscription)) return obj;

        const k = parseInt(key);
        if (k === 0) return obj;

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
    }
  }, [props.followerSubscription]);
  //#endregion

  const onSubmit = async (params?: { silent?: boolean }) => {
    if (!isPending) return;

    try {
      setIsLoading(true);
      let payload: Partial<ISubscription> = {};

      payload.topics = Object.keys(topics)
        .filter((topicId) => topics[topicId].checked)
        .map((topicId) => {
          const { topic } = topics[topicId];
          return {
            topic,
            emailNotif: notifType === "email" ? true : undefined,
            pushNotif: notifType === "push" ? true : undefined
          };
        });

      if ("orgId" in followerSubscription) {
        const newOrgSubscription = {
          ...followerSubscription
        };

        newOrgSubscription.eventCategories = [];

        for (const key of Object.keys(eventCategories)) {
          if (!eventCategories[parseInt(key)].checked) continue;

          const eventCategory = followerSubscription.eventCategories?.find(
            ({ catId }) => catId === parseInt(key)
          );
          let newEventCategory = { ...eventCategory };

          if (eventCategory) {
            if (notifType === "email") {
              newEventCategory.emailNotif = true;
            } else {
              newEventCategory.pushNotif = true;
            }
          } else {
            newEventCategory = {
              catId: parseInt(key),
              emailNotif: notifType === "email" ? true : undefined,
              pushNotif: notifType === "push" ? true : undefined
            };
          }

          newOrgSubscription.eventCategories.push(
            newEventCategory as IOrgSubscriptionEventCategory
          );
        }

        if (!newOrgSubscription.eventCategories.length)
          delete newOrgSubscription.eventCategories;

        payload.orgs = [newOrgSubscription];
      }

      await addSubscription({
        payload,
        email: userEmail
      }).unwrap();

      subQuery.refetch();

      if (!params?.silent)
        toast({
          title: `Votre abonnement à ${
            org ? org.orgName : event!.eventName
          } a bien été modifié !`,
          status: "success"
        });
    } catch (error) {
      console.error(error);
      toast({
        status: "error",
        title: "Échec de la modification de votre abonnement"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover
      isLazy
      isOpen={isOpen}
      onClose={() => {
        onSubmit({ silent: true });
        setIsPending(false);
        setIsOpen(false);
      }}
    >
      <PopoverTrigger>
        <Button
          leftIcon={
            notifType === "email" ? (
              <EmailIcon boxSize={6} />
            ) : (
              <BellIcon boxSize={6} />
            )
          }
          colorScheme="teal"
          onClick={async () => {
            setIsOpen(!isOpen);
          }}
          data-cy="subscribeToOrg"
        >
          {notifType === "email"
            ? "Notifications e-mail"
            : "Notifications mobile"}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {/* <PopoverCloseButton /> */}
        {subQuery.data ? (
          <PopoverHeader>
            <Text>{userEmail}</Text>
            <Link
              href={`/unsubscribe/${
                org ? org.orgUrl : event?.eventUrl
              }?subscriptionId=${subQuery.data._id}`}
              fontSize="smaller"
              variant="underline"
            >
              Se désabonner de {org ? orgTypeFull(org.orgType) : "l'événement"}
            </Link>
          </PopoverHeader>
        ) : (
          userEmail && (
            <PopoverHeader>
              <Text>Abonnement de {userEmail}</Text>
            </PopoverHeader>
          )
        )}

        <PopoverBody>
          <FormControl>
            <>
              {subQuery.isLoading || subQuery.isFetching ? (
                <Spinner />
              ) : (
                <>
                  Recevoir une notification{" "}
                  {notifType === "email" ? "e-mail" : "mobile"} pour :
                  {org && (
                    <>
                      <Switch
                        display="flex"
                        alignItems="center"
                        cursor="pointer"
                        my={3}
                        isChecked={isAllEvents}
                        isDisabled={isLoading}
                        onChange={async (e) => {
                          try {
                            console.log(
                              e.target.checked
                                ? "adding tagType"
                                : "removing tagType"
                            );

                            setIsLoading(true);
                            setIsAllEvents(e.target.checked);
                            let payload: Partial<ISubscription>;

                            if (isOrgSubscription(followerSubscription)) {
                              payload = {
                                orgs: [
                                  {
                                    ...followerSubscription,
                                    tagTypes: e.target.checked
                                      ? addTagType(
                                          "Events",
                                          followerSubscription
                                        )
                                      : removeTagType(
                                          "Events",
                                          followerSubscription
                                        )
                                  }
                                ]
                              };

                              await addSubscription({
                                payload,
                                email: userEmail
                              });
                              subQuery.refetch();
                            }
                          } catch (error) {
                            console.error(error);
                            toast({
                              status: "error",
                              title:
                                "Échec de la modification de votre abonnement"
                            });
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                      >
                        un nouvel événement
                      </Switch>

                      <Switch
                        display="flex"
                        alignItems="center"
                        cursor="pointer"
                        my={3}
                        isChecked={showEventCategories}
                        onChange={(e) => {
                          if (!e.target.checked) {
                            setEventCategories(setAllItems({ checked: false }));
                          }
                          setShowEventCategories(!showEventCategories);
                        }}
                      >
                        un nouvel événement de la catégorie...
                      </Switch>

                      {showEventCategories && (
                        <>
                          {subQuery.isLoading || subQuery.isFetching ? (
                            <Text>Chargement...</Text>
                          ) : (
                            <CheckboxGroup>
                              <VStack alignItems="flex-start" ml={3}>
                                {Object.keys(eventCategories).map((key) => {
                                  const k = parseInt(key);
                                  const cat = Category[k];

                                  return (
                                    <Checkbox
                                      key={k}
                                      isChecked={eventCategories[k].checked}
                                      onChange={(e) => {
                                        if (
                                          !isOrgSubscription(
                                            followerSubscription
                                          )
                                        )
                                          return;

                                        const wasSubscribedToEventCategory =
                                          !!followerSubscription.eventCategories?.find(
                                            ({ catId }) => catId === k
                                          );

                                        setIsPending(
                                          e.target.checked !==
                                            wasSubscribedToEventCategory
                                        );

                                        setEventCategories({
                                          ...eventCategories,
                                          [k]: { checked: e.target.checked }
                                        });
                                      }}
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
                    </>
                  )}
                  <Switch
                    display="flex"
                    alignItems="center"
                    cursor="pointer"
                    my={3}
                    isChecked={isAllTopics}
                    isDisabled={isLoading}
                    onChange={async (e) => {
                      try {
                        setIsLoading(true);
                        setIsAllTopics(e.target.checked);
                        let payload: Partial<ISubscription>;

                        if (isOrgSubscription(followerSubscription)) {
                          payload = {
                            orgs: [
                              {
                                ...followerSubscription,
                                tagTypes: e.target.checked
                                  ? addTagType("Topics", followerSubscription)
                                  : removeTagType(
                                      "Topics",
                                      followerSubscription
                                    )
                              }
                            ]
                          };
                        } else {
                          payload = {
                            events: [
                              {
                                ...followerSubscription,
                                tagTypes: e.target.checked
                                  ? addTagType("Topics", followerSubscription)
                                  : removeTagType(
                                      "Topics",
                                      followerSubscription
                                    )
                              }
                            ]
                          };
                        }

                        await addSubscription({
                          payload,
                          email: userEmail
                        });
                        subQuery.refetch();
                      } catch (error) {
                        console.error(error);
                        toast({
                          status: "error",
                          title: "Échec de la modification de votre abonnement"
                        });
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  >
                    une nouvelle discussion
                  </Switch>
                  {Object.keys(topics).length > 0 && (
                    <>
                      - une réponse à la discussion...
                      <CheckboxGroup>
                        <VStack alignItems="flex-start" mt={3} ml={3}>
                          {Object.keys(topics).map((topicId) => {
                            const checked = topics[topicId].checked;
                            const topic = topics[topicId].topic;
                            return (
                              <Checkbox
                                key={topicId}
                                isChecked={checked}
                                onChange={(e) => {
                                  const wasSubscribedToTopic =
                                    !!subQuery.data?.topics.find(
                                      ({ topic: { _id } }) => _id === topicId
                                    );

                                  setIsPending(
                                    e.target.checked !== wasSubscribedToTopic
                                  );

                                  setTopics({
                                    ...topics,
                                    [topicId]: {
                                      ...topics[topicId],
                                      checked: e.target.checked
                                    }
                                  });
                                }}
                              >
                                {topic.topicName}
                              </Checkbox>
                            );
                          })}
                        </VStack>
                      </CheckboxGroup>
                    </>
                  )}
                </>
              )}
            </>
          </FormControl>
        </PopoverBody>

        <PopoverFooter>
          <Button
            colorScheme="green"
            isDisabled={isLoading || !isPending}
            onClick={() => onSubmit()}
          >
            Valider
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

// if (!followerSubscription) {
//   console.log("no follower subscription => unchecking all");
//   return { ...obj, [k]: { checked: false } };
// }

// if (!("eventCategories" in followerSubscription)) {
//   console.log(
//     "follower subscription => undefined eventCategories => checking all"
//   );
//   return {
//     ...obj,
//     [k]: { checked: true }
//   };
// }

// addEventOrOrgSubscription({
//   form,
//   followerSubscription,
//   eventCategories,
//   notifType,
//   setIsLoading,
//   topics,
//   userEmail,
//   addSubscription
// });
