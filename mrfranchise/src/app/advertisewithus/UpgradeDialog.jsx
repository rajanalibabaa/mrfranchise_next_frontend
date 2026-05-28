import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, IconButton,
  Box, Typography, Chip, Divider, Table, TableHead,
  TableBody, TableRow, TableCell, TableContainer,
  Button, Checkbox, Accordion, AccordionSummary, AccordionDetails,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StateSelectionModal from "./StateSelectionModal";

const UpgradeDialog = ({
  open,
  onClose,
  pkg,
  item,
  allPlans = [],
  leadsDropdownData = {},
  onUpgrade,
  onViewSummary,
  ficoInvestmentRanges = [],
  openStateModal,
  onOpenStateModal,
  onCloseStateModal,
  selectedStates,
  setSelectedStates,
  allStates,
  COLORS,
  TEXT_SIZES,
  ALL_INDIA_STATES,
  INDIA_STATES = {},
  finalToken,
  getAlreadySelectedStatesInOtherRanges,
  getStatesToDisplay,
  handleSelectAll,
  handleClearAll,
  renderStatesByRegion,
  handleSaveStates,
  router,
}) => {
  const [selectedLeads, setSelectedLeads] = useState({});
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [currentEditingRange, setCurrentEditingRange] = useState(null);
const [stateSelections, setStateSelections] = useState(() => {
  if (!item?.investmentranges?.length) return {};
  const initial = {};
  allPlans
    .filter((p) => p.packages?.length > 1 && p.planName?.toLowerCase() !== "free")
    .forEach((plan) => {
      item.investmentranges.forEach((r) => {
        const key = `${plan._id}_${r.selectedPlanInvestmetrange}`;
        initial[key] = (r.selectedPlanStateAndDistrict || []).map((s) =>
          typeof s === "object" ? s.state : s
        );
      });
    });
  return initial;
});
  const existingRanges =
    item?.investmentranges?.map((r) => r.selectedPlanInvestmetrange).filter(Boolean) || [];
  const existingStateCounts = {};
  item?.investmentranges?.forEach((r) => {
    const stateCount = (r.selectedPlanStateAndDistrict || []).length || 27;
    existingStateCounts[r.selectedPlanInvestmetrange] = stateCount;
  });

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
          initial[key] = (r.selectedPlanStateAndDistrict || []).length || 27;
        });
      });
    return initial;
  });

  const packageType = (pkg?.packagesType || "").toUpperCase();
  if (!open || packageType === "LISTING") return null;

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
  // First check stateSelections, then fall back to item.investmentranges
  let states = stateSelections[key];
  if (!states) {
    const matchingRange = item?.investmentranges?.find(
      (ir) => ir.selectedPlanInvestmetrange === r
    );
    states = (matchingRange?.selectedPlanStateAndDistrict || []).map((s) =>
      typeof s === "object" ? s.state : s
    );
  }
  states.forEach((s) => allSelectedStates.add(s));
});

const totalStates = checked.size > 0 ? allSelectedStates.size : 0;
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
totalAmount: (pricePerState / divisor) * totalStates * currentLead,    };
  });

  const activePlanId = selectedPlanId ?? rows[0]?.id;
  const activePlan = rows.find((r) => r.id === activePlanId) ?? rows[0];

  const setLead = (planId, val) =>
    setSelectedLeads((p) => ({ ...p, [planId]: val }));

  const toggleRange = (planId, range) =>
    setCheckedRanges((p) => {
      const s = new Set(p[planId] || []);
      s.has(range) ? s.delete(range) : s.add(range);
      return { ...p, [planId]: s };
    });
const editStates = (planId, range) => {
  setCurrentEditingRange({ planId, range });

  // Use stateSelections instead of item.investmentranges
  const existing = stateSelections[`${planId}_${range}`] || [];
  setSelectedStates(new Set(existing.length ? existing : allStates));
  onOpenStateModal?.({ planId, range });
};
const handleSaveStatesFromModal = () => {
  if (currentEditingRange) {
    const stateArray = Array.from(selectedStates);

    // Save actual array, not just count
    setStateSelections((p) => ({
      ...p,
      [`${currentEditingRange.planId}_${currentEditingRange.range}`]: stateArray,
    }));

    setCheckedRanges((p) => {
      const s = new Set(p[currentEditingRange.planId] || []);
      s.add(currentEditingRange.range);
      return { ...p, [currentEditingRange.planId]: s };
    });

    onCloseStateModal?.();
    setCurrentEditingRange(null);
  }
};

  const orangeHeaderSx = {
    fontWeight: 700,
    fontSize: "0.7rem",
    color: "#fff",
    py: 1.5,
    textAlign: "center",
    whiteSpace: "pre-line",
    lineHeight: 1.5,
    verticalAlign: "top",
    background: "linear-gradient(135deg, #fb8c00 0%, #ef6c00 100%)",
    borderRight: "1px solid rgba(255,255,255,0.25)",
  };

  const greenHeaderSx = {
    ...orangeHeaderSx,
    background: "linear-gradient(135deg, #4cb04f 0%, #2e7d32 100%)",
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1.5,
            backgroundColor: "#dbeafe",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Box>
            <Typography fontWeight={700} fontSize="1rem" color="#111">
              Upgrade Lead Package
            </Typography>
            <Typography fontSize="0.7rem" color="#757575">
              {clickedRangeLabel && `Investment Group: ${clickedRangeLabel} · `}
            
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" sx={{ color: "#9e9e9e" }} />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 2, pb: 1, overflowX: 'hidden' }}>
          <TableContainer sx={{ borderRadius: 2, border: "1px solid #e0e0e0" }}>
            <Table size="small" sx={{ tableLayout: "fixed", width: "100%", minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...orangeHeaderSx, width: "16%" }}>
                    {"Select\nPlan"}
                  </TableCell>
                  <TableCell sx={{ ...orangeHeaderSx, width: "18%" }}>
                    <Typography fontSize="0.7rem" fontWeight={700} color="#fff" mb={0.75}>
                      Select Lead Per State
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ ...orangeHeaderSx, width: "24%" }}>
                    {"Select Investment\nRange"}
                  </TableCell>
                  <TableCell sx={{ ...greenHeaderSx, width: "10%" }}>
                    {"Price per\nState"}
                  </TableCell>
                  <TableCell sx={{ ...greenHeaderSx, width: "9%" }}>
                    {"Total\nLeads"}
                  </TableCell>
                  <TableCell sx={{ ...greenHeaderSx, width: "10%" }}>
                    {"Total\nAmount"}
                  </TableCell>
                  <TableCell sx={{ ...greenHeaderSx, width: "12%" }}>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody key={activePlanId}>
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      sx={{ textAlign: "center", py: 4, color: "#9e9e9e" }}
                    >
                      No lead upgrade plans available.
                    </TableCell>
                  </TableRow>
                )}

                {rows.map((row, idx) => {
                  const isActive = row.id === activePlanId;

                  return (
                    <TableRow key={row.id} sx={{ verticalAlign: "middle" }}>
                      {/* Select Plan */}
                      <TableCell
                        sx={{
                          px: 1,
                          py: 1.5,
                          textAlign: "center",
                          backgroundColor: "#fff3e0",
                          borderRight: "1px solid #e0e0e0",
                        }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => setSelectedPlanId(row.id)}
                          sx={{
                            minWidth: 90,
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            textTransform: "none",
                            borderRadius: 2,
                            flexDirection: "column",
                            lineHeight: 1.4,
                            backgroundColor: isActive ? "#e65100" : "#fb8c00",
                            color: "#fff",
                            outline: isActive ? "2px solid #111" : "none",
                            outlineOffset: 2,
                            "&:hover": { backgroundColor: "#e65100" },
                          }}
                        >
                          <Typography
                            fontSize="0.75rem"
                            fontWeight={700}
                            color="#fff"
                            lineHeight={1.3}
                          >
                            {row.planName}
                          </Typography>
                          <Typography
                            fontSize="0.7rem"
                            fontWeight={500}
                            color="#fff"
                            lineHeight={1.3}
                          >
                            {row.validityDays} Days
                          </Typography>
                        </Button>
                      </TableCell>

                      {/* Lead Per State — rowSpan on first row */}
                      {idx === 0 && (
                        <TableCell
                          rowSpan={rows.length}
                          sx={{
                            px: 1,
                            py: 1.5,
                            textAlign: "center",
                            backgroundColor: "#fff8f0",
                            borderRight: "1px solid #e0e0e0",
                            verticalAlign: "middle",
                          }}
                        >
                          {activePlan && (
                            <>
                              <Typography
                                fontSize="0.7rem"
                                color="#1565c0"
                                fontWeight={600}
                                mb={0.5}
                              >
                                {activePlan.rangeLabel}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 0.75,
                                  justifyContent: "center",
                                  flexWrap: "wrap",
                                }}
                              >
                                {activePlan.leadOptions.map((lead) => {
                                  const active =
                                    (selectedLeads[activePlan.id] ??
                                      activePlan.leadOptions[0]) === lead;
                                  return (
                                    <Chip
                                      key={lead}
                                      label={lead}
                                      size="small"
                                      onClick={() => setLead(activePlan.id, lead)}
                                      sx={{
                                        height: 26,
                                        minWidth: 34,
                                        fontWeight: 700,
                                        fontSize: "0.75rem",
                                        cursor: "pointer",
                                        backgroundColor: active ? "#4caf50" : "#fff",
                                        color: active ? "#fff" : "#111",
                                        border: `1px solid ${active ? "#4caf50" : "#bdbdbd"}`,
                                        "&:hover": {
                                          backgroundColor: active ? "#388e3c" : "#f5f5f5",
                                        },
                                      }}
                                    />
                                  );
                                })}
                              </Box>
                            </>
                          )}
                        </TableCell>
                      )}

                      {/* Investment Range — rowSpan on first row */}
                      {idx === 0 && (
                        <TableCell
                          rowSpan={rows.length}
                          sx={{
                            px: 1.5,
                            py: 1,
                            backgroundColor: "#fff8f0",
                            borderRight: "1px solid #e0e0e0",
                            verticalAlign: "middle",
                          }}
                        >
                          {activePlan &&
                            (activePlan.investmentRanges.length === 0 ? (
                              <Typography
                                fontSize="0.7rem"
                                color="#9e9e9e"
                                textAlign="center"
                              >
                                No matching investment ranges
                              </Typography>
                            ) : (
                              <Box
                                sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}
                              >
                                {activePlan.investmentRanges.map((range) => {
                                  const isChecked = (
                                    checkedRanges[activePlan.id] || new Set()
                                  ).has(range);
                                 const stateVal = (stateSelections[`${activePlan.id}_${range}`] ?? []).length || 27;
                                  const isRecommended =
                                    ficoInvestmentRanges.length > 0 &&
                                    isFicoInvestmentRange(range);

                                  return (
                                    <Box
                                      key={range}
                                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                                    >
                                      <Checkbox
                                        size="small"
                                        checked={isChecked}
                                        onChange={() => toggleRange(activePlan.id, range)}
                                        sx={{
                                          p: 0.25,
                                          color: "#fb8c00",
                                          "&.Mui-checked": { color: "#fb8c00" },
                                        }}
                                      />
                                      <Typography
                                        fontSize="0.7rem"
                                        color="#111"
                                        flex={1}
                                        noWrap
                                      >
                                        {range}
                                      </Typography>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 0.25,
                                          ml: 0.5,
                                        }}
                                      >
                                        <Typography
                                          fontSize="0.75rem"
                                          fontWeight={700}
                                          color="#111"
                                        >
                                          {stateVal}
                                        </Typography>
                                        <EditIcon
                                          sx={{
                                            fontSize: 11,
                                            color: "#e65100",
                                            cursor: "pointer",
                                          }}
                                          onClick={() =>
                                            editStates(activePlan.id, range, stateVal)
                                          }
                                        />
                                      </Box>
                                   
                                    </Box>
                                  );
                                })}
                              </Box>
                            ))}
                        </TableCell>
                      )}

                      {/* Price per State */}
                      {idx === 0 && (
                        <TableCell
                          rowSpan={rows.length}
                          sx={{
                            px: 1,
                            py: 1.5,
                            textAlign: "center",
                            backgroundColor: "#f1f8e9",
                            borderRight: "1px solid #e0e0e0",
                            verticalAlign: "middle",
                          }}
                        >
                          <Typography fontSize="1.1rem" fontWeight={700} color="#111">
                            ₹{activePlan?.pricePerState.toLocaleString("en-IN")}
                          </Typography>
                        </TableCell>
                      )}

                      {/* Total Leads */}
                      {idx === 0 && (
                        <TableCell
                          rowSpan={rows.length}
                          sx={{
                            px: 1,
                            py: 1.5,
                            textAlign: "center",
                            backgroundColor: "#f1f8e9",
                            borderRight: "1px solid #e0e0e0",
                            verticalAlign: "middle",
                          }}
                        >
                          <Typography fontSize="1.1rem" fontWeight={700} color="#111">
                            {activePlan?.totalLeads.toLocaleString("en-IN")}
                          </Typography>
                        </TableCell>
                      )}

                      {/* Total Amount */}
                      {idx === 0 && (
                        <TableCell
                          rowSpan={rows.length}
                          sx={{
                            px: 1,
                            py: 1.5,
                            textAlign: "center",
                            backgroundColor: "#f1f8e9",
                            borderRight: "1px solid #e0e0e0",
                            verticalAlign: "middle",
                          }}
                        >
                          <Typography fontSize="1.1rem" fontWeight={700} color="#111">
                            ₹{activePlan?.totalAmount.toLocaleString("en-IN")}
                          </Typography>
                        </TableCell>
                      )}

                      {/* Action */}
                      {idx === 0 && (
                        <TableCell
                          rowSpan={rows.length}
                          sx={{
                            px: 1,
                            py: 1.5,
                            textAlign: "center",
                            backgroundColor: "#f1f8e9",
                            verticalAlign: "middle",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.75,
                              alignItems: "center",
                            }}
                          >
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() =>
                                onUpgrade?.({
                                  planId: activePlan.id,
                                  planName: activePlan.planName,
                                  leads: activePlan.currentLead,
                                  checkedRanges: [...activePlan.checked],
                                  totalLeads: activePlan.totalLeads,
                                  totalAmount: activePlan.totalAmount,
                                })
                              }
                              sx={{
                                minWidth: 78,
                                fontWeight: 700,
                                fontSize: "0.7rem",
                                textTransform: "none",
                                borderRadius: 2,
                                lineHeight: 1.4,
                                backgroundColor: "#fb8c00",
                                color: "#fff",
                                "&:hover": { backgroundColor: "#e65100" },
                              }}
                            >
                              Add to
                              <br />
                              Plan
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() =>
                                onViewSummary?.({
                                  planId: activePlan.id,
                                  planName: activePlan.planName,
                                  leads: activePlan.currentLead,
                                  checkedRanges: [...activePlan.checked],
                                  totalLeads: activePlan.totalLeads,
                                  totalAmount: activePlan.totalAmount,
                                })
                              }
                              sx={{
                                minWidth: 78,
                                fontWeight: 700,
                                fontSize: "0.7rem",
                                textTransform: "none",
                                borderRadius: 2,
                                lineHeight: 1.4,
                                backgroundColor: "#4caf50",
                                color: "#fff",
                                "&:hover": { backgroundColor: "#388e3c" },
                              }}
                            >
                              View
                              <br />
                              Summary
                            </Button>
                          </Box>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      {/* State Selection Accordion Dialog */}
      <StateSelectionModal
        open={openStateModal}
        onClose={onCloseStateModal}
        COLORS={COLORS}
        TEXT_SIZES={TEXT_SIZES}
        selectedStates={selectedStates}
        finalToken={finalToken}
        ALL_INDIA_STATES={ALL_INDIA_STATES}
     allStates={allStates}
onOpenStateModal={({ planId, range }) => {
  setSelectedStates(new Set(allStates));
  setOpenStateModal(true);
}}
getStatesToDisplay={() => allStates}
handleSelectAll={() => setSelectedStates(new Set(allStates))}
handleClearAll={() => setSelectedStates(new Set())}
renderStatesByRegion={() => {
  return Object.entries(INDIA_STATES).map(([region, states]) => {
    const available = states.filter((s) => allStates.includes(s));
    if (available.length === 0) return null;
    const selectedInRegion = available.filter((s) => selectedStates.has(s)).length;
    return (
      <Accordion key={region} elevation={0}
        sx={{ border: `1px solid ${COLORS.border}`, borderRadius: "8px !important", "&:before": { display: "none" }, backgroundColor: COLORS.white }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: COLORS.primary }} />}
          sx={{ backgroundColor: COLORS.grey[50], borderRadius: "8px", p: 1.5 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
            <Typography fontWeight={700} fontSize={TEXT_SIZES.medium}>{region}</Typography>
            <Chip
              label={`${selectedInRegion}/${available.length}`}
              size="small"
              sx={{ height: 20, fontSize: TEXT_SIZES.xs, backgroundColor: selectedInRegion === available.length ? COLORS.secondary : COLORS.grey[400], color: COLORS.white, fontWeight: 600 }}
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 2 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1 }}>
            {available.map((state) => (   // ← only API states
              <FormControlLabel
                key={state}
                control={
                  <Checkbox
                    checked={selectedStates.has(state)}
                    onChange={(e) => {
                      const newStates = new Set(selectedStates);
                      e.target.checked ? newStates.add(state) : newStates.delete(state);
                      setSelectedStates(newStates);
                    }}
                    size="small"
                    sx={{ color: COLORS.primary, "&.Mui-checked": { color: COLORS.secondary } }}
                  />
                }
                label={<Typography fontSize={TEXT_SIZES.small} color={COLORS.black}>{state}</Typography>}
              />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  });
}}
        handleSaveStates={handleSaveStatesFromModal}
        router={router}
      />

    </>
  );
};

export default UpgradeDialog;