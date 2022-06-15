import { Spinner } from "@chakra-ui/react";
import React from "react";
import { SocialLogins } from "features/session/SocialLogins";
import { Link } from "features/common";
import { useSession } from "hooks/useSession";
import { handleLoginWithSocial, magic } from "utils/auth";

const Sandbox = () => {
  const { data: session, loading, setSession } = useSession();

  console.log("SANDBOX SESSION", session, loading, setSession);

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

  return <SocialLogins onSubmit={handleLoginWithSocial} />;
};

export default Sandbox;
