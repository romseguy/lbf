import {
  MenuList,
  MenuItem,
  useColorMode,
  useToast,
  Switch
} from "@chakra-ui/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Link } from "features/common";
import { refetchSession } from "features/session/sessionSlice";
import { useEditUserMutation, useGetUserQuery } from "features/users/usersApi";
import { resetUserEmail } from "features/users/userSlice";
import { PageProps } from "pages/_app";
import { useAppDispatch } from "store";
import { base64ToUint8Array, defaultErrorMessage } from "utils/string";

interface customWindow extends Window {
  workbox?: any;
}

declare const window: customWindow;

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
  const isDark = colorMode === "dark";
  const router = useRouter();
  const toast = useToast({ position: "top" });
  const dispatch = useAppDispatch();
  const [editUser] = useEditUserMutation();
  const userQuery = useGetUserQuery({ slug: email });

  //#region push subscriptions
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const isSubscribed = !!subscription && !!userQuery.data?.userSubscription;
  const subscribe = async (
    serviceWorkerRegistration: ServiceWorkerRegistration
  ) => {
    try {
      const pushSubscription =
        await serviceWorkerRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: base64ToUint8Array(
            process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
          )
        });

      if (pushSubscription) {
        setSubscription(pushSubscription);
        await editUser({
          payload: { userSubscription: pushSubscription },
          slug: userName
        });
        userQuery.refetch();
        toast({
          status: "success",
          title: "Les notifications mobile sont activées"
        });
      }
    } catch (error) {
      console.log("serviceWorkerRegistration.pushManager.subscribe error");
      console.error(error);
      throw error;
    }
  };
  useEffect(() => {
    async function componentDidMount() {
      console.log("componentDidMount");

      if (!("serviceWorker" in navigator)) {
        console.warn("navigator.serviceWorker is missing");
        return;
      }

      if (!window.workbox) {
        console.warn("window.workbox is missing");
        return;
      }

      try {
        const serviceWorkerRegistration = await navigator.serviceWorker.ready;
        setRegistration(serviceWorkerRegistration);

        const pushSubscription =
          await serviceWorkerRegistration.pushManager.getSubscription();

        if (pushSubscription) setSubscription(pushSubscription);
        else await subscribe(serviceWorkerRegistration);
      } catch (error) {
        console.error(error);
        toast({
          status: "error",
          title:
            "Les notifications mobile n'ont pas pu être activées, êtes-vous connecté à internet ?"
        });
      }
    }
    componentDidMount();
  }, []);
  //#endregion

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

      <MenuItem isDisabled={userQuery.isLoading || userQuery.isFetching}>
        <Switch
          isChecked={isSubscribed}
          display="flex"
          alignItems="center"
          onClick={async () => {
            try {
              if (isSubscribed) {
                if (!subscription) throw new Error(defaultErrorMessage);

                await subscription.unsubscribe();
                await editUser({
                  payload: { userSubscription: null },
                  slug: userName
                });

                setSubscription(null);
                userQuery.refetch();

                toast({
                  status: "success",
                  title: "Notifications mobiles désactivées"
                });
              } else if (registration) {
                await subscribe(registration);
                toast({
                  status: "success",
                  title: "Notifications mobiles activées"
                });
              } else {
                throw new Error("todo");
              }
            } catch (error: any) {
              console.error(error);
              toast({
                status: "error",
                title: `Les notifications mobiles n'ont pas pu être ${
                  isSubscribed ? "désactivées" : "activées"
                }`
              });
            }
          }}
        >
          Notifications mobile
        </Switch>
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
