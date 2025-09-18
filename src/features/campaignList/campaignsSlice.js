import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialCampaigns = [
  {"id":1,"name":"Divavu","startDate":"9/19/2021","endDate":"3/9/2023","Budget":88377,"userId":3},
  {"id":2,"name":"Jaxspan","startDate":"11/21/2023","endDate":"2/21/2024","Budget":608715,"userId":6},
  {"id":3,"name":"Miboo","startDate":"11/1/2022","endDate":"6/20/2022","Budget":239507,"userId":7},
  {"id":4,"name":"Trilith","startDate":"8/25/2022","endDate":"11/30/2022","Budget":179838,"userId":1},
  {"id":5,"name":"Layo","startDate":"11/28/2017","endDate":"3/10/2023","Budget":837850,"userId":9},
  {"id":6,"name":"Photojam","startDate":"7/25/2019","endDate":"6/23/2021","Budget":858131,"userId":3},
  {"id":7,"name":"Blogtag","startDate":"6/27/2019","endDate":"1/15/2021","Budget":109078,"userId":2},
  {"id":8,"name":"Rhyzio","startDate":"10/13/2020","endDate":"1/25/2022","Budget":272552,"userId":4},
  {"id":9,"name":"Zoomcast","startDate":"9/6/2021","endDate":"11/10/2023","Budget":301919,"userId":8},
  {"id":10,"name":"Realbridge","startDate":"3/5/2021","endDate":"10/2/2026","Budget":505602,"userId":5}
];

//thunk for fetching data from an api
export const fetchCampaigns = createAsyncThunk(
  "campaigns/fetchCampaigns",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const campaignSlice = createSlice({
  name: "Campaigns",
  initialState: {
    data: initialCampaigns,
    loading: false,
    error: null,
    search: "",
    users: {},
    dateRange: { start: null, end: null }
  },
  reducers: {
    addCampaign: (state, action) => {
      state.data.push(action.payload);
    },
    updateCampaign: (state, action) => {
      const index = state.data.findIndex(
        (campaign) => campaign.id === action.payload.id
      );
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    deleteCampaign: (state, action) => {
      state.data = state.data.filter(
        (campaign) => campaign.id !== action.payload
      );
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
    setDateRange(state, action) {
      state.dateRange = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCampaigns.pending, (state) => {
        state.loadingUsers = true;
        state.errorUsers = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.loadingUsers = false;
        state.users = action.payload.reduce((acc, u) => {
          acc[u.id] = u.name;
          return acc;
        }, {});
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.loadingUsers = false;
        state.errorUsers = action.payload || "Failed to fetch users";
      });
  },
});

export const { addCampaigns, setDateRange, setSearch } = campaignSlice.actions;

export default campaignSlice.reducer;
