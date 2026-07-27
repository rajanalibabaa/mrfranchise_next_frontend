"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import Drawer from "@mui/material/Drawer";
import { useMediaQuery, useTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
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
import { ArrowBack } from "@mui/icons-material";

const api = axios.create({
  baseURL:`${process.env.NEXT_PUBLIC_API_URL}/api/v1/`,
  headers: {
    "Content-Type": "application/json",
  },
});

const BrandCard = React.memo(
  ({ brand, onClick, isMobile, onHoverLeave }) => {
    const brandName =
      brand.brandDetails?.brandName || brand.brandname || "Unknown";
    const brandId = brand.uuid;
    const brandLogo = brand.uploads?.logo || brand.logo || "";
    const companyName = brand.brandDetails?.companyName || "";
    const initial = brandName[0]?.toUpperCase() || "B";

    const dispatch = useDispatch();

    const handleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (onHoverLeave) {
        onHoverLeave();
      }
      if (onClick) {
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
            width: isMobile ? 120 : 120,
            height: isMobile ? 120 : 140,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 2.5,
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
                objectFit: "cover",
                width: "100%",
                height: "100%",
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
  },
);

const BrandCardSkeleton = ({ isMobile }) => (
  <Skeleton
    variant="square"
    width={isMobile ? 100 : 120}
    height={isMobile ? 140 : 140}
    sx={{ borderRadius: 2 }}
  />
);

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

// ─── MOBILE BRANDS PANEL ────────────────────────────────────────────────────
// Separate component so it gets its own scroll container
const MobileBrandsPanel = ({
  brands,
  loading,
  error,
  pagination,
  activeIndustry,
  activeSubCategory,
  industries,
  isTransitioning,
  handleLoadMore,
  handleBrandClick,
  onHoverLeave,
  isMobile,
}) => {
  if (isTransitioning || (loading.brands && brands.length === 0)) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
        <Grid container spacing={1}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={6} key={`mob-skeleton-${index}`}>
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
          py: 6,
          px: 3,
          textAlign: "center",
        }}
      >
        <ErrorIcon sx={{ fontSize: 48, color: "error.main", mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Oops! Brands Under Updating Process
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please try again later
        </Typography>
      </Box>
    );
  }

  if (brands.length > 0) {
    return (
      <Box sx={{ p: 1 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{
              background: "linear-gradient(45deg, #ff9800 30%, #ff5722 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              flex: 1,
              mr: 1,
            }}
          >
            {industries[activeIndustry] || "Industry"}
            {activeSubCategory ? ` › ${activeSubCategory}` : ""}
          </Typography>
          <Chip
            label={`${brands.length} brands`}
            size="small"
            color="warning"
            variant="outlined"
            sx={{ fontWeight: "bold", flexShrink: 0 }}
          />
        </Box>

        {/* Brand Grid */}
        <Grid container spacing={1.5}>
          {brands.map((brand, index) => {
            const uniqueKey = brand?.uuid
              ? `mob-brand-${brand.uuid}-${index}`
              : `mob-brand-fallback-${index}`;
            return (
              <Grid item xs={6} key={uniqueKey}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <BrandCard
                    brand={brand}
                    onClick={handleBrandClick}
                    isMobile={isMobile}
                    onHoverLeave={onHoverLeave}
                  />
                </Box>
              </Grid>
            );
          })}

          {loading.loadMore &&
            Array.from({ length: 4 }).map((_, index) => (
              <Grid item xs={6} key={`mob-loadmore-${index}`}>
                <BrandCardSkeleton isMobile={isMobile} />
              </Grid>
            ))}
        </Grid>

        {/* Load More */}
        {pagination.hasNext && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleLoadMore}
              disabled={loading.loadMore}
              sx={{ px: 4, py: 1, borderRadius: 2, fontWeight: "bold" }}
            >
              {loading.loadMore ? "Loading..." : "Load More"}
            </Button>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
        px: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="h6" gutterBottom>
        No brands found for "{activeSubCategory}"
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Try selecting a different subcategory
      </Typography>
    </Box>
  );
};

// ─── MOBILE TAB: 0 – INDUSTRIES ─────────────────────────────────────────────
const MobileIndustriesTab = ({
  industries,
  activeIndustry,
  loading,
  apiError,
  theme,
  onSelect,
}) => (
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
      industries.map((group, groupIndex) => (
        <Box key={group.heading}>
          <Typography
            sx={{
              fontWeight: 700,
              color: "#ff6b00",
              mb: 1,
              mt: 2,
            }}
          >
            {group.heading}
          </Typography>

          {group.industries.map((industry, index) => {
            const uniqueIndex = `${groupIndex}-${index}`;

            return (
              <Box
                key={industry}
                onClick={() => onSelect(uniqueIndex, industry)}
                sx={{
                  cursor: "pointer",
                  py: 1.5,
                  px: 2,
                  borderRadius: 2,
                  mb: 1,

                  bgcolor:
                    activeIndustry === uniqueIndex ? "primary.main" : "white",

                  color: activeIndustry === uniqueIndex ? "white" : "black",
                }}
              >
                {industry}
              </Box>
            );
          })}
        </Box>
      ))
    ) : (
      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        sx={{ py: 4 }}
      >
        No industries available
      </Typography>
    )}
  </Box>
);

// ─── MOBILE TAB: 1 – SUBCATEGORIES ──────────────────────────────────────────
const MobileSubCategoriesTab = ({
  availableSubCategories,
  activeSubCategory,
  activeIndustry,
  loading,
  theme,
  onBack,
  onSelect,
}) => (
  <Box sx={{ p: 2 }}>
    {/* Back button */}
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
        onClick={onBack}
      >
        <IconButton size="small" sx={{ mr: 1 }} aria-label="back">
          <ArrowBack color="red" />
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
        <Grow in timeout={(idx + 1) * 150} key={idx}>
          <motion.div whileHover={{ scale: 1.02 }}>
            <Box
              onClick={() => onSelect(subCategory)}
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
      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        sx={{ py: 4 }}
      >
        {activeIndustry !== null
          ? "No subcategories available"
          : "Select an industry first"}
      </Typography>
    )}
  </Box>
);

// ─── MOBILE TAB: 2 – BRANDS ─────────────────────────────────────────────────
const MobileBrandsTab = ({
  brands,
  loading,
  error,
  pagination,
  activeIndustry,
  activeSubCategory,
  industries,
  isTransitioning,
  handleLoadMore,
  handleBrandClick,
  onHoverLeave,
  isMobile,
  onBack,
}) => (
  <Box sx={{ p: 2, pb: 4 }}>
    {/* Back button */}
    <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.98 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          // mb: 2,
          cursor: "pointer",
          p: 1,
          borderRadius: 1,
          "&:hover": { bgcolor: "action.hover" },
        }}
        onClick={onBack}
      >
        <IconButton size="small" sx={{ mr: 1 }} aria-label="back">
          <ArrowBack color="red" />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          Back to Categories
        </Typography>
      </Box>
    </motion.div>

    <MobileBrandsPanel
      brands={brands}
      loading={loading}
      error={error}
      pagination={pagination}
      activeIndustry={activeIndustry}
      activeSubCategory={activeSubCategory}
      industries={industries}
      isTransitioning={isTransitioning}
      handleLoadMore={handleLoadMore}
      handleBrandClick={handleBrandClick}
      onHoverLeave={onHoverLeave}
      isMobile={isMobile}
    />
  </Box>
);

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════
const SideViewContent = ({ hoverCategory, onHoverLeave, onBrandClick }) => {
  const [industries, setIndustries] = useState([]);
  const [activeIndustry, setActiveIndustry] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);

  // Mobile now has 3 tabs: 0=Industries, 1=SubCategories, 2=Brands
  const [mobileTabValue, setMobileTabValue] = useState(0);
  const [activeIndustryName, setActiveIndustryName] = useState("");

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [availableSubCategories, setAvailableSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState({
    industries: false,
    subcategories: false,
    brands: false,
    loadMore: false,
  });
  const [error, setError] = useState(null);
  const [apiError, setApiError] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
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

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  // ── API calls ────────────────────────────────────────────────────────────
  const fetchInitialData = useCallback(async () => {
    if (!hoverCategory) return;
    setLoading((prev) => ({ ...prev, industries: true }));
    setError(null);
    setApiError(false);
    try {
      const response = await api.post("filter/getAllBrandFiltersdata");
      if (response.data.success) {
        const groups = response.data?.data?.maincat || [];

        setIndustries(groups);
      } else {
        setError(response.data.message || "Failed to load industries");
        setApiError(true);
        setSnackbar({
          open: true,
          message: response.data.message || "Failed to load industries",
          severity: "error",
        });
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to connect to server.";
      setError(msg);
      setApiError(true);
      setSnackbar({ open: true, message: msg, severity: "error" });
      setIndustries([]);
    } finally {
      setLoading((prev) => ({ ...prev, industries: false }));
    }
  }, [hoverCategory]);

  const fetchSubCategories = useCallback(async (industry) => {
    if (!industry) return [];
    setLoading((prev) => ({ ...prev, subcategories: true }));
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("main", industry);
      const response = await api.post(
        `filter/getAllBrandFiltersdata?${queryParams.toString()}`,
      );
      if (response.data.success) {
        return response.data.data.subcat || [];
      }
      return [];
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch subcategories";
      setSnackbar({ open: true, message: msg, severity: "warning" });
      return [];
    } finally {
      setLoading((prev) => ({ ...prev, subcategories: false }));
    }
  }, []);

  const fetchBrands = useCallback(async (filters) => {
    if (!filters.industry && !filters.subcat)
      return {
        brands: [],
        pagination: {
          currentPage: 1,
          limit: 30,
          hasNext: false,
          total: 0,
          totalPages: 0,
          hasPrevious: false,
        },
      };

    setLoading((prev) => ({ ...prev, brands: true }));
    try {
      const params = new URLSearchParams();
      params.append("page", filters.page || 1);
      params.append("limit", filters.limit || 30);
      if (filters.industry) params.append("maincat", filters.industry);
      if (filters.subcat) params.append("subcat", filters.subcat);

      const response = await api.get(
        `filter/getAllBrandsAndFilter?${params.toString()}`,
      );

      if (response.data.success) {
        const normalizedBrands =
          response.data.data?.brands?.map((brand) => ({
            ...brand,
            brandDetails: {
              brandName: "",
              companyName: "",
              ...brand.brandDetails,
            },
            brandfranchisedetails: {
              franchiseDetails: {
                fico: [],
                trainingSupport: [],
                ...brand.brandfranchisedetails?.franchiseDetails,
              },
              ...brand.brandfranchisedetails,
            },
            uploads: { logo: "", ...brand.uploads },
            isLiked: brand?.isLiked || false,
            isShortListed: brand?.isShortListed || false,
          })) || [];

        return {
          brands: normalizedBrands,
          pagination: response.data.data?.pagination || {
            currentPage: filters.page || 1,
            limit: filters.limit || 30,
            hasNext: false,
            total: 0,
            totalPages: 0,
            hasPrevious: false,
          },
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
          hasPrevious: false,
        },
      };
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Failed to fetch brands";
      setSnackbar({ open: true, message: msg, severity: "error" });
      throw new Error(msg);
    } finally {
      setLoading((prev) => ({ ...prev, brands: false }));
    }
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleIndustryHover = async (index, industry) => {
    setActiveIndustry(index);

    setActiveIndustryName(industry);

    setActiveSubCategory(null);

    setBrands([]);

    const subcats = await fetchSubCategories(industry);

    setAvailableSubCategories(subcats);

    const result = await fetchBrands({
      industry,

      page: 1,

      limit: 30,
    });

    setBrands(result.brands);

    setPagination(result.pagination);
  };

  const handleSubCategoryHover = useCallback(
    async (subCategoryName) => {
      if (activeSubCategory !== subCategoryName) {
        setIsTransitioning(true);
        setLoading((prev) => ({ ...prev, brands: true }));
        setError(null);
        setActiveSubCategory(subCategoryName);
        setBrands([]);
        setPagination({
          currentPage: 1,
          limit: 30,
          hasNext: false,
          total: 0,
          totalPages: 0,
          hasPrevious: false,
        });
        try {
          const industry = industries[activeIndustry] || "";
          const result = await fetchBrands({
            industry,
            subcat: subCategoryName,
            page: 1,
            limit: 30,
          });
          setBrands(result.brands || []);
          setPagination(
            result.pagination || {
              currentPage: 1,
              limit: 30,
              hasNext: false,
              total: 0,
              totalPages: 0,
              hasPrevious: false,
            },
          );
        } catch (err) {
          console.error("Failed to fetch brands:", err);
          setError("Failed to fetch brands");
          setBrands([]);
        } finally {
          setIsTransitioning(false);
          setLoading((prev) => ({ ...prev, brands: false }));
        }
      }
    },
    [activeIndustry, activeSubCategory, industries, fetchBrands],
  );

  const handleBrandClick = useCallback(
    (brand) => {
      const brandName =
        brand.brandDetails?.brandName || brand.brandname || "Unknown";
      const brandId = brand.uuid;
      if (onHoverLeave) onHoverLeave();
      if (brandId) {
        const encodedBrandName = encodeURIComponent(brandName);
        navigate.push(
          `/brands/${brandId}?name=${encodedBrandName}`,
        );
      }
      if (onBrandClick) {
        const normalizedBrand = {
          ...brand,
          brandDetails: {
            brandName: "",
            companyName: "",
            ...brand.brandDetails,
          },
          uploads: { logo: "", ...brand.uploads },
        };
        onBrandClick(normalizedBrand);
      }
    },
    [navigate, onBrandClick, onHoverLeave],
  );

  const handleMobileTabChange = useCallback((event, newValue) => {
    setMobileTabValue(newValue);
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (!pagination.hasNext || loading.loadMore) return;
    setLoading((prev) => ({ ...prev, loadMore: true }));
    try {
      const industry = industries[activeIndustry] || "";
      const result = await fetchBrands({
        industry,
        subcat: activeSubCategory,
        page: pagination.currentPage + 1,
        limit: pagination.limit,
      });
      setBrands((prev) => [...prev, ...(result.brands || [])]);
      setPagination(result.pagination || pagination);
    } catch (err) {
      console.error("Failed to load more brands:", err);
      setSnackbar({
        open: true,
        message: "Failed to load more brands",
        severity: "error",
      });
    } finally {
      setLoading((prev) => ({ ...prev, loadMore: false }));
    }
  }, [
    pagination,
    activeIndustry,
    activeSubCategory,
    loading.loadMore,
    industries,
    fetchBrands,
  ]);

  // ── Mobile: select industry → jump to tab 1 ──────────────────────────────
  const handleMobileIndustrySelect = useCallback(
    async (index, industryName) => {
      await handleIndustryHover(index, industryName);
      setMobileTabValue(1);
    },
    [handleIndustryHover],
  );

  // ── Mobile: select subcat → jump to tab 2 ───────────────────────────────
  const handleMobileSubCategorySelect = useCallback(
    async (subCategoryName) => {
      await handleSubCategoryHover(subCategoryName);
      setMobileTabValue(2);
    },
    [handleSubCategoryHover],
  );

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (hoverCategory) fetchInitialData();
  }, [hoverCategory, fetchInitialData]);

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
        hasPrevious: false,
      });
    }
  }, [hoverCategory]);

  // ── Desktop brands content ────────────────────────────────────────────────
  const renderBrandsContent = useMemo(() => {
    if (isTransitioning || (loading.brands && brands.length === 0)) {
      return (
        <Box sx={{ p: 2 }}>
          <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {Array.from({ length: 8 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={3} key={`skeleton-${index}`}>
                <BrandCardSkeleton isMobile={false} />
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
          <Typography variant="body2">Please try again later</Typography>
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
              {industries[activeIndustry] || "Industry"}
              {activeSubCategory ? ` - ${activeSubCategory}` : ""}
            </Typography>
            <Chip
              label={`${brands.length} brands`}
              size="small"
              color="warning"
              variant="outlined"
              sx={{ fontWeight: "bold" }}
            />
          </Box>

          <Grid container spacing={2}>
            {brands.map((brand, index) => {
              const uniqueKey = brand?.uuid
                ? `brand-${brand.uuid}-${index}`
                : `brand-fallback-${index}`;
              return (
                <Grid item xs={12} sm={6} md={3} key={uniqueKey}>
                  <BrandCard
                    brand={brand}
                    onClick={handleBrandClick}
                    isMobile={false}
                    onHoverLeave={onHoverLeave}
                  />
                </Grid>
              );
            })}
            {loading.loadMore &&
              Array.from({ length: 4 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={3} key={`loadmore-${index}`}>
                  <BrandCardSkeleton isMobile={false} />
                </Grid>
              ))}
          </Grid>

          {pagination.hasNext && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleLoadMore}
                disabled={loading.loadMore}
                sx={{ px: 4, py: 1, borderRadius: 2, fontWeight: "bold" }}
              >
                {loading.loadMore ? "Loading..." : "Load More"}
              </Button>
            </Box>
          )}
        </>
      );
    }

    return (
      <Fade in>
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
    loading,
    error,
    pagination,
    activeIndustry,
    activeSubCategory,
    handleLoadMore,
    handleBrandClick,
    isTransitioning,
    industries,
    onHoverLeave,
  ]);

  const renderDesktopMainContent = useMemo(() => {
    if (activeIndustry !== null) return renderBrandsContent;

    return (
      <Fade in>
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
              <Typography variant="body2">Please try again later</Typography>
            </>
          ) : (
            <>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Welcome!
              </Typography>
              <Typography variant="body1" sx={{ maxWidth: 400 }}>
                Hover over an industry to see available subcategories
              </Typography>
            </>
          )}
        </Box>
      </Fade>
    );
  }, [activeIndustry, renderBrandsContent, loading.industries, apiError]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <Drawer
        anchor="top"
        open={hoverCategory !== null}
        onClose={onHoverLeave}
        PaperProps={{
          sx: {
            // KEY FIX: use 100dvh on mobile so the drawer fills the viewport
            // and doesn't get cut off or collapse scrolling
            height: isMobile ? "100dvh" : isTablet ? "65vh" : 500,
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 32px 0 rgba(60,72,88,0.18)",
            border: "1.5px solid rgba(255,255,255,0.25)",
            // KEY FIX: Do NOT put overflow:hidden here on mobile
            overflow: isMobile ? "hidden" : "hidden",
            display: "flex",
            flexDirection: "column",
          },
        }}
        SlideProps={{ timeout: 300 }}
      >
        {/* ── MOBILE LAYOUT ─────────────────────────────────────────────── */}
        {isMobile ? (
          // KEY FIX: The entire mobile layout is a flex column that fills the
          // drawer height. The sticky AppBar does NOT scroll; only the content
          // below it scrolls.
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%", // fill the drawer
              overflow: "hidden", // prevent the wrapper itself from scrolling
            }}
          >
            {/* ── Sticky header ── */}
            <Box sx={{ flexShrink: 0 }}>
              {/* Close button */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  bgcolor: "#ffffff",
                  px: 1,
                  pt: 0.5,
                }}
              >
                <Button
                  onClick={onHoverLeave}
                  sx={{ color: "red" }}
                  aria-label="close drawer"
                >
                  <CloseIcon />
                  CLOSE
                </Button>
              </Box>

              {/* Tabs */}
              <AppBar
                position="static" // KEY FIX: static, not sticky – we handle
                // stickiness via the parent flex layout
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
                    "& .MuiTabs-indicator": {
                      height: 4,
                      backgroundColor: "white",
                    },
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
                    label="Categories"
                    disabled={activeIndustry === null}
                    sx={{
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      textTransform: "none",
                      minHeight: 48,
                    }}
                  />
                  <Tab
                    label="Brands"
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
            </Box>

            {/* ── Scrollable content area ── */}
            {/* KEY FIX: flex:1 + minHeight:0 + overflowY:auto is the correct
                CSS flex-scroll pattern. Without minHeight:0 the child refuses
                to shrink below its content height and scroll never activates. */}
            <Box
              sx={{
                flex: 1,
                minHeight: 0, // ← critical for flex + scroll
                overflowY: "auto",
                overflowX: "hidden",
                WebkitOverflowScrolling: "touch", // smooth scroll on iOS
                bgcolor: "background.default",
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-track": { background: "#eeeeee" },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#ff9800",
                  borderRadius: "10px",
                },
                scrollbarWidth: "thin",
                scrollbarColor: "#ff9800 #eeeeee",
              }}
            >
              {/* Tab panels rendered as plain divs – no extra wrappers */}
              {mobileTabValue === 0 && (
                <MobileIndustriesTab
                  industries={industries}
                  activeIndustry={activeIndustry}
                  loading={loading}
                  apiError={apiError}
                  theme={theme}
                  onSelect={handleMobileIndustrySelect}
                />
              )}
              {mobileTabValue === 1 && (
                <MobileSubCategoriesTab
                  availableSubCategories={availableSubCategories}
                  activeSubCategory={activeSubCategory}
                  activeIndustry={activeIndustry}
                  loading={loading}
                  theme={theme}
                  onBack={() => setMobileTabValue(0)}
                  onSelect={handleMobileSubCategorySelect}
                />
              )}
              {mobileTabValue === 2 && (
                <MobileBrandsTab
                  brands={brands}
                  loading={loading}
                  error={error}
                  pagination={pagination}
                  activeIndustry={activeIndustry}
                  activeSubCategory={activeSubCategory}
                  industries={industries}
                  isTransitioning={isTransitioning}
                  handleLoadMore={handleLoadMore}
                  handleBrandClick={handleBrandClick}
                  onHoverLeave={onHoverLeave}
                  isMobile={isMobile}
                  onBack={() => setMobileTabValue(1)}
                />
              )}
            </Box>
          </Box>
        ) : (
          /* ── DESKTOP LAYOUT ───────────────────────────────────────────── */
          <Box
            onMouseLeave={onHoverLeave}
            sx={{
              display: "flex",
              flexDirection: "row",
              height: "100%",
              overflow: "hidden",
            }}
          >
            {/* Industries column */}
            <Box
              sx={{
                width: 300,
                borderRight: `1px solid ${theme.palette.divider}`,
                overflowY: "auto",
                px: 2,
                py: 2,
                background:
                  "linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)",
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": {
                  background: "#ff9800",
                  borderRadius: "10px",
                },
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
                industries.map((group, groupIndex) => (
                  <Box key={group.heading} sx={{ mb: 3 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#ff6b00",
                        mb: 1,
                        px: 2,
                        fontSize: "18px",
                      }}
                    >
                      {group.heading}
                    </Typography>

                    {group.industries.map((industry, index) => {
                      const uniqueIndex = `${groupIndex}-${index}`;

                      return (
                        <motion.div key={industry} whileHover={{ scale: 1.02 }}>
                          <Box
                            onMouseEnter={() =>
                              handleIndustryHover(uniqueIndex, industry)
                            }
                            sx={{
                              cursor: "pointer",
                              py: 1.5,
                              px: 2,
                              ml: 2,
                              mb: 1,
                              borderRadius: 2,

                              bgcolor:
                                activeIndustry === uniqueIndex
                                  ? "orange"
                                  : "white",

                              color:
                                activeIndustry === uniqueIndex
                                  ? "white"
                                  : "black",

                              transition: "0.3s",

                              "&:hover": {
                                bgcolor: "#ffe7d1",
                              },
                            }}
                          >
                            <Typography>{industry}</Typography>
                          </Box>
                        </motion.div>
                      );
                    })}
                  </Box>
                ))
              ) : apiError ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <ErrorIcon
                    sx={{ fontSize: 48, color: "error.main", mb: 2 }}
                  />
                  <Typography variant="body2" color="error">
                    Failed to load industries
                  </Typography>
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  sx={{ py: 4 }}
                >
                  No industries available
                </Typography>
              )}
            </Box>

            {/* Subcategories column */}
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
                  "&::-webkit-scrollbar": { width: "6px" },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#ff9800",
                    borderRadius: "10px",
                  },
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  mb={2}
                  color="text.secondary"
                >
                  Industry - {activeIndustryName || "Select Industry"}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {loading.subcategories ? (
                  <CategorySkeleton />
                ) : availableSubCategories.length > 0 ? (
                  availableSubCategories.map((subCategory, idx) => (
                    <Grow in timeout={(idx + 1) * 150} key={idx}>
                      <motion.div whileHover={{ scale: 1.02 }}>
                        <Box
                          onMouseEnter={() =>
                            handleSubCategoryHover(subCategory)
                          }
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
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ py: 4 }}
                  >
                    No subcategories available
                  </Typography>
                )}
              </Box>
            )}

            {/* Main brands area */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                px: 3,
                py: 2,
                bgcolor: "background.paper",
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": {
                  background: "#ff9800",
                  borderRadius: "10px",
                },
              }}
            >
              {renderDesktopMainContent}
            </Box>
          </Box>
        )}
      </Drawer>

      {/* Snackbar */}
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
