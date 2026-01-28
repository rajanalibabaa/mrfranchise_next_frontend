// src/lib/countries.js    ← THIS IS SERVER-SAFE (no "use client")

export const SUPPORTED_COUNTRIES = [
  { code: "IN", name: "India", dialCode: "+91" },
  { code: "US", name: "United States", dialCode: "+1" },
  { code: "AE", name: "United Arab Emirates", dialCode: "+971" },
  { code: "GB", name: "United Kingdom", dialCode: "+44" },
  { code: "CA", name: "Canada", dialCode: "+1" },
  { code: "AU", name: "Australia", dialCode: "+61" },
  { code: "SG", name: "Singapore", dialCode: "+65" },
  { code: "DE", name: "Germany", dialCode: "+49" },
  { code: "FR", name: "France", dialCode: "+33" },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966" },
];

export const getSupportedCountries = () => SUPPORTED_COUNTRIES;