import {
  ArrowBackIcon,
  ArrowForwardIcon,
  EditIcon,
  Icon,
  SettingsIcon
} from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Input,
  Text,
  TabPanel,
  TabPanels,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import { parseISO, format } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { css } from "twin.macro";
import {
  Column,
  DeleteButton,
  EmailPreview,
  EntityButton,
  EntityNotified,
  Heading,
  Link
} from "features/common";
import { EventNotifForm } from "features/forms/EventNotifForm";
import { TopicsList } from "features/forum/TopicsList";
import { Layout } from "features/layout";
import { SubscribePopover } from "features/subscriptions/SubscribePopover";
import { getRefId } from "models/Entity";
import { IEvent, EEventVisibility } from "models/Event";
import {
  EOrgSubscriptionType,
  getFollowerSubscription,
  IOrgSubscription,
  ISubscription
} from "models/Subscription";
import { PageProps } from "pages/_app";
import { AppQuery, AppQueryWithData } from "utils/types";
import {
  useDeleteEventMutation,
  useEditEventMutation
} from "features/api/eventsApi";
import { EventAttendingForm } from "./EventAttendingForm";
import { EventConfigPanel, EventConfigVisibility } from "./EventConfigPanel";
import { EventPageHomeTabPanel } from "./EventPageHomeTabPanel";
import { EventPageTabs } from "./EventPageTabs";

export const EventPage = ({
  email,
  eventQuery,
  subQuery,
  isMobile,
  session,
  tab,
  tabItem
}: PageProps & {
  eventQuery: AppQueryWithData<IEvent>;
  subQuery: AppQuery<ISubscription>;
  tab?: string;
  tabItem?: string;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const columnProps = {
    bg: isDark ? "gray.700" : "lightblue"
  };

  const [deleteEvent, deleteQuery] = useDeleteEventMutation();
  const router = useRouter();
  const toast = useToast({ position: "top" });

  //#region event
  const [editEvent, editEventMutation] = useEditEventMutation();
  const event = eventQuery.data;
  const eventCreatedByUserName =
    event.createdBy && typeof event.createdBy === "object"
      ? event.createdBy.userName || event.createdBy._id
      : "";
  const isCreator =
    session?.user.userId === getRefId(event) || session?.user.isAdmin || false;
  //#endregion

  //#region sub
  const isFollowed = !!getFollowerSubscription({ event, subQuery });
  //#endregion

  //#region local state
  const [isConfig, setIsConfig] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [isLogin, setIsLogin] = useState(0);

  const _isVisible = {
    banner: false,
    logo: false,
    topicCategories: false
  };
  const [isVisible, _setIsVisible] =
    useState<EventConfigVisibility["isVisible"]>(_isVisible);
  const toggleVisibility = (
    key?: keyof EventConfigVisibility["isVisible"],
    bool?: boolean
  ) =>
    _setIsVisible(
      !key
        ? _isVisible
        : Object.keys(isVisible).reduce((obj, objKey) => {
            if (objKey === key)
              return {
                ...obj,
                [objKey]: bool !== undefined ? bool : !isVisible[key]
              };

            return { ...obj, [objKey]: false };
          }, {})
    );

  const [showNotifForm, setShowNotifForm] = useState(false);

  let showAttendingForm = !isCreator;
  /*if (!isConfig && !isEdit) {
    if (session) {
      if (isSubscribedToAtLeastOneOrg) showAttendingForm = true;
    } else {
      if (event.eventVisibility === EEventVisibility.SUBSCRIBERS) {
        if (
          !!event.eventNotifications.find(
            (notified) => notified.email === email
          )
        )
          showAttendingForm = true;
      } else {
        showAttendingForm = true;
      }
    }
  }*/
  //#endregion

  return (
    <Layout
      event={event}
      isLogin={isLogin}
      isMobile={isMobile}
      session={session}
    >
      {isCreator && (
        <>
          {!isConfig && !isEdit && (
            <Flex mb={3}>
              <Button
                colorScheme="teal"
                leftIcon={<SettingsIcon boxSize={6} data-cy="eventSettings" />}
                mr={3}
                onClick={() => setIsConfig(true)}
              >
                Paramètres
              </Button>

              <Button
                colorScheme="teal"
                leftIcon={<Icon as={isEdit ? ArrowBackIcon : EditIcon} />}
                mr={3}
                onClick={() => {
                  setIsEdit(true);
                  toggleVisibility();
                }}
                data-cy="eventEdit"
              >
                Modifier
              </Button>

              <DeleteButton
                isDisabled={isDisabled}
                isLoading={deleteQuery.isLoading}
                label="Supprimer l'événement"
                header={
                  <>
                    Vous êtes sur le point de supprimer l'événement
                    <Text display="inline" color="red" fontWeight="bold">
                      {` ${event.eventName}`}
                    </Text>
                  </>
                }
                body={
                  <>
                    Saisissez le nom de l'événement pour confimer sa suppression
                    :
                    <Input
                      autoComplete="off"
                      onChange={(e) =>
                        setIsDisabled(e.target.value !== event.eventName)
                      }
                    />
                  </>
                }
                onClick={async () => {
                  try {
                    const deletedEvent = await deleteEvent({
                      eventId: event._id
                    }).unwrap();

                    if (deletedEvent) {
                      await router.push(`/`);
                      toast({
                        title: `L'événement ${deletedEvent.eventName} a été supprimé !`,
                        status: "success"
                      });
                    }
                  } catch (error: any) {
                    toast({
                      title: error.data ? error.data.message : error.message,
                      status: "error"
                    });
                  }
                }}
              />
            </Flex>
          )}

          {isEdit && (
            <Button
              colorScheme="teal"
              leftIcon={<ArrowBackIcon boxSize={6} />}
              onClick={() => setIsEdit(false)}
              mb={2}
            >
              Retour
            </Button>
          )}

          {!isEdit && isConfig && (
            <Button
              colorScheme="teal"
              leftIcon={<ArrowBackIcon boxSize={6} />}
              onClick={() => setIsConfig(false)}
              mb={2}
            >
              Revenir à l'événement
            </Button>
          )}
        </>
      )}

      {!isConfig && !isEdit && !subQuery.isLoading && (
        <Flex flexDirection="row" flexWrap="wrap" mt={-3}>
          {isFollowed && (
            <Box mr={3} mt={3}>
              <SubscribePopover
                event={event}
                query={eventQuery}
                subQuery={subQuery}
              />
            </Box>
          )}

          <Box mt={3}>
            <SubscribePopover
              event={event}
              query={eventQuery}
              subQuery={subQuery}
              notifType="push"
            />
          </Box>
        </Flex>
      )}

      <Box my={3}>
        <Text fontSize="smaller" pt={1}>
          Événement ajouté le{" "}
          {format(parseISO(event.createdAt!), "eeee d MMMM yyyy", {
            locale: fr
          })}{" "}
          par :{" "}
          <Link variant="underline" href={`/${eventCreatedByUserName}`}>
            {eventCreatedByUserName}
          </Link>{" "}
          {isCreator && "(Vous)"}
        </Text>
      </Box>

      {isCreator && !event.isApproved && (
        <Alert status="info" mb={3}>
          <AlertIcon />
          <Box>
            <Text>Votre événement est en attente de modération.</Text>
            <Text fontSize="smaller">
              Vous devez attendre son approbation avant de pouvoir envoyer un
              e-mail d'invitation à cet événement.
            </Text>
          </Box>
        </Alert>
      )}

      {showAttendingForm && (
        <EventAttendingForm email={email} eventQuery={eventQuery} />
      )}

      {!isConfig && !isEdit && (
        <EventPageTabs
          event={event}
          isCreator={isCreator}
          isMobile={isMobile}
          currentTabLabel={tab}
        >
          <TabPanels
            css={css`
              & > * {
                padding: 12px 0 !important;
              }
            `}
          >
            <TabPanel aria-hidden>
              <EventPageHomeTabPanel
                eventQuery={eventQuery}
                isCreator={isCreator}
                isMobile={isMobile}
                setIsEdit={setIsEdit}
              />
            </TabPanel>

            <TabPanel aria-hidden>
              <Heading mb={3}>Discussions</Heading>

              <Column {...columnProps}>
                <TopicsList
                  query={eventQuery}
                  isCreator={isCreator}
                  subQuery={subQuery}
                  isFollowed={isFollowed}
                  isLogin={isLogin}
                  setIsLogin={setIsLogin}
                  currentTopicName={tabItem}
                />
              </Column>
            </TabPanel>

            {session && isCreator && (
              <TabPanel aria-hidden>
                <Heading mb={3}>Invitations</Heading>

                <Column {...columnProps}>
                  {!showNotifForm && (
                    <Flex>
                      <Button
                        as="div"
                        colorScheme="teal"
                        cursor="pointer"
                        leftIcon={<ArrowForwardIcon />}
                        onClick={() => {
                          if (!event.isApproved)
                            alert(
                              "L'événement doit être vérifié par un modérateur avant de pouvoir envoyer des invitations."
                            );
                          else setShowNotifForm(!showNotifForm);
                        }}
                      >
                        Envoyer des invitations à{" "}
                        <EntityButton
                          event={event}
                          bg="whiteAlpha.500"
                          ml={2}
                          onClick={null}
                        />
                      </Button>
                    </Flex>
                  )}

                  {/* {showNotifForm && (
                    <Flex>
                      <Button
                        colorScheme="teal"
                        leftIcon={<ArrowBackIcon />}
                        onClick={() => setShowNotifForm(false)}
                      >
                        Revenir à la liste des invitations envoyées
                      </Button>
                    </Flex>
                  )} */}

                  {showNotifForm && (
                    <>
                      <Heading>Aperçu de l'e-mail d'invitation</Heading>
                      <EmailPreview
                        entity={event}
                        event={event}
                        session={session}
                        mt={5}
                      />

                      <EventNotifForm
                        event={event}
                        eventQuery={eventQuery}
                        session={session}
                        onCancel={() => setShowNotifForm(false)}
                        onSubmit={() => setShowNotifForm(false)}
                      />
                    </>
                  )}
                </Column>

                {!showNotifForm && (
                  <>
                    <Heading my={3}>
                      Historique des invitations envoyées
                    </Heading>
                    <Column {...columnProps}>
                      <EntityNotified entity={event} />
                    </Column>
                  </>
                )}
              </TabPanel>
            )}
          </TabPanels>
        </EventPageTabs>
      )}

      {session && isCreator && (isConfig || isEdit) && (
        <EventConfigPanel
          session={session}
          eventQuery={eventQuery}
          isEdit={isEdit}
          isVisible={isVisible}
          setIsConfig={setIsConfig}
          setIsEdit={setIsEdit}
          toggleVisibility={toggleVisibility}
        />
      )}
    </Layout>
  );
};
