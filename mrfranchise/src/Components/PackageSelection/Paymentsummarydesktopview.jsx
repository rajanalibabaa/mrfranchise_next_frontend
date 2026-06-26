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

        <TableHead>
          <TableRow
            sx={{
              background: `linear-gradient(135deg, ${COLORS.secondary} 0%, ${COLORS.secondaryDark} 100%)`,
            }}
          >
            {[
              { label: "Campaing Period", align: "center" },
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

        <TableBody>
          {paymentSummary.length > 0 ? (
            Object.entries(groupedByPlan).map(([planId, planData]) => {
              const { sortedRanges, labelSubtotalMap } = buildSortedRanges(planId, planData);

              console.log("planData:", planData);
console.log("sortedRanges sample:", sortedRanges[0]);
console.log("item sample:", sortedRanges[0]?.items[0]);

              const labelRowSpanMap = {};
              sortedRanges.forEach((rg) => {
                const lbl = rg.investmentRangeLabel || "—";
                labelRowSpanMap[lbl] = (labelRowSpanMap[lbl] || 0) + 1;
              });

              const renderedLabels = new Set();
              const renderedSubtotals = new Set();
              const renderedLeadLabels = new Set();

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
                          <Typography
                            sx={{
                              fontSize: "1.4rem",
                              fontWeight: 600,
                              color: COLORS.primary,
                              px: 1,
                              py: 0.5,
                              borderRadius: 2,
                              textAlign: "center",
                            }}
                          >
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
                            <Typography
                              size="small"
                              sx={{
                                fontSize: "1rem",
                                height: 24,
                                color: COLORS.black,
                                fontWeight: 600,
                              }}
                            >
                              {lbl}
                            </Typography>
                          </TableCell>
                        );
                      })()}

                    <TableCell sx={bodyCellSx}>
                      <Typography
                        sx={{
                          fontSize: "1rem",
                          height: 24,
                          textAlign: "center",
                          color: COLORS.black,
                          fontWeight: 600,
                          alignItems: "center",
                        }}
                      >
                        {rangeGroup.range}
                      </Typography>
                    </TableCell>

                    <TableCell align="center" sx={bodyCellSx}>
                      {rangeGroup.items[0]?.isListingPlan ? (
                        <Typography sx={{ fontSize: TEXT_SIZES.small, fontWeight: 700 }}>
                          ALL STATES
                        </Typography>
                      ) : (
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.3 }}>
                          <Typography sx={{ fontSize: "1rem", fontWeight: 700 }}>
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
                              <VisibilityIcon sx={{ fontSize: "1rem", color: COLORS.primary }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </TableCell>

    {!renderedLeadLabels.has(lbl) &&
  (() => {
    renderedLeadLabels.add(lbl);

    const labelRanges = sortedRanges.filter(
      (rg) => (rg.investmentRangeLabel || "—") === lbl
    );
    const isListing = labelRanges[0]?.items[0]?.isListingPlan;

    const leadsPerState = planData.lastSelectedLeads ?? 0;

    // ✅ Deduplicate states within this label only
    const uniqueStates = new Set(
      labelRanges.flatMap((rg) => rg.items.flatMap((it) => it.states || []))
    );
    const labelTotalStates = uniqueStates.size;
    const labelTotalLeads = leadsPerState * labelTotalStates;

    return (
      <TableCell
        key={`leads-${lbl}`}
        align="center"
        rowSpan={labelRowSpanMap[lbl]}
        sx={{ ...bodyCellSx, verticalAlign: "middle" }}
      >
        {isListing ? (
          <Typography sx={{ fontSize: "1rem", fontWeight: 700 }}>-</Typography>
        ) : (
          <>
            <Typography sx={{ fontSize: "1rem", fontWeight: 700 }}>
              {labelTotalLeads.toLocaleString("en-IN")}
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", color: COLORS.grey[600], mt: 0.5 }}>
              {leadsPerState} × {labelTotalStates} = {labelTotalLeads.toLocaleString("en-IN")}
            </Typography>
          </>
        )}
      </TableCell>
    );
  })()}

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
                            <Typography
                              sx={{
                                fontSize: "1rem",
                                fontWeight: 700,
                                color: COLORS.secondaryDark,
                                whiteSpace: "nowrap",
                                textAlign: "center",
                              }}
                            >
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
                          <DeleteIcon sx={{ fontSize: 22 }} />
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
};

export default PaymentSummaryDesktopView;