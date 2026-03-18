"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import Drawer from "@mui/material/Drawer";
import {
 
  useMediaQuery,
  useTheme,
  
} from "@mui/material";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Fade from "@mui/material/Fade";
import Grow from "@mui/material/Grow";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { openBrandDialog } from "@/Redux/Slices/OpenBrandNewPageSlice";
// Create axios instance with base config
const api = axios.create({
  baseURL: "https://mrfranchisebackend.mrfranchise.in/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Memoized brand card component with optimized props
// Memoized brand card component with optimized props
const BrandCard = React.memo(
  ({ brand, onClick, isMobile, onHoverLeave }) => { // Add onHoverLeave prop
    const brandName = brand.brandDetails?.brandName || brand.brandname || "Unknown";
    const brandId = brand.uuid;
    const brandLogo = brand.uploads?.logo || brand.logo || "";
    const companyName = brand.brandDetails?.companyName || "";
    const initial = brandName[0]?.toUpperCase() || "B";

    // const navigate = useRouter();
    const dispatch = useDispatch();

    const handleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Close the drawer first
      if (onHoverLeave) {
        onHoverLeave();
      }
      
      // if (brandId) {
      //   const encodedBrandName = encodeURIComponent(brandName);
      //   navigate(`/brands/${brandId}?name=${encodedBrandName}`);
      // }
      
      // Also call the parent onClick handler if provided
      if (onClick) {
        // onClick(brand);
        dispatch(openBrandDialog(brand));
      }
    };

    return (
      <motion.div 
        whileHover={{ y: -4 }} 
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <Paper
          onClick={handleClick}
          elevation={2}
          sx={{
            width: isMobile ? 90 : 120,
            height: isMobile ? 120 : 140,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 1.5,
            borderRadius: 2,
            cursor: "pointer",
            transition: "all 0.3s ease",
            border: "1px solid #eee",
            backgroundColor: "#fff",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
              borderColor: "#ff9800",
            },
          }}
        >
          <Box
            sx={{
              width: isMobile ? 50 : 64,
              height: isMobile ? 50 : 64,
              borderRadius: "50%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1.5,
            }}
          >
            <Avatar
              src={brandLogo}
              alt={brandName}
              sx={{
                objectFit: "contain",
                width: "100%",
                height: "100%",
                // fontSize: isMobile ? 22 : 26,
                bgcolor: "#ffe0b2",
                color: "#ff6d00",
              }}
            >
              {initial}
            </Avatar>
          </Box>
          <Typography
            fontWeight={600}
            textAlign="center"
            noWrap
            sx={{
              fontSize: isMobile ? "0.8rem" : "0.85rem",
              maxWidth: "100%",
              px: 0.5,
              color: "text.primary",
              whiteSpace: "normal",
              wordBreak: "break-word",
              lineHeight: 1.3,
              mb: 0.5,
            }}
          >
            {brandName}
          </Typography>
          {companyName && (
            <Typography
              variant="caption"
              textAlign="center"
              sx={{
                fontSize: "0.7rem",
                color: "text.secondary",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
              }}
            >
              {companyName}
            </Typography>
          )}
        </Paper>
      </motion.div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.brand.uuid === nextProps.brand.uuid &&
      prevProps.isMobile === nextProps.isMobile
    );
  }
);

// Skeleton loader for brands
const BrandCardSkeleton = ({ isMobile }) => (
  <Skeleton
    variant="square"
    width={isMobile ? 100 : 120}
    height={isMobile ? 140 : 140}
    sx={{ borderRadius: 2 }}
  />
);

// Skeleton loader for categories/subcategories
const CategorySkeleton = () => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
    {Array.from({ length: 5 }).map((_, index) => (
      <Skeleton
        key={`category-skeleton-${index}`}
        variant="rounded"
        height={48}
        sx={{ borderRadius: 2 }}
      />
    ))}
  </Box>
);

const SideViewContent = ({ hoverCategory, onHoverLeave, onBrandClick }) => {
  const [industries, setIndustries] = useState([]);
  const [activeIndustry, setActiveIndustry] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [mobileTabValue, setMobileTabValue] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [availableSubCategories, setAvailableSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState({
    industries: false,
    subcategories: false,
    brands: false,
    loadMore: false
  });
  const [error, setError] = useState(null);
  const [apiError, setApiError] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error"
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 30,
    hasNext: false,
    total: 0,
    totalPages: 0,
    hasPrevious: false,
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

    const navigate = useRouter();
  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Fetch initial industries data
  const fetchInitialData = useCallback(async () => {
    if (!hoverCategory) return;
    
    setLoading(prev => ({ ...prev, industries: true }));
    setError(null);
    setApiError(false);
    try {
      const response = await api.post("filter/getAllBrandFiltersdata");
      
      if (response.data.success) {
        setIndustries(response.data.data.maincat || []);
      } else {
        setError(response.data.message || "Failed to load industries");
        setApiError(true);
        setSnackbar({
          open: true,
          message: response.data.message || "Failed to load industries",
          severity: "error"
        });
      }
    } catch (err) {
      console.error("Failed to fetch initial data:", err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "Failed to connect to server. Please check your connection.";
      setError(errorMessage);
      setApiError(true);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error"
      });
      setIndustries([]);
    } finally {
      setLoading(prev => ({ ...prev, industries: false }));
    }
  }, [hoverCategory]);

  

  // Fetch subcategories for selected industry
  const fetchSubCategories = useCallback(async (industry) => {
    if (!industry) return [];
    
    setLoading(prev => ({ ...prev, subcategories: true }));
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (industry) queryParams.append('main', industry);
      
      const response = await api.post(`filter/getAllBrandFiltersdata?${queryParams.toString()}`);
      
      if (response.data.success) {
        return response.data.data.subcat || [];
      }
      return [];
    } catch (err) {
      console.error("Failed to fetch subcategories:", err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "Failed to fetch subcategories";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "warning"
      });
      return [];
    } finally {
      setLoading(prev => ({ ...prev, subcategories: false }));
    }
  }, []);

  // Fetch brands for subcategory - UPDATED to match the correct API format
  const fetchBrands = useCallback(async (filters) => {
    if (!filters.subcat) return { 
      brands: [], 
      pagination: { 
        currentPage: 1, 
        limit: 30, 
        hasNext: false, 
        total: 0, 
        totalPages: 0, 
        hasPrevious: false 
      } 
    };
    
    setLoading(prev => ({ ...prev, brands: true }));
    try {
      const params = new URLSearchParams();
      params.append('page', filters.page || 1);
      params.append('limit', filters.limit || 30);
      
      if (filters.industry) params.append('maincat', filters.industry);
      if (filters.subcat) params.append('subcat', filters.subcat);
      
      // Optional parameters (commented out but can be added if needed)
      // if (filters.childcat) params.append('childcat', filters.childcat);
      // if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      // if (filters.country) params.append('country', filters.country);
      // if (filters.state) params.append('state', filters.state);
      // if (filters.district) params.append('district', filters.district);
      // if (filters.city) params.append('city', filters.city);
      // if (filters.investmentRange) params.append('investmentRange', filters.investmentRange);
      // if (filters.modelType) params.append('modelType', filters.modelType);
      // if (filters.areaRequired) params.append('areaRequired', filters.areaRequired);
      
      const response = await api.get(`filter/getAllBrandsAndFilter?${params.toString()}`);
      
      if (response.data.success) {
        // Normalize brand data structure
        const normalizedBrands = response.data.data?.brands?.map(brand => ({
          ...brand,
          brandDetails: {
            brandName: '',
            companyName: '',
            ...brand.brandDetails
          },
          brandfranchisedetails: {
            franchiseDetails: {
              fico: [],
              trainingSupport: [],
              ...brand.brandfranchisedetails?.franchiseDetails
            },
            ...brand.brandfranchisedetails
          },
          uploads: {
            logo: '',
            ...brand.uploads
          },
          isLiked: brand?.isLiked || false,
          isShortListed: brand?.isShortListed || false
        })) || [];
        
        return {
          brands: normalizedBrands,
          pagination: response.data.data?.pagination || { 
            currentPage: filters.page || 1, 
            limit: filters.limit || 30, 
            hasNext: false, 
            total: 0, 
            totalPages: 0, 
            hasPrevious: false 
          }
        };
      }
      return { 
        brands: [], 
        pagination: { 
          currentPage: filters.page || 1, 
          limit: filters.limit || 30, 
          hasNext: false, 
          total: 0, 
          totalPages: 0, 
          hasPrevious: false 
        } 
      };
    } catch (err) {
      console.error("Failed to fetch brands:", err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "Failed to fetch brands";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error"
      });
      throw new Error(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, brands: false }));
    }
  }, []);

  // Handle industry hover - fetch subcategories
  const handleIndustryHover = useCallback(
    async (index, industryName) => {
      if (activeIndustry !== index) {
        setIsTransitioning(true);
        setActiveIndustry(index);
        setActiveSubCategory(null);
        setBrands([]);
        setError(null);
        setPagination({ 
          currentPage: 1, 
          limit: 30, 
          hasNext: false, 
          total: 0, 
          totalPages: 0, 
          hasPrevious: false 
        });
        try {
          const subcats = await fetchSubCategories(industryName);
          setAvailableSubCategories(subcats);
        } catch (err) {
          console.error("Failed to fetch subcategories:", err);
          setAvailableSubCategories([]);
        } finally {
          setIsTransitioning(false);
        }
      }
    },
    [activeIndustry, fetchSubCategories]
  );

  // Handle subcategory hover - fetch brands
  const handleSubCategoryHover = useCallback(
    async (subCategoryName) => {
      if (activeSubCategory !== subCategoryName) {
        setIsTransitioning(true);
        setLoading(prev => ({ ...prev, brands: true }));
        setError(null);
        setActiveSubCategory(subCategoryName);
        setBrands([]);
        setPagination({ 
          currentPage: 1, 
          limit: 30, 
          hasNext: false, 
          total: 0, 
          totalPages: 0, 
          hasPrevious: false 
        });
        try {
          const industry = industries[activeIndustry] || "";
          const result = await fetchBrands({
            industry,
            subcat: subCategoryName,
            page: 1,
            limit: 30
          });
          setBrands(result.brands || []);
          setPagination(result.pagination || { 
            currentPage: 1, 
            limit: 30, 
            hasNext: false, 
            total: 0, 
            totalPages: 0, 
            hasPrevious: false 
          });
        } catch (err) {
          console.error("Failed to fetch brands:", err);
          setError("Failed to fetch brands");
          setBrands([]);
          setPagination({ 
            currentPage: 1, 
            limit: 30, 
            hasNext: false, 
            total: 0, 
            totalPages: 0, 
            hasPrevious: false 
          });
        } finally {
          setIsTransitioning(false);
          setLoading(prev => ({ ...prev, brands: false }));
        }
      }
    },
    [activeIndustry, activeSubCategory, industries, fetchBrands]
  );

 const handleBrandClick = useCallback((brand) => {
  const brandName = brand.brandDetails?.brandName || brand.brandname || "Unknown";
  const brandId = brand.uuid;
  
  // Close the drawer first
  if (onHoverLeave) {
    onHoverLeave();
  }
  
  // Navigate to brand detail page
  if (brandId) {
    const encodedBrandName = encodeURIComponent(brandName);
    navigate(`/brands/${brandId}?name=${encodedBrandName}`);
  }
  
  // Also call the original onBrandClick if provided
  if (onBrandClick) {
    const normalizedBrand = {
      ...brand,
      brandDetails: {
        brandName: '',
        companyName: '',
        ...brand.brandDetails
      },
      uploads: {
        logo: '',
        ...brand.uploads
      }
    };
    onBrandClick(normalizedBrand);
  }
}, [navigate, onBrandClick, onHoverLeave]);

  const handleMobileTabChange = useCallback((event, newValue) => {
    setMobileTabValue(newValue);
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (!pagination.hasNext || loading.loadMore) return;
    setLoading(prev => ({ ...prev, loadMore: true }));
    try {
      const industry = industries[activeIndustry] || "";
      const result = await fetchBrands({
        industry,
        subcat: activeSubCategory,
        page: pagination.currentPage + 1,
        limit: pagination.limit
      });
      setBrands(prevBrands => [...prevBrands, ...(result.brands || [])]);
      setPagination(result.pagination || pagination);
    } catch (err) {
      console.error("Failed to load more brands:", err);
      setError("Failed to load more brands");
      setSnackbar({
        open: true,
        message: "Failed to load more brands",
        severity: "error"
      });
    } finally {
      setLoading(prev => ({ ...prev, loadMore: false }));
    }
  }, [pagination, activeIndustry, activeSubCategory, loading.loadMore, industries, fetchBrands]);

  // Fetch industries when drawer opens
  useEffect(() => {
    if (hoverCategory) {
      fetchInitialData();
    }
  }, [hoverCategory, fetchInitialData]);

  // Clear data when drawer closes
  useEffect(() => {
    if (!hoverCategory) {
      setActiveIndustry(null);
      setActiveSubCategory(null);
      setMobileTabValue(0);
      setAvailableSubCategories([]);
      setBrands([]);
      setError(null);
      setApiError(false);
      setPagination({ 
        currentPage: 1, 
        limit: 30, 
        hasNext: false, 
        total: 0, 
        totalPages: 0, 
        hasPrevious: false 
      });
    }
  }, [hoverCategory]);

  // Memoized mobile tab content
  const getMobileTabContent = useMemo(() => {
    const tabContents = [
      // Industries Tab
      <Box sx={{ p: 2 }}>
        {loading.industries ? (
          <CategorySkeleton />
        ) : apiError ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <ErrorIcon sx={{ fontSize: 48, color: "error.main", mb: 2 }} />
            <Typography variant="body2" color="error">
              Failed to load industries
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Please try again later
            </Typography>
          </Box>
        ) : industries.length > 0 ? (
          industries.map((industry, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Box
                onClick={() => {
                  handleIndustryHover(index, industry);
                  setMobileTabValue(1);
                }}
                sx={{
                  cursor: "pointer",
                  py: 1.5,
                  px: 1.5,
                  borderRadius: 2,
                  mb: 1,
                  color: activeIndustry === index ? "white" : "text.primary",
                  bgcolor:
                    activeIndustry === index
                      ? "primary.main"
                      : "background.paper",
                  fontWeight: "medium",
                  transition: "all 0.3s ease",
                  boxShadow: theme.shadows[1],
                  "&:hover": {
                    bgcolor:
                      activeIndustry === index ? "primary.dark" : "action.hover",
                  },
                }}
              >
                <Typography variant="subtitle1">{industry}</Typography>
              </Box>
            </motion.div>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
            No industries available
          </Typography>
        )}
      </Box>,
      // Subcategories Tab
      <Box sx={{ p: 2 }}>
        <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.98 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              cursor: "pointer",
              p: 1,
              borderRadius: 1,
              "&:hover": { bgcolor: "action.hover" },
            }}
            onClick={() => setMobileTabValue(0)}
          >
            <IconButton size="small" sx={{ mr: 1 }}>
              <CloseIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              Back to Industries
            </Typography>
          </Box>
        </motion.div>
        
        {loading.subcategories ? (
          <CategorySkeleton />
        ) : availableSubCategories.length > 0 ? (
          availableSubCategories.map((subCategory, idx) => (
            <Grow in={true} timeout={(idx + 1) * 150} key={idx}>
              <motion.div whileHover={{ scale: 1.02 }}>
                <Box
                  onClick={() => handleSubCategoryHover(subCategory)}
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    py: 1.5,
                    px: 1.5,
                    borderRadius: 2,
                    gap: 1.5,
                    mb: 1,
                    bgcolor:
                      activeSubCategory === subCategory
                        ? "primary.light"
                        : "background.paper",
                    color:
                      activeSubCategory === subCategory
                        ? "primary.contrastText"
                        : "text.primary",
                    boxShadow: theme.shadows[1],
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor:
                        activeSubCategory === subCategory
                          ? "primary.main"
                          : "action.hover",
                    },
                  }}
                >
                  <Typography
                    fontWeight={
                      activeSubCategory === subCategory ? "bold" : "medium"
                    }
                  >
                    {subCategory}
                  </Typography>
                </Box>
              </motion.div>
            </Grow>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
            {activeIndustry !== null ? "No subcategories available" : "Select an industry first"}
          </Typography>
        )}
      </Box>,
    ];

    return tabContents[mobileTabValue] || null;
  }, [
    mobileTabValue,
    activeIndustry,
    activeSubCategory,
    availableSubCategories,
    handleIndustryHover,
    handleSubCategoryHover,
    theme.shadows,
    loading.industries,
    loading.subcategories,
    industries,
    apiError,
  ]);

  // Content when only industry is selected (no subcategory hovered)
  const renderIndustryContent = useMemo(() => {
    return (
      <Fade in={true} timeout={500}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "text.secondary",
            textAlign: "center",
            p: 3,
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {industries[activeIndustry] || "Select Industry"}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: 400 }}>
            Hover over a subcategory to see available brands
          </Typography>
        </Box>
      </Fade>
    );
  }, [activeIndustry, industries]);

  // Content when subcategory is selected (show brands)
  const renderBrandsContent = useMemo(() => {
    // Show loading state during transitions or initial load
    if (isTransitioning || (loading.brands && brands.length === 0)) {
      return (
        <Box sx={{ p: 2 }}>
          <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
          <Grid container spacing={isMobile ? 1 : 2}>
            {Array.from({ length: 8 }).map((_, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={`initial-skeleton-${index}`}
              >
                <BrandCardSkeleton isMobile={isMobile} />
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    }
    
    if (error) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "error.main",
            textAlign: "center",
            p: 3,
          }}
        >
          <ErrorIcon sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Oops! Brands Under Updating Process
          </Typography>
          <Typography variant="body2">
            Please try again later
          </Typography>
        </Box>
      );
    }

    if (brands.length > 0) {
      return (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
              pt: isMobile ? 1 : 0,
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                background: "linear-gradient(45deg, #ff9800 30%, #ff5722 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {industries[activeIndustry] || "Industry"} - {activeSubCategory}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label={` ${brands.length} brands`}
                component="button"
                size="small"
                color="warning"
                variant="outlined"
                sx={{ fontWeight: "bold" }}
              />
            
             
            </Box>
          </Box>

          <Grid container spacing={isMobile ? 1 : 2}>
            {brands.map((brand, index) => {
              const uniqueKey = brand?.uuid
                ? `brand-${brand.uuid}-${index}`
                : `brand-fallback-${index}`;

              return (
                <Grid item xs={12} sm={6} md={3} key={uniqueKey}>
                  <BrandCard
                  
                    brand={brand}
                    onClick={handleBrandClick}
                    isMobile={isMobile}
                      onHoverLeave={onHoverLeave}
                  />
                </Grid>
              );
            })}

            {loading.loadMore && (
              <>
                {Array.from({ length: 4 }).map((_, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={`loadmore-skeleton-${index}`}
                  >
                    <BrandCardSkeleton isMobile={isMobile} />
                  </Grid>
                ))}
              </>
            )}
          </Grid>
          
          {pagination.hasNext && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleLoadMore}
                disabled={loading.loadMore}
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: "bold",
                }}
              >
                {loading.loadMore ? "Loading..." : "Load More"}
              </Button>
            </Box>
          )}
        </>
      );
    }

    // Empty state for subcategory
    return (
      <Fade in={true}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "text.secondary",
            textAlign: "center",
            p: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            No brands found for "{activeSubCategory}"
          </Typography>
          <Typography variant="body2">
            Try selecting a different subcategory
          </Typography>
        </Box>
      </Fade>
    );
  }, [
    brands,
    loading.brands,
    loading.loadMore,
    error,
    isMobile,
    pagination,
    activeIndustry,
    activeSubCategory,
    handleLoadMore,
    handleBrandClick,
    isTransitioning,
    industries,
  ]);

  // Determine what to render in the brands section
  const renderMainContent = useMemo(() => {
    if (activeSubCategory) {
      return renderBrandsContent;
    } else if (activeIndustry !== null) {
      return renderIndustryContent;
    } else {
      return (
        <Fade in={true}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "text.secondary",
              textAlign: "center",
              p: 3,
            }}
          >
            {loading.industries ? (
              <>
                <Skeleton variant="text" width="60%" height={48} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="80%" height={24} />
              </>
            ) : apiError ? (
              <>
                <ErrorIcon sx={{ fontSize: 48, color: "error.main", mb: 2 }} />
                <Typography variant="h6" color="error" gutterBottom>
                  Failed to load industries
                </Typography>
                <Typography variant="body2">
                  Please try again later
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Welcome!
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: 400 }}>
                  {isMobile
                    ? "Select an industry to explore subcategories"
                    : "Hover over an industry to see available subcategories"}
                </Typography>
              </>
            )}
          </Box>
        </Fade>
      );
    }
  }, [
    activeIndustry, 
    activeSubCategory, 
    renderBrandsContent, 
    renderIndustryContent, 
    isMobile, 
    loading.industries, 
    apiError
  ]);

  return (
    <>
      <Drawer
        anchor="top"
        open={hoverCategory !== null}
        onClose={onHoverLeave}
        PaperProps={{
          sx: {
            height: isMobile ? "85vh" : isTablet ? "65vh" : 500,
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 32px 0 rgba(60,72,88,0.18)",
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            border: "1.5px solid rgba(255,255,255,0.25)",
            overflow: "hidden",
          },
        }}
        SlideProps={{ timeout: 300 }}
      >
        <Box
          onMouseLeave={onHoverLeave}
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {/* Mobile Tabs Navigation */}
          {isMobile && (
            <AppBar
              position="static"
              color="inherit"
              elevation={0}
              sx={{ background: "#ff9800", color: "white" }}
            >
              <Tabs
                value={mobileTabValue}
                onChange={handleMobileTabChange}
                variant="fullWidth"
                indicatorColor="secondary"
                textColor="inherit"
                sx={{
                  "& .MuiTabs-indicator": { height: 4, backgroundColor: "white" },
                }}
              >
                <Tab
                  label="Industries"
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    textTransform: "none",
                    minHeight: 48,
                  }}
                />
                <Tab
                  label="Subcategories"
                  disabled={activeIndustry === null}
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    textTransform: "none",
                    minHeight: 48,
                  }}
                />
              </Tabs>
            </AppBar>
          )}

          {/* Desktop View */}
          {!isMobile && (
            <>
              {/* Industries Column - Fixed */}
              <Box
                sx={{
                  width: 300,
                  borderRight: `1px solid ${theme.palette.divider}`,
                  overflowY: "auto",
                  px: 2,
                  py: 2,
                  background:
                    "linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  mb={2}
                  color="text.secondary"
                >
                  Industries
                </Typography>
                
                {loading.industries ? (
                  <CategorySkeleton />
                ) : industries.length > 0 ? (
                  industries.map((industry, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Box
                        onMouseEnter={() => handleIndustryHover(index, industry)}
                        sx={{
                          cursor: "pointer",
                          py: 1.5,
                          px: 2,
                          borderRadius: 2,
                          mb: 1.5,
                          color:
                            activeIndustry === index ? "white" : "text.primary",
                          bgcolor:
                            activeIndustry === index
                              ? "orange"
                              : "background.paper",
                          fontWeight: "medium",
                          transition: "all 0.3s ease",
                          boxShadow: theme.shadows[1],
                          "&:hover": {
                            bgcolor:
                              activeIndustry === index ? "orange" : "action.hover",
                          },
                        }}
                      >
                        <Typography variant="subtitle1">{industry}</Typography>
                      </Box>
                    </motion.div>
                  ))
                ) : apiError ? (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <ErrorIcon sx={{ fontSize: 48, color: "error.main", mb: 2 }} />
                    <Typography variant="body2" color="error">
                      Failed to load industries
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                    No industries available
                  </Typography>
                )}
              </Box>

              {/* Subcategories Column - Fixed */}
              {activeIndustry !== null && (
                <Box
                  sx={{
                    width: 400,
                    borderRight: `1px solid ${theme.palette.divider}`,
                    overflowY: "auto",
                    px: 2,
                    py: 2,
                    background:
                      "linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    mb={2}
                    color="text.secondary"
                  >
                    Industry - {industries[activeIndustry] || "Select Industry"}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  {loading.subcategories ? (
                    <CategorySkeleton />
                  ) : availableSubCategories.length > 0 ? (
                    availableSubCategories.map((subCategory, idx) => (
                      <Grow in={true} timeout={(idx + 1) * 150} key={idx}>
                        <motion.div whileHover={{ scale: 1.02 }}>
                          <Box
                            onMouseEnter={() => handleSubCategoryHover(subCategory)}
                            sx={{
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              py: 1.5,
                              px: 2,
                              borderRadius: 2,
                              gap: 1.5,
                              mb: 1.5,
                              bgcolor:
                                activeSubCategory === subCategory
                                  ? "orange"
                                  : "background.paper",
                              color:
                                activeSubCategory === subCategory
                                  ? "primary.contrastText"
                                  : "text.primary",
                              boxShadow: theme.shadows[1],
                              transition: "all 0.3s ease",
                              "&:hover": {
                                bgcolor:
                                  activeSubCategory === subCategory
                                    ? "orange"
                                    : "action.hover",
                              },
                            }}
                          >
                            <Typography
                              fontWeight={
                                activeSubCategory === subCategory
                                  ? "bold"
                                  : "medium"
                              }
                            >
                              {subCategory}
                            </Typography>
                          </Box>
                        </motion.div>
                      </Grow>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                      No subcategories available
                    </Typography>
                  )}
                </Box>
              )}
            </>
          )}

          {/* Mobile Tab Content */}
          {isMobile && (
            <Box
              sx={{ flex: 1, overflowY: "auto", bgcolor: "background.default" }}
            >
              {getMobileTabContent}
            </Box>
          )}

          {/* Main Content Area - Shows either industry info or brands */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              px: isMobile ? 1 : 3,
              py: 2,
              bgcolor: "background.paper",
              borderTop: isMobile ? `1px solid ${theme.palette.divider}` : "none",
              position: "relative",
            }}
          >
            {renderMainContent}
          </Box>
        </Box>
      </Drawer>

      {/* Snackbar for error messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default React.memo(SideViewContent);