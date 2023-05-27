import { MenuList, MenuItem, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { Link, SubscribeSwitch } from "features/common";
import { useSession } from "hooks/useSession";
import { useAppDispatch } from "store";
import { resetUserEmail } from "store/userSlice";
import api from "utils/api";
import { magic } from "utils/auth";

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
  const { data: session, setSession, setIsSessionLoading } = useSession();

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
        <>
          <MenuItem
            aria-hidden
            command={`${session.user.userId}`}
            cursor="default"
            _hover={{ bg: isDark ? "gray.700" : "white" }}
          />
          <MenuItem
            aria-hidden
            command={`${session.user.userName}`}
            cursor="default"
            _hover={{ bg: isDark ? "gray.700" : "white" }}
          />
        </>
      )}

      <Link
        aria-hidden
        data-cy="my-page"
        onClick={() => {
          router.push(`/${userName}`, `/${userName}`, { shallow: true });
        }}
      >
        <MenuItem>Le soleil de mon koala</MenuItem>
      </Link>

      <MenuItem>
        <SubscribeSwitch email={email} userName={userName} />
      </MenuItem>

      <MenuItem
        onClick={async () => {
          dispatch(setIsSessionLoading(true));
          dispatch(resetUserEmail());
          await magic.user.logout();
          await api.get("logout");
          dispatch(setSession(null));
          dispatch(setIsSessionLoading(false));
          router.push("/", "/", { shallow: false });
        }}
        data-cy="logout"
      >
        Déconnexion
      </MenuItem>
    </MenuList>
  );
};
