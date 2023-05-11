import { Box, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { magic } from "utils/auth";
import { PageProps } from "main";

const CallbackPage = (props: PageProps) => {
  const router = useRouter();
  useEffect(() => {
    if (router.query.provider) {
      magic.oauth.getRedirectResult().then(async (result) => {
        const didToken = result.magic.idToken;
        await fetch("/api/login", {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + didToken
          }
        });
        window.location.href = "/";
      });
    } else {
      magic.auth.loginWithCredential().then(async (didToken) => {
        await fetch("/api/login", {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + didToken
          }
        });
        window.location.href = "/";
      });
    }
  }, []);

  return (
    <Box position="absolute" top="50%" left="50%">
      <Spinner />
    </Box>
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
