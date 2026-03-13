"use client";

import { useEffect, useRef } from "react";
import { Box } from "@mui/material";

const VARIANT_SIZES = {
  billboard: { width: 970, height: 90 },
  leaderboard: { width: 728, height: 90 },
  rectangle: { width: 970, height: 250 },
  medium_rectangle: { width: 300, height: 250 },
  large_rectangle: { width: 336, height: 280 },
  responsive: { width: "100%" },
};

export default function AdSlot({
  slot,
  variant = "responsive",
  mobile = true,
}) {

  const adRef = useRef(null);

  useEffect(() => {

    if (!adRef.current) return;

    try {

      if (window.adsbygoogle && adRef.current.getAttribute("data-adsbygoogle-status") !== "done") {

        window.adsbygoogle.push({});

      }

    } catch (e) {

      console.log("AdSense error", e);

    }

  }, [slot]);


  const config = VARIANT_SIZES[variant] || VARIANT_SIZES.responsive;

  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;

  if (!mobile && isMobile) return null;

  return (

    <Box
      sx={{
        width: "100%",
        textAlign: "center",
        minHeight: config.height || 90,
        margin:'0 auto',
      }}
    >

      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: "block",
          width: config.width,
          height: config.height,
        }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />

    </Box>

  );
}
