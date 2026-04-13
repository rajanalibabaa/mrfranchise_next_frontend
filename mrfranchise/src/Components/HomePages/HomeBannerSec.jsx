"use client";

import React, {
  useState,
  useEffect,
  Suspense,
  useCallback,
  memo,
  useMemo,
  lazy,
  startTransition,
} from "react";
import { useInView } from "react-intersection-observer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import { useMediaQuery, useTheme } from "@mui/material";
import dynamic from "next/dynamic";
import Image from "next/image";

// ============================================
// CRITICAL COMPONENTS - Load immediately
// ============================================
const Navbar = dynamic(() => import("@/Components/Navbar/NavBar"), {
  ssr: true,
  loading: () => <Box sx={{ height: 64, bgcolor: "#1a1a1a" }} />,
});

const FilterDropdowns = dynamic(
  () => import("@/Components/Navbar/FilterDropdownsData"),
  { ssr: false }
);

// ============================================
// NON-CRITICAL COMPONENTS - Lazy load
// ============================================
const Footer = dynamic(() => import("@/Components/Footers/Footer"), {
  ssr: false,
  loading: () => null,
});

const PopupModal = dynamic(() => import("@/Components/PopUpModal/PopUpModal"), {
  ssr: false,
});

const CompareButton = dynamic(() => import("./CompareButtonsCompenents"), {
  ssr: false,
});

const BrandComparison = dynamic(() => import("./brandCompariosn"), {
  ssr: false,
});

// ============================================
// SKELETON LOADER COMPONENT
// ============================================
const SectionSkeleton = memo(({ height = 200 }) => (
  <Box
    sx={{
      width: "100%",
      minHeight: height,
      // p: 2,
      contain: "layout style paint",
    }}
  >
    <Skeleton
      variant="rounded"
      width="100%"
      height={height}
      animation="wave"
      // sx={{ borderRadius: 2, bgcolor: "rgba(0, 0, 0, 0.13)" }}
    />
  </Box>
));

// ============================================
// ERROR BOUNDARY
// ============================================
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Section Error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <Box sx={{ minHeight: 100, bgcolor: "#f5f5f5" }} />;
    }
    return this.props.children;
  }
}

// ============================================
// SECTION COMPONENT MAP - Centralized lazy loading
// ============================================
const SECTION_COMPONENTS = {
  TopBrandThreeVdoCards: {
    component: dynamic(
      () => import("@/Components/HomePage_VideoSection/TopBrandThreeVdoCards"),
      { ssr: true, loading: () => <SectionSkeleton height={400} /> }
    ),
    // priority: 1,
    height: 400,
  },
  HomeSection1: {
    component: dynamic(
      () => import("@/Components/HomePage_VideoSection/HomeSection1"),
      { ssr: false, loading: () => <SectionSkeleton height={350} /> }
    ),
    // priority: 1,
    height: 350,
  },
  HomeSection2: {
    component: dynamic(
      () => import("@/Components/HomePage_VideoSection/HomeSection2"),
      { ssr: false, loading: () => <SectionSkeleton height={350} /> }
    ),
    priority: 2,
    height: 350,
  },
  LikedBrands: {
    component: dynamic(
      () => import("@/Components/HomePage_VideoSection/LikedBrands"),
      { ssr: false, loading: () => <SectionSkeleton height={300} /> }
    ),
    // priority: 2,
    height: 300,
    requiresAuth: true,
  },
  ShortlistBrands: {
    component: dynamic(
      () => import("@/Components/HomePage_VideoSection/ShortlistBrands"),
      { ssr: false, loading: () => <SectionSkeleton height={300} /> }
    ),
    // priority: 2,
    height: 300,
    requiresAuth: true,
  },
  ViewBrands: {
    component: dynamic(
      () => import("@/Components/HomePage_VideoSection/ViewBrands"),
      { ssr: false, loading: () => <SectionSkeleton height={300} /> }
    ),
    // priority: 2,
    height: 300,
    requiresAuth: true,
  },
  HomeSection3: {
    component: dynamic(
      () => import("@/Components/HomePage_VideoSection/HomeSection3"),
      { ssr: false, loading: () => <SectionSkeleton /> }
    ),
    // priority: 3,
  },
  HomeSection4: {
    component: dynamic(
      () => import("@/Components/HomePage_VideoSection/HomeSection4"),
      { ssr: false, loading: () => <SectionSkeleton /> }
    ),
    // priority: 3,
  },
  HomeSection5: {
    component: dynamic(
      () => import("@/Components/HomePage_VideoSection/HomeSection5"),
      { ssr: false, loading: () => <SectionSkeleton /> }
    ),
    // priority: 3,
  },
  HomeSection6: {
    component: dynamic(
      () => import("@/Components/HomePage_VideoSection/HomeSection6"),
      { ssr: false, loading: () => <SectionSkeleton /> }
    ),
    // priority: 3,
  },
  HomeSection7: {
    component: dynamic(
      () => import("@/Components/HomePage_VideoSection/HomeSection7"),
      { ssr: false, loading: () => <SectionSkeleton /> }
    ),
    // priority: 4,
  },
  HomeSection8: {
    component: dynamic(
      () => import("@/Components/HomePage_VideoSection/HomeSection8"),
      { ssr: false, loading: () => <SectionSkeleton /> }
    ),
    // priority: 4,
  },
  HomeSection9: {
    component: dynamic(
      () => import("@/Components/HomePage_VideoSection/HomeSection9"),
      { ssr: false, loading: () => <SectionSkeleton /> }
    ),
    // priority: 5,
  },
  HomeSection10: {
    component: dynamic(
      () => import("@/Components/HomePage_VideoSection/HomeSection10"),
      { ssr: false, loading: () => <SectionSkeleton /> }
    ),
    // priority: 5,
  },
  HomeSection11: {
    component: dynamic(
      () => import("@/Components/HomePage_VideoSection/HomeSection11"),
      { ssr: false, loading: () => <SectionSkeleton /> }
    ),
    // priority: 6,
  },
  HomeSection12: {
    component: dynamic(
      () => import("@/Components/HomePage_VideoSection/HomeSection12"),
      { ssr: false, loading: () => <SectionSkeleton /> }
    ),
    // priority: 6,
  },
  HomeSection13: {
    component: dynamic(
      () => import("@/Components/HomePage_VideoSection/HomeSection13"),
      { ssr: false, loading: () => <SectionSkeleton /> }
    ),
    // priority: 7,
  },
  ToTrendingBrands: {
    component: dynamic(
      () => import("@/Components/HomePage_VideoSection/ToTrendingBrands"),
      { ssr: false, loading: () => <SectionSkeleton /> }
    ),
    // priority: 7,
  },
  FindFranchiseLocations: {
    component: dynamic(
      () => import("@/Components/HomePage_VideoSection/FindFranchiseLocations"),
      { ssr: false, loading: () => <SectionSkeleton /> }
    ),
    // priority: 8,
  },
  BusinessOpportunities: {
    component: dynamic(
      () => import("@/Components/about_mrfranchise/businessopportunities"),
      { ssr: false, loading: () => <SectionSkeleton /> }
    ),
    // priority: 8,
  },
  AboutMrFranchise: {
    component: dynamic(
      () => import("@/Components/about_mrfranchise/aboutmrfranchise"),
      { ssr: false, loading: () => <SectionSkeleton /> }
    ),
    // priority: 9,
  },
  ExploreIndustry: {
    component: dynamic(
      () => import("@/Components/about_mrfranchise/exploreindustry"),
      { ssr: false, loading: () => <SectionSkeleton /> }
    ),
    // priority: 9,
  },
  ExploreInvestment: {
    component: dynamic(
      () => import("@/Components/about_mrfranchise/exploreinvestment"),
      { ssr: false, loading: () => <SectionSkeleton /> }
    ),
    // priority: 10,
  },
  ExploreLocation: {
    component: dynamic(
      () => import("@/Components/about_mrfranchise/explorelocation"),
      { ssr: false, loading: () => <SectionSkeleton /> }
    ),
    // priority: 10,
  },
  Featurebrand: {
    component: dynamic(
      () => import("@/Components/about_mrfranchise/Featurebrand"),
      { ssr: false, loading: () => <SectionSkeleton /> }
    ),
    // priority: 10,
  },
  FranchiseJourney: {
    component: dynamic(
      () => import("@/Components/about_mrfranchise/franchisejourney"),
      { ssr: false, loading: () => <SectionSkeleton /> }
    ),
    // priority: 10,
  },
  FreeFranchise: {
    component: dynamic(
      () => import("@/Components/about_mrfranchise/freefranchise"),
      { ssr: false, loading: () => <SectionSkeleton /> }
    ),
    // priority: 10,
  },
};

// ============================================
// OPTIMIZED LAZY SECTION
// ============================================
const LazySection = memo(({ componentKey, isMobile }) => {
  const sectionConfig = SECTION_COMPONENTS[componentKey];
  const [hasLoaded, setHasLoaded] = useState(false);

 const { ref, inView } = useInView({
  triggerOnce: true,
  rootMargin: "200px",
  fallbackInView: true, // ✅ ADD THIS
});

  useEffect(() => {
    if (inView && !hasLoaded) {
      startTransition(() => {
        setHasLoaded(true);
      });
    }
  }, [inView, hasLoaded]);

  if (!sectionConfig) return null;

  const Component = sectionConfig.component;

  return (
    <Box
      ref={ref}
      sx={{
        contain: "layout style",
 minHeight: sectionConfig.height || 300, width: "100%",
      
      }}
    >
      {hasLoaded ? (
        <ErrorBoundary>
          <Component isMobile={isMobile} />
        </ErrorBoundary>
      ) : (
        <SectionSkeleton height={sectionConfig.height || 200} />
      )}
    </Box>
  );
});

LazySection.displayName = "LazySection";

// ============================================
// BANNER TEXTS
// ============================================
const BANNER_TEXTS = [
  {
    title: "India's #1 Franchise Marketplace",
    subtitle: "Discover verified franchise opportunities, compare investment, and connect directly with brands.",
    highlight: "F&B franchise opportunities",
  },
  {
    title: "Start Your Business with the Right Franchise",
    subtitle: "Explore low investment franchise opportunities in food, retail, education, and more.",
    highlight: "proven models",
  },
  {
    title: "Connect with Top Franchise Brands Instantly",
    subtitle: "Get complete franchise details and investor support directly on WhatsApp.",
    highlight: "food franchise journey",
  },
];

// HERO BANNER COMPONENT
const HeroBanner = memo(({ isMobile, bannerIndex }) => {
  const currentText = BANNER_TEXTS[bannerIndex];

  return (
    <Box
      sx={{
        position: "relative",
        minHeight:  "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        contain: "layout style paint",
      }}
    >
      {/* Background Image */}
      <Image
        src="/HomeBanner.avif"
        alt="Franchise Marketplace"
        fill
        priority
        sizes="(max-width: 768px) 100vw, 
         (max-width: 1200px) 90vw, 
         80vw"
        style={{
          objectFit: "cover",
          objectPosition: "center",
        }}
        fetchPriority="high"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDAAQRBRIhBhMiMUFR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAYEQEBAQEBAAAAAAAAAAAAAAABAgADEf/aAAwDAQACEQMRAD8AzWz0q6u7S3uIpLYJOiSoGkYMAwBGRt+1YnVCgFQ8J+clJ//Z"
      />

      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6))",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <Container
        maxWidth="lg"
        sx={{
          zIndex: 2,
          textAlign: "center",
          px: { xs: 2, md: 4 },
          py: { xs: 4, md: 6 },
        }}
      >
        <Box
          key={bannerIndex}
          sx={{
            animation: "fadeSlide 0.5s ease-out",
            "@keyframes fadeSlide": {
              from: { opacity: 0, transform: "translateY(20px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
              fontWeight: 800,
              color: "white",
              textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              mb: 2,
              lineHeight: 1.2,
            }}
          >
            {currentText.title}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
              color: "rgba(255,255,255,0.9)",
              maxWidth: 700,
              mx: "auto",
              mb: 4,
              lineHeight: 1.6,
              "& .highlight": {
                color: "#ff9800",
                fontWeight: 700,
              },
            }}
          >
            {currentText.subtitle.split(currentText.highlight)[0]}
            <span className="highlight">{currentText.highlight}</span>
            {currentText.subtitle.split(currentText.highlight)[1]}
          </Typography>
        </Box>

        <FilterDropdowns />
      </Container>
    </Box>
  );
});

HeroBanner.displayName = "HeroBanner";

// ============================================
// SECTIONS CONFIG
// ============================================
const SECTIONS = [
  "TopBrandThreeVdoCards",
  "HomeSection1",
  "HomeSection2",
  "LikedBrands",
  "ShortlistBrands",
  "ViewBrands",
  "HomeSection3",
  "HomeSection4",
  "HomeSection5",
  "HomeSection6",
  "HomeSection7",
  
  "HomeSection8",
  "HomeSection9",
  "HomeSection10",
  "HomeSection11",
  "HomeSection12",
  "HomeSection13",
  "FindFranchiseLocations",
  "ToTrendingBrands",
  "BusinessOpportunities",
  "AboutMrFranchise",
  "ExploreIndustry",
  "ExploreInvestment",
  "ExploreLocation",
  "Featurebrand",
  "FranchiseJourney",
  "FreeFranchise",
];

const AUTH_REQUIRED_SECTIONS = ["LikedBrands", "ShortlistBrands", "ViewBrands"];

// ============================================
// MAIN COMPONENT
// ============================================
export default memo(function HomeBannerSec() {
  const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down("sm"), {
  noSsr: true,
  defaultMatches: false,
});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydration check
  useEffect(() => {
    setIsHydrated(true);
    setIsLoggedIn(!!localStorage.getItem("accessToken"));
  }, []);

  // Popup logic
  useEffect(() => {
    if (!isHydrated) return;

    const timer = setTimeout(() => {
      const shown = sessionStorage.getItem("popup-shown");
let isReload = false;

if (typeof window !== "undefined" && window.performance) {
  try {
    const nav = window.performance.getEntriesByType("navigation");
    isReload = nav?.[0]?.type === "reload";
  } catch (e) {
    isReload = false;
  }
}
      if (!shown || isReload) {
        if (!localStorage.getItem("accessToken")) {
          setIsPopupOpen(true);
        }
        sessionStorage.setItem("popup-shown", "true");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isHydrated]);

  // Banner rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % BANNER_TEXTS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Filter sections based on auth
  const visibleSections = useMemo(() => {
    return SECTIONS.filter(
      (section) => isLoggedIn || !AUTH_REQUIRED_SECTIONS.includes(section)
    );
  }, [isLoggedIn]);

  const handlePopupClose = useCallback(() => {
    setIsPopupOpen(false);
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      {/* Navbar */}
      <Navbar />

      {/* Popup Modal */}
      {isPopupOpen && (
        <Suspense fallback={<div>Loading...</div>}>
          <PopupModal
            open={isPopupOpen}
            onClose={handlePopupClose}
            disableInitialAnimation
          />
        </Suspense>
      )}

      {/* Hero Banner */}
      <HeroBanner isMobile={isMobile} bannerIndex={bannerIndex} />

      {/* Main Sections */}
      <Box
        component="main"
        sx={{
          contain: "layout",
          bgcolor: "#F5F2F2",
        }}
      >
        {visibleSections.map((sectionKey) => (
          <LazySection
            key={sectionKey}
            componentKey={sectionKey}
            isMobile={isMobile}
          />
        ))}
      </Box>

      {/* Compare Features */}
      <Suspense fallback={<div>Loading...</div>}>
        <CompareButton />
        <BrandComparison />
      </Suspense>

      {/* Footer */}
      <Footer />
    </Box>
  );
});