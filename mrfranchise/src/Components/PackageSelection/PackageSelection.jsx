"use client";

import React, { memo } from "react";
import {
  Box,
  Typography,
  Alert,
  Chip,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LayersIcon from "@mui/icons-material/Layers";

import MobilePackageSelection from "./Mobilepackageselection";
import StateSelectionModal from "./StateSelectionModal";
import SelectedStatesTooltipModal from "./SelectedStatesTooltipModal";
import InvestmentRangeConfirmDialog from "./InvestmentRangeConfirmDialog";
import RemoveInvestmentRangeDialog from "./RemoveInvestmentRangeDialog";
import PaymentSummaryTable from "./PaymentSummaryTable";
import PaymentBottomBar from "./PaymentBottomBar";
import ExistingPackageDisplay from "./ExistingPackageDisplay";
import ListingPlans from "./ListingPlans";
import InvestorLeadPlans from "./Investorleadplans";
import PackageSelectionModals from "./Packageselectionmodals";
import usePackageSelection from "./Packageselectionhooks";
import { COLORS, TEXT_SIZES, INDIA_STATES, ALL_INDIA_STATES, bounceAnimation } from "./Packageselectionconstants";

// ─── Alert Message ────────────────────────────────────────────────────────────
const AlertMessage = memo(({ severity, message, action }) => (
  <Alert
    severity={severity}
    sx={{
      mb: 2, borderRadius: 2,
      backgroundColor: severity === "success" ? COLORS.lightGreen : COLORS.lightOrange,
      color: COLORS.black, fontSize: TEXT_SIZES.medium,
      border: `1px solid ${severity === "success" ? COLORS.secondary : COLORS.primary}`,
      "& .MuiAlert-icon": { color: severity === "success" ? COLORS.secondary : COLORS.primary },
    }}
    action={action}
  >
    {message}
  </Alert>
));
AlertMessage.displayName = "AlertMessage";

// ─── Main Component ───────────────────────────────────────────────────────────
const PackageSelection = ({ onAddInvestmentRange = () => {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    paymentSummaryRef, upgradeSectionRef, router,
    paymentSummary, setPaymentSummary,
    plans, loading, error,
    selected, setSelected,
    ficoInvestmentRanges,
    detectedState,
    openStateModal,
    allStates,
    selectedStates, setSelectedStates,
    statesByInvestmentRange,
    currentEditingRange,
    isUpgradeMode, setIsUpgradeMode,
    upgradePlanId, setUpgradePlanId,
    showLogin, setShowLogin,
    openSection,
    snack,
    leadsDropdownData,
    selectedLeadsPerRange,
    selectedListingPlanId,
    movedGroupKeys, setMovedGroupKeys,
    selectedGroup, setSelectedGroup,
    selectedValidityDays,
    checkedItems, setCheckedItems,
    openConfirmDialog, setOpenConfirmDialog,
    pendingSelection, setPendingSelection,
    expandedRegion, setExpandedRegion,
    openStatesTooltip, setOpenStatesTooltip,
    tooltipStates,
    openRemoveConfirmDialog, setOpenRemoveConfirmDialog,
    itemToRemove, setItemToRemove,
    data, loadings, errors,
    finalToken, finalBrandUUID,
    filteredPlans,
    scrollToPaymentSummary,
    openSnack, closeSnack,
    handleSectionChange,
    getRangeKey,
    getStatesToDisplay,
    handleOpenStateModal,
    handleShowStates,
    handleCloseStateModal,
    getAlreadySelectedStatesInOtherRanges,
    handleSaveStates,
    handleAddSingleToPayment,
    handleRemoveSingleFromPayment,
    handleProceedToPayment,
    getStateCountForRange,
    handleAddInvestmentRange,
    handleLeadsChange,
    getRowBackgroundColor,
    handleRemoveListingPlan,
    handleSelectAll,
    handleClearAll,
    handleStateCheckboxChange,
    isFicoInvestmentRange,
    getBrandName, getCategory, getIndustry,
  } = usePackageSelection(onAddInvestmentRange);

  const handleAddListingPlan = (plan, pkg) => {
    const groupKey = `listing-${plan._id}`;
    const allAvailableStates = finalToken ? allStates : ALL_INDIA_STATES;
    const stateCount = allAvailableStates.length;

    const listingItem = {
      id: `listing-${plan._id}-item`,
      investmentRangeLabel: "ALL INVESTMENT RANGE",
      range: "ALL INVESTMENT RANGE",
      stateCount,
      states: ["ALL STATES"],
      selectedLeads: "-",
      totalLeads: "-",
      totalAmount: pkg.amount || 0,
      pricePerState: pkg.amount || 0,
      isListingPlan: true,
    };

    setPaymentSummary((prev) => {
      if (prev.some((g) => g.groupKey === groupKey)) {
        openSnack("Already added", "info");
        return prev;
      }
      openSnack(`${plan.planName} added to cart`, "success");
      setTimeout(() => scrollToPaymentSummary(), 400);
      return [
        ...prev,
        {
          groupKey,
          planId: plan._id,
          packagesType: plan.packageType,
          planName: plan.planName,
          planUniqueId: plan.planUniqueId,
          planpackageId: pkg._id,
          investmentRangeLabel: "ALL INVESTMENT RANGE",
          validityDays: pkg.validityDays,
          pricePerState: pkg.amount,
          amount: pkg.amount,
          totalLeads: "-",
          items: [listingItem],
          isListingPlan: true,
          uniqueStates: ["ALL STATES"],
          totalStates: stateCount,
        },
      ];
    });

    setMovedGroupKeys((prev) => {
      if (!prev.includes(groupKey)) return [...prev, groupKey];
      return prev;
    });
  };
  
  // ── renderStatesByRegion (needs local state from hook) ────────────────────
  const renderStatesByRegion = () => {
    const statesToDisplay = getStatesToDisplay();
    const alreadySelectedStates = getAlreadySelectedStatesInOtherRanges();

    return Object.entries(INDIA_STATES).map(([region, states]) => {
      const availableStates = states.filter((state) => statesToDisplay.includes(state));
      if (availableStates.length === 0) return null;
      const selectedCount = availableStates.filter((state) => selectedStates.has(state)).length;
      const availableToSelectCount = availableStates.filter((state) => !alreadySelectedStates.has(state)).length;

      return (
        <Accordion
          key={region}
          expanded={expandedRegion === region}
          onChange={(event, isExpanded) => { setExpandedRegion(isExpanded ? region : null); }}
          elevation={0}
          sx={{ border: `1px solid ${COLORS.border}`, borderRadius: "8px !important", mb: 0.6, "&:before": { display: "none" }, "&.Mui-expanded": { margin: "0 0 12px 0" } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: COLORS.primary }} />}
            sx={{
              backgroundColor: COLORS.grey[50], borderRadius: "8px",
              "&.Mui-expanded": { borderRadius: "8px 8px 0 0" },
              "& .MuiAccordionSummary-content": { alignItems: "center", justifyContent: "space-between" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontSize: TEXT_SIZES.medium, fontWeight: 700, color: COLORS.black }}>{region}</Typography>
              <Chip
                label={`${selectedCount}/${availableToSelectCount} Selected`}
                size="small"
                sx={{ height: 15, fontSize: "0.7rem", backgroundColor: selectedCount === availableToSelectCount ? COLORS.secondary : COLORS.grey[400], color: COLORS.white, fontWeight: 600 }}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: { xs: 0, sm: 2 } }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Box
                component="span"
                onClick={(e) => {
                  e.stopPropagation();
                  const newSet = new Set(selectedStates);
                  const selectableStates = availableStates.filter((state) => !alreadySelectedStates.has(state));
                  const allSelected = selectableStates.every((state) => selectedStates.has(state));
                  if (allSelected) { selectableStates.forEach((state) => newSet.delete(state)); openSnack(`Deselected all selectable states in ${region}`, "info"); }
                  else { selectableStates.forEach((state) => newSet.add(state)); openSnack(`Selected ${selectableStates.length} states in ${region}`, "success"); }
                  setSelectedStates(newSet);
                }}
                sx={{ fontSize: "0.7rem", textTransform: "none", color: COLORS.primary, cursor: "pointer", display: "inline-flex", alignItems: "center", borderRadius: "4px", "&:hover": { backgroundColor: COLORS.lightOrange } }}
              >
                Select All Available ({availableToSelectCount})
              </Box>
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1 }}>
              {availableStates.map((state) => {
                const isDisabled = alreadySelectedStates.has(state);
                const isChecked = selectedStates.has(state);
                return (
                  <FormControlLabel
                    key={state}
                    control={
                      <Checkbox
                        checked={isChecked}
                        onChange={() => {
                          if (!isDisabled) handleStateCheckboxChange(state);
                          else openSnack("This state is already used in investment range and cannot be selected again", "warning");
                        }}
                        disabled={isDisabled}
                        sx={{ color: COLORS.primary, "&.Mui-checked": { color: COLORS.secondary }, "&.Mui-disabled": { color: COLORS.grey[400] } }}
                      />
                    }
                    label={
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography sx={{ fontSize: TEXT_SIZES.medium, color: isDisabled ? COLORS.grey[500] : COLORS.black, fontWeight: isChecked ? 600 : 400, textDecoration: isDisabled ? "line-through" : "none" }}>
                          {state}
                        </Typography>
                        {isDisabled && (
                          <Typography sx={{ fontSize: "0.65rem", color: COLORS.grey[500], lineHeight: 1.2, mt: 0.2 }}>
                            This state is already used in investment range and cannot be selected again
                          </Typography>
                        )}
                      </Box>
                    }
                    sx={{
                      display: "flex", flexDirection: "row", alignItems: "center", margin: 0, py: 0.5, px: 1, borderRadius: 1.5, transition: "all 0.2s ease",
                      backgroundColor: isChecked ? COLORS.lightGreen : "transparent", width: "100%", opacity: isDisabled ? 0.6 : 1,
                      "&:hover": { backgroundColor: !isDisabled && (isChecked ? COLORS.lightGreen : COLORS.lightOrange) },
                      "& .MuiFormControlLabel-label": { width: "calc(100% - 35px)", overflow: "hidden" },
                    }}
                  />
                );
              })}
            </Box>
          </AccordionDetails>
        </Accordion>
      );
    });
  };

  // ── Loading / Error states ─────────────────────────────────────────────────
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress sx={{ color: COLORS.primary }} size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ fontSize: TEXT_SIZES.medium, borderRadius: 2, border: `1px solid ${COLORS.primary}` }}>
          {error}
        </Alert>
      </Box>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ width: "100%", minHeight: "100vh" }}>

      {/* Brand Header */}
      {(data?.brandDetails?.brandName || data?.brandName || getBrandName() || data?.brandDetails?.category || data?.category || data?.brandDetails?.industry || data?.industry) && (
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: { xs: "center", md: "flex-end" }, alignItems: { xs: "center", md: "center" }, gap: { xs: 1, md: 2 }, border: { xs: `4px solid ${COLORS.secondary}`, md: "none" }, borderRadius: 2, mb: 3, pb: 2, px: { xs: 0, md: 4 }, flexWrap: "wrap" }}>
          {(data?.brandDetails?.brandName || data?.brandName || getBrandName()) && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ fontSize: { xs: TEXT_SIZES.large, sm: TEXT_SIZES.medium }, color: COLORS.black, display: { xs: "none", md: "block" } }}>Brand Name:</Typography>
              <Typography sx={{ fontSize: TEXT_SIZES.xl, fontWeight: 700, color: COLORS.primary, textAlign: "center" }}>
                {data?.brandDetails?.brandName || data?.brandName || getBrandName()}
              </Typography>
            </Box>
          )}
          {(data?.brandDetails?.industry || data?.industry) && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontSize: { xs: TEXT_SIZES.large, sm: TEXT_SIZES.medium }, color: COLORS.black, display: { xs: "none", md: "block" } }}>Industry:</Typography>
              <Typography sx={{ fontSize: TEXT_SIZES.xl, fontWeight: 700, color: COLORS.black, textAlign: "center" }}>
                {data?.brandDetails?.industry || data?.industry}
              </Typography>
            </Box>
          )}
          {(data?.brandDetails?.category || data?.category) && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontSize: { xs: TEXT_SIZES.large, sm: TEXT_SIZES.medium }, color: COLORS.black, display: { xs: "none", md: "block" } }}>Category:</Typography>
              <Typography sx={{ fontSize: TEXT_SIZES.medium, fontWeight: 700, color: COLORS.black, textAlign: "center" }}>
                {data?.brandDetails?.category || data?.category}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Existing Package Display */}
      <ExistingPackageDisplay
        data={data}
        error={errors}
        loading={loadings}
        isLoggedIn={!!finalToken}
        upgradeSectionRef={upgradeSectionRef}
        allPlans={plans}
        leadsDropdownData={leadsDropdownData}
        INDIA_STATES={INDIA_STATES}
        ALL_INDIA_STATES={ALL_INDIA_STATES}
        sectionExpanded={openSection.includes("active")}
        onSectionChange={handleSectionChange("active")}
        allStates={allStates}
        finalToken={finalToken}
        ficoInvestmentRanges={ficoInvestmentRanges}
        onUpgradeModeChange={(isUpgrade, planId) => { setIsUpgradeMode(isUpgrade); setUpgradePlanId(planId); }}
        onAddToPaymentSummary={(upgradeData) => {
          const selectedItems = [];
          const checkedRanges = upgradeData.checkedRanges || [];
          checkedRanges.forEach((range) => {
            const states = upgradeData.statesByRange?.[range] || [];
            if (states?.length > 0) {
              const selectedLeads = upgradeData.selectedLeads || upgradeData.leads || 0;
              const minLead = upgradeData.minLead || 1;
              const pricePerState = upgradeData.pricePerState || 0;
              const stateCount = states.length;
              selectedItems.push({
                id: `${upgradeData.planId}-${upgradeData.investmentRangeLabel}-${range}`,
                investmentRangeLabel: upgradeData.investmentRangeLabel || "—",
                range,
                states,
                stateCount,
                selectedLeads,
                totalLeads: selectedLeads * stateCount,
                totalAmount: (pricePerState / minLead) * stateCount * selectedLeads,
              });
            }
          });
          if (selectedItems.length === 0) return;
          const groupKey = `${upgradeData.planId}__${upgradeData.investmentRangeLabel}`;
          setPaymentSummary((prev) => {
            const existingIndex = prev.findIndex((p) => p.groupKey === groupKey);
            const allStatesSet = new Set();
            selectedItems.forEach((item) => { (item.states || []).forEach((state) => allStatesSet.add(state)); });
            const newGroup = {
              groupKey, planId: upgradeData.planId, planName: upgradeData.planName,
              investmentRangeLabel: upgradeData.investmentRangeLabel || "—",
              pricePerState: upgradeData.pricePerState || 0,
              validityDays: upgradeData.validityDays || 0,
              items: selectedItems,
              uniqueStates: Array.from(allStatesSet),
              totalStates: allStatesSet.size,
              amount: selectedItems.reduce((sum, item) => sum + (item.totalAmount || 0), 0),
              totalLeads: selectedItems.reduce((sum, item) => sum + (item.totalLeads || 0), 0),
              selectedLeads: upgradeData.selectedLeads || upgradeData.leads || 0,
            };
            if (existingIndex !== -1) {
              const updated = [...prev];
              updated[existingIndex] = newGroup;
              return updated;
            }
            return [...prev, newGroup];
          });
          setMovedGroupKeys((prev) => prev.includes(groupKey) ? prev : [...prev, groupKey]);
          setTimeout(() => scrollToPaymentSummary(), 100);
        }}
      />

      {/* Listing Plans - Desktop Only */}
      {!isMobile && (
        <Box ref={upgradeSectionRef}>
          <ListingPlans
            plans={plans}
            paymentSummary={paymentSummary}
            data={data}
            isUpgradeMode={isUpgradeMode}
            upgradePlanId={upgradePlanId}
            finalToken={finalToken}
            allStates={allStates}
            ALL_INDIA_STATES={ALL_INDIA_STATES}
            COLORS={COLORS}
            TEXT_SIZES={TEXT_SIZES}
            openSnack={openSnack}
            scrollToPaymentSummary={scrollToPaymentSummary}
            setPaymentSummary={setPaymentSummary}
            setMovedGroupKeys={setMovedGroupKeys}
            handleRemoveListingPlan={handleRemoveListingPlan}
          />
        </Box>
      )}

      {/* Investor Lead Plans */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
        {!isMobile && (
          <Box sx={{ width: "100%", maxWidth: "1300px", mb: 3, textAlign: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: COLORS.black, mb: 1, fontSize: { xs: "1rem", md: "1.9rem" } }}>
              INVESTOR LEAD PLANS
            </Typography>
            <Typography variant="body3" sx={{ color: COLORS.black, fontSize: TEXT_SIZES.medium, maxWidth: "600px", mx: "auto" }}>
              Franchise | Dealer and Distributor | Channel Partner | Agent and Association
            </Typography>
          </Box>
        )}

        {isMobile ? (
          <MobilePackageSelection
            filteredPlans={filteredPlans}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            leadsDropdownData={leadsDropdownData}
            selectedLeadsPerRange={selectedLeadsPerRange}
            handleLeadsChange={handleLeadsChange}
            checkedItems={checkedItems}
            setCheckedItems={setCheckedItems}
            paymentSummary={paymentSummary}
            handleAddSingleToPayment={handleAddSingleToPayment}
            statesByInvestmentRange={statesByInvestmentRange}
            getStateCountForRange={getStateCountForRange}
            getRangeKey={getRangeKey}
            handleOpenStateModal={handleOpenStateModal}
            isFicoInvestmentRange={isFicoInvestmentRange}
            ficoInvestmentRanges={ficoInvestmentRanges}
            scrollToPaymentSummary={scrollToPaymentSummary}
            openSnack={openSnack}
            setOpenConfirmDialog={setOpenConfirmDialog}
            setPendingSelection={setPendingSelection}
            finalToken={finalToken}
            data={data}
            allStates={allStates}
            plans={plans}
            paymentSummaryRef={paymentSummaryRef}
            handleRemoveListingPlan={handleRemoveListingPlan}
            isUpgradeMode={isUpgradeMode}
            upgradePlanId={upgradePlanId}
            hideListingPlans={false}
            sectionExpanded={openSection}
            onSectionChange={handleSectionChange}
            handleAddListingPlanProp={handleAddListingPlan}
          />
        ) : (
          <InvestorLeadPlans
            filteredPlans={filteredPlans}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            selectedValidityDays={selectedValidityDays}
            leadsDropdownData={leadsDropdownData}
            selectedLeadsPerRange={selectedLeadsPerRange}
            checkedItems={checkedItems}
            setCheckedItems={setCheckedItems}
            paymentSummary={paymentSummary}
            statesByInvestmentRange={statesByInvestmentRange}
            movedGroupKeys={movedGroupKeys}
            ficoInvestmentRanges={ficoInvestmentRanges}
            finalToken={finalToken}
            detectedState={detectedState}
            allStates={allStates}
            data={data}
            COLORS={COLORS}
            TEXT_SIZES={TEXT_SIZES}
            getRangeKey={getRangeKey}
            getStateCountForRange={getStateCountForRange}
            getRowBackgroundColor={getRowBackgroundColor}
            isFicoInvestmentRange={isFicoInvestmentRange}
            handleOpenStateModal={handleOpenStateModal}
            handleLeadsChange={handleLeadsChange}
            handleAddSingleToPayment={handleAddSingleToPayment}
            setPendingSelection={setPendingSelection}
            setOpenConfirmDialog={setOpenConfirmDialog}
            openSnack={openSnack}
            selectedListingPlanId={selectedListingPlanId}
          />
        )}
      </Box>

      {/* Payment Summary */}
      {(paymentSummary.filter((g) => movedGroupKeys.includes(g.groupKey)).length > 0 || paymentSummary.length > 0) && (
        <>
          {(() => {
            const movedGroups = paymentSummary.filter((g) => movedGroupKeys.includes(g.groupKey));
            const totalPlans = new Set(movedGroups.map((g) => g.planId)).size;
            const totalAmount = movedGroups.reduce((acc, g) => acc + (g.amount || 0), 0);
            return (
              <PaymentBottomBar
                COLORS={COLORS}
                TEXT_SIZES={TEXT_SIZES}
                bounceAnimation={bounceAnimation}
                statCards={[{ label: "Plans", value: totalPlans, icon: <LayersIcon sx={{ fontSize: 17 }} /> }]}
                totalAmount={totalAmount}
                loading={loading}
                handleProceedToPayment={handleProceedToPayment}
              />
            );
          })()}
          <PaymentSummaryTable
            paymentSummary={paymentSummary}
            paymentSummaryRef={paymentSummaryRef}
            COLORS={COLORS}
            TEXT_SIZES={TEXT_SIZES}
            handleShowStates={handleShowStates}
            setItemToRemove={setItemToRemove}
            setOpenRemoveConfirmDialog={setOpenRemoveConfirmDialog}
            sectionExpanded={openSection.includes("summary")}
            onSectionChange={handleSectionChange("summary")}
          />
        </>
      )}

      {/* All Modals & Dialogs */}
      <PackageSelectionModals
        snack={snack}
        closeSnack={closeSnack}
        showLogin={showLogin}
        setShowLogin={setShowLogin}
        openStateModal={openStateModal}
        handleCloseStateModal={handleCloseStateModal}
        selectedStates={selectedStates}
        setSelectedStates={setSelectedStates}
        allStates={allStates}
        finalToken={finalToken}
        getAlreadySelectedStatesInOtherRanges={getAlreadySelectedStatesInOtherRanges}
        getStatesToDisplay={getStatesToDisplay}
        renderStatesByRegion={renderStatesByRegion}
        handleSelectAll={handleSelectAll}
        handleClearAll={handleClearAll}
        handleSaveStates={handleSaveStates}
        router={router}
        openSnack={openSnack}
        openStatesTooltip={openStatesTooltip}
        setOpenStatesTooltip={setOpenStatesTooltip}
        tooltipStates={tooltipStates}
        openConfirmDialog={openConfirmDialog}
        setOpenConfirmDialog={setOpenConfirmDialog}
        pendingSelection={pendingSelection}
        setPendingSelection={setPendingSelection}
        isFicoInvestmentRange={isFicoInvestmentRange}
        handleAddInvestmentRange={handleAddInvestmentRange}
        onAddInvestmentRange={onAddInvestmentRange}
        openRemoveConfirmDialog={openRemoveConfirmDialog}
        setOpenRemoveConfirmDialog={setOpenRemoveConfirmDialog}
        itemToRemove={itemToRemove}
        setItemToRemove={setItemToRemove}
        handleRemoveSingleFromPayment={handleRemoveSingleFromPayment}
      />
    </Box>
  );
};

export default PackageSelection;