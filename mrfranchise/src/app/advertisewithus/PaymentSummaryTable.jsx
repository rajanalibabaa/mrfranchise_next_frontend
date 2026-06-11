import React, { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Tooltip,
  IconButton,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// ─── Mobile-only Section Accordion ───────────────────────────────────────────
const SectionAccordion = ({ title, children, defaultExpanded = false, COLORS }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (!isMobile) return <>{children}</>;

  return (
    <Accordion
      expanded={expanded}
      onChange={(_, val) => setExpanded(val)}
      disableGutters
      elevation={0}
      sx={{
        mb: 0,
        border: `1px solid ${COLORS.border}`,
        borderRadius: "12px !important",
        overflow: "hidden",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: COLORS.primary }} />}
        sx={{
          backgroundColor: "#fff8ee",
          minHeight: 52,
          px: 2,
          "& .MuiAccordionSummary-content": { my: 0 },
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: COLORS.black }}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

const PaymentSummaryTable = ({
  paymentSummary = [],
  paymentSummaryRef,
  COLORS,
  TEXT_SIZES,
  handleShowStates,
  setItemToRemove,
  setOpenRemoveConfirmDialog,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expandedPlan, setExpandedPlan] = useState(null);

  // ─── GROUP BY PLAN (unchanged logic) ────────────────────────────────
  const groupedByPlan = {};

  paymentSummary.forEach((group) => {
    if (!group.items || group.items.length === 0) return;

    if (!groupedByPlan[group.planId]) {
      groupedByPlan[group.planId] = {
        planName: group.planName,
        validityDays: group.validityDays,
        items: [],
        totalPlanAmount: 0,
        totalPlanLeads: 0,
        totalPlanStates: 0,
      };
    }

    group.items.forEach((item) => {
      groupedByPlan[group.planId].items.push({
        ...item,
        pricePerState: group.pricePerState,
        validityDays: group.validityDays,
      });
    });

    const byRange = {};
    groupedByPlan[group.planId].items.forEach((item) => {
      if (!byRange[item.range]) {
        byRange[item.range] = {
          selectedLeads: item.selectedLeads || 0,
          states: new Set(),
          pricePerState: item.pricePerState,
        };
      }
      (item.states || []).forEach((s) => byRange[item.range].states.add(s));
    });

    const globalUniqueStates = new Set();
    Object.values(byRange).forEach(({ states }) => {
      states.forEach((s) => globalUniqueStates.add(s));
    });
    const uniqueStateCount = globalUniqueStates.size;

    const lastRange = Object.values(byRange)[Object.values(byRange).length - 1];
    const lastSelectedLeads = lastRange ? lastRange.selectedLeads : 0;

    const totalLeads = lastSelectedLeads * uniqueStateCount;
    const totalAmount =
      Object.values(byRange).reduce(
        (sum, { pricePerState }) => sum + pricePerState,
        0
      ) * uniqueStateCount;

    groupedByPlan[group.planId].totalPlanLeads = totalLeads;
    groupedByPlan[group.planId].totalPlanAmount = totalAmount;
    groupedByPlan[group.planId].totalPlanStates = uniqueStateCount;
    groupedByPlan[group.planId].lastSelectedLeads = lastSelectedLeads;
    groupedByPlan[group.planId].byRange = byRange;
  });

  // ─── SHARED CELL STYLES ──────────────────────────────────────────────
  const headerCellSx = {
    fontWeight: 700,
    fontSize: TEXT_SIZES.small,
    color: COLORS.white,
    py: 1.25,
    px: 1.5,
    borderBottom: "none",
    whiteSpace: "nowrap",
  };

  const bodyCellSx = {
    borderBottom: "none",
    py: 0.75,
    px: 1.5,
    verticalAlign: "middle",
  };

  // ─── BUILD SORTED RANGES (shared between mobile & desktop) ───────────
  const buildSortedRanges = (planId, planData) => {
    const groupedByRange = planData.items.reduce((acc, item) => {
      const rangeKey = `${planId}_${item.investmentRangeLabel}_${item.range}`;
      if (!acc[rangeKey]) {
        acc[rangeKey] = {
          range: item.range,
          investmentRangeLabel: item.investmentRangeLabel,
          planId,
          items: [],
          totalStates: 0,
          totalLeads: 0,
          totalAmount: 0,
          selectedLeads: item.selectedLeads,
          pricePerState: item.pricePerState,
          validityDays: item.validityDays,
        };
      }
      acc[rangeKey].items.push(item);
      const uniqueStatesForRange = new Set();
      acc[rangeKey].items.forEach((i) => {
        (i.states || []).forEach((s) => uniqueStatesForRange.add(s));
      });
      const uniqueRangeStatesCount = uniqueStatesForRange.size;
      acc[rangeKey].totalStates = uniqueRangeStatesCount;
      acc[rangeKey].totalLeads = (item.selectedLeads || 0) * uniqueRangeStatesCount;
      acc[rangeKey].totalAmount = (item.pricePerState || 0) * uniqueRangeStatesCount;
      return acc;
    }, {});

    const labelGroupMap = {};
    Object.values(groupedByRange).forEach((rg) => {
      const lbl = rg.investmentRangeLabel || "—";
      if (!labelGroupMap[lbl]) labelGroupMap[lbl] = [];
      labelGroupMap[lbl].push(rg);
    });

    const sortedRanges = Object.values(labelGroupMap).flat();

    const labelSubtotalMap = {};
    Object.entries(labelGroupMap).forEach(([lbl, ranges]) => {
      const countedStates = new Set();
      let labelTotal = 0;
      ranges.forEach((rg) => {
        const rangeUniqueStates = new Set();
        rg.items.forEach((item) => {
          (item.states || []).forEach((s) => {
            if (!countedStates.has(s)) rangeUniqueStates.add(s);
          });
        });
        rangeUniqueStates.forEach((s) => countedStates.add(s));
        labelTotal += (rg.pricePerState || 0) * rangeUniqueStates.size;
      });
      labelSubtotalMap[lbl] = labelTotal;
    });

    return { sortedRanges, labelSubtotalMap, labelGroupMap };
  };

  const togglePlan = (planId) => {
    setExpandedPlan(expandedPlan === planId ? null : planId);
  };

  // ─── MOBILE ACCORDION VIEW ────────────────────────────────────────────
  const renderMobileAccordion = () => {
    if (paymentSummary.length === 0) {
      return (
        <Box
          sx={{
            textAlign: "center",
            py: 4,
            px: 2,
            border: `1px dashed ${COLORS.border}`,
            borderRadius: 2,
          }}
        >
          <Typography sx={{ color: COLORS.grey[500], fontSize: TEXT_SIZES.small }}>
            No items added yet.
          </Typography>
          <Typography sx={{ color: COLORS.grey[400], fontSize: "0.72rem", mt: 0.5 }}>
            Select investment ranges and click "Add" to proceed.
          </Typography>
        </Box>
      );
    }

    return Object.entries(groupedByPlan).map(([planId, planData]) => {
      const { labelGroupMap, labelSubtotalMap } = buildSortedRanges(planId, planData);
      const isListingPlan = Object.values(labelGroupMap)[0]?.[0]?.items[0]?.isListingPlan;
      const isExpanded = expandedPlan === planId;

      return (
        <Card
          key={planId}
          elevation={0}
          sx={{
            mb: 2,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 3,
            boxShadow: `0 2px 12px ${COLORS.shadow}`,
            overflow: "hidden",
          }}
        >
          <Box
            onClick={() => togglePlan(planId)}
            sx={{
              background: `linear-gradient(135deg, ${COLORS.secondary} 0%, ${COLORS.secondaryDark} 100%)`,
              px: 2,
              py: 1,
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:active": { opacity: 0.95 },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Typography sx={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: COLORS.white,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                }}>
                  {planData.validityDays} Days Plan
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {!isListingPlan && (
                  <Box
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.15)",
                      borderRadius: 2,
                      px: 1.5,
                      py: 0.75,
                      textAlign: "center",
                      minWidth: 72,
                      flexShrink: 0,
                    }}
                  >
                    <Typography sx={{ fontSize: "0.6rem", color: COLORS.white, opacity: 0.85, letterSpacing: 0.3 }}>
                      TOTAL LEADS
                    </Typography>
                    <Typography sx={{ fontSize: "1rem", fontWeight: 800, color: COLORS.white, lineHeight: 1.2 }}>
                      {typeof planData.totalPlanLeads === "number"
                        ? planData.totalPlanLeads.toLocaleString("en-IN")
                        : planData.totalPlanLeads}
                    </Typography>
                    <Typography sx={{ fontSize: "0.58rem", color: COLORS.white, opacity: 0.7 }}>
                      {planData.lastSelectedLeads} × {planData.totalPlanStates}
                    </Typography>
                  </Box>
                )}

                {isExpanded ? (
                  <KeyboardArrowUpIcon sx={{ fontSize: 24, color: COLORS.white }} />
                ) : (
                  <KeyboardArrowDownIcon sx={{ fontSize: 24, color: COLORS.white }} />
                )}
              </Box>
            </Box>
          </Box>

          <Collapse in={isExpanded}>
            <Box sx={{ px: 0, pb: 0.5 }}>
              {Object.entries(labelGroupMap).map(([label, ranges], groupIndex) => {
                const groupSubtotal = labelSubtotalMap[label] || 0;

                return (
                  <Box key={label}>
                    <Box
                      sx={{
                        px: 2.5,
                        py: 1.5,
                        backgroundColor: COLORS.grey[100],
                        borderBottom: `1px solid ${COLORS.border}`,
                        borderTop: `1px solid ${COLORS.border}`,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: COLORS.black }}>
                          {label}
                        </Typography>
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: COLORS.secondaryDark }}>
                          ₹{groupSubtotal.toLocaleString("en-IN")}
                        </Typography>
                      </Box>
                    </Box>

                    {ranges.map((rangeGroup, idx) => {
                      const isLastInGroup = idx === ranges.length - 1;

                      return (
                        <Box
                          key={`${planId}-${rangeGroup.range}-${idx}`}
                          sx={{
                            px: 2.5,
                            py: 1.75,
                            borderBottom: isLastInGroup ? `1px solid ${COLORS.border}` : "none",
                            backgroundColor: idx % 2 !== 0 ? `${COLORS.lightOrange}40` : COLORS.white,
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                            <Chip
                              label={rangeGroup.range}
                              size="small"
                              sx={{
                                fontSize: "0.7rem",
                                height: 26,
                                backgroundColor: COLORS.lightOrange,
                                color: COLORS.black,
                                fontWeight: 600,
                              }}
                            />

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Typography sx={{ fontSize: "0.62rem", color: COLORS.grey[500], fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4 }}>
                                States
                              </Typography>
                              {rangeGroup.items[0]?.isListingPlan ? (
                                <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: COLORS.black }}>
                                  All States
                                </Typography>
                              ) : (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                  <Typography sx={{ fontSize: "1rem", fontWeight: 200, color: COLORS.black, lineHeight: 1 }}>
                                    {rangeGroup.totalStates}
                                  </Typography>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      const allStatesList = [
                                        ...new Set(rangeGroup.items.flatMap((item) => item.states || [])),
                                      ];
                                      handleShowStates(e, allStatesList);
                                    }}
                                    sx={{
                                      p: 0.4,
                                      backgroundColor: `${COLORS.primary}12`,
                                      borderRadius: 1,
                                      "&:hover": { backgroundColor: `${COLORS.primary}25` },
                                    }}
                                  >
                                    <VisibilityIcon sx={{ fontSize: "0.82rem", color: COLORS.primary }} />
                                  </IconButton>
                                </Box>
                              )}
                            </Box>

                            <IconButton
                              onClick={() => {
                                setItemToRemove({
                                  planName: planData.planName,
                                  range: rangeGroup.range,
                                  investmentRangeLabel: rangeGroup.investmentRangeLabel,
                                  items: rangeGroup.items,
                                });
                                setOpenRemoveConfirmDialog(true);
                              }}
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 2,
                                color: COLORS.grey[500],
                                border: `1px solid ${COLORS.border}`,
                                flexShrink: 0,
                                "&:hover": {
                                  color: COLORS.primary,
                                  backgroundColor: COLORS.lightOrange,
                                  borderColor: COLORS.primary,
                                },
                              }}
                            >
                              <DeleteIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                );
              })}
            </Box>
          </Collapse>
        </Card>
      );
    });
  };

  // ─── DESKTOP TABLE VIEW (unchanged) ─────────────────────────────────
  const renderDesktopTable = () => (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: `1px solid ${COLORS.border}`,
        borderRadius: 2,
        boxShadow: `0 4px 12px ${COLORS.shadow}`,
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        mb: 3,
      }}
    >
      <Table
        sx={{
          borderCollapse: "collapse",
          tableLayout: "fixed",
          minWidth: 700,
        }}
      >
        <colgroup>
          <col style={{ width: 160 }} />
          <col style={{ width: 150 }} />
          <col style={{ width: 150 }} />
          <col style={{ width: 110 }} />
          <col style={{ width: 130 }} />
          <col style={{ width: 130 }} />
          <col style={{ width: 90 }} />
        </colgroup>

        <TableHead>
          <TableRow
            sx={{
              background: `linear-gradient(135deg, ${COLORS.secondary} 0%, ${COLORS.secondaryDark} 100%)`,
            }}
          >
            {[
              { label: "Selected Plan", align: "left" },
              { label: "Investment Range Label", align: "center" },
              { label: "Investment Range", align: "left" },
              { label: "States", align: "center" },
              { label: "Leads", align: "center" },
              { label: "Subtotal (₹)", align: "right" },
              { label: "Actions", align: "center" },
            ].map(({ label, align }) => (
              <TableCell key={label} align={align} sx={headerCellSx}>
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {paymentSummary.length > 0 ? (
            Object.entries(groupedByPlan).map(([planId, planData]) => {
              const { sortedRanges, labelSubtotalMap } = buildSortedRanges(planId, planData);

              const labelRowSpanMap = {};
              sortedRanges.forEach((rg) => {
                const lbl = rg.investmentRangeLabel || "—";
                labelRowSpanMap[lbl] = (labelRowSpanMap[lbl] || 0) + 1;
              });

              const renderedLabels = new Set();
              const renderedSubtotals = new Set();

              const rangeRows = sortedRanges.map((rangeGroup, idx) => {
                const lbl = rangeGroup.investmentRangeLabel || "—";

                const row = (
                  <TableRow
                    key={`${planId}-${rangeGroup.range}-${idx}`}
                    sx={{ transition: "background-color 0.15s" }}
                  >
                    {idx === 0 && (
                      <TableCell
                        rowSpan={sortedRanges.length}
                        sx={{
                          ...bodyCellSx,
                          verticalAlign: "top",
                          borderRight: `2px solid ${COLORS.border}`,
                          left: 0,
                          zIndex: 1,
                          backgroundColor: COLORS.white,
                          boxShadow: `2px 0 6px -2px ${COLORS.shadow}`,
                          minWidth: 140,
                        }}
                      >
                        <Box>
                          <Typography sx={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: COLORS.black,
                            backgroundColor: COLORS.lightOrange,
                            px: 1,
                            py: 0.5,
                            borderRadius: 2,
                            display: "inline-block",
                          }}>
                            {planData.validityDays} Days
                          </Typography>
                        </Box>
                      </TableCell>
                    )}

                    {!renderedLabels.has(lbl) &&
                      (() => {
                        renderedLabels.add(lbl);
                        return (
                          <TableCell
                            key={`label-${lbl}`}
                            rowSpan={labelRowSpanMap[lbl]}
                            align="center"
                            sx={{ ...bodyCellSx, verticalAlign: "middle" }}
                          >
                            <Chip
                              label={lbl}
                              size="small"
                              sx={{
                                fontSize: "0.68rem",
                                height: 24,
                                color: COLORS.black,
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                        );
                      })()}

                    <TableCell sx={bodyCellSx}>
                      <Chip
                        label={rangeGroup.range}
                        size="small"
                        sx={{
                          fontSize: "0.68rem",
                          height: 24,
                          backgroundColor: COLORS.lightOrange,
                          color: COLORS.black,
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>

                    <TableCell align="center" sx={bodyCellSx}>
                      {rangeGroup.items[0]?.isListingPlan ? (
                        <Typography sx={{ fontSize: TEXT_SIZES.small, fontWeight: 700 }}>
                          ALL STATES
                        </Typography>
                      ) : (
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.3 }}>
                          <Typography sx={{ fontSize: TEXT_SIZES.small, fontWeight: 700 }}>
                            {rangeGroup.totalStates}
                          </Typography>
                          <Tooltip title="View states" arrow>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                const allStatesList = [
                                  ...new Set(rangeGroup.items.flatMap((item) => item.states || [])),
                                ];
                                handleShowStates(e, allStatesList);
                              }}
                              sx={{ p: 0.2 }}
                            >
                              <VisibilityIcon sx={{ fontSize: "0.8rem", color: COLORS.primary }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </TableCell>

                    {idx === 0 && (
                      <TableCell
                        align="center"
                        rowSpan={sortedRanges.length}
                        sx={{ ...bodyCellSx, verticalAlign: "middle" }}
                      >
                        {rangeGroup.items[0]?.isListingPlan ? (
                          <Typography sx={{ fontSize: TEXT_SIZES.small, fontWeight: 700 }}>-</Typography>
                        ) : (
                          <>
                            <Typography sx={{ fontSize: TEXT_SIZES.small, fontWeight: 700 }}>
                              {typeof planData.totalPlanLeads === "number"
                                ? planData.totalPlanLeads.toLocaleString("en-IN")
                                : planData.totalPlanLeads}
                            </Typography>
                            <Typography sx={{ fontSize: "0.55rem", color: COLORS.grey[600], mt: 0.5 }}>
                              {planData.lastSelectedLeads} × {planData.totalPlanStates} ={" "}
                              {planData.totalPlanLeads.toLocaleString("en-IN")}
                            </Typography>
                          </>
                        )}
                      </TableCell>
                    )}

                    {!renderedSubtotals.has(lbl) &&
                      (() => {
                        renderedSubtotals.add(lbl);
                        return (
                          <TableCell
                            key={`subtotal-${lbl}`}
                            align="right"
                            rowSpan={labelRowSpanMap[lbl]}
                            sx={{ ...bodyCellSx, verticalAlign: "middle" }}
                          >
                            <Typography sx={{ fontSize: TEXT_SIZES.small, fontWeight: 700, color: COLORS.secondaryDark, whiteSpace: "nowrap" }}>
                              ₹{(labelSubtotalMap[lbl] || 0).toLocaleString("en-IN")}
                            </Typography>
                          </TableCell>
                        );
                      })()}

                    <TableCell align="center" sx={bodyCellSx}>
                      <Tooltip title="Remove from summary" arrow>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setItemToRemove({
                              planName: planData.planName,
                              range: rangeGroup.range,
                              investmentRangeLabel: rangeGroup.investmentRangeLabel,
                              items: rangeGroup.items,
                            });
                            setOpenRemoveConfirmDialog(true);
                          }}
                          sx={{
                            color: COLORS.grey[600],
                            p: 0.3,
                            "&:hover": { color: COLORS.primary, backgroundColor: COLORS.lightOrange },
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );

                return row;
              });

              rangeRows.push(
                <TableRow key={`${planId}-spacer`} sx={{ height: 6 }}>
                  <TableCell colSpan={7} sx={{ p: 0, border: "none", backgroundColor: "transparent" }} />
                </TableRow>
              );

              return rangeRows;
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4, borderBottom: "none" }}>
                <Typography sx={{ color: COLORS.grey[500], fontSize: TEXT_SIZES.small }}>
                  No items added yet. Select investment ranges and click "Add" to proceed.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // ─── RENDER ──────────────────────────────────────────────────────────
  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Box
        ref={paymentSummaryRef}
        sx={{
          mb: { xs: 2, sm: 9 },
          width: "100%",
          maxWidth: "1350px",
          mt:{xs:-1, sm:0},
          px: { xs: 0, sm: 2 },
        }}
      >
        {/* ── Wrap entire summary in mobile accordion ── */}
        <SectionAccordion title="Summary" defaultExpanded COLORS={COLORS}>
          {/* Header */}
          <Box sx={{ mb: 2, pt: { xs: 1, sm: 0 } }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: COLORS.black, mb: 1, fontSize: TEXT_SIZES.xl, ml:{xs:1,sm:0} }}
            >
              Selected Plan Summary
            </Typography>
            <Divider sx={{ borderColor: COLORS.secondary, borderWidth: 2, width: 100, mb: 2 }} />
          </Box>

          {/* Responsive: accordion on mobile, table on desktop */}
          {isMobile ? renderMobileAccordion() : renderDesktopTable()}
        </SectionAccordion>
      </Box>
    </Box>
  );
};

export default PaymentSummaryTable;