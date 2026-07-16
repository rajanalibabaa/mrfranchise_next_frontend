"use client";

import React from "react";
import {
  Paper,
  Grid,
  TextField,
  MenuItem,
  Stack,
  Chip,
  Typography,
  InputAdornment,
  Fade,
  alpha,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import BusinessIcon from "@mui/icons-material/Business";
import CategoryIcon from "@mui/icons-material/Category";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DateRangeIcon from "@mui/icons-material/DateRange";
import SortIcon from "@mui/icons-material/Sort";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import StorefrontIcon from "@mui/icons-material/Storefront";

export default function FilterPanel({
  showFilters,
  filters,
  setFilters,
  leads,
  searchQuery,
  setSearchQuery,
  activeFilterCount,
}) {
  const dropdownFields = [
    {
      key: "businessType",
      label: "Business Type",
      icon: <StorefrontIcon fontSize="small" />,
      dataKey: "investorEnquiryModel",
    },
      {
      key: "investment",
      label: "Investment",
      icon: <AttachMoneyIcon fontSize="small" />,
      dataKey: "investmentRange",
    },
    {
      key: "industry",
      label: "Industry",
      icon: <BusinessIcon fontSize="small" />,
      dataKey: "industry",
    },
    {
      key: "category",
      label: "Category",
      icon: <CategoryIcon fontSize="small" />,
      dataKey: "category",
    },
  
    {
      key: "state",
      label: "State",
      icon: <LocationOnIcon fontSize="small" />,
      dataKey: "state",
    },
    {
      key: "district",
      label: "District",
      icon: <LocationOnIcon fontSize="small" />,
      dataKey: "district",
    },
    
  ];

  const getFilterLabel = (key) => {
    const labels = {
      industry: "Industry",
      category: "Category",
      investment: "Investment",
      state: "State",
      district: "District",
      businessType: "Business Type",
      sort: "Sort",
      date: "Quick Date",
      dateFrom: "From",
      dateTo: "To",
    };
    return labels[key] || key;
  };

  return (
    <Fade in={showFilters}>
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          p: 3,
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          background: "#fff",
          display: showFilters ? "block" : "none",
        }}
      >
        <Typography
          variant="subtitle2"
          fontWeight={700}
          color="#475569"
          mb={2}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <FilterListIcon fontSize="small" /> Advanced Filters
        </Typography>

        <Grid container spacing={2}>
          {/* Dropdown Filters */}
          {dropdownFields.map(({ key, label, icon, dataKey }) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={key}>
              <TextField
                select
                fullWidth
                size="small"
                label={label}
                value={filters[key]}
                onChange={(e) =>
                  setFilters({ ...filters, [key]: e.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">{icon}</InputAdornment>
                  ),
                  sx: { borderRadius: 2,minWidth:'200px' },
                }}
              >
                <MenuItem value="">All</MenuItem>
                {[...new Set(leads.map((x) => x[dataKey]))]
                  .filter(Boolean)
                  .sort()
                  .map((v) => (
                    <MenuItem key={v} value={v}>
                      {v}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
          ))}

          {/* Quick Date */}
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <TextField
              select
              fullWidth
              size="small"
              label="Quick Date"
              value={filters.date}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  date: e.target.value,
                  dateFrom: "",
                  dateTo: "",
                })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon fontSize="small" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2,minWidth:'200px' },
              }}
            >
              <MenuItem value="">All Time</MenuItem>
              <MenuItem value="3">Last 3 Days</MenuItem>
              <MenuItem value="7">Last 7 Days</MenuItem>
              <MenuItem value="30">Last 30 Days</MenuItem>
              <MenuItem value="90">Last 90 Days</MenuItem>
            </TextField>
          </Grid>

          {/* From Date */}
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="From Date"
              value={filters.dateFrom}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  dateFrom: e.target.value,
                  date: "",
                })
              }
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DateRangeIcon fontSize="small" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 ,minWidth:'200px'},
              }}
            />
          </Grid>

          {/* To Date */}
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="To Date"
              value={filters.dateTo}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  dateTo: e.target.value,
                  date: "",
                })
              }
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DateRangeIcon fontSize="small" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2,minWidth:'200px' },
              }}
            />
          </Grid>

          {/* Sort */}
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <TextField
              select
              fullWidth
              size="small"
              label="Sort By"
              value={filters.sort}
              onChange={(e) =>
                setFilters({ ...filters, sort: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SortIcon fontSize="small" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2,minWidth:'200px' },
              }}
            >
              <MenuItem value="">Default</MenuItem>
              <MenuItem value="asc">
                <Stack direction="row" alignItems="center" gap={1}>
                  <ArrowUpwardIcon fontSize="small" /> Name A–Z
                </Stack>
              </MenuItem>
              <MenuItem value="desc">
                <Stack direction="row" alignItems="center" gap={1}>
                  <ArrowDownwardIcon fontSize="small" /> Name Z–A
                </Stack>
              </MenuItem>
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <Stack direction="row" spacing={1} mt={2} flexWrap="wrap" useFlexGap>
            {searchQuery && (
              <Chip
                label={`Search: "${searchQuery}"`}
                onDelete={() => setSearchQuery("")}
                size="small"
                sx={{
                  background: alpha("#6366f1", 0.1),
                  color: "#6366f1",
                  fontWeight: 600,
                }}
              />
            )}
            {Object.entries(filters)
              .filter(([, v]) => v)
              .map(([key, value]) => (
                <Chip
                  key={key}
                  label={`${getFilterLabel(key)}: ${value}`}
                  onDelete={() => setFilters({ ...filters, [key]: "" })}
                  size="small"
                  sx={{
                    background: alpha("#ff9800", 0.1),
                    color: "#ff9800",
                    fontWeight: 600,
                  }}
                />
              ))}
          </Stack>
        )}
      </Paper>
    </Fade>
  );
}