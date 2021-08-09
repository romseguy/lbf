import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "store";
import { createSlice } from "@reduxjs/toolkit";

type OrgState = {
  refetchOrg: boolean;
  refetchOrgs: boolean;
};

const initialState: OrgState = {
  refetchOrg: false,
  refetchOrgs: false
};

export const orgSlice = createSlice({
  name: "org",
  initialState,
  reducers: {
    refetchOrg: (state, action: PayloadAction<undefined>) => {
      state.refetchOrg = !state.refetchOrg;
    },
    refetchOrgs: (state, action: PayloadAction<undefined>) => {
      state.refetchOrgs = !state.refetchOrgs;
    }
  }
});

export const { refetchOrg, refetchOrgs } = orgSlice.actions;

export const selectOrgRefetch = (state: AppState) => state.org.refetchOrg;
export const selectOrgsRefetch = (state: AppState) => state.org.refetchOrgs;

export default orgSlice.reducer;
