import React, { useState, useEffect, useRef } from "react";
import {
  Dialog, DialogTitle, DialogContent, IconButton,
  Box, Typography, Chip, Divider, Table, TableHead,
  TableBody, TableRow, TableCell, TableContainer,
  Button, Checkbox, FormControlLabel,
  Snackbar, Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const UpgradeDialog = ({
  open,
  onClose,
  pkg,
  item,
  allPlans = [],
  leadsDropdownData = {},
  ficoInvestmentRanges = [],
  selectedStates,
  setSelectedStates,
  allStates = [],
  COLORS,
  TEXT_SIZES,
  INDIA_STATES = {},
  finalToken,
  getAlreadySelectedStatesInOtherRanges,
  getStatesToDisplay,
  handleSelectAll,
  handleClearAll, 
  currentRangeStates = [],
  setCurrentRangeStates,
  renderStatesByRegion,
  onUpgrade,
  onViewSummary,

  // ✅ Parent-owned state for the modal
  openStateModal,
  setOpenStateModal,
  currentEditingRange,
  setCurrentEditingRange,
  blockedStates,
  setBlockedStates,
  stateSelections,
  setStateSelections,
  allPlanStatesByRange = {},
  onSaveStates, // (stateArray) => void — parent updates its store
}) => {
  const [selectedLeads, setSelectedLeads] = useState({});
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const liveSelectionsRef = useRef({});

  // ============================================================
  // DERIVED VALUES
  // ============================================================
  const ownerPlanId = allPlans.find(
    (p) => p.planName?.toLowerCase() === (item?.packagesName || "").toLowerCase()
  )?._id;

  const existingRanges =
    item?.investmentranges?.map((r) => r.selectedPlanInvestmetrange).filter(Boolean) || [];
  const existingStateCounts = {};
  item?.investmentranges?.forEach((r) => {
    existingStateCounts[r.selectedPlanInvestmetrange] = (r.selectedPlanStateAndDistrict || []).length;
  });

  // ============================================================
  // INTERNAL STATE
  // ============================================================
  const [checkedRanges, setCheckedRanges] = useState(() => {
    if (!item?.investmentranges?.length) return {};
    const initial = {};
    allPlans
      .filter((p) => p.packages?.length > 1 && p.planName?.toLowerCase() !== "free")
      .forEach((plan) => {
        initial[plan._id] = new Set(existingRanges);
      });
    return initial;
  });

  const [stateCounts, setStateCounts] = useState(() => {
    if (!item?.investmentranges?.length) return {};
    const initial = {};
    allPlans
      .filter((p) => p.packages?.length > 1 && p.planName?.toLowerCase() !== "free")
      .forEach((plan) => {
        item.investmentranges.forEach((r) => {
          const key = `${plan._id}_${r.selectedPlanInvestmetrange}`;
          initial[key] = (r.selectedPlanStateAndDistrict || []).length;
        });
      });
    return initial;
  });


useEffect(() => {
  if (!open || !item?._id) return;

  // Load saved state selections from localStorage
  const savedSelections = localStorage.getItem(`stateSelections_${item._id}`);
  if (savedSelections) {
    try {
      const parsed = JSON.parse(savedSelections);
      console.log("📦 Loading saved selections from localStorage:", parsed);
      
      // Update stateSelections with saved data
      setStateSelections((prev) => ({ ...prev, ...parsed }));
      
      // Update liveSelectionsRef
      liveSelectionsRef.current = { ...liveSelectionsRef.current, ...parsed };
      
      // Update stateCounts based on saved data
      const newCounts = {};
      Object.entries(parsed).forEach(([key, states]) => {
        newCounts[key] = states.length;
      });
      setStateCounts((prev) => ({ ...prev, ...newCounts }));
      
      // Auto-check ranges that have states selected
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
    } catch (e) {
      console.error("Error loading saved selections:", e);
    }
  }
}, [open, item?._id]);

  // ============================================================
  // EARLY RETURN
  // ============================================================
  const packageType = (pkg?.packagesType || "").toUpperCase();
  if (!open || packageType === "LISTING") return null;

  // ============================================================
  // HELPERS
  // ============================================================
  const normalizeRange = (value) =>
    String(value || "")
      .toLowerCase()
      .replace(/₹/g, "rs")
      .replace(/\brupees\b/g, "rs")
      .replace(/\brs\.?\b/g, "")
      .replace(/\blakhs\b/g, "lakh")
      .replace(/\bcrores\b/g, "crore")
      .replace(/\bto\b/g, "-")
      .replace(/[^a-z0-9]/g, "")
      .trim();

  const isFicoInvestmentRange = (range) => {
    const currentRange = normalizeRange(range);
    return ficoInvestmentRanges.some(
      (ficoRange) => normalizeRange(ficoRange) === currentRange
    );
  };

  const clickedRangeLabel = item?.investmetRageLabel || "";

  // ============================================================
  // BUILD ROWS
  // ============================================================
  const plans = allPlans.filter(
    (p) => p.packages?.length > 1 && p.planName?.toLowerCase() !== "free"
  );

  const rows = plans.map((plan) => {
    const matchedPkg =
      plan.packages.find((p) => p.investmentRangeLabel === clickedRangeLabel) ||
      plan.packages[0];

    const pkgObj = matchedPkg;
    const rangeLabel = pkgObj?.investmentRangeLabel || "—";
    const validityDays = pkgObj?.validityDays || "—";
    const pricePerState = pkgObj?.amount || 0;

    let investmentRanges = pkgObj?.investmentRange || [];
    if (ficoInvestmentRanges.length > 0) {
      investmentRanges = investmentRanges.filter((range) => isFicoInvestmentRange(range));
    }

    const leadOptions =
      leadsDropdownData[`${plan._id}_${rangeLabel}`] ||
      (pkgObj?.totalLeads
        ? Array.isArray(pkgObj.totalLeads)
          ? pkgObj.totalLeads
          : [pkgObj.totalLeads]
        : [20, 40, 60]);

    const currentLead = selectedLeads[plan._id] ?? leadOptions[0] ?? 20;
    const checked = checkedRanges[plan._id] || new Set();

    const allSelectedStates = new Set();
    [...checked].forEach((r) => {
      const key = `${plan._id}_${r}`;
      let states = stateSelections[key];
      if (!states) {
        const matchingRange = item?.investmentranges?.find(
          (ir) => ir.selectedPlanInvestmetrange === r
        );
        states = (matchingRange?.selectedPlanStateAndDistrict || []).map((s) =>
          typeof s === "object" ? s.state : s
        ).filter(Boolean);
      }
      states.forEach((s) => allSelectedStates.add(s));
    });

    const totalStates = allSelectedStates.size;
    const minLeads = leadOptions.length > 0 ? Math.min(...leadOptions) : 1;
    const divisor = minLeads > 0 ? minLeads : 1;

    return {
      id: plan._id,
      planName: plan.planName,
      validityDays,
      pricePerState,
      leadOptions,
      currentLead,
      investmentRanges,
      rangeLabel,
      checked,
      totalStates,
      totalLeads: currentLead * totalStates,
      totalAmount: (pricePerState / divisor) * totalStates * currentLead,
    };
  });

  const defaultPlanId = rows.find(
    (r) => r.planName?.toLowerCase() === (item?.packagesName || "").toLowerCase()
  )?.id ?? rows[0]?.id;

  const activePlanId = selectedPlanId ?? defaultPlanId;
  const activePlan = rows.find((r) => r.id === activePlanId) ?? rows[0];

  const setLead = (planId, val) =>
    setSelectedLeads((p) => ({ ...p, [planId]: val }));

  const toggleRange = (planId, range) =>
    setCheckedRanges((p) => {
      const s = new Set(p[planId] || []);
      s.has(range) ? s.delete(range) : s.add(range);
      return { ...p, [planId]: s };
    });

  // ============================================================
  // ✅ EDIT STATES — Uses PARENT'S data to compute blocked
  // ============================================================
const editStates = (planId, range) => {
  setCurrentEditingRange({ planId, range });

  const key = `${planId}_${range}`;
  const sessionStates = stateSelections?.[key];

  const matchingRange = item?.investmentranges?.find(
    (ir) => ir.selectedPlanInvestmetrange === range
  );
  const existingStates = (matchingRange?.selectedPlanStateAndDistrict || [])
    .map((s) => (typeof s === "object" ? s.state : s))
    .filter((s) => s?.trim());

  const statesToPreselect = sessionStates?.length ? sessionStates : existingStates;

  const rangeSpecificStates = Object.values(allPlanStatesByRange?.[range] || {})
    .flat()
    .filter((s, i, arr) => arr.indexOf(s) === i);

  const statesPool = rangeSpecificStates.length > 0 ? rangeSpecificStates : (allStates ?? []);

  setCurrentRangeStates(statesPool);
  setBlockedStates(new Set()); // ✅ No blocked states — empty set
  setSelectedStates(new Set(statesToPreselect));
  setOpenStateModal(true);
};
  // ============================================================
  // ✅ SAVE STATES — Persists to BOTH local state and parent
  // ============================================================
// ✅ FIXED: handleSaveStatesFromModal in UpgradeDialog.js
const handleSaveStatesFromModal = () => {
  if (!currentEditingRange) return;

  const stateArray = Array.from(selectedStates); // ✅ This is already an array
  const { planId, range } = currentEditingRange;
  const key = `${planId}_${range}`;

  // 1) Update live ref so other plans see latest edits immediately
  liveSelectionsRef.current = { ...liveSelectionsRef.current, [key]: stateArray };

  // 2) Update internal state
  setStateSelections((prev) => {
    const updated = { ...prev, [key]: stateArray };
    try {
      localStorage.setItem(`stateSelections_${item?._id}`, JSON.stringify(updated));
    } catch (e) {}
    return updated;
  });

  // 3) Update count
  setStateCounts((prev) => ({ ...prev, [key]: stateArray.length }));

  // 4) Auto-check the range
  setCheckedRanges((p) => {
    const s = new Set(p[planId] || []);
    s.add(range);
    return { ...p, [planId]: s };
  });

  // 5) Notify parent (so parent can persist to its store)
  // ✅ FIX: Pass the array directly, not inside an object
  onSaveStates(stateArray); // Changed from { planId, range, states: stateArray }

  // 6) Close modal
  setOpenStateModal(false);
  setCurrentEditingRange(null);
};

const buildStatesByRange = (planId, checkedRanges) => {
    const result = {};
    [...checkedRanges].forEach((range) => {
      const key = `${planId}_${range}`;
      const states =
        stateSelections[key] ??
        liveSelectionsRef.current[key] ??
        (item?.investmentranges?.find((ir) => ir.selectedPlanInvestmetrange === range)
          ?.selectedPlanStateAndDistrict || [])
          .map((s) => (typeof s === "object" ? s.state : s))
          .filter(Boolean);
      result[range] = states;
    });
    return result;
  };


  // ============================================================
  // STYLES
  // ============================================================
  const orangeHeaderSx = {
    fontWeight: 700, fontSize: "0.7rem", color: "#fff", py: 1.5,
    textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.5,
    verticalAlign: "top",
    background: "linear-gradient(135deg, #fb8c00 0%, #ef6c00 100%)",
    borderRight: "1px solid rgba(255,255,255,0.25)",
  };

  const greenHeaderSx = {
    ...orangeHeaderSx,
    background: "linear-gradient(135deg, #4cb04f 0%, #2e7d32 100%)",
  };



  // ============================================================
  // RENDER
  // ============================================================
  return (
    <>
      {/* MAIN UPGRADE DIALOG */}
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
      >
        <DialogTitle
          sx={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            pb: 1.5, backgroundColor: "#dbeafe", borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Box>
            <Typography fontWeight={700} fontSize="1rem" color="#111">
              Upgrade Lead Package
            </Typography>
            <Typography fontSize="0.7rem" color="#757575">
              {clickedRangeLabel && `Investment Range Label: ${clickedRangeLabel} · `}
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" sx={{ color: "#9e9e9e" }} />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2, pb: 1, overflowX: "hidden" }}>
          <TableContainer sx={{ borderRadius: 2, border: "1px solid #e0e0e0" }}>
            <Table size="small" sx={{ tableLayout: "fixed", width: "100%", minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...orangeHeaderSx, width: "16%" }}>{"Select\nPlan"}</TableCell>
                  <TableCell sx={{ ...orangeHeaderSx, width: "18%" }}>
                    <Typography fontSize="0.7rem" fontWeight={700} color="#fff" mb={0.75}>
                      Select Lead Per State
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ ...orangeHeaderSx, width: "24%" }}>{"Select Investment\nRange"}</TableCell>
                  <TableCell sx={{ ...greenHeaderSx, width: "10%" }}>{"Price per\nState"}</TableCell>
                  <TableCell sx={{ ...greenHeaderSx, width: "9%" }}>{"Total\nLeads"}</TableCell>
                  <TableCell sx={{ ...greenHeaderSx, width: "10%" }}>{"Total\nAmount"}</TableCell>
                  <TableCell sx={{ ...greenHeaderSx, width: "12%" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody key={activePlanId}>
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: "center", py: 4, color: "#9e9e9e" }}>
                      No lead upgrade plans available.
                    </TableCell>
                  </TableRow>
                )}

           {rows.map((row, index) => {
  const isActive = row.id === activePlanId;
  const isFirstRow = index === 0; // ✅ shared columns always on row 0

  return (
    <TableRow key={row.id} sx={{ verticalAlign: "middle" }}>
      {/* Select Plan Button — always shown */}
      <TableCell sx={{ px: 1, py: 1.5, textAlign: "center", backgroundColor: "#fff3e0", borderRight: "1px solid #e0e0e0" }}>
        <Button
          variant="contained"
          size="small"
          onClick={() => setSelectedPlanId(row.id)}
          sx={{
            minWidth: 90, fontWeight: 700, fontSize: "0.75rem",
            textTransform: "none", borderRadius: 2,
            flexDirection: "column", lineHeight: 1.4,
            backgroundColor: isActive ? "#e65100" : "#fb8c00",
            color: "#fff",
            outline: isActive ? "2px solid #111" : "none",
            outlineOffset: 2,
            "&:hover": { backgroundColor: "#e65100" },
          }}
        >
           <Typography fontSize="0.8rem" fontWeight={1000} color="#fff" lineHeight={1.3}>
            {row.validityDays} Days
          </Typography>
          <Typography fontSize="0.75rem" fontWeight={700} color="#fff" lineHeight={1.3}>
            {row.planName}
          </Typography>
         
        </Button>
      </TableCell>

      {/* ✅ Shared columns — always on first row, always show activePlan's data */}
      {isFirstRow && (
        <>
          <TableCell
            rowSpan={rows.length}
            sx={{ px: 1, py: 1.5, textAlign: "center", backgroundColor: "#fff8f0", borderRight: "1px solid #e0e0e0", verticalAlign: "middle" }}
          >
            {activePlan && (
              <>
                <Typography fontSize="0.7rem" color="#1565c0" fontWeight={600} mb={0.5}>
                  {activePlan.rangeLabel}
                </Typography>
                <Box sx={{ display: "flex", gap: 0.75, justifyContent: "center", flexWrap: "wrap" }}>
                  {activePlan.leadOptions.map((lead) => {
                    const active = (selectedLeads[activePlan.id] ?? activePlan.leadOptions[0]) === lead;
                    return (
                      <Chip
                        key={lead} label={lead} size="small"
                        onClick={() => setLead(activePlan.id, lead)}
                        sx={{
                          height: 26, minWidth: 34, fontWeight: 700,
                          fontSize: "0.75rem", cursor: "pointer",
                          backgroundColor: active ? "#4caf50" : "#fff",
                          color: active ? "#fff" : "#111",
                          border: `1px solid ${active ? "#4caf50" : "#bdbdbd"}`,
                          "&:hover": { backgroundColor: active ? "#388e3c" : "#f5f5f5" },
                        }}
                      />
                    );
                  })}
                </Box>
              </>
            )}
          </TableCell>

          <TableCell
            rowSpan={rows.length}
            sx={{ px: 1.5, py: 1, backgroundColor: "#fff8f0", borderRight: "1px solid #e0e0e0", verticalAlign: "middle" }}
          >
            {activePlan && (activePlan.investmentRanges.length === 0 ? (
              <Typography fontSize="0.7rem" color="#9e9e9e" textAlign="center">
                No matching investment ranges
              </Typography>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
                {activePlan.investmentRanges.map((range) => {
                  const isChecked = (checkedRanges[activePlan.id] || new Set()).has(range);
                  const stateVal =
                    stateCounts[`${activePlan.id}_${range}`] ??
                    stateSelections[`${activePlan.id}_${range}`]?.length ??
                    (item?.investmentranges?.find((ir) => ir.selectedPlanInvestmetrange === range)
                      ?.selectedPlanStateAndDistrict?.length ?? 0);
                  return (
                    <Box key={range} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Checkbox
                        size="small" checked={isChecked}
                        onChange={() => toggleRange(activePlan.id, range)}
                        sx={{ p: 0.25, color: "#fb8c00", "&.Mui-checked": { color: "#fb8c00" } }}
                      />
                      <Typography fontSize="0.7rem" color="#111" flex={1} noWrap>
                        {range}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, ml: 0.5 }}>
                        <Typography fontSize="0.75rem" fontWeight={700} color="#111">
                          {stateVal}
                        </Typography>
                        <EditIcon
                          sx={{ fontSize: 11, color: "#e65100", cursor: "pointer" }}
                          onClick={() => editStates(activePlan.id, range)}
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            ))}
          </TableCell>

          <TableCell rowSpan={rows.length} sx={{ px: 1, py: 1.5, textAlign: "center", backgroundColor: "#f1f8e9", borderRight: "1px solid #e0e0e0", verticalAlign: "middle" }}>
            <Typography fontSize="1.1rem" fontWeight={700} color="#111">
              ₹{activePlan?.pricePerState.toLocaleString("en-IN")}
            </Typography>
          </TableCell>

          <TableCell rowSpan={rows.length} sx={{ px: 1, py: 1.5, textAlign: "center", backgroundColor: "#f1f8e9", borderRight: "1px solid #e0e0e0", verticalAlign: "middle" }}>
            <Typography fontSize="1.1rem" fontWeight={700} color="#111">
              {activePlan?.totalLeads.toLocaleString("en-IN")}
            </Typography>
          </TableCell>

          <TableCell rowSpan={rows.length} sx={{ px: 1, py: 1.5, textAlign: "center", backgroundColor: "#f1f8e9", borderRight: "1px solid #e0e0e0", verticalAlign: "middle" }}>
            <Typography fontSize="1.1rem" fontWeight={700} color="#111">
              ₹{activePlan?.totalAmount.toLocaleString("en-IN")}
            </Typography>
          </TableCell>

          <TableCell rowSpan={rows.length} sx={{ px: 1, py: 1.5, textAlign: "center", backgroundColor: "#f1f8e9", verticalAlign: "middle" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, alignItems: "center" }}>
        <Button
  variant="contained" size="small"
  onClick={() => {
    const checkedRangesList = [...activePlan.checked];

    if (checkedRangesList.length === 0) {
      setSnackbar({ open: true, message: "Please select at least one investment range." });
      return;
    }

    const missingStates = checkedRangesList.filter((range) => {
      const key = `${activePlan.id}_${range}`;
      const states =
        stateSelections[key] ??
        liveSelectionsRef.current[key] ??
        (item?.investmentranges?.find((ir) => ir.selectedPlanInvestmetrange === range)
          ?.selectedPlanStateAndDistrict || []);
      return !states || states.length === 0;
    });

    if (missingStates.length > 0) {
      setSnackbar({
        open: true,
        message: `Please select states for: ${missingStates.join(", ")}`,
      });
      return;
    }

    onUpgrade?.({
      planId: activePlan.id,
      planName: activePlan.planName,
      leads: activePlan.currentLead,
      checkedRanges: checkedRangesList,
      statesByRange: buildStatesByRange(activePlan.id, activePlan.checked),
      totalLeads: activePlan.totalLeads,
      totalAmount: activePlan.totalAmount,
      pricePerState: activePlan.pricePerState,
      validityDays: activePlan.validityDays,
      investmentRangeLabel: activePlan.rangeLabel,
      rangeLabel: activePlan.rangeLabel,
    });
  }}
  sx={{
    minWidth: 78, fontWeight: 700, fontSize: "0.7rem",
    textTransform: "none", borderRadius: 2, lineHeight: 1.4,
    backgroundColor: "#fb8c00", color: "#fff",
    "&:hover": { backgroundColor: "#e65100" },
  }}
>Add to<br />Plan</Button>
              {/* <Button
                variant="contained" size="small"
                onClick={() => onViewSummary?.({
                  planId: activePlan.id,
                  planName: activePlan.planName,
                  leads: activePlan.currentLead,
                  checkedRanges: [...activePlan.checked],
                  statesByRange: buildStatesByRange(activePlan.id, activePlan.checked), 
                  totalLeads: activePlan.totalLeads,
                  totalAmount: activePlan.totalAmount,
                  pricePerState: activePlan.pricePerState,
                  validityDays: activePlan.validityDays,
                  investmentRangeLabel: activePlan.rangeLabel,
                  rangeLabel: activePlan.rangeLabel,
                })}
                sx={{
                  minWidth: 78, fontWeight: 700, fontSize: "0.7rem",
                  textTransform: "none", borderRadius: 2, lineHeight: 1.4,
                  backgroundColor: "#4caf50", color: "#fff",
                  "&:hover": { backgroundColor: "#388e3c" },
                }}
              >View<br />Summary</Button> */}
            </Box>
          </TableCell>
        </>
      )}
    </TableRow>
  );
})}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

 
{/* STATE SELECTION MODAL */}
<Dialog
  open={openStateModal}
  onClose={() => setOpenStateModal(false)}
  maxWidth="md"
  fullWidth
  PaperProps={{ sx: { borderRadius: 3, maxHeight: "90vh", overflow: "hidden" } }}
>
  <DialogTitle
    sx={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      pb: 1, backgroundColor: COLORS.grey[50], borderBottom: `1px solid ${COLORS.border}`,
    }}
  >
    <Typography fontWeight={700} fontSize={TEXT_SIZES.medium} color={COLORS.black}>
      Select States for {currentEditingRange?.range}
    </Typography>
    <IconButton size="small" onClick={() => setOpenStateModal(false)}>
      <CloseIcon fontSize="small" sx={{ color: COLORS.grey[500] }} />
    </IconButton>
  </DialogTitle>

  {/* Scrollable state list */}
  <DialogContent sx={{ pt: 2, pb: 1, maxHeight: "70vh", overflow: "auto" }}>
    {/* Select All / Clear All buttons */}
    <Box sx={{ mb: 2, display: "flex", gap: 1, justifyContent: "flex-end" }}>
      <Button
        size="small" variant="outlined"
        onClick={() => {
          const selectable = (currentRangeStates ?? []).filter(s => !blockedStates.has(s));
          setSelectedStates(new Set(selectable));
        }}
      >
        Select All ({(currentRangeStates ?? []).filter(s => !blockedStates.has(s)).length})
      </Button>
      <Button
        size="small" variant="outlined"
        onClick={() => setSelectedStates(new Set())}
        sx={{ color: COLORS.grey[600] }}
      >
        Clear All
      </Button>
    </Box>

    {/* State checkboxes */}
    {(() => {
      const pool = currentRangeStates ?? [];
      if (pool.length === 0) {
        return (
          <Typography color="text.secondary" textAlign="center" py={4}>
            No states available for this range.
          </Typography>
        );
      }
      return (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1, p: 1 }}>
         {pool.map((state) => {
  const isSelected = selectedStates.has(state);
  return (
    <FormControlLabel
      key={state}
      control={
        <Checkbox
          checked={isSelected}
          onChange={(e) => {
            const ns = new Set(selectedStates);
            e.target.checked ? ns.add(state) : ns.delete(state);
            setSelectedStates(ns);
          }}
          size="small"
          sx={{ color: COLORS.primary, "&.Mui-checked": { color: COLORS.secondary } }}
        />
      }
      label={
        <Typography fontSize={TEXT_SIZES.small} color={COLORS.black}>
          {state}
        </Typography>
      }
    />
  );
})}
        </Box>
      );
    })()}
  </DialogContent>

  {/* Save button footer */}
  <DialogContent
    sx={{
      px: 2, pb: 2, borderTop: `1px solid ${COLORS.border}`,
      backgroundColor: COLORS.grey[50],
    }}
  >
    <Button
      variant="contained" size="small" color="primary"
      onClick={handleSaveStatesFromModal}
      sx={{ minWidth: 120 }}
    >
      Save States
    </Button>
  </DialogContent>
</Dialog>

{/* ✅ Validation Snackbar */}
<Snackbar
  open={snackbar.open}
  autoHideDuration={4000}
  onClose={() => setSnackbar({ open: false, message: "" })}
  anchorOrigin={{ vertical: "top", horizontal: "center" }}
>
  <Alert
    onClose={() => setSnackbar({ open: false, message: "" })}
    severity="warning"
    variant="filled"
    sx={{
      fontWeight: 600,
      fontSize: "0.85rem",
      borderRadius: 2,
      backgroundColor: "#fb8c00",
      color: "#fff",
      "& .MuiAlert-icon": { color: "#fff" },
      "& .MuiAlert-action .MuiIconButton-root": { color: "#fff" },
    }}
  >
    {snackbar.message}
  </Alert>
</Snackbar>
    </>
  );
};

export default UpgradeDialog;