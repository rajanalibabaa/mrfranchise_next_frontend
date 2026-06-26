"use client";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  useMediaQuery,
  useTheme,
  ListSubheader,
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { fetchFilterOptions, clearErrors } from "@/Redux/Slices/filterDropdownData";

const FilterDropdowns = ({ onFilterChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    selectedMainCategory: "",
    selectedState: "",
    selectedInvestmentRange: "",
  });

  const [isNavigating, setIsNavigating] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => { isMountedRef.current = false; };
  }, []);

  const {
    mainCategories, // now [{ heading, industries: [] }]
    states,
    investmentRanges,
    loading,
    error,
  } = useSelector((state) => state.filterDropdown);

  useEffect(() => {
    dispatch(fetchFilterOptions());
    return () => { dispatch(clearErrors()); };
  }, [dispatch]);

  const handleFilterChange = useCallback(
    (name, value) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [name]: value };
        if (name === "selectedMainCategory") {
          newFilters.selectedState = "";
          newFilters.selectedDistrict = "";
          newFilters.selectedCity = "";
        } else if (name === "selectedState") {
          newFilters.selectedDistrict = "";
          newFilters.selectedCity = "";
        }
        return newFilters;
      });

      if (name === "selectedMainCategory" && value) {
        dispatch(fetchFilterOptions({ main: value }));
      } else if (name === "selectedState" && value) {
        dispatch(fetchFilterOptions({ state: value }));
      }

      if (onFilterChange) {
        if (name === "selectedMainCategory") onFilterChange("maincat", value);
        else if (name === "selectedState") onFilterChange("state", value);
        else if (name === "selectedInvestmentRange") onFilterChange("investmentRange", value);
      }
    },
    [dispatch, onFilterChange]
  );

  const formattedInvestmentRanges = useMemo(() => {
    if (!investmentRanges || investmentRanges.length === 0) {
      return [{ label: "All Ranges", value: "" }];
    }
    const getRangeValue = (range) => {
      if (range.includes("Below")) return 0;
      if (range === "Rs. 50,000 - 2 L") return 50000;
      const match = range.match(/Rs\.?\s*([\d,\.]+)\s*(L|Cr|Crs)?/i);
      if (!match) return Number.MAX_SAFE_INTEGER;
      const num = parseFloat(match[1].replace(/,/g, ''));
      const unit = match[2] ? match[2].toLowerCase() : '';
      if (unit === 'cr') return num * 10000000;
      if (unit === 'l') return num * 100000;
      return num;
    };
    const sortedRanges = [...investmentRanges].sort(
      (a, b) => getRangeValue(a) - getRangeValue(b)
    );
    return [
      { label: "All Ranges", value: "" },
      ...sortedRanges.map((range) => ({ label: range, value: range })),
    ];
  }, [investmentRanges]);

  // Build grouped menu items from [{ heading, industries[] }]
  const industryMenuItems = useMemo(() => {
    if (!mainCategories || mainCategories.length === 0) return [];

    const items = [];
    for (const group of mainCategories) {
      // Section header (not selectable)
      items.push(
        <ListSubheader
          key={`heading-${group.heading}`}
          sx={{
            fontWeight: 700,
            fontSize: "0.75rem",
            color: "text.secondary",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            lineHeight: "2rem",
            backgroundColor: "#f5f5f5",
            pointerEvents: "none", // not clickable
          }}
        >
          {group.heading}
        </ListSubheader>
      );

      // Industry options under this heading
      const sorted = [...(group.industries || [])].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" })
      );
      for (const industry of sorted) {
        items.push(
          <MenuItem key={industry} value={industry} sx={{ pl: 3 }}>
            {industry}
          </MenuItem>
        );
      }
    }
    return items;
  }, [mainCategories]);

  const handleFindBrands = useCallback(() => {
    if (isNavigating) return;
    setIsNavigating(true);

    const { selectedMainCategory, selectedState, selectedInvestmentRange } = filters;
    const queryParams = new URLSearchParams();

    if (selectedMainCategory) queryParams.append("maincat", selectedMainCategory);
    if (selectedState) queryParams.append("state", selectedState);
    if (selectedInvestmentRange) queryParams.append("investmentRange", selectedInvestmentRange);

    const hasAnyFilter = selectedMainCategory || selectedState || selectedInvestmentRange;
    const url = hasAnyFilter
      ? `/all-franchise-brands?${queryParams.toString()}`
      : "/all-franchise-brands";

    window.open(url, "_blank", "noopener,noreferrer");

    setTimeout(() => {
      if (isMountedRef.current) setIsNavigating(false);
    }, 500);
  }, [filters, isNavigating]);

  if (loading && !mainCategories.length && !states.length) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography color="error">Error loading filter options: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: 2,
        mb: 4,
        p: 2,
        borderRadius: 2,
        alignItems: "center",
        backgroundColor: "#0000007b",
        boxShadow: 1,
      }}
    >
      {/* Industry Filter — grouped by heading */}
      <FormControl fullWidth sx={{ minWidth: 180 }}>
        <InputLabel>Industry</InputLabel>
        <Select
          value={filters.selectedMainCategory}
          onChange={(e) => handleFilterChange("selectedMainCategory", e.target.value)}
          label="Industry"
          aria-label="Select Industry"
          MenuProps={{ PaperProps: { style: { maxHeight: 350 } } }}
          sx={{ backgroundColor: "white", borderRadius: 1 }}
        >
          <MenuItem value="">All Industries</MenuItem>
          {industryMenuItems}
        </Select>
      </FormControl>

      {/* Investment Range Filter */}
      <FormControl fullWidth sx={{ minWidth: 180 }}>
        <InputLabel>Investment Range</InputLabel>
        <Select
          value={filters.selectedInvestmentRange}
          onChange={(e) => handleFilterChange("selectedInvestmentRange", e.target.value)}
          label="Investment Range"
          aria-label="Select Investment Range"
          MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
          sx={{ backgroundColor: "white", borderRadius: 1 }}
        >
          {formattedInvestmentRanges.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* State Filter */}
      <FormControl fullWidth sx={{ minWidth: 180 }}>
        <InputLabel>Location</InputLabel>
        <Select
          value={filters.selectedState}
          onChange={(e) => handleFilterChange("selectedState", e.target.value)}
          label="Location"
          aria-label="Select Location"
          MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
          sx={{ backgroundColor: "white", borderRadius: 1 }}
        >
          <MenuItem value="">All Locations</MenuItem>
          {states.map((state) => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        onClick={handleFindBrands}
        aria-label="Find Brands in mrfranchise"
        startIcon={<SearchIcon />}
        sx={{
          height: "56px",
          minWidth: isMobile ? "100%" : "180px",
          backgroundColor: "#ff9800",
          textTransform: "none",
          fontWeight: "600",
          fontSize: "1rem",
          color: "white",
          "&:hover": { backgroundColor: "#fb8c00" },
          borderRadius: 1,
          boxShadow: "none",
        }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Find Brands"}
      </Button>
    </Box>
  );
};

export default React.memo(FilterDropdowns);