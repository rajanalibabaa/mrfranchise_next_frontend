// Utils/PincodeFetch.jsx
"use client";
import axios from 'axios';
import {SUPPORTED_COUNTRIES} from './countries'

// const SUPPORTED_COUNTRIES = [
//   { code: 'IN', name: 'India' },
//   { code: 'US', name: 'United States' },
//   { code: 'GB', name: 'United Kingdom' },
//   { code: 'CA', name: 'Canada' },
//   { code: 'AU', name: 'Australia' },
//   // Add more countries as needed
// ];

// export const getSupportedCountries = () => {
//   return SUPPORTED_COUNTRIES;
// };


export { SUPPORTED_COUNTRIES }; // re-export for client use

export const fetchGlobalLocationByPostalCode = async (postalCode, countryCode = 'IN') => {
  try {
    // Call the backend API route instead of external APIs
    const response = await axios.get('/api/location/pincode', {
      params: {
        postalCode,
        countryCode
      },
      timeout: 10000
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching location:', error);
    return {
      status: 'error',
      message: error.response?.data?.message || error.message || 'Failed to fetch location details'
    };
  }
};