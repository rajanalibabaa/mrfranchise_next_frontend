import React from "react";
import { Box, Typography, Checkbox, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const UpgradeMobileView = ({ rows, activePlanId, setSelectedPlanId, activePlan, checkedRanges, toggleRange, selectedLeads, setLead, stateCounts, stateSelections, item, editStates, handleAddToPlan, onViewSummary, buildStatesByRange }) => {
  if (!activePlan) return null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", backgroundColor: "#f5f5f5" }}>
      {/* Plan Day Selector */}
      <Box sx={{ display: "flex", gap: 1.5, px: 2, pt: 2, pb: 1.5, backgroundColor: "#f5f5f5" }}>
        {rows.map((row) => {
          const isActive = row.id === activePlanId;
          return (
            <Box key={row.id} onClick={() => setSelectedPlanId(row.id)}
              sx={{ flex: "0 0 auto", minWidth: 64, px: 2, py: 1, borderRadius: 2, cursor: "pointer", textAlign: "center", backgroundColor: isActive ? "#fb8c00" : "transparent", transition: "all 0.15s" }}>
              <Typography fontSize="1.1rem" fontWeight={800} lineHeight={1.2} color={isActive ? "#fff" : "#bbb"}>{row.validityDays}</Typography>
              <Typography fontSize="0.72rem" color={isActive ? "#fff" : "#bbb"} fontWeight={500}>Days</Typography>
            </Box>
          );
        })}
      </Box>

      {/* Investment Range Cards */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 1.5, pb: 1, display: "flex", flexDirection: "column", gap: 1.25 }}>
        {activePlan.investmentRanges.length === 0 ? (
          <Typography fontSize="0.8rem" color="#9e9e9e" textAlign="center" py={4}>No matching investment ranges</Typography>
        ) : (
          activePlan.investmentRanges.map((range) => {
            const currentLeadVal = selectedLeads[activePlan.id] ?? activePlan.leadOptions[0] ?? 60;
            const minLead = Math.min(...activePlan.leadOptions);
            const maxLead = Math.max(...activePlan.leadOptions);
            const stateVal = stateCounts[`${activePlan.id}_${range}`] ?? stateSelections[`${activePlan.id}_${range}`]?.length ?? (item?.investmentranges?.find((ir) => ir.selectedPlanInvestmetrange === range)?.selectedPlanStateAndDistrict?.length ?? 0);

            return (
              <UpgradeMobileRangeCard key={range} range={range}
                isChecked={(checkedRanges[activePlan.id] || new Set()).has(range)}
                onToggle={() => toggleRange(activePlan.id, range)}
                currentLeadVal={currentLeadVal} minLead={minLead} maxLead={maxLead}
                onDecrement={() => { const idx = activePlan.leadOptions.indexOf(currentLeadVal); if (idx > 0) setLead(activePlan.id, activePlan.leadOptions[idx - 1]); }}
                onIncrement={() => { const idx = activePlan.leadOptions.indexOf(currentLeadVal); if (idx < activePlan.leadOptions.length - 1) setLead(activePlan.id, activePlan.leadOptions[idx + 1]); }}
                stateVal={stateVal} onEdit={() => editStates(activePlan.id, range)} />
            );
          })
        )}
      </Box>

      {/* Bottom Action Buttons */}
      <Box sx={{ display: "flex", gap: 0, borderTop: "1px solid #e0e0e0", backgroundColor: "#fff", flexShrink: 0 }}>
        <Button onClick={handleAddToPlan} sx={{ flex: 1, py: 1.75, fontWeight: 700, fontSize: "0.95rem", textTransform: "none", borderRadius: 0, backgroundColor: "#fff", color: "#222", borderRight: "1px solid #e0e0e0", "&:hover": { backgroundColor: "#f5f5f5" } }}>Add to Plan</Button>
        <Button onClick={() => onViewSummary?.({ planId: activePlan?.id, planName: activePlan?.planName, leads: activePlan?.currentLead, checkedRanges: [...(activePlan?.checked || [])], statesByRange: buildStatesByRange(activePlan?.id, activePlan?.checked || new Set()), totalLeads: activePlan?.totalLeads, totalAmount: activePlan?.totalAmount, pricePerState: activePlan?.pricePerState, validityDays: activePlan?.validityDays, investmentRangeLabel: activePlan?.rangeLabel, rangeLabel: activePlan?.rangeLabel })}
          sx={{ flex: 1, py: 1.75, fontWeight: 700, fontSize: "0.95rem", textTransform: "none", borderRadius: 0, backgroundColor: "#4cb04f", color: "#fff", "&:hover": { backgroundColor: "#333" } }}>View Summary</Button>
      </Box>
    </Box>
  );
};

const UpgradeMobileRangeCard = ({ range, isChecked, onToggle, currentLeadVal, minLead, maxLead, onDecrement, onIncrement, stateVal, onEdit }) => (
  <Box sx={{ backgroundColor: "#fef3e2", borderRadius: 2.5, overflow: "hidden", border: "1px solid #f5ddb0" }}>
    <Box sx={{ display: "flex", alignItems: "center", px: 1.5, py: 1.25, gap: 0.75 }}>
      <Checkbox size="small" checked={isChecked} onChange={onToggle} sx={{ p: 0.25, color: "#fb8c00", "&.Mui-checked": { color: "#fb8c00" } }} />
      <Typography fontSize="0.82rem" fontWeight={700} color="#222" sx={{ flex: 1 }} noWrap>{range}</Typography>
      <UpgradeStepperControl value={currentLeadVal} min={minLead} max={maxLead} onDecrement={onDecrement} onIncrement={onIncrement} />
      <Box onClick={onEdit} sx={{ display: "flex", alignItems: "center", gap: 0.25, cursor: "pointer", flexShrink: 0 }}>
        <Typography fontSize="0.75rem" fontWeight={700} color={stateVal > 0 ? "#e65100" : "#aaa"}>{stateVal}</Typography>
        <EditIcon sx={{ fontSize: 13, color: "#e65100" }} />
      </Box>
    </Box>
  </Box>
);

const UpgradeStepperControl = ({ value, min, max, onDecrement, onIncrement }) => (
  <Box sx={{ display: "flex", alignItems: "center", backgroundColor: "#fff", borderRadius: 5, border: "1px solid #e0c890", overflow: "hidden", flexShrink: 0 }}>
    <Box onClick={onDecrement} sx={{ px: 1.25, py: 0.5, cursor: "pointer", color: value <= min ? "#ccc" : "#fb8c00", fontWeight: 700, fontSize: "1rem", lineHeight: 1, userSelect: "none" }}>−</Box>
    <Typography fontSize="0.85rem" fontWeight={700} color="#222" sx={{ px: 1, minWidth: 28, textAlign: "center" }}>{value}</Typography>
    <Box onClick={onIncrement} sx={{ px: 1.25, py: 0.5, cursor: "pointer", color: value >= max ? "#ccc" : "#fb8c00", fontWeight: 700, fontSize: "1rem", lineHeight: 1, userSelect: "none" }}>+</Box>
  </Box>
);

export default UpgradeMobileView;