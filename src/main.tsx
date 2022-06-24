import { useColorMode } from "@chakra-ui/react";
import { NextPage } from "next";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { GlobalStyles } from "features/layout";
import { useAppDispatch } from "store";
import { setIsOffline } from "store/sessionSlice";
import { selectUserEmail, setUserEmail } from "store/userSlice";
import api from "utils/api";
import { devSession, magic, Session } from "utils/auth";

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
        const { data: session } = await api.get("user");

        if (session.user) {
          props.setSession(session);
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

    (async function checkOnlineStatus() {
      try {
        const res = await api.get("check");
        if (res.status === 404) throw new Error();
      } catch (error) {
        dispatch(setIsOffline(true));
        props.setIsSessionLoading(false);
        if (process.env.NODE_ENV === "development") {
          props.setSession(devSession);
        }
      }
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
        email={
          props.session ? props.session.user.email : email ? email : userEmail
        }
      />
    </>
  );
};
