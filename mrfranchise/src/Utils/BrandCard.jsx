"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  IconButton,
  Chip,
  Divider,
  Stack,
  Tooltip,
} from "@mui/material";
import { motion } from "framer-motion";
import Favorite from "@mui/icons-material/Favorite";
import PlaylistAddCheckCircleOutlined from "@mui/icons-material/PlaylistAddCheckCircleOutlined";
import RadioButtonUnchecked from "@mui/icons-material/RadioButtonUnchecked";
import Block from "@mui/icons-material/Block";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Business from "@mui/icons-material/Business";
import MonetizationOn from "@mui/icons-material/MonetizationOn";
import AreaChart from "@mui/icons-material/AreaChart";
import { useDispatch } from "react-redux";
import { toggleShortlist } from "../Redux/Slices/brandSlice";

const BrandCard = ({
  brand,
  handleApply,
  handleLikeClick,
  likeProcessing,
  width,
  height,
  theme,
  // Comparison props (optional)
  isSelectedForComparison = false,
  onToggleBrandComparison = () => {},
  maxComparisonReached = false,
  enableComparison = false,
}) => {
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef();
  const [shortListLoading, setShortListLoading] = useState(false);
  const dispatch = useDispatch();

  const brandId = brand?.uuid || "";
  const franchiseModel = brand?.franchiseDetails?.fico?.[0] || {};
  const category = brand?.franchiseDetails?.brandCategories || {};
  const videoUrl = brand?.uploads?.franchisePromotionVideo?.[0];
  const brandLogo = brand?.uploads?.brandLogo?.[0] || "";
  const brandName = brand?.brandDetails?.brandName || "Brand";
  const mediaHeight = height * 0.4;

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

  const handleToggleShortList = async () => {
    try {
      setShortListLoading(true);
      await dispatch(toggleShortlist(brand)).unwrap();
    } catch (error) {
      console.error("Error toggling shortlist:", error);
    } finally {
      setShortListLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ width, flexShrink: 0 }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          overflow: "hidden",
          width: "100%",
          height,
          border: "1px solid #eee",
        }}
      >
        {/* Compare Toggle */}
        {enableComparison && (
          <Tooltip
            title={
              maxComparisonReached && !isSelectedForComparison
                ? "Maximum 3 brands can be compared"
                : isSelectedForComparison
                ? "Already selected"
                : "Click to add to comparison"
            }
            placement="right"
            arrow
          >
            <span>
              <IconButton
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 2,
                  backgroundColor: isSelectedForComparison
                    ? "#ff9800"
                    : maxComparisonReached
                    ? "rgba(244, 67, 54, 0.75)"
                    : "rgba(255,255,255,0.85)",
                  color: isSelectedForComparison ? "#fff" : "#ff8914ff",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                }}
                onClick={() => onToggleBrandComparison(brand)}
                disabled={maxComparisonReached && !isSelectedForComparison}
              >
                {isSelectedForComparison ? (
                  <CheckCircle fontSize="small" />
                ) : maxComparisonReached ? (
                  <Block fontSize="small" />
                ) : (
                  <RadioButtonUnchecked fontSize="small" />
                )}
              </IconButton>
            </span>
          </Tooltip>
        )}

        <Box
          ref={videoRef}
          sx={{
            height: mediaHeight,
            width: "100%",
            overflow: "hidden",
            position: "relative",
            backgroundColor: theme.palette.grey[200],
          }}
        >
          {isVisible && videoUrl ? (
            <CardMedia
              component="video"
              loading="lazy"
              poster={brandLogo}
              src={videoUrl}
              alt={brandName}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
              controls
              muted
              loop
              preload="none"
            />
          ) : (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                No video available
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ pb: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                justifyContent: "space-between",
              }}
            >
              <Box
                component="img"
                src={brand?.uploads?.brandLogo?.[0]}
                alt={brand.uploads?.brandName}
                loading="lazy"
                sx={{
                  width: 100,
                  height: 50,
                  border: "1px solid #f29724",
                  mb: 1,
                  objectFit: "contain",
                }}
              />
              
              <Box>
                <IconButton
                  onClick={handleToggleShortList}
                  disabled={shortListLoading}
                  sx={{
                    color: brand?.isShortListed ? "#7ef400ff" : "rgba(0, 0, 0, 0.23)",
                  }}
                >
                  <Tooltip title="ShortList">
                    {shortListLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <PlaylistAddCheckCircleOutlined />
                    )}
                  </Tooltip>
                </IconButton>

                <IconButton
                  onClick={() => handleLikeClick(brandId, brand?.isLiked)}
                  disabled={likeProcessing[brandId]}
                >
                  {likeProcessing[brandId] ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Favorite
                      sx={{
                        color: brand?.isLiked
                          ? "#f44336"
                          : "rgba(0, 0, 0, 0.23)",
                      }}
                    />
                  )}
                </IconButton>
              </Box>
            </Box>
            
            <Typography
              variant="body1"
              fontWeight={800}
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
            
            {category?.child && (
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={category.child}
                  size="small"
                  sx={{
                    bgcolor: "rgba(255, 152, 0, 0.1)",
                    color: "orange.dark",
                    fontWeight: 500,
                  }}
                />
              </Box>
            )}

            <Stack spacing={1} sx={{ mb: 2 }}>
              <Box display="flex" alignItems="center">
                <Business sx={{ mr: 1.5, fontSize: "1rem", color: "text.secondary" }} />
                <Typography variant="body2">
                  <strong>Investment:</strong> {investmentRange}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center">
                <MonetizationOn sx={{ mr: 1.5, fontSize: "1rem", color: "text.secondary" }} />
                <Typography variant="body2">
                  <strong>Area:</strong> {areaRequired}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center">
                <AreaChart sx={{ mr: 1.5, fontSize: "1rem", color: "text.secondary" }} />
                <Typography variant="body2">
                  <strong>Type:</strong> {modelType}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 1 }} />
          </CardContent>

          <Box sx={{ px: 2, pb: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => handleApply(brand)}
              sx={{
                backgroundColor: "#f29724",
                "&:hover": {
                  backgroundColor: "#e68a1e",
                  boxShadow: 2,
                },
                py: 1,
                borderRadius: 1,
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              View Details
            </Button>
          </Box>
        </Box>
      </Card>
    </motion.div>
  );
};

export default BrandCard;