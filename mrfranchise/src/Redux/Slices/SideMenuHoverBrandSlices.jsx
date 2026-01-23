import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../Api/api";

// Cache object to store prefetched data
const prefetchCache = {};

// Thunk for fetching brands by sub category with caching
export const fetchBrandsBySubCategory = createAsyncThunk(
  "brandCategory/fetchBrandsBySubCategory",
  async (
    { subCategory, id, page = 1, limit = 30, isPrefetch = false },
    { rejectWithValue, getState }
  ) => {
    try {
      // Check cache first for prefetched data
      const cacheKey = `${subCategory}_${page}`;

      if (isPrefetch && prefetchCache[cacheKey]) {
        return { data: prefetchCache[cacheKey], page, isPrefetch };
      }

      const response = await axios.get(
        `http://localhost:5000/api/v1/brandlisting/getBrandsByChildCategory`,
        {
          params: { subCategory, id, page, limit },
        }
      );
 
      // Ensure response has the expected structure
      if (!response.data || !response.data.data) {
        throw new Error("Invalid response structure");
      }

      // Store in cache if this is a prefetch
      if (isPrefetch) {
        prefetchCache[cacheKey] = {
          brands: response.data.data.brands || [],
          mainCategory: response.data.data.mainCategory || "",
          subCategories: response.data.data.relatedCategories || [],
          currentCategory: response.data.data.currentCategory || "",
          
          pagination: response.data.data.pagination || {
            total: 0,
            totalPages: 0,
            currentPage: 1,
            limit: 30,
            hasNext: false,
            hasPrevious: false,
          },
        };
      }


      return {
        data: {
          brands: response.data.data.brands || [],
          mainCategory: response.data.data.mainCategory || "",
          subCategories: response.data.data.relatedCategories || [],
          currentCategory: response.data.data.currentCategory || "",
          pagination: response.data.data.pagination || {
            total: 0,
            totalPages: 0,
            currentPage: 1,
            limit: 30,
            hasNext: false,
            hasPrevious: false,
          },
        },
        page,
        isPrefetch,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Brands Are Under Updating"
      );
    }
  }
);

// Thunk for prefetching brands
export const prefetchBrands = createAsyncThunk(
  "brandCategory/prefetchBrands",
  async ({ subCategory }, { dispatch }) => {
    // Only prefetch if we don't already have this data
    const cacheKey = `${subCategory}_1`;
    if (!prefetchCache[cacheKey]) {
      await dispatch(
        fetchBrandsBySubCategory({
          subCategory,
          page: 1,
          limit: 30,
          isPrefetch: true,
        })
      );
    }
  }
);

// Initial State
const initialState = {
  brands: [],
  mainCategory: "",
  subCategories: [],
  currentCategory: "",
  loading: false,
  error: null,
  pagination: {
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 30,
    hasNext: false,
    hasPrevious: false,
  },
  prefetched: [],
};
// console.log("Initial State:", initialState);

const brandCategorySlice = createSlice({
  name: "brandCategory",
  initialState,
  reducers: {
    clearBrands: (state) => {
      state.brands = [];
      state.mainCategory = "";
      state.subCategories = [];
      state.currentCategory = "";
      state.pagination = initialState.pagination;
      state.prefetched = [];
    },
    clearPrefetchCache: () => {
      Object.keys(prefetchCache).forEach((key) => delete prefetchCache[key]);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrandsBySubCategory.pending, (state, action) => {
        if (!action.meta.arg.isPrefetch) {
          state.loading = true;
          state.error = null;
          // Reset brands when fetching a new category (page 1)
          if (action.meta.arg.page === 1) {
            state.brands = [];
          }
        }
      })
      .addCase(fetchBrandsBySubCategory.fulfilled, (state, action) => {
        const { data, page, isPrefetch } = action.payload;

        if (isPrefetch) {
          const { subCategory } = action.meta.arg;
          if (!state.prefetched.includes(`${subCategory}`)) {
            state.prefetched.push(`${subCategory}`);
          }
          return;
        }

        state.loading = false;

        if (page > 1) {
          // For subsequent pages, append to existing brands
          state.brands = [...state.brands, ...(data.brands || [])];
        } else {
          // For first page, replace brands
          state.brands = data.brands || [];
        }

        state.mainCategory = data.mainCategory || "";
        state.subCategories = data.subCategories || [];
        state.currentCategory = data.currentCategory || "";
        state.pagination = data.pagination || initialState.pagination;
      })
      .addCase(fetchBrandsBySubCategory.rejected, (state, action) => {
        if (!action.meta.arg?.isPrefetch) {
          state.loading = false;
          state.error =
            action.payload || action.error.message || "Failed to fetch brands";
          // Reset brands on error for new fetches (page 1)
          if (action.meta.arg.page === 1) {
            state.brands = [];
          }
        }
      });
  },
});

export const { clearBrands, clearPrefetchCache } = brandCategorySlice.actions;
export default brandCategorySlice.reducer;