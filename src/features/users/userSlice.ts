import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "store";
import { createSlice } from "@reduxjs/toolkit";

type UserState = {
  userEmail?: string;
};

const initialState: UserState = {
  userEmail: undefined
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserEmail: (state, action: PayloadAction<string | undefined>) => {
      if (!action.payload) state.userEmail = initialState.userEmail;
      state.userEmail = action.payload;
    }
  }
});

export const { setUserEmail } = userSlice.actions;

export const selectUserEmail = (state: AppState) => state.user.userEmail;

export default userSlice.reducer;
