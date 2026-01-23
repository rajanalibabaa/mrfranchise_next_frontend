// Utils/PincodeFetch.jsx
import axios from 'axios';

const SUPPORTED_COUNTRIES = [
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  // Add more countries as needed
];

export const getSupportedCountries = () => {
  return SUPPORTED_COUNTRIES;
};

export const fetchGlobalLocationByPostalCode = async (postalCode, countryCode = 'IN') => {
  try {
    // For India, use PostalPincode.in API
    if (countryCode === 'IN') {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${postalCode}`);
      
      if (!response.data || response.data[0].Status !== 'Success' || !response.data[0].PostOffice) {
        throw new Error('No data found for the given pincode in India');
      }
      
      const firstPostOffice = response.data[0].PostOffice[0];
      return {
        country: 'India',
        state: firstPostOffice.State,
        district: firstPostOffice.District,
        city: firstPostOffice.Name,
        status: 'success'
      };
    }

    // For other countries, use Nominatim
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        postalcode: postalCode,
        countrycodes: countryCode,
        format: 'json',
        addressdetails: 1,
        limit: 1
      },
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'YourAppName/1.0 (your-email@example.com)'
      }
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('No data found for the given postal code');
    }

    const address = response.data[0].address;
    return {
      country: address.country || '',
      state: address.state || address.region || address.county || '',
      district: address.county || address.state_district || '',
      city: address.city || address.town || address.village || address.hamlet || '',
      status: 'success'
    };
  } catch (error) {
    console.error('Error fetching location:', error);
    return {
      status: 'error',
      message: error.response?.data?.message || error.message || 'Failed to fetch location details'
    };
  }
};