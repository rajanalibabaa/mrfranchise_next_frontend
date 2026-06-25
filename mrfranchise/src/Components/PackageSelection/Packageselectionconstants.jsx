import { keyframes } from "@mui/system";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const COLORS = {
  primary: "#FF9900",
  primaryDark: "#E68A00",
  primaryLight: "#FFB84D",
  secondary: "#4CB04F",
  secondaryDark: "#3D8E40",
  secondaryLight: "#71FF05",
  black: "#000000",
  white: "#ffffff",
  grey: {
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#EEEEEE",
    300: "#E0E0E0",
    400: "#BDBDBD",
    500: "#9E9E9E",
    600: "#757575",
    700: "#616161",
  },
  lightOrange: "rgba(255, 153, 0, 0.08)",
  lightGreen: "rgba(76, 176, 79, 0.08)",
  border: "#E0E0E0",
  shadow: "rgba(0, 0, 0, 0.08)",
};

export const TEXT_SIZES = {
  xs: "0.725rem",
  small: "0.80rem",
  medium: "0.980rem",
  large: "1rem",
  xl: "1.125rem",
  xxl: "1.25rem",
};

export const bounceAnimation = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
  40% { transform: translateX(-50%) translateY(-10px); }
  60% { transform: translateX(-50%) translateY(-5px); }
`;

export const INDIA_STATES = {
  North: ["Chandigarh", "Delhi", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Ladakh", "Punjab", "Rajasthan", "Uttar Pradesh", "Uttarakhand"],
  South: ["Andhra Pradesh", "Karnataka", "Kerala", "Lakshadweep", "Puducherry", "Tamil Nadu", "Telangana"],
  East: ["Andaman and Nicobar Islands", "Bihar", "Jharkhand", "Odisha", "West Bengal"],
  West: ["Dadra and Nagar Haveli and Daman and Diu", "Goa", "Gujarat", "Maharashtra"],
  NorthEast: ["Arunachal Pradesh", "Assam", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura"],
  Central: ["Chhattisgarh", "Madhya Pradesh"],
};

export const ALL_INDIA_STATES = Object.values(INDIA_STATES).flat();

export const getUserLocationFromIP = async () => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    if (data.region) {
      const matchedState = ALL_INDIA_STATES.find(
        (state) => state.toLowerCase() === data.region.toLowerCase(),
      );
      return { state: matchedState || data.region, city: data.city, country: data.country_name };
    }
    return null;
  } catch (error) {
    console.error("Error fetching location from IP:", error);
    return null;
  }
};