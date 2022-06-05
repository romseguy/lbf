import React from "react";
import { handleLoginWithSocial, magic } from "lib/magic";
import { Spinner } from "@chakra-ui/react";
import { SocialLogins } from "features/session/SocialLogins";
import { useSession } from "hooks/useAuth";
import { Link } from "features/common";

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
