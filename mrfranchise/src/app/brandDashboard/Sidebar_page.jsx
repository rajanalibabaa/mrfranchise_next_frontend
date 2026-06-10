"use client";

import React, { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
  Typography,
  Divider,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import ViewListIcon from "@mui/icons-material/ViewList";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const DESKTOP_DRAWER_WIDTH = 250;
const MOBILE_DRAWER_WIDTH = 280;

export default function Sidebar({
  activePage,
  setActivePage,
}) {
  const theme = useTheme();

  const isMobileOrTablet = useMediaQuery(
    theme.breakpoints.down("md")
  );

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const menuItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <SpaceDashboardIcon />,
    },
    {
      key: "brandListing",
      label: "Edit Brand Listing",
      icon: <ViewListIcon />,
    },
    {
      key: "reachUs",
      label: "Reach Us",
      icon: <SupportAgentIcon />,
    },
    {
      key: "actionManager",
      label: "Action Manager",
      icon: <ManageAccountsIcon />,
    },
     {
      key: "ContactMappingForLeads",
      label: "Contact Mapping for Leads",
      icon: <TrendingUpIcon />,
    },
    {
      key: "packageUpgrade",
      label: "Package Upgrade",
      icon: <TrendingUpIcon />,
    },
  ];

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          textAlign: "center",
          py: 3,
          px: 2,
        }}
      >
        <img
          src="/brandLogo.jpg"
          alt="Brand Logo"
          style={{
            width: "100%",
            maxWidth: "160px",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </Box>

      <Divider />

      {/* Menu */}
      <Box
        sx={{
          flex: 1,
          px: 2,
          py: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        {menuItems.map((item) => (
          <Box
            key={item.key}
            onClick={() => {
              setActivePage(item.key);

              if (isMobileOrTablet) {
                setMobileOpen(false);
              }
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              px: 2,
              py: 1.8,
              borderRadius: 2,
              cursor: "pointer",

              backgroundColor:
                activePage === item.key
                  ? "#1976d2"
                  : "#fff",

              color:
                activePage === item.key
                  ? "#fff"
                  : "#333",

              border:
                activePage === item.key
                  ? "none"
                  : "1px solid #e5e5e5",

              transition: "0.2s ease",

              "&:hover": {
                backgroundColor:
                  activePage === item.key
                    ? "#1565c0"
                    : "#f5f5f5",
              },
            }}
          >
            {item.icon}

            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 500,
              }}
            >
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Close Button Mobile */}
      {isMobileOrTablet && (
        <>
          <Divider />

          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                border: "1px solid #ddd",
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </>
      )}
    </Box>
  );

  return (
    <>
      {/* Mobile Header */}
      {isMobileOrTablet && (
        <AppBar
          position="fixed"
          color="default"
          elevation={1}
          sx={{
            zIndex:
              theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              sx={{
                ml: 2,
                fontWeight: 600,
              }}
            >
              Brand Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Desktop Sidebar */}
      {!isMobileOrTablet && (
        <Box
          sx={{
            width: DESKTOP_DRAWER_WIDTH,
            minHeight: "100vh",
            borderRight:
              "1px solid #e5e5e5",
            backgroundColor: "#fff",
            position: "sticky",
            top: 0,
          }}
        >
          {drawerContent}
        </Box>
      )}

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: MOBILE_DRAWER_WIDTH,
            maxWidth: "85vw",
            mt: "50px", // start below AppBar
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}