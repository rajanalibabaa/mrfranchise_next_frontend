"use client"
import React, { lazy, Suspense, useEffect, useCallback } from "react";
import SEO from "../../Components/SEO/Seo";
import Navbar from "../../Components/Navbar/NavBar";
import { Box, CircularProgress, useTheme } from "@mui/material";
import { useMediaQuery } from "@mui/system";
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setFilter } from '../../Redux/Slices/FilterBrandSlice';
import Footer from "../../Components/Footers/Footer.jsx";

// Lazy load the BrandList component
const BrandListNew = lazy(() => import("./BrandListAllbrands.jsx"));

function BrandCategoryViewPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get category from URL
  const category = new URLSearchParams(location.search).get('subcat') || 'Food & Beverage';
  const state = new URLSearchParams(location.search).get('state') || 'India';
  const investmentRange = new URLSearchParams(location.search).get('investmentRange') || '';

useEffect(() => {
  const params = new URLSearchParams(location.search);

  if (params.has('subcat')) {
    dispatch(setFilter({ filterName: 'subcat', value: params.get('subcat') }));
  }
  if (params.has('state')) {
    dispatch(setFilter({ filterName: 'state', value: params.get('state') }));
  }
  if (params.has('investmentRange')) {
    dispatch(setFilter({ filterName: 'investmentRange', value: params.get('investmentRange') }));
  }
  if (params.has('maincat')) {
    dispatch(setFilter({ filterName: 'maincat', value: params.get('maincat') }));
  }
  if (params.has('childcat')) {
    dispatch(setFilter({ filterName: 'childcat', value: params.get('childcat') }));
  }
  if (params.has('searchTerm')) {
    dispatch(setFilter({ filterName: 'searchTerm', value: params.get('searchTerm') }));
  }
    navigate("/brandViewPage", { replace: true })

}, [location.search, dispatch,navigate]);

  // Generate dynamic title and description
  const seoTitle = investmentRange 
    ? `${category} Franchises Under ₹${investmentRange} in ${state} | MrFranchise`
    : `Top ${category} Franchise Opportunities in ${state} | MrFranchise`;
    
  const seoDescription = investmentRange
    ? `Explore ${category} franchise opportunities under ₹${investmentRange} in ${state}. Find low investment, high ROI food business franchises.`
    : `Browse 1000+ ${category.toLowerCase()} franchise opportunities in ${state}. Compare brands, investment & ROI to find your perfect business.`;

  // Schema markup
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://mrfranchise.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": `${category} Franchises`,
        "item": `https://mrfranchise.in/franchises/${category.toLowerCase().replace(/ /g, '-')}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": state !== 'India' ? `${category} Franchises in ${state}` : `${category} Franchises`,
        "item": window.location.href
      }
    ]
  };

  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${category} Franchise Opportunities`,
    "description": `List of ${category} franchise brands available in ${state}`,
    "url": window.location.href,
    "numberOfItems": 1000 // Update with actual count
  };

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={`${category} franchise, ${category.toLowerCase()} business opportunities, franchise in ${state}, low investment franchise`}
        canonical={window.location.href}
        url={window.location.href}
        image="https://mrfranchise.in/images/franchise-category.jpg"
        schema={[breadcrumbSchema, categorySchema]}
        og={{
          type: "website",
          title: seoTitle,
          description: seoDescription
        }}
        twitter={{
          card: "summary_large_image",
          title: seoTitle,
          description: seoDescription
        }}
      />

      {isMobile && (
        <Box
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: "#fff",
          }}
        >
          <Navbar />
        </Box>
      )}

      {!isMobile && <Navbar />}
      
      <Box
        component="main"
        sx={{
          mt: "12px",
          ml: "12px",
          minHeight: "calc(100vh - 64px)",
          position: "relative",
        }}
      >
        <Suspense
          fallback={
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <CircularProgress />
            </Box>
          }
        >
          <BrandListNew />
        </Suspense>
      </Box>
      <Footer />
    </>
  );
}

export default React.memo(BrandCategoryViewPage);