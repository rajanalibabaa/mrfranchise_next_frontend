import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getToken,getUserId } from "@/Utils/autherId";
import { api } from "@/Api/api";
import { getApi } from "@/Api/DefaultApi";
const userId = getUserId();
const token = getToken();
// Utility for handling API errors
const handleApiError = (error) => {
  console.error("API Error:", error.response?.data || error.message);
  return (
    error.response?.data?.message ||
    error.message ||
    "An unknown error occurred"
  );
};

export const fetchViewBrandsById = createAsyncThunk(
  "viewBrands/fetchById",
  async ({ page = 1, limit = 10 ,} = {}, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error("User ID is required Login to continue");

      const query = { page, limit,main: "Food & Beverages" };
      const queryString = new URLSearchParams(query).toString();
      const url = `${api.viewApi.get.getAllViewBrandByID}/${userId}?${queryString}`;

      const response = await getApi(url, query, token);

      const responseData = response.data?.data;
      if (!responseData) throw new Error("No data received");

      return {
        brands: responseData.brands || [],
        pagination: responseData.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: 0,
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
    totalItems: 0,
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

// ✅ Redux slice
const viewBrandsSlice = createSlice({
  name: "viewBrands",
  initialState,
  reducers: {
    clearviewBrands: () => initialState,

    removeviewBrand: (state, action) => {
      state.brands = state.brands.filter(
        (brand) => brand.uuid !== action.payload
      );
      state.pagination.totalItems = Math.max(0, state.pagination.totalItems - 1);
    },

    addviewBrand: (state, action) => {
      const brand = { ...action.payload };
      state.brands.unshift(brand);
      state.pagination.totalItems = state.brands.length;
    },

    toggleviewSliceLiked: (state, action) => {
      state.brands = state.brands.map((brand) =>
        brand.uuid === action.payload
          ? { ...brand, isLiked: !brand.isLiked }
          : brand
      );
    },
    
    toggleviewSliceShortList: (state, action) => {
      state.brands = state.brands.map((brand) =>
        brand.uuid === action.payload
          ? { ...brand, isShortListed: !brand.isShortListed }
          : brand
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchViewBrandsById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchViewBrandsById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastFetched = new Date().toISOString();

        state.brands = action.payload.brands;
        state.pagination = {
          ...state.pagination,
          ...action.payload.pagination,
          totalItems: action.payload.pagination?.total || action.payload.brands.length,
        };
      })

      .addCase(fetchViewBrandsById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// ✅ Export Actions
export const {
  clearviewBrands,
  removeviewBrand,
  addviewBrand,
  toggleviewSliceLiked,
  toggleviewSliceShortList
} = viewBrandsSlice.actions;

// ✅ Export Reducer
export default viewBrandsSlice.reducer;