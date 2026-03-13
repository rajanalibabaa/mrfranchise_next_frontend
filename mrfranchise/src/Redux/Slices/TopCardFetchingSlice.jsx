// src/features/topFoodFranchiseSlice.js
"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "@/Api/api";
import { getUserId } from "@/Utils/autherId";

const userId = getUserId();
// Top Food Franchises
export const homeSection1 = createAsyncThunk(
  "homeSection1/fetchAll",
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/overAllPlatformOnlyMainCategory?main=Food %26 Beverages`,
        {
          params: { page, id: userId },
        }
      );

      if (!response.data.data || !response.data.data.brands) {
        console.error("Unexpected API response structure:", response.data);
        throw new Error("Invalid API response structure");
      }

      return {
        brands: response.data.data.brands,
        pagination: response.data.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);
// Top Beverage Franchises  
export const homeSection2 = createAsyncThunk(
  "homeSection2/fetchAll",
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/overAllPlatformOnlyMainCategory?main=Retail`,
        {
          params: { page, id: userId },
        }
      );

      if (!response.data.data || !response.data.data.brands) {
        console.error("Unexpected API response structure:", response.data);
        throw new Error("Invalid API response structure");
      }

      return {
        brands: response.data.data.brands,
        pagination: response.data.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);
// Top Cafes & Teas Franchises
export const homeSection3 = createAsyncThunk(
  "homeSection3/fetchAll",
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/overAllPlatformOnlyMainCategory?main=Education`,
        {
          params: { page, id: userId },
        }
      );

      if (!response.data.data || !response.data.data.brands) {
        console.error("Unexpected API response structure:", response.data);
        throw new Error("Invalid API response structure");
      }

      return {
        brands: response.data.data.brands,
        pagination: response.data.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);
// Top Bakery, Confectionery %26 Traditional Sweets
export const homeSection4 = createAsyncThunk(
  "homeSection4/fetchAll",
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/overAllPlatformOnlyMainCategory?main=Automobile`,
        {
          params: { page, id: userId },
        }
      );

      

      if (!response.data.data || !response.data.data.brands) {
        console.error("Unexpected API response structure:", response.data);
        throw new Error("Invalid API response structure");
      }

      return {
        brands: response.data.data.brands,
        pagination: response.data.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);


export const homeSection5 = createAsyncThunk(
  "homeSection5/fetchAll",
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/overAllPlatformOnlyMainCategory?main=Service`,
        {
          params: { page, id: userId },
        }
      );

      if (!response.data.data || !response.data.data.brands) {
        console.error("Unexpected API response structure:", response.data);
        throw new Error("Invalid API response structure");
      }
      return {
        brands: response.data.data.brands,
        pagination: response.data.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

// export const homeSection5 = createAsyncThunk(
//   "homeSection5/fetchAll",
//   async ({ page = 1 }, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}overAllPlatformOnlyMainCategory?main=Food %26 Beverages&sub=Food Trucks %26 Kiosks Franchises`,
//         {
//           params: { page, id: userId },
//         }
//       );

//       if (!response.data.data || !response.data.data.brands) {
//         console.error("Unexpected API response structure:", response.data);
//         throw new Error("Invalid API response structure");
//       }
//       return {
//         brands: response.data.data.brands,
//         pagination: response.data.data.pagination || {
//           currentPage: page,
//           totalPages: 1,
//           totalItems: 0,
//           hasNextPage: false,
//           hasPreviousPage: false,
//         },
//       };
//     } catch (error) {
//       console.error("API Error:", error.response?.data || error.message);
//       return rejectWithValue(
//         error.response?.data || { message: error.message }
//       );
//     }
//   }
// );



// Top Cloud Kitchen
export const homeSection6 = createAsyncThunk(
  "homeSection6/fetchAll",
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/overAllPlatformOnlyMainCategory?main=Others`,
        {
          params: { page, id: userId },
        }
      );

      if (!response.data.data || !response.data.data.brands) {
        console.error("Unexpected API response structure:", response.data);
        throw new Error("Invalid API response structure");
      }
      return {
        brands: response.data.data.brands,
        pagination: response.data.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);
// // Top HomeBased Business Services
export const homeSection7 = createAsyncThunk(
  "homeSection7/fetchAll",
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/overAllPlatformOnlyMainCategory?main=Food %26 Beverages&sub=Quick Service Restaurants (QSR)`,
        {
          params: { page, id: userId },
        }
      );

      if (!response.data.data || !response.data.data.brands) {
        console.error("Unexpected API response structure:", response.data);
        throw new Error("Invalid API response structure");
      }
      return {
        brands: response.data.data.brands,
        pagination: response.data.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);
export const homeSection8 = createAsyncThunk(
  "homeSection8/fetchAll",
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/overAllPlatformOnlyMainCategory?main=Food %26 Beverages&sub=Bars, Pubs %26 Lounges`,
        {
          params: { page, id: userId },
        }
      );

      if (!response.data.data || !response.data.data.brands) {
        console.error("Unexpected API response structure:", response.data);
        throw new Error("Invalid API response structure");
      }
      return {
        brands: response.data.data.brands,
        pagination: response.data.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);
// // Top Hotels And Resorts Franchises
// export const homeSection8 = createAsyncThunk(
//   "homeSection8/fetchAll",
//   async ({ page = 1 }, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/overAllPlatformOnlyMainCategory?main=Bars, Pubs %26 Lounges`,
//         {
//           params: { page, id: userId },
//         }
//       );
// console.log('sec8res',response);

//       if (!response.data.data || !response.data.data.brands) {
//         console.error("Unexpected API response structure:", response.data);
//         throw new Error("Invalid API response structure");
//       }
//       return {
//         brands: response.data.data.brands,
//         pagination: response.data.data.pagination || {
//           currentPage: page,
//           totalPages: 1,
//           totalItems: 0,
//           hasNextPage: false,
//           hasPreviousPage: false,
//         },
//       };
//     } catch (error) {
//       console.error("API Error:", error.response?.data || error.message);
//       return rejectWithValue(
//         error.response?.data || { message: error.message }
//       );
//     }
//   }
// );
// // Top Retail Franchises
// export const homeSection9 = createAsyncThunk(
//   "homeSection9/fetchAll",
//   async ({ page = 1 }, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/overAllPlatformOnlyMainCategory?main=Retails`,
//         {
//           params: { page, id: userId },
//         }
//       );

//       if (!response.data.data || !response.data.data.brands) {
//         console.error("Unexpected API response structure:", response.data);
//         throw new Error("Invalid API response structure");
//       }
//       return {
//         brands: response.data.data.brands,
//         pagination: response.data.data.pagination || {
//           currentPage: page,
//           totalPages: 1,
//           totalItems: 0,
//           hasNextPage: false,
//           hasPreviousPage: false,
//         },
//       };
//     } catch (error) {
//       console.error("API Error:", error.response?.data || error.message);
//       return rejectWithValue(
//         error.response?.data || { message: error.message }
//       );
//     }
//   }
// );
// // Top Sport & Fitness & Entertainment Franchises
// export const homeSection10 = createAsyncThunk(
//   "homeSection10/fetchAll",
//   async ({ page = 1 }, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/overAllPlatformOnlyMainCategory?main=Sports %26 Fitness %26 Entertainment`,
//         {
//           params: { page, id: userId },
//         }
//       );

//       if (!response.data.data || !response.data.data.brands) {
//         console.error("Unexpected API response structure:", response.data);
//         throw new Error("Invalid API response structure");
//       }
//       return {
//         brands: response.data.data.brands,
//         pagination: response.data.data.pagination || {
//           currentPage: page,
//           totalPages: 1,
//           totalItems: 0,
//           hasNextPage: false,
//           hasPreviousPage: false,
//         },
//       };
//     } catch (error) {
//       console.error("API Error:", error.response?.data || error.message);
//       return rejectWithValue(
//         error.response?.data || { message: error.message }
//       );
//     }
//   }
// );
const initialState = {
  homeSection1: {
    brands: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    isLoading: false,
    error: null,
    viewedBrandsCount: 0,
  },
  homeSection2: {
    brands: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    isLoading: false,
    error: null,
    viewedBrandsCount: 0,
  },
  homeSection3: {
    brands: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    isLoading: false,
    error: null,
    viewedBrandsCount: 0,
  },
  homeSection4: {
    brands: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    isLoading: false,
    error: null,
    viewedBrandsCount: 0,
  },
  homeSection5: {
    brands: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    isLoading: false,
    error: null,
    viewedBrandsCount: 0,
  },
  homeSection6: {
    brands: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    isLoading: false,
    error: null,
    viewedBrandsCount: 0,
  },
  homeSection7: {
    brands: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    isLoading: false,
    error: null,
    viewedBrandsCount: 0,
  },
  homeSection8: {
    brands: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    isLoading: false,
    error: null,
    viewedBrandsCount: 0,
  },
  // homeSection9: {
  //   brands: [],
  //   pagination: {
  //     currentPage: 1,
  //     totalPages: 1,
  //     totalItems: 0,
  //     hasNextPage: false,
  //     hasPreviousPage: false,
  //   },
  //   isLoading: false,
  //   error: null,
  //   viewedBrandsCount: 0,
  // },
  // homeSection10: {
  //   brands: [],
  //   pagination: {
  //     currentPage: 1,
  //     totalPages: 1,
  //     totalItems: 0,
  //     hasNextPage: false,
  //     hasPreviousPage: false,
  //   },
  //   isLoading: false,
  //   error: null,
  //   viewedBrandsCount: 0,
  // },
};

const OverAllPlatform = createSlice({
  name: "topBrands",
  initialState,
  reducers: {
    resethomeSection1: (state) => {
      state.homeSection1 = initialState.homeSection1;
    },
    resethomeSection2: (state) => {
      state.homeSection2 = initialState.homeSection2;
    },
    resethomeSection3: (state) => {
      state.homeSection3 = initialState.homeSection3;
    },
    resethomeSection4: (state) => {
      state.homeSection4 = initialState.homeSection4;
    },
    resethomeSection5: (state) => {
      state.homeSection5 = initialState.homeSection5;
    },
    resethomeSection6: (state) => {
      state.homeSection6 = initialState.homeSection6;
    },
    resethomeSection7: (state) => {
      state.homeSection7 = initialState.homeSection7;
    },
    resethomeSection8: (state) => {
      state.homeSection8 = initialState.homeSection8;
    },

    // resethomeSection9: (state) => {
    //   state.homeSection9 = initialState.homeSection9;
    // },

    // resethomeSection10: (state) => {
    //   state.homeSection10 = initialState.homeSection10;
    // },

    // ----------------------------------------------------
    homeSection1ViewedCount: (state) => {
      state.homeSection1.viewedBrandsCount += 1;
    },
    homeSection2ViewedCount: (state) => {
      state.homeSection2.viewedBrandsCount += 1;
    },
    homeSection3ViewedCount: (state) => {
      state.homeSection3.viewedBrandsCount += 1;
    },
    homeSection4ViewedCount: (state) => {
      state.homeSection4.viewedBrandsCount += 1;
    },
    homeSection5ViewedCount: (state) => {
      state.homeSection5.viewedBrandsCount += 1;
    },
    homeSection6ViewedCount: (state) => {
      state.homeSection6.viewedBrandsCount += 1;
    },
    homeSection7ViewedCount: (state) => {
      state.homeSection7.viewedBrandsCount += 1;
    },
    homeSection8ViewedCount: (state) => {
      state.homeSection8.viewedBrandsCount += 1;
    },
    // homeSection9ViewedCount: (state) => {
    //   state.homeSection9.viewedBrandsCount += 1;
    // },
    // homeSection10ViewedCount: (state) => {
    //   state.homeSection10.viewedBrandsCount += 1;
    // },

    // ------------------------------------------------------------
    resetHomeSection1ViewedCount: (state) => {
      state.homeSection1.viewedBrandsCount = 0;
    },
    resetHomeSection2ViewedCount: (state) => {
      state.homeSection2.viewedBrandsCount = 0;
    },
    resetHomeSection3ViewedCount: (state) => {
      state.homeSection3.viewedBrandsCount = 0;
    },
    resetHomeSection4ViewedCount: (state) => {
      state.homeSection4.viewedBrandsCount = 0;
    },
    resetHomeSection5ViewedCount: (state) => {
      state.homeSection5.viewedBrandsCount = 0;
    },
    resetHomeSection6ViewedCount: (state) => {
      state.homeSection6.viewedBrandsCount = 0;
    },
    resetHomeSection7ViewedCount: (state) => {
      state.homeSection7.viewedBrandsCount = 0;
    },
    resetHomeSection8ViewedCount: (state) => {
      state.homeSection8.viewedBrandsCount = 0;
    },
    // resetHomeSection9ViewedCount: (state) => {
    //   state.homeSection9.viewedBrandsCount = 0;
    // },
    // resetHomeSection10ViewedCount: (state) => {
    //   state.homeSection10.viewedBrandsCount = 0;
    // },

    toggleHomeCardLike: (state, action) => {
      const brandId = action.payload;
      state.homeSection1.brands = state.homeSection1.brands.map((brand) => {
        if (brand.uuid === brandId) {
          return {
            ...brand,
            isLiked: !brand.isLiked,
          };
        }
        return brand;
      });
      state.homeSection2.brands = state.homeSection2.brands.map((brand) => {
        if (brand.uuid === brandId) {
          return {
            ...brand,
            isLiked: !brand.isLiked,
          };
        }
        return brand;
      });
      state.homeSection3.brands = state.homeSection3.brands.map((brand) => {
        if (brand.uuid === brandId) {
          return {
            ...brand,
            isLiked: !brand.isLiked,
          };
        }
        return brand;
      });
      state.homeSection4.brands = state.homeSection4.brands.map((brand) => {
        if (brand.uuid === brandId) {
          return {
            ...brand,
            isLiked: !brand.isLiked,
          };
        }
        return brand;
      });
      state.homeSection5.brands = state.homeSection5.brands.map((brand) => {
        if (brand.uuid === brandId) {
          return {
            ...brand,
            isLiked: !brand.isLiked,
          };
        }
        return brand;
      });
      state.homeSection6.brands = state.homeSection6.brands.map((brand) => {
        if (brand.uuid === brandId) {
          return {
            ...brand,
            isLiked: !brand.isLiked,
          };
        }
        return brand;
      });
      state.homeSection7.brands = state.homeSection7.brands.map((brand) => {
        if (brand.uuid === brandId) {
          return {
            ...brand,
            isLiked: !brand.isLiked,
          };
        }
        return brand;
      });
      state.homeSection8.brands = state.homeSection8.brands.map((brand) => {
        if (brand.uuid === brandId) {
          return {
            ...brand,
            isLiked: !brand.isLiked,
          };
        }
        return brand;
      });
      // state.homeSection9.brands = state.homeSection9.brands.map((brand) => {
      //   if (brand.uuid === brandId) {
      //     return {
      //       ...brand,
      //       isLiked: !brand.isLiked,
      //     };
      //   }
      //   return brand;
      // });
      // state.homeSection10.brands = state.homeSection10.brands.map((brand) => {
      //   if (brand.uuid === brandId) {
      //     return {
      //       ...brand,
      //       isLiked: !brand.isLiked,
      //     };
      //   }
      //   return brand;
      // });
    },

    toggleHomeCardShortlist: (state, action) => {
      const brandId = action.payload;
      state.homeSection1.brands = state.homeSection1.brands.map((brand) => {
        if (brand.uuid === brandId) {
          return {
            ...brand,
            isShortListed: !brand.isShortListed,
          };
        }
        return brand;
      });
      state.homeSection2.brands = state.homeSection2.brands.map((brand) => {
        if (brand.uuid === brandId) {
          return {
            ...brand,
            isShortListed: !brand.isShortListed,
          };
        }
        return brand;
      });
      state.homeSection3.brands = state.homeSection3.brands.map((brand) => {
        if (brand.uuid === brandId) {
          return {
            ...brand,
            isShortListed: !brand.isShortListed,
          };
        }
        return brand;
      });
      state.homeSection4.brands = state.homeSection4.brands.map((brand) => {
        if (brand.uuid === brandId) {
          return {
            ...brand,
            isShortListed: !brand.isShortListed,
          };
        }
        return brand;
      });
      state.homeSection5.brands = state.homeSection5.brands.map((brand) => {
        if (brand.uuid === brandId) {
          return {
            ...brand,
            isShortListed: !brand.isShortListed,
          };
        }
        return brand;
      });
      state.homeSection6.brands = state.homeSection6.brands.map((brand) => {
        if (brand.uuid === brandId) {
          return {
            ...brand,
            isShortListed: !brand.isShortListed,
          };
        }
        return brand;
      });
      state.homeSection7.brands = state.homeSection7.brands.map((brand) => {
        if (brand.uuid === brandId) {
          return {
            ...brand,
            isShortListed: !brand.isShortListed,
          };
        }
        return brand;
      });
      state.homeSection8.brands = state.homeSection8.brands.map((brand) => {
        if (brand.uuid === brandId) {
          return {
            ...brand,
            isShortListed: !brand.isShortListed,
          };
        }
        return brand;
      });
      // state.homeSection9.brands = state.homeSection9.brands.map((brand) => {
      //   if (brand.uuid === brandId) {
      //     return {
      //       ...brand,
      //       isShortListed: !brand.isShortListed,
      //     };
      //   }
      //   return brand;
      // });
      // state.homeSection10.brands = state.homeSection10.brands.map((brand) => {
      //   if (brand.uuid === brandId) {
      //     return {
      //       ...brand,
      //       isShortListed: !brand.isShortListed,
      //     };
      //   }
      //   return brand;
      // });
    },
  },
  extraReducers: (builder) => {
    builder
      // Food Franchises
      .addCase(homeSection1.pending, (state) => {
        state.homeSection1.isLoading = true;
        state.homeSection1.error = null;
      })
      .addCase(homeSection1.fulfilled, (state, action) => {
        state.homeSection1.isLoading = false;
        state.homeSection1.brands = action.payload.brands;
        state.homeSection1.pagination = action.payload.pagination;
      })
      .addCase(homeSection1.rejected, (state, action) => {
        state.homeSection1.isLoading = false;
        state.homeSection1.error =
          action.payload?.message || action.error.message;
      })

      // Cafes
      .addCase(homeSection2.pending, (state) => {
        state.homeSection2.isLoading = true;
        state.homeSection2.error = null;
      })
      .addCase(homeSection2.fulfilled, (state, action) => {
        state.homeSection2.isLoading = false;
        state.homeSection2.brands = action.payload.brands;
        state.homeSection2.pagination = action.payload.pagination;
      })
      .addCase(homeSection2.rejected, (state, action) => {
        state.homeSection2.isLoading = false;
        state.homeSection2.error =
          action.payload?.message || action.error.message;
      })

      // Beverages
      .addCase(homeSection3.pending, (state) => {
        state.homeSection3.isLoading = true;
        state.homeSection3.error = null;
      })
      .addCase(homeSection3.fulfilled, (state, action) => {
        state.homeSection3.isLoading = false;
        state.homeSection3.brands = action.payload.brands;
        state.homeSection3.pagination = action.payload.pagination;
      })
      .addCase(homeSection3.rejected, (state, action) => {
        state.homeSection3.isLoading = false;
        state.homeSection3.error =
          action.payload?.message || action.error.message;
      })

      // desert&Bakerys
      .addCase(homeSection4.pending, (state) => {
        state.homeSection4.isLoading = true;
        state.homeSection4.error = null;
      })
      .addCase(homeSection4.fulfilled, (state, action) => {
        state.homeSection4.isLoading = false;
        state.homeSection4.brands = action.payload.brands;
        state.homeSection4.pagination = action.payload.pagination;
      })
      .addCase(homeSection4.rejected, (state, action) => {
        state.homeSection4.isLoading = false;
        state.homeSection4.error =
          action.payload?.message || action.error.message;
      })

      // //trucks and Kiosks

      .addCase(homeSection5.pending, (state) => {
        state.homeSection5.isLoading = true;
        state.homeSection5.error = null;
      })
      .addCase(homeSection5.fulfilled, (state, action) => {
        state.homeSection5.isLoading = false;
        state.homeSection5.brands = action.payload.brands;
        state.homeSection5.pagination = action.payload.pagination;
      })
      .addCase(homeSection5.rejected, (state, action) => {
        state.homeSection5.isLoading = false;
        state.homeSection5.error =
          action.payload?.message || action.error.message;
      })

      //restarunt
      .addCase(homeSection6.pending, (state) => {
        state.homeSection6.isLoading = true;
        state.homeSection6.error = null;
      })
      .addCase(homeSection6.fulfilled, (state, action) => {
        state.homeSection6.isLoading = false;
        state.homeSection6.brands = action.payload.brands;
        state.homeSection6.pagination = action.payload.pagination;
      })
      .addCase(homeSection6.rejected, (state, action) => {
        state.homeSection6.isLoading = false;
        state.homeSection6.error =
          action.payload?.message || action.error.message;
      })

      //restarunt
      .addCase(homeSection7.pending, (state) => {
        state.homeSection7.isLoading = true;
        state.homeSection7.error = null;
      })
      .addCase(homeSection7.fulfilled, (state, action) => {
        state.homeSection7.isLoading = false;
        state.homeSection7.brands = action.payload.brands;
        state.homeSection7.pagination = action.payload.pagination;
      })
      .addCase(homeSection7.rejected, (state, action) => {
        state.homeSection7.isLoading = false;
        state.homeSection7.error =
          action.payload?.message || action.error.message;
      })

      // //restarunt
      .addCase(homeSection8.pending, (state) => {
        state.homeSection8.isLoading = true;
        state.homeSection8.error = null;
      })
      .addCase(homeSection8.fulfilled, (state, action) => {
        state.homeSection8.isLoading = false;
        state.homeSection8.brands = action.payload.brands;
        state.homeSection8.pagination = action.payload.pagination;
      })
      .addCase(homeSection8.rejected, (state, action) => {
        state.homeSection8.isLoading = false;
        state.homeSection8.error =
          action.payload?.message || action.error.message;
      })

      // //restarunt

      // .addCase(homeSection9.pending, (state) => {
      //   state.homeSection9.isLoading = true;
      //   state.homeSection9.error = null;
      // })
      // .addCase(homeSection9.fulfilled, (state, action) => {
      //   state.homeSection9.isLoading = false;
      //   state.homeSection9.brands = action.payload.brands;
      //   state.homeSection9.pagination = action.payload.pagination;
      // })
      // .addCase(homeSection9.rejected, (state, action) => {
      //   state.homeSection9.isLoading = false;
      //   state.homeSection9.error =
      //     action.payload?.message || action.error.message;
      // })

      // //restarunt

      // .addCase(homeSection10.pending, (state) => {
      //   state.homeSection10.isLoading = true;
      //   state.homeSection10.error = null;
      // })
      // .addCase(homeSection10.fulfilled, (state, action) => {
      //   state.homeSection10.isLoading = false;
      //   state.homeSection10.brands = action.payload.brands;
      //   state.homeSection10.pagination = action.payload.pagination;
      // })
      // .addCase(homeSection10.rejected, (state, action) => {
      //   state.homeSection10.isLoading = false;
      //   state.homeSection10.error =
      //     action.payload?.message || action.error.message;
      // });
  },
});

export const {
  resethomeSection1,
  resethomeSection2,
  resethomeSection3,
  resethomeSection4,
  resethomeSection5,
  resethomeSection6,
  resethomeSection7,
  resethomeSection8,
  // resethomeSection9,
  // resethomeSection10,

  homeSection1ViewedCount,
  homeSection2ViewedCount,
  homeSection3ViewedCount,
  homeSection4ViewedCount,
  homeSection5ViewedCount,
  homeSection6ViewedCount,
  homeSection7ViewedCount,
  homeSection8ViewedCount,
  // homeSection9ViewedCount,
  // homeSection10ViewedCount,

  resetHomeSection1ViewedCount,
  resetHomeSection2ViewedCount,
  resetHomeSection3ViewedCount,
  resetHomeSection4ViewedCount,
  resetHomeSection5ViewedCount,
  resetHomeSection6ViewedCount,
  resetHomeSection7ViewedCount,
  resetHomeSection8ViewedCount,
  // resetHomeSection9ViewedCount,
  // resetHomeSection10ViewedCount,

  toggleHomeCardLike,
  toggleHomeCardShortlist,
} = OverAllPlatform.actions;

export default OverAllPlatform.reducer;
