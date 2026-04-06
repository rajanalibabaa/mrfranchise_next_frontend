"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  Suspense,
  useRef,
  Fragment,
} from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Badge from "@mui/material/Badge";
import Fade from "@mui/material/Fade";
import Skeleton from "@mui/material/Skeleton";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Pagination from "@mui/material/Pagination";

import Close from "@mui/icons-material/Close";
import FilterAlt from "@mui/icons-material/FilterAlt";
import Compare from "@mui/icons-material/Compare";

import dynamic from "next/dynamic";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  setFilter,
  resetFilters,
  fetchFilteredBrands,
  setPage,
} from "@/Redux/Slices/FilterBrandSlice";
import { fetchFilterOptions } from "@/Redux/Slices/filterDropdownData";
import { getLocalStorageData } from "@/Utils/localStorage";
import { useSearchParams } from "next/navigation";
import BrandTags from "./brandTags";

// ============================================
// FILTER KEYS (Only actual filters)
// ============================================
const ACTUAL_FILTER_KEYS = [
  "maincat",
  "subcat",
  "childcat",
  "state",
  "district",
  "city",
  "investmentRange",
  "franchiseModel",
  "searchTerm",
  "areaRequired",
];

// ============================================
// SKELETON COMPONENTS
// ============================================
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
      animation="wave"
    />
    <Skeleton variant="text" width="70%" height={28} animation="wave" />
    <Skeleton variant="text" width="50%" height={20} animation="wave" />
    <Skeleton variant="text" width="40%" height={20} animation="wave" />
    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
      <Skeleton variant="rounded" width={60} height={28} animation="wave" />
      <Skeleton variant="rounded" width={80} height={28} animation="wave" />
    </Box>
  </Box>
));
BrandCardSkeleton.displayName = "BrandCardSkeleton";

const FilterPanelSkeleton = React.memo(() => (
  <Box sx={{ p: 2, bgcolor: "rgba(255, 255, 255, 0.59)", borderRadius: 2 }}>
    {[...Array(6)].map((_, i) => (
      <Box key={i} sx={{ mb: 3 }}>
        <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} animation="wave" />
        <Skeleton variant="rounded" height={40} animation="wave" />
      </Box>
    ))}
  </Box>
));
FilterPanelSkeleton.displayName = "FilterPanelSkeleton";

// ============================================
// DYNAMIC IMPORTS WITH ERROR HANDLING
// ============================================
const BrandCard = dynamic(
  () => import("./brandCard").catch((err) => {
    console.error("Failed to load BrandCard:", err);
    return { default: () => <BrandCardSkeleton /> };
  }),
  {
    loading: () => <BrandCardSkeleton />,
    ssr: false,
  }
);

const FilterPanel = dynamic(
  () => import("./FillterPannel").catch((err) => {
    console.error("Failed to load FilterPanel:", err);
    return { default: () => <FilterPanelSkeleton /> };
  }),
  {
    loading: () => <FilterPanelSkeleton />,
    ssr: false,
  }
);

const BrandComparison = dynamic(
  () => import("@/Components/HomePages/brandCompariosn").catch(() => ({ default: () => null })),
  { ssr: false }
);

const LoginPage = dynamic(
  () => import("@/Components/LoginPage/LoginPage").catch(() => ({ default: () => null })),
  { ssr: false }
);

// ============================================
// INTERSECTION OBSERVER HOOK
// ============================================
const useIntersectionObserver = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    observer.observe(currentRef);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
};

// ============================================
// LAZY BRAND CARD WRAPPER
// ============================================
const LazyBrandCard = React.memo(({ brand, ...props }) => {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <Box ref={ref} sx={{ minHeight: 350 }}>
      {isVisible ? (
        <Fade in timeout={200}>
          <Box>
            <BrandCard brand={brand} {...props} />
          </Box>
        </Fade>
      ) : (
        <BrandCardSkeleton />
      )}
    </Box>
  );
});
LazyBrandCard.displayName = "LazyBrandCard";

// ============================================
// MAIN COMPONENT
// ============================================
function BrandList({ maincat }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  // ============================================
  // REFS - Critical for preventing issues
  // ============================================
  const isInitializedRef = useRef(false);
  const lastFetchKeyRef = useRef("");
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  // ============================================
  // LOCAL STATE
  // ============================================
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [likeProcessing, setLikeProcessing] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [enableComparison, setEnableComparison] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [initialFiltersApplied, setInitialFiltersApplied] = useState(false);

  // ============================================
  // REDUX SELECTORS
  // ============================================
  const { brands, loading, error, filters, pagination } = useSelector(
    (state) => state.filterBrands,
    shallowEqual
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

  // ============================================
  // MEMOIZED VALUES
  // ============================================
  const activeFilterCount = useMemo(() => {
    return ACTUAL_FILTER_KEYS.reduce((count, key) => {
      const value = filters[key];
      if (value && (!Array.isArray(value) || value.length > 0)) {
        return count + 1;
      }
      return count;
    }, 0);
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
    []
  );

  const containerStyles = useMemo(
    () => ({
      mt: { xs: -8, sm: -8, md: 0 },
      mb: 0,
      backgroundImage: "url(/bg25.jpeg)",
      backgroundSize: "400px auto",
      backgroundRepeat: "repeat",
      minHeight: "87vh",
      width: "100%",
    }),
    []
  );

  // ============================================
  // SINGLE FETCH FUNCTION
  // ============================================
  const fetchBrands = useCallback(
    (filtersToFetch, forceRefresh = false) => {
      if (!isMountedRef.current) return;

      const fetchKey = JSON.stringify(filtersToFetch);

      // Skip if same filters already fetched
      if (!forceRefresh && lastFetchKeyRef.current === fetchKey) {
        console.log("Skipping duplicate fetch");
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      lastFetchKeyRef.current = fetchKey;

      console.log("Fetching brands with filters:", filtersToFetch);
      dispatch(fetchFilteredBrands(filtersToFetch));

      if (isFirstLoad) {
        setIsFirstLoad(false);
      }
    },
    [dispatch, isFirstLoad]
  );

  // ============================================
  // INITIALIZATION - Read URL params and apply filters
  // ============================================
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;
    isMountedRef.current = true;

    console.log("Initializing BrandList...");

    // Get filters from multiple sources
    const urlMaincat = searchParams?.get("maincat");
    const urlState = searchParams?.get("state");
    const urlInvestmentRange = searchParams?.get("investmentRange");
    const propMaincat = maincat;
    const stored = getLocalStorageData();

    // Build initial filters
    const initialFilters = {};

    // Priority: URL params > Props > localStorage
    if (urlMaincat) {
      initialFilters.maincat = urlMaincat;
    } else if (propMaincat) {
      initialFilters.maincat = propMaincat;
    }

    if (urlState) {
      initialFilters.state = urlState;
    }

    if (urlInvestmentRange) {
      initialFilters.investmentRange = urlInvestmentRange;
    }

    if (stored?.searchTerm) {
      initialFilters.searchTerm = stored.searchTerm;
      localStorage.removeItem("franchiseFilters");
    }

    // Check comparison mode
    if (stored?.enableComparison === "true") {
      setEnableComparison(true);
      localStorage.removeItem("enableComparison");
    }

    console.log("Initial filters:", initialFilters);

    // Apply filters to Redux
    Object.entries(initialFilters).forEach(([key, value]) => {
      if (value) {
        dispatch(setFilter({ filterName: key, value }));
      }
    });

    // Fetch dropdown options
    if (initialFilters.maincat) {
      dispatch(fetchFilterOptions({ main: initialFilters.maincat }));
    } else {
      dispatch(fetchFilterOptions());
    }

    // Fetch brands with initial filters
    // Small delay to ensure Redux state is updated
    setTimeout(() => {
      if (isMountedRef.current) {
        fetchBrands(initialFilters, true);
        setInitialFiltersApplied(true);
      }
    }, 50);

    // Preload background
    const img = new Image();
    img.src = "/bg25.jpeg";

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []); // Empty deps - runs once

  // ============================================
  // FILTER CHANGE EFFECT (After initialization)
  // ============================================
  useEffect(() => {
    // Skip if not initialized or initial filters not applied
    if (!initialFiltersApplied) return;

    // Skip the initial render
    const filterKey = JSON.stringify(filters);
    if (lastFetchKeyRef.current === filterKey) return;

    // Debounce filter changes
    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        fetchBrands(filters);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [filters, initialFiltersApplied, fetchBrands]);

  // ============================================
  // CALLBACKS
  // ============================================
  const handleFilterChange = useCallback(
    (name, value) => {
      console.log("Filter changed:", name, value);
      
      dispatch(setFilter({ filterName: name, value }));

      // Fetch dependent data
      const dependentFetches = {
        maincat: { main: value },
        subcat: { sub: value },
        state: { state: value },
        district: { district: value },
      };

      if (dependentFetches[name] && value) {
        dispatch(fetchFilterOptions(dependentFetches[name]));
      }
    },
    [dispatch]
  );

  const handleMobileFilterChange = useCallback(
    (name, value) => {
      handleFilterChange(name, value);
    },
    [handleFilterChange]
  );

  const handleApplyMobileFilters = useCallback(() => {
    setMobileFiltersOpen(false);
  }, []);

  const handleClearFilters = useCallback(() => {
    lastFetchKeyRef.current = ""; // Force refresh
    dispatch(resetFilters());
    dispatch(fetchFilterOptions()); // Reset to initial options
  }, [dispatch]);

  const handlePageChange = useCallback(
    (_, page) => {
      lastFetchKeyRef.current = ""; // Force refresh
      dispatch(setPage(page));
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [dispatch]
  );

  const handleLikeClick = useCallback(
    async (brandId) => {
      if (likeProcessing[brandId]) return;

      if (!isAuthenticated) {
        setShowLogin(true);
        return;
      }

      setLikeProcessing((prev) => ({ ...prev, [brandId]: true }));

      try {
        // Handle like logic here
        await new Promise((resolve) => setTimeout(resolve, 500));
        fetchBrands(filters, true);
      } catch (error) {
        console.error("Like failed:", error);
      } finally {
        setLikeProcessing((prev) => ({ ...prev, [brandId]: false }));
      }
    },
    [likeProcessing, isAuthenticated, filters, fetchBrands]
  );

  const toggleBrandComparison = useCallback((brand) => {
    setSelectedForComparison((prev) => {
      const isSelected = prev.some((b) => b.uuid === brand.uuid);

      if (isSelected) {
        return prev.filter((b) => b.uuid !== brand.uuid);
      }

      if (prev.length >= 3) return prev;

      const updated = [...prev, brand];
      if (updated.length === 3) setComparisonOpen(true);

      return updated;
    });
  }, []);

  const handleCompareClick = useCallback(() => {
    if (!enableComparison) setEnableComparison(true);
    if (selectedForComparison.length > 0) setComparisonOpen(true);
  }, [enableComparison, selectedForComparison.length]);

  const handleCloseComparison = useCallback(() => {
    setComparisonOpen(false);
    setSelectedForComparison([]);
    setEnableComparison(false);
  }, []);

  // ============================================
  // RENDER CONTENT
  // ============================================
  const renderContent = () => {
    // First load - show skeleton grid
    if (isFirstLoad || (loading && brands.length === 0)) {
      return (
        <Box sx={gridStyles}>
          {[...Array(isMobile ? 4 : 8)].map((_, i) => (
            <BrandCardSkeleton key={i} />
          ))}
        </Box>
      );
    }

    // Loading with existing data - show overlay
    if (loading && brands.length > 0) {
      return (
        <Box sx={{ position: "relative" }}>
          <Box sx={{ ...gridStyles, opacity: 0.5 }}>
            {brands.slice(0, isMobile ? 4 : 8).map((brand, i) => (
              <BrandCardSkeleton key={brand.uuid || i} />
            ))}
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: "30%",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
            }}
          >
            <CircularProgress size={50} sx={{ color: "#ff9800" }} />
          </Box>
        </Box>
      );
    }

    // Error state
    if (error) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="40vh"
          gap={2}
        >
          <Typography color="error" variant="h6" textAlign="center">
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => fetchBrands(filters, true)}
            sx={{ bgcolor: "#ff9800", "&:hover": { bgcolor: "#fb8c00" } }}
          >
            Retry
          </Button>
        </Box>
      );
    }

    // No results
    if (!brands || brands.length === 0) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="40vh"
          gap={2}
          p={2}
        >
          <Typography variant="h6" color="text.secondary" textAlign="center">
            No brands found matching your criteria
          </Typography>
          {activeFilterCount > 0 && (
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              sx={{ borderColor: "#ff9800", color: "#ff9800" }}
            >
              Clear All Filters
            </Button>
          )}
        </Box>
      );
    }

    // Brand grid
    return (
      <>
        <Box sx={gridStyles}>
          {brands.map((brand, index) => (
            <Fragment key={brand.uuid || index}>
              <LazyBrandCard
                brand={brand}
                handleLikeClick={handleLikeClick}
                likeProcessing={likeProcessing}
                enableComparison={enableComparison}
                isSelectedForComparison={selectedForComparison.some(
                  (b) => b.uuid === brand.uuid
                )}
                onToggleBrandComparison={toggleBrandComparison}
                maxComparisonReached={
                  selectedForComparison.length >= 3 &&
                  !selectedForComparison.some((b) => b.uuid === brand.uuid)
                }
                onShowLogin={setShowLogin}
              />
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
                },
              }}
            />
          </Box>
        )}
      </>
    );
  };

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <Container maxWidth="xl" sx={containerStyles}>
      {/* Compare Button */}
      <Box sx={{ position: "fixed", top: "30%", right: 12, zIndex: 1000 }}>
        <Badge badgeContent={selectedForComparison.length} color="primary">
          <Tooltip title="Compare brands" placement="left" arrow>
            <Button
              variant="contained"
              startIcon={<Compare />}
              onClick={handleCompareClick}
              sx={{
                transform: "rotate(-90deg)",
                transformOrigin: "right center",
                borderRadius: 2,
                boxShadow: 3,
                bgcolor: "#ff9800",
                "&:hover": { bgcolor: "#fb8c00" },
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
            sx={{
              width: 280,
              flexShrink: 0,
              position: "sticky",
              top: 16,
              alignSelf: "flex-start",
              maxHeight: "calc(100vh - 32px)",
              overflowY: "auto",
              "&::-webkit-scrollbar": { width: "6px" },
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

        {/* Mobile Filter Button */}
        {isMobile && (
          <Box sx={{ mb: 2, mt: 1 }}>
            <Button
              variant="outlined"
              startIcon={<FilterAlt sx={{ color: "#ff9800" }} />}
              onClick={() => setMobileFiltersOpen(true)}
              fullWidth
              sx={{
                py: 1.5,
                borderColor: "#ff9800",
                color: "#ff9800",
                bgcolor: "white",
                justifyContent: "space-evenly",
                "&:hover": { borderColor: "#fb8c00" },
              }}
            >
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <Badge
                  badgeContent={activeFilterCount}
                  color="warning"
                  sx={{
                    "& .MuiBadge-badge": {
                      bgcolor: "#ff9800",
                      color: "white",
                    },
                  }}
                />
              )}
            </Button>
          </Box>
        )}

        {/* Main Content */}
        <Box flexGrow={1} ml={{ md: 3 }}>
          <BrandTags
            filters={filters}
            loadingSubCategories={loadingSubCategories}
            loadingChildCategories={loadingChildCategories}
            onFilterChange={handleFilterChange}
            mainCategories={mainCategories}
            subCategories={subCategories}
            resultStats={{
              showing: brands.length,
              total: pagination.total,
            }}
            isLoading={loading || dropdownLoading}
          />
          {renderContent()}
        </Box>
      </Box>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="left"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        sx={{
  "& .MuiDrawer-paper": {
    width: "85vw", // Mobile first
    maxWidth: "300px", // Won't go over 300px
  },
}}

      >
        <Box sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold">
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Typography>
            <IconButton onClick={() => setMobileFiltersOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <Divider />
          <Box sx={{ flexGrow: 1, overflowY: "auto", mt: 2 }}>
            <Suspense fallback={<FilterPanelSkeleton />}>
              <FilterPanel
                filters={filters}
                onFilterChange={handleMobileFilterChange}
                onClearFilters={() => {
                  handleClearFilters();
                  setMobileFiltersOpen(false);
                }}
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
            onClick={handleApplyMobileFilters}
            sx={{ mt: 2, bgcolor: "#ff9800", "&:hover": { bgcolor: "#fb8c00" } }}
          >
            Apply Filters
          </Button>
        </Box>
      </Drawer>

      {/* Modals */}
      {comparisonOpen && (
        <Suspense fallback={null}>
          <BrandComparison
            open={comparisonOpen}
            onClose={handleCloseComparison}
            selectedBrands={selectedForComparison}
            onRemoveFromComparison={(uuid) =>
              setSelectedForComparison((prev) => prev.filter((b) => b.uuid !== uuid))
            }
          />
        </Suspense>
      )}

      {showLogin && (
        <Suspense fallback={null}>
          <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
        </Suspense>
      )}
    </Container>
  );
}

export default React.memo(BrandList);