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
import { EntityButton, Link, Heading, LinkShare } from "features/common";
import { useSession } from "hooks/useSession";
import {
  IEntity,
  IEntityBanner,
  IEntityLogo,
  isEvent,
  isOrg,
  isUser
} from "models/Entity";
import { EOrgType, getNetworks, IOrg, orgTypeFull } from "models/Org";
import { AppIcon } from "utils/types";
import { capitalize } from "utils/string";

export const HeaderTitle = ({
  entity,
  pageHeader,
  pageTitle
}: {
  entity?: IEntity;
  pageHeader?: React.ReactNode;
  pageTitle?: string;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const { data: session } = useSession();
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
    const org = entity as IOrg;
    banner = org.orgBanner;
    logo = org.orgLogo;
    name = org.orgName;
    url = org.orgUrl;
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
    iconColor = org.orgType === EOrgType.NETWORK ? "blue" : "green";
  } else if (isU) {
    icon = SunIcon;
  }

  const title = (
    <Flex alignItems="center" pt={3}>
      {icon && (
        <Icon
          as={icon}
          boxSize={8}
          color={iconColor}
          //mt={3}
          mr={2}
          title={
            isE && !entity.isApproved
              ? "Événement en attente de modération"
              : undefined
          }
        />
      )}

      <Link href={router.asPath} variant="no-underline">
        {pageHeader ? (
          pageHeader
        ) : (
          <Heading pr={1}>{name || pageTitle || ""}</Heading>
        )}
      </Link>

      {entity && (
        <LinkShare
          url={`${process.env.NEXT_PUBLIC_URL}/${url}`}
          colorScheme="blue"
          label={`Copier l'adresse ${
            isE
              ? "de l'événement"
              : isO
              ? orgTypeFull(entity.orgType)
              : "du soleil"
          }`}
          ml={2}
          tooltipProps={{ placement: "right" }}
          variant="outline"
        />
      )}
    </Flex>
  );

  let subtitle: React.ReactNode | undefined;

  if (isO) {
    const org = entity as IOrg;

    if (org.orgType === EOrgType.GENERIC) {
      const orgNetworks = getNetworks(org, session);

      if (Array.isArray(orgNetworks) && orgNetworks.length > 0) {
        subtitle = (
          <Flex flexDirection="column" mt={3}>
            {orgNetworks.map((orgNetwork, index) => (
              <Flex key={orgNetwork._id}>
                <EntityButton
                  org={orgNetwork}
                  tooltipProps={{
                    label: `Cet arbre est dans la forêt de la planète ${orgNetwork.orgName}`
                  }}
                  mb={index !== orgNetworks.length - 1 ? 3 : 0}
                />
              </Flex>
            ))}
          </Flex>
        );
      }
    }
  }

  return (
    <Flex
      alignItems="center"
      bg={banner ? "black" : isDark ? "whiteAlpha.400" : "blackAlpha.200"}
      borderRadius="lg"
      pb={4}
      pl={4}
      pr={4}
      ml={logo ? 5 : undefined}
    >
      <Flex flexDirection={subtitle ? "column" : "row"}>
        {title}
        {subtitle}
      </Flex>
    </Flex>
  );
};
