" use client";
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
  allImages,
  currentImageIndex,
  setCurrentImageIndex,
  handlePrevImage,
  handleNextImage,
}) => {
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
        <IconButton onClick={onClose} color="inherit">
          <Close />
        </IconButton>
      </DialogTitle>

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
          <IconButton
            sx={{
              position: "absolute",
              left: 16,
              color: "white",
              backgroundColor: "rgba(0,0,0,0.5)",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.7)",
              },
            }}
            onClick={handlePrevImage}
          >
            <ArrowBack fontSize="large" />
          </IconButton>

          <img
            src={allImages[currentImageIndex]}
            loading="lazy"
            alt={`Gallery ${currentImageIndex}`}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              margin: "0 auto",
            }}
          />

          <IconButton
            sx={{
              position: "absolute",
              right: 16,
              color: "white",
              backgroundColor: "rgba(0,0,0,0.5)",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.7)",
              },
            }}
            onClick={handleNextImage}
          >
            <ArrowForward fontSize="large" />
          </IconButton>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
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
                border: currentImageIndex === index ? "2px solid #1976d2" : "1px solid #555",
                opacity: currentImageIndex === index ? 1 : 0.7,
                flexShrink: 0,
              }}
            >
              <img
                src={img}
                loading="lazy"
                alt={`Thumbnail ${index}`}
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