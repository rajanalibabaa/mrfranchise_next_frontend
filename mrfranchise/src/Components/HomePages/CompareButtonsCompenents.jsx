"use client";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";

const CompareButton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));   // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600 - 900px

  // Sizes based on device
  const buttonWidth = isMobile ? "35px" : isTablet ? "40px" : "50px";
  const buttonHeight = isMobile ? "120px" : isTablet ? "150px" : "180px";
  const buttonFontSize = isMobile ? "12px" : isTablet ? "14px" : "16px";

  const handleClick = () => {
    // Set flag to enable comparison on the target page
    localStorage.setItem('enableComparison', 'true');
    // Open in a new tab
    window.open("/AllCategoryPage/allbrandlisting", "_blank", "noopener,noreferrer");
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: { xs: "30%", sm: "35%", md: "40%" },
        right: 0,
        transform: "translateY(-50%)",
        zIndex: 2000,
      }}
    >
      <motion.button
        initial={{ x: 150 }} // starts off-screen
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          backgroundColor: "#70fd03fa",
          border: "none",
          borderRadius: "20px 0 0 20px",
          width: buttonWidth,
          height: buttonHeight,
          color: "black",
          fontSize: buttonFontSize,
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          writingMode: "vertical-rl",
          textOrientation: "upright",
        }}
        onClick={handleClick}
      >
        COMPARE
      </motion.button>
    </Box>
  );
};

export default CompareButton;
