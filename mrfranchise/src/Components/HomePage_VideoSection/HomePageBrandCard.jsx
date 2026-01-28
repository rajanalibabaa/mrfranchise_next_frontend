"use client";
import React, { useEffect, useRef, useState } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import { motion } from "framer-motion";
import Favorite from "@mui/icons-material/Favorite";
import Business from "@mui/icons-material/Business";
import MonetizationOn from "@mui/icons-material/MonetizationOn";
import AreaChart from "@mui/icons-material/AreaChart";
import { handleShortList } from "@/Api/shortListApi";
import LoginPage from "@/Components/LoginPage/LoginPage";
import { RiBookmark3Fill } from "react-icons/ri";
import {
  toggleHomeCardLike,
  toggleHomeCardShortlist,
} from "@/redux/Slices/TopCardFetchingSlice";
import { getToken } from "@/Utils/autherId.jsx";
import { VideoPlayer } from "@/services/VideoControllerMedia/VideoPlayercomponents.jsx";
import { postView } from "@/Utils/function/view.jsx";
import { openBrandDialog } from "@/redux/Slices/OpenBrandNewPageSlice.jsx";
import { useDispatch } from "react-redux";
import {
  addSortlist,
  removeSortList,
  toggleSortlistBrandLike,
  fetchShortListedById,
} from "@/redux/Slices/shortlistslice.jsx";
import {
  toggleBrandLike,
  toggleBrandShortList,
} from "@/redux/Slices/GetAllBrandsDataUpdationFile.jsx";
import { likeApiFunction } from "@/Api/likeApi.jsx";
import {
  addLikedBrand,
  removeLikedBrand,
  toggleLikedSliceShortList,
  fetchLikedBrandsById,
} from "@/redux/Slices/likeSlice.jsx";
import {
  toggleviewSliceShortList,
  toggleviewSliceLiked,
  fetchViewBrandsById,
} from "@/redux/Slices/viewSlice.jsx";
import {
  toggleBrandShortListfilter,
  toggleBrandLikefilter,
} from "@/redux/Slices/FilterBrandSlice.jsx";
import confetti from "canvas-confetti";
const token = getToken();
const cardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const AnimatedIconButton = motion(IconButton);

const HomePageBrandCard = React.memo(
  ({ brand, likeProcessing, dimensions, theme }) => {
    const videoRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const observerRef = useRef();
    const [showLogin, setShowLogin] = useState(false);
    const shortlistButtonRef = useRef(null);
    const likeButtonRef = useRef(null);

    const brandId = brand?.uuid || "";
    const franchiseModel = brand?.fico || {};
    const category = brand?.brandCategories || {};
    const brandLogo = brand?.logo || "";
    const brandName = brand?.brandname || brand?.brandName;

    const {
      investmentRange = "Not specified",
      areaRequired = "Not specified",
      franchiseModel: modelType = "N/A",
    } = franchiseModel;

    useEffect(() => {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observerRef.current.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      if (videoRef.current) {
        observerRef.current.observe(videoRef.current);
      }

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }, []);

    const [shortListed, setShortListed] = useState(brand.isShortListed);
    const dispatch = useDispatch();

    // 🎉 Updated confetti effect to use element position
    const triggerCelebration = (color, elementRef) => {
      if (elementRef && elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
          particleCount: 200,
          spread: 150,
          origin: { x, y },
          colors: [
            color,
            "#ffffff",
            "#fdc81cff",
            "#76ec1cff",
            "#ff1dd6ffff",
            "#00eaffff",
            "#0400ffff",
            "#000000",
            "#f10808ffff",
            "#f5f50aff",
          ],
        });
      } else {
        // Fallback to center if element not found
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: [color, "#ffffff"],
        });
      }
    };

    const handleToggleShortList = async (brand) => {
      try {
        if (!token) {
          setShowLogin(true);
          return;
        }
        if (!brand.isShortListed) {
          dispatch(addSortlist(brand));
        } else {
          dispatch(removeSortList(brand?.uuid));
        }
        dispatch(toggleLikedSliceShortList(brand?.uuid));
        dispatch(toggleviewSliceShortList(brand?.uuid));
        dispatch(toggleBrandShortListfilter(brand?.uuid));
        dispatch(toggleBrandShortList(brand?.uuid));
        dispatch(toggleHomeCardShortlist(brand?.uuid));

        await handleShortList(brand?.uuid);
        setShortListed(!shortListed);
        // Refetch shortlisted brands
        dispatch(fetchShortListedById({ page: 1, limit: 10 }));

        if (!brand.isShortListed) {
          triggerCelebration("#7ef400ff", shortlistButtonRef);
        }
      } catch (error) {
        console.error("Error toggling shortlist:", error);
      }
    };

    const handleLikeClick = async (brand) => {
      try {
        if (!token) {
          setShowLogin(true);
          return;
        }
        dispatch(toggleSortlistBrandLike(brand?.uuid));
        dispatch(toggleBrandLikefilter(brand?.uuid));
        dispatch(toggleBrandLike(brand?.uuid));
        if (!brand?.isLiked) {
          dispatch(addLikedBrand(brand));
        } else {
          dispatch(removeLikedBrand(brand?.uuid));
        }
        dispatch(toggleviewSliceLiked(brand?.uuid));
        dispatch(toggleHomeCardLike(brand?.uuid));
        await likeApiFunction(brand?.uuid);
        // Refetch liked brands
        dispatch(fetchLikedBrandsById({ page: 1, limit: 10 }));

        if (!brand?.isLiked) {
          triggerCelebration("#f44336", likeButtonRef);
        }
      } catch (error) {
        console.error("Error toggling like:", error);
      }
    };

    const handleApply = (brand) => {
      postView(brand?.uuid);
      dispatch(openBrandDialog(brand));
      // Refetch viewed brands
      dispatch(fetchViewBrandsById({ page: 1, limit: 10 }));
    };

    return (
      <motion.div
        key={brandId}
        variants={cardVariants}
        style={{ width: dimensions.width, flexShrink: 0 }}
      >
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            overflow: "hidden",
            width: "100%",
            height: dimensions.height,
            border: "1px solid #03f507ff",
          }}
        >
          <VideoPlayer
            id={brand.uuid}
            videoUrl={brand.franchiseVideos || brand.logo}
            poster={brand.logo}
            preload="auto"
            width="100%"
            height={dimensions.height * 0.4}
            ref={videoRef}
          />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ pb: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: "space-between",
                }}
              >
                <Box
                  component="img"
                  src={brandLogo}
                  alt={brandName}
                  loading="lazy"
                  onClick={() => handleApply(brand)}
                  cursor="pointer"
                  sx={{
                    width: 100,
                    height: 50,
                    border: "1px solid #f29724",
                    mb: 1,
                    borderRadius: 2,
                    objectFit: "contain",
                  }}
                />

                {/* 🔖 ShortList Button with animations */}
                <AnimatedIconButton
                  ref={shortlistButtonRef}
                  onClick={() => handleToggleShortList(brand)}
                  whileTap={{ scale: 0.8 }}
                  whileHover={{ scale: 1.2 }}
                  animate={
                    brand.isShortListed ? { scale: [1, 1.3, 1] } : { scale: 1 }
                  }
                  transition={{ duration: 0.3 }}
                  sx={{
                    color: brand.isShortListed
                      ? "#7ef400ff"
                      : "rgba(0, 0, 0, 0.23)",
                  }}
                >
                  <Tooltip title={"ShortList"}>
                    <RiBookmark3Fill size={21} />
                  </Tooltip>
                </AnimatedIconButton>

                {/* ❤️ Like Button with animations */}
                <AnimatedIconButton
                  ref={likeButtonRef}
                  onClick={() => handleLikeClick(brand)}
                  disabled={likeProcessing[brandId]}
                  whileTap={{ scale: 0.8 }}
                  whileHover={{ scale: 1.2 }}
                  animate={
                    brand.isLiked ? { scale: [1, 1.4, 1] } : { scale: 1 }
                  }
                  transition={{ duration: 0.3 }}
                  sx={{
                    color: brand?.isLiked ? "#f44336" : "rgba(0, 0, 0, 0.23)",
                  }}
                >
                  {likeProcessing[brandId] ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Favorite />
                  )}
                </AnimatedIconButton>
              </Box>

              <Typography
                variant="body1"
                fontWeight={500}
                onClick={() => handleApply(brand)}
                cursor="pointer"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  flex: 1,
                  mb: 1,
                }}
              >
                {brandName}
              </Typography>

              {category?.sub && (
                <Box sx={{ mb: 2 }}>
                  <Stack
                    direction="row"
                    spacing={3}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Chip
                      label={category.sub}
                      size="small"
                      sx={{
                        bgcolor: "rgba(255, 152, 0, 0.1)",
                        color: "orange.dark",
                        fontWeight: 500,
                        mb: 1,
                      }}
                    />
                  </Stack>
                </Box>
              )}

              <Stack spacing={1} sx={{ mb: 2 }}>
                <Box display="flex" alignItems="center">
                  <Business
                    sx={{
                      mr: 1.5,
                      fontSize: "1rem",
                      color: "text.secondary",
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body2">
                    <strong>Investment:</strong> {investmentRange}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center">
                  <MonetizationOn
                    sx={{
                      mr: 1.5,
                      fontSize: "1rem",
                      color: "text.secondary",
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body2">
                    <strong>Area:</strong> {areaRequired}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center">
                  <AreaChart
                    sx={{
                      mr: 1.5,
                      fontSize: "1rem",
                      color: "text.secondary",
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body2">
                    <strong>Model :</strong> {modelType}
                  </Typography>
                </Box>
              </Stack>

              {/* <Divider sx={{ my: 1 }} /> */}
            </CardContent>

            <Box sx={{ px: 2, pb: 2.5 }}>
              <Button
                variant="contained"
                aria-label="view details"
                fullWidth
                onClick={() => handleApply(brand)}
                sx={{
                  backgroundColor: "#f29724",
                  "&:hover": {
                    backgroundColor: "#000000ff",
                    boxShadow: 2,
                  },
                  // py: 1,
                  maxWidth: 200,
                  ml:6,
                  borderRadius: 1,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                }}
              >
                View Details
              </Button>
            </Box>
          </Box>
        </Card>
        {showLogin && (
          <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
        )}
      </motion.div>
    );
  }
);

export default HomePageBrandCard;
