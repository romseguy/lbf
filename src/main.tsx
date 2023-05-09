//import type { MagicUserMetadata } from 'magic-sdk';

import { useColorMode } from "@chakra-ui/react";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GlobalStyles } from "features/layout";
import { useAppDispatch } from "store";
import { setIsOffline } from "store/sessionSlice";
import { selectUserEmail, setUserEmail } from "store/userSlice";
import api from "utils/api";
import { devSession, magic, Session } from "utils/auth";
import { setSetting } from "store/settingSlice";

export interface PageProps {
  email: string;
  isMobile: boolean;
  isSessionLoading: boolean;
  session: Session | null;
  setIsSessionLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
}

export const Main = ({
  Component,
  email,
  ...props
}: PageProps & { Component: NextPage<PageProps> }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const dispatch = useAppDispatch();
  const userEmail = useSelector(selectUserEmail);

  useEffect(function clientDidMount() {
    (async function checkLoginStatus() {
      try {
        const magicIsLoggedIn = await magic.user.isLoggedIn();

        if (magicIsLoggedIn) {
          const metadata = await magic.user.getMetadata();
          //console.log("metadata", metadata);

          if (metadata.email) {
            dispatch(setUserEmail(metadata.email));

            const res = await fetch(`/api/user/${metadata.email}`);
            //console.log(`res GET /api/user/${metadata.email}`, res);

            if (res.status === 200) {
              const user = await res.json();
              console.log("user", user);
              props.setSession({
                user: { ...user, email: metadata.email, userId: user.id }
              });
            }
          }
        }

        props.setIsSessionLoading(false);
      } catch (error) {
        props.setSession(null);
        props.setIsSessionLoading(false);
      }
    })();

    (async function checkOnlineStatus() {
      try {
        const res = await api.get("check");
        if (res.status === 404) throw new Error();
      } catch (error) {
        dispatch(setIsOffline(true));
        props.setIsSessionLoading(false);
        if (process.env.NODE_ENV === "development") {
          console.log("SETTING DEV SESSION");
          props.setSession(devSession);
        }
      }
    })();

    (async function initializeSettings() {
      try {
        const res = await fetch(`/api/settings`);

        if (res.status === 200) {
          const settings = await res.json();
          if (Array.isArray(settings) && settings.length > 0)
            settings.forEach(({ settingName, settingValue }) => {
              dispatch(setSetting({ settingName, settingValue }));
            });
        }
      } catch (error) {}
    })();

    window.addEventListener("offline", () => {
      console.log("offline_event");
      dispatch(setIsOffline(true));
    });

    window.addEventListener("online", () => {
      console.log("online_event");
      dispatch(setIsOffline(false));
    });
  }, []);

  return (
    <>
      <GlobalStyles isDark={isDark} />
      <Component
        {...props}
        //isMobile
        email={
          props.session ? props.session.user.email : email ? email : userEmail
        }
      />
    </>
  );
};

{
  /*
    (async function checkLoginStatus() {
      try {
        const { data: session } = await api.get("user");

        if (session.user) {
          props.setSession(session);
          console.log("SETTING SERVER SESSION");
          dispatch(setUserEmail(session.user.email));
        } else {
          const isLoggedIn = await magic.user.isLoggedIn();

          if (isLoggedIn) {
            const didToken = await magic.user.getIdToken({
              lifespan: 60 * 60 * 10
            });

            const res = await fetch("/api/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + didToken
              }
            });

            if (res.status === 200) {
              const user = await res.json();
              console.log("SETTING MAGIC SESSION", user);
              props.setSession({ user });
              dispatch(setUserEmail(session.user.email));
            }
          }
        }

        props.setIsSessionLoading(false);
      } catch (error) {
        props.setSession(null);
        props.setIsSessionLoading(false);
      }
    })();
  */
}
