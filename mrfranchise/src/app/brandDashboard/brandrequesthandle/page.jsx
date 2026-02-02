"use client"
import React from "react";
import  Container  from "@mui/material/Container";
import CreateRequestForm from "./CreateRequestForm";
import RequestList from "./RequestList.jsx";
import BrandDashboardLayout from "../Sidebar_page";
import Box from "@mui/material/Box";

const Dashboard = () => {
  return (
    <>
    <Box sx={{ display: "flex" }}>
    <BrandDashboardLayout/>
    <Container maxWidth="md" sx={{ py: 4 }}>
      <CreateRequestForm />
      <RequestList />
    </Container>
    </Box>
    </>
  );
};

export default Dashboard;
