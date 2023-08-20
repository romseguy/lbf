import { ChatIcon, SunIcon } from "@chakra-ui/icons";
import { Flex, Icon, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
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
import { useAppDispatch } from "store";

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
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session } = useSession();

  const isE = isEvent(entity);
  const isO = isOrg(entity);
  const isU = isUser(entity);
  const [orgNetworks, setOrgNetworks] = useState<IOrg[]>([]);
  useEffect(() => {
    setOrgNetworks([]);

    (async () => {
      if (isO && entity.orgType === EOrgType.GENERIC) {
        const networks = await getNetworks(entity, session, dispatch);
        networks && setOrgNetworks(networks);
      }
    })();
  }, [entity]);

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
  const heading = <Heading pr={1}>{name || pageTitle || ""}</Heading>;

  let icon: AppIcon | undefined;
  let iconColor = banner ? "white" : isDark ? "green.100" : "green";

  if (isE) {
    icon = entity.isApproved ? FaRegCalendarCheck : FaRegCalendarTimes;
    iconColor = entity.isApproved ? "green" : "red";
  } else if (isO) {
    const org = entity as IOrg;
    icon =
      org.orgUrl === "forum"
        ? ChatIcon
        : org.orgType === EOrgType.NETWORK
        ? FaGlobeEurope
        : FaTree;
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

      {url ? (
        <Link href={`/${url}`} variant="no-underline">
          {pageHeader ? pageHeader : heading}
        </Link>
      ) : pageHeader ? (
        pageHeader
      ) : (
        heading
      )}

      {entity && url !== "forum" && (
        <LinkShare
          url={`${process.env.NEXT_PUBLIC_URL}/${url}`}
          colorScheme="blue"
          label={`Copier le lien ${
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
      <Flex flexDirection={orgNetworks.length > 0 ? "column" : "row"}>
        {title}
        {orgNetworks.length > 0 && (
          <Flex flexDirection="column" mt={3}>
            {orgNetworks.map((orgNetwork, index) => (
              <Flex key={orgNetwork._id}>
                <EntityButton
                  org={orgNetwork}
                  tooltipProps={{
                    label: `Cet arbre a été planté sur la planète ${orgNetwork.orgName}`
                  }}
                  mb={index !== orgNetworks.length - 1 ? 3 : 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(orgNetwork.orgUrl, orgNetwork.orgUrl, {
                      shallow: true
                    });
                  }}
                />
              </Flex>
            ))}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
