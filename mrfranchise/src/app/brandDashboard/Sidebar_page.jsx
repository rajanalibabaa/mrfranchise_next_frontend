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
  Typography,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import ViewListIcon from "@mui/icons-material/ViewList";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const drawerWidth = 240;

export default function BrandDashboardLayout() {
  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(prev => !prev);

  const navLinkStyle = {
    display: "flex",
    alignItems: "center",
    gap: 1,
    textDecoration: "none",
    color: "#333",
    padding: "10px 12px",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    transition: "0.25s",
    "&:hover": {
      backgroundColor: "#e9e9e9",
      transform: "translateX(6px)",
    },
  };

  const SidebarLinks = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Link href="/" onClick={() => isMobileOrTablet && setMobileOpen(false)}>
          <img
            src="/brandLogo.jpg"
            alt="Brand Logo"
            style={{ maxWidth: 180, width: "100%" }}
          />
        </Link>
      </Box>

      <Link href="/brandDashboard" style={navLinkStyle} onClick={() => setMobileOpen(false)}>
        <SpaceDashboardIcon /> Dashboard
      </Link>

      <Link href="/brandDashboard/brand_listing_controller" style={navLinkStyle} onClick={() => setMobileOpen(false)}>
        <ViewListIcon /> Edit Brand Listing
      </Link>

      <Link href="/brandDashboard/brandsearchus" style={navLinkStyle} onClick={() => setMobileOpen(false)}>
        <SupportAgentIcon /> Reach Us
      </Link>

      <Link href="/brandDashboard/brandrequesthandle" style={navLinkStyle} onClick={() => setMobileOpen(false)}>
        <ManageAccountsIcon /> Action Manager
      </Link>

      <Link href="/brandDashboard/paymentpackageupgrade" style={navLinkStyle} onClick={() => setMobileOpen(false)}>
        <TrendingUpIcon /> Package Upgrade
      </Link>
    </Box>
  );

  const drawerContent = (
    <Box
      sx={{
        width: drawerWidth,
        height: "100%",
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <SidebarLinks />

      {isMobileOrTablet && (
        <IconButton aria-label="close" onClick={handleDrawerToggle} sx={{ alignSelf: "center", mt: 2 }}>
          <CloseIcon />
        </IconButton>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: isMobileOrTablet ? "10vh" : "auto" }}>
      {/* AppBar - Mobile & Tablet */}
      {isMobileOrTablet && (
        <AppBar position="fixed" color="default" elevation={1}>
          <Toolbar sx={{ justifyContent: "space-around" }}>
            <IconButton aria-label="open drawer" edge="start" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>

            <Link href="/">
              <img src="/mrfranchise_logo.avif" alt="Logo" height={36} />
            </Link>

          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar - Desktop */}
      {!isMobileOrTablet && (
        <Box
         
        >
          {drawerContent}
        </Box>
      )}

      {/* Drawer - Mobile */}
      <Drawer
        open={mobileOpen}
        onClose={handleDrawerToggle}
        variant="temporary"
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>

    </Box>
  );
}
