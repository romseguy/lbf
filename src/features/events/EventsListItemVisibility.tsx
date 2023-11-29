import { EmailIcon } from "@chakra-ui/icons";
import { IconButton, Tooltip } from "@chakra-ui/react";
import React from "react";
import { FaGlobeEurope } from "react-icons/fa";
import { EEventVisibility } from "models/Event";

export const EventsListItemVisibility = ({
  eventVisibility
}: {
  eventVisibility?: string;
}) => {
  let label = "Événement public";
  let icon = <FaGlobeEurope />;

  if (eventVisibility === EEventVisibility.FOLLOWERS) {
    label = "Événement réservé aux abonnés";
    icon = <EmailIcon />;
  }

  return (
    <>
      <Tooltip label={label}>
        <span>
          <IconButton
            aria-label={label}
            aria-hidden
            icon={icon}
            bg="transparent"
            _hover={{ background: "transparent", color: "green" }}
            minWidth={0}
          />
        </span>
      </Tooltip>
    </>
  );
};
