import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "store";

const initialState: { refetchSession: boolean } = {
  refetchSession: false
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    refetchSession: (state, action: PayloadAction<void>) => {
      state.refetchSession = !state.refetchSession;
    }
  }
});

export const { refetchSession } = sessionSlice.actions;

export const selectSessionRefetch = (state: AppState) =>
  state.session.refetchSession;

export default sessionSlice.reducer;
