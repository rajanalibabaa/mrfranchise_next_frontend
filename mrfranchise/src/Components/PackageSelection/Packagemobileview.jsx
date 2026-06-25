import React, { useState } from "react";
import {
  Box, Typography, Button, Card, CardContent, Tooltip,
} from "@mui/material";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { COLORS, TEXT_SIZES, StatusChip } from "./Packageuicomponents";

// ─── Free Package Card ────────────────────────────────────────────────────────

export const FreePackageCard = ({ pkg, item, active, handleUpgrade, upgradeSectionRef }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: `1px solid ${COLORS.secondary}`,
        overflow: "hidden",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
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
          <Button
            size="small"
            onClick={() => setExpanded(!expanded)}
            sx={{
              flex: 1, color: COLORS.primary, fontSize: "0.7rem", textTransform: "none",
              fontWeight: 600, border: `1px solid ${COLORS.primary}`, borderRadius: 1.5, py: 0.5,
              "&:hover": { backgroundColor: COLORS.lightOrange },
            }}
          >
            {expanded ? "View Less" : "View More"}
          </Button>

          <Tooltip title={!active ? "Only active plans can be upgraded" : ""} arrow>
            <span style={{ flex: 1 }}>
              <Button
                variant="outlined" size="small"
                onClick={() => handleUpgrade(pkg, item, upgradeSectionRef)}
                startIcon={<UpgradeIcon sx={{ fontSize: 16 }} />}
                disabled={!active} fullWidth
                sx={{
                  height: 36, fontSize: "0.7rem", textTransform: "none", borderRadius: 1.5,
                  fontWeight: 600, borderColor: COLORS.primary, color: COLORS.primary,
                  "&:hover": { borderColor: COLORS.primaryDark, backgroundColor: COLORS.lightOrange },
                  "&.Mui-disabled": { borderColor: COLORS.grey[300], color: COLORS.grey[400] },
                }}
              >
                Upgrade
              </Button>
            </span>
          </Tooltip>
        </Box>

        {expanded && (
          <Box sx={{ mt: 1.5, pt: 1.5, borderTop: `1px solid ${COLORS.border}` }}>
            <Box
              sx={{
                display: "flex", justifyContent: "space-between", p: 0.75,
                backgroundColor: COLORS.grey[50], borderRadius: 1,
              }}
            >
              <Typography fontSize="0.7rem" color={COLORS.grey[600]}>Package Type:</Typography>
              <Typography fontSize="0.7rem" fontWeight={500}>{pkg.packagesType}</Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// ─── Listing Package Card ─────────────────────────────────────────────────────

export const ListingPackageCard = ({ pkg, item, active, handleUpgrade, formatDate, upgradeSectionRef }) => {
  const start = item.isPending ? "—" : formatDate(item.packageStartDate || item.PackageStartDate);
  const end   = item.isPending ? "—" : formatDate(item.packageEndDate   || item.PackageEndDate);
  const packageName = item.packagesName || pkg.packagesName;

  return (
    <Card
      sx={{
        borderRadius: 2, border: `1px solid ${COLORS.secondary}`,
        overflow: "hidden", width: "100%", display: "flex", flexDirection: "column",
      }}
    >
      <CardContent sx={{ p: 1.5, flex: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
          <Box sx={{ flex: 1 }}>
            <Typography fontWeight={700} fontSize={TEXT_SIZES.medium} color={COLORS.black} mb={0.5} textAlign="center">
              {packageName.length > 25 ? packageName.substring(0, 25) + "..." : packageName}
            </Typography>
            <Typography fontSize="1.5rem" color={COLORS.primaryDark} fontWeight={600} textAlign="center">
              {item.validity || item.tenure || "—"} Days
            </Typography>
          </Box>
          <StatusChip item={item} />
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
              <Button
                variant="contained" size="small"
                onClick={() => handleUpgrade(pkg, item, upgradeSectionRef)}
                disabled={!active} fullWidth
                sx={{
                  height: 36, fontSize: "1rem", textTransform: "none", borderRadius: 1.5, fontWeight: 600,
                  backgroundColor: COLORS.primary,
                  "&:hover": { backgroundColor: COLORS.primaryDark },
                  "&.Mui-disabled": { backgroundColor: COLORS.grey[200], color: COLORS.grey[400] },
                }}
              >
                Upgrade
              </Button>
            </span>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

// ─── Lead Package Card ────────────────────────────────────────────────────────

export const LeadPackageCard = ({ pkg, item, active, handleUpgrade, formatDate, openStatesDialog, upgradeSectionRef }) => {
  const [expanded, setExpanded] = useState(false);

  const startDate      = item.isPending ? "—" : formatDate(item.packageStartDate);
  const endDate        = item.isPending ? "—" : formatDate(item.packageEndDate);
  const totalLeads     = item.totalLeads     || 0;
  const sentLeads      = item.sendingLeads   || 0;
  const remainingLeads = item.remainingLeads || 0;

  const investmentRangesWithStates = Array.isArray(item.investmentranges)
    ? item.investmentranges.map((r) => ({
        range:  r.selectedPlanInvestmetrange || "—",
        states: (r.selectedPlanStateAndDistrict || [])
          .map((s) => (typeof s === "object" ? s.state : s) || "")
          .filter((s) => s.trim() !== ""),
      }))
    : [];

  return (
    <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.secondary}`, overflow: "hidden", width: "100%" }}>
      <CardContent sx={{ p: 1.5 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1, pb: 0.5, borderBottom: `1px solid ${COLORS.border}` }}>
          <Box>
            <Typography fontWeight={700} fontSize="1.5rem" color={COLORS.primary}>
              {item.validity ? `${item.validity} Days` : "—"}
            </Typography>
            <Typography fontSize={TEXT_SIZES.medium} color={COLORS.black} sx={{ fontWeight: 600 }}>
              {item.packagesType || pkg.packagesType} PLAN
            </Typography>
          </Box>
          <StatusChip item={item} />
        </Box>

        {/* Total Leads */}
        <Box sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5, p: 1, backgroundColor: COLORS.grey[50], borderRadius: 1, justifyContent: "space-evenly" }}>
          <Typography fontSize="1rem" color={COLORS.black}>Total Leads</Typography>
          <Typography fontSize="1rem" fontWeight={600} color={COLORS.primaryDark}>{totalLeads}</Typography>
        </Box>

        {/* Dates */}
        <Box sx={{ p: 1, backgroundColor: COLORS.grey[50], borderRadius: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", mb: 1 }}>
            <Typography fontSize="0.9rem" color={COLORS.grey[600]}>Start Date:</Typography>
            <Typography fontSize="0.9rem" fontWeight={500}>{startDate}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
            <Typography fontSize="0.9rem" color={COLORS.grey[600]}>End Date:</Typography>
            <Typography fontSize="0.9rem" fontWeight={500}>{endDate}</Typography>
          </Box>
        </Box>

        {/* Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
          <Button
            size="small" onClick={() => setExpanded(!expanded)}
            sx={{
              flex: 1, color: COLORS.primary, fontSize: "1.2rem", textTransform: "none", fontWeight: 600,
              border: `1px solid ${COLORS.primary}`, borderRadius: 1.5, py: 0.75,
              "&:hover": { backgroundColor: COLORS.lightOrange },
            }}
          >
            {expanded ? "View Less" : "View More"}
          </Button>
          <Tooltip title={!active ? "Only active plans can be upgraded" : ""} arrow>
            <span style={{ flex: 1 }}>
              <Button
                variant="outlined" size="small"
                onClick={() => handleUpgrade(pkg, item, upgradeSectionRef)}
                disabled={!active} fullWidth
                sx={{
                  flex: 1, color: COLORS.primary, fontSize: "1.2rem", textTransform: "none", fontWeight: 600,
                  border: `1px solid ${COLORS.primary}`, borderRadius: 1.5, py: 0.75,
                  "&:hover": { backgroundColor: COLORS.lightOrange },
                }}
              >
                Upgrade
              </Button>
            </span>
          </Tooltip>
        </Box>

        {/* Expanded Details */}
        {expanded && (
          <Box sx={{ mt: 1.5, pt: 1.5, borderTop: `1px solid ${COLORS.border}` }}>
            {[
              ["Sent Leads", sentLeads, COLORS.secondaryDark],
              ["Remaining Leads", remainingLeads, remainingLeads > 0 ? COLORS.primary : COLORS.grey[400]],
            ].map(([label, val, color]) => (
              <Box
                key={label}
                sx={{ display: "flex", justifyContent: "space-between", mb: 1, p: 1, backgroundColor: COLORS.grey[50], borderRadius: 1 }}
              >
                <Typography fontSize="1rem" color={COLORS.black}>{label}:</Typography>
                <Typography fontWeight={600} fontSize="1rem" color={color}>{val}</Typography>
              </Box>
            ))}

            {investmentRangesWithStates.length > 0 && (
              <Box sx={{ mb: 1.5 }}>
                <Box
                  sx={{
                    mb: 1, display: "flex", alignItems: "center", gap: 0.5, p: 1,
                    backgroundColor: COLORS.grey[50], borderRadius: 1, justifyContent: "space-evenly",
                  }}
                >
                  <Typography fontSize="1rem" color={COLORS.black}>Investment Group:</Typography>
                  <Typography fontSize="1rem" fontWeight={600} color={COLORS.primaryDark}>
                    {item.investmetRageLabel || item.investmentGroupLabel || "—"}
                  </Typography>
                </Box>

                {investmentRangesWithStates.map((rangeData, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      mb: 1, p: 0.75, backgroundColor: COLORS.grey[50], borderRadius: 1,
                    }}
                  >
                    <Typography fontSize="1rem" fontWeight={600} color={COLORS.primaryDark} sx={{ flex: 1 }}>
                      {rangeData.range.length > 25 ? rangeData.range.substring(0, 25) + "..." : rangeData.range}
                    </Typography>
                    <Box
                      onClick={() => openStatesDialog(rangeData.states, rangeData.range)}
                      sx={{
                        display: "inline-flex", alignItems: "center", gap: 0.5, cursor: "pointer",
                        backgroundColor: COLORS.white, px: 1, py: 0.5, borderRadius: 1,
                        border: `1px solid ${COLORS.border}`,
                      }}
                    >
                      <Typography fontSize="1rem" color={COLORS.primary} fontWeight={600}>
                        {rangeData.states.length} states
                      </Typography>
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

// ─── Mobile Tab View ──────────────────────────────────────────────────────────

const MobileTabView = ({
  grouped, shouldShowFree, isItemActive,
  handleUpgrade, formatDate, openStatesDialog, upgradeSectionRef,
}) => {
  const tabs = [
    shouldShowFree && grouped.FREE.length > 0   && { key: "FREE",    label: "Free" },
    grouped.LISTING.length > 0                  && { key: "LISTING", label: "Listing" },
    grouped.LEAD.length > 0                     && { key: "LEAD",    label: "Lead" },
  ].filter(Boolean);

  const [activeTab, setActiveTab]       = useState(tabs[0]?.key || "FREE");
  const [activeLeadIdx, setActiveLeadIdx] = useState(0);
  const leadItems = grouped.LEAD;

  if (tabs.length === 0) return null;

  const tabSx = (isActive) => ({
    flex: 1, textAlign: "center", py: 1.25, fontSize: "1.3rem", fontWeight: 700,
    border: `1.5px solid ${isActive ? COLORS.primary : COLORS.border}`,
    color: isActive ? COLORS.white : COLORS.black,
    backgroundColor: isActive ? COLORS.primary : COLORS.white,
    borderRadius: "8px 8px 8px 8px",
    cursor: "pointer", transition: "all 0.15s", userSelect: "none",
  });

  return (
    <Box sx={{ width: "100%" }}>
      {/* Tab Bar */}
      <Box
        sx={{
          display: "flex", borderBottom: `1px solid ${COLORS.border}`,
          backgroundColor: COLORS.grey[50], px: 1, gap: 0.5,
        }}
      >
        {tabs.map(({ key, label }) => (
          <Box key={key} onClick={() => setActiveTab(key)} sx={tabSx(activeTab === key)}>
            {label} Plan
          </Box>
        ))}
      </Box>

      {/* Tab Content */}
      <Box sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 1.5 }}>
        {activeTab === "FREE" &&
          grouped.FREE.map(({ pkg, item }, idx) => (
            <FreePackageCard
              key={idx} pkg={pkg} item={item} active={isItemActive(item)}
              handleUpgrade={handleUpgrade} upgradeSectionRef={upgradeSectionRef}
            />
          ))}

        {activeTab === "LISTING" &&
          grouped.LISTING.map(({ pkg, item }, idx) => (
            <ListingPackageCard
              key={idx} pkg={pkg} item={item} active={isItemActive(item)}
              handleUpgrade={handleUpgrade} formatDate={formatDate} upgradeSectionRef={upgradeSectionRef}
            />
          ))}

        {activeTab === "LEAD" && leadItems.length > 0 && (
          <Box>
            {leadItems.length > 1 && (
              <Box
                sx={{
                  display: "flex", flexWrap: "wrap", mb: 1.5, pb: 1.5,
                  justifyContent: "space-evenly", borderBottom: `1px solid ${COLORS.border}`,
                }}
              >
                {leadItems.map(({ item }, idx) => {
                  const isActive = activeLeadIdx === idx;
                  const label = item.validity ? `${item.validity} Days` : `Plan ${idx + 1}`;
                  return (
                    <Box
                      key={idx} onClick={() => setActiveLeadIdx(idx)}
                      sx={{
                        px: 1.5, py: 0.5, borderRadius: "20px", fontSize: "1.2rem", fontWeight: 500,
                        cursor: "pointer",
                        border: `1.5px solid ${isActive ? COLORS.primary : COLORS.border}`,
                        backgroundColor: isActive ? COLORS.primary : COLORS.white,
                        color: isActive ? COLORS.white : COLORS.grey[600],
                        transition: "all 0.15s", userSelect: "none",
                        alignItems: "center", display: "flex", justifyContent: "space-evenly",
                      }}
                    >
                      {label}
                    </Box>
                  );
                })}
              </Box>
            )}

            {(() => {
              const { pkg, item } = leadItems[activeLeadIdx] || leadItems[0];
              return (
                <LeadPackageCard
                  pkg={pkg} item={item} active={isItemActive(item)}
                  handleUpgrade={handleUpgrade} formatDate={formatDate}
                  openStatesDialog={openStatesDialog} upgradeSectionRef={upgradeSectionRef}
                />
              );
            })()}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MobileTabView;