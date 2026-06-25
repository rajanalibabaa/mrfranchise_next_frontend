"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, IconButton,
  Box, Typography, Divider, Snackbar, Alert,
  useMediaQuery, useTheme
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UpgradeMobileView from "./UpgradeMobileView";
import UpgradeDesktopView from "./UpgradeDesktopView";
import UpgradeStateModal from "./UpgradeStateModal";
import UpgradeListingPopup from "./UpgradeListingPopup";
import { useUpgradeLogic } from "./UpgradeLogic";

const UpgradeDialog = ({
  open, onClose, pkg, item, allPlans = [],
  leadsDropdownData = {}, ficoInvestmentRanges = [],
  selectedStates, setSelectedStates, allStates = [],
  COLORS, TEXT_SIZES, INDIA_STATES = {}, finalToken,
  getAlreadySelectedStatesInOtherRanges, getStatesToDisplay,
  handleSelectAll, handleClearAll, currentRangeStates,
  setCurrentRangeStates, renderStatesByRegion, onUpgrade,
  onViewSummary, openStateModal, setOpenStateModal,
  currentEditingRange, setCurrentEditingRange, blockedStates,
  setBlockedStates, stateSelections, setStateSelections,
  allPlanStatesByRange = {}, onSaveStates, scrollToPaymentSummary,
}) => {
  console.log("pkg", pkg);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    selectedLeads, setSelectedPlanId, snackbar, setSnackbar,
    checkedRanges, stateCounts, rows, activePlanId, activePlan,
    setLead, toggleRange, editStates, handleSaveStatesFromModal,
    buildStatesByRange, handleAddToPlan, clickedRangeLabel,
  } = useUpgradeLogic({
    open, item, allPlans, leadsDropdownData, ficoInvestmentRanges,
    stateSelections, setStateSelections, onUpgrade, onViewSummary,
    scrollToPaymentSummary, onClose, setOpenStateModal,
    setCurrentEditingRange, setCurrentRangeStates, setBlockedStates,
    setSelectedStates, allPlanStatesByRange, onSaveStates,
  });

  const packageType = (pkg?.packagesType || "").toUpperCase();
  const [showListingPopup, setShowListingPopup] = useState(false);

  useEffect(() => {
    if (open && isMobile && packageType === "LISTING") {
      setShowListingPopup(true);
    } else {
      setShowListingPopup(false);
    }
  }, [open, isMobile, packageType]);

  if (!open) return null;

  // Mobile listing popup
  if (isMobile && packageType === "LISTING") {
    return (
      <UpgradeListingPopup
        open={showListingPopup}
        onClose={() => { setShowListingPopup(false); onClose(); }}
        pkg={pkg}
        item={item}
      />
    );
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth
        PaperProps={{
          sx: isMobile
            ? { borderRadius: 3, mx: 2, maxHeight: "90dvh", overflow: "hidden", display: "flex", flexDirection: "column" }
            : { borderRadius: 3, overflow: "hidden" },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1.5, backgroundColor: "#dbeafe", borderBottom: "1px solid #e0e0e0", flexShrink: 0 }}>
          <Box>
            <Typography fontWeight={700} fontSize={isMobile ? "0.9rem" : "1rem"} color="#111">
              Upgrade Lead Package
            </Typography>
            {clickedRangeLabel && (
              <Box sx={{ display: "flex", flexDirection: "row", mt: 1 }}>
                <Typography fontSize="1rem" color="black">Investment Range:</Typography>
                <Typography fontSize="1rem" color="#fb8c00" fontWeight={600}>{clickedRangeLabel}</Typography>
              </Box>
            )}
          </Box>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" sx={{ color: "#9e9e9e" }} />
          </IconButton>
        </DialogTitle>
        <Divider />

        {isMobile ? (
          <Box sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <UpgradeMobileView
              rows={rows} activePlanId={activePlanId}
              setSelectedPlanId={setSelectedPlanId} activePlan={activePlan}
              checkedRanges={checkedRanges} toggleRange={toggleRange}
              selectedLeads={selectedLeads} setLead={setLead}
              stateCounts={stateCounts} stateSelections={stateSelections}
              item={item} editStates={editStates}
              handleAddToPlan={handleAddToPlan} onViewSummary={onViewSummary}
              buildStatesByRange={buildStatesByRange}
            />
          </Box>
        ) : (
          <UpgradeDesktopView
            rows={rows} activePlanId={activePlanId}
            setSelectedPlanId={setSelectedPlanId} activePlan={activePlan}
            checkedRanges={checkedRanges} toggleRange={toggleRange}
            selectedLeads={selectedLeads} setLead={setLead}
            stateCounts={stateCounts} stateSelections={stateSelections}
            item={item} editStates={editStates}
            handleAddToPlan={handleAddToPlan}
          />
        )}
      </Dialog>

      <UpgradeStateModal
        openStateModal={openStateModal} setOpenStateModal={setOpenStateModal}
        currentEditingRange={currentEditingRange}
        currentRangeStates={currentRangeStates} blockedStates={blockedStates}
        selectedStates={selectedStates} setSelectedStates={setSelectedStates}
        handleSaveStatesFromModal={handleSaveStatesFromModal}
        COLORS={COLORS} TEXT_SIZES={TEXT_SIZES} isMobile={isMobile}
      />

      <Snackbar open={snackbar.open} autoHideDuration={4000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar({ open: false, message: "" })}
          severity="warning" variant="filled"
          sx={{ fontWeight: 600, fontSize: "0.85rem", borderRadius: 2, backgroundColor: "#fb8c00", color: "#fff", "& .MuiAlert-icon": { color: "#fff" }, "& .MuiAlert-action .MuiIconButton-root": { color: "#fff" } }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UpgradeDialog;