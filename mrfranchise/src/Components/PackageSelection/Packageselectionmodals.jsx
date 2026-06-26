import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import LoginPage from "@/Components/LoginPage/LoginPage.jsx";
import StateSelectionModal from "./StateSelectionModal";
import SelectedStatesTooltipModal from "./SelectedStatesTooltipModal";
import InvestmentRangeConfirmDialog from "./InvestmentRangeConfirmDialog";
import RemoveInvestmentRangeDialog from "./RemoveInvestmentRangeDialog";
import { COLORS, TEXT_SIZES, INDIA_STATES, ALL_INDIA_STATES } from "./Packageselectionconstants";

const PackageSelectionModals = ({
  // snackbar
  snack,
  closeSnack,
  // login
  showLogin,
  setShowLogin,
  // state modal
  openStateModal,
  handleCloseStateModal,
  selectedStates,
  setSelectedStates,
  allStates,
  finalToken,
  getAlreadySelectedStatesInOtherRanges,
  getStatesToDisplay,
  renderStatesByRegion,
  handleSelectAll,
  handleClearAll,
  handleSaveStates,
  router,
  openSnack,
  // tooltip modal
  openStatesTooltip,
  setOpenStatesTooltip,
  tooltipStates,
  // confirm dialog
  openConfirmDialog,
  setOpenConfirmDialog,
  pendingSelection,
  setPendingSelection,
  isFicoInvestmentRange,
  handleAddInvestmentRange,
  onAddInvestmentRange,
  // remove dialog
  openRemoveConfirmDialog,
  setOpenRemoveConfirmDialog,
  itemToRemove,
  setItemToRemove,
  handleRemoveSingleFromPayment,
}) => {
  return (
    <>
      {/* State Selection Modal */}
      <StateSelectionModal
        open={openStateModal}
        onClose={handleCloseStateModal}
        selectedStates={selectedStates}
        setSelectedStates={setSelectedStates}
        allStates={allStates}
        COLORS={COLORS}
        TEXT_SIZES={TEXT_SIZES}
        ALL_INDIA_STATES={ALL_INDIA_STATES}
        finalToken={finalToken}
        getAlreadySelectedStatesInOtherRanges={getAlreadySelectedStatesInOtherRanges}
        getStatesToDisplay={getStatesToDisplay}
        renderStatesByRegion={renderStatesByRegion}
        handleSelectAll={handleSelectAll}
        handleClearAll={handleClearAll}
        handleSaveStates={handleSaveStates}
        router={router}
        openSnack={openSnack}
      />

      {/* States List Tooltip Modal */}
      <SelectedStatesTooltipModal
        open={openStatesTooltip}
        onClose={() => setOpenStatesTooltip(false)}
        tooltipStates={tooltipStates}
        INDIA_STATES={INDIA_STATES}
        COLORS={COLORS}
        TEXT_SIZES={TEXT_SIZES}
      />

      {/* Investment Range Confirm Dialog */}
      <InvestmentRangeConfirmDialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        COLORS={COLORS}
        TEXT_SIZES={TEXT_SIZES}
        pendingSelection={pendingSelection}
        setPendingSelection={setPendingSelection}
        finalToken={finalToken}
        setShowLogin={setShowLogin}
        isFicoInvestmentRange={isFicoInvestmentRange}
        handleAddInvestmentRange={handleAddInvestmentRange}
        openSnack={openSnack}
        onAddInvestmentRange={onAddInvestmentRange}
      />

      {/* Remove Investment Range Dialog */}
      <RemoveInvestmentRangeDialog
        open={openRemoveConfirmDialog}
        onClose={() => setOpenRemoveConfirmDialog(false)}
        COLORS={COLORS}
        TEXT_SIZES={TEXT_SIZES}
        itemToRemove={itemToRemove}
        handleRemoveSingleFromPayment={handleRemoveSingleFromPayment}
        setItemToRemove={setItemToRemove}
      />

      {/* Login Page */}
      <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={closeSnack}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={closeSnack}
          severity={snack.severity}
          variant="filled"
          elevation={6}
          sx={{
            fontSize: TEXT_SIZES.medium,
            backgroundColor: snack.severity === "success" ? COLORS.secondary : COLORS.primary,
            color: COLORS.white,
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: `0 4px 12px ${COLORS.shadow}`,
          }}
        >
          {snack.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default PackageSelectionModals;