"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getToken,getUserId } from "@/Utils/autherId";
import { api } from "@/Api/api";
import { getApi } from "@/Api/DefaultApi";
const userId = getUserId();
const token = getToken();


// Utility for handling API errors
// const handleApiError = (error) => {
//   console.error("API Error:", error.response?.data || error.message);
//   return (
//     error.response?.data?.message ||
//     error.message ||
//     "An unknown error occurred"
//   );
// };

export const removeFromLikedBrands = createAsyncThunk(
  "likedBrands/remove",
  async (brandId, { rejectWithValue, getState }) => { // Only need brandId now
    try {
      if (!brandId) throw new Error("Missing brand ID");

      // Get token from Redux state
      const token = getState().auth?.AccessToken;
      if (!token) throw new Error("No authentication token found");

      // Updated URL to match backend expectation
      const url = `${api.likeApi.delete}/${brandId}`;

      // console.log("Delete URL:", url); // For debugging

      const response = await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to remove brand");
      }

      return brandId;
    } catch (err) {
      return rejectWithValue(handleApiError(err));
    }
  }
);

  // console.log("userId",userId)
  
export const fetchLikedBrandsById = createAsyncThunk(
  "likedBrands/fetchById",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error("User ID is required");

    

      const query = { page, limit, main: "Food & Beverages" };
      const baseUrl = "http://localhost:5000/api/v1/like";

      const queryString = new URLSearchParams(query).toString();

      const url = `${baseUrl}/get-favbrands/${userId}?${queryString}`;

      // console.log(url);

      const response = await getApi(url, token);

      // console.log("...", response.data?.data)

      const responseData = response.data?.data;
      if (!responseData) throw new Error("No data received");

      return {
        brands: responseData.brands || [],
        pagination: responseData.pagination || {
          currentPage: page,
          totalPages: 1,
          total: 0,
          limit,
          hasNext: false,
        },
      };
    } catch (err) {
      return rejectWithValue(handleApiError(err));
    }
  }
);

// ✅ Initial state
const initialState = {
  brands: [],
  pagination: {
    total: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    hasNext: false,
  },
  isLoading: false,
  error: null,
  lastFetched: null,
};

// ✅ Redux slice
const likedBrandsSlice = createSlice({
  name: "likedBrands",
  initialState,
  reducers: {
    clearLikedBrands: () => initialState,

    removeLikedBrand: (state, action) => {
      state.brands = state.brands.filter(
        (brand) => brand.uuid !== action.payload
      );
      state.pagination.total -= 1;
    },

    addLikedBrand: (state, action) => {
      const brand = { ...action.payload, isLiked: true };
      state.brands.unshift(brand);
      state.pagination.total = state.pagination.total + 1;
    },

    toggleLikedBrand: (state, action) => {
      state.brands = state.brands.map((brand) =>
        brand.uuid === action.payload
          ? { ...brand, isLiked: !brand.isLiked }
          : brand
      );
    },
     toggleLikedSliceShortList: (state, action) => {
      state.brands = state.brands.map((brand) =>
        brand.uuid === action.payload
          ? { ...brand, isShortListed: !brand.isShortListed }
          : brand
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchLikedBrandsById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchLikedBrandsById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastFetched = new Date().toISOString();

        state.brands = action.payload.brands;
        state.pagination = {
          ...state.pagination,
          ...action.payload.pagination,
          total: action.payload.pagination.total,
        };
      })

      .addCase(fetchLikedBrandsById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(removeFromLikedBrands.fulfilled, (state, action) => {
        state.brands = state.brands.filter(
          (brand) => brand.uuid !== action.payload
        );
        state.pagination.total -=1;
      })

      .addCase(removeFromLikedBrands.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// ✅ Export Actions
export const {
  clearLikedBrands,
  removeLikedBrand,
  addLikedBrand,
  toggleLikedBrand,
  toggleLikedSliceShortList
} = likedBrandsSlice.actions;

// ✅ Export Reducer
export default likedBrandsSlice.reducer;