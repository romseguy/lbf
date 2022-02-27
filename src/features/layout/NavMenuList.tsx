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
  session,
  email,
  userName
}: PageProps & {
  userName: string;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const toast = useToast({ position: "top" });
  const dispatch = useAppDispatch();
  const [editUser] = useEditUserMutation();
  const userQuery = useGetUserQuery({ slug: email || "" });

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
        title:
          "Vous avez activé les notifications mobile, vous pouvez les désactiver en cliquant sur votre avatar"
      });
    }
  };
  useEffect(() => {
    async function componentDidMount() {
      if (!("serviceWorker" in navigator)) {
        console.log("navigator.serviceWorker is missing");
        return;
      }

      if (!window.workbox) {
        console.log("window.workbox is missing");
        return;
      }

      const serviceWorkerRegistration = await navigator.serviceWorker.ready;
      setRegistration(serviceWorkerRegistration);
      const pushSubscription =
        await serviceWorkerRegistration.pushManager.getSubscription();
      if (pushSubscription) setSubscription(pushSubscription);
      else await subscribe(serviceWorkerRegistration);
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
          command={`${session?.user.userId}`}
          cursor="default"
          _hover={{ bg: isDark ? "gray.700" : "white" }}
        />
      )}

      <Link href={`/${userName}`} aria-hidden data-cy="my-page">
        <MenuItem>Ma page</MenuItem>
      </Link>

      <MenuItem
        isDisabled={
          registration === null || userQuery.isLoading || userQuery.isFetching
        }
      >
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
                  title: "Vous ne recevrez plus de notifications"
                });
              } else if (registration) {
                await subscribe(registration);
                toast({
                  status: "success",
                  title: "Vous acceptez de recevoir des notifications"
                });
              }
            } catch (error: any) {
              toast({
                status: "error",
                title: error.message
              });
            }
          }}
        >
          Notifications mobile {isSubscribed ? "activées" : "désactivées"}
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
