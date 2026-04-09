"use client"; 
import { useState, useEffect } from "react";

import { useTheme, alpha } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import { keyframes } from "@emotion/react";

import { useRouter } from "next/navigation";
import plans from "@/Utils/paymentData";


const shimmerAnimation = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;



const MembershipSelection = () => {
const [selectedInvestmentRange, setSelectedInvestmentRange] = useState("");
  const [selectedPlanState, setSelectedPlanState] = useState("");
const [selectedIndiaStates, setSelectedIndiaStates] = useState([]);
const [ selectedPlan, setSelectedPlan] = useState("");

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

const categoryNames = plans.map((item) => item.category);


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
  panIndia: { min: 6, max: Infinity }, 
};

const maxSelection = planLimits[selectedPlanState] || 0;
useEffect(() => {
  setSelectedIndiaStates([]);
}, [selectedPlanState]);

  return (
    <Box
      sx={{
        backgroundImage: `url(/bg25.jpeg)`,
        backgroundSize: "400px auto", 
        // backgroundPosition: "center",   // center image
        backgroundRepeat: "repeat",
        minHeight: "87vh", // full screen height
        width: "100%",
      }}
      minHeight="100vh"
    >
      <Container maxWidth="xl" sx={{ py: 2, position: "relative" }}>
    
      
    
        <Box>
          {/* Header Section */}
          <Box textAlign="center" mb={3}>
            <Typography
              variant="h2"
              fontWeight="bold"
              gutterBottom
              sx={{
                background: "#ff9800",
                backgroundSize: "200% 200%",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "2.5rem", md: "3rem" },
                animation: `${shimmerAnimation} 3s ease-in-out infinite`,
              }}
            >
              Choose Your Perfect Plan
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: 600,
                mx: "auto",
                fontSize: { xs: "0.8rem", md: "1.10rem" },
                lineHeight: 1.6,
              }}
            >
              Scale your business with our flexible packages. All plans include
              essential features with no hidden fees.
            </Typography>
          </Box>

          {/* Investment Ranges Section */}
          <Grid sx={{ mt: 5,  display: "flex", justifyContent: "column" }}>
           
            <Box>
            {investmentRanges.map((range, index) => (
  <Box
    key={index}
    sx={{
      mb: index !== investmentRanges.length - 1 ? 0 : 0,
    }}
  >
    <FormControlLabel
      control={
        <Checkbox
checked={selectedInvestmentRange === range.value}
         onChange={(e) => {
  if (e.target.checked) {
    setSelectedInvestmentRange(range.value);
    console.log("Selected Investment Range:", range.value);
  } else {
    setSelectedInvestmentRange("");
  }
}}
          sx={{
            color: "#ff9800",
            "&.Mui-checked": { color: "#4caf50" },
          }}
        />
      }
      label={
        <Typography
          variant="body1"
          fontWeight="bold"
          sx={{ color: "#333" }}
        >
          {range.label}
        </Typography>
      }
    />
  </Box>
))}
            </Box>

            <Box sx={{ ml: 1 }}>
 

  {stateOptions.map((state, index) => {
    const label = state
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());

    return (
      <Box key={index} >
        <FormControlLabel
          control={
            <Checkbox
          checked={selectedPlanState === state}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedPlanState(state);
                  console.log("Selected Plan State:", state);
                } else {
                  setSelectedPlanState("");
                }
              }}
              sx={{
                color: "#ff9800",
                "&.Mui-checked": { color: "#4caf50" },
              }}
            />
          }
          label={
            <Typography variant="body1" fontWeight="bold">
              {label}
            </Typography>
          }
        />
      </Box>
    );
  })}
</Box>
<Box sx={{ ml: 1 }}>
  {indiaStates.map((state, index) => (
    <Box key={index}>
      <FormControlLabel
        control={
          <Checkbox
            checked={selectedIndiaStates.includes(state.code)}
            onChange={(e) => {
              if (e.target.checked) {
                // ✅ PAN INDIA → unlimited selection
                if (selectedPlanState === "panIndia") {
                  setSelectedIndiaStates([
                    ...selectedIndiaStates,
                    state.code,
                  ]);
                } 
                // ✅ OTHER PLANS → enforce max limit
                else {
                  if (selectedIndiaStates.length < maxSelection) {
                    setSelectedIndiaStates([
                      ...selectedIndiaStates,
                      state.code,
                    ]);
                  } else {
                    alert(`You can select only ${maxSelection} states`);
                  }
                }
              } else {
                // ✅ REMOVE STATE
                setSelectedIndiaStates(
                  selectedIndiaStates.filter(
                    (code) => code !== state.code
                  )
                );
              }
            }}
            // ✅ Disable only for non-panIndia plans
            disabled={
              selectedPlanState !== "panIndia" &&
              !selectedIndiaStates.includes(state.code) &&
              selectedIndiaStates.length >= maxSelection
            }
            sx={{
              color: "#ff9800",
              "&.Mui-checked": { color: "#4caf50" },
            }}
          />
        }
        label={
          <Typography variant="body1" fontWeight="bold">
            {state.name}
          </Typography>
        }
      />
    </Box>
  ))}

  {/* ✅ MINIMUM VALIDATION FOR PAN INDIA */}
  {selectedPlanState === "panIndia" &&
    selectedIndiaStates.length < 6 && (
      <Typography color="error" sx={{ mt: 1 }}>
        Select at least 6 states
      </Typography>
    )}

  {/* ✅ OPTIONAL: SHOW COUNT */}
  {selectedPlanState && (
    <Typography sx={{ mt: 1 }}>
      Selected {selectedIndiaStates.length}
      {selectedPlanState !== "panIndia" && ` / ${maxSelection}`}
    </Typography>
  )}
</Box>

<Box sx={{ ml: 1 }}>
  {plans.map((item, index) => (
    <Box key={index}>
      <FormControlLabel
        control={
          <Checkbox
            checked={selectedPlan === item.category}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedPlan(item.category);
                console.log("Selected Plan:", item.category);
              } else {
                setSelectedPlan("");
              }
            }}
            sx={{
              color: "#ff9800",
              "&.Mui-checked": { color: "#4caf50" },
            }}
          />
        }
        label={
          <Typography
            variant="body1"
            fontWeight="bold"
            sx={{
              color:
                selectedPlan === item.category ? "#4caf50" : "#333",
              transition: "0.3s",
            }}
          >
            {item.category}
          </Typography>
        }
      />
    </Box>
  ))}
</Box>
 <Box>
            </Box>
            
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};
export default MembershipSelection;
