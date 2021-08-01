import type { IOrg } from "models/Org";
import type { Visibility } from "./OrgPage";
import tw, { css } from "twin.macro";
import React, { useState } from "react";
import {
  Box,
  Heading,
  IconButton,
  Grid,
  FormLabel,
  Tag,
  TagLeftIcon,
  TagLabel,
  Wrap,
  WrapItem,
  Tooltip,
  Table,
  Tr,
  Td
} from "@chakra-ui/react";
import {
  AddIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DeleteIcon
} from "@chakra-ui/icons";
import { Button, GridHeader, GridItem, Link, Textarea } from "features/common";
import { emailR } from "utils/email";
import { useAddSubscriptionMutation } from "features/subscriptions/subscriptionsApi";
import { useSession } from "hooks/useAuth";
import { SubscriptionTypes } from "models/Subscription";

type OrgConfigSubscribersPanelProps = Visibility & {
  org: IOrg;
  orgQuery: any;
};

export const OrgConfigSubscribersPanel = ({
  org,
  orgQuery,
  isVisible,
  setIsVisible
}: OrgConfigSubscribersPanelProps) => {
  const { data: session } = useSession();
  const [addSubscription, addSubscriptionMutation] =
    useAddSubscriptionMutation();
  const [isAdd, setIsAdd] = useState(false);
  const [emailList, setEmailList] = useState("");
  const hasSubscribers =
    Array.isArray(org.orgSubscriptions) &&
    org.orgSubscriptions.find(
      (orgSubscription) =>
        Array.isArray(orgSubscription.orgs) &&
        orgSubscription.orgs.find(
          (org) =>
            org.type === SubscriptionTypes.SUBSCRIBER || SubscriptionTypes.BOTH
        )
    );

  return (
    <>
      <GridHeader
        borderTopRadius="lg"
        cursor={hasSubscribers ? "pointer" : "default"}
        onClick={() => {
          if (!hasSubscribers) return;
          setIsAdd(false);
          setIsVisible({
            ...isVisible,
            subscribers: !isVisible.subscribers,
            banner: false
          });
        }}
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
            <Heading size="sm">
              Adhérents & Abonnés{" "}
              {hasSubscribers && (
                <>
                  {isVisible.subscribers ? (
                    <ChevronDownIcon />
                  ) : (
                    <ChevronRightIcon />
                  )}
                </>
              )}
            </Heading>
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
                setIsAdd(!isAdd);
                setIsVisible({ ...isVisible, subscribers: false });
              }}
              m={1}
              // dark={{
              //   bg: "gray.500",
              //   _hover: { bg: "gray.400" }
              // }}
            >
              Ajouter des adhérents
            </Button>
          </GridItem>
        </Grid>
      </GridHeader>

      {isAdd && (
        <GridItem light={{ bg: "orange.50" }} dark={{ bg: "gray.700" }}>
          <Box p={5}>
            <FormLabel htmlFor="emailList">
              Entrez les adresses e-mail séparées par un espace :
            </FormLabel>
            <Textarea
              id="emailList"
              dark={{ _hover: { borderColor: "white" } }}
              onChange={(e) => setEmailList(e.target.value)}
              value={emailList}
            />
            <Button
              mt={3}
              isLoading={addSubscriptionMutation.isLoading}
              onClick={async () => {
                const emailArray = emailList
                  .split(/(\s+)/)
                  .filter((e: string) => e.trim().length > 0)
                  .filter((email) => emailR.test(email));

                if (!emailArray.length) {
                  setEmailList("");
                  return;
                }

                const promises = emailArray.map((email) => {
                  return addSubscription({
                    payload: {
                      orgs: [
                        {
                          orgId: org._id,
                          org,
                          type: SubscriptionTypes.SUBSCRIBER
                        }
                      ]
                    },
                    email
                  });
                });

                await Promise.all(promises);

                setEmailList("");
                setIsVisible({ ...isVisible, subscribers: true });
                setIsAdd(false);
                orgQuery.refetch();
              }}
            >
              Ajouter
            </Button>
          </Box>
        </GridItem>
      )}

      {isVisible.subscribers && hasSubscribers && (
        <GridItem light={{ bg: "orange.100" }} dark={{ bg: "gray.500" }}>
          <Table>
            {org.orgSubscriptions
              .filter(({ orgs }) => {
                if (!orgs) return false;

                const orgSubscription = orgs.find(({ orgId }) => {
                  return orgId === org._id;
                });

                if (!orgSubscription) return false;

                return (
                  orgSubscription.type === SubscriptionTypes.SUBSCRIBER ||
                  SubscriptionTypes.BOTH
                );
              })
              .map(({ email, user, orgs }, index) => {
                const orgSubscription = orgs?.find(({ orgId }) => {
                  return orgId === org._id;
                });

                const isFollower =
                  orgSubscription!.type === SubscriptionTypes.FOLLOWER ||
                  orgSubscription!.type === SubscriptionTypes.BOTH;
                const isSub =
                  orgSubscription!.type === SubscriptionTypes.SUBSCRIBER ||
                  orgSubscription!.type === SubscriptionTypes.BOTH;

                return (
                  <Tr key={`email-${index}`}>
                    <Td>
                      <Tooltip
                        placement="top"
                        hasArrow
                        label={`${
                          isFollower ? "Retirer de" : "Ajouter à"
                        } la liste des abonnés`}
                      >
                        <Tag
                          variant={isFollower ? "solid" : "outline"}
                          colorScheme="green"
                          mr={3}
                          cursor="pointer"
                          _hover={{ textDecoration: "underline" }}
                        >
                          <TagLabel>Abonné</TagLabel>
                        </Tag>
                      </Tooltip>
                      <Tooltip
                        placement="top"
                        hasArrow
                        label={`${
                          isSub ? "Retirer de" : "Ajouter à"
                        } la liste des adhérents`}
                      >
                        <Tag
                          variant={isSub ? "solid" : "outline"}
                          colorScheme="purple"
                          mr={3}
                          cursor="pointer"
                          _hover={{ textDecoration: "underline" }}
                        >
                          <TagLabel>Adhérent</TagLabel>
                        </Tag>
                      </Tooltip>
                    </Td>

                    <Td>
                      {email || (
                        <Link
                          href={`/${
                            user?.userName && encodeURIComponent(user.userName)
                          }`}
                          variant="underline"
                        >
                          {user?.email}
                        </Link>
                      )}
                    </Td>

                    <Td textAlign="right">
                      {!user && (
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
                          height="auto"
                          onClick={async () => {
                            // TODO
                            orgQuery.refetch();
                          }}
                        />
                      </Tooltip>
                    </Td>
                  </Tr>
                );
              })}
          </Table>
        </GridItem>
      )}
    </>
  );
};
