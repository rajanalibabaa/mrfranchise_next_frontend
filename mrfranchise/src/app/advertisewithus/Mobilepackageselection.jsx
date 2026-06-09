"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  Checkbox,
  Collapse,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  Card,
} from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";

// ─── Color palette (matches desktop) ────────────────────────────────────────
const COLORS = {
  primary: "#FF9900",
  primaryDark: "#E68A00",
  secondary: "#4CB04F",
  secondaryDark: "#3D8E40",
  black: "#000000",
  white: "#ffffff",
  grey: {
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#EEEEEE",
    300: "#E0E0E0",
    400: "#BDBDBD",
    500: "#9E9E9E",
    600: "#757575",
    700: "#616161",
  },
  lightOrange: "rgba(255,153,0,0.08)",
  lightGreen: "rgba(76,176,79,0.08)",
  border: "#E0E0E0",
  shadow: "rgba(0,0,0,0.08)",
  bgWarm: "#fff8ee",
  bgGreen: "#f0f9f0",
};

const T = {
  xs: "0.85rem",
  sm: "0.8rem",
  md: "0.875rem",
  lg: "1rem",
  xl: "1.125rem",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtINR = (n) =>
  "₹" + Math.round(n || 0).toLocaleString("en-IN");

// ─── Leads Stepper Component ───────────────────────────────────────────────
const LeadsStepper = ({ value, options, onChange }) => {
  const idx = options.indexOf(value);
  const dec = () => idx > 0 && onChange(options[idx - 1]);
  const inc = () => idx < options.length - 1 && onChange(options[idx + 1]);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
      <IconButton
        onClick={dec}
        disabled={idx <= 0}
        size="small"
        sx={{
          width: 36,
          height: 36,
          border: `1px solid ${COLORS.border}`,
          borderRadius: "8px 0 0 8px",
          backgroundColor: COLORS.white,
          "&:hover": { backgroundColor: COLORS.grey[100] },
          "&.Mui-disabled": { opacity: 0.35 },
        }}
      >
        <RemoveIcon sx={{ fontSize: 16 }} />
      </IconButton>

      <Box
        sx={{
          width: 50,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderTop: `1px solid ${COLORS.border}`,
          borderBottom: `1px solid ${COLORS.border}`,
          backgroundColor: COLORS.white,
        }}
      >
        <Typography sx={{ fontSize: T.md, fontWeight: 600 }}>{value}</Typography>
      </Box>

      <IconButton
        onClick={inc}
        disabled={idx >= options.length - 1}
        size="small"
        sx={{
          width: 36,
          height: 36,
          border: `1px solid ${COLORS.border}`,
          borderRadius: "0 8px 8px 0",
          backgroundColor: COLORS.white,
          "&:hover": { backgroundColor: COLORS.grey[100] },
          "&.Mui-disabled": { opacity: 0.35 },
        }}
      >
        <AddIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  );
};


/** Single investment-range group card with leads stepper and state count in single row */
const RangeGroupCard = ({
  label,
  price,
  totalLeads,
  totalStates,
  items,
  expanded,
  onToggle,
  checkedItems,
  onCheck,
  onEditStates,
  planId,
  getRangeKey,
  statesByInvestmentRange,
  getStateCountForRange,
  inPaymentSet,
  availableLeads,
  getGroupLeads,
  handleLeadsChange,
  leadsKey,
   pricePerState,
}) => {
  const currentLeads = getGroupLeads ? getGroupLeads(label) : 0;
  
  // Calculate total states for this group
  const totalStatesCount = items.reduce(
    (s, item) => s + getStateCountForRange(label, item.range, planId),
    0
  );
  
  return (
    <Box
      sx={{
        border: `1px solid ${COLORS.border}`,
        borderRadius: 2.5,
        overflow: "hidden",
        mb: 1.5,
        backgroundColor: COLORS.white,
      }}
    >
      {/* Header row */}
      <Box
        onClick={onToggle}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.4,
          cursor: "pointer",
          backgroundColor: "#fff0c5",
          "&:active": { backgroundColor: "#ffe5a0" },
        }}
      >
        <Typography sx={{ fontSize: T.md, fontWeight: 700, color: COLORS.black }}>
          {label}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* <Typography
            sx={{ fontSize: T.sm, color: COLORS.grey[700], fontWeight: 500 }}
          >
            {fmtINR(price)}
          </Typography> */}
          {/* <Chip
            label={`${totalLeads.toLocaleString("en-IN")} leads`}
            size="small"
            sx={{
              height: 22,
              fontSize: T.xs,
              fontWeight: 600,
              backgroundColor: COLORS.grey[200],
              color: COLORS.grey[700],
              "& .MuiChip-label": { px: 1 },
            }}
          /> */}
          {expanded ? (
            <KeyboardArrowUpIcon sx={{ fontSize: 18, color: COLORS.grey[500] }} />
          ) : (
            <KeyboardArrowDownIcon sx={{ fontSize: 18, color: COLORS.grey[500] }} />
          )}
        </Box>
      </Box>

      {/* Expanded Content - Contains Leads Stepper and Sub-ranges */}
      <Collapse in={expanded}>
        <Box sx={{ backgroundColor: COLORS.grey[50], p: 2 }}>
          {/* Leads per state + State Count - SINGLE ROW */}
          <Box
            sx={{
              display: "flex",
              // alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent:"space-between" }}>
              <Typography
                sx={{
                  fontSize: T.sm,
                  fontWeight: 600,
                  color: COLORS.grey[700],
                }}
              >
                Leads per state:
              </Typography>
              {availableLeads && availableLeads.length > 1 ? (
                <LeadsStepper
                  value={currentLeads}
                  options={availableLeads}
                  onChange={(val) => handleLeadsChange(leadsKey, val)}
                />
              ) : (
                <Box sx={{ display: "flex", gap: 1 }}>
                  {availableLeads?.map((opt) => {
                    const sel = currentLeads === opt;
                    return (
                      <Box
                        key={opt}
                        onClick={() => handleLeadsChange(leadsKey, opt)}
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1.5,
                          border: `1px solid ${sel ? COLORS.secondary : COLORS.border}`,
                          backgroundColor: sel ? COLORS.secondary : COLORS.white,
                          color: sel ? COLORS.white : COLORS.black,
                          fontSize: T.sm,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {opt}
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>

            {/* State Count Badge */}
            {/* <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                backgroundColor: COLORS.grey[200],
                borderRadius: 2,
                px: 1.5,
                py: 0.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: T.sm,
                  fontWeight: 600,
                  color: COLORS.grey[700],
                }}
              >
                States:
              </Typography>
              <Typography
                sx={{
                  fontSize: T.md,
                  fontWeight: 700,
                  color: COLORS.primary,
                }}
              >
                {totalStatesCount}
              </Typography>
            </Box> */}
          </Box>

          {/* <Divider sx={{ my: 1.5 }} /> */}

          {/* Sub-range rows */}
          {items.map((item, i) => {
            const id = `${planId}-${label}-${item.range}`;
            const isChecked = checkedItems[id] || false;
            const inPayment = inPaymentSet.has(id);
            const stateCount = getStateCountForRange(label, item.range, planId);

            return (
              <Box
                key={id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  py: 1,
                  borderBottom: i < items.length - 1 ? `1px solid ${COLORS.border}` : "none",
                  backgroundColor: isChecked || inPayment ? COLORS.lightGreen : "transparent",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                  <Checkbox
                    size="small"
                    checked={isChecked || inPayment}
                    disabled={inPayment}
                    onChange={() => !inPayment && onCheck(id)}
                    sx={{
                      p: 0,
                      color: COLORS.primary,
                      "&.Mui-checked": { color: COLORS.secondary },
                      "&.Mui-disabled": { color: COLORS.secondary },
                    }}
                  />
                  <Typography sx={{ fontSize: T.md, color: COLORS.black }}>
                    {item.range}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                  {/* State count + edit */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.3,
                      backgroundColor: COLORS.grey[100],
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 1.5,
                      px: 1,
                      py: 0.3,
                    }}
                  >
                    <Typography
                      sx={{ fontSize: T.sm, fontWeight: 600, color: COLORS.black }}
                    >
                      {stateCount}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditStates(label, item.range, planId);
                      }}
                      sx={{ p: 0.2 }}
                    >
                      <EditIcon sx={{ fontSize: 12, color: COLORS.primary }} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Collapse>
    </Box>
  );
};

/** Summary stat card */
const StatCard = ({ label, value, sub, fullWidth }) => (
  <Box
    sx={{
      flex: fullWidth ? "1 1 100%" : "1 1 calc(50% - 6px)",
      backgroundColor: COLORS.grey[50],
      border: `1px solid ${COLORS.border}`,
      borderRadius: 2,
      p: 1.5,
    }}
  >
    <Typography
      sx={{
        fontSize: T.xs,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: COLORS.grey[600],
        mb: 0.5,
        fontWeight: 500,
      }}
    >
      {label}
    </Typography>
    <Typography sx={{ fontSize: T.xl, fontWeight: 700, color: COLORS.black }}>
      {value}
    </Typography>
    {sub && (
      <Typography sx={{ fontSize: T.xs, color: COLORS.grey[500], mt: 0.3 }}>
        {sub}
      </Typography>
    )}
  </Box>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const MobilePackageSelection = ({
  filteredPlans = [],
  selectedGroup,
  setSelectedGroup,
  leadsDropdownData = {},
  selectedLeadsPerRange = {},
  handleLeadsChange,
  checkedItems = {},
  setCheckedItems,
  paymentSummary = [],
  handleAddSingleToPayment,
  statesByInvestmentRange = {},
  getStateCountForRange,
  getRangeKey,
  handleOpenStateModal,
  isFicoInvestmentRange,
  ficoInvestmentRanges = [],
  scrollToPaymentSummary,
  openSnack,
  setOpenConfirmDialog,
  setPendingSelection,
  finalToken,
  data,
  allStates = [],
  plans = [],
  paymentSummaryRef,
  handleRemoveListingPlan,
  isUpgradeMode,
  upgradePlanId,
  hideListingPlans = false,
  handleAddListingPlanProp,
}) => {
const [expandedGroup, setExpandedGroup] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: "", sev: "info" });

  // ── Derived data ────────────────────────────────────────────────────────────
  const selectedPlan = useMemo(
    () => filteredPlans.find((p) => p._id === selectedGroup),
    [filteredPlans, selectedGroup]
  );

  // All packages flattened: { investmentRangeLabel, range, pkg }
  const allPackages = useMemo(() => {
    if (!selectedPlan) return [];
    const out = [];
    selectedPlan.packages?.forEach((pkg) => {
      pkg.investmentRange?.forEach((range) => {
        out.push({ investmentRangeLabel: pkg.investmentRangeLabel, range, pkg });
      });
    });
    return out;
  }, [selectedPlan]);

  // Filter to FICO ranges if available, else show all
  const profilePackages = useMemo(
    () =>
      ficoInvestmentRanges.length > 0
        ? allPackages.filter((item) => isFicoInvestmentRange(item.range))
        : allPackages,
    [allPackages, ficoInvestmentRanges, isFicoInvestmentRange]
  );

  // Group by investmentRangeLabel
  const groupedPackages = useMemo(() => {
    const map = {};
    profilePackages.forEach((item) => {
      if (!map[item.investmentRangeLabel])
        map[item.investmentRangeLabel] = { pkg: item.pkg, items: [] };
      map[item.investmentRangeLabel].items.push(item);
    });
    return map;
  }, [profilePackages]);

  // Available leads for selected plan
  const availableLeads = useMemo(() => {
    if (!selectedPlan) return [];
    return [
      ...new Set(
        selectedPlan.packages?.flatMap((pkg) => {
          const key = `${selectedPlan._id}_${pkg.investmentRangeLabel}`;
          return leadsDropdownData[key] || [];
        }) || []
      ),
    ].sort((a, b) => a - b);
  }, [selectedPlan, leadsDropdownData]);

  // Validity
  const validityDays = useMemo(() => {
    if (!selectedPlan) return null;
    const days = [
      ...new Set(
        selectedPlan.packages?.map((p) => p.validityDays).filter(Boolean)
      ),
    ];
    return days[0] || null;
  }, [selectedPlan]);

  // Per-group leads key
  const leadsKeyForGroup = useCallback(
    (label) =>
      selectedPlan ? `plan-${selectedPlan._id}-${label}` : null,
    [selectedPlan]
  );

  const getGroupLeads = useCallback(
    (label) => {
      const key = leadsKeyForGroup(label);
      return selectedLeadsPerRange[key] || availableLeads[0] || 0;
    },
    [leadsKeyForGroup, selectedLeadsPerRange, availableLeads]
  );

  // Items currently in payment
  const inPaymentSet = useMemo(() => {
    const s = new Set();
    paymentSummary.forEach((g) => {
      g.items?.forEach((it) => s.add(it.id));
    });
    return s;
  }, [paymentSummary]);

  // Summary totals across all checked + payment items
  const summary = useMemo(() => {
    if (!selectedPlan) return { price: 0, totalLeads: 0, totalStates: 0 };

    let totalStates = 0;
    let totalLeads = 0;
    let price = 0;

    Object.entries(groupedPackages).forEach(([label, { pkg, items }]) => {
      const leads = getGroupLeads(label);
      const pricePerState = Number(pkg?.amount || 0);
      const lKey = `${selectedPlan._id}_${label}`;
      const avail = leadsDropdownData[lKey] || [];
      const minLeads = avail.length > 0 ? Math.min(...avail) : 1;
      const divisor = minLeads > 0 ? minLeads : 1;

      items.forEach((item) => {
        const id = `${selectedPlan._id}-${label}-${item.range}`;
        if (checkedItems[id] || inPaymentSet.has(id)) {
          const sc = getStateCountForRange(label, item.range, selectedPlan._id);
          totalStates += sc;
          totalLeads += leads * sc;
          price += (pricePerState / divisor) * sc * leads;
        }
      });
    });

    return { price, totalLeads, totalStates };
  }, [
    selectedPlan,
    groupedPackages,
    checkedItems,
    inPaymentSet,
    getGroupLeads,
    getStateCountForRange,
    leadsDropdownData,
  ]);

  // Group totals (for the header chip)
  const getGroupTotals = useCallback(
    (label, items, pkg) => {
      if (!selectedPlan) return { price: 0, totalLeads: 0 };
      const leads = getGroupLeads(label);
      const pricePerState = Number(pkg?.amount || 0);
      const lKey = `${selectedPlan._id}_${label}`;
      const avail = leadsDropdownData[lKey] || [];
      const minLeads = avail.length > 0 ? Math.min(...avail) : 1;
      const divisor = minLeads > 0 ? minLeads : 1;

      let totalStates = 0;
      items.forEach((item) => {
        totalStates += getStateCountForRange(label, item.range, selectedPlan._id);
      });

      return {
        price: (pricePerState / divisor) * totalStates * leads,
        totalLeads: leads * totalStates,
      };
    },
    [selectedPlan, getGroupLeads, getStateCountForRange, leadsDropdownData]
  );

  // ── Handlers ────────────────────────────────────────────────────────────────
const toggleGroup = useCallback((label) => {
  setExpandedGroup((prev) => (prev === label ? null : label));
}, []);
  const handleCheck = useCallback(
    (id) => {
      setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
    },
    [setCheckedItems]
  );

  const handleAddToCart = useCallback(() => {
    if (!selectedPlan) return;

    const toAdd = profilePackages.filter((p) => {
      const id = `${selectedPlan._id}-${p.investmentRangeLabel}-${p.range}`;
      return checkedItems[id] && !inPaymentSet.has(id);
    });

    if (toAdd.length === 0) {
      openSnack("Please select at least one investment range", "warning");
      return;
    }

    const hasNonProfile =
      finalToken && toAdd.some((p) => !isFicoInvestmentRange(p.range));

    if (hasNonProfile) {
      const rangeNames = toAdd
        .filter((p) => !isFicoInvestmentRange(p.range))
        .map((p) => p.range)
        .join(", ");
      setPendingSelection({ selectedItemsInGroup: toAdd, selectedPlan, rangeNames });
      setOpenConfirmDialog(true);
      return;
    }

    toAdd.forEach((item) => {
      handleAddSingleToPayment(
        {
          id: `${selectedPlan._id}-${item.investmentRangeLabel}-${item.range}`,
          investmentRangeLabel: item.investmentRangeLabel,
          range: item.range,
        },
        selectedPlan,
        item.pkg
      );
    });

    // Clear checked items that were just added
    setCheckedItems((prev) => {
      const next = { ...prev };
      toAdd.forEach((item) => {
        delete next[`${selectedPlan._id}-${item.investmentRangeLabel}-${item.range}`];
      });
      return next;
    });
  }, [
    selectedPlan,
    profilePackages,
    checkedItems,
    inPaymentSet,
    finalToken,
    isFicoInvestmentRange,
    handleAddSingleToPayment,
    setCheckedItems,
    openSnack,
    setPendingSelection,
    setOpenConfirmDialog,
  ]);

  // Listing plans
  const listingPlans = useMemo(
    () =>
      plans
        .filter(
          (plan) =>
            plan.packages?.length === 1 &&
            plan.planName?.toLowerCase() !== "free"
        )
        .sort(
          (a, b) => (a.packages?.[0]?.amount || 0) - (b.packages?.[0]?.amount || 0)
        ),
    [plans]
  );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ width: "100%" }}>
      {/* ── BRAND LISTING PLANS ── */}
      {!hideListingPlans && (
        <>
          <Box sx={{ px: 2, pb: 1, textAlign: "center" }}>
            <Typography
              sx={{
                fontSize: "1.4rem",
                fontWeight: 700,
                color: COLORS.black,
                mb: 0.5,
              }}
            >
              BRAND LISTING PLANS
            </Typography>
            <Typography
              sx={{
                fontSize: T.xs,
                color: COLORS.grey[600],
                mb: 2,
              }}
            >
              List your Brand to increase its Digital Visibility
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {listingPlans.map((plan, index) => {
                const pkg = plan.packages?.[0] || {};
                const groupKey = `listing-${plan._id}`;
                const isAdded = paymentSummary.some((g) => g.groupKey === groupKey);
                const isAlreadyActive = (() => {
                  if (!data?.packages) return false;
                  return data.packages.some((p) => {
                    const type = (p.packagesType || "").toUpperCase();
                    if (type !== "LISTING") return false;
                    const inv =
                      p.investmetPackages ||
                      p.InvestmetPackages ||
                      p.packages ||
                      [];
                    return inv.some(
                      (ip) =>
                        (ip.packagesName || "").toLowerCase() ===
                          plan.planName.toLowerCase() &&
                        ip.isActive &&
                        !ip.isPending
                    );
                  });
                })();
                const isExistingPlan = isUpgradeMode && upgradePlanId === plan._id;

                const handleAddListingPlan = () => {
                  if (isExistingPlan) {
                    openSnack("You already have this plan. Please upgrade to a different plan.", "warning");
                    return;
                  }
                  
                  const existingListingPlan = paymentSummary.some(
                    (g) => g.isListingPlan === true,
                  );

                  if (existingListingPlan) {
                    openSnack("You can select only one listing plan at a time.", "warning");
                    return;
                  }

                  if (handleAddListingPlanProp) {
                    handleAddListingPlanProp(plan, pkg);
                  } else {
                    openSnack("Add listing plan functionality not wired up", "info");
                  }
                };

                return (
                  <Card
                    key={plan._id}
                    elevation={0}
                    sx={{
                      border: `1.5px solid ${isAdded ? COLORS.primary : COLORS.border}`,
                      borderRadius: 2.5,
                      backgroundColor: "#fff0c5",
                      overflow: "hidden",
                    }}
                  >
                    {index === 1 && (
                      <Box
                        sx={{
                          background: "linear-gradient(135deg,#ff9800 0%,#ff6f00 100%)",
                          color: "#fff",
                          px: 2,
                          py: 0.5,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        🔥 Most Popular
                      </Box>
                    )}

                    <Box
                      sx={{
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            backgroundColor:
                              index === 1
                                ? "rgba(255,152,0,0.1)"
                                : "rgba(25,118,210,0.08)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {index === 1 ? (
                            <WorkspacePremiumRoundedIcon sx={{ color: "#ff9800", fontSize: 24 }} />
                          ) : (
                            <StarBorderRoundedIcon sx={{ color: COLORS.primary, fontSize: 24 }} />
                          )}
                        </Box>

                        <Box>
                          <Typography sx={{ fontWeight: 700, fontSize: T.md, color: COLORS.black }}>
                            {plan.planName}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.3 }}>
                            <CalendarMonthRoundedIcon sx={{ fontSize: 13, color: COLORS.grey[500] }} />
                            <Typography sx={{ fontSize: T.xs, color: COLORS.grey[600] }}>
                              {pkg.validityDays} Days
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.8 }}>
                        <Typography
                          sx={{
                            fontSize: T.lg,
                            fontWeight: 800,
                            color: index === 1 ? "#ff9800" : COLORS.primary,
                          }}
                        >
                          {fmtINR(pkg.amount)}
                        </Typography>

                        <Button
                          variant="contained"
                          size="small"
                          disabled={isExistingPlan || isAlreadyActive}
                          onClick={() => {
                            if (isAlreadyActive || isExistingPlan) return;
                            if (isAdded) {
                              handleRemoveListingPlan(plan._id);
                            } else {
                              handleAddListingPlan();
                            }
                          }}
                          sx={{
                            fontSize: T.xs,
                            fontWeight: 700,
                            textTransform: "none",
                            borderRadius: 1.5,
                            boxShadow: "none",
                            minWidth: 90,
                            background: isAlreadyActive
                              ? "linear-gradient(135deg,#4cb04f 0%,#2e7d32 100%)"
                              : index === 1
                              ? "linear-gradient(135deg,#ff9800 0%,#ff6f00 100%)"
                              : `linear-gradient(135deg,${COLORS.primary} 0%,${COLORS.primaryDark} 100%)`,
                            "&:hover": { boxShadow: "none", opacity: 0.9 },
                            opacity: isExistingPlan || isAlreadyActive ? 0.75 : 1,
                          }}
                        >
                          {isAlreadyActive
                            ? "✓ Active"
                            : isExistingPlan
                            ? "In Profile"
                            : isAdded
                            ? "Remove"
                            : "Add Plan"}
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                );
              })}
            </Box>
          </Box>
          <Divider sx={{ mx: 2, my: 2 }} />
        </>
      )}

      {/* ── INVESTOR LEAD PLANS ── */}
      <Box sx={{ px: 2, textAlign: "center" }}>
        <Typography
          sx={{
            fontSize: "1.4rem",
            fontWeight: 700,
            color: COLORS.black,
            mb: 0.5,
          }}
        >
          INVESTOR LEAD PLANS
        </Typography>
        <Typography
          sx={{
            fontSize: T.sm,
            color: COLORS.grey[600],
            mb: 2,
          }}
        >
          Franchise | Dealer and Distributor | Channel Partner | Agent and Association
        </Typography>

     {/* Plan selector - SEGMENTED CONTROL (iOS Style) */}
<Box sx={{ mb: 3 }}>
     {/* Add new range button */}
            <Button
              variant="outlined"
              startIcon={<AddCircleOutlineIcon />}
              fullWidth
              onClick={() => setOpenConfirmDialog(true)}
              sx={{
                mb: 2.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                fontSize: T.sm,
                borderColor: COLORS.secondary,
                color: COLORS.secondary,
                "&:hover": {
                  backgroundColor: COLORS.lightGreen,
                  borderColor: COLORS.secondaryDark,
                },
              }}
            >
              Add New Investment Range
            </Button>
  <Box
    sx={{
      display: "flex",
      backgroundColor: COLORS.grey[100],
      borderRadius: 4,
      p: 0.5,
      position: "relative",
    }}
  >
    
    {/* Animated background slider */}
    <Box
      sx={{
        position: "absolute",
        height: "calc(100% - 8px)",
        top: 4,
        width: `${100 / filteredPlans.length}%`,
        left: `${(filteredPlans.findIndex(p => p._id === selectedGroup) || 0) * (100 / filteredPlans.length)}%`,
        backgroundColor: COLORS.primary,
        borderRadius: 3,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        zIndex: 0,
      }}
    />
    
    {filteredPlans.map((plan) => {
      const days = [
        ...new Set(
          plan.packages?.map((p) => p.validityDays).filter(Boolean)
        ),
      ][0];
      const isSelected = selectedGroup === plan._id;
      
      return (
        <Box
          key={plan._id}
          onClick={() => setSelectedGroup(plan._id)}
          sx={{
            flex: 1,
            textAlign: "center",
            py: 1.5,
            px: 1,
            borderRadius: 3,
            cursor: "pointer",
            position: "relative",
            zIndex: 1,
            transition: "all 0.2s ease",
          }}
        >
          <Typography
            sx={{
              fontSize: T.md,
              fontWeight: 700,
              color: isSelected ? COLORS.white : COLORS.grey[600],
              transition: "color 0.2s ease",
            }}
          >
            {days}
          </Typography>
          <Typography
            sx={{
              fontSize: T.xs,
              fontWeight: 500,
              color: isSelected ? "rgba(255,255,255,0.9)" : COLORS.grey[500],
              transition: "color 0.2s ease",
            }}
          >
            Days
          </Typography>
        </Box>
      );
    })}
  </Box>
  
  {/* Selected plan price display */}
  {/* {selectedPlan && (
    <Box
      sx={{
        mt: 2,
        p: 2,
        backgroundColor: COLORS.lightOrange,
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography sx={{ fontSize: T.xs, color: COLORS.grey[600], mb: 0.5 }}>
          Total Investment
        </Typography>
        <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: COLORS.primary }}>
          {fmtINR(summary.price || 0)}
        </Typography>
      </Box>
      <Box sx={{ textAlign: "right" }}>
        <Typography sx={{ fontSize: T.xs, color: COLORS.grey[600], mb: 0.5 }}>
          Est. Leads
        </Typography>
        <Typography sx={{ fontSize: "1.2rem", fontWeight: 700, color: COLORS.secondary }}>
          {summary.totalLeads.toLocaleString("en-IN")}
        </Typography>
      </Box>
    </Box>
  )} */}
</Box>

        {selectedPlan && (
          <>
            {/* Leads stepper — per group - Now inside accordion */}
            {Object.keys(groupedPackages).map((label) => {
              const { pkg, items } = groupedPackages[label];
              const leadsKey = leadsKeyForGroup(label);
              const { price, totalLeads } = getGroupTotals(label, items, pkg);

              return (
                <Box key={label} sx={{ mb: 2 }}>
                  <RangeGroupCard
                    label={label}
                    price={price}
                    totalLeads={totalLeads}
                    totalStates={items.reduce(
                      (s, item) => s + getStateCountForRange(label, item.range, selectedPlan._id),
                      0
                    )}
                    items={items}
                  expanded={expandedGroup === label} 
                    onToggle={() => toggleGroup(label)}
                    checkedItems={checkedItems}
                    onCheck={handleCheck}
                    onEditStates={handleOpenStateModal}
                    planId={selectedPlan._id}
                    getRangeKey={getRangeKey}
                    statesByInvestmentRange={statesByInvestmentRange}
                    getStateCountForRange={getStateCountForRange}
                    inPaymentSet={inPaymentSet}
                    availableLeads={availableLeads}
                    getGroupLeads={getGroupLeads}
                    handleLeadsChange={handleLeadsChange}
                    leadsKey={leadsKey}
                  />
                </Box>
              );
            })}

         

            {/* Summary cards */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              <StatCard
                label="Total Amount"
                value={fmtINR(summary.price)}
                sub={`${summary.totalStates} states`}
                fullWidth
              />
            </Box>

            {/* CTA buttons */}
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 4 }}>
              <Button
                variant="outlined"
                onClick={handleAddToCart}
                sx={{
                  height: 48,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: T.md,
                  borderColor: COLORS.border,
                  color: COLORS.black,
                  backgroundColor: COLORS.white,
                  "&:hover": { backgroundColor: COLORS.grey[100] },
                }}
              >
                Add to Plan
              </Button>

              <Button
                variant="contained"
                onClick={scrollToPaymentSummary}
                sx={{
                  height: 48,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: T.md,
                  backgroundColor: COLORS.black,
                  color: COLORS.white,
                  boxShadow: "none",
                  "&:hover": { backgroundColor: COLORS.grey[700], boxShadow: "none" },
                }}
              >
                View Summary
              </Button>
            </Box>
          </>
        )}
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snack.sev}
          variant="filled"
          sx={{ fontSize: T.sm, fontWeight: 600, borderRadius: 2 }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MobilePackageSelection;