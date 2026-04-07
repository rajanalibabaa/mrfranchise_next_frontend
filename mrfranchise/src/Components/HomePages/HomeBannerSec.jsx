"use client";

import React, { useState, useEffect, Suspense, useCallback, memo } from "react";
import { useInView } from "react-intersection-observer";
import { AutoSizer } from "react-virtualized-auto-sizer";

import { useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import { motion, useAnimation } from "framer-motion";
import dynamic from "next/dynamic";
import PopupModal from "@/Components/PopUpModal/PopUpModal";
import { useDispatch } from "react-redux";
import CompareButton from "./CompareButtonsCompenents";
import { Fragment } from "react";
import Image from "next/image";

const Navbar = dynamic(() => import("@/Components/Navbar/NavBar"), { loading: () => <Box height={60} /> });
const FilterDropdowns = dynamic(() => import("@/Components/Navbar/FilterDropdownsData"), { loading: () => <Box height={60} /> });
const Footer = dynamic(() => import("@/Components/Footers/Footer"), { ssr: true });
const BrandComparison = dynamic(() => import("./brandCompariosn"), { ssr: false });
const FixedSizeList = dynamic(
  () => import("react-window").then((mod) => mod.FixedSizeList),
  { ssr: false },
);

// --- ErrorBoundary ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box p={0} textAlign="center" bgcolor="#12e632">
          <Typography color="error">
            Failed to load: {this.state.error?.message}
          </Typography>
        </Box>
      );
    }
    return this.props.children;
  }
}

const VirtualizedCardList = memo(({ items, itemHeight = 440 }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <Suspense
        fallback={
          <Box
            height={itemHeight}
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgcolor="#75e512"
          >
            <CircularProgress size={32} />
          </Box>
        }
      >
        {React.createElement(items[index])}
      </Suspense>
    </div>
  );

  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList
          height={height}
          width={width}
          itemCount={items.length}
          itemSize={itemHeight}
          overscanCount={5}
        >
          {Row}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
});

// --- ComponentLoader to fully wrap lazy components with error and suspense ---
const ComponentLoader = memo(({ Component, ...props }) => (
  <ErrorBoundary>
    <Suspense
      fallback={
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={200}
        >
          <Box height={200} bgcolor="#eee" borderRadius={2} />
        </Box>
      }
    >
      <Component {...props} />
    </Suspense>
  </ErrorBoundary>
));

// Dynamic imports for Next.js
const useDynamicComponents = () => {
  return React.useMemo(
    () => ({
      TopBrandThreevdocards: dynamic(
        () => import("@/Components/HomePage_VideoSection/TopBrandThreeVdoCards"),
        { ssr: false },
      ),
      LikedBrands: dynamic(
        () => import("@/Components/HomePage_VideoSection/LikedBrands"),
        { ssr: false },
      ),
      ShortlistBrands: dynamic(
        () => import("@/Components/HomePage_VideoSection/ShortlistBrands"),
        { ssr: false },
      ),
      ViewBrands: dynamic(
        () => import("@/Components/HomePage_VideoSection/ViewBrands"),
        { ssr: false },
      ),
      HomeSection1: dynamic(
        () => import("@/Components/HomePage_VideoSection/HomeSection1"),
        { ssr: false },
      ),
      HomeSection2: dynamic(
        () => import("@/Components/HomePage_VideoSection/HomeSection2"),
        { ssr: false },
      ),
      HomeSection3: dynamic(
        () => import("@/Components/HomePage_VideoSection/HomeSection3"),
        { ssr: false },
      ),
      HomeSection4: dynamic(
        () => import("@/Components/HomePage_VideoSection/HomeSection4"),
        { ssr: false },
      ),
      HomeSection5: dynamic(
        () => import("@/Components/HomePage_VideoSection/HomeSection5"),
        { ssr: false },
      ),
      HomeSection6: dynamic(
        () => import("@/Components/HomePage_VideoSection/HomeSection6"),
        { ssr: false },
      ),
      HomeSection7: dynamic(
        () => import("@/Components/HomePage_VideoSection/HomeSection7"),
        { ssr: false },
      ),
      HomeSection8: dynamic(
        () => import("@/Components/HomePage_VideoSection/HomeSection8"),
        { ssr: false },
      ),
      HomeSection9: dynamic(
        () => import("@/Components/HomePage_VideoSection/HomeSection9"),
        { ssr: false },
      ),
      HomeSection10: dynamic(
        () => import("@/Components/HomePage_VideoSection/HomeSection10"),
        { ssr: false },
      ),
      HomeSection11: dynamic(
        () => import("@/Components/HomePage_VideoSection/HomeSection11"),
        { ssr: false },
      ),
      HomeSection12: dynamic(
        () => import("@/Components/HomePage_VideoSection/HomeSection12"),
        { ssr: false },
      ),
      HomeSection13: dynamic(
        () => import("@/Components/HomePage_VideoSection/HomeSection13"),
        { ssr: false },
      ),
      ToTrendingBrands: dynamic(
        () => import("@/Components/HomePage_VideoSection/ToTrendingBrands"),
        { ssr: false },
      ),
      FindFranchiseLocations: dynamic(
        () => import("@/Components/HomePage_VideoSection/FindFranchiseLocations"),
        { ssr: false },
      ),
    }),
    [],
  );
};

// --- Section that lazy loads content on scroll-in-view ---
const LazySection = memo(
  ({ componentKey, dynamicComponents, background, isMobile }) => {
    const Component = dynamicComponents[componentKey];
    const { ref, inView } = useInView({
      triggerOnce: true,
      rootMargin: "150px",
    });

    if (!Component) return null;

    return (
      <Box
        ref={ref}
        sx={{
          ...background,
          minHeight: "80vh",
          backgroundAttachment: "fixed",
        }}
      >
        <Box
          sx={{
            background: "transparent",
            py: 0,
          }}
        >
          {inView ? (
            <ComponentLoader
              Component={Component}
              VirtualizedCardList={VirtualizedCardList}
              isMobile={isMobile}
            />
          ) : (
            <Box minHeight={200} />
          )}
        </Box>
      </Box>
    );
  },
);

LazySection.displayName = "LazySection";

// --- Banner texts configuration ---
const bannerTexts = [
  {
    title: {
      text: "India's #1 Franchise Marketplace",
      gradient: "linear-gradient(0deg, rgba(255, 255, 255, 1) 10%, rgba(250, 250, 250, 1) 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "Discover verified franchise opportunities, compare investment, and connect directly with brands.",
      highlight: {
        text: "F&B franchise opportunities",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
  {
    title: {
      text: "Start Your Business with the Right Franchise",
      gradient: "linear-gradient(90deg, #ffffffff 10%, #ffffffff 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "Explore low investment franchise opportunities in food, retail, education, and more. Find the perfect fit for your business.",
      highlight: {
        text: "proven models",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
  {
    title: {
      text: "Connect with Top Franchise Brands Instantly",
      gradient: "linear-gradient(0deg, rgba(255, 255, 255, 1) 10%, rgba(250, 250, 250, 1) 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "Get complete franchise details and investor support directly on WhatsApp.",
      highlight: {
        text: "food franchise journey",
        color: "#ff9800",
        lineHeight: "1.5",
        fontWeight: "bold",
      },
    },
  },
];

const pageConfig = {
  heroBanner: {
    backgroundImage: "/HomeBanner.avif",
    overlayColor: "rgba(0, 0, 0, 0.3)",
    title: {
      text: "Welcome To Our MrFranchise Network",
      gradient: "linear-gradient(0deg, rgb(249, 108, 0) 10%, rgba(250, 250, 250, 1) 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2.5rem" },
    },
    subtitle: {
      text: "World's most comprehensive franchise platform with 1000+ opportunities waiting for you...",
      highlight: {
        text: "1000+ opportunities",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
  sections: [
    { component: "TopBrandThreevdocards", background: "#fff" },
    { component: "HomeSection1", background: "#fff" },
    { component: "HomeSection2", background: "#fff" },
    { component: "LikedBrands", background: "#fff" },
    { component: "ShortlistBrands", background: "#fff" },
    { component: "ViewBrands", background: "#fff" },
    { component: "HomeSection3", background: "#fff" },
    { component: "HomeSection4", background: "#fff" },
    { component: "HomeSection5", background: "#fff" },
    { component: "HomeSection7", background: "#fff" },
    { component: "HomeSection6", background: "#fff" },
    { component: "HomeSection8", background: "#fff" },
    { component: "HomeSection9", background: "#fff" },
    { component: "HomeSection10", background: "#fff" },
    { component: "HomeSection11", background: "#fff" },
    { component: "HomeSection12", background: "#fff" },
    { component: "HomeSection13", background: "#fff" },
    { component: "FindFranchiseLocations", background: "#fff" },
    {
      component: "ToTrendingBrands",
      title: "Trending Brands",
      background: "#fff",
    },
  ],
  animations: {
    banner: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { when: "beforeChildren", staggerChildren: 0.3 },
      },
    },
    item: {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", damping: 10, stiffness: 100 },
      },
    },
    pulse: {
      scale: [1, 1.02, 1],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },
  },
};

// --- Main component ---
export default memo(function HomeBannerSec() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  const dynamicComponents = useDynamicComponents();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const controls = useAnimation();
  const currentText = bannerTexts[bannerIndex];

  // Check login status on client side
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("accessToken"));
  }, []);

  useEffect(() => {
    const handleNavigation = () => {
      const nav = typeof window !== "undefined" && 
        performance.getEntriesByType("navigation")[0]?.type === "reload";
      const shown = sessionStorage.getItem("popup-shown");

      const t = setTimeout(() => {
        setIsLoading(false);
        if (!shown || nav) {
          setIsPopupOpen(true);
          sessionStorage.setItem("popup-shown", "true");
        }
      }, 1500);

      return () => clearTimeout(t);
    };

    handleNavigation();
  }, [dispatch]);

  useEffect(() => {
    if (isLoading) return;

    const interval = setInterval(() => {
      controls
        .start({
          opacity: 0,
          x: -80,
          transition: { duration: 0.5 },
        })
        .then(() => {
          setBannerIndex((prev) => (prev + 1) % bannerTexts.length);
          controls.start({
            opacity: 1,
            x: 0,
            transition: { duration: 0.5 },
          });
        });
    }, 5000);

    return () => clearInterval(interval);
  }, [controls, isLoading]);

  useEffect(() => {
    setShowPopup(!localStorage.getItem("accessToken") && isPopupOpen);
  }, [isPopupOpen]);

  const handlePopupClose = useCallback(() => setIsPopupOpen(false), []);

  return (
    <>
      <Navbar />

      {showPopup && (
        <PopupModal
          open={isPopupOpen}
          onClose={handlePopupClose}
          disableInitialAnimation
        />
      )}

      {/* Loading indicator */}
      {isLoading && (
        <Box position="fixed" top={10} right={10} zIndex={9999}>
          <CircularProgress size={30} />
        </Box>
      )}

      {/* --- Hero Banner --- */}
      <Box
        mt={0}
        sx={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: isMobile ? "scroll" : "fixed",
          py: 1,
          position: "relative",
          overflow: "hidden",
          color: "white",
          minHeight: isMobile ? "75vh" : "40vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          src={pageConfig.heroBanner.backgroundImage}
          alt="Hero Banner"
          fill
          priority
          style={{ objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))',
            zIndex: 1,
          }}
        />
        <Container
          sx={{
            zIndex: 2,
            textAlign: "center",
            height: "100%",
            mt: 3,
          }}
        >
          <Box
            component={motion.div}
            key={bannerIndex}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
          >
            <Typography mb={3} component="span">
              <Box
                component="span"
                sx={{
                  background: currentText.title.gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textShadow: "none",
                  display: "inline-block",
                  fontSize: isMobile ? "1.5rem" : "2.2rem",
                  fontWeight: 900,
                  px: 1,
                  whiteSpace: "pre-line",
                }}
              >
                {currentText.title.text}
              </Box>
            </Typography>
          </Box>

          <Box component={motion.div} variants={pageConfig.animations.item}>
            <Typography
              variant={isMobile ? "body1" : "subtitle1"}
              mt={isMobile ? 0 : 3}
              sx={{
                textAlign: "center",
                color: "rgba(255,255,255,0.9)",
                fontWeight: 700,
                mt: 2,
                mb: 5,
                maxWidth: "800px",
                mx: "auto",
                lineHeight: 1.5,
                fontSize: isMobile ? "0.6rem" : ".9rem",
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                position: "relative",
              }}
            >
              {
                currentText.subtitle.text.split(
                  currentText.subtitle.highlight.text,
                )[0]
              }
              <Typography
                variant="inherit"
                sx={{
                  fontWeight: currentText.subtitle.highlight.fontWeight,
                  color: currentText.subtitle.highlight.color,
                  display: "inline",
                  mb: 5,
                }}
                component="span"
              >
                {currentText.subtitle.highlight.text}
              </Typography>
              {
                currentText.subtitle.text.split(
                  currentText.subtitle.highlight.text,
                )[1]
              }
            </Typography>
          </Box>

          <FilterDropdowns />
        </Container>
      </Box>

      {pageConfig.sections
        .filter(
          (s) =>
            isLoggedIn ||
            !["LikedBrands", "ShortlistBrands", "ViewBrands"].includes(
              s.component,
            ),
        )
        .map((section, i) => (
          <Fragment key={i}>
            {/* SECTION */}
            <LazySection
              componentKey={section.component}
              dynamicComponents={dynamicComponents}
              background={{
                backgroundImage: "url(/bg25.jpeg)",
                backgroundAttachment: "scroll",
                backgroundSize: "400px",
                backgroundRepeat: "repeat",
              }}
              isMobile={isMobile}
            />
          </Fragment>
        ))}

      <CompareButton />
      <BrandComparison />
      <Footer />
    </>
  );
});