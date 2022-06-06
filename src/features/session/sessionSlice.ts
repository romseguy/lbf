import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Session } from "lib/SessionContext";
import { AppState } from "store";

const initialState: { isOffline: boolean } = {
  isOffline: false
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setIsOffline: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload;
    }
  }
});

export const { setIsOffline } = sessionSlice.actions;

export const selectIsOffline = (state: AppState) => state.session.isOffline;

export default sessionSlice.reducer;
