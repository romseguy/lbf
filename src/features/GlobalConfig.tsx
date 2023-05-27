import { useEffect } from "react";
import { useSession } from "hooks/useSession";
import { PageProps } from "main";
import { useAppDispatch } from "store";
import { setIsOffline } from "store/sessionSlice";
import { setSetting } from "store/settingSlice";
import { setUserEmail } from "store/userSlice";
import api from "utils/api";
import { devSession, magic } from "utils/auth";

export const GlobalConfig = ({ ...props }: PageProps) => {
  const dispatch = useAppDispatch();
  const { data: session, setIsSessionLoading, setSession } = useSession();

  useEffect(() => {
    if (session) dispatch(setIsSessionLoading(false));
  }, [session]);

  useEffect(function clientDidMount() {
    (async function checkLoginStatus() {
      if (session) return;

      try {
        const magicIsLoggedIn = await magic.user.isLoggedIn();
        console.log("checkLoginStatus: magicIsLoggedIn", magicIsLoggedIn);

        if (magicIsLoggedIn) {
          const metadata = await magic.user.getMetadata();
          //console.log("checkLoginStatus: metadata", metadata);

          if (metadata.email) {
            dispatch(setUserEmail(metadata.email));

            const res = await fetch(`/api/user/${metadata.email}`);
            //console.log(`res GET /api/user/${metadata.email}`, res);

            if (res.status === 200) {
              const user = await res.json();
              //console.log("checkLoginStatus: matched user profile", user);
              dispatch(
                setSession({
                  user: { ...user, email: metadata.email, userId: user.id }
                })
              );
            }
          } else {
            const metadataa = await magic.user.getMetadata();
            console.log("checkLoginStatus: metadataa", metadataa);
          }
        } else {
          //console.log("checkLoginStatus: magicIsLoggedOut");
        }

        dispatch(setIsSessionLoading(false));
      } catch (error) {
        //console.log("checkLoginStatus: isSessionLoading", false);
        dispatch(setIsSessionLoading(false));
      }
    })();

    (async function checkOnlineStatus() {
      try {
        const res = await api.get("check");
        if (res.status === 404) throw new Error();
      } catch (error) {
        dispatch(setIsOffline(true));
      }
    })();

    (async function initializeSettings() {
      try {
        // if (devSession && process.env.NODE_ENV === "development") {
        //   //console.log("SETTING DEV SESSION");
        //   dispatch(setSession(devSession));
        // }

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
      //console.log("offline_event");
      dispatch(setIsOffline(true));
    });

    window.addEventListener("online", () => {
      //console.log("online_event");
      dispatch(setIsOffline(false));
    });
  }, []);

  return null;
};
