import { EmailIcon, HamburgerIcon, IconProps } from "@chakra-ui/icons";
import {
  ComponentWithAs,
  Box,
  BoxProps,
  Icon,
  Tooltip
} from "@chakra-ui/react";
import { IEvent } from "models/Event";
import { IOrg, orgTypeFull } from "models/Org";
import React from "react";
import { IconType } from "react-icons";
import { FaGlobeEurope } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import { hasItems } from "utils/array";

export const TopicsListItemVisibility = ({
  event,
  org,
  topicVisibility,
  ...props
}: BoxProps & {
  event?: IEvent;
  org?: IOrg;
  topicVisibility?: string[];
}) => {
  let icons: {
    label: string;
    icon: IconType | ComponentWithAs<"svg", IconProps>;
  }[] = [];

  const suffix = org
    ? "de " + org.orgName
    : event
    ? "de " + event.eventName
    : "";

  if (
    hasItems(
      topicVisibility?.filter(
        (listName) => !["Adhérents", "Abonnés"].includes(listName)
      )
    )
  ) {
    icons = [
      {
        label: `Discussion réservée aux membres de listes de diffusions ${suffix}`,
        icon: HamburgerIcon
      }
    ];
  }

  if (topicVisibility?.includes("Adhérents")) {
    icons.push({
      label: `Discussion réservée aux adhérents ${suffix}`,
      icon: IoMdPerson
    });
  } else if (topicVisibility?.includes("Abonnés")) {
    icons.push({
      label: `Discussion réservée aux abonnés ${suffix}`,
      icon: EmailIcon
    });
  }

  if (!hasItems(icons))
    icons = [
      {
        label: "Discussion publique",
        icon: FaGlobeEurope
      }
    ];

  return (
    <Box {...props}>
      {icons.map(({ label, icon }, index) => (
        <Tooltip key={index} label={label}>
          <span>
            <Icon as={icon} boxSize={4} mr={1} />
          </span>
        </Tooltip>
      ))}
    </Box>
  );
};
