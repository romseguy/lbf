import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, AppState } from "store";
// import { supabase } from "utils/supabase";

export interface Note {
  readonly id: string;
  readonly text: string;
  readonly created: Date;
}

export interface NoteState {
  readonly loading: boolean;
  readonly notes: Note[];
}

const initialState: NoteState = {
  loading: false,
  notes: []
};

const NOTES = "notes";

export const noteSlice = createSlice({
  name: NOTES,
  initialState,
  reducers: {
    setNotes: (state, action: PayloadAction<Note[]>) => {
      state.notes = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  }
});

export const addNote =
  (text: string): AppThunk =>
  async (dispatch, _getState) => {
    // let { data: _todo, error: _todoError } = await supabase
    //   .from(NOTES)
    //   .insert({ text })
    //   .single();
    dispatch(readNotes());
  };

export const readNotes = (): AppThunk => async (dispatch, _) => {
  // let { data: notes, error } = await supabase.from(NOTES).select("*");
  // if (error === null) {
  //   const notesArray = notes as Note[];
  // dispatch(setNotes(notesArray));
  // }
};

export const selectNotes = (state: AppState) => state.notes.notes;

export const { setNotes, setLoading } = noteSlice.actions;

export default noteSlice.reducer;
