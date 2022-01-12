import { CalendarIcon } from "@chakra-ui/icons";
import { Box, Flex, Text, useColorMode } from "@chakra-ui/react";
import DOMPurify from "dompurify";
import React from "react";
import { EntityInfo, Link } from "features/common";
import { EventTimeline } from "features/events/EventTimeline";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { isEvent } from "utils/models";
import { AppModal } from "./AppModal";

export const EntityModal = ({
  entity,
  onClose
}: {
  entity: IEvent<string | Date> | IOrg;
  onClose: () => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isE = isEvent(entity);
  const entityDescription = isE
    ? entity.eventDescription
    : entity.orgDescription;
  const entityName = isE ? entity.eventName : entity.orgName;
  const entityUrl = isE ? entity.eventUrl : entity.orgUrl;

  return (
    <AppModal
      header={
        <Flex alignItems="center">
          <CalendarIcon mr={3} />
          <Link href={`/${entityUrl}`} size="larger" className="rainbow-text">
            {entityName}
          </Link>
        </Flex>
      }
      onClose={onClose}
    >
      <>
        <Flex flexDirection="row" flexWrap="wrap" mt={-3} mb={3}>
          <EntityInfo entity={entity} flexGrow={isE ? 1 : undefined} mt={3} />
          {isE && <EventTimeline event={entity} mt={3} />}
        </Flex>

        <Box
          mt={4}
          border={isDark ? "1px solid white" : "1px solid black"}
          borderRadius="lg"
          p={3}
        >
          {entityDescription &&
          entityDescription.length > 0 &&
          entityDescription !== "<p><br></p>" ? (
            <div className="rteditor">
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(entityDescription)
                }}
              />
            </div>
          ) : (
            <Text fontStyle="italic">Aucune description.</Text>
          )}
        </Box>
      </>
    </AppModal>
  );
};
