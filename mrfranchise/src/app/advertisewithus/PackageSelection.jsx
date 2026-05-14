"use client";

import React, { useState, useEffect, useMemo, useCallback, memo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  IconButton,
  Typography,
  FormControlLabel,
  Card,
  CardContent,
  Divider,
  Grid,
  CardActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { keyframes } from '@mui/system';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import LoginPage from "@/Components/LoginPage/LoginPage.jsx";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Enhanced Color Palette
const COLORS = {
  primary: '#FF9900',
  primaryDark: '#E68A00',
  primaryLight: '#FFB84D',
  secondary: '#4CB04F',
  secondaryDark: '#3D8E40',
  secondaryLight: '#71FF05',
  black: '#000000',
  white: '#ffffff',
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
  },
  lightOrange: 'rgba(255, 153, 0, 0.08)',
  lightGreen: 'rgba(76, 176, 79, 0.08)',
  border: '#E0E0E0',
  shadow: 'rgba(0, 0, 0, 0.08)',
};

// Text Sizes
const TEXT_SIZES = {
  xs: '0.725rem',      // 10px
  small: '0.80rem',    // 12px
  medium: '0.980rem',  // 14px
  large: '1rem',       // 16px
  xl: '1.125rem',      // 18px
  xxl: '1.25rem',      // 20px
};
const bounceAnimation = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
`;

const INDIA_STATES = {
  North: [
    "Delhi",
    "Haryana",
    "Himachal Pradesh",
    "Punjab",
    "Rajasthan",
    "Uttar Pradesh",
    "Uttarakhand",
    "Jammu and Kashmir",
    "Ladakh",
    "Chandigarh",
  ],

  South: [
    "Andhra Pradesh",
    "Karnataka",
    "Kerala",
    "Tamil Nadu",
    "Telangana",
    "Puducherry",
    "Lakshadweep",
  ],

  East: [
    "Bihar",
    "Jharkhand",
    "Odisha",
    "West Bengal",
    "Andaman and Nicobar Islands",
  ],

  West: [
    "Goa",
    "Gujarat",
    "Maharashtra",
    "Dadra and Nagar Haveli",
    "Daman and Diu",
  ],

  NorthEast: [
    "Arunachal Pradesh",
    "Assam",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Sikkim",
    "Tripura",
  ],

  Central: [
    "Chhattisgarh",
    "Madhya Pradesh",
  ],
};
const ALL_INDIA_STATES = Object.values(INDIA_STATES).flat();

const AlertMessage = memo(({ severity, message, action }) => (
  <Alert 
    severity={severity} 
    sx={{ 
      mb: 2,
      borderRadius: 2,
      backgroundColor: severity === 'success' ? COLORS.lightGreen : COLORS.lightOrange,
      color: COLORS.black,
      fontSize: TEXT_SIZES.medium,
      border: `1px solid ${severity === 'success' ? COLORS.secondary : COLORS.primary}`,
      '& .MuiAlert-icon': {
        color: severity === 'success' ? COLORS.secondary : COLORS.primary,
      },
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
  state => state.toLowerCase() === data.region.toLowerCase()
);
      
      return {
        state: matchedState || data.region,
        city: data.city,
        country: data.country_name,
      };
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
  const [detectedState, setDetectedState] = useState(null);
  const [openStateModal, setOpenStateModal] = useState(false);
const [allStates, setAllStates] = useState(ALL_INDIA_STATES);
  const [selectedStates, setSelectedStates] = useState(new Set());
  const [statesByInvestmentRange, setStatesByInvestmentRange] = useState({});
  const [currentEditingRange, setCurrentEditingRange] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });
  const [leadsDropdownData, setLeadsDropdownData] = useState({});
  const [selectedLeadsPerRange, setSelectedLeadsPerRange] = useState({});
  const [selectedListingPlanId, setSelectedListingPlanId] = useState(null);
  const [movedGroupKeys, setMovedGroupKeys] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedValidityDays, setSelectedValidityDays] = useState({});
  const [openRemoveConfirm, setOpenRemoveConfirm] = useState(false);
const [pendingRemoveGroupKey, setPendingRemoveGroupKey] = useState(null);
const [pendingRemoveGroupName, setPendingRemoveGroupName] = useState("");
const [checkedItems, setCheckedItems] = useState({});
const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
const [pendingSelection, setPendingSelection] = useState(null);
const [openNoSelectionDialog, setOpenNoSelectionDialog] = useState(false);
const [expandedRegion, setExpandedRegion] = useState(null);

  const { brandUUID: reduxBrandUUID, token: reduxToken } = useSelector(
    (state) => state.auth
  );

  const [localBrandUUID, setLocalBrandUUID] = useState(null);
  const [localAccessToken, setLocalAccessToken] = useState(null);

  // Scroll to payment summary function
  const scrollToPaymentSummary = useCallback(() => {
    if (paymentSummaryRef.current) {
      paymentSummaryRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  }, []);

// Replace your existing useEffect for loading saved data (around line 160-180) with this:

useEffect(() => {
  if (typeof window !== "undefined") {
    setLocalBrandUUID(localStorage.getItem("brandUUID"));
    setLocalAccessToken(localStorage.getItem("accessToken"));
    const savedStates = localStorage.getItem("investmentRangeStates");
    if (savedStates) {
      try {
        setStatesByInvestmentRange(JSON.parse(savedStates));
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
          
          // Restore movedGroupKeys from localStorage
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
          
          // Sync movedGroupKeys with payment summary - mark groups that are in payment summary
          const newMovedKeys = [...restoredMovedKeys];
          parsed.forEach((group) => {
            // If group exists in payment summary and isn't already in movedGroupKeys, add it
            if (group.groupKey && !newMovedKeys.includes(group.groupKey)) {
              newMovedKeys.push(group.groupKey);
            }
          });
          
          // Only update if different
          if (JSON.stringify(newMovedKeys) !== JSON.stringify(restoredMovedKeys)) {
            setMovedGroupKeys(newMovedKeys);
          }
          
          // Restore selected checkboxes from saved summary
          const restoredSelected = {};
          const restoredChecked = {};
          parsed.forEach((group) => {
            // For listing plans
            if (group.groupKey?.startsWith("listing-")) {
              restoredSelected[group.groupKey] = true;
            }
            // For investment range items
            group.items?.forEach((item) => {
              if (item.id) {
                restoredSelected[item.id] = true;
                restoredChecked[item.id] = true;
              }
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
    if (typeof window !== "undefined") {
      localStorage.setItem("paymentSummaryDraft", JSON.stringify(paymentSummary));
    }
  }, [paymentSummary]);

  const finalBrandUUID = reduxBrandUUID || localBrandUUID;
  const finalToken = reduxToken || localAccessToken;

  const openSnack = useCallback((message, severity = "info") => {
    setSnack({ open: true, message, severity });
  }, []);

  const closeSnack = useCallback(() => {
    setSnack((s) => ({ ...s, open: false }));
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
           const matchedState = ALL_INDIA_STATES.find(
  s => s.toLowerCase() === parsed.state.toLowerCase()
);
            if (matchedState) {
              setDetectedState(matchedState);
            }
          }
          return;
        } catch (err) {
          console.error("Error parsing saved location:", err);
        }
      }
      setLocationLoading(true);
      try {
        const ipLocation = await getUserLocationFromIP();
        if (ipLocation && ipLocation.state) {
          const locationData = {
            state: ipLocation.state,
            city: ipLocation.city,
            country: ipLocation.country,
          };
          setUserLocation(locationData);
          localStorage.setItem("userLocation", JSON.stringify(locationData));
         const matchedState = ALL_INDIA_STATES.find(
  s => s.toLowerCase() === ipLocation.state.toLowerCase()
);
          if (matchedState) {
            setDetectedState(matchedState);
          }
        }
      } catch (error) {
        console.error("Location detection error:", error);
      } finally {
        setLocationLoading(false);
      }
    };
    detectLocation();
  }, [finalToken]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!finalBrandUUID) return;
    fetchBrandDetails(finalBrandUUID, finalToken);
  }, [finalBrandUUID, finalToken]);

const getRangeKey = useCallback((investmentRangeLabel, range, selectedLeads = null) => {
  if (selectedLeads !== null) {
    return `${investmentRangeLabel}__${range}__${selectedLeads}`;
  }
  return `${investmentRangeLabel}__${range}`;
}, []);



const getStatesToDisplay = useCallback(() => {
  if (finalToken) {
    return allStates;
  } else {
    return ALL_INDIA_STATES;  
  }
}, [finalToken, allStates]);

const handleSelectAll = useCallback(() => {
  const states = getStatesToDisplay();
  console.log('Selecting all states:', states); // Debug log
  if (states && states.length > 0) {
    setSelectedStates(new Set(states));
    openSnack(`Selected ${states.length} states`, "success");
  } else {
    openSnack("No states available to select", "warning");
  }
}, [getStatesToDisplay, openSnack]);

// Helper function to check for duplicate states across existing payment items
const hasDuplicateStates = useCallback((newStates, currentGroupKey = null) => {
  // Get all existing states from payment summary (excluding the current group if updating)
  const existingStates = new Set();
  
  paymentSummary.forEach((group) => {
    // Skip the current group if we're updating it
    if (currentGroupKey && group.groupKey === currentGroupKey) {
      return;
    }
    
    group.items.forEach((item) => {
      item.states.forEach((state) => {
        existingStates.add(state);
      });
    });
  });
  
  // Check for duplicates within the new states themselves
  const newStatesArray = [...newStates];
  const hasInternalDuplicates = newStatesArray.length !== new Set(newStatesArray).size;
  
  if (hasInternalDuplicates) {
    openSnack(`Cannot add: Duplicate states found within the same selection. Each state can only be selected once.`, "warning");
    return true;
  }
  
  // Check if any of the new states already exist
  const duplicates = newStatesArray.filter(state => existingStates.has(state));
  
  if (duplicates.length > 0) {
    openSnack(`Cannot add: State(s) "${duplicates.join(', ')}" already selected in another investment range. Each state can only be selected once.`, "warning");
    return true;
  }
  return false;
}, [paymentSummary, openSnack]);

const handleClearAll = useCallback(() => {
  setSelectedStates(new Set());
  openSnack("Cleared all selected states", "info");
}, [openSnack]);

// Replace your handleMoveToPayment function with this:
const handleMoveToPayment = useCallback((groupKey) => {
  // Find the group in paymentSummary
  const groupToMove = paymentSummary.find(g => g.groupKey === groupKey);
  
  if (!groupToMove) {
    openSnack("Group not found", "error");
    return;
  }
  
  // Mark it as moved
  setMovedGroupKeys((prev) => {
    if (prev.includes(groupKey)) {
      return prev;
    }
    return [...prev, groupKey];
  });
  
  openSnack("Group moved to payment section", "success");
  
  // Scroll to payment summary after state update
  setTimeout(() => scrollToPaymentSummary(), 300);
}, [paymentSummary, openSnack, scrollToPaymentSummary]);
  

  useEffect(() => {
    if (paymentSummary.length > 0) {
      setPaymentSummary((prev) => {
        return prev.map((group) => {
          const updatedItems = group.items.map((item) => {
            const key = getRangeKey(item.investmentRangeLabel, item.range);
            let states = statesByInvestmentRange[key];
            if (!states || states.length === 0) {
              if (!finalToken && detectedState) {
                states = [detectedState];
              } else if (finalToken) {
                states = allStates;
              } else {
                states = [];
              }
            }
            return {
              ...item,
              states: states,
              stateCount: states.length,
            };
          });
          const allStatesSet = new Set();
          updatedItems.forEach((item) => {
            item.states.forEach((state) => allStatesSet.add(state));
          });
          const uniqueStates = Array.from(allStatesSet);
          const totalUniqueStates = uniqueStates.length;

          // Align backend calculations with custom lead-formula pipeline
          const leadsDataKey = `${group.planId}_${group.investmentRangeLabel}`;
          const availableLeads = leadsDropdownData[leadsDataKey] || [];
          const minLeads = availableLeads.length > 0 ? Math.min(...availableLeads) : 1;
          const divisor = minLeads > 0 ? minLeads : 1;
          const selectedLeads = group.items[0]?.selectedLeads || 0;

          const newAmount = group.isListingPlan 
            ? group.amount 
            : (group.pricePerState / divisor) * totalUniqueStates * selectedLeads;

          return {
            ...group,
            items: updatedItems,
            uniqueStates: uniqueStates,
            totalStates: totalUniqueStates,
            amount: newAmount,
          };
        });
      });
    }
  }, [statesByInvestmentRange, finalToken, detectedState, allStates, getRangeKey, leadsDropdownData]);

const handleOpenStateModal = useCallback((investmentRangeLabel, range, selectedLeads) => {
  const key = getRangeKey(investmentRangeLabel, range, selectedLeads);
  setCurrentEditingRange(key);
  const savedStates = statesByInvestmentRange[key];
  if (savedStates && savedStates.length > 0) {
    setSelectedStates(new Set(savedStates));
  } else {
    if (!finalToken && detectedState) {
      setSelectedStates(new Set([detectedState]));
    } else if (finalToken && allStates.length > 0) {
      setSelectedStates(new Set(allStates));
    } else {
      setSelectedStates(new Set());
    }
  }
  setOpenStateModal(true);
}, [getRangeKey, statesByInvestmentRange, finalToken, detectedState, allStates]);

  const handleCloseStateModal = useCallback(() => {
    setOpenStateModal(false);
  }, []);

  const handleStateCheckboxChange = useCallback((state) => {
    setSelectedStates((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(state)) newSet.delete(state);
      else newSet.add(state);
      return newSet;
    });
  }, []);

  const handleSaveStates = useCallback(() => {
    const selectedArray = Array.from(selectedStates);
    const updated = {
      ...statesByInvestmentRange,
      [currentEditingRange]: selectedArray,
    };
    setStatesByInvestmentRange(updated);
    localStorage.setItem("investmentRangeStates", JSON.stringify(updated));
    openSnack(`Saved ${selectedArray.length} state${selectedArray.length > 1 ? 's' : ''}`, "success");
    handleCloseStateModal();
  }, [selectedStates, statesByInvestmentRange, currentEditingRange, openSnack, handleCloseStateModal]);



 const fetchBrandDetails = async (uuid, accessToken) => {
  try {
    setBrandLoading(true);
    setBrandError(null);
    const response = await fetch(
      `${API_URL}/api/v1/brandlisting/getBrandById/${uuid}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      }
    );
    const json = await response.json();
    if (!response.ok || json.success === false) {
      throw new Error(json.message || "Failed to fetch brand details");
    }
    const brandData = Array.isArray(json.data) ? json.data[0] : json.data;
    const ficoData = Array.isArray(brandData?.franchiseDetails?.fico)
      ? brandData.franchiseDetails.fico
      : Array.isArray(brandData?.fico)
      ? brandData.fico
      : Array.isArray(brandData?.brandDetails?.fico)
      ? brandData.brandDetails.fico
      : [];
    const ficoRanges = ficoData
      .map((item) => item?.investmentRange)
      .filter(Boolean);
    
    setFicoInvestmentRanges(ficoRanges);
    
    // Save FICO ranges to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("ficoInvestmentRanges", JSON.stringify(ficoRanges));
    }
    
    const expansionLocations =
      brandData?.expansionlocationdata?.expansionLocations?.domestic
        ?.locations || [];
    const extractedStates = expansionLocations
      .map((location) => {
        if (typeof location === "string") return location.trim();
        if (typeof location?.state === "string") return location.state.trim();
        if (typeof location?.state === "object" && location?.state !== null) {
          return (
            location.state.name ||
            location.state.label ||
            location.state.value ||
            location.state.stateName ||
            ""
          ).trim();
        }
        return (
          location?.stateName ||
          location?.State ||
          location?.state_name ||
          location?.address?.state ||
          location?.location?.state ||
          ""
        ).trim();
      })
      .filter(Boolean);
    const uniqueStatesList = [
      ...new Map(
        extractedStates.map((state) => [state.toLowerCase(), state])
      ).values(),
    ];
    if (uniqueStatesList.length > 0) {
      setAllStates(uniqueStatesList);
    } else {
      setAllStates([]);
    }
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
        json.data.forEach(plan => {
          plan.packages?.forEach(pkg => {
            const key = `${plan._id}_${pkg.investmentRangeLabel}`;
            leadsData[key] = pkg.totalLeads || [];
          });
        });
        setLeadsDropdownData(leadsData);
        const filtered = json.data.filter((plan) => plan.packages?.length > 1);
        const launchPadPlan = filtered.find(
          (plan) => plan.planName?.toLowerCase() === "launch pad program"
        );
        if (launchPadPlan) {
          const investmentRangeLabels = new Set();
          filtered.forEach((plan) => {
            plan.packages?.forEach((pkg) => {
              investmentRangeLabels.add(pkg.investmentRangeLabel);
            });
          });
          const defaultPlans = {};
          investmentRangeLabels.forEach((label) => {
            defaultPlans[label] = launchPadPlan._id;
          });
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
    return plans.filter((plan) => plan.packages?.length > 1 && plan.planName?.toLowerCase() !== 'free');
  }, [plans]);

  const uniquePackages = useMemo(() => {
    const uniqueMap = new Map();
    filteredPlans.forEach((plan) => {
      plan.packages?.forEach((pkg, pIndex) => {
        pkg.investmentRange?.forEach((range, rIndex) => {
          const key = `${pkg.investmentRangeLabel}-${range}`;
          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, {
              id: `${plan._id}-${pIndex}-${rIndex}`,
              investmentRangeLabel: pkg.investmentRangeLabel,
              range,
              defaultPlan: plan,
              pkg,
              allPlans: filteredPlans,
            });
          }
        });
      });
    });
    return Array.from(uniqueMap.values());
  }, [filteredPlans]);

  const handleSelectGroup = useCallback((label) => {
    setSelectedGroup(label);
  }, []);

  const handlePlanChange = useCallback((investmentRangeLabel, planId) => {
    setSelectedPlans((prev) => ({
      ...prev,
      [investmentRangeLabel]: planId,
    }));
  }, []);

  const getSelectedPlanData = useCallback((investmentRangeLabel, defaultPlan) => {
    const selectedPlanId = selectedPlans[investmentRangeLabel];
    if (!selectedPlanId) return defaultPlan;
    return plans.find((plan) => plan._id === selectedPlanId) || defaultPlan;
  }, [selectedPlans, plans]);

  const normalizeRange = useCallback((value) => {
    return String(value || "")
      .toLowerCase()
      .replace(/₹/g, "rs")
      .replace(/\brupees\b/g, "rs")
      .replace(/\brs\.?\b/g, "")
      .replace(/\blakhs\b/g, "lakh")
      .replace(/\bcrores\b/g, "crore")
      .replace(/\bto\b/g, "-")
      .replace(/[^a-z0-9]/g, "")
      .trim();
  }, []);

  const isFicoInvestmentRange = useCallback((range) => {
    const currentRange = normalizeRange(range);
    return ficoInvestmentRanges.some(
      (ficoRange) => normalizeRange(ficoRange) === currentRange
    );
  }, [ficoInvestmentRanges, normalizeRange]);

    const getUniqueStatesAcrossRanges = useCallback((items) => {
    const allStatesSet = new Set();
    items.forEach((item) => {
      item.states.forEach((state) => allStatesSet.add(state));
    });
    return Array.from(allStatesSet);
  }, []);

const handleAddSingleToPayment = useCallback((item, selectedPlan, selectedPkg) => {
  const { id, investmentRangeLabel, range } = item;
  const pricePerState = selectedPkg?.amount || 0;
  
  // Get current selected leads value
  const leadsDataKey = `${selectedPlan._id}_${investmentRangeLabel}`;
  const availableLeads = leadsDropdownData[leadsDataKey] || [];
  const selectedLeads = selectedLeadsPerRange[`plan-${selectedPlan._id}`] || 
                       (availableLeads.length > 0 ? availableLeads[0] : 0);
  
  // Use key with selectedLeads to get unique states per lead count
  const key = getRangeKey(investmentRangeLabel, range, selectedLeads);
  let states = statesByInvestmentRange[key];
  
  if (!states || states.length === 0) {
    if (!finalToken && detectedState) {
      states = [detectedState];
    } else if (finalToken) {
      states = allStates;
    } else {
      states = [];
    }
  }
  
  if (states.length === 0) {
    openSnack("Please select at least one state", "warning");
    return;
  }
  
  const minLeads = availableLeads.length > 0 ? Math.min(...availableLeads) : 1;
  const divisor = minLeads > 0 ? minLeads : 1;

  const newItem = {
    id,
    investmentRangeLabel,
    range,
    stateCount: states.length,
    states,
    selectedLeads: selectedLeads,
    totalLeads: selectedLeads * states.length,
    totalAmount: pricePerState * states.length,
  };
  
  // Include selectedLeads in groupKey to differentiate
  const groupKey = `${selectedPlan._id}__${selectedPkg?.validityDays}__${pricePerState}__${selectedLeads}__${investmentRangeLabel}`;
  
  // Rest of the function remains the same...
  setPaymentSummary((prev) => {
    const existingGroup = prev.find((g) => g.groupKey === groupKey);
    let newSummary;
    
    if (existingGroup) {
      const existingItemIndex = existingGroup.items.findIndex((ex) => ex.id === newItem.id);
      
      if (existingItemIndex !== -1) {
        const updatedItems = [...existingGroup.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          states: newItem.states,
          stateCount: newItem.stateCount,
          selectedLeads: newItem.selectedLeads,
          totalLeads: newItem.selectedLeads * newItem.stateCount,
          totalAmount: pricePerState * newItem.stateCount,
        };
        
        const uniqueStates = getUniqueStatesAcrossRanges(updatedItems);
        const totalUniqueStates = uniqueStates.length;
        const newAmount = (pricePerState / divisor) * totalUniqueStates * selectedLeads;
        
        newSummary = prev.map((g) =>
          g.groupKey === groupKey
            ? {
                ...g,
                items: updatedItems,
                uniqueStates: uniqueStates,
                totalStates: totalUniqueStates,
                amount: newAmount,
                totalLeads: totalUniqueStates * selectedLeads,
              }
            : g
        );
      } else {
        const updatedItems = [...existingGroup.items, newItem];
        const uniqueStates = getUniqueStatesAcrossRanges(updatedItems);
        const totalUniqueStates = uniqueStates.length;
        const newAmount = (pricePerState / divisor) * totalUniqueStates * selectedLeads;
        
        newSummary = prev.map((g) =>
          g.groupKey === groupKey
            ? {
                ...g,
                items: updatedItems,
                uniqueStates: uniqueStates,
                totalStates: totalUniqueStates,
                amount: newAmount,
                totalLeads: totalUniqueStates * selectedLeads,
              }
            : g
        );
      }
    } else {
      const uniqueStates = getUniqueStatesAcrossRanges([newItem]);
      const totalUniqueStates = uniqueStates.length;
      const dynamicAmount = (pricePerState / divisor) * totalUniqueStates * selectedLeads;
      
      newSummary = [
        ...prev,
        {
          groupKey,
          planId: selectedPlan._id,
          planName: selectedPlan.planName,
          investmentRangeLabel,
          validityDays: selectedPkg?.validityDays,
          pricePerState,
          uniqueStates,
          totalStates: totalUniqueStates,
          amount: dynamicAmount,
          totalLeads: totalUniqueStates * selectedLeads,
          items: [newItem],
        },
      ];
    }
    
    setMovedGroupKeys((prevKeys) => {
      if (!prevKeys.includes(groupKey)) {
        return [...prevKeys, groupKey];
      }
      return prevKeys;
    });
    
    openSnack(`Added ${range} with ${selectedLeads} leads to cart`, "success");
    setTimeout(() => scrollToPaymentSummary(), 100);
    
    return newSummary;
  });
  
  setSelected((prev) => ({ ...prev, [id]: true }));
  setCheckedItems((prev) => ({ ...prev, [id]: true }));
}, [getRangeKey, statesByInvestmentRange, finalToken, detectedState, allStates, getUniqueStatesAcrossRanges, openSnack, leadsDropdownData, selectedLeadsPerRange, scrollToPaymentSummary]);

const handleRemoveSingleFromPayment = useCallback((item) => {
  const { id } = item;
  setPaymentSummary((prev) => {
    const updated = prev
      .map((g) => {
        const hasItem = g.items.some((it) => it.id === id);
        if (!hasItem) return g;
        const updatedItems = g.items.filter((it) => it.id !== id);
        if (updatedItems.length === 0) {
          // Remove from movedGroupKeys as well
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

        return {
          ...g,
          items: updatedItems,
          uniqueStates: newUniqueStates,
          totalStates: newTotalUniqueStates,
          amount: newAmount,
          totalLeads: newTotalUniqueStates * selectedLeads,
        };
      })
      .filter((g) => g !== null);
    
    // Clear localStorage if summary becomes empty
    if (updated.length === 0 && typeof window !== "undefined") {
      localStorage.removeItem("paymentSummaryDraft");
      localStorage.removeItem("movedGroupKeys");
    }
    
    return updated;
  });
  
  openSnack("Investment range removed from payment", "info");
}, [getUniqueStatesAcrossRanges, openSnack, leadsDropdownData]);

const autoSelectFICORanges = useCallback(() => {
  if (!ficoInvestmentRanges.length || !filteredPlans.length) return;

  const selectedRanges = new Set();
  
  filteredPlans.forEach((plan) => {
    plan.packages?.forEach((pkg) => {
      pkg.investmentRange?.forEach((range) => {
        const isFICOMatch = ficoInvestmentRanges.some(ficoRange => 
          normalizeRange(ficoRange) === normalizeRange(range)
        );
        
        if (isFICOMatch) {
          const itemId = `${plan._id}-${pkg.investmentRangeLabel}-${range}`;
          selectedRanges.add({
            id: itemId,
            investmentRangeLabel: pkg.investmentRangeLabel,
            range: range,
            planId: plan._id,
            plan: plan,
            pkg: pkg
          });
        }
      });
    });
  });

  if (selectedRanges.size > 0) {
    const uniquePlanIds = [...new Set([...selectedRanges].map(r => r.planId))];
    
    if (uniquePlanIds.length > 0 && !selectedGroup) {
      setSelectedGroup(uniquePlanIds[0]);
    }
    
    const newCheckedItems = { ...checkedItems };
    const itemsToAdd = [];
    
    [...selectedRanges].forEach((rangeItem) => {
      newCheckedItems[rangeItem.id] = true;
      itemsToAdd.push(rangeItem);
    });
    
    setCheckedItems(newCheckedItems);
    
    itemsToAdd.forEach((rangeItem) => {
      const itemObject = {
        id: rangeItem.id,
        investmentRangeLabel: rangeItem.investmentRangeLabel,
        range: rangeItem.range,
      };
      
      handleAddSingleToPayment(itemObject, rangeItem.plan, rangeItem.pkg);
    });
    
    openSnack(`${itemsToAdd.length} investment range(s) auto-selected from your profile`, "success");
    setTimeout(() => scrollToPaymentSummary(), 500);
  }
}, [ficoInvestmentRanges, filteredPlans, checkedItems, selectedGroup, normalizeRange, handleAddSingleToPayment, openSnack, scrollToPaymentSummary]);

// 10. Define the auto-selection useEffect (depends on autoSelectFICORanges)
useEffect(() => {
  if (finalToken && ficoInvestmentRanges.length > 0 && filteredPlans.length > 0) {
    const hasAutoSelected = localStorage.getItem(`autoSelected_${finalBrandUUID}`);
    
    if (!hasAutoSelected) {
      const timer = setTimeout(() => {
        autoSelectFICORanges();
        localStorage.setItem(`autoSelected_${finalBrandUUID}`, 'true');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }
}, [finalToken, ficoInvestmentRanges, filteredPlans, finalBrandUUID, autoSelectFICORanges]);

  
  useEffect(() => {
  console.log('Payment Summary:', paymentSummary);
  console.log('Moved Group Keys:', movedGroupKeys);
}, [paymentSummary, movedGroupKeys]);


  useEffect(() => {
    if (filteredPlans.length > 0 && selectedGroup === null) {
      setSelectedGroup(filteredPlans[0]._id);
    }
  }, [filteredPlans, selectedGroup]);

  const isInPayment = useCallback((itemId) => {
    return paymentSummary.some((group) => 
      group.items.some((item) => item.id === itemId)
    );
  }, [paymentSummary]);

  



// Add this function
const handleClearAllPayment = useCallback(() => {
  setPaymentSummary([]);
  setMovedGroupKeys([]);
  if (typeof window !== "undefined") {
    localStorage.removeItem("paymentSummaryDraft");
    localStorage.removeItem("movedGroupKeys");
  }
  openSnack("All items cleared from payment summary", "success");
}, [openSnack]);

  const handleRemoveGroup = useCallback((groupKey) => {
  setPaymentSummary((prev) => {
    const group = prev.find((g) => g.groupKey === groupKey);
    if (group) {
      const idsToRemove = group.items.map((it) => it.id);
      setSelected((s) => {
        const copy = { ...s };
        idsToRemove.forEach((id) => (copy[id] = false));
        return copy;
      });
    }
    const newSummary = prev.filter((g) => g.groupKey !== groupKey);
    
    // Clear localStorage if payment summary becomes empty
    if (newSummary.length === 0 && typeof window !== "undefined") {
      localStorage.removeItem("paymentSummaryDraft");
      localStorage.removeItem("movedGroupKeys");
    }
    
    return newSummary;
  });
  setMovedGroupKeys((prev) => {
    const newKeys = prev.filter((key) => key !== groupKey);
    // Clear localStorage if no moved groups left
    if (newKeys.length === 0 && typeof window !== "undefined") {
      localStorage.removeItem("movedGroupKeys");
    }
    return newKeys;
  });
  openSnack("Plan removed", "info");
}, [openSnack]);

  const handleProceedToPayment = useCallback(() => {
    const movedGroups = paymentSummary.filter(g => movedGroupKeys.includes(g.groupKey));
    if (movedGroups.length === 0) {
      openSnack("Please move at least one plan to payment", "warning");
      return;
    }
    if (!finalToken) {
      localStorage.setItem("paymentSummaryDraft", JSON.stringify(movedGroups));
      openSnack("Please login to continue to payment", "warning");
      setShowLogin(true);
      return;
    }
    localStorage.setItem("paymentSummary", JSON.stringify(movedGroups));
    router.push("/payment");
  }, [finalToken, openSnack, paymentSummary, movedGroupKeys, router]);

 const getStateCountForRange = useCallback((investmentRangeLabel, range, selectedLeads) => {
  const key = getRangeKey(investmentRangeLabel, range, selectedLeads);
  const savedStates = statesByInvestmentRange[key];
  if (savedStates && savedStates.length > 0) return savedStates.length;
  if (!finalToken && detectedState) return 1;
  if (finalToken) return allStates.length;
  return 0;
}, [getRangeKey, statesByInvestmentRange, finalToken, detectedState, allStates]);

 

const handleAddInvestmentRange = useCallback((range, investmentRangeLabel) => {
  if (!finalToken) {
    setShowLogin(true);
    openSnack("Please log in to add investment ranges", "warning");
    return;
  }
  
  // Call the parent's onAddInvestmentRange prop which opens the dialog
  onAddInvestmentRange(range, investmentRangeLabel);
}, [onAddInvestmentRange, finalToken, openSnack]);

  const handleLeadsChange = useCallback((itemId, newLeadsValue) => {
    setSelectedLeadsPerRange((prev) => ({
      ...prev,
      [itemId]: newLeadsValue,
    }));
  }, []);

  // Add this useEffect to clear localStorage when payment summary is empty
useEffect(() => {
  if (typeof window !== "undefined" && paymentSummary.length > 0) {
    localStorage.setItem("paymentSummaryDraft", JSON.stringify(paymentSummary));
  } else if (typeof window !== "undefined" && paymentSummary.length === 0) {
    localStorage.removeItem("paymentSummaryDraft");
  }
}, [paymentSummary]);

useEffect(() => {
  if (typeof window !== "undefined") {
    if (movedGroupKeys.length > 0) {
      localStorage.setItem("movedGroupKeys", JSON.stringify(movedGroupKeys));
    } else {
      localStorage.removeItem("movedGroupKeys");
    }
  }
}, [movedGroupKeys]);
// Add this helper function outside your component or inside it
const getInvestmentGroupColor = useCallback((investmentRangeLabel, allGroupsList) => {
  const groupIndices = {};
  let currentGroupIndex = 0;
  
  allGroupsList.forEach((label) => {
    if (!groupIndices.hasOwnProperty(label)) {
      groupIndices[label] = currentGroupIndex;
      currentGroupIndex++;
    }
  });
  
  const groupIdx = groupIndices[investmentRangeLabel] || 0;
  return groupIdx % 2 === 0 ? "#fff0c5" : "#c8e6ac";
}, []);

// Add the getRowBackgroundColor function separately (outside getInvestmentGroupColor)
const getRowBackgroundColor = useCallback((investmentRangeLabel, isInPayment, idx) => {

  
  // Get index of the investment group
  const allGroups = [];
  if (selectedGroup) {
    const selectedPlanData = filteredPlans.find(p => p._id === selectedGroup);
    if (selectedPlanData) {
      selectedPlanData.packages?.forEach((pkg) => {
        if (pkg.investmentRangeLabel && !allGroups.includes(pkg.investmentRangeLabel)) {
          allGroups.push(pkg.investmentRangeLabel);
        }
      });
    }
  }
  
  const groupIdx = allGroups.indexOf(investmentRangeLabel);
  return groupIdx % 2 === 0 ? "#fff0c5" : "#c8e6ac";
}, [selectedGroup, filteredPlans]);

// Add this function inside your component, before the return statement
const renderStatesByRegion = () => {
  const statesToDisplay = getStatesToDisplay();
  
  return Object.entries(INDIA_STATES).map(([region, states]) => {
    // Filter states based on what's available to display
    const availableStates = states.filter(state => 
      statesToDisplay.includes(state)
    );
    
    if (availableStates.length === 0) return null;
    
    const selectedCount = availableStates.filter(state => selectedStates.has(state)).length;
    
    return (
    <Accordion 
  key={region}
  expanded={expandedRegion === region}
  onChange={(event, isExpanded) => {
    setExpandedRegion(isExpanded ? region : null);
  }}
  elevation={0}
  sx={{
    border: `1px solid ${COLORS.border}`,
    borderRadius: '8px !important',
    mb: 1.5,
    '&:before': {
      display: 'none',
    },
    '&.Mui-expanded': {
      margin: '0 0 12px 0',
    },
  }}
>
  <AccordionSummary
    expandIcon={<ExpandMoreIcon sx={{ color: COLORS.primary }} />}
    sx={{
      backgroundColor: COLORS.grey[50],
      borderRadius: '8px',
      '&.Mui-expanded': {
        borderRadius: '8px 8px 0 0',
      },
      '& .MuiAccordionSummary-content': {
        alignItems: 'center',
        justifyContent: 'space-between',
      },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography sx={{ 
        fontSize: TEXT_SIZES.medium, 
        fontWeight: 700,
        color: COLORS.black,
      }}>
        {region}
      </Typography>
      <Chip 
        label={`${selectedCount}/${availableStates.length}`}
        size="small"
        sx={{
          height: 20,
          fontSize: '0.7rem',
          backgroundColor: selectedCount === availableStates.length ? COLORS.secondary : COLORS.grey[400],
          color: COLORS.white,
          fontWeight: 600,
        }}
      />
    </Box>
    
    {/* Replace Button with Box that has onClick */}
    <Box
      component="span"
      onClick={(e) => {
        e.stopPropagation();
        const newSet = new Set(selectedStates);
        const allInRegion = availableStates;
        const allSelected = allInRegion.every(state => selectedStates.has(state));
        
        if (allSelected) {
          allInRegion.forEach(state => newSet.delete(state));
          openSnack(`Deselected all states in ${region}`, "info");
        } else {
          allInRegion.forEach(state => newSet.add(state));
          openSnack(`Selected all states in ${region}`, "success");
        }
        setSelectedStates(newSet);
      }}
      sx={{
        fontSize: '0.7rem',
        textTransform: 'none',
        color: COLORS.primary,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 8px',
        borderRadius: '4px',
        '&:hover': {
          backgroundColor: COLORS.lightOrange,
        },
      }}
    >
      {availableStates.every(state => selectedStates.has(state)) ? "Deselect All" : "Select All"}
    </Box>
  </AccordionSummary>
  
  <AccordionDetails sx={{ p: 2 }}>
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 1,
    }}>
      {availableStates.map((state) => (
        <FormControlLabel
          key={state}
          control={
            <Checkbox 
              checked={selectedStates.has(state)} 
              onChange={() => handleStateCheckboxChange(state)}
              sx={{
                color: COLORS.primary,
                '&.Mui-checked': {
                  color: COLORS.secondary,
                },
              }}
            />
          }
          label={
            <Typography sx={{ 
              fontSize: TEXT_SIZES.medium, 
              color: COLORS.black,
              fontWeight: selectedStates.has(state) ? 600 : 400,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {state}
            </Typography>
          }
          sx={{ 
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            margin: 0,
            py: 0.5,
            px: 1,
            borderRadius: 1.5,
            transition: 'all 0.2s ease',
            backgroundColor: selectedStates.has(state) ? COLORS.lightGreen : 'transparent',
            width: '100%',
            '&:hover': {
              backgroundColor: selectedStates.has(state) ? COLORS.lightGreen : COLORS.lightOrange,
            },
            '& .MuiFormControlLabel-label': {
              width: 'calc(100% - 35px)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }
          }}
        />
      ))}
    </Box>
  </AccordionDetails>
</Accordion>
    );
  });
};


  if (loading) {
    return (
      <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        minHeight: '400px'
      }}>
        <CircularProgress sx={{ color: COLORS.primary }} size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          sx={{ 
            fontSize: TEXT_SIZES.medium,
            borderRadius: 2,
            border: `1px solid ${COLORS.primary}`,
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }


  return (
    <Box sx={{ 
      width: "100%", 
      minHeight: "100vh", 
      backgroundColor: COLORS.grey[50],
    }}>
   

      {/* INVESTMENT RANGE PLANS SECTION */}
      <Box sx={{ mb: 4 }}>
        <Card
          elevation={0}
          sx={{
            border: `1px solid ${COLORS.border}`,
            borderRadius: 2,
            overflow: "visible",
            boxShadow: `0 2px 8px ${COLORS.shadow}`,
          }}
        >
          {selectedGroup ? (
            <Box>
              {(() => {
                const selectedPlan = filteredPlans.find(p => p._id === selectedGroup);
                
                if (!selectedPlan) return null;

                const allPackagesFromPlan = [];
                selectedPlan.packages?.forEach((pkg) => {
                  pkg.investmentRange?.forEach((range) => {
                    allPackagesFromPlan.push({
                      investmentRangeLabel: pkg.investmentRangeLabel,
                      range: range,
                      pkg: pkg,
                    });
                  });
                });

                const firstPkg = selectedPlan.packages?.[0];
                const leadsDataKey = `${selectedPlan._id}_${firstPkg?.investmentRangeLabel}`;
                const availableLeads = leadsDropdownData[leadsDataKey] || [];
                const selectedLeads = selectedLeadsPerRange[`plan-${selectedPlan._id}`] || 
                                     (availableLeads.length > 0 ? availableLeads[0] : (firstPkg?.totalLeads?.[0] || 0));

                const uniqueValidityDays = [...new Set(
                  selectedPlan.packages?.map(pkg => pkg.validityDays).filter(Boolean)
                )];
                const selectedDays = selectedValidityDays?.[selectedPlan._id] || uniqueValidityDays[0];

                // Dynamically compile the deduplicated states and aggregates per investment group label
                const groupAggregates = {};
                allPackagesFromPlan.forEach((pkgItem) => {
                  const label = pkgItem.investmentRangeLabel;
                  if (!groupAggregates[label]) {
                    groupAggregates[label] = {
                      uniqueStatesSet: new Set(),
                      hasAnyInPayment: false,
                      allGroupItems: []
                    };
                  }
                  
                  const key = getRangeKey(pkgItem.investmentRangeLabel, pkgItem.range);
                  let states = statesByInvestmentRange[key];
                  if (!states || states.length === 0) {
                    if (!finalToken && detectedState) {
                      states = [detectedState];
                    } else if (finalToken) {
                      states = allStates;
                    } else {
                      states = [];
                    }
                  }
                  
                  const itemId = `${selectedPlan._id}-${pkgItem.investmentRangeLabel}-${pkgItem.range}`;
                  const inPayment = paymentSummary.some((group) =>
                    group.items.some((it) => it.id === itemId)
                  );
                  const isRecommended = isFicoInvestmentRange(pkgItem.range);

                  groupAggregates[label].allGroupItems.push({ pkgItem, states, inPayment, isRecommended });
                  
                  if (inPayment) {
                    groupAggregates[label].hasAnyInPayment = true;
                    states.forEach(state => groupAggregates[label].uniqueStatesSet.add(state));
                  }
                });

                // Post-process to calculate preview state counts if nothing is currently in payment
                Object.keys(groupAggregates).forEach((label) => {
                  const agg = groupAggregates[label];
                  if (!agg.hasAnyInPayment) {
                    const recommendedItems = agg.allGroupItems.filter(x => x.isRecommended);
                    const previewItems = recommendedItems.length > 0 ? recommendedItems : agg.allGroupItems;
                    previewItems.forEach((x) => {
                      x.states.forEach(state => agg.uniqueStatesSet.add(state));
                    });
                  }
                  agg.totalStatesCount = agg.uniqueStatesSet.size;
                });

                return (
                  <>
                    {/* Unified Table */}
                    <TableContainer
                      component={Paper}
                      elevation={0}
                      sx={{
                        boxShadow: "none",
                        overflow: 'visible',
                      }}
                    >
                      <Table size="small" sx={{ tableLayout: 'fixed', width: '100%' }}>
                        <TableHead>
                          <TableRow>
                            {/* Plan Selection Column */}
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontSize: TEXT_SIZES.small,
                                color: COLORS.white,
                                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
                                px: 1.5,
                                py: 1.5,
                                width: '10%',
                                textAlign: 'center',
                              }}
                            >
                              Plans
                            </TableCell>
                            
                            {/* Leads Per State Column */}
                            {availableLeads.length > 0 && (
                              <TableCell
                                sx={{
                                  fontWeight: 700,
                                  fontSize: TEXT_SIZES.small,
                                  color: COLORS.white,
                                  background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
                                  px: 1.5,
                                  py: 1.5,
                                  width: '5%',
                                  textAlign: 'center',
                                }}
                              >
                                Leads per State
                              </TableCell>
                            )}

                            {/* Investment Group Column */}
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontSize: TEXT_SIZES.small,
                                color: COLORS.white,
                                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
                                width: '6%',
                                textAlign: 'center',
                              }}
                            >
                              Investment Group
                            </TableCell>
                            
                            {/* Select Checkbox Column */}
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontSize: TEXT_SIZES.small,
                                color: COLORS.white,
                                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
                                px: 1,
                                py: 1.5,
                                width: '1.5%',
                                textAlign: 'center',
                              }}
                            >
                              Select
                            </TableCell>
                            
                            {/* Investment Range Column */}
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontSize: TEXT_SIZES.small,
                                color: COLORS.white,
                                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
                                px: 1.5,
                                py: 1.5,
                                width: '14%',
                                textAlign: 'center',
                              }}
                            >
                              Investment Range
                            </TableCell>
                            
                            {/* States Column */}
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontSize: TEXT_SIZES.small,
                                color: COLORS.white,
                                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
                                px: 1,
                                py: 1.5,
                                width: '4%',
                                textAlign: 'center',
                              }}
                            >
                              States 
                            </TableCell>
                            
                            {/* Price/State Column */}
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontSize: TEXT_SIZES.small,
                                color: COLORS.white,
                                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
                                px: 1,
                                py: 1.5,
                                width: '5%',
                                textAlign: 'center',
                              }}
                            >
                              Price per State
                            </TableCell>
                            
                            {/* Total Leads Column */}
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontSize: TEXT_SIZES.small,
                                color: COLORS.white,
                                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
                                px: 1,
                                py: 1.5,
                                width: '4%',
                                textAlign: 'center',
                              }}
                            >
                              Total Leads
                            </TableCell>
                            
                            {/* Total Amount Column */}
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontSize: TEXT_SIZES.small,
                                color: COLORS.white,
                                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
                                px: 1,
                                py: 1.5,
                                width: '5%',
                                textAlign: 'center',
                              }}
                            >
                              Total Amount
                            </TableCell>
                            
                            {/* Action Column */}
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontSize: TEXT_SIZES.small,
                                color: COLORS.white,
                                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
                                px: 1,
                                py: 1.5,
                                width: '4%',
                                textAlign: 'center',
                              }}
                            >
                              Action
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {(() => {
                            const labelCounts = {};
                            
                            allPackagesFromPlan.forEach((item) => {
                              labelCounts[item.investmentRangeLabel] = 
                                (labelCounts[item.investmentRangeLabel] || 0) + 1;
                            });

                            const totalRows = allPackagesFromPlan.length;
                            const renderedLabels = new Set();
                            let firstRow = true;

                            return allPackagesFromPlan.map((item, idx) => {
                              const itemId = `${selectedPlan._id}-${item.investmentRangeLabel}-${item.range}`;
                              const isRecommended = isFicoInvestmentRange(item.range);
                              const stateCount = getStateCountForRange(
                                item.investmentRangeLabel,
                                item.range,
                                 selectedLeads 
                              );
                              const inPayment = paymentSummary.some((group) =>
                                group.items.some(
                                  (it) =>
                                    it.investmentRangeLabel === item.investmentRangeLabel &&
                                    it.range === item.range &&
                                    group.planId === selectedPlan._id
                                )
                              );
                              
                              const pricePerState = item.pkg?.amount || 0;

                              // Retrieve dynamic aggregates for this label
                              const groupAgg = groupAggregates[item.investmentRangeLabel];
                              const uniqueGroupStatesCount = groupAgg.totalStatesCount;
                              
                              // base divisor definition
                              const minLeads = availableLeads.length > 0 ? Math.min(...availableLeads) : 1;
                              const divisor = minLeads > 0 ? minLeads : 1;

                              // Apply custom logic: PricePerState / minLeads * totalStates * selectedLeads
                              const groupTotalLeads = selectedLeads * uniqueGroupStatesCount;
                              const groupTotalAmount = (pricePerState / divisor) * uniqueGroupStatesCount * selectedLeads;

                              const itemObject = {
                                id: itemId,
                                investmentRangeLabel: item.investmentRangeLabel,
                                range: item.range,
                              };

                              const isFirstInGroup = !renderedLabels.has(item.investmentRangeLabel);
                              if (isFirstInGroup) {
                                renderedLabels.add(item.investmentRangeLabel);
                              }
                              const rowSpan = labelCounts[item.investmentRangeLabel];
                              const showFirstRow = firstRow;
                              if (firstRow) firstRow = false;

                            return (
  <TableRow
    key={itemId}
    sx={{
      backgroundColor: getRowBackgroundColor(item.investmentRangeLabel, inPayment, idx),
      transition: 'all 0.3s ease',
      "&:hover": {
        backgroundColor: inPayment ? COLORS.lightGreen : COLORS.lightOrange,
      },
    }}
  >
                                  {/* Plan Selection - Show only in first row */}
                                  {showFirstRow && (
                                    <TableCell 
                                      rowSpan={totalRows}
                                      sx={{ 
                                        px: 1.5, 
                                        py: 1.5,
                                        borderRight: `2px solid ${COLORS.border}`,
                                        verticalAlign: 'middle',
                                        backgroundColor: "#fff0c5",
                                        height: '100%',
                                      }}
                                    >
                                      <Box sx={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        alignItems: 'center',
                                        justifyContent: 'space-evenly',
                                        height: '100%',
                                        minHeight: `${totalRows * 50}px`,
                                      }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap:6, width: '100%' }}>
                                          {filteredPlans.map((plan) => {
                                            const uniqueValidityDays = [...new Set(
                                              plan.packages?.map(pkg => pkg.validityDays).filter(Boolean)
                                            )];
                                            
                                            return (
                                              <Box
                                                key={plan._id}
                                                onClick={() => {
                                                  setSelectedGroup(plan._id);
                                                  setSelectedLeadsPerRange({});
                                                }}
                                                sx={{
                                                  py: 0.8,
                                                  px: 1,
                                                  textAlign: 'center',
                                                  borderRadius: 1.5,
                                                  cursor: "pointer",
                                                  transition: "all 0.2s ease",
                                                  backgroundColor: selectedGroup === plan._id ? COLORS.primary : COLORS.white,
                                                  color: selectedGroup === plan._id ? COLORS.white : COLORS.black,
                                                  fontWeight: selectedGroup === plan._id ? 700 : 600,
                                                  fontSize: TEXT_SIZES.xs,
                                                  border: `1px solid ${selectedGroup === plan._id ? COLORS.primary : COLORS.border}`,
                                                  boxShadow: selectedGroup === plan._id ? `0 2px 6px ${COLORS.shadow}` : 'none',
                                                  "&:hover": {
                                                    backgroundColor: selectedGroup === plan._id ? COLORS.primaryDark : COLORS.lightOrange,
                                                    transform: 'translateX(2px)',
                                                  },
                                                }}
                                              >
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3,  }}> 
                                                  <Typography sx={{ fontSize: TEXT_SIZES.medium, fontWeight: 'inherit' }}>
                                                    {plan.planName}
                                                  </Typography>
                                                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                    <Chip 
                                                      label={`${uniqueValidityDays[0]}Days`} 
                                                      size="small" 
                                                      sx={{ 
                                                        height: 16,
                                                        fontSize: '0.75rem',
                                                        '& .MuiChip-label': { px: 0.5 }
                                                      }} 
                                                    />
                                                  </Box>
                                                </Box>
                                              </Box>
                                            );
                                          })}
                                        </Box>
                                      </Box>
                                    </TableCell>
                                  )}
                                  
                                  {/* Leads Per State - Show only in first row if available */}
                                  {availableLeads.length > 0 && showFirstRow && (
                                    <TableCell 
                                      rowSpan={totalRows}
                                      sx={{ 
                                        // px: 1.5, 
                                        py: 1.5,
                                        borderRight: `2px solid ${COLORS.border}`,
                                        verticalAlign: 'middle',
                                        backgroundColor:  "#fff0c5",
                                      }}
                                    >
                                      <Box sx={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                      }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', spacing: 1, justifyContent:"space-between",gap:4}}>
                                          {availableLeads.map((leadOption) => {
                                            const isSelected = 
                                              selectedLeadsPerRange[`plan-${selectedPlan._id}`] === leadOption ||
                                              (!selectedLeadsPerRange[`plan-${selectedPlan._id}`] && leadOption === availableLeads[0]);

                                            return (
                                              <Box 
                                                key={leadOption}
                                                onClick={() => {
                                                  handleLeadsChange(`plan-${selectedPlan._id}`, leadOption);
                                                }}
                                                sx={{
                                                  py: 0.8,
                                                  px: 1.5,
                                                  borderRadius: 1.5,
                                                  cursor: "pointer",
                                                  transition: "all 0.2s ease",
                                                  backgroundColor: isSelected ? COLORS.secondary : COLORS.white,
                                                  color: isSelected ? COLORS.white : COLORS.black,
                                                  fontWeight: isSelected ? 800 : 700,
                                                  fontSize: TEXT_SIZES.medium,
                                                  border: `1px solid ${isSelected ? COLORS.secondary : COLORS.border}`,
                                                  boxShadow: isSelected ? `0 2px 6px ${COLORS.shadow}` : 'none',
                                                  display: "flex",
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                                  "&:hover": {
                                                    backgroundColor: isSelected ? COLORS.secondaryDark : COLORS.lightGreen,
                                                    transform: 'translateX(2px)',
                                                  },
                                                }}
                                              >
                                                <span>{leadOption}</span>
                                              </Box>
                                            );
                                          })}
                                        </Box>
                                      </Box>
                                    </TableCell>
                                  )}

                               
     {/* Investment Group - Merged cell for same groups */}
{isFirstInGroup && (() => {
  // Get the index of this investment group within the groups array
  const groupIndices = {};
  let currentGroupIndex = 0;
  
  // First pass: calculate indices for each unique investment group
  allPackagesFromPlan.forEach((item) => {
    if (!groupIndices.hasOwnProperty(item.investmentRangeLabel)) {
      groupIndices[item.investmentRangeLabel] = currentGroupIndex;
      currentGroupIndex++;
    }
  });
  
  const groupIdx = groupIndices[item.investmentRangeLabel];
  
  return (
    <TableCell
      rowSpan={rowSpan}
      sx={{
        borderRight: `2px solid ${COLORS.border}`,
        verticalAlign: "middle",
        px: 1,
        // Alternate colors based on group index
        backgroundColor: groupIdx % 2 === 0 ? "#fff0c5" : "#c8e6ac",
      }}
    >
      <Typography
        sx={{
          fontSize: TEXT_SIZES.small,
          fontWeight: 700,
          color: COLORS.black,
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        {item.investmentRangeLabel}
      </Typography>
    </TableCell>
  );
})()}
                                  
                                  {/* Select Checkbox */}
                                  <TableCell sx={{ px: 1, py: 1.5, textAlign: 'center' }}>
  <Checkbox
checked={checkedItems[itemId] || false}
 onChange={(e) => {
  if (e.target.checked) {
   setCheckedItems((prev) => ({
      ...prev,
      [itemId]: true,
    }));

    openSnack(`${item.range} selected`, "success");
 } else {
  setCheckedItems((prev) => ({
    ...prev,
    [itemId]: false,
  }));

  openSnack(`${item.range} deselected`, "info");
}
}}
    disabled={!!selectedListingPlanId}
    size="small"
    sx={{
      p: 0,
      color: COLORS.primary,
      "&.Mui-checked": {
        color: COLORS.secondary,
      },
      "&.Mui-disabled": {
        color: COLORS.grey[400],
      },
    }}
  />
</TableCell>

   {/* Investment Range */}
<TableCell sx={{ px: 1.5, py: 1.5, verticalAlign: 'middle' }}>
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 0,
      minHeight: 20,
    }}
  >
    <Typography
      sx={{
        fontSize: TEXT_SIZES.small,
        fontWeight: 600,
        color: COLORS.black,
        lineHeight: 1.3,
        whiteSpace: 'nowrap',
      }}
    >
      {item.range}
    </Typography>

    {isRecommended ? (
      <Chip
        label="As Per Profile"
        size="small"
        sx={{
          height: 16,
          fontSize: '0.65rem',
          backgroundColor: COLORS.secondary,
          color: COLORS.white,
          fontWeight: 600,
        }}
      />
    ) : !isRecommended && !inPayment && finalToken ? (
      // Only show "Add to business profile" if user is logged in (finalToken exists)
      <Chip
        label="Add to business profile"
        size="small"
        sx={{
          height: 16,
          fontSize: '0.65rem',
          backgroundColor: COLORS.primary,
          color: COLORS.white,
          fontWeight: 600,
          cursor: 'pointer',
        }}
        onClick={() => handleAddInvestmentRange(item.range, item.investmentRangeLabel)}
      />
    ) : (
      // Placeholder to maintain height consistency
      <Box sx={{ height: 16, width: 110 }} />
    )}
  </Box>
</TableCell>

                                  {/* States */}
                                  <TableCell sx={{ px: 1, py: 1.5,
 }}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 0.5,
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: TEXT_SIZES.xl,
                                          color: COLORS.black,
                                          fontWeight: 600,
                                        }}
                                      >
                                        {stateCount}
                                      </Typography>
                                      <Tooltip title="Edit States" arrow>
                                        <IconButton
  size="small"
  onClick={() =>
    handleOpenStateModal(
      item.investmentRangeLabel,
      item.range,
      selectedLeads  // Pass the current selected leads
    )
  }
  sx={{ 
    p: 0.3,
    '&:hover': {
      backgroundColor: COLORS.lightOrange,
    },
  }}
>
  <EditIcon
    sx={{
      fontSize: TEXT_SIZES.small,
      color: COLORS.primary,
    }}
  />
</IconButton>
                                         
                                      </Tooltip>
                                    </Box>
                                  </TableCell>

                                  {/* Price/State */}
                                  {isFirstInGroup && (
                                    <TableCell 
                                      rowSpan={rowSpan}
                                      sx={{ 
                                        px: 1, 
                                        py: 1.5, 
                                        textAlign: 'center',
                                        verticalAlign: 'middle',
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: TEXT_SIZES.xl,
                                          fontWeight: 700,
                                          color: COLORS.primary,
                                        }}
                                      >
                                        ₹{pricePerState.toLocaleString('en-IN')}
                                      </Typography>
                                    </TableCell>
                                  )}

                                  {/* Total Leads */}
                                  {isFirstInGroup && (
                                    <TableCell 
                                      rowSpan={rowSpan}
                                      sx={{ 
                                        px: 1, 
                                        py: 1.5, 
                                        textAlign: 'center',
                                        verticalAlign: 'middle',
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: TEXT_SIZES.xl,
                                          fontWeight: 700,
                                          color: COLORS.black,
                                        }}
                                      >
                                        {groupTotalLeads}
                                      </Typography>
                                    </TableCell>
                                  )}

                                  {/* Total Amount (Pro-Rata Calculations Adjusted) */}
                                  {isFirstInGroup && (
                                    <TableCell 
                                      rowSpan={rowSpan}
                                      sx={{ 
                                        px: 1, 
                                        py: 1.5, 
                                        textAlign: 'right',
                                        verticalAlign: 'middle',
                                        // backgroundColor: COLORS.lightOrange,
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: TEXT_SIZES.xl,
                                          fontWeight: 700,
                                        }}
                                      >
                                        ₹{groupTotalAmount.toLocaleString('en-IN')}
                                      </Typography>
                                    </TableCell>
                                  )}





{/* Action Button - Unified once per Group */}
{isFirstInGroup && (
  <TableCell 
    rowSpan={rowSpan}
    sx={{ 
      px: 1, 
      py: 1.5, 
      textAlign: 'center', 
      verticalAlign: 'middle',
    }}
  >
    {(() => {
      // Get all items in this group
      const itemsInGroup = allPackagesFromPlan.filter(
        (p) => p.investmentRangeLabel === item.investmentRangeLabel
      );

      // Get selected items (where checkbox is checked)
      const selectedItemsInGroup = itemsInGroup.filter((p) => {
        const itemId = `${selectedPlan._id}-${p.investmentRangeLabel}-${p.range}`;
        return checkedItems[itemId];
      });

      const hasSelectedItems = selectedItemsInGroup.length > 0;
      
      return (
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            // Add selected items to cart
            if (!hasSelectedItems) {
              openSnack("Please select at least one investment range to add", "warning");
              return;
            }
            
            // Get the CURRENT selected leads value for this plan
            const currentSelectedLeads = selectedLeadsPerRange[`plan-${selectedPlan._id}`] || 
                                        (availableLeads.length > 0 ? availableLeads[0] : 0);
            
// COLLECT ALL STATES from selected items before adding
const allNewStates = new Set();
const itemsWithStates = [];

selectedItemsInGroup.forEach((selectedItem) => {
  const key = getRangeKey(selectedItem.investmentRangeLabel, selectedItem.range, currentSelectedLeads);
  let states = statesByInvestmentRange[key];
  
  if (!states || states.length === 0) {
    if (!finalToken && detectedState) {
      states = [detectedState];
    } else if (finalToken) {
      states = allStates;
    } else {
      states = [];
    }
  }
  
  states.forEach(state => allNewStates.add(state));
  itemsWithStates.push({ selectedItem, states });
});

// CHECK FOR DUPLICATE STATES within the same selected items (across different ranges)
const allStatesArray = [...allNewStates];
const hasDuplicateWithinSelection = allStatesArray.length !== new Set(allStatesArray).size;

if (hasDuplicateWithinSelection) {
  openSnack(`Cannot add: The same state cannot be selected multiple times within this selection`, "warning");
  return;
}

// CHECK FOR DUPLICATE STATES with existing payment items (across all groups)
const existingStates = new Set();
paymentSummary.forEach((group) => {
  group.items.forEach((item) => {
    item.states.forEach((state) => {
      existingStates.add(state);
    });
  });
});

const duplicateStates = allStatesArray.filter(state => existingStates.has(state));

if (duplicateStates.length > 0) {
  openSnack(`Cannot add State(s), already selected in another investment range. Each state can only be selected once.`, "warning");
  return;
}
            
            // Check if selected items are recommended (only works after login)
            const hasNonRecommendedSelected = finalToken && selectedItemsInGroup.some(
              p => !isFicoInvestmentRange(p.range)
            );
            
            if (hasNonRecommendedSelected) {
              // Get the non-recommended items for the confirmation message
              const nonRecommendedItems = selectedItemsInGroup.filter(p => !isFicoInvestmentRange(p.range));
              const rangeNames = nonRecommendedItems.map(p => p.range).join(', ');
              
              setPendingSelection({
                selectedItemsInGroup,
                selectedPlan,
                rangeNames
              });
              setOpenConfirmDialog(true);
              return;
            }
            
            // Add ALL selected items
            selectedItemsInGroup.forEach((selectedItem) => {
              const itemObject = {
                id: `${selectedPlan._id}-${selectedItem.investmentRangeLabel}-${selectedItem.range}`,
                investmentRangeLabel: selectedItem.investmentRangeLabel,
                range: selectedItem.range,
              };
              
              handleAddSingleToPayment(itemObject, selectedPlan, selectedItem.pkg);
            });
            
            // After adding, uncheck the checkboxes for all items that were added
            setCheckedItems((prev) => {
              const newState = { ...prev };
              selectedItemsInGroup.forEach(addedItem => {
                const itemId = `${selectedPlan._id}-${addedItem.investmentRangeLabel}-${addedItem.range}`;
                delete newState[itemId];
              });
              return newState;
            });
            
            openSnack(
              `${selectedItemsInGroup.length} selected range(s) added to cart`,
              "success"
            );
          }}
          disabled={!!selectedListingPlanId}
          sx={{
            minWidth: 70,
            height: 30,
            fontSize: '0.85rem',
            textTransform: "none",
            fontWeight: 1000,
            borderRadius: 1.5,
            backgroundColor: COLORS.primary,
            color: COLORS.white,
            transition: 'all 0.3s ease',
            "&:hover": {
              backgroundColor: COLORS.primaryDark,
              transform: 'scale(1.05)',
            },
          }}
        >
          Add
        </Button>
      );
    })()}
  </TableCell>
)}
                                </TableRow>
                              );
                            });
                          })()}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                );
              })()}
            </Box>
          ) : (
            <Box
              sx={{
                p: 8,
                textAlign: "center",
                color: COLORS.grey[500],
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 400,
              }}
            >
              <InfoOutlinedIcon sx={{ fontSize: 80, mb: 2, color: COLORS.grey[400] }} />
              <Typography sx={{ fontSize: TEXT_SIZES.xl, fontWeight: 600 }}>
                Select a plan from the table to view investment ranges
              </Typography>
            </Box>
          )}
        </Card>
      </Box>
         {/* LISTING PLANS SECTION */}
    {/* <Box sx={{ mb: 4 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            color: COLORS.black,
            mb: 1,
            fontSize: TEXT_SIZES.xl,
          }}>
           Listing Plans
          </Typography>
          <Divider sx={{ 
            borderColor: COLORS.primary, 
            borderWidth: 2,
            width: 100,
            mb: 2,
          }} />
        </Box>

        {(() => {
          const listingPlans = plans
            .filter(
              (plan) =>
                plan.packages?.length === 1 &&
                plan.planName?.toLowerCase() !== "free"
            )
            .sort(
              (a, b) =>
                (a.packages?.[0]?.amount || 0) - (b.packages?.[0]?.amount || 0)
            );

          const hasInvestmentPlans = paymentSummary.some((g) => !g.isListingPlan);

          return (
            <TableContainer 
              component={Paper} 
              elevation={0}
              sx={{ 
                border: `1px solid ${COLORS.border}`,
                borderRadius: 2,
                boxShadow: `0 2px 8px ${COLORS.shadow}`,
                overflow: 'visible',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ 
                    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
                  }}>
                    <TableCell sx={{ 
                      fontWeight: 700, 
                      fontSize: TEXT_SIZES.medium,
                      color: COLORS.white,
                      py: 2,
                    }}>
                      Plan Name
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 700, 
                      fontSize: TEXT_SIZES.medium,
                      color: COLORS.white,
                      py: 2,
                    }}>
                      Validity
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 700, 
                      fontSize: TEXT_SIZES.medium,
                      color: COLORS.white,
                      py: 2,
                    }}>
                      Amount
                    </TableCell>
                    <TableCell align="center" sx={{ 
                      fontWeight: 700, 
                      fontSize: TEXT_SIZES.medium,
                      color: COLORS.white,
                      py: 2,
                    }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listingPlans.map((plan, index) => {
                    const pkg = plan.packages?.[0] || {};
                    const groupKey = `listing-${plan._id}`;
                    const isAdded = paymentSummary.some((g) => g.groupKey === groupKey);
                    const hasOtherListingPlan = paymentSummary.some(
                      (g) => g.isListingPlan && g.groupKey !== groupKey
                    );
                    const disableAdd = hasInvestmentPlans || hasOtherListingPlan;
const handleAddListingPlan = () => {
  const groupKey = `listing-${plan._id}`;
  setPaymentSummary((prev) => {
    if (prev.some((g) => g.groupKey === groupKey)) {
      openSnack("Already added", "info");
      return prev;
    }
    openSnack(`${plan.planName} added to cart`, "success");
    setTimeout(() => scrollToPaymentSummary(), 300);
    return [
      ...prev,
      {
        groupKey,
        planId: plan._id,
        planName: plan.planName,
        investmentRangeLabel: pkg.investmentRangeLabel || "Paid Listing",
        validityDays: pkg.validityDays,
        pricePerState: pkg.amount,
        uniqueStates: [],
        totalStates: 0,
        amount: pkg.amount,
        totalLeads: pkg.totalLeads,
        items: [],
        isListingPlan: true,
      },
    ];
  });
  
  // Mark as moved to payment immediately
  setMovedGroupKeys((prev) => {
    if (!prev.includes(groupKey)) {
      return [...prev, groupKey];
    }
    return prev;
  });
  
  setSelected((prev) => ({ ...prev, [groupKey]: true }));
  setSelectedListingPlanId(plan._id);
};

                    return (
                      <TableRow
                        key={plan._id}
                        sx={{
                          backgroundColor: isAdded ? COLORS.lightGreen : (index % 2 === 0 ? COLORS.white : COLORS.grey[50]),
                          borderLeft: `4px solid ${isAdded ? COLORS.secondary : 'transparent'}`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: isAdded ? COLORS.lightGreen : COLORS.lightOrange,
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <TableCell sx={{ py: 2 }}>
                          <Typography sx={{ 
                            fontSize: TEXT_SIZES.medium, 
                            fontWeight: 600,
                            color: COLORS.black,
                          }}>
                            {plan.planName}
                          </Typography>
                        </TableCell>
                        
                        <TableCell sx={{ py: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CalendarMonthRoundedIcon sx={{ 
                              fontSize: TEXT_SIZES.large, 
                              color: COLORS.primary,
                            }} />
                            <Typography sx={{ 
                              fontSize: TEXT_SIZES.medium, 
                              fontWeight: 500,
                              color: COLORS.black,
                            }}>
                              {pkg.validityDays} Days
                            </Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell sx={{ py: 2 }}>
                          <Typography sx={{ 
                            fontSize: TEXT_SIZES.large, 
                            fontWeight: 700,
                            color: COLORS.primary,
                          }}>
                            ₹{(pkg.amount || 0).toLocaleString('en-IN')}
                          </Typography>
                        </TableCell>
                        
                        <TableCell align="center" sx={{ py: 2 }}>
                          <Button
                            variant={isAdded ? "outlined" : "contained"}
                            size="medium"
                            endIcon={isAdded ? <Remove /> : <AddIcon />}
                            disabled={!isAdded && disableAdd}
                            onClick={isAdded ? handleRemoveListingPlan : handleAddListingPlan}
                            sx={{
                              minWidth: 110,
                              height: 40,
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: 700,
                              fontSize: TEXT_SIZES.medium,
                              backgroundColor: isAdded ? 'transparent' : COLORS.primary,
                              color: isAdded ? COLORS.primary : COLORS.white,
                              borderColor: COLORS.primary,
                              borderWidth: 2,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                backgroundColor: isAdded ? COLORS.lightOrange : COLORS.primaryDark,
                                borderColor: COLORS.primaryDark,
                                transform: 'scale(1.05)',
                              },
                              '&:disabled': {
                                opacity: 0.5,
                              },
                            }}
                          >
                            {isAdded ? "Remove" : "Add"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          );
        })()}

        <Box sx={{ 
          mt: 2, 
          p: 2, 
          backgroundColor: COLORS.lightOrange,
          borderRadius: 2,
          border: `1px solid ${COLORS.border}`,
        }}>
          <Typography sx={{ 
            fontSize: TEXT_SIZES.small,
            color: COLORS.black,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}>
            <InfoOutlinedIcon sx={{ fontSize: TEXT_SIZES.large, color: COLORS.primary }} />
            Select recommended packages to proceed
          </Typography>
        </Box>
      </Box> */}

      


      {/* REACTIVE CHECKOUT & REDESIGNED TABLE PAYMENT SUMMARY SECTION */}
{(paymentSummary.filter(g => movedGroupKeys.includes(g.groupKey)).length > 0 || paymentSummary.length > 0) && (
  <>
    {/* Checkout Summary Strip */}
 <Box
  sx={{
    position: 'fixed',
    bottom: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    
    width: {
      xs: '95%',
      sm: '90%',
      md: '80%',
      lg: '70%',
    },

    zIndex: 1300,

    p: 2.5,
    backgroundColor: COLORS.white,
    borderRadius: 3,
    border: `1px solid ${COLORS.border}`,

    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 2,

    boxShadow: `0 10px 30px ${COLORS.shadow}`,
    backdropFilter: 'blur(10px)',

    animation: `${bounceAnimation} 2s infinite`,
    transition: 'all 0.3s ease',

    '&:hover': {
      animationPlayState: 'paused',
      transform: 'translateX(-50%) scale(1.02)',
    },
  }}

>
      <Box>
        <Typography sx={{ fontSize: TEXT_SIZES.small, color: COLORS.grey[600], fontWeight: 500 }}>
          Total Payable (for added items)
        </Typography>
        <Typography sx={{ fontSize: TEXT_SIZES.xxl, fontWeight: 800, color: COLORS.secondaryDark }}>
          ₹{paymentSummary
            .filter(g => movedGroupKeys.includes(g.groupKey))
            .reduce((acc, curr) => acc + curr.amount, 0)
            .toLocaleString('en-IN')}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleProceedToPayment}
          sx={{
            backgroundColor: COLORS.primary,
            color: COLORS.white,
            fontSize: TEXT_SIZES.large,
            fontWeight: 700,
            px: 5,
            py: 1.5,
            borderRadius: 2,
            '&:hover': {
              backgroundColor: COLORS.primaryDark,
              transform: 'scale(1.02)',
            },
          }}
        >
          Proceed to Payment
        </Button>
      </Box>
    </Box>
    



<Box ref={paymentSummaryRef} sx={{ mb: 4 }}>
  <Box sx={{ mb: 2 }}>
    <Typography variant="h5" sx={{ 
      fontWeight: 700, 
      color: COLORS.black,
      mb: 1,
      fontSize: TEXT_SIZES.xl,
    }}>
      Selected Plan Summary
    </Typography>
    <Divider sx={{ 
      borderColor: COLORS.secondary, 
      borderWidth: 2,
      width: 100,
      mb: 2,
    }} />
  </Box>

  <TableContainer 
    component={Paper} 
    elevation={0}
    sx={{ 
      border: `1px solid ${COLORS.border}`,
      borderRadius: 2,
      boxShadow: `0 4px 12px ${COLORS.shadow}`,
      overflow: 'hidden',
      mb: 3
    }}
  >
    <Table>
      <TableHead>
        <TableRow sx={{ 
          background: `linear-gradient(135deg, ${COLORS.secondary} 0%, ${COLORS.secondaryDark} 100%)`,
        }}>
          <TableCell sx={{ fontWeight: 700, fontSize: TEXT_SIZES.medium, color: COLORS.white, py: 2 }}>
            Selected Plan
          </TableCell>
          <TableCell sx={{ fontWeight: 700, fontSize: TEXT_SIZES.medium, color: COLORS.white, py: 2 }}>
            Investment Group
          </TableCell>
          <TableCell sx={{ fontWeight: 700, fontSize: TEXT_SIZES.medium, color: COLORS.white, py: 2 }}>
            Investment Range
          </TableCell>
          <TableCell sx={{ fontWeight: 700, fontSize: TEXT_SIZES.medium, color: COLORS.white, py: 2 }}>
            Validity
          </TableCell>
          <TableCell align="center" sx={{ fontWeight: 700, fontSize: TEXT_SIZES.medium, color: COLORS.white, py: 2 }}>
            Total States
          </TableCell>
          <TableCell align="center" sx={{ fontWeight: 700, fontSize: TEXT_SIZES.medium, color: COLORS.white, py: 2 }}>
            Total Leads
          </TableCell>
          <TableCell align="right" sx={{ fontWeight: 700, fontSize: TEXT_SIZES.medium, color: COLORS.white, py: 2 }}>
            Subtotal
          </TableCell>
          <TableCell align="center" sx={{ fontWeight: 700, fontSize: TEXT_SIZES.medium, color: COLORS.white, py: 2 }}>
            Actions
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {paymentSummary && paymentSummary.length > 0 ? (
          paymentSummary.map((group, groupIndex) => {
            const isMoved = movedGroupKeys.includes(group.groupKey);
            
            // Get price per state from the group
            const pricePerState = group.pricePerState || 0;
            
            // Calculate total states from uniqueStates or items
            const totalStates = group.uniqueStates?.length || 
                              group.totalStates || 
                              (group.items ? group.items.reduce((sum, item) => sum + (item.stateCount || 0), 0) : 0) || 0;
            
            // Calculate total leads
            const totalLeads = group.totalLeads || 
                              (group.items ? group.items.reduce((sum, item) => sum + ((item.stateCount || 0) * (item.selectedLeads || 0)), 0) : 0) || 0;
            
            // Calculate total amount
            const totalAmount = group.amount || 
                              (pricePerState * totalStates) || 
                              (group.items ? group.items.reduce((sum, item) => sum + (item.totalAmount || 0), 0) : 0) || 0;
            
            const validityDays = group.validityDays || (group.items && group.items[0] ? group.items[0].validityDays : 0);
            
            // Skip rendering if no items in group
            if (!group.items || group.items.length === 0) return null;
            
            return (
              <TableRow
                key={group.groupKey || groupIndex}
                sx={{
                  backgroundColor: groupIndex % 2 === 0 ? COLORS.white : COLORS.grey[50],
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: COLORS.lightGreen,
                  },
                }}
              >
                {/* Selected Plan */}
                <TableCell sx={{ verticalAlign: "top", py: 2 }}>
                  <Typography
                    sx={{
                      fontSize: TEXT_SIZES.medium,
                      fontWeight: 700,
                      color: COLORS.black,
                    }}
                  >
                    {group.planName || (group.items[0] ? group.items[0].planName : 'Plan Name')}
                  </Typography>
                </TableCell>

                {/* Investment Group */}
                <TableCell sx={{ verticalAlign: "top", py: 2 }}>
                  <Chip
                    label={group.investmentRangeLabel || (group.items[0] ? group.items[0].investmentRangeLabel : 'Group')}
                    size="small"
                    sx={{
                      fontSize: "0.7rem",
                      height: 24,
                      backgroundColor: (() => {
                        // Get all unique investment groups for this specific plan
                        const planData = plans.find(p => p._id === group.planId);
                        if (planData) {
                          const allGroups = [];
                          planData.packages?.forEach((pkg) => {
                            if (pkg.investmentRangeLabel && !allGroups.includes(pkg.investmentRangeLabel)) {
                              allGroups.push(pkg.investmentRangeLabel);
                            }
                          });
                          
                          const groupIndices = {};
                          let currentGroupIndex = 0;
                          allGroups.forEach((label) => {
                            if (!groupIndices.hasOwnProperty(label)) {
                              groupIndices[label] = currentGroupIndex;
                              currentGroupIndex++;
                            }
                          });
                          
                          const currentLabel = group.investmentRangeLabel || (group.items[0] ? group.items[0].investmentRangeLabel : '');
                          const groupIdx = groupIndices[currentLabel] || 0;
                          return groupIdx % 2 === 0 ? "#fff0c5" : "#c8e6ac";
                        }
                        return "#c8e6ac";
                      })(),
                      color: COLORS.black,
                      fontWeight: 600,
                    }}
                  />
                </TableCell>

                {/* Investment Range Multiple Rows */}
                <TableCell sx={{ p: 0 }}>
                  {group.items.map((item, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        px: 2,
                        py: 2,
                        borderBottom: idx !== group.items.length - 1 ? `1px solid ${COLORS.border}` : "none",
                      }}
                    >
                      <Chip
                        label={item.range}
                        size="small"
                        sx={{
                          fontSize: "0.72rem",
                          height: 26,
                          backgroundColor: COLORS.lightOrange,
                          color: COLORS.black,
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  ))}
                </TableCell>

                {/* Validity */}
                <TableCell sx={{ verticalAlign: "top", py: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarMonthRoundedIcon
                      sx={{
                        fontSize: TEXT_SIZES.large,
                        color: COLORS.grey[600],
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: TEXT_SIZES.medium,
                        fontWeight: 600,
                      }}
                    >
                      {validityDays} Days
                    </Typography>
                  </Box>
                </TableCell>

                {/* Total States */}
                <TableCell align="center" sx={{ verticalAlign: "top", py: 2 }}>
                  <Typography
                    sx={{
                      fontSize: TEXT_SIZES.medium,
                      fontWeight: 700,
                    }}
                  >
                    {totalStates}
                  </Typography>
                </TableCell>

                {/* Total Leads */}
                <TableCell align="center" sx={{ verticalAlign: "top", py: 2 }}>
                  <Typography
                    sx={{
                      fontSize: TEXT_SIZES.medium,
                      fontWeight: 700,
                    }}
                  >
                    {totalLeads.toLocaleString("en-IN")}
                  </Typography>
                </TableCell>

                {/* Total Amount / Subtotal */}
                <TableCell align="right" sx={{ verticalAlign: "top", py: 2 }}>
                  <Typography
                    sx={{
                      fontSize: TEXT_SIZES.large,
                      fontWeight: 700,
                      color: COLORS.secondaryDark,
                    }}
                  >
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </Typography>
                  {pricePerState > 0 && totalStates > 0 && (
                    <Typography
                      sx={{
                        fontSize: "0.65rem",
                        color: COLORS.grey[600],
                        mt: 0.5,
                      }}
                    >
                      (₹{pricePerState.toLocaleString("en-IN")} × {totalStates} states)
                    </Typography>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell align="center" sx={{ verticalAlign: "top", py: 2 }}>
                  {!isMoved ? (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleMoveToPayment(group.groupKey)}
                      sx={{
                        minWidth: 120,
                        height: 34,
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: 2,
                        backgroundColor: COLORS.primary,
                        "&:hover": {
                          backgroundColor: COLORS.primaryDark,
                        },
                      }}
                    >
                      Add to Payment
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        setMovedGroupKeys((prev) =>
                          prev.filter((key) => key !== group.groupKey)
                        )
                      }
                      sx={{
                        minWidth: 120,
                        height: 34,
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: 2,
                        borderColor: COLORS.primary,
                        color: COLORS.primary,
                        "&:hover": {
                          borderColor: COLORS.primaryDark,
                          color: COLORS.primaryDark,
                          backgroundColor: COLORS.lightOrange,
                        },
                      }}
                    >
                      Remove from Payment
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })
        ) : null}
        
        {/* Show empty state if no items */}
        {(!paymentSummary || paymentSummary.length === 0) && (
          <TableRow>
            <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
              <Typography sx={{ color: COLORS.grey[500], fontSize: TEXT_SIZES.medium }}>
                No items added yet. Select investment ranges and click "Add" to proceed.
              </Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
</Box>


  </>
)}
      {/* State Selection Modal */}
      <Dialog 
        open={openStateModal} 
        onClose={handleCloseStateModal} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: `3px solid ${COLORS.primary}`,
            boxShadow: `0 8px 32px ${COLORS.shadow}`,
          }
        }}
      >
        <DialogTitle sx={{ 
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
          fontSize: TEXT_SIZES.large,
          fontWeight: 700,
          color: COLORS.white,
          py: 2.5,
        }}>
          {!finalToken ? (
  <>Select States ({selectedStates.size} of {ALL_INDIA_STATES.length})</>
) : (
  <>Select States ({selectedStates.size} of {allStates.length})</>
)}
        </DialogTitle>
  <DialogContent dividers sx={{ 
  maxHeight: 500, 
  overflow: "auto",
  p: 2,
  '&::-webkit-scrollbar': {
    width: 8,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
}}>
  {(() => {
    const statesToDisplay = getStatesToDisplay();
    return statesToDisplay.length > 0 ? (
      <>
        {/* Global Actions */}
        <Box sx={{ display: "flex", gap: 1.5, mb: 2.5, justifyContent: "flex-end" }}>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={handleSelectAll} 
            disabled={selectedStates.size === statesToDisplay.length}
            sx={{
              borderColor: COLORS.primary,
              color: COLORS.primary,
              fontSize: TEXT_SIZES.small,
              borderWidth: 2,
              borderRadius: 1.5,
              fontWeight: 600,
              px: 2,
              '&:hover': {
                borderColor: COLORS.primaryDark,
                backgroundColor: COLORS.lightOrange,
                borderWidth: 2,
              },
            }}
          >
            Select All ({statesToDisplay.length})
          </Button>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={handleClearAll} 
            disabled={selectedStates.size === 0}
            sx={{
              borderColor: COLORS.primary,
              color: COLORS.primary,
              fontSize: TEXT_SIZES.small,
              borderWidth: 2,
              borderRadius: 1.5,
              fontWeight: 600,
              px: 2,
              '&:hover': {
                borderColor: COLORS.primaryDark,
                backgroundColor: COLORS.lightOrange,
                borderWidth: 2,
              },
            }}
          >
            Clear All
          </Button>
        </Box>

        {/* Accordion Sections by Region */}
        <Box>
          {renderStatesByRegion()}
        </Box>
      </>
    ) : (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography sx={{ 
          fontSize: TEXT_SIZES.medium, 
          color: COLORS.grey[600],
          mb: 3,
        }}>
          No expansion states found
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => { 
            router.push("/brandDashboard/brand_listing_controller"); 
            handleCloseStateModal(); 
          }}
          sx={{
            backgroundColor: COLORS.primary,
            color: COLORS.white,
            fontSize: TEXT_SIZES.medium,
            fontWeight: 600,
            px: 3,
            py: 1,
            borderRadius: 2,
            '&:hover': {
              backgroundColor: COLORS.primaryDark,
            },
          }}
        >
          Add States
        </Button>
      </Box>
    );
  })()}
</DialogContent>
        <DialogActions sx={{ 
          justifyContent: "space-between", 
          px: 3, 
          py: 2,
          backgroundColor: COLORS.grey[50],
        }}>
          <Button 
            onClick={handleCloseStateModal} 
            sx={{
              color: COLORS.grey[700],
              fontSize: TEXT_SIZES.medium,
              fontWeight: 600,
              '&:hover': {
                backgroundColor: COLORS.grey[200],
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveStates} 
            variant="contained" 
            disabled={selectedStates.size === 0}
            sx={{
              backgroundColor: COLORS.primary,
              color: COLORS.white,
              fontSize: TEXT_SIZES.medium,
              fontWeight: 600,
              px: 3,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: COLORS.primaryDark,
              },
              '&:disabled': {
                opacity: 0.5,
              },
            }}
          >
            Save Selection
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snack.open} 
        autoHideDuration={3000} 
        onClose={closeSnack} 
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert 
          onClose={closeSnack} 
          severity={snack.severity} 
          variant="filled"
          elevation={6}
          sx={{
            fontSize: TEXT_SIZES.medium,
            backgroundColor: snack.severity === 'success' ? COLORS.secondary : COLORS.primary,
            color: COLORS.white,
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: `0 4px 12px ${COLORS.shadow}`,
          }}
        >
          {snack.message}
        </MuiAlert>
      </Snackbar>

      <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
{/* Confirmation Dialog for adding non-profile investment ranges */}
<Dialog
  open={openConfirmDialog}
  onClose={() => setOpenConfirmDialog(false)}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 3,
      border: `2px solid ${COLORS.primary}`,
      boxShadow: `0 8px 32px ${COLORS.shadow}`,
    }
  }}
>
  <DialogTitle sx={{
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
    fontSize: TEXT_SIZES.large,
    fontWeight: 700,
    color: COLORS.white,
    // py: 2.5,
  }}>
    Investment Range Not in Profile
  </DialogTitle>
  
  <DialogContent sx={{ pt: 3, pb: 2 }}>
    <Typography sx={{ fontSize: TEXT_SIZES.medium, color: COLORS.black, mb: 2,mt:2 }}>
      Your business profile doesn't include this investment range       <Typography sx={{ 
        fontSize: TEXT_SIZES.medium, 
        textAlign : 'center',
        fontWeight: 600, 
        color: COLORS.primaryDark,
      }}>
        {pendingSelection?.rangeNames}
      </Typography>
 

    </Typography>
    
   
      
    
    <Typography sx={{ fontSize: TEXT_SIZES.medium, color: COLORS.black, mb: 1 }}>
      Would you like to add this/these investment range to your business profile?
    </Typography>
    
    <Typography sx={{ fontSize: TEXT_SIZES.small, color: COLORS.grey[600], mt: 1 }}>
      Adding will allow you to select these ranges for your franchise plans.
    </Typography>
  </DialogContent>
  
  <DialogActions sx={{ 
    justifyContent: "space-between", 
    px: 3, 
    py: 2,
    backgroundColor: COLORS.grey[50],
  }}>
    <Button 
      onClick={() => {
        setOpenConfirmDialog(false);
        setPendingSelection(null);
        openSnack("You can add this investment range to your business profile later", "info");
      }}
      sx={{
        color: COLORS.grey[700],
        fontSize: TEXT_SIZES.medium,
        fontWeight: 600,
        '&:hover': {
          backgroundColor: COLORS.grey[200],
        },
      }}
    >
      No, Cancel
    </Button>
    
    <Button 
      onClick={() => {
        // Open the add to profile dialog for the first non-recommended range
        const firstNonRecommended = pendingSelection?.selectedItemsInGroup?.find(
          p => !isFicoInvestmentRange(p.range)
        );
        
        if (firstNonRecommended) {
          handleAddInvestmentRange(firstNonRecommended.range, firstNonRecommended.investmentRangeLabel);
        }
        
        setOpenConfirmDialog(false);
        setPendingSelection(null);
      }}
      variant="contained"
      sx={{
        backgroundColor: COLORS.primary,
        color: COLORS.white,
        fontSize: TEXT_SIZES.medium,
        fontWeight: 600,
        px: 3,
        borderRadius: 2,
        '&:hover': {
          backgroundColor: COLORS.primaryDark,
        },
      }}
    >
      Yes, Add to Profile
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
};

export default PackageSelection;