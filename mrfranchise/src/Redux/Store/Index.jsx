

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import all your reducers
import authReducer from "../Slices/AuthSlice/authSlice";
import navReducer from "../Slices/navbarSlice";
import loadingReducer from "../Slices/loadingSlice";
import getAllBrands from "../Slices/GetAllBrandsDataUpdationFile";
import openBrandViewPage from "../Slices/OpenBrandNewPageSlice";
import overAllPlatformReducer from "../Slices/TopCardFetchingSlice";
import filterDropdown from "../Slices/filterDropdownData";
import filterBrandReducer from "../Slices/FilterBrandSlice";
import brandCategoryReducer from "../Slices/SideMenuHoverBrandSlices";
import ShortListBrands from "../Slices/shortlistslice";
import LikedBrands from "../Slices/likeSlice"
import viewedBrands from "../Slices/viewSlice.jsx"
import userRequestReducer from "../Slices/userRequestSlice.jsx"


// Combine reducers first
const rootReducer = combineReducers({
  navbar: navReducer,
  auth: authReducer,
  filterBrands: filterBrandReducer,
  overAllPlatform: overAllPlatformReducer,
  filterDropdown: filterDropdown,
  loading: loadingReducer,
  brands: getAllBrands,
  // foodfranchise: topFoodsfranchise,
  openBrandDialog: openBrandViewPage,
  brandCategory: brandCategoryReducer,
  shortList: ShortListBrands,
  likedBrands: LikedBrands,
  viewBrands: viewedBrands,
  requests: userRequestReducer
});

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'shortlist'] // Only persist these slices
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);