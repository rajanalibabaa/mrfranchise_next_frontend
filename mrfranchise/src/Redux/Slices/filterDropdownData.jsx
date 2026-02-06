// "use client";
// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';
 
// const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/`;
 
// // Async thunk for fetching all filter options
// export const fetchFilterOptions = createAsyncThunk(
//   'filterDropdown/fetchFilterOptions',
//   async (params = {}, { rejectWithValue }) => {
//     try {
//       const { sub, state, district, main, areaRequired   } = params;
//       const queryParams = new URLSearchParams();
//       // console.log("===params=== ",params)
 
//       if (sub) queryParams.append('sub', sub);
//       if (state) queryParams.append('state', state);
//             if (areaRequired) queryParams.append('areaRequired', areaRequired);
 
//       if (district) queryParams.append('district', district);
//       if (main) queryParams.append('main', main);
//       else queryParams.append('main', "Food & Beverages")
//             if (areaRequired) queryParams.append('areaRequired', areaRequired);
 
 
//       const response = await axios.post(`${API_BASE_URL}filter/getAllBrandFiltersdata?${queryParams.toString()}`);
// console.log("===response=== ",response.data.data)
 
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );
 
// const initialState = {
//   // Main filter options
//   mainCategories: [],
//   subCategories: [],
//   childCategories: [],
//   investmentRanges: [],
//   areaRequired: [],
//   franchiseModels: [],
//   states: [],
//   districts: [],
//   cities: [],
 
//   // Loading states
//   loading: false,
//   loadingChildCategories: false,
//   loadingDistricts: false,
//   loadingCities: false,
 
//   // Error states
//   error: null,
//   childCategoriesError: null,
//   districtsError: null,
//   citiesError: null,
// };
 
// // console.log("===initialState=== ",initialState)//
 
// const filterDropdownSlice = createSlice({
//   name: 'filterDropdown',
//   initialState,
//   reducers: {
//     resetChildCategories: (state) => {
//       state.childCategories = [];
//     },
//     resetDistricts: (state) => {
//       state.districts = [];
//     },
//     resetCities: (state) => {
//       state.cities = [];
//     },
//     clearErrors: (state) => {
//       state.error = null;
//       state.childCategoriesError = null;
//       state.districtsError = null;
//       state.citiesError = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Handle pending states for all cases
//       .addCase(fetchFilterOptions.pending, (state, action) => {
//         const params = action.meta.arg || {};
//         if (params.main) {
//           state.loading = true;
//         }
//         if (params.sub) {
//           state.loadingChildCategories = true;
//         }
//         if (params.state) {
//           state.loadingDistricts = true;
//         }
//         if (params.areaRequired) {
//           state.loadingAreaRequired = true;
//         }
//         if (params.district) {
//           state.loadingCities = true;
//         }
//         if (params.areaRequired) {
//           state.loadingAreaRequired = true;
//         }
//         if (!action.meta.arg) {
//           state.loading = true;
//         }
//       })
//       .addCase(fetchFilterOptions.fulfilled, (state, action) => {
//         const params = action.meta.arg || {};
 
//         if (params.sub) {
//           // Child categories response
//           state.childCategories = action.payload;
//           state.loadingChildCategories = false;
//         } else if (params.state) {
//           // Districts response
//           state.districts = action.payload;
//           state.loadingDistricts = false;
//         } else if (params.district) {
//           // Cities response
//           state.cities = action.payload;
//           state.loadingCities = false;
//         }else if (params.areaRequired) {
//           // ✅ Area required filter results — keep separately
//           state.areaRequired =
//             action.payload.areaRequired || action.payload || [];
//           state.loading = false;
//         }
       
//         else if (params.main) {
//           // Subcategories and other filtered options for selected main category
//           state.subCategories = action.payload.subcat || [];
//           state.investmentRanges = action.payload.investmentRange || [];
//           state.franchiseModels = action.payload.franchiseModel || [];
//           state.states = action.payload.states || [];
//           state.areaRequired = action.payload.areaRequired || [];
//           // Optionally set childCategories if you want all children under main (but UI fetches per sub)
//           // state.childCategories = action.payload.childcat || [];
//           state.loading = false;
//         } else {
//           // Initial full filters response
//           state.mainCategories = action.payload.maincat || [];
//           state.subCategories = action.payload.subcat || [];
//           state.investmentRanges = action.payload.investmentRange || [];
//           state.franchiseModels = action.payload.franchiseModel || [];
//           state.states = action.payload.states || [];
//           state.areaRequired = action.payload.areaRequired || [];
//           state.loading = false;
 
//           // console.log("Fetched all filter options:", action.payload);
//         }
//       })
//       .addCase(fetchFilterOptions.rejected, (state, action) => {
//         const params = action.meta.arg || {};
 
//         if (params.sub) {
//           state.childCategoriesError = action.payload;
//           state.loadingChildCategories = false;
//         } else if (params.state) {
//           state.districtsError = action.payload;
//           state.loadingDistricts = false;
//         } else if (params.district) {
//           state.citiesError = action.payload;
//           state.loadingCities = false;
//         } else if (params.areaRequired) {
//           state.error = action.payload;
//           state.loading = false;
//         }
       
//         else if (params.main) {
//           state.error = action.payload;
//           state.loading = false;
//         } else {
//           state.error = action.payload;
//           state.loading = false;
//         }
//       });
//   }
// });
 
// export const {
//   resetChildCategories,
//   resetDistricts,
//   resetCities,
//   clearErrors
// } = filterDropdownSlice.actions;
 
// export default filterDropdownSlice.reducer;
 

"use client";
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/`;

// ✅ SINGLETON: Track if we've already fetched the main filters
let hasFetchedInitialFilters = false;

export const fetchFilterOptions = createAsyncThunk(
  'filterDropdown/fetchFilterOptions',
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const { sub, state, district, main, areaRequired } = params;
      const queryParams = new URLSearchParams();

      // Always send main category (default to Food & Beverages)
      queryParams.append('main', main || "Food & Beverages");

      if (sub) queryParams.append('sub', sub);
      if (state) queryParams.append('state', state);
      if (district) queryParams.append('district', district);
      if (areaRequired) queryParams.append('areaRequired', areaRequired);

      const response = await axios.post(
        `${API_BASE_URL}filter/getAllBrandFiltersdata?${queryParams.toString()}`
      );

      return {
        data: response.data.data,
        type: sub ? 'child' : state ? 'districts' : district ? 'cities' : areaRequired ? 'area' : 'main',
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
  {
    // 🔥 THIS IS THE KEY: Prevent duplicate initial calls
    condition: (params = {}, { getState }) => {
      const state = getState();
      const { mainCategories, loading } = state.filterDropdown;

      // If no params → this is initial load
      if (!params || Object.keys(params).length === 0) {
        // Already have main categories AND not loading → skip
        if (mainCategories.length > 0 && !loading) {
          return false;
        }
        // Already fetched once in this session → skip
        if (hasFetchedInitialFilters) {
          return false;
        }
      }

      return true;
    }
  }
);

const initialState = {
  mainCategories: [],
  subCategories: [],
  childCategories: [],
  investmentRanges: [],
  areaRequired: [],
  franchiseModels: [],
  states: [],
  districts: [],
  cities: [],

  loading: false,
  loadingChildCategories: false,
  loadingDistricts: false,
  loadingCities: false,

  error: null,
  childCategoriesError: null,
  districtsError: null,
  citiesError: null,
};

const filterDropdownSlice = createSlice({
  name: 'filterDropdown',
  initialState,
  reducers: {
    resetChildCategories: (state) => { state.childCategories = []; },
    resetDistricts: (state) => { state.districts = []; state.cities = []; },
    resetCities: (state) => { state.cities = []; },
    clearErrors: (state) => {
      state.error = null;
      state.childCategoriesError = null;
      state.districtsError = null;
      state.citiesError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilterOptions.pending, (state, action) => {
        const params = action.meta.arg || {};
        if (!params || !Object.keys(params).length) {
          state.loading = true;
          hasFetchedInitialFilters = true; // Mark as fetched
        }
        if (params.sub) state.loadingChildCategories = true;
        if (params.state) state.loadingDistricts = true;
        if (params.district) state.loadingCities = true;
      })
      .addCase(fetchFilterOptions.fulfilled, (state, action) => {
        const { data, type } = action.payload;

        if (type === 'child') {
          state.childCategories = data || [];
          state.loadingChildCategories = false;
        }
        else if (type === 'districts') {
          state.districts = data || [];
          state.loadingDistricts = false;
        }
        else if (type === 'cities') {
          state.cities = data || [];
          state.loadingCities = false;
        }
        else if (type === 'area') {
          state.areaRequired = data?.areaRequired || data || [];
        }
        else if (type === 'main') {
          // Only update if it's a fresh main category change
          state.subCategories = data.subcat || [];
          state.investmentRanges = data.investmentRange || [];
          state.franchiseModels = data.franchiseModel || [];
          state.states = data.states || [];
          state.areaRequired = data.areaRequired || [];
          state.loading = false;
        }
        else {
          // Initial full load (no params)
          state.mainCategories = data.maincat || [];
          state.subCategories = data.subcat || [];
          state.investmentRanges = data.investmentRange || [];
          state.franchiseModels = data.franchiseModel || [];
          state.states = data.states || [];
          state.areaRequired = data.areaRequired || [];
          state.loading = false;
        }
      })
      .addCase(fetchFilterOptions.rejected, (state, action) => {
        const params = action.meta.arg || {};
        state.loading = false;
        state.loadingChildCategories = false;
        state.loadingDistricts = false;
        state.loadingCities = false;

        if (params.sub) state.childCategoriesError = action.payload;
        else if (params.state) state.districtsError = action.payload;
        else if (params.district) state.citiesError = action.payload;
        else state.error = action.payload;
      });
  }
});

export const { resetChildCategories, resetDistricts, resetCities, clearErrors } = filterDropdownSlice.actions;

export default filterDropdownSlice.reducer;