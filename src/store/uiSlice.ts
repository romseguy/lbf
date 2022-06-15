import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "store";

export const uiSlice = createSlice({
  name: "ui",
  initialState: { rteditorIndex: 0 },
  reducers: {
    incrementRTEditorIndex: (state, action: PayloadAction<undefined>) => {
      state.rteditorIndex++;
    }
  }
});

export const { incrementRTEditorIndex } = uiSlice.actions;
export const selectRTEditorIndex = (state: AppState) => state.ui.rteditorIndex;

export default uiSlice.reducer;
