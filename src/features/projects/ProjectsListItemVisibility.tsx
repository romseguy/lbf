import { EmailIcon, HamburgerIcon, IconProps } from "@chakra-ui/icons";
import {
  BoxProps,
  Tooltip,
  Icon,
  Box,
  ComponentWithAs
} from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";
import { GrWorkshop } from "react-icons/gr";
import { FaGlobeEurope } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import { IOrg, orgTypeFull } from "models/Org";
import { hasItems } from "utils/array";

export const ProjectsListItemVisibility = ({
  org,
  projectVisibility,
  ...props
}: BoxProps & {
  org?: IOrg;
  projectVisibility?: string[];
}) => {
  let icons: {
    label: string;
    icon: IconType | ComponentWithAs<"svg", IconProps>;
  }[] = [];

  const customLists = projectVisibility?.filter(
    (listName) => !["Abonnés"].includes(listName)
  );

  const suffix = org ? `${orgTypeFull(org.orgType)} "${org.orgName}"` : "";

  if (Array.isArray(customLists) && customLists.length > 0) {
    icons = [
      {
        label: `Projet réservé aux participants ${
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

  if (projectVisibility?.includes("Abonnés")) {
    icons.push({
      label: `Projet réservé aux abonnés ${suffix}`,
      icon: EmailIcon
    });
  }

  if (!hasItems(icons))
    icons = [
      {
        label: "Projet public",
        icon: GrWorkshop
      }
    ];

  return (
    <Box {...props}>
      {icons.map(({ label, icon }, index) => (
        <Tooltip key={index} label={label}>
          <span>
            <Icon as={icon} boxSize={4} />
          </span>
        </Tooltip>
      ))}
    </Box>
  );
};
