import axios from 'axios';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const postalCode = searchParams.get('postalCode');
    const countryCode = searchParams.get('countryCode') || 'IN';

    if (!postalCode) {
      return Response.json(
        { status: 'error', message: 'Postal code is required' },
        { status: 400 }
      );
    }

    // For India, use PostalPincode.in API
    if (countryCode === 'IN') {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${postalCode}`,
        {
          timeout: 5000,
          headers: {
            'User-Agent': 'Mozilla/5.0'
          }
        }
      );

      if (!response.data || !response.data[0] || response.data[0].Status !== 'Success' || !response.data[0].PostOffice) {
        return Response.json(
          { status: 'error', message: 'No data found for the given pincode in India' },
          { status: 404 }
        );
      }

      const firstPostOffice = response.data[0].PostOffice[0];
      return Response.json({
        country: 'India',
        state: firstPostOffice.State,
        district: firstPostOffice.District,
        city: firstPostOffice.Name,
        status: 'success'
      });
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
      timeout: 5000,
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'YourAppName/1.0'
      }
    });

    if (!response.data || response.data.length === 0) {
      return Response.json(
        { status: 'error', message: 'No data found for the given postal code' },
        { status: 404 }
      );
    }

    const address = response.data[0].address;
    return Response.json({
      country: address.country || '',
      state: address.state || address.region || address.county || '',
      district: address.county || address.state_district || '',
      city: address.city || address.town || address.village || address.hamlet || '',
      status: 'success'
    });
  } catch (error) {
    console.error('Location API error:', error.message);
    return Response.json(
      {
        status: 'error',
        message: error.message || 'Failed to fetch location details'
      },
      { status: 500 }
    );
  }
}
