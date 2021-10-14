import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Session } from "next-auth";
import { AppState } from "store";

const initialState: { session: Session | null; loading: boolean } = {
  session: null,
  loading: false
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  }
});

export const { setSession } = sessionSlice.actions;
export const { setLoading } = sessionSlice.actions;

export const selectSession = (state: AppState) => state.session.session;
export const selectLoading = (state: AppState) => state.session.loading;

export default sessionSlice.reducer;
