import React, { useState } from "react";
import {
  Box, Typography, Chip, Paper,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Tooltip,
  Accordion, AccordionSummary, AccordionDetails,
  useMediaQuery,
} from "@mui/material";
import { useTheme, keyframes } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// ─── Animation ────────────────────────────────────────────────────────────────

export const pulseAnimation = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 153, 0, 0.7); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(255, 153, 0, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 153, 0, 0); }
`;

// ─── Design Tokens ────────────────────────────────────────────────────────────

export const COLORS = {
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

export const TEXT_SIZES = {
  xs: "0.725rem", small: "0.80rem", medium: "1.3rem",
  large: "1rem", xl: "1.125rem", xxl: "1.25rem",
};

// ─── Table Configs ────────────────────────────────────────────────────────────

export const TABLE_CONFIGS = {
  FREE: {
    label: "Free",
    headerBg: COLORS.lightGreen,
    headerColor: COLORS.secondaryDark,
    columns: ["Package", "Status", "Action"],
  },
  LISTING: {
    label: "Listing",
    headerBg: COLORS.primary,
    headerColor: COLORS.white,
    columns: ["Plan", "Tenure", "Start Date", "End Date", "Status", "Action"],
  },
  LEAD: {
    label: "Lead",
    headerBg: COLORS.secondary,
    headerColor: COLORS.white,
    columns: ["Plan", "Investment Group", "Investment Range", "States", "Total Leads", "Sent", "Remaining", "Status", "Start Date", "End Date", "Action"],
  },
};

// ─── Status Helper ────────────────────────────────────────────────────────────

export const getStatus = (item) => {
  if (item.isActive && !item.isPending) {
    return {
      label: "ACTIVE",
      color: COLORS.secondaryDark,
      bg: COLORS.lightGreen,
      icon: <CheckCircleIcon sx={{ fontSize: 14 }} />,
    };
  }
  if (item.isPending) {
    return {
      label: "PENDING",
      color: "#b45309",
      bg: "#fef3c7",
      icon: <PendingIcon sx={{ fontSize: 14 }} />,
    };
  }
  return {
    label: "INACTIVE",
    color: COLORS.grey[600],
    bg: COLORS.grey[100],
    icon: <CancelIcon sx={{ fontSize: 14 }} />,
  };
};

// ─── StatusChip ───────────────────────────────────────────────────────────────

export const StatusChip = ({ item }) => {
  const s = getStatus(item);
  return (
    <Tooltip
      title={
        s.label === "PENDING" ? "Waiting for approval" :
        s.label === "ACTIVE" ? "Package is active" :
        "Package is inactive"
      }
      arrow
    >
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
          "& .MuiChip-icon": { fontSize: 14, color: s.color },
        }}
      />
    </Tooltip>
  );
};

// ─── SectionAccordion (mobile-only wrapper) ───────────────────────────────────

export const SectionAccordion = ({
  title,
  fontSize = "1.3rem",
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
        expandIcon={
          <Box
            className="expand-icon-btn"
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: COLORS.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.25s ease",
            }}
          >
            <ExpandMoreIcon sx={{ color: COLORS.white, fontSize: "1.5rem" }} />
          </Box>
        }
        sx={{
          backgroundColor: "#fff8ee",
          minHeight: 52,
          px: 2,
          transition: "background-color 0.25s ease",
          "& .MuiAccordionSummary-content": { my: 0 },
          "&:hover": {
            backgroundColor: "#ffe5b0",
            "& .expand-icon-btn": {
              animation: `${pulseAnimation} 0.8s ease infinite`,
              backgroundColor: COLORS.secondary,
              transform: "scale(1.15)",
            },
          },
        }}
      >
        <Typography
          sx={{ fontWeight: 700, textAlign: "center", fontSize: fontSize, color: COLORS.black, ml: 2 }}
        >
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>{children}</AccordionDetails>
    </Accordion>
  );
};

// ─── Table Infrastructure ─────────────────────────────────────────────────────

export const TableHeader = ({ config }) => (
  <TableHead>
    <TableRow
      sx={{
        backgroundColor: config.headerBg,
        borderBottom: `3px solid ${COLORS.primary}`,
      }}
    >
      {config.columns.map((col) => (
        <TableCell
          key={col}
          align="center"
          sx={{
            fontWeight: 700,
            fontSize: "0.85rem",
            color: config.headerColor,
            py: 2,
            px: 1.5,
            textTransform: "uppercase",
            borderBottom: `3px solid ${COLORS.primary}`,
          }}
        >
          {col}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

export const StyledTableWrapper = ({ children, width = "100%", minWidth = 600 }) => (
  <TableContainer
    sx={{
      width: "100%",
      overflowY: "hidden",
      borderRadius: 2,
      border: `1px solid ${COLORS.border}`,
      boxShadow: `0 2px 12px ${COLORS.shadow}`,
      backgroundColor: COLORS.white,
      "&::-webkit-scrollbar": { height: 8 },
      "&::-webkit-scrollbar-track": { background: COLORS.grey[100], borderRadius: 4 },
      "&::-webkit-scrollbar-thumb": {
        background: COLORS.primary,
        borderRadius: 4,
        "&:hover": { background: COLORS.primaryDark },
      },
    }}
  >
    <Table size="small" sx={{ width, mx: "auto", minWidth }}>
      {children}
    </Table>
  </TableContainer>
);