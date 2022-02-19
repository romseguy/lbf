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
import { FaGlobeEurope } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import { EProjectVisibility } from "models/Project";
import { IOrg } from "models/Org";
import { hasItems } from "utils/array";

export const ProjectsListItemVisibility = ({
  org,
  projectVisibility,
  ...props
}: BoxProps & {
  org: IOrg;
  projectVisibility?: string[];
}) => {
  let icons: {
    label: string;
    icon: IconType | ComponentWithAs<"svg", IconProps>;
  }[] = [];

  const suffix = "de " + org.orgName;

  if (
    hasItems(
      projectVisibility?.filter(
        (listName) => !["Adhérents", "Abonnés"].includes(listName)
      )
    )
  ) {
    icons = [
      {
        label: `Projet réservé aux membres de listes ${suffix}`,
        icon: HamburgerIcon
      }
    ];
  }

  if (projectVisibility?.includes("Adhérents")) {
    icons.push({
      label: `Projet réservé aux adhérents ${suffix}`,
      icon: IoMdPerson
    });
  } else if (projectVisibility?.includes("Abonnés")) {
    icons.push({
      label: `Projet réservé aux abonnés ${suffix}`,
      icon: EmailIcon
    });
  }

  if (!hasItems(icons))
    icons = [
      {
        label: "Projet public",
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
