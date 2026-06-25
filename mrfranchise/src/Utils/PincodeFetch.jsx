// Utils/PincodeFetch.jsx

"use client";

import axios from "axios";
import { SUPPORTED_COUNTRIES } from "./countries";

export { SUPPORTED_COUNTRIES };

// ===============================
// FETCH LOCATION BY PINCODE
// ===============================

export const fetchGlobalLocationByPostalCode = async (
  postalCode,
  countryCode = "IN",
) => {
  try {
    if (!postalCode) {
      return {
        status: "error",
        message: "Pincode required",
      };
    }

    // ==========================
    // INDIA PINCODE API
    // ==========================

    if (countryCode === "IN") {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${postalCode}`,
        {
          timeout: 10000,
        },
      );

      const result = response.data?.[0];

      if (!result || result.Status !== "Success" || !result.PostOffice) {
        return {
          status: "error",
          message: "Invalid Indian pincode",
        };
      }

      const office = result.PostOffice[0];

      return {
        status: "success",

        country: "India",

        state: office.State,

        district: office.District,

        city: office.Name,
      };
    }

    // ==========================
    // OTHER COUNTRIES
    // ==========================

    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          postalcode: postalCode,

          countrycodes: countryCode,

          format: "json",

          addressdetails: 1,

          limit: 1,
        },

        headers: {
          "Accept-Language": "en",
        },

        timeout: 10000,
      },
    );

    if (!response.data?.length) {
      return {
        status: "error",

        message: "Location not found",
      };
    }

    const address = response.data[0].address;

    return {
      status: "success",

      country: address.country || "",

      state: address.state || address.region || "",

      district: address.county || address.state_district || "",

      city: address.city || address.town || address.village || "",
    };
  } catch (error) {
    console.error("Pincode Error:", error);

    return {
      status: "error",

      message: error.message || "Failed to fetch location",
    };
  }
};
