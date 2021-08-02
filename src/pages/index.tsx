import React from "react";
import { EventsPage } from "features/events/EventsPage";
import type { IEvent } from "models/Event";
import api from "utils/api";
import { GetServerSidePropsContext } from "next";

const Index = ({ events }: { events?: IEvent[] }) => {
  return <EventsPage events={events} />;
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { data: events } = await api.get(`events`);

  if (events) {
    return {
      props: { events }
    };
  }

  return {
    props: {}
  };
}

export default Index;

// https://github.com/reduxjs/redux-toolkit/issues/1240
// export const getServerSideProps = wrapper.getServerSideProps(
//   (store) =>
//     async ({ req, res }) => {
//       // server-side fetching
//       const query = await store.dispatch(getEvents.initiate(null));
//       console.log(query);

//       if (query.data) {
//         const events: IEvent = query.data;
//         return Promise.resolve({ props: { events } });
//       }

//       return Promise.resolve({ props: {} });
//     }
// );
