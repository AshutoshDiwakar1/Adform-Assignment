import { configureStore } from "@reduxjs/toolkit";
import campaignsReducer from "./features/campaignList/campaignsSlice";

export const store = configureStore({
  reducer: {
    campaigns: campaignsReducer,
  },
});


