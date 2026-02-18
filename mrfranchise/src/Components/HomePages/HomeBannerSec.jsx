"use client";

import React, { useState, useEffect, Suspense, useCallback,memo } from "react";
import { useInView } from "react-intersection-observer";
// import { FixedSizeList as List } from "react-window";
import {AutoSizer} from "react-virtualized-auto-sizer";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Container,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { motion, useAnimation } from "framer-motion";
import dynamic from "next/dynamic";
import PopupModal from "@/Components/PopUpModal/PopUpModal";
import FilterDropdowns from "@/Components/Navbar/FilterDropdownsData";
import { useDispatch } from "react-redux";
import Footer from "@/Components/Footers/Footer";
import Navbar from "@/Components/Navbar/NavBar";
import CompareButton from "./CompareButtonsCompenents";
import BrandComparison from "./brandCompariosn";
import AdSlot from "../ads/GoogleAd";
import {ADS} from '@/config/ads.config.js';
import { Fragment } from "react";
import { usePathname } from "next/navigation";

const FixedSizeList = dynamic(
  () => import("react-window").then((mod) => mod.FixedSizeList),
  { ssr: false }
);

// --- ErrorBoundary ---
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, info) {
    console.error(error, info);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <Box p={3} textAlign="center" bgcolor="#fff5f5">
          <Typography color="error">
            Failed to load: {this.state.error?.message}
          </Typography>
        </Box>
      );
    }
    return this.props.children;
  }
}

// // --- LazyCard and VirtualizedCardList for scalable, virtualized sections ---
// const LazyCard = React.memo(({ component: CardComponent, index, style }) => {
//   const [ref, inView] = useInView({
//     triggerOnce: true,
//     rootMargin: "400px",
//   });
  
//   return (
//     <div ref={ref} style={style}>
//       {inView ? (
//         <Suspense
//           fallback={
//             <Box
//               minHeight={100}
//               display="flex"
//               alignItems="center"
//               justifyContent="center"
//             >
//               <CircularProgress size={24} color="success" />
//             </Box>
//           }
//         >
//           <CardComponent key={index} />
//         </Suspense>
//       ) : (
//         <div style={{ height: "100%", backgroundColor: "#f5f5f5" }} />
//       )}
//     </div>
//   );
// });

// LazyCard.displayName = "LazyCard";

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
            bgcolor="#fafafa"
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
          <CircularProgress />
        </Box>
      }
    >
      <Component {...props} />
    </Suspense>
  </ErrorBoundary>
));



// Dynamic imports for Next.js
const useDynamicComponents = () => {
  return React.useMemo(() => ({
    TopBrandThreevdocards: dynamic(() => import("@/Components/HomePage_VideoSection/TopBrandThreeVdoCards"), { ssr: false }),
    LikedBrands: dynamic(() => import("@/Components/HomePage_VideoSection/LikedBrands"), { ssr: false }),
    ShortlistBrands: dynamic(() => import("@/Components/HomePage_VideoSection/ShortlistBrands"), { ssr: false }),
    ViewBrands: dynamic(() => import("@/Components/HomePage_VideoSection/ViewBrands"), { ssr: false }),
    HomeSection1: dynamic(() => import("@/Components/HomePage_VideoSection/HomeSection1"), { ssr: false }),
    HomeSection2: dynamic(() => import("@/Components/HomePage_VideoSection/HomeSection2"), { ssr: false }),
    HomeSection3: dynamic(() => import("@/Components/HomePage_VideoSection/HomeSection3"), { ssr: false }),
    HomeSection4: dynamic(() => import("@/Components/HomePage_VideoSection/HomeSection4"), { ssr: false }),
    HomeSection5: dynamic(() => import("@/Components/HomePage_VideoSection/HomeSection5"), { ssr: false }),
    HomeSection6: dynamic(() => import("@/Components/HomePage_VideoSection/HomeSection6"), { ssr: false }),
    HomeSection7: dynamic(() => import("@/Components/HomePage_VideoSection/HomeSection7"), { ssr: false }),
    HomeSection8: dynamic(() => import("@/Components/HomePage_VideoSection/HomeSection8"), { ssr: false }),
    ToTrendingBrands: dynamic(() => import("@/Components/HomePage_VideoSection/ToTrendingBrands"), { ssr: false }),
    FindFranchiseLocations: dynamic(() => import("@/Components/HomePage_VideoSection/FindFranchiseLocations"), { ssr: false }),
  }), []);
};

const BackgroundWrapper = ({ children }) => (
  <Box
    sx={{
      backgroundImage: "url(/bg25.jpeg)",
      backgroundAttachment: "fixed",
      backgroundSize: "400px",
      backgroundRepeat: "repeat",
      width: "100%",
    }}
  >
    {children}
  </Box>
);


// --- Section that lazy loads content on scroll-in-view ---
const LazySection = memo(({ componentKey, dynamicComponents, background, isMobile }) => {
  const Component = dynamicComponents[componentKey];
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "300px" });

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
      <Container maxWidth="xl"  sx={{
    background: "transparent",   // 🔑 FIX
    py: 0,
  }}>
        {inView ? (
          <ComponentLoader Component={Component} VirtualizedCardList={VirtualizedCardList} isMobile={isMobile} />
        ) : (
          <Box minHeight={200} />
        )}
      </Container>
    </Box>
  );
});



// --- Banner texts configuration ---
const bannerTexts = [
  {
    title: {
      text: "1000+ Food Brands \n One Platform Endless Possibilities",
      gradient:
        "linear-gradient(0deg, rgba(255, 255, 255, 1) 10%, rgba(250, 250, 250, 1) 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "Discover A Universe Of F&B Franchise Opportunities From Quick Service Restaurants To Gourmet Cafes All Under On Powerful Portal",
      highlight: {
        text: " F&B franchise opportunities",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
  {
    title: {
      text: "Turn Your Investment \n Into A Tasteful Venture",
      gradient: "linear-gradient(90deg, #ffffffff 10%, #ffffffff 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "Explore Curated Restaurant And Cafe Franchises With Proven Models Designed For ROI Stability And Low Opertational Hassle",
      highlight: {
        text: " proven models",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
  {
    title: {
      text: "India's #1 F&B Franchise Marketplace\n Your Food Business Starts Here",
      gradient:
        "linear-gradient(0deg, rgba(255, 255, 255, 1) 10%, rgba(250, 250, 250, 1) 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "From Startup Food kiosks To International Food Chains We Have Everything You Need To Start Your Franchise ",
      highlight: {
        text: "food franchise journey",
        color: "#ff9800",
        lineHeight: "1.5",
        fontWeight: "bold",
      },
    },
  },
  {
    title: {
      text: "Serve Success Hot \n Choose the Right F&B Franchise Today",
      gradient: "linear-gradient(90deg, #ffffffff 10%, #ffffffff 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "Invest in hot-selling food concepts with high demand, fast scalability, and support from trusted food brands ",
      highlight: {
        text: "F&B Franchise",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
  {
    title: {
      text: "From Local Taste to Global Plates \n Start Your Food Business Now",
      gradient:
        "linear-gradient(0deg, rgba(255, 255, 255, 1) 10%, rgba(250, 250, 250, 1) 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "Franchise options available in street food, bakeries, ice cream parlors, multicusine restaurants, and more.",
      highlight: {
        text: "Food Business",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
  {
    title: {
      text: "Low Investment.\nHigh Appetite for Growth",
      gradient: "linear-gradient(90deg, #ffffffff 10%, #ffffffff 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "Start from just ₹5 Lakhs with multiple profitable options in cafes, cloud kitchens, and food trucks.",
      highlight: {
        text: "Low Investment",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
  {
    title: {
      text: "Franchise a Restaurant.\n Own a Cafe Lead a Cloud Kitchen",
      gradient:
        "linear-gradient(0deg, rgba(255, 255, 255, 1) 10%, rgba(250, 250, 250, 1) 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "Find franchise businesses across every food format to suit your budget, location, and business dream.",
      highlight: {
        text: "franchise businesses",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
  {
    title: {
      text: "F&B Franchise Made Easy \n with www.MrFranchise.in",
      gradient: "linear-gradient(90deg, #ffffffff 10%, #ffffffff 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "Step-by-step guidance, brand comparisons, and expert consultation to help you confidently invest.",
      highlight: {
        text: "consultation",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
  {
    title: {
      text: "No Experience? No Problem!\n Proven Food Franchise Models Await You",
      gradient:
        "linear-gradient(0deg, rgba(255, 255, 255, 1) 10%, rgba(250, 250, 250, 1) 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "Get full training, support, marketing tools, and setup assistance with our zero-hassle franchise options.",
      highlight: {
        text: "zero-hassle",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
  {
    title: {
      text: "Your Food Franchise Future\n Starts At food and beverage www.MrFranchise.in",
      gradient: "linear-gradient(90deg, #ffffffff 10%, #ffffffff 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "The one-stop portal for serious F&B investors looking to explore, compare, and close franchise deals.",
      highlight: {
        text: "franchise deals",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
];

const pageConfig = {
  heroBanner: {
    backgroundImage:"/HomeBanner.avif",
    overlayColor: "rgba(0, 0, 0, 0.3)",
    title: {
      text: "Welcome To Our MrFranchise Network",
      gradient:
        "linear-gradient(0deg, rgb(249, 108, 0) 10%, rgba(250, 250, 250, 1) 100%)",
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
  const router = useRouter();
  const dynamicComponents = useDynamicComponents();
const pathname = usePathname();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const controls = useAnimation();
  const currentText = bannerTexts[bannerIndex];

  // Check login status on client side
 // Login check
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("accessToken"));
  }, []);

  useEffect(() => {
    const handleNavigation = () => {
      const nav =
        typeof window !== "undefined" &&
        performance.getEntriesByType("navigation")[0]?.type === "reload";
      const shown = sessionStorage.getItem("popup-shown");
      
      // dispatch(showLoading());
      
      const t = setTimeout(() => {
        setIsLoading(false);
        // dispatch(hideLoading());
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

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="warning" size={60} />
      </Box>
    );
  }

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

      {/* --- Hero Banner --- */}
      <Box
        mt={0}
        sx={{
background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${pageConfig.heroBanner.backgroundImage})`,
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
        <Container
          sx={{
            zIndex: 2,
            textAlign: "center",
            height: "100%",
            mt: 3,
          }}
        >
          <motion.div
            key={bannerIndex}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
          >
            <Typography mb={3} component="span">
              <Box
                sx={{
                  background: currentText.title.gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
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
          </motion.div>

          <motion.div variants={pageConfig.animations.item}>
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
              component={motion.div}
            >
              {
                currentText.subtitle.text.split(
                  currentText.subtitle.highlight.text
                )[0]
              }
              <Typography
                variant="outlined"
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
                  currentText.subtitle.highlight.text
                )[1]
              }
            </Typography>
          </motion.div>

          <FilterDropdowns />
        </Container>
      </Box>

      {/* {pageConfig.sections
        .filter((section) => {
          if (
            !isLoggedIn &&
            ["ViewBrands", "ShortlistBrands", "LikedBrands"].includes(
              section.component
            )
          ) {
            return false;
          }
          return true;
        })
        .map((section, index) => (
          <LazySection
            key={index}
            componentKey={section.component}
            dynamicComponents={dynamicComponents}
            background={{
              backgroundImage: "url(/bg25.jpeg)",
              backgroundAttachment: "fixed",
              backgroundSize: "400px auto",
              backgroundRepeat: "repeat",
              minHeight: "87vh",
              width: "100%",
            }}
            isMobile={isMobile}
          />
        ))} */}

           {pageConfig.sections
        .filter((s) => isLoggedIn || !["LikedBrands", "ShortlistBrands", "ViewBrands"].includes(s.component))
        .map((section, i) => {
          const addIndex = Math.floor(i / 3);

           const adSlots = [
      ADS.HOME.INLINE_1,
      ADS.HOME.INLINE_2,
      ADS.HOME.INLINE_3,
    ];
return (
      <Fragment key={i} >
        {/* SECTION */}
        <LazySection
          componentKey={section.component}
          dynamicComponents={dynamicComponents}
          background={{
            backgroundImage: "url(/bg25.jpeg)",
            backgroundAttachment: "fixed",
            backgroundSize: "400px",
            backgroundRepeat: "repeat",
          }}
          isMobile={isMobile}
        />

        {/* AD AFTER EVERY 3rd SECTION */}
       {(i + 1) % 3 === 0 && adSlots[addIndex] && (
  <BackgroundWrapper>
    <Box sx={{ py: 3 }}>
      <AdSlot key={pathname} {...adSlots[addIndex]} />
    </Box>
  </BackgroundWrapper>
)}

      </Fragment>
    );
  })}

          {/* <LazySection
            key={i}
            componentKey={section.component}
            dynamicComponents={dynamicComponents}
            background={{
              backgroundImage: "url(/bg25.jpeg)",
              backgroundAttachment: "fixed",
              backgroundSize: "400px",
              backgroundRepeat: "repeat",
            }}
            isMobile={isMobile}
          />
        })} */}
        <BackgroundWrapper>
          <Box sx={{ py: 3 }}>
          <AdSlot key={pathname} {...ADS.HOME.FOOTER_RECTANGLE}/>
</Box>
        </BackgroundWrapper>

      <CompareButton />
      <BrandComparison />
      <Footer />
    </>
  );
});

