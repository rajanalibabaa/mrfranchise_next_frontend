"use client";
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {

  useMediaQuery,
  useTheme,
  
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from '@mui/material/IconButton'
import { motion } from "framer-motion";
import ArrowRight from "@mui/icons-material/ArrowRight";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Close from "@mui/icons-material/Close";


import { useSelector, useDispatch } from 'react-redux';
import HomePageBrandCard from './HomePageBrandCard';
import { openBrandDialog } from "@/Redux/Slices/OpenBrandNewPageSlice.jsx";
import { fetchBrandsBySubCategory } from "@/Redux/Slices/SideMenuHoverBrandSlices.jsx";
import LoginPage from "@/Components/LoginPage/LoginPage.jsx";
import { toggleHomeCardLike } from '@/Redux/Slices/TopCardFetchingSlice.jsx';
import { toggleBrandLike } from "@/Redux/Slices/GetAllBrandsDataUpdationFile.jsx";
import { likeApiFunction } from "@/Api/likeApi.jsx";
import { getToken } from "@/Utils/autherId.jsx";
const token = getToken();
const CARD_DIMENSIONS = {
  mobile: { width: 280, height: 520 },
  tablet: { width: 320, height: 560 },
  desktop: { width: 327, height: 500 },
};

const SimilarBrands = ({ brandData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const scrollRequestRef = useRef(null);
  const [showStartShadow, setShowStartShadow] = useState(false);
  const [showEndShadow, setShowEndShadow] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [likeProcessing, setLikeProcessing] = useState({});
  const [removeMsg, setRemoveMsg] = useState("");
  const dispatch = useDispatch();

  // Get brands from Redux
  const { brands, loading, error } = useSelector((state) => state.brandCategory);

  // console.log("SimilarBrands Brands from Redux:", brands);

  // Get current brand's subCategory and childCategory
  const currentSubCategory = brandData[0]?.brandfranchisedetails?.franchiseDetails?.brandCategories?.main;
  const currentChildCategory = brandData[0]?.brandfranchisedetails?.franchiseDetails?.brandCategories?.sub;
  const currentBrandUUID = brandData[0]?.uuid;

  // console.log("SimilarBrands Rendered", currentChildCategory);

  // Fetch brands from Redux when brandData changes
  useEffect(() => {
    if (currentChildCategory) {
      dispatch(fetchBrandsBySubCategory({
        subCategory: currentChildCategory,
        id: currentBrandUUID,
        isPrefetch: false
      }));
    }
  }, [dispatch, currentChildCategory]);
  

  // // Filter brands: same subCategory, not current brand
  // const filteredBrands = useMemo(() => {
  //   if (!brands || !currentChildCategory) return [];
  //   return brands.filter(
  //     (brand) =>
  //       brand.brandCategories?.sub === currentChildCategory &&
  //       brand.uuid !== currentBrandUUID 
  //   );
  // }, [brands, currentChildCategory, currentBrandUUID]);


  // console.log("Filtered Similar Brands:", filteredBrands);
  const dimensions = useMemo(() => {
    if (isMobile) return CARD_DIMENSIONS.mobile;
    if (isTablet) return CARD_DIMENSIONS.tablet;
    return CARD_DIMENSIONS.desktop;
  }, [isMobile, isTablet]);

  const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

  const smoothScrollTo = useCallback((target, immediate = false) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    if (scrollRequestRef.current) cancelAnimationFrame(scrollRequestRef.current);

    const start = container.scrollLeft;
    const change = target - start;
    const duration = immediate ? 0 : 500;
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutQuad(progress);
      container.scrollLeft = start + change * ease;

      if (progress < 1) {
        scrollRequestRef.current = requestAnimationFrame(animateScroll);
      } else {
        handleScroll();
      }
    };

    scrollRequestRef.current = requestAnimationFrame(animateScroll);
  }, []);

  const getScrollDistance = useCallback(() => {
    return dimensions.width + (isMobile ? 16 : 24);
  }, [dimensions.width, isMobile]);

  const handlePrevClick = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const distance = getScrollDistance();
    const newScroll = Math.max(container.scrollLeft - distance, 0);
    smoothScrollTo(newScroll);
  }, [getScrollDistance, smoothScrollTo]);

  const handleNextClick = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const distance = getScrollDistance();
    const maxScroll = container.scrollWidth - container.clientWidth;
    const newScroll = Math.min(container.scrollLeft + distance, maxScroll);
    smoothScrollTo(newScroll);
  }, [getScrollDistance, smoothScrollTo]);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setShowStartShadow(container.scrollLeft > 10);
    setShowEndShadow(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll();
    }
    return () => {
      container?.removeEventListener("scroll", handleScroll);
      if (scrollRequestRef.current) cancelAnimationFrame(scrollRequestRef.current);
    };
  }, [handleScroll]);

  const handleLikeClick = async (brandId) => {
    if (!token) {
      setShowLogin(true);
      return;
    }

    dispatch(toggleHomeCardLike(brandId));
    dispatch(toggleBrandLike(brandId));
    await likeApiFunction(brandId);
  };

  const handleApply = useCallback((brand) => {
    dispatch(openBrandDialog(brand));
  }, [dispatch]);

  if (!brandData) return null;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    if (error === "No brands found for this category" || error === "Sub category not found") {
      return null;
    }
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 10,
        textAlign: 'center'
      }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          Error loading similar brands
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error}
        </Typography>
      </Box>
    );
  }

  if (brands.length === 0) return null;

  return (
    <>
      <Box
        ref={containerRef}
        sx={{
          py: isMobile ? 1 : 0,
          px: isMobile ? 0 : 2,
          maxWidth: isMobile ? "100%" : 1400,
          mx: "auto",
          position: "relative",
          // borderTop: `1px solid ${theme.palette.divider}`,
          mt: 0
        }}
      >
        {removeMsg && (
          <Box sx={{
            mb: 3,
            p: 2,
            borderRadius: 2,
            backgroundColor: '#4caf50',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography>{removeMsg}</Typography>
            <IconButton size="small" onClick={() => setRemoveMsg("")}>
              <Close sx={{ color: 'white' }} />
            </IconButton>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
            px: isMobile ? 2 : 0,
             backgroundColor:'white',
            p: 1.5,
            borderRadius: 2,
          }}
        >
          <Typography
            variant={isMobile ? "body1" : "h5"}
            fontWeight="bold"
            sx={{
              color: "#f57c00",
              mb: 1,
             
              textAlign: "left",
              position: "relative",
              "&:after": {
                content: '""',
                display: "block",
                width: "80px",
                height: "4px",
                background:
                  theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00",
                mt: 1,
                borderRadius: 2,
              },
            }}
          >
            Similar Category Brands
          </Typography>

          <Button
            variant="outlined"
            size="small"
            aria-label="view more brands"
            endIcon={<ArrowRight />}
            sx={{
              textTransform: "none",
              fontSize: isMobile ? 14 : 16,
              background: theme.palette.mode === "dark" 
                ? "linear-gradient(90deg, #ff9800, #ffb74d)" 
                : "linear-gradient(90deg, #f57c00, #ff9800)",
              color: "#fff",
              borderRadius: "8px",
              px: 2,
              "&:hover": {
                background: theme.palette.mode === "dark" 
                  ? "linear-gradient(90deg, #ffb74d, #ff9800)" 
                  : "linear-gradient(90deg, #ff9800, #f57c00)",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              },
            }}
            onClick={() => {
              window.open(`/AllCategoryPage/allbrandlisting?category=${currentSubCategory}&subCategory=${currentChildCategory}`, "_blank");
            }}
          >
            View More
          </Button>
        </Box>

        <Box sx={{ position: "relative" }}>
          <Button
            onClick={handlePrevClick}
            disabled={!showStartShadow}
            aria-label="previous"
            sx={{
              position: "absolute",
              left: isMobile ? 2 : -10,
              top: "63.5%",
              transform: "translateY(-50%)",
              zIndex: 1,
              minWidth: 40,
              height: 40,
              borderRadius: "50%",
              color:"black",
              backgroundColor: "#ff9800",
              boxShadow: 2,
              "&:hover": {
                backgroundColor: "#c28223ff",
              },
              "&:disabled": {
                opacity: 0,
                pointerEvents: "none",
              },
            }}
          >
            <ArrowBack fontSize="small" />
          </Button>

          <Button
            onClick={handleNextClick}
            disabled={!showEndShadow}
            aria-label="next"
            sx={{
              position: "absolute",
              right: isMobile ? 4 : -10,
              top: "63.5%",
              transform: "translateY(-50%)",
              zIndex: 1,
              minWidth: 40,
              height: 40,
              borderRadius: "50%",
              color:"black",
              backgroundColor: "#ff9800",
              boxShadow: 2,
              "&:hover": {
                backgroundColor: "#c28223ff",
              },
              "&:disabled": {
                opacity: 0,
                pointerEvents: "none",
              },
            }}
          >
            <ArrowForward fontSize="small" />
          </Button>

          <Box
            ref={scrollContainerRef}
            sx={{
              display: "flex",
              overflowX: "auto",
              gap: isMobile ? 2 : 3,
              p: 2,
              scrollBehavior: "smooth",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {brands?.map((brand) => (
              // console.log("Rendering brand in SimilarBrands:", brand),
              <motion.div key={brand.uuid || brand.id}>
                <HomePageBrandCard
                  brand={brand}
                  handleApply={handleApply}
                  handleLikeClick={handleLikeClick}
                  likeProcessing={likeProcessing}
                  dimensions={dimensions}
                  theme={theme}
                  isMobile={isMobile}
                  isTablet={isTablet}
                />
              </motion.div>
            ))}
          </Box>
        </Box>

        {showLogin && (
          <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
        )}
      </Box>
    </>
  );
};

export default SimilarBrands;