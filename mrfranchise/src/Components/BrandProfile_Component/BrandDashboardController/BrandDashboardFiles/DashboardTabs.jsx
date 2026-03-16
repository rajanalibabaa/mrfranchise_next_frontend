// components/DashboardTabs.js
"use client";

import React, { useState } from "react";

import Card from "@mui/material/Card";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useMediaQuery, useTheme } from "@mui/material";
import Person from "@mui/icons-material/Person";
import TabContent from "./TabContent";

const colors = {
  primary: "#2c3e50",
  secondary: "#34495e",
  accent: "#3498db",
  background: "#f8f9fa",
  cardBackground: "#ffffff",
  textPrimary: "#2c3e50",
  textSecondary: "#7f8c8d",
  divider: "#ecf0f1",
};

const DashboardTabs = ({ brandData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };

  // const getTabCount = (tabIndex) => {
  //   switch (tabIndex) {
  //     case 0:
  //       return brandData?.brandDetails?.overAllLeads ? brandData?.brandDetails?.overAllLeads : 0;
  //     default:
  //       return 0;
  //   }
  // };

  const renderTabLabel = (label, index) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: isMobile ? 0.5 : 1,
        px: isMobile ? 0.5 : 1,
        py: isMobile ? 0.25 : 0.5,
        flexDirection: isMobile ? "column" : "row",
        minHeight: isMobile ? 48 : "auto",
        maxWidth: isMobile ? "10%" : "auto",
        justifyContent:isMobile ? "flex-start " : "flex-start",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? 0.5 : 1,
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <Person
          sx={{
            fontSize: isMobile ? "1rem" : "1.25rem",
            color: tabValue === index ? colors.accent : colors.textSecondary,
          }}
        />
        <Typography
          variant={isMobile ? "caption" : "body2"}
          sx={{
            textTransform: "none",
            fontWeight: tabValue === index ? 600 : 400,
            color:
              tabValue === index ? colors.textPrimary : colors.textSecondary,
            fontSize: isMobile ? "0.7rem" : "0.875rem",
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          {label}
        </Typography>
      </Box>
      {/* <Box
        sx={{
          backgroundColor: "#39da39ff",
          color: "#111b14ff",
          borderRadius: "50%",
          width: isMobile ? 20 : 24,
          height: isMobile ? 20 : 24,
          display: "flex",
          alignItems: "center", 
          justifyContent: "center",
          fontSize: isMobile ? "0.65rem" : "0.75rem",
          ml: isMobile ? 0 : 0.5,
          mt: isMobile ? 0.25 : 0,
          fontWeight: 600,
        }}
      >
        {getTabCount(index)}
      </Box> */}
    </Box>
  );

  return (
    <>
      <Card
        sx={{
          mb: isMobile ? 2 : 3,
          backgroundColor: colors.cardBackground,
          border: `1px solid ${colors.divider}`,
          boxShadow: "none",
          overflow: "visible",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={false}
          allowScrollButtonsMobile={false}
          sx={{
            minHeight: isMobile ? 48 : 64,
            "& .MuiTabs-indicator": {
              backgroundColor: "orange",
              height: isMobile ? 2 : 3,
            },
            "& .MuiTab-root": {
              minWidth: isMobile ? 120 : 160,
              minHeight: isMobile ? 48 : 64,
              padding: isMobile ? "6px 16px" : "12px 24px",
              mx: isMobile ? 1 : 2,
            },
            "& .MuiTabs-flexContainer": {
              justifyContent: "center",
            },
          }}
        >
          <Tab
            label={renderTabLabel("Leads", 0)}
            sx={{
              // minWidth: "unset",
              py: isMobile ? 0.5 : 1.5,
              px: isMobile ? 2 : 3,
              "&.Mui-selected": {
                backgroundColor: `${colors.accent}10`,
              },
              "&:hover": {
                backgroundColor: `${colors.accent}05`,
              },
              transition: "all 0.2s ease",
              border: `1px solid ${colors.divider}`,
              borderRadius: 2,
              margin: isMobile ? "4px" : "8px",
            }}
          />
        </Tabs>
      </Card>

      <Card
        sx={{
          p: isMobile ? 1.5 : isTablet ? 2 : 3,
          backgroundColor: colors.cardBackground,
          border: `1px solid ${colors.divider}`,
          boxShadow: "none",
          minHeight: isMobile ? 400 : 500,
        }}
      >
        <TabContent tabValue={tabValue} brandData={brandData} />
      </Card>
    </>
  );
};

export default DashboardTabs;
