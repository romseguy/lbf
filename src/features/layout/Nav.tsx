import type { IOrg } from "models/Org";
import React, { useState } from "react";
import { signOut } from "next-auth/react";
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
  BoxProps
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
  setSubscribedEmail
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

const linkList = css`
  & > a {
    font-weight: bold;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  @media (max-width: ${breakpoints.sm}) {
    margin-left: 0;

    button {
      font-size: 0.8rem;
    }

    & > a {
      display: block;
      margin: 0;
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
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session, loading: isSessionLoading } = useSession();
  const storedUserEmail = useSelector(selectUserEmail);
  const userEmail = storedUserEmail || session?.user.email || "";
  const storedUserName = useSelector(selectUserName);
  const userName = storedUserName || session?.user.userName || "";

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(
    router.asPath === "/?login" || false
  );

  const styles = css`
    height: auto !important;
    ${isDark
      ? tw`h-24 bg-gradient-to-b from-gray-800 via-green-600 to-gray-800`
      : tw`h-24 bg-gradient-to-b from-white via-yellow-400 to-yellow-50`}
  `;

  const isHome = router.asPath === "/";

  useEffect(() => {
    if (isLogin !== 0) {
      setIsLoginModalOpen(true);
    }
  }, [isLogin]);

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
        <Link href="/" data-cy="homeLink" aria-hidden>
          <Button
            bg="transparent"
            _hover={{
              bg: isDark ? "blackAlpha.400" : "whiteAlpha.600"
            }}
            leftIcon={<CalendarIcon />}
          >
            Votre calendrier local
          </Button>
        </Link>

        <Link href="/orgs" aria-hidden shallow>
          <Button
            bg="transparent"
            _hover={{
              bg: isDark ? "blackAlpha.400" : "whiteAlpha.600"
            }}
            leftIcon={<IoIosPeople />}
          >
            Organisations
          </Button>
        </Link>

        <Link href="/forum" aria-hidden shallow>
          <Button
            bg="transparent"
            _hover={{
              bg: isDark ? "blackAlpha.400" : "whiteAlpha.600"
            }}
            leftIcon={<ChatIcon />}
          >
            Forum
          </Button>
        </Link>
      </Box>

      {isSessionLoading ? (
        <Spinner ml={5} mr={3} />
      ) : session ? (
        <Flex justify="flex-end" css={buttonList}>
          <EmailSubscriptionsPopover
            email={session.user.email}
            mr={[1, 3]}
            boxSize={[8, 10, 10]}
          />
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
                  session.user.userImage ? session.user.userImage : undefined
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

              {/* 
              <NextLink href="/settings" passHref>
                <MenuItem as={ChakraLink}>Paramètres</MenuItem>
              </NextLink>
              */}

              <MenuItem
                onClick={async () => {
                  dispatch(setSubscribedEmail(null));
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
              mx={3}
              onClick={() => setIsLoginModalOpen(true)}
              aria-label="Connexion"
              bg="transparent"
              _hover={{ bg: "transparent" }}
              icon={<Icon as={FaPowerOff} boxSize={[8, 10, 10]} />}
            />
          ) : (
            <Box mr={5} ml={5}>
              {isServer() ? (
                <Spinner mt={2} />
              ) : (
                <Button
                  variant="outline"
                  colorScheme="purple"
                  onClick={() => setIsLoginModalOpen(true)}
                  data-cy="login"
                >
                  Connexion
                </Button>
              )}
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
