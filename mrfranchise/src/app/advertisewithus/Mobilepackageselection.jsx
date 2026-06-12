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
  CardContent,
  Card,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// ─── Color palette ────────────────────────────────────────────────────────────
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtINR = (n) => "₹" + Math.round(n || 0).toLocaleString("en-IN");

const getUniqueStatesForGroup = (planId, label, items, statesByInvestmentRange) => {
  const set = new Set();
  items.forEach((item) => {
    const key = `${planId}__${label}__${item.range}`;
    const states = statesByInvestmentRange[key];
    if (states && states.length > 0) {
      states.forEach((s) => set.add(s));
      return;
    }
    const fallbackKey = Object.keys(statesByInvestmentRange).find((k) => {
      const parts = k.split("__");
      return (
        parts[parts.length - 1] === item.range &&
        parts[parts.length - 2] === label
      );
    });
    if (fallbackKey) {
      statesByInvestmentRange[fallbackKey].forEach((s) => set.add(s));
    }
  });
  return set;
};

const getUniqueStatesForCheckedItems = (planId, label, items, checkedItems, statesByInvestmentRange) => {
  const set = new Set();
  items.forEach((item) => {
    const id = `${planId}-${label}-${item.range}`;
    if (!checkedItems[id]) return;

    const key = `${planId}__${label}__${item.range}`;
    const states = statesByInvestmentRange[key];
    if (states && states.length > 0) {
      states.forEach((s) => set.add(s));
      return;
    }
    const fallbackKey = Object.keys(statesByInvestmentRange).find((k) => {
      const parts = k.split("__");
      return (
        parts[parts.length - 1] === item.range &&
        parts[parts.length - 2] === label
      );
    });
    if (fallbackKey) {
      statesByInvestmentRange[fallbackKey].forEach((s) => set.add(s));
    }
  });
  return set;
};

// ─── Mobile-only Section Accordion ───────────────────────────────────────────
const SectionAccordion = ({ 
  title,
  fontSize="1.3rem",
  children, 
  defaultExpanded = false,
  expanded: controlledExpanded,
  onChange: controlledOnChange,
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
        mb: 1.5,
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
        <Typography sx={{ fontWeight: 700,textAlign:"center", fontSize: fontSize, color: COLORS.black, ml:2 }}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

// ─── Leads Stepper ────────────────────────────────────────────────────────────
const LeadsStepper = ({ value, options, onChange }) => {
  const idx = options.indexOf(value);
  const dec = (e) => { e.stopPropagation(); if (idx > 0) onChange(options[idx - 1]); };
  const inc = (e) => { e.stopPropagation(); if (idx < options.length - 1) onChange(options[idx + 1]); };

  return (
    <Box sx={{
      display: "flex", alignItems: "flex-end",
      backgroundColor: COLORS.white,
      border: `1.5px solid ${COLORS.primary}`,
      borderRadius: "12px", overflow: "hidden",
      boxShadow: "0 2px 8px rgba(255,153,0,0.15)",
    }}>
      <Box onClick={dec} sx={{
        width: 24, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
        cursor: idx <= 0 ? "not-allowed" : "pointer",
        transition: "background 0.2s",
        "&:active": { backgroundColor: idx <= 0 ? COLORS.secondary[100] : "rgba(255,153,0,0.2)" },
      }}>
        <RemoveIcon sx={{ fontSize: 20, color: idx <= 0 ? COLORS.grey[400] : COLORS.primary, fontWeight: 900 }} />
      </Box>

      <Box sx={{ minWidth: 24, height: 34, display: "flex", alignItems: "center", justifyContent: "center", px: 1, backgroundColor: COLORS.white }}>
        <Typography sx={{ fontSize: "1rem", fontWeight: 800, color: COLORS.primary, letterSpacing: "-0.01em", lineHeight: 1 }}>
          {value}
        </Typography>
      </Box>

      <Box onClick={inc} sx={{
        width: 24, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
        cursor: idx >= options.length - 1 ? "not-allowed" : "pointer",
        transition: "background 0.2s",
        "&:active": { backgroundColor: idx >= options.length - 1 ? COLORS.grey[100] : "rgba(255,153,0,0.2)" },
      }}>
        <AddIcon sx={{ fontSize: 20, color: idx >= options.length - 1 ? COLORS.grey[400] : COLORS.primary, fontWeight: 900 }} />
      </Box>
    </Box>
  );
};

// ─── RangeGroupCard ───────────────────────────────────────────────────────────
const RangeGroupCard = ({
  label, items, expanded, onToggle, checkedItems, onCheck, onEditStates,
  planId, statesByInvestmentRange, getStateCountForRange, inPaymentSet,
  availableLeads, getGroupLeads, handleLeadsChange, leadsDropdownData,
  leadsKey, pricePerState,
}) => {
  const currentLeads = getGroupLeads ? getGroupLeads(label) : 0;

  const totalStatesCount = useMemo(() => {
    return getUniqueStatesForGroup(planId, label, items, statesByInvestmentRange).size;
  }, [planId, label, items, statesByInvestmentRange]);

  return (
    <Box sx={{ border: `1px solid ${COLORS.border}`, borderRadius: 2.5, overflow: "hidden", mb: 1.5, backgroundColor: COLORS.white }}>
      <Box
        onClick={onToggle}
        sx={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          px: 2, py: 1.4, cursor: "pointer", backgroundColor: "#fff0c5",
          "&:active": { backgroundColor: "#ffe5a0" },
        }}
      >
        <Typography sx={{ fontSize: T.lg, fontWeight: 700, color: COLORS.black }}>
          {label}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {availableLeads && availableLeads.length > 1 ? (
            <LeadsStepper
              value={currentLeads}
              options={availableLeads}
              onChange={(val) => handleLeadsChange(leadsKey, val)}
            />
          ) : (
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {availableLeads?.map((opt) => {
                const sel = currentLeads === opt;
                return (
                  <Box key={opt} onClick={(e) => { e.stopPropagation(); handleLeadsChange(leadsKey, opt); }}
                    sx={{
                      px: 1.5, py: 0.5, borderRadius: 1.5,
                      border: `1px solid ${sel ? COLORS.secondary : COLORS.border}`,
                      backgroundColor: sel ? COLORS.secondary : COLORS.white,
                      color: sel ? COLORS.white : COLORS.black,
                      fontSize: T.md, fontWeight: 700, cursor: "pointer",
                    }}>
                    {opt}
                  </Box>
                );
              })}
            </Box>
          )}

          {expanded
            ? <KeyboardArrowUpIcon sx={{ fontSize: 18, color: COLORS.grey[500] }} />
            : <KeyboardArrowDownIcon sx={{ fontSize: 18, color: COLORS.grey[500] }} />
          }
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ backgroundColor: COLORS.grey[50], p: 1 }}>
          {(() => {
            const leads = currentLeads || 0;
            const checkedUniqueStates = getUniqueStatesForCheckedItems(
              planId, label, items, checkedItems, statesByInvestmentRange
            );
            const totalUniqueStates = checkedUniqueStates.size;
            const lKey = `${planId}_${label}`;
            const avail = leadsDropdownData ? (leadsDropdownData[lKey] || []) : [];
            const minLeads = avail.length > 0 ? Math.min(...avail) : 1;
            const divisor = minLeads > 0 ? minLeads : 1;
            const groupTotalLeads = leads * totalUniqueStates;
            const groupAmount = (pricePerState / divisor) * totalUniqueStates * leads;

            return (
              <Box sx={{ display: "flex", gap: 0.5, mb: 2, borderRadius: 2, backgroundColor: COLORS.white }}>
                <Box sx={{
                  flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                  backgroundColor: "rgba(255,153,0,0.06)", border: "1px solid rgba(255,153,0,0.18)",
                  borderRadius: "10px", px: 0, py: 0.8,
                }}>
                  <Typography sx={{ fontSize: "0.75rem", color: COLORS.black[600], fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1, mb: 0.4, whiteSpace: "nowrap" }}>
                    Per State
                  </Typography>
                  <Typography sx={{ fontSize: "0.85rem", fontWeight: 800, color: COLORS.primaryDark, lineHeight: 1 }}>
                    {fmtINR(pricePerState || 0)}
                  </Typography>
                </Box>

                <Box sx={{ width: "1px", backgroundColor: "rgba(255,153,0,0.15)", borderRadius: 1 }} />

                <Box sx={{
                  flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                  backgroundColor: "rgba(76,176,79,0.06)", border: "1px solid rgba(76,176,79,0.18)",
                  borderRadius: "10px", px: 1, py: 0.8,
                }}>
                  <Typography sx={{ fontSize: "0.75rem", color: COLORS.black[600], fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1, mb: 0.4, whiteSpace: "nowrap" }}>
                    Total Leads
                  </Typography>
                  <Typography sx={{ fontSize: "0.85rem", fontWeight: 800, color: COLORS.secondary, lineHeight: 1 }}>
                    {groupTotalLeads.toLocaleString("en-IN")}
                  </Typography>
                </Box>

                <Box sx={{ width: "1px", backgroundColor: "rgba(255,153,0,0.15)", borderRadius: 1 }} />

                <Box sx={{
                  flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                  backgroundColor: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: "10px", px: 1, py: 0.8,
                }}>
                  <Typography sx={{ fontSize: "0.75rem", color: COLORS.black[600], fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1, mb: 0.4, whiteSpace: "nowrap" }}>
                    Total Amount
                  </Typography>
                  <Typography sx={{ fontSize: "0.85rem", fontWeight: 800, color: COLORS.black, lineHeight: 1 }}>
                    {fmtINR(groupAmount)}
                  </Typography>
                </Box>
              </Box>
            );
          })()}

          {items.map((item, i) => {
            const id = `${planId}-${label}-${item.range}`;
            const isChecked = checkedItems[id] || false;
            const inPayment = inPaymentSet.has(id);
            const stateCount = getStateCountForRange(label, item.range, planId);

            return (
              <Box key={id} sx={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                borderRadius: 1.5,
                mb: i < items.length - 1 ? 0.5 : 0,
                border: `1px solid ${inPayment ? "rgba(76,176,79,0.35)" : isChecked ? "rgba(255,153,0,0.3)" : "transparent"}`,
                backgroundColor: inPayment ? "rgba(76,176,79,0.06)" : isChecked ? "rgba(255,153,0,0.05)" : "transparent",
                transition: "all 0.2s ease",
                px: 0.5, py: 0.5,
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Checkbox
                    size="small"
                    checked={isChecked}
                    disabled={inPayment}
                    onChange={() => !inPayment && onCheck(id)}
                    sx={{
                      p: 0, color: COLORS.primary,
                      "&.Mui-checked": { color: COLORS.secondary },
                      "&.Mui-disabled": { color: COLORS.secondary },
                    }}
                  />
                  <Typography sx={{ fontSize: T.lg, fontWeight: 600, color: COLORS.black }}>
                    {item.range}
                  </Typography>
                </Box>

                <Box sx={{
                  display: "flex", alignItems: "center", gap: 0.3,
              px: 1, py: 0.3,
                }}>
                  <Typography sx={{ fontSize: T.xl, fontWeight: 600, color: COLORS.black }}>
                    {stateCount}
                  </Typography>
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEditStates(label, item.range, planId); }} sx={{ p: 0.2 }}>
                    <EditIcon sx={{ fontSize: 16, color: COLORS.primary }} />
                  </IconButton>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Collapse>
    </Box>
  );
};

// ─── Listing Plan Card (detail view for selected tab) ─────────────────────────
const ListingPlanDetail = ({
  plan,
  isAdded,
  isAlreadyActive,
  isExistingPlan,
  isMostPopular,
  onAdd,
  onRemove,
}) => {
  const pkg = plan.packages?.[0] || {};

  return (
    <Box sx={{
      border: `1.5px solid ${isAdded ? COLORS.primary : COLORS.border}`,
      borderRadius: 2.5,
      backgroundColor: "#fff0c5",
      p: 1,
      mt: 1.5,
      position: "relative",
      overflow: "hidden",
    }}>
      {isMostPopular && (
        <Box sx={{
          position: "absolute", top:8, left: -65,
          transform: "rotate(-45deg)",
          background: "linear-gradient(135deg,#ff9800 0%,#ff6f00 100%)",
          color: "#fff", px: 3, py: 0.4, fontSize: "0.65rem", fontWeight: 700,
          textAlign: "center", width: 110,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)", zIndex: 1,
        }}>
         Popular
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2, gap:0.5 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: T.lg, color: COLORS.black , ml:0.8}}>
            {plan.planName}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5, ml:0.6 }}>
            <CalendarMonthRoundedIcon sx={{ fontSize: 16  , color: COLORS.black[500] }} />
            <Typography sx={{ fontSize: T.md, color: COLORS.black[600] }}>
              {pkg.validityDays} Days 
            </Typography>
          </Box>
        </Box>
        <Typography sx={{ fontSize: "1.4rem", fontWeight: 800, color: isMostPopular ? "#ff9800" : COLORS.primary }}>
          {fmtINR(pkg.amount)}
        </Typography>
      </Box>

      <Button
        variant="contained"
        fullWidth
        disabled={isExistingPlan || isAlreadyActive}
        onClick={() => {
          if (isAlreadyActive || isExistingPlan) return;
          if (isAdded) onRemove();
          else onAdd();
        }}
        sx={{
          fontSize: T.md, fontWeight: 700, textTransform: "none",
          borderRadius: 2, boxShadow: "none", py: 1.2, color: COLORS.white,
          background: isAlreadyActive
            ? "linear-gradient(135deg,#4cb04f 0%,#2e7d32 100%)"
            : isMostPopular
            ? "linear-gradient(135deg,#ff9800 0%,#ff6f00 100%)"
            : `linear-gradient(135deg,${COLORS.primary} 0%,${COLORS.primaryDark} 100%)`,
          "&:hover": {
            boxShadow: "none", opacity: 0.9,
          },
          "&.Mui-disabled": { color: COLORS.white, opacity: 0.75 },
          opacity: isExistingPlan || isAlreadyActive ? 0.75 : 1,
        }}
      >
        {isAlreadyActive ? "✓ Active" : isExistingPlan ? "In Profile" : isAdded ? "Remove Plan" : "Add Plan"}
      </Button>
    </Box>
  );
};

// ─── StatCard ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, fullWidth }) => (
  <Box sx={{
    flex: fullWidth ? "1 1 100%" : "1 1 calc(50% - 6px)",
    backgroundColor: COLORS.grey[50], border: `1px solid ${COLORS.border}`,
    borderRadius: 2, p: 1.5,
  }}>
    <Typography sx={{ fontSize: T.xs, textTransform: "uppercase", letterSpacing: "0.06em", color: COLORS.grey[600], mb: 0.5, fontWeight: 500 }}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: T.xl, fontWeight: 700, color: COLORS.black }}>
      {value}
    </Typography>
    {sub && <Typography sx={{ fontSize: T.xs, color: COLORS.grey[500], mt: 0.3 }}>{sub}</Typography>}
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
   sectionExpanded, 
    onSectionChange,  
}) => {
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: "", sev: "info" });

  // ── Active listing tab state ──────────────────────────────────────────────
  const listingPlans = useMemo(
    () =>
      plans
        .filter((plan) => plan.packages?.length === 1 && plan.planName?.toLowerCase() !== "free")
        .sort((a, b) => (a.packages?.[0]?.amount || 0) - (b.packages?.[0]?.amount || 0)),
    [plans]
  );

  const [activeListingId, setActiveListingId] = useState(null);

  // Auto-select first listing plan tab when plans load
  useEffect(() => {
    if (listingPlans.length > 0 && !activeListingId) {
      setActiveListingId(listingPlans[0]._id);
    }
  }, [listingPlans]);

  // ── Derived data ─────────────────────────────────────────────────────────────
  const selectedPlan = useMemo(
    () => filteredPlans.find((p) => p._id === selectedGroup),
    [filteredPlans, selectedGroup]
  );

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

  const profilePackages = useMemo(
    () =>
      ficoInvestmentRanges.length > 0
        ? allPackages.filter((item) => isFicoInvestmentRange(item.range))
        : allPackages,
    [allPackages, ficoInvestmentRanges, isFicoInvestmentRange]
  );

  const groupedPackages = useMemo(() => {
    const map = {};
    profilePackages.forEach((item) => {
      if (!map[item.investmentRangeLabel])
        map[item.investmentRangeLabel] = { pkg: item.pkg, items: [] };
      map[item.investmentRangeLabel].items.push(item);
    });
    return map;
  }, [profilePackages]);

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

  const validityDays = useMemo(() => {
    if (!selectedPlan) return null;
    const days = [...new Set(selectedPlan.packages?.map((p) => p.validityDays).filter(Boolean))];
    return days[0] || null;
  }, [selectedPlan]);

  const leadsKeyForGroup = useCallback(
    (label) => selectedPlan ? `plan-${selectedPlan._id}-${label}` : null,
    [selectedPlan]
  );

  const getGroupLeads = useCallback(
    (label) => {
      const key = leadsKeyForGroup(label);
      return selectedLeadsPerRange[key] || availableLeads[0] || 0;
    },
    [leadsKeyForGroup, selectedLeadsPerRange, availableLeads]
  );

  const inPaymentSet = useMemo(() => {
    const s = new Set();
    paymentSummary.forEach((g) => { g.items?.forEach((it) => s.add(it.id)); });
    return s;
  }, [paymentSummary]);

  const summary = useMemo(() => {
    if (!selectedPlan) return { price: 0, totalLeads: 0, totalStates: 0 };

    let totalLeads = 0;
    let price = 0;
    const globalUniqueStates = new Set();

    Object.entries(groupedPackages).forEach(([label, { pkg, items }]) => {
      const leads = getGroupLeads(label);
      const pricePerState = Number(pkg?.amount || 0);

      const lKey = `${selectedPlan._id}_${label}`;
      const avail = leadsDropdownData[lKey] || [];
      const minLeads = avail.length > 0 ? Math.min(...avail) : 1;
      const divisor = minLeads > 0 ? minLeads : 1;

      const groupUniqueStates = new Set();
      items.forEach((item) => {
        const id = `${selectedPlan._id}-${label}-${item.range}`;
        if (!inPaymentSet.has(id)) return;

        const key = `${selectedPlan._id}__${label}__${item.range}`;
        const states = statesByInvestmentRange[key];
        if (states && states.length > 0) {
          states.forEach((s) => { groupUniqueStates.add(s); globalUniqueStates.add(s); });
          return;
        }
        const fallbackKey = Object.keys(statesByInvestmentRange).find((k) => {
          const parts = k.split("__");
          return parts[parts.length - 1] === item.range && parts[parts.length - 2] === label;
        });
        if (fallbackKey) {
          statesByInvestmentRange[fallbackKey].forEach((s) => { groupUniqueStates.add(s); globalUniqueStates.add(s); });
        }
      });

      const groupUniqueCount = groupUniqueStates.size;
      if (groupUniqueCount > 0) {
        price += (pricePerState / divisor) * groupUniqueCount * leads;
        totalLeads += leads * groupUniqueCount;
      }
    });

    return { price, totalLeads, totalStates: globalUniqueStates.size };
  }, [selectedPlan, groupedPackages, inPaymentSet, getGroupLeads, leadsDropdownData, statesByInvestmentRange]);

  const getGroupTotals = useCallback(
    (label, items, pkg) => {
      if (!selectedPlan) return { price: 0, totalLeads: 0, uniqueStatesCount: 0 };

      const leads = getGroupLeads(label);
      const pricePerState = Number(pkg?.amount || 0);

      const lKey = `${selectedPlan._id}_${label}`;
      const avail = leadsDropdownData[lKey] || [];
      const minLeads = avail.length > 0 ? Math.min(...avail) : 1;
      const divisor = minLeads > 0 ? minLeads : 1;

      const uniqueStates = getUniqueStatesForGroup(selectedPlan._id, label, items, statesByInvestmentRange);
      const uniqueStatesCount = uniqueStates.size;

      return {
        price: (pricePerState / divisor) * uniqueStatesCount * leads,
        totalLeads: leads * uniqueStatesCount,
        uniqueStatesCount,
      };
    },
    [selectedPlan, getGroupLeads, leadsDropdownData, statesByInvestmentRange]
  );

  const toggleGroup = useCallback((label) => {
    setExpandedGroup((prev) => (prev === label ? null : label));
  }, []);

  const handleCheck = useCallback(
    (id) => { setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] })); },
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

    const hasNonProfile = finalToken && toAdd.some((p) => !isFicoInvestmentRange(p.range));
    if (hasNonProfile) {
      const rangeNames = toAdd.filter((p) => !isFicoInvestmentRange(p.range)).map((p) => p.range).join(", ");
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

    setCheckedItems((prev) => {
      const next = { ...prev };
      toAdd.forEach((item) => {
        delete next[`${selectedPlan._id}-${item.investmentRangeLabel}-${item.range}`];
      });
      return next;
    });
  }, [
    selectedPlan, profilePackages, checkedItems, inPaymentSet,
    finalToken, isFicoInvestmentRange, handleAddSingleToPayment,
    setCheckedItems, openSnack, setPendingSelection, setOpenConfirmDialog,
  ]);

  // ─── Active listing plan detail ─────────────────────────────────────────────
  const activeListing = useMemo(
    () => listingPlans.find((p) => p._id === activeListingId),
    [listingPlans, activeListingId]
  );

  const maxListingPrice = useMemo(
    () => Math.max(...listingPlans.map((p) => p.packages?.[0]?.amount || 0)),
    [listingPlans]
  );

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ width: "100%" }}>

      {/* ── INVESTOR LEAD PLANS ── */}
 <SectionAccordion 
  title="INVESTOR LEAD PLANS" 
  defaultExpanded
  expanded={sectionExpanded === "investor"}
  onChange={(isOpen) => onSectionChange?.("investor")(isOpen)}
>
        <Box sx={{ px: 2, textAlign: "center" }}>
          {/* <Typography sx={{ fontSize: "1.4rem", fontWeight: 700, color: COLORS.black, mb: 0.5 }}>
            INVESTOR LEAD PLANS
          </Typography> */}
          <Typography sx={{ fontSize: T.lg, color: COLORS.grey[600], mb: 2 }}>
            Franchise | Dealer and Distributor | Channel Partner | Agent and Association
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<AddCircleOutlineIcon />}
              fullWidth
              onClick={() => setOpenConfirmDialog(true)}
              sx={{
                mb: 2.5, borderRadius: 2, textTransform: "none", fontWeight: 700,
                fontSize: T.md, borderColor: COLORS.secondary, color: COLORS.secondary,
                "&:hover": { backgroundColor: COLORS.lightGreen, borderColor: COLORS.secondaryDark },
              }}
            >
              Add New Investment Range
            </Button>

            <Box sx={{ mb: 1.5 }}>
              <Typography sx={{ fontSize: T.md, fontWeight: 700, color: COLORS.black, mb: 0.3 }}>
                Select Campaign Period
              </Typography>
            </Box>

            {/* ── Campaign period pill tabs ── */}
            <Box sx={{ display: "flex", backgroundColor: COLORS.grey[100], borderRadius: 4, p: 0.5, position: "relative" }}>
              <Box sx={{
                position: "absolute", height: "calc(100% - 8px)", top: 4,
                width: `${100 / filteredPlans.length}%`,
                left: `${(filteredPlans.findIndex((p) => p._id === selectedGroup) || 0) * (100 / filteredPlans.length)}%`,
                backgroundColor: COLORS.primary, borderRadius: 3,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", zIndex: 0,
              }} />

              {filteredPlans.map((plan) => {
                const days = [...new Set(plan.packages?.map((p) => p.validityDays).filter(Boolean))][0];
                const isSelected = selectedGroup === plan._id;
                return (
                  <Box key={plan._id} onClick={() => setSelectedGroup(plan._id)} sx={{
                    flex: 1, textAlign: "center", py: 1.5, px: 1,
                    borderRadius: 3, cursor: "pointer", position: "relative", zIndex: 1, transition: "all 0.2s ease",
                  }}>
                    <Typography sx={{ fontSize: T.xl, fontWeight: 900, color: isSelected ? COLORS.white : COLORS.grey[600], transition: "color 0.2s ease" }}>
                      {days}
                    </Typography>
                    <Typography sx={{ fontSize: T.xl, fontWeight: 700, color: isSelected ? "rgba(255,255,255,0.9)" : COLORS.grey[500], transition: "color 0.2s ease" }}>
                      Days
                    </Typography>
                  </Box>  
                );
              })}
            </Box>
          </Box>

          {selectedPlan && (
            <>
              {Object.keys(groupedPackages).map((label) => {
                const { pkg, items } = groupedPackages[label];
                const leadsKey = leadsKeyForGroup(label);
                const { price, totalLeads, uniqueStatesCount } = getGroupTotals(label, items, pkg);

                return (
                  <Box key={label} sx={{ mb: 2 }}>
                    <RangeGroupCard
                      label={label}
                      items={items}
                      expanded={expandedGroup === label}
                      onToggle={() => toggleGroup(label)}
                      checkedItems={checkedItems}
                      onCheck={handleCheck}
                      onEditStates={handleOpenStateModal}
                      planId={selectedPlan._id}
                      statesByInvestmentRange={statesByInvestmentRange}
                      getStateCountForRange={getStateCountForRange}
                      inPaymentSet={inPaymentSet}
                      availableLeads={availableLeads}
                      getGroupLeads={getGroupLeads}
                      handleLeadsChange={handleLeadsChange}
                      leadsKey={leadsKey}
                      pricePerState={Number(pkg?.amount || 0)}
                      leadsDropdownData={leadsDropdownData}
                    />
                  </Box>
                );
              })}

              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handleAddToCart}
                  sx={{
                    height: 48, borderRadius: 2, textTransform: "none", fontWeight: 700,
                    fontSize: T.xl, borderColor: COLORS.border, color: COLORS.black,
                    backgroundColor: COLORS.white, "&:hover": { backgroundColor: COLORS.grey[100] },
                  }}
                >
                  Add to Plan
                </Button>
                <Button
                  variant="contained"
                  onClick={scrollToPaymentSummary}
                  sx={{
                    height: 48, borderRadius: 2, textTransform: "none", fontWeight: 700,
                    fontSize: T.lg, backgroundColor: "#4cb04f", color: COLORS.white,
                    boxShadow: "none", "&:hover": { backgroundColor: COLORS.grey[700], boxShadow: "none" },
                  }}
                >
                  View Summary
                </Button>
              </Box>
            </>
          )}
        </Box>
      </SectionAccordion>

      {/* ── BRAND LISTING PLANS ── */}
      {!hideListingPlans && listingPlans.length > 0 && (
          <Box id="brand-listing-section">
     <SectionAccordion 
  title="  BRAND LISTING PLANS"
  expanded={sectionExpanded === "listing"}
  onChange={(isOpen) => onSectionChange?.("listing")(isOpen)}
>
          <Box sx={{ px: 2, pb: 2 }}>
            {/* <Typography sx={{ fontSize: "1.4rem", fontWeight: 700, color: COLORS.black, mb: 0.5, textAlign: "center" }}>
              BRAND LISTING PLANS
            </Typography> */}
            <Typography sx={{ fontSize: T.lg, color: COLORS.grey[600], mb: 2, textAlign: "center" }}>
              List your Brand to increase its Digital Visibility
            </Typography>

            {/* ── Single line scrollable tabs ── */}
            <Box sx={{
              display: "flex",
              overflowX: "auto",
              gap: 0.3,
              // ml:-1.4,
              pb: 1,
              // mb: 1,
              scrollbarWidth: "thin",
              "&::-webkit-scrollbar": {
                height: 4,
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: COLORS.grey[200],
                borderRadius: 4,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: COLORS.primary,
                borderRadius: 4,
              },
            }}>
              {listingPlans.map((plan) => {
                const isActive = activeListingId === plan._id;
                const pkg = plan.packages?.[0] || {};
                const isAdded = paymentSummary.some((g) => g.groupKey === `listing-${plan._id}`);
                const isMostPopular = (pkg.amount || 0) === maxListingPrice && maxListingPrice > 0;

                return (
                  <Box
                    key={plan._id}
                    onClick={() => setActiveListingId(plan._id)}
                    sx={{
                      flexShrink: 0,
                      px: 1.4,
                      py: 0.5,
                      borderRadius: "24px",
                      fontSize: T.xl,
                      fontWeight: isActive ? 700 : 500,
                      cursor: "pointer",
                      // whiteSpace: "nowrap",
                      border: `1.5px solid ${isActive ? COLORS.primary : isAdded ? COLORS.secondary : COLORS.border}`,
                      backgroundColor: isActive ? COLORS.primary : isAdded ? "rgba(76,176,79,0.08)" : COLORS.white,
                      color: isActive ? COLORS.white : isAdded ? COLORS.secondary : COLORS.grey[700],
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      // gap: 0.5,
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    {isMostPopular && (
                      <Typography component="span" sx={{ fontSize: "1rem" }}></Typography>
                    )}
                    {plan.planName}
                    {isAdded && (
                      <Typography component="span" sx={{ fontSize: "0.7rem", ml: 0.3 }}>✓</Typography>
                    )}
                  </Box>
                );
              })}
            </Box>

            {/* ── Selected listing plan detail card ── */}
            {activeListing && (() => {
              const pkg = activeListing.packages?.[0] || {};
              const groupKey = `listing-${activeListing._id}`;
              const isAdded = paymentSummary.some((g) => g.groupKey === groupKey);
              const isAlreadyActive = (() => {
                if (!data?.packages) return false;
                return data.packages.some((p) => {
                  const type = (p.packagesType || "").toUpperCase();
                  if (type !== "LISTING") return false;
                  const inv = p.investmetPackages || p.InvestmetPackages || p.packages || [];
                  return inv.some(
                    (ip) =>
                      (ip.packagesName || "").toLowerCase() === activeListing.planName.toLowerCase() &&
                      ip.isActive && !ip.isPending
                  );
                });
              })();
              const isExistingPlan = isUpgradeMode && upgradePlanId === activeListing._id;
              const isMostPopular = (pkg.amount || 0) === maxListingPrice && maxListingPrice > 0;

              const handleAddListingPlan = () => {
                if (isExistingPlan) {
                  openSnack("You already have this plan. Please upgrade to a different plan.", "warning");
                  return;
                }
                const existingListingPlan = paymentSummary.some((g) => g.isListingPlan === true);
                if (existingListingPlan) {
                  openSnack("You can select only one listing plan at a time.", "warning");
                  return;
                }
                if (handleAddListingPlanProp) {
                  handleAddListingPlanProp(activeListing, pkg);
                  setTimeout(() => scrollToPaymentSummary?.(), 300);
                } else {
                  openSnack("Add listing plan functionality not wired up", "info");
                }
              };

              return (
                <ListingPlanDetail
                  plan={activeListing}
                  isAdded={isAdded}
                  isAlreadyActive={isAlreadyActive}
                  isExistingPlan={isExistingPlan}
                  isMostPopular={isMostPopular}
                  onAdd={handleAddListingPlan}
                  onRemove={() => handleRemoveListingPlan(activeListing._id)}
                />
              );
            })()}
          </Box>
        </SectionAccordion>
          </Box>
      )}

      {/* Snackbar */}
    <Snackbar
  open={snack.open}
  autoHideDuration={3000}
  onClose={() => setSnack((s) => ({ ...s, open: false }))}
  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
  sx={{
    '& .MuiSnackbar-root': {
      bottom: { xs: 70, sm: 80, md: 90 }, // Different for mobile/tablet/desktop
    },
  }}
>
  <Alert severity={snack.sev} variant="filled" sx={{ fontSize: T.sm, fontWeight: 600, borderRadius: 2 }}>
    {snack.msg}
  </Alert>
</Snackbar>
    </Box>
  );
};

export default MobilePackageSelection;