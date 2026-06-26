import React, { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Card,
  Collapse,
  Divider,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import GroupWorkIcon from "@mui/icons-material/GroupWork";

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

  // ─── Empty State ────────────────────────────────────────────────────────────
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
        <Typography
          sx={{ color: COLORS.grey[500], fontSize: TEXT_SIZES.small }}
        >
          No items added yet.
        </Typography>
        <Typography
          sx={{ color: COLORS.grey[400], fontSize: "0.72rem", mt: 0.5 }}
        >
          Select investment ranges and click "Add" to proceed.
        </Typography>
      </Box>
    );
  }

  // ─── Main Render ────────────────────────────────────────────────────────────
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {Object.entries(groupedByPlan).map(([planId, planData]) => {
        const { labelGroupMap } = buildSortedRanges(planId, planData);
        const isExpanded = expandedPlan === planId;
        const labelGroupEntries = Object.entries(labelGroupMap);

        return (
          <Card
            key={planId}
            elevation={0}
            sx={{
              border: `2px solid ${COLORS.secondary}`,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {/* ── Plan Header (Tap to expand) ──────────────────────────── */}
            <Box
              onClick={() => togglePlan(planId)}
              sx={{
                px: 2,
                py: 1.5,
                cursor: "pointer",
                background: `linear-gradient(135deg, ${COLORS.secondary}15 0%, ${COLORS.secondaryDark}10 100%)`,
                borderBottom: isExpanded
                  ? `1px solid ${COLORS.border}`
                  : "none",
                transition: "all 0.2s ease",
                "&:active": { opacity: 0.9 },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                {/* Left: Plan info */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 0.3,
                  }}
                >
                  {/* Plan Days */}
                  <Typography
                    sx={{
                      fontSize: "1.4rem",
                      fontWeight: 700,
                      color: COLORS.primary,
                      lineHeight: 1.1,
                    }}
                  >
                    {planData.validityDays} Days Plan
                  </Typography>

                  {/* Total Leads Summary */}
                  {/* <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.75,
                      mt: 0.3,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        color: COLORS.grey[500],
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                      }}
                    >
                      Total Leads
                    </Typography>
                    <Box
                      sx={{
                        height: 14,
                        width: "1.5px",
                        backgroundColor: COLORS.grey[300],
                        borderRadius: 1,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "1rem",
                        fontWeight: 800,
                        color: COLORS.secondaryDark,
                      }}
                    >
                      {typeof planData.totalPlanLeads === "number"
                        ? planData.totalPlanLeads.toLocaleString("en-IN")
                        : planData.totalPlanLeads}
                    </Typography>
                  </Box> */}

                  {/* Formula */}
                  <Typography
                    sx={{
                      fontSize: "0.7rem",
                      fontWeight: 500,
                      color: COLORS.grey[400],
                    }}
                  >
                    ({planData.lastSelectedLeads} leads/state ×{" "}
                    {planData.totalPlanStates} states)
                  </Typography>
                </Box>

                {/* Right: Arrow */}
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    backgroundColor: COLORS.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "transform 0.25s ease",
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <KeyboardArrowDownIcon
                    sx={{ color: COLORS.white, fontSize: "1.4rem" }}
                  />
                </Box>
              </Box>
            </Box>

            {/* ── Collapsible Body ─────────────────────────────────────── */}
            <Collapse in={isExpanded}>
              <Box sx={{ pb: 0.5 }}>
                {labelGroupEntries.map(([label, ranges], groupIdx) => {
                  const isLastGroup = groupIdx === labelGroupEntries.length - 1;

                  // ── Per-group calculations ──────────────────────────────
                  const uniqueStates = new Set(
                    ranges.flatMap((rg) =>
                      rg.items.flatMap((it) => it.states || [])
                    )
                  );
                  const pricePerState =
                    ranges[0]?.items[0]?.pricePerState ?? 0;
                  const leadsPerState = planData.lastSelectedLeads ?? 0;
                  const isListing = ranges[0]?.items[0]?.isListingPlan;

                  const groupTotalStates = uniqueStates.size;
                  const groupTotalLeads = leadsPerState * groupTotalStates;
                  const groupSubtotal = groupTotalStates * pricePerState;

                  return (
                    <Box key={label}>
                      {/* ── Investment Group Header ──────────────────────── */}
                      <Box
                        sx={{
                          px: 2,
                          py: 1.25,
                          backgroundColor: `${COLORS.secondary}12`,
                          borderTop: `1px solid ${COLORS.border}`,
                          borderBottom: `1px solid ${COLORS.border}`,
                        }}
                      >
                        {/* Group Label Row */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          {/* Label Badge */}
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0.5,
                              px: 1.25,
                              py: 0.35,
                              // borderRadius: "20px",
                              // backgroundColor: `${COLORS.secondary}25`,
                              // border: `1.5px solid ${COLORS.secondary}50`,
                            }}
                          >
                            {/* <GroupWorkIcon
                              sx={{
                                fontSize: "0.85rem",
                                color: COLORS.secondaryDark,
                              }}
                            /> */}
                            <Typography
                              sx={{
                                fontSize: "1rem",
                                fontWeight: 700,
                                color: COLORS.black,
                              }}
                            >
                              {label}
                            </Typography>
                          </Box>

                          {/* Group Subtotal */}
                          <Box sx={{ textAlign: "right" }}>
                            <Typography
                              sx={{
                                fontSize: "0.6rem",
                                fontWeight: 600,
                                color: COLORS.grey[500],
                                textTransform: "uppercase",
                                letterSpacing: 0.5,
                              }}
                            >
                            Total
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "1.1rem",
                                fontWeight: 800,
                                color: COLORS.secondaryDark,
                                lineHeight: 1.2,
                              }}
                            >
                              ₹{groupSubtotal.toLocaleString("en-IN")}
                            </Typography>
                          </Box>
                        </Box>

                        {/* ── Leads Info Card ──────────────────────────── */}
                        {!isListing && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              px: 1.5,
                              py: 0.75,
                              borderRadius: 1.5,
                              backgroundColor: COLORS.white,
                              border: `1px solid ${COLORS.border}`,
                            }}
                          >
                            {/* Leads label */}
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 0.1,
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "0.6rem",
                                  fontWeight: 700,
                                  color: COLORS.grey[500],
                                  textTransform: "uppercase",
                                  letterSpacing: 0.6,
                                }}
                              >
                                Group Leads
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: "1rem",
                                  fontWeight: 800,
                                  color: COLORS.black,
                                  lineHeight: 1.2,
                                }}
                              >
                                {groupTotalLeads.toLocaleString("en-IN")}
                              </Typography>
                            </Box>

                            {/* Divider */}
                            <Box
                              sx={{
                                height: 30,
                                width: "1px",
                                backgroundColor: COLORS.border,
                              }}
                            />

                            {/* Formula */}
                            <Box sx={{ textAlign: "center" }}>
                              {/* <Typography
                                sx={{
                                  fontSize: "0.6rem",
                                  fontWeight: 600,
                                  color: COLORS.grey[400],
                                  textTransform: "uppercase",
                                  letterSpacing: 0.5,
                                }}
                              >
                                Formula
                              </Typography> */}
                              <Typography
                                sx={{
                                  fontSize: "0.78rem",
                                  fontWeight: 600,
                                  color: COLORS.grey[600],
                                }}
                              >
                                {leadsPerState} × {groupTotalStates} ={" "}
                                {groupTotalLeads.toLocaleString("en-IN")}
                              </Typography>
                            </Box>

                            {/* Divider */}
                            <Box
                              sx={{
                                height: 30,
                                width: "1px",
                                backgroundColor: COLORS.border,
                              }}
                            />

                            {/* States count */}
                            <Box sx={{ textAlign: "right" }}>
                              <Typography
                                sx={{
                                  fontSize: "0.6rem",
                                  fontWeight: 700,
                                  color: COLORS.grey[500],
                                  textTransform: "uppercase",
                                  letterSpacing: 0.6,
                                }}
                              >
                                States
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: "1rem",
                                  fontWeight: 800,
                                  color: COLORS.black,
                                  lineHeight: 1.2,
                                }}
                              >
                                {groupTotalStates}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </Box>

                      {/* ── Range Rows ───────────────────────────────────── */}
                      <Box>
                        {/* Mini-table header */}
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 48px",
                            px: 2,
                            py: 0.6,
                            backgroundColor: `${COLORS.secondary}08`,
                            borderBottom: `1px solid ${COLORS.border}`,
                          }}
                        >
                          {["Investment Range", "States", "Action"].map(
                            (h, i) => (
                              <Typography
                                key={h}
                                sx={{
                                  fontSize: "0.6rem",
                                  fontWeight: 700,
                                  color: COLORS.grey[500],
                                  textTransform: "uppercase",
                                  letterSpacing: 0.5,
                                  textAlign:
                                    i === 0
                                      ? "left"
                                      : i === 1
                                      ? "center"
                                      : "center",
                                }}
                              >
                                {h}
                              </Typography>
                            )
                          )}
                        </Box>

                        {/* Each range row */}
                        {ranges.map((rangeGroup, idx) => {
                          const isLastInGroup = idx === ranges.length - 1;

                          return (
                            <Box
                              key={`${planId}-${rangeGroup.range}-${idx}`}
                              sx={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr 48px",
                                alignItems: "center",
                                px: 2,
                                py: 0.9,
                                borderBottom: !isLastInGroup
                                  ? `1px dashed ${COLORS.border}`
                                  : "none",
                                backgroundColor:
                                  idx % 2 !== 0
                                    ? `${COLORS.lightOrange}30`
                                    : COLORS.white,
                                transition: "background-color 0.15s",
                              }}
                            >
                              {/* Investment Range chip */}
                              <Typography
                               
                                sx={{
                                  fontSize: "0.79rem",
                                  height: 24,
                                  // backgroundColor: COLORS.lightOrange,
                                  color: COLORS.black,
                                  fontWeight: 600,
                                  // width: "fit-content",
                                  // maxWidth: "95%",
                                }}
                              >{rangeGroup.range}</Typography>

                              {/* States */}
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: 0.4,
                                }}
                              >
                                {rangeGroup.items[0]?.isListingPlan ? (
                                  <Typography
                                    sx={{
                                      fontSize: "0.75rem",
                                      fontWeight: 700,
                                      color: COLORS.black,
                                    }}
                                  >
                                    All States
                                  </Typography>
                                ) : (
                                  <>
                                    <Typography
                                      sx={{
                                        fontSize: "0.95rem",
                                        fontWeight: 700,
                                        color: COLORS.black,
                                        lineHeight: 1,
                                      }}
                                    >
                                      {rangeGroup.totalStates}
                                    </Typography>
                                    <IconButton
                                      size="small"
                                      onClick={(e) => {
                                        const allStatesList = [
                                          ...new Set(
                                            rangeGroup.items.flatMap(
                                              (item) => item.states || []
                                            )
                                          ),
                                        ];
                                        handleShowStates(e, allStatesList);
                                      }}
                                      sx={{
                                        p: 0.3,
                                        borderRadius: 1,
                                        "&:hover": {
                                          backgroundColor: `${COLORS.primary}20`,
                                        },
                                      }}
                                    >
                                      <VisibilityIcon
                                        sx={{
                                          fontSize: "0.95rem",
                                          color: COLORS.primary,
                                        }}
                                      />
                                    </IconButton>
                                  </>
                                )}
                              </Box>

                              {/* Delete Action */}
                              <Box
                                sx={{ display: "flex", justifyContent: "center" }}
                              >
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setItemToRemove({
                                      planName: planData.planName,
                                      range: rangeGroup.range,
                                      investmentRangeLabel:
                                        rangeGroup.investmentRangeLabel,
                                      items: rangeGroup.items,
                                    });
                                    setOpenRemoveConfirmDialog(true);
                                  }}
                                  sx={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 1.5,
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
                                  <DeleteIcon sx={{ fontSize: 15 }} />
                                </IconButton>
                              </Box>
                            </Box>
                          );
                        })}
                      </Box>

                      {/* ── Divider between investment groups ─────────────── */}
                      {/* {!isLastGroup && (
                        <Box
                          sx={{
                            px: 2,
                            py: 0.75,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            backgroundColor: `${COLORS.secondary}06`,
                          }}
                        >
                          <Box
                            sx={{
                              flex: 1,
                              height: "2px",
                              background: `linear-gradient(90deg, transparent, ${COLORS.secondary}70, transparent)`,
                              borderRadius: "2px",
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: "0.6rem",
                              fontWeight: 700,
                              color: COLORS.secondary,
                              textTransform: "uppercase",
                              letterSpacing: 1,
                              whiteSpace: "nowrap",
                            }}
                          >
                            Next Group
                          </Typography>
                          <Box
                            sx={{
                              flex: 1,
                              height: "2px",
                              background: `linear-gradient(90deg, transparent, ${COLORS.secondary}70, transparent)`,
                              borderRadius: "2px",
                            }}
                          />
                        </Box>
                      )} */}
                    </Box>
                  );
                })}
              </Box>
            </Collapse>
          </Card>
        );
      })}
    </Box>
  );
};

export default PaymentSummaryMobileView;