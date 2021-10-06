import { Icon, Tooltip } from "@chakra-ui/react";
import React from "react";
import { FaGlobeEurope } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import { Visibility } from "models/Event";

export const EventsListItemVisibility = ({
  eventVisibility
}: {
  eventVisibility?: string;
}) =>
  eventVisibility === Visibility.SUBSCRIBERS ? (
    <Tooltip label="Événement réservé aux adhérents">
      <span>
        <Icon as={IoMdPerson} boxSize={4} />
      </span>
    </Tooltip>
  ) : // : topicVisibility === Visibility.FOLLOWERS ? (
  //   <Tooltip label="Événement réservé aux abonnés">
  //     <EmailIcon boxSize={4} />
  //   </Tooltip>
  // )
  eventVisibility === Visibility.PUBLIC ? (
    <Tooltip label="Événement public">
      <span>
        <Icon as={FaGlobeEurope} boxSize={4} />
      </span>
    </Tooltip>
  ) : null;
