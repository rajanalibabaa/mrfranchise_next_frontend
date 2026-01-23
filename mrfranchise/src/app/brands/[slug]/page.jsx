// "use client";

// import { useEffect, useState, useMemo, lazy, Suspense } from "react";
// // import { useParams, useLocation } from "react-router-dom";
// import { useParams, useSearchParams } from "next/navigation";
// import { CircularProgress, Box } from "@mui/material";
// import axios from "axios";
// import { userId } from "@/Utils/autherId.jsx";
// // import SEO from "../../Components/SEO/Seo";
// // const BrandDetails = (() => import("./BrandDetail.jsx"), { ssr: false });
// import BrandDetails from "../../BrandDetail.jsx";
// function BrandDetailsPage() {
//   const params = useParams();
//   const searchParams = useSearchParams();
//  const routeBrandId = params?.brandId;  

//   const [brandData, setBrandData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Try to find the brand ID in all likely locations immediately
//   const brandId = useMemo(() => {
//     if (routeBrandId) return routeBrandId;
    
//     // Check URL search params
//     const paramBrandId = searchParams?.get('brandId');
//     if (paramBrandId) return paramBrandId;

//     // Fallback: try sessionStorage keys (client-side only)
//     if (typeof window !== 'undefined') {
//       for (const key of Object.keys(sessionStorage)) {
//         if (key.startsWith("brand-")) {
//           try {
//             const item = JSON.parse(sessionStorage.getItem(key));
//             if (item?.uuid) return item.uuid;
//           } catch {}
//         }
//       }
//     }
//     return null;
//   }, [routeBrandId, searchParams]);
  

//   const brandCacheKey = `brand-data-${brandId || "none"}`;
//   const brandSessionDataKey = `brand-${brandId || "none"}`;

//   // IMMEDIATE hydration from sessionStorage if possible
//   useEffect(() => {
//     setLoading(true);
//     setError(null);

//     if (!brandId) {
//       setLoading(false);
//       setError("No brand found");
//       setBrandData(null);
//       return;
//     }

//     // 1. Strict check from sessionStorage (full brand storage)
//     let hydrated = null;
//     const fromSession = sessionStorage.getItem(brandSessionDataKey);
//     if (fromSession) {
//       try {
//         hydrated = JSON.parse(fromSession);
//         setBrandData(Array.isArray(hydrated) ? hydrated : [hydrated]);
//         setLoading(false);
//         return;
//       } catch {}
//     }
//     // 2. Generic cache fallback
//     const fromCache = sessionStorage.getItem(brandCacheKey);
//     if (fromCache) {
//       try {
//         hydrated = JSON.parse(fromCache);
//         setBrandData(Array.isArray(hydrated) ? hydrated : [hydrated]);
//         setLoading(false);
//         return;
//       } catch {}
//     }

//     // 3. Must fetch from API
//     (async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/v1/brandlisting/getBrandListingSlug/${brandId}`,
//           { params: { userId } }
//         );
//         let brand = res.data?.data;
//         // console.log("brand coming data ",brand);
        
//         // Guarantee always array for BrandDetails
//         setBrandData(Array.isArray(brand) ? brand : [brand]);
//         sessionStorage.setItem(brandCacheKey, JSON.stringify(Array.isArray(brand) ? brand : [brand]));
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to load brand details.");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [brandId, brandCacheKey, brandSessionDataKey]);

//   // Defensive: while loading or error or missing/invalid data, render early spinner/state
//   if (error)
//     return (
//       <Box sx={{ pt: 10, textAlign: "center", color: "error.main" }}>
//         Error: {error}
//       </Box>
//     );
//   if (
//     loading ||
//     !brandData ||
//     !Array.isArray(brandData) ||
//     brandData.length === 0 ||
//     !brandData[0]
//   ) {
//     return (
//       <Box
//         sx={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           width: "100vw",
//           height: "100vh",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           backgroundColor: "rgba(255,255,255,0.6)",
//           zIndex: 1300,
//         }}
//       >
//         <CircularProgress color="warning" size={60} />
//       </Box>
//     );
//   }

  

//   return (
//     <>
      

//       <Suspense
//         fallback={
//           <Box sx={{ minHeight: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
//             <CircularProgress color="warning" size={40} />
//           </Box>
          
//         }
//       >
//         <Box
//   sx={{
    
//                     backgroundImage: `url(/bg25.jpeg))`,
//                    backgroundSize: "400px auto",  
//                    backgroundAttachment: "fixed",
//                    // fill entire box
//                    // backgroundPosition: "center",   // center image
//                    backgroundRepeat: "repeat",
//                    minHeight: "87vh",             // full screen height
//                    width: "100%",
                
//   }}
// >
//   <BrandDetails
//     brandData={brandData}
//     fromSession={true}
//     key={brandCacheKey}
//   />
// </Box>

//       </Suspense>
//     </>
//   );
// }

// export default BrandDetailsPage;



// "use client";

// import { useEffect, useState, useMemo, Suspense } from "react";
// import { useParams, useSearchParams } from "next/navigation";
// import { CircularProgress, Box } from "@mui/material";
// import axios from "axios";
// import { getUserId} from "@/Utils/autherId.jsx";
// import BrandDetails from "../BrandDetail.jsx";
  
// const userId =getUserId()
// function BrandDetailsPage() {
//   const params = useParams();
//   const searchParams = useSearchParams();
  
//   const [brandData, setBrandData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Extract both UUID and brand name from params/searchParams
//   const { brandUuid, brandName } = useMemo(() => {
//     let uuid = null;
//     let name = null;

//     // 1. Try from URL params first
//     if (params?.brandId) {
//       uuid = params.brandId;
//     }
//     if (params?.brandName) {
//       name = decodeURIComponent(params.brandName);
//     }

//     // 2. Try from search params
//     if (!uuid && searchParams?.get('uuid')) {
//       uuid = searchParams.get('uuid');
//     }
//     if (!name && searchParams?.get('brandName')) {
//       name = decodeURIComponent(searchParams.get('brandName'));
//     }

//     // 3. Fallback: try sessionStorage keys (client-side only)
//     if (typeof window !== 'undefined' && !uuid) {
//       for (const key of Object.keys(sessionStorage)) {
//         if (key.startsWith("brand-")) {
//           try {
//             const item = JSON.parse(sessionStorage.getItem(key));
//             if (item?.uuid) {
//               uuid = item.uuid;
//               name = item.brandName || name;
//               break;
//             }
//           } catch {}
//         }
//       }
//     }

//     return { brandUuid: uuid, brandName: name };
//   }, [params, searchParams]);

//   const brandCacheKey = `brand-data-${brandUuid || "none"}-${brandName || "none"}`;
//   const brandSessionDataKey = `brand-${brandUuid || "none"}`;

//   // IMMEDIATE hydration from sessionStorage if possible
//   useEffect(() => {
//     setLoading(true);
//     setError(null);

//     if (!brandName) {
//       setLoading(false);
//       setError("No brand found");
//       setBrandData(null);
//       return;
//     }

//     // 1. Strict check from sessionStorage (full brand storage)
//     let hydrated = null;
//     const fromSession = sessionStorage.getItem(brandSessionDataKey);
//     if (fromSession) {
//       try {
//         hydrated = JSON.parse(fromSession);
//         setBrandData(Array.isArray(hydrated) ? hydrated : [hydrated]);
//         setLoading(false);
//         return;
//       } catch {}
//     }

//     // 2. Generic cache fallback
//     const fromCache = sessionStorage.getItem(brandCacheKey);
//     if (fromCache) {
//       try {
//         hydrated = JSON.parse(fromCache);
//         setBrandData(Array.isArray(hydrated) ? hydrated : [hydrated]);
//         setLoading(false);
//         return;
//       } catch {}
//     }

//     // 3. Must fetch from API
//     (async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/v1/brandlisting/getBrandListingSlug/${brandName}`,
//           { 
//             params: { 
//               userId,
//               ...(brandName && { brandName }) // Include brandName if available
//             } 
//           }
//         );
//         let brand = res.data?.data;
        
//         // Guarantee always array for BrandDetails
//         const brandArray = Array.isArray(brand) ? brand : [brand];
//         setBrandData(brandArray);
        
//         // Cache in sessionStorage
//         sessionStorage.setItem(brandCacheKey, JSON.stringify(brandArray));
//         sessionStorage.setItem(brandSessionDataKey, JSON.stringify(brandArray));
        
//       } catch (err) {
//         console.error("Brand fetch error:", err);
//         setError(err.response?.data?.message || "Failed to load brand details.");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [brandUuid, brandName, brandCacheKey, brandSessionDataKey]);

//   // Defensive: while loading or error or missing/invalid data, render early spinner/state
//   if (error) {
//     return (
//       <Box sx={{ pt: 10, textAlign: "center", color: "error.main" }}>
//         Error: {error}
//       </Box>
//     );
//   }

//   if (
//     loading ||
//     !brandData ||
//     !Array.isArray(brandData) ||
//     brandData.length === 0 ||
//     !brandData[0]
//   ) {
//     return (
//       <Box
//         sx={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           width: "100vw",
//           height: "100vh",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           backgroundColor: "rgba(255,255,255,0.6)",
//           zIndex: 1300,
//         }}
//       >
//         <CircularProgress color="warning" size={60} />
//       </Box>
//     );
//   }


//   return (
//     <>
//       <Suspense
//         fallback={
//           <Box sx={{ 
//             minHeight: 220, 
//             display: "flex", 
//             alignItems: "center", 
//             justifyContent: "center" 
//           }}>
//             <CircularProgress color="warning" size={40} />
//           </Box>
//         }
//       >
//         <Box
//           sx={{
//             backgroundImage: `url(/bg25.jpeg)`, // Fixed: removed extra parenthesis
//             backgroundSize: "400px auto",  
//             backgroundAttachment: "fixed",
//             backgroundRepeat: "repeat",
//             minHeight: "87vh",
//             width: "100%",
//           }}
//         >
//           <BrandDetails
//             brandData={brandData}
//             fromSession={true}
//             key={brandCacheKey}
//           />
//         </Box>
//       </Suspense>
//     </>
//   );
// }

// export default BrandDetailsPage;

"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useParams } from "next/navigation.js";
import { CircularProgress, Box } from "@mui/material";
import axios from "axios";
import { getUserId} from "@/Utils/autherId.jsx";
import BrandDetails from "../BrandDetail.jsx";
  
const userId =getUserId()
function BrandDetailsPage() {
  const params = useParams();
  
  const [brandData, setBrandData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

const brandName = useMemo(() => {
  if (!params?.slug) return null;
  return decodeURIComponent(params.slug);
}, [params]);





  const brandCacheKey = `brand-data-${brandName || "none"}`;

  // IMMEDIATE hydration from sessionStorage if possible
  useEffect(() => {
    setLoading(true);
    setError(null);

    if (!brandName) {
      setLoading(false);
      setError("No brand found");
      setBrandData(null);
      return;
    }

    

    // 3. Must fetch from API
    (async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/brandlisting/getBrandListingSlug/${brandName}`,
          { 
            params: { 
              userId,
              ...(brandName && { brandName }) // Include brandName if available
            } 
          }
        );
        let brand = res.data?.data;
        
        // Guarantee always array for BrandDetails
        const brandArray = Array.isArray(brand) ? brand : [brand];
        setBrandData(brandArray);
        
       
        
      } catch (err) {
        console.error("Brand fetch error:", err);
        setError(err.response?.data?.message || "Failed to load brand details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [ brandName,]);

  // Defensive: while loading or error or missing/invalid data, render early spinner/state
  if (error) {
    return (
      <Box sx={{ pt: 10, textAlign: "center", color: "error.main" }}>
        Error: {error}
      </Box>
    );
  }

  if (
    loading ||
    !brandData ||
    !Array.isArray(brandData) ||
    brandData.length === 0 ||
    !brandData[0]
  ) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.6)",
          zIndex: 1300,
        }}
      >
        <CircularProgress color="warning" size={60} />
      </Box>
    );
  }


  return (
    <>
      <Suspense
        fallback={
          <Box sx={{ 
            minHeight: 220, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center" 
          }}>
            <CircularProgress color="warning" size={40} />
          </Box>
        }
      >
        <Box
          sx={{
            backgroundImage: `url(/bg25.jpeg)`, // Fixed: removed extra parenthesis
            backgroundSize: "400px auto",  
            backgroundAttachment: "fixed",
            backgroundRepeat: "repeat",
            minHeight: "87vh",
            width: "100%",
          }}
        >
          <BrandDetails
            brandData={brandData}
            fromSession={true}
            key={brandCacheKey}
          />
        </Box>
      </Suspense>
    </>
  );
}

export default BrandDetailsPage;