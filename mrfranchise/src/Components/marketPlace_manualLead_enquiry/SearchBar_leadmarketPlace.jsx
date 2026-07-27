"use client";

import React from "react";
import {
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Badge,
  Button,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearAllIcon from "@mui/icons-material/ClearAll";

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  activeFilterCount,
  clearAllFilters,
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      justifyContent="space-evenly"
      alignItems="center"
      flexWrap="wrap"
      useFlexGap
      sx={{ mb: 3 }}
    >
      {/* Title */}
      <Typography
        variant="h4"
        fontWeight={800}
        sx={{
          letterSpacing: "-0.5px",
          background: "linear-gradient(90deg, #ff9800, #e5c511)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          whiteSpace: "nowrap",
        }}
      >
        Investor Enquiry Leads
      </Typography>

      {/* Search Input */}
      <TextField
        placeholder="Search by name, email, phone, industry, state, category, district, business type..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#94a3b8" }} />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setSearchQuery("")}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            borderRadius: 2,
            background: "#f8fafc",
            "& fieldset": { borderColor: "#e2e8f0" },
            "&:hover fieldset": { borderColor: "#ff9800 !important" },
          },
        }}
        sx={{ minWidth: { xs: "100%", sm: "420px" } }}
      />

      {/* Filter Toggle */}
      <Badge badgeContent={activeFilterCount} color="primary">
        <Button
          variant={showFilters ? "contained" : "outlined"}
          startIcon={<FilterListIcon />}
          onClick={() => setShowFilters(!showFilters)}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            minWidth: 130,
            ...(showFilters
              ? {
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  },
                }
              : {
                  borderColor: "#6366f1",
                  color: "#6366f1",
                }),
          }}
        >
          Filters
        </Button>
      </Badge>

      {/* Clear All */}
      {activeFilterCount > 0 && (
        <Button
          variant="text"
          startIcon={<ClearAllIcon />}
          onClick={clearAllFilters}
          sx={{
            textTransform: "none",
            color: "#ef4444",
            fontWeight: 600,
            minWidth: 120,
          }}
        >
          Clear All
        </Button>
      )}
    </Stack>
  );
}