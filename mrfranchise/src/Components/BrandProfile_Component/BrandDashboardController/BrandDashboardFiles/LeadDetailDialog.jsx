// components/LeadDetailDialog.js
"use client";
import React from "react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useMediaQuery, useTheme } from "@mui/material";
import { Close } from "@mui/icons-material";

const colors = {
  primary: "#2c3e50",
  cardBackground: "#ffffff",
  textPrimary: "#2c3e50",
  textSecondary: "#7f8c8d",
  divider: "#ecf0f1",
  secondary: "#34495e",
};

const LeadDetailDialog = ({ open, onClose, selectedItem }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={isMobile ? "xs" : "sm"}
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          backgroundColor: colors.cardBackground,
          borderRadius: isMobile ? 0 : 2,
          minHeight: isMobile ? "100vh" : "auto",
          maxHeight: isMobile ? "100vh" : "90vh",
        },
      }}
    >
      {/* Header - Fixed structure */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: isMobile ? 2 : 3,
          pb: isMobile ? 1.5 : 2,
          backgroundColor: colors.primary,
          borderBottom: `1px solid ${colors.divider}`,
        }}
      >
        <DialogTitle
          sx={{
            color: "#fff",
            p: 0,
            fontSize: isMobile ? "1.1rem" : "1.25rem",
            fontWeight: 600,
            flexGrow: 1,
          }}
        >
          Lead Details
        </DialogTitle>
        <IconButton
          onClick={onClose}
          sx={{
            color: "#fff",
            p: isMobile ? 0.5 : 1,
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          }}
          size={isMobile ? "small" : "medium"}
        >
          <Close fontSize={isMobile ? "medium" : "large"} />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent
        dividers
        sx={{
          backgroundColor: colors.cardBackground,
          p: isMobile ? 2 : 3,
          "&:first-of-type": {
            pt: isMobile ? 2 : 3,
          },
        }}
      >
        {selectedItem && (
          <Box>
            {/* Header Section with Avatar and Name */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: isMobile ? 1.5 : 2,
                mb: isMobile ? 1.5 : 2,
                flexDirection: isMobile ? "column" : "row",
                textAlign: isMobile ? "center" : "left",
              }}
            >
              <Avatar
                src={
                  selectedItem?.profileImage ||
                  selectedItem?.uploads?.brandLogo?.[0] ||
                  "/default-avatar.png"
                }
                sx={{
                  width: isMobile ? 70 : 60,
                  height: isMobile ? 70 : 60,
                  bgcolor: colors.secondary,
                  border: `2px solid ${colors.accent}`,
                }}
              />
              <Typography
                variant={isMobile ? "h6" : "h5"}
                sx={{
                  color: colors.textPrimary,
                  fontSize: isMobile ? "1.1rem" : "1.5rem",
                  fontWeight: 600,
                }}
              >
                {selectedItem.fullName || "Unknown"}
              </Typography>
            </Box>

            <Divider
              sx={{ my: isMobile ? 1.5 : 2, borderColor: colors.divider }}
            />

            {/* Details Grid */}
            <Grid container spacing={isMobile ? 1.5 : 2}>
              {/* Contact Information */}
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: colors.textPrimary,
                    fontWeight: "bold",
                    mb: 1,
                    fontSize: isMobile ? "0.9rem" : "0.875rem",
                  }}
                >
                  Contact Information
                </Typography>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                >
                  <Typography
                    sx={{
                      color: colors.textSecondary,
                      fontSize: isMobile ? "0.85rem" : "0.875rem",
                    }}
                  >
                    <strong>Mobile:</strong>{" "}
                    {selectedItem.investorMobileNumber || "N/A"}
                  </Typography>
                  <Typography
                    sx={{
                      color: colors.textSecondary,
                      fontSize: isMobile ? "0.85rem" : "0.875rem",
                    }}
                  >
                    <strong>Email:</strong> {selectedItem.email || "N/A"}
                  </Typography>
                </Box>
              </Grid>

              {/* Location */}
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: colors.textPrimary,
                    fontWeight: "bold",
                    mb: 1,
                    fontSize: isMobile ? "0.9rem" : "0.875rem",
                  }}
                >
                  Location
                </Typography>
                <Typography
                  sx={{
                    color: colors.textSecondary,
                    whiteSpace: "pre-line",
                    fontSize: isMobile ? "0.85rem" : "0.875rem",
                  }}
                >
                  {[
                    selectedItem.state,
                    selectedItem.district,
                    selectedItem.city,
                  ]
                    .filter(Boolean)
                    .join(", ") || "N/A"}
                </Typography>
              </Grid>

              {/* Investment Details - Conditionally rendered */}
              {selectedItem.investmentRange && (
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: colors.textPrimary,
                      fontWeight: "bold",
                      mb: 1,
                      fontSize: isMobile ? "0.9rem" : "0.875rem",
                    }}
                  >
                    Investment Details
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                  >
                    <Typography
                      sx={{
                        color: colors.textSecondary,
                        fontSize: isMobile ? "0.85rem" : "0.875rem",
                      }}
                    >
                      <strong>Range:</strong> {selectedItem.investmentRange}
                    </Typography>
                    <Typography
                      sx={{
                        color: colors.textSecondary,
                        fontSize: isMobile ? "0.85rem" : "0.875rem",
                      }}
                    >
                      <strong>Plan:</strong>{" "}
                      {selectedItem.planToInvest || "N/A"}
                    </Typography>
                  </Box>
                </Grid>
              )}

              {/* Additional Info */}
              <Grid item xs={12} sm={selectedItem.investmentRange ? 6 : 12}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: colors.textPrimary,
                    fontWeight: "bold",
                    mb: 1,
                    fontSize: isMobile ? "0.9rem" : "0.875rem",
                  }}
                >
                  Additional Info
                </Typography>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                >
                  <Typography
                    sx={{
                      color: colors.textSecondary,
                      fontSize: isMobile ? "0.85rem" : "0.875rem",
                    }}
                  >
                    <strong>Industry:</strong> {selectedItem.industry || "N/A"}
                  </Typography>
                  <Typography
                    sx={{
                      color: colors.textSecondary,
                      fontSize: isMobile ? "0.85rem" : "0.875rem",
                    }}
                  >
                    <strong>Category:</strong> {selectedItem.category || "N/A"}
                  </Typography>
                  <Typography
                    sx={{
                      color: colors.textSecondary,
                      fontSize: isMobile ? "0.85rem" : "0.875rem",
                    }}
                  >
                    <strong>Created:</strong>{" "}
                    {selectedItem.createdAt
                      ? new Date(selectedItem.createdAt).toLocaleDateString()
                      : "N/A"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>

      {/* Footer Actions */}
      <DialogActions
        sx={{
          backgroundColor: colors.cardBackground,
          borderTop: `1px solid ${colors.divider}`,
          p: isMobile ? 2 : 3,
          pt: isMobile ? 1.5 : 2,
        }}
      >
        <Button
          onClick={onClose}
          variant={isMobile ? "contained" : "text"}
          sx={{
            color: isMobile ? "#fff" : colors.textSecondary,
            backgroundColor: isMobile ? colors.accent : "transparent",
            fontSize: isMobile ? "0.9rem" : "0.875rem",
            py: isMobile ? 1 : 0.75,
            px: isMobile ? 3 : 2,
            width: isMobile ? "100%" : "auto",
            "&:hover": {
              backgroundColor: isMobile
                ? colors.secondary
                : `${colors.accent}10`,
            },
            borderRadius: isMobile ? 2 : 1,
          }}
          size={isMobile ? "large" : "medium"}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeadDetailDialog;
