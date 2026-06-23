import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
      position: "absolute",
      top: 50,
      margin: 0,
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            {/* Group By Region */}
            {Object.entries(INDIA_STATES).map(
              ([region, regionStates]) => {
                const matchedStates = tooltipStates.filter((state) =>
                  regionStates.includes(state)
                );

                if (matchedStates.length === 0) return null;

                return (
                  <Accordion
                    key={region}
                    elevation={0}
                    sx={{
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: "8px !important",
                      "&:before": { display: "none" },
                      backgroundColor: COLORS.white,
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: COLORS.primary }} />}
                      sx={{
                        backgroundColor: COLORS.grey[50],
                        borderRadius: "8px",
                        p: 1.5,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
                        <Typography fontWeight={700} fontSize={TEXT_SIZES.medium} color={COLORS.black}>
                          {region}
                        </Typography>
                        <Chip
                          label={`${matchedStates.length}/${regionStates.length}`}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: TEXT_SIZES.xs,
                            backgroundColor: COLORS.primary,
                            color: COLORS.white,
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 2 }}>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {matchedStates.map((state, idx) => (
                          <Chip
                            key={idx}
                            label={state}
                            size="small"
                            sx={{
                              backgroundColor: COLORS.lightOrange,
                              color: COLORS.primaryDark,
                              fontWeight: 600,
                              fontSize: TEXT_SIZES.small,
                              borderRadius: 1.5,
                            }}
                          />
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
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