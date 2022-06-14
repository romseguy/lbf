import { Box, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { setUserEmail } from "features/users/userSlice";
import { useSession } from "hooks/useAuth";
import { magic } from "lib/magic";
import { useAppDispatch } from "store";
import { PageProps } from "./_app";

const CallbackPage = (props: PageProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { setSession } = useSession();

  const finishSocialLogin = async () => {
    let result = await magic.oauth.getRedirectResult();
    authenticateWithServer(result.magic.idToken);
  };

  const finishEmailRedirectLogin = () => {
    if (router.query.magic_credential)
      magic.auth
        .loginWithCredential()
        .then((didToken) => authenticateWithServer(didToken));
  };

  const authenticateWithServer = async (didToken: string | null) => {
    try {
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
        console.log("user", user);

        dispatch(setUserEmail(user.email));
        setSession({ user });
        router.push("/", "/", { shallow: true });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    router.query.provider ? finishSocialLogin() : finishEmailRedirectLogin();
  }, [router.query]);

  return (
    <Box position="absolute" top="50%" left="50%">
      <Spinner />
    </Box>
  );
};

export default CallbackPage;
