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
  Divider,
  Button,
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

  // Added selections state (to store multiple selections)
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

  // Investment range options (UI labels)
  const investmentRanges = [
    { label: "Below ₹50K", value: "Below - 50k" },
    { label: "₹50K - ₹2 Lakhs", value: "Rs. 50k - 2 Lakhs" },
    { label: "₹2 - ₹5 Lakhs", value: "Rs. 2 Lakhs - 5 Lakhs" },
    { label: "₹5 - ₹10 Lakhs", value: "Rs. 5 Lakhs - 10 Lakhs" },
    { label: "₹10 - ₹20 Lakhs", value: "Rs. 10 Lakhs - 20 Lakhs" },
    { label: "₹20 - ₹30 Lakhs", value: "Rs. 20 Lakhs - 30 Lakhs" },
    { label: "₹30 - ₹50 Lakhs", value: "Rs. 30 Lakhs - 50 Lakhs" },
    { label: "₹50 Lakhs - ₹1 Crore", value: "Rs. 50 Lakhs - 1 Crore" },
    { label: "₹1 - ₹2 Crores", value: "Rs. 1 Crore - 2 Crores" },
    { label: "₹2 - ₹5 Crores", value: "Rs. 2 Crore - 5 Crores" },
    { label: "Above ₹5 Crores", value: "Rs. 5 Crores - above" },
  ];

  const groupedInvestmentRanges = [
    {
      title: "Upto ₹50 Lakhs",
      items: investmentRanges.filter((r) =>
        [
          "Below - 50k",
          "Rs. 50k - 2 Lakhs",
          "Rs. 2 Lakhs - 5 Lakhs",
          "Rs. 5 Lakhs - 10 Lakhs",
          "Rs. 10 Lakhs - 20 Lakhs",
          "Rs. 20 Lakhs - 30 Lakhs",
          "Rs. 30 Lakhs - 50 Lakhs",
        ].includes(r.value)
      ),
    },
    {
      title: "₹50 Lakhs to ₹2 Crores",
      items: investmentRanges.filter((r) =>
        ["Rs. 50 Lakhs - 1 Crore", "Rs. 1 Crore - 2 Crores"].includes(r.value)
      ),
    },
    {
      title: "₹2 Crores to ₹20 Crores",
      items: investmentRanges.filter((r) =>
        ["Rs. 2 Crore - 5 Crores", "Rs. 5 Crores - above"].includes(r.value)
      ),
    },
  ];

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
      { name: "Rajasthan", code: "RJ" },
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

  const mapUiRangeToApiRange = (uiValue) => {
    switch (uiValue) {
      case "Below - 50k":
        return "Upto 5 Lakhs";
      case "Rs. 50k - 2 Lakhs":
        return "Upto 5 Lakhs";
      case "Rs. 2 Lakhs - 5 Lakhs":
        return "Upto 5 Lakhs";
      case "Rs. 5 Lakhs - 10 Lakhs":
        return "5 Lakhs - 20 Lakhs";
      case "Rs. 10 Lakhs - 20 Lakhs":
        return "5 Lakhs - 20 Lakhs";
      case "Rs. 20 Lakhs - 30 Lakhs":
        return "20 Lakhs - 50 Lakhs";
      case "Rs. 30 Lakhs - 50 Lakhs":
        return "20 Lakhs - 50 Lakhs";
      case "Rs. 50 Lakhs - 1 Crore":
        return "50 Lakhs to 2 Crores";
      case "Rs. 1 Crore - 2 Crores":
        return "50 Lakhs to 2 Crores";
      case "Rs. 2 Crore - 5 Crores":
        return "2 Crores to 20 Crores";
      case "Rs. 5 Crores - above":
        return "2 Crores to 20 Crores";
      default:
        return "Upto 5 Lakhs";
    }
  };

  // Find package details from API for a given investment range + selected plan
  const getPackageForRange = (uiRangeValue, planName) => {
    const planObj = plansApi.find((p) => p.planName === planName);
    if (!planObj) return null;
    const apiRange = mapUiRangeToApiRange(uiRangeValue);
    return planObj.packages.find((pkg) => pkg.investmentRange === apiRange) || null;
  };

  // Handle Add Selection
  const handleAddSelection = () => {
    if (!canAddSelection) return;

    const newSelections = selectedInvestmentRange.map((rangeValue) => {
      const rangeLabel = investmentRanges.find((ir) => ir.value === rangeValue)?.label || rangeValue;
      const pkg = getPackageForRange(rangeValue, selectedPlan);
      const statesCount = selectedIndiaStates.length || 1;
      const baseAmount = pkg?.amount ?? null;
const baseLeads = pkg?.totalLeads ?? null;
const totalLeads =
  baseLeads != null ? baseLeads * statesCount : "—";
        const baseValidity = pkg?.validityDays ?? null;

      return {
        id: Date.now() + Math.random(), // Unique ID
        rangeValue,
        rangeLabel,
        states: [...selectedIndiaStates],
        statesSummary: getStatesSummary(selectedIndiaStates),
        stateNames: getSelectedStateNames(selectedIndiaStates),
        category: selectedPlan,
 leadCount: totalLeads,
         tenure: baseValidity != null ? `${baseValidity} days` : "—",
        price: baseAmount != null
          ? `₹${(baseAmount * statesCount).toLocaleString("en-IN")}`
          : "Price unavailable",
        hasPricing: baseAmount != null && baseAmount >= 0,
        baseAmount,
        statesCount,
      };
    });

    setAddedSelections((prev) => [...prev, ...newSelections]);

    // Reset selections for new entry
    setSelectedInvestmentRange([]);
    setSelectedIndiaStates([]);
    setSelectedPlan("");
  };
  const getSelectedCountByRegion = (statesList) => {
  return statesList.filter((state) =>
    selectedIndiaStates.includes(state.code)).length;
};

  // Handle Remove Selection
  const handleRemoveSelection = (id) => {
    setAddedSelections((prev) => prev.filter((item) => item.id !== id));
  };

  // Session data for recommended section
  const investrangefromSession = JSON.parse(sessionStorage.getItem("investmentrange") || "[]");
  const domesticLocationsFromSession = JSON.parse(
    sessionStorage.getItem("domesticlocations") || "[]"
  );

  const sessionInvestmentRanges = investrangefromSession;
  const sessionStateCodes = domesticLocationsFromSession.map((loc) => loc.state);
  const sessionStateNames = sessionStateCodes.map(getStateNameByCode).filter(Boolean).join(", ");
  const sessionStatesCount = sessionStateCodes.length || 1;

  // Get package for session data - using default plan or first available plan
  const defaultPlanName = plansApi.length > 0 ? plansApi[0].planName : "LAUNCH PAD PROGRAM";
  const sessionPkg = getPackageForRange(sessionInvestmentRanges, defaultPlanName);

  const sessionBaseAmount = sessionPkg?.amount ?? null;
const sessionBaseLeads = sessionPkg?.totalLeads ?? null;
const sessionTotalLeads =
  sessionBaseLeads != null
    ? sessionBaseLeads * sessionStatesCount
    : "—";  const sessionBaseValidity = sessionPkg?.validityDays ?? null;

  const sessionRows =
    sessionInvestmentRanges && sessionStateCodes.length > 0
      ? [
          {
            rangeLabel: sessionInvestmentRanges,
            statesSummary: `${sessionStatesCount} State${sessionStatesCount !== 1 ? "s" : ""}`,
            stateNames: sessionStateNames,
            category: defaultPlanName,
leadCount: sessionTotalLeads,
            tenure: sessionBaseValidity ? `${sessionBaseValidity} days` : "—",
            price:
              sessionBaseAmount != null
                ? `₹${(sessionBaseAmount * sessionStatesCount).toLocaleString("en-IN")}`
                : "Contact us",
            hasPricing: sessionBaseAmount != null,
          },
        ]
      : [];

  // Check if there's session data to show
  const hasSessionData = sessionRows.length > 0;
  // Check if there's added selection data to show
  const hasAddedSelections = addedSelections.length > 0;

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

  const combinedRows = [
  ...sessionRows.map((row) => ({ ...row, type: "recommended" })),
  ...addedSelections.map((row) => ({ ...row, type: "added" })),
];

  // Render table rows helper for session data
  const renderSessionTableRows = (rows) => {
    return rows.map((row, index) => (
      <TableRow
        key={`rec-${index}`}
        sx={{
          bgcolor: "#FFF8E1",
          "&:hover": { bgcolor: "#FFE0B2" },
          transition: "background 0.2s",
        }}
      >
        <TableCell>
          <Typography variant="body2" fontWeight={600} color="text.primary">
            {row.rangeLabel}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2" fontWeight={600} color="text.primary">
            {row.statesSummary}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="caption" color="text.secondary">
            {row.stateNames}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2" fontWeight={600}>
            {row.category}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Typography variant="body2" fontWeight={600}>
            {row.leadCount}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Typography variant="body2" fontWeight={600}>
            {row.tenure}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Typography
            variant="body2"
            fontWeight={700}
            color={row.hasPricing ? "primary.main" : "error.main"}
            sx={{ display: "block", mt: 0.5 }}
          >
            {row.price}
          </Typography>
        </TableCell>
      </TableRow>
    ));
  };

  // Render table rows for added selections with remove button
  const renderAddedSelectionRows = (rows) => {
    return rows.map((row, index) => (
      <TableRow
        key={`added-${row.id}`}
        sx={{
          bgcolor: index % 2 === 0 ? "#fafafa" : "#fff",
          "&:hover": { bgcolor: "#FFF3E0" },
          transition: "background 0.2s",
        }}
      >
        <TableCell>
          <Typography variant="body2" fontWeight={600} color="text.primary">
            {row.rangeLabel}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2" fontWeight={600} color="text.primary">
            {row.statesSummary}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="caption" color="text.secondary">
            {row.stateNames}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2" fontWeight={600}>
            {row.category}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Typography variant="body2" fontWeight={600}>
            {row.leadCount}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Typography variant="body2" fontWeight={600}>
            {row.tenure}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Typography
            variant="body2"
            fontWeight={700}
            color={row.hasPricing ? "primary.main" : "error.main"}
            sx={{ display: "block", mt: 0.5 }}
          >
            {row.price}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={() => handleRemoveSelection(row.id)}
            sx={{ minWidth: "auto", px: 1 }}
          >
            ✕
          </Button>
        </TableCell>
      </TableRow>
    ));
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
              <CardContent
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  p: 3,
                  pt: 2.5,
                }}
              >
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

          {/* States Card - Grouped by Regions */}
          <Grid item>
            <Card sx={cardStyle}>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  p: 3,
                  pt: 2.5,
                }}
              >
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
                          {regionName} ({getSelectedCountByRegion(statesList)} )
                        </Typography>
                      </AccordionSummary>

                      <AccordionDetails
                        sx={{
                          pl: 1,
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                        }}
                      >
                        {statesList.map((state) => {
                          const isChecked = selectedIndiaStates.includes(state.code);
                          return (
                            <FormControlLabel
                              key={state.code}
                              sx={{
                                ...labelStyle,
                                display: "flex",
                                width: "100%",
                              }}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={isChecked}
                                  disabled={!isStatesEnabled}
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

          {/* Category Card (Plan Name) */}
          <Grid item>
            <Card sx={cardStyle}>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  p: 3,
                  pt: 2.5,
                }}
              >
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
                          disabled={!isCategoryEnabled}
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 4,
            gap: 2,
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Selection Summary Before Adding */}
          {/* {canAddSelection && (
            <Paper
              elevation={1}
              sx={{
                p: 2,
                bgcolor: "#E8F5E9",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
            
            </Paper>
          )} */}

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
      
      {/* Header */}
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
                    {!isRecommended && (
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
    </Box>
  );
};

export default MembershipSelection;