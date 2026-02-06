// "use client";

// import { useEffect, useRef } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useDispatch } from "react-redux";
// import { setFilter } from "@/Redux/Slices/FilterBrandSlice";

// const FILTER_KEYS = [
//   "maincat",
//   "subcat",
//   "childcat",
//   "state",
//   "investmentRange",
//   "searchTerm",
// ];

// export default function BrandListClient({ children, initialFilters }) {
  
//   console.log('initialfilters click in allbrandlisting',initialFilters);
  
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const initialized = useRef(false);

//   useEffect(() => {
//     if (initialized.current) return;
//     initialized.current = true;

    // const mergedFilters = {};
    // console.log('searchparams in brandlistclient',searchParams);

//     FILTER_KEYS.forEach((key) => {
//       const value =
//         searchParams?.get(key) ??
//         initialFilters?.[key] ??
//         null;

//       if (value) {
//         mergedFilters[key] = value;
//       }
//     });

//     // 🚀 SINGLE DISPATCH (FAST)
//     Object.entries(mergedFilters).forEach(([key, value]) => {
//       dispatch(setFilter({ filterName: key, value }));
//     });

//     // ❌ DO NOT remove params immediately
//     // SEO + hydration needs them
//   }, [dispatch, searchParams, initialFilters]);

//   return children;
// }
