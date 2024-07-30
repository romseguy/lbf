import React, { useEffect } from "react";
import { EntityAddPage } from "features/common";
import { PageProps } from "main";
import { useSession } from "hooks/useSession";
import { useRouter } from "next/router";
import { useErrorBoundary } from "react-error-boundary";

const EventsAddPage = (props: PageProps) => {
  const { showBoundary } = useErrorBoundary();
  const router = useRouter();
  const { data: session, loading } = useSession();

  useEffect(() => {
    if (!loading) {
      if (!session) {
        window.localStorage.setItem("path", router.asPath);
        router.push("/login", "/login", { shallow: true });
      } else if (!session.user.isAdmin) {
        showBoundary(
          new Error("Vous devez être administrateur pour accéder à cette page")
        );
      }
    }
  }, [session, loading]);

  return <EntityAddPage {...props} />;
};

export default EventsAddPage;
