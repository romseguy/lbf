import { MenuList, MenuItem, useColorMode } from "@chakra-ui/react";
//import { useRouter } from "next/router";
import React from "react";
import { Link, SubscribeSwitch } from "features/common";
// import { setSession } from "features/session/sessionSlice";
// import { resetUserEmail } from "features/users/userSlice";
import { magic } from "lib/magic";
//import { Session } from "lib/SessionContext";
//import { useAppDispatch } from "store";
import { useSession } from "hooks/useAuth";

export const NavMenuList = ({
  email,
  userName
}: {
  email: string;
  userName: string;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  //const dispatch = useAppDispatch();
  //const router = useRouter();
  const { data: session, loading, setSession } = useSession();

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
          // const { url } = await signOut({
          //   redirect: false,
          //   callbackUrl: "/"
          // });
          // dispatch(resetUserEmail());
          // dispatch(setSession(null));
          magic.user.logout().then(() => {
            setSession(null);
          });
          //router.push(url);
        }}
        data-cy="logout"
      >
        Déconnexion
      </MenuItem>
    </MenuList>
  );
};
