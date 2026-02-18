// "use client";

// import { useEffect } from "react";
// import { Box } from "@mui/material";

// // Standard Google AdSense sizes
// const VARIANT_SIZES = {
//   billboard: { width: 970, height: 90 },        // 970×90
//   leaderboard: { width: 728, height: 90 },      // 728×90
//   rectangle: { width: 970, height: 250 },       // 970×250
//   medium_rectangle: { width: 300, height: 250 },
//   large_rectangle: { width: 336, height: 280 },
//   // skyscraper: { width: 160, height: 600 },
//   // wide_skyscraper: { width: 300, height: 600 },
//   // half_page: { width: 300, height: 600 },
//   default: { width: "100%" },                  // fully responsive
// };

// export default function AdSlot({
//   slot,
//   variant = "default",
//   width,
//   height,
//   minHeight,
//   mobile = true,
//   label,
// }) {
//   useEffect(() => {

//   if (!window.adsbygoogle) return;

//   try {

//     window.adsbygoogle.push({});

//   } catch {}

// }, [slot]);


//   const config = VARIANT_SIZES[variant] || VARIANT_SIZES.default;

//   const finalWidth = width !== undefined ? width : config.width;
//   const finalHeight = height !== undefined ? height : config.height;
//   const finalMinHeight = minHeight !== undefined ? minHeight : finalHeight || 90;

//   // Hide on mobile if mobile={false}
//   const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
//   if (!mobile && isMobile) return null;

//   const isResponsive = finalWidth === "100%" || finalWidth === "100vw";

//   return (
//     <Box
//       sx={{
//         maxWidth: finalWidth,
//         width: "100%",
//         mx: "auto",
//         my: 0,
//         textAlign: "center",
//         background:'transparent',
//         minHeight: finalMinHeight,
//       }}
//     >
//       <ins
//         className="adsbygoogle"
//         style={{ display: "block", width: finalWidth, height: finalHeight }}
//         data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
//         data-ad-slot={slot}
//         data-ad-format={isResponsive ? "auto" : undefined}
//         data-full-width-responsive={isResponsive ? "true" : "false"}
//       />
//       {/* {label && (
//         <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
//           {label}
//         </div>
//       )} */}
//     </Box>
//   );
// }

"use client";

import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { usePathname } from "next/navigation";

const VARIANT_SIZES = {
  billboard: { width: 970, height: 90 },
  leaderboard: { width: 728, height: 90 },
  rectangle: { width: 970, height: 250 },
  medium_rectangle: { width: 300, height: 250 },
  large_rectangle: { width: 336, height: 280 },
  default: { width: "100%", height: "auto" },
};

export default function AdSlot({
  slot,
  variant = "default",
  width,
  height,
  mobile = true,
}) {
  const pathname = usePathname();

  const adRef = useRef(null);

  const config = VARIANT_SIZES[variant] || VARIANT_SIZES.default;

  const finalWidth = width || config.width;
  const finalHeight = height || config.height;

  useEffect(() => {
    
    if (!adRef.current) return;

    try {
      
      // clear old ad
      adRef.current.innerHTML = "";

      const ins = document.createElement("ins");

      ins.className = "adsbygoogle";

      ins.style.display = "block";

      if (finalWidth !== "100%")
        ins.style.width = finalWidth + "px";

      if (finalHeight !== "auto")
        ins.style.height = finalHeight + "px";

      ins.setAttribute(
        "data-ad-client",
        process.env.NEXT_PUBLIC_ADSENSE_ID
      );

      ins.setAttribute("data-ad-slot", slot);

      ins.setAttribute("data-full-width-responsive", "true");

      adRef.current.appendChild(ins);

      (window.adsbygoogle = window.adsbygoogle || []).push({});

    } catch (err) {

      console.log("Ad error", err);

    }

  }, [pathname, slot]);

  return (
    <Box
      sx={{
        textAlign: "center",
        width: "100%",
        minHeight: finalHeight,
      }}
    >
      <div ref={adRef} />
    </Box>
  );
}
