"use client";
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { getUserId } from '@/Utils/autherId';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/`;



// ─── Async Thunk ──────────────────────────────────────────────────────────────
export const fetchFilteredBrands = createAsyncThunk(
  "filterBrands/fetchFilteredBrands",
  async (filters, { signal, rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      const currentUserId = getUserId();

      // Pagination
      params.append("page", filters.page ?? 1);
      params.append("limit", filters.limit ?? 20);

      if (currentUserId) params.append("id", currentUserId);

      // Category filters
      if (filters.maincat)        params.append("maincat", filters.maincat);
      if (filters.subcat)         params.append("subcat", filters.subcat);
      if (filters.childcat)       params.append("serchterm", filters.childcat);
      if (filters.searchTerm)     params.append("serchterm", filters.searchTerm);

      // Location filters
      if (filters.country)        params.append("country", filters.country);
      if (filters.state)          params.append("state", filters.state);
      if (filters.district)       params.append("district", filters.district);
      if (filters.city)           params.append("city", filters.city);

      // Investment / Area
      if (filters.investmentRange) params.append("investmentRange", filters.investmentRange);
      if (filters.areaRequired)    params.append("areaRequired", filters.areaRequired);

      // ── Model Type & Franchise Type ──────────────────────────────────────
      // Backend uses: modelType  → fico.franchiseModel
      //               franchiseType → fico.franchiseType
      if (filters.modelType)      params.append("modelType", filters.modelType);
      if (filters.franchiseType)  params.append("franchiseType", filters.franchiseType);

      const response = await axios.get(
        `${API_BASE_URL}filter/getAllBrandsAndFilter?${params.toString()}`,
        { signal }
      );

      const brands =
        response.data?.data?.brands?.map((brand) => ({
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
          isLiked: Boolean(brand?.isLiked),
          isShortListed: Boolean(brand?.isShortListed),
        })) || [];

      return {
        brands,
        pagination: response.data?.data?.pagination || {
          currentPage: 1,
          totalPages: 1,
          limit: filters.limit ?? 20,
          total: 0,
          hasNext: false,
          hasPrevious: false,
        },
      };
    } catch (error) {
      if (axios.isCancel(error)) return;
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch brands"
      );
    }
  }
);

// ─── Initial State ────────────────────────────────────────────────────────────
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
    maincat: null,
    subcat: null,
    childcat: null,
    searchTerm: '',
    country: null,
    state: null,
    district: null,
    city: null,
    investmentRange: null,
    areaRequired: null,
    modelType: null,       // → sent as ?modelType=  → backend: fico.franchiseModel
    franchiseType: null,   // → sent as ?franchiseType= → backend: fico.franchiseType
    page: 1,
    limit: 20,
  },
  cacheKey: Date.now(),
};

// ─── Slice ────────────────────────────────────────────────────────────────────
const filterBrandSlice = createSlice({
  name: 'filterBrands',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      const { filterName, value } = action.payload;
      state.filters[filterName] = value || null;

      // Reset dependent filters when parent changes
      if (filterName === "maincat") {
        state.filters.subcat = null;
        state.filters.childcat = null;
      }
      if (filterName === "subcat") {
        state.filters.childcat = null;
      }
      if (filterName === "state") {
        state.filters.district = null;
        state.filters.city = null;
      }
      if (filterName === "district") {
        state.filters.city = null;
      }
      // When the top-level model changes, clear the sub-type
      if (filterName === "modelType") {
        state.filters.franchiseType = null;
      }

      // Reset to first page on any filter change
      state.filters.page = 1;
      state.pagination.currentPage = 1;
      state.cacheKey = Date.now();
    },

    resetFilters: (state) => {
      state.filters = { ...initialState.filters };
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

    toggleBrandLikefilter: (state, action) => {
      const brandId = action.payload;
      state.brands = state.brands.map((brand) =>
        brand?.uuid === brandId
          ? { ...brand, isLiked: !brand.isLiked }
          : brand
      );
    },

    toggleBrandShortListfilter: (state, action) => {
      const brandId = action.payload;
      state.brands = state.brands.map((brand) =>
        brand?.uuid === brandId
          ? { ...brand, isShortListed: !brand?.isShortListed }
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

        // Stable sort: brands with videos first, then by UUID
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
        state.error = action.payload || 'Failed to fetch brands';
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
