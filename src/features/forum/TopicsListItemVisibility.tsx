import { EmailIcon } from "@chakra-ui/icons";
import { Icon, Tooltip } from "@chakra-ui/react";
import React from "react";
import { FaGlobeEurope } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import { Visibility } from "models/Topic";

export const TopicsListItemVisibility = ({
  topicVisibility
}: {
  topicVisibility?: string;
}) =>
  topicVisibility === Visibility.SUBSCRIBERS ? (
    <Tooltip label="Discussion réservée aux adhérents">
      <span>
        <Icon as={IoMdPerson} boxSize={4} />
      </span>
    </Tooltip>
  ) : topicVisibility === Visibility.FOLLOWERS ? (
    <Tooltip label="Discussion réservée aux abonnés">
      <EmailIcon boxSize={4} />
    </Tooltip>
  ) : topicVisibility === Visibility.PUBLIC ? (
    <Tooltip label="Discussion publique">
      <span>
        <Icon as={FaGlobeEurope} boxSize={4} />
      </span>
    </Tooltip>
  ) : null;
