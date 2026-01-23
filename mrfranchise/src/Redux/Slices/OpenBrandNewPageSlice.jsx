// src/redux/slices/brandSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { userId } from "../../Utils/autherId";
import { postApi } from "../../Api/DefaultApi";
import { api } from "../../Api/api";
import { addviewBrand } from "./viewSlice.jsx";

const initialState = {
  openDialog: false,
  lastOpenedBrandId: null,
  brandSlugName: null 
};

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    setOpenDialog(state, action) {
      state.openDialog = Boolean(action.payload);
    },
    setLastOpenedBrandId(state, action) {
      state.lastOpenedBrandId = action.payload ?? null;
    },
    setbrandSlugName(state, action) {
      state.brandSlugName = action.payload ?? null;
    },
  },
});

export const { setOpenDialog, setLastOpenedBrandId,setbrandSlugName } = brandSlice.actions;
export default brandSlice.reducer;

// Thunk for side effects
export const openBrandDialog = (brand,  openInNewTab = true) => async (dispatch) => {
  console.log('incoming',brand);
  
  if (!brand) {
    console.error("❌ No brand payload provided");
    return;
  }

  const brandId = brand.uuid || brand;
  const brandName = brand.slug || brand.uuid ;


  // Record "view" in another slice + backend (fire-and-forget)
  if (userId) {
    dispatch(addviewBrand(brand));
    postApi(`${api.shortListApi.post}/${userId}`, { viewedID: brandId }).catch(
      (err) => console.error("Failed to record view:", err)
    );
  }

  // Store brand data in sessionStorage (browser environment only)
  if (typeof window !== "undefined") {
    try {
      // Store in both formats for compatibility
      sessionStorage.setItem(`brand-${brandId}`, JSON.stringify(brand));
      sessionStorage.setItem(`brand-data-${brandId}-${brandNameRaw}`, JSON.stringify([brand]));
      
      // Optional: Also store in localStorage for persistence
      localStorage.setItem(`brand-${brandId}`, JSON.stringify(brand));
    } catch (e) {
      console.warn("Storage setItem failed:", e);
    }

    // Construct the URL - matching Next.js route structure
    // const baseUrl = window.location.origin;
    const brandUrl = `/brands/${brandName}`;

    if (openInNewTab) {
      // Open in new tab
      const newWindow = window.open(brandUrl, "_blank", "noopener,noreferrer");

      if (newWindow) {
        // Optional: Clean up storage when tab closes
        newWindow.addEventListener('beforeunload', () => {
          try {
            sessionStorage.removeItem(`brand-${brandId}`);
          } catch {}
        });
      }
    } else if (router) {
      // Use Next.js router for same-tab navigation
      router.push(brandUrl);
    } else {
      // Fallback to window.location
      window.location.href = brandUrl;
    }
  }

  // Track in state which brand was just opened
  dispatch(setLastOpenedBrandId(brandId));
  // dispatch(setLastOpenedBrandName(brandNameRaw));
};

// Alternative: SEO-friendly slug version
// export const openBrandDialogWithSlug = (brand, router = null, openInNewTab = true) => async (dispatch) => {
//   if (!brand) {
//     console.error("❌ No brand payload provided");
//     return;
//   }

//   const brandId = brand.uuid || brand;
//   const brandNameRaw = brand.brandName ?? brand.brandname ?? "";
  
//   // Create SEO-friendly slug
//   const slug = brandNameRaw
//     .toLowerCase()
//     .replace(/\s+/g, '-')
//     .replace(/[^\w-]/g, '');
  
//   const fullSlug = `${slug}`;

//   // Record "view" in another slice + backend (fire-and-forget)
//   if (userId) {
//     dispatch(addviewBrand(brand));
//     postApi(`${api.shortListApi.post}/${userId}`, { viewedID: brandId }).catch(
//       (err) => console.error("Failed to record view:", err)
//     );
//   }

//   // Store brand data in sessionStorage (browser environment only)
//   if (typeof window !== "undefined") {
//     // try {
//     //   sessionStorage.setItem(`brand-${brandId}`, JSON.stringify(brand));
//     //   sessionStorage.setItem(`brand-data-${brandId}-${brandNameRaw}`, JSON.stringify([brand]));
//     //   localStorage.setItem(`brand-${brandId}`, JSON.stringify(brand));
//     // } catch (e) {
//     //   console.warn("Storage setItem failed:", e);
//     // }

//     // Construct the URL with slug
//     // const baseUrl = window.location.origin;
//     const brandUrl = `/brands/${fullSlug}`;

//     // if (openInNewTab) {
//     //   const newWindow = window.open(brandUrl, "_blank", "noopener,noreferrer");
      
      
//     // } else if (router) {
//       router.push(brandUrl);
//     // } else {
//     //   window.location.href = brandUrl;
//     // }
//   }

//   dispatch(setLastOpenedBrandId(brandId));
//   dispatch(setLastOpenedBrandName(brandNameRaw));
// };

// // Helper to clear brand cache
// export const clearBrandCache = (brandId) => () => {
//   if (typeof window !== "undefined") {
//     try {
//       sessionStorage.removeItem(`brand-${brandId}`);
//       sessionStorage.removeItem(`brand-data-${brandId}`);
//       localStorage.removeItem(`brand-${brandId}`);
//     } catch (e) {
//       console.warn("Failed to clear brand cache:", e);
//     }
//   }
// };
