"use client";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  CircularProgress,
  Chip,
  Button as MuiButton,
} from "@mui/material";
import { Phone, Favorite, ShareOutlined, Label } from "@mui/icons-material";
import { motion } from "framer-motion";
import ShareDialogActions from "../../app/brands/ShareDialogActions";
import { RiBookmark3Fill } from "react-icons/ri";
import { useRef } from "react";
import confetti from "canvas-confetti";

const BrandHeader = ({
  brand,
  isMobile,
  localIsLiked,
  isProcessingLike,
  shortListed,
  handleLikeClick,
  handleToggleShortList,
  handleOpenShareClick,
  anchorEl,
  setAnchorEl,
  toggleDrawer,
  getOutletRange,
}) => {
  const likeButtonRef = useRef(null);
  const shortlistButtonRef = useRef(null);

  // console.log('brand loading ', brand);
  
  // 🎉 Confetti effect to use element position
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

  const handleMoreClick = (e) => {
    e.preventDefault();
    const element = document.getElementById("expansion-location");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Modified handleLikeClick to include confetti
  const handleLikeClickWithConfetti = () => {
    handleLikeClick();
    if (!localIsLiked) {
      triggerCelebration("#f44336", likeButtonRef);
    }
  };

  // Modified handleToggleShortList to include confetti
  const handleToggleShortListWithConfetti = () => {
    handleToggleShortList(brand[0]?.uuid);
    if (!shortListed) {
      triggerCelebration("#7ef400ff", shortlistButtonRef);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        alignItems={isMobile ? "flex-start" : "center"}
        justifyContent="space-between"
        mb={1}
        gap={2}
      >
        {/* Brand logo and basic info */}
        <Box
          display="flex"
          alignItems="center"
          gap={isMobile ? 1 : 3}
          flexDirection={isMobile ? "column" : "row"}
          width="100%"
          sx={{background:'white',padding:{xs:'5px',sm:'5px',md:'20px'},borderRadius:'10px'}}
        >
          <Box
            position="relative"
            sx={{
              border: "2px solid orange",
              borderRadius: "10px",
              width: "clamp(120px, 20vw, 200px)",
              height: "clamp(120px, 20vw, 200px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              backgroundColor: "rgba(255, 255, 255, 1)",
            }}
          >
            <Box
              component="img"
              src={brand[0].uploads?.logo}
              alt={brand[0].brandDetails?.brandName}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Box>

          <Box width="100%" >
            {/* Brand name and actions */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flexDirection={isMobile ? "column" : "row"}
              gap={2}
            >
              <Box>
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    // backgroundColor: "#eedbbcff",p:1,
                    // color: "linear-gradient(45deg, #000000ff 30%, #000000ff 90%)",
                    // WebkitBackgroundClip: "text",
                    // WebkitTextFillColor: "transparent",
                    textAlign: isMobile ? "center" : "left",
                  }}
                >
                  {brand[0]?.brandDetails?.brandName}
                </Typography>
                <Typography
                  variant="body1"
                  color="black"
                  // sx={{backgroundColor: "#eedbbcff",p:1}}
                  textAlign={isMobile ? "center" : "left"}
                  fontSize={isMobile ? "0.875rem" : "1rem"}
                >
                  {brand[0]?.brandDetails?.tagLine}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: isMobile ? 1 : 10,
                    mt: 1,
                    justifyContent: isMobile ? "center" : "flex-start",
                    // backgroundColor: "#eedbbcff",p:1
                  }}
                >
                  <Typography fontSize={isMobile ? "0.8rem" : "0.9rem"} color="black">
                    Established Year:{" "}
                    <label variant="body1" >
                      {brand?.[0]?.brandfranchisedetails?.franchiseDetails
                        ?.establishedYear || "N/A"}
                    </label>
                  </Typography>
                  <Typography fontSize={isMobile ? "0.8rem" : "0.9rem"} color="black">
                    Franchise Since:{" "}
                    <label variant="body1" >
                      {brand?.[0]?.brandfranchisedetails?.franchiseDetails
                        ?.franchiseSinceYear || "N/A"}
                    </label>
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mt: isMobile ? 1 : 0, ml: isMobile ? 0 : 2 }}>
                <Button
                  variant="contained"
                  size={isMobile ? "small" : "medium"}
                  startIcon={<Phone />}
                  onClick={toggleDrawer(true)}
                  sx={{
                    px: isMobile ? 1 : 1.5,
                    py: isMobile ? 1 : 2,
                    borderRadius: { xs: 1, sm: 2,md:'20px' },
                    bgcolor: "#ff9800",
                    "&:hover": { bgcolor: "#e65100" },
                    fontSize: isMobile ? "0.65rem" : "0.875rem",
                  }}
                >
                  VIEW CONTACT
                </Button>
                <IconButton
                  ref={likeButtonRef}
                  sx={{ marginLeft: "80px" }}
                  onClick={handleLikeClickWithConfetti}
                  disabled={isProcessingLike}
                >
                  {isProcessingLike ? (
                    <CircularProgress size={isMobile ? 20 : 24} />
                  ) : (
                    <Favorite
                      sx={{
                        color: localIsLiked ? "#f44336" : "rgba(0, 0, 0, 0.35)",
                      }}
                    />
                  )}
                </IconButton>
                <IconButton
                  ref={shortlistButtonRef}
                  onClick={handleToggleShortListWithConfetti}
                  sx={{
                    color: shortListed ? "#7ef400ff" : "rgba(0, 0, 0, 0.35)",
                    // backgroundColor: "#eedbbcff",p:1
                  }}
                >
                  <RiBookmark3Fill />
                </IconButton>
                <IconButton
                  onClick={handleOpenShareClick}
                  size={isMobile ? "small" : "medium"}
                >
                  <ShareOutlined
                    sx={{ fontSize: isMobile ? "1.2rem" : "1.5rem",color: "rgba(0, 0, 0, 0.35)" }}
                  />
                </IconButton>
                <ShareDialogActions
                  anchorEl={anchorEl}
                  setAnchorEl={setAnchorEl}
                  brand={{
                    name: brand[0]?.brandDetails?.brandName,
                    logo: brand[0]?.uploads?.logo,
                    // video: brand[0]?.uploads?.franchisePromotionVideo
                  }}
                />
              </Box>
            </Box>
<Box sx={{ mt: { xs: 1, sm: 2, md: 3}, display: "flex", flexDirection: "column", gap: 1 }}>
 {(() => {
  const productTags =
    brand?.[0]?.brandfranchisedetails?.franchiseDetails?.brandCategories
      ?.productTags;


  let categoryArray = [];

  // ✅ NEW FORMAT: [{ parent, tags: [] }]
  if (Array.isArray(productTags)) {
    categoryArray = productTags.flatMap(item =>
      Array.isArray(item?.tags) ? item.tags : []
    );
  }

  if (categoryArray.length === 0) {
    return (
      <Typography variant="caption" color="black">
        N/A
      </Typography>
    );
  }

  return (
    <>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {categoryArray.map((category, index) => (
          <Chip
            key={index}
            label={category}
            size="small"
            variant="outlined"
            sx={{
              fontSize: isMobile ? "0.65rem" : "0.75rem",
              height: "24px",
              backgroundColor: "#ffffffff",
              borderColor: "#7cd13b",
              color: "black",
              "& .MuiChip-label": {
                padding: "0 8px",
              },
            }}
          />
        ))}
      </Box>
    </>
  );
})()}

  </Box>
            {/* Brand details table */}
            <Box sx={{ width: "100%", overflow: "hidden", mt: 2,mb:1 }}>
              <TableContainer
                component={Paper}
                sx={{
                  width: "100%",
                  borderRadius: "16px",
                  overflowX: "auto",
                  "&::-webkit-scrollbar": {
                    height: "6px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#888",
                    borderRadius: "3px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "#555",
                  },
                }}
              >
                <Table
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    minWidth: isMobile ? 650 : "100%",
                    tableLayout: "fixed",
                  }}
                >
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: "#7cd13b",
                        "& th": {
                          padding: isMobile ? "6px 8px" : "10px 12px",
                          fontSize: isMobile ? "0.7rem" : "0.8rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        },
                      }}
                    >
                      <TableCell sx={{ width: "25%", textAlign: "center" }}>
                        <strong>Category</strong>
                      </TableCell>
                      <TableCell sx={{ width: "18%", textAlign: "center" }}>
                        <strong>Area</strong>
                      </TableCell>
                      <TableCell sx={{ width: "20%", textAlign: "center" }}>
                        <strong>Investment</strong>
                      </TableCell>
                      <TableCell sx={{ width: "15%", textAlign: "center" }}>
                        <strong>Total Outlets</strong>
                      </TableCell>
                      <TableCell sx={{ width: "30%", textAlign: "center" }}>
                        <strong>Origin Location</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody >
                    <TableRow >
                      <TableCell
                        sx={{
                          width: "25%",
                          textAlign: "center",
                          fontSize: isMobile ? "0.7rem" : "0.8rem",
                          wordBreak: "break-word",
                          py: isMobile ? "8px" : "12px",
                          backgroundColor: "#ffffffff",
                        }}
                      >
                        {brand?.[0]?.brandfranchisedetails?.franchiseDetails
                          ?.brandCategories?.sub || "N/A"}
                      </TableCell>
                      <TableCell
                        sx={{
                          width: "18%",
                          textAlign: "center",
                          fontSize: isMobile ? "0.7rem" : "0.8rem",
                          wordBreak: "break-word",
                          py: isMobile ? "8px" : "12px",
                                                    backgroundColor: "#ffffffff",

                        }}
                      >
                        {brand?.[0]?.brandfranchisedetails?.franchiseDetails
                          ?.fico?.[0]?.areaRequired || "N/A"}
                      </TableCell>
                      <TableCell
                        sx={{
                          width: "15%",
                          textAlign: "center",
                          fontSize: isMobile ? "0.7rem" : "0.8rem",
                          wordBreak: "break-word",
                          py: isMobile ? "8px" : "12px",
                                                    backgroundColor: "#ffffffff",

                        }}
                      >
                        {brand?.[0]?.brandfranchisedetails?.franchiseDetails
                          ?.fico?.[0]?.investmentRange || "N/A"}
                      </TableCell>
                      <TableCell
                        sx={{
                          width: "15%",
                          textAlign: "center",
                          fontSize: isMobile ? "0.7rem" : "0.8rem",
                          wordBreak: "break-word",
                          py: isMobile ? "8px" : "12px",
                                                    backgroundColor: "#ffffffff",

                        }}
                      >
                        {getOutletRange(
                          brand?.[0]?.brandfranchisedetails?.franchiseDetails
                            ?.totalOutlets || "N/A"
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          width: "30%",
                          textAlign: "center",
                          fontSize: isMobile ? "0.7rem" : "0.8rem",
                          wordBreak: "break-word",
                          py: isMobile ? "8px" : "12px",
                                                    backgroundColor: "#ffffffff",

                        }}
                      >
                        {/* {(() => {
                          const locations =
                            brand?.[0]?.brandexpansionlocationdatas
                              ?.expansionLocations?.domestic?.locations || [];

                          const states = locations
                            .map((loc) => loc.state)
                            .filter(Boolean);
                          const hasMore = states.length > 2;

                          if (states.length === 0) {
                            return "Multiple Locations";
                          }

                          const visibleStates = states.slice(0, 2).join(", ");

                          return (
                            <>
                              {visibleStates}
                              {hasMore && (
                                <a
                                  href="#expansion-location"
                                  onClick={handleMoreClick}
                                  style={{
                                    marginLeft: 8,
                                    fontSize: "0.7rem",
                                    textDecoration: "none",
                                    color: "#1976d2",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                  }}
                                >
                                  More
                                </a>
                              )}
                            </>
                          );
                        })()} */}

  {brand?.[0]?.brandDetails?.state || "N/A"} , {brand?.[0]?.brandDetails?.city || "N/A"}

                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
           {/* <Typography
  color="#000000ff"
  mt={isMobile ? 2 : 2}
  fontSize={isMobile ? "0.8rem" : "0.9rem"}
  variant="body1"
  sx={{ fontWeight: "bold",backgroundColor: "#eedbbcff",p:1 }}
>
  Brand Tags :
  
</Typography> */}

          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default BrandHeader;
