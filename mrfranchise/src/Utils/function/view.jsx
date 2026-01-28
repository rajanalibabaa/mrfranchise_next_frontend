
"use client";
import axios from "axios";
import { api } from "../../Api/api.jsx";

export const postView = async (viewedID) => {
  // Check if window exists (client-side)
  if (typeof window === "undefined") return;

  const token = localStorage.getItem("accessToken");
  const id = localStorage.getItem("investorUUID") || localStorage.getItem("brandUUID");

  if (!id || !token || !viewedID) return;

  try {
    const response = await axios.post(
      `${api.viewApi.post}/${id}`,
      { viewedID },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // optional if token is needed
        },
      }
    );

    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error posting view:", error.response?.data || error.message);
    throw error;
  }
};
