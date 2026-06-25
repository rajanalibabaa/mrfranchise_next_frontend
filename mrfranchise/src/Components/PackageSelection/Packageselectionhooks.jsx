import { useRouter } from "next/navigation";
import usePackageData from "./Usepackagedata";
import usePackageActions from "./Usepackageactions";

/**
 * Composes usePackageData + usePackageActions into the same public API that
 * existed before the split, so call sites need no changes.
 */
const usePackageSelection = (onAddInvestmentRange) => {
  const router = useRouter();
  const dataHook = usePackageData();
  const actions = usePackageActions(dataHook, onAddInvestmentRange);

  return {
    // refs
    paymentSummaryRef: dataHook.paymentSummaryRef,
    upgradeSectionRef: dataHook.upgradeSectionRef,
    router,
    // state
    paymentSummary: dataHook.paymentSummary,
    setPaymentSummary: dataHook.setPaymentSummary,
    plans: dataHook.plans,
    loading: dataHook.loading,
    error: dataHook.error,
    selected: dataHook.selected,
    setSelected: dataHook.setSelected,
    ficoInvestmentRanges: dataHook.ficoInvestmentRanges,
    detectedState: dataHook.detectedState,
    openStateModal: dataHook.openStateModal,
    allStates: dataHook.allStates,
    selectedStates: dataHook.selectedStates,
    setSelectedStates: dataHook.setSelectedStates,
    statesByInvestmentRange: dataHook.statesByInvestmentRange,
    currentEditingRange: dataHook.currentEditingRange,
    isUpgradeMode: dataHook.isUpgradeMode,
    setIsUpgradeMode: dataHook.setIsUpgradeMode,
    upgradePlanId: dataHook.upgradePlanId,
    setUpgradePlanId: dataHook.setUpgradePlanId,
    showLogin: dataHook.showLogin,
    setShowLogin: dataHook.setShowLogin,
    openSection: dataHook.openSection,
    snack: dataHook.snack,
    leadsDropdownData: dataHook.leadsDropdownData,
    selectedLeadsPerRange: dataHook.selectedLeadsPerRange,
    selectedListingPlanId: dataHook.selectedListingPlanId,
    movedGroupKeys: dataHook.movedGroupKeys,
    setMovedGroupKeys: dataHook.setMovedGroupKeys,
    selectedGroup: dataHook.selectedGroup,
    setSelectedGroup: dataHook.setSelectedGroup,
    selectedValidityDays: dataHook.selectedValidityDays,
    checkedItems: dataHook.checkedItems,
    setCheckedItems: dataHook.setCheckedItems,
    openConfirmDialog: dataHook.openConfirmDialog,
    setOpenConfirmDialog: dataHook.setOpenConfirmDialog,
    pendingSelection: dataHook.pendingSelection,
    setPendingSelection: dataHook.setPendingSelection,
    expandedRegion: dataHook.expandedRegion,
    setExpandedRegion: dataHook.setExpandedRegion,
    openStatesTooltip: dataHook.openStatesTooltip,
    setOpenStatesTooltip: dataHook.setOpenStatesTooltip,
    tooltipStates: dataHook.tooltipStates,
    openRemoveConfirmDialog: dataHook.openRemoveConfirmDialog,
    setOpenRemoveConfirmDialog: dataHook.setOpenRemoveConfirmDialog,
    itemToRemove: dataHook.itemToRemove,
    setItemToRemove: dataHook.setItemToRemove,
    data: dataHook.data,
    loadings: dataHook.loadings,
    errors: dataHook.errors,
    finalToken: dataHook.finalToken,
    finalBrandUUID: dataHook.finalBrandUUID,
    filteredPlans: dataHook.filteredPlans,
    // shared helpers from data hook
    getRangeKey: dataHook.getRangeKey,
    getStatesToDisplay: dataHook.getStatesToDisplay,
    getStateCountForRange: dataHook.getStateCountForRange,
    getRowBackgroundColor: dataHook.getRowBackgroundColor,
    isFicoInvestmentRange: dataHook.isFicoInvestmentRange,
    getBrandName: dataHook.getBrandName,
    getCategory: dataHook.getCategory,
    getIndustry: dataHook.getIndustry,
    // action handlers
    scrollToPaymentSummary: actions.scrollToPaymentSummary,
    openSnack: actions.openSnack,
    closeSnack: actions.closeSnack,
    handleSectionChange: actions.handleSectionChange,
    handleOpenStateModal: actions.handleOpenStateModal,
    handleShowStates: actions.handleShowStates,
    handleCloseStateModal: actions.handleCloseStateModal,
    getAlreadySelectedStatesInOtherRanges: actions.getAlreadySelectedStatesInOtherRanges,
    handleSaveStates: actions.handleSaveStates,
    handleAddSingleToPayment: actions.handleAddSingleToPayment,
    handleRemoveSingleFromPayment: actions.handleRemoveSingleFromPayment,
    handleProceedToPayment: actions.handleProceedToPayment,
    handleAddInvestmentRange: actions.handleAddInvestmentRange,
    handleLeadsChange: actions.handleLeadsChange,
    handleRemoveListingPlan: actions.handleRemoveListingPlan,
    handleSelectAll: actions.handleSelectAll,
    handleClearAll: actions.handleClearAll,
    handleStateCheckboxChange: actions.handleStateCheckboxChange,
  };
};

export default usePackageSelection;