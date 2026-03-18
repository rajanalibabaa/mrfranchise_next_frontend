"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
  useMemo,
} from "react";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useMediaQuery, useTheme } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { motion } from "framer-motion";
import ArrowRight from "@mui/icons-material/ArrowRight";
import ArrowForward from "@mui/icons-material/ArrowForward";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Close from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilterOptions } from "../../Redux/Slices/filterDropdownData";
import { fetchFilteredBrands, setFilter } from "../../Redux/Slices/FilterBrandSlice";
import LoginPage from "@/Components/LoginPage/LoginPage";
import HomePageBrandCard from "./HomePageBrandCard";

const CARD_DIMENSIONS = {
   mobile: { width: 280, height: 520 },
  tablet: { width: 320, height: 560 },
  smallDesktop: { width: 280, height: 500 },
  desktop: { width: 267, height: 480 },
  largeDesktop: { width: 337, height: 500 },
};

const FindFranchiseLocations = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("sm", "md"));
  const isSmallDesktop = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isDesktop = useMediaQuery(theme.breakpoints.between("lg", "xl"));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up("xl"));
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const scrollRequestRef = useRef(null);

  // Redux states
  const { states } = useSelector((state) => state.filterDropdown);
  const {
    brands,
    loading: brandsLoading,
    error: brandsError,
    filters,
  } = useSelector((state) => state.filterBrands);

  // Local states
  const [likeProcessing, setLikeProcessing] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const [showStartShadow, setShowStartShadow] = useState(false);
  const [showEndShadow, setShowEndShadow] = useState(false);
  const [removeMsg, setRemoveMsg] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [visibleCardCount, setVisibleCardCount] = useState(4);

  const dimensions = useMemo(() => {
    if (isMobile) return CARD_DIMENSIONS.mobile;
    if (isTablet) return CARD_DIMENSIONS.tablet;
    if (isSmallDesktop) return CARD_DIMENSIONS.smallDesktop;
    if (isDesktop) return CARD_DIMENSIONS.desktop;
    return CARD_DIMENSIONS.largeDesktop;
  }, [isMobile, isTablet, isSmallDesktop, isDesktop, isLargeDesktop]);

   // Added useLayoutEffect for calculating visible cards
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
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, [dimensions.width, isMobile]);

  // Set initial state filter when component mounts
  useEffect(() => {
    if (states && states.length > 0) {
      const tamilNaduExists = states.some(
        state => (state.name || state) === "Tamil Nadu"
      );
      if (tamilNaduExists) {
        setSelectedState("Tamil Nadu");
        dispatch(setFilter({ filterName: "state", value: "Tamil Nadu" }));
      }
    }
  }, [dispatch, states]);

  // Fetch initial filter options
  useEffect(() => {
    dispatch(fetchFilterOptions());
  }, [dispatch]);

  // Fetch brands based on filters - this is the key fix
  useEffect(() => {
    if (filters.state || selectedState) {
      const currentFilters = {
        ...filters,
        state: selectedState || filters.state
      };
      dispatch(fetchFilteredBrands(currentFilters));
    }
  }, [dispatch, filters, selectedState]);

  // Handle state filter change
  const handleStateChange = (state) => {
    setSelectedState(state);
    dispatch(setFilter({ filterName: "state", value: state }));
    // Reset scroll position when state changes
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  };



  // Scroll handlers
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || !brands?.length) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowStartShadow(scrollLeft > 10);
    setShowEndShadow(scrollLeft < scrollWidth - clientWidth - 10);
  }, [brands]);

  const smoothScrollTo = useCallback((target) => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    if (scrollRequestRef.current) {
      cancelAnimationFrame(scrollRequestRef.current);
    }

    const start = container.scrollLeft;
    const change = target - start;
    const startTime = performance.now();
    const duration = 500;

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

  const easeInOutQuad = (t) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  const handleNextClick = useCallback(() => {
    if (!scrollContainerRef.current || !brands?.length) return;

    const container = scrollContainerRef.current;
    const scrollDistance = dimensions.width + (isMobile ? 16 : 24);
    const newScrollLeft = container.scrollLeft + scrollDistance;

    smoothScrollTo(newScrollLeft);
  }, [brands, dimensions.width, isMobile, smoothScrollTo]);

  const handlePrevClick = useCallback(() => {
    if (!scrollContainerRef.current || !brands?.length) return;

    const container = scrollContainerRef.current;
    const scrollDistance = dimensions.width + (isMobile ? 16 : 24);
    const newScrollLeft = container.scrollLeft - scrollDistance;

    smoothScrollTo(newScrollLeft);
  }, [brands, dimensions.width, isMobile, smoothScrollTo]);

  // Initialize and clean up scroll listeners
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
      if (scrollRequestRef.current) {
        cancelAnimationFrame(scrollRequestRef.current);
      }
    };
  }, [handleScroll]);

  
  if (brandsLoading) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (brandsError) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography color="error">
          {brandsError || "Failed to load brands."}
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
          gap: 2,
           backgroundColor:'white',
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
              background:
                theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00",
              mt: 1,
              borderRadius: 2,
            },
          }}
        >
          {selectedState ? `Franchise Opportunities in ${selectedState}` : "All Franchise Opportunities"}
        </Typography>
 
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center",}}>
          <FormControl sx={{ minWidth: isMobile ? 120 : 200,backgroundColor: '#f57a00' }} size="small">
{/* <InputLabel
  id="state-filter-label"
  sx={{
    color: "#000000ff",
    "&.Mui-focused": {
      color: "#fff",
    },
  }}
>
  Filter by State
</InputLabel> */}
            <Select
              labelId="state-filter-label"
              value={selectedState || ""}
              label="Filter by State"
              onChange={(e) => handleStateChange(e.target.value)}
            >
              <MenuItem value="">All States</MenuItem>
              {states?.map((state) => {
                const stateName = state.name || state;
                const stateValue = state.name || state;
                return (
                  <MenuItem key={stateName} value={stateValue}>
                    {stateName}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

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
  onClick={() => window.open("/all-franchise-brands", "_blank")}
>
  View More
</Button>

        </Box>
      </Box>
 
      <Box sx={{ position: "relative" }}>
        <Button
          onClick={handlePrevClick}
          aria-label="previous"
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
            gap: isMobile ? 2 : 1.8,
            p: 0.5,
            scrollBehavior: "smooth",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {brands?.length > 0 ? (
            brands.slice(0, 10).map((brand) => (
              <motion.div key={brand.uuid}>
                <HomePageBrandCard
                  brand={brand}
                  likeProcessing={likeProcessing}
                  dimensions={dimensions}
                  theme={theme}
                  isMobile={isMobile}
                  isTablet={isTablet}
                />
              </motion.div>
            ))
          ) : (
            <Box sx={{ p: 4, width: "100%", textAlign: "center" }}>
              <Typography>
                {selectedState 
                  ? `No brands found in ${selectedState}`
                  : "Please select a state to view brands"}
              </Typography>
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

export default FindFranchiseLocations;