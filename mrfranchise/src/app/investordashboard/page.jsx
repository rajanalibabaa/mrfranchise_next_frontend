"use client"
import React from "react";
import {Box} from "@mui/material";

import Footer from "../../Components/Footers/Footer";
import Navbar from "../../Components/Navbar/NavBar";
import Dashboard from "./DashBoard";
import InvestorDashboardLayout from './sidebar'
// Colors
const COLORS = {
  pistaGreen: '#93C572',
  darkGreen: '#4A7729',
  creamWhite: '#FFF9F0',
  darkText: '#2D3436'
};

// NavItem with Tooltip


const InvestorDashboard = () => {


  return (
    <>
      <Navbar/>
      <Box
  sx={{
    minHeight: "calc(100vh - 64px)",
    backgroundColor: COLORS.creamWhite
  }}
>
  <InvestorDashboardLayout>
    <Dashboard /> 
  </InvestorDashboardLayout>
</Box>

      <Footer />
    </>
  );
};

export default React.memo(InvestorDashboard);
