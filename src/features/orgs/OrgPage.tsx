import type { IOrg } from "models/Org";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import parse from "html-react-parser";
import {
  Box,
  Text,
  Heading,
  useColorModeValue,
  Grid,
  Flex,
  Tooltip
} from "@chakra-ui/react";
import { useSession } from "hooks/useAuth";
import { Layout } from "features/layout";
import { useGetOrgByNameQuery } from "features/orgs/orgsApi";
import { OrgForm } from "features/forms/OrgForm";
import { Button, GridHeader, GridItem, Link } from "features/common";
import { AddIcon, SettingsIcon } from "@chakra-ui/icons";
import tw, { css } from "twin.macro";
import { format, parseISO } from "date-fns";
import { EventModal } from "features/modals/EventModal";
import { fr } from "date-fns/locale";
import { TopicsList } from "features/forum/TopicsList";
import { EventsList } from "features/events/EventsList";
import { TopicModal } from "features/modals/TopicModal";
import { OrgConfigPanel } from "./OrgConfigPanel";

export type Visibility = {
  isVisible: {
    banner: boolean;
    subscribers: boolean;
    topics: boolean;
  };
  setIsVisible: (obj: Visibility["isVisible"]) => void;
};

export const Org = ({
  routeName,
  ...props
}: {
  org: IOrg;
  routeName: string;
}) => {
  const router = useRouter();
  const orgQuery = useGetOrgByNameQuery(routeName);
  useEffect(() => {
    console.log("refetching org");
    orgQuery.refetch();
    setIsEdit(false);
  }, [router.asPath]);
  const org = orgQuery.data || props.org;
  const { data: session, loading: isSessionLoading } = useSession();
  const isCreator = session && org.createdBy._id === session.user.userId;

  const eventBg = useColorModeValue("blue.100", "blue.800");

  const [isEdit, setIsEdit] = useState(false);
  const [isLogin, setIsLogin] = useState(0);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState<Visibility["isVisible"]>({
    topics: false,
    banner: false,
    subscribers: false
  });
  const [isConfig, setIsConfig] = useState(false);

  const eventHeader = (
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
        <Heading size="sm">Événements</Heading>
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
        {session && (
          <Button
            leftIcon={<AddIcon />}
            onClick={() => {
              setIsEventModalOpen(true);
            }}
            m={1}
            dark={{ bg: "gray.700", _hover: { bg: "gray.600" } }}
          >
            Ajouter un événement
          </Button>
        )}
      </GridItem>
    </Grid>
  );

  return (
    <Layout pageTitle={org.orgName} isLogin={isLogin} banner={org.orgBanner}>
      {isEventModalOpen && (
        <EventModal
          initialEventOrgs={[org]}
          onCancel={() => setIsEventModalOpen(false)}
          onSubmit={async (eventName) => {
            await router.push(`/${encodeURIComponent(eventName)}`);
          }}
          onClose={() => {
            setIsEventModalOpen(false);
          }}
        />
      )}

      {isTopicModalOpen && org && (
        <TopicModal
          org={org}
          onCancel={() => setIsTopicModalOpen(false)}
          onSubmit={async (topicName) => {
            orgQuery.refetch();
            setIsTopicModalOpen(false);
          }}
          onClose={() => setIsTopicModalOpen(false)}
        />
      )}

      <Flex>
        {isCreator && (
          <Tooltip
            placement="top"
            label="Paramètres de l'organisation"
            hasArrow
          >
            <SettingsIcon
              mr={3}
              boxSize={6}
              cursor="pointer"
              color={isConfig ? "green" : undefined}
              _hover={{ color: "green" }}
              onClick={() => setIsConfig(!isConfig)}
              data-cy="orgSettings"
            />
          </Tooltip>
        )}

        <Box>
          <Text fontSize="smaller" mb={3} pt={1}>
            Organisation ajoutée le{" "}
            {format(parseISO(org.createdAt!), "eeee d MMMM yyyy", {
              locale: fr
            })}{" "}
            par :{" "}
            <Link
              variant="underline"
              href={`/${encodeURIComponent(org.createdBy.userName)}`}
            >
              {org.createdBy.userName}
            </Link>{" "}
            {session && isCreator && "(Vous)"}
          </Text>
        </Box>
      </Flex>

      {!isConfig && (
        <Grid
          templateColumns={`${
            // session ? "minmax(325px, 1fr) minmax(325px, 1fr)" : "1fr"
            "1fr"
          }`}
          gridGap={5}
          css={css`
            @media (max-width: 730px) {
              & {
                grid-template-columns: 1fr;
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
                <Box p={5}>
                  {org.orgDescription ? (
                    parse(org.orgDescription)
                  ) : isCreator ? (
                    <Link
                      onClick={() => {
                        setIsEdit(true);
                        setIsConfig(true);
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
            </Grid>
          </GridItem>

          {session && (
            <GridItem
              css={css`
                @media (max-width: 730px) {
                  & {
                    grid-column: 1;
                  }
                }
              `}
            >
              <GridHeader
                borderTopRadius="lg"
                alignItems="center"
                onClick={() => {}}
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
                  org={org}
                  query={orgQuery}
                  onLoginClick={() => setIsLogin(isLogin + 1)}
                />
              </GridItem>
            </GridItem>
          )}

          <GridItem
            css={css`
              @media (max-width: 730px) {
                & {
                  grid-column: 1;
                }
              }
            `}
          >
            {Array.isArray(org.orgEvents) && org.orgEvents.length > 0 ? (
              <EventsList
                eventHeader={eventHeader}
                events={org.orgEvents}
                eventBg={eventBg}
              />
            ) : (
              <GridHeader borderTopRadius="lg" alignItems="center" mb={3}>
                {session ? eventHeader : null}
              </GridHeader>
            )}
          </GridItem>
        </Grid>
      )}

      {isConfig && (
        <OrgConfigPanel
          org={org}
          orgQuery={orgQuery}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
        />
      )}
    </Layout>
  );
};
