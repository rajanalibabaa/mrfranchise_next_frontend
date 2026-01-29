"use client";
import { useState, useEffect, useMemo } from "react";
import { useTheme, alpha } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";

import { keyframes } from "@emotion/react";

import CheckIcon from "@mui/icons-material/Check";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useRouter } from "next/navigation";
import PaymentPage from "./payment.jsx";
import { getUserId } from "@/Utils/autherId.jsx";
import { api } from "@/Api/api.jsx";
import { GetApiCall } from "@/Api/DefaultApi.jsx";
// import Navbar from '../../../Navbar/NavBar';

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarIcon from "@mui/icons-material/Star";
import BoltIcon from "@mui/icons-material/Bolt";

const userId = getUserId();
// Animation keyframes
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
`;
const glowAnimation = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
  50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); }
`;
const pulseAnimation = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;
const shimmerAnimation = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;
const slideDownAnimation = keyframes`
  0% { transform: translateY(-100px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;
const MembershipSelection = ({}) => {
  const theme = useTheme();
  const navigate = useRouter();
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentPage, setShowPaymentPage] = useState(false);
  const [packages, setPackages] = useState([]);
  const [listingPackages, setListingPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activePackageName, setActivePackageName] = useState(null);
  const [activePackageEnddate, setActivePackageEnddate] = useState(null);

  const activeIndex = useMemo(() => {
    return packages.findIndex(
      (pkg) =>
        activePackageName &&
        pkg.packageName.toLowerCase() === activePackageName.toLowerCase()
    );
  }, [activePackageName, packages]);

  // Check if active package is expired
  const isActivePackageExpired = useMemo(() => {
    if (!activePackageEnddate) return true; // If no active package, treat as expired (enable all)
    const endDate = new Date(activePackageEnddate);
    const currentDate = new Date();
    return endDate <= currentDate;
  }, [activePackageEnddate]);

  useEffect(() => {
    const fetchActivePackages = async () => {
      try {
        const res = await GetApiCall(
          `${api.allBrandsApi.get.getBrandByID}/${userId}`,
          { paymentHistory: true }
        );

        const data = res.data.data;
        if (data && data.activePackage) {
          const activePackageNames = data.activePackage.packageType;
          setActivePackageName(activePackageNames);
          const endDate = data.activePackage.packageEndDate;
          setActivePackageEnddate(endDate);
          // console.log("Active Package Name:", activePackageNames);
          // console.log("Active Package End Date:", endDate);
        }
      } catch (err) {
        console.error("Error fetching active packages:", err);
      }
    };
    fetchActivePackages();
  }, []);
  // console.log("Active Package Name outside useEffect:", activePackageName);
  // Fetch packages from API
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          "https://mrfranchisebackend.mrfranchise.in/api/v1/brandadvertise/payment",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server returned non-JSON response");
        }
        const data = await response.json();
        // Check if data exists and has the expected structure
        if (
          data.success &&
          data.data &&
          Array.isArray(data.data) &&
          data.data.length > 0
        ) {
          const packageData = data.data[0];
          // console.log("Raw Package Data from API:", packageData);

          // Process membership packages from the packages array dynamically
          const membershipPkgs = [];
          if (packageData.packages && Array.isArray(packageData.packages)) {
            membershipPkgs.push(
              ...packageData.packages
                .map((pkg) => {
                  // Skip if packageName is 'free'
                  if (pkg.packageName.toLowerCase() === "free") {
                    return null;
                  }
                  // Capitalize and format display name (e.g., 'basicPro' -> 'Basic Pro')
                  const displayName = pkg.packageName
                    .replace(/([a-z])([A-Z])/g, "$1 $2")
                    .replace(/\b\w/g, (l) => l.toUpperCase());
                  return {
                    ...pkg,
                    name: displayName,
                    packageName: pkg.packageName, // Keep original for config lookup
                    _id: pkg._id,
                  };
                })
                .filter(Boolean)
            ); // Filter out null entries (free packages)
          }
          // Extract listing packages from array
          const listingPkgs = [];
          if (
            packageData.listingPackages &&
            Array.isArray(packageData.listingPackages)
          ) {
            listingPkgs.push(
              ...packageData.listingPackages.map((pkg) => ({
                ...pkg,
                name: `Listing - ${pkg.periodMonths || 0} Months`,
              }))
            );
          }
          // console.log("Processed Membership Packages:", membershipPkgs);
          // console.log("Processed Listing Packages:", listingPkgs);
          setPackages(membershipPkgs);
          setListingPackages(listingPkgs);
        } else {
          throw new Error("Invalid data structure received from API");
        }
      } catch (err) {
        console.error("Error fetching packages:", err);
        setError(err.message);
        setPackages([]);
        setListingPackages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);
  const tierConfig = {
    free: {
      color: "#000000",
      badgeColor: "#9ca3af",
      popular: false,
      icon: <CheckCircleIcon />,
      gradient: "linear-gradient(135deg, #ffffff, #f8f9fa)",
      badgeGradient: "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
      shineGradient:
        "linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)",
    },

    basic: {
      color: "#000000",
      badgeColor: "#C0C0C0",
      popular: false,
      icon: <WorkspacePremiumOutlinedIcon />,
      gradient: "linear-gradient(135deg, #f5f5f5, #e5e5e5)",
      badgeGradient: "linear-gradient(135deg, #e5e5e5, #d4d4d4)",
      shineGradient:
        "linear-gradient(90deg, transparent, rgba(192,192,192,0.1), transparent)",
    },

    basicPro: {
      color: "#FFD700",
      badgeColor: "#FFD700",
      popular: true,
      icon: <WorkspacePremiumIcon />, // ⭐ NEW PREMIUM ICON
      gradient: "linear-gradient(135deg, #fff8dc, #f0e68c)",
      badgeGradient: "linear-gradient(135deg, #fff8dc, #ffd700)",
      shineGradient:
        "linear-gradient(90deg, transparent, rgba(255,215,0,0.1), transparent)",
    },

    silver: {
      color: "#000000",
      badgeColor: "#9ca3af",
      popular: false,
      icon: <MilitaryTechIcon />,
      gradient: "linear-gradient(135deg, #ffffff, #f8f9fa)",
      badgeGradient: "linear-gradient(135deg, #e5e7eb, #d1d5db)",
      shineGradient:
        "linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)",
    },

    gold: {
      color: "#000000",
      badgeColor: "#d4b01e",
      popular: true,
      icon: <EmojiEventsIcon />,
      gradient: "linear-gradient(135deg, #ffffff, #f8f9fa)",
      badgeGradient: "linear-gradient(135deg, #fef3c7, #fde68a)",
      shineGradient:
        "linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)",
    },

    platinum: {
      color: "#000000",
      badgeColor: "#a5b4fc",
      popular: false,
      icon: <StarIcon />,
      gradient: "linear-gradient(135deg, #ffffff, #f8f9fa)",
      badgeGradient: "linear-gradient(135deg, #e0e7ff, #c7d2fe)",
      shineGradient:
        "linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)",
    },

    exclusive: {
      color: "#000000",
      badgeColor: "#f59e0b",
      popular: false,
      icon: <BoltIcon />,
      gradient: "linear-gradient(135deg, #ffffff, #f8f9fa)",
      badgeGradient: "linear-gradient(135deg, #fef3c7, #fcd34d)",
      shineGradient:
        "linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)",
    },
  };
  const listingConfig = {
    color: "#065f46",
    badgeColor: "#10b981",
    popular: false,
    icon: <CheckIcon />,
    gradient: "linear-gradient(135deg, #ffffff, #f8f9fa)",
    badgeGradient: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
    shineGradient:
      "linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.1), transparent)",
  };
  const handlePlanSelect = (pkg, isListing = false) => {
    let config;
    if (isListing) {
      config = listingConfig;
      const newSelected = {
        ...pkg,
        tier: "Listing",
        isListingPackage: true,
        color: config.badgeColor,
        gradient: config.badgeGradient,
        description: `Listing - ${pkg.periodMonths} Months`,
        price: pkg.amount,
      };
      setSelectedListing(selectedListing?._id === pkg._id ? null : newSelected);
      setSelectedPlan(newSelected);
    } else {
      // Use original packageName for config lookup
      const configKey = pkg.packageName.toLowerCase();
      config = tierConfig[configKey] || tierConfig["free"];
      const newSelected = {
        ...pkg,
        tier: pkg.name,
        isListingPackage: false,
        color: config.badgeColor,
        gradient: config.badgeGradient,
        description: `${pkg.name} Package`,
        price: pkg.totalAmount,
      };
      setSelectedMembership(
        selectedMembership?._id === pkg._id ? null : newSelected
      );
      setSelectedPlan(newSelected);
    }
  };
  const handleContinueToPayment = () => {
    if (selectedPlan) {
      // console.log("Opening payment page with plan:", selectedPlan);
      setShowPaymentPage(true);
    } else {
      console.error("No plan selected");
      alert("Please select a plan first");
    }
  };
  // const handleBack = () => {
  // navigate(-1); // Go back to the previous page
  // };
  const clearSelection = () => {
    setSelectedMembership(null);
    setSelectedListing(null);
    setSelectedPlan(null);
  };
  const LoadingState = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 400,
        flexDirection: "column",
        gap: 3,
      }}
    >
      <CircularProgress
        size={60}
        sx={{
          animation: `${glowAnimation} 2s ease-in-out infinite`,
        }}
      />
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{
          background: "linear-gradient(90deg, #666, #999, #666)",
          backgroundSize: "200% 100%",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: `${shimmerAnimation} 2s infinite linear`,
        }}
      >
        Loading amazing packages for you...
      </Typography>
    </Box>
  );
  const ErrorState = ({ error }) => (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Alert
        severity="error"
        sx={{
          borderRadius: 3,
          animation: `${pulseAnimation} 2s ease-in-out infinite`,
          "& .MuiAlert-message": {
            width: "100%",
          },
        }}
      >
        <Typography variant="h6" gutterBottom>
          Oops! Something went wrong
        </Typography>
        <Typography variant="body2">{error}</Typography>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </Alert>
    </Container>
  );
  if (loading) {
    return <LoadingState />;
  }
  if (error) {
    return <ErrorState error={error} />;
  }
  // Show PaymentPage if user clicked "Continue to Payment"
  if (showPaymentPage && selectedPlan) {
    return (
      <PaymentPage
        selectedMembership={selectedMembership}
        selectedListing={selectedListing}
        selectedPlan={selectedPlan}
      />
    );
  }
  return (
    <Box>
      <Container maxWidth="xl" sx={{ py: 2, position: "relative" }}>
        {/* Back Button */}
        {/*
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{ textTransform: 'none',bgcolor: "#f0a729ff",color: "#000000" }}
          >
            Back to Form
          </Button>
        </Box> */}

        {/* Center Page Floating Summary Box */}
        {selectedPlan && (
          <Fade in>
            <Box
              sx={{
                position: "fixed",
                top: "20%",
                left: "35%",
                transform: "translate(-50%, -50%)",
                width: "90%",
                maxWidth: 500,
                background: `linear-gradient(135deg, ${alpha(
                  selectedPlan.color,
                  0.95
                )}, ${alpha(selectedPlan.color, 0.85)})`,
                borderRadius: 3,
                border: `2px solid ${alpha(selectedPlan.color, 0.5)}`,
                textAlign: "center",
                zIndex: 1000,
                boxShadow: `0 20px 60px ${alpha(selectedPlan.color, 0.4)}`,
                animation: `${slideDownAnimation} 0.5s ease-out, ${pulseAnimation} 3s ease-in-out infinite`,
                backdropFilter: "blur(10px)",
                color: theme.palette.getContrastText(selectedPlan.color),
                overflow: "hidden",
              }}
            >
              {/* Header Section */}
              <Box sx={{ p: 3, pb: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${alpha(
                      "#ffffff",
                      0.2
                    )}, ${alpha("#ffffff", 0.1)})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    border: `2px solid ${alpha("#ffffff", 0.3)}`,
                    animation: `${floatAnimation} 3s ease-in-out infinite`,
                  }}
                >
                  <AutoAwesomeIcon sx={{ color: "white", fontSize: 28 }} />
                </Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  🎉 Excellent Choice!
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                  You've selected the{" "}
                  <strong>{selectedPlan.description}</strong>
                </Typography>
                {/* Price Display */}
                <Box
                  sx={{
                    background: `linear-gradient(135deg, ${alpha(
                      "#ffffff",
                      0.2
                    )}, ${alpha("#ffffff", 0.1)})`,
                    p: 2,
                    borderRadius: 2,
                    border: `1px solid ${alpha("#ffffff", 0.2)}`,
                    mb: 2,
                  }}
                >
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    ₹{selectedPlan.price}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Amount
                  </Typography>
                </Box>
                {/* Plan Details - Only show for membership packages */}
                {!selectedPlan.isListingPackage && (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    <Box textAlign="center">
                      <Typography
                        variant="body2"
                        sx={{ opacity: 0.8, fontSize: "0.75rem" }}
                      >
                        Duration
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        fontSize="0.9rem"
                      >
                        {selectedPlan.totalMonths} months
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography
                        variant="body2"
                        sx={{ opacity: 0.8, fontSize: "0.75rem" }}
                      >
                        Monthly Leads
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        fontSize="0.9rem"
                      >
                        {selectedPlan.perMonthLead}
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography
                        variant="body2"
                        sx={{ opacity: 0.8, fontSize: "0.75rem" }}
                      >
                        Total Leads
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        fontSize="0.9rem"
                      >
                        {selectedPlan.totalLeads}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
              {/* Buttons Section - Fixed at bottom */}
              <Box
                sx={{
                  background: alpha("#000000", 0.1),
                  p: 2,
                  borderTop: `1px solid ${alpha("#ffffff", 0.2)}`,
                }}
              >
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button
                    variant="outlined"
                    size="medium"
                    onClick={clearSelection}
                    sx={{
                      borderColor: "white",
                      color: "white",
                      fontWeight: "bold",
                      flex: 1,
                      py: 1,
                      "&:hover": {
                        backgroundColor: alpha("#ffffff", 0.1),
                        borderColor: "white",
                      },
                    }}
                  >
                    Back to Plans
                  </Button>
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={handleContinueToPayment}
                    sx={{
                      background: "linear-gradient(135deg, #ffffff, #f0f0f0)",
                      color: selectedPlan.color,
                      fontWeight: "bold",
                      boxShadow: `0 4px 15px ${alpha("#000000", 0.2)}`,
                      flex: 1,
                      py: 1,
                      "&:hover": {
                        background: "linear-gradient(135deg, #f0f0f0, #e0e0e0)",
                        transform: "translateY(-2px)",
                        boxShadow: `0 6px 20px ${alpha("#000000", 0.3)}`,
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Continue to Payment
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Fade>
        )}
        {/* Overlay when summary is shown */}
        {selectedPlan && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: alpha("#000000", 0.5),
              zIndex: 999,
              backdropFilter: "blur(2px)",
            }}
            onClick={clearSelection}
          />
        )}
        {/* Main Content */}
        <Box>
          {/* Header Section */}
          <Box textAlign="center" mb={4}>
            <Typography
              variant="h2"
              fontWeight="bold"
              gutterBottom
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                backgroundSize: "200% 200%",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "2.1rem", md: "3rem" },
                animation: `${shimmerAnimation} 3s ease-in-out infinite`,
              }}
            >
              Choose Your Perfect Plan
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: 600,
                mx: "auto",
                fontSize: { xs: "1rem", md: "1.10rem" },
                lineHeight: 1.6,
              }}
            >
              Scale your business with our flexible packages. All plans include
              essential features with no hidden fees.
            </Typography>
          </Box>
          {/* Membership Packages */}
          <Grid container spacing={4} justifyContent="center" mb={10}>
            {packages.map((pkg, index) => {
              // Use original packageName for config lookup
              const configKey = pkg.packageName.toLowerCase();
              const config = tierConfig[configKey] || tierConfig["free"];
              const isSelected = selectedMembership?._id === pkg._id;
              const isPopular = config.popular;
              const isHovered = hoveredCard === pkg._id;
              const isActive =
                activePackageName &&
                pkg.packageName.toLowerCase() ===
                  activePackageName.toLowerCase();
              // Only disable if package is not expired and this is a lower/equal tier
              const isDisabled =
                !isActivePackageExpired &&
                activeIndex >= 0 &&
                index <= activeIndex;
              // console.log("Active Index:", isActivePackageExpired);
              return (
                <Grid item xs={12} md={6} lg={4} key={pkg._id}>
                  <Fade
                    in
                    timeout={800}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <Card
                      onMouseEnter={
                        isDisabled ? undefined : () => setHoveredCard(pkg._id)
                      }
                      onMouseLeave={
                        isDisabled ? undefined : () => setHoveredCard(null)
                      }
                      onClick={
                        isDisabled ? undefined : () => handlePlanSelect(pkg)
                      }
                      sx={{
                        height: "100%",
                        border: isSelected
                          ? `3px solid ${config.badgeColor}`
                          : "2px solid #e5e7eb",
                        borderColor: isSelected ? config.badgeColor : "#e5e7eb",
                        background: config.gradient,
                        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                        position: "relative",
                        overflow: "hidden",
                        boxShadow: isSelected
                          ? `0 25px 50px -12px ${alpha(
                              config.badgeColor,
                              0.4
                            )}, 0 0 30px ${alpha(config.badgeColor, 0.3)}`
                          : "0 8px 25px rgba(0, 0, 0, 0.1)",
                        animation: isPopular
                          ? `${floatAnimation} 3s ease-in-out infinite`
                          : "none",
                        transform: isHovered
                          ? "translateY(-15px) scale(1.02)"
                          : "translateY(0px) scale(1)",
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        opacity: isDisabled ? 0.6 : 1,
                        pointerEvents: isDisabled ? "none" : "auto",
                        "&:hover": {
                          transform: isDisabled
                            ? "none"
                            : "translateY(-15px) scale(1.02)",
                          boxShadow: isDisabled
                            ? "none"
                            : `0 40px 80px -20px ${alpha(
                                config.badgeColor,
                                0.3
                              )}, 0 0 40px ${alpha(config.badgeColor, 0.2)}`,
                          borderColor: isDisabled
                            ? "#e5e7eb"
                            : config.badgeColor,
                        },
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: "-100%",
                          width: "100%",
                          height: "100%",
                          background: config.shineGradient,
                          transition: "left 0.8s ease",
                          zIndex: 1,
                        },
                        "&:hover::before": {
                          left: isDisabled ? "-100%" : "100%",
                        },
                      }}
                      // disabled={isDisabled}
                    >
                      {/* Animated Background Elements */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: -50,
                          right: -50,
                          width: 100,
                          height: 100,
                          borderRadius: "50%",
                          background: `radial-gradient(circle, ${alpha(
                            config.badgeColor,
                            0.1
                          )} 0%, transparent 70%)`,
                          animation: `${floatAnimation} 4s ease-in-out infinite`,
                          animationDelay: `${index * 0.5}s`,
                        }}
                      />
                      {/* Active Badge */}
                      {isActive && !isActivePackageExpired && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 7,
                            left: 6,
                            background:
                              "linear-gradient(135deg, #10b981, #059669)",
                            color: "white",
                            px: 0.5,
                            py: 0.4,
                            borderRadius: 3,
                            fontSize: "0.6rem",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                            zIndex: 2,
                            animation: `${pulseAnimation} 2s ease-in-out infinite`,
                            boxShadow: `0 4px 12px rgba(16, 185, 129, 0.3)`,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <CheckIcon sx={{ fontSize: 12, mr: 0.5 }} />
                          Active
                        </Box>
                      )}
                      {/* Popular Badge */}
                      {isPopular && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: -4,
                            left: "60%",
                            transform: "translateX(-50%)",
                            background: config.badgeGradient,
                            color: theme.palette.getContrastText(
                              config.badgeColor
                            ),
                            px: 1,
                            py: 0.5,
                            borderRadius: 4,
                            fontSize: "0.60rem",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                            letterSpacing: 1,
                            boxShadow: `0 8px 20px ${alpha(
                              config.badgeColor,
                              0.4
                            )}`,
                            zIndex: 2,
                            animation: `${pulseAnimation} 2s ease-in-out infinite`,
                          }}
                        >
                          <TrendingUpIcon sx={{ fontSize: 16, mr: 1 }} />
                          Most Popular
                        </Box>
                      )}
                      {/* Selection Glow Effect */}
                      {isSelected && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: -2,
                            left: -2,
                            right: -2,
                            bottom: -2,
                            borderRadius: "inherit",
                            background: `conic-gradient(from 0deg, ${
                              config.badgeColor
                            }, ${alpha(config.badgeColor, 0.3)}, ${
                              config.badgeColor
                            })`,
                            animation: `${glowAnimation} 2s ease-in-out infinite`,
                            zIndex: 0,
                          }}
                        />
                      )}
                      <CardContent
                        sx={{
                          p: 2,
                          height: "50%",
                          display: "flex",
                          flexDirection: "column",
                          position: "relative",
                          zIndex: 2,
                          background: "transparent",
                        }}
                      >
                        {/* Header */}
                        <Box textAlign="center">
                          <Box
                            sx={{
                              width: 60,
                              height: 60,
                              borderRadius: "50%",
                              background: config.badgeGradient,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: "0 auto 20px",
                              color: theme.palette.getContrastText(
                                config.badgeColor
                              ),
                              boxShadow: `0 12px 30px ${alpha(
                                config.badgeColor,
                                0.4
                              )}`,
                              position: "relative",
                              overflow: "hidden",
                              animation: `${
                                isHovered ? pulseAnimation : "none"
                              } 1s ease-in-out`,
                              "&::before": {
                                content: '""',
                                position: "absolute",
                                top: "-50%",
                                left: "-50%",
                                width: "200%",
                                height: "200%",
                                background:
                                  "linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)",
                                transform: "rotate(45deg)",
                                transition: "all 0.6s ease",
                              },
                              "&:hover::before": {
                                transform: "rotate(45deg) translate(50%, 50%)",
                              },
                            }}
                          >
                            {config.icon}
                          </Box>
                          <Typography
                            variant="h5"
                            fontWeight="bold"
                            gutterBottom
                            sx={{
                              color: config.color,
                            }}
                          >
                            {pkg.name}
                          </Typography>
                        </Box>
                        {/* Price with floating animation */}
                        <Box
                          textAlign="center"
                          sx={{
                            animation: isHovered
                              ? `${floatAnimation} 1s ease-in-out`
                              : "none",
                          }}
                        >
                          <Typography
                            variant="h1"
                            fontWeight="bold"
                            sx={{
                              fontSize: "2rem",
                              color: config.color,
                              textShadow: `0 4px 8px ${alpha(
                                config.badgeColor,
                                0.2
                              )}`,
                            }}
                          >
                            ₹{pkg.totalAmount}
                          </Typography>
                        </Box>
                        <Divider
                          sx={{
                            my: 1,
                            background: `linear-gradient(90deg, transparent, ${config.badgeColor}, transparent)`,
                            height: 2,
                            border: "none",
                          }}
                        />
                        {/* Key Metrics with staggered animations */}
                        <Stack spacing={0} mb={2}>
                          {[
                            {
                              label: "Monthly Leads:",
                              value: pkg.perMonthLead,
                            },
                            { label: "Total Leads:", value: pkg.totalLeads },
                            { label: "Total Months:", value: pkg.totalMonths },
                          ].map((metric, metricIndex) => (
                            <Box
                              key={metric.label}
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              sx={{
                                animation: isHovered
                                  ? `${floatAnimation} 0.6s ease-in-out ${
                                      metricIndex * 0.1
                                    }s both`
                                  : "none",
                                transition: "all 0.3s ease",
                                padding: "8px 12px",
                                borderRadius: 2,
                                background: isHovered
                                  ? alpha(config.badgeColor, 0.05)
                                  : "transparent",
                                transform: isHovered
                                  ? "translateX(5px)"
                                  : "translateX(0)",
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {metric.label}
                              </Typography>
                              <Typography
                                variant="body1"
                                fontWeight="bold"
                                sx={{
                                  color: config.color,
                                }}
                              >
                                {metric.value}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                        {/* Select Button with enhanced effects */}
                        <Button
                          fullWidth
                          variant={isSelected ? "contained" : "outlined"}
                          disabled={isDisabled}
                          startIcon={
                            isSelected ? <CheckIcon /> : <AutoAwesomeIcon />
                          }
                          sx={{
                            py: 2,
                            borderRadius: 3,
                            fontSize: "1.1rem",
                            fontWeight: "bold",
                            background: isSelected
                              ? config.badgeGradient
                              : "transparent",
                            border: isSelected
                              ? "none"
                              : `2px solid ${config.badgeColor}`,
                            color: isSelected
                              ? theme.palette.getContrastText(config.badgeColor)
                              : config.badgeColor,
                            position: "relative",
                            overflow: "hidden",
                            transform: isHovered ? "scale(1.05)" : "scale(1)",
                            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                            boxShadow: isSelected
                              ? `0 8px 25px ${alpha(config.badgeColor, 0.4)}`
                              : `0 4px 15px ${alpha(config.badgeColor, 0.2)}`,
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              left: "-100%",
                              width: "100%",
                              height: "100%",
                              background:
                                "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                              transition: "left 0.8s ease",
                            },
                            "&:hover": {
                              background: isSelected
                                ? config.badgeGradient
                                : alpha(config.badgeColor, 0.1),
                              transform: "scale(1.05)",
                              boxShadow: `0 12px 35px ${alpha(
                                config.badgeColor,
                                0.5
                              )}`,
                              "&::before": {
                                left: "100%",
                              },
                            },
                            "&:active": {
                              transform: "scale(0.98)",
                            },
                            "&.Mui-disabled": {
                              backgroundColor: "rgba(0, 0, 0, 0.12)",
                              color: "rgba(0, 0, 0, 0.26)",
                              borderColor: "rgba(0, 0, 0, 0.12)",
                            },
                          }}
                        >
                          {!isDisabled && !isActivePackageExpired
                            ? "Upgrade"
                            : "Select"}
                        </Button>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              );
            })}
          </Grid>
          {/* Listing Packages */}
        </Box>
      </Container>
    </Box>
  );
};
export default MembershipSelection;

//  {listingPackages.length > 0 && (
//         <Box mb={8}>
//           <Box textAlign="center" mb={6}>
//             <Typography
//               variant="h3"
//               fontWeight="bold"
//               gutterBottom
//               sx={{
//                 color: '#000000',
//               }}
//             >
//               Listing Packages
//             </Typography>
//             <Typography variant="h6" color="text.secondary">
//               Simple listing solutions for your business
//             </Typography>
//           </Box>
//           <Grid container spacing={3} justifyContent="center">
//             {listingPackages.map((pkg, index) => {
//               const isSelected = selectedListing?._id === pkg._id;
//               const config = listingConfig;
//               const isHovered = hoveredCard === pkg._id;
//               return (
//                 <Grid item xs={12} md={8} lg={6} key={pkg._id}>
//                   <Fade in timeout={800} style={{ transitionDelay: `${index * 100}ms` }}>
//                     <Card
//                       onMouseEnter={() => setHoveredCard(pkg._id)}
//                       onMouseLeave={() => setHoveredCard(null)}
//                       onClick={() => handlePlanSelect(pkg, true)}
//                       sx={{
//                         border: isSelected ? `3px solid ${config.badgeColor}` : '2px solid #e5e7eb',
//                         borderColor: isSelected ? config.badgeColor : '#e5e7eb',
//                         background: config.gradient,
//                         transition: 'all 0.4s ease',
//                         position: 'relative',
//                         overflow: 'hidden',
//                         cursor: 'pointer',
//                         '&:hover': {
//                           transform: 'translateY(-8px) scale(1.02)',
//                           boxShadow: `0 25px 50px -12px ${alpha(config.badgeColor, 0.3)}`,
//                           borderColor: config.badgeColor,
//                         },
//                         transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
//                         '&::before': {
//                           content: '""',
//                           position: 'absolute',
//                           top: 0,
//                           left: '-100%',
//                           width: '100%',
//                           height: '100%',
//                           background: config.shineGradient,
//                           transition: 'left 0.8s ease',
//                           zIndex: 1,
//                         },
//                         '&:hover::before': {
//                           left: '100%',
//                         }
//                       }}
//                     >
//                       {/* Selection Glow Effect */}
//                       {isSelected && (
//                         <Box
//                           sx={{
//                             position: 'absolute',
//                             top: -2,
//                             left: -2,
//                             right: -2,
//                             bottom: -2,
//                             borderRadius: 'inherit',
//                             background: `conic-gradient(from 0deg, ${config.badgeColor}, ${alpha(config.badgeColor, 0.3)}, ${config.badgeColor})`,
//                             animation: `${glowAnimation} 2s ease-in-out infinite`,
//                             zIndex: 0,
//                           }}
//                         />
//                       )}
//                       {/* Selection Indicator */}
//                       {isSelected && (
//                         <Box
//                           sx={{
//                             position: 'absolute',
//                             top: 19,
//                             right: 20,
//                             width: 24,
//                             height: 24,
//                             borderRadius: '50%',
//                             background: config.badgeGradient,
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             zIndex: 2,
//                             animation: `${pulseAnimation} 2s ease-in-out infinite`,
//                           }}
//                         >
//                           <CheckIcon sx={{ fontSize: 16, color: config.color }} />
//                         </Box>
//                       )}
//                       <CardContent sx={{ p: 4, position: 'relative', zIndex: 2 }}>
//                         <Box mb={3}>
//                           <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: config.color }}>
//                             {pkg.name}
//                           </Typography>
//                         </Box>
//                         <Box
//                           sx={{
//                             background: config.badgeGradient,
//                             p: 3,
//                             borderRadius: 2,
//                             textAlign: 'center',
//                             mb: 3,
//                             position: 'relative',
//                             overflow: 'hidden',
//                             transform: isHovered ? 'scale(1.05)' : 'scale(1)',
//                             transition: 'transform 0.3s ease',
//                             '&::before': {
//                               content: '""',
//                               position: 'absolute',
//                               top: 0,
//                               left: '-100%',
//                               width: '100%',
//                               height: '100%',
//                               background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
//                               transition: 'left 0.8s ease',
//                             },
//                             '&:hover::before': {
//                               left: '100%',
//                             }
//                           }}
//                         >
//                           <Typography variant="h2" fontWeight="bold" sx={{ color: config.color }} gutterBottom>
//                             ₹{pkg.amount}
//                           </Typography>
//                         </Box>
//                         <Stack direction="row" spacing={4} justifyContent="center">
//                           <Box textAlign="center">
//                             <Typography variant="body2" color="text.secondary">Duration</Typography>
//                             <Typography variant="h6" fontWeight="bold" sx={{ color: config.color }}>
//                               {pkg.periodMonths} Months
//                             </Typography>
//                           </Box>
//                         </Stack>
//                         {/* Select Button with enhanced effects - Added for consistency */}
//                         <Button
//                           fullWidth
//                           variant={isSelected ? "contained" : "outlined"}
//                           startIcon={isSelected ? <CheckIcon /> : <AutoAwesomeIcon />}
//                           sx={{
//                             py: 2,
//                             mt: 2,
//                             borderRadius: 3,
//                             fontSize: '1.1rem',
//                             fontWeight: 'bold',
//                             background: isSelected ? config.badgeGradient : 'transparent',
//                             border: isSelected ? 'none' : `2px solid ${config.badgeColor}`,
//                             color: isSelected ? theme.palette.getContrastText(config.badgeColor) : config.badgeColor,
//                             position: 'relative',
//                             overflow: 'hidden',
//                             transform: isHovered ? 'scale(1.05)' : 'scale(1)',
//                             transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
//                             boxShadow: isSelected ?
//                               `0 8px 25px ${alpha(config.badgeColor, 0.4)}` :
//                               `0 4px 15px ${alpha(config.badgeColor, 0.2)}`,
//                             '&::before': {
//                               content: '""',
//                               position: 'absolute',
//                               top: 0,
//                               left: '-100%',
//                               width: '100%',
//                               height: '100%',
//                               background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
//                               transition: 'left 0.8s ease',
//                             },
//                             '&:hover': {
//                               background: isSelected ? config.badgeGradient : alpha(config.badgeColor, 0.1),
//                               transform: 'scale(1.05)',
//                               boxShadow: `0 12px 35px ${alpha(config.badgeColor, 0.5)}`,
//                               '&::before': {
//                                 left: '100%',
//                               }
//                             },
//                             '&:active': {
//                               transform: 'scale(0.98)',
//                             }
//                           }}
//                         >
//                           {isSelected ? 'Selected' : 'Select Plan'}
//                         </Button>
//                       </CardContent>
//                     </Card>
//                   </Fade>
//                 </Grid>
//               );
//             })}
//           </Grid>
//         </Box>
//       )}
