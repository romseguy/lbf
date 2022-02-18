import {
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  Switch,
  Text,
  VStack,
  useToast,
  FormLabel
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { EventCategory, IEvent } from "models/Event";
import {
  ISubscription,
  isOrgSubscription,
  setFollowerSubscriptionTagType,
  IOrgSubscription,
  IEventSubscription,
  IOrgSubscriptionEventCategory
} from "models/Subscription";
import { IOrg } from "models/Org";
import { ITopic } from "models/Topic";
import { useAddSubscriptionMutation } from "features/subscriptions/subscriptionsApi";
import { AppQuery } from "utils/types";
import { ArrowForwardIcon, ArrowRightIcon } from "@chakra-ui/icons";

export type EventCategoriesCheckboxes = {
  [key: number]: {
    checked: boolean;
  };
};

export type TopicsCheckboxes = {
  [topicId: string]: {
    checked: boolean;
    topic: ITopic;
  };
};

const setAllItems = (payload: {
  checked: boolean;
  topic?: ITopic;
}): { [key: number]: { checked: boolean } } =>
  Object.keys(EventCategory).reduce((obj, key) => {
    const k = parseInt(key);
    if (k === 0) return obj;
    return { ...obj, [k]: payload };
  }, {});

export const SubscriptionEditForm = ({
  event,
  followerSubscription,
  notifType,
  org,
  subQuery,
  userEmail,
  isSelf,
  ...props
}: {
  event?: IEvent;
  followerSubscription: IOrgSubscription | IEventSubscription;
  notifType: "email" | "push";
  org?: IOrg;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  subQuery: AppQuery<ISubscription>;
  userEmail: string;
  isSelf: boolean;
}) => {
  const toast = useToast({ position: "top" });
  const [isLoading, sIL] = useState(false);
  const setIsLoading = props.setIsLoading || sIL;
  const [addSubscription, addSubscriptionMutation] =
    useAddSubscriptionMutation();

  //#region events
  const [isAllEvents, setIsAllEvents] = useState(false);
  const [eventCategories, setEventCategories] =
    useState<EventCategoriesCheckboxes>(
      org
        ? Object.keys(EventCategory).reduce((obj, key) => {
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
          }, {})
        : {}
    );
  const [showEventCategories, setShowEventCategories] = useState(
    isOrgSubscription(followerSubscription) &&
      !!followerSubscription.eventCategories?.find(
        (eventCategory) => !!eventCategory[`${notifType}Notif`]
      )
  );
  useEffect(() => {
    if (followerSubscription) {
      const isAllEvents =
        !followerSubscription.tagTypes ||
        !!followerSubscription.tagTypes.find(
          ({ type, emailNotif, pushNotif }) =>
            type === "Events"
              ? notifType === "email"
                ? !!emailNotif
                : notifType === "push"
                ? !!pushNotif
                : false
              : false
        );

      setIsAllEvents(isAllEvents);
    }
  }, [followerSubscription]);
  //#endregion

  //#region topics
  const [topics, setTopics] = useState<TopicsCheckboxes>({});
  const [isAllTopics, setIsAllTopics] = useState(false);
  useEffect(() => {
    if (followerSubscription) {
      const isAllTopics =
        !followerSubscription.tagTypes ||
        !!followerSubscription.tagTypes.find(
          ({ type, emailNotif, pushNotif }) =>
            type === "Topics"
              ? notifType === "email"
                ? !!emailNotif
                : notifType === "push"
                ? !!pushNotif
                : false
              : false
        );
      setIsAllTopics(isAllTopics);
    }
  }, [followerSubscription]);
  useEffect(() => {
    if (subQuery.data) {
      const topics = subQuery.data.topics.reduce(
        (obj: TopicsCheckboxes, topicSubscription) => {
          const {
            topic,
            emailNotif = false,
            pushNotif = false
          } = topicSubscription;

          if (org) {
            const orgId =
              typeof topic.org === "object" ? topic.org._id : topic.org;
            if (orgId !== org._id) {
              return obj;
            }
          }

          if (event) {
            const eventId =
              typeof topic.event === "object" ? topic.event._id : topic.event;
            if (eventId !== event._id) {
              return obj;
            }
          }

          return {
            ...obj,
            [topic._id || ""]: {
              topic,
              checked:
                (notifType === "email" && emailNotif) ||
                (notifType === "push" && pushNotif)
            }
          };
        },
        {}
      );
      setTopics(topics);
    }
  }, [subQuery.data]);
  //#endregion

  const onSubmit = async (params?: { silent?: boolean }) => {
    setIsLoading(true);

    let newFollowerSubscription = {
      ...followerSubscription
    };

    let payload: Partial<ISubscription> = {
      topics: Object.keys(topics)
        //.filter((topicId) => topics[topicId].checked)
        .map((topicId) => {
          const { topic, checked } = topics[topicId];
          return {
            topic,
            emailNotif: notifType === "email" ? checked : undefined,
            pushNotif: notifType === "push" ? checked : undefined
          };
        })
    };

    if (isOrgSubscription(newFollowerSubscription)) {
      newFollowerSubscription = {
        ...newFollowerSubscription,
        ...(setFollowerSubscriptionTagType(
          {
            type: "Topics",
            [`${notifType}Notif`]: isAllTopics
          },
          newFollowerSubscription
        ) as IOrgSubscription)
      };

      newFollowerSubscription = {
        ...newFollowerSubscription,
        ...(setFollowerSubscriptionTagType(
          {
            type: "Events",
            [`${notifType}Notif`]: isAllEvents
          },
          newFollowerSubscription
        ) as IOrgSubscription)
      };

      newFollowerSubscription.eventCategories = [];

      for (const key of Object.keys(eventCategories)) {
        if (!eventCategories[parseInt(key)].checked) continue;

        const eventCategory = newFollowerSubscription.eventCategories?.find(
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

        newFollowerSubscription.eventCategories.push(
          newEventCategory as IOrgSubscriptionEventCategory
        );
      }

      if (!newFollowerSubscription.eventCategories.length)
        delete newFollowerSubscription.eventCategories;

      payload.orgs = [newFollowerSubscription];
    } else {
      newFollowerSubscription = {
        ...newFollowerSubscription,
        ...(setFollowerSubscriptionTagType(
          {
            type: "Topics",
            [`${notifType}Notif`]: isAllTopics
          },
          newFollowerSubscription
        ) as IEventSubscription)
      };

      payload.events = [newFollowerSubscription];
    }

    try {
      await addSubscription({
        payload,
        email: userEmail
      }).unwrap();

      subQuery.refetch();

      if (!params?.silent)
        toast({
          title: `${
            isSelf ? "Votre abonnement" : `L'abonnement de ${userEmail}`
          } à ${org ? org.orgName : event!.eventName} a bien été modifié !`,
          status: "success"
        });
    } catch (error) {
      console.error(error);
      toast({
        status: "error",
        title: "Votre abonnement n'a pas pu être modifié"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const switchProps = {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    my: 3
  };

  return (
    <form>
      <FormControl>
        <FormLabel fontWeight="normal" whiteSpace="normal">
          {isSelf ? (
            <>
              Recevoir un <b>{notifType === "email" ? "e-mail" : "mobile"}</b>{" "}
              lorsque :
            </>
          ) : (
            <>
              Cette personne a accepté de recevoir un{" "}
              <b>{notifType === "email" ? "e-mail" : "mobile"}</b> lorsque :
            </>
          )}
        </FormLabel>

        {org && org.orgUrl !== "forum" && (
          <>
            <Switch
              {...switchProps}
              isChecked={isAllEvents && !showEventCategories}
              isDisabled={isLoading}
              onChange={async (e) => {
                if (e.target.checked && showEventCategories) {
                  setShowEventCategories(false);
                }
                setIsAllEvents(e.target.checked);
              }}
            >
              {isSelf
                ? "vous êtes invité à un événement"
                : "vous l'invitez à un événement"}
            </Switch>

            <Switch
              {...switchProps}
              ml={3}
              isChecked={showEventCategories && !isAllEvents}
              onChange={(e) => {
                if (!e.target.checked) {
                  setEventCategories(setAllItems({ checked: false }));
                } else {
                  setIsAllEvents(false);
                }
                setShowEventCategories(!showEventCategories);
              }}
            >
              de la catégorie...
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
                        const cat = EventCategory[k];

                        return (
                          <Checkbox
                            key={k}
                            isChecked={eventCategories[k].checked}
                            onChange={(e) => {
                              if (!isOrgSubscription(followerSubscription))
                                return;

                              const wasSubscribedToEventCategory =
                                !!followerSubscription.eventCategories?.find(
                                  ({ catId }) => catId === k
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
          {...switchProps}
          isChecked={isAllTopics}
          isDisabled={isLoading}
          onChange={(e) => {
            setIsAllTopics(e.target.checked);
          }}
        >
          {isSelf
            ? "vous êtes invité à une discussion"
            : "vous l'invitez à une discussion"}
        </Switch>

        <Switch {...switchProps} ml={3} isDisabled>
          de la catégorie...
        </Switch>

        {Object.keys(topics).length > 0 && (
          <>
            <ArrowForwardIcon /> quelqu'un répond à la discussion...
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
                            (topicSubscription) =>
                              topicSubscription.topic._id === topicId &&
                              !!topicSubscription[`${notifType}Notif`]
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
      </FormControl>

      <Button
        colorScheme="green"
        isDisabled={isLoading}
        mt={3}
        onClick={() => onSubmit()}
      >
        Sauvegarder
      </Button>
    </form>
  );
};
