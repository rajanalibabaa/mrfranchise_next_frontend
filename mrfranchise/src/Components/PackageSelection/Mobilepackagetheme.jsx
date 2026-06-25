import { keyframes } from "@mui/material/styles";

export const pulseAnimation = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 153, 0, 0.7); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(255, 153, 0, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 153, 0, 0); }
`;

export const COLORS = {
  primary: "#FF9900",
  primaryDark: "#E68A00",
  secondary: "#4CB04F",
  secondaryDark: "#3D8E40",
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
  lightOrange: "rgba(255,153,0,0.08)",
  lightGreen: "rgba(76,176,79,0.08)",
  border: "#E0E0E0",
  shadow: "rgba(0,0,0,0.08)",
  bgWarm: "#fff8ee",
  bgGreen: "#f0f9f0",
};

export const T = {
  xs: "0.85rem",
  sm: "0.8rem",
  md: "0.875rem",
  lg: "1rem",
  xl: "1.125rem",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const fmtINR = (n) => "₹" + Math.round(n || 0).toLocaleString("en-IN");

export const getUniqueStatesForGroup = (planId, label, items, statesByInvestmentRange, allStates = []) => {
  const set = new Set();
  items.forEach((item) => {
    const key = `${planId}__${label}__${item.range}`;
    const states = statesByInvestmentRange[key];
    if (states && states.length > 0) {
      states.forEach((s) => set.add(s));
      return;
    }
    const fallbackKey = Object.keys(statesByInvestmentRange).find((k) => {
      const parts = k.split("__");
      return parts[parts.length - 1] === item.range && parts[parts.length - 2] === label;
    });
    if (fallbackKey) {
      statesByInvestmentRange[fallbackKey].forEach((s) => set.add(s));
    } else {
      allStates.forEach((s) => set.add(s));
    }
  });
  return set;
};

export const getUniqueStatesForCheckedItems = (planId, label, items, checkedItems, statesByInvestmentRange, allStates = []) => {
  const set = new Set();
  items.forEach((item) => {
    const id = `${planId}-${label}-${item.range}`;
    if (!checkedItems[id]) return;

    const key = `${planId}__${label}__${item.range}`;
    const states = statesByInvestmentRange[key];
    if (states && states.length > 0) {
      states.forEach((s) => set.add(s));
      return;
    }
    const fallbackKey = Object.keys(statesByInvestmentRange).find((k) => {
      const parts = k.split("__");
      return (
        parts[parts.length - 1] === item.range &&
        parts[parts.length - 2] === label
      );
    });
    if (fallbackKey) {
      statesByInvestmentRange[fallbackKey].forEach((s) => set.add(s));
    } else {
      allStates.forEach((s) => set.add(s));
    }
  });
  return set;
};