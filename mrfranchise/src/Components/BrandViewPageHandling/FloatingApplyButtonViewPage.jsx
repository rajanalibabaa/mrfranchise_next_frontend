"use client";
import React from "react";
import {
  Button,
  Box,
  Typography,
  keyframes,
  Tooltip,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import LoginPage from "../LoginPage/LoginPage";

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const FloatingApplyButton = ({ isMobile, brand, toggleDrawer }) => {
 
  const brandName = brand?.[0]?.brandDetails?.brandName || "Brand";
  // const whatsappNumber = brand?.[0]?.brandDetails?.whatsappnumber || "";

  // const whatsappLink = whatsappNumber
  //   ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
  //       `Hi, I am interested in your "${brandName}" franchise.\n\n${currentUrl}\n\n#MrFranchise.in`
  //     )}`
    // : null;

  
    const [open, setOpen] = React.useState(false);
    const { AccessToken } = useSelector((state) => state.auth);

    const handleApplyClick = (event) => {
      
    
    if (AccessToken) {
      toggleDrawer(true)(event);
    } else {
      setOpen(true);
          console.log("AccessToken in FloatingApplyButton:", AccessToken);

    }
      ;
  };


  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right:isMobile ? 0 : 600,
        px: isMobile ? 1.5 : 0,
        display: "flex",
        justifyContent: isMobile ? "space-evenly" : "flex-end",
        mb:{
          xs: 2,
          sm: 2,
          md: 8,
          lg: 6,
          xl: 5,
        },
        gap: 2,
        zIndex: 1300,
        pointerEvents: "auto",
      }}
    >
      {/* APPLY NOW */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          fullWidth={isMobile}
          variant="contained"
          onClick={handleApplyClick}
          sx={{
            flex: 1,
              backgroundColor: "#25D366",
            borderRadius: 3,
            py: 1.3,
            maxHeight:{
              xs: 70,
              sm: 50,
              md: 60,
              lg: 60,
              xl: 60,
            },
            animation: `${bounce} 2s infinite`,
            boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
            "&:hover": { backgroundColor: "#ffffff" },
            color:'black',
          }}
        >
          <Box textAlign="center" display={'flex'} gap={1}> 
                        <WhatsAppIcon  />

            <Typography fontSize="0.85rem"mt={0.4}> Chat with {brandName}</Typography>
          </Box>
        </Button>
      </motion.div>

      {/* WHATSAPP */}
      {/* {whatsappLink && (
        <Tooltip title="Chat on WhatsApp">
          <Button
            component="a"
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              backgroundColor: "#25D366",
              color: "#fff",
              px: 2.5,
              py: 1.5,
              maxHeight:{
              xs: 70,
              sm: 50,
              md: 60,
              lg: 60,
              xl: 60,
            },
              borderRadius: 3,
              boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
              "&:hover": { backgroundColor: "#1ebe5d" },
            }}
          >
            WhatsApp
            <WhatsAppIcon sx={{ ml: 1 }} />
          </Button>
        </Tooltip>
      )} */}

      <LoginPage 
        open={open}
        onClose={() => setOpen(false)}
      />
    </Box>
  );
};

export default FloatingApplyButton;