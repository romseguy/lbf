//@ts-nocheck
import { HYDRATE } from "next-redux-wrapper";
import { AppState, AppThunk } from "store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const subjectSlice = createSlice({
  name: "subject",

  initialState: {} as any,

  reducers: {
    setEnt(state, { payload }: PayloadAction<any>) {
      return payload;
    }
  },

  extraReducers: {
    [HYDRATE]: (state, action) => {
      //console.log("HYDRATE", state, action.payload);
      return {
        ...state,
        ...action.payload.subject
      };
    }
  }
});

export const { setEnt } = subjectSlice.actions;

export const selectSubject = (id: any) => (state: AppState) =>
  state?.[subjectSlice.name]?.[id];

export default subjectSlice.reducer;

export const fetchSubject =
  (id: any): AppThunk =>
  async (dispatch) => {
    const timeoutPromise = (timeout: number) =>
      new Promise((resolve) => setTimeout(resolve, timeout));

    await timeoutPromise(200);

    dispatch(
      subjectSlice.actions.setEnt({
        [id]: {
          id,
          name: `Subject ${id}`
        }
      })
    );
  };
