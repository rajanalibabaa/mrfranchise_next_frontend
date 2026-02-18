"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  lazy,
  Suspense,
  useRef,
  startTransition,
  Fragment,
} from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Badge,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  Tooltip,
  Pagination,
  Fade,
  Skeleton,
} from "@mui/material";
import {
  Close,
  FilterAlt,
  Clear as ClearIcon,
  Compare,
} from "@mui/icons-material";
import dynamic from "next/dynamic";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  setFilter,
  resetFilters,
  fetchFilteredBrands,
  setPage,
} from "@/Redux/Slices/FilterBrandSlice";
import { fetchFilterOptions } from "@/Redux/Slices/filterDropdownData";
import AdSlot from "../ads/GoogleAd";
import { ADS } from "@/config/ads.config";
import { getLocalStorageData } from "@/Utils/localStorage";
import { usePathname } from "next/navigation";
const BrandCardSkeleton = React.memo(() => (
  <Box
    sx={{
      height: 350,
      bgcolor: "rgba(255, 255, 255, 0.59)",
      borderRadius: 2,
      p: 2,
      boxShadow: 1,
    }}
  >
    <Skeleton
      variant="rectangular"
      height={160}
      sx={{ borderRadius: 1, mb: 2 }}
    />
    <Skeleton variant="text" width="70%" height={28} />
    <Skeleton variant="text" width="50%" height={20} />
    <Skeleton variant="text" width="40%" height={20} />
    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
      <Skeleton variant="rounded" width={60} height={28} />
      <Skeleton variant="rounded" width={80} height={28} />
    </Box>
  </Box>
));
BrandCardSkeleton.displayName = "BrandCardSkeleton";

const FilterPanelSkeleton = React.memo(() => (
  <Box sx={{ p: 2, bgcolor: "rgba(255, 255, 255, 0.59)", borderRadius: 2 }}>
    {[...Array(6)].map((_, i) => (
      <Box key={`filter-skeleton-${i}`} sx={{ mb: 3 }}>
        <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="rounded" height={40} />
      </Box>
    ))}
  </Box>
));
FilterPanelSkeleton.displayName = "FilterPanelSkeleton";

const BrandCard = dynamic(() => import("./brandCard"), {
  loading: () => <BrandCardSkeleton />,
  ssr: false,
});

const FilterPanel = dynamic(() => import("./FillterPannel"), {
  loading: () => <FilterPanelSkeleton />,
  ssr: false,
});

const BrandComparison = dynamic(
  () => import("@/Components/HomePages/brandCompariosn"),
  {
    loading: () => <Skeleton />,
    ssr: false,
  },
);

const LoginPage = dynamic(() => import("@/Components/LoginPage/LoginPage"), {
  loading: () => <Skeleton />,
  ssr: false,
});

// ============================================
// CUSTOM HOOKS
// ============================================
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

// Intersection Observer Hook for Lazy Loading
const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "100px", ...options },
    );

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);

    return () => observer.disconnect();
  }, [options]);

  return [ref, isVisible];
};

// ============================================
// LAZY BRAND CARD WRAPPER
// ============================================
const LazyBrandCard = React.memo(
  ({
    brand,
    handleLikeClick,
    likeProcessing,
    enableComparison,
    isSelectedForComparison,
    onToggleBrandComparison,
    maxComparisonReached,
    onShowLogin,
  }) => {
    const [ref, isVisible] = useIntersectionObserver();

    return (
      <Box ref={ref} sx={{ minHeight: 350 }}>
        {isVisible ? (
          <Fade in timeout={300}>
            <Box>
              <Suspense fallback={<BrandCardSkeleton />}>
                <BrandCard
                  brand={brand}
                  handleLikeClick={handleLikeClick}
                  likeProcessing={likeProcessing}
                  enableComparison={enableComparison}
                  isSelectedForComparison={isSelectedForComparison}
                  onToggleBrandComparison={onToggleBrandComparison}
                  maxComparisonReached={maxComparisonReached}
                  onShowLogin={onShowLogin}
                />
              </Suspense>
            </Box>
          </Fade>
        ) : (
          <BrandCardSkeleton />
        )}
      </Box>
    );
  },
);
LazyBrandCard.displayName = "LazyBrandCard";

// ============================================
// MAIN COMPONENT
// ============================================
function BrandList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
const pathname = usePathname();
  // ============================================
  // LOCAL STATE
  // ============================================
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [likeProcessing, setLikeProcessing] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [enableComparison, setEnableComparison] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Refs for performance
  const filtersRef = useRef(null);
  const brandsContainerRef = useRef(null);

  // ============================================
  // REDUX SELECTORS (Optimized with shallowEqual)
  // ============================================
  const { brands, loading, error, filters, pagination } = useSelector(
    (state) => state.filterBrands,
    shallowEqual,
  );

  const {
    mainCategories,
    subCategories,
    childCategories,
    investmentRanges,
    franchiseModels,
    states,
    districts,
    cities,
    loading: dropdownLoading,
    loadingSubCategories,
    loadingChildCategories,
    loadingDistricts,
    loadingCities,
  } = useSelector((state) => state.filterDropdown, shallowEqual);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Debounce filters for API calls
  const debouncedFilters = useDebounce(filters, 300);

  // ============================================
  // MEMOIZED VALUES
  // ============================================
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(
      (value) =>
        value !== undefined &&
        value !== null &&
        value !== "" &&
        (!Array.isArray(value) || value.length > 0),
    ).length;
  }, [filters]);

  const gridStyles = useMemo(
    () => ({
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
        lg: "repeat(3, 1fr)",
        xl: "repeat(4, 1fr)",
      },
      gap: 2,
    }),
    [],
  );

  const containerStyles = useMemo(
    () => ({
      mt: 0,
      mb: 0,
      backgroundImage: "url(/bg25.jpeg)",
      backgroundSize: "400px auto",
      backgroundRepeat: "repeat",
      minHeight: "87vh",
      width: "100%",
    }),
    [],
  );

  // ============================================
  // EFFECTS
  // ============================================

  // Initial data fetch (only once)
  // useEffect(() => {
  //   if (!isInitialized) {
  //     dispatch(fetchFilterOptions());
  //     setIsInitialized(true);
  //   }
  // }, [dispatch, isInitialized]);

useEffect(() => {
  dispatch(fetchFilterOptions());
  setIsInitialized(true);
}, [dispatch]);

  const filterdata = {
    maincat: "Food & Beverages",
    searchTerm: filters.searchTerm || "",
  };

  // Fetch brands when debounced filters change
  // useEffect(() => {
  //   if (isInitialized) {
  //     const storedFilters = localStorageData.searchData
  //     if (storedFilters?.searchTerm) {
  //       filterdata.searchTerm = storedFilters.searchTerm;
  //       localStorage.removeItem("franchiseFilters");
  //       startTransition(() => {
  //         dispatch(fetchFilteredBrands(storedFilters));
  //       });
  //     } else {
  //       startTransition(() => {
  //         dispatch(fetchFilteredBrands(debouncedFilters));
  //       });
  //     }
  //   }
  // }, [dispatch, isInitialized, debouncedFilters]);


  // === FIXED: Only ONE fetch, no double calls ===


  useEffect(() => {
  if (!isInitialized) return;

  let finalFilters = { ...debouncedFilters };

  // Only apply stored search term from localStorage ONCE on mount
  const stored = getLocalStorageData();
  if (stored?.searchTerm && !debouncedFilters.searchTerm) {
    finalFilters.searchTerm = stored.searchTerm;
    localStorage.removeItem("franchiseFilters"); // clean up
  }

  startTransition(() => {
    dispatch(fetchFilteredBrands(finalFilters));
  });
}, [dispatch, isInitialized, debouncedFilters]); // Only these deps!



  // Check for comparison mode from URL/storage
  useEffect(() => {
    const enableFromStorage = getLocalStorageData()?.enableComparison;
    if (enableFromStorage === "true") {
      setEnableComparison(true);
      localStorage.removeItem("enableComparison");
    }
  }, []);

  // Preload background image
  useEffect(() => {
    const img = new Image();
    img.src = "/bg25.jpeg";
  }, []);

  // ============================================
  // CALLBACKS (Optimized)
  // ============================================
  const handleFilterChange = useCallback(
    (name, value) => {
      startTransition(() => {
        dispatch(setFilter({ filterName: name, value }));

        // Fetch dependent data
        const dependentFetches = {
          maincat: { main: value },
          subcat: { sub: value },
          state: { state: value },
          district: { district: value },
        };

        if (dependentFetches[name]) {
          dispatch(fetchFilterOptions(dependentFetches[name]));
        }
      });
    },
    [dispatch],
  );

  const handleClearFilters = useCallback(() => {
    startTransition(() => {
      dispatch(resetFilters());
    });
  }, [dispatch]);

  const handlePageChange = useCallback(
    (event, page) => {
      startTransition(() => {
        dispatch(setPage(page));
      });
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [dispatch],
  );

  const handleLikeClick = useCallback(
    async (brandId, isLiked) => {
      if (likeProcessing[brandId]) return;

      if (!isAuthenticated) {
        setShowLogin(true);
        return;
      }

      setLikeProcessing((prev) => ({ ...prev, [brandId]: true }));

      try {
        // Import and use toggle like
        const { useToggleLike } = await import("@/Hooks/Fetchbrands");
        // Handle like logic here
        dispatch(fetchFilteredBrands(filters));
      } catch (error) {
        console.error("Like operation failed:", error);
      } finally {
        setLikeProcessing((prev) => ({ ...prev, [brandId]: false }));
      }
    },
    [likeProcessing, isAuthenticated, dispatch, filters],
  );

  const toggleBrandComparison = useCallback((brand) => {
    setSelectedForComparison((prev) => {
      const isSelected = prev.some((b) => b.uuid === brand.uuid);

      if (isSelected) {
        return prev.filter((b) => b.uuid !== brand.uuid);
      }

      if (prev.length >= 3) return prev;

      const updated = [...prev, brand];

      // Auto-open dialog when 3 brands selected
      if (updated.length === 3) {
        setComparisonOpen(true);
      }

      return updated;
    });
  }, []);

  const handleCompareClick = useCallback(() => {
    if (!enableComparison) {
      setEnableComparison(true);
    }
    if (selectedForComparison.length > 0) {
      setComparisonOpen(true);
    }
  }, [enableComparison, selectedForComparison.length]);

  const handleCloseComparison = useCallback(() => {
    setComparisonOpen(false);
    setSelectedForComparison([]);
    setEnableComparison(false);
  }, []);

  const handleRemoveFromComparison = useCallback((uuid) => {
    setSelectedForComparison((prev) => prev.filter((b) => b.uuid !== uuid));
  }, []);

  const toggleMobileFilters = useCallback(() => {
    setMobileFiltersOpen((prev) => !prev);
  }, []);

  const closeMobileFilters = useCallback(() => {
    setMobileFiltersOpen(false);
  }, []);

  const closeLogin = useCallback(() => {
    setShowLogin(false);
  }, []);

  // ============================================
  // RENDER HELPERS
  // ============================================
  const renderBrandGrid = useMemo(() => {
    if (loading) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress size={60} thickness={4} sx={{ color: "#ff9800" }} />
        </Box>
      );
    }

    if (error) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        </Box>
      );
    }

   
    // if (brands.length === 0 && !?.searchData) {
    //   return (
    //     <Box textAlign="center" py={26}>
    //       <Typography
    //         variant="h5"
    //         color="orange"
    //         bgcolor="white"
    //         display="inline-block"
    //         p={2}
    //         borderRadius={2}
    //       >
    //         No brands match your filters
    //       </Typography>
    //       <br />
    //       <Button
    //         variant="outlined"
    //         onClick={handleClearFilters}
    //         startIcon={<ClearIcon />}
    //         size="large"
    //         sx={{ mt: 2, borderColor: "#ff9800", color: "#ff0000" }}
    //       >
    //         Clear All Filters
    //       </Button>
    //     </Box>
    //   );
    // }

    return (
      <>
        <Box sx={gridStyles} ref={brandsContainerRef}>
          {brands.map((brand, index) => (
            <Fragment key={brand.uuid || index}>
              <LazyBrandCard
                // key={brand.uuid || index}
                brand={brand}
                handleLikeClick={handleLikeClick}
                likeProcessing={likeProcessing}
                enableComparison={enableComparison}
                isSelectedForComparison={selectedForComparison.some(
                  (b) => b.uuid === brand.uuid,
                )}
                onToggleBrandComparison={toggleBrandComparison}
                maxComparisonReached={
                  selectedForComparison.length >= 3 &&
                  !selectedForComparison.some((b) => b.uuid === brand.uuid)
                }
                onShowLogin={setShowLogin}
              />
              {/* {index === 7 && (
              <Box   sx={{
            gridColumn: "1 / -1", // ⬅ spans full grid width
            my: 1,
          }}> <AdSlot {...ADS.HOME.TOP_LEADERBOARD}/>
          </Box>
            )} */}
              {/* {index === 7 && (
          //     <Box   sx={{
          //   gridColumn: "1 / -1", // ⬅ spans full grid width
          //   my: 1,
          // }}> 
          <AdSlot {...ADS.HOME.TOP_LEADERBOARD}/>
          // </Box>
            )} */}
            </Fragment>
          ))}
        </Box>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Box
            display="flex"
            justifyContent="center"
            mt={4}
            mb={2}
            bgcolor="white"
            p={2}
            borderRadius={2}
          >
            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              onChange={handlePageChange}
              color="primary"
              size={isMobile ? "small" : "medium"}
              siblingCount={isMobile ? 0 : 1}
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#ff9800",
                  borderColor: "#ff9800",
                },
                "& .MuiPaginationItem-root.Mui-selected": {
                  backgroundColor: "#ff9800",
                  color: "white",
                  "&:hover": { backgroundColor: "#fb8c00" },
                },
              }}
            />
          </Box>
        )}
        <AdSlot key={pathname} {...ADS.HOME.TOP_BILLBOARD} />
      </>
    );
  }, [
    loading,
    error,
    brands,
    gridStyles,
    handleLikeClick,
    likeProcessing,
    enableComparison,
    selectedForComparison,
    toggleBrandComparison,
    pagination,
    handlePageChange,
    handleClearFilters,
    isMobile,
  ]);

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <Container maxWidth="xl" sx={containerStyles}>
      {/* Comparison Button */}
      <Box sx={{ position: "fixed", top: "30%", right: 12, zIndex: 1000 }}>
        <Badge badgeContent={selectedForComparison.length} color="primary">
          <Tooltip
            title="Click to compare selected brands"
            placement="left"
            arrow
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<Compare />}
              onClick={handleCompareClick}
              sx={{
                transform: "rotate(-90deg)",
                transformOrigin: "right center",
                borderRadius: 2,
                boxShadow: 3,
                bgcolor: "#ff9800",
                "&:hover": { bgcolor: "#fb8c00", boxShadow: 6 },
              }}
            >
              Compare
            </Button>
          </Tooltip>
        </Badge>
      </Box>

      <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
        {/* Desktop Filters */}
        {!isMobile && (
          <Box
            ref={filtersRef}
            sx={{
              width: 280,
              flexShrink: 0,
              position: "sticky",
              top: 16,
              alignSelf: "flex-start",
              maxHeight: "calc(100vh - 32px)",
              overflowY: "auto",
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#ff9800",
                borderRadius: "3px",
              },
            }}
          >
            <Suspense fallback={<FilterPanelSkeleton />}>
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                activeFilterCount={activeFilterCount}
                mainCategories={mainCategories}
                subCategories={subCategories}
                childCategories={childCategories}
                franchiseModels={franchiseModels}
                investmentRanges={investmentRanges}
                states={states}
                districts={districts}
                cities={cities}
                loadingSubCategories={loadingSubCategories}
                loadingChildCategories={loadingChildCategories}
                loadingDistricts={loadingDistricts}
                loadingCities={loadingCities}
                resultStats={{
                  showing: brands.length,
                  total: pagination.total,
                }}
                isLoading={loading || dropdownLoading}
              />
            </Suspense>
          </Box>
        )}

        {/* Mobile Filters Button */}
        {isMobile && (
          <Box sx={{ mb: 2, mt: 8 }}>
            <Button
              variant="outlined"
              startIcon={<FilterAlt sx={{ color: "#ff9800" }} />}
              endIcon={
                <Badge badgeContent={activeFilterCount} color="primary" />
              }
              onClick={toggleMobileFilters}
              fullWidth
              sx={{
                py: 1.5,
                borderColor: "#ff9800",
                color: "#ff9800",
                bgcolor: "white",
                "&:hover": { borderColor: "#fb8c00", bgcolor: "white" },
              }}
            >
              Filters
            </Button>
          </Box>
        )}

        {/* Main Content */}
        <Box flexGrow={1} ml={{ md: 3 }}>
          {renderBrandGrid}
        </Box>
      </Box>

      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="left"
        open={mobileFiltersOpen}
        onClose={closeMobileFilters}
        sx={{ "& .MuiDrawer-paper": { width: 300 } }}
      >
        <Box
          sx={{
            p: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" fontWeight="bold">
              Filters
            </Typography>
            <IconButton onClick={closeMobileFilters}>
              <Close />
            </IconButton>
          </Box>
          <Divider />
          <Box sx={{ flexGrow: 1, overflowY: "auto", mt: 2 }}>
            <Suspense fallback={<FilterPanelSkeleton />}>
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                activeFilterCount={activeFilterCount}
                mainCategories={mainCategories}
                subCategories={subCategories}
                childCategories={childCategories}
                franchiseModels={franchiseModels}
                investmentRanges={investmentRanges}
                states={states}
                districts={districts}
                cities={cities}
                loadingSubCategories={loadingSubCategories}
                loadingChildCategories={loadingChildCategories}
                loadingDistricts={loadingDistricts}
                loadingCities={loadingCities}
                resultStats={{
                  showing: brands.length,
                  total: pagination.total,
                }}
                isLoading={loading || dropdownLoading}
              />
            </Suspense>
          </Box>
          <Button
            variant="contained"
            fullWidth
            onClick={closeMobileFilters}
            sx={{
              mt: 2,
              bgcolor: "#ff9800",
              "&:hover": { bgcolor: "#fb8c00" },
            }}
          >
            Apply Filters
          </Button>
        </Box>
      </Drawer>

      {/* Brand Comparison Modal */}
      {comparisonOpen && (
        <Suspense fallback={null}>
          <BrandComparison
            open={comparisonOpen}
            onClose={handleCloseComparison}
            selectedBrands={selectedForComparison}
            onRemoveFromComparison={handleRemoveFromComparison}
          />
        </Suspense>
      )}

      {/* Login Modal */}
      {showLogin && (
        <Suspense fallback={null}>
          <LoginPage open={showLogin} onClose={closeLogin} />
        </Suspense>
      )}
    </Container>
  );
}

export default React.memo(BrandList);