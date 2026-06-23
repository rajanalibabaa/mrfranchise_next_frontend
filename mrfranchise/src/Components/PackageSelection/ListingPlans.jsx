"use client";

import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";

const ListingPlans = ({
  plans,
  paymentSummary,
  data,
  isUpgradeMode,
  upgradePlanId,
  finalToken,
  allStates,
  ALL_INDIA_STATES,
  COLORS,
  TEXT_SIZES,
  openSnack,
  scrollToPaymentSummary,
  setPaymentSummary,
  setMovedGroupKeys,
  handleRemoveListingPlan,
}) => {
  const listingPlans = plans
    .filter(
      (plan) =>
        plan.packages?.length === 1 && plan.planName?.toLowerCase() !== "free",
    )
    .sort(
      (a, b) => (a.packages?.[0]?.amount || 0) - (b.packages?.[0]?.amount || 0),
    );

  const handleAddListingPlan = (plan, pkg) => {
    const isExistingPlan = isUpgradeMode && upgradePlanId === plan._id;
    if (isExistingPlan) {
      openSnack(
        "You already have this plan. Please upgrade to a different plan.",
        "warning",
      );
      return;
    }

    const groupKey = `listing-${plan._id}`;
    const existingListingPlan = paymentSummary.some((g) => g.isListingPlan === true);
    if (existingListingPlan) {
      openSnack("You can select only one listing plan at a time.", "warning");
      return;
    }

    const allAvailableStates = finalToken ? allStates : ALL_INDIA_STATES;
    const stateCount = allAvailableStates.length;

    const listingItem = {
      id: `listing-${plan._id}-item`,
      investmentRangeLabel: "ALL INVESTMENT RANGE",
      range: "ALL INVESTMENT RANGE",
      stateCount,
      states: ["ALL STATES"],
      selectedLeads: "-",
      totalLeads: "-",
      totalAmount: pkg.amount || 0,
      pricePerState: pkg.amount || 0,
      isListingPlan: true,
    };

    setPaymentSummary((prev) => {
      if (prev.some((g) => g.groupKey === groupKey)) {
        openSnack("Already added", "info");
        return prev;
      }
      openSnack(`${plan.planName} added to cart`, "success");
      setTimeout(() => scrollToPaymentSummary(), 400);
      return [
        ...prev,
        {
          groupKey,
          planId: plan._id,
          packagesType: plan.packageType,
          planName: plan.planName,
          planUniqueId: plan.planUniqueId,
          planpackageId: pkg._id,
          investmentRangeLabel: "ALL INVESTMENT RANGE",
          validityDays: pkg.validityDays,
          pricePerState: pkg.amount,
          amount: pkg.amount,
          totalLeads: "-",
          items: [listingItem],
          isListingPlan: true,
          uniqueStates: ["ALL STATES"],
          totalStates: stateCount,
        },
      ];
    });

    setMovedGroupKeys((prev) => {
      if (!prev.includes(groupKey)) return [...prev, groupKey];
      return prev;
    });
  };

  return (
    <Box
      sx={{
        mb: 4,
        display: "flex",
        justifyContent: "center",
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "1100px" }}>
        {/* Heading */}
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: COLORS.black,
              mb: 0.5,
              fontSize: { xs: "1rem", md: "1.9rem" },
            }}
          >
            BRAND LISTING PLANS
          </Typography>
          <Typography
            variant="body3"
            sx={{
              color: COLORS.black,
              fontSize: TEXT_SIZES.medium,
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            List your Brand to increase its Digital Visibility
          </Typography>
        </Box>

        {/* Plan Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2.5,
          }}
        >
          {listingPlans.map((plan, index) => {
            const pkg = plan.packages?.[0] || {};
            const groupKey = `listing-${plan._id}`;
            const isAdded = paymentSummary.some((g) => g.groupKey === groupKey);
            const isExistingPlan = isUpgradeMode && upgradePlanId === plan._id;

            const isAlreadyActive = (() => {
              if (!data?.packages) return false;
              return data.packages.some((p) => {
                const packageType = (p.packagesType || "").toUpperCase();
                if (packageType !== "LISTING") return false;
                const investPackages =
                  p.investmetPackages ||
                  p.InvestmetPackages ||
                  p.InvestmentPackages ||
                  p.packages ||
                  [];
                return investPackages.some((investPkg) => {
                  const pkgName = (
                    investPkg.packagesName ||
                    p.packagesName ||
                    ""
                  ).toLowerCase();
                  return (
                    pkgName === plan.planName.toLowerCase() &&
                    investPkg.isActive &&
                    !investPkg.isPending
                  );
                });
              });
            })();

            return (
              <Card
                key={plan._id}
                elevation={0}
                sx={{
                  position: "relative",
                  borderRadius: 3,
                  border: `1.5px solid ${
                    isAdded
                      ? COLORS.primary
                      : index === 1
                        ? "#ff9800"
                        : COLORS.border
                  }`,
                  backgroundColor: "#fff0c5",
                  overflow: "hidden",
                  transition: "0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 8px 20px ${COLORS.shadow}`,
                  },
                }}
              >
                {index === 1 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      background:
                        "linear-gradient(135deg,#ff9800 0%,#ff6f00 100%)",
                      color: "#fff",
                      px: 2,
                      py: 0.6,
                      borderBottomRightRadius: 12,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    🔥 Most Popular
                  </Box>
                )}

                <CardContent sx={{ p: 2, pt: index === 1 ? 5 : 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-around",
                      gap: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Left Section */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      {/* Icon */}
                      <Box
                        sx={{
                          width: 62,
                          height: 62,
                          borderRadius: "50%",
                          backgroundColor:
                            index === 1
                              ? "rgba(255,152,0,0.08)"
                              : "rgba(25,118,210,0.08)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {index === 1 ? (
                          <WorkspacePremiumRoundedIcon
                            sx={{ color: "#ff9800", fontSize: 32 }}
                          />
                        ) : (
                          <StarBorderRoundedIcon
                            sx={{ color: COLORS.primary, fontSize: 32 }}
                          />
                        )}
                      </Box>

                      {/* Details */}
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: TEXT_SIZES.large,
                            color: COLORS.black,
                            mb: 0.5,
                          }}
                        >
                          {plan.planName}
                        </Typography>
                        <Typography
                          sx={{
                            color: COLORS.grey[600],
                            fontSize: TEXT_SIZES.medium,
                            mb: 1.5,
                          }}
                        >
                          {index === 1
                            ? "For maximum visibility & leads"
                            : "Ideal for getting started"}
                        </Typography>

                        {/* Button */}
                        <Button
                          variant="contained"
                          endIcon={
                            isAlreadyActive ? null : isAdded ? (
                              <RemoveIcon />
                            ) : (
                              <AddIcon />
                            )
                          }
                          onClick={
                            isAlreadyActive
                              ? undefined
                              : isAdded
                                ? () => handleRemoveListingPlan(plan._id)
                                : () => handleAddListingPlan(plan, pkg)
                          }
                          disabled={isExistingPlan || isAlreadyActive}
                          sx={{
                            minWidth: 145,
                            height: 46,
                            borderRadius: 2.5,
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: TEXT_SIZES.medium,
                            boxShadow: "none",
                            color: "#FFFFFF !important",
                            "& .MuiTypography-root": {
                              color: "#FFFFFF !important",
                            },
                            opacity: isExistingPlan || isAlreadyActive ? 0.75 : 1,
                            background: isAlreadyActive
                              ? "linear-gradient(135deg, #4cb04f 0%, #2e7d32 100%)"
                              : index === 1
                                ? "linear-gradient(135deg,#ff9800 0%,#ff6f00 100%)"
                                : `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
                            "&:hover": {
                              boxShadow: "none",
                              opacity:
                                isExistingPlan || isAlreadyActive ? 0.75 : 0.95,
                            },
                          }}
                        >
                          {isAlreadyActive
                            ? "Active Plan"
                            : isExistingPlan
                              ? "Already in Profile"
                              : isAdded
                                ? "Remove Plan"
                                : "Add to Plan"}
                        </Button>
                      </Box>
                    </Box>

                    {/* Right Section */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                        gap: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                        <CalendarMonthRoundedIcon
                          sx={{ fontSize: 25, color: COLORS.black[600] }}
                        />
                        <Typography
                          sx={{ fontWeight: 500, color: COLORS.black[700] }}
                        >
                          {pkg.validityDays} Days
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: TEXT_SIZES.xxl,
                          color: index === 1 ? "#ff9800" : COLORS.primary,
                        }}
                      >
                        ₹{(pkg.amount || 0).toLocaleString("en-IN")}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default ListingPlans;