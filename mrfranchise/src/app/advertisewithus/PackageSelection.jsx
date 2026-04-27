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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const PackageSelection = ({ onAddInvestmentRange = () => {} }) => {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brandLoading, setBrandLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selected, setSelected] = useState({});
  const [selectedPlans, setSelectedPlans] = useState({});

  const [numberOfStates, setNumberOfStates] = useState(0);
  const [brandError, setBrandError] = useState(null);
  const [ficoInvestmentRanges, setFicoInvestmentRanges] = useState([]);
  

  // New states for modal
  const [openStateModal, setOpenStateModal] = useState(false);
  const [allStates, setAllStates] = useState([]);
  const [selectedStates, setSelectedStates] = useState(new Set());
  const [statesByInvestmentRange, setStatesByInvestmentRange] = useState({});
const [currentEditingRange, setCurrentEditingRange] = useState(null);
const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });

const openSnack = (message, severity = "info") =>
  setSnack({ open: true, message, severity });

const closeSnack = () => setSnack((s) => ({ ...s, open: false }));


  const { brandUUID: reduxBrandUUID, token: reduxToken } = useSelector(
    (state) => state.auth
  );

  const [localBrandUUID, setLocalBrandUUID] = useState(null);
  const [localAccessToken, setLocalAccessToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLocalBrandUUID(localStorage.getItem("brandUUID"));
      setLocalAccessToken(localStorage.getItem("accessToken"));
    }
  }, []);

  const finalBrandUUID = reduxBrandUUID || localBrandUUID;
  const finalToken = reduxToken || localAccessToken;

  useEffect(() => {
    fetchData();
  }, []);
useEffect(() => {
  if (!finalBrandUUID) {
    console.warn("Brand UUID not found in Redux or localStorage.");
    return;
  }
  fetchBrandDetails(finalBrandUUID, finalToken);
  
  // ADD this block
  const savedStates = localStorage.getItem('investmentRangeStates');
  if (savedStates) {
    setStatesByInvestmentRange(JSON.parse(savedStates));
  }
}, [finalBrandUUID, finalToken]);

const getRangeKey = (investmentRangeLabel, range) =>
  `${investmentRangeLabel}__${range}`;

  // Modal Handlers
const handleOpenStateModal = (investmentRangeLabel, range) => {
  const key = getRangeKey(investmentRangeLabel, range);
  setCurrentEditingRange(key);

  const savedStates = statesByInvestmentRange[key];
  setSelectedStates(new Set(savedStates ?? allStates));

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
  handleCloseStateModal();
};

const getStateCountForRange = (investmentRangeLabel, range) => {
  const key = getRangeKey(investmentRangeLabel, range);
  const savedStates = statesByInvestmentRange[key];
  return savedStates ? savedStates.length : allStates.length;
};

  const handleAddInvestmentRange = (range, investmentRangeLabel) => {
    // Navigate to PaymentBrandUpdate with the investment range data
    onAddInvestmentRange(range, investmentRangeLabel);
  };

  // Normalized range function
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

    const ficoRanges = ficoData.map((item) => item?.investmentRange).filter(Boolean);
    setFicoInvestmentRanges(ficoRanges);

    const expansionLocations =
      brandData?.expansionlocationdata?.expansionLocations?.domestic?.locations || [];

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

    setAllStates(uniqueStatesList);
    
    // Initialize default states for all ranges if not already saved
    const savedStates = localStorage.getItem('investmentRangeStates');
    if (!savedStates) {
      setNumberOfStates(uniqueStatesList.length);
      setSelectedStates(new Set(uniqueStatesList));
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
 console.log("Complete API Response:", json);
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

  return (
    <Box sx={{ p: 3 }}>
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
              <TableCell>Price</TableCell>
              <TableCell>Lead Count</TableCell>
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

              const selectedPlan = getSelectedPlanData(investmentRangeLabel, defaultPlan);
              const selectedPkg =
                selectedPlan?.packages?.find(
                  (p) => p.investmentRangeLabel === investmentRangeLabel
                ) || pkg;

              const isFirstInGroup =
                index === 0 ||
                uniquePackages[index - 1].investmentRangeLabel !== investmentRangeLabel;

              const rowSpan = uniquePackages.filter(
                (item) => item.investmentRangeLabel === investmentRangeLabel
              ).length;

              return (
                <React.Fragment key={id}>
                  {isFirstInGroup && (
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell colSpan={8} sx={{ fontWeight: "bold", fontSize: "1rem" }}>
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
          // prevent default checkbox toggle
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
                          sx={{
                            fontWeight: 600,
                            borderRadius: "6px",
                          }}
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

                    {/* No. Of States with Edit Icon */}
                 <TableCell>
  {brandLoading ? (
    <CircularProgress size={18} />
  ) : (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
{getStateCountForRange(investmentRangeLabel, range)} states
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

                    {isFirstInGroup && (
                      <TableCell rowSpan={rowSpan}>
                        <FormControl size="small" fullWidth>
                          <Select
                            value={selectedPlans[investmentRangeLabel] || defaultPlan._id}
                            onChange={(e) =>
                              handlePlanChange(investmentRangeLabel, e.target.value)
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
                      </>
                    )}
                    <TableCell>
  {selected[id] && (
    <Button
      variant="contained"
      size="small"
      onClick={() => {
        // TODO: do something with this row
        // example: navigate
        router.push("/brandDashboard/payment");
      }}
    >
      Add to Payment
    </Button>
  )}
</TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* States Selection Modal */}
      <Dialog open={openStateModal} onClose={handleCloseStateModal} maxWidth="sm" fullWidth>
      <DialogTitle>
  Select States for {currentEditingRange} ({selectedStates.size} selected of {allStates.length})
</DialogTitle>
        <DialogContent dividers sx={{ maxHeight: 420, overflow: "auto" }}>
          {allStates.length > 0 ? (
            allStates.map((state) => (
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
            <Typography color="text.secondary">No states found.</Typography>
          )}
        </DialogContent>
  
       <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
  
  {/* LEFT SIDE */}
  <Box display="flex" alignItems="center" gap={1}>
  <Button
  variant="outlined"
  onClick={() => router.push("/brandDashboard/brand_listing_controller")}
>
  Add More States
</Button>

    <Tooltip title="If you add more states, your profile preferences will be updated. Are you sure you want to proceed?">
      <InfoOutlinedIcon sx={{ color: "text.secondary", cursor: "pointer" }} />
    </Tooltip>
  </Box>

  {/* RIGHT SIDE */}
  <Box display="flex" gap={1}>
    <Button onClick={handleCloseStateModal} color="inherit">
      Cancel
    </Button>
    <Button
      onClick={handleSaveStates}
      variant="contained"
      color="primary"
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
  <MuiAlert onClose={closeSnack} severity={snack.severity} variant="filled">
    {snack.message}
  </MuiAlert>
</Snackbar>
    </Box>
  );
};

export default PackageSelection;