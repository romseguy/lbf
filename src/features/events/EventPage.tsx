import type { IEvent } from "models/Event";
import type { IUser } from "models/User";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DOMPurify from "isomorphic-dompurify";
import { css } from "twin.macro";
import {
  Box,
  Text,
  Flex,
  Heading,
  Icon,
  Grid,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import { ArrowBackIcon, AtSignIcon, SettingsIcon } from "@chakra-ui/icons";
import { IoIosPeople } from "react-icons/io";
import { parseISO, format } from "date-fns";
import { fr } from "date-fns/locale";
import { useSession } from "hooks/useAuth";
import {
  Button,
  GridHeader,
  GridItem,
  IconFooter,
  Link
} from "features/common";
import { useGetEventByNameQuery } from "features/events/eventsApi";
import { TopicsList } from "features/forum/TopicsList";
import { Layout } from "features/layout";
import { TopicModal } from "features/modals/TopicModal";
import { EventConfigPanel } from "./EventConfigPanel";

export type Visibility = {
  isVisible: {
    topics: boolean;
    banner: boolean;
  };
  setIsVisible: (obj: Visibility["isVisible"]) => void;
};

export const EventPage = (props: {
  event: IEvent;
  user?: IUser;
  routeName: string;
}) => {
  const router = useRouter();
  const { data: session, loading: isSessionLoading } = useSession();

  const eventQuery = useGetEventByNameQuery(props.routeName);
  useEffect(() => {
    console.log("refetching event");

    eventQuery.refetch();
  }, [router.asPath]);
  const event = eventQuery.data || props.event;
  const eventCreatedByUserName =
    typeof event.createdBy === "object" ? event.createdBy.userName : "";

  const isCreator = session && eventCreatedByUserName === session.user.userName;

  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(0);
  const [isConfig, setIsConfig] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isVisible, setIsVisible] = useState<Visibility["isVisible"]>({
    topics: false,
    banner: false
  });

  return (
    <Layout
      pageTitle={event.eventName}
      isLogin={isLogin}
      banner={event.eventBanner}
    >
      {isTopicModalOpen && event && (
        <TopicModal
          event={event}
          onCancel={() => setIsTopicModalOpen(false)}
          onSubmit={async (topicName) => {
            eventQuery.refetch();
            setIsTopicModalOpen(false);
          }}
          onClose={() => setIsTopicModalOpen(false)}
        />
      )}

      {isCreator && !isConfig ? (
        <Button
          aria-label="Paramètres"
          colorScheme="green"
          leftIcon={<SettingsIcon boxSize={6} data-cy="eventSettings" />}
          onClick={() => setIsConfig(true)}
          mb={2}
        >
          Paramètres de l'événement
        </Button>
      ) : isConfig && !isEdit ? (
        <Button
          leftIcon={<ArrowBackIcon boxSize={6} />}
          onClick={() => setIsConfig(false)}
          mb={2}
        >
          Retour
        </Button>
      ) : null}

      <Box mb={3}>
        <Text fontSize="smaller" pt={1}>
          Événement ajouté le{" "}
          {format(parseISO(event.createdAt!), "eeee d MMMM yyyy", {
            locale: fr
          })}{" "}
          par :{" "}
          <Link
            variant="underline"
            href={`/${encodeURIComponent(eventCreatedByUserName)}`}
          >
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
              e-mail d'invitation aux adhérents des organisateurs.
            </Text>
          </Box>
        </Alert>
      )}

      {!isConfig && (
        <>
          <Grid
            templateRows="auto 1fr"
            // templateColumns="minmax(425px, 1fr) minmax(200px, 1fr) minmax(200px, 1fr)"
            gridGap={5}
            css={css`
              & {
                grid-template-columns: minmax(425px, 1fr) minmax(170px, 1fr);
              }
              @media (max-width: 650px) {
                & {
                  grid-template-columns: 1fr !important;
                }
              }
            `}
          >
            <GridItem
              rowSpan={2}
              borderTopRadius="lg"
              light={{ bg: "orange.100" }}
              dark={{ bg: "gray.500" }}
            >
              <GridHeader borderTopRadius="lg" alignItems="center">
                <Heading size="sm" py={3}>
                  Description
                </Heading>
              </GridHeader>

              <GridItem>
                <Box className="ql-editor" p={5}>
                  {event.eventDescription &&
                  event.eventDescription.length > 0 ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(event.eventDescription)
                      }}
                    />
                  ) : isCreator ? (
                    <Link
                      onClick={() => {
                        setIsConfig(true);
                        setIsEdit(true);
                      }}
                      variant="underline"
                    >
                      Cliquez ici pour ajouter la description.
                    </Link>
                  ) : (
                    <Text fontStyle="italic">Aucune description.</Text>
                  )}
                </Box>
              </GridItem>
            </GridItem>

            <GridItem>
              <Grid templateRows="auto 1fr">
                <GridHeader borderTopRadius="lg" alignItems="center">
                  <Heading size="sm" py={3}>
                    Adresse
                  </Heading>
                </GridHeader>

                <GridItem
                  light={{ bg: "orange.100" }}
                  dark={{ bg: "gray.500" }}
                >
                  <Box p={5}>
                    {event.eventAddress || (
                      <Text fontStyle="italic">Aucune adresse.</Text>
                    )}
                  </Box>
                </GridItem>
              </Grid>
            </GridItem>

            <GridItem>
              <Grid templateRows="auto 1fr">
                <GridHeader borderTopRadius="lg" alignItems="center">
                  <Heading size="sm" py={3}>
                    Organisé par
                  </Heading>
                </GridHeader>

                <GridItem
                  light={{ bg: "orange.100" }}
                  dark={{ bg: "gray.500" }}
                >
                  <Box p={5}>
                    {Array.isArray(event.eventOrgs) &&
                    event.eventOrgs.length > 0 ? (
                      event.eventOrgs.map((eventOrg, index) => (
                        <Flex key={eventOrg._id} mb={2} alignItems="center">
                          <Icon as={IoIosPeople} mr={2} />
                          <Link
                            data-cy={`eventCreatedBy-${eventOrg.orgName}`}
                            variant="underline"
                            href={`/${encodeURIComponent(eventOrg.orgName)}`}
                          >
                            {`${eventOrg.orgName}`}
                            {/* {`${eventOrg.orgName}${
                            index < event.eventOrgs!.length - 1 ? ", " : ""
                          }`} */}
                          </Link>
                        </Flex>
                      ))
                    ) : (
                      <Box>
                        <Icon as={AtSignIcon} mr={2} />
                        <Link
                          variant="underline"
                          href={`/${encodeURIComponent(
                            eventCreatedByUserName
                          )}`}
                        >
                          {eventCreatedByUserName}
                        </Link>
                      </Box>
                    )}
                  </Box>
                </GridItem>
              </Grid>
            </GridItem>

            <GridItem colSpan={2}>
              <Grid templateRows="auto 1fr">
                <GridHeader borderTopRadius="lg" alignItems="center">
                  <Heading size="sm" py={3}>
                    Discussions
                  </Heading>
                </GridHeader>

                <GridItem
                  light={{ bg: "orange.100" }}
                  dark={{ bg: "gray.500" }}
                >
                  <Box p={5}>
                    <TopicsList
                      event={event}
                      query={eventQuery}
                      isLogin={isLogin}
                      setIsLogin={setIsLogin}
                    />
                  </Box>
                </GridItem>
              </Grid>
            </GridItem>
          </Grid>
          <IconFooter />
        </>
      )}

      {session && isConfig && (
        <EventConfigPanel
          session={session}
          event={event}
          eventQuery={eventQuery}
          isConfig={isConfig}
          isEdit={isEdit}
          isVisible={isVisible}
          setIsConfig={setIsConfig}
          setIsEdit={setIsEdit}
          setIsVisible={setIsVisible}
        />
      )}
    </Layout>
  );
};
