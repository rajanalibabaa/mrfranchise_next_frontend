"use client"
// export const localStorageData = {
//     searchData : JSON.parse(
//         localStorage.getItem("franchiseFilters"),
//       )
// }

// src/Utils/localStorage.js
export const localStorageData = () => {
  if (typeof window === "undefined") return null;

  try {
    const data = localStorage.getItem("franchiseFilters");
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("Invalid localStorage data", err);
    return null;
  }
};
