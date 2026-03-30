

"use client";
import React, { useState, useCallback, memo, useMemo, useRef,  } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";


import Favorite from "@mui/icons-material/Favorite";
import Business from "@mui/icons-material/Business";
import AttachMoney from "@mui/icons-material/AttachMoney";
import AreaChart from "@mui/icons-material/AreaChart";
import Description from "@mui/icons-material/Description";
import RadioButtonUnchecked from "@mui/icons-material/RadioButtonUnchecked";
import Block from "@mui/icons-material/Block";
import CheckCircle from "@mui/icons-material/CheckCircle";

import LoginPage from "@/Components/LoginPage/LoginPage";
import { postView } from "@/Utils/function/view";
import { useDispatch } from "react-redux";
import { openBrandDialog } from "@/Redux/Slices/OpenBrandNewPageSlice.jsx";
import {
  toggleBrandLikefilter,
  toggleBrandShortListfilter,
} from "@/Redux/Slices/FilterBrandSlice.jsx";
import { likeApiFunction } from "@/Api/likeApi";
import { handleShortList } from "@/Api/shortListApi";
import {
  toggleBrandLike,
  toggleBrandShortList,
} from "@/Redux/Slices/GetAllBrandsDataUpdationFile.jsx";
import {
  toggleHomeCardLike,
  toggleHomeCardShortlist,
} from "@/Redux/Slices/TopCardFetchingSlice.jsx";
import {
  addSortlist,
  removeSortList,
  toggleSortlistBrandLike,
} from "@/Redux/Slices/shortlistslice.jsx";
import { RiBookmark3Fill } from "react-icons/ri";
import { VideoPlayer } from "@/services/VideoControllerMedia/VideoPlayercomponents.jsx";
import confetti from "canvas-confetti";
import { useSelector } from "react-redux";

const cardStyles = {
  width: { xs: "40vh", sm: "calc(50% - 10px)", md: 260 },
  height: { xs: "55vh", sm: "calc(50% - 10px)", md: 400 },
  ml: 1.5,
  mt: 4,
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s, box-shadow 0.3s",
  position: "relative",
  overflow: "hidden",
  border: "1px solid #ff9800",
  borderRadius: "6px",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
  },
};

const titleStyles = {
  fontWeight: 600,
  color: "text.primary",
  pr: 1,
  ml: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  lineHeight: "1em",
  maxHeight: "2.8em",
  wordBreak: "break-word",
};

const viewButtonStyles = {
  // py: 0.5,
  mx: 1,
  mb: 1,
  bgcolor: "#4caf50",
  borderRadius: 1,
  fontWeight: 500,
  textTransform: "none",
  "&:hover": {
    bgcolor: "#7BC718",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
};

const BrandCard = memo(
  ({
    brand,
    showLogin,
    onShowLogin,
    isSelectedForComparison,
    onToggleBrandComparison,
    maxComparisonReached,
    enableComparison,
  }) => {
    const {
      uuid,
      isLiked,
      isShortListed,
      brandname,
      logo,
      franchiseVideos,
      brandCategories,
      fico,
    } = brand;

    const dispatch = useDispatch();
    const [likeProcessing, setLikeProcessing] = useState(false);
    const [shortlistProcessing, setShortlistProcessing] = useState(false);
    const videoRef = useRef(null);
    const likeButtonRef = useRef(null);
    const shortlistButtonRef = useRef(null);
 const { AccessToken } = useSelector((state) => state.auth);
  const token = AccessToken;
    // 🎉 Updated confetti effect to use element position
    const triggerCelebration = (color, buttonRef) => {
      if (buttonRef && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
          particleCount: 150,
          spread: 100,
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

    const handleOpenBrand = useCallback(() => {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(() => postView(uuid));
      } else {
        setTimeout(() => postView(uuid), 0);
      }
      dispatch(openBrandDialog(brand));
      // console.log('brndssssss',brand);
      
      
    }, [uuid, brand, dispatch]);

    const handleLike = useCallback(async () => {
      if (likeProcessing) return;

    // Debug log to check token value

      if (!token) {
        onShowLogin(true);
        return;
      }else{
        onShowLogin(false);
      }

      setLikeProcessing(true);
      dispatch(toggleSortlistBrandLike(uuid));
      try {
        // Dispatch the Redux action to update UI immediately
        dispatch(toggleBrandLikefilter(uuid));
        dispatch(toggleBrandLike(uuid));
        dispatch(toggleHomeCardLike(uuid));

        // Call the API to update the server
        await likeApiFunction(uuid);

        // Trigger confetti if it's a new like
        if (!isLiked) {
          triggerCelebration("#f44336", likeButtonRef);
        }
      } catch (error) {
        console.error("Error toggling like:", error);
        // Revert the change if API call fails
        dispatch(toggleBrandLikefilter(uuid));
        dispatch(toggleBrandLike(uuid));
        dispatch(toggleHomeCardLike(uuid));
      } finally {
        setLikeProcessing(false);
      }
    }, [uuid, likeProcessing, onShowLogin, dispatch, isLiked]);

    const handleToggleShortList = useCallback(async () => {
      if (shortlistProcessing) return;

      if (!token) {
        onShowLogin(true);
        return;
      }else{
        onShowLogin(false);
      }

      setShortlistProcessing(true);
      try {
        if (!brand.isShortListed) {
          dispatch(addSortlist(brand));
        } else dispatch(removeSortList(brand.uuid));
        // Dispatch the Redux action to update UI immediately
        dispatch(toggleBrandShortListfilter(uuid));
        dispatch(toggleBrandShortList(uuid));
        dispatch(toggleHomeCardShortlist(uuid));
        // Call the API to update the server
        await handleShortList(uuid);

        // Trigger confetti if it's a new shortlist
        if (!isShortListed) {
          triggerCelebration("#7ef400ff", shortlistButtonRef);
        }
      } catch (error) {
        console.error("Error toggling shortlist:", error);
        // Revert the change if API call fails
        dispatch(toggleBrandShortListfilter(uuid));
        dispatch(toggleBrandShortList(uuid));
        dispatch(toggleHomeCardShortlist(uuid));
      } finally {
        setShortlistProcessing(false);
      }
    }, [
      brand,
      uuid,
      shortlistProcessing,
      onShowLogin,
      dispatch,
      isShortListed,
    ]);

    return (
      <Card sx={cardStyles}>
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
                  "&:hover": {
                    transform: "scale(1.15)",
                  },
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                }}
                onClick={() => onToggleBrandComparison(brand)}
                disabled={maxComparisonReached && !isSelectedForComparison}
              >
                {isSelectedForComparison ? (
                  <CheckCircle fontSize="small" /> // ✅ Selected
                ) : maxComparisonReached ? (
                  <Block fontSize="small" /> // ❌ disabled
                ) : (
                  <RadioButtonUnchecked fontSize="small" /> // ⚪ default
                )}
              </IconButton>
            </span>
          </Tooltip>
        )}

        <Box
          sx={{ p: 0.5, flexGrow: 1, display: "flex", flexDirection: "column" }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: "600px",
              height: "auto",
              aspectRatio: "16 / 9",
              margin: "0 auto",
              backgroundColor: "white",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <VideoPlayer
              id={brand.uuid}
              videoUrl={brand.franchiseVideos ||  brand.logo}
              poster={brand.logo}
              preload="auto"
              width="100%"
              height="100%"
              ref={videoRef}
            />
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box display={"flex"} sx={{ justifyContent: "space-between" }}>
            <Box display={"flex"}>
              <Typography
                variant="body2"
                // component="div"
                mt={1}
                sx={titleStyles}
              >
                {brandname}
              </Typography>
            </Box>

            <Box display={"flex"} sx={{ justifyContent: "flex-end" }}>
              <IconButton
                ref={likeButtonRef}
                onClick={handleLike}
                disabled={likeProcessing}
                size="small"
              >
                {likeProcessing ? (
                  <CircularProgress size={20} />
                ) : (
                  <Favorite
                    sx={{
                      color: isLiked ? "#f44336" : "rgba(0, 0, 0, 0.23)",
                      fontSize: 22,
                    }}
                  />
                )}
              </IconButton>
            </Box>
          </Box>

          <Box
            sx={{
              minHeight: 32,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography component={'div'}>
              {brandCategories?.sub ? (
                <Tooltip title={brandCategories?.sub} arrow>
                  <Chip
                    label={
                      brandCategories.sub.length > 35
                        ? `${brandCategories.sub.slice(0, 25)}...`
                        : brandCategories.sub
                    }
                    size="small"
                    sx={{
                      bgcolor: "rgba(255, 152, 0, 0.1)",
                      color: "orange.dark",
                      fontWeight: 150,
                      ml: 0.5,
                      maxWidth: 250,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      ".MuiChip-label": {
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      },
                    }}
                  />
                </Tooltip>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  N/A
                </Typography>
              )}
            </Typography>

            <Box
              display="flex"
              flexDirection={"column"}
              justifyContent="flex-end"
            >
              <IconButton
                ref={shortlistButtonRef}
                onClick={handleToggleShortList}
                size="small"
                disabled={shortlistProcessing}
              >
                {shortlistProcessing ? (
                  <CircularProgress size={20} />
                ) : (
                  <RiBookmark3Fill
                    size={21}
                    color={isShortListed ? "#7ef400ff" : "rgba(0, 0, 0, 0.23)"}
                  />
                )}
              </IconButton>
            </Box>
            
          </Box>

          <Box
            sx={{
              mb: 2,
              ml: 1,
              flexGrow: 1,
              "& > *:not(:last-child)": { mb: 1 },
            }}
          >
            <DetailItem
              icon={<AttachMoney />}
              label="Investment"
              value={fico?.investmentRange}
            />
            <DetailItem
              icon={<AreaChart />}
              label="Area"
              value={fico?.areaRequired}
            />
            <DetailItem
              icon={<Business />}
              label="Franchise Model"
              value={fico?.franchiseModel}
            />
          </Box>

          <Box
            sx={{
              mt: "auto",
              px: 1,
              pb: 1,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              onClick={handleOpenBrand}
              startIcon={<Description />}
              sx={{
                ...viewButtonStyles,
                width: "100%",
                maxWidth: 220,
                textAlign: "center",
              }}
            >
              View Details
            </Button>
          </Box>
        </Box>

        {showLogin && (
          <LoginPage open={showLogin} onClose={() => onShowLogin(false)} />
        )}
      </Card>
    );
  },
  (prevProps, nextProps) =>
    prevProps.brand.uuid === nextProps.brand.uuid &&
    prevProps.brand.isLiked === nextProps.brand.isLiked &&
    prevProps.brand.isShortListed === nextProps.brand.isShortListed &&
    prevProps.isSelectedForComparison === nextProps.isSelectedForComparison &&
    prevProps.showLogin === nextProps.showLogin &&
    prevProps.maxComparisonReached === nextProps.maxComparisonReached &&
    prevProps.enableComparison === nextProps.enableComparison
);

const DetailItem = memo(({ icon, label, value }) => {
  const clonedIcon = useMemo(
    () =>
      React.cloneElement(icon, {
        sx: {
          mr: 1.5,
          fontSize: "1rem",
          color: "text.secondary",
          flexShrink: 0,
        },
      }),
    [icon]
  );

  return (
    <Box display="flex" alignItems="center" >
      {clonedIcon}
      <Typography variant="caption" noWrap>
        <span style={{ fontWeight: 400 }}>{label}:</span> {value || "N/A"}
      </Typography>
    </Box>
  );
});

export default BrandCard;

