import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "store";
import { createSlice } from "@reduxjs/toolkit";

type UserState = {
  userEmail: string | null;
};

const initialState: UserState = {
  userEmail: null
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserEmail: (state, action: PayloadAction<string | null>) => {
      if (!action.payload) state.userEmail = initialState.userEmail;
      state.userEmail = action.payload;
    }
  }
});

export const { setUserEmail } = userSlice.actions;

export const selectUserEmail = (state: AppState) => state.user.userEmail;

export default userSlice.reducer;
