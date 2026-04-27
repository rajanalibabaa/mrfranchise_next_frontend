"use client";

import React, { useState, useEffect } from "react";
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
import { useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

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

// Function to get user's location using IP-based geolocation
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
  const [detectedState, setDetectedState] = useState(null); // IP detected state

  // State selection
  const [openStateModal, setOpenStateModal] = useState(false);
  const [allStates, setAllStates] = useState(INDIA_STATES); // Default to all states
  const [selectedStates, setSelectedStates] = useState(new Set());
  const [statesByInvestmentRange, setStatesByInvestmentRange] = useState({});
  const [currentEditingRange, setCurrentEditingRange] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });

  const { brandUUID: reduxBrandUUID, token: reduxToken } = useSelector(
    (state) => state.auth
  );

  const [localBrandUUID, setLocalBrandUUID] = useState(null);
  const [localAccessToken, setLocalAccessToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLocalBrandUUID(localStorage.getItem("brandUUID"));
      setLocalAccessToken(localStorage.getItem("accessToken"));

      // Load saved state selections
      const savedStates = localStorage.getItem("investmentRangeStates");
      if (savedStates) {
        setStatesByInvestmentRange(JSON.parse(savedStates));
      }
    }
  }, []);

  const finalBrandUUID = reduxBrandUUID || localBrandUUID;
  const finalToken = reduxToken || localAccessToken;

  const openSnack = (message, severity = "info") =>
    setSnack({ open: true, message, severity });

  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  // Auto-detect location via IP (BEFORE LOGIN ONLY)
  useEffect(() => {
    const detectLocation = async () => {
      // Only detect if NOT logged in
      if (finalToken) return;

      // Check if location was already detected
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

      // Auto-detect location via IP
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

  const getRangeKey = (investmentRangeLabel, range) =>
    `${investmentRangeLabel}__${range}`;

  const isGroupPartiallyAdded = (investmentRangeLabel, uniquePackages) => {
    return uniquePackages.some((item) => {
      if (item.investmentRangeLabel !== investmentRangeLabel) return false;
      return paymentSummary.some((g) => g.items.some((it) => it.id === item.id));
    });
  };

  // Modal Handlers
  const handleOpenStateModal = (investmentRangeLabel, range) => {
    const key = getRangeKey(investmentRangeLabel, range);
    setCurrentEditingRange(key);

    const savedStates = statesByInvestmentRange[key];

    if (savedStates && savedStates.length > 0) {
      // Use previously saved states
      setSelectedStates(new Set(savedStates));
    } else {
      // Set default based on login status
      if (!finalToken && detectedState) {
        // Before login: pre-select IP detected state
        setSelectedStates(new Set([detectedState]));
      } else if (finalToken && allStates.length > 0) {
        // After login: pre-select all expansion states
        setSelectedStates(new Set(allStates));
      } else {
        setSelectedStates(new Set());
      }
    }

    setOpenStateModal(true);
  };

  const handleCloseStateModal = () => setOpenStateModal(false);

  const handleStateCheckboxChange = (state) => {
    setSelectedStates((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(state)) newSet.delete(state);
      else newSet.add(state);
      return newSet;
    });
  };

  const handleSaveStates = () => {
    const selectedArray = Array.from(selectedStates);

    const updated = {
      ...statesByInvestmentRange,
      [currentEditingRange]: selectedArray,
    };

    setStatesByInvestmentRange(updated);
    localStorage.setItem("investmentRangeStates", JSON.stringify(updated));
    openSnack(`Saved ${selectedArray.length} state${selectedArray.length > 1 ? 's' : ''}`, "success");
    handleCloseStateModal();
  };

  const getUniqueStatesAcrossRanges = (items) => {
    const allStatesSet = new Set();
    items.forEach((item) => {
      item.states.forEach((state) => allStatesSet.add(state));
    });
    return Array.from(allStatesSet);
  };

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

      // Extract expansion location states (AFTER LOGIN)
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

      // After login: ONLY use brand's expansion states
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

        const launchPadPlan = json.data.find(
          (plan) => plan.planName?.toLowerCase() === "launch pad program"
        );

        if (launchPadPlan) {
          const investmentRangeLabels = new Set();
          json.data.forEach((plan) => {
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

  const getUniquePackages = () => {
    const uniqueMap = new Map();
    plans.forEach((plan) => {
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
              allPlans: plans,
            });
          }
        });
      });
    });
    return Array.from(uniqueMap.values());
  };

  const handleCheckboxChange = (id) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePlanChange = (investmentRangeLabel, planId) => {
    setSelectedPlans((prev) => ({
      ...prev,
      [investmentRangeLabel]: planId,
    }));
  };

  const getSelectedPlanData = (investmentRangeLabel, defaultPlan) => {
    const selectedPlanId = selectedPlans[investmentRangeLabel];
    if (!selectedPlanId) return defaultPlan;
    return plans.find((plan) => plan._id === selectedPlanId) || defaultPlan;
  };

  const normalizeRange = (value) => {
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
  };

  const isFicoInvestmentRange = (range) => {
    const currentRange = normalizeRange(range);
    return ficoInvestmentRanges.some(
      (ficoRange) => normalizeRange(ficoRange) === currentRange
    );
  };

  const handleAddToPayment = (investmentRangeLabel, uniquePackages) => {
    const defaultPlanForLabel = plans.find((p) =>
      p.packages?.some((pkg) => pkg.investmentRangeLabel === investmentRangeLabel)
    );

    if (!defaultPlanForLabel) return;

    const selectedPlan = getSelectedPlanData(
      investmentRangeLabel,
      defaultPlanForLabel
    );
    const selectedPkg = selectedPlan?.packages?.find(
      (p) => p.investmentRangeLabel === investmentRangeLabel
    );

    if (!selectedPkg) {
      openSnack("No package details found for this selection", "warning");
      return;
    }

    const pricePerState = selectedPkg?.amount || 0;

    const itemsToAdd = uniquePackages
      .filter((item) => {
        if (item.investmentRangeLabel !== investmentRangeLabel) return false;
        if (!selected[item.id]) return false;

        const itemPlan = getSelectedPlanData(
          item.investmentRangeLabel,
          item.defaultPlan
        );
        const itemPkg =
          itemPlan?.packages?.find(
            (p) => p.investmentRangeLabel === investmentRangeLabel
          ) || item.pkg;

        return (
          itemPlan._id === selectedPlan._id &&
          itemPkg?.amount === selectedPkg?.amount &&
          itemPkg?.validityDays === selectedPkg?.validityDays
        );
      })
      .map((item) => {
        const key = getRangeKey(item.investmentRangeLabel, item.range);
        let states = statesByInvestmentRange[key];
        
        // If no saved states, use defaults based on login status
        if (!states || states.length === 0) {
          if (!finalToken && detectedState) {
            states = [detectedState]; // Before login: use detected state
          } else if (finalToken) {
            states = allStates; // After login: use expansion states
          } else {
            states = [];
          }
        }
        
        return {
          id: item.id,
          investmentRangeLabel: item.investmentRangeLabel,
          range: item.range,
          stateCount: states.length,
          states: states,
        };
      });

    if (itemsToAdd.length === 0) {
      openSnack(
        "Please select at least one investment range checkbox",
        "warning"
      );
      return;
    }

    const uniqueStates = getUniqueStatesAcrossRanges(itemsToAdd);
    const totalUniqueStates = uniqueStates.length;
    const dynamicAmount = totalUniqueStates * pricePerState;

    const groupKey = `${selectedPlan._id}__${selectedPkg?.validityDays}__${pricePerState}__${selectedPkg?.totalLeads}`;

    setPaymentSummary((prev) => {
      const existingGroup = prev.find((g) => g.groupKey === groupKey);

      if (existingGroup) {
        const newItems = itemsToAdd.filter(
          (newItem) => !existingGroup.items.some((ex) => ex.id === newItem.id)
        );

        if (newItems.length === 0) {
          openSnack("These ranges are already added", "info");
          return prev;
        }

        const updatedItems = [...existingGroup.items, ...newItems];
        const newUniqueStates = getUniqueStatesAcrossRanges(updatedItems);
        const newTotalUniqueStates = newUniqueStates.length;
        const newAmount = newTotalUniqueStates * pricePerState;

        openSnack(
          `${newItems.length} ranges added. Unique States: ${newTotalUniqueStates}, Total: ₹${newAmount}`,
          "success"
        );

        return prev.map((g) =>
          g.groupKey === groupKey
            ? {
                ...g,
                items: updatedItems,
                uniqueStates: newUniqueStates,
                totalStates: newTotalUniqueStates,
                amount: newAmount,
              }
            : g
        );
      }

      openSnack(
        `Package added: ${totalUniqueStates} unique states × ₹${pricePerState} = ₹${dynamicAmount}`,
        "success"
      );
      return [
        ...prev,
        {
          groupKey,
          planId: selectedPlan._id,
          planName: selectedPlan.planName,
          validityDays: selectedPkg?.validityDays,
          pricePerState: pricePerState,
          uniqueStates: uniqueStates,
          totalStates: totalUniqueStates,
          amount: dynamicAmount,
          totalLeads: selectedPkg?.totalLeads,
          items: itemsToAdd,
        },
      ];
    });
  };

  const handleRemoveItem = (groupKey, itemId) => {
    setPaymentSummary((prev) => {
      const updated = prev
        .map((g) => {
          if (g.groupKey !== groupKey) return g;

          const updatedItems = g.items.filter((it) => it.id !== itemId);

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

    setSelected((prev) => ({ ...prev, [itemId]: false }));
    openSnack("Investment range removed", "info");
  };

  const handleRemoveGroup = (groupKey) => {
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
  };

  const calculateTotal = () => {
    return paymentSummary.reduce((sum, g) => sum + (g.amount || 0), 0);
  };

  const handleProceedToPayment = () => {
    if (paymentSummary.length === 0) {
      openSnack("Please add at least one package", "warning");
      return;
    }
    localStorage.setItem("paymentSummary", JSON.stringify(paymentSummary));
    router.push("/brandDashboard/payment");
  };

  const getStateCountForRange = (investmentRangeLabel, range) => {
    const key = getRangeKey(investmentRangeLabel, range);
    const savedStates = statesByInvestmentRange[key];
    
    if (savedStates && savedStates.length > 0) return savedStates.length;
    
    // Before login: return 1 if state detected
    if (!finalToken && detectedState) return 1;
    
    // After login: return expansion states count
    if (finalToken) return allStates.length;
    
    return 0;
  };

  const handleAddInvestmentRange = (range, investmentRangeLabel) => {
    onAddInvestmentRange(range, investmentRangeLabel);
  };

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

  const uniquePackages = getUniquePackages();

  // Get states to display in modal based on login status
  const getStatesToDisplay = () => {
    if (finalToken) {
      // After login: show only expansion states
      return allStates;
    } else {
      // Before login: show all Indian states
      return INDIA_STATES;
    }
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        {/* User Location Display (Before Login Only) */}
        {!finalToken && userLocation && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Detected Location: {userLocation.city}, {userLocation.state}
          </Alert>
        )}

        {/* Brand Expansion States Display (After Login Only) */}
        {finalToken && allStates.length > 0 && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Showing packages for {allStates.length} expansion state{allStates.length > 1 ? 's' : ''}: {allStates.slice(0, 3).join(", ")}
            {allStates.length > 3 && ` +${allStates.length - 3} more`}
          </Alert>
        )}

        {/* No States Warning (After Login) */}
        {finalToken && allStates.length === 0 && (
          <Alert 
            severity="warning" 
            sx={{ mb: 2 }}
            action={
              <Button 
                color="inherit" 
                size="small"
                onClick={() => router.push("/brandDashboard/brand_listing_controller")}
              >
                Add States
              </Button>
            }
          >
            No expansion states found. Please add expansion locations to your profile.
          </Alert>
        )}

        {brandError && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Could not fetch brand states: {brandError}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#fff8e1" }}>
              <TableRow>
                <TableCell>Select</TableCell>
                <TableCell>Investment Range</TableCell>
                <TableCell>Recommended</TableCell>
                <TableCell>No. Of States</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Tenure</TableCell>
                <TableCell>
                  Price
                  <br />
                  (Per state)
                </TableCell>
                <TableCell>Lead Count</TableCell>
                <TableCell>
                  Total
                  <br />
                  Amount
                </TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {uniquePackages.map((item, index) => {
                const {
                  id,
                  investmentRangeLabel,
                  range,
                  defaultPlan,
                  pkg,
                  allPlans,
                } = item;

                const selectedPlan = getSelectedPlanData(
                  investmentRangeLabel,
                  defaultPlan
                );
                const selectedPkg =
                  selectedPlan?.packages?.find(
                    (p) => p.investmentRangeLabel === investmentRangeLabel
                  ) || pkg;

                const isFirstInGroup =
                  index === 0 ||
                  uniquePackages[index - 1].investmentRangeLabel !==
                    investmentRangeLabel;

                const rowSpan = uniquePackages.filter(
                  (pkgItem) =>
                    pkgItem.investmentRangeLabel === investmentRangeLabel
                ).length;

                return (
                  <React.Fragment key={id}>
                    {isFirstInGroup && (
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell
                          colSpan={10}
                          sx={{ fontWeight: "bold", fontSize: "1rem" }}
                        >
                          {investmentRangeLabel}
                        </TableCell>
                      </TableRow>
                    )}

                    <TableRow hover>
                      <TableCell padding="checkbox">
                        {(() => {
                          const isRecommended = isFicoInvestmentRange(range);
                          return (
                            <Checkbox
                              checked={!!selected[id]}
                              onClick={(e) => {
                                e.preventDefault();
                                if (!isRecommended) {
                                  openSnack(
                                    "You have to add this investment range to your business model to select it.",
                                    "warning"
                                  );
                                  return;
                                }
                                handleCheckboxChange(id);
                              }}
                            />
                          );
                        })()}
                      </TableCell>

                      <TableCell>{range}</TableCell>

                      <TableCell>
                        {isFicoInvestmentRange(range) ? (
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
                            onClick={() =>
                              handleAddInvestmentRange(range, investmentRangeLabel)
                            }
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
                              onClick={() =>
                                handleOpenStateModal(investmentRangeLabel, range)
                              }
                              title="Edit States"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                      </TableCell>

                      {isFirstInGroup && (
                        <TableCell rowSpan={rowSpan}>
                          <FormControl size="small" fullWidth>
                            <Select
                              value={
                                selectedPlans[investmentRangeLabel] ||
                                defaultPlan._id
                              }
                              onChange={(e) =>
                                handlePlanChange(
                                  investmentRangeLabel,
                                  e.target.value
                                )
                              }
                              sx={{ minWidth: 120 }}
                            >
                              {allPlans.map((plan) => (
                                <MenuItem key={plan._id} value={plan._id}>
                                  {plan.planName}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                      )}

                      {isFirstInGroup && (
                        <>
                          <TableCell rowSpan={rowSpan}>
                            {selectedPkg?.validityDays} Days
                          </TableCell>
                          <TableCell rowSpan={rowSpan}>
                            ₹{selectedPkg?.amount}
                          </TableCell>
                          <TableCell rowSpan={rowSpan}>
                            {selectedPkg?.totalLeads}
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell rowSpan={rowSpan} align="center">
                            {!isGroupPartiallyAdded(
                              investmentRangeLabel,
                              uniquePackages
                            ) ? (
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() =>
                                  handleAddToPayment(
                                    investmentRangeLabel,
                                    uniquePackages
                                  )
                                }
                              >
                                Add to Payment
                              </Button>
                            ) : (
                              <Chip
                                label="Added"
                                color="success"
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Payment Summary Section */}
        {paymentSummary.length > 0 && (
          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Payment Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {paymentSummary.map((group, gIndex) => (
                <Box key={group.groupKey} sx={{ mb: 3 }}>
                  <Grid container spacing={2} alignItems="center" sx={{ py: 2 }}>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="text.secondary">
                        Plan
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {group.planName}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} md={2}>
                      <Typography variant="body2" color="text.secondary">
                        Tenure
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {group.validityDays} Days
                      </Typography>
                    </Grid>

                    <Grid item xs={6} md={2}>
                      <Typography variant="body2" color="text.secondary">
                        Lead Count
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {group.totalLeads}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="text.secondary">
                        Calculation
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          color="primary"
                        >
                          ₹{group.pricePerState}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ×
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          color="primary"
                        >
                          {group.totalStates} States
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          =
                        </Typography>
                        <Typography
                          variant="h6"
                          color="error"
                          fontWeight={700}
                        >
                          ₹{group.amount.toLocaleString()}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={2} sx={{ textAlign: "right" }}>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleRemoveGroup(group.groupKey)}
                      >
                        Remove
                      </Button>
                    </Grid>
                  </Grid>

                  <Box
                    sx={{
                      pl: 2,
                      borderLeft: "3px solid #e0e0e0",
                      ml: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Included Investment Ranges ({group.items.length})
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {group.items.map((it) => (
                        <Chip
                          key={it.id}
                          label={`${it.range} (${it.stateCount} states)`}
                          onDelete={() =>
                            handleRemoveItem(group.groupKey, it.id)
                          }
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      ))}
                    </Box>
                  </Box>

                  {gIndex < paymentSummary.length - 1 && (
                    <Divider sx={{ mt: 2 }} />
                  )}
                </Box>
              ))}

              <Divider sx={{ my: 3 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" fontWeight={600}>
                  Total Amount Payable
                </Typography>
                <Typography variant="h4" color="primary" fontWeight={700}>
                  ₹{calculateTotal().toLocaleString()}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setPaymentSummary([]);
                    setSelected({});
                  }}
                >
                  Clear All
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleProceedToPayment}
                >
                  Proceed to Payment
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

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
      </Box>
    </>
  );
};

export default PackageSelection;