import { EmailIcon, HamburgerIcon, IconProps } from "@chakra-ui/icons";
import {
  ComponentWithAs,
  Flex,
  FlexProps,
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
}: FlexProps & {
  event?: IEvent;
  org?: IOrg;
  topicVisibility?: string[];
}) => {
  let icons: {
    label: string;
    icon: IconType | ComponentWithAs<"svg", IconProps>;
  }[] = [];

  const customLists = topicVisibility?.filter(
    (listName) => !["Adhérents", "Abonnés"].includes(listName)
  );

  const suffix = org
    ? `${orgTypeFull(org.orgType)} "${org.orgName}"`
    : event
    ? "de " + event.eventName
    : "";

  if (Array.isArray(customLists) && customLists.length > 0) {
    icons = [
      {
        label: `Discussion réservée aux membres ${
          customLists.length === 1
            ? `de la liste de diffusion "${customLists[0]}"`
            : `des listes de diffusion ${customLists.map((listName, index) =>
                index !== listName.length ? `"${listName}", ` : `"${listName}"`
              )}`
        }`,
        icon: HamburgerIcon
      }
    ];
  }

  if (topicVisibility?.includes("Adhérents")) {
    icons.push({
      label: `Discussion réservée aux adhérents ${suffix}`,
      icon: IoMdPerson
    });
  }

  if (topicVisibility?.includes("Abonnés")) {
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
    <Flex alignItems="center" {...props}>
      {icons.map(({ label, icon }, index) => (
        <Tooltip key={index} label={label}>
          <span>
            <Icon as={icon} boxSize={4} mr={1} />
          </span>
        </Tooltip>
      ))}
    </Flex>
  );
};
