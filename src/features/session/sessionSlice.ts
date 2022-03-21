import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Session } from "next-auth";
import { AppState } from "store";

const initialState: { isOffline: boolean; session: Session | null } = {
  isOffline: false,
  session: null
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload;
    },
    setIsOffline: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload;
    }
  }
});

export const { setSession, setIsOffline } = sessionSlice.actions;

export const selectSession = (state: AppState) => state.session.session;
export const selectIsOffline = (state: AppState) => state.session.isOffline;

export default sessionSlice.reducer;
