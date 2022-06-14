import { MenuList, MenuItem, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { Link, SubscribeSwitch } from "features/common";
import { resetUserEmail } from "features/users/userSlice";
import { useSession } from "hooks/useAuth";
import { magic } from "lib/magic";
import { useAppDispatch } from "store";
import api from "utils/api";

export const NavMenuList = ({
  email,
  userName
}: {
  email: string;
  userName: string;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    data: session,
    loading,
    setSession,
    setIsSessionLoading
  } = useSession();

  if (!session) return null;

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
          setIsSessionLoading(true);
          dispatch(resetUserEmail());
          await magic.user.logout();
          await api.get("logout");
          setSession(null);
          setIsSessionLoading(false);
          router.push("/", "/", { shallow: true });
        }}
        data-cy="logout"
      >
        Déconnexion
      </MenuItem>
    </MenuList>
  );
};
