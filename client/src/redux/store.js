import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "../redux/slice.js";

const globalStore = configureStore({
  reducer: {
    global: globalReducer,
  },
});
export { globalStore };
