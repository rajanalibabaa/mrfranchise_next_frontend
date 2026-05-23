import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
} from "@mui/material";

const RemoveInvestmentRangeDialog = ({
  open,
  onClose,
  COLORS,
  TEXT_SIZES,
  itemToRemove,
  handleRemoveSingleFromPayment,
  setItemToRemove,
}) => {
  const handleConfirmRemove = () => {
    if (itemToRemove) {
      itemToRemove.items.forEach((item) => {
        handleRemoveSingleFromPayment(item);
      });
    }

    onClose();
    setItemToRemove(null);
  };

  const handleDialogClose = () => {
    onClose();
    setItemToRemove(null);
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="xs"
      fullWidth
      sx={{
    '& .MuiDialog-container': {
      alignItems: 'flex-start', // Aligns dialog to the top
    },
  }}
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: `2px solid ${COLORS.primary}`,
          boxShadow: `0 8px 32px ${COLORS.shadow}`,
           marginTop: '10vh',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
          fontSize: TEXT_SIZES.large,
          fontWeight: 700,
          color: COLORS.white,
          py: 2,
        }}
      >
        Confirm Removal
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Typography
          sx={{
            fontSize: TEXT_SIZES.medium,
            color: COLORS.black,
            mb: 1,
          }}
        >
          Are you sure you want to remove this investment
          range?
        </Typography>

        {itemToRemove && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: COLORS.lightOrange,
              borderRadius: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: TEXT_SIZES.small,
                color: COLORS.black,
              }}
            >
              <strong>Plan:</strong> {itemToRemove.planName}
            </Typography>

            <Typography
              sx={{
                fontSize: TEXT_SIZES.small,
                color: COLORS.black,
                mt: 0.5,
              }}
            >
              <strong>Investment Range:</strong>{" "}
              {itemToRemove.range}
            </Typography>

            <Typography
              sx={{
                fontSize: TEXT_SIZES.small,
                color: COLORS.black,
                mt: 0.5,
              }}
            >
              <strong>Investment Group:</strong>{" "}
              {itemToRemove.investmentRangeLabel}
            </Typography>
          </Box>
        )}
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          justifyContent: "space-between",
          px: 3,
          py: 2,
          bgcolor: COLORS.grey[50],
        }}
      >
        <Button
          onClick={handleDialogClose}
          sx={{
            color: COLORS.grey[700],
            fontSize: TEXT_SIZES.medium,
            fontWeight: 600,

            "&:hover": {
              bgcolor: COLORS.grey[200],
            },
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleConfirmRemove}
          variant="contained"
          sx={{
            bgcolor: COLORS.primary,
            color: COLORS.white,
            fontSize: TEXT_SIZES.medium,
            fontWeight: 600,
            px: 3,

            "&:hover": {
              bgcolor: COLORS.primaryDark,
            },
          }}
        >
          Yes, Remove
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RemoveInvestmentRangeDialog;