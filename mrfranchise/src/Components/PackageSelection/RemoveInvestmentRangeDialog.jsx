import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
console.log("item",itemToRemove)
  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="xs"
      fullWidth
      sx={{
        '& .MuiDialog-container': {
          alignItems: 'flex-start',
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
      {/* Header with Close Icon */}
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
          fontSize: TEXT_SIZES.large,
          fontWeight: 900,
          color: COLORS.white,
          py: 0.7,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        Remove From Payment Summary
        <IconButton
          onClick={handleDialogClose}
          sx={{
            color: COLORS.white,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ pt: 5, pb: 1 , mt:2.5}}>
        <Typography
          sx={{
            fontSize: TEXT_SIZES.medium,
            color: COLORS.black,
            mb: 2,
          }}
        >
          Are you sure you want to remove this investment
          range from payment summary?
        </Typography>
 
      {itemToRemove && (
  <Box
    sx={{
      mt: 1,
      p: 1,
      bgcolor: COLORS.lightOrange,
      borderRadius: 2,
    }}
  >
    {[
      {
        label: "Plan",
        value: `${itemToRemove.validityDays ?? itemToRemove.items?.[0]?.validityDays} Days Campaign`,
      },
      {
        label: "Investment Range",
        value: Array.isArray(itemToRemove.investmentRange)
          ? itemToRemove.investmentRange.join(", ")
          : itemToRemove.investmentRange ?? itemToRemove.range ?? "N/A",
      },
      {
        label: "Investment Group",
        value: itemToRemove.investmentRangeLabel,
      },
      {
        label: "Total Leads",
        value: itemToRemove.totalLeads ?? itemToRemove.items?.[0]?.totalLeads,
      },
      {
        label: "Total Amount",
        value: `₹${(itemToRemove.totalAmount ?? itemToRemove.items?.[0]?.totalAmount)?.toLocaleString("en-IN")}`,
      },
    ].map((row, idx) => (
      <Box
        key={row.label}
        sx={{
          display: "flex",
          alignItems: "baseline",
          mt: idx === 0 ? 0 : 1,
        }}
      >
        <Typography
          sx={{
            fontSize: TEXT_SIZES.medium,
            fontWeight: 700,
            color: COLORS.black,
            width: 160,
            flexShrink: 0,
          }}
        >
          {row.label}
        </Typography>
        <Typography sx={{ fontSize: TEXT_SIZES.medium, color: COLORS.black }}>
  <Box component="span" sx={{ mr: 1 }}>:</Box>
  {row.value}
</Typography>
      </Box>
    ))}
  </Box>
)}
      </DialogContent>

      {/* Footer - Only Remove button */}
      <DialogActions
        sx={{
          justifyContent: "flex-end",
          px: 2,
          py: 2,
          bgcolor: COLORS.grey[50],
        }}
      >
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
          Remove
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RemoveInvestmentRangeDialog;