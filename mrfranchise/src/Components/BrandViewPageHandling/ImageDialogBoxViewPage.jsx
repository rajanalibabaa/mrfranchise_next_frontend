"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
} from "@mui/material";

import { Close, ArrowBack, ArrowForward } from "@mui/icons-material";

const ImageDialog = ({
  open,
  onClose,
  isMobile,
  allImages = [],
  currentImageIndex,
  setCurrentImageIndex,

  brandName,
  brandIndustry,
  brandCategory,
  brandOriginState,
  brandOriginDistrict,
  brandOriginCity,
  brandFranchiseModel,

  handlePrevImage,
  handleNextImage,
}) => {
  // Alt text for each image index
  const altTextSetPerIndexOfImages = [
    `${brandName} Business Opportunity`,

    `${brandName} ${brandFranchiseModel} Business Opportunity in ${brandOriginState}`,

    `${brandName}${brandFranchiseModel} Business Opportunity in ${brandOriginDistrict}`,

    `${brandName} ${brandFranchiseModel} Business Opportunity in ${brandOriginCity}`,

    `${brandName} ${brandFranchiseModel} Business Opportunity in ${brandIndustry}`,

    `${brandName}${brandFranchiseModel} Business Opportunity in ${brandCategory}`,
  ];

  // Get alt text according to image index
  const getImageAltText = (index) => {
    // If alt text exists for this index
    if (altTextSetPerIndexOfImages[index]) {
      return altTextSetPerIndexOfImages[index];
    }

    // Fallback for images beyond alt text array length
    return `${brandName}-Business-Opportunity-Image-${index + 1}`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "rgba(0,0,0,0.9)",
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white",
        }}
      >
        <Typography>
          Image {currentImageIndex + 1} of {allImages.length}
        </Typography>

        <IconButton aria-label="close" onClick={onClose} color="inherit">
          <Close />
        </IconButton>
      </DialogTitle>

      {/* Main Image */}
      <DialogContent
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: isMobile ? "50vh" : "70vh",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Previous */}
          <IconButton
            sx={{
              position: "absolute",
              left: 16,
              color: "white",
              backgroundColor: "rgba(0,0,0,0.5)",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.7)",
              },
              zIndex: 2,
            }}
            onClick={handlePrevImage}
            aria-label="Previous image"
          >
            <ArrowBack fontSize="large" />
          </IconButton>

          {/* Current Image */}
          <img
            src={allImages[currentImageIndex]}
            loading="lazy"
            alt={getImageAltText(currentImageIndex)}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              margin: "0 auto",
            }}
          />

          {/* Next */}
          <IconButton
            sx={{
              position: "absolute",
              right: 16,
              color: "white",
              backgroundColor: "rgba(0,0,0,0.5)",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.7)",
              },
              zIndex: 2,
            }}
            onClick={handleNextImage}
            aria-label="Next image"
          >
            <ArrowForward fontSize="large" />
          </IconButton>
        </Box>
      </DialogContent>

      {/* Thumbnails */}
      <DialogActions
        sx={{
          justifyContent: "center",
          pb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: "100%",
            overflowX: "auto",
            px: 2,
            py: 1,
          }}
        >
          {allImages.map((img, index) => (
            <Box
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              sx={{
                width: 80,
                height: 80,
                borderRadius: 1,
                overflow: "hidden",
                cursor: "pointer",
                border:
                  currentImageIndex === index
                    ? "2px solid #1976d2"
                    : "1px solid #555",
                opacity: currentImageIndex === index ? 1 : 0.7,
                flexShrink: 0,
              }}
            >
              <img
                src={img}
                loading="lazy"
                alt={getImageAltText(index)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          ))}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ImageDialog;
