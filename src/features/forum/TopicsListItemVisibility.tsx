import { EmailIcon, HamburgerIcon, IconProps } from "@chakra-ui/icons";
import {
  ComponentWithAs,
  IconButton,
  IconButtonProps,
  Tooltip
} from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";
import { FaGlobeEurope } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import { isEvent } from "models/Entity";
import { IEvent } from "models/Event";
import { IOrg, orgTypeFull } from "models/Org";
import { ITopic } from "models/Topic";
import { hasItems } from "utils/array";
import { AppQueryWithData } from "utils/types";

export const TopicsListItemVisibility = ({
  query,
  topic,
  ...props
}: Partial<IconButtonProps> & {
  query: AppQueryWithData<IEvent | IOrg>;
  topic: ITopic;
}) => {
  const entity = query.data;
  const isE = isEvent(entity);

  let icons: {
    label: string;
    icon: IconType | ComponentWithAs<"svg", IconProps>;
  }[] = [];

  const customLists = topic.topicVisibility.filter(
    (listName) => !["Abonnés"].includes(listName)
  );

  const suffix = isE
    ? "de " + entity.eventName
    : `${orgTypeFull(entity.orgType)} "${entity.orgName}"`;

  if (Array.isArray(customLists) && customLists.length > 0) {
    icons = [
      {
        label: `Discussion réservée aux koalas ${
          customLists.length === 1
            ? `de la liste "${customLists[0]}"`
            : `des listes ${customLists.map(
                (listName, index) => ` "${listName}"`
              )}`
        }`,
        icon: HamburgerIcon
      }
    ];
  }

  if (topic.topicVisibility.includes("Abonnés")) {
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
    <>
      {icons.map(({ label, icon }, index) => (
        <Tooltip key={index} label={label}>
          <IconButton
            aria-label={label}
            icon={React.createElement(icon)}
            //boxSize={4}
            bg="transparent"
            _hover={{ bg: "transparent", color: "white" }}
            height="auto"
            minWidth={0}
            cursor="default"
            {...props}
          />
        </Tooltip>
      ))}
    </>
  );
};
