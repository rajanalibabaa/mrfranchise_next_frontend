"use client";

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

export const getUserId = () => {
  if (typeof window === "undefined") return null;

  

  return (
    localStorage.getItem("investorUUID") ||
    localStorage.getItem("brandUUID")
  );
};
