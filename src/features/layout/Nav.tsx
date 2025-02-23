import { SearchIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  BoxProps,
  Flex,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  Table,
  Tbody,
  Td,
  Tooltip,
  Tr,
  useColorMode
} from "@chakra-ui/react";
import { DarkModeSwitch, Delimiter, Link, LoginButton } from "features/common";
import {
  EventPopover,
  NotificationPopover,
  OrgPopover,
  TopicPopover
} from "features/layout";
import { useSession } from "hooks/useSession";
import { PageProps } from "main";
import { IEntity } from "models/Entity";
import { EOrgType } from "models/Org";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUserEmail } from "store/userSlice";
import { NavButtonsList } from "./NavButtonsList";
import { NavMenuList } from "./NavMenuList";

export interface NavProps {
  entity?: IEntity;
  pageTitle?: string;
}

export const Nav = ({
  entity,
  isMobile,
  pageTitle,
  ...props
}: PageProps & BoxProps & NavProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const { data: session } = useSession();
  const userEmail = useSelector(selectUserEmail);
  const userName = session?.user.userName || "";
  const [isNetworksModalOpen, setIsNetworksModalOpen] = useState(false);

  const headingProps = {
    _hover: {
      color: "orange"
    }
  };

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
                <HStack>
                  <Heading {...headingProps}>
                    <Link
                      href="/"
                      variant={
                        router.pathname === "/" ? "underline" : undefined
                      }
                      shallow
                    >
                      Accueil
                    </Link>
                  </Heading>
                  <Delimiter fontSize="xxx-large" />
                  <Heading {...headingProps}>
                    <Link
                      href="/blog"
                      variant={
                        router.pathname === "/blog" ? "underline" : undefined
                      }
                      shallow
                    >
                      Blog
                    </Link>
                  </Heading>
                  <Delimiter fontSize="xxx-large" />
                  <Heading {...headingProps}>
                    <Link
                      href="/a_propos"
                      variant={
                        router.pathname === "/a_propos"
                          ? "underline"
                          : undefined
                      }
                      shallow
                    >
                      À propos
                    </Link>
                  </Heading>
                </HStack>
              </Td>
              <Td border={0} display="flex" justifyContent="flex-end" gap={3}>
                <Tooltip label={`Rechercher`} hasArrow>
                  <IconButton
                    aria-label="Rechercher"
                    icon={<SearchIcon />}
                    colorScheme={"red"}
                    borderRadius={"9999px"}
                    onClick={() => {
                      setIsNetworksModalOpen(true);
                    }}
                  />
                </Tooltip>

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
              <Td border={0} p={isMobile ? 0 : "16px 0 0 0"}>
                <NavButtonsList
                  isNetworksModalOpen={isNetworksModalOpen}
                  onClose={() => {
                    setIsNetworksModalOpen(false);
                  }}
                />
              </Td>
              {!session && (
                <Td border={0} p={0} textAlign="right">
                  <LoginButton colorScheme="purple">Se connecter</LoginButton>
                </Td>
              )}
            </Tr>
          </Tbody>
        </Table>
      )}

      {isMobile && !session && (
        <LoginButton colorScheme="cyan" bg="lightcyan" mb={1}>
          Se connecter
        </LoginButton>
      )}

      {session && userEmail && (
        <Table
          role="navigation"
          bg={isDark ? "gray.700" : "blackAlpha.50"}
          borderRadius="lg"
          width={isMobile ? undefined : "auto"}
          mb={isMobile ? 1 : 0}
          mt={isMobile ? undefined : 3}
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
                    <MenuButton aria-label="Menu">
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
                      entity={entity}
                      email={userEmail}
                      //session={session}
                      userName={userName}
                    />
                  </Menu>

                  <OrgPopover
                    label="Mes planètes"
                    isMobile={isMobile}
                    orgType={EOrgType.NETWORK}
                    session={session}
                    offset={[isMobile ? 80 : 140, 15]}
                    iconProps={{ ...iconProps, ...{ ml: 3 } }}
                  />
                  <OrgPopover
                    isMobile={isMobile}
                    session={session}
                    offset={[isMobile ? 20 : 140, 15]}
                    iconProps={iconProps}
                  />
                  <EventPopover
                    isMobile={isMobile}
                    session={session}
                    offset={[isMobile ? -45 : 140, 15]}
                    iconProps={iconProps}
                  />
                  <TopicPopover
                    isMobile={isMobile}
                    session={session}
                    offset={[isMobile ? -106 : 140, 15]}
                    iconProps={iconProps}
                  />
                  {!isMobile && (
                    <NotificationPopover
                      isMobile={isMobile}
                      session={session}
                      offset={[isMobile ? -141 : 140, 15]}
                      iconProps={iconProps}
                    />
                  )}
                </Flex>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      )}
    </Box>
  );
};
