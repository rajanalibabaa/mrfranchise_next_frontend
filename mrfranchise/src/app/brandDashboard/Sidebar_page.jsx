

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Box,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import ViewListIcon from "@mui/icons-material/ViewList";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Footer from "@/Components/Footers/Footer";

export default function BrandDashboardLayout({ children }) {
  const theme = useTheme();
const isTabletOrMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(prev => !prev);
  };

  const navLinkStyle = {
    display: "block",
    textDecoration: "none",
    color: "#333",
    padding: "10px",
    borderRadius: "6px",
    backgroundColor: "#f9f9f9",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#e9e9e9",
      transform: "translateX(6px)",
    },
  };

  const SidebarLinks = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>

      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Link href="/" onClick={() => isTabletOrMobile && setMobileOpen(false)}>
          <img
            src="/brandLogo.jpg"
            alt="Brand Logo"
            style={{ width: "100%", maxWidth: 180 }}
          />
        </Link>
      </Box>


      <Link href="/brandDashboard" style={navLinkStyle} onClick={() => isTabletOrMobile && setMobileOpen(false)}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SpaceDashboardIcon /> Dashboard
        </Box>
      </Link>

      <Link href="/brandDashboard/brand_listing_controller" style={navLinkStyle} onClick={() => isTabletOrMobile && setMobileOpen(false)}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ViewListIcon /> Edit Brand Listing
        </Box>
      </Link>

      <Link href="/brandDashboard/brandsearchus" style={navLinkStyle} onClick={() => isTabletOrMobile && setMobileOpen(false)}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SupportAgentIcon /> Reach Us
        </Box>
      </Link>

      <Link href="/brandDashboard/brandrequesthandle" style={navLinkStyle} onClick={() => isTabletOrMobile  && setMobileOpen(false)}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ManageAccountsIcon /> Action Manager
        </Box>
      </Link>

      <Link href="/brandDashboard/paymentpackageupgrade" style={navLinkStyle} onClick={() => isTabletOrMobile && setMobileOpen(false)}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TrendingUpIcon /> Package Upgrade
        </Box>
      </Link>
      
    </Box>
  );

  const sidebarContent = (
    <Box
      sx={{
        width: 240,
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Logo */}
      {/* <Box sx={{ textAlign: "center", mb: 2 }}>
        <Link href="/" onClick={() => isMobile && setMobileOpen(false)}>
          <img
            src="/brandLogo.jpg"
            alt="Brand Logo"
            style={{ width: "100%", maxWidth: 180 }}
          />
        </Link>
      </Box> */}

      <SidebarLinks />
 
      {isTabletOrMobile && (
        <IconButton onClick={handleDrawerToggle} sx={{ mt: 2 }}>
          <CloseIcon />
        </IconButton>
      )}
    </Box>
  );

  return (
    <>
      {/* Mobile AppBar */}
     {isTabletOrMobile && (
  <AppBar position="fixed" sx={{ backgroundColor: "#fff", color: "#333" }}>
    <Toolbar sx={{ position: "relative", justifyContent: "center" }}>
      
      {/* Hamburger - Left */}
      <IconButton
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ position: "absolute", left: 8 }}
      >
        <MenuIcon />
      </IconButton>

      {/* Center Logo */}
      <Link href="/">
        <img
          src="/logo.png"
          alt="Brand Logo"
          style={{
            height: 40,
            objectFit: "contain",
          }}
        />
      </Link>

    </Toolbar>
  </AppBar>
)}


      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {/* Desktop Sidebar */}
        {!isTabletOrMobile && sidebarContent}
  {/* Logo */}
     
        {/* Mobile Drawer */}
        <Drawer
          open={mobileOpen}
          onClose={handleDrawerToggle}
          variant="temporary"
          sx={{
            "& .MuiDrawer-paper": { width: 240 },
          }}
        >
          {sidebarContent}
        </Drawer>

        {/* Page Content */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            mt: isTabletOrMobile ? "64px" : 0,
          }}
        >
          {children}
        </Box>
        
      </Box>

    </>
  );
}
