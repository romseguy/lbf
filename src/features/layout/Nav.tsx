import type { IOrg } from "models/Org";
import React, { useState } from "react";
import { signOut } from "next-auth/client";
import { useSession } from "hooks/useAuth";
import tw, { css } from "twin.macro";
import {
  Button,
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Spinner,
  Icon,
  SpaceProps,
  IconButton,
  useColorMode,
  useDisclosure,
  BoxProps,
  useToast
} from "@chakra-ui/react";
import { Link } from "features/common";
import { OrgPopover, EmailSubscriptionsPopover } from "features/layout";
import { LoginModal } from "features/modals/LoginModal";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { breakpoints } from "theme/theme";
import { useAppDispatch } from "store";
import {
  selectUserEmail,
  selectUserName,
  setUserEmail
} from "features/users/userSlice";
import { CalendarIcon, ChatIcon } from "@chakra-ui/icons";
import { useSelector } from "react-redux";
import { isMobile } from "react-device-detect";
import { FaMapMarkerAlt, FaPowerOff } from "react-icons/fa";
import { MapModal } from "features/modals/MapModal";
import { getOrgs } from "features/orgs/orgsApi";
import api from "utils/api";
import { isServer } from "utils/isServer";
import { IoIosPeople } from "react-icons/io";
import { base64ToUint8Array } from "utils/string";
import { useEditUserMutation, useGetUserQuery } from "features/users/usersApi";

interface customWindow extends Window {
  workbox?: any;
}

declare const window: customWindow;

const linkList = css`
  & > button {
    margin: 0 0 0 12px;
  }

  @media (max-width: ${breakpoints.sm}) {
    margin-left: 0;

    button {
      font-size: 0.8rem;
    }

    & > button {
      display: block;
      margin: 0 0 0 12px;
    }
    // & > a:not(:first-of-type) {
    //   margin-top: 12px;
    // }
  }
`;

const buttonList = css`
  margin-left: 20px;
  @media (max-width: ${breakpoints.sm}) {
    margin-left: 0;
  }
`;

export const Nav = ({
  isLogin = 0,
  ...props
}: BoxProps & { isLogin?: number }) => {
  const router = useRouter();
  const { data: session, loading: isSessionLoading } = useSession();
  const toast = useToast({ position: "top" });
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const dispatch = useAppDispatch();

  const storedUserEmail = useSelector(selectUserEmail);
  const userEmail = storedUserEmail || session?.user.email || "";
  const storedUserName = useSelector(selectUserName);
  const userName = storedUserName || session?.user.userName || "";

  const [editUser, editUserMutation] = useEditUserMutation();
  const userQuery = useGetUserQuery(userEmail);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(
    router.asPath === "/?login" || false
  );

  const styles = css`
    height: auto !important;
    ${isDark
      ? tw`h-24 bg-gradient-to-b from-gray-800 via-green-600 to-gray-800`
      : tw`h-24 bg-gradient-to-b from-white via-yellow-400 to-yellow-50`}
  `;

  useEffect(() => {
    if (isLogin !== 0) {
      setIsLoginModalOpen(true);
    }
  }, [isLogin]);

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
            sub &&
            !(
              sub.expirationTime &&
              Date.now() > sub.expirationTime - 5 * 60 * 1000
            )
          ) {
            setSubscription(sub);
            setIsSubscribed(true);
          }
        });
      });
    }
  }, []);

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="nowrap"
      {...props}
      css={styles}
    >
      <Box css={linkList}>
        <Button
          bg="transparent"
          _hover={{
            bg: isDark ? "blackAlpha.400" : "whiteAlpha.600"
          }}
          leftIcon={<CalendarIcon />}
          onClick={() => router.push("/", "/", { shallow: true })}
          data-cy="homeLink"
        >
          Accueil
        </Button>

        <Button
          bg="transparent"
          _hover={{
            bg: isDark ? "blackAlpha.400" : "whiteAlpha.600"
          }}
          leftIcon={<IoIosPeople />}
          onClick={() => router.push("/orgs", "/orgs", { shallow: true })}
        >
          Organisations
        </Button>

        <Button
          bg="transparent"
          _hover={{
            bg: isDark ? "blackAlpha.400" : "whiteAlpha.600"
          }}
          leftIcon={<ChatIcon />}
          onClick={() => router.push("/forum", "/forum", { shallow: true })}
        >
          Forum
        </Button>
      </Box>

      {session ? (
        <Flex justify="flex-end" css={buttonList}>
          <EmailSubscriptionsPopover mr={[1, 3]} boxSize={[8, 10, 10]} />
          <OrgPopover
            boxSize={[8, 10, 12]}
            setIsLoginModalOpen={setIsLoginModalOpen}
          />
          <Menu>
            <MenuButton mr={[1, 3]}>
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

            <MenuList mr={[1, 3]}>
              <MenuItem
                aria-hidden
                command={`${userEmail}`}
                cursor="default"
                _hover={{ bg: isDark ? "gray.700" : "white" }}
              ></MenuItem>

              <Link href={`/${userName}`} aria-hidden>
                <MenuItem>Ma page</MenuItem>
              </Link>

              {session.user.isAdmin && (
                <MenuItem
                  isDisabled={
                    registration === null ||
                    userQuery.isLoading ||
                    userQuery.isFetching
                  }
                  onClick={async () => {
                    try {
                      if (isSubscribed && userQuery.data?.userSubscription) {
                        if (!subscription)
                          throw new Error("Une erreur est survenue.");

                        await subscription.unsubscribe();
                        await editUser({
                          payload: { userSubscription: null },
                          userName
                        });
                        setSubscription(null);
                        setIsSubscribed(false);

                        userQuery.refetch();

                        toast({
                          status: "success",
                          title: "Vous ne recevrez plus de notifications mobile"
                        });
                      } else {
                        const sub = await registration!.pushManager.subscribe({
                          userVisibleOnly: true,
                          applicationServerKey: base64ToUint8Array(
                            process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
                          )
                        });
                        setSubscription(sub);
                        setIsSubscribed(true);

                        await editUser({
                          payload: { userSubscription: sub },
                          userName
                        }).unwrap();

                        userQuery.refetch();

                        toast({
                          status: "success",
                          title:
                            "Vous recevrez des notifications mobile en plus des e-mails"
                        });
                      }
                    } catch (error) {
                      toast({ status: "error", title: error.message });
                    }
                  }}
                >
                  {isSubscribed && userQuery.data?.userSubscription
                    ? "Désactiver"
                    : "Activer"}{" "}
                  les notifications mobile
                </MenuItem>
              )}

              {/* 
              <NextLink href="/settings" passHref>
                <MenuItem as={ChakraLink}>Paramètres</MenuItem>
              </NextLink>
              */}

              <MenuItem
                onClick={async () => {
                  dispatch(setUserEmail(null));
                  const { url } = await signOut({
                    redirect: false,
                    callbackUrl: "/"
                  });
                  router.push(url);
                }}
              >
                Déconnexion
              </MenuItem>
            </MenuList>
          </Menu>

          {/* <Menu>
            <MenuButton mr={3} onClick={() => console.log("yoyo")}>
              <Icon as={QuestionIcon} w="48px" h="48px" />
            </MenuButton>
          </Menu> */}
        </Flex>
      ) : (
        <Flex justify="flex-end">
          <EmailSubscriptionsPopover boxSize={[8, 10, 10]} />

          {isMobile ? (
            <IconButton
              aria-label="Connexion"
              icon={<Icon as={FaPowerOff} boxSize={[8, 10, 10]} />}
              isLoading={isSessionLoading}
              bg="transparent"
              _hover={{ bg: "transparent" }}
              mx={3}
              onClick={() => setIsLoginModalOpen(true)}
            />
          ) : (
            <Box mr={5} ml={5}>
              <Button
                variant="outline"
                colorScheme="purple"
                isLoading={isSessionLoading}
                onClick={() => setIsLoginModalOpen(true)}
                data-cy="login"
              >
                Connexion
              </Button>
            </Box>
          )}
        </Flex>
      )}

      {isLoginModalOpen && (
        <LoginModal
          onClose={() => {
            setIsLoginModalOpen(false);
            //setIsLogin(false);
          }}
          onSubmit={async (url) => {
            const login = `${process.env.NEXT_PUBLIC_URL}/?login`;

            if (url === "/?login" || url === login) {
              await router.push("/");
            } else {
              await router.push(url || "/");
            }
          }}
        />
      )}
    </Flex>
  );
};
