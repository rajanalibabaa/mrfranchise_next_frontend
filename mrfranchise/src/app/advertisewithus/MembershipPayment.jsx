"use client";
import { useState, useEffect, useMemo, useCallback, memo, forwardRef } from "react";
import {
  Box, Container, Typography, Grid, Checkbox, FormControlLabel,
  Card, CardContent, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Accordion, AccordionSummary, AccordionDetails,
  CircularProgress, Alert, Button, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Chip, Slide, AppBar, Toolbar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import LockIcon from "@mui/icons-material/Lock";
import dynamic from "next/dynamic";

const PaymentBrandUpdate = dynamic(() => import("./PaymentBrandUpdate"), {
  loading: () => (
    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
      <CircularProgress />
    </Box>
  ),
  ssr: false,
});

const SlideTransition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BRAND_DASHBOARD_PATH = "/brandDashboard/brand_listing_controller/";

// ─── India Regions ────────────────────────────────────────────────────────────
const INDIA_REGIONS = {
  "North India": [
    { name: "Himachal Pradesh", code: "HP" },
    { name: "Punjab", code: "PB" },
    { name: "Uttarakhand", code: "UK" },
    { name: "Uttar Pradesh", code: "UP" },
    { name: "Haryana", code: "HR" },
    { name: "Rajasthan", code: "RJ" },
    { name: "Jammu and Kashmir", code: "JK" },
    { name: "Ladakh", code: "LA" },
    { name: "Delhi", code: "DL" },
    { name: "Chandigarh", code: "CH" },
  ],
  "South India": [
    { name: "Tamil Nadu", code: "TN" },
    { name: "Kerala", code: "KL" },
    { name: "Karnataka", code: "KA" },
    { name: "Andhra Pradesh", code: "AP" },
    { name: "Telangana", code: "TS" },
    { name: "Lakshadweep", code: "LD" },
    { name: "Puducherry", code: "PY" },
    { name: "Andaman and Nicobar Islands", code: "AN" },
  ],
  "East India": [
    { name: "Bihar", code: "BR" },
    { name: "Jharkhand", code: "JH" },
    { name: "West Bengal", code: "WB" },
    { name: "Odisha", code: "OD" },
  ],
  "North East India": [
    { name: "Arunachal Pradesh", code: "AR" },
    { name: "Assam", code: "AS" },
    { name: "Meghalaya", code: "ML" },
    { name: "Nagaland", code: "NL" },
    { name: "Manipur", code: "MN" },
    { name: "Mizoram", code: "MZ" },
    { name: "Tripura", code: "TR" },
    { name: "Sikkim", code: "SK" },
  ],
  "West India": [
    { name: "Gujarat", code: "GJ" },
    { name: "Maharashtra", code: "MH" },
    { name: "Goa", code: "GA" },
    { name: "Dadra and Nagar Haveli and Daman and Diu", code: "DN" },
  ],
  "Central India": [
    { name: "Madhya Pradesh", code: "MP" },
    { name: "Chhattisgarh", code: "CG" },
  ],
};

// ─── Flat state lookup maps ───────────────────────────────────────────────────
const ALL_STATES_FLAT = Object.values(INDIA_REGIONS).flat();
const CODE_TO_NAME = Object.fromEntries(ALL_STATES_FLAT.map((s) => [s.code, s.name]));
const NAME_ALIASES = {
  "andaman & nicobar islands": "AN",
  "andaman and nicobar islands": "AN",
  "daman & diu": "DN",
  "daman and diu": "DN",
};

const normalize = (str) =>
  String(str).toLowerCase().replace(/&/g, "and").replace(/\s+/g, " ").trim();

const getStateNameByCode = (code) => CODE_TO_NAME[code] || code;

const getStateCodeByName = (nameOrCode) => {
  if (!nameOrCode) return null;
  if (CODE_TO_NAME[nameOrCode]) return nameOrCode;
  const n = normalize(nameOrCode);
  if (NAME_ALIASES[n]) return NAME_ALIASES[n];
  const found = ALL_STATES_FLAT.find((s) => normalize(s.name) === n);
  return found?.code || null;
};

const safeArray = (v) => (!v ? [] : Array.isArray(v) ? v : [v]);

const formatPrice = (amount) =>
  amount != null ? `₹${Number(amount).toLocaleString("en-IN")}` : "—";

const normalizeRange = (r) => String(r).toLowerCase().trim();

// ─── Table Header Cells ───────────────────────────────────────────────────────
const TABLE_HEADERS = [
  { label: "Select", align: "center" },
  { label: "Investment Range", align: "left" },
  { label: "No. Of States", align: "left" },
  { label: "States", align: "left" },
  { label: "Plan", align: "left" },
  { label: "Lead Count", align: "right" },
  { label: "Tenure", align: "right" },
  { label: "Price", align: "right" },
  { label: "Model", align: "center" },
  { label: "Action", align: "center" },
];

// ─── Static styles ────────────────────────────────────────────────────────────
const CARD_STYLE = {
  width: 300, minWidth: 300, maxWidth: 300, height: 460,
  borderRadius: "20px", bgcolor: "#fff", display: "flex",
  flexDirection: "column", position: "relative",
  boxShadow: "0 10px 30px rgba(0,0,0,0.07)", overflow: "hidden",
  transition: "all 0.2s ease",
  "&:hover": { transform: "translateY(-4px)", boxShadow: "0 16px 40px rgba(0,0,0,0.12)" },
};
const HEADER_STYLE = { pb: 1, mb: 1, borderBottom: "1px solid rgba(0,0,0,0.06)" };
const SCROLL_STYLE = {
  flex: 1, overflowY: "auto", mt: 1.5, pr: 1, mb: 2,
  display: "flex", flexDirection: "column", gap: 0.8,
  "&::-webkit-scrollbar": { width: "5px" },
  "&::-webkit-scrollbar-thumb": { background: "#ddd", borderRadius: "10px" },
};
const LABEL_STYLE = {
  m: 0, alignItems: "flex-start", gap: 1,
  "& .MuiCheckbox-root": { p: 0.5, mt: "-2px" },
};
const TH_CELL_STYLE = {
  fontWeight: 700, fontSize: 13, borderBottom: "2px solid", whiteSpace: "nowrap",
};

// ─── Memoized Table Row ───────────────────────────────────────────────────────
const PlanTableRow = memo(function PlanTableRow({
  row, index, isSelected, isRecommendedTable,
  onCheckboxChange, onEdit, onRemove,
  ficoRanges, // Set of fico investment range strings (normalized)
}) {
  const headerColor = isRecommendedTable ? "#E65100" : "#1565C0";
  const selectedBg  = isRecommendedTable ? "#FFE0B2" : "#BBDEFB";
  const defaultBg1  = isRecommendedTable ? "#FFF8E1" : "#F8FBFF";
  const defaultBg2  = isRecommendedTable ? "#FFFDE7" : "#EFF6FF";
  const hoverBg     = isRecommendedTable ? "#FFE0B2" : "#BBDEFB";

  // ── Check if this row's investment range is inside FICO model ──
  const isInFico = ficoRanges.has(normalizeRange(row.rangeValue));

  return (
    <TableRow
      sx={{
        bgcolor: isSelected ? selectedBg : index % 2 === 0 ? defaultBg1 : defaultBg2,
        "&:hover": { bgcolor: hoverBg },
        transition: "background-color 0.15s ease",
      }}
    >
      {/* Checkbox */}
      <TableCell align="center">
        <Checkbox
          checked={isSelected}
          onChange={() => onCheckboxChange(row.id, row)}
          sx={{
            color: isRecommendedTable ? "#FFA726" : "#1976d2",
            "&.Mui-checked": { color: isRecommendedTable ? "#FF9800" : "#1565C0" },
          }}
        />
      </TableCell>

      {/* Range Label */}
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography fontWeight={600} fontSize={13}>{row.rangeLabel}</Typography>
          {isRecommendedTable && (
            <Chip
              label="Recommended"
              size="small"
              sx={{
                bgcolor: "#FFF3E0", color: "#E65100",
                border: "1px solid #FFB74D", fontSize: 9, height: 18,
                "& .MuiChip-label": { px: 0.8 },
              }}
            />
          )}
        </Box>
      </TableCell>

      {/* States summary */}
      <TableCell>
        <Typography fontWeight={600} fontSize={13}>{row.statesSummary}</Typography>
      </TableCell>

      {/* State names */}
      <TableCell>
        <Typography
          variant="caption"
          sx={{
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden", maxWidth: 200,
          }}
        >
          {row.stateNames}
        </Typography>
      </TableCell>

      {/* Plan category */}
      <TableCell>
        <Chip
          label={row.category}
          size="small"
          sx={{
            bgcolor: isRecommendedTable ? "#FFF8E1" : "#E3F2FD",
            color: isRecommendedTable ? "#E65100" : "#1565C0",
            border: `1px solid ${isRecommendedTable ? "#FFB74D" : "#90CAF9"}`,
            fontWeight: 600, fontSize: 11,
          }}
        />
      </TableCell>

      {/* Lead Count */}
      <TableCell align="right">
        <Typography fontWeight={700} color={headerColor} fontSize={13}>
          {row.leadCount}
        </Typography>
      </TableCell>

      {/* Tenure */}
      <TableCell align="right">
        <Typography fontWeight={600} fontSize={13}>{row.tenure}</Typography>
      </TableCell>

      {/* Price */}
      <TableCell align="right">
        <Typography
          fontWeight={700}
          color={row.hasPricing ? "success.main" : "error.main"}
          fontSize={13}
        >
          {row.price}
        </Typography>
      </TableCell>

      {/* ── FICO Status Column ── */}
      <TableCell align="center">
        {isInFico ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.3 }}>
            <CheckCircleIcon sx={{ color: "#2E7D32", fontSize: 20 }} />
            <Typography fontSize={9} fontWeight={700} color="#2E7D32">
              FICO Model
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.3 }}>
            <LockIcon sx={{ color: "#9E9E9E", fontSize: 20 }} />
            <Typography fontSize={9} fontWeight={600} color="#9E9E9E">
              Add Your Model to unlock payment
            </Typography>
          </Box>
        )}
      </TableCell>

      {/* Action */}
      <TableCell align="center">
        {isRecommendedTable ? (
          <Button
            size="small"
            variant="contained"
            startIcon={<EditIcon sx={{ fontSize: 13 }} />}
            sx={{
              bgcolor: "#1976d2", textTransform: "none",
              fontSize: 11, borderRadius: 2,
              "&:hover": { bgcolor: "#1565C0" },
            }}
            onClick={() => onEdit(row)}
          >
            Edit
          </Button>
        ) : (
          <IconButton
            size="small"
            color="error"
            onClick={() => onRemove(row.id)}
            sx={{
              border: "1px solid #f44336", borderRadius: 1.5, p: 0.5,
              "&:hover": { bgcolor: "#FFEBEE" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </TableCell>
    </TableRow>
  );
});

// ═════════════════════════════════════════════════════════════════════════════
const MembershipSelection = () => {
  const [selectedInvestmentRange, setSelectedInvestmentRange] = useState([]);
  const [selectedIndiaStates, setSelectedIndiaStates]         = useState([]);
  const [selectedPlan, setSelectedPlan]                       = useState("");
  const [expanded, setExpanded]                               = useState(false);
  const [expandedRegion, setExpandedRegion]                   = useState(false);
  const [isEditing, setIsEditing]                             = useState(false);
  const [selectedRows, setSelectedRows]                       = useState(new Set());
  const [addedSelections, setAddedSelections]                 = useState([]);
  const [plansApi, setPlansApi]                               = useState([]);
  const [loading, setLoading]                                 = useState(true);
  const [error, setError]                                     = useState("");
  const [sessionData, setSessionData]                         = useState({
    investmentRange: [], domesticLocations: [], fico: [],
  });

  // Dialog states
  const [confirmDialogOpen, setConfirmDialogOpen]   = useState(false);
  const [pendingRowKey, setPendingRowKey]             = useState(null);
  const [brandDialogOpen, setBrandDialogOpen]         = useState(false);
  const [brandDialogContext, setBrandDialogContext]   = useState(null);

  // ── Payment validation dialog ──
  const [paymentBlockDialogOpen, setPaymentBlockDialogOpen] = useState(false);
  const [blockedRows, setBlockedRows]                        = useState([]);

  // ── Fetch plans ──────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res  = await fetch("http://localhost:5000/api/v1/admin/plans/getAllPlans");
        const json = await res.json();
        if (json.success) setPlansApi(json.data);
        else setError("Failed to fetch plans");
      } catch {
        setError("Error connecting to API");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // ── Session data ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const fico              = JSON.parse(sessionStorage.getItem("fico") || "[]");
      const domesticLocations = JSON.parse(sessionStorage.getItem("domesticlocations") || "[]");
      // setSessionData({ domesticLocations, fico });
      setSessionData({ domesticLocations, fico, investmentRange: [] });
    } catch (err) {
      console.error("Error loading session data:", err);
    }
  }, []);

  // ── FICO investment ranges (normalized Set for O(1) lookup) ─────────────
  const ficoRanges = useMemo(() => {
    const ficoArr = safeArray(sessionData.fico);
    return new Set(
      ficoArr
        .map((f) => normalizeRange(f.investmentRange))
        .filter(Boolean)
    );
  }, [sessionData.fico]);

  // ── Derived: grouped investment ranges ──────────────────────────────────
  const { investmentRanges, groupedInvestmentRanges } = useMemo(() => {
    if (!plansApi.length) return { investmentRanges: [], groupedInvestmentRanges: [] };
    const ranges  = plansApi[0].packages.flatMap((pkg) =>
      pkg.investmentRange.map((r) => ({ label: r, value: r, group: pkg.investmentRangeLabel }))
    );
    const grouped = plansApi[0].packages.map((pkg) => ({
      title: pkg.investmentRangeLabel,
      items: pkg.investmentRange.map((r) => ({ label: r, value: r })),
    }));
    return { investmentRanges: ranges, groupedInvestmentRanges: grouped };
  }, [plansApi]);

  // ── Helper: get package for range ────────────────────────────────────────
  const getPackageForRange = useCallback((uiRangeValue, planName) => {
    const planObj = plansApi.find((p) => p.planName === planName);
    if (!planObj) return null;
    return (
      planObj.packages.find((pkg) =>
        pkg.investmentRange.some(
          (r) => r.toLowerCase().trim() === String(uiRangeValue).toLowerCase().trim()
        )
      ) || null
    );
  }, [plansApi]);

  // ── Session rows ─────────────────────────────────────────────────────────
  const sessionRows = useMemo(() => {
    const rows              = [];
    const rawStates         = sessionData.domesticLocations.map((loc) => loc.state);
    const sessionStateCodes = [...new Set(rawStates.map(getStateCodeByName).filter(Boolean))];
    const sessionStateNames = sessionStateCodes.map(getStateNameByCode).filter(Boolean).join(", ");
    const sessionStatesCount = sessionStateCodes.length || 1;
    const defaultPlanName   = plansApi.length > 0 ? plansApi[0].planName : "LAUNCH PAD PROGRAM";

    const pushRow = (rangeValue, index, prefix) => {
      const pkg          = getPackageForRange(rangeValue, defaultPlanName);
      const baseAmount   = pkg?.amount ?? null;
      const baseLeads    = pkg?.totalLeads ?? null;
      const baseValidity = pkg?.validityDays ?? null;
      const totalLeads   = baseLeads  != null ? baseLeads  * sessionStatesCount : "—";
      const totalPrice   = baseAmount != null ? baseAmount * sessionStatesCount : null;

      rows.push({
        id: `${prefix}-${index}`,
        rangeValue, rangeLabel: rangeValue,
        states: sessionStateCodes,
        statesSummary: `${sessionStatesCount} States`,
        stateNames: sessionStateNames,
        category: defaultPlanName,
        leadCount: totalLeads,
        tenure: baseValidity != null ? `${baseValidity} days` : "—",
        price: totalPrice != null ? formatPrice(totalPrice) : "Price unavailable",
        hasPricing: totalPrice != null,
        baseAmount, statesCount: sessionStatesCount,
        type: "recommended",
      });
    };

    if (sessionStateCodes.length > 0 && safeArray(sessionData.fico).length > 0) {
      safeArray(sessionData.fico).forEach((f, i) => pushRow(f.investmentRange, i, "fico"));
    } else if (sessionStateCodes.length > 0 && sessionData.investmentRange) {
      safeArray(sessionData.investmentRange).forEach((r, i) => pushRow(r, i, "legacy"));
    }
    return rows;
  }, [sessionData, plansApi, getPackageForRange]);

  // ── Derived flags ────────────────────────────────────────────────────────
  const isCategoryEnabled  = selectedInvestmentRange.length > 0 && selectedIndiaStates.length > 0;
  const canAddSelection    = selectedInvestmentRange.length > 0 && selectedIndiaStates.length > 0 && !!selectedPlan;
  const hasSessionData     = sessionRows.length > 0;
  const hasAddedSelections = addedSelections.length > 0;

  // ── Selected row counts ──────────────────────────────────────────────────
  const { selectedRecommendedCount, selectedAddedCount } = useMemo(() => ({
    selectedRecommendedCount: sessionRows.filter((r)     => selectedRows.has(r.id)).length,
    selectedAddedCount:       addedSelections.filter((r) => selectedRows.has(r.id)).length,
  }), [selectedRows, sessionRows, addedSelections]);

  // ── Used ranges ──────────────────────────────────────────────────────────
  const usedRanges = useMemo(
    () => new Set([...addedSelections, ...sessionRows].map((s) => s.rangeValue)),
    [addedSelections, sessionRows]
  );

  // ── Selected plans summary ────────────────────────────────────────────────
  const selectedPlansSummary = useMemo(() => {
    const allRows   = [...sessionRows, ...addedSelections];
    const selected  = allRows.filter((r) => selectedRows.has(r.id));
    let totalAmount = 0;
    let totalLeads  = 0;
    let hasPriceGap = false;

    selected.forEach((r) => {
      if (r.baseAmount != null && r.statesCount) {
        totalAmount += r.baseAmount * r.statesCount;
      } else {
        hasPriceGap = true;
      }
      if (typeof r.leadCount === "number") totalLeads += r.leadCount;
    });

    // ── Separate FICO-valid vs blocked rows ──
    const ficoValid  = selected.filter((r) => ficoRanges.has(normalizeRange(r.rangeValue)));
    const nonFico    = selected.filter((r) => !ficoRanges.has(normalizeRange(r.rangeValue)));
    const canProceed = ficoValid.length > 0 && nonFico.length === 0;
    const hasAnyNonFico = nonFico.length > 0;

    return {
      selected, totalAmount, totalLeads, hasPriceGap,
      count: selected.length,
      ficoValid, nonFico,
      canProceed,       // all selected are in FICO
      hasAnyNonFico,    // at least one selected is NOT in FICO
    };
  }, [selectedRows, sessionRows, addedSelections, ficoRanges]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleAccordionChange = useCallback(
    (panel) => (_, isExp) => setExpanded(isExp ? panel : false), []
  );
  const handleRegionChange = useCallback(
    (panel) => (_, isExp) => setExpandedRegion(isExp ? panel : false), []
  );

  const handleRowCheckboxChange = useCallback((rowId, row) => {
    if (!selectedRows.has(rowId) && row.type === "added") {
      setPendingRowKey(rowId);
      setConfirmDialogOpen(true);
    } else {
      setSelectedRows((prev) => {
        const next = new Set(prev);
        if (next.has(rowId)) next.delete(rowId);
        else next.add(rowId);
        return next;
      });
    }
  }, [selectedRows]);

  const handleConfirmAndOpenBrandDashboard = useCallback(() => {
    if (pendingRowKey) {
      setSelectedRows((prev) => { const n = new Set(prev); n.add(pendingRowKey); return n; });
    }
    setConfirmDialogOpen(false);
    const foundRow =
      addedSelections.find((r) => r.id === pendingRowKey) ||
      sessionRows.find((r) => r.id === pendingRowKey);
    setBrandDialogContext({ type: "added", row: foundRow });
    setBrandDialogOpen(true);
    setPendingRowKey(null);
  }, [pendingRowKey, addedSelections, sessionRows]);

  const handleCancelConfirm = useCallback(() => {
    setConfirmDialogOpen(false);
    setPendingRowKey(null);
  }, []);

  const handleEditRecommended = useCallback((row) => {
    setBrandDialogContext({ type: "edit", row });
    setBrandDialogOpen(true);
  }, []);

  const handleCloseBrandDialog = useCallback(() => {
    setBrandDialogOpen(false);
    setBrandDialogContext(null);
  }, []);

  const handleRemoveSelection = useCallback((id) => {
    setAddedSelections((prev) => prev.filter((item) => item.id !== id));
    setSelectedRows((prev) => { const n = new Set(prev); n.delete(id); return n; });
  }, []);

  const getSelectedCountByRegion = useCallback(
    (statesList) => statesList.filter((s) => selectedIndiaStates.includes(s.code)).length,
    [selectedIndiaStates]
  );

  const handleAddSelection = useCallback(() => {
    if (!canAddSelection) return;
    const alreadyExists = selectedInvestmentRange.some((r) => usedRanges.has(r));
    if (alreadyExists) { alert("This investment range is already added."); return; }

    const newSelections = selectedInvestmentRange.map((rangeValue) => {
      const rangeLabel   = investmentRanges.find((ir) => ir.value === rangeValue)?.label || rangeValue;
      const pkg          = getPackageForRange(rangeValue, selectedPlan);
      const statesCount  = selectedIndiaStates.length || 1;
      const baseAmount   = pkg?.amount ?? null;
      const baseLeads    = pkg?.totalLeads ?? null;
      const baseValidity = pkg?.validityDays ?? null;
      const totalLeads   = baseLeads  != null ? baseLeads  * statesCount : "—";
      const totalPrice   = baseAmount != null ? baseAmount * statesCount : null;

      return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        rangeValue, rangeLabel,
        states: [...selectedIndiaStates],
        statesSummary: `${statesCount} State${statesCount !== 1 ? "s" : ""}`,
        stateNames: selectedIndiaStates.map(getStateNameByCode).filter(Boolean).join(", "),
        category: selectedPlan,
        leadCount: totalLeads,
        tenure: baseValidity != null ? `${baseValidity} days` : "—",
        price: totalPrice != null ? formatPrice(totalPrice) : "Price unavailable",
        hasPricing: totalPrice != null && totalPrice >= 0,
        baseAmount, statesCount,
        type: "added",
      };
    });

    setAddedSelections((prev) => [...prev, ...newSelections]);
    setSelectedInvestmentRange([]);
    setSelectedIndiaStates([]);
    setSelectedPlan("");
    setIsEditing(false);
  }, [
    canAddSelection, selectedInvestmentRange, usedRanges,
    investmentRanges, getPackageForRange, selectedPlan, selectedIndiaStates,
  ]);

  // ── Proceed to Payment handler ────────────────────────────────────────────
  const handleProceedToPayment = useCallback(() => {
    const { selected, nonFico, canProceed } = selectedPlansSummary;

    if (selected.length === 0) return;

    // If ALL selected rows are in FICO → allow payment
    if (canProceed) {
      // ✅ Navigate to payment
      alert("✅ Proceeding to payment! All selected plans are FICO-validated.");
      // router.push("/payment") — replace with your actual navigation
      return;
    }

    // ❌ Some / all selected rows are NOT in FICO → block & show dialog
    setBlockedRows(nonFico);
    setPaymentBlockDialogOpen(true);
  }, [selectedPlansSummary]);

  const handleClosePaymentBlockDialog = useCallback(() => {
    setPaymentBlockDialogOpen(false);
    setBlockedRows([]);
  }, []);

  // ── Table renderer ────────────────────────────────────────────────────────
  const renderTable = useCallback((rows, tableType) => {
    const isRec       = tableType === "recommended";
    const headerColor = isRec ? "#E65100" : "#1565C0";
    const headerBorder = isRec ? "#FFA726" : "#42A5F5";
    const headerBg    = isRec ? "#FFF3E0" : "#E3F2FD";

    return (
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: headerBg }}>
              {TABLE_HEADERS.map(({ label, align }) => (
                <TableCell
                  key={label}
                  align={align}
                  sx={{ ...TH_CELL_STYLE, color: headerColor, borderBottomColor: headerBorder }}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <PlanTableRow
                key={row.id}
                row={row}
                index={index}
                isSelected={selectedRows.has(row.id)}
                isRecommendedTable={isRec}
                ficoRanges={ficoRanges}
                onCheckboxChange={handleRowCheckboxChange}
                onEdit={handleEditRecommended}
                onRemove={handleRemoveSelection}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }, [selectedRows, ficoRanges, handleRowCheckboxChange, handleEditRecommended, handleRemoveSelection]);

  // ── Loading / Error ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 6 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  return (
    <>
      {/* ── Recommended Table ── */}
      {hasSessionData && (
        <Box sx={{ mt: 6, display: "flex", justifyContent: "center", px: 2 }}>
          <Paper
            elevation={3}
            sx={{
              width: "100%", maxWidth: "1200px",
              borderRadius: 3, border: "1px solid #FFB74D", overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 2, px: 3,
                background: "linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <StarIcon sx={{ color: "#fff", fontSize: 22 }} />
                <Box>
                  <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 16 }}>
                    Recommended Plans
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: 12 }}>
                    Based on your previous business profile
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                  label={`${sessionRows.length} Plan${sessionRows.length !== 1 ? "s" : ""}`}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.25)", color: "#fff",
                    fontWeight: 700, border: "1px solid rgba(255,255,255,0.4)",
                  }}
                />
                {selectedRecommendedCount > 0 && (
                  <Chip
                    label={`${selectedRecommendedCount} Selected`}
                    sx={{ bgcolor: "#fff", color: "#E65100", fontWeight: 700 }}
                  />
                )}
              </Box>
            </Box>
            {renderTable(sessionRows, "recommended")}
          </Paper>
        </Box>
      )}

      {/* ── Added Selections Table ── */}
      {hasAddedSelections && (
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Paper
            elevation={3}
            sx={{
              width: "100%", maxWidth: "1200px",
              borderRadius: 3, border: "1px solid #90CAF9", overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 2, px: 3,
                background: "linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <PersonAddIcon sx={{ color: "#fff", fontSize: 22 }} />
                <Box>
                  <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 16 }}>
                    Your Custom Selections
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: 12 }}>
                    Plans you manually added
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                  label={`${addedSelections.length} Plan${addedSelections.length !== 1 ? "s" : ""}`}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.25)", color: "#fff",
                    fontWeight: 700, border: "1px solid rgba(255,255,255,0.4)",
                  }}
                />
                {selectedAddedCount > 0 && (
                  <Chip
                    label={`${selectedAddedCount} Selected`}
                    sx={{ bgcolor: "#fff", color: "#1565C0", fontWeight: 700 }}
                  />
                )}
              </Box>
            </Box>
            {renderTable(addedSelections, "added")}
          </Paper>
        </Box>
      )}

      {/* ── Main Selection Area ── */}
      <Box sx={{ background: "#f7f7f9", minHeight: "100vh", py: 5 }}>
        <Container maxWidth="xl">

          {/* Cards */}
          <Grid container spacing={3} justifyContent="center">

            {/* ── Investment Range Card ── */}
            <Grid item>
              <Card sx={CARD_STYLE}>
                <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column", p: 3, pt: 2.5 }}>
                  <Box sx={HEADER_STYLE}>
                    <Typography fontWeight="700" color="#FFA726" fontSize={16}>Investment Range</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedInvestmentRange.length > 0
                        ? `${selectedInvestmentRange.length} selected`
                        : "Select one or more"}
                    </Typography>
                  </Box>
                  <Box sx={SCROLL_STYLE}>
                    {groupedInvestmentRanges.map((group, idx) => (
                      <Accordion
                        key={idx} disableGutters elevation={0}
                        expanded={expanded === idx}
                        onChange={handleAccordionChange(idx)}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography fontWeight={600} fontSize={14}>{group.title}</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pl: 1 }}>
                          {group.items.map((range) => {
                            // ── Show FICO badge if range is in FICO model ──
                            const isRangeFico = ficoRanges.has(normalizeRange(range.value));
                            return (
                              <Box
                                key={range.value}
                                sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.3 }}
                              >
                                <FormControlLabel
                                  sx={{ ...LABEL_STYLE, flex: 1 }}
                                  control={
                                    <Checkbox
                                      size="small"
                                      checked={selectedInvestmentRange.includes(range.value)}
                                      disabled={
                                        usedRanges.has(range.value) ||
                                        (selectedInvestmentRange.length > 0 &&
                                          !selectedInvestmentRange.includes(range.value))
                                      }
                                      onChange={(e) => {
                                        setSelectedInvestmentRange(
                                          e.target.checked ? [range.value] : []
                                        );
                                      }}
                                    />
                                  }
                                  label={<Typography variant="body2">{range.label}</Typography>}
                                />
                                {isRangeFico && (
                                  <Chip
                                    label="FICO"
                                    size="small"
                                    sx={{
                                      height: 16, fontSize: 9,
                                      bgcolor: "#E8F5E9", color: "#2E7D32",
                                      border: "1px solid #A5D6A7", fontWeight: 700,
                                      "& .MuiChip-label": { px: 0.6 },
                                    }}
                                  />
                                )}
                              </Box>
                            );
                          })}
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* ── States Card ── */}
            <Grid item>
              <Card sx={CARD_STYLE}>
                <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%", p: 3, pt: 2.5 }}>
                  <Box sx={HEADER_STYLE}>
                    <Typography fontWeight="700" color="#FFA726" fontSize={16}>Select States</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedIndiaStates.length} selected
                    </Typography>
                  </Box>
                  <Box sx={SCROLL_STYLE}>
                    {Object.entries(INDIA_REGIONS).map(([regionName, statesList]) => (
                      <Accordion
                        key={regionName} disableGutters elevation={0}
                        expanded={expandedRegion === regionName}
                        onChange={handleRegionChange(regionName)}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography fontWeight={600} fontSize={14}>
                            {regionName} ({getSelectedCountByRegion(statesList)})
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pl: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
                          {statesList.map((state) => (
                            <FormControlLabel
                              key={state.code}
                              sx={{ ...LABEL_STYLE, width: "100%" }}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={selectedIndiaStates.includes(state.code)}
                                  onChange={(e) => {
                                    setSelectedIndiaStates((prev) =>
                                      e.target.checked
                                        ? [...prev, state.code]
                                        : prev.filter((s) => s !== state.code)
                                    );
                                  }}
                                />
                              }
                              label={<Typography variant="body2">{state.name}</Typography>}
                            />
                          ))}
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* ── Category Card ── */}
            <Grid item>
              <Card sx={CARD_STYLE}>
                <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%", p: 3, pt: 2.5 }}>
                  <Box sx={HEADER_STYLE}>
                    <Typography fontWeight="700" color="#FFA726" fontSize={16}>Category</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedPlan ? "1 selected" : "Select one"}
                    </Typography>
                  </Box>
                  <Box sx={SCROLL_STYLE}>
                    {plansApi.map((item) => {
                      const isSelected = selectedPlan === item.planName;
                      const matchedPackage = selectedInvestmentRange.length > 0
                        ? item.packages.find((pkg) =>
                            pkg.investmentRange.some(
                              (r) => r.toLowerCase().trim() ===
                                String(selectedInvestmentRange[0]).toLowerCase().trim()
                            )
                          )
                        : null;
                      const statesCount = selectedIndiaStates.length || 1;
                      const totalPrice  = matchedPackage?.amount != null
                        ? matchedPackage.amount * statesCount : null;
                      const totalLeads  = matchedPackage?.totalLeads != null
                        ? matchedPackage.totalLeads * statesCount : null;

                      return (
                        <Box
                          key={item._id}
                          onClick={() => {
                            if (!isCategoryEnabled && !isEditing) return;
                            setSelectedPlan(isSelected ? "" : item.planName);
                          }}
                          sx={{
                            border: isSelected ? "2px solid #FFA726" : "1px solid #e0e0e0",
                            borderRadius: 2, p: 1.5, mb: 1,
                            bgcolor: isSelected ? "#FFF8E1" : "#fff",
                            transition: "all 0.2s ease",
                            cursor: !isCategoryEnabled && !isEditing ? "not-allowed" : "pointer",
                            opacity: !isCategoryEnabled && !isEditing ? 0.5 : 1,
                            "&:hover": isCategoryEnabled || isEditing
                              ? { borderColor: "#FFA726", bgcolor: "#FFF8E1" } : {},
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: matchedPackage ? 1 : 0 }}>
                            <Checkbox
                              size="small"
                              disabled={!isCategoryEnabled && !isEditing}
                              checked={isSelected}
                              onChange={(e) => {
                                e.stopPropagation();
                                setSelectedPlan(e.target.checked ? item.planName : "");
                              }}
                              onClick={(e) => e.stopPropagation()}
                              sx={{ p: 0, color: "#FFA726", "&.Mui-checked": { color: "#FFA726" } }}
                            />
                            <Typography
                              variant="body2"
                              fontWeight={isSelected ? 700 : 500}
                              color={isSelected ? "#E65100" : "text.primary"}
                            >
                              {item.planName}
                            </Typography>
                          </Box>

                          {matchedPackage && (
                            <Box sx={{ mt: 1, pt: 1, borderTop: "1px dashed #FFD180", display: "flex", flexDirection: "column", gap: 0.5 }}>
                              <Box sx={{ display: "inline-block", bgcolor: "#FFF3E0", border: "1px solid #FFB74D", borderRadius: 1, px: 1, py: 0.3, mb: 0.5 }}>
                                <Typography variant="caption" fontWeight={600} color="#E65100">
                                  {matchedPackage.investmentRangeLabel}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0.8 }}>
                                {[
                                  { icon: "💰", label: "Price",
                                    value: totalPrice != null ? formatPrice(totalPrice) : "—" },
                                  { icon: "👥", label: "Leads",
                                    value: totalLeads != null ? totalLeads : "—" },
                                ].map(({ icon, label, value }) => (
                                  <Box
                                    key={label}
                                    sx={{
                                      bgcolor: isSelected ? "#FFE0B2" : "#f5f5f5",
                                      borderRadius: 1.5, p: 0.8, textAlign: "center",
                                    }}
                                  >
                                    <Typography variant="caption" color="text.secondary" display="block" fontSize={10}>
                                      {icon} {label}
                                    </Typography>
                                    <Typography
                                      variant="caption" fontWeight={700}
                                      color={isSelected ? "#E65100" : "#333"} fontSize={11}
                                    >
                                      {value}
                                    </Typography>
                                  </Box>
                                ))}
                                <Box sx={{ bgcolor: isSelected ? "#FFE0B2" : "#f5f5f5", borderRadius: 1.5, p: 0.8, textAlign: "center", gridColumn: "1 / -1" }}>
                                  <Typography variant="caption" color="text.secondary" display="block" fontSize={10}>
                                    📅 Validity
                                  </Typography>
                                  <Typography variant="caption" fontWeight={700} color={isSelected ? "#E65100" : "#333"} fontSize={11}>
                                    {matchedPackage.validityDays != null
                                      ? `${matchedPackage.validityDays} days` : "—"}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          )}

                          {!matchedPackage && selectedInvestmentRange.length === 0 && (
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, pl: 3.5, display: "block" }}>
                              Select investment range to see details
                            </Typography>
                          )}
                          {!matchedPackage && selectedInvestmentRange.length > 0 && (
                            <Typography variant="caption" color="error" sx={{ fontSize: 10, pl: 3.5, display: "block" }}>
                              No package for selected range
                            </Typography>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* ── Add Button ── */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              disabled={!canAddSelection}
              onClick={handleAddSelection}
              sx={{
                bgcolor: canAddSelection ? "#FFA726" : "#ccc",
                color: "#fff", px: 5, py: 1.5, borderRadius: 3,
                fontWeight: 700, fontSize: 16, textTransform: "none",
                boxShadow: canAddSelection ? "0 4px 15px rgba(255,167,38,0.4)" : "none",
                "&:hover": { bgcolor: canAddSelection ? "#FF9800" : "#ccc" },
                "&:disabled": { bgcolor: "#e0e0e0", color: "#9e9e9e" },
                transition: "all 0.3s ease",
              }}
            >
              {canAddSelection ? "Add Selection" : "Add"}
            </Button>
          </Box>

          {/* ══════════════════════════════════════════════
              SELECTED PLANS SUMMARY BAR
             ══════════════════════════════════════════════ */}
          {selectedPlansSummary.count > 0 && (
            <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
              <Paper
                elevation={4}
                sx={{
                  width: "100%", maxWidth: "1200px",
                  borderRadius: 3, overflow: "hidden",
                  border: "1px solid #A5D6A7",
                }}
              >
                {/* Summary header */}
                <Box
                  sx={{
                    px: 3, py: 1.5,
                    background: "linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)",
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between", flexWrap: "wrap", gap: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ShoppingCartIcon sx={{ color: "#fff", fontSize: 20 }} />
                    <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 15 }}>
                      Selected Plans Summary
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label={`${selectedPlansSummary.count} Plan${selectedPlansSummary.count !== 1 ? "s" : ""} Selected`}
                      sx={{
                        bgcolor: "rgba(255,255,255,0.25)", color: "#fff",
                        fontWeight: 700, border: "1px solid rgba(255,255,255,0.4)",
                      }}
                    />
                    {/* FICO status badge in header */}
                    {selectedPlansSummary.canProceed ? (
                      <Chip
                        icon={<CheckCircleIcon sx={{ color: "#fff !important", fontSize: 15 }} />}
                        label="FICO Validated"
                        sx={{ bgcolor: "#1B5E20", color: "#fff", fontWeight: 700, border: "1px solid #A5D6A7" }}
                      />
                    ) : (
                      <Chip
                        icon={<WarningAmberIcon sx={{ color: "#fff !important", fontSize: 15 }} />}
                        label={`${selectedPlansSummary.nonFico.length} Non-FICO`}
                        sx={{ bgcolor: "#B71C1C", color: "#fff", fontWeight: 700, border: "1px solid #EF9A9A" }}
                      />
                    )}
                  </Box>
                </Box>

                {/* ── Non-FICO warning banner ── */}
                {selectedPlansSummary.hasAnyNonFico && (
                  <Box
                    sx={{
                      px: 3, py: 1.2,
                      bgcolor: "#FFF3E0",
                      borderBottom: "2px solid #FFB74D",
                      display: "flex", alignItems: "center", gap: 1.5,
                    }}
                  >
                    <WarningAmberIcon sx={{ color: "#E65100", fontSize: 20 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight={700} fontSize={13} color="#E65100">
                        Payment Not Allowed for Non-FICO Plans
                      </Typography>
                      <Typography fontSize={11} color="#BF360C">
                        The following selected plan{selectedPlansSummary.nonFico.length > 1 ? "s" : ""}{" "}
                        {selectedPlansSummary.nonFico.length > 1 ? "are" : "is"} not part of your FICO
                        model and cannot proceed to payment:{" "}
                        <strong>
                          {selectedPlansSummary.nonFico.map((r) => r.rangeLabel).join(", ")}
                        </strong>
                        . Please deselect them or choose only FICO-validated plans.
                      </Typography>
                    </Box>
                    <Chip
                      label="How to fix?"
                      size="small"
                      sx={{
                        bgcolor: "#E65100", color: "#fff",
                        fontWeight: 700, cursor: "default",
                        fontSize: 10,
                      }}
                    />
                  </Box>
                )}

                {/* Summary body */}
                <Box
                  sx={{
                    px: 3, py: 2, bgcolor: "#F1F8E9",
                    display: "flex", alignItems: "center",
                    gap: 3, flexWrap: "wrap",
                  }}
                >
                  {/* Total Amount */}
                  <Box
                    sx={{
                      flex: 1, minWidth: 160,
                      bgcolor: "#fff", borderRadius: 2.5,
                      border: "1px solid #C8E6C9",
                      px: 2.5, py: 1.5, textAlign: "center",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" display="block" fontSize={11}>
                      💰 Total Amount
                    </Typography>
                    <Typography fontWeight={800} fontSize={22} color="#2E7D32" lineHeight={1.2}>
                      {selectedPlansSummary.hasPriceGap && selectedPlansSummary.totalAmount === 0
                        ? "—"
                        : formatPrice(selectedPlansSummary.totalAmount)}
                    </Typography>
                    {selectedPlansSummary.hasPriceGap && selectedPlansSummary.totalAmount > 0 && (
                      <Typography variant="caption" color="warning.main" fontSize={10}>
                        + some plans have no price
                      </Typography>
                    )}
                  </Box>

                  {/* Total Leads */}
                  <Box
                    sx={{
                      flex: 1, minWidth: 160,
                      bgcolor: "#fff", borderRadius: 2.5,
                      border: "1px solid #C8E6C9",
                      px: 2.5, py: 1.5, textAlign: "center",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" display="block" fontSize={11}>
                      👥 Total Leads
                    </Typography>
                    <Typography fontWeight={800} fontSize={22} color="#1565C0" lineHeight={1.2}>
                      {selectedPlansSummary.totalLeads || "—"}
                    </Typography>
                  </Box>

                  {/* Per-plan breakdown with FICO indicator */}
                  <Box sx={{ flex: 3, minWidth: 220, display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {selectedPlansSummary.selected.map((r) => {
                      const rowInFico = ficoRanges.has(normalizeRange(r.rangeValue));
                      return (
                        <Box
                          key={r.id}
                          sx={{
                            bgcolor: rowInFico
                              ? (r.type === "recommended" ? "#FFF8E1" : "#E8F5E9")
                              : "#FFF3E0",
                            border: `1px solid ${
                              rowInFico
                                ? (r.type === "recommended" ? "#FFB74D" : "#90CAF9")
                                : "#FFAB91"
                            }`,
                            borderRadius: 2, px: 1.5, py: 0.8,
                            display: "flex", flexDirection: "column", gap: 0.2,
                            minWidth: 140, position: "relative",
                          }}
                        >
                          {/* FICO / Non-FICO badge on each plan card */}
                          <Box sx={{ position: "absolute", top: 4, right: 4 }}>
                            {rowInFico ? (
                              <CheckCircleIcon sx={{ fontSize: 13, color: "#2E7D32" }} />
                            ) : (
                              <LockIcon sx={{ fontSize: 13, color: "#E65100" }} />
                            )}
                          </Box>

                          <Typography
                            fontSize={11} fontWeight={700}
                            color={
                              rowInFico
                                ? (r.type === "recommended" ? "#E65100" : "#1565C0")
                                : "#BF360C"
                            }
                            sx={{ pr: 2 }}
                          >
                            {r.rangeLabel}
                          </Typography>
                          <Typography fontSize={10} color="text.secondary">
                            {r.statesSummary} · {r.category}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 1, mt: 0.3 }}>
                            <Typography fontSize={11} fontWeight={700} color="success.main">
                              {r.price}
                            </Typography>
                            <Typography fontSize={11} color="text.secondary">·</Typography>
                            <Typography fontSize={11} color="#1565C0">{r.leadCount} leads</Typography>
                          </Box>
                          {!rowInFico && (
                            <Typography fontSize={9} color="#E65100" fontWeight={700} sx={{ mt: 0.2 }}>
                              ⚠ Not in FICO model
                            </Typography>
                          )}
                        </Box>
                      );
                    })}
                  </Box>

                  {/* ── Proceed to Payment Button ── */}
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.8 }}>
                    <Button
                      variant="contained"
                      size="large"
                      disabled={!selectedPlansSummary.canProceed}
                      onClick={handleProceedToPayment}
                      sx={{
                        bgcolor: selectedPlansSummary.canProceed ? "#2E7D32" : "#9E9E9E",
                        color: "#fff", fontWeight: 700,
                        textTransform: "none", borderRadius: 2.5,
                        px: 3, py: 1.2, fontSize: 14, whiteSpace: "nowrap",
                        "&:hover": {
                          bgcolor: selectedPlansSummary.canProceed ? "#1B5E20" : "#9E9E9E",
                        },
                        "&:disabled": { bgcolor: "#BDBDBD", color: "#fff" },
                        boxShadow: selectedPlansSummary.canProceed
                          ? "0 4px 14px rgba(46,125,50,0.35)"
                          : "none",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {selectedPlansSummary.canProceed
                        ? "Proceed to Payment →"
                        : "Payment Locked 🔒"}
                    </Button>

                    {/* Helper text under button */}
                    {!selectedPlansSummary.canProceed && (
                      <Typography
                        fontSize={10} color="#E65100" fontWeight={600}
                        textAlign="center" sx={{ maxWidth: 170 }}
                      >
                        Only FICO-model plans<br />can proceed to payment
                      </Typography>
                    )}
                    {selectedPlansSummary.canProceed && (
                      <Typography fontSize={10} color="#2E7D32" fontWeight={600} textAlign="center">
                        ✓ All plans FICO-validated
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Box>
          )}

        </Container>
      </Box>

      {/* ══════════════════════════════════════════════════════
          PAYMENT BLOCKED DIALOG
         ══════════════════════════════════════════════════════ */}
      <Dialog
        open={paymentBlockDialogOpen}
        onClose={handleClosePaymentBlockDialog}
        PaperProps={{ sx: { borderRadius: 3, minWidth: 420, maxWidth: 520 } }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#B71C1C", color: "#fff", fontWeight: 700,
            display: "flex", alignItems: "center", gap: 1,
          }}
        >
          <LockIcon fontSize="small" />
          Payment Not Allowed
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 2 }}>
            <WarningAmberIcon sx={{ color: "#E65100", fontSize: 28, mt: 0.3 }} />
            <DialogContentText>
              <strong>Some of your selected plans are not part of your FICO model.</strong>
              <br />
              Payment is only allowed for investment ranges that were selected inside your
              FICO model. Please deselect the following plans to proceed:
            </DialogContentText>
          </Box>

          {/* List of blocked plans */}
          <Box
            sx={{
              mt: 1, p: 1.5, bgcolor: "#FFF3E0",
              borderRadius: 2, border: "1px solid #FFB74D",
              display: "flex", flexDirection: "column", gap: 1,
            }}
          >
            {blockedRows.map((r) => (
              <Box
                key={r.id}
                sx={{
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between",
                  bgcolor: "#fff", borderRadius: 1.5, px: 1.5, py: 1,
                  border: "1px solid #FFCC80",
                }}
              >
                <Box>
                  <Typography fontSize={13} fontWeight={700} color="#BF360C">
                    {r.rangeLabel}
                  </Typography>
                  <Typography fontSize={11} color="text.secondary">
                    {r.statesSummary} · {r.category}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography fontSize={12} fontWeight={700} color="#E65100">{r.price}</Typography>
                  <Chip
                    label="Not in FICO"
                    size="small"
                    sx={{
                      bgcolor: "#FFCCBC", color: "#BF360C",
                      fontWeight: 700, fontSize: 9, height: 16,
                      "& .MuiChip-label": { px: 0.7 },
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>

          {/* What is FICO explanation */}
          <Box sx={{ mt: 2, p: 1.5, bgcolor: "#E3F2FD", borderRadius: 2, border: "1px solid #90CAF9" }}>
            <Typography fontSize={12} color="#1565C0" fontWeight={600}>
              ℹ️ What is FICO model?
            </Typography>
            <Typography fontSize={11} color="text.secondary" sx={{ mt: 0.5 }}>
              Your FICO model contains the investment ranges pre-approved for your business profile.
              Only these ranges are eligible for payment processing.
            </Typography>
            {ficoRanges.size > 0 && (
              <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                <Typography fontSize={11} fontWeight={600} color="#1565C0" sx={{ width: "100%", mb: 0.3 }}>
                  Your FICO ranges:
                </Typography>
                {[...ficoRanges].map((range) => (
                  <Chip
                    key={range}
                    label={range}
                    size="small"
                    sx={{
                      bgcolor: "#E8F5E9", color: "#2E7D32",
                      border: "1px solid #A5D6A7", fontWeight: 600, fontSize: 10,
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={handleClosePaymentBlockDialog}
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            Got it, I'll fix it
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Confirm Dialog (for custom plan selection) ── */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelConfirm}
        PaperProps={{ sx: { borderRadius: 3, minWidth: 380 } }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#1976D2", color: "#fff", fontWeight: 700,
            display: "flex", alignItems: "center", gap: 1,
          }}
        >
          <EditIcon fontSize="small" /> Update Business Model?
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <DialogContentText>
            Selecting this plan will open the{" "}
            <strong>Brand Listing Controller</strong> so you can update your
            business model details before proceeding.
          </DialogContentText>
          <Box sx={{ mt: 2, p: 1.5, bgcolor: "#E3F2FD", borderRadius: 2, border: "1px solid #90CAF9" }}>
            <Typography variant="caption" color="#1565C0" fontWeight={600}>
              📍 Path: {BRAND_DASHBOARD_PATH}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={handleCancelConfirm}
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAndOpenBrandDashboard}
            variant="contained"
            startIcon={<OpenInNewIcon />}
            sx={{
              bgcolor: "#1976D2", borderRadius: 2,
              textTransform: "none", fontWeight: 700,
              "&:hover": { bgcolor: "#1565C0" },
            }}
          >
            Yes, Open Dashboard
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Brand Dashboard Full-Screen Dialog ── */}
      <Dialog
        fullScreen
        open={brandDialogOpen}
        onClose={handleCloseBrandDialog}
        TransitionComponent={SlideTransition}
      >
        <AppBar
          sx={{
            position: "sticky",
            background: brandDialogContext?.type === "edit"
              ? "linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)"
              : "linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)",
          }}
        >
          <Toolbar sx={{ gap: 2 }}>
            <IconButton edge="start" color="inherit" onClick={handleCloseBrandDialog}>
              <CloseIcon />
            </IconButton>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight={700} color="#fff">
                {brandDialogContext?.type === "edit"
                  ? "Edit Business Model — Brand Listing Controller"
                  : "Update Business Model — Brand Listing Controller"}
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.85)" }}>
                {BRAND_DASHBOARD_PATH}
                {brandDialogContext?.row?.rangeLabel
                  ? ` · ${brandDialogContext.row.rangeLabel}` : ""}
              </Typography>
            </Box>
            {brandDialogContext?.row && (
              <Chip
                label={brandDialogContext.type === "edit" ? "Recommended Plan" : "Custom Plan"}
                sx={{
                  bgcolor: "rgba(255,255,255,0.25)", color: "#fff",
                  fontWeight: 700, border: "1px solid rgba(255,255,255,0.5)",
                }}
              />
            )}
            <Button
              variant="outlined"
              onClick={handleCloseBrandDialog}
              sx={{
                color: "#fff", borderColor: "rgba(255,255,255,0.6)",
                textTransform: "none", borderRadius: 2,
                "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              Close
            </Button>
          </Toolbar>
        </AppBar>

        {/* Context info bar */}
        {brandDialogContext?.row && (
          <Box
            sx={{
              px: 3, py: 1.5,
              bgcolor: brandDialogContext.type === "edit" ? "#E3F2FD" : "#FFF3E0",
              borderBottom: `2px solid ${brandDialogContext.type === "edit" ? "#90CAF9" : "#FFB74D"}`,
              display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap",
            }}
          >
            <Typography variant="body2" fontWeight={700} color="text.secondary">Editing:</Typography>
            <Chip
              label={brandDialogContext.row.rangeLabel}
              size="small"
              sx={{
                bgcolor: brandDialogContext.type === "edit" ? "#BBDEFB" : "#FFE0B2",
                color: brandDialogContext.type === "edit" ? "#1565C0" : "#E65100",
                fontWeight: 700,
              }}
            />
            <Chip label={brandDialogContext.row.statesSummary} size="small" variant="outlined" />
            <Chip label={brandDialogContext.row.category}     size="small" variant="outlined" />
            <Chip
              label={brandDialogContext.row.price}
              size="small"
              sx={{ bgcolor: "#E8F5E9", color: "#2E7D32", fontWeight: 700 }}
            />
          </Box>
        )}

        {/* Iframe */}
        <Box sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
          <iframe
            src={BRAND_DASHBOARD_PATH}
            style={{ width: "100%", height: "100%", border: "none" }}
            title="Brand Listing Controller"
          />
        </Box>

        {/* Footer */}
        <Box
          sx={{
            bgcolor: "#fff", p: 2, px: 3,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            borderTop: "1px solid #e0e0e0", boxShadow: "0 -4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            💡 Make your changes in the dashboard above, then close to return.
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button
              variant="outlined"
              onClick={handleCloseBrandDialog}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleCloseBrandDialog}
              sx={{
                textTransform: "none", borderRadius: 2,
                bgcolor: brandDialogContext?.type === "edit" ? "#1976D2" : "#FF9800",
                "&:hover": {
                  bgcolor: brandDialogContext?.type === "edit" ? "#1565C0" : "#F57C00",
                },
              }}
            >
              Done & Close
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default MembershipSelection;