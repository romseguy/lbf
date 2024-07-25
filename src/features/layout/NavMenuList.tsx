import {
  MenuList,
  MenuItem,
  Text,
  useColorMode,
  Box,
  Tooltip
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { DarkModeSwitch, Link, SubscribeSwitch } from "features/common";
import { useSession } from "hooks/useSession";
import { useAppDispatch } from "store";
import { resetUserEmail } from "store/userSlice";
import api from "utils/api";
import { magic } from "utils/auth";
const { getEnv } = require("utils/env");

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
        command={`${email} ${session.user.isAdmin ? "(admin)" : ""}`}
        cursor="default"
        _hover={{ bg: isDark ? "gray.700" : "white" }}
      />
      {getEnv() === "development" && (
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
      {/* <Link
        aria-hidden
        data-cy="my-page"
        onClick={() => {
          router.push(`/${userName}`, `/${userName}`, { shallow: true });
        }}
      >
        <MenuItem>Ma page</MenuItem>
      </Link> */}

      <MenuItem>
        <SubscribeSwitch email={email} userName={userName} />
      </MenuItem>

      <MenuItem>
        <Link href="/password" shallow>
          Configurer votre compte
        </Link>
      </MenuItem>

      <MenuItem>
        <Text
          onClick={async () => {
            dispatch(setIsSessionLoading(true));
            dispatch(resetUserEmail());
            await magic.user.logout();
            await api.get("logout");
            dispatch(setSession(null));
            dispatch(setIsSessionLoading(false));
            router.push("/", "/", { shallow: false });
          }}
        >
          Se déconnecter
        </Text>
      </MenuItem>
      {/* <MenuItem>
        <Tooltip
          placement="top-start"
          label={`Basculer vers le thème ${isDark ? "clair" : "sombre"}`}
          hasArrow
        >
          <Box>
            <DarkModeSwitch />
          </Box>
        </Tooltip>
      </MenuItem> */}
    </MenuList>
  );
};
