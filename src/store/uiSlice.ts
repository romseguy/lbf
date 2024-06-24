import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { AppState } from "store";

export const uiSlice = createSlice({
  name: "ui",
  initialState: { isMobile: false, rteditorIndex: 0, screenWidth: 0 },
  reducers: {
    incrementRTEditorIndex: (state, action: PayloadAction<undefined>) => {
      state.rteditorIndex++;
    },
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
    setScreenWidth: (state, action: PayloadAction<number>) => {
      console.log("🚀 ~ action:", action);
      state.screenWidth = action.payload;
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

export const { incrementRTEditorIndex, setIsMobile, setScreenWidth } =
  uiSlice.actions;
export const selectRTEditorIndex = (state: AppState) => state.ui.rteditorIndex;
export const selectIsMobile = (state: AppState) => state.ui.isMobile;
export const selectScreenWidth = (state: AppState) => state.ui.screenWidth;

export default uiSlice.reducer;
