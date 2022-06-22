import { ChatIcon, SunIcon } from "@chakra-ui/icons";
import { Flex, Icon, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import {
  FaGlobeEurope,
  FaRegCalendarCheck,
  FaRegCalendarTimes,
  FaTree
} from "react-icons/fa";
import { Link, Heading, LinkShare } from "features/common";
import {
  IEntity,
  IEntityBanner,
  IEntityLogo,
  isEvent,
  isOrg,
  isUser
} from "models/Entity";
import { EOrgType, IOrg, orgTypeFull } from "models/Org";
import { AppIcon } from "utils/types";

export const HeaderTitle = ({
  entity,
  pageTitle
}: {
  entity?: IEntity;
  pageTitle?: string;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const isE = isEvent(entity);
  const isO = isOrg(entity);
  const isU = isUser(entity);

  let banner: IEntityBanner | undefined;
  let logo: IEntityLogo | undefined;
  let name: string | undefined;
  let url: string | undefined;

  if (isE) {
    banner = entity.eventBanner;
    logo = entity.eventLogo;
    name = entity.eventName;
    url = entity.eventUrl;
  } else if (isO) {
    banner = entity.orgBanner;
    logo = entity.orgLogo;
    name = entity.orgName;
    url = entity.orgUrl;
  } else if (isU) {
    name = entity.userName;
    url = entity.userName;
  }

  let icon: AppIcon | undefined = pageTitle === "Forum" ? ChatIcon : undefined;
  let iconColor = banner ? "white" : isDark ? "green.200" : "green";

  if (isE) {
    icon = entity.isApproved ? FaRegCalendarCheck : FaRegCalendarTimes;
    iconColor = entity.isApproved ? "green" : "red";
  } else if (isO) {
    const org = entity as IOrg;
    icon = org.orgType === EOrgType.NETWORK ? FaGlobeEurope : FaTree;
  } else if (isU) {
    icon = SunIcon;
  }

  return (
    <Flex
      alignItems="center"
      bg={banner ? "black" : isDark ? "whiteAlpha.400" : "blackAlpha.200"}
      borderRadius="lg"
      pb={4}
      pl={4}
      pr={4}
      pt={icon ? 0 : 2}
      ml={logo ? 5 : undefined}
    >
      {icon && (
        <Icon
          as={icon}
          boxSize={8}
          color={iconColor}
          mt={3}
          mr={2}
          title={
            isE && !entity.isApproved
              ? "Événement en attente de modération"
              : undefined
          }
        />
      )}

      <Link href={router.asPath} variant="no-underline">
        <Heading pr={1}>{name || pageTitle}</Heading>
      </Link>

      {entity && (
        <LinkShare
          variant="outline"
          colorScheme="blue"
          label={`Copier l'adresse ${
            isE ? "de l'événement" : orgTypeFull((entity as IOrg).orgType)
          }`}
          url={`${process.env.NEXT_PUBLIC_URL}/${url}`}
          mt={3}
          ml={2}
        />
      )}
    </Flex>
  );
};
