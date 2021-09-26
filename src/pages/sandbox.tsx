//@ts-nocheck
import React, { useState, useEffect } from "react";
import { Layout } from "features/layout";
import { Button, useToast } from "@chakra-ui/react";
import { base64ToUint8Array } from "utils/string";
import axios from "axios";

interface customWindow extends Window {
  workbox?: any;
}

declare const window: customWindow;

const Sandbox: React.FC = () => {
  // const toast = useToast({ position: "top" });
  // const [isSubscribed, setIsSubscribed] = useState(false);
  // const [subscription, setSubscription] = useState<PushSubscription | null>(
  //   null
  // );
  // const [registration, setRegistration] =
  //   useState<ServiceWorkerRegistration | null>(null);

  // useEffect(() => {
  //   if (
  //     typeof window !== "undefined" &&
  //     "serviceWorker" in navigator &&
  //     window.workbox !== undefined
  //   ) {
  //     // run only in browser
  //     navigator.serviceWorker.ready.then((reg) => {
  //       setRegistration(reg);

  //       reg.pushManager.getSubscription().then((sub) => {
  //         if (
  //           sub &&
  //           !(
  //             sub.expirationTime &&
  //             Date.now() > sub.expirationTime - 5 * 60 * 1000
  //           )
  //         ) {
  //           console.log("setting");
  //           setSubscription(sub);
  //           setIsSubscribed(true);
  //         }
  //       });
  //     });
  //   } else {
  //     if (window.workbox === undefined) {
  //       toast({
  //         status: "error",
  //         title: "could not find workbox"
  //       });
  //     }
  //   }
  // }, []);

  const [selectedFile, setSelectedFile] = useState();
  const [loaded, setLoaded] = useState(0);

  return (
    <Layout>
      {/* <form
        id="uploadForm"
        action="https://138.68.66.61/api"
        method="post"
        encType="multipart/form-data"
      >
        <input type="file" name="file" />
        <input type="submit" value="Upload!" />
      </form> */}

      <input
        type="file"
        onChange={(e) => {
          setSelectedFile(e.target.files[0]);
          setLoaded(0);
        }}
      />
      <Button
        onClick={async () => {
          const data = new FormData();
          data.append("file", selectedFile, selectedFile.name);

          try {
            const { statusText } = await axios.post(
              process.env.NEXT_PUBLIC_API2,
              data,
              {
                onUploadProgress: (ProgressEvent) => {
                  setLoaded((ProgressEvent.loaded / ProgressEvent.total) * 100);
                }
              }
            );
            console.log(statusText);
          } catch (error) {
            console.error(error);
          }
        }}
      >
        Upload
      </Button>
      <div> {Math.round(loaded)} %</div>

      {/* <Button
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
      </Button> */}
    </Layout>
  );
};

export default Sandbox;
