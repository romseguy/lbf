import { Spinner } from "@chakra-ui/react";
import React, { useEffect, useContext } from "react";
import Router, { useRouter } from "next/router";
import { magic } from "lib/magic";
import { SessionContext } from "lib/SessionContext";
import { useSession } from "hooks/useAuth";

const Callback = () => {
  const router = useRouter();
  const { setSession } = useSession();

  // The redirect contains a `provider` query param if the user is logging in with a social provider
  useEffect(() => {
    router.query.provider ? finishSocialLogin() : finishEmailRedirectLogin();
  }, [router.query]);

  // `getRedirectResult()` returns an object with user data from Magic and the social provider
  const finishSocialLogin = async () => {
    let result = await magic.oauth.getRedirectResult();
    authenticateWithServer(result.magic.idToken);
  };

  // `loginWithCredential()` returns a didToken for the user logging in
  const finishEmailRedirectLogin = () => {
    if (router.query.magic_credential)
      magic.auth
        .loginWithCredential()
        .then((didToken) => authenticateWithServer(didToken));
  };

  // Send token to server to validate
  const authenticateWithServer = async (didToken: string | null) => {
    let res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + didToken
      }
    });
    let data = await res.json();
    console.log("data1", data);

    if (res.status === 200) {
      // Set the SessionContext to the now logged in user
      let userMetadata = await magic.user.getMetadata();
      setSession({ user: userMetadata });

      res = await fetch("/api/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + didToken
        }
      });
      data = await res.json();
      console.log("data2", data);

      //Router.push("/sandbox");
    }
  };

  return React.createElement(Spinner);
};

export default Callback;
