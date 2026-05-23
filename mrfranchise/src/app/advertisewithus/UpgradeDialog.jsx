import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, IconButton,
  Box, Typography, Chip, Divider, Table, TableHead,
  TableBody, TableRow, TableCell, TableContainer,
  Button, Checkbox, Collapse
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const C = {
  orange: "#FF9900",
  orangeDark: "#E68A00",
  green: "#4CB04F",
  greenDark: "#3D8E40",
  black: "#000000",
  white: "#ffffff",
  border: "#E0E0E0",
  rowOrangeDark: "#ffe0b2",
  rowOrange: "#fff3d6",
  rowGreen: "#c8e6c9",
  rowGreenDark: "#a5d6a7",
  primaryDark: "#E68A00",
  grey: { 100: "#F5F5F5", 300: "#E0E0E0", 400: "#BDBDBD", 500: "#9E9E9E", 600: "#757575" },
};

const TX = { xs: "0.72rem", sm: "0.80rem", md: "0.92rem", lg: "1.05rem" };

const UpgradeDialog = ({ open, onClose, pkg, allPlans = [], leadsDropdownData = {}, onUpgrade, onViewSummary }) => {
  const [selectedLeads, setSelectedLeads] = useState({});
  const [checkedRanges, setCheckedRanges] = useState({});
  const [stateCounts, setStateCounts] = useState({});
  const [expandedPlanId, setExpandedPlanId] = useState(null);

  const packageType = (pkg?.packagesType || "").toUpperCase();
  if (!open || packageType === "LISTING") return null;

  // Filter to only LEAD/Investment plans (packages length > 1)
  const plans = allPlans.filter(
    (p) => p.packages?.length > 1 && p.planName?.toLowerCase() !== "free"
  );

  const rows = plans.map((plan) => {
    const pkgObj = plan.packages[0];
    const rangeLabel = pkgObj?.investmentRangeLabel || "—";
    const validityDays = pkgObj?.validityDays || "—";
    const pricePerState = pkgObj?.amount || 0;
    const investmentRanges = pkgObj?.investmentRange || [];

    const leadOptions =
      leadsDropdownData[`${plan._id}_${rangeLabel}`] ||
      (pkgObj?.totalLeads
        ? Array.isArray(pkgObj.totalLeads) ? pkgObj.totalLeads : [pkgObj.totalLeads]
        : [20, 40, 60]);

    const currentLead = selectedLeads[plan._id] ?? leadOptions[0] ?? 20;
    const checked = checkedRanges[plan._id] || new Set();

    const totalStates =
      checked.size > 0
        ? [...checked].reduce((s, r) => s + (stateCounts[`${plan._id}_${r}`] ?? 27), 0)
        : 27;

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
      totalAmount: pricePerState * totalStates,
      isExpanded: expandedPlanId === plan._id,
    };
  });

  const setLead = (planId, val) =>
    setSelectedLeads((p) => ({ ...p, [planId]: val }));

  const toggleRange = (planId, range) =>
    setCheckedRanges((p) => {
      const s = new Set(p[planId] || []);
      s.has(range) ? s.delete(range) : s.add(range);
      return { ...p, [planId]: s };
    });

  const editStates = (planId, range, current) => {
    const val = window.prompt(`States for "${range}":`, current ?? 27);
    if (val !== null && !isNaN(Number(val)) && Number(val) > 0)
      setStateCounts((p) => ({ ...p, [`${planId}_${range}`]: Number(val) }));
  };

  const toggleExpand = (planId) => {
    setExpandedPlanId(expandedPlanId === planId ? null : planId);
  };

  const headerCell = (label, orange) => ({
    fontWeight: 700, fontSize: TX.xs, color: C.white, py: 1.5,
    textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.5,
    background: orange
      ? "linear-gradient(135deg, #fb8c00 0%, #ef6c00 100%)"
      : "linear-gradient(135deg, #4cb04f 0%, #2e7d32 100%)",
    borderRight: "1px solid rgba(255,255,255,0.25)",
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth
      PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}>

      <DialogTitle sx={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        pb: 1.5, backgroundColor: "#dbeafe", borderBottom: `1px solid ${C.border}`
      }}>
        <Box>
          <Typography fontWeight={700} fontSize={TX.md} color={C.black}>Upgrade Lead Package</Typography>
          <Typography fontSize={TX.xs} color={C.grey[600]}>Click on plan to select lead per state</Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" sx={{ color: C.grey[500] }} />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2, pb: 1 }}>
        <TableContainer sx={{ borderRadius: 2, border: `1px solid ${C.border}` }}>
          <Table size="small" sx={{ tableLayout: "fixed", width: "100%", minWidth: 800 }}>

            <TableHead>
              <TableRow>
                <TableCell sx={{ ...headerCell(null, true), width: "16%" }}>Select{"\n"}Plan</TableCell>
                <TableCell sx={{ ...headerCell(null, true), width: "18%" }}>Select{"\n"}Lead Per State</TableCell>
                <TableCell sx={{ ...headerCell(null, true), width: "24%" }}>Select Investment{"\n"}Range</TableCell>
                <TableCell sx={{ ...headerCell(null, true), width: "9%"  }}>Select{"\n"}States</TableCell>
                <TableCell sx={{ ...headerCell(null, false), width: "10%" }}>Price per{"\n"}State</TableCell>
                <TableCell sx={{ ...headerCell(null, false), width: "9%"  }}>Total{"\n"}Leads</TableCell>
                <TableCell sx={{ ...headerCell(null, false), width: "10%" }}>Total{"\n"}Amount</TableCell>
                <TableCell sx={{ ...headerCell(null, false), width: "12%" }}>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: "center", py: 4, color: C.grey[500] }}>
                    No lead upgrade plans available.
                  </TableCell>
                </TableRow>
              )}

              {rows.map((row, idx) => {
                const oBg = idx % 2 === 0 ? C.rowOrange : C.rowOrangeDark;
                const gBg = idx % 2 === 0 ? C.rowGreen : C.rowGreenDark;

                return (
                  <React.Fragment key={row.id}>
                    <TableRow sx={{ verticalAlign: "middle" }}>

                      {/* Select Plan - Click to expand/collapse */}
                      <TableCell sx={{ px: 1, py: 1.5, textAlign: "center", backgroundColor: C.rowOrangeDark, borderRight: `1px solid ${C.border}` }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                          <Button 
                            variant="contained" 
                            size="small" 
                            onClick={() => toggleExpand(row.id)}
                            sx={{
                              minWidth: 90, fontWeight: 700, fontSize: TX.sm,
                              textTransform: "none", borderRadius: 2,
                              backgroundColor: C.orange, color: C.white,
                              "&:hover": { backgroundColor: C.orangeDark },
                            }}>
                            {row.validityDays} Days
                          </Button>
                          {row.isExpanded ? (
                            <ExpandLessIcon sx={{ color: C.grey[600], cursor: "pointer" }} onClick={() => toggleExpand(row.id)} />
                          ) : (
                            <ExpandMoreIcon sx={{ color: C.grey[600], cursor: "pointer" }} onClick={() => toggleExpand(row.id)} />
                          )}
                        </Box>
                        <Typography fontSize={TX.xs} color={C.grey[600]} mt={0.5} fontWeight={600}>
                          {row.planName}
                        </Typography>
                      </TableCell>

                      {/* Select Lead Per State - Shows current lead value and label, chips appear on expand */}
                      <TableCell sx={{ px: 1, py: 1.5, textAlign: "center", backgroundColor: oBg, borderRight: `1px solid ${C.border}` }}>
                     
                        <Typography fontSize={TX.xs} color={C.primaryDark} fontWeight={600} mt={0.75}>
                          {row.rangeLabel}
                        </Typography>
                        
                        {/* Expandable section with lead options */}
                        <Collapse in={row.isExpanded} timeout="auto" unmountOnExit>
                          <Box sx={{ mt: 1.5, pt: 1.5, borderTop: `1px dashed ${C.grey[300]}` }}>
                            <Typography fontSize={TX.xs} color={C.grey[500]} mb={0.75}>
                              Select Lead Count:
                            </Typography>
                            <Box sx={{ display: "flex", gap: 0.75, justifyContent: "center", flexWrap: "wrap" }}>
                              {row.leadOptions.map((lead) => {
                                const active = row.currentLead === lead;
                                return (
                                  <Chip
                                    key={lead}
                                    label={lead}
                                    size="small"
                                    onClick={() => setLead(row.id, lead)}
                                    sx={{
                                      height: 28, minWidth: 36,
                                      fontWeight: 700, fontSize: TX.sm,
                                      cursor: "pointer",
                                      backgroundColor: active ? C.green : C.white,
                                      color: active ? C.white : C.black,
                                      border: `1px solid ${active ? C.green : C.grey[400]}`,
                                      "&:hover": { backgroundColor: active ? C.greenDark : C.grey[100] },
                                    }}
                                  />
                                );
                              })}
                            </Box>
                          </Box>
                        </Collapse>
                      </TableCell>

                      {/* Investment Range checkboxes */}
                      <TableCell sx={{ px: 1.5, py: 1, backgroundColor: oBg, borderRight: `1px solid ${C.border}` }}>
                        {row.investmentRanges.length === 0
                          ? <Typography fontSize={TX.xs} color={C.grey[500]} textAlign="center">—</Typography>
                          : (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
                              {row.investmentRanges.map((range) => {
                                const isChecked = row.checked.has(range);
                                const stateVal = stateCounts[`${row.id}_${range}`] ?? 27;
                                return (
                                  <Box key={range} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <Checkbox size="small" checked={isChecked}
                                      onChange={() => toggleRange(row.id, range)}
                                      sx={{ p: 0.25, color: C.orange, "&.Mui-checked": { color: C.orange } }}
                                    />
                                    <Typography fontSize={TX.xs} color={C.black} flex={1} noWrap>
                                      {range}
                                    </Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, ml: 0.5 }}>
                                      <Typography fontSize={TX.sm} fontWeight={700} color={C.black}>{stateVal}</Typography>
                                      <EditIcon sx={{ fontSize: 11, color: C.orangeDark, cursor: "pointer" }}
                                        onClick={() => editStates(row.id, range, stateVal)} />
                                    </Box>
                                  </Box>
                                );
                              })}
                            </Box>
                          )
                        }
                      </TableCell>

                      {/* Total States */}
                      <TableCell sx={{ px: 1, py: 1.5, textAlign: "center", backgroundColor: oBg, borderRight: `1px solid ${C.border}` }}>
                        <Typography fontSize={TX.lg} fontWeight={700} color={C.black}>{row.totalStates}</Typography>
                      </TableCell>

                      {/* Price per State */}
                      <TableCell sx={{ px: 1, py: 1.5, textAlign: "center", backgroundColor: gBg, borderRight: `1px solid ${C.border}` }}>
                        <Typography fontSize={TX.lg} fontWeight={700} color={C.black}>
                          ₹{row.pricePerState.toLocaleString("en-IN")}
                        </Typography>
                      </TableCell>

                      {/* Total Leads */}
                      <TableCell sx={{ px: 1, py: 1.5, textAlign: "center", backgroundColor: gBg, borderRight: `1px solid ${C.border}` }}>
                        <Typography fontSize={TX.lg} fontWeight={700} color={C.black}>
                          {row.totalLeads.toLocaleString("en-IN")}
                        </Typography>
                      </TableCell>

                      {/* Total Amount */}
                      <TableCell sx={{ px: 1, py: 1.5, textAlign: "center", backgroundColor: gBg, borderRight: `1px solid ${C.border}` }}>
                        <Typography fontSize={TX.lg} fontWeight={700} color={C.black}>
                          ₹{row.totalAmount.toLocaleString("en-IN")}
                        </Typography>
                      </TableCell>

                      {/* Action */}
                      <TableCell sx={{ px: 1, py: 1.5, textAlign: "center", backgroundColor: gBg }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, alignItems: "center" }}>
                          <Button variant="contained" size="small"
                            onClick={() => onUpgrade?.({ planId: row.id, planName: row.planName, leads: row.currentLead, checkedRanges: [...row.checked], totalLeads: row.totalLeads, totalAmount: row.totalAmount })}
                            sx={{ minWidth: 78, fontWeight: 700, fontSize: TX.xs, textTransform: "none", borderRadius: 2, lineHeight: 1.4, backgroundColor: C.orange, color: C.white, "&:hover": { backgroundColor: C.orangeDark } }}>
                            Add to<br />Plan
                          </Button>
                          <Button variant="contained" size="small"
                            onClick={() => onViewSummary?.({ planId: row.id, planName: row.planName, leads: row.currentLead, checkedRanges: [...row.checked], totalLeads: row.totalLeads, totalAmount: row.totalAmount })}
                            sx={{ minWidth: 78, fontWeight: 700, fontSize: TX.xs, textTransform: "none", borderRadius: 2, lineHeight: 1.4, backgroundColor: C.green, color: C.white, "&:hover": { backgroundColor: C.greenDark } }}>
                            View<br />Summary
                          </Button>
                        </Box>
                      </TableCell>

                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeDialog;