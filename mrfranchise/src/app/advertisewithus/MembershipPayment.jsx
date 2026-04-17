"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";

const MembershipSelection = () => {
  // UI state
  const [selectedInvestmentRange, setSelectedInvestmentRange] = useState([]);
  const [selectedIndiaStates, setSelectedIndiaStates] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [expandedRegion, setExpandedRegion] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [lockedSelection, setLockedSelection] = useState({ ranges: [], states: [] });

  // Edit confirmation dialog state
  const [editConfirmOpen, setEditConfirmOpen] = useState(false);
  const [pendingEditData, setPendingEditData] = useState(null);

  // Added selections state
  const [addedSelections, setAddedSelections] = useState([]);

  // API state
  const [plansApi, setPlansApi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/admin/plans/getAllPlans");
        const json = await res.json();
        if (json.success) {
          setPlansApi(json.data);
        } else {
          setError("Failed to fetch plans");
        }
      } catch (err) {
        setError("Error connecting to API");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

const investmentRanges = plansApi.length
  ? plansApi[0].packages.flatMap(pkg =>
      pkg.investmentRange.map(range => ({
        label: range,
        value: range,
        group: pkg.investmentRangeLabel,
      }))
    )
  : [];

 const groupedInvestmentRanges = plansApi.length
  ? plansApi[0].packages.map(pkg => ({
      title: pkg.investmentRangeLabel,
      items: pkg.investmentRange.map(range => ({
        label: range,
        value: range,
      })),
    }))
  : [];

  const indiaRegions = {
    "North India": [
      { name: "Himachal Pradesh", code: "HP" },
      { name: "Punjab", code: "PB" },
      { name: "Uttarakhand", code: "UK" },
      { name: "Uttar Pradesh", code: "UP" },
      { name: "Haryana", code: "HR" },
      { name: "Rajasthan", code: "RJ" },
      { name: "Jammu and Kashmir", code: "JK" },
      { name: "Ladakh", code: "LA" },
      { name: "Delhi", code: "DL" },
      { name: "Chandigarh", code: "CH" },
    ],
    "South India": [
      { name: "Tamil Nadu", code: "TN" },
      { name: "Kerala", code: "KL" },
      { name: "Karnataka", code: "KA" },
      { name: "Andhra Pradesh", code: "AP" },
      { name: "Telangana", code: "TS" },
      { name: "Lakshadweep", code: "LD" },
      { name: "Puducherry", code: "PY" },
      { name: "Andaman and Nicobar Islands", code: "AN" },
    ],
    "East India": [
      { name: "Bihar", code: "BR" },
      { name: "Jharkhand", code: "JH" },
      { name: "West Bengal", code: "WB" },
      { name: "Odisha", code: "OD" },
    ],
    "North East India": [
      { name: "Arunachal Pradesh", code: "AR" },
      { name: "Assam", code: "AS" },
      { name: "Meghalaya", code: "ML" },
      { name: "Nagaland", code: "NL" },
      { name: "Manipur", code: "MN" },
      { name: "Mizoram", code: "MZ" },
      { name: "Tripura", code: "TR" },
      { name: "Sikkim", code: "SK" },
    ],
    "West India": [
      { name: "Gujarat", code: "GJ" },
      { name: "Maharashtra", code: "MH" },
      { name: "Goa", code: "GA" },
      { name: "Dadra and Nagar Haveli and Daman and Diu", code: "DN" },
    ],
    "Central India": [
      { name: "Madhya Pradesh", code: "MP" },
      { name: "Chhattisgarh", code: "CG" },
    ],
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  
  const handleRegionChange = (panel) => (event, isExpanded) => {
    setExpandedRegion(isExpanded ? panel : false);
  };

  // Enable/disable steps based on selections
  const isStatesEnabled = true;
  const isCategoryEnabled = selectedInvestmentRange.length > 0 && selectedIndiaStates.length > 0;
  const canAddSelection = selectedInvestmentRange.length > 0 && selectedIndiaStates.length > 0 && selectedPlan;

  // Helpers
  const getStatesSummary = (statesArray) => {
    const count = statesArray?.length || 0;
    return `${count} State${count !== 1 ? "s" : ""}`;
  };

  const getSelectedStateNames = (statesArray) => {
    return (statesArray || []).map(getStateNameByCode).filter(Boolean).join(", ");
  };

  const getStateNameByCode = (code) => {
    for (const statesList of Object.values(indiaRegions)) {
      const found = statesList.find((s) => s.code === code);
      if (found) return found.name;
    }
    return code;
  };



  // Function to handle when user clicks Edit on recommended row
  const handleEditRecommended = (row) => {
    setPendingEditData(row);
    setEditConfirmOpen(true);
  };

  // Function to confirm editing the recommended selection
  const handleConfirmEdit = () => {
    if (!pendingEditData) return;

    let rangeVal = Array.isArray(pendingEditData.rangeValue) 
      ? pendingEditData.rangeValue[0] 
      : (pendingEditData.rangeValue || pendingEditData.rangeLabel);
    
    const matched = investmentRanges.find(ir => ir.value === rangeVal || ir.label === rangeVal);
    const finalRange = matched?.value || rangeVal;
    setSelectedInvestmentRange(finalRange ? [finalRange] : []);

    const groupIdx = groupedInvestmentRanges.findIndex(g => g.items.some(i => i.value === finalRange));
    if (groupIdx !== -1) setExpanded(groupIdx);

    const codes = [...new Set((pendingEditData.states || []).map(getStateCodeByName).filter(Boolean))];
    setSelectedIndiaStates(codes);

    const firstRegion = Object.entries(indiaRegions).find(([,list]) => 
      list.some(s => codes.includes(s.code))
    )?.[0];
    if (firstRegion) setExpandedRegion(firstRegion);

    setSelectedPlan(pendingEditData.category);
    setIsEditing(true);
    setLockedSelection({ ranges: finalRange ? [finalRange] : [], states: codes });
    
    setEditConfirmOpen(false);
    setPendingEditData(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditConfirmOpen(false);
    setPendingEditData(null);
  };

const getPackageForRange = (uiRangeValue, planName) => {
  const planObj = plansApi.find(p => p.planName === planName);
  if (!planObj) return null;

  return planObj.packages.find(pkg =>
    pkg.investmentRange.includes(uiRangeValue)
  ) || null;
};

  // Handle Add Selection
const handleAddSelection = () => {
  if (!canAddSelection) return;

  // 🚫 prevent duplicate investment range
  const alreadyExists = selectedInvestmentRange.some(range =>
    addedSelections.some(sel => sel.rangeValue === range)
  );

  if (alreadyExists) {
    alert("This investment range is already added.");
    return;
  }

  const newSelections = selectedInvestmentRange.map((rangeValue) => {
    const rangeLabel =
      investmentRanges.find((ir) => ir.value === rangeValue)?.label || rangeValue;

    const pkg = getPackageForRange(rangeValue, selectedPlan);
    const statesCount = selectedIndiaStates.length || 1;
    const baseAmount = pkg?.amount ?? null;
    const baseLeads = pkg?.totalLeads ?? null;
    const totalLeads = baseLeads != null ? baseLeads * statesCount : "—";
    const baseValidity = pkg?.validityDays ?? null;

    return {
      id: Date.now() + Math.random(),
      rangeValue,
      rangeLabel,
      states: [...selectedIndiaStates],
      statesSummary: getStatesSummary(selectedIndiaStates),
      stateNames: getSelectedStateNames(selectedIndiaStates),
      category: selectedPlan,
      leadCount: totalLeads,
      tenure: baseValidity != null ? `${baseValidity} days` : "—",
      price:
        baseAmount != null
          ? `₹${(baseAmount * statesCount).toLocaleString("en-IN")}`
          : "Price unavailable",
      hasPricing: baseAmount != null && baseAmount >= 0,
      baseAmount,
      statesCount,
    };
  });

  setAddedSelections((prev) => [...prev, ...newSelections]);

  // Reset selections
  setSelectedInvestmentRange([]);
  setSelectedIndiaStates([]);
  setSelectedPlan("");
  setIsEditing(false);
};

  const getSelectedCountByRegion = (statesList) => {
    return statesList.filter((state) =>
      selectedIndiaStates.includes(state.code)).length;
  };

  // Handle Remove Selection
  const handleRemoveSelection = (id) => {
    setAddedSelections((prev) => prev.filter((item) => item.id !== id));
  };

  const getStateCodeByName = (nameOrCode) => {
    if (!nameOrCode) return null;
    const allStates = Object.values(indiaRegions).flat();
    
    if (allStates.some(s => s.code === nameOrCode)) return nameOrCode;
    
    const normalize = str => String(str).toLowerCase().replace(/&/g,'and').replace(/\s+/g,' ').trim();
    const search = normalize(nameOrCode);
    
    const aliases = {
      'andaman & nicobar islands': 'AN',
      'andaman and nicobar islands': 'AN',
      'daman & diu': 'DN',
      'daman and diu': 'DN',
    };
    if (aliases[search]) return aliases[search];

    const found = allStates.find(s => normalize(s.name) === search);
    return found?.code || null;
  };

  // Session data for recommended section
  const investrangefromSession = JSON.parse(sessionStorage.getItem("investmentrange") || "[]");
  const domesticLocationsFromSession = JSON.parse(sessionStorage.getItem("domesticlocations") || "[]");

  const rawStates = domesticLocationsFromSession.map(loc => loc.state);
  const sessionStateCodes = [...new Set(rawStates.map(getStateCodeByName).filter(Boolean))];

  const sessionStateNames = sessionStateCodes.map(getStateNameByCode).filter(Boolean).join(", ");
  const sessionStatesCount = sessionStateCodes.length || 1;

  const sessionRangeRaw = Array.isArray(investrangefromSession) ? investrangefromSession[0] : investrangefromSession;
  const rangeMatch = investmentRanges.find(ir => ir.value === sessionRangeRaw || ir.label === sessionRangeRaw);
  const sessionRangeValue = rangeMatch?.value || sessionRangeRaw;
  const sessionRangeLabel = rangeMatch?.label || sessionRangeRaw;

  const defaultPlanName = plansApi.length > 0 ? plansApi[0].planName : "LAUNCH PAD PROGRAM";
  const sessionPkg = getPackageForRange(sessionRangeValue, defaultPlanName);

  const sessionBaseAmount = sessionPkg?.amount ?? null;
  const sessionBaseLeads = sessionPkg?.totalLeads ?? null;
  const sessionTotalLeads = sessionBaseLeads != null
    ? sessionBaseLeads * sessionStatesCount
    : "—";
  const sessionBaseValidity = sessionPkg?.validityDays ?? null;

  const sessionRows =
    sessionRangeValue && sessionStateCodes.length > 0
      ? [{
          rangeValue: sessionRangeValue,
          rangeLabel: sessionRangeLabel,
          states: sessionStateCodes,
          statesSummary: `${sessionStatesCount} State${sessionStatesCount !== 1 ? "s" : ""}`,
          stateNames: sessionStateNames,
          category: defaultPlanName,
          leadCount: sessionTotalLeads,
          tenure: sessionBaseValidity ? `${sessionBaseValidity} days` : "—",
          price: sessionBaseAmount != null
            ? `₹${(sessionBaseAmount * sessionStatesCount).toLocaleString("en-IN")}`
            : "Contact us",
          hasPricing: sessionBaseAmount != null,
          type: "recommended",
        }]
      : [];

  const hasSessionData = sessionRows.length > 0;
  const hasAddedSelections = addedSelections.length > 0;

  // Combined rows for display
  const combinedRows = [
    ...sessionRows,
    ...addedSelections.map(row => ({ ...row, type: "added" })),
  ];

  // Styles
  const cardStyle = {
    width: 300,
    minWidth: 300,
    maxWidth: 300,
    height: 460,
    borderRadius: "20px",
    bgcolor: "#fff",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
    overflow: "hidden",
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
    },
  };
  
  const headerStyle = {
    pb: 1,
    mb: 1,
    borderBottom: "1px solid rgba(0,0,0,0.06)",
  };
  
  const scrollStyle = {
    flex: 1,
    overflowY: "auto",
    mt: 1.5,
    pr: 1,
    mb: 2,
    display: "flex",
    flexDirection: "column",
    gap: 0.8,
    "&::-webkit-scrollbar": { width: "5px" },
    "&::-webkit-scrollbar-thumb": { background: "#ddd", borderRadius: "10px" },
  };
  
  const labelStyle = {
    m: 0,
    alignItems: "flex-start",
    gap: 1,
    "& .MuiCheckbox-root": { p: 0.5, mt: "-2px" },
  };

  const tableHeaderCellStyle = {
    fontWeight: 700,
    color: "#E65100",
    fontSize: 13,
    borderBottom: "2px solid #FFA726",
    whiteSpace: "nowrap",
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 6 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ background: "#f7f7f9", minHeight: "100vh", py: 5 }}>
      <Container maxWidth="xl">
        <Grid container spacing={3} justifyContent="center">
          {/* Investment Range Card */}
          <Grid item>
            <Card sx={cardStyle}>
              <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column", p: 3, pt: 2.5 }}>
                <Box sx={headerStyle}>
                  <Typography fontWeight="700" color="#FFA726" fontSize={16}>
                    Investment Range
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedInvestmentRange.length > 0
                      ? `${selectedInvestmentRange.length} selected`
                      : "Select one or more"}
                  </Typography>
                </Box>
                <Box sx={scrollStyle}>
                  {groupedInvestmentRanges.map((group, idx) => (
                    <Accordion
                      key={idx}
                      disableGutters
                      elevation={0}
                      expanded={expanded === idx}
                      onChange={handleAccordionChange(idx)}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography fontWeight={600} fontSize={14}>
                          {group.title}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ pl: 1 }}>
                        {group.items.map((range) => (
                          <FormControlLabel
                            key={range.value}
                            sx={labelStyle}
                            control={
                              <Checkbox
  size="small"
  checked={selectedInvestmentRange.includes(range.value)}
  disabled={
    (isEditing && !selectedInvestmentRange.includes(range.value)) ||
    [...addedSelections, ...sessionRows].some(s => s.rangeValue === range.value)
  }
  onChange={(e) => {
    const { value } = range;
    setSelectedInvestmentRange(
      e.target.checked
        ? [...selectedInvestmentRange, value]
        : selectedInvestmentRange.filter((v) => v !== value)
    );
  }}
/>
                            }
                            label={<Typography variant="body2">{range.label}</Typography>}
                          />
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* States Card */}
          <Grid item>
            <Card sx={cardStyle}>
              <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%", p: 3, pt: 2.5 }}>
                <Box sx={headerStyle}>
                  <Typography fontWeight="700" color="#FFA726" fontSize={16}>
                    Select States
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedIndiaStates.length} selected
                  </Typography>
                </Box>
                <Box sx={scrollStyle}>
                  {Object.entries(indiaRegions).map(([regionName, statesList]) => (
                    <Accordion
                      key={regionName}
                      disableGutters
                      elevation={0}
                      expanded={expandedRegion === regionName}
                      onChange={handleRegionChange(regionName)}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography fontWeight={600} fontSize={14}>
                          {regionName} ({getSelectedCountByRegion(statesList)})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ pl: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
                        {statesList.map((state) => {
                          const isChecked = selectedIndiaStates.includes(state.code);
                          return (
                            <FormControlLabel
                              key={state.code}
                              sx={{ ...labelStyle, display: "flex", width: "100%" }}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={isChecked}
                                  disabled={isEditing ? !isChecked : !isStatesEnabled}
                                  onChange={(e) => {
                                    const { code } = state;
                                    setSelectedIndiaStates(
                                      e.target.checked
                                        ? [...selectedIndiaStates, code]
                                        : selectedIndiaStates.filter((s) => s !== code)
                                    );
                                  }}
                                />
                              }
                              label={<Typography variant="body2">{state.name}</Typography>}
                            />
                          );
                        })}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Category Card */}
          <Grid item>
            <Card sx={cardStyle}>
              <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%", p: 3, pt: 2.5 }}>
                <Box sx={headerStyle}>
                  <Typography fontWeight="700" color="#FFA726" fontSize={16}>
                    Category
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedPlan ? "1 selected" : "Select one"}
                  </Typography>
                </Box>
                <Box sx={scrollStyle}>
                  {plansApi.map((item) => (
                    <FormControlLabel
                      key={item._id}
                      sx={labelStyle}
                      control={
                        <Checkbox
                          size="small"
                          disabled={!isCategoryEnabled && !isEditing}
                          checked={selectedPlan === item.planName}
                          onChange={(e) =>
                            setSelectedPlan(e.target.checked ? item.planName : "")
                          }
                        />
                      }
                      label={<Typography variant="body2">{item.planName}</Typography>}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Add Button Section */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 2, flexDirection: "column", alignItems: "center" }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            disabled={!canAddSelection}
            onClick={handleAddSelection}
            sx={{
              bgcolor: canAddSelection ? "#FFA726" : "#ccc",
              color: "#fff",
              px: 5,
              py: 1.5,
              borderRadius: 3,
              fontWeight: 700,
              fontSize: 16,
              textTransform: "none",
              boxShadow: canAddSelection ? "0 4px 15px rgba(255, 167, 38, 0.4)" : "none",
              "&:hover": {
                bgcolor: canAddSelection ? "#FF9800" : "#ccc",
                boxShadow: canAddSelection ? "0 6px 20px rgba(255, 167, 38, 0.5)" : "none",
              },
              "&:disabled": {
                bgcolor: "#e0e0e0",
                color: "#9e9e9e",
              },
              transition: "all 0.3s ease",
            }}
          >
            {canAddSelection ? "Add Selection" : "Add"}
          </Button>
        </Box>

        {/* SUMMARY TABLES */}
        {combinedRows.length > 0 && (
          <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
            <Paper elevation={2} sx={{ width: "100%", maxWidth: "1200px", overflowX: "auto" }}>
              <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>
                <Typography sx={{ fontWeight: 700, textAlign: "center", fontSize: 16 }}>
                  📌 Recommended Based on Your Previous Selection
                </Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#eeeeee" }}>
                      <TableCell sx={tableHeaderCellStyle}>Investment Range</TableCell>
                      <TableCell sx={tableHeaderCellStyle}>No. Of States</TableCell>
                      <TableCell sx={tableHeaderCellStyle}>States</TableCell>
                      <TableCell sx={tableHeaderCellStyle}>Plan</TableCell>
                      <TableCell align="right" sx={tableHeaderCellStyle}>Lead Count</TableCell>
                      <TableCell align="right" sx={tableHeaderCellStyle}>Tenure</TableCell>
                      <TableCell align="right" sx={tableHeaderCellStyle}>Price</TableCell>
                      <TableCell align="center" sx={tableHeaderCellStyle}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {combinedRows.map((row, index) => {
                      const isRecommended = row.type === "recommended";
                      return (
                        <TableRow
                          key={index}
                          sx={{
                            bgcolor: isRecommended
                              ? "#FFF8E1"
                              : index % 2 === 0
                              ? "#fafafa"
                              : "#fff",
                            "&:hover": {
                              bgcolor: isRecommended ? "#FFE0B2" : "#FFF3E0",
                            },
                          }}
                        >
                          <TableCell>
                            <Typography fontWeight={600}>{row.rangeLabel}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight={600}>{row.statesSummary}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">{row.stateNames}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight={200}>
                              {isRecommended ? ` ${row.category}` : row.category}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight={600}>{row.leadCount}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight={600}>{row.tenure}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              fontWeight={700}
                              color={row.hasPricing ? "primary.main" : "error.main"}
                            >
                              {row.price}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            {isRecommended ? (
                              <Button
                                size="small"
                                variant="contained"
                                sx={{
                                  bgcolor: "#1976d2",
                                  textTransform: "none",
                                  fontSize: 12,
                                }}
                                onClick={() => handleEditRecommended(row)}
                              >
                                Edit
                              </Button>
                            ) : (
                              <Button
                                size="small"
                                color="error"
                                variant="outlined"
                                onClick={() => handleRemoveSelection(row.id)}
                                sx={{ minWidth: "auto", px: 1 }}
                              >
                                ✕
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        )}
      </Container>

      {/* Edit Confirmation Dialog */}
      <Dialog
        open={editConfirmOpen}
        onClose={handleCancelEdit}
        aria-labelledby="edit-confirmation-dialog-title"
        aria-describedby="edit-confirmation-dialog-description"
      >
        <DialogTitle id="edit-confirmation-dialog-title">
          Edit Recommended Selection
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="edit-confirmation-dialog-description">
            Are you sure you want to edit this recommended selection? 
           
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmEdit} color="primary" autoFocus variant="contained">
            Yes, Edit Selection
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MembershipSelection;