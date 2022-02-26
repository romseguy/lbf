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
  SubscriptionPopover,
  TopicPopover
} from "features/layout";
import { selectUserEmail } from "features/users/userSlice";
import { EOrgType } from "models/Org";
import { PageProps } from "pages/_app";
import { NavButtonsList } from "./NavButtonsList";
import { NavMenuList } from "./NavMenuList";

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
  const userEmail = useSelector(selectUserEmail);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const popoverProps = {
    bg: isDark ? "gray.800" : "lightcyan",
    borderColor: isDark ? "gray.600" : "gray.200",
    borderRadius: 9999,
    borderStyle: "solid",
    borderWidth: 1,
    ml: 3,
    css: css`
      padding: 2px 0px 3px 0px;
    `
  };

  return (
    <>
      <Box
        as="nav"
        bg={isDark ? "gray.700" : "lightblue"}
        borderRadius="lg"
        m={3}
        p={3}
        pt={0}
        {...props}
      >
        <Table role="navigation">
          {!isMobile && (
            <Tbody role="rowgroup">
              <Tr role="rowheader">
                <Td border={0} lineHeight="auto" p={0}>
                  <Heading>Naviguer</Heading>
                </Td>
                <Td border={0} lineHeight="auto" p={0}>
                  <Heading>{session ? "Mon espace" : "Se connecter"}</Heading>
                </Td>
              </Tr>
              <Tr role="row">
                <Td border={0} p={0}>
                  <Box
                    css={css`
                      button {
                        background: ${isDark ? "#1A202C" : "lightcyan"};
                        margin-right: 12px;
                        border-radius: 9999px;
                      }
                    `}
                  >
                    <NavButtonsList />
                  </Box>
                </Td>
                <Td border={0} p={0}>
                  <Flex alignItems="center">
                    {session && (
                      <Flex
                        as="nav"
                        bg={isDark ? "gray.800" : "lightcyan"}
                        borderColor={isDark ? "gray.600" : "gray.200"}
                        borderRadius={9999}
                        borderStyle="solid"
                        borderWidth={1}
                        css={css`
                          padding: 3px 0px 3px 0px;
                        `}
                      >
                        <OrgPopover
                          boxSize={[6, 6, 6]}
                          orgType={EOrgType.NETWORK}
                          session={session}
                          ml={3}
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
                        <SubscriptionPopover
                          boxSize={[6, 6, 6]}
                          session={session}
                          mr={3}
                        />
                      </Flex>
                    )}

                    {!session && (
                      <>
                        <EmailLoginPopover
                          iconProps={{ boxSize: [8, 10, 10] }}
                          popoverProps={{ offset: [-140, -25] }}
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
                            mx={3}
                            onClick={() => setIsLoginModalOpen(true)}
                          />
                        </Tooltip>
                      </>
                    )}

                    {session && (
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
                          {...props}
                          isMobile={isMobile}
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
                  <Heading mb={1}>Naviguer</Heading>
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
                      onClick={onOpen}
                    >
                      Ouvrir le menu
                    </Button>
                    <Drawer placement="left" isOpen={isOpen} onClose={onClose}>
                      <DrawerOverlay />
                      <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                          <Heading>Naviguer</Heading>
                        </DrawerHeader>
                        <DrawerBody>
                          <NavButtonsList direction="column" />
                        </DrawerBody>
                      </DrawerContent>
                    </Drawer>
                  </Flex>
                </Td>
              </Tr>

              <Tr role="rowheader">
                <Td border={0} lineHeight="auto" p={0}>
                  <Flex mt={1}>
                    <Heading>{session ? "Mon espace" : "Se connecter"}</Heading>
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

                    {session && (
                      <>
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
                            {...props}
                            isMobile={isMobile}
                            session={session}
                            userName={userName}
                          />
                        </Menu>

                        <Box {...popoverProps}>
                          <OrgPopover
                            boxSize={6}
                            orgType={EOrgType.NETWORK}
                            session={session}
                            mx={4}
                          />
                        </Box>
                        <Box {...popoverProps}>
                          <EventPopover
                            boxSize={[6, 6, 6]}
                            session={session}
                            mx={4}
                          />
                        </Box>
                        <Box {...popoverProps}>
                          <TopicPopover boxSize={6} session={session} mx={4} />
                        </Box>
                        <Box {...popoverProps}>
                          <SubscriptionPopover
                            boxSize={6}
                            session={session}
                            mx={4}
                          />
                        </Box>
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
