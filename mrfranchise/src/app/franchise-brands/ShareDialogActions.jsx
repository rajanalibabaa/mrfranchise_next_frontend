"use client";
import React, { useState } from "react";
import {
  Popover,
  Typography,
  Box,
  Snackbar,
  Alert,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import TelegramIcon from "@mui/icons-material/Telegram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import CheckIcon from "@mui/icons-material/Check";

const ShareDialogActions = ({ anchorEl, setAnchorEl, brand }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const open = Boolean(anchorEl);

  const [copied, setCopied] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  // Brand Name
  const brandName =
    brand?.brandDetails?.brandName ||
    brand?.name ||
    "MrFranchise";

  // Brand Logo
  const brandLogo =
    brand?.brandDetails?.brandLogo ||
    brand?.logo ||
    "";

  // Brand Slug or UUID
  const slug =
    brand?.brandDetails?.slug ||
    brand?.slug ||
    brand?.brandUUID ||
    brandName?.toLowerCase().replace(/\s+/g, "-");

  // Share URL (Direct Brand Page)
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/franchise-brands/${slug}`
      : "";

  // Share Text
  const shareText = `Check out ${brandName} franchise opportunity on MrFranchise 🚀`;

  const handleClose = () => {
    setAnchorEl(null);
    setCopied(false);
  };

  // Copy Link
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setSnackbar({ open: true, message: "Link copied!" });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to copy" });
    }
  };

  // Social Share
const handleShare = (platform) => {

  const message = `${shareText}\n\n${shareUrl}`;

  const urls = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`,

    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,

    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,

    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,

    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,

    email: `mailto:?subject=${encodeURIComponent(brandName)}&body=${encodeURIComponent(message)}`,
  };

  window.open(urls[platform], "_blank", "width=600,height=600");

  handleClose();
};

  const shareOptions = [
    {
      name: "Copy Link",
      icon: copied ? <CheckIcon /> : <ContentCopyIcon />,
      color: copied ? "#4CAF50" : "#666",
      action: handleCopy,
    },
    {
      name: "WhatsApp",
      icon: <WhatsAppIcon />,
      color: "#25D366",
      action: () => handleShare("whatsapp"),
    },
    {
      name: "Facebook",
      icon: <FacebookIcon />,
      color: "#1877F2",
      action: () => handleShare("facebook"),
    },
    {
      name: "X",
      icon: <XIcon />,
      color: "#000",
      action: () => handleShare("twitter"),
    },
    {
      name: "Telegram",
      icon: <TelegramIcon />,
      color: "#0088cc",
      action: () => handleShare("telegram"),
    },
    {
      name: "LinkedIn",
      icon: <LinkedInIcon />,
      color: "#0A66C2",
      action: () => handleShare("linkedin"),
    },
    {
      name: "Email",
      icon: <EmailIcon />,
      color: "#EA4335",
      action: () => handleShare("email"),
    },
  ];

  return (
    <>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            width: isMobile ? "90vw" : 360,
            overflow: "hidden",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            pb: 1.5,
          }}
        >
          <Typography fontWeight={600} fontSize={16}>
            Share Brand
          </Typography>

          <IconButton size="small" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider />

        {/* Brand Preview */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            bgcolor: "#f9f9f9",
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: 2,
              bgcolor: "#fff",
              border: "1px solid #eee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {brandLogo ? (
              <img
                src={brandLogo}
                alt={brandName}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  padding: 6,
                }}
              />
            ) : (
              <Typography fontWeight={700} fontSize={24} color="primary">
                {brandName?.charAt(0)}
              </Typography>
            )}
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography fontWeight={600} fontSize={14} noWrap>
              {brandName}
            </Typography>

            <Typography fontSize={12} color="text.secondary" noWrap>
              {shareUrl}
            </Typography>
          </Box>
        </Box>

        <Divider />

        {/* Share Options */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 1,
            p: 2,
          }}
        >
          {shareOptions.map((option) => (
            <Box
              key={option.name}
              onClick={option.action}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
                cursor: "pointer",
                p: 1,
                borderRadius: 2,
                transition: "all 0.2s",
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  bgcolor: `${option.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: option.color,
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.1)" },
                }}
              >
                {option.icon}
              </Box>

              <Typography fontSize={11} color="text.secondary" textAlign="center">
                {option.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Popover>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShareDialogActions;