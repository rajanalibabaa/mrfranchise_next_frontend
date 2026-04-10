"use client";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  useLayoutEffect,
} from "react";
import {
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import slugify from "slugify";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";
import ArrowRight from "@mui/icons-material/ArrowRight";
import { useSelector, useDispatch } from "react-redux";
import LoginPage from "@/Components/LoginPage/LoginPage.jsx";
import { motion } from "framer-motion";
import HomePageBrandCard from "./HomePageBrandCard.jsx";
import { homeSection9 } from '@/Redux/Slices/TopCardFetchingSlice.jsx';

const CARD_DIMENSIONS = {
  mobile: { width: 280, height: 520 },
  tablet: { width: 320, height: 560 },
  smallDesktop: { width: 280, height: 500 },
  desktop: { width: 277, height: 480 },
  largeDesktop: { width: 337, height: 500 },
};

const HomeSection9 = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isSmallDesktop = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isDesktop = useMediaQuery(theme.breakpoints.between("lg", "xl"));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up("xl"));

  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const scrollRequestRef = useRef(null);

  const [likeProcessing, setLikeProcessing] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const [showStartShadow, setShowStartShadow] = useState(false);
  const [showEndShadow, setShowEndShadow] = useState(true);
  const [visibleCardCount, setVisibleCardCount] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);

  const dimensions = useMemo(() => {
    if (isMobile) return CARD_DIMENSIONS.mobile;
    if (isTablet) return CARD_DIMENSIONS.tablet;
    if (isSmallDesktop) return CARD_DIMENSIONS.smallDesktop;
    if (isDesktop) return CARD_DIMENSIONS.desktop;
    return CARD_DIMENSIONS.largeDesktop;
  }, [isMobile, isTablet, isSmallDesktop, isDesktop, isLargeDesktop]);

  // Debugging: Add console.log to check Redux state
  const homeSection9State = useSelector((state) => state.overAllPlatform.homeSection9);

  const {
    brands = [],
    isLoading,
    error,
    pagination
  } = homeSection9State || {};

  // Load initial data
  useEffect(() => {
    dispatch(homeSection9({ page: 1 }));
  }, [dispatch]);

  const isFetchingRef = useRef(false);

  // Handle scroll to load more
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowStartShadow(scrollLeft > 10);
    setShowEndShadow(scrollLeft < scrollWidth - clientWidth - 10);

    // Load more when scrolled to end and there are more pages
    if (
      scrollLeft + clientWidth >= scrollWidth - 100 && 
      pagination?.hasNextPage && 
      !isLoading && 
      !isFetchingRef.current
    ) {
      isFetchingRef.current = true;
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      dispatch(homeSection9({ page: nextPage }))
        .finally(() => {
          isFetchingRef.current = false;
        });
    }
  }, [pagination, isLoading, currentPage, dispatch]);

  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const debouncedHandleScroll = useMemo(
    () => debounce(handleScroll, 100),
    [handleScroll]
  );

  // Set up scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", debouncedHandleScroll);
      handleScroll(); // Initial check
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", debouncedHandleScroll);
      }
      if (scrollRequestRef.current) {
        cancelAnimationFrame(scrollRequestRef.current);
      }
    };
  }, [debouncedHandleScroll, handleScroll]);

  // Calculate visible cards based on container width
  useLayoutEffect(() => {
    const updateVisibleCards = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const cardWidth = dimensions.width;
        const gap = isMobile ? 16 : 24;
        const count = Math.floor(containerWidth / (cardWidth + gap));
        setVisibleCardCount(Math.max(1, count));
      }
    };

    updateVisibleCards();
    const debouncedResize = debounce(updateVisibleCards, 200);
    window.addEventListener("resize", debouncedResize);
    return () => window.removeEventListener("resize", debouncedResize);
  }, [dimensions.width, isMobile]);

  // Smooth scroll functions
  const getScrollDistance = useCallback(() => {
    return dimensions.width + (isMobile ? 16 : 24);
  }, [dimensions.width, isMobile]);

  const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

  const smoothScrollTo = useCallback((target, immediate = false) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    if (scrollRequestRef.current) {
      cancelAnimationFrame(scrollRequestRef.current);
    }

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
  }, [handleScroll]);

  const handleNextClick = () => {
    scrollContainerRef.current?.scrollBy({
      left: getScrollDistance(),
      behavior: "smooth",
    });
  };

  const handlePrevClick = () => {
    scrollContainerRef.current?.scrollBy({
      left: -getScrollDistance(),
      behavior: "smooth",
    });
  };

  const brandCategoriesName = brands[0]?.brandCategories?.sub;
  
  const handleClickOpenBrandCategories = () => {
    if (!brandCategoriesName) return;
    const slug = slugify(brandCategoriesName, {
      lower: true,
      strict: true,   // removes &, /, special chars
      trim: true,
    });

    const subcat = encodeURIComponent(brandCategoriesName); // encode spaces/special chars
   const url = `${slug}-franchise-opportunities?subcat=${subcat}&maincat=${encodeURIComponent(brands[0]?.brandCategories?.main || "")}`;

    // Open in new tab
    const newWindow = window.open(url, "_blank"); 

    // Optional: focus the new tab
    if (newWindow) newWindow.focus();
  };

  if (error) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography color="error">
          {error.message || "Failed to load brands."}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        py: isMobile ? 1 : 1,
        px: isMobile ? 0 : 2,
        maxWidth: isMobile ? "100%" : 1400,
        mx: "auto",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
          px: isMobile ? 3 : 0,
          gap: 2,
          backgroundColor: 'white',
          p: 1.5,
          borderRadius: 2,
        }}
      >
        <Typography
          variant={isMobile ? "body1" : "h5"}
          fontWeight="bold"
          sx={{
            color: "#000000ff",
            mb: 1,
            textAlign: "left",
            position: "relative",
            "&:after": {
              content: '""',
              display: "block",
              width: "80px",
              height: "4px",
              background: theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00",
              mt: 1,
              borderRadius: 2,
            },
          }}
        >
          Top {brandCategoriesName || "Brand"} Franchise Industry Brands
        </Typography>

        <Button
          variant="contained"
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
          onClick={handleClickOpenBrandCategories}
        >
          View More
        </Button>
      </Box>

      <Box sx={{ position: "relative" }}>
        <Button
          onClick={handlePrevClick}
          aria-label="previous"
          disabled={!showStartShadow}
          sx={{
            position: "absolute",
            left: isMobile ? 4 : -10,
            top: "63.5%",
            transform: "translateY(-50%)",
            zIndex: 1,
            minWidth: 40,
            height: 40,
            borderRadius: "50%",
            color: "black",
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
            color: "black",
            zIndex: 1,
            minWidth: 40,
            height: 40,
            borderRadius: "50%",
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
            gap: isMobile ? 2 : 1.8,
            p: 0.5,
            scrollBehavior: "smooth",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {brands.map((brand) => (
            <Box key={brand.uuid || brand.id || brand._id}>
              <HomePageBrandCard
                brand={brand}
                likeProcessing={likeProcessing}
                dimensions={dimensions}
                theme={theme}
                isMobile={isMobile}
                isTablet={isTablet}
              />
            </Box>
          ))}
          {isLoading && brands.length > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", pl: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
          {isLoading && brands.length === 0 && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4, width: "100%" }}>
              <CircularProgress size={40} />
            </Box>
          )}
        </Box>
      </Box>

      {showLogin && (
        <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </Box>
  );
};

export default React.memo(HomeSection9);