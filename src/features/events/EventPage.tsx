import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import parse from "html-react-parser";
import {
  Box,
  Text,
  useToast,
  Flex,
  Heading,
  Icon,
  Grid,
  Tooltip,
  IconButton,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import type { IEvent } from "models/Event";
import type { IUser } from "models/User";
import { Layout } from "features/layout";
import {
  useDeleteEventMutation,
  useGetEventByNameQuery
} from "features/events/eventsApi";
import { useSession } from "hooks/useAuth";
import {
  AddIcon,
  AtSignIcon,
  ChevronLeftIcon,
  SettingsIcon,
  WarningIcon
} from "@chakra-ui/icons";
import { Button, GridHeader, GridItem, Link } from "features/common";
import tw, { css } from "twin.macro";
import { IoIosPeople } from "react-icons/io";
import { TopicModal } from "features/modals/TopicModal";
import { TopicsList } from "features/forum/TopicsList";
import { parseISO, format } from "date-fns";
import { fr } from "date-fns/locale";
import { EventConfigPanel } from "./EventConfigPanel";

export type Visibility = {
  isVisible: {
    topics: boolean;
    banner: boolean;
  };
  setIsVisible: (obj: Visibility["isVisible"]) => void;
};

export const Event = (props: {
  event: IEvent;
  user?: IUser;
  routeName: string;
}) => {
  const router = useRouter();
  const { data: session, loading: isSessionLoading } = useSession();

  const [deleteEvent, { isLoading }] = useDeleteEventMutation();
  const eventQuery = useGetEventByNameQuery(props.routeName);
  useEffect(() => {
    console.log("refetching event");

    eventQuery.refetch();
  }, [router.asPath]);
  const event = eventQuery.data || props.event;

  const isCreator = session && event.createdBy._id === session.user.userId;

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
      ) : isConfig ? (
        <IconButton
          aria-label="Précédent"
          icon={<ChevronLeftIcon boxSize={6} />}
          onClick={() => setIsConfig(false)}
          mb={2}
        />
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
            href={`/${encodeURIComponent(event.createdBy.userName)}`}
          >
            @{event.createdBy.userName}
          </Link>{" "}
          {isCreator && "(Vous)"}
        </Text>
      </Box>

      {isCreator && !event.isApproved && (
        <Box mb={3}>
          <Alert status="warning">
            <AlertIcon />
            Votre événement est en attente de modération. Vous devez attendre
            son approbation avant de pouvoir envoyer un e-mail d'invitation aux
            adhérents des organisateurs.
          </Alert>
        </Box>
      )}

      {!isConfig && (
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
                {event.eventDescription && event.eventDescription.length > 0 ? (
                  parse(event.eventDescription)
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

              <GridItem light={{ bg: "orange.100" }} dark={{ bg: "gray.500" }}>
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

              <GridItem light={{ bg: "orange.100" }} dark={{ bg: "gray.500" }}>
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
                          event.createdBy.userName
                        )}`}
                      >
                        {event.createdBy.userName}
                      </Link>
                    </Box>
                  )}
                </Box>
              </GridItem>
            </Grid>
          </GridItem>

          <GridItem
            colSpan={2}
            css={css`
              @media (max-width: 730px) {
                & {
                  grid-column: 1;
                }
              }
            `}
          >
            <GridHeader borderTopRadius="lg" alignItems="center">
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
                  <Heading size="sm">Discussions</Heading>
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
                    colorScheme="teal"
                    leftIcon={<AddIcon />}
                    onClick={() => {
                      if (!isSessionLoading) {
                        if (session) {
                          setIsTopicModalOpen(true);
                        } else {
                          setIsLogin(isLogin + 1);
                        }
                      }
                    }}
                    m={1}
                  >
                    Ajouter un sujet de discussion
                  </Button>
                </GridItem>
              </Grid>
            </GridHeader>

            <GridItem light={{ bg: "orange.100" }} dark={{ bg: "gray.500" }}>
              <TopicsList
                event={event}
                query={eventQuery}
                onLoginClick={() => setIsLogin(isLogin + 1)}
              />
            </GridItem>
          </GridItem>
        </Grid>
      )}

      {isConfig && (
        <EventConfigPanel
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
