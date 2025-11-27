interface GeoLocation {
  country: string;
  city: string;
}

const FALLBACK_LOCATION: GeoLocation = {
  country: "Ukraine",
  city: "Kyiv",
};

async function getGeolocationPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<GeoLocation> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
  );

  if (!response.ok) {
    throw new Error("Failed to reverse geocode");
  }

  const data = await response.json();

  return {
    country: data.address.country || FALLBACK_LOCATION.country,
    city:
      data.address.city ||
      data.address.town ||
      data.address.village ||
      FALLBACK_LOCATION.city,
  };
}

export async function getUserLocation(): Promise<GeoLocation> {
  if (typeof window === "undefined" || !("geolocation" in navigator)) {
    return FALLBACK_LOCATION;
  }

  try {
    const position = await getGeolocationPosition();
    const { latitude, longitude } = position.coords;
    return await reverseGeocode(latitude, longitude);
  } catch (error) {
    console.error("Error getting location:", error);
    return FALLBACK_LOCATION;
  }
}

// If you want to re-enable location detection in the future, uncomment and modify this code:
/*
  try {
    // Try multiple location APIs in sequence
    const apis = [
      'https://api.ipify.org?format=json',
      'https://ip-api.com/json',
      'https://ipinfo.io/json'
    ];

    for (const api of apis) {
      try {
        const response = await fetch(api);
        const data = await response.json();

        // Each API has different response formats
        if (data.country || data.country_name) {
          return {
            country: data.country || data.country_name,
            city: data.city || 'Unknown'
          };
        }
      } catch (e) {
        console.warn(`Failed to fetch location from ${api}:`, e);
        continue;
      }
    }

    console.warn('All location APIs failed, using fallback location');
    return FALLBACK_LOCATION;
  } catch (error) {
    console.error('Error fetching location:', error);
    return FALLBACK_LOCATION;
  }
  */
