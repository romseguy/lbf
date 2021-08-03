import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "store";
import { createSlice } from "@reduxjs/toolkit";

type OrgState = {
  refetchOrg: boolean;
};

const initialState: OrgState = {
  refetchOrg: false
};

export const orgSlice = createSlice({
  name: "org",
  initialState,
  reducers: {
    refetchOrg: (state, action: PayloadAction<undefined>) => {
      state.refetchOrg = !state.refetchOrg;
    }
  }
});

export const { refetchOrg } = orgSlice.actions;

export const selectOrgRefetch = (state: AppState) => state.org.refetchOrg;

export default orgSlice.reducer;
