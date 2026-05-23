import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Typography,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const StateSelectionModal = ({
  open,
  onClose,
  COLORS,
  TEXT_SIZES,
  selectedStates,
  finalToken,
  ALL_INDIA_STATES,
  allStates,
  getAlreadySelectedStatesInOtherRanges,
  getStatesToDisplay,
  handleSelectAll,
  handleClearAll,
  renderStatesByRegion,
  handleSaveStates,
  router,
}) => {
  const blocked = getAlreadySelectedStatesInOtherRanges();

  const currentRangeSelectedCount = [...selectedStates].filter(
    (s) => !blocked.has(s)
  ).length;

  const totalAvailable = !finalToken
    ? ALL_INDIA_STATES.filter((s) => !blocked.has(s)).length
    : allStates.filter((s) => !blocked.has(s)).length;

  const statesToDisplay = getStatesToDisplay();

  const selectableStates = statesToDisplay.filter((s) => !blocked.has(s));

  const isAllSelected = selectableStates.every((s) =>
    selectedStates.has(s)
  );

  const isClearDisabled = [...selectedStates].every((s) =>
    blocked.has(s)
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
   
            fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: `3px solid ${COLORS.primary}`,
          boxShadow: `0 8px 32px ${COLORS.shadow}`,
          margin: 6,           // Add this
      position: "absolute", // Add this
      top: 0, 
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
    py: 2.5,
    display: "flex",           // Add this
    justifyContent: "space-between",  // Add this
    alignItems: "center",   
        }}
      >
        Select States ({currentRangeSelectedCount} of {totalAvailable})
        <IconButton
    onClick={onClose}
    sx={{
      color: COLORS.white,
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
      },
    }}
  >
    <CloseIcon />
  </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        dividers
        sx={{
          maxHeight: 300,
          overflow: "auto",
          p: 2,
          "&::-webkit-scrollbar": {
            width: 8,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: COLORS.primary,
            borderRadius: 4,
          },
        }}
      >
        {statesToDisplay.length > 0 ? (
          <>
            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                mb: 2.5,
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="outlined"
                size="small"
                onClick={handleSelectAll}
                disabled={isAllSelected}
                sx={{
                  borderColor: COLORS.primary,
                  color: COLORS.primary,
                  fontSize: TEXT_SIZES.small,
                  borderWidth: 2,
                  borderRadius: 1.5,
                  fontWeight: 600,
                  px: 2,
                  "&:hover": {
                    borderColor: COLORS.primaryDark,
                    backgroundColor: COLORS.lightOrange,
                    borderWidth: 2,
                  },
                }}
              >
                Select All ({selectableStates.length})
              </Button>

              <Button
                variant="outlined"
                size="small"
                onClick={handleClearAll}
                disabled={isClearDisabled}
                sx={{
                  borderColor: COLORS.primary,
                  color: COLORS.primary,
                  fontSize: TEXT_SIZES.small,
                  borderWidth: 2,
                  borderRadius: 1.5,
                  fontWeight: 600,
                  px: 2,
                  "&:hover": {
                    borderColor: COLORS.primaryDark,
                    backgroundColor: COLORS.lightOrange,
                    borderWidth: 2,
                  },
                }}
              >
                Clear All
              </Button>
            </Box>

            {/* Region Accordions */}
            <Box>{renderStatesByRegion()}</Box>
          </>
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography
              sx={{
                fontSize: TEXT_SIZES.medium,
                color: COLORS.grey[600],
                mb: 3,
              }}
            >
              No expansion states found
            </Typography>

            <Button
              variant="contained"
              onClick={() => {
                router.push("/brandDashboard/brand_listing_controller");
                onClose();
              }}
              sx={{
                backgroundColor: COLORS.primary,
                color: COLORS.white,
                fontSize: TEXT_SIZES.medium,
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: COLORS.primaryDark,
                },
              }}
            >
              Add States
            </Button>
          </Box>
        )}
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
        {/* <Button
          onClick={onClose}
          sx={{
            color: COLORS.grey[700],
            fontSize: TEXT_SIZES.medium,
            fontWeight: 600,
            "&:hover": {
              backgroundColor: COLORS.grey[200],
            },
          }}
        >
          Cancel
        </Button> */}

        <Button
          onClick={handleSaveStates}
          variant="contained"
          sx={{
            backgroundColor: COLORS.primary,
            color: COLORS.white,
            fontSize: TEXT_SIZES.medium,
            fontWeight: 600,
            px: 3,
            borderRadius: 2,
            "&:hover": {
              backgroundColor: COLORS.primaryDark,
            },
            "&:disabled": {
              opacity: 0.5,
            },
          }}
        >
          Save Selection
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StateSelectionModal;