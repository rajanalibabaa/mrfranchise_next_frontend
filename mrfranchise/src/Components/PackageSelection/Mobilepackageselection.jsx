"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { COLORS, T, fmtINR, getUniqueStatesForGroup } from "./Mobilepackagetheme";
import {
  ScrollableCardList,
  SectionAccordion,
  RangeGroupCard,
  ListingPlanDetail,
} from "./Mobilepackagecomponents";

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

  // ── Listing plans ─────────────────────────────────────────────────────────
  const listingPlans = useMemo(
    () =>
      plans
        .filter((plan) => plan.packages?.length === 1 && plan.planName?.toLowerCase() !== "free")
        .sort((a, b) => (a.packages?.[0]?.amount || 0) - (b.packages?.[0]?.amount || 0)),
    [plans]
  );

  const [activeListingId, setActiveListingId] = useState(null);

  useEffect(() => {
    if (listingPlans.length > 0 && !activeListingId) {
      setActiveListingId(listingPlans[0]._id);
    }
  }, [listingPlans]);

  // ── Derived data ──────────────────────────────────────────────────────────
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

  useEffect(() => {
    const firstLabel = Object.keys(groupedPackages)[0];
    if (firstLabel && expandedGroup === null) {
      setExpandedGroup(firstLabel);
    }
  }, [groupedPackages]);

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

  // ── Listing plan helpers ──────────────────────────────────────────────────
  const activeListing = useMemo(
    () => listingPlans.find((p) => p._id === activeListingId),
    [listingPlans, activeListingId]
  );

  const maxListingPrice = useMemo(
    () => Math.max(...listingPlans.map((p) => p.packages?.[0]?.amount || 0)),
    [listingPlans]
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ width: "100%", mt: 3 }}>
      <Typography sx={{ fontSize: "1.3rem", fontWeight: 700, color: COLORS.black, mb: 2, textAlign: "center" }}>
        SELECT NEW PLAN
      </Typography>

      {/* ── INVESTOR LEAD PLANS ── */}
      <SectionAccordion
        title="INVESTOR LEAD PLANS"
        defaultExpanded
        expanded={sectionExpanded?.includes("investor")}
        onChange={(isOpen) => {
          if (isOpen) {
            onSectionChange?.("investor")(true);
            if (sectionExpanded?.includes("listing")) onSectionChange?.("listing")(false);
          } else {
            onSectionChange?.("investor")(false);
          }
        }}
      >
        <Box sx={{ px: 2, textAlign: "center", overflow: "visible" }}>
          <Typography sx={{ fontSize: T.lg, color: COLORS.black[600], mb: 2 }}>
            Franchise | Dealer and Distributor | Channel Partner | Agent and Association
          </Typography>

          {selectedPlan && (
            <>
              <Box sx={{ mb: 1.5 }}>
                <Typography sx={{ fontSize: T.xl, fontWeight: 700, color: COLORS.primary, mb: 0.3 }}>
                  SELECT CAMPAIGN PERIOD
                </Typography>
              </Box>

              {/* Campaign period tabs */}
              <Box sx={{ display: "flex", gap: 1, borderRadius: 4, p: 0.5, position: "relative" }}>
                {filteredPlans.map((plan) => {
                  const days = [...new Set(plan.packages?.map((p) => p.validityDays).filter(Boolean))][0];
                  const isSelected = selectedGroup === plan._id;
                  return (
                    <Box
                      key={plan._id}
                      onClick={() => setSelectedGroup(plan._id)}
                      sx={{
                        flex: 1, textAlign: "center", py: 1.5, px: 1,
                        borderRadius: 3, cursor: "pointer", position: "relative", zIndex: 1,
                        transition: "all 0.2s ease",
                        backgroundColor: isSelected ? COLORS.primary : COLORS.white,
                        border: `2px solid ${COLORS.primary}`,
                        boxShadow: isSelected ? `0 4px 12px ${COLORS.primary}40` : "0 2px 4px rgba(0,0,0,0.05)",
                        transform: isSelected ? "scale(1.02)" : "scale(1)",
                        "&:hover": {
                          transform: "scale(1.02)",
                          boxShadow: `0 4px 12px ${isSelected ? COLORS.primary + "40" : "rgba(0,0,0,0.1)"}`,
                        },
                      }}
                    >
                      <Typography sx={{ fontSize: T.xl, fontWeight: 900, color: isSelected ? COLORS.white : COLORS.grey[700], transition: "color 0.2s ease", lineHeight: 1.2 }}>
                        {days}
                      </Typography>
                      <Typography sx={{ fontSize: T.md, fontWeight: 600, color: isSelected ? "rgba(255,255,255,0.9)" : COLORS.grey[500], transition: "color 0.2s ease", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Days
                      </Typography>
                    </Box>
                  );
                })}
              </Box>

              <Typography sx={{ fontSize: T.xl, fontWeight: 700, color: COLORS.primary, mb: 1, mt: 2 }}>
                SELECT INVESTMENT RANGES
              </Typography>

              {/* Range group cards */}
              <Box sx={{ mx: -2, mb: 1 }}>
                <ScrollableCardList maxHeight={480}>
                  <Box sx={{ px: 2 }}>
                    {Object.keys(groupedPackages).map((label) => {
                      const { pkg, items } = groupedPackages[label];
                      const leadsKey = leadsKeyForGroup(label);
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
                            allStates={allStates}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                </ScrollableCardList>
              </Box>

              <Box sx={{ display: "grid", gap: 1.5, mb: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handleAddToCart}
                  sx={{
                    height: 48, borderRadius: 3, textTransform: "none", fontWeight: 700,
                    fontSize: T.xl, borderColor: COLORS.secondary, color: COLORS.black, borderWidth: 3,
                    backgroundColor: COLORS.white, "&:hover": { backgroundColor: COLORS.grey[100] },
                  }}
                >
                  Add to Plan
                </Button>
                {finalToken && (
                  <Button
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                    fullWidth
                    onClick={() => setOpenConfirmDialog(true)}
                    sx={{
                      borderRadius: 2, textTransform: "none", fontWeight: 700,
                      fontSize: T.xl, color: COLORS.white,
                      backgroundColor: COLORS.secondaryDark, borderColor: COLORS.secondaryDark,
                    }}
                  >
                    Add New Investment Range
                  </Button>
                )}
              </Box>
            </>
          )}
        </Box>
      </SectionAccordion>

      {/* ── BRAND LISTING PLANS ── */}
      {!hideListingPlans && listingPlans.length > 0 && (
        <Box id="brand-listing-section">
          <SectionAccordion
            title="BRAND LISTING PLANS"
            expanded={sectionExpanded?.includes("listing")}
            onChange={(isOpen) => {
              if (isOpen) {
                if (sectionExpanded?.includes("investor")) onSectionChange?.("investor")(false);
                onSectionChange?.("listing")(true);
              } else {
                onSectionChange?.("listing")(false);
              }
            }}
          >
            <Box sx={{ px: 2, pb: 2 }}>
              <Typography sx={{ fontSize: T.xl, color: COLORS.black[600], mb: 2, textAlign: "center" }}>
                List your Brand to increase its Digital Visibility
              </Typography>

              {/* Listing plan tabs */}
              <Box sx={{
                display: "flex", overflowX: "auto", gap: 0.3, pb: 1,
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-track": { backgroundColor: COLORS.grey[300], borderRadius: "6px", margin: "2px 0" },
                "&::-webkit-scrollbar-thumb": { backgroundColor: COLORS.primary, borderRadius: "6px", minHeight: "40px" },
                "&::-webkit-scrollbar-thumb:hover": { backgroundColor: COLORS.primaryDark },
                scrollbarWidth: "thin",
                scrollbarColor: `${COLORS.primary} ${COLORS.grey[300]}`,
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
                        flexShrink: 0, px: 1.4, py: 0.5, borderRadius: "24px",
                        fontSize: "1.3rem", fontWeight: 700, cursor: "pointer",
                        border: `1.5px solid ${isActive ? COLORS.primary : isAdded ? COLORS.secondary : COLORS.border}`,
                        backgroundColor: isActive ? COLORS.primary : isAdded ? "rgba(76,176,79,0.08)" : COLORS.white,
                        color: isActive ? COLORS.white : isAdded ? COLORS.secondary : COLORS.grey[700],
                        transition: "all 0.2s ease",
                        display: "flex", alignItems: "center",
                        "&:hover": { transform: "translateY(-2px)", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
                      }}
                    >
                      {isMostPopular && <Typography component="span" sx={{ fontSize: "1rem" }}></Typography>}
                      {plan.planName}
                      {isAdded && <Typography component="span" sx={{ fontSize: "0.7rem", ml: 0.3 }}>✓</Typography>}
                    </Box>
                  );
                })}
              </Box>

              {/* Selected listing plan detail */}
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
        sx={{ "& .MuiSnackbar-root": { bottom: { xs: 70, sm: 80, md: 90 } } }}
      >
        <Alert severity={snack.sev} variant="filled" sx={{ fontSize: T.sm, fontWeight: 600, borderRadius: 2 }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MobilePackageSelection;