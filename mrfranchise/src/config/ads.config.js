// src/config/ads.config.js

export const ADS = {
  HOME: {
    TOP_BILLBOARD: {
      slot: "1234567890",
      label: "Home – Top Billboard",
      minHeight: 90,
      desktopSizes: ["970x90"],
      mobile: false
    },

    TOP_LEADERBOARD: {
      slot: "2234567890",
      label: "Home – Leaderboard",
      minHeight: 90,
      desktopSizes: ["728x90"],
      mobile: true
    },

    MID_RECTANGLE: {
      slot: "3234567890",
      label: "Home – Mid Rectangle",
      minHeight: 250,
      desktopSizes: ["800x250", "970x250"],
      mobile: true
    },

    FOOTER_RECTANGLE: {
      slot: "4234567890",
      label: "Home – Footer Rectangle",
      minHeight: 250,
      desktopSizes: ["970x250"],
      mobile: false
    },
    INLINE_1: {
      slot: "5234567890",
      minHeight: 250,
      label: "Home – Inline Ad 1"
    },
    INLINE_2: {
      slot: "6234567890",
      minHeight: 250,
      label: "Home – Inline Ad 2"
    },
    INLINE_3: {
      slot: "7234567890",
      minHeight: 250,
      label: "Home – Inline Ad 3"
    },
    FILTER_BOTTOM_RECTANGLE: {
      slot: "8234567890",
      minHeight: 250,
      label: "Home – Filter Bottom Rectangle"
    }
  }
};
