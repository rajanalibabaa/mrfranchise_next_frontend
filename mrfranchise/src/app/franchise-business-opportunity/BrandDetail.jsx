"use client";
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
  lazy,
  Suspense,
} from "react";
import { useRouter, useSearchParams } from "next/navigation.js";
import {
  Box,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
 
import { useToggleLike } from "../../Hooks/Fetchbrands.jsx";
import { handleShortList } from "../../Api/shortListApi.jsx";
import { toggleBrandLike, toggleBrandShortList } from "../../Redux/Slices/GetAllBrandsDataUpdationFile.jsx";
import { toggleHomeCardLike, toggleHomeCardShortlist } from "../../Redux/Slices/TopCardFetchingSlice.jsx";
import { likeApiFunction } from "@/Api/likeApi.jsx";
import { useDispatch } from "react-redux";
import { getToken } from "@/Utils/autherId.jsx";
import LoginPage from "@/Components/LoginPage/LoginPage.jsx";
 
import BrandHeader from "@/Components/BrandViewPageHandling/BrandHeaderViewPage.jsx";
import MediaSection from "@/Components/BrandViewPageHandling/MediaSectionViewPage.jsx";
import Disclaimer from "@/Components/OverTabHandlings.jsx/DisclimerPage.jsx";
import AdSlot from "@/Components/ads/GoogleAd.jsx";
import { ADS } from "@/config/ads.config.js";
 import { usePathname } from "next/navigation.js";
// LAZY load (secondary) components
const Navbar = lazy(() => import("@/Components/Navbar/NavBar.jsx"));
const Footer = lazy(() => import("@/Components/Footers/Footer.jsx"));
const OverviewTab = lazy(() => import("./OverviewTab.jsx"));
const ExpansionLocationTags = lazy(() => import("@/Components/BrandViewPageHandling/ExpansionLocationTags.jsx"));
const ImageDialog = lazy(() => import("@/Components/BrandViewPageHandling/ImageDialogBoxViewPage.jsx"));
const ApplyDrawer = lazy(() => import("@/Components/BrandViewPageHandling/ApplyDrawerFormViewPage.jsx"));
const BackToTopButton = lazy(() => import("@/Components/BrandViewPageHandling/BackToTopButtonViewPage.jsx"));
const FloatingApplyButton = lazy(() => import("@/Components/BrandViewPageHandling/FloatingApplyButtonViewPage.jsx"));
const SimilarBrands = lazy(() => import("@/Components/HomePage_VideoSection/SimilarBrands.jsx"));
const LikedBrands = lazy(() => import("@/Components/HomePage_VideoSection/LikedBrands.jsx"));
const ViewBrands = lazy(() => import("@/Components/HomePage_VideoSection/ViewBrands.jsx"));
const ShortListedBrands = lazy(() => import("@/Components/HomePage_VideoSection/ShortlistBrands.jsx"));
 
// Lazy-load OverviewTab only when visible
function LazyOverviewTab({ brand }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
 
  useEffect(() => {
    if (!ref.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { rootMargin: "200px" }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
 
  return (
    <Box ref={ref} sx={{ minHeight: 400 }}>
      {visible ? (
        <Suspense fallback={<Box minHeight={200} display="flex" alignItems="center" justifyContent="center"><CircularProgress /></Box>}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <OverviewTab brand={brand} />
          </motion.div>
        </Suspense>
      ) : (
        <Box minHeight={260} />
      )}
    </Box>
  );
}
 
 
 const token = getToken();
 
const BrandDetails = ({ brandData }) => {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const uuid = searchParams.get("uuid");
 const pathname = usePathname();
  // Media queries
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isSmallDesktop = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up("lg"));
 
  // Ref for scrolling
  const mainContainerRef = useRef(null);
 
  // States
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  // console.log("User Data direct:", userData);
  const [anchorEl, setAnchorEl] = useState(null);
  const [locationData, setLocationData] = useState({
    states: [],
    districts: [],
    cities: [],
  });
  // const [localIsLiked, setLocalIsLiked] = useState(brandData[0].isLiked);
const [localIsLiked, setLocalIsLiked] = useState(false);
 
useEffect(() => {
  if (brandData?.[0]) {
    setLocalIsLiked(!!brandData[0].isLiked);
  }
}, [brandData]);
 
 
  const [isProcessingLike, setIsProcessingLike] = useState(false);
  // const [shortListed, setShortListed] = useState(brandData[0].isShortListed);
  const [shortListed, setShortListed] = useState(false);
  useEffect(() => {
    if (brandData?.[0]) {
      setShortListed(!!brandData[0].isShortListed);
    }
  })
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    investorEmail: "",
    mobileNumber: "",
    investmentRange: "",
    state: "",
    district: "",
    city: "",
    planToInvest: "",
    readyToInvest: "",
  });
  const [showLogin, setShowLogin] = useState(false);
  const dispatch = useDispatch();
 
  // Memoized
  const selectedBrand = brandData || {};
  const investorUUID = useMemo(() => localStorage.getItem("investorUUID"), []);
  const AccessToken = useMemo(() => localStorage.getItem("accessToken"), []);
 
 
  const investmentRanges = useMemo(
    () => [
      ...new Set(
        selectedBrand[0]?.brandfranchisedetails?.franchiseDetails?.fico?.map((m) => m.investmentRange) ||
          []
      ),
    ],
    [selectedBrand]
  );
 
  const investmentTimings = useMemo(
    () => ["Immediately", "1 - 3 Months", "3 - 6 Months", "6 + Months"],
    []
  );
 
  const readyToInvestOptions = useMemo(
    () => ["Own Investment", "Going For Loan", "Need Loan Assistance"],
    []
  );
 
  const allVideos = useMemo(() => {
    if (!selectedBrand || selectedBrand.length === 0) return [];
    return selectedBrand[0]?.uploads?.franchiseVideos || [];
  }, [selectedBrand]);
 
  const allImages = useMemo(
    () => [
      ...(selectedBrand[0]?.uploads?.logo
        ? [selectedBrand[0]?.uploads?.logo]
        : []),
      ...(selectedBrand[0]?.uploads?.exteriorOutlet || []),
      ...(selectedBrand[0]?.uploads?.interiorOutlet || []),
    ],
    [selectedBrand]
  );
 
  // Events (useCallback)
  const handleOpenShareClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);
 
  const handleLikeClick = async () => {
    const brandId = brandData[0].uuid;
    if (!token) {
      setShowLogin(true);
      return;
    }
    dispatch(toggleBrandLike(brandId));
    dispatch(toggleHomeCardLike(brandId));
    await likeApiFunction(brandId);
    setLocalIsLiked(!localIsLiked);
  };
 
  const handleToggleShortList = async () => {
    const brandId = brandData[0].uuid;
    if (!token) {
      setShowLogin(true);
      return;
    }
    dispatch(toggleBrandShortList(brandId));
    dispatch(toggleHomeCardShortlist(brandId));
    await handleShortList(brandId);
    setShortListed(!shortListed);
  };
 
  const toggleDrawer = useCallback(
    (open) => (event) => {
      if (
        event.type === "keydown" &&
        (event.key === "Tab" || event.key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    },
    []
  );
 
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);
 
const handleSubmit = useCallback(
  async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
 
    try {
      // Get user ID (investor or brand)
      const id = investorUUID || localStorage.getItem("brandUUID");
      if (!id) {
        alert("User not logged in or missing ID. Please login again.");
        router.push("/registerhandleuser");
        return;
      }
      // Validate selected brand exists
      if (!selectedBrand || selectedBrand.length === 0) {
        alert("No brand selected. Please try again.");
        return;
      }
 
      // Prepare payload with correct field names
      const payload = {
        fullName: formData.fullName,
        email: formData.investorEmail, // Map investorEmail to email
        mobileNumber: formData.mobileNumber,
        state: formData.state || "",
        district: formData.district || "",
        city: formData.city || "",
        investmentRange: formData.investmentRange,
        planToInvest: formData.planToInvest,
        readyToInvest: formData.readyToInvest,
        brandId: selectedBrand[0]?.uuid, // Correctly access brand UUID from array
        brandName: selectedBrand[0]?.brandDetails?.brandName || "",
       
        applyId: id,
      };
 
 
      // Validate required fields
      const requiredFields = [
        "fullName",
        "email",
        "mobileNumber",
        "state",
        // "district",
        // "city",
        "investmentRange",
        "planToInvest",
        "readyToInvest",
      ];
     
      const missingFields = requiredFields.filter(field => !payload[field]);
      if (missingFields.length > 0) {
        alert(`Please fill all required fields: ${missingFields.join(", ")}`);
        return;
      }
 
      console.log(" investore enquiry   Submitting payload:", payload);
 
      // Make API request
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/instantapply/postApplication`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${AccessToken}` // Add auth token if needed
          },
          withCredentials: true,
        }
      );
 
      // console.log("API Response:", response.data);
 
      if (response.data && response.data.success) {
        setSubmitSuccess(true);
        setDrawerOpen(false);
          const whatsappNumber = selectedBrand[0]?.brandDetails?.whatsappnumber;
        const brandName = selectedBrand[0]?.brandDetails?.brandName || "Franchise";
 
        // Reset form
        setFormData({
          fullName: "",
          investorEmail: "",
          mobileNumber: "",
          investmentRange: "",
          state: "",
          district: "",
          city: "",
          planToInvest: "",
          readyToInvest: "",
        });
        alert("✅ Enquiry submitted successfully!");
        const brandUrl = window.location.href;

if (whatsappNumber) {
  const cleanNumber = whatsappNumber.replace(/[\s()-]/g, "");

  const message = encodeURIComponent(
`Hello ${brandName} Team,

I have successfully submitted my enquiry through Mr Franchise and I am interested in learning more about your franchise opportunity.

Brand: ${brandName}
Brand Page: ${brandUrl}

I would appreciate it if your team could share detailed information regarding:
• Investment requirements
• Franchise model
• Expected returns
• Expansion opportunities
• Support and training provided

Looking forward to discussing this opportunity with you.

Thank you.

Submitted via Mr Franchise
https://mrfranchise.in`
  );

  window.open(
    `https://wa.me/${cleanNumber}?text=${message}`,
    "_blank"
  );
        }
      } else {
        throw new Error(response.data?.message || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Submission error:", {
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });
     
      let errorMessage = "❌ Failed to submit application";
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage += ": Please login again";
        } else if (error.response.data?.message) {
          errorMessage += `: ${error.response.data.message}`;
        }
      } else {
        errorMessage += `: ${error.message}`;
      }
     
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  },
  [formData, selectedBrand, investorUUID, router, AccessToken]
);
 
 
  const handleImageOpen = useCallback((index) => {
    setCurrentImageIndex(index);
    setImageModalOpen(true);
  }, []);
 
  const handlePrevImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  }, [allImages.length]);
  const handleNextImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  }, [allImages.length]);
 
  // API: fetch investor and brand as before...
 
  const fetchInvestorDetails = useCallback(async () => {
    if (!investorUUID || !AccessToken) return;
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/investor/getInvestorByUUID/${investorUUID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AccessToken}`,
          },
          signal: AbortSignal.timeout(5000),
        }
      );
      // console.log("Investor Details Response:", response);
      if (response.data?.data) {
        setUserData(response.data.data);
        // console.log("User Data:", setUserData);
        setFormData((prev) => ({
          ...prev,
          fullName: response.data.data.firstName || "",
          investorEmail: response.data.data.email || "",
          mobileNumber: response.data.data.mobileNumber || "",
        }));
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Failed to fetch investor details:", error);
      }
    }
  }, [investorUUID, AccessToken]);
 
 
  useEffect(() => {
    if (investorUUID && AccessToken) {
      const controller = new AbortController();
      fetchInvestorDetails();
      return () => controller.abort();
    }
  }, [fetchInvestorDetails, investorUUID, AccessToken]);
 
  useEffect(() => {
    const locations =
      selectedBrand[0]?.brandexpansionlocationdatas?.expansionLocations?.domestic?.locations || [];
    if (locations.length > 0) {
      const states = [
        ...new Set(locations.map((loc) => loc.state).filter(Boolean)),
      ];
      setLocationData((prev) => ({
        ...prev,
        states,
        districts: [],
        cities: [],
      }));
    }
  }, [selectedBrand]);
 
  useEffect(() => {
    const locations =
      selectedBrand[0]?.brandexpansionlocationdatas?.expansionLocations?.domestic?.locations || [];
    if (formData.state && locations.length > 0) {
      const stateObj = locations.find((loc) => loc.state === formData.state);
      const districts = [
        ...new Set(stateObj?.districts?.map((d) => d.district) || []),
      ];
      setLocationData((prev) => ({
        ...prev,
        districts,
        cities: [],
      }));
      setFormData((prev) => ({
        ...prev,
        district: "",
        city: "",
      }));
    }
  }, [formData.state, selectedBrand]);
 
  useEffect(() => {
    const locations =
      selectedBrand[0]?.brandexpansionlocationdatas?.expansionLocations?.domestic?.locations || [];
    if (formData.state && formData.district && locations.length > 0) {
      const stateObj = locations.find((loc) => loc.state === formData.state);
      const districtObj = stateObj?.districts?.find(
        (d) => d.district === formData.district
      );
      const cities = [...new Set(districtObj?.cities || [])];
      setLocationData((prev) => ({
        ...prev,
        cities,
      }));
      setFormData((prev) => ({
        ...prev,
        city: "",
      }));
    }
  }, [formData.district, formData.state, selectedBrand]);
 
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
 
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
 
  // Utility
  const getImageBoxSize = useCallback(() => {
    if (isMobile) return 120;
    if (isTablet) return 160;
    if (isSmallDesktop) return 180;
    return 204;
  }, [isMobile, isTablet, isSmallDesktop]);
  const getOutletRange = useCallback((value) => {
    const numericValue = Number(value);
    if (isNaN(numericValue)) return "N/A";
    if (numericValue < 10) return "Below 10";
    const lower = Math.floor(numericValue / 10) * 10;
    const upper = lower + 10;
    return `${lower} - ${upper}`;
  }, []);
 if (!brandData || !brandData.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }
 
 
  return (
    <>
      {/* LAZY NAVBAR LOAD */}
      <Suspense fallback={<div style={{height: 60, background: "#fff"}} />}>
        <Navbar />
      </Suspense>
 
      <Box
        ref={mainContainerRef}
        sx={{
          width: "90%",
          maxWidth: 1200,
          mx: "auto",
          my: isMobile ? 2 : 4,
          px: isMobile ? 1 : isTablet ? 3 : 4,
          mt:16.7
        }}
      >
 
          { !drawerOpen && (
            <FloatingApplyButton
              isMobile={isMobile}
              brand={selectedBrand}
              toggleDrawer={toggleDrawer}
            />
          )}
 
          <ApplyDrawer
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            isMobile={isMobile}
            isTablet={isTablet}
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            locationData={locationData}
            investmentRanges={investmentRanges}
            investmentTimings={investmentTimings}
            readyToInvestOptions={readyToInvestOptions}
            selectedBrand={selectedBrand}
            userData={userData}
          />
 
          <BrandHeader
            brand={selectedBrand}
            isMobile={isMobile}
            isTablet={isTablet}
            localIsLiked={localIsLiked}
            isProcessingLike={isProcessingLike}
            shortListed={shortListed}
            handleLikeClick={handleLikeClick}
            handleToggleShortList={handleToggleShortList}
            handleOpenShareClick={handleOpenShareClick}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            toggleDrawer={toggleDrawer}
            getOutletRange={getOutletRange}
          />
 
        {/* <Divider sx={{ my: 1, }} /> */}
 
          <MediaSection
            allVideos={allVideos}
            allImages={allImages}
            isMobile={isMobile}
            isTablet={isTablet}
            getImageBoxSize={getImageBoxSize}
            handleImageOpen={handleImageOpen}
          />
        {/* </Suspense> */}
        {/* <Divider sx={{ my: 1 }} /> */}
 
        <Suspense fallback={<Box minHeight={180}><CircularProgress /></Box>}>
          <LazyOverviewTab brand={selectedBrand} />
        </Suspense>
 
        <Suspense fallback={null}>
          <ImageDialog
            open={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
            isMobile={isMobile}
            allImages={allImages}
            currentImageIndex={currentImageIndex}
            setCurrentImageIndex={setCurrentImageIndex}
            handlePrevImage={handlePrevImage}
            handleNextImage={handleNextImage}
          />
        </Suspense>
      </Box>
 
      {/* LAZY LOAD LIKED/SIMILAR BRANDS */}
      <Suspense fallback={<Box minHeight={120}><CircularProgress /></Box>}>
        <LikedBrands  />
      </Suspense>
      <Suspense fallback={<Box minHeight={120}><CircularProgress /></Box>}>
      <ViewBrands />
        </Suspense>
      <Suspense fallback={<Box minHeight={120}><CircularProgress /></Box>}>
      <ShortListedBrands />
        </Suspense>
      <Suspense fallback={<Box minHeight={120}><CircularProgress /></Box>}>
        <SimilarBrands brandData={selectedBrand} />
      </Suspense>
 
      {/* EXPANSION LOCATIONS LAZY ON SCROLL */}
      <Box
        sx={{
          width: isMobile ?"93%" : isTablet ? "94%" : "89%",
          mx: "auto",
          my: 4,
          px: isMobile ? 1 : isTablet ? 3 : 4,
        }}
        color={"#ff9800"}
      >
         <ExpansionLocationTags
            brand={selectedBrand}
            isMobile={isMobile}
            isTablet={isTablet}
            isSmallDesktop={isSmallDesktop}
            isLargeDesktop={isLargeDesktop}
          />
      </Box>
   
      <Disclaimer isMobile={isMobile} />
 {/* <AdSlot key={pathname} {...ADS.HOME.FOOTER_RECTANGLE} /> */}
      {/* <Suspense fallback={null}>
        <BackToTopButton show={showBackToTop} isMobile={isMobile} />
      </Suspense> */}
      <Suspense fallback={<div style={{height: 300, background: "#eee"}} />}>
        <Footer />
      </Suspense>
 
 
 
 
      {/* Login Dialog */}
      {showLogin && (
        <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </>
  );
};
 
export default React.memo(BrandDetails);
 
