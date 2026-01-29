// "use client";
// import React, {
//   useState,
//   useEffect,
//   useCallback,
//   useMemo,
//   lazy,
//   Suspense,
// } from "react";
// import {
//   Container,
//   Box,
//   Typography,
//   Grid,
//   Button,
//   Divider,
//   CircularProgress,
//   Badge,
//   Drawer,
//   IconButton,
//   useMediaQuery,
//   useTheme,
//   Tooltip,
//   Pagination,
// } from "@mui/material";
// import {
//   Close,
//   FilterAlt,
//   Clear as ClearIcon,
//   Compare,
// } from "@mui/icons-material";
// import { useSearchParams } from "next/navigation";
// import dynamic from "next/dynamic";
// // import LoginPage from "../LoginPage/LoginPage.jsx";
// import { useToggleLike } from "@/Hooks/Fetchbrands.jsx";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   setFilter,
//   resetFilters,
//   fetchFilteredBrands,
//   setPage,
// } from "@/Redux/Slices/FilterBrandSlice.jsx";
// import { fetchFilterOptions } from "@/Redux/Slices/filterDropdownData.jsx";

// // import img1 from '../../assets/Images/bg25.jpeg'
// // Memoized components
// const BrandCardSkeleton = React.memo(() => (
//   <Box sx={{ height: 350, bgcolor: "rgba(0, 0, 0, 0.04)", borderRadius: 2 }} />
// ));

// const FilterPanelSkeleton = React.memo(() => (
//   <Box sx={{ p: 2 }}>
//     {[...Array(6)].map((_, i) => (
//       <Box key={`skeleton-${i}`} sx={{ mb: 2 }}>
//         <Box
//           sx={{
//             height: 20,
//             width: "60%",
//             bgcolor: "rgba(0, 0, 0, 0.04)",
//             mb: 1,
//           }}
//         />
//         <Box
//           sx={{ height: 40, bgcolor: "rgba(0, 0, 0, 0.04)", borderRadius: 1 }}
//         />
//       </Box>
//     ))}
//   </Box>
// ));

// // Lazy load heavy components
// const BrandCard = dynamic(() => import("./BrandCard"), { ssr: false });
// const FilterPanel = dynamic(() => import("./FillterPannel"), { ssr: false });
// const BrandComparison = dynamic(() => import("./BrandCompariosn"), { ssr: false });
// const LoginPage = dynamic(() => import("../../Components/LoginPage/LoginPage"), { ssr: false });

// function BrandList() {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));
//   const location = useSearchParams();
//   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
//   const [likeProcessing, setLikeProcessing] = useState({});
//   const [showLogin, setShowLogin] = useState(false);
//   const toggleLike = useToggleLike();
//   const [scrollPosition, setScrollPosition] = useState(0);
//   const [comparisonOpen, setComparisonOpen] = useState(false);
//   const [enableComparison, setEnableComparison] = useState(false); 
//   const [selectedForComparison, setSelectedForComparison] = useState([]);
//   const [isScrolling, setIsScrolling] = useState(false);
//   const dispatch = useDispatch();

//   // Redux state selectors
//   const filterBrandsState = useSelector((state) => state.filterBrands);
//   const filterDropdownState = useSelector((state) => state.filterDropdown);
//   const authState = useSelector((state) => state.auth);

//   const {
//     brands = [],
//     loading,
//     error,
//     filters,
//     pagination,
//   } = filterBrandsState;

//   const {
//     mainCategories = [],
//     subCategories = [],
//     childCategories = [],
//     investmentRanges = [],
//     franchiseModels = [],
//     states = [],
//     districts = [],
//     cities = [],
//     loading: dropdownLoading,
//     loadingSubCategories,
//     loadingChildCategories,
//     loadingDistricts,
//     loadingCities,
//   } = filterDropdownState;

//   // Fetch initial data
//   useEffect(() => {
//     dispatch(fetchFilteredBrands(filters));
//     dispatch(fetchFilterOptions());
//   }, [dispatch]);

//   // Fetch brands when filters change
//   useEffect(() => {
//     dispatch(fetchFilteredBrands(filters));
//   }, [dispatch, filters]);

//   // Handle scroll position
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrollPosition(window.scrollY);
//       setIsScrolling(true);
//       const timer = setTimeout(() => setIsScrolling(false), 100);
//       return () => clearTimeout(timer);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Preload critical images for better performance
//   useEffect(() => {
//     const preloadImages = ['/bg25.jpeg']; // Add any critical images
//     preloadImages.forEach((src) => {
//       const img = new Image();
//       img.src = src;
//     });
//   }, []);

//    useEffect(() => {
//     if (location.state?.enableComparison !== undefined) {
//       setEnableComparison(location.state.enableComparison);
//     }
//     const enableFromStorage = localStorage.getItem('enableComparison');
//     if (enableFromStorage === 'true') {
//       setEnableComparison(true);
//       localStorage.removeItem('enableComparison');
//     }
//   }, [location.state]);

//   // Handle filter changes
//   const handleFilterChange = useCallback(
//     (name, value) => {
//       dispatch(setFilter({ filterName: name, value }));

//       // Fetch dependent data when parent filter changes
//       if (name === "maincat") {
//         dispatch(fetchFilterOptions({ main: value }));
//       } else if (name === "subcat") {
//         dispatch(fetchFilterOptions({ sub: value }));
//       } else if (name === "state") {
//         dispatch(fetchFilterOptions({ state: value }));
//       } else if (name === "district") {
//         dispatch(fetchFilterOptions({ district: value }));
//       }
//     },
//     [dispatch]
//   );

//   const handleClearFilters = useCallback(() => {
//     dispatch(resetFilters());
//   }, [dispatch]);

//   const handlePageChange = useCallback(
//     (event, page) => {
//       dispatch(setPage(page));
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     },
//     [dispatch]
//   );

//   const handleLikeClick = useCallback(
//     async (brandId, isLiked) => {
//       if (likeProcessing[brandId]) return;

//       if (!authState.isAuthenticated) {
//         setShowLogin(true);
//         return;
//       }

//       setLikeProcessing((prev) => ({ ...prev, [brandId]: true }));

//       try {
//         await toggleLike.mutateAsync({ brandId, isLiked });
//         // Refresh brands after like to update the like status
//         dispatch(fetchFilteredBrands(filters));
//       } catch (error) {
//         console.error("Like operation failed:", error);
//       } finally {
//         setLikeProcessing((prev) => ({ ...prev, [brandId]: false }));
//       }
//     },
//     [likeProcessing, toggleLike, authState, dispatch, filters]
//   );

// const toggleBrandComparison = useCallback((brand) => {
//   setSelectedForComparison((prev) => {
//     const isSelected = prev.some((b) => b.uuid === brand.uuid);
//     let updated;

//     if (isSelected) {
//       updated = prev.filter((b) => b.uuid !== brand.uuid);
//     } else {
//       updated = prev.length < 3 ? [...prev, brand] : prev;
//     }

//     // ✅ Auto-open dialog once 3 brands selected
//     if (updated.length === 3) {
//       setComparisonOpen(true);
//     }

//     return updated;
//   });
// }, []);




//   // Memoize grid styles for performance
//   const gridStyles = useMemo(() => ({
//     display: "grid",
//     gridTemplateColumns: {
//       xs: "repeat(1, 1fr)", 
//       sm: "repeat(1, 1fr)",
//       md: "repeat(3, 1fr)", 
//       lg: "repeat(3, 1fr)", 
//       xl: "repeat(4, 1fr)", 
//     },
//     gap: 0, 
//   }), []);

//   // Memoize active filter count
//   const activeFilterCount = useMemo(() => {
//     return Object.values(filters).filter(
//       (value) =>
//         value !== undefined &&
//         value !== null &&
//         value !== "" &&
//         (!Array.isArray(value) || value.length > 0)
//     ).length;
//   }, [filters]);

//   const comp = () => {
//     if (!enableComparison) {
//       setEnableComparison(true);
//     }
//     if (selectedForComparison.length > 0) {
//       setComparisonOpen(true);
//     }
//   }

//   return (
//     <Container maxWidth="xl" sx={{ mt: 0, mb: 0 ,
  
//                     backgroundImage: "url(/bg25.jpeg)",
//                    backgroundSize: "400px auto",        // fill entire box
//                    // backgroundPosition: "center",   // center image
//                    backgroundRepeat: "repeat",
//                    minHeight: "87vh",             // full screen height
//                    width: "100%",
                
  
//   }}>


//       {/* Comparison Button */}
     
//               <Box sx={{ position: "fixed", top: "30%", right: 12, zIndex: 1000 }}>
//   <Badge badgeContent={selectedForComparison.length} color="primary">
//     <Tooltip title="Click to compare selected brands" placement="left" arrow>
//       <Button
//         variant="contained"
//         color="primary"
//         startIcon={<Compare />}
//         onClick={comp}
//         sx={{
//           transform: "rotate(-90deg)", // 🔹 Rotate button
//           transformOrigin: "right center",
//           borderRadius: 2,
//           boxShadow: 3,
//           bgcolor: "#ff9800",
//           "&:hover": { bgcolor: "#fb8c00", boxShadow: 6 },
//         }}
//       >
//         Compare
//       </Button>
//     </Tooltip>
//   </Badge>
// </Box>
    

//       <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
//         {/* Desktop Filters */}
//         {!isMobile && (
//           <Box
//             sx={{
//               width: 280,
//               flexShrink: 0,
//               position: "sticky",
//               top: 16,
//               alignSelf: "flex-start",
//               maxHeight: "calc(100vh - 32px)",
//               overflowY: "auto",
//               "&::-webkit-scrollbar": { width: "6px" },
//               "&::-webkit-scrollbar-thumb": {
//                 backgroundColor: "#ff9800",
//                 borderRadius: "3px",
//               },
//             }}
//           >
//             <Suspense fallback={<FilterPanelSkeleton />}>
//               <FilterPanel
//                 filters={filters}
//                 onFilterChange={handleFilterChange}
//                 onClearFilters={handleClearFilters}
//                 activeFilterCount={activeFilterCount}
//                 mainCategories={mainCategories}
//                 subCategories={subCategories}
//                 childCategories={childCategories}
//                 franchiseModels={franchiseModels}
//                 investmentRanges={investmentRanges}
//                 states={states}
//                 districts={districts}
//                 cities={cities}
//                 loadingSubCategories={loadingSubCategories}
//                 loadingChildCategories={loadingChildCategories}
//                 loadingDistricts={loadingDistricts}
//                 loadingCities={loadingCities}
//                 resultStats={{
//                   showing: brands.length,
//                   total: pagination.total,
//                 }}
//                 isLoading={loading || dropdownLoading}
//               />
//             </Suspense>
//           </Box>
//         )}

//         {/* Mobile Filters Button */}
//         {isMobile && (
//           <Box sx={{ mb: 2, mt: 8 }}>
//             <Button
//               variant="outlined"
//               startIcon={<FilterAlt sx={{ color: "#ff9800" }} />}
//               endIcon={
//                 <Badge badgeContent={activeFilterCount} color="primary" />
//               }
//               onClick={() => setMobileFiltersOpen(true)}
//               fullWidth
//               sx={{
//                 py: 1.5,
//                 borderColor: "#ff9800",
//                 color: "#ff9800",
//                 "&:hover": { borderColor: "#fb8c00" },
//               }}
//             >
//               Filters
//             </Button>
//           </Box>
//         )}

//         {/* Main Content */}
//         <Box flexGrow={1} ml={{ md: 3 }}>
//           {loading ? (
//             <Box
//               display="flex"
//               justifyContent="center"
//               alignItems="center"
//               minHeight="60vh"
//             >
//               <CircularProgress
//                 size={60}
//                 thickness={4}
//                 sx={{ color: "#ff9800" }}
//               />
//             </Box>
//           ) : error ? (
//             <Box
//               display="flex"
//               justifyContent="center"
//               alignItems="center"
//               minHeight="60vh"
//             >
//               <Typography color="error" variant="h6">
//                 {error}
//               </Typography>
//             </Box>
//           ) : brands.length === 0 ? (
//             <Box textAlign="center" py={26}>
//               <Typography variant="h5" color="orange" backgroundColor="white" display={"inline-block"}p={2}>
//                 No brands match your filters
//               </Typography>
//               <br/>
//               <Button
//                 variant="outlined"
//                 onClick={handleClearFilters}
//                 startIcon={<ClearIcon />}
//                 size="large"
//                 sx={{ mt: 2, borderColor: "#ff9800", color: "#ff0000" }}
//               >
//                 Clear All Filters
//               </Button>
//             </Box>
//           ) : (
//             <>
//               {/* <Typography
//                 sx={{ ml: 2, }}
//                 variant={isMobile ? "h5" : "h4"}
//                 gutterBottom
//                 color="#ffffffff"
                
//               >
//                 Food & Beverage Brands
//               </Typography> */}
//               {/* <Typography sx={{ ml: 2, mb: 0 ,color: "#ffffffff"}} variant="body2" gutterBottom>
//                 Showing {brands.length} of {pagination.total} brands
//               </Typography> */}

//               <Box
//                 sx={gridStyles}
//               >
//                 {brands.map((brand) => (
//                   <Box key={brand.uuid}>
//                     <Suspense fallback={<BrandCardSkeleton />}>
//                       <BrandCard
//                         brand={brand}
//                         handleLikeClick={handleLikeClick}
//                         likeProcessing={likeProcessing}
//                         enableComparison={enableComparison}
//                         showLogin={showLogin}
//                         onShowLogin={setShowLogin}
//                         isSelectedForComparison={selectedForComparison.some(
//                           (b) => b.uuid === brand.uuid
//                         )}
//                         onToggleBrandComparison={toggleBrandComparison}
//                         maxComparisonReached={selectedForComparison.length >= 3 && !selectedForComparison.some(b => b.uuid === brand.uuid)}
//                       />
//                     </Suspense>
//                   </Box>
//                 ))}
//               </Box>

//               {/* Pagination */}
//               {pagination.totalPages > 1 && (
//                 <Box display="flex" justifyContent="center" mt={4} mb={2} backgroundColor="white" p={1}>
//                   <Pagination
//                     count={pagination.totalPages}
//                     page={pagination.currentPage}
//                     onChange={handlePageChange}
//                     color="primary"
//                     sx={{
//                       "& .MuiPaginationItem-root": {
//                         color: "#ff9800",
//                         borderColor: "#ff9800",
//                       },
//                       "& .MuiPaginationItem-root.Mui-selected": {
//                         backgroundColor: "#ff9800",
//                         color: "white",
//                         "&:hover": {
//                           backgroundColor: "#fb8c00",
//                         },
//                       },
//                       "& .MuiPaginationItem-root:hover": {
//                         backgroundColor: "rgba(255, 152, 0, 0.1)",
//                       },
//                     }}
//                   />
//                 </Box>
//               )}
//             </>
//           )}
//         </Box>
//       </Box>

//       {/* Mobile Filters Drawer */}
//       <Drawer
//         anchor="left"
//         open={mobileFiltersOpen}
//         onClose={() => setMobileFiltersOpen(false)}
//         sx={{ "& .MuiDrawer-paper": { width: 280 } }}
//       >
//         <Box
//           sx={{
//             p: 2,
//             height: "100%",
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           <Box
//             display="flex"
//             justifyContent="space-between"
//             alignItems="center"
//             mb={2}
//           >
//             <Typography variant="h6">Filters</Typography>
//             <IconButton onClick={() => setMobileFiltersOpen(false)}>
//               <Close />
//             </IconButton>
//           </Box>
//           <Divider />
//           <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
//             <Suspense fallback={<FilterPanelSkeleton />}>
//               <FilterPanel
//                 filters={filters}
//                 onFilterChange={handleFilterChange}
//                 onClearFilters={handleClearFilters}
//                 activeFilterCount={activeFilterCount}
//                 mainCategories={mainCategories}
//                 subCategories={subCategories}
//                 childCategories={childCategories}
//                 franchiseModels={franchiseModels}
//                 investmentRanges={investmentRanges}
//                 states={states}
//                 districts={districts}
//                 cities={cities}
//                 loadingSubCategories={loadingSubCategories}
//                 loadingChildCategories={loadingChildCategories}
//                 loadingDistricts={loadingDistricts}
//                 loadingCities={loadingCities}
//                 resultStats={{
//                   showing: brands.length,
//                   total: pagination.total,
//                 }}
//                 isLoading={loading || dropdownLoading}
//               />
//             </Suspense>
//           </Box>
//           <Button
//             variant="contained"
//             fullWidth
//             onClick={() => setMobileFiltersOpen(false)}
//             sx={{ mt: 2, backgroundColor: "#ff9800" }}
//           >
//             Apply Filters
//           </Button>
//         </Box>
//       </Drawer>

//        <Suspense fallback={null}>
//         <BrandComparison
//           open={comparisonOpen}
//           onClose={() => {
//     setComparisonOpen(false);  
//     setSelectedForComparison([]);
//     setEnableComparison(false);
//   }}
//           selectedBrands={selectedForComparison}
//            onRemoveFromComparison={(uuid) =>
//     setSelectedForComparison((prev) => prev.filter((b) => b.uuid !== uuid))
//   }
//         />
//       </Suspense>
 

//       {showLogin && (
//         <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
//       )}
//     </Container>
//   );
// }

// export default React.memo(BrandList);


// app/AllCategoryPage/BrandListAllbrands.jsx
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
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  setFilter,
  resetFilters,
  fetchFilteredBrands,
  setPage,
  
} from "@/Redux/Slices/FilterBrandSlice";
import { fetchFilterOptions } from "@/Redux/Slices/filterDropdownData";

// ============================================
// SKELETON COMPONENTS (Inline for fast load)
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
    <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 1, mb: 2 }} />
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

// ============================================
// DYNAMIC IMPORTS WITH LOADING STATES
// ============================================
const BrandCard = dynamic(() => import("./brandCard"), {
  loading: () => <BrandCardSkeleton />,
  ssr: false,
});

const FilterPanel = dynamic(() => import("./FillterPannel"), {
  loading: () => <FilterPanelSkeleton />,
  ssr: false,
});

const BrandComparison = dynamic(() => import("./brandCompariosn"), {
  loading: () => <Skeleton/>,
  ssr: false,
});

const LoginPage = dynamic(() => import("@/Components/LoginPage/LoginPage"), {
  loading: () => <Skeleton/>,
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
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1, rootMargin: "100px", ...options });

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);

    return () => observer.disconnect();
  }, [options]);

  return [ref, isVisible];
};

// ============================================
// LAZY BRAND CARD WRAPPER
// ============================================
const LazyBrandCard = React.memo(({
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
});
LazyBrandCard.displayName = "LazyBrandCard";

// ============================================
// MAIN COMPONENT
// ============================================
function BrandList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

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
        (!Array.isArray(value) || value.length > 0)
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
    []
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
    []
  );

  // ============================================
  // EFFECTS
  // ============================================

  // Initial data fetch (only once)
  useEffect(() => {
    if (!isInitialized) {
      dispatch(fetchFilterOptions());
      setIsInitialized(true);
    }
  }, [dispatch, isInitialized]);

  // Fetch brands when debounced filters change
  useEffect(() => {
    if (isInitialized) {
      startTransition(() => {
        dispatch(fetchFilteredBrands(debouncedFilters));
      });
    }
  }, [dispatch, debouncedFilters, isInitialized]);

  // Check for comparison mode from URL/storage
  useEffect(() => {
    const enableFromStorage = localStorage.getItem("enableComparison");
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
    [dispatch]
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
    [dispatch]
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
    [likeProcessing, isAuthenticated, dispatch, filters]
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

    // if (brands.length === 0) {
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
            <LazyBrandCard
              key={brand.uuid || index}
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
          <Tooltip title="Click to compare selected brands" placement="left" arrow>
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
              endIcon={<Badge badgeContent={activeFilterCount} color="primary" />}
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
            sx={{ mt: 2, bgcolor: "#ff9800", "&:hover": { bgcolor: "#fb8c00" } }}
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