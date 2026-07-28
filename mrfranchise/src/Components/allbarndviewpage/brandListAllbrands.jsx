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
import Pagination from "@mui/material/Pagination";

import Close from "@mui/icons-material/Close";

import dynamic from "next/dynamic";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  setFilter,
  resetFilters,
  fetchFilteredBrands,
  setPage,
  buildBrandFetchKey,
} from "@/Redux/Slices/FilterBrandSlice";
import { fetchFilterOptions } from "@/Redux/Slices/filterDropdownData";
import { getLocalStorageData } from "@/Utils/localStorage";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import BrandTags from "./brandTags";
import Navbar from "../Navbar/NavBar";
import CompareFloatingButton from "./compareFloatingButton";

// ============================================
// FILTER KEYS
// ============================================
const ACTUAL_FILTER_KEYS = [
  "maincat",
  "subcat",
  "childcat",
  "state",
  "district",
  "city",
  "investmentRange",
  "modelType",
  "searchTerm",
  "areaRequired",
];

// ============================================
// SLUG HELPERS
// ============================================
function slugifyForUrl(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .trim();
}

function deslugifyMain(slug) {
  if (!slug) return "";
  return slug
    .replace(/-franchise-opportunities$/, "")
    .replace(/-/g, " ")
    .replace(/\band\b/g, "&")
    .replace(/\b\w/g, (c) => c.toLowerCase())
    .trim();
}

function deslugifySub(slug) {
  if (!slug) return "";
  return slug
    .replace(/-franchise-opportunities$/, "")
    .replace(/-franchise$/, "")
    .replace(/-/g, " ")
    .replace(/\band\b/g, "&")
    .replace(/\b\w/g, (c) => c.toLowerCase())
    .trim();
}

function buildSubCategoryUrl(maincat, subcat) {
  if (!maincat || !subcat) return null;
  const mainSlug = slugifyForUrl(maincat);
  const subSlug = slugifyForUrl(subcat);
  return `/${mainSlug}/${subSlug}`;
}

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
        <Skeleton
          variant="text"
          width="60%"
          height={24}
          sx={{ mb: 1 }}
          animation="wave"
        />
        <Skeleton variant="rounded" height={40} animation="wave" />
      </Box>
    ))}
  </Box>
));
FilterPanelSkeleton.displayName = "FilterPanelSkeleton";

// ============================================
// DYNAMIC IMPORTS
// ============================================
const BrandCard = dynamic(
  () =>
    import("./brandCard").catch((err) => {
      console.error("Failed to load BrandCard:", err);
      return { default: () => <BrandCardSkeleton /> };
    }),
  { loading: () => <BrandCardSkeleton />, ssr: false },
);

const FilterPanel = dynamic(
  () =>
    import("./FillterPannel").catch((err) => {
      console.error("Failed to load FilterPanel:", err);
      return { default: () => <FilterPanelSkeleton /> };
    }),
  { loading: () => <FilterPanelSkeleton />, ssr: false },
);

const BrandComparison = dynamic(
  () =>
    import("@/Components/HomePages/brandCompariosn").catch(() => ({
      default: () => null,
    })),
  { ssr: false },
);

const LoginPage = dynamic(
  () =>
    import("@/Components/LoginPage/LoginPage").catch(() => ({
      default: () => null,
    })),
  { ssr: false },
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
      { threshold: 0.1, rootMargin: "200px" },
    );
    observer.observe(currentRef);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
};

// ============================================
// LAZY BRAND CARD
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
function BrandList({ maincat, subcat, slug, subslug }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const resolvedMaincat = maincat || (slug ? deslugifyMain(slug) : "");
  const resolvedSubcat = subcat || (subslug ? deslugifySub(subslug) : "");

  // ============================================
  // REFS
  // ============================================
  const isInitializedRef = useRef(false);
  const lastFetchKeyRef = useRef("");
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);
  const isFirstLoadRef = useRef(true);
  const resolvedMaincatRef = useRef(resolvedMaincat);
  const resolvedSubcatRef = useRef(resolvedSubcat);
  resolvedMaincatRef.current = resolvedMaincat;
  resolvedSubcatRef.current = resolvedSubcat;
  const filtersRef = useRef(null);

  // 🔥 Ref for the filter button (normal position)
  const filterButtonRef = useRef(null);

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
  // 🔥 Track if filter button has scrolled out of view
  const [isFilterSticky, setIsFilterSticky] = useState(false);

  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ============================================
  // REDUX SELECTORS
  // ============================================
  const { brands, loading, error, filters, pagination } = useSelector(
    (state) => state.filterBrands,
    shallowEqual,
  );
console.log("filter applying fitler",filters);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const {
    mainCategories,
    subCategories,
    childCategories,
    investmentRanges,
    franchiseModels,
    areaRequired,
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
  // 🔥 SCROLL LISTENER — Make filter sticky after scroll
  // ============================================
  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      if (!filterButtonRef.current) return;
      const rect = filterButtonRef.current.getBoundingClientRect();
      // When original button scrolls above viewport top → show sticky
      setIsFilterSticky(rect.top < 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  // ============================================
  // ACTIVE FILTER COUNT
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
    [],
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
    [],
  );

  
  const fetchBrands = useCallback(
    (filtersToFetch, forceRefresh = false) => {
      if (!isMountedRef.current) return;
      const fetchKey = buildBrandFetchKey(filtersToFetch);
      if (!forceRefresh && lastFetchKeyRef.current === fetchKey) return;
      
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();
      lastFetchKeyRef.current = fetchKey;
      dispatch(fetchFilteredBrands(filtersToFetch));
      if (isFirstLoadRef.current) {
        isFirstLoadRef.current = false;
        setIsFirstLoad(false);
      }
    },
    [dispatch],
  );

 // ============================================
// INITIALIZATION — FIXED
// ============================================
useEffect(() => {
  if (isInitializedRef.current) return;
  isInitializedRef.current = true;

  const urlParams = {
    maincat: searchParams?.get("maincat"),
    subcat: searchParams?.get("subcat"),
    state: searchParams?.get("state"),
    investmentRange: searchParams?.get("investmentRange"),
    areaRequired: searchParams?.get("areaRequired"),
    modelType: searchParams?.get("franchiseModel"),
    franchiseType: searchParams?.get("franchiseType"),
  };

  const stored = getLocalStorageData();
  const initialFilters = {};

  // Prioritize URL params
  if (urlParams.maincat) initialFilters.maincat = urlParams.maincat;
  else if (resolvedMaincat) initialFilters.maincat = resolvedMaincat;

  if (urlParams.subcat) initialFilters.subcat = urlParams.subcat;
  else if (resolvedSubcat) initialFilters.subcat = resolvedSubcat;

  if (urlParams.state) initialFilters.state = urlParams.state;
  if (urlParams.investmentRange) initialFilters.investmentRange = urlParams.investmentRange;
  if (urlParams.areaRequired) initialFilters.areaRequired = urlParams.areaRequired;
  if (urlParams.modelType) initialFilters.modelType = urlParams.modelType;
  if (urlParams.franchiseType) initialFilters.franchiseType = urlParams.franchiseType;

  if (stored?.searchTerm) {
    initialFilters.searchTerm = stored.searchTerm;
    localStorage.removeItem("franchiseFilters");
  }

  // Apply filters
  Object.entries(initialFilters).forEach(([key, value]) => {
    if (value) dispatch(setFilter({ filterName: key, value }));
  });

  // Fetch dropdown data
  if (initialFilters.maincat) {
    dispatch(fetchFilterOptions({ main: initialFilters.maincat }));
  } else {
    dispatch(fetchFilterOptions());
  }

  fetchBrands(initialFilters, true);
  setInitialFiltersApplied(true);

  return () => {
    isMountedRef.current = false;
    if (abortControllerRef.current) abortControllerRef.current.abort();
  };
}, [searchParams, resolvedMaincat, resolvedSubcat, dispatch, fetchBrands]); // Added proper deps
  // ============================================
  // FILTER CHANGE EFFECT
  // ============================================
  useEffect(() => {
    if (!initialFiltersApplied) return;

    const filterKey = buildBrandFetchKey(filters);

    if (lastFetchKeyRef.current === filterKey) return;

    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        fetchBrands(filters);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [
    filters.maincat,
    filters.subcat,
    filters.childcat,
    filters.modelType,
    filters.franchiseType,
    filters.investmentRange,
    filters.areaRequired,
    filters.state,
    filters.district,
    filters.city,
    filters.searchTerm,
    filters.page,
    initialFiltersApplied,
    fetchBrands,
  ]);

  // ============================================
  // HANDLE FILTER CHANGE
  // ============================================
 // ============================================
// HANDLE FILTER CHANGE — FIXED VERSION
// ============================================
const handleFilterChange = useCallback((name, value) => {
  const normalizedValue = typeof value === "string" ? value.trim() : value;

  // Update Redux immediately
  dispatch(setFilter({ filterName: name, value: normalizedValue }));

  // Handle navigation for category changes (use replace to avoid extra history)
  if (name === "maincat" && normalizedValue) {
    const mainSlug = slugifyForUrl(normalizedValue);
    const newUrl = `/${mainSlug}`;
    if (newUrl !== pathname) {
      router.replace(newUrl, { scroll: false });
      return;
    }
  }

  if (name === "subcat" && normalizedValue) {
    const currentMaincat = filters.maincat || resolvedMaincatRef.current;
    const newUrl = buildSubCategoryUrl(currentMaincat, normalizedValue);
    if (newUrl && newUrl !== pathname) {
      router.replace(newUrl, { scroll: false });
      return;
    }
  }

  // Trigger dropdown data fetch
  if (name === "maincat") {
    if (normalizedValue) {
      dispatch(fetchFilterOptions({ main: normalizedValue }));
    } else {
      dispatch(fetchFilterOptions());
    }
  } else if (name === "subcat") {
    if (normalizedValue && filters.maincat) {
      dispatch(fetchFilterOptions({ main: filters.maincat, sub: normalizedValue }));
    }
  } else if (name === "state") {
    if (normalizedValue) dispatch(fetchFilterOptions({ state: normalizedValue }));
    else dispatch(fetchFilterOptions());
  } else if (name === "district") {
    if (normalizedValue && filters.state) {
      dispatch(fetchFilterOptions({ district: normalizedValue, state: filters.state }));
    }
  }
}, [dispatch, pathname, router, filters.maincat]);   // ← Important: depend on current filters.maincat

  const handleMobileFilterChange = useCallback(
    (name, value) => handleFilterChange(name, value),
    [handleFilterChange],
  );

  const handleApplyMobileFilters = useCallback(() => {
    setMobileFiltersOpen(false);
  }, []);

  const handleClearFilters = useCallback(() => {
    lastFetchKeyRef.current = "";
    dispatch(resetFilters());
    dispatch(fetchFilterOptions());
    router.replace("/all-franchise-brands", { scroll: false });
    fetchBrands({}, true);
  }, [dispatch, router, fetchBrands]);

  // const handlePageChange = useCallback(
  //   (_, page) => {
  //     lastFetchKeyRef.current = "";
  //     dispatch(setPage(page));
  //     window.scrollTo({ top: 0, behavior: "smooth" });
  //   },
  //   [dispatch],
  // );

  const handlePageChange = useCallback(
  (_, page) => {
    lastFetchKeyRef.current = "";

    // Update Redux
    dispatch(setPage(page));

    // Fetch immediately with the new page
    fetchBrands(
      {
        ...filters,
        page,
      },
      true
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  },
  [dispatch, filters, fetchBrands]
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
        await new Promise((resolve) => setTimeout(resolve, 500));
        fetchBrands(filters, true);
      } catch (error) {
        console.error("Like failed:", error);
      } finally {
        setLikeProcessing((prev) => ({ ...prev, [brandId]: false }));
      }
    },
    [likeProcessing, isAuthenticated, filters, fetchBrands],
  );

  const toggleBrandComparison = useCallback((brand) => {
    setSelectedForComparison((prev) => {
      const isSelected = prev.some((b) => b.uuid === brand.uuid);
      if (isSelected) return prev.filter((b) => b.uuid !== brand.uuid);
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
  // 🔥 FILTER BUTTON UI (reusable for both normal + sticky)
  // ============================================
  const FilterButtonContent = ({ showShadow = false }) => (
    <Button
      variant="outlined"
      // startIcon={<FilterAlt sx={{ color: "#ff9800" }} />}
      onClick={() => setMobileFiltersOpen(true)}
      fullWidth
      sx={{
        py: 1,
        borderColor: "#ff9800",
        color: "#ff9800",
        bgcolor: "white",
        justifyContent: "center",
        boxShadow: showShadow ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
        "&:hover": { borderColor: "#fb8c00", bgcolor: "#fff8f0" },
      }}
    >
      <span>Filters</span>
      {activeFilterCount > 0 && (
        <Badge
          badgeContent={activeFilterCount}
          color="warning"
          sx={{
            ml: 1,
            "& .MuiBadge-badge": {
              bgcolor: "#ff9800",
              color: "white",
            },
          }}
        />
      )}
    </Button>
  );

  // ============================================
  // RENDER CONTENT
  // ============================================
  const renderContent = () => {
    if (isFirstLoad || (loading && brands.length === 0)) {
      return (
        <Box sx={gridStyles}>
          {[...Array(isMobile ? 4 : 8)].map((_, i) => (
            <BrandCardSkeleton key={i} />
          ))}
        </Box>
      );
    }

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
                  (b) => b.uuid === brand.uuid,
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
      {/* ── Compare Button (fixed right, all screens) ── */}
      <CompareFloatingButton
        selectedForComparison={selectedForComparison}
        handleCompareClick={handleCompareClick}
      />
      {/* ── 🔥 STICKY FILTER BAR (mobile only, appears on scroll) ── */}
      {isMobile && isFilterSticky && (
        <Fade in={isFilterSticky} timeout={250}>
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1100,
              px: 2,
              py: 2.8,
              bgcolor: "white",
              boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
            }}
          >
            <FilterButtonContent showShadow={false} />
          </Box>
        </Fade>
      )}

      <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
        {/* ── Desktop Filter Panel ── */}
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
                areaRequired={areaRequired}
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

        {/* ── 🔥 MOBILE: Normal Filter Button (in flow) ── */}
        {isMobile && (
          <Box ref={filterButtonRef} sx={{ mb: 2, mt: 1 }}>
            <FilterButtonContent />
          </Box>
        )}

        {/* ── Main Content ── */}
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
          {/* 🔥 Cards — vertical scroll (normal flow) */}
          {renderContent()}
        </Box>
      </Box>

      {/* ── Mobile Filter Drawer ── */}
      <Drawer
        anchor="left"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "75vw",
            maxWidth: "300px",
          },
        }}
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
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={() => setMobileFiltersOpen(false)}
            >
              <Close color="error" />
            </IconButton>
          </Box>
          <Divider />
          <Box sx={{ flexGrow: 1, overflowY: "auto", mt: 0 }}>
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
                areaRequired={areaRequired}
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
            sx={{
              bgcolor: "#ff9800",
              "&:hover": { bgcolor: "#fb8c00" },
            }}
          >
            Apply Filters
          </Button>
        </Box>
      </Drawer>

      {/* ── Modals ── */}
      {comparisonOpen && (
        <Suspense fallback={<div>Loading...</div>}>
          <BrandComparison
            open={comparisonOpen}
            onClose={handleCloseComparison}
            selectedBrands={selectedForComparison}
            onRemoveFromComparison={(uuid) =>
              setSelectedForComparison((prev) =>
                prev.filter((b) => b.uuid !== uuid),
              )
            }
          />
        </Suspense>
      )}

      {showLogin && (
        <Suspense fallback={<div>Loading...</div>}>
          <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
        </Suspense>
      )}
    </Container>
  );
}

export default React.memo(BrandList);
