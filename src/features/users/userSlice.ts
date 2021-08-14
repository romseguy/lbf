import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "store";
import type { Base64Image } from "utils/image";
import { createSlice } from "@reduxjs/toolkit";

type UserState = {
  subscribedEmail: string | null;
  userEmail: string | null;
  userImage: Base64Image | null;
  userName: string | null;
};

const initialState: UserState = {
  subscribedEmail: null,
  userEmail: null,
  userImage: null,
  userName: null
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserEmail: (state, action: PayloadAction<string | null>) => {
      if (!action.payload) state.userEmail = initialState.userEmail;
      state.userEmail = action.payload;
    },
    setUserImage: (state, action: PayloadAction<Base64Image | null>) => {
      if (!action.payload) state.userImage = initialState.userImage;
      state.userImage = action.payload;
    },
    setUserName: (state, action: PayloadAction<string | null>) => {
      if (!action.payload) state.userName = initialState.userName;
      state.userName = action.payload;
    },
    setSubscribedEmail: (state, action: PayloadAction<string | null>) => {
      if (!action.payload) state.subscribedEmail = initialState.subscribedEmail;
      state.subscribedEmail = action.payload;
    }
  }
});

export const { setUserEmail, setUserImage, setUserName, setSubscribedEmail } =
  userSlice.actions;

export const selectUserEmail = (state: AppState) => state.user.userEmail;
export const selectUserImage = (state: AppState) => state.user.userImage;
export const selectUserName = (state: AppState) => state.user.userName;
export const selectSubscribedEmail = (state: AppState) =>
  state.user.subscribedEmail;

export default userSlice.reducer;
