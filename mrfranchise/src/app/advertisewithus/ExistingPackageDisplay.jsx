import React, { useState } from "react";
import {
  Box, Typography, CircularProgress, Alert, Chip,
  Paper, Button, Dialog, DialogTitle, DialogContent,
  IconButton,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloseIcon from "@mui/icons-material/Close";

const TABLE_CONFIGS = {
  FREE: {
    label: "Free",
    headerBg: "#dcfce7",
    headerColor: "#15803d",
    columns: ["Package",  "Status", "Action"],
    gridCols: "2fr 1.2fr 1.2fr 1.4fr",
  },
  LISTING: {
    label: "Listing",
    headerBg: "#ede9fe",
    headerColor: "#7c3aed",
    columns: ["Package", "Tenure", "Start", "End", "Status", "Action"],
    gridCols: "2fr 1fr 1.2fr 1.2fr 1.5fr 0.8fr",
  },
  LEAD: {
    label: "Lead",
    headerBg: "#dbeafe",
    headerColor: "#1d4ed8",
    columns: ["Package", "Investment Range", "States", "Total Leads", "Sent","Remaining", "Status", "Start", "End", "Action"],
    gridCols: "1.1fr 1.3fr 0.9fr 0.8fr 0.6fr 1.5fr 1fr 1fr 0.8fr 0.8fr",
  },
};

const ExistingPackageDisplay = ({ data, loading, error }) => {
  const [dialog, setDialog] = useState({ open: false, states: [], label: "" });

  const getStatus = (item) => {
    if (item.isActive && !item.isPending) return { label: "ACTIVE",               color: "#15803d", bg: "#dcfce7" };
    if (item.isPending)                   return { label: "PENDING FOR APPROVAL",  color: "#b45309", bg: "#fef3c7" };
    return                                       { label: "INACTIVE",              color: "#6b7280", bg: "#f3f4f6" };
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const handleUpgrade = (pkg, item) => {
    console.log("Upgrade:", { packageType: pkg.packagesType, packageName: pkg.packagesName, item });
  };

  const openStatesDialog = (states, rangeLabel) => {
    const arr = Array.isArray(states)
      ? states
      : (states || "").split(",").map((s) => s.trim()).filter(Boolean);
    setDialog({ open: true, states: arr, label: rangeLabel });
  };

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh"><CircularProgress /></Box>;
  if (error)   return <Box p={3}><Alert severity="error">{error}</Alert></Box>;


const grouped = { FREE: [], LISTING: [], LEAD: [] };
data?.packages?.forEach((pkg) => {
  const type = (pkg.packagesType || pkg.PackagesType || "").toUpperCase(); // ← .toUpperCase() handles case mismatch
  if (grouped[type]) {
    (pkg.InvestmetPackages || pkg.InvestmentPackages || [])
      .forEach((item) => grouped[type].push({ pkg, item }));
  }
});

  const StatusChip = ({ item }) => {
    const s = getStatus(item);
    return <Chip label={s.label} size="small" sx={{ height: 24, fontSize: "10px", fontWeight: "bold", background: s.bg, color: s.color }} />;
  };

  const renderCell = (type, pkg, item) => {
    const start = item.isPending ? "—" : formatDate(item.PackageStartDate);
    const end   = item.isPending ? "—" : formatDate(item.PackageEndDate);
    const sent  = (item.TotalLeads || 0) - (item.remainingLeads || 0);
    const name  = <Typography fontWeight={700} fontSize="12px" noWrap>{pkg.packagesName}</Typography>;

    const statesArr = Array.isArray(item.states)
      ? item.states
      : (item.states || "").split(",").map((s) => s.trim()).filter(Boolean);
    const stateCount = statesArr.length;

    if (type === "FREE") return [
      name,
    //   <Typography fontSize="11px">{start}</Typography>,
    //   <Typography fontSize="11px">{end}</Typography>,
      <StatusChip item={item} />,
       <Button variant="outlined" size="small" onClick={() => handleUpgrade(pkg, item)}
        sx={{ minWidth: 70, height: 26, fontSize: "11px", textTransform: "none", borderRadius: "6px", fontWeight: 600 }}>
        Upgrade
      </Button>,
    ];

    if (type === "LISTING") return [
      name,
      <Typography fontSize="12px">{item.tenure || "—"}</Typography>,
      <Typography fontSize="11px">{start}</Typography>,
      <Typography fontSize="11px">{end}</Typography>,
      <StatusChip item={item} />,
       <Button variant="outlined" size="small" onClick={() => handleUpgrade(pkg, item)}
        sx={{ minWidth: 70, height: 26, fontSize: "11px", textTransform: "none", borderRadius: "6px", fontWeight: 600 }}>
        Upgrade
      </Button>,
    ];

    if (type === "LEAD") return [
      name,
      <Typography fontSize="12px">{item.InvestmetRageLabel || "—"}</Typography>,

      // ── States cell: count + eye icon ──────────────────────────────────────
      <Box
        onClick={() => openStatesDialog(item.states, item.InvestmetRageLabel)}
        sx={{
          display: "inline-flex", alignItems: "center", gap: "4px",
          cursor: "pointer", color: "#1d4ed8",
          "&:hover": { textDecoration: "underline" },
        }}
      >
        <VisibilityOutlinedIcon sx={{ fontSize: 15 }} />
        <Typography fontSize="12px" color="#1d4ed8" fontWeight={500}>
          {stateCount} state{stateCount !== 1 ? "s" : ""}
        </Typography>
      </Box>,
      // ──────────────────────────────────────────────────────────────────────

      <Typography fontSize="12px">{item.TotalLeads || 0}</Typography>,
      <Typography fontSize="12px" fontWeight={600}>{sent}</Typography>,
      <Typography fontSize="12px" fontWeight={600} color={sent > 0 ? "#dc2626" : "inherit"}>{sent}</Typography>,
      <StatusChip item={item} />,
      <Typography fontSize="11px">{start}</Typography>,
      <Typography fontSize="11px">{end}</Typography>,
      <Button variant="outlined" size="small" onClick={() => handleUpgrade(pkg, item)}
        sx={{ minWidth: 70, height: 26, fontSize: "11px", textTransform: "none", borderRadius: "6px", fontWeight: 600 }}>
        Upgrade
      </Button>,
    ];

    return [];
  };

  const headerRowSx = (config) => ({
    display: "grid", gridTemplateColumns: config.gridCols,
    background: config.headerBg, color: config.headerColor,
    px: 2, py: 1.5, gap: 1, alignItems: "center",
  });

  const dataRowSx = (config) => ({
    display: "grid", gridTemplateColumns: config.gridCols,
    px: 1.5, py: 1.3, gap: 1, alignItems: "center",
    borderBottom: "1px solid #f1f5f9",
    "&:hover": { background: "#f9fafb" },
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, p: 2 }}>
      <Typography variant="h6" fontWeight="bold" color="#111827">Brand Packages Summary</Typography>

      {Object.entries(TABLE_CONFIGS).map(([type, config]) => (
        <Box key={type}>
          <Typography fontWeight={600} fontSize="14px" mb={1} color={config.headerColor}>
            {config.label} Packages
          </Typography>
          <Paper elevation={0} sx={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #e5e7eb" }}>
            <Box sx={headerRowSx(config)}>
              {config.columns.map((col) => (
                <Typography key={col} fontWeight="bold" fontSize="12px">{col}</Typography>
              ))}
            </Box>
            {grouped[type].length === 0 ? (
              <Box px={2} py={2}><Typography fontSize="12px" color="#6b7280">No {config.label.toLowerCase()} packages found.</Typography></Box>
            ) : (
              grouped[type].map(({ pkg, item }, idx) => (
                <Box key={idx} sx={dataRowSx(config)}>
                  {renderCell(type, pkg, item).map((cell, i) => (
                    <Box key={i} sx={{ minWidth: 0, overflow: "hidden" }}>{cell}</Box>
                  ))}
                </Box>
              ))
            )}
          </Paper>
        </Box>
      ))}

      {/* ── States Dialog ─────────────────────────────────────────────────── */}
      <Dialog
        open={dialog.open}
        onClose={() => setDialog({ ...dialog, open: false })}
        PaperProps={{ sx: { borderRadius: "12px", minWidth: 340, p: 0 } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 0 }}>
          <Box>
            <Typography fontWeight={700} fontSize="15px">Selected States</Typography>
            {dialog.label && (
              <Typography fontSize="12px" color="text.secondary">{dialog.label}</Typography>
            )}
          </Box>
          <IconButton size="small" onClick={() => setDialog({ ...dialog, open: false })}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Typography fontSize="12px" color="text.secondary" mb={1.5}>
            {dialog.states.length} state{dialog.states.length !== 1 ? "s" : ""} selected
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {dialog.states.map((s) => (
              <Chip
                key={s} label={s} size="small"
                sx={{ background: "#dbeafe", color: "#1d4ed8", fontWeight: 600, fontSize: "12px" }}
              />
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ExistingPackageDisplay;