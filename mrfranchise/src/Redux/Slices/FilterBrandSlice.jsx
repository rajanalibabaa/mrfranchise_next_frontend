import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getUserId } from "@/Utils/autherId";
const userId = getUserId();
const API_BASE_URL = "http://localhost:5000/api/v1/";
const id = userId;

// --- Async thunk for fetching filtered brands ---
export const fetchFilteredBrands = createAsyncThunk(
  "filterBrands/fetchFilteredBrands",
  async (filters, { rejectWithValue }) => {
    try {
      const {
        page = 1,
        limit = 20,
        maincat = "Food & Beverages",
        subcat,
        childcat,
        searchTerm, // ✅ corrected spelling
        country,
        state,
        district,
        city,
        investmentRange,
        modelType,
        areaRequired, // ✅ Added destructuring
      } = filters;

      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      if (id) params.append("id", id);

      // console.log("searchTerm :",searchTerm)
      // ✅ Always include maincat
      params.append("maincat", maincat);

      if (subcat) params.append("subcat", subcat);
      if (childcat) params.append("childcat", childcat);
      if (searchTerm) params.append("serchterm", searchTerm); // backend expects "serchterm"
      if (country) params.append("country", country);
      if (state) params.append("state", state);
      if (district) params.append("district", district);
      if (city) params.append("city", city);
      if (investmentRange) params.append("investmentRange", investmentRange);
      if (modelType) params.append("modelType", modelType);
      if (areaRequired) params.append("areaRequired", areaRequired); // ✅ Fixed areaRequired param

      // console.log("params ;",`${API_BASE_URL}filter/getAllBrandsAndFilter?${params.toString()}`)
      // ✅ axios GET (better for filters)
      const response = await axios.get(
        `${API_BASE_URL}filter/getAllBrandsAndFilter?${params.toString()}`
      );

      const normalizedBrands =
        response.data.data?.brands?.map((brand) => ({
          ...brand,
          brandDetails: {
            brandName: "",
            companyName: "",
            ...brand.brandDetails,
          },
          brandfranchisedetails: {
            franchiseDetails: {
              fico: [],
              trainingSupport: [],
              ...brand.brandfranchisedetails?.franchiseDetails,
            },
            ...brand.brandfranchisedetails,
          },
          uploads: {
            logo: "",
            ...brand.uploads,
          },
          isLiked: brand?.isLiked || false,
          isShortListed: brand?.isShortListed || false,
        })) || [];

      return {
        brands: normalizedBrands,
        pagination:
          response.data.data?.pagination || {
            currentPage: 1,
            totalPages: 1,
            limit: parseInt(limit),
            total: 0,
            hasNext: false,
            hasPrevious: false,
          },
      };
    } catch (error) {
      console.error("❌ Fetch Filtered Brands Error:", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// --- Initial State ---
const initialState = {
  brands: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    limit: 20,
    total: 0,
    hasNext: false,
    hasPrevious: false,
  },
  filters: {
    id: null,
    maincat: "Food & Beverages",
    subcat: null,
    childcat: null,
    searchTerm: "", // ✅ corrected key
    country: null,
    state: null,
    district: null,
    city: null,
    investmentRange: null,
    modelType: null,
    areaRequired: null, // ✅ Added to filters
    page: 1,
    limit: 20,
  },
  cacheKey: Date.now(),
};

// --- Slice ---
const filterBrandSlice = createSlice({
  name: "filterBrands",
  initialState,
  reducers: {
    setFilter: (state, action) => {
      const { filterName, value } = action.payload;
      state.filters[filterName] = value;

      // --- Reset dependent filters ---
      if (filterName === "maincat") {
        state.filters.subcat = null;
        state.filters.childcat = null;
      } else if (filterName === "subcat") {
        state.filters.childcat = null;
      } else if (filterName === "state") {
        state.filters.district = null;
        state.filters.city = null;
      } else if (filterName === "district") {
        state.filters.city = null;
      }

      // Reset pagination & cache
      state.filters.page = 1;
      state.pagination.currentPage = 1;
      state.cacheKey = Date.now();
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.currentPage = 1;
      state.cacheKey = Date.now();
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
      state.pagination.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },

    // Toggle brand states
    toggleBrandLikefilter: (state, action) => {
      const brandId = action.payload;
      state.brands = state.brands.map((brand) =>
        brand?.uuid === brandId ? { ...brand, isLiked: !brand.isLiked } : brand
      );
    },

    toggleBrandShortListfilter: (state, action) => {
      const brandId = action.payload;
      state.brands = state.brands.map((brand) =>
        brand?.uuid === brandId
          ? { ...brand, isShortListed: !brand.isShortListed }
          : brand
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilteredBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredBrands.fulfilled, (state, action) => {
        state.loading = false;

        // --- Optional stable sort (videos first)
        const sortedBrands = [...action.payload.brands].sort((a, b) => {
          const aHasVideo = a.uploads?.video ? 1 : 0;
          const bHasVideo = b.uploads?.video ? 1 : 0;
          if (bHasVideo !== aHasVideo) return bHasVideo - aHasVideo;
          return a.uuid.localeCompare(b.uuid);
        });

        state.brands = sortedBrands;

        if (action.payload.pagination) {
          state.pagination = {
            ...action.payload.pagination,
            currentPage:
              action.payload.pagination.currentPage ||
              state.pagination.currentPage,
          };
        }
      })
      .addCase(fetchFilteredBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch brands";
      });
  },
});

export const {
  setFilter,
  resetFilters,
  setPage,
  clearError,
  toggleBrandLikefilter,
  toggleBrandShortListfilter,
} = filterBrandSlice.actions;

export default filterBrandSlice.reducer;
