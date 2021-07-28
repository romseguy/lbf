import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import parse from "html-react-parser";
import {
  Box,
  Spinner,
  Text,
  useToast,
  Flex,
  Heading,
  IconButton,
  Icon,
  Grid
} from "@chakra-ui/react";
import type { IEvent } from "models/Event";
import type { IUser } from "models/User";
import { Layout } from "features/layout";
import {
  useDeleteEventMutation,
  useGetEventByNameQuery
} from "features/events/eventsApi";
import { EventForm } from "features/forms/EventForm";
import { useSession } from "hooks/useAuth";
import { AddIcon, AtSignIcon, EditIcon, WarningIcon } from "@chakra-ui/icons";
import {
  Button,
  DeleteButton,
  GridHeader,
  GridItem,
  Link
} from "features/common";
import tw, { css } from "twin.macro";
import { IoIosPeople } from "react-icons/io";
import { TopicModal } from "features/modals/TopicModal";
import { TopicsList } from "features/forum/TopicsList";

export const Event = (props: {
  event: IEvent;
  user?: IUser;
  routeName: string;
}) => {
  const router = useRouter();

  const query = useGetEventByNameQuery(props.routeName);
  useEffect(() => {
    console.log("refetching event");

    query.refetch();
  }, [router.asPath]);
  const event = query.data || props.event;

  const [deleteEvent, { isLoading }] = useDeleteEventMutation();

  const { data: session, loading: isSessionLoading } = useSession();
  const toast = useToast({ position: "top" });

  const [isEdit, setIsEdit] = useState(false);
  const [isLogin, setIsLogin] = useState(0);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);

  const isCreator = session && event.createdBy._id === session.user.userId;

  return (
    <Layout pageTitle={event.eventName}>
      {isTopicModalOpen && event && (
        <TopicModal
          event={event}
          onCancel={() => setIsTopicModalOpen(false)}
          onSubmit={async (topicName) => {
            query.refetch();
            setIsTopicModalOpen(false);
          }}
          onClose={() => setIsTopicModalOpen(false)}
        />
      )}
      <Flex mb={5}>
        {/* <Tooltip
            placement="right"
            hasArrow
            label="Voir l'événement en tant que public"
          >
            <IconButton
              aria-label="Public"
              icon={<Icon as={ViewIcon} />}
              mr={3}
              onClick={() => setIsPublic(true)}
            />
          </Tooltip> */}

        {/* {!isPublic && event.createdBy.email === session?.user.email ? ( */}

        {event.createdBy._id === session?.user.userId && (
          <>
            <IconButton
              aria-label="Modifier"
              icon={<Icon as={EditIcon} />}
              mr={3}
              onClick={() => setIsEdit(!isEdit)}
              css={css`
                &:hover {
                  ${tw`bg-green-300`}
                }
                ${isEdit && tw`bg-green-300`}
              `}
              data-cy="eventEdit"
            />

            <DeleteButton
              isLoading={isLoading}
              body={
                <Box p={5} lineHeight={2}>
                  <WarningIcon color="red" /> Êtes vous certain(e) de vouloir
                  supprimer l'événement{" "}
                  <Text display="inline" color="red" fontWeight="bold">
                    {event.eventName}
                  </Text>{" "}
                  ?
                </Box>
              }
              onClick={async () => {
                try {
                  const deletedEvent = await deleteEvent(
                    event.eventName
                  ).unwrap();

                  if (deletedEvent) {
                    await Router.push(`/`);
                    toast({
                      title: `${deletedEvent.eventName} a bien été supprimé !`,
                      status: "success",
                      isClosable: true
                    });
                  }
                } catch (error) {
                  toast({
                    title: error.data ? error.data.message : error.message,
                    status: "error",
                    isClosable: true
                  });
                }
              }}
            />
          </>
        )}
      </Flex>

      {isEdit && (
        <EventForm
          event={event}
          onCancel={() => setIsEdit(false)}
          onSubmit={async (eventName) => {
            if (props.event && eventName !== props.event.eventName) {
              await router.push(`/${encodeURIComponent(eventName)}`);
            } else {
              query.refetch();
              setIsEdit(false);
            }
          }}
        />
      )}

      {!isEdit && (
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
          <GridItem>
            <Grid templateRows="auto 1fr">
              <GridHeader borderTopRadius="lg" alignItems="center">
                <Heading size="sm" py={3}>
                  Description
                </Heading>
              </GridHeader>

              <GridItem light={{ bg: "orange.100" }} dark={{ bg: "gray.500" }}>
                <Box className="ql-editor" p={5}>
                  {event.eventDescription &&
                  event.eventDescription.length > 0 ? (
                    parse(event.eventDescription)
                  ) : isCreator ? (
                    <Link onClick={() => setIsEdit(true)} variant="underline">
                      Cliquez ici pour ajouter la description.
                    </Link>
                  ) : (
                    <Text fontStyle="italic">Aucune description.</Text>
                  )}
                </Box>
              </GridItem>
            </Grid>
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

          {session && (
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
                      dark={{ bg: "gray.700", _hover: { bg: "gray.600" } }}
                    >
                      Ajouter un sujet de discussion
                    </Button>
                  </GridItem>
                </Grid>
              </GridHeader>

              <GridItem light={{ bg: "orange.100" }} dark={{ bg: "gray.500" }}>
                <TopicsList
                  event={event}
                  query={query}
                  onLoginClick={() => setIsLogin(isLogin + 1)}
                />
              </GridItem>
            </GridItem>
          )}
        </Grid>
      )}
    </Layout>
  );
};
