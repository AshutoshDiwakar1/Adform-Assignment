import { configureStore } from "@reduxjs/toolkit";
import campaignsReducer from "./features/campaignsSlice";

export const store = configureStore({
  reducer: {
    campaigns: campaignsReducer,
  },
});


