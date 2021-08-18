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
import { Forum } from "features/forum/Forum";
import { wrapper } from "store";
import { getEvent } from "features/events/eventsApi";
import { getOrg } from "features/orgs/orgsApi";
import { getUser } from "features/users/usersApi";

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

  if (routeName === "forum") {
    return <Forum />;
  }

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
      //router.push("/");
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

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async (ctx: GetServerSidePropsContext): Promise<any> => {
      if (!ctx.query.name || typeof ctx.query.name[0] !== "string") {
        return {
          props: { routeName: "forum" }
        };
      }

      let routeName = ctx.query.name![0];

      if (routeName) {
        if (routeName === "forum") {
          return { props: { routeName } };
        }

        const { data: event, ...eventQuery } = await store.dispatch(
          getEvent.initiate({ eventUrl: routeName })
        );

        if (event) {
          return { props: { event, routeName } };
        }

        const { data: org, ...orgQuery } = await store.dispatch(
          getOrg.initiate(routeName)
        );

        if (org) {
          return { props: { org, routeName } };
        }

        const { data: user, ...userQuery } = await store.dispatch(
          getUser.initiate(routeName)
        );

        if (user) {
          return { props: { user, routeName } };
        }
      }

      return Promise.resolve({ props: { routeName } });
    }
);
