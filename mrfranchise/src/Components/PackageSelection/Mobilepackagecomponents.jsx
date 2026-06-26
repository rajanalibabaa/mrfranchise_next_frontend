"use client";
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  Checkbox,
  Collapse,
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  COLORS, T, pulseAnimation,
  fmtINR, getUniqueStatesForGroup, getUniqueStatesForCheckedItems,
} from "./Mobilepackagetheme";

// ─── Custom Scrollable List ───────────────────────────────────────────────────
export const ScrollableCardList = ({ children, maxHeight = 480 }) => {
  const scrollAreaRef = useRef(null);
  const thumbRef = useRef(null);
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartTop = useRef(0);

  const updateThumb = useCallback(() => {
    const area = scrollAreaRef.current;
    const thumb = thumbRef.current;
    const track = trackRef.current;
    if (!area || !thumb || !track) return;
    const scrollable = area.scrollHeight - area.clientHeight;
    if (scrollable <= 0) { thumb.style.display = "none"; return; }
    thumb.style.display = "block";
    const trackH = track.clientHeight;
    const thumbH = Math.max(40, (area.clientHeight / area.scrollHeight) * trackH);
    thumb.style.height = thumbH + "px";
    const ratio = area.scrollTop / scrollable;
    const maxTop = trackH - thumbH;
    thumb.style.top = ratio * maxTop + "px";
  }, []);

  useEffect(() => {
    const area = scrollAreaRef.current;
    if (!area) return;
    area.addEventListener("scroll", updateThumb);
    const ro = new ResizeObserver(updateThumb);
    ro.observe(area);
    updateThumb();
    return () => { area.removeEventListener("scroll", updateThumb); ro.disconnect(); };
  }, [updateThumb]);

  useEffect(() => {
    const onMove = (e) => {
      if (!isDragging.current) return;
      const track = trackRef.current;
      const thumb = thumbRef.current;
      const area = scrollAreaRef.current;
      if (!track || !thumb || !area) return;
      const trackH = track.clientHeight;
      const thumbH = thumb.clientHeight;
      const maxTop = trackH - thumbH;
      const newTop = Math.min(maxTop, Math.max(0, dragStartTop.current + (e.clientY - dragStartY.current)));
      thumb.style.top = newTop + "px";
      area.scrollTop = (newTop / maxTop) * (area.scrollHeight - area.clientHeight);
    };
    const onUp = () => { isDragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  return (
    <Box sx={{ display: "flex", width: "100%", position: "relative" }}>
      <Box
        ref={scrollAreaRef}
        sx={{
          flex: 1,
          maxHeight: `${maxHeight}px`,
          overflowY: "scroll",
          overflowX: "hidden",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
        }}
      >
        {children}
      </Box>
      <Box
        ref={trackRef}
        sx={{ width: "6px", flexShrink: 0, backgroundColor: COLORS.grey[200], borderRadius: "3px", position: "relative", my: 0.5, mr: 0.5 }}
      >
        <Box
          ref={thumbRef}
          onMouseDown={(e) => {
            isDragging.current = true;
            dragStartY.current = e.clientY;
            dragStartTop.current = parseFloat(thumbRef.current.style.top) || 0;
            e.preventDefault();
          }}
          sx={{
            width: "6px", minHeight: "40px", backgroundColor: COLORS.primary,
            borderRadius: "3px", position: "absolute", top: 0, left: 0,
            cursor: "grab",
            "&:active": { cursor: "grabbing", backgroundColor: COLORS.primaryDark },
            "&:hover": { backgroundColor: COLORS.primaryDark },
          }}
        />
      </Box>
    </Box>
  );
};

// ─── Mobile-only Section Accordion ───────────────────────────────────────────
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
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={
          <Box
            className="expand-icon-btn"
            sx={{
              width: 36, height: 36, borderRadius: "50%",
              backgroundColor: COLORS.primary,
              display: "flex", alignItems: "center", justifyContent: "center",
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
        <Typography sx={{ fontWeight: 700, textAlign: "center", fontSize: fontSize, color: COLORS.black, ml: 2 }}>
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
export const LeadsStepper = ({ value, options, onChange }) => {
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
        width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
        cursor: idx <= 0 ? "not-allowed" : "pointer",
        transition: "background 0.2s",
        "&:active": { backgroundColor: idx <= 0 ? COLORS.secondary[100] : "rgba(255,153,0,0.2)" },
      }}>
        <RemoveIcon sx={{ fontSize: 26, color: idx <= 0 ? COLORS.grey[400] : COLORS.secondary, fontWeight: 900 }} />
      </Box>
      <Box sx={{ minWidth: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", px: 1, backgroundColor: COLORS.white }}>
        <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: COLORS.primary, letterSpacing: "-0.01em", lineHeight: 1 }}>
          {value}
        </Typography>
      </Box>
      <Box onClick={inc} sx={{
        width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
        cursor: idx >= options.length - 1 ? "not-allowed" : "pointer",
        transition: "background 0.2s",
        "&:active": { backgroundColor: idx >= options.length - 1 ? COLORS.grey[100] : "rgba(255,153,0,0.2)" },
      }}>
        <AddIcon sx={{ fontSize: 26, color: idx >= options.length - 1 ? COLORS.grey[400] : COLORS.secondary, fontWeight: 900 }} />
      </Box>
    </Box>
  );
};

// ─── RangeGroupCard ───────────────────────────────────────────────────────────
export const RangeGroupCard = ({
  label, items, expanded, onToggle, checkedItems, onCheck, onEditStates,
  planId, statesByInvestmentRange, getStateCountForRange, inPaymentSet,
  availableLeads, getGroupLeads, handleLeadsChange, leadsDropdownData,
  leadsKey, pricePerState, allStates = [],
}) => {
  const currentLeads = getGroupLeads ? getGroupLeads(label) : 0;
  const scrollContainerRef = useRef(null);

  const totalStatesCount = useMemo(() => {
    return getUniqueStatesForGroup(planId, label, items, statesByInvestmentRange, allStates).size;
  }, [planId, label, items, statesByInvestmentRange, allStates]);

  useEffect(() => {
    if (expanded && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [expanded]);

  return (
    <Box sx={{ border: `2px solid ${COLORS.primary}`, borderRadius: 2.5, overflow: "hidden", mb: 1.5, backgroundColor: COLORS.white }}>
      <Box
        onClick={onToggle}
        sx={{
          display: "flex", alignItems: "center", flexDirection: "column",
          px: 2, py: 1.4, cursor: "pointer", backgroundColor: "#fff0c5",
          "&:active": { backgroundColor: "#ffe5a0" },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", width: "100%", position: "relative" }}>
          <Typography sx={{ fontSize: T.xl, fontWeight: 700, color: COLORS.black }}>{label}</Typography>
          <Box sx={{ position: "absolute", right: 0 }}>
            {expanded
              ? <KeyboardArrowUpIcon sx={{ fontSize: 25, color: COLORS.grey[600] }} />
              : <KeyboardArrowDownIcon sx={{ fontSize: 25, color: COLORS.grey[600] }} />
            }
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
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
                      fontSize: T.xl, fontWeight: 700, cursor: "pointer",
                    }}>
                    {opt}
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ backgroundColor: COLORS.grey[50], px: 0, pt: 0, pb: 0.5 }}>
          {/* Headings */}
          <Box sx={{ display: "flex", justifyContent: "space-evenly", mb: 1, mt: 1, px: 1 }}>
            <Typography sx={{ fontSize: T.md, fontWeight: 600, color: COLORS.black, letterSpacing: "0.05em" }}>
              Investment Range
            </Typography>
            <Typography sx={{ fontSize: T.md, fontWeight: 600, color: COLORS.black, letterSpacing: "0.05em", ml: 8 }}>
              States
            </Typography>
          </Box>

          {/* Scrollable list */}
          <Box
            ref={scrollContainerRef}
            sx={{
              maxHeight: expanded ? "150px" : "0px",
              overflowY: "scroll", overflowX: "hidden",
              pl: 0.5, pr: 0, mr: 0,
              transition: "max-height 0.3s ease-in-out",
              "&::-webkit-scrollbar": { width: "5px" },
              "&::-webkit-scrollbar-track": { backgroundColor: COLORS.grey[200], borderRadius: "0px" },
              "&::-webkit-scrollbar-thumb": { backgroundColor: COLORS.primary, borderRadius: "4px", minHeight: "40px" },
              "&::-webkit-scrollbar-thumb:hover": { backgroundColor: COLORS.primaryDark },
              scrollbarWidth: "thin",
              scrollbarColor: `${COLORS.primary} ${COLORS.grey[200]}`,
            }}
          >
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
                    <Typography sx={{ fontSize: T.xl, fontWeight: 600, color: COLORS.black }}>
                      {item.range}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.3, px: 1, py: 0.3 }}>
                    <Typography sx={{ fontSize: T.xl, fontWeight: 600, color: COLORS.black }}>
                      {stateCount}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); onEditStates(label, item.range, planId); }}
                      sx={{ p: 0.2 }}
                    >
                      <EditIcon sx={{ fontSize: 16, color: COLORS.primary }} />
                    </IconButton>
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* Summary */}
          {(() => {
            const leads = currentLeads || 0;
            const checkedUniqueStates = getUniqueStatesForCheckedItems(
              planId, label, items, checkedItems, statesByInvestmentRange, allStates
            );
            const hasAnyChecked = items.some((item) => checkedItems[`${planId}-${label}-${item.range}`]);
            const totalUniqueStates = hasAnyChecked ? checkedUniqueStates.size : 1;

            const lKey = `${planId}_${label}`;
            const avail = leadsDropdownData ? (leadsDropdownData[lKey] || []) : [];
            const minLeads = avail.length > 0 ? Math.min(...avail) : 1;
            const divisor = minLeads > 0 ? minLeads : 1;
            const groupTotalLeads = leads * totalUniqueStates;
            const groupAmount = (pricePerState / divisor) * totalUniqueStates * leads;

            return (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 1, mt: 2, borderRadius: 2, backgroundColor: COLORS.white, px: 1, py: 1 }}>
                <Box sx={{ display: "flex", gap: 0.2 }}>
                  <Box sx={{
                    flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                    backgroundColor: "rgba(255,153,0,0.06)", border: `3px solid ${COLORS.border}`,
                    borderRadius: "10px", px: 0, py: 0.8,
                  }}>
                    <Typography sx={{ fontSize: "0.85rem", color: COLORS.grey[600], fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1, mb: 0.4, whiteSpace: "nowrap" }}>
                      Per State
                    </Typography>
                    <Typography sx={{ fontSize: "1.4rem", fontWeight: 800, color: COLORS.primaryDark, lineHeight: 1 }}>
                      {fmtINR((pricePerState / divisor) * currentLeads)}
                    </Typography>
                  </Box>
                  <Box sx={{
                    flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                    backgroundColor: "rgba(76,176,79,0.06)", border: `3px solid ${COLORS.border}`,
                    borderRadius: "10px", px: 1, py: 0.8,
                  }}>
                    <Typography sx={{ fontSize: "0.85rem", color: COLORS.grey[600], fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1, mb: 0.4, whiteSpace: "nowrap" }}>
                      Total Leads
                    </Typography>
                    <Typography sx={{ fontSize: "1.4rem", fontWeight: 800, color: COLORS.secondary, lineHeight: 1 }}>
                      {groupTotalLeads.toLocaleString("en-IN")}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  backgroundColor: "rgba(0,0,0,0.03)", border: `3px solid ${COLORS.border}`,
                  borderRadius: "10px", px: 1, py: 0.8,
                }}>
                  <Typography sx={{ fontSize: "0.85rem", color: COLORS.grey[600], fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1, mb: 0.4, whiteSpace: "nowrap" }}>
                    Total Amount
                  </Typography>
                  <Typography sx={{ fontSize: "1.4rem", fontWeight: 800, color: COLORS.secondary, lineHeight: 1 }}>
                    {fmtINR(groupAmount)}
                  </Typography>
                </Box>
              </Box>
            );
          })()}
        </Box>
      </Collapse>
    </Box>
  );
};

// ─── Listing Plan Card ────────────────────────────────────────────────────────
export const ListingPlanDetail = ({
  plan, isAdded, isAlreadyActive, isExistingPlan, isMostPopular, onAdd, onRemove,
}) => {
  const pkg = plan.packages?.[0] || {};

  return (
    <Box sx={{
      border: `2px solid ${COLORS.primary}`,
      borderRadius: 2.5, backgroundColor: "#fff0c5",
      p: 1, mt: 1.5, position: "relative", overflow: "hidden",
    }}>
      {isMostPopular && (
        <Box sx={{
          position: "absolute", top: 8, left: -65,
          transform: "rotate(-45deg)",
          background: "linear-gradient(135deg,#ff9800 0%,#ff6f00 100%)",
          color: "#fff", px: 3, py: 0.4, fontSize: "0.65rem", fontWeight: 700,
          textAlign: "center", width: 110,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)", zIndex: 1,
          display: { xs: "none", sm: "block" },
        }}>
          Popular
        </Box>
      )}
    <Box sx={{ mb: 2 }}>
  <Typography sx={{ fontWeight: 700, fontSize: T.lg, color: COLORS.black, ml: 0.8 }}>
    {plan.planName}
  </Typography>
  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 0.5, ml: 0.6 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <CalendarMonthRoundedIcon sx={{ fontSize: 22, color: COLORS.primary }} />
      <Typography sx={{ fontSize: "1.3rem", color: COLORS.primary, fontWeight: 600 }}>
        {pkg.validityDays} Days
      </Typography>
    </Box>
    <Typography sx={{ fontSize: "1.4rem", fontWeight: 800, color: isMostPopular ? "#ff9800" : COLORS.primary }}>
      {fmtINR(pkg.amount)}
    </Typography>
  </Box>
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
          fontSize: T.xl, fontWeight: 700, textTransform: "none",
          borderRadius: 2, boxShadow: "none", py: 1.2, color: COLORS.white,
          background: isAlreadyActive
            ? "linear-gradient(135deg,#4cb04f 0%,#2e7d32 100%)"
            : isMostPopular
            ? "linear-gradient(135deg,#ff9800 0%,#ff6f00 100%)"
            : `linear-gradient(135deg,${COLORS.primary} 0%,${COLORS.primaryDark} 100%)`,
          "&:hover": { boxShadow: "none", opacity: 0.9 },
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
export const StatCard = ({ label, value, sub, fullWidth }) => (
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