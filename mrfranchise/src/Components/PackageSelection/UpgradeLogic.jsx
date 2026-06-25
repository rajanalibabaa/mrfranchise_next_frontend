import { useState, useEffect, useRef, useCallback } from "react";

export const useUpgradeLogic = ({
  open, item, allPlans, leadsDropdownData, ficoInvestmentRanges,
  stateSelections, setStateSelections, onUpgrade, onViewSummary,
  scrollToPaymentSummary, onClose, setOpenStateModal,
  setCurrentEditingRange, setCurrentRangeStates, setBlockedStates,
  setSelectedStates, allPlanStatesByRange, onSaveStates,
}) => {
  const [selectedLeads, setSelectedLeads] = useState({});
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const liveSelectionsRef = useRef({});
  
  // Use refs to track parent state values
  const currentEditingRangeRef = useRef(null);
  const selectedStatesRef = useRef(new Set());

  const normalizeRange = useCallback((value) =>
    String(value || "").toLowerCase()
      .replace(/₹/g, "rs").replace(/\brupees\b/g, "rs")
      .replace(/\brs\.?\b/g, "").replace(/\blakhs\b/g, "lakh")
      .replace(/\bcrores\b/g, "crore").replace(/\bto\b/g, "-")
      .replace(/[^a-z0-9]/g, "").trim(),
  []);

  const isFicoInvestmentRange = useCallback(
    (range) => ficoInvestmentRanges.some((f) => normalizeRange(f) === normalizeRange(range)),
    [ficoInvestmentRanges, normalizeRange]
  );

  const clickedRangeLabel = item?.investmetRageLabel || "";
  const existingRanges = item?.investmentranges?.map((r) => r.selectedPlanInvestmetrange).filter(Boolean) || [];

  const [checkedRanges, setCheckedRanges] = useState(() => {
    if (!item?.investmentranges?.length) return {};
    const initial = {};
    allPlans.filter((p) => p.packages?.length > 1 && p.planName?.toLowerCase() !== "free")
      .forEach((plan) => { initial[plan._id] = new Set(existingRanges); });
    return initial;
  });

  const [stateCounts, setStateCounts] = useState(() => {
    if (!item?.investmentranges?.length) return {};
    const initial = {};
    allPlans.filter((p) => p.packages?.length > 1 && p.planName?.toLowerCase() !== "free")
      .forEach((plan) => {
        item.investmentranges.forEach((r) => {
          const key = `${plan._id}_${r.selectedPlanInvestmetrange}`;
          initial[key] = (r.selectedPlanStateAndDistrict || []).length;
        });
      });
    return initial;
  });

  // Load saved state selections from localStorage
  useEffect(() => {
    if (!open || !item?._id) return;
    const savedSelections = localStorage.getItem(`stateSelections_${item._id}`);
    if (savedSelections) {
      try {
        const parsed = JSON.parse(savedSelections);
        setStateSelections((prev) => ({ ...prev, ...parsed }));
        liveSelectionsRef.current = { ...liveSelectionsRef.current, ...parsed };
        const newCounts = {};
        Object.entries(parsed).forEach(([key, states]) => { newCounts[key] = states.length; });
        setStateCounts((prev) => ({ ...prev, ...newCounts }));
        setCheckedRanges((prev) => {
          const updated = { ...prev };
          Object.entries(parsed).forEach(([key, states]) => {
            if (states.length > 0) {
              const [planId, range] = key.split("_");
              if (planId && range) {
                if (!updated[planId]) updated[planId] = new Set();
                updated[planId].add(range);
              }
            }
          });
          return updated;
        });
      } catch (e) { console.error("Error loading state selections:", e); }
    }
  }, [open, item?._id, setStateSelections, setStateCounts]);

  // Build rows data
  const plans = allPlans.filter((p) => p.packages?.length > 1 && p.planName?.toLowerCase() !== "free");

  const rows = plans.map((plan) => {
    const matchedPkg = plan.packages.find((p) => p.investmentRangeLabel === clickedRangeLabel) || plan.packages[0];
    const pkgObj = matchedPkg;
    const rangeLabel = pkgObj?.investmentRangeLabel || "—";
    const validityDays = pkgObj?.validityDays || "—";
    const pricePerState = pkgObj?.amount || 0;
    let investmentRanges = pkgObj?.investmentRange || [];
    if (ficoInvestmentRanges.length > 0) investmentRanges = investmentRanges.filter(isFicoInvestmentRange);

    const leadOptions = leadsDropdownData[`${plan._id}_${rangeLabel}`] ||
      (pkgObj?.totalLeads ? (Array.isArray(pkgObj.totalLeads) ? pkgObj.totalLeads : [pkgObj.totalLeads]) : [20, 40, 60]);

    const currentLead = selectedLeads[plan._id] ?? leadOptions[0] ?? 20;
    const checked = checkedRanges[plan._id] || new Set();
    const checkedRangesList = [...checked];
    const allSelectedStates = new Set();

    checkedRangesList.forEach((range) => {
      const key = `${plan._id}_${range}`;
      const states = (liveSelectionsRef.current[key] || stateSelections[key] ||
        (item?.investmentranges?.find((ir) => ir.selectedPlanInvestmetrange === range)
          ?.selectedPlanStateAndDistrict || []))
        .map((s) => typeof s === "object" ? s.state : s).filter(Boolean);
      (states || []).forEach((s) => allSelectedStates.add(s));
    });

    const totalStates = allSelectedStates.size;
    const minLeads = leadOptions.length > 0 ? Math.min(...leadOptions) : 1;
    const divisor = minLeads > 0 ? minLeads : 1;

    return {
      id: plan._id, planName: plan.planName, validityDays,
      pricePerState, leadOptions, currentLead, investmentRanges,
      rangeLabel, checked, totalStates,
      totalLeads: currentLead * totalStates,
      totalAmount: (pricePerState / divisor) * totalStates * currentLead,
    };
  });

  const defaultPlanId = rows.find((r) => r.planName?.toLowerCase() === (item?.packagesName || "").toLowerCase())?.id ?? rows[0]?.id;
  const activePlanId = selectedPlanId ?? defaultPlanId;
  const activePlan = rows.find((r) => r.id === activePlanId) ?? rows[0];

  const setLead = useCallback((planId, val) => setSelectedLeads((p) => ({ ...p, [planId]: val })), []);

  const toggleRange = useCallback((planId, range) =>
    setCheckedRanges((p) => {
      const s = new Set(p[planId] || []);
      s.has(range) ? s.delete(range) : s.add(range);
      return { ...p, [planId]: s };
    }), []);

  const editStates = useCallback((planId, range) => {
    const editingRange = { planId, range };
    currentEditingRangeRef.current = editingRange;
    setCurrentEditingRange(editingRange);
    
    const key = `${planId}_${range}`;
    const sessionStates = stateSelections?.[key];
    const matchingRange = item?.investmentranges?.find((ir) => ir.selectedPlanInvestmetrange === range);
    const existingStates = (matchingRange?.selectedPlanStateAndDistrict || [])
      .map((s) => (typeof s === "object" ? s.state : s)).filter((s) => s?.trim());
    const statesToPreselect = sessionStates?.length ? sessionStates : existingStates;
    const rangeSpecificStates = Object.values(allPlanStatesByRange?.[range] || {})
      .flat().filter((s, i, arr) => arr.indexOf(s) === i);
    const statesPool = rangeSpecificStates.length > 0 ? rangeSpecificStates : [];
    setCurrentRangeStates(statesPool);
    setBlockedStates(new Set());
    
    const selectedSet = new Set(statesToPreselect);
    selectedStatesRef.current = selectedSet;
    setSelectedStates(selectedSet);
    setOpenStateModal(true);
  }, [item, stateSelections, allPlanStatesByRange, setCurrentEditingRange, setCurrentRangeStates, setBlockedStates, setSelectedStates, setOpenStateModal]);

  const handleSaveStatesFromModal = useCallback(() => {
    const editingRange = currentEditingRangeRef.current;
    if (!editingRange) return;
    
    const stateArray = Array.from(selectedStatesRef.current);
    const { planId, range } = editingRange;
    const key = `${planId}_${range}`;
    liveSelectionsRef.current = { ...liveSelectionsRef.current, [key]: stateArray };
    setStateSelections((prev) => {
      const updated = { ...prev, [key]: stateArray };
      try { localStorage.setItem(`stateSelections_${item?._id}`, JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
    setStateCounts((prev) => ({ ...prev, [key]: stateArray.length }));
    setCheckedRanges((p) => {
      const s = new Set(p[planId] || []);
      s.add(range);
      return { ...p, [planId]: s };
    });
    if (onSaveStates) {
      onSaveStates(stateArray);
    }
    setOpenStateModal(false);
    setCurrentEditingRange(null);
    currentEditingRangeRef.current = null;
  }, [item?._id, setStateSelections, setStateCounts, onSaveStates, setOpenStateModal, setCurrentEditingRange]);

  const buildStatesByRange = useCallback((planId, checkedRangesSet) => {
    const result = {};
    [...checkedRangesSet].forEach((range) => {
      const key = `${planId}_${range}`;
      const states = (stateSelections[key] || liveSelectionsRef.current[key] ||
        (item?.investmentranges?.find((ir) => ir.selectedPlanInvestmetrange === range)
          ?.selectedPlanStateAndDistrict || []))
        .map((s) => (typeof s === "object" ? s.state : s)).filter(Boolean);
      result[range] = states;
    });
    return result;
  }, [stateSelections, item]);

  const handleAddToPlan = useCallback(() => {
    const currentPlanId = activePlanId || defaultPlanId;
    const planRow = rows.find((r) => r.id === currentPlanId);
    if (!planRow) return;

    const currentLead = selectedLeads[currentPlanId] ?? planRow.leadOptions[0] ?? 20;
    const minLead = planRow.leadOptions.length > 0 ? Math.min(...planRow.leadOptions) : 1;
    const currentCheckedRanges = checkedRanges[currentPlanId] || new Set();
    const checkedRangesList = [...currentCheckedRanges];
    const allSelectedStates = new Set();

    checkedRangesList.forEach((range) => {
      const key = `${currentPlanId}_${range}`;
      const states = (liveSelectionsRef.current[key] || stateSelections[key] ||
        (item?.investmentranges?.find((ir) => ir.selectedPlanInvestmetrange === range)
          ?.selectedPlanStateAndDistrict || []))
        .map((s) => typeof s === "object" ? s.state : s).filter(Boolean);
      (states || []).forEach((s) => allSelectedStates.add(s));
    });

    const totalStates = allSelectedStates.size;
    
    const missingStates = checkedRangesList.filter((range) => {
      const key = `${currentPlanId}_${range}`;
      const states = (stateSelections[key] || liveSelectionsRef.current[key]) ||
        (item?.investmentranges?.find((ir) => ir.selectedPlanInvestmetrange === range)
          ?.selectedPlanStateAndDistrict || []);
      return !states || states.length === 0;
    });

    if (missingStates.length > 0) {
      setSnackbar({ open: true, message: `Please select states for: ${missingStates.join(", ")}` });
      return;
    }

    const totalLeads = currentLead * totalStates;
    const totalAmount = (planRow.pricePerState / minLead) * currentLead * totalStates;
    const statesByRange = {};

    checkedRangesList.forEach((range) => {
      const key = `${currentPlanId}_${range}`;
      const states = (liveSelectionsRef.current[key] || stateSelections[key] ||
        (item?.investmentranges?.find((ir) => ir.selectedPlanInvestmetrange === range)
          ?.selectedPlanStateAndDistrict || []))
        .map((s) => typeof s === "object" ? s.state : s).filter(Boolean);
      statesByRange[range] = states;
    });

    if (onUpgrade) {
      onUpgrade({
        planId: currentPlanId, planName: planRow.planName,
        leads: currentLead, selectedLeads: currentLead,
        checkedRanges: checkedRangesList, statesByRange,
        totalLeads, totalAmount, amount: totalAmount,
        pricePerState: planRow.pricePerState, minLead,
        validityDays: planRow.validityDays,
        investmentRangeLabel: planRow.rangeLabel,
        rangeLabel: planRow.rangeLabel, totalStates,
      });
    }

    if (onClose) {
      onClose();
    }
    setTimeout(() => {
      if (scrollToPaymentSummary) {
        scrollToPaymentSummary();
      }
    }, 300);
  }, [activePlanId, defaultPlanId, rows, selectedLeads, checkedRanges, stateSelections, item, onUpgrade, onClose, scrollToPaymentSummary, setSnackbar]);

  return {
    selectedLeads, setSelectedLeads, selectedPlanId, setSelectedPlanId,
    snackbar, setSnackbar, checkedRanges, stateCounts, setStateCounts,
    liveSelectionsRef, rows, activePlanId, activePlan, setLead,
    toggleRange, editStates, handleSaveStatesFromModal,
    buildStatesByRange, handleAddToPlan, clickedRangeLabel,
  };
};