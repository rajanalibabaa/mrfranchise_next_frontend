import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/`;

// Async thunk for fetching all filter options
export const fetchFilterOptions = createAsyncThunk(
  'filterDropdown/fetchFilterOptions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { sub, state, district, main, areaRequired, productTags } = params;
      
      const queryParams = new URLSearchParams();

      if (sub) queryParams.append('sub', sub);
      if (state) queryParams.append('state', state);
      if (areaRequired) queryParams.append('areaRequired', areaRequired);
      if (district) queryParams.append('district', district);
      if (main) queryParams.append('main', main);
      if (productTags) queryParams.append('productTags', productTags);

      const response = await axios.post(`${API_BASE_URL}filter/getAllBrandFiltersdata?${queryParams.toString()}`);
      console.log("filterdropdowndata", response.data.data);

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
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
        if (params.main) {
          state.loading = true;
        }
        if (params.sub) {
          state.loadingChildCategories = true;
        }
        if (params.state) {
          state.loadingDistricts = true;
        }
        if (params.areaRequired) {
          state.loading = true;
        }
        if (params.district) {
          state.loadingCities = true;
        }
        if (!action.meta.arg || Object.keys(params).length === 0) {
          state.loading = true;
        }
      })
      .addCase(fetchFilterOptions.fulfilled, (state, action) => {
        const params = action.meta.arg || {};

        if (params.sub) {
          // Child categories (productTags) response
          state.childCategories = action.payload?.productTags || [];
          state.loadingChildCategories = false;
        } else if (params.state) {
          // Districts response
          state.districts = action.payload || [];
          state.loadingDistricts = false;
        } else if (params.district) {
          // Cities response
          state.cities = action.payload || [];
          state.loadingCities = false;
        } else if (params.areaRequired) {
          // Area required filter results
          state.areaRequired = action.payload.areaRequired || action.payload || [];
          state.loading = false;
        } else if (params.main) {
          // Subcategories and other filtered options for selected main category
          state.subCategories = action.payload.subcat || [];
          state.investmentRanges = action.payload.investmentRange || [];
          state.franchiseModels = action.payload.franchiseModel || [];
          state.states = action.payload.states || [];
          state.areaRequired = action.payload.areaRequired || [];
          state.loading = false;
        } else {
          // Initial full filters response
          state.mainCategories = action.payload.maincat || [];
          state.subCategories = action.payload.subcat || [];
          state.investmentRanges = action.payload.investmentRange || [];
          state.franchiseModels = action.payload.franchiseModel || [];
          state.states = action.payload.states || [];
          state.areaRequired = action.payload.areaRequired || [];
          state.loading = false;
        }
      })
      .addCase(fetchFilterOptions.rejected, (state, action) => {
        const params = action.meta.arg || {};

        if (params.sub) {
          state.childCategoriesError = action.payload;
          state.loadingChildCategories = false;
        } else if (params.state) {
          state.districtsError = action.payload;
          state.loadingDistricts = false;
        } else if (params.district) {
          state.citiesError = action.payload;
          state.loadingCities = false;
        } else if (params.areaRequired) {
          state.error = action.payload;
          state.loading = false;
        } else if (params.main) {
          state.error = action.payload;
          state.loading = false;
        } else {
          state.error = action.payload;
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