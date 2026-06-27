import React, { useState } from "react";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  keyframes,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import PaymentSummaryMobileView from "./Paymentsummarymobileview";
import PaymentSummaryDesktopView from "./Paymentsummarydesktopview";

const pulseAnimation = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 153, 0, 0.7); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(255, 153, 0, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 153, 0, 0); }
`;

const SectionAccordion = ({
  title,
  fontSize = "1.3rem",
  children,
  defaultExpanded = false,
  expanded: controlledExpanded,
  onChange: controlledOnChange,
  COLORS,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

  const isControlled = controlledExpanded !== undefined;
  const isExpanded = isControlled ? controlledExpanded : internalExpanded;

  const handleChange = (_, val) => {
    if (isControlled) controlledOnChange?.(val);
    else setInternalExpanded(val);
  };

  if (!isMobile) return <>{children}</>;

  return (
    <Accordion
      expanded={isExpanded}
      onChange={handleChange}
      disableGutters
      elevation={0}
      sx={{
        mb: 0,
        borderRadius: "12px !important",
        overflow: "hidden",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={
          <Box
            className="expand-icon-btn"
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: COLORS.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.25s ease",
            }}
          >
            <ExpandMoreIcon sx={{ color: COLORS.white, fontSize: "1.5rem" }} />
          </Box>
        }
        sx={{
          backgroundColor: "#fff8ee",
          minHeight: 52,
          px: 2,
          transition: "background-color 0.25s ease",
          "& .MuiAccordionSummary-content": { my: 0 },
          "&:hover": {
            backgroundColor: "#ffe5b0",
            "& .expand-icon-btn": {
              animation: `${pulseAnimation} 0.8s ease infinite`,
              backgroundColor: COLORS.secondary,
              transform: "scale(1.15)",
            },
          },
        }}
      >
        <Typography sx={{ fontWeight: 700, textAlign: "center", fontSize: fontSize, color: COLORS.black }}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>{children}</AccordionDetails>
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
  sectionExpanded,
  onSectionChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const groupedByPlan = {};

 paymentSummary.forEach((group) => {
  if (!group.items || group.items.length === 0) return;

  // ← Use groupKey as the key, not planId, to avoid collisions
  const mapKey = group.groupKey || group.planId;

  if (!groupedByPlan[mapKey]) {
    groupedByPlan[mapKey] = {
      planName: group.planName,
      validityDays: group.validityDays,
      items: [],
      totalPlanAmount: 0,
      totalPlanLeads: 0,
      totalPlanStates: 0,
      lastSelectedLeads: 0,
      isListingPlan: group.isListingPlan || false,
      planId: group.planId, // keep planId stored separately
    };
  }

  const planData = groupedByPlan[mapKey];

  group.items.forEach((item) => {
    const itemStates = item.states || [];
    const itemStateCount = item.isListingPlan ? group.totalStates : itemStates.length;
    const itemSelectedLeads = item.isListingPlan
      ? 0
      : (item.selectedLeads || group.selectedLeads || 0);
    const calculatedTotalLeads = item.isListingPlan
      ? 0
      : item.totalLeads || itemSelectedLeads * itemStateCount;
    const calculatedTotalAmount =
      item.totalAmount && item.totalAmount > 0
        ? item.totalAmount
        : ((group.pricePerState || 0) / (group.minLead > 0 ? group.minLead : 1)) *
          itemStateCount * itemSelectedLeads;

    planData.items.push({
      ...item,
      states: itemStates,
      stateCount: itemStateCount,
      selectedLeads: itemSelectedLeads,
      totalLeads: calculatedTotalLeads,
      totalAmount: calculatedTotalAmount,
      pricePerState: group.pricePerState,
      groupAmount: group.amount || group.totalAmount || 0,
      validityDays: group.validityDays,
    });
  });

  // totals
  const allStatesSet = new Set();
  let totalLeads = 0, totalAmount = 0, lastSelectedLeads = 0;
  planData.items.forEach((item) => {
    (item.states || []).forEach((s) => allStatesSet.add(s));
    totalLeads += item.totalLeads || 0;
    totalAmount += item.totalAmount || 0;
    if (item.selectedLeads) lastSelectedLeads = item.selectedLeads;
  });
  planData.totalPlanStates = allStatesSet.size;
  planData.totalPlanLeads = totalLeads;
  planData.totalPlanAmount = totalAmount;
  planData.lastSelectedLeads = lastSelectedLeads;
});

// Recalc
Object.entries(groupedByPlan).forEach(([mapKey, planData]) => {
  if (planData.isListingPlan) {
    planData.totalPlanAmount = planData.items.reduce(
      (sum, item) => sum + (item.totalAmount || 0), 0
    );
    return;
  }
  const globalUniqueStates = new Set();
  let lastSelectedLeads = 0;
  planData.items.forEach((item) => {
    (item.states || []).forEach((s) => globalUniqueStates.add(s));
    if (item.selectedLeads) lastSelectedLeads = item.selectedLeads;
  });
  const uniqueStateCount = globalUniqueStates.size;
  planData.totalPlanLeads = lastSelectedLeads * uniqueStateCount;
  planData.totalPlanStates = uniqueStateCount;
  planData.lastSelectedLeads = lastSelectedLeads;
  planData.totalPlanAmount = planData.items.reduce(
    (sum, item) => sum + (item.totalAmount || 0), 0
  );
});
  const buildSortedRanges = (planId, planData) => {
  const groupedByRange = planData.items.reduce((acc, item) => {
    const rangeKey = `${planId}_${item.investmentRangeLabel}_${item.range}`;
    if (!acc[rangeKey]) {
      const itemStates = item.states || [];
      const stateCount = item.isListingPlan ? 0 : itemStates.length; // ← listing has ["ALL STATES"]

      acc[rangeKey] = {
        range: item.range,
        investmentRangeLabel: item.investmentRangeLabel,
        planId,
        items: [],
        totalStates: stateCount,
        totalLeads: item.totalLeads || 0,
        totalAmount: 0,
        selectedLeads: item.selectedLeads || 0,
        pricePerState: item.pricePerState,
        validityDays: item.validityDays,
        states: itemStates,
        isListingPlan: item.isListingPlan || false, // ← ADD THIS
      };
    }
    acc[rangeKey].items.push(item);
    return acc;
  }, {});


 // Recalculate totalAmount and totalStates for each range from all its items
Object.values(groupedByRange).forEach((rg) => {
  rg.totalAmount = rg.items.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
  rg.totalLeads = rg.items.reduce((sum, item) => sum + (item.totalLeads || 0), 0);
});

// Ensure totalStates is correct for each range
Object.values(groupedByRange).forEach((rg) => {
  if (rg.totalStates === 0) {
        const allStatesSet = new Set();
        rg.items.forEach((item) => {
          const itemStates = item.states || [];
          itemStates.forEach((s) => allStatesSet.add(s));
        });
        rg.totalStates = allStatesSet.size;
      }
    });

    const labelGroupMap = {};
    Object.values(groupedByRange).forEach((rg) => {
      const lbl = rg.investmentRangeLabel || "—";
      if (!labelGroupMap[lbl]) labelGroupMap[lbl] = [];
      labelGroupMap[lbl].push(rg);
    });

    const sortedRanges = Object.values(labelGroupMap).flat();

const labelSubtotalMap = {};
Object.entries(labelGroupMap).forEach(([lbl, ranges]) => {
  const isListingGroup = ranges[0]?.items[0]?.isListingPlan;

  // planId here is actually mapKey (e.g. "listing-abc123" or "abc123__groupkey")
  // so for listing plans, use planId directly — don't add "listing-" prefix again
  const lookupKey = isListingGroup
    ? planId                    // ← was `listing-${planId}` which double-prefixed
    : `${planId}__${lbl}`;

  const matched = paymentSummary.find((p) => p.groupKey === lookupKey);
  labelSubtotalMap[lbl] = matched?.amount ??
    ranges.reduce((sum, rg) => sum + (rg.totalAmount || 0), 0);
});
return { sortedRanges, labelSubtotalMap, labelGroupMap };
  };

  // ─── RENDER ──────────────────────────────────────────────────────────
  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Box
        ref={paymentSummaryRef}
        sx={{
          mb: { xs: 2, sm: 9 },
          width: "100%",
          maxWidth: "1400px",
          mt: { xs: -1, sm: 0 },
          px: { xs: 0, sm: 2 },
        }}
      >
        <Typography
          sx={{
            fontSize: "1.3rem",
            fontWeight: 700,
            color: COLORS.black,
            mb: 2,
            textAlign: "center",
            display: { xs: "block", sm: "none" },
          }}
        >
          SUMMARY
        </Typography>

        <SectionAccordion
          title="SELECTED PLAN SUMMARY"
          defaultExpanded
          COLORS={COLORS}
          expanded={sectionExpanded}
          onChange={onSectionChange}
        >
          {/* Header */}
          <Box sx={{ mb: 2, pt: { xs: 1, sm: 0 }, display: { xs: "none", sm: "block" } }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: COLORS.black,
                mb: 1,
                fontSize: { xs: "1rem", md: "1.9rem" },
                textAlign: "center",
              }}
            >
              SELECTED PLAN SUMMARY
            </Typography>
          </Box>

          {/* Responsive: accordion on mobile, table on desktop */}
          {isMobile ? (
            <PaymentSummaryMobileView
              paymentSummary={paymentSummary}
              groupedByPlan={groupedByPlan}
              buildSortedRanges={buildSortedRanges}
              COLORS={COLORS}
              TEXT_SIZES={TEXT_SIZES}
              handleShowStates={handleShowStates}
              setItemToRemove={setItemToRemove}
              setOpenRemoveConfirmDialog={setOpenRemoveConfirmDialog}
            />
          ) : (
            <PaymentSummaryDesktopView
              paymentSummary={paymentSummary}
              groupedByPlan={groupedByPlan}
              buildSortedRanges={buildSortedRanges}
              COLORS={COLORS}
              TEXT_SIZES={TEXT_SIZES}
              handleShowStates={handleShowStates}
              setItemToRemove={setItemToRemove}
              setOpenRemoveConfirmDialog={setOpenRemoveConfirmDialog}
            />
          )}
        </SectionAccordion>
      </Box>
    </Box>
  );
};

export default PaymentSummaryTable;