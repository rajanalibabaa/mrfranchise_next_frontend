"use client";

import { useEffect } from "react";
import { Box } from "@mui/material";

// Standard Google AdSense sizes
const VARIANT_SIZES = {
  billboard: { width: 970, height: 70 },        // 970×90
  leaderboard: { width: 828, height: 90 },      // 728×90
  rectangle: { width: 1200, height: 250 },       // 970×250
  medium_rectangle: { width: 300, height: 200 },
  large_rectangle: { width: 160, height: 600 },
  // skyscraper: { width: 160, height: 600 },
  // wide_skyscraper: { width: 300, height: 600 },
  // half_page: { width: 300, height: 600 },
  default: { width: "100%" },                  // fully responsive
};

export default function AdSlot({
  slot,
  variant = "default",
  width,
  height,
  minHeight,
  mobile = true,
  label,
}) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.warn("AdSense error:", err);
    }
  }, []);

  const config = VARIANT_SIZES[variant] || VARIANT_SIZES.default;

  const finalWidth = width !== undefined ? width : config.width;
  const finalHeight = height !== undefined ? height : config.height;
  const finalMinHeight = minHeight !== undefined ? minHeight : finalHeight || 90;

  // Hide on mobile if mobile={false}
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  if (!mobile && isMobile) return null;

  const isResponsive = finalWidth === "100%" || finalWidth === "100vw";

  return (
    <Box
      sx={{
        maxWidth: finalWidth,
        width: "100%",
        mx: "auto",
        my: 0,
        textAlign: "center",
        background:'red',
        minHeight: finalMinHeight,
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format={isResponsive ? "auto" : undefined}
        data-full-width-responsive={isResponsive ? "true" : "false"}
      />
      {label && (
        <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
          {label}
        </div>
      )}
    </Box>
  );
}