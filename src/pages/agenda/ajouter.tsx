import React, { useEffect, useState } from "react";
import { EntityAddPage } from "features/common";
import { PageProps } from "main";
import { useSession } from "hooks/useSession";
import { useRouter } from "next/router";

const EventsAddPage = (props: PageProps) => {
  const router = useRouter();
  const { data: session, loading } = useSession();
  //const [isAdmin, setIsAdmin] = useState();

  useEffect(() => {
    if (!loading) {
      if (!session) {
        window.localStorage.setItem("path", router.asPath);
        router.push("/login", "/login", { shallow: true });
      } else if (!session.user.isAdmin) {
        throw new Error(
          "Vous devez être administrateur pour ajouter un événement"
        );
      }
    }
  }, [session, loading]);

  return <EntityAddPage {...props} />;
};

export default EventsAddPage;
