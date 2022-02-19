import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  FlexProps,
  Heading,
  Menu,
  MenuButton,
  Icon,
  IconButton,
  Text,
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
import { useRouter } from "next/router";
import { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import { FaKey, FaPowerOff } from "react-icons/fa";
import { useSelector } from "react-redux";
import { css } from "twin.macro";
import {
  EmailLoginPopover,
  EventPopover,
  OrgPopover,
  SubscriptionPopover,
  TopicPopover
} from "features/layout";
import { LoginFormModal } from "features/modals/LoginFormModal";
import { selectUserEmail, setUserEmail } from "features/users/userSlice";
import { useSession } from "hooks/useAuth";
import { EOrgType } from "models/Org";
import { useAppDispatch } from "store";
import { NavButtonsList } from "./NavButtonsList";
import { NavMenuList } from "./NavMenuList";

export const Nav = ({
  isLogin = 0,
  isMobile,
  session,
  ...props
}: FlexProps & {
  isLogin?: number;
  isMobile: boolean;
  session?: Session | null;
}) => {
  const router = useRouter();
  const userName = session?.user.userName || "";
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const dispatch = useAppDispatch();
  const userEmail = useSelector(selectUserEmail) || session?.user.email || "";

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(
    router.asPath === "/?login" && !session
  );
  useEffect(() => {
    if (isLogin !== 0) setIsLoginModalOpen(true);
  }, [isLogin]);

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
                  <Flex>
                    <Text
                      className="rainbow-text"
                      fontFamily="DancingScript"
                      fontSize="3xl"
                    >
                      Naviguer
                    </Text>
                  </Flex>
                </Td>
                <Td border={0} lineHeight="auto" p={0}>
                  <Flex>
                    <Text
                      className="rainbow-text"
                      fontFamily="DancingScript"
                      fontSize="3xl"
                    >
                      {session ? "Mon espace" : "Se connecter"}
                    </Text>
                  </Flex>
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
                          session={session}
                          userEmail={userEmail}
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
                  <Flex mb={1}>
                    <Heading
                      className="rainbow-text"
                      fontFamily="DancingScript"
                    >
                      Naviguer
                    </Heading>
                  </Flex>
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
                          <Flex>
                            <Heading
                              className="rainbow-text"
                              fontFamily="DancingScript"
                              fontSize="3xl"
                            >
                              Naviguer
                            </Heading>
                          </Flex>
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
                    <Heading
                      className="rainbow-text"
                      fontFamily="DancingScript"
                    >
                      {session ? "Mon espace" : "Se connecter"}
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
                            session={session}
                            userEmail={userEmail}
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

      {isLoginModalOpen && (
        <LoginFormModal
          onClose={() => setIsLoginModalOpen(false)}
          onSubmit={async () => {
            setIsLoginModalOpen(false);
            dispatch(setUserEmail(null));
            const url = router.asPath.includes("/?login") ? "/" : router.asPath;
            await router.push(url);
          }}
        />
      )}
    </>
  );
};
