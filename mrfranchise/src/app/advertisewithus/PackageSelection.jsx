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
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import LoginPage from "@/Components/LoginPage/LoginPage.jsx";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import LayersIcon from "@mui/icons-material/Layers";
import GroupIcon from "@mui/icons-material/Group";  
import BarChartIcon from "@mui/icons-material/BarChart";
import GridViewIcon from "@mui/icons-material/GridView";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";

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
    "Chandigarh",
    "Delhi",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Ladakh",
    "Punjab",
    "Rajasthan",
    "Uttar Pradesh",
    "Uttarakhand",
  ],

  South: [
    "Andhra Pradesh",
    "Karnataka",
    "Kerala",
    "Lakshadweep",
    "Puducherry",
    "Tamil Nadu",
    "Telangana",
  ],

  East: [
    "Andaman and Nicobar Islands",
    "Bihar",
    "Jharkhand",
    "Odisha",
    "West Bengal",
  ],

  West: [
    "Dadra and Nagar Haveli and Daman and Diu",
    "Goa",
    "Gujarat",
    "Maharashtra",
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
const [draftStatesByRange, setDraftStatesByRange] = useState({});
const [openStatesTooltip, setOpenStatesTooltip] = useState(false);
const [tooltipStates, setTooltipStates] = useState([]);
const [openRemoveConfirmDialog, setOpenRemoveConfirmDialog] = useState(false);
const [itemToRemove, setItemToRemove] = useState(null);
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

const getRangeKey = useCallback((investmentRangeLabel, range, planId = null) => {
  if (planId) {
    return `${planId}__${investmentRangeLabel}__${range}`;
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

// const handleSelectAll = useCallback(() => {
//   const states = getStatesToDisplay();
//   const blocked = getAlreadySelectedStatesInOtherRanges();

//   const selectableStates = states.filter(state => !blocked.has(state));

//   if (selectableStates.length > 0) {
//     setSelectedStates(new Set(selectableStates));
//     openSnack(`Selected ${selectableStates.length} states`, "success");
//   } else {
//     openSnack("No states available to select", "warning");
//   }
// }, [getStatesToDisplay, getAlreadySelectedStatesInOtherRanges, openSnack]);

// Replace the hasDuplicateStates function (around line 200)

// let hasCrossGroupConflict = false;
// let conflictingStates = [];

// selectedItemsInGroup.forEach((selectedItem) => {
//   const key = getRangeKey(selectedItem.investmentRangeLabel, selectedItem.range);
//   let states = statesByInvestmentRange[key];
//   if (!states || states.length === 0) {
//     if (!finalToken && detectedState) states = [detectedState];
//     else if (finalToken) states = allStates;
//     else states = [];
//   }

//   // Only check against items from DIFFERENT investment range labels
//   paymentSummary.forEach((group) => {
//     if (group.investmentRangeLabel === selectedItem.investmentRangeLabel) return; // same group, skip
//     group.items.forEach((existingItem) => {
//       if (existingItem.investmentRangeLabel === selectedItem.investmentRangeLabel) return;
//       existingItem.states.forEach((state) => {
//         if (states.includes(state) && !conflictingStates.includes(state)) {
//           conflictingStates.push(state);
//           hasCrossGroupConflict = true;
//         }
//       });
//     });
//   });
// });

// if (hasCrossGroupConflict) {
//   openSnack(`Cannot add: State(s) "${conflictingStates.join(', ')}" already used in a different investment group.`, "warning");
//   return;
// }

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
          // Include group.planId in the key to make it unique per plan
          const key = getRangeKey(item.investmentRangeLabel, item.range, group.planId);
          let states = statesByInvestmentRange[key];
          
          // CRITICAL FIX: Don't fallback to existing item.states if statesByInvestmentRange returns empty
          // If user cleared all states, that should be respected
          if (!states || states.length === 0) {
            // Check if the key exists in statesByInvestmentRange (even if empty array)
            if (statesByInvestmentRange.hasOwnProperty(key)) {
              states = statesByInvestmentRange[key]; // This will be [] if user cleared
            } else {
              // Only use defaults if user has never edited this range
              if (!finalToken && detectedState) {
                states = [detectedState];
              } else if (finalToken) {
                states = allStates;
              } else {
                states = [];
              }
            }
          }
          
          return {
            ...item,
            states: states || [],
            stateCount: (states || []).length,
          };
        });
        
        const allStatesSet = new Set();
        updatedItems.forEach((item) => {
          item.states.forEach((state) => allStatesSet.add(state));
        });
        const uniqueStates = Array.from(allStatesSet);
        const totalUniqueStates = uniqueStates.length;

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

const handleOpenStateModal = useCallback((investmentRangeLabel, range, planId = null) => {
  const key = getRangeKey(investmentRangeLabel, range, planId);
  setCurrentEditingRange(key);
  
  // Check if this range is already committed to payment summary
  const committedItem = paymentSummary
    .flatMap(g => g.items)
    .find(item => {
      const itemKey = getRangeKey(item.investmentRangeLabel, item.range, planId);
      return itemKey === key;
    });
    
  // Priority: committed states > draft states > saved states > default
  const committedStates = committedItem?.states;
  const draftStates = draftStatesByRange[key];
  const savedStates = statesByInvestmentRange[key];
  const statesToPreselect = committedStates || draftStates || savedStates;
  
  if (statesToPreselect && statesToPreselect.length > 0) {
    setSelectedStates(new Set(statesToPreselect));
  } else {
    if (!finalToken && detectedState) {
      setSelectedStates(new Set([detectedState]));
    } else {
      setSelectedStates(new Set());
    }
  }
  setOpenStateModal(true);
}, [getRangeKey, paymentSummary, draftStatesByRange, statesByInvestmentRange, finalToken, detectedState]);

const handleShowStates = useCallback((event, statesList) => {
  setTooltipStates(statesList);
  setTooltipAnchorEl(event.currentTarget);
  setOpenStatesTooltip(true);
}, []);

const handleCloseStatesTooltip = useCallback(() => {
  setOpenStatesTooltip(false);
  setTooltipAnchorEl(null);
  setTooltipStates([]);
}, []);
  const handleCloseStateModal = useCallback(() => {
    setOpenStateModal(false);
  }, []);

// const handleStateCheckboxChange = useCallback(
//   (state) => {
//     const blocked = getAlreadySelectedStatesInOtherRanges();

//     if (blocked.has(state) && !selectedStates.has(state)) {
//       openSnack(`"${state}" is already used in another investment range`, "warning");
//       return;
//     }

//     setSelectedStates((prev) => {
//       const next = new Set(prev);
//       if (next.has(state)) next.delete(state);
//       else next.add(state);
//       return next;
//     });
//   },
//   [getAlreadySelectedStatesInOtherRanges, selectedStates, openSnack]
// );
const getAlreadySelectedStatesInOtherRanges = useCallback(() => {
  const selectedInOtherRanges = new Set();
  if (!currentEditingRange) return selectedInOtherRanges;

  // Extract the unique key for the current range being edited
  // Key format is either: "planId__investmentRangeLabel__range" or "investmentRangeLabel__range"
  const currentKey = currentEditingRange;
  
  // Get the current planId if it exists in the key
  const currentPlanId = currentKey.includes('__') && currentKey.split('__').length === 3 
    ? currentKey.split('__')[0] 
    : null;

  paymentSummary.forEach((group) => {
    group.items.forEach((item) => {
      // For each item in payment summary, get its states
      // Skip if this is the same plan and same range (current editing item)
      const itemKey = getRangeKey(item.investmentRangeLabel, item.range, group.planId);
      
      // If this is the exact same item we're editing, skip (don't block its own states)
      if (itemKey === currentKey) return;
      
      // Block all states from other items (different plan or different range)
      // This ensures states already used anywhere else cannot be selected again
      item.states.forEach((state) => selectedInOtherRanges.add(state));
    });
  });

  return selectedInOtherRanges;
}, [currentEditingRange, paymentSummary, getRangeKey]);
const handleSaveStates = useCallback(() => {
  const blocked = getAlreadySelectedStatesInOtherRanges();
  
  // Filter out any states that are already used elsewhere
  const selectedArray = Array.from(selectedStates).filter(state => !blocked.has(state));
  
  if (selectedArray.length === 0 && selectedStates.size > 0) {
    openSnack("Cannot save: Selected states are already used in other investment ranges", "warning");
    return;
  }
  
  // Debug log to see what's being saved
  console.log(`Saving states for ${currentEditingRange}:`, selectedArray);

  // Update statesByInvestmentRange - REPLACE completely, don't merge
  const updated = {
    ...statesByInvestmentRange,
    [currentEditingRange]: selectedArray,
  };
  setStatesByInvestmentRange(updated);
  localStorage.setItem("investmentRangeStates", JSON.stringify(updated));

  // Update paymentSummary if this range is already committed
  setPaymentSummary((prev) =>
    prev.map((group) => {
      // Check if this group contains the range we're editing
      let groupHasRange = false;
      const updatedItems = group.items.map((item) => {
        const itemKey = getRangeKey(item.investmentRangeLabel, item.range, group.planId);
        if (itemKey !== currentEditingRange) return item;
        
        groupHasRange = true;
        
        return {
          ...item,
          states: [...selectedArray],
          stateCount: selectedArray.length,
          totalLeads: item.selectedLeads * selectedArray.length,
          totalAmount: group.pricePerState * selectedArray.length,
        };
      });

      if (!groupHasRange) return group;

      const allStatesSet = new Set();
      updatedItems.forEach((item) => {
        item.states.forEach((state) => allStatesSet.add(state));
      });
      const uniqueStates = Array.from(allStatesSet);
      const totalUniqueStates = uniqueStates.length;

      const leadsDataKey = `${group.planId}_${group.investmentRangeLabel}`;
      const availableLeads = leadsDropdownData[leadsDataKey] || [];
      const minLeads = availableLeads.length > 0 ? Math.min(...availableLeads) : 1;
      const divisor = minLeads > 0 ? minLeads : 1;
      const selectedLeads = updatedItems[0]?.selectedLeads || 0;
      const newAmount = group.isListingPlan
        ? group.amount
        : (group.pricePerState / divisor) * totalUniqueStates * selectedLeads;

      return {
        ...group,
        items: updatedItems,
        uniqueStates: uniqueStates,
        totalStates: totalUniqueStates,
        amount: newAmount,
        totalLeads: totalUniqueStates * selectedLeads,
      };
    })
  );

  openSnack(
    selectedArray.length === 0
      ? "All states cleared"
      : `Saved ${selectedArray.length} state${selectedArray.length > 1 ? "s" : ""}`,
    selectedArray.length === 0 ? "info" : "success"
  );
  handleCloseStateModal();
}, [selectedStates, statesByInvestmentRange, currentEditingRange, getRangeKey, leadsDropdownData, openSnack, handleCloseStateModal, getAlreadySelectedStatesInOtherRanges]);


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
    
    // Store brandOwnerId
    if (brandData.brandOwnerId) {
      localStorage.setItem("brandOwnerId", brandData.brandOwnerId);
    } else if (brandData._id) {
      localStorage.setItem("brandOwnerId", brandData._id);
    }
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
  
  const leadsDataKey = `${selectedPlan._id}_${investmentRangeLabel}`;
  const availableLeads = leadsDropdownData[leadsDataKey] || [];

let selectedLeads = selectedLeadsPerRange[`plan-${selectedPlan._id}-${investmentRangeLabel}`];
  if (!selectedLeads && availableLeads.length > 0) {
    selectedLeads = availableLeads[0];
  } else if (!selectedLeads) {
    selectedLeads = 0;
  }
const key = getRangeKey(investmentRangeLabel, range, selectedPlan._id);
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
  
  // ✅ REMOVED: hasDuplicateStates check — no longer block here
  // State overlap within same investment group is allowed
  
  const minLeads = availableLeads.length > 0 ? Math.min(...availableLeads) : 1;
  const divisor = minLeads > 0 ? minLeads : 1;

  const newItem = {
    id,
    investmentRangeLabel,
    range,
    stateCount: states.length,
    states,
    selectedLeads,
    totalLeads: selectedLeads * states.length,
    totalAmount: pricePerState * states.length,
  };

const groupKey = `${selectedPlan._id}__${selectedPkg?.validityDays}__${pricePerState}__${investmentRangeLabel}__${range}`;  setPaymentSummary((prev) => {
    const existingGroup = prev.find((g) => g.groupKey === groupKey);
    let newSummary;
    
    if (existingGroup) {
      const existingItemIndex = existingGroup.items.findIndex((ex) => ex.id === newItem.id);

      if (existingItemIndex !== -1) {
        const updatedItems = existingGroup.items.map((it) => ({
          ...it,
          selectedLeads: newItem.selectedLeads,
          totalLeads: newItem.selectedLeads * it.stateCount,
          totalAmount: pricePerState * it.stateCount,
          ...(it.id === newItem.id ? {
            states: newItem.states,
            stateCount: newItem.stateCount,
          } : {}),
        }));

        const uniqueStates = getUniqueStatesAcrossRanges(updatedItems);
        const totalUniqueStates = uniqueStates.length;
        const newAmount = (pricePerState / divisor) * totalUniqueStates * newItem.selectedLeads;

        newSummary = prev.map((g) =>
          g.groupKey === groupKey
            ? { ...g, items: updatedItems, uniqueStates, totalStates: totalUniqueStates, amount: newAmount, totalLeads: totalUniqueStates * newItem.selectedLeads }
            : g
        );
      } else {
        const updatedItems = [...existingGroup.items, newItem].map((it) => ({
          ...it,
          selectedLeads: newItem.selectedLeads,
          totalLeads: newItem.selectedLeads * it.stateCount,
        }));

        const uniqueStates = getUniqueStatesAcrossRanges(updatedItems);
        const totalUniqueStates = uniqueStates.length;
        const newAmount = (pricePerState / divisor) * totalUniqueStates * newItem.selectedLeads;

        newSummary = prev.map((g) =>
          g.groupKey === groupKey
            ? { ...g, items: updatedItems, uniqueStates, totalStates: totalUniqueStates, amount: newAmount, totalLeads: totalUniqueStates * newItem.selectedLeads }
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
      if (!prevKeys.includes(groupKey)) return [...prevKeys, groupKey];
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
// useEffect(() => {
//   if (finalToken && ficoInvestmentRanges.length > 0 && filteredPlans.length > 0) {
//     const hasAutoSelected = localStorage.getItem(`autoSelected_${finalBrandUUID}`);
    
//     if (!hasAutoSelected) {
//       const timer = setTimeout(() => {
//         autoSelectFICORanges();
//         localStorage.setItem(`autoSelected_${finalBrandUUID}`, 'true');
//       }, 1000);
      
//       return () => clearTimeout(timer);
//     }
//   }
// }, [finalToken, ficoInvestmentRanges, filteredPlans, finalBrandUUID, autoSelectFICORanges]);

  
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

  
const createBrandPackages = async (brandOwnerId, packages, token) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/brand-packages-plans/create`, {
      method: 'PATCH',  // Change from 'POST' to 'PATCH'
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        brandOwnerId,
        packages,
      }),
    });
    
    // Check if response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating brand packages:", error);
    throw error;
  }
};

// Add this transformation function
const transformPaymentToAPIFormat = useCallback((paymentGroups) => {
  // Group by planId
  const plansMap = new Map();
  
  paymentGroups.forEach((group) => {
    if (!plansMap.has(group.planId)) {
      plansMap.set(group.planId, {
        packagesType: group.isListingPlan ? "listing" : "investment",
        packagesName: group.planName,
        planUniqueId: group.planId,
        InvestmetPackages: [],
      });
    }
    
    const plan = plansMap.get(group.planId);
    
    // Transform each item in the group
    group.items.forEach((item) => {
      // Skip listing plans as they have different structure
      if (item.isListingPlan) {
        plan.InvestmetPackages.push({
          PackageName: item.investmentRangeLabel,
          Amount: group.pricePerState,
          Validity: group.validityDays,
          TotalLeads: "-",
          States: item.states || ["ALL STATES"],
          InvestmentRange: item.range,
          InvestmentRangeLabel: item.investmentRangeLabel,
          LeadsPerState: "-",
        });
      } else {
        // For investment ranges
        plan.InvestmetPackages.push({
          PackageName: item.investmentRangeLabel,
          Amount: group.pricePerState,
          Validity: group.validityDays,
          TotalLeads: item.selectedLeads * (item.stateCount || 0),
          States: item.states || [],
          InvestmentRange: item.range,
          InvestmentRangeLabel: item.investmentRangeLabel,
          LeadsPerState: item.selectedLeads,
        });
      }
    });
  });
  
  return Array.from(plansMap.values());
}, []);


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
  
  // Store the selected packages data for after payment
  const packagesData = transformPaymentToAPIFormat(movedGroups);
  localStorage.setItem("pendingPackages", JSON.stringify({
    packages: packagesData,
    timestamp: Date.now(),
    totalAmount: movedGroups.reduce((acc, g) => acc + (g.amount || 0), 0)
  }));
  
  // Store payment summary for display
  localStorage.setItem("paymentSummary", JSON.stringify(movedGroups));
  
  // Navigate to payment page
  router.push("/payment");
}, [finalToken, openSnack, paymentSummary, movedGroupKeys, router, transformPaymentToAPIFormat]);


const getStateCountForRange = useCallback((investmentRangeLabel, range, planId = null) => {
  const key = getRangeKey(investmentRangeLabel, range, planId);
  
  if (Object.prototype.hasOwnProperty.call(statesByInvestmentRange, key)) {
    return statesByInvestmentRange[key].length;
  }
  
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

const handleLeadsChange = useCallback((planGroupKey, newLeadsValue) => {
  setSelectedLeadsPerRange((prev) => ({
    ...prev,
    [planGroupKey]: newLeadsValue,
  }));

  // Extract the range from the key
  const withoutPrefix = planGroupKey.replace('plan-', '');
  const parts = withoutPrefix.split('-');
  const actualPlanId = parts[0];
  const investmentRangeLabel = parts[1];
  const specificRange = parts.slice(2).join('-'); // Get the full range name

  setPaymentSummary((prev) =>
    prev.map((group) => {
      // Match by checking if the group contains this specific range
      const hasRange = group.items.some(item => item.range === specificRange);
      if (group.planId !== actualPlanId) return group;
      if (!hasRange) return group;

      const updatedItems = group.items.map((item) => {
        if (item.range !== specificRange) return item;
        
        return {
          ...item,
          selectedLeads: newLeadsValue,
          totalLeads: newLeadsValue * item.stateCount,
          totalAmount: group.pricePerState * item.stateCount,
        };
      });

      const allStatesSet = new Set();
      updatedItems.forEach((item) => item.states.forEach((s) => allStatesSet.add(s)));
      const uniqueStates = Array.from(allStatesSet);
      const totalUniqueStates = uniqueStates.length;

      const leadsDataKey = `${group.planId}_${group.investmentRangeLabel}`;
      const availableLeads = leadsDropdownData[leadsDataKey] || [];
      const minLeads = availableLeads.length > 0 ? Math.min(...availableLeads) : 1;
      const divisor = minLeads > 0 ? minLeads : 1;
      
      // Calculate total amount across all items (each with their own leads count)
      let totalAmount = 0;
      updatedItems.forEach(item => {
        totalAmount += (group.pricePerState / divisor) * item.stateCount * item.selectedLeads;
      });

      return {
        ...group,
        items: updatedItems,
        uniqueStates,
        totalStates: totalUniqueStates,
        amount: totalAmount,
        totalLeads: updatedItems.reduce((sum, item) => sum + (item.selectedLeads * item.stateCount), 0),
      };
    })
  );

  openSnack(`Leads updated to ${newLeadsValue}`, "info");
}, [leadsDropdownData, openSnack]);

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
  return groupIdx % 2 === 0 ?"#fff0c5" : "#fff0c5";
}, [selectedGroup, filteredPlans]);

const handleRemoveListingPlan = useCallback((planId) => {
  const groupKey = `listing-${planId}`;
  setPaymentSummary((prev) => {
    const newSummary = prev.filter((g) => g.groupKey !== groupKey);
    if (newSummary.length === 0 && typeof window !== "undefined") {
      localStorage.removeItem("paymentSummaryDraft");
      localStorage.removeItem("movedGroupKeys");
    }
    return newSummary;
  });
  // ✅ Also remove from movedGroupKeys
  setMovedGroupKeys((prev) => prev.filter((key) => key !== groupKey));
  setSelected((prev) => {
    const copy = { ...prev };
    delete copy[groupKey];
    return copy;
  });
  openSnack("Listing plan removed from cart", "info");
}, [openSnack]);





const handleSelectAll = useCallback(() => {
  const states = getStatesToDisplay();
  const blocked = getAlreadySelectedStatesInOtherRanges();
  const selectableStates = states.filter(state => !blocked.has(state));
  if (selectableStates.length > 0) {
    setSelectedStates(new Set(selectableStates));
    openSnack(`Selected ${selectableStates.length} states`, "success");
  } else {
    openSnack("No states available to select", "warning");
  }
}, [getStatesToDisplay, getAlreadySelectedStatesInOtherRanges, openSnack]);

const handleClearAll = useCallback(() => {
  const blocked = getAlreadySelectedStatesInOtherRanges();
  setSelectedStates((prev) => {
    const next = new Set();
    prev.forEach(state => {
      if (blocked.has(state)) next.add(state);
    });
    return next;
  });
  openSnack("Cleared all selectable states", "info");
}, [getAlreadySelectedStatesInOtherRanges, openSnack]);

const handleStateCheckboxChange = useCallback((state) => {
  const blocked = getAlreadySelectedStatesInOtherRanges();
  
  // Check if the state is already used in ANY other item
  if (blocked.has(state)) {
    openSnack(`"${state}" is already used in another investment range. Please select a different state.`, "warning");
    return;
  }
  
  setSelectedStates((prev) => {
    const next = new Set(prev);
    if (next.has(state)) next.delete(state);
    else next.add(state);
    return next;
  });
}, [getAlreadySelectedStatesInOtherRanges, openSnack]);

const renderStatesByRegion = () => {
  const statesToDisplay = getStatesToDisplay();
  const alreadySelectedStates = getAlreadySelectedStatesInOtherRanges();
  
  return Object.entries(INDIA_STATES).map(([region, states]) => {
    const availableStates = states.filter(state => 
      statesToDisplay.includes(state)
    );
    
    if (availableStates.length === 0) return null;
    
    const selectedCount = availableStates.filter(state => selectedStates.has(state)).length;
    const availableToSelectCount = availableStates.filter(state => !alreadySelectedStates.has(state)).length;
    
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
              label={`${selectedCount}/${availableToSelectCount} available`}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.7rem',
                backgroundColor: selectedCount === availableToSelectCount ? COLORS.secondary : COLORS.grey[400],
                color: COLORS.white,
                fontWeight: 600,
              }}
            />
          </Box>
          
         <Box
  component="span"
  onClick={(e) => {
    e.stopPropagation();
    const newSet = new Set(selectedStates);
    const allInRegion = availableStates;
    
    // Only select states that are NOT already selected in ANY other range
    const selectableStates = allInRegion.filter(state => !alreadySelectedStates.has(state));
    const allSelected = selectableStates.every(state => selectedStates.has(state));
    
    if (allSelected) {
      selectableStates.forEach(state => newSet.delete(state));
      openSnack(`Deselected all selectable states in ${region}`, "info");
    } else {
      selectableStates.forEach(state => newSet.add(state));
      openSnack(`Selected ${selectableStates.length} states in ${region}`, "success");
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
  Select All Available ({availableToSelectCount})
</Box>
        </AccordionSummary>
        
        <AccordionDetails sx={{ p: 2 }}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 1,
          }}>

{availableStates.map((state) => {
  const isDisabled = alreadySelectedStates.has(state);
  const isChecked = selectedStates.has(state);
  
  // Get tooltip message
  let tooltipMessage = "";
  if (isDisabled) {
    tooltipMessage = "This state is already used in  investment range and cannot be selected again";
  }
  
  return (
    <Tooltip key={state} title={tooltipMessage} arrow placement="top">
      <FormControlLabel
        control={
          <Checkbox 
            checked={isChecked} 
            onChange={() => {
              if (!isDisabled) {
                handleStateCheckboxChange(state);
              } else {
                openSnack(tooltipMessage, "warning");
              }
            }}
            disabled={isDisabled}
            sx={{
              color: COLORS.primary,
              '&.Mui-checked': {
                color: COLORS.secondary,
              },
              '&.Mui-disabled': {
                color: COLORS.grey[400],
              },
            }}
          />
        }
        label={
          <Typography sx={{ 
            fontSize: TEXT_SIZES.medium, 
            color: isDisabled ? COLORS.grey[500] : COLORS.black,
            fontWeight: isChecked ? 600 : 400,
            textDecoration: isDisabled ? 'line-through' : 'none',
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
          backgroundColor: isChecked ? COLORS.lightGreen : 'transparent',
          width: '100%',
          opacity: isDisabled ? 0.6 : 1,
          '&:hover': {
            backgroundColor: !isDisabled && (isChecked ? COLORS.lightGreen : COLORS.lightOrange),
          },
          '& .MuiFormControlLabel-label': {
            width: 'calc(100% - 35px)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }
        }}
      />
    </Tooltip>
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
    
    }}>
   

    {/* INVESTMENT RANGE PLANS SECTION */}
<Box sx={{ 
  mb: 4,
  display: 'flex',
  justifyContent: 'center',
}}>
  <Card
    elevation={0}
    sx={{
      border: `1px solid ${COLORS.border}`,
      borderRadius: 2,
      overflow: "visible",
      width: '100%',
      maxWidth: '1300px',  // Add this to limit card width
    }}
  >
          {selectedGroup ? (
            <Box>
            {(() => {
  const selectedPlan = filteredPlans.find(p => p._id === selectedGroup);
  
  if (!selectedPlan) return null;

const firstPkg = selectedPlan.packages?.[0];

// Merge leads from ALL packages and deduplicate
const availableLeads = [...new Set(
  selectedPlan.packages?.flatMap((pkg) => {
    const key = `${selectedPlan._id}_${pkg.investmentRangeLabel}`;
    return leadsDropdownData[key] || [];
  }) || []
)].sort((a, b) => a - b);

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

  // const selectedLeads = selectedLeadsPerRange[`plan-${selectedPlan._id}`] || 
  //                      (availableLeads.length > 0 ? availableLeads[0] : 0);
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
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, py: 1.5, borderBottom: `1px solid ${COLORS.border}` }}>
  <Button
    variant="outlined"
    size="small"
    startIcon={<AddIcon />}
    onClick={() => {
      setPendingSelection(null); // clear any previous selection
      setOpenConfirmDialog(true);
    }}
    sx={{
      borderColor: COLORS.primary,
      color: COLORS.primary,
      fontWeight: 700,
      fontSize: TEXT_SIZES.small,
      borderWidth: 2,
      borderRadius: 2,
      textTransform: 'none',
      px: 2,
      '&:hover': {
        backgroundColor: COLORS.lightOrange,
        borderColor: COLORS.primaryDark,
        borderWidth: 2,
      },
    }}
  >
    Add New Investment Range
  </Button>
</Box>
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
                                fontSize: TEXT_SIZES.medium,
                                color: COLORS.white,
                                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
                                px: 1.5,
                                py: 1.5,
                                width: '5%',
                                textAlign: 'center',
                              }}
                            >
                              Select Plan
                            </TableCell>
                            
                            {/* Leads Per State Column */}
                        {/* <TableCell
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
</TableCell> */}
                            {/* Investment Group Column */}
                          <TableCell
  sx={{
    fontWeight: 700,
    fontSize: TEXT_SIZES.medium,
    color: COLORS.white,
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
    width: '4%',
    textAlign: 'center',
    lineHeight: 1.3,
  }}
>
  Investment Group
  {/* <br />
  <Typography
    component="span"
    sx={{
      fontWeight: 700,
    fontSize: TEXT_SIZES.small,
    color: COLORS.white,
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
    width: '6%',
    textAlign: 'center',
    lineHeight: 1.3,
    }}
  >
    Lead Per State
  </Typography> */}
</TableCell>
                            
                            {/* Select Checkbox Column */}
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontSize: TEXT_SIZES.medium,
                                color: COLORS.white,
                                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
                                px: 1,
                                py: 1.5,
                                width: '1%',
                                textAlign: 'center',
                              }}
                            >
                              Select
                            </TableCell>
                            
                            {/* Investment Range Column */}
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontSize: TEXT_SIZES.medium,
                                color: COLORS.white,
                                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
                                px: 1.5,
                                py: 1.5,
                                width: '3%',
                                textAlign: 'center',
                              }}
                            >
                              Investment Range
                            </TableCell>
                            
                            {/* States Column */}
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontSize: TEXT_SIZES.medium,
                                color: COLORS.white,
                                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
                                px: 1,
                                py: 1.5,
                                width: '1%',
                                textAlign: 'center',
                              }}
                            >
                              States 
                            </TableCell>
                            
                            {/* Price/State Column */}
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontSize: TEXT_SIZES.medium,
                                color: COLORS.white,
                                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
                                px: 1,
                                py: 1.5,
                                width: '2.3%',
                                textAlign: 'center',
                              }}
                            >
                              Price per State
                            </TableCell>
                            
                            {/* Total Leads Column */}
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontSize: TEXT_SIZES.medium,
                                color: COLORS.white,
                                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
                                px: 1,
                                py: 1.5,
                                width: '1.8%',
                                textAlign: 'center',
                              }}
                            >
                              Total Leads
                            </TableCell>
                            
                            {/* Total Amount Column */}
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontSize: TEXT_SIZES.medium,
                                color: COLORS.white,
                                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
                                px: 1,
                                py: 1.5,
                                width: '2%',
                                textAlign: 'center',
                              }}
                            >
                              Total Amount
                            </TableCell>
                            
                            {/* Action Column */}
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontSize: TEXT_SIZES.medium,
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
                           // Filter to only show profile-matching ranges
const profilePackages = ficoInvestmentRanges.length > 0
  ? allPackagesFromPlan.filter(item => isFicoInvestmentRange(item.range))
  : allPackagesFromPlan;
const labelCounts = {};
profilePackages.forEach((item) => {
  labelCounts[item.investmentRangeLabel] = 
    (labelCounts[item.investmentRangeLabel] || 0) + 1;
});

                            const totalRows = profilePackages.length;
                            const renderedLabels = new Set();
                            let firstRow = true;

                        return profilePackages.map((item, idx) => {
                              const itemId = `${selectedPlan._id}-${item.investmentRangeLabel}-${item.range}`;
                              const isRecommended = isFicoInvestmentRange(item.range);
                              const stateCount = getStateCountForRange(
                                item.investmentRangeLabel,
                                item.range,
                                 selectedPlan._id
                                //  selectedLeads 
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

const rangeSpecificKey = `plan-${selectedPlan._id}-${item.investmentRangeLabel}-${item.range}`;
const groupSelectedLeads = selectedLeadsPerRange[rangeSpecificKey] ||
  (availableLeads.length > 0 ? availableLeads[0] : 0);
const groupTotalLeads = groupSelectedLeads * uniqueGroupStatesCount;
const groupTotalAmount = (pricePerState / divisor) * uniqueGroupStatesCount * groupSelectedLeads;

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
                              const isFirstRowOfTable = idx === 0;
                              if (firstRow) firstRow = false;

                            return (
<TableRow
  key={itemId}
  sx={{
    backgroundColor: getRowBackgroundColor(item.investmentRangeLabel, inPayment, idx),
    transition: 'all 0.3s ease',
    '& td': { borderBottom: 'none' },
  }}
>
                                  {/* Plan Selection - Show only in first row */}
                                   {isFirstRowOfTable && (
                                    <TableCell 
                                      rowSpan={totalRows}
                                      sx={{ 
                                        px: 1.5, 
                                        py: 1.5,
                                        borderRight: `2px solid ${COLORS.border}`,
                                        verticalAlign: 'middle',
                                        backgroundColor: "#fff6de",
                                        height: '100%',
                                         borderRight: 'none',
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
                                        <Box sx={{ display: 'flex', flexDirection: 'column',gap:2, width: '75%' }}>
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
                                               <Typography
  sx={{
    fontSize: TEXT_SIZES.medium,
    fontWeight: 600,
    color: "black",
  }}
>
  {uniqueValidityDays[0]} Days
</Typography>
                                                  <Typography sx={{ fontSize: TEXT_SIZES.xs, fontWeight: 'inherit' }}>
                                                    {plan.planName}
                                                  </Typography>

                                                
                                                </Box>
                                              </Box>
                                            );
                                          })}
                                        </Box>
                                      </Box>
                                    </TableCell>
                                  )}
                                  
                                  {/* Leads Per State - Show only in first row if available */}
                                {/* {isFirstRowOfTable && (
  <TableCell 
    rowSpan={totalRows}
    sx={{ 
      py: 1.5,
      borderRight: `2px solid ${COLORS.border}`,
      verticalAlign: 'middle',
      backgroundColor: "#fff6de",
        borderRight: 'none',
    }}
  >
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
    }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', spacing: 1, justifyContent:"space-between", gap:5}}>
     {availableLeads.length > 0 ? (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
    {availableLeads.map((leadOption) => {
      const isSelected = selectedLeadsPerRange[`plan-${selectedPlan._id}`] === leadOption ||
                        (!selectedLeadsPerRange[`plan-${selectedPlan._id}`] && leadOption === availableLeads[0]);
      
      return (
        <Box
          key={leadOption}
          onClick={() => handleLeadsChange(`plan-${selectedPlan._id}`, leadOption)}
          sx={{
            py: 1.2,
            px: 1.5,
            borderRadius: 1.5,
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.2s ease',
            backgroundColor: isSelected ? COLORS.secondary : COLORS.white,
            color: isSelected ? COLORS.white : COLORS.black,
            fontWeight: isSelected ? 700 : 600,
            fontSize: TEXT_SIZES.medium,
            border: `1px solid ${isSelected ? COLORS.secondary : COLORS.border}`,
            boxShadow: isSelected ? `0 2px 6px ${COLORS.shadow}` : 'none',
            '&:hover': {
              backgroundColor: isSelected ? COLORS.secondaryDark : COLORS.lightOrange,
              transform: 'translateX(2px)',
            },
          }}
        >
          {leadOption}
        </Box>
      );
    })}
  </Box>
) : (
  <Typography sx={{ color: COLORS.grey[500], fontSize: TEXT_SIZES.small, textAlign: 'center' }}>
    No leads available
  </Typography>
)}
      </Box>
    </Box>
  </TableCell>
)} */}

{/* Investment Group - Merged cell for same groups */}
{isFirstInGroup && (() => {
  const groupIndices = {};
  let currentGroupIndex = 0;

  allPackagesFromPlan.forEach((packageItem) => {
    if (!groupIndices.hasOwnProperty(packageItem.investmentRangeLabel)) {
      groupIndices[packageItem.investmentRangeLabel] = currentGroupIndex;
      currentGroupIndex++;
    }
  });

  const groupIdx = groupIndices[item.investmentRangeLabel];

  return (
    <TableCell
      rowSpan={rowSpan}
     sx={{ 
  px: 0.5, py: 0.4, textAlign: 'center', height:"20%",backgroundColor:"#fff6de", width: '3%',
  borderTop: isFirstInGroup && !isFirstRowOfTable ? `2px solid #b5d7b6` : 'none',
}}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          // gap: 1,
          width: "100%",
    
        }}
      >
        {/* Investment Label */}
        <Typography
          sx={{
            fontSize: TEXT_SIZES.medium,
            fontWeight: 700,
            color: COLORS.black,
            lineHeight: 1.2,
            textAlign: "center",
          }}
        >
          {item.investmentRangeLabel}
        </Typography>
        <Typography sx={{
          fontSize:TEXT_SIZES.xs,
          mt:1,mb:1,
        }}>Select Leads Per State</Typography>

        {/* Leads Options */}
        {availableLeads.length > 0 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              flexWrap: "wrap",
         
            }}
          >
{availableLeads.map((leadOption) => {
  const rangeSpecificKey = `plan-${selectedPlan._id}-${item.investmentRangeLabel}-${item.range}`;
  const isSelected = selectedLeadsPerRange[rangeSpecificKey] === leadOption ||
    (!selectedLeadsPerRange[rangeSpecificKey] && leadOption === availableLeads[0]);

  return (
    <Box
      key={leadOption}
      onClick={() => handleLeadsChange(rangeSpecificKey, leadOption)}
      sx={{
        px: 1.5,
        py: 0.7,
        borderRadius: 1.5,
        cursor: "pointer",
        textAlign: "center",
        transition: "all 0.2s ease",
        backgroundColor: isSelected ? COLORS.secondary : COLORS.white,
        color: isSelected ? COLORS.white : COLORS.black,
        fontWeight: isSelected ? 700 : 600,
        fontSize: "0.95rem",
        border: `1px solid ${isSelected ? COLORS.secondary : COLORS.border}`,
        whiteSpace: "nowrap",
        "&:hover": {
          backgroundColor: isSelected ? COLORS.secondaryDark : COLORS.lightOrange,
        },
      }}
    >
      {leadOption}
    </Box>
  );
})}
          </Box>
        ) : (
          <Typography
            sx={{
              color: COLORS.grey[500],
              fontSize: TEXT_SIZES.small,
            }}
          >
            No leads
          </Typography>
        )}
      </Box>
    </TableCell>
  );
})()}
                                  
                                  {/* Select Checkbox */}
<TableCell sx={{ 
  px: 0.2, 
  py: 0.2, 
  textAlign: 'center', 
  width: '10px',
  
  borderTop: isFirstInGroup && !isFirstRowOfTable ? `2px solid #b5d7b6` : 'none',
}}>
  <Tooltip 
    title={inPayment ? "Already added to cart" : "Select to add to cart"}
    arrow
  >
    <span>
      <Checkbox
        checked={checkedItems[itemId] || false}
        onChange={(e) => {
          if (inPayment) {
            openSnack(`${item.range} is already in your cart`, "warning");
            return;
          }
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
        disabled={inPayment || !!selectedListingPlanId}
        size="small"
        sx={{
          p: 0,
          m: 0,
          color: COLORS.primary,
          "&.Mui-checked": {
            color: COLORS.secondary,
          },
          "&.Mui-disabled": {
            color: COLORS.grey[400],
          },
        }}
      />
    </span>
  </Tooltip>
</TableCell>

   {/* Investment Range */}
<TableCell sx={{
  px: 0.5, py: 0.4, verticalAlign: 'middle', width: '3%',
  borderTop: isFirstInGroup && !isFirstRowOfTable ? `2px solid #b5d7b6` : 'none',
}}>  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 0,
      height: 10,
    
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

    {/* {isRecommended ? (
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
    )} */}
  </Box>
</TableCell>

                                  {/* States */}
                              {/* States */}
<TableCell sx={{ 
  px: 0.5, py: 0.4, height:"20%",
  borderTop: isFirstInGroup && !isFirstRowOfTable ? `2px solid #b5d7b6` : 'none',
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
                                          fontSize: TEXT_SIZES.medium,
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
      selectedPlan._id 
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
      px: 0.5, py: 0.4, textAlign: 'center', verticalAlign: 'middle',
      borderTop: !isFirstRowOfTable ? `2px solid #b5d7b6` : 'none',
    }}
  >
                                      <Typography
                                        sx={{
                                          fontSize: TEXT_SIZES.xl,
                                          fontWeight: 700,
                                          color: COLORS.black,
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
      px: 0.5, py: 0.4, textAlign: 'center', verticalAlign: 'middle',width:"4%",
      borderTop: !isFirstRowOfTable ? `2px solid #b5d7b6` : 'none',
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
      px: 0.5, py: 0.4, textAlign: 'center', verticalAlign: 'middle',width:"4%",
      borderTop: !isFirstRowOfTable ? `2px solid #b5d7b6` : 'none',
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







{/* Action Button - Single button for entire table */}
{isFirstRowOfTable && (
  <TableCell 
    rowSpan={totalRows}  
    sx={{ 
      px: 0.5, 
      py: 0.4, 
      textAlign: 'center', 
      verticalAlign: 'middle',
    }}
  >
    <Button
      variant="contained"
      size="medium"
      // disabled={!!selectedListingPlanId}
      onClick={() => {
        const allCheckedItems = profilePackages.filter((p) => {
          const id = `${selectedPlan._id}-${p.investmentRangeLabel}-${p.range}`;
          return checkedItems[id];
        });

        if (allCheckedItems.length === 0) {
          openSnack("Please select at least one investment range to add", "warning");
          return;
        }

        // Check for duplicate items within the SAME PLAN ONLY
        const existingItemsInSamePlan = paymentSummary
          .filter(group => group.planId === selectedPlan._id)
          .flatMap(group => group.items);

        const newItemsToAdd = allCheckedItems.filter(selectedItem => {
          // Only check within the SAME plan and SAME investment range label
          return !existingItemsInSamePlan.some(existingItem =>
            existingItem.range === selectedItem.range &&
            existingItem.investmentRangeLabel === selectedItem.investmentRangeLabel
          );
        });

        if (newItemsToAdd.length === 0) {
          const allRangeNames = allCheckedItems.map(r => r.range).join(', ');
          openSnack(`${allRangeNames} already in cart for this plan.`, "warning");
          // Uncheck the items so user knows they're already added
          setCheckedItems((prev) => {
            const newState = { ...prev };
            allCheckedItems.forEach(item => {
              const id = `${selectedPlan._id}-${item.investmentRangeLabel}-${item.range}`;
              delete newState[id];
            });
            return newState;
          });
          return;
        }

        // REMOVED: Cross-group conflict check - states can be reused across different ranges
        // Different investment ranges can have the same states - they are separate purchases

        // Non-recommended check
        const hasNonRecommended = finalToken && newItemsToAdd.some(p => !isFicoInvestmentRange(p.range));
        if (hasNonRecommended) {
          const rangeNames = newItemsToAdd
            .filter(p => !isFicoInvestmentRange(p.range))
            .map(p => p.range)
            .join(', ');
          setPendingSelection({ selectedItemsInGroup: newItemsToAdd, selectedPlan, rangeNames });
          setOpenConfirmDialog(true);
          return;
        }

        // Add all new items
        newItemsToAdd.forEach((selectedItem) => {
          handleAddSingleToPayment(
            {
              id: `${selectedPlan._id}-${selectedItem.investmentRangeLabel}-${selectedItem.range}`,
              investmentRangeLabel: selectedItem.investmentRangeLabel,
              range: selectedItem.range,
            },
            selectedPlan,
            selectedItem.pkg
          );
        });

        // Uncheck added items
        setCheckedItems((prev) => {
          const newState = { ...prev };
          newItemsToAdd.forEach(addedItem => {
            const id = `${selectedPlan._id}-${addedItem.investmentRangeLabel}-${addedItem.range}`;
            delete newState[id];
          });
          return newState;
        });

        openSnack(`${newItemsToAdd.length} range(s) added to cart`, "success");
      }}
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
<Box sx={{ 
  mb: 4,
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
}}>
  <Box sx={{ 
    width: '100%',
    maxWidth: '1100px',  // Same maxWidth as the investment table
  }}>


  {/* Plans */}
  {(() => {
    const listingPlans = plans
      .filter(
        (plan) =>
          plan.packages?.length === 1 &&
          plan.planName?.toLowerCase() !== "free"
      )
      .sort(
        (a, b) =>
          (a.packages?.[0]?.amount || 0) -
          (b.packages?.[0]?.amount || 0)
      );

    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: 2.5,
          mb:4
        }}
      >
        {listingPlans.map((plan, index) => {
          const pkg = plan.packages?.[0] || {};
          const groupKey = `listing-${plan._id}`;

          const isAdded = paymentSummary.some(
            (g) => g.groupKey === groupKey
          );

       
const handleAddListingPlan = (plan, pkg) => {
  const groupKey = `listing-${plan._id}`;
  
  // Check if any listing plan already exists in paymentSummary
  const existingListingPlan = paymentSummary.some(
    (g) => g.isListingPlan === true
  );
  
  if (existingListingPlan) {
    openSnack("You can select only one listing plan at a time.", "warning");
    return;
  }
  
  // Get all available states
  const allAvailableStates = finalToken ? allStates : ALL_INDIA_STATES;
  const stateCount = allAvailableStates.length;
  
  // Create a single item with "ALL INVESTMENT RANGE" text
  const listingItem = {
    id: `listing-${plan._id}-item`,
    investmentRangeLabel: "ALL INVESTMENT RANGE",
    range: "ALL INVESTMENT RANGE",
    stateCount: stateCount,
    states: ["ALL STATES"],
    selectedLeads: "-",
    totalLeads: "-",
    totalAmount: pkg.amount || 0,
    pricePerState: pkg.amount || 0,
    isListingPlan: true
  };

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
  
  // ✅ IMPORTANT: Add the group key to movedGroupKeys
  setMovedGroupKeys((prev) => {
    if (!prev.includes(groupKey)) {
      return [...prev, groupKey];
    }
    return prev;
  });
};

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
                backgroundColor: COLORS.white,
                overflow: "hidden",
                transition: "0.3s ease",

                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 20px ${COLORS.shadow}`,
                },
              }}
            >
              {/* Most Popular */}
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

              <CardContent
                sx={{
                  p: 3,
                  pt: index === 1 ? 5 : 3,
                }}
              >
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
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
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
                          sx={{
                            color: "#ff9800",
                            fontSize: 32,
                          }}
                        />
                      ) : (
                        <StarBorderRoundedIcon
                          sx={{
                            color: COLORS.primary,
                            fontSize: 32,
                          }}
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

                      {/* Bottom Info */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          flexWrap: "wrap",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.8,
                          }}
                        >
                          <CalendarMonthRoundedIcon
                            sx={{
                              fontSize: 18,
                              color: COLORS.grey[600],
                            }}
                          />

                          <Typography
                            sx={{
                              fontWeight: 500,
                              color: COLORS.grey[700],
                            }}
                          >
                            {pkg.validityDays} Days
                          </Typography>
                        </Box>

                        <Typography
                          sx={{
                            fontWeight: 800,
                            fontSize: TEXT_SIZES.large,
                            color:
                              index === 1
                                ? "#ff9800"
                                : COLORS.primary,
                          }}
                        >
                          ₹
                          {(pkg.amount || 0).toLocaleString(
                            "en-IN"
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Button */}
                  <Button
                    variant="contained"
                    endIcon={
                      isAdded ? <RemoveIcon /> : <AddIcon />
                    }
                   onClick={
    isAdded
      ? () => handleRemoveListingPlan(plan._id)
      : () => handleAddListingPlan(plan, pkg)  // ← Pass both plan and pkg
  }
                    sx={{
                      minWidth: 145,
                      height: 46,
                      borderRadius: 2.5,
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: TEXT_SIZES.medium,
                      boxShadow: "none",
                      background:
                        index === 1
                          ? "linear-gradient(135deg,#ff9800 0%,#ff6f00 100%)"
                          : `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,

                      "&:hover": {
                        boxShadow: "none",
                        opacity: 0.95,
                      },
                    }}
                  >
                    {isAdded ? "Remove Plan" : "Add to Plan"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    );
  })()}

</Box>
</Box>

      


      {/* REACTIVE CHECKOUT & REDESIGNED TABLE PAYMENT SUMMARY SECTION */}
{(paymentSummary.filter(g => movedGroupKeys.includes(g.groupKey)).length > 0 || paymentSummary.length > 0) && (
  <>
  


{/* Checkout Summary Strip */}
{(paymentSummary.filter(g => movedGroupKeys.includes(g.groupKey)).length > 0 || paymentSummary.length > 0) && (() => {
  const movedGroups = paymentSummary.filter(g => movedGroupKeys.includes(g.groupKey));
  const totalPlans = new Set(movedGroups.map(g => g.planId)).size;
  const totalInvestmentGroups = new Set(
    movedGroups.filter(g => !g.isListingPlan).map(g => g.investmentRangeLabel)
  ).size;
  const totalRanges = movedGroups.filter(g => !g.isListingPlan).reduce((acc, g) => acc + (g.items?.length || 0), 0);
  const totalLeads = movedGroups.reduce((acc, g) => acc + (g.totalLeads || 0), 0);
  const totalAmount = movedGroups.reduce((acc, g) => acc + (g.amount || 0), 0);
  
  // Collect all unique validity days
  const validityDaysList = [...new Set(
    movedGroups.map(g => g.validityDays).filter(Boolean)
  )].sort((a, b) => a - b);
  
  // Format validity display - show single value or range
  let validityDisplay = '';
  if (validityDaysList.length === 0) {
    validityDisplay = 'N/A';
  } else if (validityDaysList.length === 1) {
    validityDisplay = `${validityDaysList[0]} Day${validityDaysList[0] > 1 ? 's' : ''}`;
  } else {
    // Show as range: 30-365 Days
    validityDisplay = `${Math.min(...validityDaysList)}-${Math.max(...validityDaysList)} Days`;
  }

  const statCards = [
    { label: 'Plans', value: totalPlans, iconBg: '#FFF3E0', iconColor: '#E68A00', icon: <LayersIcon sx={{ fontSize: 17 }} /> },
    { label: 'Investment Groups', value: totalInvestmentGroups, iconBg: '#E8F5E9', iconColor: '#3D8E40', icon: <GridViewIcon sx={{ fontSize: 17 }} /> },
    { label: 'Investment Ranges', value: totalRanges, iconBg: '#E3F2FD', iconColor: '#185FA5', icon: <BarChartIcon sx={{ fontSize: 17 }} /> },
    { label: 'Total Leads', value: totalLeads.toLocaleString('en-IN'), iconBg: '#EDE7F6', iconColor: '#534AB7', icon: <GroupIcon sx={{ fontSize: 17 }} /> },
    { label: 'Validity', value: validityDisplay, iconBg: '#E1F5FE', iconColor: '#0F6E56', icon: <CalendarMonthRoundedIcon sx={{ fontSize: 17 }} /> },
  ];

  return (
<Box
  sx={{
    position: 'fixed',
    bottom: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    width: { xs: '98%', md: '90%', lg: '80%' },
    zIndex: 1300,
    backgroundColor: COLORS.white,
    borderRadius: 3,
    border: `1px solid ${COLORS.border}`,
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    animation: `${bounceAnimation} 2s infinite`,
    display: 'flex',
    flexDirection: 'column', // 👈 IMPORTANT
    gap: 2,
    px: 2,
    py: 1.5,

    '&:hover': {
      animationPlayState: 'paused',
      transform: 'translateX(-50%) scale(1.01)',
    },

    transition: 'transform 0.3s ease',
  }}
>
  {/* FIRST ROW */}
  <Typography
    sx={{
      fontWeight: 700,
      fontSize: '1.3rem',
      textAlign: 'center',
    }}
  >
    Proceed to Payment
  </Typography>

  {/* SECOND ROW */}
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 1,
      flexWrap: 'wrap',
    }}
  >
    {/* Left Side Stats */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        flex: 1,
        minWidth: 0,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      {statCards.map((stat) => (
        <Box
          key={stat.label}
          sx={{
            width: 130,
            backgroundColor: COLORS.grey[50],
            borderRadius: 2,
            px: 1.5,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            border: `1px solid ${COLORS.border}`,
            flexShrink: 0,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: '0.78rem',
                color: COLORS.black,
                fontWeight: 500,
                lineHeight: 1,
              }}
            >
              {stat.label}
            </Typography>

            <Typography
              sx={{
                fontSize: TEXT_SIZES.medium,
                fontWeight: 700,
                color: COLORS.black,
                lineHeight: 1.2,
              }}
            >
              {stat.value}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>

    {/* Right Side */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        flexShrink: 0,
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: TEXT_SIZES.small,
            color: COLORS.grey[600],
            fontWeight: 500,
            mb: 0.2,
          }}
        >
          Total Payable
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
          <Typography
            sx={{
              fontSize: TEXT_SIZES.medium,
              fontWeight: 700,
              color: COLORS.secondaryDark,
            }}
          >
            ₹
          </Typography>

          <Typography
            sx={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: COLORS.secondaryDark,
              lineHeight: 1,
            }}
          >
            {totalAmount.toLocaleString('en-IN')}
          </Typography>
        </Box>
      </Box>

  <Button
  variant="contained"
  size="large"
  onClick={handleProceedToPayment}
  disabled={loading}
  endIcon={!loading && <ArrowForwardIcon />}
  sx={{
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    fontSize: TEXT_SIZES.medium,
    fontWeight: 700,
    px: 4,
    py: 1.2,
    borderRadius: 2,
    textTransform: 'none',
    whiteSpace: 'nowrap',
    '&:hover': {
      backgroundColor: COLORS.primaryDark,
      transform: 'scale(1.02)',
    },
    '&.Mui-disabled': {
      backgroundColor: COLORS.grey[400],
    },
  }}
>
  {loading ? <CircularProgress size={24} color="inherit" /> : "PAY NOW"}
</Button>
    </Box>
  </Box>
</Box>
  );
})()}
    



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
  <Table sx={{ borderCollapse: 'collapse' }}>
    <TableHead>
      <TableRow sx={{ 
        background: `linear-gradient(135deg, ${COLORS.secondary} 0%, ${COLORS.secondaryDark} 100%)`,
      }}>
        <TableCell sx={{ fontWeight: 700, fontSize: TEXT_SIZES.small, color: COLORS.white, py: 1, width: '25%', borderBottom: 'none' }}>
          Selected Plan
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: 700, fontSize: TEXT_SIZES.small, color: COLORS.white, py: 1, width: '15%', borderBottom: 'none' }}>
          Investment Range Label
        </TableCell>
        <TableCell sx={{ fontWeight: 700, fontSize: TEXT_SIZES.small, color: COLORS.white, py: 1, width: '20%', borderBottom: 'none' }}>
          Investment Range
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: 700, fontSize: TEXT_SIZES.small, color: COLORS.white, py: 1, width: '10%', borderBottom: 'none' }}>
          States
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: 700, fontSize: TEXT_SIZES.small, color: COLORS.white, py: 1, width: '15%', borderBottom: 'none' }}>
          Leads
        </TableCell>
        <TableCell align="right" sx={{ fontWeight: 700, fontSize: TEXT_SIZES.small, color: COLORS.white, py: 1, width: '20%', borderBottom: 'none' }}>
          Subtotal (₹)
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: 700, fontSize: TEXT_SIZES.small, color: COLORS.white, py: 1, width: '10%', borderBottom: 'none' }}>
          Actions
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {paymentSummary && paymentSummary.length > 0 ? (
        (() => {
          // Group by planId
          const groupedByPlan = {};
          paymentSummary.forEach((group) => {
            if (!group.items || group.items.length === 0) return;
            
            if (!groupedByPlan[group.planId]) {
              groupedByPlan[group.planId] = {
                planName: group.planName,
                validityDays: group.validityDays,
                items: [],
                totalPlanAmount: 0,
                totalPlanLeads: 0,
                totalPlanStates: 0
              };
            }
            
            group.items.forEach(item => {
              groupedByPlan[group.planId].items.push({
                ...item,
                pricePerState: group.pricePerState,
                validityDays: group.validityDays
              });
              groupedByPlan[group.planId].totalPlanAmount += (group.pricePerState * (item.stateCount || 0)) || 0;
              groupedByPlan[group.planId].totalPlanLeads += (item.selectedLeads * (item.stateCount || 0)) || 0;
              groupedByPlan[group.planId].totalPlanStates += item.stateCount || 0;
            });
          });
          
          let rowIndex = 0;
          
     return Object.entries(groupedByPlan).map(([planId, planData]) => {
  // Group items within the plan by investment range - MAKE UNIQUE PER PLAN
  const groupedByRange = planData.items.reduce((acc, item) => {
    // Create a unique key that includes planId AND range
    const rangeKey = `${planId}_${item.range}`;
    
    if (!acc[rangeKey]) {
      acc[rangeKey] = {
        range: item.range,
        investmentRangeLabel: item.investmentRangeLabel,
        planId: planId,
        items: [],
        totalStates: 0,
        totalLeads: 0,
        totalAmount: 0,
        selectedLeads: item.selectedLeads,
        pricePerState: item.pricePerState,
        validityDays: item.validityDays
      };
    }
    acc[rangeKey].items.push(item);
    acc[rangeKey].totalStates += item.stateCount || 0;
    acc[rangeKey].totalLeads += (item.stateCount || 0) * (item.selectedLeads || 0);
    acc[rangeKey].totalAmount += item.totalAmount || (item.pricePerState * (item.stateCount || 0)) || 0;
    return acc;
  }, {});
  
  const sortedRanges = Object.values(groupedByRange).sort((a, b) => {
    const order = ['Upto 5 Lakhs', 'Rs. 50k - 2 Lakhs', 'Rs. 2 Lakhs - 5 Lakhs', 'Rs. 5 Lakhs - 10 Lakhs', 'Rs. 10 Lakhs - 20 Lakhs', 'Below 50k'];
    return order.indexOf(a.range) - order.indexOf(b.range);
  });
            
            const rangeRows = [];
            
            // First range row with plan name
            sortedRanges.forEach((rangeGroup, idx) => {
              rangeRows.push(
                <TableRow
                  key={`${planId}-${rangeGroup.range}`}
                  sx={{
                    backgroundColor: rowIndex % 2 === 0 ? COLORS.white : COLORS.grey[50],
                    '&:hover': {
                      backgroundColor: COLORS.lightGreen,
                    },
                    '& td': {
                      borderBottom: 'none',
                      py: 0.75,  // Reduced vertical padding
                    },
                  }}
                >
                  {/* Plan Name Cell - Only for first range */}
                  {idx === 0 && (
                    <TableCell 
                      rowSpan={sortedRanges.length}
                      sx={{ 
                        verticalAlign: "top",
                        py: 0.75,
                        borderRight: `2px solid ${COLORS.border}`,
                        backgroundColor: rowIndex % 2 === 0 ? COLORS.white : COLORS.grey[50],
                        borderBottom: 'none',
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontSize: TEXT_SIZES.small,
                            fontWeight: 700,
                            color: COLORS.black,
                            mb: 0.3,
                          }}
                        >
                          {planData.planName}
                        </Typography>
                        <Chip
                          icon={<CalendarMonthRoundedIcon sx={{ fontSize: '0.65rem' }} />}
                          label={`${planData.validityDays} Days`}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.6rem',
                            backgroundColor: COLORS.lightOrange,
                            color: COLORS.black,
                            fontWeight: 500,
                          }}
                        />
                      </Box>
                    </TableCell>
                  )}
                  <TableCell sx={{ py: 0.75, borderBottom: 'none' }}>
  <Chip
    label={rangeGroup.investmentRangeLabel || '—'}
    size="small"
    sx={{
      fontSize: "0.68rem",
      height: 24,
      backgroundColor: COLORS.lightGreen,
      color: COLORS.black,
      fontWeight: 600,
    }}
  />
</TableCell>
                  
                  {/* Investment Range */}
                  <TableCell sx={{ py: 0.75, borderBottom: 'none' }}>
                    <Chip
                      label={rangeGroup.range}
                      size="small"
                      sx={{
                        fontSize: "0.68rem",
                        height: 24,
                        backgroundColor: COLORS.lightOrange,
                        color: COLORS.black,
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  
                  
         {/* Total States */}
<TableCell align="center" sx={{ py: 0.75, borderBottom: 'none' }}>
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.3 }}>
    {rangeGroup.items[0]?.isListingPlan ? (
      <Typography sx={{ fontSize: TEXT_SIZES.small, fontWeight: 700 }}>
        ALL STATES
      </Typography>
    ) : (
      <>
        <Typography sx={{ fontSize: TEXT_SIZES.small, fontWeight: 700 }}>
          {rangeGroup.totalStates}
        </Typography>
        <Tooltip title="View states" arrow>
          <IconButton
            size="small"
            onClick={(e) => {
              const allStatesList = [...new Set(
                rangeGroup.items.flatMap(item => item.states || [])
              )];
              handleShowStates(e, allStatesList);
            }}
            sx={{ p: 0.2 }}
          >
            <VisibilityIcon sx={{ fontSize: '0.8rem', color: COLORS.primary }} />
          </IconButton>
        </Tooltip>
      </>
    )}
  </Box>
  {rangeGroup.items.length > 1 && !rangeGroup.items[0]?.isListingPlan && (
    <Typography sx={{ fontSize: "0.55rem", color: COLORS.grey[500], mt: 0.2 }}>
      ({rangeGroup.items.map(item => `${item.stateCount}`).join(' + ')})
    </Typography>
  )}
</TableCell>
{/* Total Leads */}
<TableCell align="center" sx={{ py: 0.75, borderBottom: 'none' }}>
  {rangeGroup.items[0]?.isListingPlan ? (
    <Typography sx={{ fontSize: TEXT_SIZES.small, fontWeight: 700 }}>
      -
    </Typography>
  ) : (
    <>
      <Typography sx={{ fontSize: TEXT_SIZES.small, fontWeight: 700 }}>
        {typeof rangeGroup.totalLeads === 'number' ? rangeGroup.totalLeads.toLocaleString("en-IN") : rangeGroup.totalLeads}
      </Typography>
      <Typography sx={{ fontSize: "0.55rem", color: COLORS.grey[600], mt: 0.2 }}>
        {rangeGroup.selectedLeads} × {rangeGroup.totalStates}
      </Typography>
    </>
  )}
</TableCell>
                  
                  {/* Subtotal */}
                  <TableCell align="right" sx={{ py: 0.75, borderBottom: 'none' }}>
                    <Typography sx={{ fontSize: TEXT_SIZES.small, fontWeight: 700, color: COLORS.secondaryDark }}>
                      ₹{rangeGroup.totalAmount.toLocaleString("en-IN")}
                    </Typography>
                    {rangeGroup.pricePerState > 0 && (
                      <Typography sx={{ fontSize: "0.55rem", color: COLORS.grey[600], mt: 0.2 }}>
                        ₹{rangeGroup.pricePerState.toLocaleString("en-IN")} × {rangeGroup.totalStates}
                      </Typography>
                    )}
                  </TableCell>
                  
               {/* Actions */}
<TableCell align="center" sx={{ py: 0.75, borderBottom: 'none' }}>
  <Tooltip title="Remove from summary" arrow>
    <IconButton
      onClick={() => {
        setItemToRemove({
          planName: planData.planName,
          range: rangeGroup.range,
          investmentRangeLabel: rangeGroup.investmentRangeLabel,
          items: rangeGroup.items
        });
        setOpenRemoveConfirmDialog(true);
      }}
      sx={{
        color: COLORS.grey[600],
        p: 0.3,
        '&:hover': {
          color: COLORS.primary,
          backgroundColor: COLORS.lightOrange,
        },
      }}
    >
      <DeleteIcon sx={{ fontSize: 18 }} />
    </IconButton>
  </Tooltip>
</TableCell>
                </TableRow>
              );
              rowIndex++;
            });
            
            // Add a subtle separator between different plans
            rangeRows.push(
              <TableRow key={`${planId}-spacer`} sx={{ height: 4 }}>
                <TableCell colSpan={6} sx={{ p: 0, border: 'none', backgroundColor: 'transparent' }} />
              </TableRow>
            );
            
            return rangeRows;
          });
        })()
      ) : (
        <TableRow>
          <TableCell colSpan={6} align="center" sx={{ py: 4, borderBottom: 'none' }}>
            <Typography sx={{ color: COLORS.grey[500], fontSize: TEXT_SIZES.small }}>
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
  {(() => {
    const blocked = getAlreadySelectedStatesInOtherRanges();
    // Count only states selected for THIS range (not blocked ones from other ranges)
    const currentRangeSelectedCount = [...selectedStates].filter(s => !blocked.has(s)).length;
    const totalAvailable = !finalToken 
      ? ALL_INDIA_STATES.filter(s => !blocked.has(s)).length
      : allStates.filter(s => !blocked.has(s)).length;
    return <>Select States ({currentRangeSelectedCount} of {totalAvailable})</>;
  })()}
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
  disabled={(() => {
    const blocked = getAlreadySelectedStatesInOtherRanges();
    const selectableStates = getStatesToDisplay().filter(s => !blocked.has(s));
    // Disabled when all selectable (non-blocked) states are already selected
    return selectableStates.every(s => selectedStates.has(s));
  })()}
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
           {(() => {
    const blocked = getAlreadySelectedStatesInOtherRanges();
    const selectableCount = getStatesToDisplay().filter(s => !blocked.has(s)).length;
    return `Select All (${selectableCount})`;
  })()}
</Button>
         <Button 
  variant="outlined" 
  size="small" 
  onClick={handleClearAll} 
  disabled={(() => {
    const blocked = getAlreadySelectedStatesInOtherRanges();
    // Disabled when no non-blocked states are selected (nothing to clear)
    return [...selectedStates].every(s => blocked.has(s));
  })()}
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
      {/* States List Dialog */}
<Dialog
  open={openStatesTooltip}
  onClose={handleCloseStatesTooltip}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 2,
      border: `1px solid ${COLORS.primary}`,
      maxHeight: '80vh',
    }
  }}
>
  <DialogTitle sx={{
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
    fontSize: TEXT_SIZES.medium,
    fontWeight: 700,
    color: COLORS.white,
    py: 1.5,
    pr: 5,
    position: 'relative',
  }}>
    Selected States ({tooltipStates.length})
    <IconButton
      onClick={handleCloseStatesTooltip}
      aria-label="close"
      sx={{
        position: 'absolute',
        right: 8,
        top: '50%',
        transform: 'translateY(-50%)',
        color: COLORS.white,
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.1)',
        },
      }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>
  <DialogContent dividers sx={{ p: 2 }}>
    {tooltipStates.length > 0 ? (
      <Box>
        {/* Group states by region */}
        {Object.entries(INDIA_STATES).map(([region, regionStates]) => {
          const matchedStates = tooltipStates.filter(state => 
            regionStates.includes(state)
          );
          
          if (matchedStates.length === 0) return null;
          
          return (
            <Box key={region} sx={{ mb: 2 }}>
              <Typography
                sx={{
                  fontSize: TEXT_SIZES.small,
                  fontWeight: 700,
                  color: COLORS.primary,
                  mb: 1,
                  pb: 0.5,
                  borderBottom: `1px solid ${COLORS.border}`,
                }}
              >
                {region} ({matchedStates.length})
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, pl: 1 }}>
                {matchedStates.map((state, idx) => (
                  <Chip
                    key={idx}
                    label={state}
                    size="small"
                    sx={{
                      backgroundColor: COLORS.lightOrange,
                      color: COLORS.black,
                      fontWeight: 500,
                      fontSize: '0.7rem',
                      height: 24,
                    }}
                  />
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>
    ) : (
      <Typography sx={{ color: COLORS.grey[500], textAlign: 'center', py: 4 }}>
        No states selected
      </Typography>
    )}
  </DialogContent>
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
      // borderRadius: 3,
      border: `2px solid ${COLORS.primary}`,
      boxShadow: `0 8px 32px ${COLORS.shadow}`,
      overflow: "visible",
      position: "relative",
    },
  }}
>
  {/* Top Floating Close Icon */}
  <IconButton
    onClick={() => {
      setOpenConfirmDialog(false);
      setPendingSelection(null);
    }}
    sx={{
      position: "absolute",
      top: -16,
      right: -16,
      backgroundColor: COLORS.white,
      color: COLORS.primary,
      boxShadow: `0 4px 12px ${COLORS.shadow}`,
      border: `1px solid ${COLORS.border}`,
      zIndex: 10,

      "&:hover": {
        backgroundColor: COLORS.grey[100],
        transform: "scale(1.05)",
      },
    }}
  >
    <CloseIcon />
  </IconButton>

  <DialogTitle
    sx={{
      background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
      fontSize: TEXT_SIZES.large,
      fontWeight: 700,
      color: COLORS.white,
    }}
  >
    Add "Investment Range" to Brand Profile?
  </DialogTitle>

  <DialogContent sx={{ pt: 3, pb: 2 }}>
    <Typography
      sx={{
        fontSize: TEXT_SIZES.medium,
        color: COLORS.black,
        mb: 1,
        mt: 2,
      }}
    >
      Would you like to add New Investment Range to your Brand profile?
    </Typography>

    <Typography
      sx={{
        fontSize: TEXT_SIZES.small,
        color: COLORS.grey[600],
        mt: 1,
      }}
    >
      Adding new investment range will allow you to select these ranges
      for your franchise plans.
    </Typography>
  </DialogContent>

  <DialogActions
    sx={{
      justifyContent: "flex-end",
      px: 3,
      py: 2,
      backgroundColor: COLORS.grey[50],
    }}
  >
    <Button
     onClick={() => {
  if (pendingSelection) {
    // Came from a row's Add button — use the pending non-recommended range
    const firstNonRecommended = pendingSelection.selectedItemsInGroup?.find(
      (p) => !isFicoInvestmentRange(p.range)
    );
    if (firstNonRecommended) {
      handleAddInvestmentRange(
        firstNonRecommended.range,
        firstNonRecommended.investmentRangeLabel
      );
    }
  } else {
    // Came from "Add New Investment Range" button — no specific range pre-selected
    // Call with empty args so parent opens the PaymentBrandUpdate dialog fresh
    if (!finalToken) {
      setShowLogin(true);
      openSnack("Please log in to add investment ranges", "warning");
    } else {
      onAddInvestmentRange(null, null); // parent handles opening dialog with empty form
    }
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
        // borderRadius: 2,

        "&:hover": {
          backgroundColor: COLORS.primaryDark,
        },
      }}
    >
      Yes
    </Button>
  </DialogActions>
</Dialog>
{/* Remove Confirmation Dialog */}
<Dialog
  open={openRemoveConfirmDialog}
  onClose={() => setOpenRemoveConfirmDialog(false)}
  maxWidth="xs"
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
    py: 2,
  }}>
    Confirm Removal
  </DialogTitle>
  <DialogContent sx={{ pt: 3, pb: 2 }}>
    <Typography sx={{ fontSize: TEXT_SIZES.medium, color: COLORS.black, mb: 1 }}>
      Are you sure you want to remove this investment range?
    </Typography>
    {itemToRemove && (
      <Box sx={{ mt: 2, p: 2, bgcolor: COLORS.lightOrange, borderRadius: 2 }}>
        <Typography sx={{ fontSize: TEXT_SIZES.small, color: COLORS.black }}>
          <strong>Plan:</strong> {itemToRemove.planName}
        </Typography>
        <Typography sx={{ fontSize: TEXT_SIZES.small, color: COLORS.black, mt: 0.5 }}>
          <strong>Investment Range:</strong> {itemToRemove.range}
        </Typography>
        <Typography sx={{ fontSize: TEXT_SIZES.small, color: COLORS.black, mt: 0.5 }}>
          <strong>Investment Group:</strong> {itemToRemove.investmentRangeLabel}
        </Typography>
      </Box>
    )}
  </DialogContent>
  <DialogActions sx={{ justifyContent: "space-between", px: 3, py: 2, bgcolor: COLORS.grey[50] }}>
    <Button 
      onClick={() => setOpenRemoveConfirmDialog(false)}
      sx={{
        color: COLORS.grey[700],
        fontSize: TEXT_SIZES.medium,
        fontWeight: 600,
        '&:hover': { bgcolor: COLORS.grey[200] }
      }}
    >
      Cancel
    </Button>
    <Button 
      onClick={() => {
        if (itemToRemove) {
          itemToRemove.items.forEach((item) => {
            handleRemoveSingleFromPayment(item);
          });
        }
        setOpenRemoveConfirmDialog(false);
        setItemToRemove(null);
      }}
      variant="contained"
      sx={{
        bgcolor: COLORS.primary,
        color: COLORS.white,
        fontSize: TEXT_SIZES.medium,
        fontWeight: 600,
        px: 3,
        '&:hover': { bgcolor: COLORS.primaryDark }
      }}
    >
      Yes, Remove
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
};

export default PackageSelection;