"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  memo,
  useRef,
} from "react";

import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Box,
  Checkbox,
  CircularProgress,
  Alert,
  Chip,
  Button,
  Typography,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { keyframes } from "@mui/system";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MobilePackageSelection from "./Mobilepackageselection";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import LoginPage from "@/Components/LoginPage/LoginPage.jsx";
import LayersIcon from "@mui/icons-material/Layers";
import StateSelectionModal from "./StateSelectionModal";
import SelectedStatesTooltipModal from "./SelectedStatesTooltipModal";
import InvestmentRangeConfirmDialog from "./InvestmentRangeConfirmDialog";
import RemoveInvestmentRangeDialog from "./RemoveInvestmentRangeDialog";
import PaymentSummaryTable from "./PaymentSummaryTable";
import PaymentBottomBar from "./PaymentBottomBar";
import ExistingPackageDisplay from "./ExistingPackageDisplay";
import ListingPlans from "./ListingPlans";
import InvestorLeadPlans from "./Investorleadplans";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

const bounceAnimation = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
  40% { transform: translateX(-50%) translateY(-10px); }
  60% { transform: translateX(-50%) translateY(-5px); }
`;

const INDIA_STATES = {
  North: ["Chandigarh", "Delhi", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Ladakh", "Punjab", "Rajasthan", "Uttar Pradesh", "Uttarakhand"],
  South: ["Andhra Pradesh", "Karnataka", "Kerala", "Lakshadweep", "Puducherry", "Tamil Nadu", "Telangana"],
  East: ["Andaman and Nicobar Islands", "Bihar", "Jharkhand", "Odisha", "West Bengal"],
  West: ["Dadra and Nagar Haveli and Daman and Diu", "Goa", "Gujarat", "Maharashtra"],
  NorthEast: ["Arunachal Pradesh", "Assam", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura"],
  Central: ["Chhattisgarh", "Madhya Pradesh"],
};
const ALL_INDIA_STATES = Object.values(INDIA_STATES).flat();

const AlertMessage = memo(({ severity, message, action }) => (
  <Alert
    severity={severity}
    sx={{
      mb: 2, borderRadius: 2,
      backgroundColor: severity === "success" ? COLORS.lightGreen : COLORS.lightOrange,
      color: COLORS.black, fontSize: TEXT_SIZES.medium,
      border: `1px solid ${severity === "success" ? COLORS.secondary : COLORS.primary}`,
      "& .MuiAlert-icon": { color: severity === "success" ? COLORS.secondary : COLORS.primary },
    }}
    action={action}
  >
    {message}
  </Alert>
));
AlertMessage.displayName = "AlertMessage";

const getUserLocationFromIP = async () => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    if (data.region) {
      const matchedState = ALL_INDIA_STATES.find(
        (state) => state.toLowerCase() === data.region.toLowerCase(),
      );
      return { state: matchedState || data.region, city: data.city, country: data.country_name };
    }
    return null;
  } catch (error) {
    console.error("Error fetching location from IP:", error);
    return null;
  }
};

const PackageSelection = ({ onAddInvestmentRange = () => {} }) => {
  const router = useRouter();
  const paymentSummaryRef = useRef(null);
  const hasDraftChecked = useRef(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const upgradeSectionRef = useRef(null);

  const [paymentSummary, setPaymentSummary] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brandLoading, setBrandLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState({});
  const [selectedPlans, setSelectedPlans] = useState({});
  const [brandError, setBrandError] = useState(null);
  const [ficoInvestmentRanges, setFicoInvestmentRanges] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [tooltipAnchorEl, setTooltipAnchorEl] = useState(null);
  const [detectedState, setDetectedState] = useState(null);
  const [openStateModal, setOpenStateModal] = useState(false);
  const [allStates, setAllStates] = useState(ALL_INDIA_STATES);
  const [selectedStates, setSelectedStates] = useState(new Set());
  const [statesByInvestmentRange, setStatesByInvestmentRange] = useState({});
  const statesByInvestmentRangeRef = useRef(statesByInvestmentRange);
  const [currentEditingRange, setCurrentEditingRange] = useState(null);
  const [isUpgradeMode, setIsUpgradeMode] = useState(false);
  const [upgradePlanId, setUpgradePlanId] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [openSection, setOpenSection] = useState(["investor", "summary"]);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });
  const [leadsDropdownData, setLeadsDropdownData] = useState({});
  const [selectedLeadsPerRange, setSelectedLeadsPerRange] = useState({});
  const [selectedListingPlanId, setSelectedListingPlanId] = useState(null);
  const [movedGroupKeys, setMovedGroupKeys] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedValidityDays, setSelectedValidityDays] = useState({});
  const [checkedItems, setCheckedItems] = useState({});
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [pendingSelection, setPendingSelection] = useState(null);
  const [expandedRegion, setExpandedRegion] = useState(null);
  const [draftStatesByRange, setDraftStatesByRange] = useState({});
  const [openStatesTooltip, setOpenStatesTooltip] = useState(false);
  const [tooltipStates, setTooltipStates] = useState([]);
  const [highlightExcludePlan, setHighlightExcludePlan] = useState(null);
  const [openRemoveConfirmDialog, setOpenRemoveConfirmDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const { brandUUID: reduxBrandUUID, token: reduxToken } = useSelector((state) => state.auth);
  const [localBrandUUID, setLocalBrandUUID] = useState(null);
  const [localAccessToken, setLocalAccessToken] = useState(null);
  const [data, setData] = useState(null);
  const [loadings, setLoadings] = useState(true);
  const [errors, setErrors] = useState("");
  const [brandOwnerId, setBrandOwnerId] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem("brandOwnerId") || localStorage.getItem("brandUUID");
    if (id) {
      setBrandOwnerId(id);
    } else {
      setLoadings(false);
    }
  }, []);

  const fetchPackages = async () => {
    try {
      setLoadings(true);
      const response = await axios.get(`http://localhost:5000/api/v1/brand-packages-plans/get/${brandOwnerId}`);
      const apiData = response.data.data || response.data;
      setData(apiData);
      if (apiData && apiData.packages && Array.isArray(apiData.packages)) {
        const initialStatesByRange = {};
        apiData.packages.forEach((packageItem) => {
          if (packageItem.investmetPackages && Array.isArray(packageItem.investmetPackages)) {
            packageItem.investmetPackages.forEach((investPackage) => {
              const planId = apiData.brandOwnerId || "default";
              const investmentRangeLabel = "Investment Range";
              if (investPackage.investmentranges && Array.isArray(investPackage.investmentranges)) {
                investPackage.investmentranges.forEach((range) => {
                  const investmentRange = range.selectedPlanInvestmetrange;
                  if (investPackage.selectedPlanStateAndDistrict && Array.isArray(investPackage.selectedPlanStateAndDistrict)) {
                    const states = investPackage.selectedPlanStateAndDistrict.map((item) => item.state);
                    if (states && states.length > 0) {
                      const key = `${planId}__${investmentRangeLabel}__${investmentRange}`;
                      initialStatesByRange[key] = states;
                    }
                  }
                });
              }
            });
          }
        });
        if (Object.keys(initialStatesByRange).length > 0) {
          setStatesByInvestmentRange(initialStatesByRange);
          localStorage.setItem("investmentRangeStates", JSON.stringify(initialStatesByRange));
        }
      }
    } catch (err) {
      setErrors(err?.response?.data?.message || "Failed to fetch package data");
    } finally {
      setLoadings(false);
    }
  };

  useEffect(() => {
    if (brandOwnerId) fetchPackages();
  }, [brandOwnerId]);

  const scrollToPaymentSummary = useCallback(() => {
    if (paymentSummaryRef.current) {
      paymentSummaryRef.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLocalBrandUUID(localStorage.getItem("brandUUID"));
      setLocalAccessToken(localStorage.getItem("accessToken"));
      const savedStates = localStorage.getItem("investmentRangeStates");
      if (savedStates) {
        try {
          const parsedStates = JSON.parse(savedStates);
          setStatesByInvestmentRange(parsedStates);
        } catch (err) {
          console.error("Error parsing saved states:", err);
        }
      }
      const savedSummary = localStorage.getItem("paymentSummaryDraft");
      if (savedSummary) {
        try {
          const parsed = JSON.parse(savedSummary);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPaymentSummary(parsed);
            const savedMovedKeys = localStorage.getItem("movedGroupKeys");
            let restoredMovedKeys = [];
            if (savedMovedKeys) {
              try {
                restoredMovedKeys = JSON.parse(savedMovedKeys);
                setMovedGroupKeys(restoredMovedKeys);
              } catch (err) {
                console.error("Error parsing moved group keys:", err);
              }
            }
            const newMovedKeys = [...restoredMovedKeys];
            parsed.forEach((group) => {
              if (group.groupKey && !newMovedKeys.includes(group.groupKey)) newMovedKeys.push(group.groupKey);
            });
            if (JSON.stringify(newMovedKeys) !== JSON.stringify(restoredMovedKeys)) setMovedGroupKeys(newMovedKeys);
            const restoredSelected = {};
            const restoredChecked = {};
            parsed.forEach((group) => {
              if (group.groupKey?.startsWith("listing-")) restoredSelected[group.groupKey] = true;
              group.items?.forEach((item) => {
                if (item.id) { restoredSelected[item.id] = true; restoredChecked[item.id] = true; }
              });
            });
            setSelected((prev) => ({ ...prev, ...restoredSelected }));
            setCheckedItems(restoredChecked);
          }
        } catch (err) {
          console.error("Error parsing saved payment summary:", err);
        }
      }
      hasDraftChecked.current = true;
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && movedGroupKeys.length > 0) {
      localStorage.setItem("movedGroupKeys", JSON.stringify(movedGroupKeys));
    }
  }, [movedGroupKeys]);

  useEffect(() => {
    statesByInvestmentRangeRef.current = statesByInvestmentRange;
  }, [statesByInvestmentRange]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("paymentSummaryDraft", JSON.stringify(paymentSummary));
    }
  }, [paymentSummary]);

  const finalBrandUUID = reduxBrandUUID || localBrandUUID;
  const finalToken = reduxToken || localAccessToken;

  const openSnack = useCallback((message, severity = "info") => {
    setSnack({ open: true, message, severity });
  }, []);

  const handleSectionChange = useCallback((sectionName) => (isOpen) => {
    setOpenSection((prev) => {
      if (isOpen) {
        if (!prev.includes(sectionName)) return [...prev, sectionName];
        return prev;
      } else {
        return prev.filter((s) => s !== sectionName);
      }
    });
  }, []);

  const closeSnack = useCallback(() => {
    setSnack((s) => ({ ...s, open: false }));
  }, []);

  const getRangeKey = useCallback((investmentRangeLabel, range, planId = null) => {
    if (planId) return `${planId}__${investmentRangeLabel}__${range}`;
    return `${investmentRangeLabel}__${range}`;
  }, []);

  useEffect(() => {
    const detectLocation = async () => {
      if (finalToken) return;
      const savedLocation = localStorage.getItem("userLocation");
      if (savedLocation) {
        try {
          const parsed = JSON.parse(savedLocation);
          setUserLocation(parsed);
          if (parsed.state) {
            const matchedState = ALL_INDIA_STATES.find((s) => s.toLowerCase() === parsed.state.toLowerCase());
            if (matchedState) setDetectedState(matchedState);
          }
          return;
        } catch (err) { console.error("Error parsing saved location:", err); }
      }
      setLocationLoading(true);
      try {
        const ipLocation = await getUserLocationFromIP();
        if (ipLocation && ipLocation.state) {
          const locationData = { state: ipLocation.state, city: ipLocation.city, country: ipLocation.country };
          setUserLocation(locationData);
          localStorage.setItem("userLocation", JSON.stringify(locationData));
          const matchedState = ALL_INDIA_STATES.find((s) => s.toLowerCase() === ipLocation.state.toLowerCase());
          if (matchedState) setDetectedState(matchedState);
        }
      } catch (error) {
        console.error("Location detection error:", error);
      } finally {
        setLocationLoading(false);
      }
    };
    detectLocation();
  }, [finalToken]);

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!finalBrandUUID) return;
    fetchBrandDetails(finalBrandUUID, finalToken);
  }, [finalBrandUUID, finalToken]);

  const getStatesToDisplay = useCallback(() => {
    if (finalToken) return allStates.length > 0 ? allStates : [];
    return ALL_INDIA_STATES;
  }, [allStates, finalToken]);

  useEffect(() => {
    if (Object.keys(leadsDropdownData).length === 0) return;
    if (paymentSummary.length > 0) {
      setPaymentSummary((prev) => {
        return prev.map((group) => {
          if (group.isListingPlan) return group;
          const updatedItems = group.items.map((item) => {
            const key = getRangeKey(item.investmentRangeLabel, item.range, group.planId);
            let states = statesByInvestmentRange[key];
            if (!states || states.length === 0) {
              states = item.states && item.states.length > 0 ? item.states : [];
            }
            const leadsDataKey = `${group.planId}_${group.investmentRangeLabel}`;
            const availableLeads = leadsDropdownData[leadsDataKey] || [];
            const minLeads = availableLeads.length > 0 ? Math.min(...availableLeads) : 1;
            const divisor = minLeads > 0 ? minLeads : 1;
            const itemAmount = (group.pricePerState / divisor) * (states || []).length * (item.selectedLeads || 0);
            return {
              ...item,
              states: states || [],
              stateCount: (states || []).length,
              totalLeads: (item.selectedLeads || 0) * (states || []).length,
              totalAmount: itemAmount,
            };
          });
          const allStatesSet = new Set();
          updatedItems.forEach((item) => { (item.states || []).forEach((state) => allStatesSet.add(state)); });
          const uniqueStates = Array.from(allStatesSet);
          const totalUniqueStates = uniqueStates.length;
          const leadsDataKey = `${group.planId}_${group.investmentRangeLabel}`;
          const availableLeads = leadsDropdownData[leadsDataKey] || [];
          const minLeads = availableLeads.length > 0 ? Math.min(...availableLeads) : 1;
          const divisor = minLeads > 0 ? minLeads : 1;
          const selectedLeads = updatedItems[0]?.selectedLeads || 0;
          const totalAmount = (group.pricePerState / divisor) * totalUniqueStates * selectedLeads;
          const totalLeads = selectedLeads * totalUniqueStates;
          return { ...group, items: updatedItems, uniqueStates, totalStates: totalUniqueStates, amount: totalAmount, totalLeads };
        });
      });
    }
  }, [statesByInvestmentRange, getRangeKey, leadsDropdownData]);

  useEffect(() => {
    if (data && data.InvestmetPackages && Array.isArray(data.InvestmetPackages)) {
      const initialStatesByRange = {};
      data.InvestmetPackages.forEach((planPackage) => {
        const planId = planPackage.planUniqueId || planPackage.planId;
        if (planPackage.InvestmetPackages && Array.isArray(planPackage.InvestmetPackages)) {
          planPackage.InvestmetPackages.forEach((pkg) => {
            const investmentRangeLabel = pkg.InvestmentRangeLabel || pkg.PackageName;
            const investmentRange = pkg.InvestmentRange;
            const states = pkg.States || [];
            const key = `${planId}__${investmentRangeLabel}__${investmentRange}`;
            if (states && states.length > 0 && states[0] !== "ALL STATES") {
              initialStatesByRange[key] = states;
            }
          });
        }
      });
      if (Object.keys(initialStatesByRange).length > 0) {
        setStatesByInvestmentRange((prev) => {
          const merged = { ...prev, ...initialStatesByRange };
          localStorage.setItem("investmentRangeStates", JSON.stringify(merged));
          return merged;
        });
      }
    }
  }, [data]);

  const handleOpenStateModal = useCallback(
    (investmentRangeLabel, range, planId = null) => {
      const key = getRangeKey(investmentRangeLabel, range, planId);
      setCurrentEditingRange(key);
      const otherRangeStates = new Set();
      const editingRangeValue = key.split("__")[2];
      let purchasedStatesForThisRange = [];

      if (data && data.packages && Array.isArray(data.packages)) {
        data.packages.forEach((packageItem) => {
          const packageType = (packageItem.packagesType || packageItem.PackagesType || "").toUpperCase();
          if (packageType !== "LEAD") return;
          const investPackages = packageItem.investmetPackages || packageItem.InvestmetPackages || packageItem.InvestmentPackages || packageItem.packages || [];
          investPackages.forEach((investPackage) => {
            const investmentRanges = investPackage.investmentranges || [];
            investmentRanges.forEach((r) => {
              const existingRange = r.selectedPlanInvestmetrange || "";
              if (existingRange === editingRangeValue) {
                const stateAndDistrict = investPackage.selectedPlanStateAndDistrict || investPackage.SelectedPlanStateAndDistrict || [];
                stateAndDistrict.forEach((entry) => { if (entry.state) purchasedStatesForThisRange.push(entry.state); });
                const rangeStates = r.selectedPlanStateAndDistrict || [];
                rangeStates.forEach((entry) => { if (entry.state) purchasedStatesForThisRange.push(entry.state); });
              } else {
                const stateAndDistrict = investPackage.selectedPlanStateAndDistrict || investPackage.SelectedPlanStateAndDistrict || [];
                stateAndDistrict.forEach((entry) => { if (entry.state) otherRangeStates.add(entry.state); });
                const rangeStates = r.selectedPlanStateAndDistrict || [];
                rangeStates.forEach((entry) => { if (entry.state) otherRangeStates.add(entry.state); });
              }
            });
          });
        });
      }

      purchasedStatesForThisRange = [...new Set(purchasedStatesForThisRange)];
      paymentSummary.forEach((group) => {
        if (group.isListingPlan) return;
        group.items.forEach((item) => {
          const itemKey = getRangeKey(item.investmentRangeLabel, item.range, group.planId);
          if (itemKey === key) return;
          if (item.range === editingRangeValue) item.states.forEach((state) => otherRangeStates.add(state));
        });
      });
      Object.entries(statesByInvestmentRange).forEach(([rangeKey, states]) => {
        if (rangeKey === key) return;
        const keyPlanId = rangeKey.split("__")[0];
        if (keyPlanId !== planId) return;
        states.forEach((state) => otherRangeStates.add(state));
      });

      const committedItem = paymentSummary
        .flatMap((g) => g.items)
        .find((item) => {
          const itemKey = getRangeKey(item.investmentRangeLabel, item.range, planId);
          return itemKey === key;
        });
      const committedStates = committedItem?.states;

      const savedStates = statesByInvestmentRange[key] || (() => {
        const matchingKey = Object.keys(statesByInvestmentRange).find((k) => {
          const parts = k.split("__");
          const savedRange = parts[parts.length - 1];
          const savedLabel = parts[parts.length - 2];
          return savedRange === range && savedLabel === investmentRangeLabel;
        });
        return matchingKey ? statesByInvestmentRange[matchingKey] : null;
      })();

      let statesToPreselect;
      if (finalToken) {
        statesToPreselect = committedStates || savedStates || allStates;
      } else {
        statesToPreselect = committedStates || savedStates || (detectedState ? [detectedState] : []);
      }

      if (!statesToPreselect || statesToPreselect.length === 0) {
        if (allStates.length > 0) {
          statesToPreselect = allStates.filter((s) => !otherRangeStates.has(s));
        } else {
          statesToPreselect = [];
        }
      }

      setSelectedStates(statesToPreselect && statesToPreselect.length > 0 ? new Set(statesToPreselect) : new Set());
      setOpenStateModal(true);
    },
    [getRangeKey, paymentSummary, statesByInvestmentRange, finalToken, detectedState, allStates, data],
  );

  const handleShowStates = useCallback((event, statesList) => {
    setTooltipStates(statesList);
    setTooltipAnchorEl(event.currentTarget);
    setOpenStatesTooltip(true);
  }, []);

  const handleCloseStateModal = useCallback(() => { setOpenStateModal(false); }, []);

  const getAlreadySelectedStatesInOtherRanges = useCallback(() => {
    const selectedInOtherRanges = new Set();
    if (!currentEditingRange) return selectedInOtherRanges;
    const currentRangeValue = currentEditingRange.split("__")[2];

    if (data && data.packages && Array.isArray(data.packages)) {
      data.packages.forEach((packageItem) => {
        const packageType = (packageItem.packagesType || packageItem.PackagesType || "").toUpperCase();
        if (packageType !== "LEAD") return;
        const investPackages = packageItem.investmetPackages || packageItem.InvestmetPackages || packageItem.InvestmentPackages || packageItem.packages || [];
        investPackages.forEach((investPackage) => {
          const investmentRanges = investPackage.investmentranges || [];
          investmentRanges.forEach((range) => {
            const existingRange = range.selectedPlanInvestmetrange || "";
            if (existingRange !== currentRangeValue) return;
            const stateAndDistrict = investPackage.selectedPlanStateAndDistrict || investPackage.SelectedPlanStateAndDistrict || [];
            stateAndDistrict.forEach((entry) => { if (entry.state) selectedInOtherRanges.add(entry.state); });
            const rangeStates = range.selectedPlanStateAndDistrict || [];
            rangeStates.forEach((entry) => { if (entry.state) selectedInOtherRanges.add(entry.state); });
          });
        });
      });
    }

    paymentSummary.forEach((group) => {
      if (group.isListingPlan) return;
      group.items.forEach((item) => {
        const itemKey = getRangeKey(item.investmentRangeLabel, item.range, group.planId);
        if (itemKey === currentEditingRange) return;
        if (item.range === currentRangeValue) item.states.forEach((state) => selectedInOtherRanges.add(state));
      });
    });

    return selectedInOtherRanges;
  }, [currentEditingRange, data, paymentSummary, getRangeKey]);

  const handleSaveStates = useCallback(() => {
    const blocked = getAlreadySelectedStatesInOtherRanges();
    const selectedArray = Array.from(selectedStates).filter((state) => !blocked.has(state));

    if (selectedArray.length === 0) {
      openSnack("Please select at least one state before saving", "warning");
      return;
    }

    const allAvailableStates = allStates.length > 0 ? allStates : [];
    const isAllStatesSelected =
      !!finalToken &&
      allAvailableStates.length > 0 &&
      selectedArray.length === allAvailableStates.length &&
      selectedArray.every((state) => allAvailableStates.includes(state));

    if (isAllStatesSelected) {
      const updated = { ...statesByInvestmentRange };
      delete updated[currentEditingRange];
      setStatesByInvestmentRange(updated);
      statesByInvestmentRangeRef.current = updated;
      localStorage.setItem("investmentRangeStates", JSON.stringify(updated));
    } else {
      const updated = { ...statesByInvestmentRange, [currentEditingRange]: selectedArray };
      setStatesByInvestmentRange(updated);
      statesByInvestmentRangeRef.current = updated;
      localStorage.setItem("investmentRangeStates", JSON.stringify(updated));
    }

    setPaymentSummary((prev) =>
      prev.map((group) => {
        let groupHasRange = false;
        const updatedItems = group.items.map((item) => {
          const itemKey = getRangeKey(item.investmentRangeLabel, item.range, group.planId);
          if (itemKey !== currentEditingRange) return item;
          groupHasRange = true;
          const statesToUse = isAllStatesSelected ? allAvailableStates : selectedArray;
          const leadsDataKey = `${group.planId}_${group.investmentRangeLabel}`;
          const availableLeads = leadsDropdownData[leadsDataKey] || [];
          const minLeads = availableLeads.length > 0 ? Math.min(...availableLeads) : 1;
          const divisor = minLeads > 0 ? minLeads : 1;
          const itemAmount = (group.pricePerState / divisor) * statesToUse.length * (item.selectedLeads || 0);
          return { ...item, states: [...statesToUse], stateCount: statesToUse.length, totalLeads: (item.selectedLeads || 0) * statesToUse.length, totalAmount: itemAmount };
        });

        if (!groupHasRange) return group;
        const allStatesSet = new Set();
        updatedItems.forEach((item) => { (item.states || []).forEach((state) => allStatesSet.add(state)); });
        const uniqueStates = Array.from(allStatesSet);
        const totalUniqueStates = uniqueStates.length;
        const leadsDataKey = `${group.planId}_${group.investmentRangeLabel}`;
        const availableLeads = leadsDropdownData[leadsDataKey] || [];
        const minLeads = availableLeads.length > 0 ? Math.min(...availableLeads) : 1;
        const divisor = minLeads > 0 ? minLeads : 1;
        const totalAmount = (group.pricePerState / divisor) * totalUniqueStates * (updatedItems[0]?.selectedLeads || 0);
        const totalLeads = (updatedItems[0]?.selectedLeads || 0) * totalUniqueStates;
        return { ...group, items: updatedItems, uniqueStates, totalStates: totalUniqueStates, amount: totalAmount, totalLeads };
      }),
    );

    openSnack(
      isAllStatesSelected ? "Reset to all states" : `Saved ${selectedArray.length} state${selectedArray.length > 1 ? "s" : ""}`,
      isAllStatesSelected ? "info" : "success",
    );
    handleCloseStateModal();
  }, [selectedStates, statesByInvestmentRange, currentEditingRange, getRangeKey, leadsDropdownData, openSnack, handleCloseStateModal, getAlreadySelectedStatesInOtherRanges, allStates]);

  const fetchBrandDetails = async (uuid, accessToken) => {
    try {
      setBrandLoading(true);
      setBrandError(null);
      const response = await fetch(`${API_URL}/api/v1/brandlisting/getBrandById/${uuid}`, {
        headers: { "Content-Type": "application/json", ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
      });
      const json = await response.json();
      if (!response.ok || json.success === false) throw new Error(json.message || "Failed to fetch brand details");
      const brandData = Array.isArray(json.data) ? json.data[0] : json.data;
      if (brandData.brandOwnerId) {
        localStorage.setItem("brandOwnerId", brandData.brandOwnerId);
        setBrandOwnerId(brandData.brandOwnerId);
      } else if (brandData._id) {
        localStorage.setItem("brandOwnerId", brandData._id);
        setBrandOwnerId(brandData._id);
      }
      const ficoData = Array.isArray(brandData?.franchiseDetails?.fico) ? brandData.franchiseDetails.fico : Array.isArray(brandData?.fico) ? brandData.fico : Array.isArray(brandData?.brandDetails?.fico) ? brandData.brandDetails.fico : [];
      const ficoRanges = ficoData.map((item) => item?.investmentRange).filter(Boolean);
      setFicoInvestmentRanges(ficoRanges);
      if (typeof window !== "undefined") localStorage.setItem("ficoInvestmentRanges", JSON.stringify(ficoRanges));
      const expansionLocations = brandData?.expansionlocationdata?.expansionLocations?.domestic?.locations || [];
      const extractedStates = expansionLocations.map((location) => {
        if (typeof location === "string") return location.trim();
        if (typeof location?.state === "string") return location.state.trim();
        if (typeof location?.state === "object" && location?.state !== null) return (location.state.name || location.state.label || location.state.value || location.state.stateName || "").trim();
        return (location?.stateName || location?.State || location?.state_name || location?.address?.state || location?.location?.state || "").trim();
      }).filter(Boolean);
      const uniqueStatesList = [...new Map(extractedStates.map((state) => [state.toLowerCase(), state])).values()];
      if (uniqueStatesList.length > 0) setAllStates(uniqueStatesList);
      else setAllStates([]);
    } catch (err) {
      console.error("Brand fetch error:", err);
      setBrandError(err.message);
    } finally {
      setBrandLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/v1/admin/plans/getAllPlans`);
      const json = await response.json();
      if (json.success && Array.isArray(json.data)) {
        setPlans(json.data);
        const leadsData = {};
        json.data.forEach((plan) => {
          plan.packages?.forEach((pkg) => {
            const key = `${plan._id}_${pkg.investmentRangeLabel}`;
            leadsData[key] = pkg.totalLeads || [];
          });
        });
        setLeadsDropdownData(leadsData);
        const filtered = json.data.filter((plan) => plan.packages?.length > 1);
        const launchPadPlan = filtered.find((plan) => plan.planName?.toLowerCase() === "launch pad program");
        if (launchPadPlan) {
          const investmentRangeLabels = new Set();
          filtered.forEach((plan) => { plan.packages?.forEach((pkg) => { investmentRangeLabels.add(pkg.investmentRangeLabel); }); });
          const defaultPlans = {};
          investmentRangeLabels.forEach((label) => { defaultPlans[label] = launchPadPlan._id; });
          setSelectedPlans(defaultPlans);
        }
      } else {
        throw new Error("Invalid data format");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => plan.packages?.length > 1 && plan.planName?.toLowerCase() !== "free");
  }, [plans]);

  const normalizeRange = useCallback((value) => {
    return String(value || "").toLowerCase().replace(/₹/g, "rs").replace(/\brupees\b/g, "rs").replace(/\brs\.?\b/g, "").replace(/\blakhs\b/g, "lakh").replace(/\bcrores\b/g, "crore").replace(/\bto\b/g, "-").replace(/[^a-z0-9]/g, "").trim();
  }, []);

  const isFicoInvestmentRange = useCallback((range) => {
    const currentRange = normalizeRange(range);
    return ficoInvestmentRanges.some((ficoRange) => normalizeRange(ficoRange) === currentRange);
  }, [ficoInvestmentRanges, normalizeRange]);

  const getUniqueStatesAcrossRanges = useCallback((items) => {
    const allStatesSet = new Set();
    items.forEach((item) => { item.states.forEach((state) => allStatesSet.add(state)); });
    return Array.from(allStatesSet);
  }, []);

  const getBrandName = useCallback(() => data?.brandDetails?.brandName || data?.brandName || "", [data]);
  const getCategory = useCallback(() => data?.brandDetails?.category || data?.category || "", [data]);
  const getIndustry = useCallback(() => data?.brandDetails?.industry || data?.industry || "", [data]);

  const handleAddSingleToPayment = useCallback(
    (item, selectedPlan, selectedPkg) => {
      const { id, investmentRangeLabel, range } = item;
      const pricePerState = Number(selectedPkg?.amount || 0);
      const leadSelectionKey = `plan-${selectedPlan._id}-${investmentRangeLabel}`;
      const leadsDataKey = `${selectedPlan._id}_${investmentRangeLabel}`;
      const availableLeads = leadsDropdownData[leadsDataKey] || [];
      let selectedLeads = item.selectedLeads || selectedLeadsPerRange[leadSelectionKey] || 0;
      if ((!selectedLeads || selectedLeads <= 0) && availableLeads.length > 0) selectedLeads = availableLeads[0];
      selectedLeads = Number(selectedLeads);

      const key = getRangeKey(investmentRangeLabel, range, selectedPlan._id);
      let states = statesByInvestmentRangeRef.current[key];

      if (!states || states.length === 0) {
        const matchingKey = Object.keys(statesByInvestmentRangeRef.current).find((k) => {
          const parts = k.split("__");
          const savedRange = parts[parts.length - 1];
          const savedLabel = parts[parts.length - 2];
          return savedRange === range && savedLabel === investmentRangeLabel;
        });
        if (matchingKey) states = statesByInvestmentRangeRef.current[matchingKey];
      }

      if (!states || states.length === 0) {
        if (!finalToken && detectedState) states = [detectedState];
        else if (finalToken) states = allStates;
        else states = [];
      }

      if (states.length === 0) { openSnack("Please select at least one state", "warning"); return; }

      const minLeads = availableLeads.length > 0 ? Math.min(...availableLeads) : 1;
      const divisor = minLeads > 0 ? minLeads : 1;
      const totalLeads = selectedLeads * states.length;
      const totalAmount = (pricePerState / divisor) * states.length * selectedLeads;

      const newItem = { id, investmentRangeLabel, range, stateCount: states.length, states, selectedLeads, totalLeads, totalAmount };
      const groupKey = `${selectedPlan._id}__${investmentRangeLabel}`;

      setPaymentSummary((prev) => {
        const existingGroup = prev.find((g) => g.groupKey === groupKey);
        let newSummary = [];

        if (existingGroup) {
          const existingItemIndex = existingGroup.items.findIndex((ex) => ex.id === newItem.id);
          let updatedItems = [];

          if (existingItemIndex !== -1) {
            updatedItems = existingGroup.items.map((it) => {
              const itemAmount = (pricePerState / divisor) * it.stateCount * selectedLeads;
              return { ...it, selectedLeads, totalLeads: selectedLeads * it.stateCount, totalAmount: itemAmount, ...(it.id === newItem.id ? { states: newItem.states, stateCount: newItem.stateCount } : {}) };
            });
          } else {
            updatedItems = [...existingGroup.items, newItem].map((it) => {
              const itemAmount = (pricePerState / divisor) * it.stateCount * selectedLeads;
              return { ...it, selectedLeads, totalLeads: selectedLeads * it.stateCount, totalAmount: itemAmount };
            });
          }

          const uniqueStates = getUniqueStatesAcrossRanges(updatedItems);
          const totalUniqueStates = uniqueStates.length;
          const newAmount = (pricePerState / divisor) * totalUniqueStates * selectedLeads;
          newSummary = prev.map((g) =>
            g.groupKey === groupKey
              ? { ...g, items: updatedItems, uniqueStates, totalStates: totalUniqueStates, amount: newAmount, totalLeads: totalUniqueStates * selectedLeads }
              : g,
          );
        } else {
          const uniqueStates = getUniqueStatesAcrossRanges([newItem]);
          const totalUniqueStates = uniqueStates.length;
          const dynamicAmount = (pricePerState / divisor) * totalUniqueStates * selectedLeads;
          newSummary = [
            ...prev,
            {
              groupKey, planId: selectedPlan._id, packagesType: selectedPlan.packageType,
              planName: selectedPlan.planName, planUniqueId: selectedPlan.planUniqueId,
              planPackageId: selectedPkg._id, investmentRangeLabel, validityDays: selectedPkg?.validityDays,
              pricePerState, uniqueStates, totalStates: totalUniqueStates,
              amount: dynamicAmount, totalLeads: totalUniqueStates * selectedLeads, selectedLeads, items: [newItem],
            },
          ];
        }

        setMovedGroupKeys((prevKeys) => {
          if (!prevKeys.includes(groupKey)) return [...prevKeys, groupKey];
          return prevKeys;
        });

        openSnack(`Added ${range} with ${selectedLeads} leads to cart`, "success");
        setTimeout(() => scrollToPaymentSummary(), 100);
        return newSummary;
      });

      setSelected((prev) => ({ ...prev, [id]: true }));
      setCheckedItems((prev) => ({ ...prev, [id]: true }));
    },
    [getRangeKey, statesByInvestmentRange, finalToken, detectedState, allStates, getUniqueStatesAcrossRanges, openSnack, leadsDropdownData, selectedLeadsPerRange, scrollToPaymentSummary],
  );

  const handleRemoveSingleFromPayment = useCallback(
    (item) => {
      const { id } = item;
      setPaymentSummary((prev) => {
        const updated = prev.map((g) => {
          const hasItem = g.items.some((it) => it.id === id);
          if (!hasItem) return g;
          const updatedItems = g.items.filter((it) => it.id !== id);
          if (updatedItems.length === 0) {
            setMovedGroupKeys((keys) => keys.filter((k) => k !== g.groupKey));
            return null;
          }
          const newUniqueStates = getUniqueStatesAcrossRanges(updatedItems);
          const newTotalUniqueStates = newUniqueStates.length;
          const leadsDataKey = `${g.planId}_${g.investmentRangeLabel}`;
          const availableLeads = leadsDropdownData[leadsDataKey] || [];
          const minLeads = availableLeads.length > 0 ? Math.min(...availableLeads) : 1;
          const divisor = minLeads > 0 ? minLeads : 1;
          const firstItem = updatedItems[0];
          const selectedLeads = firstItem ? firstItem.selectedLeads : 0;
          const newAmount = (g.pricePerState / divisor) * newTotalUniqueStates * selectedLeads;
          return { ...g, items: updatedItems, uniqueStates: newUniqueStates, totalStates: newTotalUniqueStates, amount: newAmount, totalLeads: newTotalUniqueStates * selectedLeads };
        }).filter((g) => g !== null);

        if (updated.length === 0 && typeof window !== "undefined") {
          localStorage.removeItem("paymentSummaryDraft");
          localStorage.removeItem("movedGroupKeys");
        }
        return updated;
      });
      openSnack("Investment range removed from payment", "info");
    },
    [getUniqueStatesAcrossRanges, openSnack, leadsDropdownData],
  );

  useEffect(() => {
    if (filteredPlans.length > 0 && selectedGroup === null) setSelectedGroup(filteredPlans[0]._id);
  }, [filteredPlans, selectedGroup]);

  const transformPaymentToAPIFormat = useCallback((paymentGroups) => {
    const plansMap = new Map();
    paymentGroups.forEach((group) => {
      if (!plansMap.has(group.planId)) {
        plansMap.set(group.planId, { packagesType: group.packagesType, packagesName: group.planName, planUniqueId: group.planId, planPackageId: group.planPackageId, InvestmetPackages: [] });
      }
      const plan = plansMap.get(group.planId);
      group.items.forEach((item) => {
        if (item.isListingPlan) {
          plan.InvestmetPackages.push({ PackageName: item.investmentRangeLabel, Amount: group.pricePerState, Validity: group.validityDays, TotalLeads: "-", States: item.states || ["ALL STATES"], InvestmentRange: item.range, InvestmentRangeLabel: item.investmentRangeLabel, LeadsPerState: "-" });
        } else {
          plan.InvestmetPackages.push({ PackageName: item.investmentRangeLabel, Amount: group.pricePerState, Validity: group.validityDays, TotalLeads: item.selectedLeads * (item.stateCount || 0), States: item.states || [], InvestmentRange: item.range, InvestmentRangeLabel: item.investmentRangeLabel, LeadsPerState: item.selectedLeads });
        }
      });
    });
    return Array.from(plansMap.values());
  }, []);

  const handleProceedToPayment = useCallback(() => {
    const movedGroups = paymentSummary.filter((g) => movedGroupKeys.includes(g.groupKey));
    if (movedGroups.length === 0) { openSnack("Please move at least one plan to payment", "warning"); return; }
    if (!finalToken) {
      localStorage.setItem("paymentSummaryDraft", JSON.stringify(movedGroups));
      openSnack("Please login to continue to payment", "warning");
      setShowLogin(true);
      return;
    }
    const packagesData = transformPaymentToAPIFormat(movedGroups);
    localStorage.setItem("pendingPackages", JSON.stringify({ packages: packagesData, timestamp: Date.now(), totalAmount: movedGroups.reduce((acc, g) => acc + (g.amount || 0), 0) }));
    localStorage.setItem("paymentSummary", JSON.stringify(movedGroups));
    router.push("/payment");
  }, [finalToken, openSnack, paymentSummary, movedGroupKeys, router, transformPaymentToAPIFormat]);

  const getStateCountForRange = useCallback(
    (investmentRangeLabel, range, planId = null) => {
      const key = getRangeKey(investmentRangeLabel, range, planId);
      if (Object.prototype.hasOwnProperty.call(statesByInvestmentRange, key)) return statesByInvestmentRange[key].length;
      const matchingKey = Object.keys(statesByInvestmentRange).find((k) => {
        const parts = k.split("__");
        return parts[parts.length - 1] === range && parts[parts.length - 2] === investmentRangeLabel;
      });
      if (matchingKey) return statesByInvestmentRange[matchingKey].length;
      if (!finalToken && detectedState) return 1;
      return allStates.length;
    },
    [getRangeKey, statesByInvestmentRange, finalToken, detectedState, allStates],
  );

  const handleAddInvestmentRange = useCallback(
    (range, investmentRangeLabel) => {
      if (!finalToken) { setShowLogin(true); openSnack("Please log in to add investment ranges", "warning"); return; }
      onAddInvestmentRange(range, investmentRangeLabel);
    },
    [onAddInvestmentRange, finalToken, openSnack],
  );

  const handleLeadsChange = useCallback(
    (planGroupKey, newLeadsValue) => {
      setSelectedLeadsPerRange((prev) => ({ ...prev, [planGroupKey]: newLeadsValue }));
      const withoutPrefix = planGroupKey.replace("plan-", "");
      const parts = withoutPrefix.split("-");
      const actualPlanId = parts[0];
      const investmentRangeLabel = parts[1];
      const specificRange = parts.slice(2).join("-");

      setPaymentSummary((prev) =>
        prev.map((group) => {
          if (group.isListingPlan) return group;
          if (group.planId !== actualPlanId) return group;
          const hasRange = group.items.some((item) => item.range === specificRange);
          if (!hasRange) return group;
          if (movedGroupKeys.includes(group.groupKey)) return group;
          const leadsDataKey = `${group.planId}_${group.investmentRangeLabel}`;
          const availableLeads = leadsDropdownData[leadsDataKey] || [];
          const minLeads = availableLeads.length > 0 ? Math.min(...availableLeads) : 1;
          const divisor = minLeads > 0 ? minLeads : 1;
          const updatedItems = group.items.map((item) => {
            if (item.range !== specificRange) return item;
            return { ...item, selectedLeads: newLeadsValue, totalLeads: newLeadsValue * item.stateCount, totalAmount: (group.pricePerState / divisor) * item.stateCount * newLeadsValue };
          });
          const allStatesSet = new Set();
          updatedItems.forEach((item) => { (item.states || []).forEach((state) => allStatesSet.add(state)); });
          const uniqueStates = Array.from(allStatesSet);
          const totalUniqueStates = uniqueStates.length;
          const totalAmount = (group.pricePerState / divisor) * totalUniqueStates * newLeadsValue;
          const totalLeads = newLeadsValue * totalUniqueStates;
          return { ...group, items: updatedItems, uniqueStates, totalStates: totalUniqueStates, amount: totalAmount, totalLeads };
        }),
      );
      openSnack(`Leads updated to ${newLeadsValue}`, "info");
    },
    [leadsDropdownData, movedGroupKeys, openSnack],
  );

  useEffect(() => {
    if (typeof window !== "undefined" && paymentSummary.length > 0) {
      localStorage.setItem("paymentSummaryDraft", JSON.stringify(paymentSummary));
    } else if (typeof window !== "undefined" && paymentSummary.length === 0) {
      localStorage.removeItem("paymentSummaryDraft");
    }
  }, [paymentSummary]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (movedGroupKeys.length > 0) localStorage.setItem("movedGroupKeys", JSON.stringify(movedGroupKeys));
      else localStorage.removeItem("movedGroupKeys");
    }
  }, [movedGroupKeys]);

  const getRowBackgroundColor = useCallback(
    (investmentRangeLabel, isInPayment, idx) => {
      const allGroups = [];
      if (selectedGroup) {
        const selectedPlanData = filteredPlans.find((p) => p._id === selectedGroup);
        if (selectedPlanData) {
          selectedPlanData.packages?.forEach((pkg) => {
            if (pkg.investmentRangeLabel && !allGroups.includes(pkg.investmentRangeLabel)) allGroups.push(pkg.investmentRangeLabel);
          });
        }
      }
      return "#fff0c5";
    },
    [selectedGroup, filteredPlans],
  );

  const handleRemoveListingPlan = useCallback(
    (planId) => {
      const groupKey = `listing-${planId}`;
      setPaymentSummary((prev) => {
        const newSummary = prev.filter((g) => g.groupKey !== groupKey);
        if (newSummary.length === 0 && typeof window !== "undefined") {
          localStorage.removeItem("paymentSummaryDraft");
          localStorage.removeItem("movedGroupKeys");
        }
        return newSummary;
      });
      setMovedGroupKeys((prev) => prev.filter((key) => key !== groupKey));
      setSelected((prev) => { const copy = { ...prev }; delete copy[groupKey]; return copy; });
      openSnack("Listing plan removed from cart", "info");
    },
    [openSnack],
  );

  const handleSelectAll = useCallback(() => {
    const states = getStatesToDisplay();
    const blocked = getAlreadySelectedStatesInOtherRanges();
    const selectableStates = states.filter((state) => !blocked.has(state));
    if (selectableStates.length > 0) { setSelectedStates(new Set(selectableStates)); openSnack(`Selected ${selectableStates.length} states`, "success"); }
    else openSnack("No states available to select", "warning");
  }, [getStatesToDisplay, getAlreadySelectedStatesInOtherRanges, openSnack]);

  const handleClearAll = useCallback(() => {
    const blocked = getAlreadySelectedStatesInOtherRanges();
    setSelectedStates((prev) => { const next = new Set(); prev.forEach((state) => { if (blocked.has(state)) next.add(state); }); return next; });
    openSnack("Cleared all selectable states", "info");
  }, [getAlreadySelectedStatesInOtherRanges, openSnack]);

  const handleStateCheckboxChange = useCallback(
    (state) => {
      const blocked = getAlreadySelectedStatesInOtherRanges();
      if (blocked.has(state)) { openSnack(`"${state}" is already used in another investment range. Please select a different state.`, "warning"); return; }
      setSelectedStates((prev) => { const next = new Set(prev); if (next.has(state)) next.delete(state); else next.add(state); return next; });
    },
    [getAlreadySelectedStatesInOtherRanges, openSnack],
  );

  const renderStatesByRegion = () => {
    const statesToDisplay = getStatesToDisplay();
    const alreadySelectedStates = getAlreadySelectedStatesInOtherRanges();

    return Object.entries(INDIA_STATES).map(([region, states]) => {
      const availableStates = states.filter((state) => statesToDisplay.includes(state));
      if (availableStates.length === 0) return null;
      const selectedCount = availableStates.filter((state) => selectedStates.has(state)).length;
      const availableToSelectCount = availableStates.filter((state) => !alreadySelectedStates.has(state)).length;

      return (
        <Accordion
          key={region}
          expanded={expandedRegion === region}
          onChange={(event, isExpanded) => { setExpandedRegion(isExpanded ? region : null); }}
          elevation={0}
          sx={{ border: `1px solid ${COLORS.border}`, borderRadius: "8px !important", mb: 0.6, "&:before": { display: "none" }, "&.Mui-expanded": { margin: "0 0 12px 0" } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: COLORS.primary }} />}
            sx={{
              backgroundColor: COLORS.grey[50], borderRadius: "8px",
              "&.Mui-expanded": { borderRadius: "8px 8px 0 0" },
              "& .MuiAccordionSummary-content": { alignItems: "center", justifyContent: "space-between" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontSize: TEXT_SIZES.medium, fontWeight: 700, color: COLORS.black }}>{region}</Typography>
              <Chip
                label={`${selectedCount}/${availableToSelectCount} Selected`}
                size="small"
                sx={{ height: 15, fontSize: "0.7rem", backgroundColor: selectedCount === availableToSelectCount ? COLORS.secondary : COLORS.grey[400], color: COLORS.white, fontWeight: 600 }}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: { xs: 0, sm: 2 } }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Box
                component="span"
                onClick={(e) => {
                  e.stopPropagation();
                  const newSet = new Set(selectedStates);
                  const selectableStates = availableStates.filter((state) => !alreadySelectedStates.has(state));
                  const allSelected = selectableStates.every((state) => selectedStates.has(state));
                  if (allSelected) { selectableStates.forEach((state) => newSet.delete(state)); openSnack(`Deselected all selectable states in ${region}`, "info"); }
                  else { selectableStates.forEach((state) => newSet.add(state)); openSnack(`Selected ${selectableStates.length} states in ${region}`, "success"); }
                  setSelectedStates(newSet);
                }}
                sx={{ fontSize: "0.7rem", textTransform: "none", color: COLORS.primary, cursor: "pointer", display: "inline-flex", alignItems: "center", borderRadius: "4px", "&:hover": { backgroundColor: COLORS.lightOrange } }}
              >
                Select All Available ({availableToSelectCount})
              </Box>
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1 }}>
              {availableStates.map((state) => {
                const isDisabled = alreadySelectedStates.has(state);
                const isChecked = selectedStates.has(state);
                return (
                  <FormControlLabel
                    key={state}
                    control={
                      <Checkbox
                        checked={isChecked}
                        onChange={() => {
                          if (!isDisabled) handleStateCheckboxChange(state);
                          else openSnack("This state is already used in investment range and cannot be selected again", "warning");
                        }}
                        disabled={isDisabled}
                        sx={{ color: COLORS.primary, "&.Mui-checked": { color: COLORS.secondary }, "&.Mui-disabled": { color: COLORS.grey[400] } }}
                      />
                    }
                    label={
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography sx={{ fontSize: TEXT_SIZES.medium, color: isDisabled ? COLORS.grey[500] : COLORS.black, fontWeight: isChecked ? 600 : 400, textDecoration: isDisabled ? "line-through" : "none" }}>
                          {state}
                        </Typography>
                        {isDisabled && (
                          <Typography sx={{ fontSize: "0.65rem", color: COLORS.grey[500], lineHeight: 1.2, mt: 0.2 }}>
                            This state is already used in investment range and cannot be selected again
                          </Typography>
                        )}
                      </Box>
                    }
                    sx={{
                      display: "flex", flexDirection: "row", alignItems: "center", margin: 0, py: 0.5, px: 1, borderRadius: 1.5, transition: "all 0.2s ease",
                      backgroundColor: isChecked ? COLORS.lightGreen : "transparent", width: "100%", opacity: isDisabled ? 0.6 : 1,
                      "&:hover": { backgroundColor: !isDisabled && (isChecked ? COLORS.lightGreen : COLORS.lightOrange) },
                      "& .MuiFormControlLabel-label": { width: "calc(100% - 35px)", overflow: "hidden" },
                    }}
                  />
                );
              })}
            </Box>
          </AccordionDetails>
        </Accordion>
      );
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress sx={{ color: COLORS.primary }} size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ fontSize: TEXT_SIZES.medium, borderRadius: 2, border: `1px solid ${COLORS.primary}` }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", minHeight: "100vh" }}>
      {/* Brand Header */}
      {(data?.brandDetails?.brandName || data?.brandName || getBrandName() || data?.brandDetails?.category || data?.category || data?.brandDetails?.industry || data?.industry) && (
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: { xs: "center", md: "flex-end" }, alignItems: { xs: "center", md: "center" }, gap: { xs: 1, md: 2 }, border: { xs: `4px solid ${COLORS.secondary}`, md: "none" }, borderRadius: 2, mb: 3, pb: 2, px: { xs: 0, md: 4 }, flexWrap: "wrap" }}>
          {(data?.brandDetails?.brandName || data?.brandName || getBrandName()) && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ fontSize: { xs: TEXT_SIZES.large, sm: TEXT_SIZES.medium }, color: COLORS.black, display: { xs: "none", md: "block" } }}>Brand Name:</Typography>
              <Typography sx={{ fontSize: TEXT_SIZES.xl, fontWeight: 700, color: COLORS.primary, textAlign: "center" }}>
                {data?.brandDetails?.brandName || data?.brandName || getBrandName()}
              </Typography>
            </Box>
          )}
          {(data?.brandDetails?.industry || data?.industry) && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontSize: { xs: TEXT_SIZES.large, sm: TEXT_SIZES.medium }, color: COLORS.black, display: { xs: "none", md: "block" } }}>Industry:</Typography>
              <Typography sx={{ fontSize: TEXT_SIZES.xl, fontWeight: 700, color: COLORS.black, textAlign: "center" }}>
                {data?.brandDetails?.industry || data?.industry}
              </Typography>
            </Box>
          )}
          {(data?.brandDetails?.category || data?.category) && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontSize: { xs: TEXT_SIZES.large, sm: TEXT_SIZES.medium }, color: COLORS.black, display: { xs: "none", md: "block" } }}>Category:</Typography>
              <Typography sx={{ fontSize: TEXT_SIZES.medium, fontWeight: 700, color: COLORS.black, textAlign: "center" }}>
                {data?.brandDetails?.category || data?.category}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Existing Package Display */}
      <ExistingPackageDisplay
        data={data}
        error={errors}
        loading={loadings}
        isLoggedIn={!!finalToken}
        upgradeSectionRef={upgradeSectionRef}
        allPlans={plans}
        leadsDropdownData={leadsDropdownData}
        INDIA_STATES={INDIA_STATES}
        ALL_INDIA_STATES={ALL_INDIA_STATES}
      sectionExpanded={openSection.includes("active")}
        onSectionChange={handleSectionChange("active")}
        allStates={allStates}
        finalToken={finalToken}
        ficoInvestmentRanges={ficoInvestmentRanges}
        onUpgradeModeChange={(isUpgrade, planId) => { setIsUpgradeMode(isUpgrade); setUpgradePlanId(planId); }}
onAddToPaymentSummary={(upgradeData) => {
  console.log("📦 Upgrade Data received:", upgradeData); // Debug log
  
  const selectedItems = [];
  const checkedRanges = upgradeData.checkedRanges || [];
  
  checkedRanges.forEach((range) => {
    // ✅ Get states from statesByRange
    const states = upgradeData.statesByRange?.[range] || [];
    console.log(`📍 Range: ${range}, States:`, states); // Debug log
    
    if (states && states.length > 0) {
      const selectedLeads = upgradeData.selectedLeads || upgradeData.leads || 0;
      const minLead = upgradeData.minLead || 1;
      const pricePerState = upgradeData.pricePerState || 0;
      const stateCount = states.length;
      const totalLeads = selectedLeads * stateCount;
      const totalAmount = (pricePerState / minLead) * stateCount * selectedLeads;
      
      selectedItems.push({
        id: `${upgradeData.planId}-${upgradeData.investmentRangeLabel}-${range}`,
        investmentRangeLabel: upgradeData.investmentRangeLabel || "—",
        range: range,
        states: states,  // ✅ IMPORTANT: Store states array
        stateCount: stateCount,
        selectedLeads: selectedLeads,
        totalLeads: totalLeads,
        totalAmount: totalAmount,
        // Preserve for debugging
        _debug: { range, stateCount, selectedLeads, totalLeads, totalAmount }
      });
    } else {
      console.warn(`⚠️ No states found for range: ${range}`);
    }
  });
  
  if (selectedItems.length === 0) {
    console.warn("⚠️ No items selected to add to summary");
    return;
  }
  
  const groupKey = `${upgradeData.planId}__${upgradeData.investmentRangeLabel}`;
  
  setPaymentSummary((prev) => {
    const existingIndex = prev.findIndex((p) => p.groupKey === groupKey);
    
    // Calculate unique states across all items
    const allStatesSet = new Set();
    selectedItems.forEach((item) => {
      (item.states || []).forEach((state) => allStatesSet.add(state));
    });
    const totalUniqueStates = allStatesSet.size;
    const totalGroupAmount = selectedItems.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
    const totalGroupLeads = selectedItems.reduce((sum, item) => sum + (item.totalLeads || 0), 0);
    
    const newGroup = {
      groupKey: groupKey,
      planId: upgradeData.planId,
      planName: upgradeData.planName,
      investmentRangeLabel: upgradeData.investmentRangeLabel || "—",
      pricePerState: upgradeData.pricePerState || 0,
      validityDays: upgradeData.validityDays || 0,
      items: selectedItems,
      uniqueStates: Array.from(allStatesSet),
      totalStates: totalUniqueStates,
      amount: totalGroupAmount,
      totalLeads: totalGroupLeads,
      selectedLeads: upgradeData.selectedLeads || upgradeData.leads || 0,
    };
    
    console.log("✅ New Group:", newGroup); // Debug log
    
    if (existingIndex !== -1) {
      const updated = [...prev];
      updated[existingIndex] = newGroup;
      return updated;
    }
    return [...prev, newGroup];
  });
  
  setMovedGroupKeys((prev) => {
    if (!prev.includes(groupKey)) return [...prev, groupKey];
    return prev;
  });
  
  setTimeout(() => scrollToPaymentSummary(), 100);
}}
      />

      {/* Listing Plans - Desktop Only */}
      {!isMobile && (
        <Box ref={upgradeSectionRef}>
          <ListingPlans
            plans={plans}
            paymentSummary={paymentSummary}
            data={data}
            isUpgradeMode={isUpgradeMode}
            upgradePlanId={upgradePlanId}
            finalToken={finalToken}
            allStates={allStates}
            ALL_INDIA_STATES={ALL_INDIA_STATES}
            COLORS={COLORS}
            TEXT_SIZES={TEXT_SIZES}
            openSnack={openSnack}
            scrollToPaymentSummary={scrollToPaymentSummary}
            setPaymentSummary={setPaymentSummary}
            setMovedGroupKeys={setMovedGroupKeys}
            handleRemoveListingPlan={handleRemoveListingPlan}
          />
        </Box>
      )}

      {/* Investor Lead Plans Section */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
        {!isMobile && (
          <Box sx={{ width: "100%", maxWidth: "1300px", mb: 3, textAlign: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: COLORS.black, mb: 1, fontSize: { xs: "1rem", md: "1.9rem" } }}>
              INVESTOR LEAD PLANS
            </Typography>
            <Typography variant="body3" sx={{ color: COLORS.black, fontSize: TEXT_SIZES.medium, maxWidth: "600px", mx: "auto" }}>
              Franchise | Dealer and Distributor | Channel Partner | Agent and Association
            </Typography>
          </Box>
        )}

        {isMobile ? (
          <MobilePackageSelection
            filteredPlans={filteredPlans}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            leadsDropdownData={leadsDropdownData}
            selectedLeadsPerRange={selectedLeadsPerRange}
            handleLeadsChange={handleLeadsChange}
            checkedItems={checkedItems}
            setCheckedItems={setCheckedItems}
            paymentSummary={paymentSummary}
            handleAddSingleToPayment={handleAddSingleToPayment}
            statesByInvestmentRange={statesByInvestmentRange}
            getStateCountForRange={getStateCountForRange}
            getRangeKey={getRangeKey}
            handleOpenStateModal={handleOpenStateModal}
            isFicoInvestmentRange={isFicoInvestmentRange}
            ficoInvestmentRanges={ficoInvestmentRanges}
            scrollToPaymentSummary={scrollToPaymentSummary}
            openSnack={openSnack}
            setOpenConfirmDialog={setOpenConfirmDialog}
            setPendingSelection={setPendingSelection}
            finalToken={finalToken}
            data={data}
            allStates={allStates}
            plans={plans}
            paymentSummaryRef={paymentSummaryRef}
            handleRemoveListingPlan={handleRemoveListingPlan}
            isUpgradeMode={isUpgradeMode}
            upgradePlanId={upgradePlanId}
            hideListingPlans={false}
            sectionExpanded={openSection}
            onSectionChange={handleSectionChange}
          />
        ) : (
          <InvestorLeadPlans
            filteredPlans={filteredPlans}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            selectedValidityDays={selectedValidityDays}
            leadsDropdownData={leadsDropdownData}
            selectedLeadsPerRange={selectedLeadsPerRange}
            checkedItems={checkedItems}
            setCheckedItems={setCheckedItems}
            paymentSummary={paymentSummary}
            statesByInvestmentRange={statesByInvestmentRange}
            movedGroupKeys={movedGroupKeys}
            ficoInvestmentRanges={ficoInvestmentRanges}
            finalToken={finalToken}
            detectedState={detectedState}
            allStates={allStates}
            data={data}
            COLORS={COLORS}
            TEXT_SIZES={TEXT_SIZES}
            getRangeKey={getRangeKey}
            getStateCountForRange={getStateCountForRange}
            getRowBackgroundColor={getRowBackgroundColor}
            isFicoInvestmentRange={isFicoInvestmentRange}
            handleOpenStateModal={handleOpenStateModal}
            handleLeadsChange={handleLeadsChange}
            handleAddSingleToPayment={handleAddSingleToPayment}
            setPendingSelection={setPendingSelection}
            setOpenConfirmDialog={setOpenConfirmDialog}
            openSnack={openSnack}
            selectedListingPlanId={selectedListingPlanId}
          />
        )}
      </Box>

      {/* Payment Summary Section */}
      {(paymentSummary.filter((g) => movedGroupKeys.includes(g.groupKey)).length > 0 || paymentSummary.length > 0) && (
        <>
          {(() => {
            const movedGroups = paymentSummary.filter((g) => movedGroupKeys.includes(g.groupKey));
            const totalPlans = new Set(movedGroups.map((g) => g.planId)).size;
            const totalAmount = movedGroups.reduce((acc, g) => acc + (g.amount || 0), 0);
            const statCards = [{ label: "Plans", value: totalPlans, icon: <LayersIcon sx={{ fontSize: 17 }} /> }];
            return (
              <PaymentBottomBar
                COLORS={COLORS}
                TEXT_SIZES={TEXT_SIZES}
                bounceAnimation={bounceAnimation}
                statCards={statCards}
                totalAmount={totalAmount}
                loading={loading}
                handleProceedToPayment={handleProceedToPayment}
              />
            );
          })()}

          <PaymentSummaryTable
            paymentSummary={paymentSummary}
            paymentSummaryRef={paymentSummaryRef}
            COLORS={COLORS}
            TEXT_SIZES={TEXT_SIZES}
            handleShowStates={handleShowStates}
            setItemToRemove={setItemToRemove}
            setOpenRemoveConfirmDialog={setOpenRemoveConfirmDialog}
            sectionExpanded={openSection.includes("summary")}
            onSectionChange={handleSectionChange("summary")}
          />
        </>
      )}

      {/* State Selection Modal */}
      <StateSelectionModal
        open={openStateModal}
        onClose={handleCloseStateModal}
        selectedStates={selectedStates}
        setSelectedStates={setSelectedStates}
        allStates={allStates}
        COLORS={COLORS}
        TEXT_SIZES={TEXT_SIZES}
        ALL_INDIA_STATES={ALL_INDIA_STATES}
        finalToken={finalToken}
        getAlreadySelectedStatesInOtherRanges={getAlreadySelectedStatesInOtherRanges}
        getStatesToDisplay={getStatesToDisplay}
        renderStatesByRegion={renderStatesByRegion}
        handleSelectAll={handleSelectAll}
        handleClearAll={handleClearAll}
        handleSaveStates={handleSaveStates}
        router={router}
        openSnack={openSnack}
      />

      {/* States List Dialog */}
      <SelectedStatesTooltipModal
        open={openStatesTooltip}
        onClose={() => setOpenStatesTooltip(false)}
        tooltipStates={tooltipStates}
        INDIA_STATES={INDIA_STATES}
        COLORS={COLORS}
        TEXT_SIZES={TEXT_SIZES}
      />

      {/* Snackbar */}
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={closeSnack} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <MuiAlert
          onClose={closeSnack}
          severity={snack.severity}
          variant="filled"
          elevation={6}
          sx={{ fontSize: TEXT_SIZES.medium, backgroundColor: snack.severity === "success" ? COLORS.secondary : COLORS.primary, color: COLORS.white, fontWeight: 600, borderRadius: 2, boxShadow: `0 4px 12px ${COLORS.shadow}` }}
        >
          {snack.message}
        </MuiAlert>
      </Snackbar>

      <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />

      {/* Confirm Dialog */}
      <InvestmentRangeConfirmDialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        COLORS={COLORS}
        TEXT_SIZES={TEXT_SIZES}
        pendingSelection={pendingSelection}
        setPendingSelection={setPendingSelection}
        finalToken={finalToken}
        setShowLogin={setShowLogin}
        isFicoInvestmentRange={isFicoInvestmentRange}
        handleAddInvestmentRange={handleAddInvestmentRange}
        openSnack={openSnack}
        onAddInvestmentRange={onAddInvestmentRange}
      />

      {/* Remove Dialog */}
      <RemoveInvestmentRangeDialog
        open={openRemoveConfirmDialog}
        onClose={() => setOpenRemoveConfirmDialog(false)}
        COLORS={COLORS}
        TEXT_SIZES={TEXT_SIZES}
        itemToRemove={itemToRemove}
        handleRemoveSingleFromPayment={handleRemoveSingleFromPayment}
        setItemToRemove={setItemToRemove}
      />
    </Box>
  );
};

export default PackageSelection;