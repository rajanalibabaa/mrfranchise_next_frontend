"use client";
import React, {  useEffect, useState, useRef } from "react";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import { useMediaQuery, useTheme } from "@mui/material";

import { RiBookmark3Fill } from "react-icons/ri";
import { motion } from "framer-motion";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { postView } from "@/Utils/function/view";
import LoginPage from "@/Components/LoginPage/LoginPage";
import { useDispatch, useSelector } from "react-redux";
import { fetchBrands, toggleBrandLike, toggleBrandShortList } from "@/Redux/Slices/GetAllBrandsDataUpdationFile";
import { likeApiFunction } from "@/Api/likeApi";
import { toggleHomeCardLike, toggleHomeCardShortlist } from "@/Redux/Slices/TopCardFetchingSlice";
import {  getToken } from "@/Utils/autherId";
import { handleShortList } from "@/Api/shortListApi";
import { openBrandDialog } from "@/Redux/Slices/OpenBrandNewPageSlice.jsx";
import { addSortlist, removeSortList, toggleSortlistBrandLike } from "@/Redux/Slices/shortlistslice.jsx";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";

const token = getToken();
const TopInvestVdocardround = () => {
  const [likeProcessing, setLikeProcessing] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const [page, setPage] = useState(1);
  const [allBrands, setAllBrands] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const likeButtonRefs = useRef({});
  const shortlistButtonRefs = useRef({});
const navigate = useRouter();
  const dispatch = useDispatch();
 
  const {
    brands,
    isLoading,
    error,
    pagination = { totalPages: 1 },
    fetchedPages = [],
  } = useSelector((state) => state.brands);
 
  const hasMore = pagination.totalPages > page;
 
  useEffect(() => {
    if (!fetchedPages.includes(page)) {
      dispatch(fetchBrands({ page }));
      // console.log("toptrending",fetchBrands);
      
    }
  }, [page, fetchedPages, dispatch]);
 
  // useEffect(() => {
  //   if (Array.isArray(brands)) {
  //     setAllBrands((prev) => {
  //       const existingUUIDs = new Set(prev.map((b) => b.uuid));
  //       const uniqueNewBrands = brands.filter((b) => !existingUUIDs.has(b.uuid));
  //       return [...prev, ...uniqueNewBrands];
  //     });
  //   }
  // }, [brands]);

  // 🎉 Updated confetti effect to use element position
  const triggerCelebration = (color, brandId, buttonType) => {
    const refs = buttonType === 'like' ? likeButtonRefs : shortlistButtonRefs;
    const buttonRef = refs.current[brandId];
    
    if (buttonRef) {
      const rect = buttonRef.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { x, y },
          colors: [color, "#ffffff", "#fdc81cff", "#76ec1cff", "#ff1dd6ffff", "#00eaffff", "#0400ffff", "#000000", "#f10808ffff", "#f5f50aff"],
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
    if (!token) {
      setShowLogin(true);
      return;
    }
    try {
      if (!brand.isShortListed) {
        dispatch(addSortlist(brand));
      } else {
        dispatch(removeSortList(brand.uuid));
      }
      dispatch(toggleBrandShortList(brand.uuid));
      await handleShortList(brand.uuid);
      dispatch(toggleHomeCardShortlist(brand.uuid));

      if (!brand.isShortListed) {
        triggerCelebration("#7ef400ff", brand.uuid, 'shortlist');
      }
    } catch (error) {
      console.error("Error toggling shortlist:", error);
    }
  };
 
  const handleLikeClick = async (brand) => {
    if (!token) {
      setShowLogin(true);
      return;
    }
 
    setLikeProcessing((prev) => ({ ...prev, [brand.uuid]: true }));
    try {
    
      dispatch(toggleSortlistBrandLike(brand.uuid));
      dispatch(toggleBrandLike(brand.uuid));
      dispatch(toggleHomeCardLike(brand.uuid));
      await likeApiFunction(brand.uuid);

      // if (!brand.isLiked) {
      //   triggerCelebration("#f44336", brand.uuid, 'like');
      // }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLikeProcessing((prev) => ({ ...prev, [brand.uuid]: false }));
    }
  };
 
  const handleApply = (brand) => {
    postView(brand.uuid);
    dispatch(openBrandDialog(brand));
  };
 
  if (isLoading && allBrands.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress size={60} thickness={4} sx={{ color: "#f29724" }} />
      </Box>
    );
  }
 
  if (error) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography color="error">
          {error.message || "Failed to load brands."}
        </Typography>
      </Box>
    );
  }
 
  return (
    <Box component="section" sx={{ maxWidth: 1300, mx: "auto" }}>
      <Typography
        variant={isMobile ? "body1" : "h5"}
        fontWeight="bold"
        sx={{
          color: "#f29624",
          mb: 3.5,
          backgroundColor:'white',
            p: 1.5,
            borderRadius: 2,
            display: "inline-block",
          textAlign: "left",
          position: "relative",
          "&:after": {
            content: '""',
            display: "block",
            width: "80px",
            height: "4px",
            background:
              theme.palette.mode === "dark" ? "#ffb74d" : "#31f500ff",
            mt: 1,
            borderRadius: 2,
          },
        }}
      >
        Franchise Opportunities
      </Typography>
 
      <Box
        sx={{
          display: "grid",
         gridTemplateColumns: {
      xs: "repeat(2, minmax(0,1fr))",
      sm: "repeat(3, minmax(0,1fr))",
      md: "repeat(4, minmax(0,1fr))",
      lg: "repeat(5, minmax(0,1fr))",
    },
          gap: { xs: 4, sm: 3, md: 3, lg: 2 },
          mb: 3,
          alignItems: "center",
          width: "100%",
          px: { xs: 1, sm: 2 },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {brands.map((brand) => (
          <motion.div
            key={brand.uuid}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            style={{ minWidth: 0 }}
          >
            <Card
              sx={{
                p: 1.5,
                borderRadius: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(242, 151, 36, 0.2)",
                },
                maxWidth: "100%",
                minHeight: 300,
                overflow: "hidden",
              }}
            >
              {!isMobile && (
                <Stack
                  direction="column"
                  spacing={0.5}
                  sx={{ position: "absolute", top: 4, right: 4, zIndex: 2 }}
                >
                  <IconButton
                    ref={el => likeButtonRefs.current[brand.uuid] = el}
                    sx={{
                      color: brand?.isLiked ? "#ff5252" : "rgba(0,0,0,0.2)",
                      "&:hover": { color: "#ff5252" },
                    }}
                    onClick={() => handleLikeClick(brand)}
                    disabled={likeProcessing[brand.uuid]}
                  >
                    {likeProcessing[brand.uuid] ? (
                      <CircularProgress size={24} />
                    ) : brand?.isLiked ? (
                      <FavoriteIcon fontSize="small" />
                    ) : (
                      <FavoriteBorderIcon fontSize="small" />
                    )}
                  </IconButton>
 
                  <IconButton
                    ref={el => shortlistButtonRefs.current[brand.uuid] = el}
                    onClick={() => handleToggleShortList(brand)}
                    sx={{
                      color: brand?.isShortListed
                        ? "#7ef400ff"
                        : "rgba(0, 0, 0, 0.23)",
                    }}
                  >
                    <Tooltip title="ShortList">
                      <RiBookmark3Fill size={21} />
                    </Tooltip>
                  </IconButton>
                </Stack>
              )}
              {isMobile && (
                <Stack direction="row" spacing={0.5}>
                  <IconButton
                    ref={el => likeButtonRefs.current[brand.uuid] = el}
                    sx={{
                      color: brand?.isLiked ? "#ff5252" : "rgba(0,0,0,0.2)",
                      "&:hover": { color: "#ff5252" },
                    }}
                    onClick={() => handleLikeClick(brand)}
                    disabled={likeProcessing[brand.uuid]}
                  >
                    {likeProcessing[brand.uuid] ? (
                      <CircularProgress size={24} />
                    ) : brand?.isLiked ? (
                      <FavoriteIcon fontSize="small" />
                    ) : (
                      <FavoriteBorderIcon fontSize="small" />
                    )}
                  </IconButton>
 
                  <IconButton
                    ref={el => shortlistButtonRefs.current[brand.uuid] = el}
                    onClick={() => handleToggleShortList(brand)}
                    sx={{
                      color: brand?.isShortListed
                        ? "#7ef400ff"
                        : "rgba(0, 0, 0, 0.23)",
                    }}
                  >
                    <Tooltip title="ShortList">
                      <RiBookmark3Fill size={21} />
                    </Tooltip>
                  </IconButton>
                </Stack>
              )}
              <Box
                component="img"
                src={brand.logo}
                alt={brand.brandname}
                loading="lazy"
                sx={{
                  width: 100,
                  height: 80,
                  border: "1px solid #f29724",
                  mb: 1,
                  objectFit: "contain",
                }}
              />
             
              <Typography
                variant="caption"
                fontWeight={600}
                textAlign="center"
                sx={{
                  mb: 0.5,
                  whiteSpace: "normal",
                  overflowWrap: "break-word",
                  width: "100%",
                  px: 0.5,
                }}
              >
                {brand.brandname}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: 0.5,
                  mt: 0.5,
                  mb: 1,
                  width: "100%",
                  textAlign: "center",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                }}
              >
                {(() => {
                  const insertZeroWidth = (str = "", n = 30) =>
                    typeof str === "string"
                      ? str.replace(new RegExp(`(.{${n}})`, "g"), "$1\u200B")
                      : str || "";

                  const category = brand.brandCategories?.sub;

                  if (Array.isArray(category)) {
                    return category.map(c => insertZeroWidth(String(c), 30)).join(", ");
                  }
                  return insertZeroWidth(String(category || ""), 30);
                })()}
              </Typography>

              <Stack direction="column" spacing={0.5} sx={{ mb: 0.5, width: "100%" }}>
                <Typography variant="caption" fontWeight={500}>
                  Investment : {brand.fico?.investmentRange || "N/A"}
                </Typography>
                <Typography variant="caption" fontWeight={500}>
                  Area : {brand.fico?.areaRequired || "N/A"}
                </Typography>
                <Typography variant="caption" fontWeight={500}>
                  Type : {brand.fico?.franchiseModel || "N/A"}
                </Typography>
              </Stack>
               
              <Button
                variant="outlined"
                aria-label="apply now"
                size="small"
                fullWidth
                onClick={() => handleApply(brand)}
                sx={{
                  mt: "auto",
                  borderRadius: 2,
                  fontSize: "1rem",
                  py: 0.5,
                  borderColor: "#f29624",
                  backgroundColor: "#f29624",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 1)",
                  },
                }}
              >
                View Details
              </Button>
            </Card>
          </motion.div>
        ))}
      </Box>
 
    <Box sx={{ textAlign: "center", py: 3 }}>
  {hasMore && (
    <>
      {/* <Box
        sx={{
          mb: 1,
          fontSize: 16,
          fontWeight: 500,
          color: "#000000ff",
        }}
      >
        Would you like to browse more brands?
      </Box> */}

      <Box
        onClick={() => setPage((prev) => prev + 1)}
        sx={{
          backgroundColor: "#ff9800",
          px: 4,
          py: 1.2,
          borderRadius: 2,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          color: "white",
          minWidth: 180,
          "&:hover": {
            backgroundColor: "#000",
          },
        }}
      >
        {isLoading ? (
          <CircularProgress size={22} sx={{ color: "white" }} />
        ) : (
          "Load More Brands"
        )}
      </Box>
    </>
  )}

  {!hasMore && (
    <>
      {/* <Box
        sx={{
          mb: 1,
          fontSize: 16,
          fontWeight: 500,
          color: "#555",
        }}
      >
        Would you like to browse more brands?
      </Box> */}

      <Box
        sx={{
          backgroundColor: "#000",
          px: 4,
          py: 1.2,
          borderRadius: 2,
          display: "inline-block",
          fontWeight: "bold",
          color: "white",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "#333",
          },
        }}
        onClick={()=>navigate('/brandViewPage')}
      >
        View All Brands
      </Box>
    </>
  )}
</Box>

      {showLogin && <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />}
    </Box>
  );
};
 
export default React.memo(TopInvestVdocardround);