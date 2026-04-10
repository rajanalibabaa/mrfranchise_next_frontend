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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import plans from "@/Utils/paymentData";

const MembershipSelection = () => {
  const [selectedInvestmentRange, setSelectedInvestmentRange] = useState("");
  const [selectedPlanState, setSelectedPlanState] = useState("");
  const [selectedIndiaStates, setSelectedIndiaStates] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [openSummary, setOpenSummary] = useState(false);
const [selectedFinalPlan, setSelectedFinalPlan] = useState(null);

 const investmentRanges = [
    { label: "Below ₹50K", value: "Below - 50k" },
    { label: "₹50K - ₹2 Lakhs", value: "Rs. 50k - 2 Lakhs" },
    { label: "₹2 - ₹5 Lakhs", value: "Rs. 2 Lakhs - 5 Lakhs" },
    { label: "₹5 - ₹10 Lakhs", value: "Rs. 5 Lakhs - 10 Lakhs" },
    { label: "₹10 - ₹20 Lakhs", value: "Rs. 10 Lakhs - 20 Lakhs" },
    { label: "₹20 - ₹30 Lakhs", value: "Rs. 20 Lakhs - 30 Lakhs" },
    { label: "₹30 - ₹50 Lakhs", value: "Rs. 30 Lakhs - 50 Lakhs" },
    { label: "₹50 Lakhs - ₹1 Crore", value: "Rs. 50 Lakhs - 1 Crore" },
    { label: "₹1 - ₹2 Crores", value: "Rs. 1 Crores - 2 Crores" },
    { label: "₹2 - ₹5 Crores", value: "Rs. 2 Crores - 5 Crores" },
    { label: "Above ₹5 Crores", value: "Rs. 5 Crores - above" },
  ];

  const stateOptions =
    plans?.[0]?.plans?.[0]?.pricing
      ? Object.keys(plans[0].plans[0].pricing)
      : [];

const indiaStates = [
  { name: "Andhra Pradesh", code: "AP", type: "State" },
  { name: "Arunachal Pradesh", code: "AR", type: "State" },
  { name: "Assam", code: "AS", type: "State" },
  { name: "Bihar", code: "BR", type: "State" },
  { name: "Chhattisgarh", code: "CG", type: "State" },
  { name: "Goa", code: "GA", type: "State" },
  { name: "Gujarat", code: "GJ", type: "State" },
  { name: "Haryana", code: "HR", type: "State" },
  { name: "Himachal Pradesh", code: "HP", type: "State" },
  { name: "Jharkhand", code: "JH", type: "State" },
  { name: "Karnataka", code: "KA", type: "State" },
  { name: "Kerala", code: "KL", type: "State" },
  { name: "Madhya Pradesh", code: "MP", type: "State" },
  { name: "Maharashtra", code: "MH", type: "State" },
  { name: "Manipur", code: "MN", type: "State" },
  { name: "Meghalaya", code: "ML", type: "State" },
  { name: "Mizoram", code: "MZ", type: "State" },
  { name: "Nagaland", code: "NL", type: "State" },
  { name: "Odisha", code: "OD", type: "State" },
  { name: "Punjab", code: "PB", type: "State" },
  { name: "Rajasthan", code: "RJ", type: "State" },
  { name: "Sikkim", code: "SK", type: "State" },
  { name: "Tamil Nadu", code: "TN", type: "State" },
  { name: "Telangana", code: "TS", type: "State" },
  { name: "Tripura", code: "TR", type: "State" },
  { name: "Uttar Pradesh", code: "UP", type: "State" },
  { name: "Uttarakhand", code: "UK", type: "State" },
  { name: "West Bengal", code: "WB", type: "State" },
 
  // Union Territories
  { name: "Andaman and Nicobar Islands", code: "AN", type: "Union Territory" },
  { name: "Chandigarh", code: "CH", type: "Union Territory" },
  { name: "Dadra and Nagar Haveli and Daman and Diu", code: "DN", type: "Union Territory" },
  { name: "Delhi", code: "DL", type: "Union Territory" },
  { name: "Jammu and Kashmir", code: "JK", type: "Union Territory" },
  { name: "Ladakh", code: "LA", type: "Union Territory" },
  { name: "Lakshadweep", code: "LD", type: "Union Territory" },
  { name: "Puducherry", code: "PY", type: "Union Territory" }
];
  const planLimits = {
    singleState: 1,
    twoStates: 2,
    threeStates: 3,
    fiveStates: 5,
    panIndia: Infinity,
  };

  const maxSelection = planLimits[selectedPlanState] || 0;

  useEffect(() => {
    setSelectedIndiaStates([]);
  }, [selectedPlanState]);

  useEffect(() => {
  setSelectedPlanState("");
  setSelectedIndiaStates([]);
  setSelectedPlan("");
}, [selectedInvestmentRange]);

  const isInvestmentSelected = !!selectedInvestmentRange;
const isPlanTypeEnabled = isInvestmentSelected;
const isStatesEnabled = !!selectedPlanState;
const isCategoryEnabled =
  selectedInvestmentRange &&
  selectedPlanState &&
  selectedIndiaStates.length > 0;
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
    mb:2,
    display: "flex",
    flexDirection: "column",
    gap: 0.8,
    "&::-webkit-scrollbar": { width: "5px" },
    "&::-webkit-scrollbar-thumb": {
      background: "#ddd",
      borderRadius: "10px",
    },
  };

  const labelStyle = {
    m: 0,
    alignItems: "flex-start",
    gap: 1,
    "& .MuiCheckbox-root": { p: 0.5, mt: "-2px" },
  };

  const selectedFinalPlanData = {
  investment: selectedInvestmentRange,
  planType: selectedPlanState,
  states: selectedIndiaStates,
  category: selectedPlan,
  planData: plans.find((p) => p.category === selectedPlan),
};
const handleConfirm = () => {
  const planData = plans.find((p) => p.category === selectedPlan);

  const pricing =
    planData?.plans?.[0]?.pricing?.[selectedPlanState];

  setSelectedFinalPlan({
    category: selectedPlan,
    planType: selectedPlanState,
    states: selectedIndiaStates,
    investment: selectedInvestmentRange,
    pricing,
    plan: planData?.plans?.[0]?.name || "N/A",
    code: planData?.plans?.[0]?.code || "N/A",
  });

  setOpenSummary(true);
};

  return (
    <Box sx={{ background: "#f7f7f9", minHeight: "100vh", py: 5 }}>
      <Container maxWidth="xl">
        <Grid container spacing={3} justifyContent="center">
          
          {/* 1️⃣ Investment */}
          <Grid item>
            <Card sx={cardStyle}>
              
              <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column", p: 3, pt: 2.5 }}>
                <Box sx={headerStyle}>
                  <Typography fontWeight="700" color="#FFA726" fontSize={16}>Investment Range</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedInvestmentRange ? "1 selected" : "Select one"}
                  </Typography>
                </Box>
                <Box sx={scrollStyle}>
                  {investmentRanges.map((range, i) => (
                    <FormControlLabel
                      key={i}
                      sx={labelStyle}
                      control={
                        <Checkbox size="small"
                          checked={selectedInvestmentRange === range.value}
                          disabled={
    selectedInvestmentRange && selectedInvestmentRange !== range.value
  }
                          onChange={(e) => setSelectedInvestmentRange(e.target.checked ? range.value : "")}
                        />
                      }
                      label={<Typography variant="body2">{range.label}</Typography>}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* 2️⃣ Plan Type */}
          <Grid item>
            <Card sx={cardStyle}>
           
              <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%", p: 3, pt: 2.5 }}>
              
                <Box sx={headerStyle}>
                  <Typography fontWeight="700"  color="#FFA726" fontSize={16}>Plan Type</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedPlanState ? "1 selected" : "Select one"}
                  </Typography>
                </Box>
                <Box sx={scrollStyle}>
                  {stateOptions.map((state, i) => (
                    <FormControlLabel
                      key={i}
                      sx={labelStyle}
                      control={
                        <Checkbox
  size="small"
  disabled={!isPlanTypeEnabled}
  checked={selectedPlanState === state}
  onChange={(e) =>
    setSelectedPlanState(e.target.checked ? state : "")
  }
/>
                      }
                      label={<Typography variant="body2">{state.replace(/([A-Z])/g, " $1")}</Typography>}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* 3️⃣ States */}
          <Grid item>
            <Card sx={cardStyle}>
       
              <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%", p: 3, pt: 2.5 }}>
                <Box sx={headerStyle}>
                  <Typography fontWeight="700" color="#FFA726" fontSize={16}>Select States</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedPlanState ? `${selectedIndiaStates.length}/${maxSelection === Infinity ? "All" : maxSelection}` : "Choose plan first"}
                  </Typography>
                </Box>
                <Box sx={scrollStyle}>
                  {indiaStates.map((state, i) => {
                    const isChecked = selectedIndiaStates.includes(state.code);
                    const isDisabled = !selectedPlanState || (!isChecked && selectedIndiaStates.length >= maxSelection);
                    return (
                      <FormControlLabel
                        key={i}
                        sx={labelStyle}
                        control={
                          <Checkbox
                            size="small"
                            disabled={isDisabled}
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedIndiaStates([...selectedIndiaStates, state.code]);
                              } else {
                                setSelectedIndiaStates(selectedIndiaStates.filter((s) => s !== state.code));
                              }
                            }}
                          />
                        }
                        label={<Typography variant="body2">{state.name}</Typography>}
                      />
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* 4️⃣ Category */}
          <Grid item>
            <Card sx={cardStyle}>
             
              <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%", p: 3, pt: 2.5 }}>
                <Box sx={headerStyle}>
                  <Typography fontWeight="700" color="#FFA726"  fontSize={16}>Category</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedPlan ? "1 selected" : "Select one"}
                  </Typography>
                </Box>
                <Box sx={scrollStyle}>
                  {plans.map((item, i) => (
                    <FormControlLabel
                      key={i}
                      sx={labelStyle}
                      control={
                      <Checkbox
  size="small"
  disabled={
    !isCategoryEnabled ||
    (selectedPlan && selectedPlan !== item.category)
  }
  checked={selectedPlan === item.category}
  onChange={(e) =>
    setSelectedPlan(e.target.checked ? item.category : "")
  }
/>
                      }
                      label={<Typography variant="body2">{item.category}</Typography>}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Container>
      <Box textAlign="center" mt={4}>
  <Button
    variant="contained"
    disabled={
      !selectedInvestmentRange ||
      !selectedPlanState ||
      !selectedIndiaStates.length ||
      !selectedPlan
    }
    onClick={handleConfirm}
  >
    Review Plan
  </Button>
</Box>

     {/* ✅ SUMMARY POPUP */}
      <Dialog open={openSummary} onClose={() => setOpenSummary(false)}>
        <DialogTitle>Plan Summary</DialogTitle>

        <DialogContent>
          <Typography>Category: {selectedFinalPlan?.category}</Typography>
          <Typography>Plan: {selectedFinalPlan?.plan}</Typography>
          <Typography>Code: {selectedFinalPlan?.code}</Typography>
          <Typography>Investment: {selectedFinalPlan?.investment}</Typography>
          <Typography>Plan Type: {selectedFinalPlan?.planType}</Typography>
          <Typography>
            States: {selectedFinalPlan?.states?.join(", ")}
          </Typography>
          <Typography>
            Amount: ₹{selectedFinalPlan?.pricing?.amount || "N/A"}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenSummary(false)}>Close</Button>
          <Button variant="contained">Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MembershipSelection;