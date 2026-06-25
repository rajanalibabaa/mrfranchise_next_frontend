"use client";
import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  Box, Typography, CircularProgress, Alert, Chip,
  Button, Dialog, DialogTitle, DialogContent,
  IconButton, TableBody, TableCell, TableRow,
  Tooltip, Divider, useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import UpgradeDialog from "./UpgradeDialog";

import {
  COLORS, TEXT_SIZES, TABLE_CONFIGS,
  StatusChip, SectionAccordion, TableHeader, StyledTableWrapper,
} from "./Packageuicomponents";
import MobileTabView from "./Packagemobileview";

// ─── Desktop Cell Renderers ───────────────────────────────────────────────────

const renderFreeCell = (pkg, item, isItemActive, handleUpgrade, upgradeSectionRef) => {
  const active = isItemActive(item);
  return (
    <TableRow
      key={`free-${pkg._id}-${item._id}`}
      sx={{ "&:hover": { backgroundColor: COLORS.grey[50] }, transition: "background-color 0.2s ease", "&:last-child td": { borderBottom: 0 } }}
    >
      <TableCell align="center" sx={{ py: 2, px: 1.5 }}>
        <Typography fontWeight={600} fontSize="0.9rem" color={COLORS.black}>{pkg.packagesName}</Typography>
        <Typography fontSize="0.75rem" color={COLORS.grey[500]}>{pkg.packagesType}</Typography>
      </TableCell>
      <TableCell align="center" sx={{ py: 2, px: 1.5 }}>
        <StatusChip item={item} />
      </TableCell>
      <TableCell align="center" sx={{ py: 2, px: 1.5 }}>
        <Tooltip title={!active ? "Only active plans can be upgraded" : ""} arrow>
          <span>
            <Button
              variant="contained" size="small"
              onClick={() => handleUpgrade(pkg, item, upgradeSectionRef)}
              disabled={!active}
              sx={{
                minWidth: 100, height: 36, fontSize: "0.8rem", textTransform: "none", borderRadius: 2, fontWeight: 600,
                backgroundColor: active ? COLORS.primary : COLORS.grey[300],
                color: active ? COLORS.white : COLORS.grey[500],
                "&:hover": { backgroundColor: active ? COLORS.primaryDark : COLORS.grey[300] },
                "& .MuiButton-startIcon": { marginRight: 0.5 },
              }}
            >
              Upgrade
            </Button>
          </span>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

const renderListingCell = (pkg, item, isItemActive, handleUpgrade, formatDate, upgradeSectionRef) => {
  const active = isItemActive(item);
  const start = item.isPending ? "—" : formatDate(item.packageStartDate || item.PackageStartDate);
  const end   = item.isPending ? "—" : formatDate(item.packageEndDate   || item.PackageEndDate);
  const packageName = item.packagesName || pkg.packagesName;

  return (
    <TableRow
      key={`listing-${pkg._id}-${item._id}`}
      sx={{ "&:hover": { backgroundColor: COLORS.grey[50] }, transition: "background-color 0.2s ease", "&:last-child td": { borderBottom: 0 } }}
    >
      <TableCell align="center" sx={{ py: 2, px: 1.5 }}>
        <Typography fontWeight={700} fontSize="0.9rem" color={COLORS.black}>{packageName}</Typography>
      </TableCell>
      <TableCell align="center" sx={{ py: 2, px: 1.5 }}>
        <Typography sx={{ color: COLORS.primaryDark, fontWeight: 600, fontSize: "1rem", borderRadius: 2 }}>
          {item.validity || item.tenure || "—"} Days
        </Typography>
      </TableCell>
      <TableCell align="center" sx={{ py: 2, px: 1.5 }}>
        <Typography fontSize="0.9rem" color={COLORS.black[700]}>{start}</Typography>
      </TableCell>
      <TableCell align="center" sx={{ py: 2, px: 1.5 }}>
        <Typography fontSize="0.9rem" color={COLORS.black[700]}>{end}</Typography>
      </TableCell>
      <TableCell align="center" sx={{ py: 2, px: 1.5 }}>
        <StatusChip item={item} />
      </TableCell>
      <TableCell align="center" sx={{ py: 2, px: 1.5 }}>
        <Tooltip title={!active ? "Only active plans can be upgraded" : ""} arrow>
          <span>
            <Button
              variant="contained" size="small"
              onClick={() => handleUpgrade(pkg, item, upgradeSectionRef)}
              disabled={!active}
              sx={{
                minWidth: 100, height: 36, fontSize: "0.8rem", textTransform: "none", borderRadius: 2, fontWeight: 600,
                backgroundColor: active ? COLORS.primary : COLORS.grey[300],
                color: active ? COLORS.white : COLORS.grey[500],
                "&:hover": { backgroundColor: active ? COLORS.primaryDark : COLORS.grey[300] },
              }}
            >
              Upgrade
            </Button>
          </span>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

const renderLeadCell = (pkg, item, isItemActive, handleUpgrade, formatDate, openStatesDialog, upgradeSectionRef) => {
  const active = isItemActive(item);
  const investmentRangesWithStates = Array.isArray(item.investmentranges)
    ? item.investmentranges.map((r) => ({
        range:  r.selectedPlanInvestmetrange || "—",
        states: (r.selectedPlanStateAndDistrict || [])
          .map((s) => (typeof s === "object" ? s.state : s) || "")
          .filter((s) => s.trim() !== ""),
      }))
    : [];
  const totalLeads     = item.totalLeads     || 0;
  const sentLeads      = item.sendingLeads   || 0;
  const remainingLeads = item.remainingLeads || 0;
  const startDate = item.isPending ? "—" : formatDate(item.packageStartDate);
  const endDate   = item.isPending ? "—" : formatDate(item.packageEndDate);

  return (
    <TableRow
      key={`lead-${pkg._id}-${item._id}`}
      sx={{ "&:hover": { backgroundColor: COLORS.grey[50] }, transition: "background-color 0.2s ease", "&:last-child td": { borderBottom: 0 } }}
    >
      <TableCell align="center" sx={{ py: 2, px: 1 }}>
        <Typography fontWeight={700} fontSize="1rem" color={COLORS.primary}>
          {item.validity ? `${item.validity} Days` : "—"}
        </Typography>
        <Typography fontSize="0.8rem" fontWeight={700} color={COLORS.black[600]}>
          {item.packagesType || pkg.packagesType} PLAN
        </Typography>
      </TableCell>
      <TableCell align="center" sx={{ py: 2, px: 1 }}>
        <Typography fontWeight={600} fontSize="0.8rem" color={COLORS.primaryDark}>
          {item.investmetRageLabel || item.investmentGroupLabel || "—"}
        </Typography>
      </TableCell>
      <TableCell align="center" sx={{ py: 2, px: 1 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, alignItems: "center" }}>
          {investmentRangesWithStates.length > 0 ? investmentRangesWithStates.map((rd, i) => (
            <Typography key={i} fontSize="0.8rem" fontWeight={600} color={COLORS.primaryDark}>
              {rd.range.length > 30 ? rd.range.substring(0, 20) + "..." : rd.range}
            </Typography>
          )) : <Typography fontSize="0.8rem" color={COLORS.grey[500]}>—</Typography>}
        </Box>
      </TableCell>
      <TableCell align="center" sx={{ py: 2, px: 1 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, alignItems: "center" }}>
          {investmentRangesWithStates.length > 0 ? investmentRangesWithStates.map((rd, i) => (
            <Box
              key={i} onClick={() => openStatesDialog(rd.states, rd.range)}
              sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, cursor: "pointer", padding: "2px 8px", borderRadius: 1 }}
            >
              <Typography fontSize="0.8rem" color={COLORS.primary} fontWeight={600}>{rd.states.length}</Typography>
              <VisibilityOutlinedIcon sx={{ fontSize: 14, color: COLORS.primary }} />
            </Box>
          )) : <Typography fontSize="0.8rem" color={COLORS.grey[500]}>—</Typography>}
        </Box>
      </TableCell>
      <TableCell align="center" sx={{ py: 2, px: 1 }}>
        <Typography fontWeight={700} fontSize="1rem" color={COLORS.black}>{totalLeads}</Typography>
      </TableCell>
      <TableCell align="center" sx={{ py: 2, px: 1 }}>
        <Typography fontWeight={600} fontSize="1rem" color={COLORS.secondaryDark}>{sentLeads}</Typography>
      </TableCell>
      <TableCell align="center" sx={{ py: 2, px: 1 }}>
        <Typography fontWeight={600} fontSize="1rem" color={remainingLeads > 0 ? COLORS.primary : COLORS.grey[400]}>
          {remainingLeads}
        </Typography>
      </TableCell>
      <TableCell align="center" sx={{ py: 2, px: 1 }}>
        <StatusChip item={item} />
      </TableCell>
      <TableCell align="center" sx={{ py: 2, px: 1 }}>
        <Typography fontSize="0.85rem" color={COLORS.black[700]}>{startDate}</Typography>
      </TableCell>
      <TableCell align="center" sx={{ py: 2, px: 1 }}>
        <Typography fontSize="0.85rem" color={COLORS.black[700]}>{endDate}</Typography>
      </TableCell>
      <TableCell align="center" sx={{ py: 2, px: 1 }}>
        <Tooltip title={!active ? "Only active plans can be upgraded" : ""} arrow>
          <span>
            <Button
              variant="contained" size="small"
              onClick={() => handleUpgrade(pkg, item, upgradeSectionRef)}
              disabled={!active}
              sx={{
                minWidth: 100, height: 36, fontSize: "0.8rem", textTransform: "none", borderRadius: 2, fontWeight: 600,
                backgroundColor: active ? COLORS.primary : COLORS.grey[300],
                color: active ? COLORS.white : COLORS.grey[500],
                "&:hover": { backgroundColor: active ? COLORS.primaryDark : COLORS.grey[300] },
              }}
            >
              Upgrade
            </Button>
          </span>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

// ─── Desktop Package Table ────────────────────────────────────────────────────

const DesktopPackageTable = ({ grouped, shouldShowFree, isItemActive, handleUpgrade, formatDate, openStatesDialog, upgradeSectionRef }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
    {shouldShowFree && grouped.FREE.length > 0 && (
      <Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: COLORS.secondaryDark, mb: 2, fontSize: "1.1rem", display: "flex", alignItems: "center", gap: 1 }}
        >
          <Box sx={{ width: 4, height: 24, backgroundColor: COLORS.secondary, borderRadius: 2 }} />
          Free Package
        </Typography>
        <StyledTableWrapper width="60%" minWidth={400}>
          <TableHeader config={TABLE_CONFIGS.FREE} />
          <TableBody>
            {grouped.FREE.map(({ pkg, item }) => renderFreeCell(pkg, item, isItemActive, handleUpgrade, upgradeSectionRef))}
          </TableBody>
        </StyledTableWrapper>
      </Box>
    )}

    {grouped.LISTING.length > 0 && (
      <Box>
        <StyledTableWrapper width="100%" minWidth={500}>
          <TableHeader config={TABLE_CONFIGS.LISTING} />
          <TableBody>
            {grouped.LISTING.map(({ pkg, item }) => renderListingCell(pkg, item, isItemActive, handleUpgrade, formatDate, upgradeSectionRef))}
          </TableBody>
        </StyledTableWrapper>
      </Box>
    )}

    {grouped.LEAD.length > 0 && (
      <Box>
        <StyledTableWrapper width="100%" minWidth={900}>
          <TableHeader config={TABLE_CONFIGS.LEAD} />
          <TableBody>
            {grouped.LEAD.map(({ pkg, item }) => renderLeadCell(pkg, item, isItemActive, handleUpgrade, formatDate, openStatesDialog, upgradeSectionRef))}
          </TableBody>
        </StyledTableWrapper>
      </Box>
    )}
  </Box>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const ExistingPackageDisplay = ({
  data, loading, error, category, industry, brandName, isLoggedIn, upgradeSectionRef, onHighlightExcludePlan,
  allPlans = [], leadsDropdownData = {}, onAddToPaymentSummary, onUpgradeModeChange,
  ficoInvestmentRanges = [], ALL_INDIA_STATES = [], INDIA_STATES = {}, finalToken,
  expansionStates = [], sectionExpanded, onSectionChange, allStates,
}) => {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [dialog,         setDialog]         = useState({ open: false, states: [], label: "" });
  const [upgradeDialog,  setUpgradeDialog]  = useState({ open: false, pkg: null, item: null });
  const [openStateModal, setOpenStateModal] = useState(false);
  const [currentEditingRange, setCurrentEditingRange] = useState(null);
  const [blockedStates,  setBlockedStates]  = useState(new Set());
  const [selectedStates, setSelectedStates] = useState(new Set());
  const [stateSelections, setStateSelections] = useState({});
  const [highlightExcludePlan, setHighlightExcludePlan] = useState(null);
  const [currentRangeStates,   setCurrentRangeStates]   = useState([]);
  const liveSelectionsRef = useRef({});

  if (!isLoggedIn) return null;

  // ── Derived data ──────────────────────────────────────────────────────────

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
          if (!map[range]) map[range] = {};
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
    const blocked = new Set();
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
    const item = upgradeDialog.item;
    const ownerPlanId = allPlans.find((p) => p.planName?.toLowerCase() === (item.packagesName || "").toLowerCase())?._id;
    if (!ownerPlanId) return;
    const seeded = { ...stateSelections };
    (item.investmentranges || []).forEach((r) => {
      const key = `${ownerPlanId}_${r.selectedPlanInvestmetrange}`;
      if (!seeded[key]) {
        seeded[key] = (r.selectedPlanStateAndDistrict || [])
          .map((s) => (typeof s === "object" ? s.state : s)).filter(Boolean);
      }
    });
    setStateSelections(seeded);
    liveSelectionsRef.current = seeded;
  }, [upgradeDialog.open, upgradeDialog.item?._id]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

const handleUpgrade = (pkg, item, sectionRef) => {
  const packageType = (pkg.packagesType || "").toUpperCase();
  
  const scrollToElement = (element) => {
    if (!element) return;
    
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      // Find ALL fixed/sticky elements that might overlap
      const getOverlayHeight = () => {
        let maxHeight = 0;
        const fixedElements = document.querySelectorAll('*');
        fixedElements.forEach(el => {
          const style = window.getComputedStyle(el);
          if (style.position === 'fixed' || style.position === 'sticky') {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 0) { // Only consider elements at the top
              maxHeight = Math.max(maxHeight, rect.height);
            }
          }
        });
        return maxHeight;
      };
      
      const navbarHeight = getOverlayHeight();
      const elementRect = element.getBoundingClientRect();
      const offsetPosition = elementRect.top + window.pageYOffset - navbarHeight - 20; // Extra 20px padding
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    });
  };
  
  if (packageType === "FREE") {
    onHighlightExcludePlan?.(item.packagesName || pkg.packagesName);
    scrollToElement(sectionRef?.current);
  } else if (packageType === "LISTING") {
    onUpgradeModeChange?.(true, pkg._id);
    onHighlightExcludePlan?.(item.packagesName || pkg.packagesName);
    const element = document.getElementById("brand-listing-section") || sectionRef?.current;
    scrollToElement(element);
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

  // ── Early returns ─────────────────────────────────────────────────────────

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

  // ── Group packages ────────────────────────────────────────────────────────

  const grouped = { FREE: [], LISTING: [], LEAD: [] };
  const isItemActive = (item) => item.isActive && !item.isPending;

  data?.packages?.forEach((pkg) => {
    const type = (pkg.packagesType || pkg.PackagesType || "").toUpperCase();
    if (grouped[type]) {
      const arr = pkg.investmetPackages || pkg.InvestmetPackages || pkg.InvestmentPackages || pkg.packages || [];
      arr.forEach((item) => grouped[type].push({ pkg, item: { ...item, packagesName: item.packagesName || pkg.packagesName } }));
    }
  });

  const hasActivePaidPackage =
    grouped.LEAD.some(({ item }) => isItemActive(item)) ||
    grouped.LISTING.some(({ item }) => isItemActive(item));
  const shouldShowFree = !hasActivePaidPackage && grouped.FREE.length > 0;
  const hasAnyPackages = grouped.FREE.length > 0 || grouped.LISTING.length > 0 || grouped.LEAD.length > 0;

  if (!hasAnyPackages) return null;

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

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <SectionAccordion
        title="CURRENT ACTIVE PLANS"
        defaultExpanded
        expanded={sectionExpanded}
        onChange={onSectionChange}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", mb: 5, px: { xs: 0, sm: 0, md: 1 } }}>
          <Typography
            variant="h4"
            sx={{
              display: { xs: "none", sm: "block" }, fontWeight: 700, color: COLORS.black, mb: 3,
              fontSize: { xs: "1.3rem", sm: "1.5rem", md: "1.9rem" }, textAlign: "center",
            }}
          >
            CURRENT ACTIVE PLANS
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center", justifyContent: "center", width: "100%", maxWidth: { xs: "100%", sm: "600px", md: "1200px" } }}>
            {!isMobile && (
              <DesktopPackageTable
                grouped={grouped} shouldShowFree={shouldShowFree} isItemActive={isItemActive}
                handleUpgrade={handleUpgrade} formatDate={formatDate}
                openStatesDialog={openStatesDialog} upgradeSectionRef={upgradeSectionRef}
              />
            )}
            {isMobile && hasAnyPackages && (
              <MobileTabView
                grouped={grouped} shouldShowFree={shouldShowFree} isItemActive={isItemActive}
                handleUpgrade={handleUpgrade} formatDate={formatDate}
                openStatesDialog={openStatesDialog} upgradeSectionRef={upgradeSectionRef}
              />
            )}
          </Box>
        </Box>
      </SectionAccordion>

      {/* ── States Dialog ── */}
      <Dialog
        open={dialog.open}
        onClose={() => setDialog({ ...dialog, open: false })}
        PaperProps={{ sx: { borderRadius: 3, minWidth: { xs: "90%", sm: 380 }, maxWidth: 500, m: { xs: 2, sm: 0 }, p: 0, overflow: "hidden" } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1, backgroundColor: COLORS.grey[50], borderBottom: `1px solid ${COLORS.border}` }}>
          <Box>
            <Typography fontWeight={700} fontSize={TEXT_SIZES.medium} color={COLORS.black}>Selected States</Typography>
            {dialog.label && <Typography fontSize={TEXT_SIZES.small} color={COLORS.primary[500]}>{dialog.label}</Typography>}
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
              <Chip
                key={typeof state === "object" ? state._id || state.state : state}
                label={typeof state === "object" ? state.state : state}
                size="small"
                sx={{ color: COLORS.primaryDark, fontWeight: 600, fontSize: TEXT_SIZES.xs, borderRadius: 1.5 }}
              />
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
        onUpgrade={(data) => { onAddToPaymentSummary?.({ ...data }); setUpgradeDialog({ open: false, pkg: null, item: null }); }}
        onViewSummary={(data) => { onAddToPaymentSummary?.({ ...data }); setUpgradeDialog({ open: false, pkg: null, item: null }); }}
      />
    </>
  );
};

export default ExistingPackageDisplay;