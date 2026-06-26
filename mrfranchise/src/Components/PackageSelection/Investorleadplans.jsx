"use client";

import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Chip,
  Button,
  Tooltip,
  IconButton,
  Typography,
  Card,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const InvestorLeadPlans = ({
  filteredPlans,
  selectedGroup,
  setSelectedGroup,
  selectedValidityDays,
  leadsDropdownData,
  selectedLeadsPerRange,
  checkedItems,
  setCheckedItems,
  paymentSummary,
  statesByInvestmentRange,
  movedGroupKeys,
  ficoInvestmentRanges,
  finalToken,
  detectedState,
  allStates,
  data,
  COLORS,
  TEXT_SIZES,
  getRangeKey,
  getStateCountForRange,
  getRowBackgroundColor,
  isFicoInvestmentRange,
  handleOpenStateModal,
  handleLeadsChange,
  handleAddSingleToPayment,
  setPendingSelection,
  setOpenConfirmDialog,
  openSnack,
  selectedListingPlanId,
}) => {
  if (!selectedGroup) {
    return (
      <Card
        elevation={0}
        sx={{
          border: `1px solid ${COLORS.border}`,
          borderRadius: 2,
          overflow: "visible",
          width: "100%",
          maxWidth: "1300px",
        }}
      >
        <Box
          sx={{
            p: 8,
            textAlign: "center",
            color: COLORS.grey[500],
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 400,
          }}
        >
          <InfoOutlinedIcon sx={{ fontSize: 80, mb: 2, color: COLORS.grey[400] }} />
          <Typography sx={{ fontSize: TEXT_SIZES.xl, fontWeight: 600 }}>
            Select a plan from the table to view investment ranges
          </Typography>
        </Box>
      </Card>
    );
  }

  const selectedPlan = filteredPlans.find((p) => p._id === selectedGroup);
  if (!selectedPlan) return null;

  // Merge leads from ALL packages and deduplicate
  const availableLeads = [
    ...new Set(
      selectedPlan.packages?.flatMap((pkg) => {
        const key = `${selectedPlan._id}_${pkg.investmentRangeLabel}`;
        return leadsDropdownData[key] || [];
      }) || [],
    ),
  ].sort((a, b) => a - b);

  const allPackagesFromPlan = [];
  selectedPlan.packages?.forEach((pkg) => {
    pkg.investmentRange?.forEach((range) => {
      allPackagesFromPlan.push({
        investmentRangeLabel: pkg.investmentRangeLabel,
        range: range,
        pkg: pkg,
      });
    });
  });

  const uniqueValidityDays = [
    ...new Set(
      selectedPlan.packages?.map((pkg) => pkg.validityDays).filter(Boolean),
    ),
  ];

  // Dynamically compile the deduplicated states and aggregates per investment group label
  const groupAggregates = {};
  allPackagesFromPlan.forEach((pkgItem) => {
    const label = pkgItem.investmentRangeLabel;
    if (!groupAggregates[label]) {
      groupAggregates[label] = {
        uniqueStatesSet: new Set(),
        hasAnyInPayment: false,
        allGroupItems: [],
      };
    }

    const key = getRangeKey(pkgItem.investmentRangeLabel, pkgItem.range, selectedPlan._id);
    let states = statesByInvestmentRange[key];

    if (!states || states.length === 0) {
      const matchingKey = Object.keys(statesByInvestmentRange).find((k) => {
        const parts = k.split("__");
        return (
          parts[parts.length - 1] === pkgItem.range &&
          parts[parts.length - 2] === pkgItem.investmentRangeLabel
        );
      });
      if (matchingKey) states = statesByInvestmentRange[matchingKey];
    }

    if (!states || states.length === 0) {
      if (!finalToken && detectedState) {
        states = [detectedState];
      } else {
        states = allStates.length > 0 ? allStates : [];
      }
    }

    const itemId = `${selectedPlan._id}-${pkgItem.investmentRangeLabel}-${pkgItem.range}`;
    const inPayment = paymentSummary.some((group) =>
      group.items.some((it) => it.id === itemId),
    );
    const isRecommended = isFicoInvestmentRange(pkgItem.range);

    groupAggregates[label].allGroupItems.push({
      pkgItem,
      states,
      inPayment,
      isRecommended,
    });

    if (inPayment) {
      groupAggregates[label].hasAnyInPayment = true;
      states.forEach((state) => groupAggregates[label].uniqueStatesSet.add(state));
    }
  });

  Object.keys(groupAggregates).forEach((label) => {
    const agg = groupAggregates[label];
    if (!agg.hasAnyInPayment) {
      const recommendedItems = agg.allGroupItems.filter((x) => x.isRecommended);
      const previewItems = recommendedItems.length > 0 ? recommendedItems : agg.allGroupItems;
      previewItems.forEach((x) => {
        x.states.forEach((state) => agg.uniqueStatesSet.add(state));
      });
    }
    agg.totalStatesCount = agg.uniqueStatesSet.size;
  });

  const profilePackages =
    ficoInvestmentRanges.length > 0
      ? allPackagesFromPlan.filter((item) => isFicoInvestmentRange(item.range))
      : allPackagesFromPlan;

  const labelCounts = {};
  profilePackages.forEach((item) => {
    labelCounts[item.investmentRangeLabel] =
      (labelCounts[item.investmentRangeLabel] || 0) + 1;
  });

  const totalRows = profilePackages.length;
  const renderedLabels = new Set();
  let firstRow = true;

  return (
    <Card
      elevation={0}
      sx={{
        border: `1px solid ${COLORS.border}`,
        borderRadius: 2,
        overflow: "visible",
        width: "100%",
        maxWidth: "1300px",
      }}
    >
      <Box>
        {/* Add New Investment Range Button */}
        {finalToken && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              px: 2,
              py: 1.5,
              borderBottom: `1px solid ${COLORS.border}`,
            }}
          >
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => {
                setPendingSelection(null);
                setOpenConfirmDialog(true);
              }}
              sx={{
                color: COLORS.white,
                fontWeight: 700,
                fontSize: TEXT_SIZES.small,
                borderRadius: 2,
                textTransform: "none",
                px: 2,
                backgroundColor: "#4cb04f",
                "&:hover": { backgroundColor: "#517b52" },
              }}
            >
              Add New Investment Range
            </Button>
          </Box>
        )}

        {/* Unified Table */}
<TableContainer
  component={Paper}
  elevation={0}
  sx={{
    boxShadow: "none",
    overflow: "auto",
    maxHeight: 500,

    // Scrollbar styling
    "&::-webkit-scrollbar": {
      width: 6,
      height: 6,
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#ffe0b2", // light orange to match table bg
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: COLORS.primary, // ← your primary color
      borderRadius: 4,
      "&:hover": {
        backgroundColor: COLORS.primaryDark,
      },
    },
  }}
>          <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
         <TableHead sx={{ position: "sticky", top: 0, zIndex: 2 }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: TEXT_SIZES.medium, color: COLORS.white, background: "linear-gradient(135deg, #fb8c00 0%, #ef6c00 100%)", py: 1.5, width: "5%", textAlign: "center", lineHeight: 1.5 }}>
                  Select<br />Plan
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: TEXT_SIZES.medium, color: COLORS.white, background: "linear-gradient(135deg, #fb8c00 0%, #ef6c00 100%)", width: "4%", textAlign: "center", lineHeight: 1.5 }}>
                  Select <br />Lead Per State
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: TEXT_SIZES.medium, color: COLORS.white, background: "linear-gradient(135deg, #fb8c00 0%, #ef6c00 100%)", px: 1.5, py: 1.5, width: "3%", textAlign: "center" }}>
                  Select Investment Range
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: TEXT_SIZES.xl, color: COLORS.white, background: "linear-gradient(135deg, #fb8c00 0%, #ef6c00 100%)", px: 1, py: 1.5, width: "1%", textAlign: "center" }}>
                  Select States
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: TEXT_SIZES.medium, color: COLORS.white, background: "linear-gradient(135deg, #4cb04f 0%, #2e7d32 100%)", px: 1, py: 1.5, width: "2.3%", textAlign: "center" }}>
                  Price per State
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: TEXT_SIZES.medium, color: COLORS.white, background: "linear-gradient(135deg, #4cb04f 0%, #2e7d32 100%)", px: 1, py: 1.5, width: "1.8%", textAlign: "center" }}>
                  Total Leads
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: TEXT_SIZES.medium, color: COLORS.white, background: "linear-gradient(135deg, #4cb04f 0%, #2e7d32 100%)", px: 1, py: 1.5, width: "2%", textAlign: "center" }}>
                  Total Amount
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: TEXT_SIZES.medium, color: COLORS.white, background: "linear-gradient(135deg, #4cb04f 0%, #2e7d32 100%)", px: 1, py: 1.5, width: "4%", textAlign: "center" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {profilePackages.map((item, idx) => {
                const itemId = `${selectedPlan._id}-${item.investmentRangeLabel}-${item.range}`;
                const stateCount = getStateCountForRange(
                  item.investmentRangeLabel,
                  item.range,
                  selectedPlan._id,
                );
                const inPayment = paymentSummary.some((group) =>
                  group.items.some(
                    (it) =>
                      it.investmentRangeLabel === item.investmentRangeLabel &&
                      it.range === item.range &&
                      group.planId === selectedPlan._id,
                  ),
                );

                const pricePerState = item.pkg?.amount || 0;
                const groupAgg = groupAggregates[item.investmentRangeLabel];
                const uniqueGroupStatesCount = groupAgg.totalStatesCount;

                const minLeads = availableLeads.length > 0 ? Math.min(...availableLeads) : 1;
                const divisor = minLeads > 0 ? minLeads : 1;

                const rangeSpecificKey = `plan-${selectedPlan._id}-${item.investmentRangeLabel}`;
                const groupSelectedLeads =
                  selectedLeadsPerRange[rangeSpecificKey] ||
                  (availableLeads.length > 0 ? availableLeads[0] : 0);
                const groupTotalLeads = groupSelectedLeads * uniqueGroupStatesCount;
                const groupTotalAmount =
                  (pricePerState / divisor) * uniqueGroupStatesCount * groupSelectedLeads;

                const isFirstInGroup = !renderedLabels.has(item.investmentRangeLabel);
                if (isFirstInGroup) renderedLabels.add(item.investmentRangeLabel);
                const rowSpan = labelCounts[item.investmentRangeLabel];
                const isFirstRowOfTable = idx === 0;
                if (firstRow) firstRow = false;

                return (
                  <TableRow
                    key={itemId}
                    sx={{
                      backgroundColor: getRowBackgroundColor(item.investmentRangeLabel, inPayment, idx),
                      transition: "all 0.3s ease",
                      "& td": { borderBottom: "none" },
                    }}
                  >
                  {/* Plan Selection Column */}
{isFirstRowOfTable && (
  <TableCell
    rowSpan={totalRows}
    sx={{
      px: 1.5,
      py: 0,
      borderRight: `2px solid ${COLORS.border}`,
      backgroundColor: "#ffe0b2",
      position: "relative",   // ← anchor for absolute child
    }}
  >
    {/* Absolute box fills the full rowSpan height */}
    <Box
      sx={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
        py: 2, px: 1.5,
      }}
    >
      {filteredPlans.map((plan) => {
        const uniqueValidityDaysForPlan = [
          ...new Set(plan.packages?.map((pkg) => pkg.validityDays).filter(Boolean)),
        ];
        return (
          <Box
            key={plan._id}
            onClick={() => setSelectedGroup(plan._id)}
            sx={{
              width: "85%",
              flex: 1,              // ← grows to fill available space equally
              maxHeight: 72,        // ← cap height so it doesn't stretch too tall
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              borderRadius: 1.5,
              cursor: "pointer",
              transition: "all 0.2s ease",
              backgroundColor: selectedGroup === plan._id ? COLORS.primary : COLORS.white,
              border: `1px solid ${selectedGroup === plan._id ? COLORS.primary : COLORS.border}`,
              boxShadow: selectedGroup === plan._id ? `0 2px 6px ${COLORS.shadow}` : "none",
              "&:hover": {
                backgroundColor: selectedGroup === plan._id ? COLORS.primaryDark : COLORS.lightOrange,
                transform: "translateX(2px)",
              },
            }}
          >
            <Typography
              sx={{
                fontSize: TEXT_SIZES.medium,
                fontWeight: 600,
                color: selectedGroup === plan._id ? COLORS.white : COLORS.black,
                lineHeight: 1.3,
              }}
            >
              {uniqueValidityDaysForPlan[0]} Days Campaign
            </Typography>
          </Box>
        );
      })}
    </Box>

    {/* Invisible spacer — gives the cell its minimum natural height */}
    <Box sx={{ visibility: "hidden", py: 2 }}>
      {filteredPlans.map((plan) => (
        <Box key={plan._id} sx={{ py: 4, mb: 1 }}>
          <Typography>&nbsp;</Typography>
        </Box>
      ))}
    </Box>
  </TableCell>
)}

                    {/* Investment Group / Leads Column */}
                    {isFirstInGroup && (() => {
                      return (
                        <TableCell
                          rowSpan={rowSpan}
                          sx={{
                            px: 0.5, py: 0.4, textAlign: "center", height: "20%",
                            backgroundColor: "#ffe0b2", width: "3%",
                            borderTop: isFirstInGroup && !isFirstRowOfTable ? `2px solid #b5d7b6` : "none",
                          }}
                        >
                   <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", gap: 3,mt:1 }}>
  {/* Leads Counter */}
  {availableLeads.length > 0 ? (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
      {/* <Typography sx={{ fontSize: TEXT_SIZES.xs, fontWeight: 600, color: COLORS.grey[600] }}>
        Leads per State
      </Typography> */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/* Minus Button */}
        <Box
          onClick={() => {
            const rangeSpecificKey = `plan-${selectedPlan._id}-${item.investmentRangeLabel}`;
            const isLockedInSummary = paymentSummary.some(
              (group) =>
                group.planId === selectedPlan._id &&
                group.investmentRangeLabel === item.investmentRangeLabel &&
                movedGroupKeys.includes(group.groupKey),
            );
            if (isLockedInSummary) {
              openSnack("Remove this range from the summary first to change leads", "warning");
              return;
            }
            const currentIndex = availableLeads.indexOf(
              selectedLeadsPerRange[rangeSpecificKey] ?? availableLeads[0]
            );
            if (currentIndex > 0) {
              handleLeadsChange(rangeSpecificKey, availableLeads[currentIndex - 1]);
            }
          }}
          sx={{
            width: 28, height: 28, borderRadius: "50%", display: "flex",
            alignItems: "center", justifyContent: "center",
            border: `1px solid ${COLORS.border}`, cursor: "pointer",
            backgroundColor: COLORS.white, fontWeight: 700, fontSize: "1.1rem",
            color: COLORS.black, userSelect: "none",
            "&:hover": { backgroundColor: COLORS.lightOrange },
          }}
        >
          −
        </Box>

        {/* Current Value Display */}
        <Box sx={{
          minWidth: 48, textAlign: "center", px: 1, py: 0.5,
          border: `1px solid ${COLORS.secondary}`, borderRadius: 1.5,
          backgroundColor: COLORS.secondary,
        }}>
          <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: COLORS.white }}>
            {(() => {
              const rangeSpecificKey = `plan-${selectedPlan._id}-${item.investmentRangeLabel}`;
              return selectedLeadsPerRange[rangeSpecificKey] ?? availableLeads[0];
            })()}
          </Typography>
        </Box>

        {/* Plus Button */}
        <Box
          onClick={() => {
            const rangeSpecificKey = `plan-${selectedPlan._id}-${item.investmentRangeLabel}`;
            const isLockedInSummary = paymentSummary.some(
              (group) =>
                group.planId === selectedPlan._id &&
                group.investmentRangeLabel === item.investmentRangeLabel &&
                movedGroupKeys.includes(group.groupKey),
            );
            if (isLockedInSummary) {
              openSnack("Remove this range from the summary first to change leads", "warning");
              return;
            }
            const currentIndex = availableLeads.indexOf(
              selectedLeadsPerRange[rangeSpecificKey] ?? availableLeads[0]
            );
            if (currentIndex < availableLeads.length - 1) {
              handleLeadsChange(rangeSpecificKey, availableLeads[currentIndex + 1]);
            }
          }}
          sx={{
            width: 28, height: 28, borderRadius: "50%", display: "flex",
            alignItems: "center", justifyContent: "center",
            border: `1px solid ${COLORS.border}`, cursor: "pointer",
            backgroundColor: COLORS.white, fontWeight: 700, fontSize: "1.1rem",
            color: COLORS.black, userSelect: "none",
            "&:hover": { backgroundColor: COLORS.lightOrange },
          }}
        >
          +
        </Box>
      </Box>
    </Box>
  ) : (
    <Typography sx={{ color: COLORS.grey[500], fontSize: TEXT_SIZES.small }}>No leads</Typography>
  )}

  {/* Investment Label */}
  <Typography sx={{ fontSize: TEXT_SIZES.medium, fontWeight: 700, color: COLORS.black, lineHeight: 1.2, textAlign: "center", mb: 1 }}>
    {item.investmentRangeLabel}
  </Typography>
</Box>
                        </TableCell>
                      );
                    })()}

                    {/* Investment Range with Checkbox */}
                    <TableCell
                      sx={{
                        px: 0.5, py: 0.4, verticalAlign: "middle",
                        backgroundColor: "#ffe0b2", width: "3%",
                        borderTop: isFirstInGroup && !isFirstRowOfTable ? `2px solid #b5d7b6` : "none",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 1 }}>
                        <Tooltip title={inPayment ? "Already added to cart" : "Add investment range to cart"} arrow>
                          <span>
                            <Checkbox
                              checked={checkedItems[itemId] || false}
                              onChange={(e) => {
                                if (inPayment) {
                                  openSnack(`${item.range} is already in your cart`, "warning");
                                  return;
                                }
                                if (e.target.checked) {
                                  setCheckedItems((prev) => ({ ...prev, [itemId]: true }));
                                  openSnack(`${item.range} selected`, "success");
                                } else {
                                  setCheckedItems((prev) => ({ ...prev, [itemId]: false }));
                                  openSnack(`${item.range} deselected`, "info");
                                }
                              }}
                              disabled={inPayment || !!selectedListingPlanId}
                              size="small"
                              sx={{
                                p: 0, m: 0, color: COLORS.primary,
                                "&.Mui-checked": { color: COLORS.secondary },
                                "&.Mui-disabled": { color: COLORS.secondary },
                              }}
                            />
                          </span>
                        </Tooltip>
                        <Typography sx={{ fontSize: TEXT_SIZES.small, fontWeight: 600, color: COLORS.black, lineHeight: 1.3, whiteSpace: "nowrap" }}>
                          {item.range}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* States */}
                    <TableCell
                      sx={{
                        px: 0.5, py: 0.4, height: "20%",
                        backgroundColor: "#ffe0b2",
                        borderTop: isFirstInGroup && !isFirstRowOfTable ? `2px solid #b5d7b6` : "none",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                        <Typography sx={{ fontSize: TEXT_SIZES.xl, color: COLORS.black, fontWeight: 600 }}>
                          {stateCount}
                        </Typography>
                        <Tooltip title="Select States" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenStateModal(item.investmentRangeLabel, item.range, selectedPlan._id)}
                            sx={{ p: 0.3, "&:hover": { backgroundColor: COLORS.lightOrange } }}
                          >
                            <EditIcon sx={{ fontSize: TEXT_SIZES.medium, color: COLORS.primary }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>

                    {/* Price per State */}
                    {isFirstInGroup && (
                      <TableCell
                        rowSpan={rowSpan}
                        sx={{
                          px: 0.5, py: 0.4, backgroundColor: "#bfe5c1",
                          textAlign: "center", verticalAlign: "middle",
                          borderTop: !isFirstRowOfTable ? `2px solid #b5d7b6` : "none",
                        }}
                      >
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <Typography sx={{ fontSize: TEXT_SIZES.xl, fontWeight: 700, color: COLORS.black }}>
                            ₹{uniqueGroupStatesCount > 0
                              ? (groupTotalAmount / uniqueGroupStatesCount).toLocaleString("en-IN")
                              : (0).toLocaleString("en-IN")}
                          </Typography>
                          <Typography sx={{ fontSize: TEXT_SIZES.xs, fontWeight: 500, color: COLORS.black, mt: 0.5 }}>
                            ({groupSelectedLeads} Leads)
                          </Typography>
                        </Box>
                      </TableCell>
                    )}

                    {/* Total Leads */}
                    {isFirstInGroup && (
                      <TableCell
                        rowSpan={rowSpan}
                        sx={{
                          px: 0.5, py: 0.4, textAlign: "center", verticalAlign: "middle",
                          backgroundColor: "#bfe5c1", width: "4%",
                          borderTop: !isFirstRowOfTable ? `2px solid #b5d7b6` : "none",
                        }}
                      >
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                          <Typography sx={{ fontSize: TEXT_SIZES.xl, fontWeight: 700, color: COLORS.black }}>
                            {groupTotalLeads}
                          </Typography>
                          <Typography sx={{ fontSize: TEXT_SIZES.xs, fontWeight: 500, color: COLORS.black }}>
                            ({uniqueGroupStatesCount} States)
                          </Typography>
                        </Box>
                      </TableCell>
                    )}

                    {/* Total Amount */}
                    {isFirstInGroup && (
                      <TableCell
                        rowSpan={rowSpan}
                        sx={{
                          px: 0.5, py: 0.4, textAlign: "center", verticalAlign: "middle",
                          backgroundColor: "#bfe5c1", width: "4%",
                          borderTop: !isFirstRowOfTable ? `2px solid #b5d7b6` : "none",
                        }}
                      >
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                          <Typography sx={{ fontSize: TEXT_SIZES.xl, fontWeight: 700 }}>
                            ₹ {groupTotalAmount.toLocaleString("en-IN")}
                          </Typography>
                          <Typography sx={{ fontSize: TEXT_SIZES.xs, fontWeight: 500, color: COLORS.black }}>
                            ({uniqueValidityDays[0]} Days Plan)
                          </Typography>
                        </Box>
                      </TableCell>
                    )}

                    {/* Action Button */}
                    {isFirstRowOfTable && (
                      <TableCell
                        rowSpan={totalRows}
                        sx={{
                          px: 0.5, py: 0.4, backgroundColor: "#bfe5c1",
                          textAlign: "center", verticalAlign: "middle", width: "100px",
                        }}
                        align="center"
                      >
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center", justifyContent: "center", width: "100%" }}>
                          <Button
                            variant="contained"
                            onClick={() => {
                              const allCheckedItems = profilePackages.filter((p) => {
                                const id = `${selectedPlan._id}-${p.investmentRangeLabel}-${p.range}`;
                                return checkedItems[id];
                              });

                              if (allCheckedItems.length === 0) {
                                openSnack("Please select at least one investment range to add", "warning");
                                return;
                              }

                              const existingItemsInSamePlan = paymentSummary
                                .filter((group) => group.planId === selectedPlan._id)
                                .flatMap((group) => group.items);

                              const newItemsToAdd = allCheckedItems.filter((selectedItem) => {
                                return !existingItemsInSamePlan.some(
                                  (existingItem) =>
                                    existingItem.range === selectedItem.range &&
                                    existingItem.investmentRangeLabel === selectedItem.investmentRangeLabel,
                                );
                              });

                              if (newItemsToAdd.length === 0) {
                                const allRangeNames = allCheckedItems.map((r) => r.range).join(", ");
                                openSnack(`${allRangeNames} already in cart for this plan.`, "warning");
                                setCheckedItems((prev) => {
                                  const newState = { ...prev };
                                  allCheckedItems.forEach((item) => {
                                    const id = `${selectedPlan._id}-${item.investmentRangeLabel}-${item.range}`;
                                    delete newState[id];
                                  });
                                  return newState;
                                });
                                return;
                              }

                              const hasNonRecommended =
                                finalToken && newItemsToAdd.some((p) => !isFicoInvestmentRange(p.range));
                              if (hasNonRecommended) {
                                const rangeNames = newItemsToAdd
                                  .filter((p) => !isFicoInvestmentRange(p.range))
                                  .map((p) => p.range)
                                  .join(", ");
                                setPendingSelection({ selectedItemsInGroup: newItemsToAdd, selectedPlan, rangeNames });
                                setOpenConfirmDialog(true);
                                return;
                              }

                              newItemsToAdd.forEach((selectedItem) => {
                                handleAddSingleToPayment(
                                  {
                                    id: `${selectedPlan._id}-${selectedItem.investmentRangeLabel}-${selectedItem.range}`,
                                    investmentRangeLabel: selectedItem.investmentRangeLabel,
                                    range: selectedItem.range,
                                  },
                                  selectedPlan,
                                  selectedItem.pkg,
                                );
                              });

                              setCheckedItems((prev) => {
                                const newState = { ...prev };
                                newItemsToAdd.forEach((addedItem) => {
                                  const id = `${selectedPlan._id}-${addedItem.investmentRangeLabel}-${addedItem.range}`;
                                  delete newState[id];
                                });
                                return newState;
                              });

                              openSnack(`${newItemsToAdd.length} range(s) added to cart`, "success");
                            }}
                          sx={{
    width: 100, minHeight:120, height: "auto",
    fontSize: "1rem", textTransform: "none", fontWeight: 700,
    borderRadius: 1.5, backgroundColor: COLORS.primary, color: COLORS.white,
    transition: "all 0.3s ease", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    lineHeight: 1.3, padding: "6px 4px", textAlign: "center",
    "&:hover": { backgroundColor: "#4cb04f", transform: "scale(1.05)" },
  }}
>
  <span style={{ marginBottom: "10px" }}>Add</span>
  <span style={{ marginBottom: "10px" }}>to</span>
  <span>Plan</span>
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
      </Box>
    </Card>
  );
};

export default InvestorLeadPlans;