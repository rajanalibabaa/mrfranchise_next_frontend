// import React, {
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
//   useMemo,
//   useLayoutEffect,
// } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   CircularProgress,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import ArrowBack from "@mui/icons-material/ArrowBack";
// import ArrowForward from "@mui/icons-material/ArrowForward";
// import ArrowRight from "@mui/icons-material/ArrowRight";
// import { useSelector, useDispatch } from "react-redux";
// import { homeSection9  } from '../../Redux/Slices/TopCardFetchingSlice.jsx';

// import LoginPage from "../../Pages/LoginPage/LoginPage";
// import { motion } from "framer-motion";
// import HomePageBrandCard from "./HomePageBrandCard.jsx";

// // Breakpoints
// const CARD_DIMENSIONS = {
//   mobile: { width: 280, height: 520 },
//   tablet: { width: 320, height: 560 },
//   smallDesktop: { width: 280, height: 500 },
//   desktop: { width: 267, height: 480 },
//   largeDesktop: { width: 327, height: 500 },
// };

// const HomeSection9 = () => {
//   const theme = useTheme();
//   const dispatch = useDispatch();

// const homeSection9State  = useSelector((state) => state.overAllPlatform.homeSection9);

// const {
//   brands = [],
//   isLoading,
//   error,
//   pagination
// } = homeSection9State  || {};

//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
//   const isSmallDesktop = useMediaQuery(theme.breakpoints.between("md", "lg"));
//   const isDesktop = useMediaQuery(theme.breakpoints.between("lg", "xl"));
//   const isLargeDesktop = useMediaQuery(theme.breakpoints.up("xl"));

//   const containerRef = useRef(null);
//   const scrollContainerRef = useRef(null);
//   const scrollRequestRef = useRef(null);

//   const [likeProcessing, setLikeProcessing] = useState({});
//   const [showLogin, setShowLogin] = useState(false);
//   const [showStartShadow, setShowStartShadow] = useState(false);
//   const [showEndShadow, setShowEndShadow] = useState(true);
//   const [visibleCardCount, setVisibleCardCount] = useState(4);

//   // const dessertBakeryBrands = useMemo(() => {
//   //   if (!filteredData?.length) return [];
//   //   return filteredData.filter((brand) => {
//   //     const category = brand?.franchiseDetails?.brandCategories?.sub || "";
//   //     return category.includes("Dessert & Bakery");
//   //   });
//   // }, [filteredData]);

//   const dimensions = useMemo(() => {
//     if (isMobile) return CARD_DIMENSIONS.mobile;
//     if (isTablet) return CARD_DIMENSIONS.tablet;
//     if (isSmallDesktop) return CARD_DIMENSIONS.smallDesktop;
//     if (isDesktop) return CARD_DIMENSIONS.desktop;
//     return CARD_DIMENSIONS.largeDesktop;
//   }, [isMobile, isTablet, isSmallDesktop, isDesktop, isLargeDesktop]);

// useEffect(() => {
//     dispatch(homeSection9({ page: 1 }));
//   }, [dispatch]);

//   useLayoutEffect(() => {
//     const updateVisibleCards = () => {
//       if (containerRef.current) {
//         const containerWidth = containerRef.current.offsetWidth;
//         const cardWidth = dimensions.width;
//         const gap = isMobile ? 16 : 24;
//         const count = Math.floor(containerWidth / (cardWidth + gap));
//         setVisibleCardCount(Math.max(1, count));
//       }
//     };

//     updateVisibleCards();
//     window.addEventListener("resize", updateVisibleCards);
//     return () => window.removeEventListener("resize", updateVisibleCards);
//   }, [dimensions.width, isMobile]);

  

//   const getScrollDistance = useCallback(() => {
//     return dimensions.width + (isMobile ? 16 : 24);
//   }, [dimensions.width, isMobile]);

//   const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

//   const smoothScrollTo = useCallback((target, immediate = false) => {
//     const container = scrollContainerRef.current;
//     if (!container) return;
//     if (scrollRequestRef.current)
//       cancelAnimationFrame(scrollRequestRef.current);

//     const start = container.scrollLeft;
//     const change = target - start;
//     const duration = immediate ? 0 : 500;
//     const startTime = performance.now();

//     const animateScroll = (currentTime) => {
//       const elapsed = currentTime - startTime;
//       const progress = Math.min(elapsed / duration, 1);
//       const ease = easeInOutQuad(progress);
//       container.scrollLeft = start + change * ease;

//       if (progress < 1) {
//         scrollRequestRef.current = requestAnimationFrame(animateScroll);
//       } else {
//         handleScroll();
//       }
//     };

//     scrollRequestRef.current = requestAnimationFrame(animateScroll);
//   }, []);

//   const handleScroll = useCallback(() => {
//     const container = scrollContainerRef.current;
//     if (!container) return;

//     const { scrollLeft, scrollWidth, clientWidth } = container;
//     setShowStartShadow(scrollLeft > 10);
//     setShowEndShadow(scrollLeft < scrollWidth - clientWidth - 10);
//   }, []);

//   useEffect(() => {
//     const container = scrollContainerRef.current;
//     if (container) {
//       container.addEventListener("scroll", handleScroll);
//       handleScroll();
//     }

//     return () => {
//       container?.removeEventListener("scroll", handleScroll);
//       if (scrollRequestRef.current)
//         cancelAnimationFrame(scrollRequestRef.current);
//     };
//   }, [handleScroll]);

//   const handleNextClick = () => {
//     const container = scrollContainerRef.current;
//     if (!container) return;
//     const distance = getScrollDistance();
//     const maxScroll = container.scrollWidth - container.clientWidth;
//     const newScroll = Math.min(container.scrollLeft + distance, maxScroll);
//     smoothScrollTo(newScroll);
//   };

//   const handlePrevClick = () => {
//     const container = scrollContainerRef.current;
//     if (!container) return;
//     const distance = getScrollDistance();
//     const newScroll = Math.max(container.scrollLeft - distance, 0);
//     smoothScrollTo(newScroll);
//   };

//   if (isLoading) {
//     return (
//       <Box sx={{ textAlign: "center", p: 4 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ textAlign: "center", p: 4 }}>
//         <Typography color="error">
//           {error.message || "Failed to load brands."}
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     brands.length > 0 && (
//       <Box
//         ref={containerRef}
//         sx={{
//           py: isMobile ? 1 : 2,
//           px: isMobile ? 0 : 2,
//           maxWidth: isMobile ? "100%" : 1400,
//           mx: "auto",
//           position: "relative",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             mb: 1,
//             px: isMobile ? 2 : 0,
//           }}
//         >
//           <Typography
//             variant={isMobile ? "body1" : "h5"}
//             fontWeight="bold"
//             sx={{
//               color: "black",
//               mb: 1,
//               textAlign: "left",
//               position: "relative",
//               "&:after": {
//                 content: '""',
//                 display: "block",
//                 width: "80px",
//                 height: "4px",
//                 background:
//                   theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00",
//                 mt: 1,
//                 borderRadius: 2,
//               },
//             }}
//           >
//             Top Retails
//           </Typography>

//           <Button
//   variant="contained"
//   size="small"
//   aria-label="view more brands"
//   endIcon={<ArrowRight />}
//   sx={{
//     textTransform: "none",
//     fontSize: isMobile ? 14 : 16,
//     background: theme.palette.mode === "dark" 
//       ? "linear-gradient(90deg, #ff9800, #ffb74d)" 
//       : "linear-gradient(90deg, #f57c00, #ff9800)",
//     color: "#fff",
//     borderRadius: "8px",
//     px: 2,
//     "&:hover": {
//       background: theme.palette.mode === "dark" 
//         ? "linear-gradient(90deg, #ffb74d, #ff9800)" 
//         : "linear-gradient(90deg, #ff9800, #f57c00)",
//       boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
//     },
//   }}
//   onClick={() => window.open("/brandviewpage", "_blank")}
// >
//   View More
// </Button>

//         </Box>

//         <Box sx={{ position: "relative" }}>
//           <Button
//             onClick={handlePrevClick}
//             aria-label="previous"
//             disabled={!showStartShadow}
//             sx={{
//               position: "absolute",
//               left: isMobile ? 2 : 8,
//               top: "50%",
//               transform: "translateY(-50%)",
//               zIndex: 1,
//               minWidth: 40,
//               height: 40,
//               borderRadius: "50%",
//               backgroundColor: "background.paper",
//               boxShadow: 2,
//               "&:hover": {
//                 backgroundColor: "action.hover",
//               },
//               "&:disabled": {
//                 opacity: 0,
//                 pointerEvents: "none",
//               },
//             }}
//           >
//             <ArrowBack fontSize="small" />
//           </Button>

//           <Button
//             onClick={handleNextClick}
//             disabled={!showEndShadow}
//             aria-label="next"
//             sx={{
//               position: "absolute",
//               right: isMobile ? 4 : 8,
//               top: "50%",
//               transform: "translateY(-50%)",
//               zIndex: 1,
//               minWidth: 40,
//               height: 40,
//               borderRadius: "50%",
//               backgroundColor: "background.paper",
//               boxShadow: 2,
//               "&:hover": {
//                 backgroundColor: "action.hover",
//               },
//               "&:disabled": {
//                 opacity: 0,
//                 pointerEvents: "none",
//               },
//             }}
//           >
//             <ArrowForward fontSize="small" />
//           </Button>

//           <Box
//             ref={scrollContainerRef}
//             sx={{
//               display: "flex",
//               overflowX: "auto",
//               gap: isMobile ? 2 : 3,
//               p: 2,
//               scrollBehavior: "smooth",
//               scrollbarWidth: "none",
//               "&::-webkit-scrollbar": { display: "none" },
//             }}
//           >
//             {brands.map((brand) => (
//               <motion.div key={brand.uuid}>
//                 <HomePageBrandCard
//                   brand={brand}
//                   likeProcessing={likeProcessing}
//                   dimensions={dimensions}
//                   theme={theme}
//                   isMobile={isMobile}
//                   isTablet={isTablet}
//                 />
//               </motion.div>
//             ))}
//           </Box>
//         </Box>

//         {showLogin && (
//           <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
//         )}
//       </Box>
//     )
//   );
// };

// export default React.memo(HomeSection9);
