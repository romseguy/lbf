import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "hooks/useAuth";
import md5 from "blueimp-md5";
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
import { setUserEmail } from "features/users/userSlice";
import { refetchSubscription } from "features/subscriptions/subscriptionSlice";

const linkList = css`
  & > a {
    font-weight: bold;
    ${tw`mr-4`}
  }

  @media (max-width: ${breakpoints.sm}) {
    & > a {
      display: block;
      margin: 0;
    }
    & > a:not(:first-of-type) {
      margin-top: 12px;
    }
  }
`;

export const Nav = ({
  isLogin = 0,
  ...props
}: SpaceProps & { isLogin?: number }) => {
  const router = useRouter();
  const { data: session, loading: isSessionLoading } = useSession();
  const dispatch = useAppDispatch();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(
    router.asPath === "/?login" || false
  );

  const styles = css`
    ${useColorModeValue(
      tw`h-24 bg-gradient-to-b from-white via-yellow-400 to-yellow-50`,
      tw`h-24 bg-gradient-to-b from-gray-800 via-green-600 to-gray-800`
    )}
    @media (min-width: ${breakpoints["2xl"]}) {
    }
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
      wrap="wrap"
      {...props}
      css={styles}
    >
      <Box css={linkList} ml={5}>
        {!isHome && (
          <Link href="/" data-cy="homeLink">
            Votre agenda local
          </Link>
        )}
        <Link href="/forum">Forum</Link>
      </Box>

      {isSessionLoading ? (
        <Spinner ml={5} mr={3} />
      ) : session ? (
        <Flex justify="flex-end" ml={5}>
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
                name={session.user.userName}
                css={css`
                  // &:focus {
                  //   box-shadow: var(--chakra-shadows-outline);
                  // }
                `}
                src={session.user.image ? session.user.image : undefined}
              />
            </MenuButton>

            <MenuList mr={[1, 3]}>
              <Link href={`/${encodeURIComponent(session.user.userName)}`}>
                <MenuItem>Mon compte</MenuItem>
              </Link>

              {/* 
              <NextLink href="/settings" passHref>
                <MenuItem as={ChakraLink}>Paramètres</MenuItem>
              </NextLink>
              */}

              <MenuItem
                onClick={async () => {
                  dispatch(setUserEmail());
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
