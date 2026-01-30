"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Backend base URL — adjust if needed
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/brandlisting`;

// ----------------------
// Async Thunks (Direct API Calls)
// ----------------------

// 🟢 Create Request
export const addRequest = createAsyncThunk(
  "requests/add",
  async (formData, { rejectWithValue }) => {
    try {
      // console.log("Submitting new request:", formData);

      const { data } = await axios.post(`${BASE_URL}/userRequestNotification`, formData);

      // console.log("Response from backend:", data);

      // The backend returns: { success, message, data: newRequest }
      return data.data;
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      console.error("Add Request Error:", errMsg);
      return rejectWithValue({ message: errMsg });
    }
  }
);



// 🔵 Get Request by UUID
export const fetchRequestById = createAsyncThunk(
  "requests/fetchById",
  async (brandId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/userRequestNotificationByBrandId/${brandId}`);
      return data.data; // single request object
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      console.error("Fetch Request By ID Error:", errMsg);
      return rejectWithValue({ message: errMsg });
    }
  }
);

// 🔴 Delete Request
export const removeRequest = createAsyncThunk(
  "requests/remove",
  async (uuid, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/userRequestNotification/${uuid}`);
      return uuid; // return deleted request UUID
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      console.error("Delete Request Error:", errMsg);
      return rejectWithValue({ message: errMsg });
    }
  }
);



// ----------------------
// Slice
// ----------------------

const requestSlice = createSlice({
  name: "requests",
  initialState: {
    list: [],
    singleRequest: null,
    loading: false,
    error: null,
  },
  reducers: {
    // For real-time socket updates
    addRealtimeRequest: (state, { payload }) => {
      state.list.unshift(payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL
      // .addCase(fetchAllRequests.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(fetchAllRequests.fulfilled, (state, { payload }) => {
      //   state.loading = false;
      //   state.list = payload;
      //   state.error = null;
      // })
      // .addCase(fetchAllRequests.rejected, (state, { payload }) => {
      //   state.loading = false;
      //   state.error = payload?.message;
      // })

      // ADD REQUEST
      .addCase(addRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(addRequest.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.list.unshift(payload);
        state.error = null;
      })
      .addCase(addRequest.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.message;
      })

      // GET SINGLE REQUEST
      .addCase(fetchRequestById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRequestById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.singleRequest = payload;
        state.error = null;
      })
      .addCase(fetchRequestById.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.message;
      })

      // DELETE REQUEST
      .addCase(removeRequest.fulfilled, (state, { payload }) => {
        state.list = state.list.filter((req) => req.uuid !== payload);
        state.error = null;
      })
      .addCase(removeRequest.rejected, (state, { payload }) => {
        state.error = payload?.message;
      });
  },
});

export const { addRealtimeRequest } = requestSlice.actions;
export default requestSlice.reducer;
