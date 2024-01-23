import { Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { SimpleLayout } from "features/layout";
import { PageProps } from "main";
import { selectIsOffline } from "store/sessionSlice";
import { magic } from "utils/auth";

const CallbackPage = (props: PageProps) => {
  const isOffline = useSelector(selectIsOffline);
  const router = useRouter();

  useEffect(() => {
    console.log("🚀 ~ CallbackPage ~ isOffline:", isOffline);
    if (isOffline) window.location.href = "/";
  }, [isOffline]);

  useEffect(() => {
    (async function onRouterQueryChange() {
      try {
        if (router.query.provider) {
          const result = await magic.oauth.getRedirectResult();
          const didToken = result.magic.idToken;
          await fetch("/api/login", {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + didToken
            }
          });
          window.location.href = "/";
        } else if (typeof router.query.magic_credential === "string") {
          const didToken = await magic.auth.loginWithCredential(
            router.query.magic_credential
          );
          const response = await fetch("/api/login", {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + didToken
            }
          });
          const json = await response.json();
          console.log("🚀 ~ CallbackPage ~ json:", json);
          window.location.href = "/";
        } else {
          console.log("🚀 ~ CallbackPage ~ no query params");
          window.location.href = "/";
        }
      } catch (error) {
        console.log("🚀 ~ CallbackPage ~ error:", error);
        window.location.href = "/";
      }
    })();
  }, [router.query]);

  return (
    <SimpleLayout {...props} title="Veuillez patienter...">
      <Spinner />
    </SimpleLayout>
  );
};

{
  /*
  import { useRouter } from "next/router";
  import { setUserEmail } from "store/userSlice";
  import { useSession } from "hooks/useSession";
  import { useAppDispatch } from "store";

  const CallbackPageWithSocialLogin = (props: PageProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { setSession } = useSession();

  const finishSocialLogin = async () => {
    console.log("finishSocialLogin", router.query.provider);
    let result = await magic.oauth.getRedirectResult();
    authenticateWithServer(result.magic.idToken);
  };

  const finishEmailRedirectLogin = () => {
    console.log("finishEmailRedirectLogin", router.query.magic_credential);

    if (router.query.magic_credential)
      magic.auth
        .loginWithCredential()
        .then((didToken) => authenticateWithServer(didToken));
  };

  const authenticateWithServer = async (didToken: string | null) => {
    try {
      console.log("authenticateWithServer", didToken);

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + didToken
        }
      });

      if (res.status === 200) {
        //const user = await magic.user.getMetadata();
        const user = await res.json();
        console.log("/callback user:", user);

        dispatch(setUserEmail(user.email));
        setSession({ user });
        router.push("/", "/", { shallow: true });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log("router.query", router.query);

    if (router.query.provider) finishSocialLogin();
    else finishEmailRedirectLogin();
  }, [router.query]);

  return (
    <Box position="absolute" top="50%" left="50%">
      <Spinner />
    </Box>
  );
};
*/
}

export default CallbackPage;
// import dynamic from "next/dynamic";
// const NoSSRCallbackPage = dynamic(async () => CallbackPage, { ssr: false });
// export default NoSSRCallbackPage;
