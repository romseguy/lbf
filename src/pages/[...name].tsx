import type { IEvent } from "models/Event";
import type { IUser } from "models/User";
import type { IOrg } from "models/Org";
import React from "react";
import { GetServerSidePropsContext } from "next";
import { Alert, AlertIcon, Text } from "@chakra-ui/react";
import { EventPage } from "features/events/EventPage";
import { Layout } from "features/layout";
import { OrgPage } from "features/orgs/OrgPage";
import { User } from "features/users/UserPage";
import { useRouter } from "next/router";
import { isServer } from "utils/isServer";
import { wrapper } from "store";
import { getEvent } from "features/events/eventsApi";
import { getOrg } from "features/orgs/orgsApi";
import { getUser } from "features/users/usersApi";
import api from "utils/api";

const Hash = ({
  event,
  org,
  user,
  routeName,
  error
}: {
  event?: IEvent;
  org?: IOrg;
  user?: IUser;
  routeName: string;
  error: any;
}) => {
  const router = useRouter();

  if (event) {
    return <EventPage event={event} user={user} routeName={routeName} />;
  }

  if (org) {
    return <OrgPage org={org} routeName={routeName} />;
  }

  if (user) {
    return <User user={user} routeName={routeName} />;
  }

  if (!isServer() && !error) {
    setTimeout(() => {
      router.push("/");
    }, 2000);
  }

  return (
    <Layout pageTitle={error ? "Événement privé" : "Page introuvable"}>
      {error ? (
        <Alert status="error">
          <AlertIcon />
          {error.message}
        </Alert>
      ) : (
        <Text>
          La page demandée n'a pas été trouvée. Vous allez être redirigé vers la
          page d'accueil dans quelques secondes.
        </Text>
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

  const { data: event } = await api.get(`event/${routeName}`);

  if (event) {
    const props: { event: IEvent; routeName: string; user?: IUser } = {
      event,
      routeName
    };
    const eventCreatedById =
      event.createdBy && typeof event.createdBy === "object"
        ? event.createdBy._id
        : event.createdBy;
    const { data: user } = await api.get(`user/${eventCreatedById}`);
    if (user) props.user = user;

    return {
      props
    };
  }

  const { data: org } = await api.get(`org/${routeName}`);

  if (org) {
    return { props: { org, routeName } };
  }

  const { data: user } = await api.get(`user/${routeName}`);

  if (user) {
    return { props: { user, routeName } };
  }

  return { props: { routeName } };
}
