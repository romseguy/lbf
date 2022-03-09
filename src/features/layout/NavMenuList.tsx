import { MenuList, MenuItem, useColorMode } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { Link, SubscribeSwitch } from "features/common";
import { refetchSession } from "features/session/sessionSlice";
import { resetUserEmail } from "features/users/userSlice";
import { PageProps } from "pages/_app";
import { useAppDispatch } from "store";

export const NavMenuList = ({
  email,
  session,
  userName
}: Omit<PageProps, "isMobile"> & {
  email: string;
  session: Session;
  userName: string;
}) => {
  const { colorMode } = useColorMode();
  const dispatch = useAppDispatch();
  const isDark = colorMode === "dark";
  const router = useRouter();

  return (
    <MenuList mr={[1, 3]}>
      <MenuItem
        aria-hidden
        command={`${email}`}
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

      <Link href={`/${userName}`} aria-hidden data-cy="my-page">
        <MenuItem>Ma page</MenuItem>
      </Link>

      <MenuItem>
        <SubscribeSwitch email={email} userName={userName} />
      </MenuItem>

      <MenuItem
        onClick={async () => {
          const { url } = await signOut({
            redirect: false,
            callbackUrl: "/"
          });
          dispatch(refetchSession());
          dispatch(resetUserEmail());
          router.push(url);
        }}
        data-cy="logout"
      >
        Déconnexion
      </MenuItem>
    </MenuList>
  );
};
