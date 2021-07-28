import type { Visibility } from "./OrgPage";
import type { IOrg } from "models/Org";
import React, { useState } from "react";
import { Box, Heading, IconButton, Grid, FormLabel } from "@chakra-ui/react";
import { useEditOrgMutation } from "features/orgs/orgsApi";
import { Button, GridHeader, GridItem, Textarea } from "features/common";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  DeleteIcon
} from "@chakra-ui/icons";
import tw, { css } from "twin.macro";

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
  const [editOrg, editOrgMutation] = useEditOrgMutation();
  const [isAdd, setIsAdd] = useState(false);
  const [emailList, setEmailList] = useState("");
  const hasSubscribers =
    Array.isArray(org.orgEmailList) && org.orgEmailList.length > 0;

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
              Abonné(e)s{" "}
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
              m={1}
              rightIcon={isAdd ? <ChevronDownIcon /> : <ChevronRightIcon />}
              onClick={(e) => {
                e.stopPropagation();
                setIsAdd(!isAdd);
                setIsVisible({ ...isVisible, subscribers: false });
              }}
              dark={{
                bg: "gray.500",
                _hover: { bg: "gray.400" }
              }}
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
            />
            <Button
              mt={3}
              onClick={async () => {
                const arr = org.orgEmailList?.concat(
                  emailList
                    .split(/(\s+)/)
                    .filter((e: string) => e.trim().length > 0)
                );
                await editOrg({
                  orgName: org.orgName,
                  payload: {
                    orgEmailList: arr?.filter((item, index) => {
                      if (arr?.indexOf(item) == index) return item;
                    })
                  }
                });
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
            {org.orgEmailList.map((email, index) => (
              // session ? (
              <Box key={`email-${index}`}>
                {email}{" "}
                <IconButton
                  aria-label="Désabonner"
                  height="auto"
                  bg="transparent"
                  _hover={{ bg: "transparent" }}
                  icon={<DeleteIcon />}
                  onClick={async () => {
                    await editOrg({
                      orgName: org.orgName,
                      payload: {
                        orgEmailList: org.orgEmailList?.filter((item) => {
                          return item !== email;
                        })
                      }
                    });
                    orgQuery.refetch();
                  }}
                />
              </Box>
            ))}
          </Box>
        </GridItem>
      )}
    </>
  );
};
