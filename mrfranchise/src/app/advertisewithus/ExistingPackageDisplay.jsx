import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  Box, Typography, CircularProgress, Alert, Chip,
  Paper, Button, Dialog, DialogTitle, DialogContent,
  IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Tooltip, Divider,
  Card, CardContent, useMediaQuery, useTheme,
  Accordion, AccordionSummary, AccordionDetails,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloseIcon from "@mui/icons-material/Close";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import UpgradeDialog from "./UpgradeDialog";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const COLORS = {
  primary: "#FF9900",
  primaryDark: "#E68A00",
  primaryLight: "#FFB84D",
  secondary: "#4CB04F",
  secondaryDark: "#3D8E40",
  secondaryLight: "#71FF05",
  black: "#000000",
  white: "#ffffff",
  grey: {
    50: "#FAFAFA", 100: "#F5F5F5", 200: "#EEEEEE",
    300: "#E0E0E0", 400: "#BDBDBD", 500: "#9E9E9E",
    600: "#757575", 700: "#616161",
  },
  lightOrange: "rgba(255, 153, 0, 0.08)",
  lightGreen: "rgba(76, 176, 79, 0.08)",
  border: "#E0E0E0",
  shadow: "rgba(0, 0, 0, 0.08)",
};

const TEXT_SIZES = {
  xs: "0.725rem", small: "0.80rem", medium: "1.3rem",
  large: "1rem", xl: "1.125rem", xxl: "1.25rem",
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
        border: `3px solid ${COLORS.primary}`,
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
     <Typography sx={{ fontWeight: 700,textAlign:"center", fontSize: fontSize, color: COLORS.black , ml:2}}>
  {title}
</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

const TABLE_CONFIGS = {
  FREE:    { label: "Free",    headerBg: COLORS.lightGreen, headerColor: COLORS.secondaryDark, columns: ["Package", "Status", "Action"] },
  LISTING: { label: "Listing", headerBg: "#ede9fe",         headerColor: "#7c3aed",            columns: ["Plan", "Tenure", "Start Date", "End Date", "Status", "Action"] },
  LEAD:    { label: "Lead",    headerBg: "#dbeafe",         headerColor: "#1d4ed8",            columns: ["Plan", "Investment Range Label", "Investment Range", "States", "Total Leads", "Sent", "Remaining", "Status", "Start Date", "End Date", "Action"] },
};

const COLUMN_WIDTHS = {
  Free: {
    "Package": "35%", "Status": "35%", "Action": "30%",
  },
  Listing: {
    "Plan": "28%", "Tenure": "12%", "Start Date": "16%", "End Date": "16%", "Status": "13%", "Action": "15%",
  },
  Lead: {
    "Plan": "10%", "Investment Range Label": "10%", "Investment Range": "13%",
    "States": "6%", "Total Leads": "7%", "Sent": "6%", "Remaining": "7%",
    "Status": "10%", "Start Date": "10%", "End Date": "10%", "Action": "11%",
  },
};

const getStatus = (item) => {
  if (item.isActive && !item.isPending) {
    return { label: "ACTIVE",   color: COLORS.secondaryDark, bg: COLORS.lightGreen, icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> };
  }
  if (item.isPending) {
    return { label: "PENDING",  color: "#b45309", bg: "#fef3c7", icon: <PendingIcon sx={{ fontSize: 14 }} /> };
  }
  return { label: "INACTIVE", color: COLORS.grey[600], bg: COLORS.grey[100], icon: <CancelIcon sx={{ fontSize: 14 }} /> };
};

const StatusChip = ({ item }) => {
  const s = getStatus(item);
  return (
    <Tooltip title={s.label === "PENDING" ? "Waiting for approval" : s.label === "ACTIVE" ? "Package is active" : "Package is inactive"} arrow>
      <Chip icon={s.icon} label={s.label} size="small"
        sx={{ height: 28, fontSize: TEXT_SIZES.xs, fontWeight: 700, background: s.bg, color: s.color, borderRadius: 2, "& .MuiChip-icon": { fontSize: 14, color: s.color } }} />
    </Tooltip>
  );
};

/* ─── Mobile cards ─────────────────────────────────────────────────────────── */

const FreePackageCard = ({ pkg, item, active, handleUpgrade, upgradeSectionRef }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.secondary}`, overflow: "hidden", width: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ p: 1.5, flex: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box sx={{ flex: 1 }}>
            <Typography fontWeight={700} fontSize={TEXT_SIZES.small} color={COLORS.black}>
              {pkg.packagesName.length > 25 ? pkg.packagesName.substring(0, 25) + "..." : pkg.packagesName}
            </Typography>
            <Typography fontSize="0.65rem" color={COLORS.grey[500]}>{pkg.packagesType}</Typography>
          </Box>
          <StatusChip item={item} />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
          <Button size="small" onClick={() => setExpanded(!expanded)}
            sx={{ flex: 1, color: COLORS.primary, fontSize: "0.7rem", textTransform: "none", fontWeight: 600, border: `1px solid ${COLORS.primary}`, borderRadius: 1.5, py: 0.5, "&:hover": { backgroundColor: COLORS.lightOrange } }}>
            {expanded ? "View Less" : "View More"}
          </Button>
          <Tooltip title={!active ? "Only active plans can be upgraded" : ""} arrow>
            <span style={{ flex: 1 }}>
              <Button variant="outlined" size="small" onClick={() => handleUpgrade(pkg, item, upgradeSectionRef)}
                startIcon={<UpgradeIcon sx={{ fontSize: 16 }} />} disabled={!active} fullWidth
                sx={{ height: 36, fontSize: "0.7rem", textTransform: "none", borderRadius: 1.5, fontWeight: 600, borderColor: COLORS.primary, color: COLORS.primary, "&:hover": { borderColor: COLORS.primaryDark, backgroundColor: COLORS.lightOrange }, "&.Mui-disabled": { borderColor: COLORS.grey[300], color: COLORS.grey[400] } }}>
                Upgrade
              </Button>
            </span>
          </Tooltip>
        </Box>
        {expanded && (
          <Box sx={{ mt: 1.5, pt: 1.5, borderTop: `1px solid ${COLORS.border}` }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", p: 0.75, backgroundColor: COLORS.grey[50], borderRadius: 1 }}>
              <Typography fontSize="0.7rem" color={COLORS.grey[600]}>Package Type:</Typography>
              <Typography fontSize="0.7rem" fontWeight={500}>{pkg.packagesType}</Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const ListingPackageCard = ({ pkg, item, active, handleUpgrade, formatDate, upgradeSectionRef }) => {
  const start = item.isPending ? "—" : formatDate(item.packageStartDate || item.PackageStartDate);
  const end   = item.isPending ? "—" : formatDate(item.packageEndDate   || item.PackageEndDate);
  const packageName = item.packagesName || pkg.packagesName;
  return (
    <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.secondary}`, overflow: "hidden", width: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ p: 1.5, flex: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
          <Box sx={{ flex: 1 }}>
            <Typography fontWeight={700} fontSize={TEXT_SIZES.medium} color={COLORS.black} mb={0.5} textAlign={"center"}>
              {packageName.length > 25 ? packageName.substring(0, 25) + "..." : packageName}
            </Typography>
            <Typography fontSize="1.5rem" color={COLORS.primaryDark} fontWeight={600} textAlign={"center"}>
              {item.validity || item.tenure || "—"} Days
            </Typography>
          </Box>
          <StatusChip sx={{fontSize: "1rem"}} item={item} />
        </Box>
        <Box sx={{ mt: 1.5, pt: 1, borderTop: `1px solid ${COLORS.border}` }}>
          <Box sx={{ display: "flex", justifyContent: "space-evenly", mb: 1, p: 0.75, backgroundColor: COLORS.grey[50], borderRadius: 1 }}>
            <Typography fontSize="0.9rem" color={COLORS.grey[600]}>Start Date:</Typography>
            <Typography fontSize="0.9rem" fontWeight={500}>{start}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-evenly", p: 0.75, backgroundColor: COLORS.grey[50], borderRadius: 1 }}>
            <Typography fontSize="0.9rem" color={COLORS.grey[600]}>End Date:</Typography>
            <Typography fontSize="0.9rem" fontWeight={500}>{end}</Typography>
          </Box>
        </Box>
        <Box sx={{ mt: "auto", pt: 1 }}>
          <Tooltip title={!active ? "Only active plans can be upgraded" : ""} arrow>
            <span style={{ width: "100%" }}>
              <Button variant="contained" size="small" onClick={() => handleUpgrade(pkg, item, upgradeSectionRef)}
               disabled={!active} fullWidth
                sx={{ height: 36, fontSize: "1rem", textTransform: "none", borderRadius: 1.5, fontWeight: 600, backgroundColor: COLORS.primary, "&:hover": { backgroundColor: COLORS.primaryDark }, "&.Mui-disabled": { backgroundColor: COLORS.grey[200], color: COLORS.grey[400] } }}>
                Upgrade
              </Button>
            </span>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

const LeadPackageCard = ({ pkg, item, active, handleUpgrade, formatDate, openStatesDialog, upgradeSectionRef }) => {
  const [expanded, setExpanded] = useState(false);
  const startDate      = item.isPending ? "—" : formatDate(item.packageStartDate);
  const endDate        = item.isPending ? "—" : formatDate(item.packageEndDate);
  const totalLeads     = item.totalLeads     || 0;
  const sentLeads      = item.sendingLeads   || 0;
  const remainingLeads = item.remainingLeads || 0;
  const progressVal    = totalLeads > 0 ? (sentLeads / totalLeads) * 100 : 0;
  const investmentRangesWithStates = Array.isArray(item.investmentranges)
    ? item.investmentranges.map((r) => ({
        range:  r.selectedPlanInvestmetrange || "—",
        states: (r.selectedPlanStateAndDistrict || []).map((s) => (typeof s === "object" ? s.state : s) || "").filter((s) => s.trim() !== ""),
      }))
    : [];
  return (
    <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.secondary}`, overflow: "hidden", width: "100%" }}>
      <CardContent sx={{ p: 1.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1, pb: 0.5, borderBottom: `1px solid ${COLORS.border}` }}>
          <Box>
<Typography fontWeight={700} fontSize={"1.5rem"} color={COLORS.primary}>
  {item.validity ? `${item.validity} Days` : "—"}
</Typography>
<Typography fontSize={TEXT_SIZES.medium} color={COLORS.black[900]}sx={{ fontWeight: 600 }}>
  {item.packagesType || pkg.packagesType} PLAN
</Typography>          </Box>
          <StatusChip item={item} />
        </Box>
    
 <Box
  sx={{
    mb: 1,
    display: "flex",
    alignItems: "center",
    gap: 0.5,
    p: 1,
    backgroundColor: COLORS.grey[50],
    borderRadius: 1,
    justifyContent: "space-evenly",
  }}
>          <Typography fontSize="1rem" color={COLORS.black[600]}>Total Leads</Typography>
          <Typography
    fontSize="1rem"
    fontWeight={600}
    color={COLORS.primaryDark}
  >{totalLeads}</Typography>
        </Box>
                <Box
  sx={{
    p: 1,
    backgroundColor: COLORS.grey[50],
    borderRadius: 1,
  }}
>
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center",
      mb: 1,
    }}
  >
      <Typography fontSize="0.9rem" color={COLORS.grey[600]}>Start Date:</Typography>
     <Typography fontSize="0.9rem" fontWeight={500}>
      {startDate}
    </Typography>
  </Box>

  <Box
    sx={{
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center",
    }}
  >
      <Typography fontSize="0.9rem" color={COLORS.grey[600]}>End Date:</Typography>
     <Typography fontSize="0.9rem" fontWeight={500}>
      {endDate}
    </Typography>
  </Box>
</Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
          <Button size="small" onClick={() => setExpanded(!expanded)}
            sx={{ flex: 1, color: COLORS.primary, fontSize: "1.2rem", textTransform: "none", fontWeight: 600, border: `1px solid ${COLORS.primary}`, borderRadius: 1.5, py: 0.75, "&:hover": { backgroundColor: COLORS.lightOrange } }}>
            {expanded ? "View Less" : "View More"}
          </Button>
          <Tooltip title={!active ? "Only active plans can be upgraded" : ""} arrow>
            <span style={{ flex: 1 }}>
              <Button variant="outlined" size="small" onClick={() => handleUpgrade(pkg, item, upgradeSectionRef)}
                disabled={!active} fullWidth
            sx={{ flex: 1, color: COLORS.primary, fontSize: "1.2rem", textTransform: "none", fontWeight: 600, border: `1px solid ${COLORS.primary}`, borderRadius: 1.5, py: 0.75, "&:hover": { backgroundColor: COLORS.lightOrange } }}>
                Upgrade
              </Button>
            </span>
          </Tooltip>
        </Box>
        {expanded && (
          <Box sx={{ mt: 1.5, pt: 1.5, borderTop: `1px solid ${COLORS.border}` }}>
            {[["Sent Leads", sentLeads, COLORS.secondaryDark], ["Remaining Leads", remainingLeads, remainingLeads > 0 ? COLORS.primary : COLORS.grey[400]]].map(([label, val, color]) => (
              <Box key={label} sx={{ display: "flex", justifyContent: "space-between",  mb: 1, p: 1, backgroundColor: COLORS.grey[50], borderRadius: 1 }}>
                <Typography fontSize="1rem" color={COLORS.black[600]}>{label}:</Typography>
                <Typography fontWeight={600} fontSize="1rem" color={color}>{val}</Typography>
              </Box>
            ))}
            {/* <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5, p: 1, backgroundColor: COLORS.grey[50], borderRadius: 1 }}>
              <Typography fontSize="1rem" color={COLORS.black[600]}>Progress:</Typography>
              <Typography fontWeight={600} fontSize="1rem" color={COLORS.primary}>{Math.round(progressVal)}%</Typography>
            </Box> */}
            {investmentRangesWithStates.length > 0 && (
              <Box sx={{ mb: 1.5 }}>
   <Box
  sx={{
    mb: 1,
    display: "flex",
    alignItems: "center",
    gap: 0.5,
    p: 1,
    backgroundColor: COLORS.grey[50],
    borderRadius: 1,
    justifyContent: "space-evenly",
  }}
>
  <Typography fontSize="1rem" color={COLORS.black[600]}>
    Investment Group:
  </Typography>

  <Typography
    fontSize="1rem"
    fontWeight={600}
    color={COLORS.primaryDark}
  >
    {item.investmetRageLabel || item.investmentGroupLabel || "—"}
  </Typography>
</Box>                {investmentRangesWithStates.map((rangeData, i) => (
                  <Box key={i} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1, p: 0.75, backgroundColor: COLORS.grey[50], borderRadius: 1 }}>
                    <Typography fontSize="1rem" fontWeight={600} color={COLORS.primaryDark} sx={{ flex: 1 }}>
                      {rangeData.range.length > 25 ? rangeData.range.substring(0, 25) + "..." : rangeData.range}
                    </Typography>
                    <Box onClick={() => openStatesDialog(rangeData.states, rangeData.range)}
                      sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, cursor: "pointer", backgroundColor: COLORS.white, px: 1, py: 0.5, borderRadius: 1, border: `1px solid ${COLORS.border}` }}>
                      <Typography fontSize="1rem" color={COLORS.primary} fontWeight={600}>{rangeData.states.length} states</Typography>
                      <VisibilityOutlinedIcon sx={{ fontSize: 14, color: COLORS.primary }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

          </Box>
        )}
      </CardContent>
    </Card>
  );
};

/* ─── Mobile Tab View ───────────────────────────────────────────────────────── */

const MobileTabView = ({ grouped, shouldShowFree, isItemActive, handleUpgrade, formatDate, openStatesDialog, upgradeSectionRef }) => {
  // Build top-level tabs
  const tabs = [
    shouldShowFree && grouped.FREE.length > 0 && { key: "FREE", label: "Free" },
    grouped.LISTING.length > 0 && { key: "LISTING", label: "Listing" },
    grouped.LEAD.length > 0 && { key: "LEAD", label: "Lead" },
  ].filter(Boolean);

  const [activeTab, setActiveTab] = useState(tabs[0]?.key || "FREE");

  // For Lead sub-tabs (one pill per lead plan by days)
  const leadItems = grouped.LEAD;
  const [activeLeadIdx, setActiveLeadIdx] = useState(0);

  if (tabs.length === 0) return null;

  const tabSx = (isActive) => ({
  flex: 1,
  textAlign: "center",
  py: 1.25,
  fontSize: "1.3rem",
  fontWeight: isActive ? 700 : 700,
 border: `1.5px solid ${isActive ? COLORS.primary : COLORS.border}`,
  color: isActive ? COLORS.white : COLORS.black[600],
  backgroundColor: isActive ? COLORS.primary : COLORS.white,
  borderRadius: "8px 8px 8px 8px",
 
  cursor: "pointer",
  transition: "all 0.15s",
  userSelect: "none",
});

  return (
    <Box sx={{ width: "100%" }}>
      {/* ── Main tab strip ── */}
      <Box sx={{
        display: "flex",
        borderBottom: `1px solid ${COLORS.border}`,
        backgroundColor: COLORS.grey[50],
        px: 1,
         gap: 0.5,
      }}>
        {tabs.map(({ key, label }) => (
          <Box key={key} onClick={() => setActiveTab(key)} sx={tabSx(activeTab === key)}>
            {label} Plan
          </Box>
        ))}
      </Box>

      {/* ── Tab content ── */}
      <Box sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 1.5 }}>

        {/* FREE */}
        {activeTab === "FREE" && grouped.FREE.map(({ pkg, item }, idx) => (
          <FreePackageCard key={idx} pkg={pkg} item={item} active={isItemActive(item)}
            handleUpgrade={handleUpgrade} upgradeSectionRef={upgradeSectionRef} />
        ))}

        {/* LISTING */}
        {activeTab === "LISTING" && grouped.LISTING.map(({ pkg, item }, idx) => (
          <ListingPackageCard key={idx} pkg={pkg} item={item} active={isItemActive(item)}
            handleUpgrade={handleUpgrade} formatDate={formatDate} upgradeSectionRef={upgradeSectionRef} />
        ))}

        {/* LEAD — with day sub-tabs */}
        {activeTab === "LEAD" && leadItems.length > 0 && (
          <Box>
            {/* Day pill sub-tabs — only show if more than 1 lead plan */}
            {leadItems.length > 1 && (
              <Box sx={{
                display: "flex",
                flexWrap: "wrap",
              
                mb: 1.5,
                pb: 1.5,
                display: "flex",
                justifyContent: "space-evenly",
                borderBottom: `1px solid ${COLORS.border}`,
              }}>
                {leadItems.map(({ item }, idx) => {
                  const isActive = activeLeadIdx === idx;
                  const label = item.validity ? `${item.validity} Days` : `Plan ${idx + 1}`;
                  return (
                    <Box
                      key={idx}
                      onClick={() => setActiveLeadIdx(idx)}
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "20px",
                        fontSize: "1.2rem",
                        fontWeight: isActive ? 500 : 500,
                        cursor: "pointer",
                        border: `1.5px solid ${isActive ? COLORS.primary : COLORS.border}`,
                        backgroundColor: isActive ? COLORS.primary : COLORS.white,
                        color: isActive ? COLORS.white : COLORS.grey[600],
                        transition: "all 0.15s",
                        userSelect: "none",
                    alignItems: "center",
                        display: "flex",
jusifyContent: "space-evenly",
                      }}
                    >
                      {label}
                    </Box>
                  );
                })}
              </Box>
            )}

            {/* Active lead card */}
            {(() => {
              const { pkg, item } = leadItems[activeLeadIdx] || leadItems[0];
              return (
                <LeadPackageCard
                  pkg={pkg}
                  item={item}
                  active={isItemActive(item)}
                  handleUpgrade={handleUpgrade}
                  formatDate={formatDate}
                  openStatesDialog={openStatesDialog}
                  upgradeSectionRef={upgradeSectionRef}
                />
              );
            })()}
          </Box>
        )}
      </Box>
    </Box>
  );
};

/* ─── Main component ────────────────────────────────────────────────────────── */

const ExistingPackageDisplay = ({
  data, loading, error, category, industry, brandName, isLoggedIn, upgradeSectionRef, onHighlightExcludePlan,
  allPlans = [],
  leadsDropdownData = {},
  onAddToPaymentSummary,
  onUpgradeModeChange,
  ficoInvestmentRanges = [],
  ALL_INDIA_STATES = [],
  INDIA_STATES = {},
  finalToken,
  expansionStates = [],
}) => {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [dialog,               setDialog]               = useState({ open: false, states: [], label: "" });
  const [upgradeDialog,        setUpgradeDialog]        = useState({ open: false, pkg: null, item: null });
  const [openStateModal,       setOpenStateModal]       = useState(false);
  const [currentEditingRange,  setCurrentEditingRange]  = useState(null);
  const [blockedStates,        setBlockedStates]        = useState(new Set());
  const [selectedStates,       setSelectedStates]       = useState(new Set());
  const [stateSelections,      setStateSelections]      = useState({});
  const [highlightExcludePlan, setHighlightExcludePlan] = useState(null);
  const [currentRangeStates,   setCurrentRangeStates]   = useState([]);

  const liveSelectionsRef = useRef({});

  if (!isLoggedIn) return null;

  const existingListingPlans = useMemo(() => {
    const plans = [];
    if (data?.packages) {
      data.packages.forEach((pkg) => {
        if ((pkg.packagesType || "").toUpperCase() === "LISTING") {
          const arr = pkg.investmetPackages || pkg.InvestmetPackages || pkg.InvestmentPackages || pkg.packages || [];
          arr.forEach((item) => {
            if (item.isActive && !item.isPending) {
              plans.push({ id: pkg._id, name: pkg.packagesName, planName: item.packagesName || pkg.packagesName });
            }
          });
        }
      });
    }
    return plans;
  }, [data]);

  const allPlanStatesByRange = useMemo(() => {
    const map = {};
    if (!data?.packages) return map;
    data.packages.forEach((pkg) => {
      if ((pkg.packagesType || "").toUpperCase() === "FREE") return;
      const investPackages = pkg.investmetPackages || pkg.InvestmetPackages || pkg.InvestmentPackages || pkg.packages || [];
      investPackages.forEach((investPkg) => {
        const pkgName = investPkg.packagesName || pkg.packagesName || "";
        const planId  = allPlans.find((p) => p.planName?.toLowerCase() === pkgName.toLowerCase())?._id;
        if (!planId) return;
        (investPkg.investmentranges || []).forEach((r) => {
          const range = r.selectedPlanInvestmetrange;
          if (!range) return;
          if (!map[range])         map[range]         = {};
          if (!map[range][planId]) map[range][planId] = [];
          (r.selectedPlanStateAndDistrict || [])
            .map((s) => (typeof s === "object" ? s.state : s))
            .filter(Boolean)
            .forEach((s) => { if (!map[range][planId].includes(s)) map[range][planId].push(s); });
        });
      });
    });
    return map;
  }, [data, allPlans]);

  const getBlockedStatesForRange = useCallback((currentPlanId, range) => {
    const blocked   = new Set();
    const rangeData = allPlanStatesByRange[range];
    if (!rangeData) return blocked;
    Object.entries(rangeData).forEach(([otherId, states]) => {
      if (otherId === currentPlanId) return;
      states.forEach((s) => blocked.add(s));
    });
    return blocked;
  }, [allPlanStatesByRange]);

  useEffect(() => {
    if (!upgradeDialog.open || !upgradeDialog.item) return;
    const item        = upgradeDialog.item;
    const ownerPlanId = allPlans.find((p) => p.planName?.toLowerCase() === (item.packagesName || "").toLowerCase())?._id;
    if (!ownerPlanId) return;
    const seeded = { ...stateSelections };
    (item.investmentranges || []).forEach((r) => {
      const key = `${ownerPlanId}_${r.selectedPlanInvestmetrange}`;
      if (!seeded[key]) {
        seeded[key] = (r.selectedPlanStateAndDistrict || []).map((s) => (typeof s === "object" ? s.state : s)).filter(Boolean);
      }
    });
    setStateSelections(seeded);
    liveSelectionsRef.current = seeded;
  }, [upgradeDialog.open, upgradeDialog.item?._id]);

  useEffect(() => {
    if (data?.packages) {
      console.log("\n📦 ===== ALL PACKAGES DATA =====");
      data.packages.forEach((pkg, idx) => {
        console.log(`\nPackage ${idx}: ${pkg.packagesName}`);
        const investPackages = pkg.investmetPackages || pkg.InvestmetPackages || [];
        investPackages.forEach((investPkg, invIdx) => {
          console.log(`  Investment Package ${invIdx}: ${investPkg.packagesName}`);
          (investPkg.investmentranges || []).forEach((range, rIdx) => {
            const states = (range.selectedPlanStateAndDistrict || []).map((s) => (typeof s === "object" ? s.state : s));
            console.log(`      ${rIdx}: "${range.selectedPlanInvestmetrange}" -> [${states.join(", ")}]`);
          });
        });
      });
      console.log("=============================\n");
    }
  }, [data]);

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const handleUpgrade = (pkg, item, sectionRef) => {
    const packageType = (pkg.packagesType || "").toUpperCase();
    if (packageType === "FREE") {
      onHighlightExcludePlan?.(item.packagesName || pkg.packagesName);
      sectionRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (packageType === "LISTING") {
      onUpgradeModeChange?.(true, pkg._id);
      onHighlightExcludePlan?.(item.packagesName || pkg.packagesName);
      const brandListingElement = document.getElementById('brand-listing-section');
  if (brandListingElement) {
    brandListingElement.scrollIntoView({ behavior: "smooth", block: "start" });
  }
      sectionRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      onUpgradeModeChange?.(false, null);
      const enrichedItem = { ...item, packagesName: item.packagesName || pkg.packagesName, existingPlanId: pkg._id, existingPlanName: pkg.packagesName };
      setUpgradeDialog({ open: true, pkg, item: enrichedItem });
    }
  };

  const openStatesDialog = (states, rangeLabel) => {
    const arr = Array.isArray(states) ? states : (states || "").split(",").map((s) => s.trim()).filter(Boolean);
    setDialog({ open: true, states: arr, label: rangeLabel });
  };

  const handleEditStates = useCallback(({ planId, range, preSelected }) => {
    setCurrentEditingRange({ planId, range });
    setBlockedStates(getBlockedStatesForRange(planId, range));
    setSelectedStates(new Set(preSelected || []));
    setCurrentRangeStates(
      Object.values(allPlanStatesByRange?.[range] || {}).flat().filter((s, i, arr) => arr.indexOf(s) === i)
    );
    setOpenStateModal(true);
  }, [getBlockedStatesForRange, allPlanStatesByRange]);

  const handleSaveStates = useCallback((stateArray) => {
    if (!currentEditingRange) return;
    const { planId, range } = currentEditingRange;
    const key = `${planId}_${range}`;
    const statesToSave = Array.isArray(stateArray) ? stateArray : [];
    liveSelectionsRef.current = { ...liveSelectionsRef.current, [key]: statesToSave };
    setStateSelections((prev) => ({ ...prev, [key]: statesToSave }));
  }, [currentEditingRange]);

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <CircularProgress sx={{ color: COLORS.primary }} size={50} thickness={4} />
    </Box>
  );

  if (error) return (
    <Box p={3}>
      <Alert severity="error" sx={{ borderRadius: 2, borderLeft: `4px solid ${COLORS.primary}` }}>{error}</Alert>
    </Box>
  );

  const grouped      = { FREE: [], LISTING: [], LEAD: [] };
  const isItemActive = (item) => item.isActive && !item.isPending;

  data?.packages?.forEach((pkg) => {
    const type = (pkg.packagesType || pkg.PackagesType || "").toUpperCase();
    if (grouped[type]) {
      const arr = pkg.investmetPackages || pkg.InvestmetPackages || pkg.InvestmentPackages || pkg.packages || [];
      arr.forEach((item) => {
        grouped[type].push({ pkg, item: { ...item, packagesName: item.packagesName || pkg.packagesName } });
      });
    }
  });

  const hasActivePaidPackage =
    grouped.LEAD.some(({ item }) => isItemActive(item)) ||
    grouped.LISTING.some(({ item }) => isItemActive(item));

  const shouldShowFree  = !hasActivePaidPackage && grouped.FREE.length > 0;
  const hasAnyPackages  = grouped.FREE.length > 0 || grouped.LISTING.length > 0 || grouped.LEAD.length > 0;

  const allStatesForUpgrade = (() => {
    const set = new Set();
    (data?.packages || []).forEach((pkg) => {
      (pkg.investmetPackages || pkg.InvestmetPackages || []).forEach((investPkg) => {
        (investPkg.investmentranges || []).forEach((range) => {
          (range.selectedPlanStateAndDistrict || []).forEach((entry) => {
            if (entry.state?.trim()) set.add(entry.state.trim());
          });
        });
      });
    });
    return [...set];
  })();

  const TableHeader = ({ config }) => (
    <TableHead>
      <TableRow sx={{ backgroundColor: config.headerBg }}>
        {config.columns.map((col) => (
          <TableCell key={col} sx={{
            fontWeight: 700, fontSize: TEXT_SIZES.xs, color: config.headerColor,
            py: 1.5, px: 1, borderBottom: `2px solid ${COLORS.border}`,
            whiteSpace: "normal", textAlign: "center", wordBreak: "break-word",
            lineHeight: 1.3, width: COLUMN_WIDTHS[config.label]?.[col] || "auto",
          }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>{col}</Box>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  const renderCell = (type, pkg, item) => {
    const start  = item.isPending ? "—" : formatDate(item.packageStartDate || item.PackageStartDate);
    const end    = item.isPending ? "—" : formatDate(item.packageEndDate   || item.PackageEndDate);
    const active = isItemActive(item);

    if (type === "FREE") return [
      <Typography fontSize={TEXT_SIZES.xs} fontWeight={400} color={COLORS.black}>{pkg.packagesType}</Typography>,
      <StatusChip item={item} />,
      <Tooltip title={!active ? "Only active plans can be upgraded" : ""} arrow>
        <span>
          <Button variant="outlined" size="small" onClick={() => handleUpgrade(pkg, item, upgradeSectionRef)}
            startIcon={<UpgradeIcon />} disabled={!active}
            sx={{ minWidth: 90, height: 32, fontSize: TEXT_SIZES.xs, textTransform: "none", borderRadius: 2, fontWeight: 600, borderColor: COLORS.primary, color: COLORS.primary, "&:hover": { borderColor: COLORS.primaryDark, backgroundColor: COLORS.lightOrange }, "&.Mui-disabled": { borderColor: COLORS.grey[300], color: COLORS.grey[400] } }}>
            Upgrade
          </Button>
        </span>
      </Tooltip>,
    ];

    if (type === "LISTING") {
      const packageName = item.packagesName || pkg.packagesName;
      return [
        <Typography fontWeight={700} fontSize={TEXT_SIZES.small} color={COLORS.black} sx={{ wordBreak: "break-word", whiteSpace: "normal", lineHeight: 1.3 }}>{packageName}</Typography>,
        <Chip label={`${item.validity || item.tenure || "—"} Days`} size="small" sx={{ backgroundColor: COLORS.lightOrange, color: COLORS.primaryDark, fontWeight: 600, fontSize: TEXT_SIZES.xs }} />,
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}><CalendarTodayIcon sx={{ fontSize: 12, color: COLORS.grey[500] }} /><Typography fontSize={TEXT_SIZES.xs} color={COLORS.grey[600]}>{start}</Typography></Box>,
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}><CalendarTodayIcon sx={{ fontSize: 12, color: COLORS.grey[500] }} /><Typography fontSize={TEXT_SIZES.xs} color={COLORS.grey[600]}>{end}</Typography></Box>,
        <StatusChip item={item} />,
        <Tooltip title={!active ? "Only active plans can be upgraded" : ""} arrow>
          <span>
            <Button variant="contained" size="small" onClick={() => handleUpgrade(pkg, item, upgradeSectionRef)}
              startIcon={<UpgradeIcon />} disabled={!active}
              sx={{ minWidth: 90, height: 32, fontSize: TEXT_SIZES.xs, textTransform: "none", borderRadius: 2, fontWeight: 600, backgroundColor: COLORS.primary, "&:hover": { backgroundColor: COLORS.primaryDark }, "&.Mui-disabled": { backgroundColor: COLORS.grey[200], color: COLORS.grey[400] } }}>
              Upgrade
            </Button>
          </span>
        </Tooltip>,
      ];
    }

    if (type === "LEAD") {
      const investmentRangesWithStates = Array.isArray(item.investmentranges)
        ? item.investmentranges.map((r) => ({
            range:  r.selectedPlanInvestmetrange || "—",
            states: (r.selectedPlanStateAndDistrict || []).map((s) => (typeof s === "object" ? s.state : s) || "").filter((s) => s.trim() !== ""),
          }))
        : [];
      const totalLeads     = item.totalLeads     || 0;
      const sentLeads      = item.sendingLeads   || 0;
      const remainingLeads = item.remainingLeads || 0;
      const progressVal    = totalLeads > 0 ? (sentLeads / totalLeads) * 100 : 0;
      const startDate      = item.isPending ? "—" : formatDate(item.packageStartDate);
      const endDate        = item.isPending ? "—" : formatDate(item.packageEndDate);

      return [
        <Box>
          <Typography fontWeight={700} fontSize={TEXT_SIZES.xs} color={COLORS.black}>{item.validity ? `${item.validity} Days` : "—"}</Typography>
          <Typography fontSize={TEXT_SIZES.xs} fontWeight={300} color={COLORS.black} sx={{ whiteSpace: "normal", wordBreak: "break-word", lineHeight: 1.3 }}>
            {(item.packagesType || pkg.packagesType) && `${item.packagesType || pkg.packagesType} PLAN`}
          </Typography>
        </Box>,
        <Typography fontSize={TEXT_SIZES.xs} fontWeight={600} color={COLORS.primaryDark}>{item.investmetRageLabel || item.investmentGroupLabel || "—"}</Typography>,
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {investmentRangesWithStates.length > 0
            ? investmentRangesWithStates.map((rd, i) => <Typography key={i} fontSize={TEXT_SIZES.xs} fontWeight={600} color={COLORS.primaryDark} sx={{ whiteSpace: "normal", wordBreak: "break-word", lineHeight: 1.3 }}>{rd.range}</Typography>)
            : <Typography fontSize={TEXT_SIZES.xs} color={COLORS.grey[500]}>—</Typography>}
        </Box>,
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, alignItems: "center" }}>
          {investmentRangesWithStates.length > 0
            ? investmentRangesWithStates.map((rd, i) => (
                <Box key={i} onClick={() => openStatesDialog(rd.states, rd.range)} sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, cursor: "pointer" }}>
                  <Typography fontSize={TEXT_SIZES.small} color={COLORS.primary} fontWeight={600}>{rd.states.length}</Typography>
                  <VisibilityOutlinedIcon sx={{ fontSize: 16, color: COLORS.primary }} />
                </Box>
              ))
            : <Typography fontSize={TEXT_SIZES.xs} color={COLORS.grey[500]}>—</Typography>}
        </Box>,
        <Typography fontWeight={700} fontSize={TEXT_SIZES.small} color={COLORS.black}>{totalLeads}</Typography>,
        <Box>
          <Typography fontWeight={600} fontSize={TEXT_SIZES.small} color={COLORS.secondaryDark}>{sentLeads}</Typography>
          <Box sx={{ width: 36, height: 2, bgcolor: COLORS.grey[200], borderRadius: 1, mt: 0.5, mx: "auto" }}>
            <Box sx={{ width: `${progressVal}%`, height: 2, bgcolor: COLORS.secondary, borderRadius: 1 }} />
          </Box>
        </Box>,
        <Typography fontWeight={600} fontSize={TEXT_SIZES.small} color={remainingLeads > 0 ? COLORS.primary : COLORS.grey[400]}>{remainingLeads}</Typography>,
        <StatusChip item={item} />,
        <Typography fontSize={TEXT_SIZES.xs} color={COLORS.grey[600]}>{startDate}</Typography>,
        <Typography fontSize={TEXT_SIZES.xs} color={COLORS.grey[600]}>{endDate}</Typography>,
        <Tooltip title={!active ? "Only active plans can be upgraded" : ""} arrow>
          <span>
            <Button variant="outlined" size="small" onClick={() => handleUpgrade(pkg, item, upgradeSectionRef)}
              startIcon={<UpgradeIcon />} disabled={!active}
              sx={{ minWidth: 85, height: 32, fontSize: TEXT_SIZES.xs, textTransform: "none", borderRadius: 2, fontWeight: 600, borderColor: COLORS.primary, color: COLORS.primary, "&:hover": { borderColor: COLORS.primaryDark, backgroundColor: COLORS.lightOrange }, "&.Mui-disabled": { borderColor: COLORS.grey[300], color: COLORS.grey[400] } }}>
              Upgrade
            </Button>
          </span>
        </Tooltip>,
      ];
    }
    return [];
  };

  /* ── render ── */
  return (
    <>
      <SectionAccordion   title=" CURRENT ACTIVE PLANS" defaultExpanded>
        <Box sx={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          width: "100%", mb: 5, px: { xs: 0, sm: 1, md: 1 },
        }}>
          <Typography variant="h4" sx={{
            display: { xs: "none", sm: "block" },
            fontWeight: 700, color: COLORS.black, mb: 2,
            fontSize: { xs: "1.3rem", sm: "1.5rem", md: "1.9rem" },
            textAlign: "center",
          }}>
            CURRENT ACTIVE PLANS
          </Typography>

          {!hasAnyPackages ? (
            <Paper elevation={0} sx={{
              p: 1, textAlign: "center", borderRadius: 2,
              border: `1px dashed ${COLORS.primary}`, backgroundColor: COLORS.grey[50],
              width: "100%", maxWidth: { xs: "100%", sm: "500px" },
            }}>
              <Typography fontSize={TEXT_SIZES.medium} color={COLORS.grey[500]}>No packages found</Typography>
            </Paper>
          ) : (
            <Box sx={{
              display: "flex", flexDirection: "column", gap: 3,
              alignItems: "center", justifyContent: "center",
              width: "100%", maxWidth: { xs: "100%", sm: "600px", md: "1200px" },
            }}>

              {/* ── Desktop View ── */}
              {!isMobile && (
                <>
                  {shouldShowFree && (
                    <Box sx={{ width: "100%" }}>
                      <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
                        <Table size="small" sx={{ width: "60%", mx: "auto", minWidth: 400 }}>
                          <TableHeader config={TABLE_CONFIGS.FREE} />
                          <TableBody>
                            {grouped.FREE.map(({ pkg, item }, idx) => (
                              <TableRow key={idx} sx={{ "&:hover": { backgroundColor: COLORS.grey[50] }, "&:last-child td, &:last-child th": { border: 0 } }}>
                                {renderCell("FREE", pkg, item).map((cell, i) => (
                                  <TableCell key={i} sx={{ py: 1.5, px: 1.5, fontSize: TEXT_SIZES.xs, borderBottom: `1px solid ${COLORS.border}`, verticalAlign: "middle", textAlign: "center" }}>{cell}</TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}

                  {grouped.LISTING.length > 0 && (
                    <Box sx={{ width: "100%" }}>
                      <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
                        <Table size="small" sx={{ width: "85%", mx: "auto", minWidth: 600 }}>
                          <TableHeader config={TABLE_CONFIGS.LISTING} />
                          <TableBody>
                            {grouped.LISTING.map(({ pkg, item }, idx) => (
                              <TableRow key={idx} sx={{ "&:hover": { backgroundColor: COLORS.grey[50] }, "&:last-child td, &:last-child th": { border: 0 } }}>
                                {renderCell("LISTING", pkg, item).map((cell, i) => (
                                  <TableCell key={i} sx={{ py: 1.5, px: 1.5, fontSize: TEXT_SIZES.xs, borderBottom: `1px solid ${COLORS.border}`, verticalAlign: "middle", textAlign: "center" }}>{cell}</TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}

                  {grouped.LEAD.length > 0 && (
                    <Box sx={{ width: "100%" }}>
                      <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
                        <Table size="small" sx={{ width: "100%", mx: "auto", minWidth: 900 }}>
                          <TableHeader config={TABLE_CONFIGS.LEAD} />
                          <TableBody>
                            {grouped.LEAD.map(({ pkg, item }, idx) => (
                              <TableRow key={idx} sx={{ "&:hover": { backgroundColor: COLORS.grey[50] }, "&:last-child td, &:last-child th": { border: 0 } }}>
                                {renderCell("LEAD", pkg, item).map((cell, i) => (
                                  <TableCell key={i} sx={{ py: 1.5, px: 0.75, fontSize: TEXT_SIZES.xs, borderBottom: `1px solid ${COLORS.border}`, verticalAlign: "middle", textAlign: "center" }}>{cell}</TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}
                </>
              )}

              {/* ── Mobile View with tabs ── */}
              {isMobile && hasAnyPackages && (
                <MobileTabView
                  grouped={grouped}
                  shouldShowFree={shouldShowFree}
                  isItemActive={isItemActive}
                  handleUpgrade={handleUpgrade}
                  formatDate={formatDate}
                  openStatesDialog={openStatesDialog}
                  upgradeSectionRef={upgradeSectionRef}
                />
              )}

            </Box>
          )}
        </Box>
      </SectionAccordion>

      {/* ── States Dialog ── */}
      <Dialog open={dialog.open} onClose={() => setDialog({ ...dialog, open: false })}
        PaperProps={{ sx: { borderRadius: 3, minWidth: { xs: "90%", sm: 380 }, maxWidth: 500, m: { xs: 2, sm: 0 }, p: 0, overflow: "hidden" } }}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1, backgroundColor: COLORS.grey[50], borderBottom: `1px solid ${COLORS.border}` }}>
          <Box>
            <Typography fontWeight={700} fontSize={TEXT_SIZES.medium} color={COLORS.black}>Selected States</Typography>
            {dialog.label && <Typography fontSize={TEXT_SIZES.xs} color={COLORS.grey[500]}>{dialog.label}</Typography>}
          </Box>
          <IconButton size="small" onClick={() => setDialog({ ...dialog, open: false })}>
            <CloseIcon fontSize="small" sx={{ color: COLORS.grey[500] }} />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <LocationOnIcon sx={{ fontSize: 16, color: COLORS.primary }} />
            <Typography fontSize={TEXT_SIZES.small} color={COLORS.grey[600]}>
              {dialog.states.length} state{dialog.states.length !== 1 ? "s" : ""} selected
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, maxHeight: 300, overflow: "auto" }}>
            {dialog.states.map((state) => (
              <Chip key={typeof state === "object" ? state._id || state.state : state}
                label={typeof state === "object" ? state.state : state} size="small"
                sx={{ backgroundColor: COLORS.lightOrange, color: COLORS.primaryDark, fontWeight: 600, fontSize: TEXT_SIZES.xs, borderRadius: 1.5 }} />
            ))}
          </Box>
        </DialogContent>
      </Dialog>

      {/* ── Upgrade Dialog ── */}
      <UpgradeDialog
        key={upgradeDialog.pkg?._id || "upgrade"}
        open={upgradeDialog.open}
        onClose={() => setUpgradeDialog({ open: false, pkg: null, item: null })}
        pkg={upgradeDialog.pkg}
        item={upgradeDialog.item}
        allPlans={allPlans}
        leadsDropdownData={leadsDropdownData}
        ficoInvestmentRanges={ficoInvestmentRanges}
        INDIA_STATES={INDIA_STATES}
        selectedStates={selectedStates}
        setSelectedStates={setSelectedStates}
        currentRangeStates={currentRangeStates}
        setCurrentRangeStates={setCurrentRangeStates}
        COLORS={COLORS}
        TEXT_SIZES={TEXT_SIZES}
        allStates={expansionStates}
        ALL_INDIA_STATES={ALL_INDIA_STATES}
        finalToken={finalToken}
        getStatesToDisplay={() => allStatesForUpgrade}
        getAlreadySelectedStatesInOtherRanges={() => new Set()}
        handleSelectAll={() => setSelectedStates(new Set(allStatesForUpgrade))}
        handleClearAll={() => setSelectedStates(new Set())}
        allPlanStatesByRange={allPlanStatesByRange}
        onEditStates={handleEditStates}
        highlightExcludePlan={highlightExcludePlan}
        onSaveStates={handleSaveStates}
        currentEditingRange={currentEditingRange}
        setCurrentEditingRange={setCurrentEditingRange}
        blockedStates={blockedStates}
        setBlockedStates={setBlockedStates}
        openStateModal={openStateModal}
        setOpenStateModal={setOpenStateModal}
        stateSelections={stateSelections}
        setStateSelections={setStateSelections}
        onUpgrade={(data) => {
          console.log("✅ onUpgrade received:", data);
          onAddToPaymentSummary?.({ ...data });
          setUpgradeDialog({ open: false, pkg: null, item: null });
        }}
        onViewSummary={(data) => {
          console.log("✅ onViewSummary received:", data);
          onAddToPaymentSummary?.({ ...data });
          setUpgradeDialog({ open: false, pkg: null, item: null });
        }}
      />
    </>
  );
};

export default ExistingPackageDisplay;