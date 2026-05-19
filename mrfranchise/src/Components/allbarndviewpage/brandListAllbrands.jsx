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
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import BrandTags from "./brandTags";

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
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function deslugifySub(slug) {
  if (!slug) return "";
  return slug
    .replace(/-franchise-opportunities$/, "")
    .replace(/-franchise$/, "")
    .replace(/-/g, " ")
    .replace(/\band\b/g, "&")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

// ============================================
// 🔥 BUILD CLEAN SLUG URL for sub category
// /food-and-beverages-franchise-opportunities/bakery-franchise-opportunities
// ============================================
function buildSubCategoryUrl(maincat, subcat) {
  if (!maincat || !subcat) return null;

  const mainSlug =
    slugifyForUrl(maincat) + "-franchise-opportunities";

  const subSlug =
    slugifyForUrl(subcat) + "-franchise-opportunities";

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
  { loading: () => <BrandCardSkeleton />, ssr: false }
);

const FilterPanel = dynamic(
  () =>
    import("./FillterPannel").catch((err) => {
      console.error("Failed to load FilterPanel:", err);
      return { default: () => <FilterPanelSkeleton /> };
    }),
  { loading: () => <FilterPanelSkeleton />, ssr: false }
);

const BrandComparison = dynamic(
  () =>
    import("@/Components/HomePages/brandCompariosn").catch(() => ({
      default: () => null,
    })),
  { ssr: false }
);

const LoginPage = dynamic(
  () =>
    import("@/Components/LoginPage/LoginPage").catch(() => ({
      default: () => null,
    })),
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

  // ============================================
  // 🔥 RESOLVE VALUES SYNCHRONOUSLY
  // ============================================
  const resolvedMaincat = maincat || (slug ? deslugifyMain(slug) : "");
  const resolvedSubcat = subcat || (subslug ? deslugifySub(subslug) : "");

  console.log("🔥 RESOLVED MAINCAT:", resolvedMaincat);
  console.log("🔥 RESOLVED SUBCAT:", resolvedSubcat);

  // ============================================
  // REFS
  // ============================================
  const isInitializedRef = useRef(false);
  const lastFetchKeyRef = useRef("");
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  // 🔥 Always-fresh refs
  const resolvedMaincatRef = useRef(resolvedMaincat);
  const resolvedSubcatRef = useRef(resolvedSubcat);
  resolvedMaincatRef.current = resolvedMaincat;
  resolvedSubcatRef.current = resolvedSubcat;

  const filtersRef = useRef(null);

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
  // FETCH FUNCTION
  // ============================================
  const fetchBrands = useCallback(
    (filtersToFetch, forceRefresh = false) => {
      if (!isMountedRef.current) return;

      const fetchKey = JSON.stringify(filtersToFetch);

      if (!forceRefresh && lastFetchKeyRef.current === fetchKey) {
        // console.log("⏭️ Skipping duplicate fetch");
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      lastFetchKeyRef.current = fetchKey;

      // console.log("🚀 Fetching brands with filters:", filtersToFetch);
      dispatch(fetchFilteredBrands(filtersToFetch));

      if (isFirstLoad) setIsFirstLoad(false);
    },
    [dispatch, isFirstLoad]
  );

  // ============================================
  // 🔥 INITIALIZATION
  // ============================================
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;
    isMountedRef.current = true;

    const urlMaincat = searchParams?.get("maincat");
    const urlSubcat = searchParams?.get("subcat");
    const urlState = searchParams?.get("state");
    const urlInvestmentRange = searchParams?.get("investmentRange");
    const urlAreaRequired = searchParams?.get("areaRequired");

    const stored = getLocalStorageData();

    const currentMaincat = resolvedMaincatRef.current;
    const currentSubcat = resolvedSubcatRef.current;

    console.log("🔥 INIT currentMaincat:", currentMaincat);
    console.log("🔥 INIT currentSubcat:", resolvedSubcatRef.current);

    const initialFilters = {};

    const resolvedMainParam = urlMaincat || currentMaincat;
    const resolvedSubParam = urlSubcat || currentSubcat;

    if (resolvedMainParam) {
      initialFilters.maincat = resolvedMainParam;
    }
    if (resolvedSubParam) {
      initialFilters.subcat = resolvedSubParam;
    }

    if (urlState) initialFilters.state = urlState;
    if (urlInvestmentRange) initialFilters.investmentRange = urlInvestmentRange;
    if (urlAreaRequired) initialFilters.areaRequired = urlAreaRequired;

    if (stored?.searchTerm) {
      initialFilters.searchTerm = stored.searchTerm;
      localStorage.removeItem("franchiseFilters");
    }

    if (stored?.enableComparison === "true") {
      setEnableComparison(true);
      localStorage.removeItem("enableComparison");
    }

    // console.log("🔥 FINAL INITIAL FILTERS:", initialFilters);

    Object.entries(initialFilters).forEach(([key, value]) => {
      if (value) dispatch(setFilter({ filterName: key, value }));
    });

    if (initialFilters.subcat && initialFilters.maincat) {
      dispatch(
        fetchFilterOptions({
          main: initialFilters.maincat,
          sub: initialFilters.subcat,
        })
      );
    } else if (initialFilters.maincat) {
      dispatch(fetchFilterOptions({ main: initialFilters.maincat }));
    } else {
      dispatch(fetchFilterOptions());
    }

    if (isMountedRef.current) {
      fetchBrands(initialFilters, true);
      setInitialFiltersApplied(true);
    }

    const img = new Image();
    img.src = "/bg25.jpeg";

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ============================================
  // FILTER CHANGE EFFECT
  // ============================================
  useEffect(() => {
    if (!initialFiltersApplied) return;

    const filterKey = JSON.stringify(filters);
    if (lastFetchKeyRef.current === filterKey) return;

    const timer = setTimeout(() => {
      if (isMountedRef.current) fetchBrands(filters);
    }, 150);

    return () => clearTimeout(timer);
  }, [filters, initialFiltersApplied, fetchBrands]);

  // ============================================
  // 🔥 HANDLE FILTER CHANGE — Navigate to clean URL
  // ============================================
  const handleFilterChange = useCallback(
    (name, value) => {
      // console.log("🔧 Filter changed:", name, "=", value);

      dispatch(setFilter({ filterName: name, value }));

      // ─── Fetch dependent dropdowns ───
      if (name === "maincat") {
        if (value) {
          dispatch(fetchFilterOptions({ main: value }));
        } else {
          dispatch(fetchFilterOptions());
        }
      } else if (name === "subcat") {
        if (value) {
          dispatch(fetchFilterOptions({ sub: value, main: filtersRef.current?.maincat }));
        }
      } else if (name === "state") {
        if (value) {
          dispatch(fetchFilterOptions({ state: value }));
        } else {
          dispatch(fetchFilterOptions());
        }
      } else if (name === "district") {
        if (value) {
          dispatch(fetchFilterOptions({ district: value, state: filtersRef.current?.state }));
        }
      }

      // ─── 🔥 Navigate to clean slug URL when subcat selected ───
      if (name === "subcat" && value) {
        const currentMaincat = filtersRef.current?.maincat || resolvedMaincatRef.current;

        // Build clean slug URL
        const newUrl = buildSubCategoryUrl(currentMaincat, value);

        if (newUrl && newUrl !== pathname) {
          // console.log("🔀 Navigating to:", newUrl);
          router.push(newUrl);
          return; // navigation will handle the rest
        }
      }

      // ─── 🔥 Navigate to main category URL when maincat changes ───
      if (name === "maincat" && value) {
        const mainSlug = slugifyForUrl(value) + "-franchise-opportunities";
        const newUrl = `/${mainSlug}`;

        if (newUrl !== pathname) {
          // console.log("🔀 Navigating to main:", newUrl);
          router.push(newUrl);
          return;
        }
      }
    },
    [dispatch, pathname, router]
  );

  const handleMobileFilterChange = useCallback(
    (name, value) => handleFilterChange(name, value),
    [handleFilterChange]
  );

  const handleApplyMobileFilters = useCallback(() => {
    setMobileFiltersOpen(false);
  }, []);

  const handleClearFilters = useCallback(() => {
    lastFetchKeyRef.current = "";
    dispatch(resetFilters());
    dispatch(fetchFilterOptions());
      router.replace("/all-franchise-brands", { scroll: false });

  // Fetch all brands again
  fetchBrands({}, true);

  }, [dispatch, router, fetchBrands]);

  const handlePageChange = useCallback(
    (_, page) => {
      lastFetchKeyRef.current = "";
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
        {/* Desktop Filter */}
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

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "85vw",
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
              mt: 2,
              bgcolor: "#ff9800",
              "&:hover": { bgcolor: "#fb8c00" },
            }}
          >
            Apply Filters
          </Button>
        </Box>
      </Drawer>

      {/* Modals */}
      {comparisonOpen && (
        <Suspense fallback={<div>Loading...</div>}>
          <BrandComparison
            open={comparisonOpen}
            onClose={handleCloseComparison}
            selectedBrands={selectedForComparison}
            onRemoveFromComparison={(uuid) =>
              setSelectedForComparison((prev) =>
                prev.filter((b) => b.uuid !== uuid)
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