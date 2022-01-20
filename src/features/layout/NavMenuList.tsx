import { MenuList, MenuItem, useColorMode, useToast } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Link } from "features/common";
import { setSession } from "features/session/sessionSlice";
import { useEditUserMutation, useGetUserQuery } from "features/users/usersApi";
import { setUserEmail } from "features/users/userSlice";
import { useAppDispatch } from "store";
import { isServer } from "utils/isServer";
import { base64ToUint8Array } from "utils/string";

interface customWindow extends Window {
  workbox?: any;
}

declare const window: customWindow;

export const NavMenuList = ({
  session,
  userEmail,
  userName
}: {
  session: Session;
  userEmail: string;
  userName: string;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const toast = useToast({ position: "top" });
  const dispatch = useAppDispatch();

  //#region push subscriptions
  const savePushSubscription = async () => {
    const pushSubscription = await registration!.pushManager.subscribe({
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
      }).unwrap();
      userQuery.refetch();
      toast({
        status: "success",
        title:
          "Vous acceptez de recevoir des notifications, vous pouvez les désactiver en cliquant sur votre avatar"
      });
    }
  };

  const [editUser, editUserMutation] = useEditUserMutation();
  const userQuery = useGetUserQuery({ slug: userEmail });
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const isSubscribed = !!subscription;
  useEffect(() => {
    if (isServer()) return;

    if ("serviceWorker" in navigator && window.workbox) {
      navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
        console.log(
          "navigator.serviceWorker.ready: serviceWorkerRegistration",
          serviceWorkerRegistration
        );
        setRegistration(serviceWorkerRegistration);

        serviceWorkerRegistration.pushManager
          .getSubscription()
          .then(async (pushSubscription) => {
            console.log(
              "registration.pushManager.getSubscription",
              pushSubscription
            );

            if (pushSubscription) setSubscription(pushSubscription);
            else await savePushSubscription();
          });
      });
    }
  }, []);
  //#endregion

  return (
    <MenuList mr={[1, 3]}>
      <MenuItem
        aria-hidden
        command={`${userEmail}`}
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

      <MenuItem
        isDisabled={
          registration === null || userQuery.isLoading || userQuery.isFetching
        }
        onClick={async () => {
          try {
            if (isSubscribed && userQuery.data?.userSubscription) {
              if (!subscription) throw new Error("Une erreur est survenue.");

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
            } else {
              await savePushSubscription();
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
        {isSubscribed && userQuery.data?.userSubscription
          ? "Refuser"
          : "Accepter"}{" "}
        les notifications
      </MenuItem>

      <MenuItem
        onClick={async () => {
          const { url } = await signOut({
            redirect: false,
            callbackUrl: "/"
          });
          dispatch(setUserEmail(null));
          dispatch(setSession(null));
          router.push(url);
        }}
        data-cy="logout"
      >
        Déconnexion
      </MenuItem>
    </MenuList>
  );
};
