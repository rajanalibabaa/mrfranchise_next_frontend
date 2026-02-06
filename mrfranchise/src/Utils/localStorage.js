"use client"
// export const localStorageData = {
//     searchData : JSON.parse(
//         localStorage.getItem("franchiseFilters"),
//       )
// }

// src/Utils/localStorage.js
export const getLocalStorageData = () => {
  if (typeof window === "undefined") return null;

  try {
    return JSON.parse(localStorage.getItem("franchiseFilters"));
  } catch {
    return null;
  }
};
