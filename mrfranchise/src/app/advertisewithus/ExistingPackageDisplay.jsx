import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  Box, Typography, CircularProgress, Alert, Chip,
  Paper, Button, Dialog, DialogTitle, DialogContent,
  IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Tooltip, Divider, Accordion, AccordionSummary, AccordionDetails, 
  FormControlLabel, Checkbox,  
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloseIcon from "@mui/icons-material/Close";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
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
  xs: "0.725rem", small: "0.80rem", medium: "0.980rem",
  large: "1rem", xl: "1.125rem", xxl: "1.25rem",
};

const TABLE_CONFIGS = {
  FREE: { label: "Free", headerBg: COLORS.lightGreen, headerColor: COLORS.secondaryDark, columns: ["Package", "Status", "Action"] },
  LISTING: { label: "Listing", headerBg: "#ede9fe", headerColor: "#7c3aed", columns: ["Plan", "Tenure", "Start Date", "End Date", "Status", "Action"] },
  LEAD: { label: "Lead", headerBg: "#dbeafe", headerColor: "#1d4ed8", columns: ["Plan", "Investment Range Label", "Investment Range", "States", "Total Leads", "Sent", "Remaining", "Status", "Start Date", "End Date", "Action"] },
};

const ExistingPackageDisplay = ({ 
  data, loading, error, category, industry, brandName, isLoggedIn, upgradeSectionRef,
  allPlans = [],
  leadsDropdownData = {},
onAddToPaymentSummary, 
  ficoInvestmentRanges = [], 
    ALL_INDIA_STATES = [],
  INDIA_STATES = {},
  finalToken,
}) => {
 const [dialog, setDialog] = useState({ open: false, states: [], label: "" });
const [upgradeDialog, setUpgradeDialog] = useState({ open: false, pkg: null, item: null });
const [openStateModal, setOpenStateModal] = useState(false);
const [currentEditingRange, setCurrentEditingRange] = useState(null);
const [blockedStates, setBlockedStates] = useState(new Set());
const [selectedStates, setSelectedStates] = useState(new Set());
const [stateSelections, setStateSelections] = useState({});

const liveSelectionsRef = useRef({});

  if (!isLoggedIn) return null;

const allPlanStatesByRange = useMemo(() => {
  const map = {};

  if (!data?.packages) return map;

  data.packages.forEach((pkg) => {
    const packageType = (pkg.packagesType || "").toUpperCase();
    
    // ✅ CRITICAL: Skip FREE packages - they shouldn't block any states
    if (packageType === "FREE") {
      console.log(`⏭️ Skipping FREE package from blocking: ${pkg.packagesName}`);
      return;
    }

    const investPackages = pkg.investmetPackages || pkg.InvestmetPackages ||
      pkg.InvestmentPackages || pkg.packages || [];

    investPackages.forEach((investPkg) => {
      const pkgName = investPkg.packagesName || pkg.packagesName || "";

      const planId = allPlans.find(
        (p) => p.planName?.toLowerCase() === pkgName.toLowerCase()
      )?._id;

      if (!planId) return;

      (investPkg.investmentranges || []).forEach((r) => {
        const range = r.selectedPlanInvestmetrange;
        if (!range) return;

        if (!map[range]) map[range] = {};
        if (!map[range][planId]) map[range][planId] = [];

        const states = (r.selectedPlanStateAndDistrict || [])
          .map((s) => (typeof s === "object" ? s.state : s))
          .filter(Boolean);

        states.forEach((s) => {
          if (!map[range][planId].includes(s)) {
            map[range][planId].push(s);
          }
        });
      });
    });
  });

  console.log("✅ allPlanStatesByRange (FREE excluded):", map);
  return map;
}, [data, allPlans]);

// ✅ FIXED: Get blocked states for a specific range only
const getBlockedStatesForRange = useCallback((currentPlanId, range) => {
  const blocked = new Set();
  
  console.log(`\n🔍 ===== GET BLOCKED STATES =====`);
  console.log(`Current Plan ID: ${currentPlanId}`);
  console.log(`Current Range: "${range}"`);
  console.log(`All data:`, allPlanStatesByRange);
  
  // Get all data for this specific range
  const rangeData = allPlanStatesByRange[range];
  
  if (!rangeData) {
    console.log(`ℹ️ No data found for range "${range}"`);
    return blocked;
  }
  
  console.log(`📊 Range data for "${range}":`, rangeData);
  
  Object.entries(rangeData).forEach(([otherPlanId, states]) => {
    console.log(`  Checking plan: ${otherPlanId} (Current plan: ${currentPlanId})`);
    
    // Skip the current plan
    if (otherPlanId === currentPlanId) {
      console.log(`    ⏭️ Skipping - same plan`);
      return;
    }
    
    console.log(`    ❌ Blocking states from plan ${otherPlanId}:`, states);
    states.forEach((state) => blocked.add(state));
  });
  
  console.log(`✅ Final blocked states for "${range}":`, Array.from(blocked));
  console.log(`================================\n`);
  
  return blocked;
}, [allPlanStatesByRange]);




  // Seed owner's plan into stateSelections on open
  useEffect(() => {
    if (!upgradeDialog.open || !upgradeDialog.item) return;
    const item = upgradeDialog.item;
    const ownerPlanId = allPlans.find(
      (p) => p.planName?.toLowerCase() === (item.packagesName || "").toLowerCase()
    )?._id;
    if (!ownerPlanId) return;

    const seeded = { ...stateSelections };
    (item.investmentranges || []).forEach((r) => {
      const key = `${ownerPlanId}_${r.selectedPlanInvestmetrange}`;
      if (!seeded[key]) {
        seeded[key] = (r.selectedPlanStateAndDistrict || [])
          .map((s) => (typeof s === "object" ? s.state : s))
          .filter(Boolean);
      }
    });
    setStateSelections(seeded);
    liveSelectionsRef.current = seeded;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upgradeDialog.open, upgradeDialog.item?._id]);
// Debug: Log all packages data structure
useEffect(() => {
  if (data?.packages) {
    console.log("\n📦 ===== ALL PACKAGES DATA =====");
    data.packages.forEach((pkg, idx) => {
      console.log(`\nPackage ${idx}: ${pkg.packagesName}`);
      const investPackages = pkg.investmetPackages || pkg.InvestmetPackages || [];
      investPackages.forEach((investPkg, invIdx) => {
        console.log(`  Investment Package ${invIdx}: ${investPkg.packagesName}`);
        console.log(`    Ranges:`);
        (investPkg.investmentranges || []).forEach((range, rIdx) => {
          const states = (range.selectedPlanStateAndDistrict || [])
            .map(s => typeof s === "object" ? s.state : s);
          console.log(`      ${rIdx}: "${range.selectedPlanInvestmetrange}" -> [${states.join(", ")}]`);
        });
      });
    });
    console.log("=============================\n");
  }
}, [data]);
  const getStatus = (item) => {
    if (item.isActive && !item.isPending) {
      return { label: "ACTIVE", color: COLORS.secondaryDark, bg: COLORS.lightGreen, icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> };
    }
    if (item.isPending) {
      return { label: "PENDING", color: "#b45309", bg: "#fef3c7", icon: <PendingIcon sx={{ fontSize: 14 }} /> };
    }
    return { label: "INACTIVE", color: COLORS.grey[600], bg: COLORS.grey[100], icon: <CancelIcon sx={{ fontSize: 14 }} /> };
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const handleUpgrade = (pkg, item) => {
    const packageType = (pkg.packagesType || "").toUpperCase();
    if (packageType === "FREE") {
      if (upgradeSectionRef?.current) {
        upgradeSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      const enrichedItem = { ...item, packagesName: item.packagesName || pkg.packagesName };
      setUpgradeDialog({ open: true, pkg, item: enrichedItem });
    }
  };

  const openStatesDialog = (states, rangeLabel) => {
    const arr = Array.isArray(states) ? states : (states || "").split(",").map((s) => s.trim()).filter(Boolean);
    setDialog({ open: true, states: arr, label: rangeLabel });
  };

  // ✅ FIXED: Handle edit states - only block from same range
  const handleEditStates = useCallback(({ planId, range, preSelected }) => {
    setCurrentEditingRange({ planId, range });
    
    // Get blocked states only for this specific range
    const blocked = getBlockedStatesForRange(planId, range);
    setBlockedStates(blocked);
    setSelectedStates(new Set(preSelected || []));
    setOpenStateModal(true);
  }, [getBlockedStatesForRange]);

const handleSaveStates = useCallback((stateArray) => {
  if (!currentEditingRange) return;
  const { planId, range } = currentEditingRange;
  const key = `${planId}_${range}`;
  
  console.log(`\n💾 Saving states for range "${range}"`);
  console.log(`  Selected states: ${stateArray.length > 0 ? stateArray.join(", ") : "None"}`);
  
  // Make sure stateArray is an array
  const statesToSave = Array.isArray(stateArray) ? stateArray : [];
  
  // Update live ref and state
  liveSelectionsRef.current = { ...liveSelectionsRef.current, [key]: statesToSave };
  setStateSelections((prev) => ({ ...prev, [key]: statesToSave }));
  
  setOpenStateModal(false);
  setCurrentEditingRange(null);
}, [currentEditingRange]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: COLORS.primary }} size={50} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ borderRadius: 2, borderLeft: `4px solid ${COLORS.primary}` }}>
          {error}
        </Alert>
      </Box>
    );
  }

  const grouped = { FREE: [], LISTING: [], LEAD: [] };
  const isItemActive = (item) => item.isActive && !item.isPending;

  data?.packages?.forEach((pkg) => {
    const type = (pkg.packagesType || pkg.PackagesType || "").toUpperCase();
    if (grouped[type]) {
      const packagesArray = pkg.investmetPackages || pkg.InvestmetPackages || pkg.InvestmentPackages || pkg.packages || [];
      packagesArray.forEach((item) => grouped[type].push({ pkg, item }));
    }
  });

  const hasActivePaidPackage = 
    grouped.LEAD.some(({ item }) => isItemActive(item)) || 
    grouped.LISTING.some(({ item }) => isItemActive(item));

  const hasAnyPackages = grouped.FREE.length > 0 || grouped.LISTING.length > 0 || grouped.LEAD.length > 0;

  const allStatesForUpgrade = (() => {
    const statesSet = new Set();
    if (data?.packages && Array.isArray(data.packages)) {
      data.packages.forEach((pkg) => {
        const investPackages = pkg.investmetPackages || pkg.InvestmetPackages || [];
        investPackages.forEach((investPkg) => {
          const ranges = investPkg.investmentranges || [];
          ranges.forEach((range) => {
            const stateAndDistrict = range.selectedPlanStateAndDistrict || [];
            stateAndDistrict.forEach((entry) => {
              if (entry.state && entry.state.trim()) statesSet.add(entry.state.trim());
            });
          });
        });
      });
    }
    return [...statesSet];
  })();

  const StatusChip = ({ item }) => {
    const s = getStatus(item);
    return (
      <Tooltip title={s.label === "PENDING" ? "Waiting for approval" : s.label === "ACTIVE" ? "Package is active" : "Package is inactive"} arrow>
        <Chip
          icon={s.icon}
          label={s.label}
          size="small"
          sx={{
            height: 28, fontSize: TEXT_SIZES.xs, fontWeight: 700,
            background: s.bg, color: s.color, borderRadius: 2,
            '& .MuiChip-icon': { fontSize: 14, color: s.color }
          }}
        />
      </Tooltip>
    );
  };

  const renderCell = (type, pkg, item) => {
    const start = item.isPending ? "—" : formatDate(item.packageStartDate || item.PackageStartDate);
    const end = item.isPending ? "—" : formatDate(item.packageEndDate || item.PackageEndDate);
    const sent = (item.TotalLeads || 0) - (item.remainingLeads || 0);
    const remaining = item.remainingLeads || 0;
    const totalLeads = item.TotalLeads || 0;
    const progress = totalLeads > 0 ? (sent / totalLeads) * 100 : 0;

    const name = (
      <Box>
        <Typography fontWeight={700} fontSize={TEXT_SIZES.small} color={COLORS.black} noWrap>
          {pkg.packagesName}
        </Typography>
        <Typography fontSize={TEXT_SIZES.xs} color={COLORS.grey[500]}>
          {pkg.packagesType}
        </Typography>
      </Box>
    );

    const statesArr = item.investmentranges?.flatMap(r => r.selectedPlanState || []) || item.selectedPlanState || [];
    const stateCount = statesArr.length;

    if (type === "FREE") return [
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, whiteSpace: "nowrap" }}>
        <Box>
          <Typography fontSize={TEXT_SIZES.xs} fontWeight={400} color={COLORS.black}>
            {pkg.packagesType}
          </Typography>
        </Box>
      </Box>,
      <StatusChip item={item} />,
      <Button
        variant="outlined" size="small" onClick={() => handleUpgrade(pkg, item)}
        startIcon={<UpgradeIcon />}
        sx={{
          minWidth: 90, height: 32, fontSize: TEXT_SIZES.xs,
          textTransform: "none", borderRadius: 2, fontWeight: 600,
          borderColor: COLORS.primary, color: COLORS.primary,
          "&:hover": { borderColor: COLORS.primaryDark, backgroundColor: COLORS.lightOrange },
        }}
      >Upgrade</Button>,
    ];

    if (type === "LISTING") {
      return [
        name,
        <Chip label={`${item.validity || item.tenure || "—"} Days`} size="small"
          sx={{ backgroundColor: COLORS.lightOrange, color: COLORS.primaryDark, fontWeight: 600, fontSize: TEXT_SIZES.xs }} />,
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
          <CalendarTodayIcon sx={{ fontSize: 12, color: COLORS.grey[500] }} />
          <Typography fontSize={TEXT_SIZES.xs} color={COLORS.grey[600]}>{start}</Typography>
        </Box>,
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
          <CalendarTodayIcon sx={{ fontSize: 12, color: COLORS.grey[500] }} />
          <Typography fontSize={TEXT_SIZES.xs} color={COLORS.grey[600]}>{end}</Typography>
        </Box>,
        <StatusChip item={item} />,
        <Button variant="contained" size="small" onClick={() => handleUpgrade(pkg, item)} startIcon={<UpgradeIcon />}
          sx={{
            minWidth: 90, height: 32, fontSize: TEXT_SIZES.xs,
            textTransform: "none", borderRadius: 2, fontWeight: 600,
            backgroundColor: COLORS.primary, '&:hover': { backgroundColor: COLORS.primaryDark }
          }}>Upgrade</Button>,
      ];
    }

    if (type === "LEAD") {
      let allStates = [];
      let investmentRangesWithStates = [];
      
      if (item.investmentranges && Array.isArray(item.investmentranges)) {
        investmentRangesWithStates = item.investmentranges.map((r) => {
          const rangeStates = (r.selectedPlanStateAndDistrict || [])
            .map((s) => (typeof s === "object" ? s.state : s) || "")
            .filter((s) => s.trim() !== "");
          allStates = [...allStates, ...rangeStates];
          return { range: r.selectedPlanInvestmetrange || "—", states: rangeStates };
        });
      }
      
      const totalLeads = item.totalLeads || 0;
      const sentLeads = item.sendingLeads || 0;
      const remainingLeads = item.remainingLeads || 0;
      const progressVal = totalLeads > 0 ? (sentLeads / totalLeads) * 100 : 0;
      const startDate = item.isPending ? "—" : formatDate(item.packageStartDate);
      const endDate = item.isPending ? "—" : formatDate(item.packageEndDate);

      return [
        <Box>
          <Typography fontWeight={700} fontSize={TEXT_SIZES.xs} color={COLORS.black}>
            {item.validity ? `${item.validity} Days` : "—"}
          </Typography>
          <Typography fontWeight={300} fontSize={TEXT_SIZES.small} color={COLORS.black} noWrap>
            {item.packagesName || pkg.packagesName}
          </Typography>
        </Box>,
        <Typography fontSize={TEXT_SIZES.xs} fontWeight={600} color={COLORS.primaryDark}>
          {item.investmetRageLabel || item.investmentGroupLabel || "—"}
        </Typography>,
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, justifyContent: "left" }}>
          {investmentRangesWithStates.length > 0
            ? investmentRangesWithStates.map((rangeData, i) => (
                <Typography key={i} fontSize={TEXT_SIZES.xs} fontWeight={600} color={COLORS.primaryDark} noWrap>
                  {rangeData.range}
                </Typography>
              ))
            : <Typography fontSize={TEXT_SIZES.xs} color={COLORS.grey[500]}>—</Typography>
          }
        </Box>,
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, alignItems: "center" }}>
          {investmentRangesWithStates.length > 0
            ? investmentRangesWithStates.map((rangeData, i) => (
                <Box key={i} onClick={() => openStatesDialog(rangeData.states, rangeData.range)}
                  sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, cursor: "pointer" }}>
                  <Typography fontSize={TEXT_SIZES.small} color={COLORS.primary} fontWeight={600}>
                    {rangeData.states.length}
                  </Typography>
                  <VisibilityOutlinedIcon sx={{ fontSize: 16, color: COLORS.primary }} />
                </Box>
              ))
            : <Typography fontSize={TEXT_SIZES.xs} color={COLORS.grey[500]}>—</Typography>
          }
        </Box>,
        <Typography fontWeight={700} fontSize={TEXT_SIZES.small} color={COLORS.black}>{totalLeads}</Typography>,
        <Box>
          <Typography fontWeight={600} fontSize={TEXT_SIZES.small} color={COLORS.secondaryDark}>{sentLeads}</Typography>
          <Box sx={{ width: 40, height: 2, bgcolor: COLORS.grey[200], borderRadius: 1, mt: 0.5 }}>
            <Box sx={{ width: `${progressVal}%`, height: 2, bgcolor: COLORS.secondary, borderRadius: 1 }} />
          </Box>
        </Box>,
        <Typography fontWeight={600} fontSize={TEXT_SIZES.small} color={remainingLeads > 0 ? COLORS.primary : COLORS.grey[400]}>
          {remainingLeads}
        </Typography>,
        <StatusChip item={item} />,
        <Typography fontSize={TEXT_SIZES.xs} color={COLORS.grey[600]}>{startDate}</Typography>,
        <Typography fontSize={TEXT_SIZES.xs} color={COLORS.grey[600]}>{endDate}</Typography>,
        <Button variant="outlined" size="small" onClick={() => handleUpgrade(pkg, item)} startIcon={<UpgradeIcon />}
          sx={{
            minWidth: 90, height: 32, fontSize: TEXT_SIZES.xs,
            textTransform: "none", borderRadius: 2, fontWeight: 600,
            borderColor: COLORS.primary, color: COLORS.primary,
            "&:hover": { borderColor: COLORS.primaryDark, backgroundColor: COLORS.lightOrange },
          }}>Upgrade</Button>,
      ];
    }
    return [];
  };

  const TableHeader = ({ config }) => (
    <TableHead>
      <TableRow sx={{ backgroundColor: config.headerBg }}>
        {config.columns.map((col) => (
          <TableCell key={col} sx={{
            fontWeight: 700, fontSize: TEXT_SIZES.xs, color: config.headerColor,
            py: 1.5, borderBottom: `2px solid ${COLORS.border}`,
            whiteSpace: "nowrap", textAlign: "center"
          }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>{col}</Box>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", mb: 5 }}>
        <Typography variant="h4" sx={{
          fontWeight: 700, color: COLORS.black, mb: 0.5,
          fontSize: { xs: "1rem", md: "1.9rem" },
        }}>CURRENT ACTIVE PLAN</Typography>

        {!hasAnyPackages ? (
          <Paper elevation={0} sx={{
            p: 6, textAlign: "center", borderRadius: 3,
            border: `1px dashed ${COLORS.border}`, backgroundColor: COLORS.grey[50]
          }}>
            <Typography fontSize={TEXT_SIZES.medium} color={COLORS.grey[500]}>No packages found</Typography>
          </Paper>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center", width: "100%" }}>
            {Object.entries(TABLE_CONFIGS).map(([type, config]) => {
              if (type === "FREE" && hasActivePaidPackage) return null;
              if (grouped[type].length === 0) return null;

              return (
                <Paper key={type} elevation={0} sx={{
                  borderRadius: 3, border: `1px solid ${COLORS.border}`,
                  transition: "all 0.3s ease", width: "auto", maxWidth: "100%",
                  '&:hover': { boxShadow: `0 4px 12px ${COLORS.shadow}` }
                }}>
                  <TableContainer sx={{ width: "100%", overflow: "visible" }}>
                    <Table size="small" sx={{ width: "100%", tableLayout: "auto" }}>
                      <TableHeader config={config} />
                      <TableBody>
                        {grouped[type].map(({ pkg, item }, idx) => (
                          <TableRow key={idx} sx={{
                            '&:hover': { backgroundColor: COLORS.grey[50] },
                            '&:last-child td, &:last-child th': { border: 0 }
                          }}>
                            {renderCell(type, pkg, item).map((cell, i) => (
                              <TableCell key={i} sx={{
                                py: 1.5, px: 1.5, fontSize: TEXT_SIZES.xs,
                                borderBottom: `1px solid ${COLORS.border}`,
                                verticalAlign: "middle", textAlign: "center"
                              }}>{cell}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              );
            })}
          </Box>
        )}
      </Box>

      {/* States Dialog */}
      <Dialog
        open={dialog.open}
        onClose={() => setDialog({ ...dialog, open: false })}
        PaperProps={{ sx: { borderRadius: 3, minWidth: 380, maxWidth: 500, p: 0, overflow: "hidden" } }}
      >
        <DialogTitle sx={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          pb: 1, backgroundColor: COLORS.grey[50], borderBottom: `1px solid ${COLORS.border}`
        }}>
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
              <Chip key={typeof state === 'object' ? state._id || state.state : state}
                label={typeof state === 'object' ? state.state : state} size="small"
                sx={{
                  backgroundColor: COLORS.lightOrange, color: COLORS.primaryDark,
                  fontWeight: 600, fontSize: TEXT_SIZES.xs, borderRadius: 1.5,
                }} />
            ))}
          </Box>
        </DialogContent>
      </Dialog>

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
  allStates={ALL_INDIA_STATES.length > 0 ? ALL_INDIA_STATES : allStatesForUpgrade}
  COLORS={COLORS}
  TEXT_SIZES={TEXT_SIZES}
  ALL_INDIA_STATES={ALL_INDIA_STATES}
  finalToken={finalToken}
  getStatesToDisplay={() => allStatesForUpgrade}
  getAlreadySelectedStatesInOtherRanges={() => new Set()}
  handleSelectAll={() => setSelectedStates(new Set(allStatesForUpgrade))}
  handleClearAll={() => setSelectedStates(new Set())}
  allPlanStatesByRange={allPlanStatesByRange}
  onEditStates={handleEditStates}
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
  const statesByRange = {};
  (data.checkedRanges || []).forEach((range) => {
    const key = `${data.planId}_${range}`;
    statesByRange[range] = stateSelections[key] || [];
  });
  onAddToPaymentSummary?.({ ...data, statesByRange });
  setUpgradeDialog({ open: false, pkg: null, item: null });
}}
onViewSummary={(data) => {
  const statesByRange = {};
  (data.checkedRanges || []).forEach((range) => {
    const key = `${data.planId}_${range}`;
    statesByRange[range] = stateSelections[key] || [];
  });
  onAddToPaymentSummary?.({ ...data, statesByRange });
  setUpgradeDialog({ open: false, pkg: null, item: null });
}}
 
/>
 

    

   
    </>
  );
};

export default ExistingPackageDisplay;