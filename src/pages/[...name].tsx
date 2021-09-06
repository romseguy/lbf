import type { IEvent } from "models/Event";
import type { IUser } from "models/User";
import type { IOrg } from "models/Org";
import React, { useEffect, useState } from "react";
import { GetServerSidePropsContext } from "next";
import { Alert, AlertIcon, Spinner, Text } from "@chakra-ui/react";
import { EventPage } from "features/events/EventPage";
import { Layout } from "features/layout";
import { OrgPage } from "features/orgs/OrgPage";
import { User } from "features/users/UserPage";
import { useRouter } from "next/router";
import api from "utils/api";

const Hash = ({}: // event,
// org,
// user,
// routeName,
// error
{
  // event?: IEvent;
  // org?: IOrg;
  // user?: IUser;
  // routeName: string;
  // error: any;
}) => {
  const router = useRouter();
  const routeName = router.asPath.substr(1, router.asPath.length);
  const [event, setEvent] = useState<IEvent | undefined>();
  const [org, setOrg] = useState<IOrg | undefined>();
  const [user, setUser] = useState<IUser | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    const xhr = async () => {
      const eventQuery = await api.get(`event/${routeName}`);

      if (eventQuery.data) {
        setEvent(eventQuery.data);

        const eventCreatedById =
          eventQuery.data.createdBy &&
          typeof eventQuery.data.createdBy === "object"
            ? eventQuery.data.createdBy._id
            : eventQuery.data.createdBy;

        const userQuery = await api.get(`user/${eventCreatedById}`);

        if (userQuery.data) setUser(user);
      } else {
        const orgQuery = await api.get(`org/${routeName}`);

        if (orgQuery.data) {
          setOrg(orgQuery.data);
        } else {
          const userQuery = await api.get(`user/${routeName}`);

          if (userQuery.data) setUser(userQuery.data);
          else
            setError(
              new Error(
                "La page demandée n'a pas été trouvée. Vous allez être redirigé vers la page d'accueil dans quelques secondes."
              )
            );
        }
      }
    };

    setEvent(undefined);
    setOrg(undefined);
    setUser(undefined);
    xhr();
  }, [router.asPath]);

  if (event) {
    return <EventPage event={event} user={user} routeName={routeName} />;
  }

  if (org) {
    return <OrgPage org={org} routeName={routeName} />;
  }

  if (user) {
    return <User user={user} routeName={routeName} />;
  }

  if (error) {
    setTimeout(() => {
      router.push("/");
    }, 2000);
  }

  return (
    <Layout pageTitle={error ? "Page introuvable" : ""}>
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <Alert status="error">
          <AlertIcon />
          {error.message}
        </Alert>
      ) : (
        <></>
      )}
    </Layout>
  );
};

export default Hash;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  if (!Array.isArray(ctx.query.name) || typeof ctx.query.name[0] !== "string") {
    return {
      props: {}
    };
  }

  let routeName = ctx.query.name[0];

  if (routeName.indexOf(" ") !== -1) {
    const destination = `/${routeName.replace(/\ /g, "_")}`;

    return {
      redirect: {
        permanent: false,
        destination
      }
    };
  }

  return { props: {} };
}
