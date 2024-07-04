import { ChatIcon, SunIcon } from "@chakra-ui/icons";
import { Box, BoxProps, Flex, Icon, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { GrWorkshop } from "react-icons/gr";
import { FaRegCalendarCheck, FaRegCalendarTimes, FaTree } from "react-icons/fa";
import { EntityButton, Link, AppHeading, LinkShare } from "features/common";
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
import { IUser } from "models/User";

export const HeaderTitle = ({
  entity,
  pageHeader,
  pageTitle,
  ...props
}: BoxProps & {
  entity?: IEntity | IUser;
  pageHeader?: React.ReactNode;
  pageTitle?: string;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session } = useSession();

  //#region entity
  const isE = isEvent(entity);
  const isO = isOrg(entity);
  const isU = isUser(entity);
  let banner: IEntityBanner | undefined;
  let logo: IEntityLogo | undefined;
  let name: string | undefined;
  let entityUrl: string | undefined;
  let icon: AppIcon | undefined;
  let iconColor = banner ? "white" : isDark ? "green.100" : "green";
  if (isE) {
    banner = entity.eventBanner;
    logo = entity.eventLogo;
    name = entity.eventName;
    entityUrl = entity.eventUrl;
    icon = entity.isApproved ? FaRegCalendarCheck : FaRegCalendarTimes;
    iconColor = entity.isApproved ? "green" : "red";
  } else if (isO) {
    banner = entity.orgBanner;
    logo = entity.orgLogo;
    name = entity.orgName;
    entityUrl = entity.orgUrl;
    icon =
      entityUrl === "forum"
        ? ChatIcon
        : entity.orgType === EOrgType.NETWORK
        ? GrWorkshop
        : FaTree;
    iconColor =
      entity.orgType === EOrgType.NETWORK
        ? entityUrl === "forum"
          ? isDark
            ? "white"
            : "blue"
          : "blue"
        : "green";
  } else if (isU) {
    name = entity.userName;
    entityUrl = entity.userName;
    icon = SunIcon;
  }
  //#endregion

  //#region local state
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
  //const heading = <AppHeading pr={1}>{name || pageTitle || ""}</AppHeading>;
  const heading = (
    <AppHeading fontSize="3xl" pr={1}>
      {name || pageTitle || ""}
    </AppHeading>
  );
  const title = (
    <Flex alignItems="center" pt={3} {...props}>
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

      {entityUrl ? (
        <Link href={`/${entityUrl}`}>{pageHeader ? pageHeader : heading}</Link>
      ) : pageHeader ? (
        pageHeader
      ) : (
        heading
      )}

      {entity && entityUrl !== "forum" && (
        <LinkShare
          url={`${process.env.NEXT_PUBLIC_URL}/${entityUrl}`}
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
  //#endregion

  return (
    <Box
      //alignItems="center"
      bg={
        banner
          ? isDark
            ? "black"
            : "white"
          : isDark
          ? "whiteAlpha.400"
          : "blackAlpha.100"
      }
      borderRadius="lg"
      pb={4}
      pl={4}
      pr={4}
      ml={logo ? 5 : undefined}
      onClick={(e) => e.stopPropagation()}
      {...props}
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
                    label: `Cet arbre a été planté sur la atelier ${orgNetwork.orgName}`
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
    </Box>
  );
};
