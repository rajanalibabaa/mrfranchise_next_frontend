import React from "react";
import { Box, Typography, Button, Chip, Checkbox } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const UpgradeDesktopView = ({ rows, activePlanId, setSelectedPlanId, activePlan, checkedRanges, toggleRange, selectedLeads, setLead, stateCounts, stateSelections, item, editStates, handleAddToPlan }) => {
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
    borderRight: "1px solid rgba(255,255,255,0.25)" 
  };
  
  const greenHeaderSx = { 
    ...orangeHeaderSx, 
    background: "linear-gradient(135deg, #4cb04f 0%, #2e7d32 100%)" 
  };

  return (
    <Box sx={{ overflowX: "auto", pt: 2, pb: 1 }}>
      <table style={{ width: "100%", minWidth: 800, borderCollapse: "collapse", tableLayout: "fixed" }}>
        <thead>
          <tr>
            {["Select\nPlan", "Select Lead Per State", "Select Investment\nRange", "Price per\nState", "Total\nLeads", "Total\nAmount", "Action"].map((label, i) => {
              const headerStyle = i < 3 ? orangeHeaderSx : greenHeaderSx;
              return (
                <th 
                  key={label} 
                  style={{ 
                    width: ["16%", "18%", "24%", "10%", "9%", "10%", "12%"][i],
                    padding: "12px 8px", 
                    fontSize: "1rem", 
                    color: "#fff", 
                    whiteSpace: "pre-line", 
                    lineHeight: 1.5,
                    fontWeight: 700,
                    textAlign: "center",
                    verticalAlign: "top",
                    background: i < 3 
                      ? "linear-gradient(135deg, #fb8c00 0%, #ef6c00 100%)" 
                      : "linear-gradient(135deg, #4cb04f 0%, #2e7d32 100%)",
                    borderRight: "1px solid rgba(255,255,255,0.25)"
                  }}
                >
                  {label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: "32px", color: "#9e9e9e" }}>
                No lead upgrade plans available.
              </td>
            </tr>
          )}
          {rows.map((row, index) => {
            const isActive = row.id === activePlanId;
            const isFirstRow = index === 0;
            const rowSpan = rows.length;
            
            return (
              <tr key={row.id} style={{ verticalAlign: "middle" }}>
                <td style={{ padding: "12px 8px", textAlign: "center", backgroundColor: "#fff3e0", borderRight: "1px solid #e0e0e0" }}>
                  <UpgradePlanButton row={row} isActive={isActive} onClick={() => setSelectedPlanId(row.id)} />
                </td>
                {isFirstRow && (
                  <>
                    <UpgradeLeadSelectorCell rows={rows} activePlan={activePlan} selectedLeads={selectedLeads} setLead={setLead} />
                    <UpgradeInvestmentRangeCell rows={rows} activePlan={activePlan} checkedRanges={checkedRanges} toggleRange={toggleRange} stateCounts={stateCounts} stateSelections={stateSelections} item={item} editStates={editStates} />
                  </>
                )}
                {/* These cells with rowSpan but values only in first row */}
                <td 
                  rowSpan={rowSpan}
                  style={{ 
                    padding: "12px 8px", 
                    textAlign: "center", 
                    backgroundColor: "#f1f8e9", 
                    borderRight: "1px solid #e0e0e0", 
                    verticalAlign: "middle" 
                  }}
                >
                  {isFirstRow && (
                    <Typography fontSize="1.1rem" fontWeight={700} color="#111">
                      ₹{activePlan?.pricePerState.toLocaleString("en-IN") || 0}
                    </Typography>
                  )}
                </td>
                <td 
                  rowSpan={rowSpan}
                  style={{ 
                    padding: "12px 8px", 
                    textAlign: "center", 
                    backgroundColor: "#f1f8e9", 
                    borderRight: "1px solid #e0e0e0", 
                    verticalAlign: "middle" 
                  }}
                >
                  {isFirstRow && (
                    <Typography fontSize="1.1rem" fontWeight={700} color="#111">
                      {activePlan?.totalLeads.toLocaleString("en-IN") || 0}
                    </Typography>
                  )}
                </td>
                <td 
                  rowSpan={rowSpan}
                  style={{ 
                    padding: "12px 8px", 
                    textAlign: "center", 
                    backgroundColor: "#f1f8e9", 
                    borderRight: "1px solid #e0e0e0", 
                    verticalAlign: "middle" 
                  }}
                >
                  {isFirstRow && (
                    <Typography fontSize="1.1rem" fontWeight={700} color="#111">
                      ₹{activePlan?.totalAmount.toLocaleString("en-IN") || 0}
                    </Typography>
                  )}
                </td>
                <td 
                  rowSpan={rowSpan}
                  style={{ 
                    padding: "12px 8px", 
                    textAlign: "center", 
                    backgroundColor: "#f1f8e9", 
                    verticalAlign: "middle" 
                  }}
                >
                  {isFirstRow && (
                    <Button 
                      variant="contained" 
                      size="small" 
                      onClick={handleAddToPlan} 
                      sx={{ 
                        minWidth: 78, 
                        fontWeight: 700, 
                        fontSize: "0.7rem", 
                        textTransform: "none", 
                        borderRadius: 2, 
                        lineHeight: 1.4, 
                        backgroundColor: "#fb8c00", 
                        color: "#fff", 
                        "&:hover": { backgroundColor: "#e65100" } 
                      }}
                    >
                      Add to<br />Plan
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Box>
  );
};

const UpgradePlanButton = ({ row, isActive, onClick }) => (
  <Button variant="contained" size="small" onClick={onClick}
    sx={{ 
      minWidth: 90, 
      fontWeight: 700, 
      fontSize: "0.75rem", 
      textTransform: "none", 
      borderRadius: 2, 
      flexDirection: "column", 
      lineHeight: 1.4, 
      backgroundColor: isActive ? "#2e7d32" : "#fb8c00", 
      color: "#fff", 
      outline: isActive ? "2px solid #111" : "none", 
      outlineOffset: 2, 
      "&:hover": { backgroundColor: "#2e7d32" } 
    }}
  >
    <Typography fontSize="1rem" fontWeight={700} color="#fff" lineHeight={1.3}>
      {row.validityDays} Days
    </Typography>
    <Typography fontSize="0.75rem" fontWeight={700} color="#fff" lineHeight={1.3}>
      {row.planName}
    </Typography>
  </Button>
);

const UpgradeLeadSelectorCell = ({ rows, activePlan, selectedLeads, setLead }) => (
  <td rowSpan={rows.length} style={{ padding: "12px 8px", textAlign: "center", backgroundColor: "#fff8f0", borderRight: "1px solid #e0e0e0", verticalAlign: "middle" }}>
    {activePlan && (
      <>
        <Typography fontSize="1rem" color="#fb8c00" fontWeight={600} mb={0.5}>
          {activePlan.rangeLabel}
        </Typography>
        <Box sx={{ display: "flex", gap: 0.75, justifyContent: "center", flexWrap: "wrap", mt: 1 }}>
          {activePlan.leadOptions.map((lead) => {
            const active = (selectedLeads[activePlan.id] ?? activePlan.leadOptions[0]) === lead;
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
                  fontSize: "1rem", 
                  cursor: "pointer", 
                  backgroundColor: active ? "#4caf50" : "#fff", 
                  color: active ? "#fff" : "#111", 
                  border: `1px solid ${active ? "#4caf50" : "#bdbdbd"}` 
                }} 
              />
            );
          })}
        </Box>
      </>
    )}
  </td>
);

const UpgradeInvestmentRangeCell = ({ rows, activePlan, checkedRanges, toggleRange, stateCounts, stateSelections, item, editStates }) => (
  <td rowSpan={rows.length} style={{ padding: "8px 12px", backgroundColor: "#fff8f0", borderRight: "1px solid #e0e0e0", verticalAlign: "middle" }}>
    {activePlan && (activePlan.investmentRanges.length === 0 ? (
      <Typography fontSize="0.7rem" color="#9e9e9e" textAlign="center">
        No matching investment ranges
      </Typography>
    ) : (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
        {activePlan.investmentRanges.map((range) => {
          const isChecked = (checkedRanges[activePlan.id] || new Set()).has(range);
          const stateVal = stateCounts[`${activePlan.id}_${range}`] || 
                          stateSelections[`${activePlan.id}_${range}`]?.length || 
                          (item?.investmentranges?.find((ir) => ir.selectedPlanInvestmetrange === range)
                            ?.selectedPlanStateAndDistrict?.length || 0);
          return (
            <Box key={range} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Checkbox 
                size="small" 
                checked={isChecked} 
                onChange={() => toggleRange(activePlan.id, range)} 
                sx={{ p: 0.25, color: "#fb8c00", "&.Mui-checked": { color: "#fb8c00" } }} 
              />
              <Typography fontSize="1rem" color="#111" flex={1} noWrap>
                {range}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, ml: 0.5 }}>
                <Typography fontSize="1rem" fontWeight={700} color="#111">
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
  </td>
);

export default UpgradeDesktopView;