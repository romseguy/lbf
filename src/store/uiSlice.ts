import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { AppState } from "store";

export const uiSlice = createSlice({
  name: "ui",
  initialState: { isMobile: false, rteditorIndex: 0 },
  reducers: {
    incrementRTEditorIndex: (state, action: PayloadAction<undefined>) => {
      state.rteditorIndex++;
    },
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    }
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.ui
      };
    }
  }
});

export const { incrementRTEditorIndex, setIsMobile } = uiSlice.actions;
export const selectRTEditorIndex = (state: AppState) => state.ui.rteditorIndex;
export const selectIsMobile = (state: AppState) => state.ui.isMobile;

export default uiSlice.reducer;
