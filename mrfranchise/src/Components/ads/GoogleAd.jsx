// "use client";

// import { useRef, useEffect } from "react";
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
//   // default: { width: "100%" },                  // fully responsive
//   responsive: { width: "100%", height: "auto" },
// };

// export default function AdSlot({
//   slot,
//   variant = "responsive",
//   width,
//   height,
//   minHeight,
//   mobile = true,
//   label,
// }) {
//   const addRef = useRef(null);
// useEffect(() => {

//   if (!addRef.current || !window.adsbygoogle) return;

//   const timer = setTimeout(() => {

//     try {

//       window.adsbygoogle.push({});

//     } catch (e) {

//       console.log("AdSense error:", e);

//     }

//   }, 200);

//   return () => clearTimeout(timer);

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
//         maxWidth: isResponsive ? "100%" : finalWidth,
//         width: "100%",
//         margin: "0 auto",
//         overflow: "hidden",
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


// Google standard sizes
const VARIANT_SIZES = {

  billboard: { width: 970, height: 90 },

  leaderboard: { width: 728, height: 90 },

  rectangle: { width: 970, height: 250 },

  medium_rectangle: { width: 300, height: 250 },

  large_rectangle: { width: 336, height: 280 },

  responsive: { width: "100%", height: "auto" },

};


export default function AdSlot({

  slot,

  variant = "responsive",

  width,

  height,

  mobile = true,

  label,

}) {


const adRef = useRef(null);


useEffect(() => {

  if (!adRef.current) return;

  if (!window.adsbygoogle) return;


  const timer = setTimeout(() => {

    try {

      window.adsbygoogle.push({});

    } catch (e) {

      console.log("AdSense:", e);

    }

  }, 300);


  return () => clearTimeout(timer);


}, [slot]);


const config = VARIANT_SIZES[variant] || VARIANT_SIZES.responsive;


const finalWidth = width || config.width;

const finalHeight = height || config.height;


const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

if (!mobile && isMobile) return null;


const isResponsive = finalWidth === "100%" || variant === "responsive";



return (

<Box

 sx={{

  width: "100%",

  maxWidth: isResponsive ? "100%" : finalWidth,

  margin: "0 auto",

  textAlign: "center",

  overflow: "hidden",

 }}

>


<Box

 sx={{

  width: finalWidth,

  height: isResponsive ? "auto" : finalHeight,

  margin: "0 auto",

 }}

>


<ins

 ref={adRef}

 className="adsbygoogle"

 style={{

  display: "block",

  width: isResponsive ? "100%" : finalWidth,

  height: isResponsive ? "auto" : finalHeight,

 }}

 data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}

 data-ad-slot={slot}

 data-ad-format={isResponsive ? "auto" : undefined}

 data-full-width-responsive={isResponsive ? "true" : "false"}

/>


</Box>



{/* Optional Label */}

{label && (

<Box

 sx={{

  fontSize: 11,

  color: "#999",

  mt: 0.5,

 }}

>

{label}

</Box>

)}


</Box>

);

}
