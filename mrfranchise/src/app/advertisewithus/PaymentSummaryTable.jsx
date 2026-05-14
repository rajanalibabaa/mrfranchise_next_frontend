import React from "react";
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
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

const PaymentSummaryTable = ({
  paymentSummary = [],
  paymentSummaryRef,
  COLORS,
  TEXT_SIZES,
  handleShowStates,
  setItemToRemove,
  setOpenRemoveConfirmDialog,
}) => {
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

  // Add all items first
  group.items.forEach((item) => {
    groupedByPlan[group.planId].items.push({
      ...item,
      pricePerState: group.pricePerState,
      validityDays: group.validityDays,
    });
  });

  // Collect ALL unique states across ALL items in this plan
  const uniqueStatesSet = new Set();
  groupedByPlan[group.planId].items.forEach((item) => {
    if (item.states && Array.isArray(item.states)) {
      item.states.forEach(state => uniqueStatesSet.add(state));
    }
  });

  const uniqueStatesCount = uniqueStatesSet.size;

  // Calculate totals using unique states count (avoiding duplicates)
  groupedByPlan[group.planId].items.forEach((item) => {
    const divisor = item.selectedLeads || 1;
    
    groupedByPlan[group.planId].totalPlanAmount +=
      (group.pricePerState / divisor) * uniqueStatesCount * (item.selectedLeads || 0);
    
    groupedByPlan[group.planId].totalPlanLeads +=
      (item.selectedLeads * uniqueStatesCount) || 0;
  });

  groupedByPlan[group.planId].totalPlanStates = uniqueStatesCount;
});

  let rowIndex = 0;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Box
        ref={paymentSummaryRef}
        sx={{
          mb: 4,
          width: "1200px",
          maxWidth: "90%",
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: COLORS.black,
              mb: 1,
              fontSize: TEXT_SIZES.xl,
            }}
          >
            Selected Plan Summary
          </Typography>

          <Divider
            sx={{
              borderColor: COLORS.secondary,
              borderWidth: 2,
              width: 100,
              mb: 2,
            }}
          />
        </Box>

        {/* Table */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            border: `1px solid ${COLORS.border}`,
            borderRadius: 2,
            boxShadow: `0 4px 12px ${COLORS.shadow}`,
            overflow: "hidden",
            mb: 3,
          }}
        >
          <Table sx={{ borderCollapse: "collapse" }}>
            {/* Table Head */}
            <TableHead>
              <TableRow
                sx={{
                  background: `linear-gradient(135deg, ${COLORS.secondary} 0%, ${COLORS.secondaryDark} 100%)`,
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: TEXT_SIZES.small,
                    color: COLORS.white,
                    py: 1,
                    width: "25%",
                    borderBottom: "none",
                  }}
                >
                  Selected Plan
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 700,
                    fontSize: TEXT_SIZES.small,
                    color: COLORS.white,
                    py: 1,
                    width: "15%",
                    borderBottom: "none",
                  }}
                >
                  Investment Range Label
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: TEXT_SIZES.small,
                    color: COLORS.white,
                    py: 1,
                    width: "20%",
                    borderBottom: "none",
                  }}
                >
                  Investment Range
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 700,
                    fontSize: TEXT_SIZES.small,
                    color: COLORS.white,
                    py: 1,
                    width: "10%",
                    borderBottom: "none",
                  }}
                >
                  States
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 700,
                    fontSize: TEXT_SIZES.small,
                    color: COLORS.white,
                    py: 1,
                    width: "15%",
                    borderBottom: "none",
                  }}
                >
                  Leads
                </TableCell>

                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 700,
                    fontSize: TEXT_SIZES.small,
                    color: COLORS.white,
                    py: 1,
                    width: "20%",
                    borderBottom: "none",
                  }}
                >
                  Subtotal (₹)
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 700,
                    fontSize: TEXT_SIZES.small,
                    color: COLORS.white,
                    py: 1,
                    width: "10%",
                    borderBottom: "none",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {paymentSummary.length > 0 ? (
                Object.entries(groupedByPlan).map(
                  ([planId, planData]) => {
 const groupedByRange = planData.items.reduce(
  (acc, item) => {
    const rangeKey = `${planId}_${item.range}`;

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
    
    // Calculate unique states for this specific range
    const uniqueStatesForRange = new Set();
    acc[rangeKey].items.forEach(i => {
      if (i.states && Array.isArray(i.states)) {
        i.states.forEach(s => uniqueStatesForRange.add(s));
      }
    });
    
    const uniqueRangeStatesCount = uniqueStatesForRange.size;
    acc[rangeKey].totalStates = uniqueRangeStatesCount;
    acc[rangeKey].totalLeads = (item.selectedLeads || 0) * uniqueRangeStatesCount;
    acc[rangeKey].totalAmount = (item.pricePerState || 0) * uniqueRangeStatesCount;

    return acc;
  },
  {}
);

                    const sortedRanges = Object.values(
                      groupedByRange
                    ).sort((a, b) => {
                      const order = [
                        "Upto 5 Lakhs",
                        "Rs. 50k - 2 Lakhs",
                        "Rs. 2 Lakhs - 5 Lakhs",
                        "Rs. 5 Lakhs - 10 Lakhs",
                        "Rs. 10 Lakhs - 20 Lakhs",
                        "Below 50k",
                      ];

                      return (
                        order.indexOf(a.range) -
                        order.indexOf(b.range)
                      );
                    });

                    const rangeRows = [];

                  sortedRanges.forEach((rangeGroup, idx) => {
  rangeRows.push(
    <TableRow
      key={`${planId}-${rangeGroup.range}`}
      sx={{
        backgroundColor: rowIndex % 2 === 0 ? COLORS.white : COLORS.grey[50],
        "&:hover": { backgroundColor: COLORS.lightGreen },
        "& td": { borderBottom: "none", py: 0.75 },
      }}
    >
      {/* Plan Name - only on first range */}
      {idx === 0 && (
        <TableCell
          rowSpan={sortedRanges.length}
          sx={{
            verticalAlign: "top",
            py: 0.75,
            borderRight: `2px solid ${COLORS.border}`,
            backgroundColor: rowIndex % 2 === 0 ? COLORS.white : COLORS.grey[50],
            borderBottom: "none",
          }}
        >
          <Box>
            <Typography sx={{ fontSize: TEXT_SIZES.small, fontWeight: 700, color: COLORS.black, mb: 0.3 }}>
              {planData.planName}
            </Typography>
            <Chip
              icon={<CalendarMonthRoundedIcon sx={{ fontSize: "0.65rem" }} />}
              label={`${planData.validityDays} Days`}
              size="small"
              sx={{ height: 20, fontSize: "0.6rem", backgroundColor: COLORS.lightOrange, color: COLORS.black, fontWeight: 500 }}
            />
          </Box>
        </TableCell>
      )}

      {/* Investment Label */}
      <TableCell sx={{ py: 0.75, borderBottom: "none" }}>
        <Chip
          label={rangeGroup.investmentRangeLabel || "—"}
          size="small"
          sx={{ fontSize: "0.68rem", height: 24, backgroundColor: COLORS.lightGreen, color: COLORS.black, fontWeight: 600 }}
        />
      </TableCell>

      {/* Investment Range */}
      <TableCell>
        <Chip
          label={rangeGroup.range}
          size="small"
          sx={{ fontSize: "0.68rem", height: 24, backgroundColor: COLORS.lightOrange, color: COLORS.black, fontWeight: 600 }}
        />
      </TableCell>

      {/* States */}
      <TableCell align="center">
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.3 }}>
          {rangeGroup.items[0]?.isListingPlan ? (
            <Typography sx={{ fontSize: TEXT_SIZES.small, fontWeight: 700 }}>ALL STATES</Typography>
          ) : (
            <>
              <Typography sx={{ fontSize: TEXT_SIZES.small, fontWeight: 700 }}>{rangeGroup.totalStates}</Typography>
              <Tooltip title="View states" arrow>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    const allStatesList = [...new Set(rangeGroup.items.flatMap((item) => item.states || []))];
                    handleShowStates(e, allStatesList);
                  }}
                  sx={{ p: 0.2 }}
                >
                  <VisibilityIcon sx={{ fontSize: "0.8rem", color: COLORS.primary }} />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </TableCell>

      {/* Leads */}
      <TableCell align="center">
        {rangeGroup.items[0]?.isListingPlan ? (
          <Typography sx={{ fontSize: TEXT_SIZES.small, fontWeight: 700 }}>-</Typography>
        ) : (
          <>
            <Typography sx={{ fontSize: TEXT_SIZES.small, fontWeight: 700 }}>
              {typeof rangeGroup.totalLeads === "number"
                ? rangeGroup.totalLeads.toLocaleString("en-IN")
                : rangeGroup.totalLeads}
            </Typography>
            <Typography sx={{ fontSize: "0.55rem", color: COLORS.grey[600], mt: 0.2 }}>
              {rangeGroup.selectedLeads} × {rangeGroup.totalStates}
            </Typography>
          </>
        )}
      </TableCell>

      {/* Subtotal - only on first range row, spans all ranges */}
      {idx === 0 && (
        <TableCell
          align="right"
          rowSpan={sortedRanges.length}
          sx={{ verticalAlign: "middle" }}
        >
          <Typography sx={{ fontSize: TEXT_SIZES.small, fontWeight: 700, color: COLORS.secondaryDark }}>
            ₹{planData.totalPlanAmount.toLocaleString("en-IN")}
          </Typography>
        </TableCell>
      )}

    {/* Actions - for each investment range */}
<TableCell
  align="center"
  sx={{ verticalAlign: "middle" }}
>
  <Tooltip title="Remove from summary" arrow>
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
      sx={{ color: COLORS.grey[600], p: 0.3, "&:hover": { color: COLORS.primary, backgroundColor: COLORS.lightOrange } }}
    >
      <DeleteIcon sx={{ fontSize: 18 }} />
    </IconButton>
  </Tooltip>
</TableCell>
    </TableRow>
  );

  rowIndex++;
});

                    rangeRows.push(
                      <TableRow
                        key={`${planId}-spacer`}
                        sx={{ height: 4 }}
                      >
                        <TableCell
                          colSpan={7}
                          sx={{
                            p: 0,
                            border: "none",
                            backgroundColor:
                              "transparent",
                          }}
                        />
                      </TableRow>
                    );

                    return rangeRows;
                  }
                )
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{
                      py: 4,
                      borderBottom: "none",
                    }}
                  >
                    <Typography
                      sx={{
                        color: COLORS.grey[500],
                        fontSize: TEXT_SIZES.small,
                      }}
                    >
                      No items added yet. Select investment
                      ranges and click "Add" to proceed.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default PaymentSummaryTable;