import React, { useState, useEffect } from "react";
import { Layout } from "features/layout";
import { Button, useToast } from "@chakra-ui/react";
import { base64ToUint8Array } from "utils/string";

interface customWindow extends Window {
  workbox?: any;
}

declare const window: customWindow;

const Sandbox: React.FC = () => {
  const toast = useToast({ position: "top" });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.workbox !== undefined
    ) {
      // run only in browser
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);

        reg.pushManager.getSubscription().then((sub) => {
          if (
            sub &&
            !(
              sub.expirationTime &&
              Date.now() > sub.expirationTime - 5 * 60 * 1000
            )
          ) {
            console.log("setting");
            setSubscription(sub);
            setIsSubscribed(true);
          }
        });
      });
    } else {
      if (window.workbox === undefined) {
        toast({
          status: "error",
          title: "could not find workbox"
        });
      }
    }
  }, []);

  return (
    <Layout>
      <Button
        onClick={async (event) => {
          event.preventDefault();

          if (!registration) {
            toast({ status: "error", title: "registration null" });
            return;
          }

          try {
            const sub = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: base64ToUint8Array(
                process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
              )
            });

            // TODO: you should call your API to save subscription data on server in order to send web push notification from server
            setSubscription(sub);
            setIsSubscribed(true);

            toast({ status: "success", title: "subscribed" });
          } catch (error) {
            toast({ status: "error", title: error.message });
          }
        }}
        disabled={isSubscribed}
      >
        Subscribe
      </Button>

      <Button
        onClick={async (event) => {
          event.preventDefault();

          if (!subscription) {
            toast({ status: "error", title: "subscription null" });
            return;
          }

          try {
            await subscription.unsubscribe();
            // TODO: you should call your API to delete or invalidate subscription data on server
            setSubscription(null);
            setIsSubscribed(false);

            toast({ status: "success", title: "unsubscribed" });
          } catch (error) {
            toast({ status: "error", title: error.message });
          }
        }}
        disabled={!isSubscribed}
      >
        Unsubscribe
      </Button>

      <Button
        onClick={async (event) => {
          event.preventDefault();
          if (subscription === null) {
            toast({ status: "error", title: "subscription null" });
            return;
          }

          try {
            await fetch("/api/notification", {
              method: "POST",
              headers: {
                "Content-type": "application/json"
              },
              body: JSON.stringify({
                subscription
              })
            });
          } catch (error) {
            toast({ status: "error", title: error.message });
          }
        }}
        disabled={!isSubscribed}
      >
        Send Notification
      </Button>
    </Layout>
  );
};

export default Sandbox;
