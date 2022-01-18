import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  FlexProps,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Icon,
  IconButton,
  Text,
  Tooltip,
  useColorMode,
  useToast,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
  Grid,
  Table,
  Tbody,
  Tr,
  Td
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Session } from "next-auth";
import { signOut } from "next-auth/client";
import React, { useEffect, useState } from "react";
import { FaKey, FaPowerOff } from "react-icons/fa";
import { useSelector } from "react-redux";
import { css } from "twin.macro";
import { Link } from "features/common";
import { EventPopover, OrgPopover, EmailLoginPopover } from "features/layout";
import { LoginModal } from "features/modals/LoginModal";
import { setSession } from "features/session/sessionSlice";
import { useEditUserMutation, useGetUserQuery } from "features/users/usersApi";
import { selectUserEmail, setUserEmail } from "features/users/userSlice";
import { useSession } from "hooks/useAuth";
import { OrgTypes } from "models/Org";
import { useAppDispatch } from "store";
import { breakpoints } from "theme/theme";
import { isServer } from "utils/isServer";
import { base64ToUint8Array } from "utils/string";
import { TopicPopover } from "./TopicPopover";
import { NavButtonsList } from "./NavButtonsList";

interface customWindow extends Window {
  workbox?: any;
}

declare const window: customWindow;

export const Nav = ({
  isLogin = 0,
  isMobile,
  session: serverSession,
  ...props
}: FlexProps & {
  isLogin?: number;
  isMobile: boolean;
  session?: Session | null;
}) => {
  const router = useRouter();
  const { data: clientSession } = useSession();
  const session = clientSession || serverSession;
  const userName = session?.user.userName || "";
  const toast = useToast({ position: "top" });
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const dispatch = useAppDispatch();

  //#region login modal
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(
    router.asPath === "/?login" && !session
  );
  useEffect(() => {
    if (isLogin !== 0) {
      setIsLoginModalOpen(true);
    }
  }, [isLogin]);
  //#endregion

  const { isOpen, onOpen, onClose } = useDisclosure();

  //#region push subscriptions
  const [editUser, editUserMutation] = useEditUserMutation();
  const userEmail = useSelector(selectUserEmail) || session?.user.email || "";
  const userQuery = useGetUserQuery({ slug: userEmail });
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  useEffect(() => {
    if (
      !isServer() &&
      "serviceWorker" in navigator &&
      window.workbox !== undefined
    ) {
      navigator.serviceWorker.ready.then((reg) => {
        console.log("sw ready, setting reg");
        setRegistration(reg);

        reg.pushManager.getSubscription().then((sub) => {
          console.log("reg.pushManager.getSubscription", sub);

          if (
            sub
            // !(
            //   sub.expirationTime &&
            //   Date.now() > sub.expirationTime - 5 * 60 * 1000
            // )
          ) {
            setSubscription(sub);
            setIsSubscribed(true);
          }
        });
      });
    }
  }, []);
  //#endregion

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
                      {session ? "Mes contributions" : "Se connecter"}
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
                  <Flex
                    alignItems="center"
                    justifyContent={session ? "space-between" : undefined}
                  >
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
                          orgType={OrgTypes.NETWORK}
                          session={session}
                          ml={3}
                        />
                        {/* <OrgPopover
                          boxSize={[8, 8, 8]}
                          mr={1}
                          session={session}
                        /> */}
                        <EventPopover
                          boxSize={[5, 5, 5]}
                          session={session}
                          ml={1}
                          mr={2}
                        />
                        <TopicPopover
                          boxSize={[5, 5, 5]}
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
                              boxSize={[10, 10, 10]}
                              name={userName}
                              css={css`
                                // &:focus {
                                //   box-shadow: var(--chakra-shadows-outline);
                                // }
                              `}
                              src={
                                session.user.userImage
                                  ? session.user.userImage.base64
                                  : undefined
                              }
                            />
                          </MenuButton>
                        </Tooltip>

                        <MenuList mr={[1, 3]}>
                          <MenuItem
                            aria-hidden
                            command={`${userEmail}`}
                            cursor="default"
                            _hover={{ bg: isDark ? "gray.700" : "white" }}
                          />

                          {process.env.NODE_ENV === "development" && (
                            <MenuItem
                              aria-hidden
                              command={`${session.user.userId}`}
                              cursor="default"
                              _hover={{ bg: isDark ? "gray.700" : "white" }}
                            />
                          )}

                          <Link
                            href={`/${userName}`}
                            aria-hidden
                            data-cy="my-page"
                          >
                            <MenuItem>Ma page</MenuItem>
                          </Link>

                          {
                            /*isMobile*/ true && (
                              <MenuItem
                                isDisabled={
                                  registration === null ||
                                  userQuery.isLoading ||
                                  userQuery.isFetching
                                }
                                onClick={async () => {
                                  try {
                                    if (
                                      isSubscribed &&
                                      userQuery.data?.userSubscription
                                    ) {
                                      if (!subscription)
                                        throw new Error(
                                          "Une erreur est survenue."
                                        );

                                      await subscription.unsubscribe();
                                      await editUser({
                                        payload: { userSubscription: null },
                                        slug: userName
                                      });
                                      setSubscription(null);
                                      setIsSubscribed(false);

                                      userQuery.refetch();

                                      toast({
                                        status: "success",
                                        title:
                                          "Vous ne recevrez plus de notifications mobile"
                                      });
                                    } else {
                                      const sub =
                                        await registration!.pushManager.subscribe(
                                          {
                                            userVisibleOnly: true,
                                            applicationServerKey:
                                              base64ToUint8Array(
                                                process.env
                                                  .NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
                                              )
                                          }
                                        );
                                      setSubscription(sub);
                                      setIsSubscribed(true);

                                      await editUser({
                                        payload: { userSubscription: sub },
                                        slug: userName
                                      }).unwrap();

                                      userQuery.refetch();

                                      toast({
                                        status: "success",
                                        title:
                                          "Vous recevrez des notifications mobile en plus des e-mails"
                                      });
                                    }
                                  } catch (error: any) {
                                    toast({
                                      status: "error",
                                      title: error.message
                                    });
                                  }
                                }}
                              >
                                {isSubscribed &&
                                userQuery.data?.userSubscription
                                  ? "Désactiver"
                                  : "Activer"}{" "}
                                les notifications mobile
                              </MenuItem>
                            )
                          }

                          {/* <NextLink href="/settings" passHref>
                  <MenuItem as={ChakraLink}>Paramètres</MenuItem>
                </NextLink> */}

                          <MenuItem
                            onClick={async () => {
                              const { url } = await signOut({
                                redirect: false,
                                callbackUrl: "/"
                              });
                              dispatch(setUserEmail(null));
                              dispatch(setSession(null));
                              router.push(url);
                            }}
                            data-cy="logout"
                          >
                            Déconnexion
                          </MenuItem>
                        </MenuList>
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
              </Tr>
              <Tr role="row">
                <Td border={0} p={0}>
                  <Flex>
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
                          <Text
                            className="rainbow-text"
                            fontFamily="DancingScript"
                            fontSize="3xl"
                          >
                            Naviguer
                          </Text>
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
                  <Flex>
                    <Text
                      className="rainbow-text"
                      fontFamily="DancingScript"
                      fontSize="3xl"
                    >
                      {session ? "Mes contributions" : "Se connecter"}
                    </Text>
                  </Flex>
                </Td>
              </Tr>
              <Tr role="row">
                <Td border={0} p={0}>
                  <Flex>
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
                          boxSize={6}
                          orgType={OrgTypes.NETWORK}
                          session={session}
                          ml={3}
                        />
                        {/* <OrgPopover boxSize={8} mr={1} session={session} /> */}
                        <EventPopover
                          boxSize={[6, 6, 6]}
                          session={session}
                          ml={1}
                          mr={2}
                        />
                        <TopicPopover boxSize={6} session={session} mr={3} />
                      </Flex>
                    )}

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
                      <Menu>
                        <Tooltip label={`Connecté en tant que ${userEmail}`}>
                          <MenuButton ml={1} data-cy="avatar-button">
                            <Avatar
                              boxSize={10}
                              name={userName}
                              css={css`
                                // &:focus {
                                //   box-shadow: var(--chakra-shadows-outline);
                                // }
                              `}
                              src={
                                session.user.userImage
                                  ? session.user.userImage.base64
                                  : undefined
                              }
                            />
                          </MenuButton>
                        </Tooltip>

                        <MenuList mr={[1, 3]}>
                          <MenuItem
                            aria-hidden
                            command={`${userEmail}`}
                            cursor="default"
                            _hover={{ bg: isDark ? "gray.700" : "white" }}
                          />

                          {process.env.NODE_ENV === "development" && (
                            <MenuItem
                              aria-hidden
                              command={`${session.user.userId}`}
                              cursor="default"
                              _hover={{ bg: isDark ? "gray.700" : "white" }}
                            />
                          )}

                          <Link
                            href={`/${userName}`}
                            aria-hidden
                            data-cy="my-page"
                          >
                            <MenuItem>Ma page</MenuItem>
                          </Link>

                          {
                            /*isMobile*/ true && (
                              <MenuItem
                                isDisabled={
                                  registration === null ||
                                  userQuery.isLoading ||
                                  userQuery.isFetching
                                }
                                onClick={async () => {
                                  try {
                                    if (
                                      isSubscribed &&
                                      userQuery.data?.userSubscription
                                    ) {
                                      if (!subscription)
                                        throw new Error(
                                          "Une erreur est survenue."
                                        );

                                      await subscription.unsubscribe();
                                      await editUser({
                                        payload: { userSubscription: null },
                                        slug: userName
                                      });
                                      setSubscription(null);
                                      setIsSubscribed(false);

                                      userQuery.refetch();

                                      toast({
                                        status: "success",
                                        title:
                                          "Vous ne recevrez plus de notifications mobile"
                                      });
                                    } else {
                                      const sub =
                                        await registration!.pushManager.subscribe(
                                          {
                                            userVisibleOnly: true,
                                            applicationServerKey:
                                              base64ToUint8Array(
                                                process.env
                                                  .NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
                                              )
                                          }
                                        );
                                      setSubscription(sub);
                                      setIsSubscribed(true);

                                      await editUser({
                                        payload: { userSubscription: sub },
                                        slug: userName
                                      }).unwrap();

                                      userQuery.refetch();

                                      toast({
                                        status: "success",
                                        title:
                                          "Vous recevrez des notifications mobile en plus des e-mails"
                                      });
                                    }
                                  } catch (error: any) {
                                    toast({
                                      status: "error",
                                      title: error.message
                                    });
                                  }
                                }}
                              >
                                {isSubscribed &&
                                userQuery.data?.userSubscription
                                  ? "Désactiver"
                                  : "Activer"}{" "}
                                les notifications mobile
                              </MenuItem>
                            )
                          }

                          {/* <NextLink href="/settings" passHref>
                  <MenuItem as={ChakraLink}>Paramètres</MenuItem>
                </NextLink> */}

                          <MenuItem
                            onClick={async () => {
                              const { url } = await signOut({
                                redirect: false,
                                callbackUrl: "/"
                              });
                              dispatch(setUserEmail(null));
                              dispatch(setSession(null));
                              router.push(url);
                            }}
                            data-cy="logout"
                          >
                            Déconnexion
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    )}
                  </Flex>
                </Td>
              </Tr>
            </Tbody>
          )}
        </Table>
      </Box>

      {isLoginModalOpen && (
        <LoginModal
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
