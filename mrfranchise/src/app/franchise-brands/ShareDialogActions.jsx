"use client";

import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { ContentCopy, Email, ShareOutlined } from "@mui/icons-material";

const ShareDialogActions = ({ anchorEl, setAnchorEl, brand }) => {
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = brand?.name
    ? `Check out ${brand.name} on MrFranchise`
    : "Check out this brand on MrFranchise";

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: brand?.name || "MrFranchise",
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      handleCopyLink();
    }
    handleClose();
  };

  const handleCopyLink = async () => {
    if (navigator.clipboard && shareUrl) {
      try {
        await navigator.clipboard.writeText(shareUrl);
      } catch (error) {
        console.error("Copy failed:", error);
      }
    }
    handleClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{ sx: { minWidth: 220 } }}
    >
      <MenuItem onClick={handleWebShare}>
        <ListItemIcon>
          <ShareOutlined fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Share" />
      </MenuItem>
      <MenuItem onClick={handleCopyLink}>
        <ListItemIcon>
          <ContentCopy fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Copy link" />
      </MenuItem>
      <MenuItem
        component="a"
        href={`mailto:?subject=${encodeURIComponent(
          `Check out ${brand?.name || "MrFranchise"}`
        )}&body=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`}
        onClick={handleClose}
      >
        <ListItemIcon>
          <Email fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Share via email" />
      </MenuItem>
    </Menu>
  );
};

export default ShareDialogActions;
