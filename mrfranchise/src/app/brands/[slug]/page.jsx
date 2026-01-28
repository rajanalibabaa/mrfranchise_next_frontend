

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
          `https://mrfranchisebackend.mrfranchise.in/api/v1/brandlisting/getBrandListingSlug/${brandName}`,
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