import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Chip,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const SelectedStatesTooltipModal = ({
  open,
  onClose,
  tooltipStates = [],
  INDIA_STATES,
  COLORS,
  TEXT_SIZES,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: `1px solid ${COLORS.primary}`,
          maxHeight: "80vh",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
          fontSize: TEXT_SIZES.medium,
          fontWeight: 700,
          color: COLORS.white,
          py: 1.5,
          pr: 5,
          position: "relative",
        }}
      >
        Selected States ({tooltipStates.length})

        <IconButton
          onClick={onClose}
          aria-label="close"
          sx={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            color: COLORS.white,
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent dividers sx={{ p: 2 }}>
        {tooltipStates.length > 0 ? (
          <Box>
            {/* Group By Region */}
            {Object.entries(INDIA_STATES).map(
              ([region, regionStates]) => {
                const matchedStates = tooltipStates.filter((state) =>
                  regionStates.includes(state)
                );

                if (matchedStates.length === 0) return null;

                return (
                  <Box key={region} sx={{ mb: 2 }}>
                    {/* Region Title */}
                    <Typography
                      sx={{
                        fontSize: TEXT_SIZES.small,
                        fontWeight: 700,
                        color: COLORS.primary,
                        mb: 1,
                        pb: 0.5,
                        borderBottom: `1px solid ${COLORS.border}`,
                      }}
                    >
                      {region} ({matchedStates.length})
                    </Typography>

                    {/* States */}
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.8,
                        pl: 1,
                      }}
                    >
                      {matchedStates.map((state, idx) => (
                        <Chip
                          key={idx}
                          label={state}
                          size="small"
                          sx={{
                            backgroundColor: COLORS.lightOrange,
                            color: COLORS.black,
                            fontWeight: 500,
                            fontSize: "0.7rem",
                            height: 24,
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                );
              }
            )}
          </Box>
        ) : (
          <Typography
            sx={{
              color: COLORS.grey[500],
              textAlign: "center",
              py: 4,
            }}
          >
            No states selected
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SelectedStatesTooltipModal;