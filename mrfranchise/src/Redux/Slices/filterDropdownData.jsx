// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';

// const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/`;

// // Async thunk for fetching all filter options
// export const fetchFilterOptions = createAsyncThunk(
//   'filterDropdown/fetchFilterOptions',
//   async (params = {}, { rejectWithValue }) => {
//     try {
//       const { main, sub, state, district, areaRequired, productTags } = params;
//       const queryParams = new URLSearchParams();

//       if (main) queryParams.append('main', main);
//       if (sub) queryParams.append('sub', sub);
//       if (state) queryParams.append('state', state);
//       if (district) queryParams.append('district', district);
//       if (areaRequired) queryParams.append('areaRequired', areaRequired);
//       if (productTags) queryParams.append('productTags', productTags);

//       const response = await axios.post(`${API_BASE_URL}filter/getAllBrandFiltersdata?${queryParams.toString()}`);
      
//             console.log("responsefrom foilter dropdata",response);

//       return response.data.data;

      
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   },
//   {
//     condition: (params = {}, { getState }) => {
//       const { filterDropdown } = getState();
//       const isEmptyRequest = !params || Object.keys(params).length === 0;
//       const alreadyLoaded =
//         filterDropdown.mainCategories.length > 0 ||
//         filterDropdown.states.length > 0;

//       if (isEmptyRequest && alreadyLoaded) {
//         return false;
//       }

//       return true;
//     },
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
//   tags: [],

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
//     resetTags: (state) => {
//       state.tags = [];
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

//         if (!Object.keys(params).length || params.main || params.areaRequired) {
//           state.loading = true;
//         }
//         if (params.sub) {
//           state.loadingChildCategories = true;
//         }
//         if (params.state) {
//           state.loadingDistricts = true;
//         }
//         if (params.district) {
//           state.loadingCities = true;
//         }
//       })
//       .addCase(fetchFilterOptions.fulfilled, (state, action) => {
//         const payload = action.payload || {};

//         state.mainCategories = payload.maincat || state.mainCategories;
//         state.subCategories = payload.subcat || state.subCategories;
//         state.investmentRanges = payload.investmentRange || state.investmentRanges;
//         state.franchiseModels = payload.franchiseModel || state.franchiseModels;
//         state.states = payload.states || state.states;
//         state.areaRequired = payload.areaRequired || state.areaRequired;
//         state.childCategories = payload.productTags || state.childCategories;
//         state.tags = payload.tags || state.tags;

//         if (Array.isArray(payload.districts)) {
//           state.districts = payload.districts;
//         } else if (Array.isArray(action.payload)) {
//           state.districts = action.payload;
//         }

//         if (Array.isArray(payload.cities)) {
//           state.cities = payload.cities;
//         } else if (Array.isArray(action.payload)) {
//           state.cities = action.payload;
//         }

//         state.loading = false;
//         state.loadingChildCategories = false;
//         state.loadingDistricts = false;
//         state.loadingCities = false;
//       })
//       .addCase(fetchFilterOptions.rejected, (state, action) => {
//         const params = action.meta.arg || {};
//         const errorMessage = action.payload || action.error?.message || null;

//         if (params.sub) {
//           state.childCategoriesError = errorMessage;
//           state.loadingChildCategories = false;
//         }
//         if (params.state) {
//           state.districtsError = errorMessage;
//           state.loadingDistricts = false;
//         }
//         if (params.district) {
//           state.citiesError = errorMessage;
//           state.loadingCities = false;
//         }
//         if (!Object.keys(params).length || params.main || params.areaRequired) {
//           state.error = errorMessage;
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

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/`;

export const fetchFilterOptions = createAsyncThunk(
  'filterDropdown/fetchFilterOptions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const {
        main,
        sub,
        state,
        district,
        areaRequired,
        productTags,
        franchiseModel,
      } = params;

      const queryParams = new URLSearchParams();

      if (main)           queryParams.append('main', main);
      if (sub)            queryParams.append('sub', sub);
      if (state)          queryParams.append('state', state);
      if (district)       queryParams.append('district', district);
      if (areaRequired)   queryParams.append('areaRequired', areaRequired);
      if (productTags)    queryParams.append('productTags', productTags);
      if (franchiseModel) queryParams.append('franchiseModel', franchiseModel);
      

      const response = await axios.post(
        `${API_BASE_URL}filter/getAllBrandFiltersdata?${queryParams.toString()}`
      );

      console.log("response from filter dropdata", response);

      // Return both the data and params so the reducer can branch correctly
      return {
        data: response.data.data,
        params,
      };

    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
  {
    condition: (params = {}, { getState }) => {
      const { filterDropdown } = getState();

      // Always allow franchiseModel requests — they fetch different data each time
      if (params?.franchiseModel) return true;

      const isEmptyRequest = !params || Object.keys(params).length === 0;
      const alreadyLoaded =
        filterDropdown.mainCategories.length > 0 ||
        filterDropdown.states.length > 0;

      if (isEmptyRequest && alreadyLoaded) return false;

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
  franchiseModels: [],   // flat list: ["FRANCHISE BUSINESS", "DEALERS & DISTRIBUTORS", ...]
  states: [],
  districts: [],
  cities: [],
  tags: [],

  // ── Franchise Model/Type state ───────────────────────────────────────────
  // Populated when ?franchiseModel=... is passed
  // Backend returns: { franchiseModel, franchiseheading, franchiseTypedata }
  activeFranchiseModel: null,  // e.g. "FRANCHISE BUSINESS"
  franchiseHeading: {},        // grouped: { "CLOUD KITCHEN": ["CLOUD KITCHEN"], "COCO": [...] }
  franchiseTypeData: [],       // flat:    ["CLOUD KITCHEN", "COCO - Area Franchise", ...]

  // Loading states
  loading: false,
  loadingChildCategories: false,
  loadingDistricts: false,
  loadingCities: false,
  loadingFranchiseTypes: false,

  // Error states
  error: null,
  childCategoriesError: null,
  districtsError: null,
  citiesError: null,
  franchiseTypesError: null,
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
      state.cities = [];
    },
    resetCities: (state) => {
      state.cities = [];
    },
    resetTags: (state) => {
      state.tags = [];
    },
    // Call this when user clears the franchise model selection
    resetFranchiseTypes: (state) => {
      state.activeFranchiseModel = null;
      state.franchiseHeading     = {};
      state.franchiseTypeData    = [];
      state.franchiseTypesError  = null;
    },
    clearErrors: (state) => {
      state.error                = null;
      state.childCategoriesError = null;
      state.districtsError       = null;
      state.citiesError          = null;
      state.franchiseTypesError  = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ── PENDING ────────────────────────────────────────────────────────────
      .addCase(fetchFilterOptions.pending, (state, action) => {
        const params = action.meta.arg || {};

        if (params.franchiseModel) {
          state.loadingFranchiseTypes = true;
          state.franchiseTypesError   = null;
          return;
        }
        if (!Object.keys(params).length || params.main || params.areaRequired) {
          state.loading = true;
        }
        if (params.sub)      state.loadingChildCategories = true;
        if (params.state)    state.loadingDistricts       = true;
        if (params.district) state.loadingCities          = true;
      })

      // ── FULFILLED ──────────────────────────────────────────────────────────
      .addCase(fetchFilterOptions.fulfilled, (state, action) => {
        const { data: payload, params } = action.payload || {};
        const safe = payload || {};

        // ── Branch 1: franchiseModel query ──
        // Backend response shape:
        // {
        //   franchiseModel: "FRANCHISE BUSINESS",
        //   franchiseheading: { "CLOUD KITCHEN": [...], "COCO": [...] },
        //   franchiseTypedata: ["CLOUD KITCHEN", "COCO - Area Franchise", ...]
        // }
        if (params?.franchiseModel) {
          state.activeFranchiseModel  = safe.franchiseModel    ?? null;
          state.franchiseHeading      = safe.franchiseheading  ?? {};
          state.franchiseTypeData     = safe.franchiseTypedata ?? [];
          state.loadingFranchiseTypes = false;
          return;
        }

        // ── Branch 2: state query → returns plain array of districts ──
        if (params?.state && Array.isArray(payload)) {
          state.districts       = payload;
          state.loadingDistricts = false;
          return;
        }

        // ── Branch 3: district query → returns plain array of cities ──
        if (params?.district && Array.isArray(payload)) {
          state.cities       = payload;
          state.loadingCities = false;
          return;
        }

        // ── Branch 4: sub query → child categories / tags ──
        // Backend returns: { productTags: [...], serviceTags: [...] }
        if (params?.sub) {
          state.childCategories        = safe.productTags ?? state.childCategories;
          state.tags                   = safe.serviceTags ?? state.tags;
          state.loadingChildCategories = false;
          return;
        }

        // ── Branch 5: main/industry query → sub-categories ──
        // Backend returns: { subcat, investmentRange, areaRequired, franchiseModel, states }
        if (params?.main || params?.industry) {
          state.subCategories   = safe.subcat          ?? state.subCategories;
          state.investmentRanges = safe.investmentRange ?? state.investmentRanges;
          state.franchiseModels = safe.franchiseModel  ?? state.franchiseModels;
          state.areaRequired    = safe.areaRequired    ?? state.areaRequired;
          state.states          = safe.states          ?? state.states;
          state.loading         = false;
          return;
        }

        // ── Branch 6: initial load (no params) ──
        // Backend returns: { maincat, investmentRange, areaRequired, franchiseModel, states }
        state.mainCategories   = safe.maincat          ?? state.mainCategories;
        state.investmentRanges = safe.investmentRange  ?? state.investmentRanges;
        state.franchiseModels  = safe.franchiseModel   ?? state.franchiseModels;
        state.areaRequired     = safe.areaRequired     ?? state.areaRequired;
        state.states           = safe.states           ?? state.states;

        // In case districts/cities somehow come back in a normal payload
        if (Array.isArray(safe.districts)) state.districts = safe.districts;
        if (Array.isArray(safe.cities))    state.cities    = safe.cities;

        state.loading                = false;
        state.loadingChildCategories = false;
        state.loadingDistricts       = false;
        state.loadingCities          = false;
      })

      // ── REJECTED ───────────────────────────────────────────────────────────
      .addCase(fetchFilterOptions.rejected, (state, action) => {
        const params       = action.meta.arg || {};
        const errorMessage = action.payload || action.error?.message || null;

        if (params.franchiseModel) {
          state.franchiseTypesError   = errorMessage;
          state.loadingFranchiseTypes = false;
          return;
        }
        if (params.sub) {
          state.childCategoriesError   = errorMessage;
          state.loadingChildCategories = false;
        }
        if (params.state) {
          state.districtsError   = errorMessage;
          state.loadingDistricts = false;
        }
        if (params.district) {
          state.citiesError   = errorMessage;
          state.loadingCities = false;
        }
        if (!Object.keys(params).length || params.main || params.areaRequired) {
          state.error   = errorMessage;
          state.loading = false;
        }
      });
  },
});

export const {
  resetChildCategories,
  resetDistricts,
  resetCities,
  resetTags,
  resetFranchiseTypes,
  clearErrors,
} = filterDropdownSlice.actions;

export default filterDropdownSlice.reducer;