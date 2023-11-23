import { configureStore } from "@reduxjs/toolkit";
import loadingSlice from "./slices/loadingSlice";
import { persistStore } from "redux-persist";
import thunk from "redux-thunk";

export const store = configureStore({
  reducer: {
    loading: loadingSlice,
  },
  middleware: [thunk],
});

export const getLoading = (state) => state.loading;

export const persistor = persistStore(store);
