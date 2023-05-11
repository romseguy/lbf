import { Spinner } from "@chakra-ui/react";
import { OAuthProvider } from "@magic-ext/oauth";
import React from "react";
import { SocialLogins } from "features/session/SocialLogins";
import { Link } from "features/common";
import { useSession } from "hooks/useSession";
import { magic } from "utils/auth";

const Sandbox = () => {
  const { data: session, loading, setSession } = useSession();
  console.log("SANDBOX SESSION", session, loading);

  const onLoginWithSocial = async (provider: OAuthProvider) => {
    await magic.oauth.loginWithRedirect({
      provider,
      redirectURI: new URL("/callback", window.location.origin).href
    });
  };

  if (loading) return <Spinner />;

  if (session)
    return (
      <Link
        onClick={() => {
          magic.user.logout().then(() => {
            setSession(null);
          });
        }}
      >
        Logout
      </Link>
    );

  return <SocialLogins onSubmit={onLoginWithSocial} />;
};

export default Sandbox;
