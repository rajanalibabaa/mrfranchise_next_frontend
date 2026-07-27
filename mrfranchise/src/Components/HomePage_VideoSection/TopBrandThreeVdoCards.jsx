"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from '@mui/material/IconButton';
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

import ChevronRight from "@mui/icons-material/ChevronRight";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import LoginPage from "@/Components/LoginPage/LoginPage";
import { postView } from "@/Utils/function/view";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBrands,
  resetBrands,
  toggleBrandLike,
  toggleBrandShortList,
} from "@/Redux/Slices/GetAllBrandsDataUpdationFile";
import { openBrandDialog } from "@/Redux/Slices/OpenBrandNewPageSlice.jsx";
import { likeApiFunction } from "@/Api/likeApi";
import {
  toggleHomeCardLike,
  toggleHomeCardShortlist,
} from "@/Redux/Slices/TopCardFetchingSlice";
import { getToken } from "@/Utils/autherId";
import { RiBookmark3Fill } from "react-icons/ri";
import { VideoPlayer } from "@/services/VideoControllerMedia/VideoPlayercomponents.jsx";
import { handleShortList } from "@/Api/shortListApi.jsx";
import {
  addSortlist,
  removeSortList,
  toggleSortlistBrandLike,
} from "@/Redux/Slices/shortlistslice.jsx";
import {
  addLikedBrand,
  removeLikedBrand,
  toggleLikedSliceShortList,
} from "@/Redux/Slices/likeSlice.jsx";
import {
  toggleviewSliceShortList,
  toggleviewSliceLiked,
} from "@/Redux/Slices/viewSlice.jsx";
import { toggleBrandShortListfilter } from "@/Redux/Slices/FilterBrandSlice.jsx";
import { useInView } from 'react-intersection-observer';
import confetti from "canvas-confetti";
import Image from "next/image";

const token = getToken();

// ✅ FIX: Helper to safely extract the actual <video> DOM element from VideoPlayer ref
function extractVideoElement(el) {
  if (!el) return null;

  // Case 1: el IS the video element directly
  if (el.tagName === 'VIDEO') return el;
  if (typeof el.play === 'function') return el;

  // Case 2: el.videoRef is a React ref object { current: <video> }
  if (el.videoRef?.current?.tagName === 'VIDEO') return el.videoRef.current;
  if (el.videoRef?.current && typeof el.videoRef.current.play === 'function') {
    return el.videoRef.current;
  }

  // Case 3: el.videoRef IS the video element directly
  if (el.videoRef?.tagName === 'VIDEO') return el.videoRef;
  if (el.videoRef && typeof el.videoRef.play === 'function') return el.videoRef;

  // Case 4: el.video (some components use this)
  if (el.video?.current?.tagName === 'VIDEO') return el.video.current;
  if (el.video?.tagName === 'VIDEO') return el.video;
  if (el.video && typeof el.video.play === 'function') return el.video;

  // Case 5: Try querySelector as last resort (if el is a DOM node)
  if (el.querySelector) {
    const found = el.querySelector('video');
    if (found) return found;
  }

  return null;
}

function TopBrandVdoCards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [likeProcessing, setLikeProcessing] = useState({});
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialAutoplayDone, setInitialAutoplayDone] = useState(false);
  const [videoReady, setVideoReady] = useState(false); // ✅ Track when video ref is available

  const userPausedRef = useRef(false);
  const timeoutRef = useRef(null);
  const videoRefs = useRef([]);
  const containerElRef = useRef(null); // ✅ Separate DOM ref for click outside detection
  const mainVideoPlayerRef = useRef(null); // ✅ Raw ref from VideoPlayer component
  const retryTimerRef = useRef(null); // ✅ For retry logic

  // ✅ FIX: useInView returns a callback ref, NOT a ref object
  // We need a separate ref for DOM access (handleClickOutside)
  const [inViewRef, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });

  // ✅ Combine both refs into one callback ref
  const setContainerRef = useCallback((node) => {
    containerElRef.current = node;
    inViewRef(node);
  }, [inViewRef]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [viewedBrandsCount, setViewedBrandsCount] = useState(0);

  const CARD_SIZES = {
    main: {
      width: isMobile ? "100%" : isTablet ? "100%" : "68%",
      height: isMobile ? 500 : isTablet ? 480 : 550,
      videoHeight: isMobile ? 275 : isTablet ? 300 : 450,
    },
    side: {
      width: isMobile ? "100%" : isTablet ? "100%" : "30%",
      height: isMobile ? 200 : isTablet ? 220 : 265,
      videoWidth: isMobile ? "40%" : isTablet ? "45%" : "58%",
    },
  };

  const dispatch = useDispatch();
  const { brands, isLoading, pagination, error } = useSelector(
    (state) => state.brands
  );

  // ✅ FIX: Safely get the main video element, with retry capability
  const getMainVideo = useCallback(() => {
    // First try the cached ref
    let video = videoRefs.current[0];
    if (video && typeof video.play === 'function') return video;

    // Re-extract from the raw component ref
    if (mainVideoPlayerRef.current) {
      video = extractVideoElement(mainVideoPlayerRef.current);
      if (video) {
        videoRefs.current[0] = video;
        return video;
      }
    }

    return null;
  }, []);

  // ✅ FIX: Ref callback that properly extracts video element
  const handleMainVideoRef = useCallback((el) => {
    mainVideoPlayerRef.current = el;

    if (el) {
      const videoEl = extractVideoElement(el);
      if (videoEl) {
        videoRefs.current[0] = videoEl;
        setVideoReady(true);
      } else {
        // VideoPlayer might not have rendered the <video> yet
        // Retry after a short delay
        videoRefs.current[0] = null;
        setVideoReady(false);

        // Retry extraction after mount completes
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = setTimeout(() => {
          const retryEl = extractVideoElement(mainVideoPlayerRef.current);
          if (retryEl) {
            videoRefs.current[0] = retryEl;
            setVideoReady(true);
          }
        }, 200);
      }
    } else {
      videoRefs.current[0] = null;
      mainVideoPlayerRef.current = null;
      setVideoReady(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (!initialLoadComplete) {
      dispatch(resetBrands());
      dispatch(fetchBrands({ page: 1 })).then(() => {
        setInitialLoadComplete(true);
      });
    }
  }, [dispatch, initialLoadComplete]);

  useEffect(() => {
    if (pagination) {
      setHasMore(pagination.hasNext);
    }
  }, [pagination]);

  useEffect(() => {
    if (page > 1 && hasMore) {
      dispatch(fetchBrands({ page, limit: 10 }));
    }
  }, [page, dispatch, hasMore]);

  // Reset video ready state when currentIndex changes
  useEffect(() => {
    setVideoReady(false);
    // Re-extract after AnimatePresence swap completes
    const timer = setTimeout(() => {
      if (mainVideoPlayerRef.current) {
        const videoEl = extractVideoElement(mainVideoPlayerRef.current);
        if (videoEl) {
          videoRefs.current[0] = videoEl;
          setVideoReady(true);
        }
      }
    }, 350); // slightly longer than AnimatePresence duration (300ms)

    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (brands.length === 0) return;
    userPausedRef.current = false;
    setViewedBrandsCount((prev) => prev + 1);

    if (viewedBrandsCount >= brands.length - 1 && hasMore && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      dispatch(fetchBrands({ page: nextPage })).then(() => {
        setCurrentIndex(0);
        setViewedBrandsCount(0);
      });
    } else {
      setCurrentIndex((prev) => (prev + 1) % brands.length);
    }
  }, [brands.length, viewedBrandsCount, hasMore, isLoading, page, dispatch]);

  const handlePrev = useCallback(() => {
    if (brands.length > 0) {
      userPausedRef.current = false;
      setCurrentIndex((prev) => (prev - 1 + brands.length) % brands.length);
    }
  }, [brands.length]);

  const startAutoSlide = useCallback(() => {
    clearTimeout(timeoutRef.current);
    if (!isHovered && !userPausedRef.current && brands.length > 0) {
      timeoutRef.current = setTimeout(() => handleNext(), 15000);
    }
  }, [isHovered, brands.length, handleNext]);

  // ✅ FIX: Click outside using containerElRef (not the inView callback ref)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerElRef.current && !containerElRef.current.contains(event.target)) {
        const mainVideo = getMainVideo();
        if (mainVideo && !mainVideo.paused) {
          mainVideo.pause();
          userPausedRef.current = true;
          setActiveVideo(null);
          clearTimeout(timeoutRef.current);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [getMainVideo]);

  // Video event listeners — rebind when videoReady or currentIndex changes
  useEffect(() => {
    const mainVideo = getMainVideo();
    if (!mainVideo) return;

    mainVideo.loop = true;
    mainVideo.playsInline = true;

    const onPlay = () => setActiveVideo(0);
    const onPause = () => setActiveVideo((prev) => (prev === 0 ? null : prev));

    mainVideo.addEventListener("play", onPlay);
    mainVideo.addEventListener("pause", onPause);

    return () => {
      mainVideo.removeEventListener("play", onPlay);
      mainVideo.removeEventListener("pause", onPause);
    };
  }, [videoReady, currentIndex, getMainVideo]);

  // ✅ FIX: Autoplay when video becomes ready and in view
  useEffect(() => {
    const mainVideo = getMainVideo();
    if (!mainVideo || !videoReady) return;

    if (inView && !userPausedRef.current) {
      if (!initialAutoplayDone) {
        const playPromise = mainVideo.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              mainVideo.muted = false;
              setActiveVideo(0);
              setInitialAutoplayDone(true);
            })
            .catch(() => {
              mainVideo.muted = true;
              mainVideo.play()
                .then(() => {
                  setActiveVideo(0);
                  setInitialAutoplayDone(true);
                })
                .catch(() => {
                  // Autoplay completely blocked by browser
                });
            });
        }
      }
    } else if (!inView) {
      mainVideo.pause();
      setActiveVideo(null);
    }
  }, [videoReady, initialAutoplayDone, inView, getMainVideo]);

  // ✅ FIX: Play video when index changes AND video is ready
  useEffect(() => {
    if (!initialAutoplayDone || !videoReady) return;
    if (!inView || userPausedRef.current) return;

    const mainVideo = getMainVideo();
    if (!mainVideo) return;

    mainVideo.play()
      .then(() => setActiveVideo(0))
      .catch(() => {
        // Silently fail — user interaction may be needed
      });
  }, [currentIndex, videoReady, inView, initialAutoplayDone, getMainVideo]);

  // Pause when out of view
  useEffect(() => {
    if (!inView) {
      const mainVideo = getMainVideo();
      if (mainVideo) {
        mainVideo.pause();
      }
      setActiveVideo(null);
    }
  }, [inView, getMainVideo]);

  // Auto-slide timer
  useEffect(() => {
    if (inView && !userPausedRef.current) {
      startAutoSlide();
    } else {
      clearTimeout(timeoutRef.current);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex, startAutoSlide, inView]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(retryTimerRef.current);
      clearTimeout(timeoutRef.current);
      const mainVideo = videoRefs.current[0];
      if (mainVideo) {
        mainVideo.pause();
        mainVideo.src = '';
        mainVideo.load();
      }
    };
  }, []);

  const handleVideoPlay = (index) => {
    if (index === 0) setActiveVideo(0);
  };

  const handleVideoPause = (index) => {
    if (index === 0) setActiveVideo((prev) => (prev === 0 ? null : prev));
  };

  const handleSideVideoClick = (index) => {
    userPausedRef.current = false;
    const clickedBrandIndex = (currentIndex + index + 1) % brands.length;
    setCurrentIndex(clickedBrandIndex);
    setViewedBrandsCount((prev) => prev + 1);
  };

  // ✅ FIX: togglePlayPause with safe video access and no console spam
  const togglePlayPause = useCallback((index) => {
    if (index !== 0) return;

    const video = getMainVideo();
    if (!video) {
      // Video not mounted yet (AnimatePresence transition) — silently ignore
      return;
    }

    if (video.paused) {
      userPausedRef.current = false;
      video.play()
        .then(() => {
          setActiveVideo(0);
          startAutoSlide();
        })
        .catch(() => {
          // Play blocked — possibly needs user gesture
        });
    } else {
      userPausedRef.current = true;
      video.pause();
      setActiveVideo(null);
      clearTimeout(timeoutRef.current);
    }
  }, [getMainVideo, startAutoSlide]);

  const triggerCelebration = (e, color = "#f44336") => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    confetti({
      particleCount: 40,
      spread: 150,
      origin: { x, y },
      colors: [color, "#ffffff", "#fdc81cff", "#76ec1cff", "#ff1dd6ffff", "#00eaffff", "#0400ffff", "#000000", "#f10808ffff", "#f5f50aff"],
    });
  };

  const handleLikeClick = async (brand, e) => {
    if (!token) { setShowLogin(true); return; }
    if (!brand.isLiked) {
      dispatch(addLikedBrand(brand));
      triggerCelebration(e, "#f44336");
    } else {
      dispatch(removeLikedBrand(brand.uuid));
    }
    dispatch(toggleviewSliceLiked(brand.uuid));
    dispatch(toggleBrandLike(brand.uuid));
    dispatch(toggleSortlistBrandLike(brand.uuid));
    dispatch(toggleBrandShortListfilter(brand.uuid));
    dispatch(toggleHomeCardLike(brand.uuid));
    await likeApiFunction(brand.uuid);
  };

  const handleToggleShortList = async (mainBrand, e) => {
    if (!token) { setShowLogin(true); return; }
    dispatch(toggleLikedSliceShortList(mainBrand.uuid));
    dispatch(toggleviewSliceShortList(mainBrand.uuid));
    dispatch(toggleBrandShortList(mainBrand.uuid));
    dispatch(toggleHomeCardShortlist(mainBrand.uuid));
    if (!mainBrand.isShortListed) {
      dispatch(addSortlist(mainBrand));
      triggerCelebration(e, "#7ef400ff");
    } else {
      dispatch(removeSortList(mainBrand.uuid));
    }
    await handleShortList(mainBrand.uuid);
  };

 const handleApply = (brand) => {
  if (!brand?.uuid) {
    console.error("❌ Cannot open brand — missing uuid:", brand);
    return;
  }
  postView(brand.uuid);
  dispatch(openBrandDialog(brand));
};

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      dispatch(fetchBrands({ page: nextPage })).then(() => {
        setCurrentIndex(0);
      });
    }
  };

  useEffect(() => {
    if (currentIndex >= brands.length - 1 && hasMore && !isLoading) {
      handleLoadMore();
    }
  }, [currentIndex, hasMore, isLoading]);

  // Loading states
  if (!initialLoadComplete || (isLoading && brands.length === 0)) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300, borderRadius: 2, boxShadow: 1 }}>
        <Typography color="error">Error loading brands: {error}</Typography>
      </Box>
    );
  }

  if (!brands || brands.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300, borderRadius: 2, boxShadow: 1 }}>
        <CircularProgress color="warning" />
      </Box>
    );
  }

  const mainBrand = brands[currentIndex];
  const nextBrands = [
    brands[(currentIndex + 1) % brands.length],
    brands[(currentIndex + 2) % brands.length],
  ].filter(Boolean);

  const Fact = ({ label, value }) => (
    <Typography variant="body2" color="text.secondary" noWrap>
      <strong>{label}:</strong>&nbsp;{value || "Not Specified"}
    </Typography>
  );

  return (
    <Box
      ref={setContainerRef} // ✅ Combined ref: inView + DOM access
      sx={{
        py: isMobile ? 0 : 1,
        mx: "auto",
        position: "relative",
        maxWidth: isMobile ? "100%" : 1400,
        width: "100%",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          mb: 1,
          px: isMobile ? 2 : 0,
        }}
      >
        <Typography
          variant={isMobile ? "h6" : "h5"}
          fontWeight="bold"
          sx={{
            color: theme.palette.mode === "dark" ? "#ffb74d" : "#000000ff",
            backgroundColor: 'white',
            p: 1.5,
            borderRadius: 2,
            textAlign: "left",
            position: "relative",
            "&:after": {
              content: '""',
              display: "block",
              width: "80px",
              height: "4px",
              background: theme.palette.mode === "dark" ? "#ffb74d" : "#29f500ff",
              mt: 1,
              borderRadius: 2,
            },
          }}
        >
          Premium Franchise Brands
        </Typography>
        {!isMobile && (
          <Image
            src="/Blue Modern Corporate Profile LinkedIn Article Cover Image (1).jpg"
            alt="brand logo"
            loading="lazy"
            width={820}
            height={90}
            style={{
              objectFit: 'contain',
              transition: 'transform 0.3s ease',
              display: 'block',
              marginLeft: '120px',
              borderRadius: '10px',
            }}
          />
        )}
      </Box>

      {/* Brands slider */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 3 : isTablet ? 3 : 2,
          alignItems: "stretch",
          px: isMobile ? 2 : 0,
        }}
      >
        {/* Main Video Card */}
        <Box
          sx={{
            flex: isMobile ? "1 1 auto" : "0 0 68%",
            maxWidth: CARD_SIZES.main.width,
            minWidth: isMobile ? "100%" : "68%",
            position: "relative",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mainBrand.uuid}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Card
                sx={{
                  height: CARD_SIZES.main.height,
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: 6,
                  background: theme.palette.mode === "dark" ? "#424242" : "#ffffff",
                  position: "relative",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: theme.shadows[12],
                  },
                }}
              >
                {/* Video section */}
                <Box
                  sx={{
                    height: CARD_SIZES.main.videoHeight,
                    position: "relative",
                    cursor: "pointer",
                    backgroundColor: "white",
                    overflow: "hidden",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlayPause(0);
                  }}
                >
                  {!isMobile && (
                    <Box sx={{ position: "absolute", top: 16, left: 16, zIndex: 2 }}>
                      <Button
                        variant="outlined"
                        aria-label="previous brand"
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                        startIcon={<ChevronLeft />}
                        sx={{
                          textTransform: "none",
                          color: "white",
                          borderColor: "#43ea5e",
                          "&:hover": {
                            borderColor: theme.palette.mode === "dark" ? "#ff9800" : "#e65100",
                            backgroundColor: theme.palette.mode === "dark"
                              ? "rgba(255, 167, 38, 0.08)"
                              : "rgba(245, 124, 0, 0.08)",
                          },
                        }}
                      >
                        Previous
                      </Button>
                    </Box>
                  )}

                  {!isMobile && (
                    <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 2 }}>
                      {viewedBrandsCount >= brands.length - 1 && hasMore ? (
                        <Button
                          variant="outlined"
                          aria-label="load more brands"
                          onClick={(e) => {
                            e.stopPropagation();
                            const nextPage = page + 1;
                            setPage(nextPage);
                            userPausedRef.current = false;
                            dispatch(fetchBrands({ page: nextPage })).then(() => {
                              setCurrentIndex(0);
                              setViewedBrandsCount(0);
                            });
                          }}
                          disabled={isLoading}
                          sx={{
                            textTransform: "none",
                            color: "white",
                            borderColor: theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00",
                            "&:hover": {
                              borderColor: "#43ea5e",
                              backgroundColor: theme.palette.mode === "dark"
                                ? "rgba(67, 234, 94, 0.15)"
                                : "rgba(67, 234, 94, 0.10)",
                            },
                          }}
                        >
                          {isLoading ? (
                            <>
                              <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
                              Loading...
                            </>
                          ) : (
                            "Load More Brands"
                          )}
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          aria-label="next brand"
                          onClick={(e) => { e.stopPropagation(); handleNext(); }}
                          endIcon={<ChevronRight />}
                          sx={{
                            textTransform: "none",
                            color: "white",
                            borderColor: theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00",
                            "&:hover": {
                              borderColor: "#43ea5e",
                              backgroundColor: theme.palette.mode === "dark"
                                ? "rgba(67, 234, 94, 0.15)"
                                : "rgba(67, 234, 94, 0.10)",
                            },
                          }}
                        >
                          Next Brand
                        </Button>
                      )}
                    </Box>
                  )}

                  <VideoPlayer
                    id={mainBrand.uuid}
                    videoUrl={mainBrand.franchiseVideos}
                    poster={mainBrand.logo} 
                    width="100%"
                    height="100%"
                    preload="none"
                    objectFit="contain"
                    onPlay={() => handleVideoPlay(0)}
                    onPause={() => handleVideoPause(0)}
                    // autoPlay={inView && initialLoadComplete && !userPausedRef.current}
                    loop={true}
                    muted
                    ref={handleMainVideoRef} // ✅ Robust ref handler
                  />
                </Box>

                <CardContent
                  sx={{
                    bgcolor: "background.paper",
                    px: { xs: 0, sm: 2 },
                    py: 0,
                    height: `calc(${CARD_SIZES.main.height}px - ${CARD_SIZES.main.videoHeight}px)`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    ml={{ xs: 2 }}
                    mt={1}
                    spacing={1}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ minWidth: 0, flex: 1, paddingBottom: "10px" }}
                    >
                      {isMobile && (
                        <Avatar
                          onClick={() => handleApply(mainBrand)}
                          src={mainBrand.logo}
                          alt={mainBrand.brandname}
                          sx={{
                            width: 50, height: 50,
                            border: `2px solid ${theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00"}`,
                            boxShadow: theme.shadows[2],
                            cursor: "pointer",
                          }}
                        />
                      )}
                      {!isMobile && (
                        <Box
                          component="img"
                          onClick={() => handleApply(mainBrand)}
                          src={mainBrand.logo}
                          alt={mainBrand.brandname}
                          sx={{
                            width: 100, height: 50,
                            border: `2px solid ${theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00"}`,
                            boxShadow: theme.shadows[2],
                            cursor: "pointer",
                            borderRadius: 0,
                            objectFit: "contain",
                            display: "block",
                            marginRight: 2,
                          }}
                        />
                      )}
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Box display="flex" alignItems="center">
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            noWrap
                            sx={{
                              backgroundColor: "black",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                            }}
                          >
                            {mainBrand.brandname}
                          </Typography>
                          <Box>
                            {isMobile && (
                              <Tooltip title={mainBrand.isLiked ? "Remove from favorites" : "Add to favorites"}>
                                <IconButton
                                aria-label="like brand"
                                  onClick={(e) => handleLikeClick(mainBrand, e)}
                                  disabled={isLoading || likeProcessing[mainBrand.uuid]}
                                  sx={{ color: mainBrand.isLiked ? "red" : "gray" }}
                                >
                                  {mainBrand.isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </Box>
                        <Typography variant="body2" noWrap overflow="hidden" textOverflow="ellipsis" color="text.secondary">
                          {mainBrand.brandCategories?.sub || "N/A"}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction={{ xs: "row" }} alignItems={{ xs: "flex-start", sm: "center" }} spacing={6}>
                      <Stack direction="column" spacing={1}>
                        <Fact label="Investment" value={mainBrand.fico?.investmentRange} />
                        <Fact label="Area Required" value={mainBrand.fico?.areaRequired} />
                        <Fact label="Franchise Model" value={mainBrand.fico?.franchiseModel} />
                        {isMobile && (
                          <Button
                            variant="contained"
                            aria-label="view details"
                            onClick={() => handleApply(mainBrand)}
                            sx={{
                              width: "35vh", fontWeight: 800, textTransform: "none", color: "#fff",
                              background: "linear-gradient(45deg, #4cb04f, #4cb04f)",
                              "&:hover": {
                                background: "linear-gradient(45deg, #000000ff, #000000ff)",
                                boxShadow: theme.shadows[4],
                              },
                            }}
                          >
                            View Details
                          </Button>
                        )}
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        {!isMobile && (
                          <Button
                            variant="contained"
                            aria-label="view details"
                            onClick={() => handleApply(mainBrand)}
                            sx={{
                              px: 3, fontWeight: 600, fontSize: '1rem', textTransform: "none", color: "#fff",
                              background: "linear-gradient(45deg, #4cb04f, #4cb04f)",
                              "&:hover": {
                                background: "linear-gradient(45deg, #000000ff, #000000ff)",
                                boxShadow: theme.shadows[4],
                              },
                            }}
                          >
                            View Details
                          </Button>
                        )}
                        {!isMobile && (
                          <>
                            <Tooltip title={mainBrand.isLiked ? "Remove from favorites" : "Add to favorites"}>
                              <IconButton 
                                aria-label="like brand"
                                onClick={(e) => handleLikeClick(mainBrand, e)}
                                disabled={isLoading || likeProcessing[mainBrand.uuid]}
                              >
                                {mainBrand.isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={mainBrand.isShortListed ? "Remove from shortlist" : "Add to shortlist"}>
                              <IconButton 
                                aria-label="shortlist brand"
                                onClick={(e) => handleToggleShortList(mainBrand, e)}
                                sx={{ color: mainBrand.isShortListed ? "#7ef400ff" : "rgba(0, 0, 0, 0.23)" }}
                              >
                                <RiBookmark3Fill size={21} />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Stack>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {isMobile && (
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2, width: "100%" }}>
              <Button
                variant="contained"
                onClick={handlePrev}
                startIcon={<ChevronLeft />}
                fullWidth
                sx={{
                  textTransform: "none",
                  color: "#ffffff",
                  background: theme.palette.mode === "dark"
                    ? "linear-gradient(45deg, #ffb74d, #ff9800)"
                    : "linear-gradient(45deg, #f57c00, #ff9800)",
                }}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  if (viewedBrandsCount >= brands.length - 1 && hasMore) {
                    handleLoadMore();
                  } else {
                    handleNext();
                  }
                }}
                endIcon={isLoading ? <CircularProgress size={20} sx={{ color: "inherit" }} /> : <ChevronRight />}
                disabled={!hasMore && currentIndex === brands.length - 1}
                fullWidth
                sx={{
                  textTransform: "none",
                  background: theme.palette.mode === "dark"
                    ? "linear-gradient(45deg, #ffb74d, #ff9800)"
                    : "linear-gradient(45deg, #f57c00, #ff9800)",
                }}
              >
                {isLoading ? "Loading..." : viewedBrandsCount >= brands.length - 1 && hasMore ? "Load More" : "Next"}
              </Button>
            </Box>
          )}
        </Box>

        {/* Right Side Cards */}
        <Box
          sx={{
            flex: isMobile ? "1 1 auto" : "0 0 30%",
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? 3 : isTablet ? 3 : 2,
            minWidth: isMobile ? "100%" : "32%",
          }}
        >
          {nextBrands.map((brand, i) => (
            <motion.div
              key={brand.uuid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <Card
                sx={{
                  height: CARD_SIZES.side.height,
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: 4,
                  background: theme.palette.mode === "dark" ? "#424242" : "#ffffff",
                  display: "flex",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <Box
                  sx={{
                    width: CARD_SIZES.side.videoWidth,
                    height: "100%",
                    position: "relative",
                    cursor: "pointer",
                    backgroundColor: "white",
                    flexShrink: 0,
                  }}
                  onClick={(e) => { e.stopPropagation(); handleSideVideoClick(i); }}
                >
                  <video
                    ref={(el) => (videoRefs.current[i + 1] = el)}
                    loading="lazy"
                    preload="none"
                    src={brand.franchiseVideos}
                    alt={brand.brandname}
                    poster={brand.logo}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    muted
                    loop
                    playsInline
                  />

                  {/* Always show play icon on side cards (they swap to main on click) */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 60, height: 60,
                      borderRadius: "50%",
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      zIndex: 10,
                      "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.8)" },
                    }}
                    onClick={(e) => { e.stopPropagation(); handleSideVideoClick(i); }}
                  >
                    <Box
                      component="span"
                      sx={{
                        width: 0, height: 0,
                        borderTop: "12px solid transparent",
                        borderBottom: "12px solid transparent",
                        borderLeft: "20px solid white",
                        marginLeft: "4px",
                      }}
                    />
                  </Box>

                  <Chip
                    label={i === 0 ? "Trending" : "Popular"}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 8, left: 8,
                      background: theme.palette.mode === "dark"
                        ? "linear-gradient(45deg, #ffb74d, #ff9800)"
                        : "linear-gradient(45deg, #f57c00, #ff9800)",
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "0.65rem",
                      zIndex: 10,
                    }}
                  />
                </Box>

                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    p: 1.5,
                    overflow: "hidden",
                  }}
                >
                  <Box sx={{ overflow: "hidden" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 0.5 }}>
                      <Box
                        component="img"
                        onClick={() => handleApply(brand)}
                        src={brand.logo}
                        alt={brand.brandname}
                        sx={{
                          width: isMobile ? 80 : 100,
                          height: 50,
                          border: `2px solid ${theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00"}`,
                          boxShadow: theme.shadows[2],
                          cursor: "pointer",
                          borderRadius: 0,
                          objectFit: "contain",
                          display: "block",
                        }}
                      />
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        <Tooltip title={brand.isLiked ? "Remove from favorites" : "Add to favorites"}>
                          <IconButton
                            size="small" 
                            aria-label="like brand"
                            onClick={(e) => handleLikeClick(brand, e)}
                            disabled={isLoading || likeProcessing[brand.uuid]}
                            sx={{ color: brand.isLiked ? "red" : "gray" }}
                          >
                            {brand.isLiked ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={brand.isShortListed ? "Remove from shortlist" : "Add to shortlist"}>
                          <IconButton
                            size="small"
                            aria-label="shortlist brand"
                            onClick={(e) => handleToggleShortList(brand, e)}
                            sx={{ color: brand.isShortListed ? "#7ef400ff" : "rgba(0, 0, 0, 0.23)" }}
                          >
                            <RiBookmark3Fill size={18} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        maxHeight: 80,
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.8,
                        scrollbarWidth: "thin",
                        "&::-webkit-scrollbar": { width: "4px" },
                        "&::-webkit-scrollbar-thumb": { backgroundColor: "#ccc", borderRadius: "2px" },
                      }}
                    >
                      <Tooltip title={brand.brandname}>
                        <Typography
                          variant={isMobile ? "caption" : "body1"}
                          color="black"
                          mt={1}
                          sx={{ flex: 1, minWidth: 0, whiteSpace: "normal", wordBreak: "break-word", overflowWrap: "break-word" }}
                        >
                          {brand.brandname}
                        </Typography>
                      </Tooltip>
                      <Typography variant="caption" color="Black" sx={{ fontSize: "0.7rem", lineHeight: 1.1 }}>
                        {brand.brandCategories?.sub}
                      </Typography>
                      <Typography variant="caption" color="Black" sx={{ fontSize: "0.7rem", lineHeight: 1.4 }}>
                        {brand.fico?.investmentRange}
                      </Typography>
                      <Typography variant="caption" color="Black" sx={{ fontSize: "0.7rem", lineHeight: 1.4 }}>
                        {brand.fico?.areaRequired}
                      </Typography>
                      <Typography variant="caption" color="Black" sx={{ fontSize: "0.7rem", lineHeight: 1.5, mb: isMobile ? 1.5 : 0 }}>
                        {brand.fico?.franchiseModel}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    onClick={() => handleApply(brand)}
                    fullWidth
                    size="small"
                    sx={{
                      background: "linear-gradient(45deg, #4cb04f, #4cb04f)",
                      textTransform: "none",
                      fontSize: "1rem",
                      color: "#fff",
                      fontWeight: 600,
                      minWidth: 100,
                      "&:hover": {
                        background: "linear-gradient(45deg, #000000ff, #000000ff)",
                        boxShadow: theme.shadows[2],
                      },
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Box>

      {showLogin && <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />}
    </Box>
  );
}

export default TopBrandVdoCards;