import { CalendarIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorMode,
  useDisclosure
} from "@chakra-ui/react";
import DOMPurify from "dompurify";
import React from "react";
import { EntityInfo, Link, Modal } from "features/common";
import { EventTimeline } from "features/events/EventTimeline";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { isMobile } from "react-device-detect";

export const EntityModal = ({
  event,
  org,
  ...props
}: {
  event?: IEvent<string | Date>;
  org?: IOrg;
  onClose: () => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  const entityDescription = event
    ? event.eventDescription
    : org?.orgDescription;
  const entityName = event ? event.eventName : org?.orgName;
  const entityUrl = event ? event.eventUrl : org?.orgUrl;

  if (!event && !org) return null;

  return (
    <Modal
      isOpen={isOpen}
      size={isMobile ? "full" : undefined}
      onClose={() => {
        props.onClose && props.onClose();
        onClose();
      }}
    >
      <ModalOverlay>
        <ModalContent maxWidth="xl">
          <ModalHeader px={3} pt={1} pb={0}>
            <Flex alignItems="center">
              <CalendarIcon mr={3} />
              <Link
                href={`/${entityUrl}`}
                size="larger"
                className="rainbow-text"
              >
                {entityName}
              </Link>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody px={3} pt={0}>
            <Flex flexDirection="row" flexWrap="wrap" mt={-3} mb={3}>
              <EntityInfo
                event={event}
                org={org}
                flexGrow={event ? 1 : undefined}
                mt={3}
              />
              {event && <EventTimeline event={event} mt={3} />}
            </Flex>

            <Box
              mt={4}
              border={isDark ? "1px solid white" : "1px solid black"}
              borderRadius="lg"
              p={3}
            >
              {entityDescription && entityDescription.length > 0 ? (
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
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
