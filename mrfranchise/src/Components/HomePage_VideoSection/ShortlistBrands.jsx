'use client'
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {

  useTheme,
  useMediaQuery,
 
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";


import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";
import ArrowRight from "@mui/icons-material/ArrowRight";

import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchShortListedById } from "../../redux/Slices/shortlistslice.jsx";
import HomePageBrandCard from "./HomePageBrandCard.jsx";
import LoginPage from "@/Components/LoginPage/LoginPage.jsx";
const ShortlistBrands = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const dispatch = useDispatch();
 
  // Redux state
  const {
    brands = [],
    pagination: { currentPage = 1, totalPages = 1 } = {},
    isLoading = false,
    error = null,
  } = useSelector((state) => state.shortList || {});

  // console.log("Shortlisted Brands:", brands);
  // console.log("Pagination:", currentPage, totalPages);

  // Data fetching
  useEffect(() => {
    dispatch(fetchShortListedById({ page: 1 }));
  }, [dispatch]);
  // Local state
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [likeProcessing, setLikeProcessing] = useState({});
  const [showStartShadow, setShowStartShadow] = useState(false);
  const [showEndShadow, setShowEndShadow] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  // Refs
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const scrollRequestRef = useRef(null);
 
  // Dimensions
  const dimensions = useMemo(
    () =>
      ({
        mobile: { width: 280, height: 520 },
        tablet: { width: 320, height: 560 },
        desktop: { width: 327, height: 500 },
      }[isMobile ? "mobile" : isTablet ? "tablet" : "desktop"]),
    [isMobile, isTablet]
  );
  // Scroll handlers
  const easeInOutQuad = useCallback(
    (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    []
  );
  const smoothScrollTo = useCallback(
    (target, immediate = false) => {
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
    },
    [easeInOutQuad]
  );
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
    setShowEndShadow(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  }, []);
 
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (scrollRequestRef.current) {
        cancelAnimationFrame(scrollRequestRef.current);
      }
    };
  }, [handleScroll]);

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  if (brands.length === 0) {
    return null;
  }
 
  return (
    <Box
      ref={containerRef}
      sx={{
        py: isMobile ? 1 : 0,
        px: isMobile ? 0 : 2,
        maxWidth: isMobile ? "100%" : 1400,
        mx: "auto",
        position: "relative",
      }}
    >
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
           backgroundColor:'white',
            p: 1.5,
            borderRadius: 2,
        }}
      >
        <Typography
          variant={isMobile ? "body1" : "h5"}
          fontWeight="bold"
          ml={isMobile ? 2 : 0}
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
              background: theme.palette.mode === "dark" ? "#ffb74d" : "#2df500ff",
              mt: 1,
              borderRadius: 2,
            },
          }}
        >
          Your Shortlisted Brands
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
  onClick={() => window.open("/AllCategoryPage/allbrandlisting", "_blank")}
>
  View More
</Button>

      </Box>
      <Box sx={{ position: "relative" }}>
        <Button
          onClick={handlePrevClick}
          disabled={!showStartShadow}
          sx={{
            position: "absolute",
            left: isMobile ? 2 : -10,
            top: "63.5%",
            transform: "translateY(-50%)",
            zIndex: 1,
            minWidth: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "#ff9800",
          color:"black",
            boxShadow: 2,
            "&:hover": { backgroundColor: "#c28223ff" },
            "&:disabled": { opacity: 0, pointerEvents: "none" },
          }}
        >
          <ArrowBack fontSize="small" />
        </Button>
 
        <Button
          onClick={handleNextClick}
          disabled={!showEndShadow}
          sx={{
            position: "absolute",
            right: isMobile ? 4 : 8,
            top: "63.5%",
            transform: "translateY(-50%)",
            zIndex: 1,
            minWidth: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "#ff9800",
            color:"black",
            boxShadow: 2,
            "&:hover": { backgroundColor: "#c28223ff" },
            "&:disabled": { opacity: 0, pointerEvents: "none" },
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
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                p: 4,
              }}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : brands.length ? (
            brands.map((brand) => (
              <motion.div
                key={brand.uuid || brand.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <HomePageBrandCard
                  brand={brand}
                  likeProcessing={likeProcessing[brand.uuid] || false}
                  dimensions={dimensions}
                  theme={theme}
                  isMobile={isMobile}
                  isTablet={isTablet}
                />
              </motion.div>
            ))
          ) : null}
        </Box>
      </Box>
      {showLogin && (
        <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </Box>
  );
};

export default ShortlistBrands;
