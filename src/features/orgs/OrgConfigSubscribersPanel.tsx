import type { IOrg } from "models/Org";
import type { Visibility } from "./OrgPage";
import tw, { css } from "twin.macro";
import React, { useState } from "react";
import { Box, Heading, IconButton, Grid, FormLabel } from "@chakra-ui/react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  DeleteIcon
} from "@chakra-ui/icons";
import { Button, GridHeader, GridItem, Textarea } from "features/common";
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
          (org) => org.type === SubscriptionTypes.SUB || SubscriptionTypes.BOTH
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
              Adhérents{" "}
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
              Ajouter
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
                          type: SubscriptionTypes.SUB
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
          <Box p={5}>
            {org.orgSubscriptions
              .filter((subscription) => {
                if (!subscription.orgs) return false;

                const orgSubscription = subscription.orgs.find(
                  (orgSubscription) => {
                    return orgSubscription.orgId === org._id;
                  }
                );

                if (!orgSubscription) return false;

                return (
                  orgSubscription.type === SubscriptionTypes.SUB ||
                  SubscriptionTypes.BOTH
                );
              })
              .map((subscription, index) => {
                return (
                  <Box key={`email-${index}`}>
                    {subscription.email || subscription.user?.email}
                    <IconButton
                      aria-label="Désinscrire"
                      height="auto"
                      bg="transparent"
                      _hover={{ bg: "transparent", color: "red" }}
                      icon={<DeleteIcon />}
                      onClick={async () => {
                        // TODO
                        orgQuery.refetch();
                      }}
                    />
                  </Box>
                );
              })}
          </Box>
        </GridItem>
      )}
    </>
  );
};
