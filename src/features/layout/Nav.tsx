import {
  Avatar,
  Box,
  BoxProps,
  Flex,
  Icon,
  Menu,
  MenuButton,
  useColorMode,
  Table,
  Tbody,
  Tr,
  Td,
  Tooltip,
  IconButton
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { AppHeading, DarkModeSwitch, Link, LoginButton } from "features/common";
import {
  EventPopover,
  OrgPopover,
  NotificationPopover,
  TopicPopover
} from "features/layout";
import { useSession } from "hooks/useSession";
import { PageProps } from "main";
import { IEntity, isEvent, isOrg } from "models/Entity";
import { EOrgType, OrgTypes } from "models/Org";
import { IUser } from "models/User";
import { selectUserEmail } from "store/userSlice";
import { NavButtonsList } from "./NavButtonsList";
import { NavMenuList } from "./NavMenuList";
import { ChevronLeftIcon, SearchIcon } from "@chakra-ui/icons";
import { FaHome } from "react-icons/fa";

export const Nav = ({
  isMobile,
  pageTitle,
  entity,
  ...props
}: BoxProps &
  PageProps & {
    entity?: IEntity | IUser;
    pageTitle?: string;
  }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const { data: session } = useSession();
  const userEmail = useSelector(selectUserEmail);
  const userName = session?.user.userName || "";
  const [isNetworksModalOpen, setIsNetworksModalOpen] = useState(false);
  const isE = isEvent(entity);
  const isO = isOrg(entity);

  const iconProps = {
    bg: isDark ? "teal.300" : "teal.500",
    borderColor: isDark ? "gray.600" : "gray.200",
    borderRadius: 9999,
    borderStyle: "solid",
    borderWidth: 1,
    color: isDark ? "black" : "white",
    mr: 3,
    px: 5,
    py: 6,
    _hover: { bg: "blue.400", color: "white" }
  };

  return (
    <Box as="nav" {...props}>
      {!isMobile && (
        <Table role="navigation">
          <Tbody role="rowgroup">
            <Tr role="rowheader">
              <Td border={0} p={0}>
                <Flex>
                  {router.pathname !== "/" && (
                    <>
                      <IconButton
                        aria-label="Revenir à la page précédente"
                        colorScheme="purple"
                        icon={<ChevronLeftIcon boxSize={10} />}
                        mr={2}
                        onClick={() => window.history.back()}
                      />
                      {isE && (
                        <IconButton
                          aria-label="Revenir à l'atelier"
                          colorScheme="purple"
                          icon={<Icon as={FaHome} boxSize={8} />}
                          mr={2}
                          onClick={() => window.history.back()}
                        />
                      )}
                    </>
                  )}
                  <AppHeading mb={0}>
                    <Link href="/" shallow>
                      {pageTitle
                        ? pageTitle
                        : entity
                        ? isO
                          ? `${OrgTypes[entity.orgType]} ${entity.orgName}`
                          : isE
                          ? entity.eventName
                          : process.env.NEXT_PUBLIC_SHORT_URL + router.asPath
                        : process.env.NEXT_PUBLIC_SHORT_URL}
                    </Link>
                  </AppHeading>
                </Flex>
              </Td>
              <Td border={0} display="flex" justifyContent="flex-end" gap={3}>
                {/* <Tooltip label={`Rechercher`} hasArrow>
                  <IconButton
                    aria-label="Rechercher"
                    icon={<SearchIcon />}
                    colorScheme={"red"}
                    borderRadius={"9999px"}
                    onClick={() => {
                      setIsNetworksModalOpen(true);
                    }}
                  />
                </Tooltip> */}

                <Tooltip
                  label={`Basculer vers le thème ${
                    isDark ? "clair" : "sombre"
                  }`}
                  hasArrow
                >
                  <Box>
                    <DarkModeSwitch />
                  </Box>
                </Tooltip>
              </Td>
            </Tr>

            <Tr role="row">
              {/* Parcourir | Événements */}
              <Td border={0} p={isMobile ? 0 : "0px 0 0 0"}>
                {session ? (
                  <NavButtonsList
                    isNetworksModalOpen={isNetworksModalOpen}
                    onClose={() => {
                      setIsNetworksModalOpen(false);
                    }}
                  />
                ) : (
                  <>
                    {/*<LoginButton colorScheme="purple">Se connecter</LoginButton>*/}
                  </>
                )}
              </Td>
              <Td border={0} p={0} textAlign="right">
                {/* NYI */}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      )}

      {/* {isMobile && !session && (
        <LoginButton colorScheme="cyan" bg="lightcyan" mb={1}>
          Se connecter
        </LoginButton>
      )} */}

      {session && userEmail && (
        <Table
          role="navigation"
          bg={isDark ? "gray.700" : "blackAlpha.50"}
          borderRadius="lg"
          width={isMobile ? undefined : "auto"}
          mb={isMobile ? 1 : 0}
          mt={isMobile ? undefined : 0}
        >
          <Tbody role="rowgroup">
            {/* <Tr role="rowheader">
              <Td border={0} lineHeight="auto" p={0} pl={2}>
                <Flex alignItems="center">
                  <Icon as={FaUser} boxSize={7} mr={2} />
                  <Heading>{session.user.userName}</Heading>
                </Flex>
              </Td>
            </Tr> */}
            <Tr role="row">
              <Td border={0} p={0}>
                <Flex m={2}>
                  <Menu>
                    {/* <Tooltip
                        label={`Connecté en tant que ${userEmail}`}
                        placement="left"
                      >
                      </Tooltip> */}
                    <MenuButton aria-label="Menu" mr={2}>
                      <Avatar
                        boxSize={12}
                        bgColor={isDark ? undefined : "#2B6CB0"}
                        color={isDark ? undefined : "white"}
                        name={userName}
                        src={
                          session.user.userImage
                            ? session.user.userImage.base64
                            : undefined
                        }
                      />
                    </MenuButton>

                    <NavMenuList
                      email={userEmail}
                      //session={session}
                      userName={userName}
                    />
                  </Menu>

                  {session.user.isAdmin && (
                    <>
                      <OrgPopover
                        label="Mes ateliers"
                        isMobile={isMobile}
                        orgType={EOrgType.NETWORK}
                        session={session}
                        offset={[isMobile ? 95 : 140, 15]}
                        iconProps={{ ...iconProps, ...{} }}
                      />
                      {/* <OrgPopover
                        isMobile={isMobile}
                        session={session}
                        offset={[isMobile ? 20 : 140, 15]}
                        iconProps={iconProps}
                      /> */}
                      <EventPopover
                        isMobile={isMobile}
                        session={session}
                        offset={[isMobile ? 35 : 140, 15]}
                        iconProps={iconProps}
                      />
                      <TopicPopover
                        isMobile={isMobile}
                        session={session}
                        offset={[isMobile ? -30 : 140, 15]}
                        iconProps={iconProps}
                      />
                    </>
                  )}

                  {/* {!isMobile && (
                    <NotificationPopover
                      isMobile={isMobile}
                      session={session}
                      offset={[isMobile ? -141 : 140, 15]}
                      iconProps={{ ...iconProps, ...{ mr: 0 } }}
                    />
                  )} */}
                </Flex>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      )}
    </Box>
  );
};
