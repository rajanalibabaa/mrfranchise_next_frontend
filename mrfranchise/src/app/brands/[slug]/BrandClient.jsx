"use client";

import {
  useEffect,
  useState,
  useMemo,
  Suspense,
} from "react";

import { useParams } from "next/navigation.js";
import {
  CircularProgress,
  Box,
} from "@mui/material";

import axios from "axios";
import { getUserId } from "@/Utils/autherId.jsx";

import BrandDetails from "../BrandDetail";
import Navbar from "@/Components/Navbar/NavBar";
import Footer from "@/Components/Footers/Footer";

const userId = getUserId();

function BrandDetailsPage() {
  const params = useParams();

  // ==========================================
  // GET COMPLETE IDENTIFIER FROM URL
  //
  // Examples:
  //
  // /brands/nei-idly-sambar
  //     -> nei-idly-sambar
  //
  // /brands/36374bbd-33e3-40cd-868d-4378c80466bba
  //     -> 36374bbd-33e3-40cd-868d-4378c80466bba
  //
  // DO NOT split by "_"
  // DO NOT modify the identifier
  // ==========================================
  const identifier = useMemo(() => {
    if (!params?.slug) {
      return null;
    }

    // Next.js dynamic route can sometimes return array
    const slugPath = Array.isArray(params.slug)
      ? params.slug[0]
      : params.slug;

    if (!slugPath) {
      return null;
    }

    // Decode URL only
    const decodedIdentifier =
      decodeURIComponent(slugPath).trim();

    console.log(
      "🔥 URL IDENTIFIER:",
      decodedIdentifier
    );

    return decodedIdentifier || null;
  }, [params?.slug]);

  // ==========================================
  // BRAND STATE
  // ==========================================
  const [brandData, setBrandData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  // ==========================================
  // CACHE KEY
  // ==========================================
  const brandCacheKey =
    `brand-data-${identifier || "none"}`;

  // ==========================================
  // FETCH BRAND
  // ==========================================
  useEffect(() => {
    if (!identifier) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchBrand = async () => {
      try {
        // ==========================================
        // IMPORTANT
        // SEND COMPLETE IDENTIFIER
        //
        // slug:
        // nei-idly-sambar
        //
        // OR UUID:
        // 36374bbd-33e3-40cd-868d-4378c80466bba
        // ==========================================
        const apiUrl =
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/brandlisting/getBrandListingSlug/${encodeURIComponent(identifier)}`;

        console.log(
          "🔥 BRAND API URL:",
          apiUrl
        );

        console.log(
          "🔥 BRAND IDENTIFIER:",
          identifier
        );

        const res = await axios.get(
          apiUrl,
          {
            params: {
              userId,
            },
          }
        );

        console.log(
          "🔥 BRAND API RESPONSE:",
          res.data
        );

        const brand =
          res.data?.data;

        const brandArray =
          Array.isArray(brand)
            ? brand
            : brand
              ? [brand]
              : [];

        if (
          brandArray.length === 0
        ) {
          throw new Error(
            "Brand not found"
          );
        }

        setBrandData(
          brandArray
        );

      } catch (err) {
        console.error(
          "❌ Brand fetch error:",
          err
        );

        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to load brand details."
        );

        setBrandData(null);

      } finally {
        setLoading(false);
      }
    };

    fetchBrand();

  }, [identifier]);

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress
          color="warning"
          size={40}
        />
      </Box>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================
  if (error) {
    return (
      <Box
        sx={{
          pt: 10,
          textAlign: "center",
          color: "error.main",
        }}
      >
        Error: {error}
      </Box>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            minHeight: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress
            color="warning"
            size={40}
          />
        </Box>
      }
    >
      <Navbar />

      <Box
        component="main"
        id="brand-details"
        sx={{
          backgroundImage:
            `url(/bg25.jpeg)`,
          backgroundSize:
            "400px auto",
          backgroundAttachment:
            "fixed",
          backgroundRepeat:
            "repeat",
          minHeight: "87vh",
          width: "100%",
        }}
      >
        {brandData && (
          <BrandDetails
            brandData={brandData}
            fromSession={true}
            key={brandCacheKey}
          />
        )}
      </Box>

      <Footer />
    </Suspense>
  );
}

export default BrandDetailsPage;



// "use client";
// import { useEffect, useState, useMemo, Suspense } from "react";
// import { useParams } from "next/navigation.js";
// import { CircularProgress, Box } from "@mui/material";
// import axios from "axios";
// import { getUserId } from "@/Utils/autherId.jsx";
// import BrandDetails from "../BrandDetail";
// import Navbar from "@/Components/Navbar/NavBar";
// import Footer from "@/Components/Footers/Footer";

// const userId = getUserId();

// function BrandDetailsPage() {
//   const params = useParams();
  
//   // LOGIC TO GET BRAND NAME AFTER '&'
//  const brandName = useMemo(() => {
//   if (!params?.slug) return null;

//   // 1. Next.js catch-all params are arrays: ['city-state&brand-name']
//   // If it's an array, take the first element. If it's a string, use it directly.
//   const slugPath = Array.isArray(params.slug) ? params.slug[0] : params.slug;

//   const fullPath = decodeURIComponent(slugPath);

//   // 2. Split by '&' and take the last part
//   if (fullPath.includes('_')) {
//     return fullPath.split('_').pop(); // Returns "mr-burger"
//   }

//   return fullPath;
// }, [params]);


//   const [brandData, setBrandData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const brandCacheKey = `brand-data-${brandName || "none"}`;

//   useEffect(() => {
//     setLoading(true);
//     setError(null);

//     if (!brandName) {
//       setLoading(false);
//       // Optional: Don't set error immediately if just mounting
//       return;
//     }

//     (async () => {
//       try {
//         const res = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/v1/brandlisting/getBrandListingSlug/${brandName}`,
//           { 
//             params: { 
//               userId,
//               brandName // Pass the extracted brand name
//             } 
//           }
//         );
        
//         let brand = res.data?.data;
//         const brandArray = Array.isArray(brand) ? brand : [brand];
//         setBrandData(brandArray);
        
//       } catch (err) {
//         console.error("Brand fetch error:", err);
//         setError(err.response?.data?.message || "Failed to load brand details.");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [brandName]);

//   if (error) {
//     return (
//       <Box sx={{ pt: 10, textAlign: "center", color: "error.main" }}>
//         Error: {error}
//       </Box>
//     );
//   }

 

//   return (
//     <Suspense
//       fallback={
//         <Box sx={{ minHeight: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
//           <CircularProgress color="warning" size={40} />
//         </Box>
//       }
//     >
//  <Suspense fallback={<div style={{height: 60, background: "#fff"}} />}>
//         <Navbar />
//       </Suspense> 
//            <Box
//       component="main"
//       id="brand-details"
//         sx={{
//           backgroundImage: `url(/bg25.jpeg)`,
//           backgroundSize: "400px auto",  
//           backgroundAttachment: "fixed",
//           backgroundRepeat: "repeat",
//           minHeight: "87vh",
//           width: "100%",
//         }}
//       >
//         {brandData && (
//             <BrandDetails
//               brandData={brandData}
//               fromSession={true}
//               key={brandCacheKey}
//             />
//         )}
//       </Box>
//  <Suspense fallback={<div style={{height: 300, background: "#eee"}} />}>
//         <Footer />
//       </Suspense>
//         </Suspense>
//   );
// }

// export default BrandDetailsPage;