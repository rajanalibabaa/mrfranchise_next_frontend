"use client";
import React, { memo,useCallback } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { useTheme, useMediaQuery } from "@mui/material";
import  Favorite  from "@mui/icons-material/Favorite";
import { motion } from "framer-motion";
import { RiBookmark3Fill } from "react-icons/ri";
// import img from "../../../assets/Images/logo.png";
import { openBrandDialog } from "@/Redux/Slices/OpenBrandNewPageSlice.jsx";
import { useDispatch } from "react-redux";
import { removeLikedBrand } from "@/Redux/Slices/likeSlice.jsx";
import { likeApiFunction } from "@/Api/likeApi.jsx";
import { removeSortList } from "@/Redux/Slices/shortlistslice.jsx";
import { handleShortList } from "@/Api/shortListApi.jsx";

const BrandCard = memo(({ 
  item, 
  type, 
  likedStates, 
  shortlistedStates, 
  investmentRange,
  brandNameData,
  areaRequired,
  brandLogoData,
  franchiseModel,
  brandCategoryChild,
  onViewDetails, 
  // onToggleLike, 
  brandIdData,
  // onToggleShortlist, 
  onToggleViewClose 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!item || typeof item !== 'object') return null;

  const brandId = item.uuid || item.brandID?.uuid || item.brandID  || brandIdData;
  const isLiked = brandId ? likedStates[brandId] : false;
  const isShortlisted = brandId ? shortlistedStates[brandId] : false;
const dispatch = useDispatch();
  const OpenBrandDialog = useCallback (()=>{
    
    dispatch(openBrandDialog(item));
  }, [item]);

  // Function to break text after a limit without splitting words
  const breakText = (text, limit = 15) => {
    if (!text) return "N/A";
    if (text.length <= limit) return text;

    let breakIndex = text.lastIndexOf(" ", limit);
    if (breakIndex === -1) breakIndex = text.indexOf(" ", limit);

    if (breakIndex === -1) return text; // no space found, don't break
    return (
      <>
        {text.slice(0, breakIndex)}
        <br />
        {text.slice(breakIndex + 1)}
      </>
    );
  };

  const brandName =
    item?.brandName ||
    item?.brandname ||
    item?.brandDetails?.brandName ||
    (typeof item?.brandID === "object" && item.brandID?.brandName) ||
    item?.name ||
    item?.brand_title || brandNameData
    "Unnamed Brand";

  const brandLogo =
    item?.logo ||
    item?.brandLogo ||
    item?.brandDetails?.brandLogo ||
    (typeof item?.brandID === "object" ? item.brandID?.brandLogo : null) ||
    item?.uploads?.brandLogo?.[0] ||
    item?.image || brandLogoData;
    

    const onToggleLike = async(brandId) => {

      // console.log("brand id",brandId)
      dispatch(removeLikedBrand(brandId))
       await likeApiFunction(brandId);
    }

    const onToggleShortlist = async(brandId) => {
        // console.log("brand id",brandId)
        dispatch(removeSortList(brandId))
        await handleShortList(brandId)
    }


  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }} style={{ minWidth: 0 }}>
      <Card
        sx={{
         p: 1.5,
    borderRadius: 3,
    height: '100%',
    minHeight: 285, 
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
          "&:hover": {
            boxShadow: "0 4px 12px rgba(242, 151, 36, 0.2)",
          },
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        {!isMobile && (
          <Stack direction="column" spacing={0.5} sx={{ position: "absolute", top: 4, right: 4, zIndex: 2 }}>
            {type === 'liked' && (
              <IconButton
                sx={{
                  color: isLiked ? "#ff5252" : "rgba(0,0,0,0.2)",
                  "&:hover": { color: "#ff5252" },
                }}
                onClick={() => onToggleLike(brandId)}
              >
                <Favorite fontSize="small" />
              </IconButton>
            )}
            {type === 'shortlisted' && (
              <IconButton 
                sx={{ 
                  color: isShortlisted ? "#689f38" : "rgba(0,0,0,0.2)",
                  "&:hover": { color: "#689f38" },
                }}
                onClick={()=>onToggleShortlist(brandId)}
              >
                <Tooltip title={isShortlisted ? "Remove from shortlist" : "Add to shortlist"}>
                  <RiBookmark3Fill size={21} />
                </Tooltip>
              </IconButton>
            )}
          </Stack>
        )}

        {isMobile && (
          <Stack direction="row" spacing={0.5}>
            {type === 'liked' && (
              <IconButton
                sx={{
                  color: isLiked ? "#ff5252" : "rgba(0,0,0,0.2)",
                  "&:hover": { color: "#ff5252" },
                }}
                onClick={() => onToggleLike(brandId)}
              >
                <Favorite fontSize="small" />
              </IconButton>
            )}
            {type === 'shortlisted' && (
              <IconButton 
                sx={{ 
                  color: "#689f38",
                  "&:hover": { color: "#689f38" },
                }}
                onClick={()=>onToggleShortlist(brandId)}
              >
                <Tooltip title="Remove from shortlist">
                  <RiBookmark3Fill size={21} />
                </Tooltip>
              </IconButton>
            )}
          </Stack>
        )}

        <Box
          component="img"
          src={brandLogo }
          alt={brandName}
          loading="lazy"
          sx={{
            width: 100,
            height: 80,
            border: "1px solid #f29724",
            mb: 1,
            objectFit: "contain",
          }}
        />

        {/* Brand Name */}
        <Typography
          variant="caption"
          fontWeight={600}
          textAlign="center"
          sx={{
            mb: 0.5,
            whiteSpace: "normal",
            wordBreak: "normal",
            overflowWrap: "normal",
            width: "100%",
            px: 0.5,
          }}
        >
          {breakText(brandName, 15)}
        </Typography>

        {/* Brand Category */}
        <Typography
          variant="caption"
          sx={{
            maxWidth: "300px",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 0.5,
            mt: 0.5,
            mb: 1,
            width: "100%",
            textAlign: "center",
            whiteSpace: "normal",
            wordBreak: "normal",
            overflowWrap: "normal"
          }}
        >
          {breakText(item.brandCategories?.sub || brandCategoryChild, 30)}
        </Typography>

        <Stack direction="column" spacing={0.5} sx={{ mb: 0.5, width: "100%" }}>
          <Typography variant="caption" fontWeight={500}>
            Investment : {item.fico?.investmentRange || investmentRange || "N/A"}
          </Typography>
          <Typography variant="caption" fontWeight={500}>
            Area : {item.fico?.areaRequired || areaRequired || "N/A"}
          </Typography>
          <Typography variant="caption" fontWeight={500}>
            Type : {item.fico?.franchiseModel || franchiseModel || "N/A"}
          </Typography>
        </Stack>

        <Button
          variant="outlined"
          aria-label="apply now"
          size="small"
          fullWidth
          onClick={() => OpenBrandDialog(item)}
          sx={{
            mt: "auto",
            borderRadius: 2,
            fontSize: "0.7rem",
            py: 0.5,
            borderColor: "#f29724",
            color: "green",
            "&:hover": {
              backgroundColor: "rgba(250, 141, 8, 0.7)",
            },
          }}
        >
          View Details
        </Button>
      </Card>
    </motion.div>
  );
});

export default BrandCard;