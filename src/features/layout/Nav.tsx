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
import { OrgPopover } from "./OrgPopover";
import { LoginModal } from "features/modals/LoginModal";
import { useRouter } from "next/router";
import { QuestionIcon } from "@chakra-ui/icons";
import { useEffect } from "react";
import { breakpoints } from "theme/theme";

const linkList = css`
  & > a {
    ${tw`mr-4`}
    font-weight: bold;
  }

  @media (max-width: ${breakpoints.sm}) {
    & > a {
      display: block;
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
          <OrgPopover />

          <Menu>
            <MenuButton mr={3}>
              <Avatar
                name={session.user.userName}
                css={css`
                  // &:focus {
                  //   box-shadow: var(--chakra-shadows-outline);
                  // }
                `}
                src={session.user.image ? session.user.image : undefined}
                w="48px"
                h="48px"
              />
            </MenuButton>

            <MenuList>
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
                  await signOut({
                    redirect: false
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
        <Box mr={5} ml={isHome ? 5 : 0}>
          <Button
            variant="outline"
            colorScheme="purple"
            onClick={() => setIsLoginModalOpen(true)}
          >
            Connexion
          </Button>
        </Box>
      )}

      {isLoginModalOpen && (
        <LoginModal
          onClose={() => {
            setIsLoginModalOpen(false);
            //setIsLogin(false);
          }}
          onSubmit={(url) => {
            if (url) {
              router.push(url === "/?login" ? "/" : url);
            } else {
              router.push("/");
            }
            setIsLoginModalOpen(false);
          }}
        />
      )}
    </Flex>
  );
};
