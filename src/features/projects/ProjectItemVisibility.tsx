import { EmailIcon } from "@chakra-ui/icons";
import { Tooltip, Icon } from "@chakra-ui/react";
import { Visibility } from "models/Topic";
import React from "react";
import { FaGlobeEurope } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";

export const ProjectItemVisibility = ({
  projectVisibility
}: {
  projectVisibility?: string;
}) =>
  projectVisibility === Visibility.SUBSCRIBERS ? (
    <Tooltip label="Projet réservé aux adhérents">
      <span>
        <Icon as={IoMdPerson} boxSize={4} />
      </span>
    </Tooltip>
  ) : projectVisibility === Visibility.FOLLOWERS ? (
    <Tooltip label="Projet réservé aux abonnés">
      <EmailIcon boxSize={4} />
    </Tooltip>
  ) : projectVisibility === Visibility.PUBLIC ? (
    <Tooltip label="Projet public">
      <span>
        <Icon as={FaGlobeEurope} boxSize={4} />
      </span>
    </Tooltip>
  ) : null;
