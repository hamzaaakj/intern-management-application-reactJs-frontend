import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initialState = true;

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      return (state = true);
    },
    unsetLoading: (state, action) => {
      return (state = false);
    },
  },
});

export const { setLoading, unsetLoading } = loadingSlice.actions;

export default loadingSlice.reducer;
