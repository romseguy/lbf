import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "store";

type EventState = {
  refetchEvent: boolean;
  refetchEvents: boolean;
};

const initialState: EventState = {
  refetchEvent: false,
  refetchEvents: false
};

export const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    refetchEvent: (state, action: PayloadAction<undefined>) => {
      state.refetchEvent = !state.refetchEvent;
    },
    refetchEvents: (state, action: PayloadAction<undefined>) => {
      state.refetchEvents = !state.refetchEvents;
    }
  }
});

export const { refetchEvent, refetchEvents } = eventSlice.actions;

export const selectEventRefetch = (state: AppState) => state.event.refetchEvent;
export const selectEventsRefetch = (state: AppState) =>
  state.event.refetchEvents;

export default eventSlice.reducer;
