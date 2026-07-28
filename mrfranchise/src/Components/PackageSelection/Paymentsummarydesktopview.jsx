import React from "react";
import {
  Box,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  IconButton,
  Divider,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

const PaymentSummaryDesktopView = ({
  paymentSummary = [],
  groupedByPlan,
  buildSortedRanges,
  COLORS,
  TEXT_SIZES,
  handleShowStates,
  setItemToRemove,
  setOpenRemoveConfirmDialog,
}) => {
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

  // ─── helper: group sortedRanges by investmentRangeLabel ───────────────────
  const groupRangesByLabel = (sortedRanges) => {
    const groups = [];
    const seen = new Map(); // label → group index

    sortedRanges.forEach((rg) => {
      const lbl = rg.investmentRangeLabel || "—";
      if (!seen.has(lbl)) {
        seen.set(lbl, groups.length);
        groups.push({ label: lbl, ranges: [] });
      }
      groups[seen.get(lbl)].ranges.push(rg);
    });

    return groups;
  };

  return (
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

        {/* ── TABLE HEAD ─────────────────────────────────────────────────── */}
        <TableHead>
          <TableRow
            sx={{
              background: `linear-gradient(135deg, ${COLORS.secondary} 0%, ${COLORS.secondaryDark} 100%)`,
            }}
          >
            {[
              { label: "Campaign Period", align: "center" },
              { label: "Selected Investment Group", align: "center" },
              { label: "Selected Investment Range", align: "center" },
              { label: "Total States", align: "center" },
              { label: "Total Leads", align: "center" },
              { label: "Total (₹)", align: "center" },
              { label: "Actions", align: "center" },
            ].map(({ label, align }) => (
              <TableCell key={label} align={align} sx={headerCellSx}>
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* ── TABLE BODY ─────────────────────────────────────────────────── */}
        <TableBody>
          {paymentSummary.length > 0 ? (
            Object.entries(groupedByPlan).map(([rawPlanId, planData]) => {
              const planId = rawPlanId.split("__")[0];

              const { sortedRanges } = buildSortedRanges(planId, planData);
              // Group ranges by their investment label
              const labelGroups = groupRangesByLabel(sortedRanges);

              // total row count for this plan (for Campaign Period rowSpan)
              // each label group → ranges.length rows + 1 divider row (except last)
              const totalDataRows = sortedRanges.length;
              const totalRows =
                totalDataRows + Math.max(labelGroups.length - 1, 0); // dividers

              let campaignPeriodRendered = false;
              const allRows = [];

              labelGroups.forEach((group, groupIdx) => {
                const { label: lbl, ranges: groupRanges } = group;

                // ── unique states & leads for this label group ───────────
                const uniqueStates = new Set(
                  groupRanges.flatMap((rg) =>
                    rg.items.flatMap((it) => it.states || []),
                  ),
                );
                const leadsPerState = planData.lastSelectedLeads ?? 0;
                const labelTotalStates = uniqueStates.size;
                const labelTotalLeads = leadsPerState * labelTotalStates;

                const isListing = groupRanges[0]?.items[0]?.isListingPlan;

                // find directly by planId + investmentRangeLabel
                const matchedSummary = paymentSummary.find((item) => {
                  // LISTING PLAN
                  if (isListing) {
                    return (
                      item.groupKey === `listing-${item.planId}` &&
                      item.investmentRangeLabel === lbl
                    );
                  }

                  // LEAD PLAN
                  return (
                    item.planId === planId && item.investmentRangeLabel === lbl
                  );
                });

                let labelSubtotal = 0;
// console.log("MatchedSummary", matchedSummary);
                // if (matchedSummary) {
                //   if (matchedSummary.packagesType === "LISTING") {
                //     // direct amount
                //     labelSubtotal = matchedSummary.amount;
                //   } else {
                //     // lead calculation
                //     labelSubtotal =
                //       (matchedSummary.pricePerState /
                //         matchedSummary.basicLeadCount) *
                //       matchedSummary.totalStates *
                //       matchedSummary.selectedLeads;
                //   }
                // }

                // rowSpan for label-level cells
             if (matchedSummary) {
  labelSubtotal = matchedSummary.amount ?? 0;
}
                const labelRowSpan = groupRanges.length;

                // ── render each range row inside this group ──────────────
                groupRanges.forEach((rangeGroup, rangeIdx) => {
                  const isFirstInGroup = rangeIdx === 0;
                  const isFirstOverall =
                    !campaignPeriodRendered && isFirstInGroup && groupIdx === 0;

                  if (isFirstOverall) campaignPeriodRendered = true;

                  allRows.push(
                    <TableRow
                      key={`${planId}-${lbl}-${rangeGroup.range}-${rangeIdx}`}
                      sx={{
                        transition: "background-color 0.15s",
                        // subtle alternating bg per label group
                        backgroundColor:
                          groupIdx % 2 === 0
                            ? "transparent"
                            : `${COLORS.secondary}08`,
                      }}
                    >
                      {/* ── Campaign Period (spans ALL rows of this plan) ── */}
                      {groupIdx === 0 && rangeIdx === 0 && (
                        <TableCell
                          rowSpan={totalRows}
                          sx={{
                            ...bodyCellSx,
                            verticalAlign: "middle",
                            borderRight: `2px solid ${COLORS.border}`,
                            left: 0,
                            zIndex: 1,
                            backgroundColor: COLORS.white,
                            boxShadow: `2px 0 6px -2px ${COLORS.shadow}`,
                            minWidth: 140,
                            textAlign: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "1.2rem",
                              fontWeight: 600,
                              color: COLORS.primary,
                              px: 1,
                              py: 0.5,
                              borderRadius: 2,
                            }}
                          >
                            {planData.validityDays} Days campaign
                          </Typography>
                        </TableCell>
                      )}

                      {/* ── Investment Group Label (spans rows in this group) ── */}
                      {isFirstInGroup && (
                        <TableCell
                          rowSpan={labelRowSpan}
                          align="center"
                          sx={{
                            ...bodyCellSx,
                            verticalAlign: "middle",
                            borderLeft:
                              groupIdx > 0
                                ? `3px solid ${COLORS.secondary}`
                                : "none",
                            backgroundColor:
                              groupIdx % 2 === 0
                                ? "transparent"
                                : `${COLORS.secondary}08`,
                          }}
                        >
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              px: 1.5,
                              py: 0.4,
                              borderRadius: "20px",
                              backgroundColor: `${COLORS.secondary}18`,
                              border: `1.5px solid ${COLORS.secondary}40`,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "0.9rem",
                                fontWeight: 700,
                                color: COLORS.secondaryDark,
                              }}
                            >
                              {lbl}
                            </Typography>
                          </Box>
                        </TableCell>
                      )}

                      {/* ── Investment Range ── */}
                      <TableCell sx={bodyCellSx}>
                        <Typography
                          sx={{
                            fontSize: "0.95rem",
                            textAlign: "center",
                            color: COLORS.black,
                            fontWeight: 600,
                          }}
                        >
                          {rangeGroup.range}
                        </Typography>
                      </TableCell>

                      {/* ── Total States (per range row) ── */}
                      <TableCell align="center" sx={bodyCellSx}>
                        {isListing ? (
                          <Typography
                            sx={{ fontSize: TEXT_SIZES.small, fontWeight: 700 }}
                          >
                            ALL STATES
                          </Typography>
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 0.3,
                            }}
                          >
                            <Typography
                              sx={{ fontSize: "1rem", fontWeight: 700 }}
                            >
                              {rangeGroup.totalStates}
                            </Typography>
                            <Tooltip title="View states" arrow>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  const allStatesList = [
                                    ...new Set(
                                      rangeGroup.items.flatMap(
                                        (item) => item.states || [],
                                      ),
                                    ),
                                  ];
                                  handleShowStates(e, allStatesList);
                                }}
                                sx={{ p: 0.2 }}
                              >
                                <VisibilityIcon
                                  sx={{
                                    fontSize: "1rem",
                                    color: COLORS.primary,
                                  }}
                                />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        )}
                      </TableCell>

                      {/* ── Total Leads (spans label group rows) ── */}
                      {isFirstInGroup && (
                        <TableCell
                          align="center"
                          rowSpan={labelRowSpan}
                          sx={{
                            ...bodyCellSx,
                            verticalAlign: "middle",
                            backgroundColor:
                              groupIdx % 2 === 0
                                ? "transparent"
                                : `${COLORS.secondary}08`,
                          }}
                        >
                          {isListing ? (
                            <Typography
                              sx={{ fontSize: "1rem", fontWeight: 700 }}
                            >
                              —
                            </Typography>
                          ) : (
                            <Box sx={{ textAlign: "center" }}>
                              <Typography
                                sx={{
                                  fontSize: "1rem",
                                  fontWeight: 700,
                                  color: COLORS.black,
                                }}
                              >
                                {labelTotalLeads.toLocaleString("en-IN")}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: "0.7rem",
                                  color: COLORS.black[500],
                                  mt: 0.3,
                                  lineHeight: 1.3,
                                }}
                              >
                                {leadsPerState}Leads × {labelTotalStates}states {" "}
                                {/* {labelTotalLeads.toLocaleString("en-IN")} */}
                              </Typography>
                            </Box>
                          )}
                        </TableCell>
                      )}

                      {/* ── Total ₹ (spans label group rows) ── */}
                      {isFirstInGroup && (
                        <TableCell
                          align="center"
                          rowSpan={labelRowSpan}
                          sx={{
                            ...bodyCellSx,
                            verticalAlign: "middle",
                            backgroundColor:
                              groupIdx % 2 === 0
                                ? "transparent"
                                : `${COLORS.secondary}08`,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "1rem",
                              fontWeight: 700,
                              color: COLORS.secondaryDark,
                              whiteSpace: "nowrap",
                            }}
                          >
                            ₹{labelSubtotal.toLocaleString("en-IN")}
                          </Typography>
                        </TableCell>
                      )}

                      {/* ── Actions ── */}
                      <TableCell align="center" sx={bodyCellSx}>
                        <Tooltip title="Remove from summary" arrow>
                          <IconButton
                            size="small"
                           onClick={() => {
  setItemToRemove({
    planName: planData.planName,
    range: rangeGroup.range,
    investmentRange: rangeGroup.range,
    investmentRangeLabel: rangeGroup.investmentRangeLabel,
    items: rangeGroup.items,
    totalLeads: labelTotalLeads,
    totalAmount: labelSubtotal,
    validityDays: planData.validityDays,
  });
  setOpenRemoveConfirmDialog(true);
}}
                            sx={{
                              color: COLORS.grey[600],
                              p: 0.3,
                              "&:hover": {
                                color: COLORS.primary,
                                backgroundColor: COLORS.lightOrange,
                              },
                            }}
                          >
                            <DeleteIcon sx={{ fontSize: 22 }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>,
                  );
                });

                // ── Divider row between label groups ──────────────────────
                if (groupIdx < labelGroups.length - 1) {
                  allRows.push(
                    <TableRow
                      key={`${planId}-divider-${groupIdx}`}
                      sx={{ height: 0 }}
                    >
                      {/* skip col-0 (Campaign Period is rowSpanned) */}
                      <TableCell
                        colSpan={6}
                        sx={{
                          p: 0,
                          border: "none",
                        }}
                      >
                        <Box
                          sx={{
                            height: "2px",
                            mx: 1,
                            background: `linear-gradient(90deg, transparent, ${COLORS.secondary}60, ${COLORS.secondaryDark}80, ${COLORS.secondary}60, transparent)`,
                            // borderRadius: "2px",
                          }}
                        />
                      </TableCell>
                    </TableRow>,
                  );
                }
              });

              // ── Spacer between plans ─────────────────────────────────────
              // allRows.push(
              //   <TableRow key={`${planId}-spacer`} sx={{ height: 8 }}>
              //     <TableCell
              //       colSpan={7}
              //       sx={{
              //         p: 0,
              //         border: "none",
              //         backgroundColor: "transparent",
              //       }}
              //     />
              //   </TableRow>
              // );

              return allRows;
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                align="center"
                sx={{ py: 4, borderBottom: "none" }}
              >
                <Typography
                  sx={{
                    color: COLORS.grey[500],
                    fontSize: TEXT_SIZES.small,
                  }}
                >
                  No items added yet. Select investment ranges and click "Add"
                  to proceed.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PaymentSummaryDesktopView;
