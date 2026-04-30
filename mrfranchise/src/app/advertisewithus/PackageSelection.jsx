"use client";

import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import LoginPage from "@/Components/LoginPage/LoginPage.jsx";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const INDIA_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
  "Lakshadweep",
  "Chandigarh",
  "Andaman and Nicobar Islands",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
];

// ✅ Memoized Alert Component
const AlertMessage = memo(({ severity, message, action }) => (
  <Alert severity={severity} sx={{ mb: 2 }} action={action}>
    {message}
  </Alert>
));

AlertMessage.displayName = "AlertMessage";

// ✅ Get user location from IP
const getUserLocationFromIP = async () => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    
    if (data.region) {
      const matchedState = INDIA_STATES.find(
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

// ✅ Memoized Table Row Component
const InvestmentRangeRow = memo(({ 
  item, 
  selectedPlan,
  selectedPkg,
  selected,
  isFicoInvestmentRange,
  getStateCountForRange,
  calculateRangeTotal,
  handleCheckboxChange,
  handleAddInvestmentRange,
  handleOpenStateModal,
  handleAddSingleToPayment,
  handleRemoveSingleFromPayment,
  isInPayment,
  brandLoading,
  locationLoading,
  openSnack,
  finalToken ,
  leadsDropdownData,      // NEW
  selectedLeadsPerRange,  // NEW
  handleLeadsChange       // NEW
}) => {
  const { id, investmentRangeLabel, range } = item;
  const pricePerState = selectedPkg?.amount || 0;
  const rangeTotal = calculateRangeTotal(investmentRangeLabel, range, pricePerState);
  const isRecommended = isFicoInvestmentRange(range);
   const canAdd = !finalToken || isRecommended; 
  const inPayment = isInPayment(id);
 const stateCount = getStateCountForRange(investmentRangeLabel, range);
    // ✅ Get available leads options for this investment range
  const leadsDataKey = `${selectedPlan._id}_${investmentRangeLabel}`;
  const availableLeads = leadsDropdownData[leadsDataKey] || [];
  
  // ✅ Get selected leads or default to first option
  const selectedLeads = selectedLeadsPerRange[id] || (availableLeads.length > 0 ? availableLeads[0] : 0);
  
  // ✅ Calculate total based on formula: (pricePerState / basicLeads) × selectedLeads × stateCount
  const basicLeads = availableLeads.length > 0 ? Math.min(...availableLeads) : 1;
  const pricePerLead = basicLeads > 0 ? pricePerState / basicLeads : 0;
  const totalLeadsPrice = pricePerLead * selectedLeads * stateCount;

  return (
    <TableRow hover>
      {/* <TableCell padding="checkbox">
        <Checkbox
          checked={!!selected[id]}
          onChange={() => handleCheckboxChange(id)}
        />
      </TableCell> */}

      <TableCell>{range}</TableCell>

      <TableCell>
        {isRecommended ? (
          <Chip
            label="Recommended"
            color="success"
            size="small"
            variant="filled"
            sx={{ fontWeight: 600, borderRadius: "6px" }}
          />
        ) : (
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={() => handleAddInvestmentRange(range, investmentRangeLabel)}
            sx={{ textTransform: "none", borderRadius: "6px" }}
          >
            Add Investment Range
          </Button>
        )}
      </TableCell>

      <TableCell>
        {brandLoading || locationLoading ? (
          <CircularProgress size={18} />
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {getStateCountForRange(investmentRangeLabel, range)} state{getStateCountForRange(investmentRangeLabel, range) !== 1 ? 's' : ''}
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleOpenStateModal(investmentRangeLabel, range)}
              title="Edit States"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </TableCell>

      <TableCell>
        <Typography variant="body2" fontWeight={600} color="primary">
          ₹{totalLeadsPrice.toLocaleString()}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          ({getStateCountForRange(investmentRangeLabel, range)} × ₹{pricePerState})
        </Typography> 
         {/* <Typography variant="caption" color="success" sx={{ display: "block", mt: 0.5, fontWeight: 500 }}>
          Leads Total: ₹{totalLeadsPrice.toLocaleString()} ({selectedLeads} leads × {stateCount} states @ ₹{pricePerLead.toLocaleString()}/lead)
        </Typography> */}
      </TableCell>

      <TableCell align="center">
        {inPayment ? (
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<RemoveIcon />}
            onClick={() => handleRemoveSingleFromPayment(item)}
          >
            Remove
          </Button>
        ) : (
         <Tooltip title={!isRecommended ? "Add Investment Range first on Business Model to calculate price" : ""}>
  <span>
    <Button
      variant="contained"
      color="success"
      size="small"
      startIcon={<AddIcon />}
      onClick={() => handleAddSingleToPayment(item, selectedPlan, selectedPkg) }
     disabled={!canAdd}
    >
      Add to Plan
    </Button>
  </span>
</Tooltip>
        )}
      </TableCell>
    </TableRow>
  );
});

InvestmentRangeRow.displayName = "InvestmentRangeRow";

const PackageSelection = ({ onAddInvestmentRange = () => {} }) => {
  const router = useRouter();
  
  const [paymentSummary, setPaymentSummary] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brandLoading, setBrandLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState({});
  const [selectedPlans, setSelectedPlans] = useState({});
  const [brandError, setBrandError] = useState(null);
  const [ficoInvestmentRanges, setFicoInvestmentRanges] = useState([]);

  // Location states
  const [locationLoading, setLocationLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [detectedState, setDetectedState] = useState(null);

  // State selection
  const [openStateModal, setOpenStateModal] = useState(false);
  const [allStates, setAllStates] = useState(INDIA_STATES);
  const [selectedStates, setSelectedStates] = useState(new Set());
  const [statesByInvestmentRange, setStatesByInvestmentRange] = useState({});
  const [currentEditingRange, setCurrentEditingRange] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });
  const [selectedInvestmentRangeLabel, setSelectedInvestmentRangeLabel] = useState(null);

  const [leadsDropdownData, setLeadsDropdownData] = useState({});
const [selectedLeadsPerRange, setSelectedLeadsPerRange] = useState({});

  const { brandUUID: reduxBrandUUID, token: reduxToken } = useSelector(
    (state) => state.auth
  );

  const [localBrandUUID, setLocalBrandUUID] = useState(null);
  const [localAccessToken, setLocalAccessToken] = useState(null);

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
            const restoredSelected = {};

            parsed.forEach((group) => {
              group.items?.forEach((item) => {
                restoredSelected[item.id] = true;
              });

              if (group.groupKey?.startsWith("listing-")) {
                restoredSelected[group.groupKey] = true;
              }
            });

            setSelected((prev) => ({ ...prev, ...restoredSelected }));
          }
        } catch (err) {
          console.error("Error parsing saved payment summary:", err);
        }
      }
    }
  }, []);

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

  // Auto-detect location via IP
  useEffect(() => {
    const detectLocation = async () => {
      if (finalToken) return;

      const savedLocation = localStorage.getItem("userLocation");
      if (savedLocation) {
        try {
          const parsed = JSON.parse(savedLocation);
          setUserLocation(parsed);
          if (parsed.state) {
            const matchedState = INDIA_STATES.find(
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
          
          const matchedState = INDIA_STATES.find(
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

  const getRangeKey = useCallback((investmentRangeLabel, range) =>
    `${investmentRangeLabel}__${range}`, []);

  // ✅ Auto-update payment summary when states change
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
          const newAmount = totalUniqueStates * group.pricePerState;

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
  }, [statesByInvestmentRange, finalToken, detectedState, allStates, getRangeKey]);

  // Modal Handlers
  const handleOpenStateModal = useCallback((investmentRangeLabel, range) => {
    const key = getRangeKey(investmentRangeLabel, range);
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
    openSnack(`Saved ${selectedArray.length} state${selectedArray.length > 1 ? 's' : ''}. Prices updated automatically.`, "success");
    handleCloseStateModal();
  }, [selectedStates, statesByInvestmentRange, currentEditingRange, openSnack, handleCloseStateModal]);

  const getUniqueStatesAcrossRanges = useCallback((items) => {
    const allStatesSet = new Set();
    items.forEach((item) => {
      item.states.forEach((state) => allStatesSet.add(state));
    });
    return Array.from(allStatesSet);
  }, []);

  // Fetch brand details
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

      // ✅ Filter here too
      const filtered = json.data.filter((plan) => plan.packages?.length > 1);

      const launchPadPlan = filtered.find(
        (plan) => plan.planName?.toLowerCase() === "launch pad program"
      );

      if (launchPadPlan) {
        const investmentRangeLabels = new Set();
        filtered.forEach((plan) => {  // ✅ use filtered
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
  // ✅ Filter out plans with only 1 package (Paid Listing 1 & 2) and FREE plans
const filteredPlans = useMemo(() => {
  return plans.filter((plan) => plan.packages?.length > 1 && plan.planName?.toLowerCase() !== 'free');
}, [plans]);

  // ✅ Memoized unique packages
 const uniquePackages = useMemo(() => {
  const uniqueMap = new Map();
  filteredPlans.forEach((plan) => {  // ✅ use filteredPlans
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
            allPlans: filteredPlans,  // ✅ use filteredPlans
          });
        }
      });
    });
  });
  return Array.from(uniqueMap.values());
}, [filteredPlans]);  // ✅ depend on filteredPlans

  // ✅ Group packages by investment range label
  const groupedPackages = useMemo(() => {
    const groups = {};
    uniquePackages.forEach((pkg) => {
      if (!groups[pkg.investmentRangeLabel]) {
        groups[pkg.investmentRangeLabel] = [];
      }
      groups[pkg.investmentRangeLabel].push(pkg);
    });
    return groups;
  }, [uniquePackages]);

  // ✅ Set initial investment range to the first one
  useEffect(() => {
    if (Object.keys(groupedPackages).length > 0 && !selectedInvestmentRangeLabel) {
      const firstLabel = Object.keys(groupedPackages)[0];
      setSelectedInvestmentRangeLabel(firstLabel);
    }
  }, [groupedPackages, selectedInvestmentRangeLabel]);

  const handleCheckboxChange = useCallback((id) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
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

  const calculateRangeTotal = useCallback((investmentRangeLabel, range, pricePerState) => {
    const key = getRangeKey(investmentRangeLabel, range);
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
    
    return states.length * pricePerState;
  }, [statesByInvestmentRange, finalToken, detectedState, allStates, getRangeKey]);

  // ✅ Check if item is in payment
  const isInPayment = useCallback((itemId) => {
    return paymentSummary.some((group) => 
      group.items.some((item) => item.id === itemId)
    );
  }, [paymentSummary]);

const handleAddSingleToPayment = useCallback((item, selectedPlan, selectedPkg) => {
  const { id, investmentRangeLabel, range } = item;
  const pricePerState = selectedPkg?.amount || 0;

  const key = getRangeKey(investmentRangeLabel, range);
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

  // ✅ Get the selected leads for this item
  const leadsDataKey = `${selectedPlan._id}_${investmentRangeLabel}`;
  const availableLeads = leadsDropdownData[leadsDataKey] || [];
  const selectedLeads = selectedLeadsPerRange[id] || (availableLeads.length > 0 ? availableLeads[0] : 0);

  const newItem = {
    id,
    investmentRangeLabel,
    range,
    stateCount: states.length,
    states: states,
    selectedLeads, // ✅ Add selected leads to item
  };

  // ✅ Update groupKey to include selected leads
  const groupKey = `${selectedPlan._id}__${selectedPkg?.validityDays}__${pricePerState}__${selectedLeads}__${investmentRangeLabel}`;

  setPaymentSummary((prev) => {
    const existingGroup = prev.find((g) => g.groupKey === groupKey);

    if (existingGroup) {
      if (existingGroup.items.some((ex) => ex.id === newItem.id)) {
        openSnack("This range is already added", "info");
        return prev;
      }

      const updatedItems = [...existingGroup.items, newItem];
      const uniqueStates = getUniqueStatesAcrossRanges(updatedItems);
      const totalUniqueStates = uniqueStates.length;
      const newAmount = totalUniqueStates * pricePerState;

      openSnack(`Added ${range}. Total: ₹${newAmount}`, "success");

      return prev.map((g) =>
        g.groupKey === groupKey
          ? {
              ...g,
              items: updatedItems,
              uniqueStates: uniqueStates,
              totalStates: totalUniqueStates,
              amount: newAmount,
            }
          : g
      );
    }

    const uniqueStates = getUniqueStatesAcrossRanges([newItem]);
    const totalUniqueStates = uniqueStates.length;
    const dynamicAmount = totalUniqueStates * pricePerState;

    openSnack(`Added ${range}. Total: ₹${dynamicAmount}`, "success");

    return [
      ...prev,
      {
        groupKey,
        planId: selectedPlan._id,
        planName: selectedPlan.planName,
        investmentRangeLabel: investmentRangeLabel,
        validityDays: selectedPkg?.validityDays,
        pricePerState: pricePerState,
        uniqueStates: uniqueStates,
        totalStates: totalUniqueStates,
        amount: dynamicAmount,
        totalLeads: selectedLeads, // ✅ Use selected leads instead of pkg totalLeads
        items: [newItem],
      },
    ];
  });

  setSelected((prev) => ({ ...prev, [id]: true }));
}, [getRangeKey, statesByInvestmentRange, finalToken, detectedState, allStates, getUniqueStatesAcrossRanges, openSnack, leadsDropdownData, selectedLeadsPerRange]);


  // ✅ Remove single investment range from payment
  const handleRemoveSingleFromPayment = useCallback((item) => {
    const { id } = item;

    setPaymentSummary((prev) => {
      const updated = prev
        .map((g) => {
          const hasItem = g.items.some((it) => it.id === id);
          if (!hasItem) return g;

          const updatedItems = g.items.filter((it) => it.id !== id);

          if (updatedItems.length === 0) return null;

          const newUniqueStates = getUniqueStatesAcrossRanges(updatedItems);
          const newTotalUniqueStates = newUniqueStates.length;
          const newAmount = newTotalUniqueStates * g.pricePerState;

          return {
            ...g,
            items: updatedItems,
            uniqueStates: newUniqueStates,
            totalStates: newTotalUniqueStates,
            amount: newAmount,
          };
        })
        .filter((g) => g !== null);

      return updated;
    });

    setSelected((prev) => ({ ...prev, [id]: false }));
    openSnack("Investment range removed", "info");
  }, [getUniqueStatesAcrossRanges, openSnack]);

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
      return prev.filter((g) => g.groupKey !== groupKey);
    });
    openSnack("Plan removed", "info");
  }, [openSnack]);

  const calculateTotal = useCallback(() => {
    return paymentSummary.reduce((sum, g) => sum + (g.amount || 0), 0);
  }, [paymentSummary]);

  const handleProceedToPayment = useCallback(() => {
    if (paymentSummary.length === 0) {
      openSnack("Please add at least one package", "warning");
      return;
    }

    if (!finalToken) {
      localStorage.setItem("paymentSummaryDraft", JSON.stringify(paymentSummary));
      openSnack("Please login to continue to payment.", "warning");
      setShowLogin(true);
      return;
    }

    localStorage.setItem("paymentSummary", JSON.stringify(paymentSummary));
    router.push("/payment");
  }, [finalToken, openSnack, paymentSummary, router]);

  const getStateCountForRange = useCallback((investmentRangeLabel, range) => {
    const key = getRangeKey(investmentRangeLabel, range);
    const savedStates = statesByInvestmentRange[key];
    
    if (savedStates && savedStates.length > 0) return savedStates.length;
    
    if (!finalToken && detectedState) return 1;
    
    if (finalToken) return allStates.length;
    
    return 0;
  }, [getRangeKey, statesByInvestmentRange, finalToken, detectedState, allStates]);

  const handleAddInvestmentRange = useCallback((range, investmentRangeLabel) => {
    if (!finalToken) {
      setShowLogin(true);
      openSnack("Please log in to add or customize investment ranges", "warning");
      return;
    }

    onAddInvestmentRange(range, investmentRangeLabel);
  }, [onAddInvestmentRange, finalToken, openSnack]);

  const handleLeadsChange = useCallback((itemId, newLeadsValue) => {
    setSelectedLeadsPerRange((prev) => ({
      ...prev,
      [itemId]: newLeadsValue,
    }));
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const getStatesToDisplay = () => {
    if (finalToken) {
      return allStates;
    } else {
      return INDIA_STATES;
    }
  };

  return (
    <>
           {/* Brand Listing Package Table */}
<Box sx={{ mt: 0,mb: 4 }}>
 
  <TableContainer sx={{ maxHeight: 440, maxWidth: "100%", border: "1px solid #ddd", borderRadius: 1, mt: 2 }} >
    <Table>
      <TableHead sx={{ backgroundColor: "#ff9800" }}>
        <TableRow>
          {/* <TableCell>Select</TableCell> */}
          <TableCell>Plan Name</TableCell>
          <TableCell>Validity</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell>Total Leads</TableCell>
          <TableCell align="center">Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {plans
          .filter((plan) => plan.packages?.length === 1 && plan.planName?.toLowerCase() !== 'free')
          .map((plan) => {
            const pkg = plan.packages[0];
            const isSelected = !!selected[`listing-${plan._id}`];
            const isAdded = paymentSummary.some(
              (g) => g.groupKey === `listing-${plan._id}`
            );

            return (
              <TableRow key={plan._id} hover>
                {/* <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected}
                    onChange={() =>
                      setSelected((prev) => ({
                        ...prev,
                        [`listing-${plan._id}`]: !prev[`listing-${plan._id}`],
                      }))
                    }
                  />
                </TableCell> */}

                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {plan.planName}
                  </Typography>
                </TableCell>

                <TableCell>
                 
                  <Typography variant="body2" fontWeight={600} color="primary"> 
                    {`${pkg.validityDays} Days`}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" fontWeight={600} color="primary">
                    ₹{pkg.amount?.toLocaleString()}
                  </Typography>
                </TableCell>

                <TableCell>
                 
                   <Typography variant="body2" fontWeight={600} color="primary"> 
                    {`${pkg.totalLeads} Leads`}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  {isAdded ? (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<RemoveIcon />}
                      onClick={() => {
                        setPaymentSummary((prev) =>
                          prev.filter(
                            (g) => g.groupKey !== `listing-${plan._id}`
                          )
                        );
                        setSelected((prev) => ({
                          ...prev,
                          [`listing-${plan._id}`]: false,
                        }));
                        openSnack("Brand Listing Package removed", "info");
                      }}
                    >
                      Remove
                    </Button>
                  ) : (
                    
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        const groupKey = `listing-${plan._id}`;
                        setPaymentSummary((prev) => {
                          if (prev.some((g) => g.groupKey === groupKey)) {
                            openSnack("Already added", "info");
                            return prev;
                          }
                          openSnack(
                            `${plan.planName} added. Total: ₹${pkg.amount}`,
                            "success"
                          );
                          return [
                            ...prev,
                            {
                              groupKey,
                              planId: plan._id,
                              planName: plan.planName,
                              investmentRangeLabel: pkg.investmentRangeLabel,
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
                        setSelected((prev) => ({
                          ...prev,
                          [`listing-${plan._id}`]: true,
                        }));
                      }}
                    >
                      Add to Plan
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  </TableContainer>
</Box>
      <Box >

         <Typography variant="caption"   >
          <InfoOutlinedIcon fontSize="small" color="info" sx={{ verticalAlign: "middle", mr: 1 }} />
    Recommended Packages Only  move forward to payment with selected packages
  </Typography>


        {/* {!finalToken && userLocation && (
          <AlertMessage
            severity="info"
            message={`Detected Location: ${userLocation.city}, ${userLocation.state}`}
            
          />
        )}

        {finalToken && allStates.length > 0 && (
          <AlertMessage
            severity="success"
            message={`Showing packages for ${allStates.length} expansion state${allStates.length > 1 ? 's' : ''}: ${allStates.slice(0, 3).join(", ")}${allStates.length > 3 ? ` +${allStates.length - 3} more` : ''}`}
          />
        )}

        {finalToken && allStates.length === 0 && (
          <AlertMessage
            severity="warning"
            message="No expansion states found. Please add expansion locations to your profile."
            action={
              <Button 
                color="inherit" 
                size="small"
                onClick={() => router.push("/brandDashboard/brand_listing_controller")}
              >
                Add States
              </Button>
            }
          />
        )}

        {brandError && (
          <AlertMessage
            severity="warning"
            message={`Could not fetch brand states: ${brandError}`}
          />
        )} */}

        <TableContainer sx={{ maxHeight: 440, border: "1px solid #ddd", borderRadius: 1, mt: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#ff9800" }}>
              <TableRow>
                {/* <TableCell>Select</TableCell> */}
                <TableCell>Investment Range</TableCell>
                <TableCell>Recommended</TableCell>
                <TableCell>No. Of States</TableCell>
                <TableCell>
                  Total Amount
                  
                </TableCell>
                
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {Object.entries(groupedPackages).map(([label, items]) => {
                // Filter based on selected investment range label dropdown
                if (selectedInvestmentRangeLabel && selectedInvestmentRangeLabel !== "" && selectedInvestmentRangeLabel !== label) {
                  return null;
                }

                const firstItem = items[0];
                const selectedPlan = getSelectedPlanData(label, firstItem.defaultPlan);
                const selectedPkg = selectedPlan?.packages?.find(
                  (p) => p.investmentRangeLabel === label
                ) || firstItem.pkg;

                return (
                  <React.Fragment key={label}>
                    {/* Group Header */}
                    <TableRow >
                      <TableCell colSpan={8} sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <FormControl sx={{ minWidth: 200 }}>
                            <Select
                              value={selectedInvestmentRangeLabel || label}
                              onChange={(e) => setSelectedInvestmentRangeLabel(e.target.value)}
                              displayEmpty
                            >
                              <MenuItem value="">All Investment Ranges</MenuItem>
                              {Object.keys(groupedPackages).map((rangeLabel) => (
                                <MenuItem key={rangeLabel} value={rangeLabel}>
                                  {rangeLabel}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <FormControl size="small" sx={{ minWidth: 180 }}>
  <Select
    value={selectedPlans[label] || firstItem.defaultPlan._id}
    onChange={(e) => handlePlanChange(label, e.target.value)}
  >
    {firstItem.allPlans.map((plan) => (  // ✅ already filtered
      <MenuItem key={plan._id} value={plan._id}>
        {plan.planName}
      </MenuItem>
    ))}
  </Select>
</FormControl>
{/* ✅ LEADS DROPDOWN - Corrected */}
{(() => {
  const leadsDataKey = `${selectedPlan._id}_${label}`;
  const availableLeads = leadsDropdownData[leadsDataKey] || [];
  const firstItemId = items[0]?.id;
  const headerSelectedLeads = selectedLeadsPerRange[firstItemId] || (availableLeads.length > 0 ? availableLeads[0] : 0);

  return availableLeads.length > 0 ? (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <Select
        value={headerSelectedLeads}
        onChange={(e) => {
          // Update all items in this investment range label group
          items.forEach(item => {
            handleLeadsChange(item.id, e.target.value);
          });
        }}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.dark',
          },
        }}
      >
        {availableLeads.map((leadOption) => (
          <MenuItem key={leadOption} value={leadOption}>
            {leadOption} Leads
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  ) : (
    <Chip 
      label={`${selectedPkg?.totalLeads?.[0] || 0} Leads`} 
      color="info" 
      size="small" 
    />
  );
})()}
                            <Chip 
                              label={`${selectedPkg?.validityDays} Days`} 
                              color="primary" 
                              size="small" 
                            />
                            {/* <Chip 
                              label={`₹${selectedPkg?.amount} / state`} 
                              color="primary" 
                              size="small" 
                            /> */}
                            {/* <Chip 
                              label={`${selectedPkg?.totalLeads} Leads`} 
                              color="info" 
                              size="small" 
                            /> */}
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>

                    {/* Investment Range Rows */}
                    {items.map((item) => (
                      <InvestmentRangeRow
                        key={item.id}
                        item={item}
                        selectedPlan={selectedPlan}
                        selectedPkg={selectedPkg}
                        selected={selected}
                        isFicoInvestmentRange={isFicoInvestmentRange}
                        getStateCountForRange={getStateCountForRange}
                        calculateRangeTotal={calculateRangeTotal}
                        handleCheckboxChange={handleCheckboxChange}
                        handleAddInvestmentRange={handleAddInvestmentRange}
                        handleOpenStateModal={handleOpenStateModal}
                        handleAddSingleToPayment={handleAddSingleToPayment}
                        handleRemoveSingleFromPayment={handleRemoveSingleFromPayment}
                        isInPayment={isInPayment}
                        brandLoading={brandLoading}
                        locationLoading={locationLoading}
                        openSnack={openSnack}
                        finalToken={finalToken}
                        leadsDropdownData={leadsDropdownData}
                        selectedLeadsPerRange={selectedLeadsPerRange}
                        handleLeadsChange={handleLeadsChange}
                      />
                    ))}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

    

        {/* States Selection Modal */}
        <Dialog
          open={openStateModal}
          onClose={handleCloseStateModal}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {!finalToken ? (
              <>Select States ({selectedStates.size} selected of {INDIA_STATES.length})</>
            ) : (
              <>Select States for {currentEditingRange} ({selectedStates.size} selected of {allStates.length})</>
            )}
          </DialogTitle>
          <DialogContent dividers sx={{ maxHeight: 420, overflow: "auto" }}>
            {getStatesToDisplay().length > 0 ? (
              getStatesToDisplay().map((state) => (
                <FormControlLabel
                  key={state}
                  control={
                    <Checkbox
                      checked={selectedStates.has(state)}
                      onChange={() => handleStateCheckboxChange(state)}
                    />
                  }
                  label={state}
                  sx={{ display: "block", py: 0.5 }}
                />
              ))
            ) : (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <Typography color="text.secondary" paragraph>
                  No expansion states found for your brand.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => {
                    router.push("/brandDashboard/brand_listing_controller");
                    handleCloseStateModal();
                  }}
                >
                  Add Expansion States
                </Button>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
            <Box display="flex" alignItems="center" gap={1}>
              {finalToken && (
                <>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      router.push("/brandDashboard/brand_listing_controller")
                    }
                  >
                    Add More States
                  </Button>
                  <Tooltip title="Adding more states will update your brand's expansion locations.">
                    <InfoOutlinedIcon
                      sx={{ color: "text.secondary", cursor: "pointer" }}
                    />
                  </Tooltip>
                </>
              )}
            </Box>

            <Box display="flex" gap={1}>
              <Button onClick={handleCloseStateModal} color="inherit">
                Cancel
              </Button>
              <Button
                onClick={handleSaveStates}
                variant="contained"
                color="primary"
                disabled={selectedStates.size === 0}
              >
                Save Changes
              </Button>
            </Box>
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
          >
            {snack.message}
          </MuiAlert>
        </Snackbar>

        <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
      </Box>
         {/* Payment Summary Section */}
       {paymentSummary.length > 0 && (
  <Card 
    elevation={0}
    sx={{ 
      mt: 4,
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
      overflow: 'hidden'
    }}
  >
    {/* Header Section */}
    <Box
      sx={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        px: 4,
        py: 3,
        color: 'white',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
        Payment Summary
        <br/>
                Review your selected plans before proceeding

      </Typography>
    
       <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #fafcff 0%, #ffffff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-1px'
                }}
              >
                ₹{calculateTotal().toLocaleString()}
              </Typography>
              
        <Button
                variant="contained"
                size="large"
                onClick={handleProceedToPayment}
                sx={{
                  background: '#1ff72a',
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 4,
                  py: 1.2,
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 14px rgba(30, 60, 114, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0fcd32 0%, #19d435 100%)',
                    boxShadow: '0 6px 20px rgba(30, 60, 114, 0.5)',
                  }
                }}
              >
                Proceed to Payment
              </Button>
    
    </Box>

    <CardContent sx={{ p: 0 }}>
      {/* Summary Items */}
      <Box sx={{ px: 4, py: 3 }}>
        {paymentSummary.map((group, gIndex) => (
          <Box 
            key={group.groupKey} 
            sx={{ 
              mb: gIndex < paymentSummary.length - 1 ? 4 : 0,
              position: 'relative'
            }}
          >
            {/* Main Info Grid */}
            <Box
              sx={{
                backgroundColor: '#f8fafc',
                borderRadius: 2,
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  borderColor: 'primary.main'
                }
              }}
            >
              <Grid container spacing={3} alignItems="center">
                {/* Plan Info */}
                <Grid item xs={12} md={3}>
                  <Box>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        fontSize: '0.7rem'
                      }}
                    >
                      Plan Details
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        mt: 0.5,
                        mb: 0.5,
                        color: '#1e293b'
                      }}
                    >
                      {group.planName}
                    </Typography>
                    <Chip
                      label={group.investmentRangeLabel}
                      size="small"
                      sx={{
                        backgroundColor: '#e0f2fe',
                        color: '#0369a1',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        height: 22
                      }}
                    />
                  </Box>
                </Grid>

                {/* Tenure */}
                <Grid item xs={6} md={2}>
                  <Box>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        fontSize: '0.7rem'
                      }}
                    >
                      Tenure
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        color: '#1e293b',
                        mt: 0.5
                      }}
                    >
                      {group.validityDays}
                      <Typography 
                        component="span" 
                        variant="body2" 
                        sx={{ ml: 0.5, color: 'text.secondary' }}
                      >
                        Days
                      </Typography>
                    </Typography>
                  </Box>
                </Grid>

                {/* Lead Count */}
                <Grid item xs={6} md={2}>
                  <Box>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        fontSize: '0.7rem'
                      }}
                    >
                      Total Leads
                    </Typography>
                  <Typography
  variant="h6"
  sx={{
    fontWeight: 700,
    color: '#1e293b',
    mt: 0.5
  }}
>
  {group.totalLeads * group.totalStates}
</Typography>
                  </Box>
                </Grid>

                {/* Calculation */}
                <Grid item xs={12} md={3.5}>
                  <Box>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        fontSize: '0.7rem'
                      }}
                    >
                      Calculation
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mt: 0.5,
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ 
                          fontWeight: 700,
                          color: '#0369a1',
                          fontSize: '1rem'
                        }}
                      >
                        ₹{group.pricePerState.toLocaleString()}
                      </Typography>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          backgroundColor: '#e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          color: '#64748b'
                        }}
                      >
                        ×
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{ 
                          fontWeight: 700,
                          color: '#0369a1',
                          fontSize: '1rem'
                        }}
                      >
                        {group.totalStates}
                      </Typography>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          backgroundColor: '#e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          color: '#64748b'
                        }}
                      >
                        =
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{ 
                          fontWeight: 800,
                          color: '#dc2626',
                          fontSize: '1.25rem'
                        }}
                      >
                        ₹{group.amount.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Remove Button */}
                <Grid item xs={12} md={1.5} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
                    onClick={() => handleRemoveGroup(group.groupKey)}
                    sx={{
                      borderRadius: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 2,
                      borderWidth: 1.5,
                      '&:hover': {
                        borderWidth: 1.5,
                        backgroundColor: '#fef2f2'
                      }
                    }}
                  >
                    Remove
                  </Button>
                </Grid>
              </Grid>

              {/* Expandable Details */}
              <Box
                sx={{
                  mt: 3,
                  pt: 3,
                  borderTop: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="caption"
                      sx={{ 
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        fontSize: '0.7rem',
                        mb: 1.5,
                        display: 'block'
                      }}
                    >
                      Investment Ranges ({group.items.length})
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {group.items.map((it) => (
                        <Chip
                          key={it.id}
                          label={`${it.range} • ${it.stateCount} states`}
                          sx={{
                            backgroundColor: 'white',
                            border: '1.5px solid #e2e8f0',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            '&:hover': {
                              backgroundColor: '#f1f5f9'
                            }
                          }}
                          size="small"
                        />
                      ))}
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="caption"
                      sx={{ 
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        fontSize: '0.7rem',
                        mb: 1.5,
                        display: 'block'
                      }}
                    >
                      Covered States ({group.totalStates})
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#475569',
                        lineHeight: 1.6,
                        fontWeight: 500
                      }}
                    >
                      {group.uniqueStates.slice(0, 5).join(", ")}
                      {group.uniqueStates.length > 5 && (
                        <Chip
                          label={`+${group.uniqueStates.length - 5} more`}
                          size="small"
                          sx={{
                            ml: 1,
                            height: 20,
                            fontSize: '0.7rem',
                            backgroundColor: '#dbeafe',
                            color: '#1e40af',
                            fontWeight: 600
                          }}
                        />
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      <Divider />

      
    </CardContent>
  </Card>
)}

    </>
  );
};

export default PackageSelection;