// src/redux/slices/brandSlice.js
"use client";
import { createSlice } from "@reduxjs/toolkit";
import { getUserId } from "@/Utils/autherId";
import { postApi } from "@/Api/DefaultApi";
import { api } from "@/Api/api";
import { addviewBrand } from "./viewSlice.jsx";
const userId = getUserId();
const initialState = {
  openDialog: false,
  lastOpenedBrandId: null,
  brandSlugName: null,
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

export const { setOpenDialog, setLastOpenedBrandId, setbrandSlugName } =
  brandSlice.actions;
export default brandSlice.reducer;

export const openBrandDialog =
  (brand, openInNewTab = true) =>
  async (dispatch) => {
    if (!brand) return console.error("❌ No brand payload provided");

    const brandId = brand.uuid;

    // 🔥 FETCH FULL DATA
    let fullBrand = null;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/brandlisting/getBrandListingSlug/${brand.slug}`,
      );
      const json = await res.json();
      fullBrand = Array.isArray(json?.data) ? json.data[0] : json.data;
    } catch (err) {
      console.error("Fetch error:", err);
    }

    // 🔥 CLEAN FUNCTION
    const clean = (text) =>
      text
        ?.toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    const slug = clean(brand.slug);

    // 🔥 FINAL SEO URL
    const brandUrl = `/brands/${slug}`;

    // 🔥 STORE DATA
    if (typeof window !== "undefined") {
      sessionStorage.setItem(`brand-${brandId}`, JSON.stringify(fullBrand));
    }

    // 🔥 NAVIGATION
    if (openInNewTab) {
      window.open(brandUrl, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = brandUrl;
    }

    dispatch(setLastOpenedBrandId(brandId));
  };
