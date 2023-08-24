import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "store";

type OrgState = {};

const initialState: OrgState = {};

export const orgSlice = createSlice({
  name: "org",
  initialState,
  reducers: {}
});

export const {} = orgSlice.actions;

export default orgSlice.reducer;
