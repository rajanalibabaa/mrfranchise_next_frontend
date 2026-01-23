// components/LeadsTab.js
"use client";
import React, { useState } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useMediaQuery, useTheme } from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

import FilterList from "@mui/icons-material/FilterList";
import LeadTableRow from "./LeadTableRow";
import FilterDialog from "./FilterDialog";

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

const dateFilters = [
  { value: "all", label: "All Time" },
  { value: "3", label: "Last 3 Days" },
  { value: "7", label: "Last 7 Days" },
  { value: "30", label: "Last 30 Days" },
  { value: "90", label: "Last 90 Days" },
];

const LeadsTab = ({ Leads, onViewDetails }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [searchTerm, setSearchTerm] = useState("");
  const [investmentFilter, setInvestmentFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  // Get unique values for filters
  const uniqueInvestmentRanges = [
    ...new Set(
      (Array.isArray(Leads) ? Leads : [])
        .map((lead) => lead.investmentRange)
        .filter(Boolean)
    ),
  ];

  const uniqueCategories = [
    ...new Set(
      (Array.isArray(Leads) ? Leads : [])
        .map((lead) => lead.category)
        .filter(Boolean)
    ),
  ];

  const uniqueLocations = [
    ...new Set(
      (Array.isArray(Leads) ? Leads : [])
        .map((lead) => lead.state)
        .filter(Boolean)
    ),
  ];

  const filterByDate = (items) => {
    if (dateFilter === "all" || !items || !Array.isArray(items)) return items;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(dateFilter));
    return items.filter(
      (item) => item.createdAt && new Date(item.createdAt) >= daysAgo
    );
  };

  const filteredData = filterByDate(Leads).filter((lead) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      (lead.fullName && lead.fullName.toLowerCase().includes(searchLower)) ||
      (lead.investorMobileNumber &&
        lead.investorMobileNumber.includes(searchTerm)) ||
      (lead.state && lead.state.toLowerCase().includes(searchLower)) ||
      (lead.district && lead.district.toLowerCase().includes(searchLower));

    const matchesCategory =
      categoryFilter === "all" || lead.category === categoryFilter;
    const matchesLocation =
      locationFilter === "all" || lead.state === locationFilter;
    const matchesInvestment =
      investmentFilter === "all" || lead.investmentRange === investmentFilter;

    return (
      matchesSearch && matchesCategory && matchesLocation && matchesInvestment
    );
  });

  const handleResetFilters = () => {
    setInvestmentFilter("all");
    setCategoryFilter("all");
    setLocationFilter("all");
    setDateFilter("all");
    setFilterDialogOpen(false);
  };

  return (
    <Box mt={4}>
      {/* Header with Total Leads on left and Filter on right in single row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          width: "100%",
        }}
      >
        {/* Left side - Total Leads */}
        <Typography
          variant={isMobile ? "subtitle1" : "h6"}
          sx={{
            color: colors.textPrimary,
            fontSize: isMobile ? "1rem" : "1.25rem",
            fontWeight: 600,
          }}
        >
          Total Leads: {filteredData.length}
        </Typography>

        {/* Right side - Filter controls */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {/* Search field - shown on desktop and tablet */}
          {/* {!isMobile && (
            <TextField
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                maxWidth: 300,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: colors.divider },
                  "&:hover fieldset": { borderColor: colors.accent },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: colors.textSecondary }} />
                  </InputAdornment>
                ),
              }}
              size="medium"
            />
          )} */}

          {/* Date filter dropdown - shown on desktop and tablet */}
          {!isMobile && (
            <FormControl sx={{ minWidth: 200 }} size="medium">
              <InputLabel sx={{ color: colors.textSecondary }}>
                Time Period
              </InputLabel>
              <Select
                label="Time Period"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.divider,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.accent,
                  },
                }}
              >
                {dateFilters.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Filter icon button - always visible */}
          <IconButton
            onClick={() => setFilterDialogOpen(true)}
            sx={{
              color: colors.accent,
              border: `1px solid ${colors.divider}`,
              backgroundColor: colors.cardBackground,
              "&:hover": {
                backgroundColor: colors.background,
              },
            }}
            size={isMobile ? "small" : "medium"}
          >
            <FilterList />
          </IconButton>

          {/* Search icon for mobile */}
          {/* {isMobile && (
            <IconButton
              onClick={() => {
                // You can implement mobile search functionality here
              }}
              sx={{ 
                color: colors.accent,
                border: `1px solid ${colors.divider}`,
                backgroundColor: colors.cardBackground,
                "&:hover": {
                  backgroundColor: colors.background,
                },
              }}
              size="small"
            >
              <Search />
            </IconButton>
          )} */}
        </Box>
      </Box>

      {/* Mobile Date Filter - shown below the header on mobile */}
      {/* {isMobile && (
        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: colors.textSecondary }}>Time Period</InputLabel>
            <Select
              label="Time Period"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.divider },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: colors.accent },
              }}
            >
              {dateFilters.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )} */}

      {/* Leads Table */}
      {filteredData.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{
            border: `1px solid ${colors.divider}`,
            boxShadow: "none",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: colors.primary }}>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                  Full Name
                </TableCell>
                {!isMobile && (
                  <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                    Mobile
                  </TableCell>
                )}
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                  Location
                </TableCell>
                {!isTablet && (
                  <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                    Category
                  </TableCell>
                )}
                {!isTablet && (
                  <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                    Investment
                  </TableCell>
                )}
                <TableCell
                  align="right"
                  sx={{ color: "#fff", fontWeight: 600 }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((lead, index) => (
                <LeadTableRow
                  key={lead.uuid || lead._id || index}
                  lead={lead}
                  index={index}
                  isMobile={isMobile}
                  isTablet={isTablet}
                  onViewDetails={onViewDetails}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
            flexDirection: "column",
            border: `1px dashed ${colors.divider}`,
            borderRadius: 2,
            backgroundColor: colors.cardBackground,
          }}
        >
          <Typography variant="h6" color={colors.textSecondary} gutterBottom>
            No leads found
          </Typography>
          <Typography variant="body2" color={colors.textSecondary}>
            {searchTerm ||
            investmentFilter !== "all" ||
            categoryFilter !== "all" ||
            locationFilter !== "all" ||
            dateFilter !== "all"
              ? "Try adjusting your search or filters"
              : "No leads have been recorded yet"}
          </Typography>
        </Box>
      )}

      {/* Filter Dialog */}
      <FilterDialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        investmentFilter={investmentFilter}
        setInvestmentFilter={setInvestmentFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        uniqueInvestmentRanges={uniqueInvestmentRanges}
        uniqueCategories={uniqueCategories}
        uniqueLocations={uniqueLocations}
        dateFilters={dateFilters}
        onReset={handleResetFilters}
      />
    </Box>
  );
};

export default LeadsTab;
