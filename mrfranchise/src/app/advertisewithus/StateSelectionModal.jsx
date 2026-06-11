import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  Drawer,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const StateSelectionModal = ({
  open,
  onClose,
  COLORS,
  TEXT_SIZES,
  selectedStates,
  setSelectedStates,
  finalToken,
  ALL_INDIA_STATES,
  allStates,
  INDIA_STATES = {},
  getAlreadySelectedStatesInOtherRanges,
  getStatesToDisplay,
  handleSelectAll,
  handleClearAll,
  renderStatesByRegion,
  handleSaveStates,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const blocked = typeof getAlreadySelectedStatesInOtherRanges === "function"
    ? getAlreadySelectedStatesInOtherRanges()
    : new Set();

  const currentRangeSelectedCount = [...selectedStates].filter(
    (s) => !blocked.has(s)
  ).length;

  const totalAvailable = !finalToken
    ? ALL_INDIA_STATES?.filter((s) => !blocked.has(s)).length || 0
    : allStates?.filter((s) => !blocked.has(s)).length || 0;

  const statesToDisplay = typeof getStatesToDisplay === "function"
    ? getStatesToDisplay()
    : [];
  const selectableStates = statesToDisplay.filter((s) => !blocked.has(s));

  const isAllSelected = selectableStates.length > 0 && selectableStates.every((s) => selectedStates.has(s));

  const isClearDisabled = [...selectedStates].every((s) =>
    blocked.has(s)
  );

  // Default render function for states by region
  const defaultRenderStatesByRegion = () => {
    if (!INDIA_STATES || Object.keys(INDIA_STATES).length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography color={COLORS.grey[600]} fontSize={TEXT_SIZES.medium}>
            No regions available
          </Typography>
        </Box>
      );
    }

    return Object.entries(INDIA_STATES).map(([region, states]) => {
      const availableStates = states.filter(s => !blocked.has(s));
      const selectedCount = availableStates.filter(s => selectedStates.has(s)).length;
      const isExpanded = selectedCount > 0;

      if (availableStates.length === 0) return null;

      return (
        <Accordion 
          key={region} 
          defaultExpanded={isExpanded}
          sx={{
            mb: 1.5,
            "&:before": { display: "none" },
            boxShadow: `0 1px 3px ${COLORS.shadow}`,
            borderRadius: "8px !important",
            overflow: "hidden",
            border: `1px solid ${COLORS.border}`
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: COLORS.primary }} />}
            sx={{
              backgroundColor: COLORS.grey[50],
              "&:hover": { backgroundColor: COLORS.grey[100] },
              minHeight: 48
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", pr: 2 }}>
              <Typography fontWeight={700} fontSize={TEXT_SIZES.small} color={COLORS.black}>
                {region}
              </Typography>
              <Chip
                label={`${selectedCount}/${availableStates.length} selected`}
                size="small"
                sx={{
                  height: 24,
                  fontSize: TEXT_SIZES.xs,
                  backgroundColor: selectedCount > 0 ? COLORS.lightOrange : COLORS.grey[200],
                  color: selectedCount > 0 ? COLORS.primaryDark : COLORS.grey[600],
                  fontWeight: 600
                }}
              />
            </Box>
          </AccordionSummary>
          
          <AccordionDetails sx={{ p: 2 }}>
            <Grid container spacing={1.5}>
              {availableStates.map((state) => (
                <Grid item xs={12} sm={6} md={4} key={state}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedStates.has(state)}
                        onChange={() => {
                          const newSelected = new Set(selectedStates);
                          if (newSelected.has(state)) {
                            newSelected.delete(state);
                          } else {
                            newSelected.add(state);
                          }
                          setSelectedStates?.(newSelected);
                        }}
                        size="small"
                        sx={{
                          color: COLORS.primary,
                          "&.Mui-checked": {
                            color: COLORS.primary,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography fontSize={TEXT_SIZES.small} color={COLORS.black}>
                        {state}
                      </Typography>
                    }
                    sx={{
                      margin: 0,
                      width: "100%",
                      "& .MuiFormControlLabel-label": {
                        flex: 1,
                      },
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      );
    });
  };

  const renderFunction = renderStatesByRegion || defaultRenderStatesByRegion;

  const StateSelectionContent = () => (
    <Box sx={{ width: "100%" }}>
      {/* Summary Section */}
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          mb: 3,
          backgroundColor: COLORS.grey[50],
          borderRadius: 2,
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "stretch" : "center",
        }}
      >
        {/* <Box>
          <Typography fontWeight={600} fontSize={TEXT_SIZES.small} color={COLORS.black}>
            Selection Summary
          </Typography>
          <Typography fontSize={TEXT_SIZES.xs} color={COLORS.grey[600]} sx={{ mt: 0.5 }}>
            {currentRangeSelectedCount} of {totalAvailable} states selected
          </Typography>
        </Box> */}
        <Box sx={{ display: "flex", gap: 1.5, flexDirection: isMobile ? "column" : "row", width: isMobile ? "100%" : "auto" }}>
          <Button
            variant="outlined"
            size={isMobile ? "medium" : "small"}
            onClick={handleSelectAll}
            disabled={isAllSelected}
            fullWidth={isMobile}
            sx={{
              borderColor: COLORS.primary,
              color: COLORS.primary,
              fontSize: TEXT_SIZES.small,
              borderWidth: 2,
              borderRadius: 1.5,
              fontWeight: 600,
              px: isMobile ? 2 : 3,
              py: isMobile ? 1 : 0.5,
              whiteSpace: "nowrap",
              "&:hover": {
                borderColor: COLORS.primaryDark,
                backgroundColor: COLORS.lightOrange,
                borderWidth: 2,
              },
              "&.Mui-disabled": {
                borderColor: COLORS.grey[300],
                color: COLORS.grey[400],
              }
            }}
          >
            Select All ({selectableStates.length})
          </Button>

          <Button
            variant="outlined"
            size={isMobile ? "medium" : "small"}
            onClick={handleClearAll}
            disabled={isClearDisabled}
            fullWidth={isMobile}
            sx={{
              borderColor: COLORS.primary,
              color: COLORS.primary,
              fontSize: TEXT_SIZES.small,
              borderWidth: 2,
              borderRadius: 1.5,
              fontWeight: 600,
              px: isMobile ? 2 : 3,
              py: isMobile ? 1 : 0.5,
              whiteSpace: "nowrap",
              "&:hover": {
                borderColor: COLORS.primaryDark,
                backgroundColor: COLORS.lightOrange,
                borderWidth: 2,
              },
              "&.Mui-disabled": {
                borderColor: COLORS.grey[300],
                color: COLORS.grey[400],
              }
            }}
          >
            Clear All
          </Button>
        </Box>
      </Box>

      {/* Region Accordions - Scrollable content */}
      <Box sx={{ width: "100%" }}>
        {renderFunction()}
      </Box>
    </Box>
  );

  // Mobile Drawer with improved scrolling
  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: "90vh", // Fixed height instead of maxHeight
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Header - Fixed at top */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
            p: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 10,
            flexShrink: 0, // Prevent shrinking
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: TEXT_SIZES.large,
                fontWeight: 700,
                color: COLORS.white,
              }}
            >
              Select States
            </Typography>
            <Typography
              sx={{
                fontSize: TEXT_SIZES.xs,
                color: "rgba(255,255,255,0.9)",
                mt: 0.5,
              }}
            >
              {currentRangeSelectedCount} of {totalAvailable} selected
            </Typography>
          </Box>
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
        </Box>

        {/* Scrollable Content Area */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto", // Enable vertical scrolling
            overflowX: "hidden",
            p: 2,
            // Custom scrollbar styling
            "&::-webkit-scrollbar": {
              width: 6,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: COLORS.grey[200],
              borderRadius: 10,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: COLORS.primary,
              borderRadius: 10,
              "&:hover": {
                backgroundColor: COLORS.primaryDark,
              },
            },
            // Firefox scrollbar
            scrollbarWidth: "thin",
            scrollbarColor: `${COLORS.primary} ${COLORS.grey[200]}`,
          }}
        >
          <StateSelectionContent />
        </Box>

        {/* Footer - Fixed at bottom */}
        <Box
          sx={{
            p: 2,
            backgroundColor: COLORS.white,
            borderTop: `1px solid ${COLORS.border}`,
            position: "sticky",
            bottom: 0,
            zIndex: 10,
            flexShrink: 0, // Prevent shrinking
            boxShadow: "0 -2px 8px rgba(0,0,0,0.05)"
          }}
        >
          <Button
            onClick={handleSaveStates}
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: COLORS.primary,
              color: COLORS.white,
              fontSize: TEXT_SIZES.medium,
              fontWeight: 600,
              py: 1.5,
              borderRadius: 2,
              "&:hover": {
                backgroundColor: COLORS.primaryDark,
              },
            }}
          >
            Save Selection ({currentRangeSelectedCount} selected)
          </Button>
        </Box>
      </Drawer>
    );
  }

  // Desktop/Tablet Dialog
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: `2px solid ${COLORS.primary}`,
          boxShadow: `0 8px 32px ${COLORS.shadow}`,
          margin: isTablet ? 2 : 3,
          width: "100%",
          maxWidth: isTablet ? "600px" : "700px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: "inherit", fontWeight: "inherit" }}>
            Select States
          </Typography>
          <Typography sx={{ fontSize: TEXT_SIZES.xs, opacity: 0.9, mt: 0.5 }}>
            {currentRangeSelectedCount} of {totalAvailable} selected
          </Typography>
        </Box>
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

      {/* Scrollable Content */}
      <DialogContent
        dividers
        sx={{
          flex: 1,
          overflow: "auto",
          p: 3,
          "&::-webkit-scrollbar": {
            width: 8,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: COLORS.grey[100],
            borderRadius: 4,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: COLORS.primary,
            borderRadius: 4,
            "&:hover": {
              backgroundColor: COLORS.primaryDark,
            },
          },
        }}
      >
        <StateSelectionContent />
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          justifyContent: "flex-end",
          px: 3,
          py: 2,
          backgroundColor: COLORS.grey[50],
          flexShrink: 0,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: COLORS.grey[700],
            fontSize: TEXT_SIZES.medium,
            fontWeight: 600,
            mr: 1,
            "&:hover": {
              backgroundColor: COLORS.grey[200],
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSaveStates}
          variant="contained"
          sx={{
            backgroundColor: COLORS.primary,
            color: COLORS.white,
            fontSize: TEXT_SIZES.medium,
            fontWeight: 600,
            px: 4,
            py: 1,
            borderRadius: 2,
            "&:hover": {
              backgroundColor: COLORS.primaryDark,
            },
          }}
        >
          Save Selection ({currentRangeSelectedCount})
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StateSelectionModal;