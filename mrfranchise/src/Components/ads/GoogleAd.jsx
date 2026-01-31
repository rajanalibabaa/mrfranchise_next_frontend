"use client";

import { useEffect } from "react";
import { Box } from "@mui/material";

export default function AdSlot({
  slot,
  minHeight,
  desktopSizes,
  mobile = true
}) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn("Adsense error", e);
    }
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight,
        display: {
          xs: mobile ? "block" : "none",
          md: "block"
        },
        textAlign: "center",
        overflow: "hidden"
      }}
      data-sizes={desktopSizes?.join(",")}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "inline-block", width: "100%" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </Box>
  );
}
