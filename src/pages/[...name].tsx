import React, { useEffect, useState } from "react";
import type { IEvent } from "models/Event";
import type { IUser } from "models/User";
import type { IOrg } from "models/Org";
import api from "utils/api";
import { GetServerSidePropsContext } from "next";
import { EventPage } from "features/events/EventPage";
import { Layout } from "features/layout";
import { OrgPage } from "features/orgs/OrgPage";
import { User } from "features/users/UserPage";
import { useRouter } from "next/router";
import { isServer } from "utils/isServer";
import { Forum } from "features/forum/Forum";

const Hash = ({
  event,
  org,
  user,
  routeName
}: {
  event?: IEvent;
  org?: IOrg;
  user?: IUser;
  routeName: string;
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

  if (!isServer()) router.push("/");

  return (
    <Layout>
      La page demandée n'a pas été trouvée. Vous allez être redirigé vers la
      page d'accueil.
    </Layout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  let routeName = decodeURIComponent(ctx.query.name![0]);

  if (routeName === "forum") {
    return { props: { routeName } };
  }

  if (routeName.indexOf(" ") !== -1) {
    const destination = `/${encodeURIComponent(routeName.replace(/\ /g, "_"))}`;

    return {
      redirect: {
        permanent: false,
        destination
      }
    };
  } else if (routeName.indexOf("_") !== -1) {
    routeName = routeName.replace(/_/g, " ");
  }

  const { data: event } = await api.get(`event/${routeName}`);

  if (event) {
    const { data: user } = await api.get(`user/${event.createdBy._id}`);

    return {
      props: { event, user, routeName }
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

export default Hash;

// https://github.com/reduxjs/redux-toolkit/issues/1240
// export const getServerSideProps = wrapper.getServerSideProps(
//   (store) =>
//     async ({ req, res }) => {
//       let name: string | undefined;

//       if (req.url) {
//         const matches = req.url.match(/[^/?]*[^/?]/g);
//         if (matches) name = decodeURIComponent(matches[1]);
//       }

//       if (name) {
//         // server-side fetching
//         const query = await store.dispatch(getEventByName.initiate(name));

//         if (query.data) {
//           const event: IEvent = query.data;
//           return Promise.resolve({ props: { event } });
//         }
//       }

//       return Promise.resolve({ props: {} });
//     }
// );
