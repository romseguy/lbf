import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "store";

type EventState = {};

const initialState: EventState = {};

export const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {}
});

//export const {} = eventSlice.actions;

export default eventSlice.reducer;
