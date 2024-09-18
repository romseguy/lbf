import {
  MenuList,
  MenuItem,
  Text,
  useColorMode,
  MenuListProps
} from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import { useRouter } from "next/router";
import React from "react";
import { Link } from "features/common";
import { useSession } from "hooks/useSession";
import { useAppDispatch } from "store";
import { resetUserEmail } from "store/userSlice";
import api from "utils/api";
import { magic } from "utils/auth";
import { IEntity, isEvent, isOrg } from "models/Entity";
import { IUser } from "models/User";
import { getEmail } from "models/Subscription";
const { getEnv } = require("utils/env");

export const NavMenuList = ({
  entity,
  email,
  userName,
  ...props
}: MenuListProps & {
  entity?: IEntity | IUser;
  email: string;
  userName: string;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session, setSession, setIsSessionLoading } = useSession();
  const isO = isOrg(entity);

  if (!session) return null;

  return (
    <MenuList mr={[1, 3]} {...props}>
      <MenuItem
        aria-hidden
        command={`${session.user.userName}`}
        cursor="default"
        _hover={{ bg: isDark ? "gray.700" : "white" }}
      />
      <MenuItem
        aria-hidden
        command={`${email} ${session.user.isAdmin ? "(admin)" : ""}`}
        cursor="default"
        _hover={{ bg: isDark ? "gray.700" : "white" }}
      />
      {getEnv() === "development" && (
        <>
          {isO && (
            <MenuItem
              command={
                session?.user.isAdmin ||
                !!(
                  entity.orgLists.find(
                    ({ listName }) => listName === "Participants"
                  )?.subscriptions || []
                ).find((sub) => getEmail(sub) === session?.user.email)
                  ? "isAttendee"
                  : "notAttendee"
              }
            />
          )}

          <MenuItem
            aria-hidden
            command={`${entity ? entity._id : session.user.userId}`}
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

      {/* <MenuItem>
        <SubscribeSwitch email={email} userName={userName} />
      </MenuItem> */}

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

            if (await magic.user.isLoggedIn()) {
              await magic.user.logout();
            }

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
