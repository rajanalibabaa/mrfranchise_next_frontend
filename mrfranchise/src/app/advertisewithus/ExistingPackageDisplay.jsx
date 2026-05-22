import React, { useState } from "react";
import {
  Box, Typography, CircularProgress, Alert, Chip,
  Paper, Button, Dialog, DialogTitle, DialogContent,
  IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Tooltip, Divider
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

// Colors from parent component
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
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#EEEEEE",
    300: "#E0E0E0",
    400: "#BDBDBD",
    500: "#9E9E9E",
    600: "#757575",
    700: "#616161",
  },
  lightOrange: "rgba(255, 153, 0, 0.08)",
  lightGreen: "rgba(76, 176, 79, 0.08)",
  border: "#E0E0E0",
  shadow: "rgba(0, 0, 0, 0.08)",
};

const TEXT_SIZES = {
  xs: "0.725rem",
  small: "0.80rem",
  medium: "0.980rem",
  large: "1rem",
  xl: "1.125rem",
  xxl: "1.25rem",
};

const TABLE_CONFIGS = {
  FREE: {
    label: "Free",
    headerBg: COLORS.lightGreen,
    headerColor: COLORS.secondaryDark,
    columns: ["Package",  "Status", "Action"],
  },
  LISTING: {
    label: "Listing",
    headerBg: "#ede9fe",
    headerColor: "#7c3aed",
    columns: ["Package", "Tenure", "Start Date", "End Date", "Status", "Action"],
  },
  LEAD: {
    label: "Lead",
    headerBg: "#dbeafe",
    headerColor: "#1d4ed8",
    columns: ["Package", "Investment Group", "Investment Range","States", "Total Leads", "Sent", "Remaining", "Status", "Start Date", "End Date", "Action"],
  },
};

const ExistingPackageDisplay = ({ data, loading, error, category, industry, brandName, isLoggedIn, upgradeSectionRef }) => {
    const [dialog, setDialog] = useState({ open: false, states: [], label: "" });

  // If not logged in, don't render anything
  if (!isLoggedIn) {
    return null;
  }

  const getStatus = (item) => {
    if (item.isActive && !item.isPending) {
      return { 
        label: "ACTIVE", 
        color: COLORS.secondaryDark, 
        bg: COLORS.lightGreen,
        icon: <CheckCircleIcon sx={{ fontSize: 14 }} />
      };
    }
    if (item.isPending) {
      return { 
        label: "PENDING", 
        color: "#b45309", 
        bg: "#fef3c7",
        icon: <PendingIcon sx={{ fontSize: 14 }} />
      };
    }
    return { 
      label: "INACTIVE", 
      color: COLORS.grey[600], 
      bg: COLORS.grey[100],
      icon: <CancelIcon sx={{ fontSize: 14 }} />
    };
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

 const handleUpgrade = (pkg, item) => {
  console.log("Upgrade:", { packageType: pkg.packagesType, packageName: pkg.packagesName, item });
  if (upgradeSectionRef?.current) {
    upgradeSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

  const openStatesDialog = (states, rangeLabel) => {
    const arr = Array.isArray(states)
      ? states
      : (states || "").split(",").map((s) => s.trim()).filter(Boolean);
    setDialog({ open: true, states: arr, label: rangeLabel });
  };

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
  data?.packages?.forEach((pkg) => {
    const type = (pkg.packagesType || pkg.PackagesType || "").toUpperCase();
    if (grouped[type]) {
      const packagesArray = pkg.investmetPackages || 
                            pkg.InvestmetPackages ||   
                            pkg.InvestmentPackages ||  
                            pkg.packages ||            
                            [];
      
      packagesArray.forEach((item) => grouped[type].push({ pkg, item }));
    }
  });

  const hasAnyPackages = grouped.FREE.length > 0 || grouped.LISTING.length > 0 || grouped.LEAD.length > 0;

  const StatusChip = ({ item }) => {
    const s = getStatus(item);
    return (
      <Tooltip title={s.label === "PENDING" ? "Waiting for approval" : s.label === "ACTIVE" ? "Package is active" : "Package is inactive"} arrow>
        <Chip
          icon={s.icon}
          label={s.label}
          size="small"
          sx={{
            height: 28,
            fontSize: TEXT_SIZES.xs,
            fontWeight: 700,
            background: s.bg,
            color: s.color,
            borderRadius: 2,
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

    const statesArr = item.investmentranges?.flatMap(r => r.selectedPlanState || []) || 
                      item.selectedPlanState || 
                      [];
    const stateCount = statesArr.length;

if (type === "FREE") return [
<Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 1,
    whiteSpace: "nowrap",
  }}
>
  <Box>
    {/* <Typography
      sx={{
        color: COLORS.black,
        fontWeight: 800,
        fontSize: TEXT_SIZES.medium,
      }}
    >
      {pkg.packagesName}
    </Typography> */}
  {/* PACKAGE DAYS BELOW */}
    {/* <Typography
      sx={{
        fontSize: TEXT_SIZES.xs,
        fontWeight: 600,
        color: COLORS.black,
        mt: 0.3,
      }}
    >
     {`${item.validity || item.tenure || "—"} Days`}
    </Typography> */}
    <Typography
      fontSize={TEXT_SIZES.xs}
      fontWeight={400}
      color={COLORS.black}
    >
      {pkg.packagesType}
    </Typography>

  
  </Box>
</Box>,

  <StatusChip item={item} />,
  <Button
    variant="outlined"
    size="small"
    onClick={() => handleUpgrade(pkg, item)}
    startIcon={<UpgradeIcon />}
    sx={{
      minWidth: 90,
      height: 32,
      fontSize: TEXT_SIZES.xs,
      textTransform: "none",
      borderRadius: 2,
      fontWeight: 600,
      borderColor: COLORS.primary,
      color: COLORS.primary,
      "&:hover": {
        borderColor: COLORS.primaryDark,
        backgroundColor: COLORS.lightOrange,
      },
    }}
  >
    Upgrade
  </Button>,
];

    if (type === "LISTING")
      console.log("LISTING item:", JSON.stringify(item, null, 2));
       return [
     
      name,
      <Chip
        label={`${item.tenure || "—"} Days`}
        size="small"
        sx={{ backgroundColor: COLORS.lightOrange, color: COLORS.primaryDark, fontWeight: 600, fontSize: TEXT_SIZES.xs }}
      />,
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
        <CalendarTodayIcon sx={{ fontSize: 12, color: COLORS.grey[500] }} />
        <Typography fontSize={TEXT_SIZES.xs} color={COLORS.grey[600]}>{start}</Typography>
      </Box>,
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
        <CalendarTodayIcon sx={{ fontSize: 12, color: COLORS.grey[500] }} />
        <Typography fontSize={TEXT_SIZES.xs} color={COLORS.grey[600]}>{end}</Typography>
      </Box>,
      <StatusChip item={item} />,
      <Button
        variant="contained"
        size="small"
        onClick={() => handleUpgrade(pkg, item)}
        startIcon={<UpgradeIcon />}
        sx={{
          minWidth: 90,
          height: 32,
          fontSize: TEXT_SIZES.xs,
          textTransform: "none",
          borderRadius: 2,
          fontWeight: 600,
          backgroundColor: COLORS.primary,
          '&:hover': { backgroundColor: COLORS.primaryDark }
        }}
      >
        Upgrade
      </Button>,
    ];

  if (type === "LEAD") {
  const statesArr =
    item.investmentranges?.flatMap((r) =>
      (r.selectedPlanStateAndDistrict || []).map((s) => s.state)
    ) || [];
  const stateCount = statesArr.length;

  const start = item.isPending ? "—" : formatDate(item.packageStartDate);
  const end = item.isPending ? "—" : formatDate(item.packageEndDate);

  const sent = item.sendingLeads || 0;
  const remaining = item.remainingLeads || 0;
  const totalLeads = item.totalLeads || 0;
  const progress = totalLeads > 0 ? (sent / totalLeads) * 100 : 0;

  const investmentRange =
    item.investmentranges?.map((r) => r.selectedPlanInvestmetrange).join(", ") || "—";

  return [
    // Package name cell
    <Box>
       <Typography fontWeight={700} fontSize={TEXT_SIZES.xs} color={COLORS.black[700]}>
  {item.validity ? `${item.validity} Days` : "—"}
</Typography>
      <Typography fontWeight={300} fontSize={TEXT_SIZES.small} color={COLORS.black} noWrap>
        {item.packagesName || pkg.packagesName}
      </Typography>
    
    </Box>,

    // Investment Group
    <Chip
      label={item.investmetRageLabel || "—"}
      size="small"
      sx={{ backgroundColor: COLORS.lightOrange, color: COLORS.primaryDark, fontWeight: 600, fontSize: TEXT_SIZES.xs, maxWidth: 120 }}
    />,

    // Investment Range(s)
    <Chip
      label={investmentRange}
      size="small"
      sx={{ backgroundColor: COLORS.lightOrange, color: COLORS.primaryDark, fontWeight: 600, fontSize: TEXT_SIZES.xs, maxWidth: 150 }}
    />,

    // States count + view
    <Box
      onClick={() => openStatesDialog(statesArr, investmentRange)}
      sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, cursor: "pointer" }}
    >
      <Typography fontSize={TEXT_SIZES.small} color={COLORS.primary} fontWeight={600}>
        {stateCount}
      </Typography>
      <VisibilityOutlinedIcon sx={{ fontSize: 16, color: COLORS.primary }} />
    </Box>,

    // Total Leads
    <Typography fontWeight={700} fontSize={TEXT_SIZES.small} color={COLORS.black}>
      {totalLeads}
    </Typography>,

    // Sent
    <Box>
      <Typography fontWeight={600} fontSize={TEXT_SIZES.small} color={COLORS.secondaryDark}>
        {sent}
      </Typography>
      <Box sx={{ width: 40, height: 2, bgcolor: COLORS.grey[200], borderRadius: 1, mt: 0.5 }}>
        <Box sx={{ width: `${progress}%`, height: 2, bgcolor: COLORS.secondary, borderRadius: 1 }} />
      </Box>
    </Box>,

    // Remaining
    <Typography fontWeight={600} fontSize={TEXT_SIZES.small} color={remaining > 0 ? COLORS.primary : COLORS.grey[400]}>
      {remaining}
    </Typography>,

    // Status
    <StatusChip item={item} />,

    // Start Date
    <Typography fontSize={TEXT_SIZES.xs} color={COLORS.grey[600]}>{start}</Typography>,

    // End Date
    <Typography fontSize={TEXT_SIZES.xs} color={COLORS.grey[600]}>{end}</Typography>,

    // Upgrade button
    <Button
      variant="outlined"
      size="small"
      onClick={() => handleUpgrade(pkg, item)}
      startIcon={<UpgradeIcon />}
      sx={{
        minWidth: 90, height: 32, fontSize: TEXT_SIZES.xs,
        textTransform: "none", borderRadius: 2, fontWeight: 600,
        borderColor: COLORS.primary, color: COLORS.primary,
        "&:hover": { borderColor: COLORS.primaryDark, backgroundColor: COLORS.lightOrange },
      }}
    >
      Upgrade
    </Button>,
  ];
}

    return [];
  };

  const TableHeader = ({ config }) => (
    <TableHead>
      <TableRow sx={{ backgroundColor: config.headerBg }}>
        {config.columns.map((col) => (
          <TableCell
            key={col}
            sx={{
              fontWeight: 700,
              fontSize: TEXT_SIZES.xs,
              color: config.headerColor,
              py: 1.5,
              borderBottom: `2px solid ${COLORS.border}`,
              whiteSpace: "nowrap",
              textAlign: "center"
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
              {col}
            </Box>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  return (
    <>
      {/* Packages Summary */}
      <Box sx={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center",
        width: "100%",
        mb:5,
      }}>
        <Typography
          variant="h4"
        sx={{
          fontWeight: 700,
          color: COLORS.black,
          mb: 0.5,
          fontSize: { xs: "1rem", md: "1.9rem" },
        }}
        >
          CURRENT ACTIVE PLAN
        </Typography>

        {!hasAnyPackages ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 3,
              border: `1px dashed ${COLORS.border}`,
              backgroundColor: COLORS.grey[50]
            }}
          >
            <Typography fontSize={TEXT_SIZES.medium} color={COLORS.grey[500]}>
              No packages found
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center", width: "100%" }}>
            {Object.entries(TABLE_CONFIGS).map(([type, config]) => {
              if (grouped[type].length === 0) return null;

              return (
                <Paper
                  key={type}
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    // overflow: "auto",
                    border: `1px solid ${COLORS.border}`,
                    transition: "all 0.3s ease",
                    width: "auto",
                    maxWidth: "100%",
                    '&:hover': { boxShadow: `0 4px 12px ${COLORS.shadow}` }
                  }}
                >
                  {/* Table Header */}
                  {/* <Box
                    sx={{
                      px: 2,
                      py: 1.5,
                      backgroundColor: config.headerBg,
                      borderBottom: `1px solid ${COLORS.border}`,
                      textAlign: "center"
                    }}
                  >
                    <Typography fontWeight={700} fontSize={TEXT_SIZES.medium} color={config.headerColor}>
                      {config.label} Packages
                    </Typography>
                  </Box> */}

                  {/* Table Content */}
                <TableContainer sx={{ width: "100%", overflow: "visible" }}>
                    <Table size="small" sx={{ width: "100%", tableLayout: "auto" }}>
                      <TableHeader config={config} />
                      <TableBody>
                        {grouped[type].map(({ pkg, item }, idx) => (
                          <TableRow
                            key={idx}
                            sx={{
                              '&:hover': { backgroundColor: COLORS.grey[50] },
                              '&:last-child td, &:last-child th': { border: 0 }
                            }}
                          >
                            {renderCell(type, pkg, item).map((cell, i) => (
                              <TableCell
                                key={i}
                                sx={{
                                  py: 1.5,
                                  px: 1.5,
                                  fontSize: TEXT_SIZES.xs,
                                  borderBottom: `1px solid ${COLORS.border}`,
                                  verticalAlign: "middle",
                                  textAlign: "center"
                                }}
                              >
                                {cell}
                              </TableCell>
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
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 380,
            maxWidth: 500,
            p: 0,
            overflow: "hidden"
          }
        }}
      >
        <DialogTitle sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
          backgroundColor: COLORS.grey[50],
          borderBottom: `1px solid ${COLORS.border}`
        }}>
          <Box>
            <Typography fontWeight={700} fontSize={TEXT_SIZES.medium} color={COLORS.black}>
              Selected States
            </Typography>
            {dialog.label && (
              <Typography fontSize={TEXT_SIZES.xs} color={COLORS.grey[500]}>
                {dialog.label}
              </Typography>
            )}
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
                key={state}
                label={state}
                size="small"
                sx={{
                  backgroundColor: COLORS.lightOrange,
                  color: COLORS.primaryDark,
                  fontWeight: 600,
                  fontSize: TEXT_SIZES.xs,
                  borderRadius: 1.5,
                }}
              />
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExistingPackageDisplay;