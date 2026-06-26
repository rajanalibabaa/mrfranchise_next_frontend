import React, { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Card,
  Collapse,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const PaymentSummaryMobileView = ({
  paymentSummary = [],
  groupedByPlan,
  buildSortedRanges,
  COLORS,
  TEXT_SIZES,
  handleShowStates,
  setItemToRemove,
  setOpenRemoveConfirmDialog,
}) => {
  const [expandedPlan, setExpandedPlan] = useState(null);

  const togglePlan = (planId) => {
    setExpandedPlan(expandedPlan === planId ? null : planId);
  };

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
    const isExpanded = expandedPlan === planId;

    return (
      <Card
        key={planId}
        elevation={0}
        sx={{
          p: 1,
          border: `2px solid ${COLORS.secondary}`,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box
          onClick={() => togglePlan(planId)}
          sx={{
            px: 2,
            py: 1,
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:active": { opacity: 0.95 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 0.5,
              flexDirection: "column",
            }}
          >
            <Box
              onClick={() => togglePlan(planId)}
              sx={{
                px: 0,
                py: 0,
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                "&:active": { opacity: 0.95 },
              }}
            >
              {/* Left: Plan name + Leads info stacked */}
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography sx={{ fontSize: "1.5rem", fontWeight: 600, color: COLORS.primary }}>
                  {planData.validityDays} Days Plan
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 500, letterSpacing: 0.5 }}>
                    TOTAL LEADS =
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    {typeof planData.totalPlanLeads === "number"
                      ? planData.totalPlanLeads.toLocaleString("en-IN")
                      : planData.totalPlanLeads}
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "text.secondary",
                    textAlign: "center",
                  }}
                >
                  ({planData.lastSelectedLeads} × {planData.totalPlanStates})
                </Typography>
              </Box>

              {/* Arrow: pushed to far right */}
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  backgroundColor: COLORS.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.25s ease",
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  flexShrink: 0,
                  marginLeft: "auto",
                }}
              >
                <KeyboardArrowDownIcon sx={{ color: COLORS.white, fontSize: "1.4rem" }} />
              </Box>
            </Box>
          </Box>
        </Box>

        <Collapse in={isExpanded}>
          <Box sx={{ px: 0, pb: 0.5 }}>
           {Object.entries(labelGroupMap).map(([label, ranges]) => {
  
  // ✅ Dedupe states across all ranges in this label
  const uniqueStates = new Set(
  ranges.flatMap((rg) => rg.items.flatMap((it) => it.states || []))
);
const pricePerState = ranges[0]?.items[0]?.pricePerState ?? 0;
const groupSubtotal = uniqueStates.size * pricePerState;

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
          <Typography sx={{ fontSize: "1.2rem", fontWeight: 700, color: COLORS.black }}>
            {label}
          </Typography>
          <Typography sx={{ fontSize: "1.2rem", fontWeight: 700, color: COLORS.secondaryDark }}>
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
                          px: 1,
                          py: 1.25,
                          borderBottom: !isLastInGroup ? `1px solid ${COLORS.primary}` : "none",
                          backgroundColor: idx % 2 !== 0 ? `${COLORS.lightOrange}40` : COLORS.white,
                        }}
                      >
                        {/* Table Header - only on first row */}
                        {idx === 0 && (
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr 48px",
                              px: 0.5,
                              pb: 0.75,
                              mb: 0.5,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                color: COLORS.grey[500],
                                textTransform: "uppercase",
                                letterSpacing: 0.5,
                              }}
                            >
                              Investment Range
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                color: COLORS.grey[500],
                                textTransform: "uppercase",
                                letterSpacing: 0.5,
                                textAlign: "center",
                              }}
                            >
                              States
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                color: COLORS.grey[500],
                                textTransform: "uppercase",
                                letterSpacing: 0.5,
                                textAlign: "center",
                              }}
                            >
                              Action
                            </Typography>
                          </Box>
                        )}

                        {/* Table Row */}
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 48px",
                            alignItems: "center",
                            px: 0.5,
                          }}
                        >
                          {/* Investment Range */}
                          <Chip
                            label={rangeGroup.range}
                            size="small"
                            sx={{
                              fontSize: "0.78rem",
                              height: 26,
                              backgroundColor: COLORS.lightOrange,
                              color: COLORS.black,
                              fontWeight: 600,
                              width: "fit-content",
                            }}
                          />

                          {/* States */}
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                            {rangeGroup.items[0]?.isListingPlan ? (
                              <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: COLORS.black }}>
                                All States
                              </Typography>
                            ) : (
                              <>
                                <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: COLORS.black, lineHeight: 1 }}>
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
                                    borderRadius: 1,
                                    "&:hover": { backgroundColor: `${COLORS.primary}25` },
                                  }}
                                >
                                  <VisibilityIcon sx={{ fontSize: "1rem", color: COLORS.primary }} />
                                </IconButton>
                              </>
                            )}
                          </Box>

                          {/* Action */}
                          <Box sx={{ display: "flex", justifyContent: "center" }}>
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
                                width: 32,
                                height: 32,
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
                              <DeleteIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
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

export default PaymentSummaryMobileView;