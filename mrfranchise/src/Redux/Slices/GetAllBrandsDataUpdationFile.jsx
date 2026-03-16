"use client";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '@/Api/api';
import { getUserId } from '@/Utils/autherId';
const userId = getUserId();
export const fetchBrands = createAsyncThunk(
  'brands/fetchAll',
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/overAllPlatformOnlyMainCategory`,
        { params: { page, id: userId } }
      );
      // API returns { data: { brands: [...], pagination: { … } } }
      return { brands: data.data.brands, pagination: data.data.pagination, page };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: 'Unknown error' }
      );
    }
  }
);

const initialState = {
  brands: [],
  fetchedPages: [],      // track which pages we’ve loaded
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,      // renamed to match your UI
    hasPrevious: false,
  },
  isLoading: false,
  error: null,
};

const brandsSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    resetBrands(state) {
      // clear everything so we can re‐fetch page 1 from scratch
      Object.assign(state, initialState);
    },
    toggleBrandLike(state, action) {
      const id = action.payload;
      state.brands = state.brands.map(b =>
        b.uuid === id ? { ...b, isLiked: !b.isLiked } : b
      );
    },
    toggleBrandShortList(state, action) {
      const id = action.payload;
      state.brands = state.brands.map(b =>
        b.uuid === id
          ? { ...b, isShortListed: !b.isShortListed }
          : b
      );
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBrands.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        // if we’re reloading page 1, drop the old data:
        if (action.meta.arg.page === 1) {
          state.brands = [];
          state.fetchedPages = [];
        }
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        const { brands, pagination, page } = action.payload;
        state.isLoading = false;

        // massage the API’s pagination into your UI shape:
        state.pagination = {
          currentPage: page,
          totalPages: pagination.totalPages,
          totalItems: pagination.totalItems,
          hasNext: pagination.hasNextPage,       // <— renamed here
          hasPrevious: pagination.hasPreviousPage
        };

        // avoid dupes if someone asks for the same page twice:
        if (!state.fetchedPages.includes(page)) {
          state.fetchedPages.push(page);
          if (page === 1) {
            state.brands = brands;
          } else {
            state.brands = state.brands.concat(brands);
          }
        }
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      });
  }
});

export const {
  resetBrands,
  toggleBrandLike,
  toggleBrandShortList
} = brandsSlice.actions;
export default brandsSlice.reducer;
