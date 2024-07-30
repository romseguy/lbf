import { useSession } from "hooks/useSession";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "store";
import { setIsOffline } from "store/sessionSlice";
import {
  selectIsMobile,
  selectScreenHeight,
  selectScreenWidth,
  setScreenHeight,
  setScreenWidth
} from "store/uiSlice";
import api from "utils/api";

const controller = new AbortController();
const signal = controller.signal;

export const GlobalConfig = ({}: {}) => {
  const dispatch = useAppDispatch();
  const isMobile = useSelector(selectIsMobile);
  const router = useRouter();
  //const { data: session, loading } = useSession();
  const screenHeight = useSelector(selectScreenHeight);
  const screenWidth = useSelector(selectScreenWidth);

  useEffect(() => {
    //if (!session) dispatch(setIsSessionLoading(true));

    (async function checkOnlineStatus() {
      const res = await api.get("check", undefined, {
        isLoggingDisabled: true
      });
      if (res.status === 504) dispatch(setIsOffline(true));
    })();

    window.addEventListener("offline", () => {
      dispatch(setIsOffline(true));
    });

    window.addEventListener("online", () => {
      dispatch(setIsOffline(false));
    });

    const updateScreenDimensions = () => {
      const newScreenHeight = window.innerHeight;
      const newScreenWidth = window.innerWidth - 15;
      if (newScreenHeight !== screenHeight)
        dispatch(setScreenHeight(newScreenHeight));
      if (newScreenWidth !== screenWidth)
        dispatch(setScreenWidth(newScreenWidth));
    };

    if (!isMobile) {
      updateScreenDimensions();
      window.addEventListener("resize", updateScreenDimensions);
      signal.addEventListener("abort", () => {
        window.removeEventListener("resize", updateScreenDimensions);
      });
    }

    return () => {
      if (!isMobile) controller.abort();
    };
  }, [router.asPath]);

  return null;
};

{
  /*
    const settingsQuery = useGetSettingsQuery();
    useEffect(() => {
      if (Array.isArray(settingsQuery.data) && settingsQuery.data.length > 0)
        settingsQuery.data.forEach(({ settingName, settingValue }) => {
          dispatch(setSetting({ settingName, settingValue }));
        });
    }, [settingsQuery.data]);
  */
}

{
  /*
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
  */
}
