import { Box, Flex, IconButton, Tooltip } from "@chakra-ui/react";
import React from "react";
import { IEvent } from "models/Event";
import { AppQueryWithData } from "utils/types";
import { EventPageDescription } from "./EventPageDescription";
import { EventPageOrgs } from "./EventPageOrgs";
import { EventPageInfo } from "./EventPageInfo";
import { EventPageTimeline } from "./EventPageTimeline";
import {
  TabContainer,
  TabContainerContent,
  TabContainerHeader
} from "features/common";
import { EditIcon } from "@chakra-ui/icons";
import { hasItems } from "utils/array";

export const EventPageHomeTabPanel = ({
  eventQuery,
  isCreator,
  isMobile,
  setIsEdit
}: {
  eventQuery: AppQueryWithData<IEvent>;
  isCreator: boolean;
  isMobile: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const event = eventQuery.data;
  const hasInfo =
    hasItems(event.eventAddress) ||
    hasItems(event.eventEmail) ||
    hasItems(event.eventPhone) ||
    hasItems(event.eventWeb);

  const tabContainerProps = isMobile ? {} : {};

  const Small = () => {
    const tabContainerProps = isMobile
      ? {}
      : { width: "32%", bg: isMobile ? "" : "orange.100" };

    return (
      <Box
        display={isMobile ? "" : "flex"}
        justifyContent={isMobile ? "" : "space-between"}
      >
        <TabContainer {...tabContainerProps}>
          <TabContainerHeader heading="Organisateurs" />
          <TabContainerContent p={3}>
            <EventPageOrgs eventQuery={eventQuery} />
          </TabContainerContent>
        </TabContainer>

        <TabContainer {...tabContainerProps}>
          <TabContainerHeader heading="Coordonnées">
            {hasInfo && isCreator && (
              <Tooltip placement="bottom" label="Modifier les coordonnées">
                <IconButton
                  aria-label="Modifier les coordonnées"
                  icon={<EditIcon />}
                  bg="transparent"
                  _hover={{ color: "green" }}
                  onClick={() => setIsEdit(true)}
                />
              </Tooltip>
            )}
          </TabContainerHeader>
          <TabContainerContent p={3}>
            <EventPageInfo
              eventQuery={eventQuery}
              isCreator={isCreator}
              setIsEdit={setIsEdit}
            />
          </TabContainerContent>
        </TabContainer>

        <TabContainer {...tabContainerProps}>
          <TabContainerHeader heading="Quand ?" />
          <TabContainerContent p={3}>
            <EventPageTimeline eventQuery={eventQuery} />
          </TabContainerContent>
        </TabContainer>
      </Box>
    );
  };

  return (
    <>
      <Small />

      <TabContainer {...tabContainerProps} mb={0}>
        <TabContainerHeader heading="Présentation de l'événement">
          {event.eventDescription && isCreator && (
            <Tooltip placement="bottom" label="Modifier la présentation">
              <IconButton
                aria-label="Modifier la présentation"
                icon={<EditIcon />}
                bg="transparent"
                _hover={{ color: "green" }}
                onClick={() => setIsEdit(true)}
              />
            </Tooltip>
          )}
        </TabContainerHeader>
        <TabContainerContent p={3}>
          <EventPageDescription
            eventQuery={eventQuery}
            isCreator={isCreator}
            isMobile={isMobile}
            setIsEdit={setIsEdit}
          />
        </TabContainerContent>
      </TabContainer>
    </>
  );
};
