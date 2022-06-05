import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  FlexProps,
  Menu,
  MenuButton,
  Icon,
  IconButton,
  Tooltip,
  useColorMode,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
  Table,
  Tbody,
  Tr,
  Td
} from "@chakra-ui/react";
import { Session } from "next-auth";
import React from "react";
import { FaKey, FaPowerOff } from "react-icons/fa";
import { useSelector } from "react-redux";
import { css } from "twin.macro";
import { Heading } from "features/common";
import {
  EmailLoginPopover,
  EventPopover,
  OrgPopover,
  NotificationPopover,
  TopicPopover
} from "features/layout";
import { selectUserEmail } from "features/users/userSlice";
import { EOrgType } from "models/Org";
import { PageProps } from "pages/_app";
import { NavButtonsList } from "./NavButtonsList";
import { NavMenuList } from "./NavMenuList";
import { capitalize } from "utils/string";

export const Nav = ({
  isMobile,
  session,
  setIsLoginModalOpen,
  ...props
}: FlexProps &
  PageProps & {
    setIsLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
  const userName = session?.user.userName || "";
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const userEmail = useSelector(selectUserEmail) || session?.user.email;

  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose
  } = useDisclosure();

  const popoverProps = {
    bg: isDark ? "gray.800" : "lightcyan",
    borderColor: isDark ? "gray.600" : "gray.200",
    borderRadius: 9999,
    borderStyle: "solid",
    borderWidth: 1,
    mr: isMobile ? 2 : undefined,
    ml: isMobile ? undefined : 3,
    pt: 0.5
  };

  return (
    <>
      <Box
        as="nav"
        bg={isDark ? "gray.700" : "lightblue"}
        borderRadius="lg"
        p={3}
        pt={0}
        {...props}
      >
        <Table role="navigation">
          {!isMobile && (
            <Tbody role="rowgroup">
              <Tr role="rowheader">
                <Td border={0} p={0}>
                  <Heading>
                    {capitalize(process.env.NEXT_PUBLIC_SHORT_URL)}
                  </Heading>
                </Td>
                <Td border={0} p={0}>
                  <Heading ml="auto">
                    {session ? "Mon univers" : "Se connecter"}
                  </Heading>
                </Td>
              </Tr>
              <Tr role="row">
                <Td
                  border={0}
                  css={css`
                    button {
                      background: ${isDark ? "#1A202C" : "lightcyan"};
                      margin-right: 12px;
                      border-radius: 9999px;
                    }
                  `}
                  p="28px 0 0 0"
                >
                  <NavButtonsList isMobile={false} />
                </Td>
                <Td border={0} p="8px 0 0 0">
                  <Flex alignItems="center">
                    <Flex
                      as="nav"
                      bg={isDark ? "gray.800" : "lightcyan"}
                      borderColor={isDark ? "gray.600" : "gray.200"}
                      borderRadius={9999}
                      borderStyle="solid"
                      borderWidth={1}
                      ml="auto"
                      p="4px 8px 4px 8px"
                    >
                      {session && (
                        <>
                          <OrgPopover
                            orgType={EOrgType.NETWORK}
                            session={session}
                            boxSize={[6, 6, 6]}
                            mr={2}
                          />
                          <EventPopover
                            boxSize={[5, 5, 5]}
                            session={session}
                            mr={3}
                          />
                          <TopicPopover
                            boxSize={[5, 5, 5]}
                            session={session}
                            mr={2}
                          />
                          <NotificationPopover
                            boxSize={[6, 6, 6]}
                            session={session}
                          />
                        </>
                      )}

                      {!session && (
                        <>
                          <EmailLoginPopover
                            iconProps={{ boxSize: [8, 10, 10] }}
                            popoverProps={
                              isMobile ? {} : { offset: [-140, -25] }
                            }
                            ml={2}
                            mr={3}
                          />

                          <Tooltip label="Connexion par mot de passe">
                            <IconButton
                              aria-label="Connexion"
                              icon={
                                <Icon
                                  as={FaKey}
                                  boxSize={[8, 8, 8]}
                                  _hover={{ color: "#00B5D8" }}
                                />
                              }
                              bg="transparent"
                              _hover={{ bg: "transparent", color: "#00B5D8" }}
                              onClick={() => setIsLoginModalOpen(true)}
                            />
                          </Tooltip>
                        </>
                      )}
                    </Flex>

                    {session && userEmail && (
                      <Menu>
                        <Tooltip label={`Connecté en tant que ${userEmail}`}>
                          <MenuButton ml={1} data-cy="avatar-button">
                            <Avatar
                              boxSize={10}
                              name={userName}
                              src={
                                session.user.userImage
                                  ? session.user.userImage.base64
                                  : undefined
                              }
                            />
                          </MenuButton>
                        </Tooltip>

                        <NavMenuList
                          email={userEmail}
                          session={session}
                          userName={userName}
                        />
                      </Menu>
                    )}
                  </Flex>
                </Td>
              </Tr>
            </Tbody>
          )}

          {isMobile && (
            <Tbody role="rowgroup">
              <Tr role="rowheader">
                <Td border={0} lineHeight="auto" p={0}>
                  <Heading mb={1}>
                    {capitalize(process.env.NEXT_PUBLIC_SHORT_URL)}
                  </Heading>
                </Td>
              </Tr>
              <Tr role="row">
                <Td border={0} p={0}>
                  <Flex my={2}>
                    <Button
                      alignSelf="flex-start"
                      colorScheme="cyan"
                      bg="lightcyan"
                      leftIcon={<HamburgerIcon />}
                      onClick={onDrawerOpen}
                    >
                      Ouvrir le menu
                    </Button>
                    <Drawer
                      placement="left"
                      isOpen={isDrawerOpen}
                      onClose={onDrawerClose}
                    >
                      <DrawerOverlay />
                      <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                          <Heading>
                            {capitalize(process.env.NEXT_PUBLIC_SHORT_URL)}
                          </Heading>
                        </DrawerHeader>
                        <DrawerBody>
                          <NavButtonsList direction="column" isMobile />
                        </DrawerBody>
                      </DrawerContent>
                    </Drawer>
                  </Flex>
                </Td>
              </Tr>

              <Tr role="rowheader">
                <Td border={0} lineHeight="auto" p={0}>
                  <Flex mt={1}>
                    <Heading>
                      {session ? "Mon univers" : "Se connecter"}
                    </Heading>
                  </Flex>
                </Td>
              </Tr>
              <Tr role="row">
                <Td border={0} p={0}>
                  <Flex mt={2}>
                    {!session && (
                      <>
                        <EmailLoginPopover
                          iconProps={{ boxSize: 8 }}
                          popoverProps={{ offset: [100, -20] }}
                        />

                        <Tooltip label="Connexion par mot de passe">
                          <IconButton
                            aria-label="Connexion"
                            icon={<Icon as={FaPowerOff} boxSize={6} />}
                            bg="transparent"
                            _hover={{ bg: "transparent", color: "#00B5D8" }}
                            mx={3}
                            onClick={() => setIsLoginModalOpen(true)}
                          />
                        </Tooltip>
                      </>
                    )}

                    {session && userEmail && (
                      <>
                        <Box {...popoverProps}>
                          <OrgPopover
                            boxSize={6}
                            orgType={EOrgType.NETWORK}
                            session={session}
                            mx={3}
                          />
                        </Box>
                        <Box {...popoverProps}>
                          <EventPopover boxSize={6} session={session} mx={3} />
                        </Box>
                        <Box {...popoverProps}>
                          <TopicPopover boxSize={6} session={session} mx={3} />
                        </Box>
                        <Box {...popoverProps}>
                          <NotificationPopover
                            boxSize={6}
                            session={session}
                            mx={3}
                          />
                        </Box>

                        <Menu>
                          <Tooltip label={`Connecté en tant que ${userEmail}`}>
                            <MenuButton data-cy="avatar-button">
                              <Avatar
                                boxSize={12}
                                name={userName}
                                src={
                                  session.user.userImage
                                    ? session.user.userImage.base64
                                    : undefined
                                }
                              />
                            </MenuButton>
                          </Tooltip>

                          <NavMenuList
                            email={userEmail}
                            session={session}
                            userName={userName}
                          />
                        </Menu>
                      </>
                    )}
                  </Flex>
                </Td>
              </Tr>
            </Tbody>
          )}
        </Table>
      </Box>
    </>
  );
};
