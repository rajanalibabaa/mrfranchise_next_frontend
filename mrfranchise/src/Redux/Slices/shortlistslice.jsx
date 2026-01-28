"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getToken,getUserId } from "@/Utils/autherId";
import { api } from "@/Api/api";
import { getApi } from "@/Api/DefaultApi";

const userId = getUserId();
const token = getToken();
// Utility for handling API errors
const handleApiError = (error) => {
  // console.error("API Error:", error.response?.data || error.message);
  return (
    error.response?.data?.message ||
    error.message ||
    "An unknown error occurred"
  );
};

// REMOVE from shortlist thunk
export const removeFromShortlist = createAsyncThunk(
  "shortList/remove",
  async (brandId, { rejectWithValue }) => {
    try {
      if (!userId || !brandId) throw new Error("Missing user ID or brand ID");

      const baseUrl =
        api.shortListApi.base || "https://mrfranchisebackend.mrfranchise.in/api/v1/shortList";
      const url = `${baseUrl}/removeFromShortlist/${userId}/${brandId}`;

      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return brandId;
    } catch (err) {
      return rejectWithValue(handleApiError(err));
    }
  }
);

// FETCH shortlist by ID thunk
export const fetchShortListedById = createAsyncThunk(
  "shortList/fetchById",
  async ({ investorUUID, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error("User ID is required");

      const query = { page, limit ,main: "Food & Beverages" };
const baseUrl =
  api.shortListApi.base || "https://mrfranchisebackend.mrfranchise.in/api/v1/shortList";

const queryString = new URLSearchParams(query).toString();

const url = `${baseUrl}/getShortListedById/${userId}?${queryString}`;


      const response = await getApi(url, query, token);
      const responseData = response.data?.data;
      
      if (!responseData) throw new Error("No data received");

      // console.log("Total Shortlisted Brands:", responseData?.pagination?.total || 0);
      // console.log("All Shortlisted Data:", responseData);

      return {
        brands: responseData.brands || [],
        pagination: responseData.pagination || {
          currentPage: page,
          totalPages: 1,
          total: 0,
          limit,
          hasNext: false,
          hasPrevious: false,
        },
      };
    } catch (err) {
      return rejectWithValue(handleApiError(err));
    }
  }
);

// Initial state
const initialState = {
  brands: [],
  pagination: {
    total: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    hasNext: false,
    hasPrevious: false,
  },
  isLoading: false,
  error: null,
  lastFetched: null,
};

// Redux slice
const shortListSlice = createSlice({
  name: "shortList",
  initialState,
  reducers: {
    clearShortList: () => initialState,

    removeSortList: (state, action) => {
      state.brands = state.brands.filter(
        (brand) => brand.uuid !== action.payload
      );
      state.pagination.total = Math.max(0, state.pagination.total - 1);
      state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
      state.pagination.hasNext = state.pagination.currentPage < state.pagination.totalPages;
      state.pagination.hasPrevious = state.pagination.currentPage > 1;
    },

    addSortlist: (state, action) => {
      const brand = { ...action.payload, isShortListed: true };
      state.brands.unshift(brand);
      state.pagination.total += 1;
      state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
      state.pagination.hasNext = state.pagination.currentPage < state.pagination.totalPages;
      state.pagination.hasPrevious = state.pagination.currentPage > 1;
    },

    toggleSortlistBrandLike: (state, action) => {
      state.brands = state.brands.map((brand) =>
        brand.uuid === action.payload
          ? { ...brand, isLiked: !brand.isLiked }
          : brand
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchShortListedById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchShortListedById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastFetched = new Date().toISOString();
        state.brands = action.payload.brands;
        state.pagination = {
          ...state.pagination,
          ...action.payload.pagination,
        };
      })
      .addCase(fetchShortListedById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(removeFromShortlist.fulfilled, (state, action) => {
        state.brands = state.brands.filter(
          (brand) => brand.uuid !== action.payload
        );
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
        state.pagination.hasNext = state.pagination.currentPage < state.pagination.totalPages;
        state.pagination.hasPrevious = state.pagination.currentPage > 1;
      })
      .addCase(removeFromShortlist.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// Export Actions
export const {
  clearShortList,
  removeSortList,
  addSortlist,
  toggleSortlistBrandLike,
} = shortListSlice.actions;

// Export Reducer
export default shortListSlice.reducer;