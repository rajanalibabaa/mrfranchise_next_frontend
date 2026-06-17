import React, { useState, useEffect, useRef } from "react";
import {
  Dialog, DialogTitle, DialogContent, IconButton,
  Box, Typography, Chip, Divider,
  Button, Checkbox, FormControlLabel,
  Snackbar, Alert, useMediaQuery, useTheme,
  Card, CardContent, Grid, Paper, List, ListItem, ListItemText, ListItemIcon
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const UpgradeDialog = ({
  open,
  onClose,
  pkg,
  item,
  allPlans = [],
  leadsDropdownData = {},
  ficoInvestmentRanges = [],
  selectedStates,
  setSelectedStates,
  allStates = [],
  COLORS,
  TEXT_SIZES,
  INDIA_STATES = {},
  finalToken,
  getAlreadySelectedStatesInOtherRanges,
  getStatesToDisplay,
  handleSelectAll,
  handleClearAll,
  currentRangeStates = [],
  setCurrentRangeStates,
  renderStatesByRegion,
  onUpgrade,
  onViewSummary,

  openStateModal,
  setOpenStateModal,
  currentEditingRange,
  setCurrentEditingRange,
  blockedStates,
  setBlockedStates,
  stateSelections,
  setStateSelections,
  allPlanStatesByRange = {},
  onSaveStates,
  scrollToPaymentSummary,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [selectedLeads, setSelectedLeads] = useState({});
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [showListingPopup, setShowListingPopup] = useState(false);
  const liveSelectionsRef = useRef({});

  // ============================================================
  // DERIVED VALUES
  // ============================================================
  const existingRanges =
    item?.investmentranges?.map((r) => r.selectedPlanInvestmetrange).filter(Boolean) || [];

  const [checkedRanges, setCheckedRanges] = useState(() => {
    if (!item?.investmentranges?.length) return {};
    const initial = {};
    allPlans
      .filter((p) => p.packages?.length > 1 && p.planName?.toLowerCase() !== "free")
      .forEach((plan) => {
        initial[plan._id] = new Set(existingRanges);
      });
    return initial;
  });

  const [stateCounts, setStateCounts] = useState(() => {
    if (!item?.investmentranges?.length) return {};
    const initial = {};
    allPlans
      .filter((p) => p.packages?.length > 1 && p.planName?.toLowerCase() !== "free")
      .forEach((plan) => {
        item.investmentranges.forEach((r) => {
          const key = `${plan._id}_${r.selectedPlanInvestmetrange}`;
          initial[key] = (r.selectedPlanStateAndDistrict || []).length;
        });
      });
    return initial;
  });

  useEffect(() => {
    if (!open || !item?._id) return;
    const savedSelections = localStorage.getItem(`stateSelections_${item._id}`);
    if (savedSelections) {
      try {
        const parsed = JSON.parse(savedSelections);
        setStateSelections((prev) => ({ ...prev, ...parsed }));
        liveSelectionsRef.current = { ...liveSelectionsRef.current, ...parsed };
        const newCounts = {};
        Object.entries(parsed).forEach(([key, states]) => {
          newCounts[key] = states.length;
        });
        setStateCounts((prev) => ({ ...prev, ...newCounts }));
        setCheckedRanges((prev) => {
          const updated = { ...prev };
          Object.entries(parsed).forEach(([key, states]) => {
            if (states.length > 0) {
              const [planId, range] = key.split("_");
              if (planId && range) {
                if (!updated[planId]) updated[planId] = new Set();
                updated[planId].add(range);
              }
            }
          });
          return updated;
        });
      } catch (e) {}
    }
  }, [open, item?._id]);

  const packageType = (pkg?.packagesType || "").toUpperCase();
  
  // Show listing popup on mobile if package type is LISTING
  useEffect(() => {
    if (open && isMobile && packageType === "LISTING") {
      setShowListingPopup(true);
    } else {
      setShowListingPopup(false);
    }
  }, [open, isMobile, packageType]);

  if (!open) return null;

  // ============================================================
  // LISTING POPUP FOR MOBILE
  // ============================================================
  if (isMobile && packageType === "LISTING") {
    return (
      <Dialog
        open={showListingPopup}
        onClose={() => setShowListingPopup(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            mx: 2,
            maxHeight: "90vh",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 2,
            backgroundColor: "#dbeafe",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Box>
            <Typography fontWeight={700} fontSize="1rem" color="#111">
              Listing Package Details
            </Typography>
            <Typography fontSize="0.7rem" color="#757575">
              Upgrade Information
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => {
            setShowListingPopup(false);
            onClose();
          }}>
            <CloseIcon fontSize="small" sx={{ color: "#9e9e9e" }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 2, overflowY: "auto" }}>
          {/* Package Info Card */}
          <Card sx={{ mb: 2, borderRadius: 2, boxShadow: 1 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                <StorefrontIcon sx={{ color: "#fb8c00", mr: 1 }} />
                <Typography variant="h6" fontWeight={700} color="#111">
                  Package Information
                </Typography>
              </Box>
              <Divider sx={{ mb: 1.5 }} />
              
              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="#757575">
                    Package Name
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color="#111">
                    {pkg?.packagesName || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="#757575">
                    Package Type
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color="#111">
                    {pkg?.packagesType || "Listing"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="#757575">
                    Investment Range
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color="#111">
                    {item?.investmetRageLabel || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="#757575">
                    Validity
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color="#111">
                    {pkg?.validityDays || "N/A"} Days
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Current Investment Ranges */}
          {item?.investmentranges && item.investmentranges.length > 0 && (
            <Card sx={{ mb: 2, borderRadius: 2, boxShadow: 1 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                  <AttachMoneyIcon sx={{ color: "#4cb04f", mr: 1 }} />
                  <Typography variant="h6" fontWeight={700} color="#111">
                    Current Investment Ranges
                  </Typography>
                </Box>
                <Divider sx={{ mb: 1.5 }} />
                
                {item.investmentranges.map((range, idx) => (
                  <Box key={idx} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight={700} color="#fb8c00" gutterBottom>
                      {range.selectedPlanInvestmetrange}
                    </Typography>
                    
                    {/* States and Districts */}
                    {range.selectedPlanStateAndDistrict && range.selectedPlanStateAndDistrict.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="#757575" gutterBottom>
                          Selected States/Districts:
                        </Typography>
                        <Box sx={{ 
                          display: "flex", 
                          flexWrap: "wrap", 
                          gap: 0.5,
                          mt: 0.5
                        }}>
                          {range.selectedPlanStateAndDistrict.map((location, locIdx) => {
                            const locationName = typeof location === "object" 
                              ? location.state 
                              : location;
                            return (
                              <Chip
                                key={locIdx}
                                label={locationName}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: "0.7rem", height: 24 }}
                              />
                            );
                          })}
                        </Box>
                      </Box>
                    )}
                    
                    {idx < item.investmentranges.length - 1 && <Divider sx={{ my: 1.5 }} />}
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Additional Details */}
          <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                <CalendarTodayIcon sx={{ color: "#1565c0", mr: 1 }} />
                <Typography variant="h6" fontWeight={700} color="#111">
                  Additional Details
                </Typography>
              </Box>
              <Divider sx={{ mb: 1.5 }} />
              
              <List dense disablePadding>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <LocationOnIcon sx={{ fontSize: 18, color: "#757575" }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Total States Covered"
                    secondary={item?.investmentranges?.reduce((total, range) => 
                      total + (range.selectedPlanStateAndDistrict?.length || 0), 0
                    ) || 0}
                    secondaryTypographyProps={{ fontWeight: 600, color: "#111" }}
                  />
                </ListItem>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <StorefrontIcon sx={{ fontSize: 18, color: "#757575" }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Total Investment Ranges"
                    secondary={item?.investmentranges?.length || 0}
                    secondaryTypographyProps={{ fontWeight: 600, color: "#111" }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </DialogContent>

        <Box sx={{ 
          p: 2, 
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#fff"
        }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              setShowListingPopup(false);
              onClose();
            }}
            sx={{
              py: 1.5,
              fontWeight: 700,
              fontSize: "0.95rem",
              textTransform: "none",
              borderRadius: 2,
              backgroundColor: "#fb8c00",
              "&:hover": { backgroundColor: "#e65100" },
            }}
          >
            Close
          </Button>
        </Box>
      </Dialog>
    );
  }

  // ============================================================
  // NORMAL UPGRADE DIALOG (for non-listing packages or desktop)
  // ============================================================
  const normalizeRange = (value) =>
    String(value || "")
      .toLowerCase()
      .replace(/₹/g, "rs").replace(/\brupees\b/g, "rs")
      .replace(/\brs\.?\b/g, "").replace(/\blakhs\b/g, "lakh")
      .replace(/\bcrores\b/g, "crore").replace(/\bto\b/g, "-")
      .replace(/[^a-z0-9]/g, "").trim();

  const isFicoInvestmentRange = (range) =>
    ficoInvestmentRanges.some((f) => normalizeRange(f) === normalizeRange(range));

  const clickedRangeLabel = item?.investmetRageLabel || "";

  // ============================================================
  // BUILD ROWS
  // ============================================================
  const plans = allPlans.filter(
    (p) => p.packages?.length > 1 && p.planName?.toLowerCase() !== "free"
  );

  const rows = plans.map((plan) => {
    const matchedPkg =
      plan.packages.find((p) => p.investmentRangeLabel === clickedRangeLabel) ||
      plan.packages[0];
    const pkgObj = matchedPkg;
    const rangeLabel = pkgObj?.investmentRangeLabel || "—";
    const validityDays = pkgObj?.validityDays || "—";
    const pricePerState = pkgObj?.amount || 0;
    let investmentRanges = pkgObj?.investmentRange || [];
    if (ficoInvestmentRanges.length > 0)
      investmentRanges = investmentRanges.filter(isFicoInvestmentRange);

    const leadOptions =
      leadsDropdownData[`${plan._id}_${rangeLabel}`] ||
      (pkgObj?.totalLeads
        ? Array.isArray(pkgObj.totalLeads) ? pkgObj.totalLeads : [pkgObj.totalLeads]
        : [20, 40, 60]);

    const currentLead = selectedLeads[plan._id] ?? leadOptions[0] ?? 20;
    const checked = checkedRanges[plan._id] || new Set();

    const allSelectedStates = new Set();
    [...checked].forEach((r) => {
      const key = `${plan._id}_${r}`;
      let states = stateSelections[key];
      if (!states) {
        const matchingRange = item?.investmentranges?.find(
          (ir) => ir.selectedPlanInvestmetrange === r
        );
        states = (matchingRange?.selectedPlanStateAndDistrict || [])
          .map((s) => (typeof s === "object" ? s.state : s)).filter(Boolean);
      }
      states.forEach((s) => allSelectedStates.add(s));
    });

    const totalStates = allSelectedStates.size;
    const minLeads = leadOptions.length > 0 ? Math.min(...leadOptions) : 1;
    const divisor = minLeads > 0 ? minLeads : 1;

    return {
      id: plan._id, planName: plan.planName, validityDays,
      pricePerState, leadOptions, currentLead,
      investmentRanges, rangeLabel, checked, totalStates,
      totalLeads: currentLead * totalStates,
      totalAmount: (pricePerState / divisor) * totalStates * currentLead,
    };
  });

  const defaultPlanId =
    rows.find((r) => r.planName?.toLowerCase() === (item?.packagesName || "").toLowerCase())?.id ??
    rows[0]?.id;
  const activePlanId = selectedPlanId ?? defaultPlanId;
  const activePlan = rows.find((r) => r.id === activePlanId) ?? rows[0];

  const setLead = (planId, val) =>
    setSelectedLeads((p) => ({ ...p, [planId]: val }));

  const toggleRange = (planId, range) =>
    setCheckedRanges((p) => {
      const s = new Set(p[planId] || []);
      s.has(range) ? s.delete(range) : s.add(range);
      return { ...p, [planId]: s };
    });

  const editStates = (planId, range) => {
    setCurrentEditingRange({ planId, range });
    const key = `${planId}_${range}`;
    const sessionStates = stateSelections?.[key];
    const matchingRange = item?.investmentranges?.find(
      (ir) => ir.selectedPlanInvestmetrange === range
    );
    const existingStates = (matchingRange?.selectedPlanStateAndDistrict || [])
      .map((s) => (typeof s === "object" ? s.state : s)).filter((s) => s?.trim());
    const statesToPreselect = sessionStates?.length ? sessionStates : existingStates;
    const rangeSpecificStates = Object.values(allPlanStatesByRange?.[range] || {})
      .flat().filter((s, i, arr) => arr.indexOf(s) === i);
    const statesPool = rangeSpecificStates.length > 0 ? rangeSpecificStates : (allStates ?? []);
    setCurrentRangeStates(statesPool);
    setBlockedStates(new Set());
    setSelectedStates(new Set(statesToPreselect));
    setOpenStateModal(true);
  };

  const handleSaveStatesFromModal = () => {
    if (!currentEditingRange) return;
    const stateArray = Array.from(selectedStates);
    const { planId, range } = currentEditingRange;
    const key = `${planId}_${range}`;
    liveSelectionsRef.current = { ...liveSelectionsRef.current, [key]: stateArray };
    setStateSelections((prev) => {
      const updated = { ...prev, [key]: stateArray };
      try { localStorage.setItem(`stateSelections_${item?._id}`, JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
    setStateCounts((prev) => ({ ...prev, [key]: stateArray.length }));
    setCheckedRanges((p) => {
      const s = new Set(p[planId] || []);
      s.add(range);
      return { ...p, [planId]: s };
    });
    onSaveStates(stateArray);
    setOpenStateModal(false);
    setCurrentEditingRange(null);
  };

  const buildStatesByRange = (planId, checkedRangesSet) => {
    const result = {};
    [...checkedRangesSet].forEach((range) => {
      const key = `${planId}_${range}`;
      const states =
        stateSelections[key] ?? liveSelectionsRef.current[key] ??
        (item?.investmentranges?.find((ir) => ir.selectedPlanInvestmetrange === range)
          ?.selectedPlanStateAndDistrict || [])
          .map((s) => (typeof s === "object" ? s.state : s)).filter(Boolean);
      result[range] = states;
    });
    return result;
  };

  const handleAddToPlan = () => {
    const checkedRangesList = [...activePlan.checked];
    if (checkedRangesList.length === 0) {
      setSnackbar({ open: true, message: "Please select at least one investment range." });
      return;
    }
    const missingStates = checkedRangesList.filter((range) => {
      const key = `${activePlan.id}_${range}`;
      const states = stateSelections[key] ?? liveSelectionsRef.current[key] ??
        (item?.investmentranges?.find((ir) => ir.selectedPlanInvestmetrange === range)
          ?.selectedPlanStateAndDistrict || []);
      return !states || states.length === 0;
    });
    if (missingStates.length > 0) {
      setSnackbar({ open: true, message: `Please select states for: ${missingStates.join(", ")}` });
      return;
    }
    onUpgrade?.({
      planId: activePlan.id, planName: activePlan.planName,
      leads: activePlan.currentLead, checkedRanges: checkedRangesList,
      statesByRange: buildStatesByRange(activePlan.id, activePlan.checked),
      totalLeads: activePlan.totalLeads, totalAmount: activePlan.totalAmount,
      pricePerState: activePlan.pricePerState, validityDays: activePlan.validityDays,
      investmentRangeLabel: activePlan.rangeLabel, rangeLabel: activePlan.rangeLabel,
    });
    onClose?.();
    setTimeout(() => scrollToPaymentSummary?.(), 300);
  };

  // ============================================================
  // MOBILE CARD LAYOUT — matches screenshot design
  // ============================================================

  const MobileView = () => (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", backgroundColor: "#f5f5f5" }}>

      {/* ── Plan Day Selector ── */}
      <Box sx={{ display: "flex", gap: 1.5, px: 2, pt: 2, pb: 1.5, backgroundColor: "#f5f5f5" }}>
        {rows.map((row) => {
          const isActive = row.id === activePlanId;
          return (
            <Box
              key={row.id}
              onClick={() => setSelectedPlanId(row.id)}
              sx={{
                flex: "0 0 auto",
                minWidth: 64, px: 2, py: 1,
                borderRadius: 2,
                cursor: "pointer",
                textAlign: "center",
                backgroundColor: isActive ? "#fb8c00" : "transparent",
                transition: "all 0.15s",
              }}
            >
              <Typography
                fontSize="1.1rem" fontWeight={800} lineHeight={1.2}
                color={isActive ? "#fff" : "#bbb"}
              >
                {row.validityDays}
              </Typography>
              <Typography fontSize="0.72rem" color={isActive ? "#fff" : "#bbb"} fontWeight={500}>
                Days
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* ── Investment Range Cards ── */}
      {activePlan && (
        <Box sx={{ flex: 1, overflowY: "auto", px: 1.5, pb: 1, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {activePlan.investmentRanges.length === 0 ? (
            <Typography fontSize="0.8rem" color="#9e9e9e" textAlign="center" py={4}>
              No matching investment ranges
            </Typography>
          ) : (
            activePlan.investmentRanges.map((range) => {
              const currentLeadVal = selectedLeads[activePlan.id] ?? activePlan.leadOptions[0] ?? 60;
              const minLead = Math.min(...activePlan.leadOptions);
              const maxLead = Math.max(...activePlan.leadOptions);
              const stateVal =
                stateCounts[`${activePlan.id}_${range}`] ??
                stateSelections[`${activePlan.id}_${range}`]?.length ??
                (item?.investmentranges?.find((ir) => ir.selectedPlanInvestmetrange === range)
                  ?.selectedPlanStateAndDistrict?.length ?? 0);

              const decrement = () => {
                const idx = activePlan.leadOptions.indexOf(currentLeadVal);
                if (idx > 0) setLead(activePlan.id, activePlan.leadOptions[idx - 1]);
              };
              const increment = () => {
                const idx = activePlan.leadOptions.indexOf(currentLeadVal);
                if (idx < activePlan.leadOptions.length - 1)
                  setLead(activePlan.id, activePlan.leadOptions[idx + 1]);
              };

              return (
                <Box
                  key={range}
                  sx={{
                    backgroundColor: "#fef3e2",
                    borderRadius: 2.5,
                    overflow: "hidden",
                    border: "1px solid #f5ddb0",
                  }}
                >
                  {/* Range Row */}
                  <Box
                    sx={{
                      display: "flex", alignItems: "center",
                      px: 1.5, py: 1.25, gap: 0.75,
                    }}
                  >
                    {/* Checkbox — same toggleRange as desktop */}
                    <Checkbox
                      size="small"
                      checked={(checkedRanges[activePlan.id] || new Set()).has(range)}
                      onChange={() => toggleRange(activePlan.id, range)}
                      sx={{ p: 0.25, color: "#fb8c00", "&.Mui-checked": { color: "#fb8c00" } }}
                    />

                    {/* Range Label */}
                    <Typography
                      fontSize="0.82rem" fontWeight={700} color="#222"
                      sx={{ flex: 1 }} noWrap
                    >
                      {range}
                    </Typography>

                    {/* − count + stepper */}
                    <Box
                      sx={{
                        display: "flex", alignItems: "center",
                        backgroundColor: "#fff",
                        borderRadius: 5,
                        border: "1px solid #e0c890",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      <Box
                        onClick={decrement}
                        sx={{
                          px: 1.25, py: 0.5, cursor: "pointer",
                          color: currentLeadVal <= minLead ? "#ccc" : "#fb8c00",
                          fontWeight: 700, fontSize: "1rem", lineHeight: 1,
                          userSelect: "none",
                        }}
                      >
                        −
                      </Box>
                      <Typography
                        fontSize="0.85rem" fontWeight={700} color="#222"
                        sx={{ px: 1, minWidth: 28, textAlign: "center" }}
                      >
                        {currentLeadVal}
                      </Typography>
                      <Box
                        onClick={increment}
                        sx={{
                          px: 1.25, py: 0.5, cursor: "pointer",
                          color: currentLeadVal >= maxLead ? "#ccc" : "#fb8c00",
                          fontWeight: 700, fontSize: "1rem", lineHeight: 1,
                          userSelect: "none",
                        }}
                      >
                        +
                      </Box>
                    </Box>

                    {/* State count + edit icon */}
                    <Box
                      onClick={() => editStates(activePlan.id, range)}
                      sx={{ display: "flex", alignItems: "center", gap: 0.25, cursor: "pointer", flexShrink: 0 }}
                    >
                      <Typography fontSize="0.75rem" fontWeight={700} color={stateVal > 0 ? "#e65100" : "#aaa"}>
                        {stateVal}
                      </Typography>
                      <EditIcon sx={{ fontSize: 13, color: "#e65100" }} />
                    </Box>
                  </Box>
                </Box>
              );
            })
          )}
        </Box>
      )}

      {/* ── Bottom Action Buttons ── */}
      <Box
        sx={{
          display: "flex", gap: 0, borderTop: "1px solid #e0e0e0",
          backgroundColor: "#fff", flexShrink: 0,
        }}
      >
        <Button
          onClick={handleAddToPlan}
          sx={{
            flex: 1, py: 1.75,
            fontWeight: 700, fontSize: "0.95rem",
            textTransform: "none", borderRadius: 0,
            backgroundColor: "#fff", color: "#222",
            borderRight: "1px solid #e0e0e0",
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          Add to Plan
        </Button>
        <Button
          onClick={() => onViewSummary?.({
            planId: activePlan?.id,
            planName: activePlan?.planName,
            leads: activePlan?.currentLead,
            checkedRanges: [...(activePlan?.checked || [])],
            statesByRange: buildStatesByRange(activePlan?.id, activePlan?.checked || new Set()),
            totalLeads: activePlan?.totalLeads,
            totalAmount: activePlan?.totalAmount,
            pricePerState: activePlan?.pricePerState,
            validityDays: activePlan?.validityDays,
            investmentRangeLabel: activePlan?.rangeLabel,
            rangeLabel: activePlan?.rangeLabel,
          })}
          sx={{
            flex: 1, py: 1.75,
            fontWeight: 700, fontSize: "0.95rem",
            textTransform: "none", borderRadius: 0,
            backgroundColor: "#4cb04f", color: "#fff",
            "&:hover": { backgroundColor: "#333" },
          }}
        >
          View{"\n"}Summary
        </Button>
      </Box>
    </Box>
  );

  // ============================================================
  // DESKTOP TABLE LAYOUT (original, unchanged)
  // ============================================================
  const orangeHeaderSx = {
    fontWeight: 700, fontSize: "0.7rem", color: "#fff", py: 1.5,
    textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.5,
    verticalAlign: "top",
    background: "linear-gradient(135deg, #fb8c00 0%, #ef6c00 100%)",
    borderRight: "1px solid rgba(255,255,255,0.25)",
  };
  const greenHeaderSx = {
    ...orangeHeaderSx,
    background: "linear-gradient(135deg, #4cb04f 0%, #2e7d32 100%)",
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <>
      {/* MAIN UPGRADE DIALOG */}
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: isMobile
            ? {
                borderRadius: 3,
                mx: 2,
                maxHeight: "90dvh",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }
            : { borderRadius: 3, overflow: "hidden" },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            pb: 1.5, backgroundColor: "#dbeafe", borderBottom: "1px solid #e0e0e0",
            flexShrink: 0,
          }}
        >
          <Box >
            <Typography fontWeight={700} fontSize={isMobile ? "0.9rem" : "1rem"} color="#111">
              Upgrade Lead Package
            </Typography>
            {clickedRangeLabel && (
              <Box sx={{display:"flex",flexDirection:"row",mt:1}}>
              <Typography fontSize="1rem" color="black">
                Investment Range: 
              </Typography>
              <Typography fontSize="1rem" color="#fb8c00" fontWeight={600} >{clickedRangeLabel}</Typography>
              </Box>
            )}
          </Box>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" sx={{ color: "#9e9e9e" }} />
          </IconButton>
        </DialogTitle>
        <Divider />

        {isMobile ? (
          /* ── MOBILE CARD VIEW ── */
          <Box sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <MobileView />
          </Box>
        ) : (
          /* ── DESKTOP TABLE VIEW (original) ── */
          <DialogContent sx={{ pt: 2, pb: 1, overflowX: "hidden" }}>
            {/* Original table code preserved intact */}
            <Box sx={{ overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: 800, borderCollapse: "collapse", tableLayout: "fixed" }}>
                <thead>
                  <tr>
                    {[
                      { label: "Select\nPlan", w: "16%", sx: orangeHeaderSx },
                      { label: "Select Lead Per State", w: "18%", sx: orangeHeaderSx },
                      { label: "Select Investment\nRange", w: "24%", sx: orangeHeaderSx },
                      { label: "Price per\nState", w: "10%", sx: greenHeaderSx },
                      { label: "Total\nLeads", w: "9%", sx: greenHeaderSx },
                      { label: "Total\nAmount", w: "10%", sx: greenHeaderSx },
                      { label: "Action", w: "12%", sx: greenHeaderSx },
                    ].map(({ label, w, sx }) => (
                      <th key={label} style={{ width: w, ...sx, padding: "12px 8px", fontSize: "1rem", color: "#fff", whiteSpace: "pre-line", lineHeight: 1.5, background: sx.background }}>
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", padding: "32px", color: "#9e9e9e" }}>
                        No lead upgrade plans available.
                      </td>
                    </tr>
                  )}
                  {rows.map((row, index) => {
                    const isActive = row.id === activePlanId;
                    const isFirstRow = index === 0;
                    return (
                      <tr key={row.id} style={{ verticalAlign: "middle" }}>
                        <td style={{ padding: "12px 8px", textAlign: "center", backgroundColor: "#fff3e0", borderRight: "1px solid #e0e0e0" }}>
                          <Button
                            variant="contained" size="small"
                            onClick={() => setSelectedPlanId(row.id)}
                            sx={{
                              minWidth: 90, fontWeight: 700, fontSize: "0.75rem",
                              textTransform: "none", borderRadius: 2,
                              flexDirection: "column", lineHeight: 1.4,
                              backgroundColor: isActive ? "#2e7d32" : "#fb8c00",
                              color: "#fff",
                              outline: isActive ? "2px solid #111" : "none",
                              outlineOffset: 2,
                              "&:hover": { backgroundColor: "#2e7d32" },
                            }}
                          >
                            <Typography fontSize="1rem" fontWeight={700} color="#fff" lineHeight={1.3}>{row.validityDays} Days</Typography>
                            <Typography fontSize="0.75rem" fontWeight={700} color="#fff" lineHeight={1.3}>{row.planName}</Typography>
                          </Button>
                        </td>
                        {isFirstRow && (
                          <>
                            <td rowSpan={rows.length} style={{ padding: "12px 8px", textAlign: "center", backgroundColor: "#fff8f0", borderRight: "1px solid #e0e0e0", verticalAlign: "middle" }}>
                              {activePlan && (
                                <>
                                  <Typography fontSize="1rem" color="#fb8c00" fontWeight={600} mb={0.5}>{activePlan.rangeLabel}</Typography>
                                  <Box sx={{ display: "flex", gap: 0.75, justifyContent: "center", flexWrap: "wrap", mt:1 }}>
                                    {activePlan.leadOptions.map((lead) => {
                                      const active = (selectedLeads[activePlan.id] ?? activePlan.leadOptions[0]) === lead;
                                      return (
                                        <Chip key={lead} label={lead} size="small" onClick={() => setLead(activePlan.id, lead)}
                                          sx={{ height: 26, minWidth: 34, fontWeight: 700, fontSize: "1rem", cursor: "pointer", backgroundColor: active ? "#4caf50" : "#fff", color: active ? "#fff" : "#111", border: `1px solid ${active ? "#4caf50" : "#bdbdbd"}` }} />
                                      );
                                    })}
                                  </Box>
                                </>
                              )}
                            </td>
                            <td rowSpan={rows.length} style={{ padding: "8px 12px", backgroundColor: "#fff8f0", borderRight: "1px solid #e0e0e0", verticalAlign: "middle" }}>
                              {activePlan && (activePlan.investmentRanges.length === 0 ? (
                                <Typography fontSize="0.7rem" color="#9e9e9e" textAlign="center">No matching investment ranges</Typography>
                              ) : (
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
                                  {activePlan.investmentRanges.map((range) => {
                                    const isChecked = (checkedRanges[activePlan.id] || new Set()).has(range);
                                    const stateVal = stateCounts[`${activePlan.id}_${range}`] ?? stateSelections[`${activePlan.id}_${range}`]?.length ?? (item?.investmentranges?.find((ir) => ir.selectedPlanInvestmetrange === range)?.selectedPlanStateAndDistrict?.length ?? 0);
                                    return (
                                      <Box key={range} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                        <Checkbox size="small" checked={isChecked} onChange={() => toggleRange(activePlan.id, range)} sx={{ p: 0.25, color: "#fb8c00", "&.Mui-checked": { color: "#fb8c00" } }} />
                                        <Typography fontSize="1rem" color="#111" flex={1} noWrap>{range}</Typography>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, ml: 0.5 }}>
                                          <Typography fontSize="1rem" fontWeight={700} color="#111">{stateVal}</Typography>
                                          <EditIcon sx={{ fontSize: 11, color: "#e65100", cursor: "pointer" }} onClick={() => editStates(activePlan.id, range)} />
                                        </Box>
                                      </Box>
                                    );
                                  })}
                                </Box>
                              ))}
                            </td>
                            <td rowSpan={rows.length} style={{ padding: "12px 8px", textAlign: "center", backgroundColor: "#f1f8e9", borderRight: "1px solid #e0e0e0", verticalAlign: "middle" }}>
                              <Typography fontSize="1.1rem" fontWeight={700} color="#111">₹{activePlan?.pricePerState.toLocaleString("en-IN")}</Typography>
                            </td>
                            <td rowSpan={rows.length} style={{ padding: "12px 8px", textAlign: "center", backgroundColor: "#f1f8e9", borderRight: "1px solid #e0e0e0", verticalAlign: "middle" }}>
                              <Typography fontSize="1.1rem" fontWeight={700} color="#111">{activePlan?.totalLeads.toLocaleString("en-IN")}</Typography>
                            </td>
                            <td rowSpan={rows.length} style={{ padding: "12px 8px", textAlign: "center", backgroundColor: "#f1f8e9", borderRight: "1px solid #e0e0e0", verticalAlign: "middle" }}>
                              <Typography fontSize="1.1rem" fontWeight={700} color="#111">₹{activePlan?.totalAmount.toLocaleString("en-IN")}</Typography>
                            </td>
                            <td rowSpan={rows.length} style={{ padding: "12px 8px", textAlign: "center", backgroundColor: "#f1f8e9", verticalAlign: "middle" }}>
                              <Button variant="contained" size="small" onClick={handleAddToPlan}
                                sx={{ minWidth: 78, fontWeight: 700, fontSize: "0.7rem", textTransform: "none", borderRadius: 2, lineHeight: 1.4, backgroundColor: "#fb8c00", color: "#fff", "&:hover": { backgroundColor: "#e65100" } }}>
                                Add to<br />Plan
                              </Button>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Box>
          </DialogContent>
        )}
      </Dialog>

      {/* STATE SELECTION MODAL */}
      <Dialog
        open={openStateModal}
        onClose={() => setOpenStateModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            mx: isMobile ? 2 : "auto",
            maxHeight: "90vh",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            pb: 1, backgroundColor: COLORS.grey[50], borderBottom: `1px solid ${COLORS.border}`,
          }}
        >
          <Typography fontWeight={700} fontSize={TEXT_SIZES.medium} color={COLORS.black}>
            Select States{currentEditingRange?.range ? ` — ${currentEditingRange.range}` : ""}
          </Typography>
          <IconButton size="small" onClick={() => setOpenStateModal(false)}>
            <CloseIcon fontSize="small" sx={{ color: COLORS.grey[500] }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2, pb: 1, overflowY: "auto" }}>
          <Box sx={{ mb: 2, display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button size="small" variant="outlined"
              onClick={() => {
                const selectable = (currentRangeStates ?? []).filter(s => !blockedStates.has(s));
                setSelectedStates(new Set(selectable));
              }}
            >
              Select All ({(currentRangeStates ?? []).filter(s => !blockedStates.has(s)).length})
            </Button>
            <Button size="small" variant="outlined"
              onClick={() => setSelectedStates(new Set())}
              sx={{ color: COLORS.grey[600] }}
            >
              Clear All
            </Button>
          </Box>

          {(() => {
            const pool = currentRangeStates ?? [];
            if (pool.length === 0) {
              return (
                <Typography color="text.secondary" textAlign="center" py={4}>
                  No states available for this range.
                </Typography>
              );
            }
            return (
              <Box sx={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(2, 1fr)", gap: 1, p: 1 }}>
                {pool.map((state) => {
                  const isSelected = selectedStates.has(state);
                  return (
                    <FormControlLabel
                      key={state}
                      control={
                        <Checkbox
                          checked={isSelected}
                          onChange={(e) => {
                            const ns = new Set(selectedStates);
                            e.target.checked ? ns.add(state) : ns.delete(state);
                            setSelectedStates(ns);
                          }}
                          size="small"
                          sx={{ color: COLORS.primary, "&.Mui-checked": { color: COLORS.secondary } }}
                        />
                      }
                      label={<Typography fontSize={TEXT_SIZES.small} color={COLORS.black}>{state}</Typography>}
                    />
                  );
                })}
              </Box>
            );
          })()}
        </DialogContent>

        <DialogContent
          sx={{
            px: 2, pb: 2, borderTop: `1px solid ${COLORS.border}`,
            backgroundColor: COLORS.grey[50],
          }}
        >
          <Button
            variant="contained" size="small" color="primary"
            onClick={handleSaveStatesFromModal}
            fullWidth={isMobile}
            sx={{ minWidth: 120 }}
          >
            Save States
          </Button>
        </DialogContent>
      </Dialog>

      {/* Validation Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ open: false, message: "" })}
          severity="warning"
          variant="filled"
          sx={{
            fontWeight: 600, fontSize: "0.85rem", borderRadius: 2,
            backgroundColor: "#fb8c00", color: "#fff",
            "& .MuiAlert-icon": { color: "#fff" },
            "& .MuiAlert-action .MuiIconButton-root": { color: "#fff" },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UpgradeDialog;