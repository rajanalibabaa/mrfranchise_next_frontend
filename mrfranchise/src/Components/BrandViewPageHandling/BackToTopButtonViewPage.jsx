"use client";
import React from "react";
import { Box, IconButton } from "@mui/material";
import { ArrowUpward } from "@mui/icons-material";

const BackToTopButton = ({ show, isMobile }) => {
  return (
    <>
      {show && (
        <Box
          sx={{
            position: "fixed",
            bottom: isMobile ? 16 : 24,
            right: isMobile ? 16 : 24,
            zIndex: 1000,
          }}
        >
          <IconButton
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            sx={{
              backgroundColor: "#ff9800",
              color: "white",
              "&:hover": {
                backgroundColor: "#e65100",
              },
            }}
          >
            <ArrowUpward />
          </IconButton>
        </Box>
      )}
    </>
  );
};

export default BackToTopButton;