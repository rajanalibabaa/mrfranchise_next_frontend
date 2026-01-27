"use client";
import React from "react";
import {
  Button,
  Box,
  Typography,
  keyframes,
  IconButton,
  Tooltip,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { motion } from "framer-motion";

// Bounce animation
const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const FloatingApplyButton = ({ isMobile, brand, toggleDrawer }) => {

  ;
const currentUrl = window.location.href;
  const brandName = brand?.[0]?.brandDetails?.brandName || "Brand";
  const whatsappNumber = brand?.[0]?.brandDetails?.whatsappnumber || "";

  const shareText = `${currentUrl}\n\n#MrFranchise.in`;

  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
        `Hi, I am interested in your"${brandName}" franchise business.\n\n${shareText} \n\n `
      )}`
    : null;

  return (
    <>
    <Box
      sx={{
        position: "fixed",
        right: 20,                     // ✅ always right
        bottom: isMobile ? 90 : 350,   // ✅ responsive spacing
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.5,
        zIndex: 1200,
      }}
    >
      {/* 🔶 APPLY NOW */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1, y: [0, -8, 0] }}
        transition={{
          y: { repeat: Infinity, duration: 2 },
          scale: { type: "spring", stiffness: 120, damping: 12 },
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="contained"
          onClick={toggleDrawer(true)}
          sx={{
            display: "flex",
            flexDirection: "column",
            px: 3,
            py: 1,
            backgroundColor: "#ff9800",
            borderRadius: 3,
            boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
            "&:hover": { backgroundColor: "#e65100" },
            animation: `${bounce} 2s infinite`,
          }}
        >
          <Typography fontWeight={600}>Apply Now</Typography>
          <Typography fontSize="0.75rem">{brandName}</Typography>
        </Button>
      </motion.div>

      
    </Box>
    <Box  sx={{
        position: "fixed",
        right: 20,                     // ✅ always right
        bottom: isMobile ? 90 : 100,   // ✅ responsive spacing
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.5,
        zIndex: 1200,
      }}>
      {/* 🟢 WHATSAPP ICON */}
      {whatsappLink && (
        <Tooltip title="Chat on WhatsApp" placement="left">
          <IconButton
            component="a"
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              backgroundColor: "#25D366",
              color: "#fff",
              width: 66,
              height: 66,
              boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
              "&:hover": {
                backgroundColor: "#1ebe5d",
                transform: "scale(1.1)",
              },
              transition: "all 0.25s ease",
            }}
            aria-label="WhatsApp Chat"
          >
            <WhatsAppIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
    </>
  );
};

export default FloatingApplyButton;
