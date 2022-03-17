import { Grid } from "@chakra-ui/react";
import React from "react";
import { css } from "twin.macro";
import { IEvent } from "models/Event";
import { AppQueryWithData } from "utils/types";
import { EventPageDescription } from "./EventPageDescription";
import { EventPageOrgs } from "./EventPageOrgs";
import { EventPageInfo } from "./EventPageInfo";
import { EventPageTimeline } from "./EventPageTimeline";

export const EventPageHomeTabPanel = ({
  eventQuery,
  isCreator,
  isMobile,
  setIsEdit
}: {
  eventQuery: AppQueryWithData<IEvent>;
  isCreator: boolean;
  isMobile: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const event = eventQuery.data;

  return (
    <Grid
      gridGap={5}
      css={css`
        & {
          grid-template-columns: minmax(425px, 1fr) minmax(170px, 1fr);
        }
        @media (max-width: 700px) {
          & {
            grid-template-columns: 1fr !important;
          }
        }
      `}
    >
      {isMobile ? (
        <>
          <EventPageOrgs event={event} />

          <EventPageInfo
            event={event}
            isCreator={isCreator}
            setIsEdit={setIsEdit}
          />

          <EventPageTimeline event={event} />

          <EventPageDescription
            event={event}
            isCreator={isCreator}
            setIsEdit={setIsEdit}
          />
        </>
      ) : (
        <>
          <EventPageDescription
            event={event}
            isCreator={isCreator}
            setIsEdit={setIsEdit}
          />

          <EventPageInfo
            event={event}
            isCreator={isCreator}
            setIsEdit={setIsEdit}
          />
          <EventPageTimeline event={event} />
          <EventPageOrgs event={event} />
        </>
      )}
    </Grid>
  );
};
