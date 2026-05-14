import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const InvestmentRangeConfirmDialog = ({
  open,
  onClose,
  COLORS,
  TEXT_SIZES,
  pendingSelection,
  isFicoInvestmentRange,
  handleAddInvestmentRange,
  finalToken,
  setShowLogin,
  openSnack,
  onAddInvestmentRange,
  setPendingSelection,
}) => {
  const handleConfirm = () => {
    if (pendingSelection) {
      // From row Add button
      const firstNonRecommended =
        pendingSelection.selectedItemsInGroup?.find(
          (p) => !isFicoInvestmentRange(p.range)
        );

      if (firstNonRecommended) {
        handleAddInvestmentRange(
          firstNonRecommended.range,
          firstNonRecommended.investmentRangeLabel
        );
      }
    } else {
      // From Add New Investment Range button
      if (!finalToken) {
        setShowLogin(true);
        openSnack(
          "Please log in to add investment ranges",
          "warning"
        );
      } else {
        onAddInvestmentRange(null, null);
      }
    }

    onClose();
    setPendingSelection(null);
  };

  const handleDialogClose = () => {
    onClose();
    setPendingSelection(null);
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          border: `2px solid ${COLORS.primary}`,
          boxShadow: `0 8px 32px ${COLORS.shadow}`,
          overflow: "visible",
          position: "relative",
        },
      }}
    >
      {/* Floating Close Button */}
      <IconButton
        onClick={handleDialogClose}
        sx={{
          position: "absolute",
          top: -16,
          right: -16,
          backgroundColor: COLORS.white,
          color: COLORS.primary,
          boxShadow: `0 4px 12px ${COLORS.shadow}`,
          border: `1px solid ${COLORS.border}`,
          zIndex: 10,

          "&:hover": {
            backgroundColor: COLORS.grey[100],
            transform: "scale(1.05)",
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Header */}
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
          fontSize: TEXT_SIZES.large,
          fontWeight: 700,
          color: COLORS.white,
        }}
      >
        Add "Investment Range" to Brand Profile?
      </DialogTitle>

      {/* Body */}
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Typography
          sx={{
            fontSize: TEXT_SIZES.medium,
            color: COLORS.black,
            mb: 1,
            mt: 2,
          }}
        >
          Would you like to add New Investment Range to your
          Brand profile?
        </Typography>

        <Typography
          sx={{
            fontSize: TEXT_SIZES.small,
            color: COLORS.grey[600],
            mt: 1,
          }}
        >
          Adding new investment range will allow you to select
          these ranges for your franchise plans.
        </Typography>
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          justifyContent: "flex-end",
          px: 3,
          py: 2,
          backgroundColor: COLORS.grey[50],
        }}
      >
        <Button
          onClick={handleConfirm}
          variant="contained"
          sx={{
            backgroundColor: COLORS.primary,
            color: COLORS.white,
            fontSize: TEXT_SIZES.medium,
            fontWeight: 600,
            px: 3,

            "&:hover": {
              backgroundColor: COLORS.primaryDark,
            },
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvestmentRangeConfirmDialog;