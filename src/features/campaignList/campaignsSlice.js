import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialCampaigns = [
  {
    id: 1,
    name: "Divavu",
    startDate: "9/19/2021",
    endDate: "3/9/2023",
    Budget: 88377,
    userId: 3,
  },
  {
    id: 2,
    name: "Jaxspan",
    startDate: "11/21/2023",
    endDate: "2/21/2024",
    Budget: 608715,
    userId: 6,
  },
];

//thunk for fetching data from an api
export const fetchCampaigns = createAsyncThunk(
  "campaigns/fetchCampaigns",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts"
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
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loadingUsers = true;
        state.errorUsers = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loadingUsers = false;
        state.users = action.payload.reduce((acc, u) => {
          acc[u.id] = u.name;
          return acc;
        }, {});
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loadingUsers = false;
        state.errorUsers = action.payload || "Failed to fetch users";
      });
  },
});

export const { addCampaigns } = campaignSlice.actions;

export default campaignSlice.reducer;
