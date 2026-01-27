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

const FloatingApplyButton = ({
  isMobile,
  brand,
  toggleDrawer,
}) => {
  console.log('vvvvv',brand);
  
  const brandName = brand[0]?.brandDetails?.brandName || "Brand";
  const whatsappNumber =
    brand[0]?.brandDetails?.whatsappnumber || "";

  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
        "Hi, I am interested in your franchise."
      )}`
    : null;

  return (
    <>
    <Box
      sx={{
        position: "fixed",
        bottom: isMobile ? 10 : 280,
        right: isMobile ? 0 : 20,
        left: isMobile ? 0 : "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.5,
        zIndex: 1000,
      }}
    >
      {/* 🔶 APPLY NOW BUTTON */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1, y: [0, -10, 0] }}
        transition={{
          y: { repeat: Infinity, duration: 2, ease: "easeOut" },
          scale: { type: "spring", stiffness: 100, damping: 10 },
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="contained"
          size="large"
          onClick={toggleDrawer(true)}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#ff9800",
            color: "white",
            borderRadius: 4,
            px: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            "&:hover": { backgroundColor: "#e65100" },
            animation: `${bounce} 2s infinite ease-in-out`,
          }}
        >
          <Typography fontWeight={600}>Apply Now</Typography>
          <Typography fontSize="0.75rem">{brandName}</Typography>
        </Button>
      </motion.div>

      
    </Box>
    <Box sx={{
        position: "fixed",
        bottom: isMobile ? 10 : 100,
        right: isMobile ? 0 : 40,
        left: isMobile ? 0 : "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.5,
        zIndex: 1000,
      }}>
      {/* 🟢 WHATSAPP BUTTON BELOW */}
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
              width: 62,
              height: 62,
              boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
              "&:hover": {
                backgroundColor: "#1ebe5d",
                transform: "scale(1.08)",
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
