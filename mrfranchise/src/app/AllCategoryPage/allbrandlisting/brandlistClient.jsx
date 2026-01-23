// app/AllCategoryPage/allbrandlisting/BrandListClient.jsx
"use client";

import React, { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setFilter } from "@/Redux/Slices/FilterBrandSlice";

const FILTER_KEYS = [
  "subcat",
  "state",
  "investmentRange",
  "maincat",
  "childcat",
  "searchTerm",
];

export default function BrandListClient({ children, initialFilters }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Batch dispatch all filters
    FILTER_KEYS.forEach((key) => {
      const value = searchParams?.get(key) || initialFilters?.[key] || "";
      if (value) {
        dispatch(setFilter({ filterName: key, value }));
      }
    });

    // Optional: Clean URL after storing filters in Redux
    const hasFilters = FILTER_KEYS.some(key => searchParams?.get(key));
    if (hasFilters) {
      router.replace('/AllCategoryPage/allbrandlisting', { scroll: false });
    }
  }, [searchParams, dispatch, initialFilters, router]);

  return <>{children}</>;
}