import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "store";

const initialState: { isOffline: boolean; refetchSession: boolean } = {
  isOffline: false,
  refetchSession: false
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    refetchSession: (state, action: PayloadAction<void>) => {
      state.refetchSession = !state.refetchSession;
    },
    setIsOffline: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload;
    }
  }
});

export const { refetchSession, setIsOffline } = sessionSlice.actions;

export const selectSessionRefetch = (state: AppState) =>
  state.session.refetchSession;
export const selectIsOffline = (state: AppState) => state.session.isOffline;

export default sessionSlice.reducer;
