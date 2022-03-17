import React from "react";
import { IEvent } from "models/Event";
import { EventTimeline } from "./EventTimeline";
import { AppQueryWithData } from "utils/types";

export const EventPageTimeline = ({
  eventQuery
}: {
  eventQuery: AppQueryWithData<IEvent>;
}) => {
  const event = eventQuery.data;

  return <EventTimeline event={event} />;
};
