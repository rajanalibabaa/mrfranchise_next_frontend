import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/`;

// Async thunk for fetching all filter options
export const fetchFilterOptions = createAsyncThunk(
  'filterDropdown/fetchFilterOptions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { main, sub, state, district, areaRequired, productTags } = params;
      const queryParams = new URLSearchParams();

      if (main) queryParams.append('main', main);
      if (sub) queryParams.append('sub', sub);
      if (state) queryParams.append('state', state);
      if (district) queryParams.append('district', district);
      if (areaRequired) queryParams.append('areaRequired', areaRequired);
      if (productTags) queryParams.append('productTags', productTags);

      const response = await axios.post(`${API_BASE_URL}filter/getAllBrandFiltersdata?${queryParams.toString()}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
  {
    condition: (params = {}, { getState }) => {
      const { filterDropdown } = getState();
      const isEmptyRequest = !params || Object.keys(params).length === 0;
      const alreadyLoaded =
        filterDropdown.mainCategories.length > 0 ||
        filterDropdown.states.length > 0;

      if (isEmptyRequest && alreadyLoaded) {
        return false;
      }

      return true;
    },
  }
);


const initialState = {
  // Main filter options  
  mainCategories: [],
  subCategories: [],
  childCategories: [],
  investmentRanges: [],
  areaRequired: [],
  franchiseModels: [],
  states: [],
  districts: [],
  cities: [],
  tags: [],

  // Loading states
  loading: false,
  loadingChildCategories: false,
  loadingDistricts: false,
  loadingCities: false,

  // Error states
  error: null,
  childCategoriesError: null,
  districtsError: null,
  citiesError: null,
};

const filterDropdownSlice = createSlice({
  name: 'filterDropdown',
  initialState,
  reducers: {
    resetChildCategories: (state) => {
      state.childCategories = [];
    },
    resetDistricts: (state) => {
      state.districts = [];
    },
    resetCities: (state) => {
      state.cities = [];
    },
    resetTags: (state) => {
      state.tags = [];
    },
    clearErrors: (state) => {
      state.error = null;
      state.childCategoriesError = null;
      state.districtsError = null;
      state.citiesError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle pending states for all cases
      .addCase(fetchFilterOptions.pending, (state, action) => {
        const params = action.meta.arg || {};

        if (!Object.keys(params).length || params.main || params.areaRequired) {
          state.loading = true;
        }
        if (params.sub) {
          state.loadingChildCategories = true;
        }
        if (params.state) {
          state.loadingDistricts = true;
        }
        if (params.district) {
          state.loadingCities = true;
        }
      })
      .addCase(fetchFilterOptions.fulfilled, (state, action) => {
        const payload = action.payload || {};

        state.mainCategories = payload.maincat || state.mainCategories;
        state.subCategories = payload.subcat || state.subCategories;
        state.investmentRanges = payload.investmentRange || state.investmentRanges;
        state.franchiseModels = payload.franchiseModel || state.franchiseModels;
        state.states = payload.states || state.states;
        state.areaRequired = payload.areaRequired || state.areaRequired;
        state.childCategories = payload.productTags || state.childCategories;
        state.tags = payload.tags || state.tags;

        if (Array.isArray(payload.districts)) {
          state.districts = payload.districts;
        } else if (Array.isArray(action.payload)) {
          state.districts = action.payload;
        }

        if (Array.isArray(payload.cities)) {
          state.cities = payload.cities;
        } else if (Array.isArray(action.payload)) {
          state.cities = action.payload;
        }

        state.loading = false;
        state.loadingChildCategories = false;
        state.loadingDistricts = false;
        state.loadingCities = false;
      })
      .addCase(fetchFilterOptions.rejected, (state, action) => {
        const params = action.meta.arg || {};
        const errorMessage = action.payload || action.error?.message || null;

        if (params.sub) {
          state.childCategoriesError = errorMessage;
          state.loadingChildCategories = false;
        }
        if (params.state) {
          state.districtsError = errorMessage;
          state.loadingDistricts = false;
        }
        if (params.district) {
          state.citiesError = errorMessage;
          state.loadingCities = false;
        }
        if (!Object.keys(params).length || params.main || params.areaRequired) {
          state.error = errorMessage;
          state.loading = false;
        }
      });
  }
});

export const {
  resetChildCategories,
  resetDistricts,
  resetCities,
  clearErrors
} = filterDropdownSlice.actions;

export default filterDropdownSlice.reducer;  