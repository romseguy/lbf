import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "store";
import { createSlice } from "@reduxjs/toolkit";

type OrgState = {
  orgRefetch: boolean;
};

const initialState: OrgState = {
  orgRefetch: false
};

export const orgSlice = createSlice({
  name: "org",
  initialState,
  reducers: {
    orgRefetch: (state, action: PayloadAction<undefined>) => {
      state.orgRefetch = !state.orgRefetch;
    }
  }
});

export const { orgRefetch } = orgSlice.actions;

export const selectOrgRefetch = (state: AppState) => state.org.orgRefetch;

export default orgSlice.reducer;
