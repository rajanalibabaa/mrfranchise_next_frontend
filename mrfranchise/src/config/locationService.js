export const getUserLocationWithPermission = async () => {
  let finalLocation = null;

  try {
    const position = await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 8000,
      })
    );

    finalLocation = {
      method: "gps",
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
    };

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${finalLocation.lat}&lon=${finalLocation.lng}&format=json`
    );

    const data = await res.json();

    finalLocation.city =
      data.address.city ||
      data.address.town ||
      data.address.village;

    finalLocation.state = data.address.state;
    finalLocation.country = data.address.country;
  } catch (err) {
    // fallback IP
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();

    finalLocation = {
      method: "ip",
      city: data.city,
      state: data.region,
      country: data.country_name,
      lat: data.latitude,
      lng: data.longitude,
      ip: data.ip,
      vpn: data.proxy,
    };
  }

  localStorage.setItem("userLocation", JSON.stringify(finalLocation));

  return finalLocation;
};