"use client"
export const localStorageData = {
    searchData : JSON.parse(
        localStorage.getItem("franchiseFilters"),
      )
}