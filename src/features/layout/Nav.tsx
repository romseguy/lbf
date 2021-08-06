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
  useColorModeValue,
  Spinner,
  Icon,
  SpaceProps
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
import { refetchSubscription } from "features/subscriptions/subscriptionSlice";
import { IoIosChatbubbles, IoIosPerson, IoMdPerson } from "react-icons/io";
import { CalendarIcon, ChatIcon } from "@chakra-ui/icons";
import { useSelector } from "react-redux";

const linkList = css`
  & > a {
    font-weight: bold;
    ${tw`mr-4`}
  }

  margin-left: 20px;

  @media (max-width: ${breakpoints.sm}) {
    margin-left: 0;

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
}: SpaceProps & { isLogin?: number }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session, loading: isSessionLoading } = useSession();
  const storedUserName = useSelector(selectUserName);
  const userName = storedUserName || (session && session.user.userName);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(
    router.asPath === "/?login" || false
  );

  const styles = css`
    ${useColorModeValue(
      tw`h-24 bg-gradient-to-b from-white via-yellow-400 to-yellow-50`,
      tw`h-24 bg-gradient-to-b from-gray-800 via-green-600 to-gray-800`
    )}
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
        <Link href="/" data-cy="homeLink">
          <Button
            bg="transparent"
            _hover={{
              bg: useColorModeValue("whiteAlpha.600", "blackAlpha.400")
            }}
            leftIcon={<CalendarIcon />}
          >
            Votre agenda local
          </Button>
        </Link>
        <Link href="/forum">
          <Button
            bg="transparent"
            _hover={{
              bg: useColorModeValue("whiteAlpha.600", "blackAlpha.400")
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
          <OrgPopover boxSize={[8, 10, 12]} />
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
                src={session.user.image ? session.user.image : undefined}
              />
            </MenuButton>

            <MenuList mr={[1, 3]}>
              <MenuItem
                command={`@${userName}`}
                cursor="default"
                _hover={{ bg: "white" }}
              ></MenuItem>

              <Link href={`/${encodeURIComponent(userName)}`}>
                <MenuItem>Ma page</MenuItem>
              </Link>

              {/* 
              <NextLink href="/settings" passHref>
                <MenuItem as={ChakraLink}>Paramètres</MenuItem>
              </NextLink>
              */}

              <MenuItem
                onClick={async () => {
                  dispatch(setSubscribedEmail());
                  await signOut({
                    //redirect: false
                  });
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

          <Box mr={5} ml={5}>
            <Button
              variant="outline"
              colorScheme="purple"
              onClick={() => setIsLoginModalOpen(true)}
              data-cy="login"
            >
              Connexion
            </Button>
          </Box>
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
