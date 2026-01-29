
"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {

  useMediaQuery,
  useTheme,
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
import {
  fetchFilterOptions,
 
  clearErrors,
} from "@/Redux/Slices/filterDropdownData";

const FilterDropdowns = ({ onFilterChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    selectedSubCategory: "",
    selectedState: "",
    selectedInvestmentRange: "",
  });

  // Get filter data from Redux store
  const {
    subCategories,
    states,
    investmentRanges,
    loading,
    error,
  } = useSelector((state) => state.filterDropdown);
  // console.log('filter dropdown data,',subCategories);
  

  // Fetch initial filter options when component mounts
  useEffect(() => {
    dispatch(fetchFilterOptions());
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch]);

  // Handle filter changes
  const handleFilterChange = useCallback(
    (name, value) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [name]: value };

        // Reset dependent filters when parent changes
        if (name === "selectedSubCategory") {
          newFilters.selectedState = "";
          newFilters.selectedDistrict = "";
          newFilters.selectedCity = "";
        } else if (name === "selectedState") {
          newFilters.selectedDistrict = "";
          newFilters.selectedCity = "";
        }

        return newFilters;
      });

      // Fetch dependent data if needed
      if (name === "selectedSubCategory" && value) {
        dispatch(fetchFilterOptions({ sub: value }));
      } else if (name === "selectedState" && value) {
        dispatch(fetchFilterOptions({ state: value }));
      }

      // Call the parent component's filter change handler if provided
      if (onFilterChange) {
        if (name === "selectedSubCategory") {
          onFilterChange("subcat", value);
        } else if (name === "selectedState") {
          onFilterChange("state", value);
        } else if (name === "selectedInvestmentRange") {
          onFilterChange("investmentRange", value);
        }
      }
    },
    [dispatch, onFilterChange]
  );

  
  // Format investment ranges for display
const formattedInvestmentRanges = useMemo(() => {
  if (!investmentRanges || investmentRanges.length === 0) {
    return [{ label: "All Ranges", value: "" }];
  }

  // Helper function to convert range to numerical value (in rupees)
  const getRangeValue = (range) => {
    // Handle special cases first
    if (range.includes("Below")) return 0;
    if (range === "Rs. 50,000 - 2 L") return 50000;
    
    // Extract the minimum value from the range
    const match = range.match(/Rs\.?\s*([\d,\.]+)\s*(L|Cr|Crs)?/i);
    if (!match) return Number.MAX_SAFE_INTEGER;
    
    const num = parseFloat(match[1].replace(/,/g, ''));
    const unit = match[2] ? match[2].toLowerCase() : '';
    
    // Convert to rupees
    if (unit === 'cr') return num * 10000000;
    if (unit === 'l') return num * 100000;
    return num;
  };

  // Sort ranges based on their numerical value
  const sortedRanges = [...investmentRanges].sort((a, b) => {
    return getRangeValue(a) - getRangeValue(b);
  });

  return [
    { label: "All Ranges", value: "" },
    ...sortedRanges.map((range) => ({ label: range, value: range })),
  ];
}, [investmentRanges]);

  // Handle search button click
// In your FilterDropdowns component
const handleFindBrands = useCallback(() => {
  const queryParams = new URLSearchParams();
  console.log('query params ',queryParams);
  
  
  if (filters.selectedSubCategory) {
    queryParams.append("subcat", filters.selectedSubCategory);
  }
  if (filters.selectedInvestmentRange) {
    queryParams.append("investmentRange", filters.selectedInvestmentRange);
  }
  if (filters.selectedState) {
    queryParams.append("state", filters.selectedState);
  }

 // 🔹 Open in a new browser tab instead of same tab
  window.open(`/allcategorypage/allbrandlisting?${queryParams.toString()}`, "_blank", "noopener,noreferrer");
}, [filters, router]);


  if (loading && !subCategories.length && !states.length) {
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
    {/* Category Filter */}
<FormControl fullWidth sx={{ minWidth: 180 }}>
  <InputLabel>Category</InputLabel>
  <Select
    value={filters.selectedSubCategory}
    onChange={(e) =>
      handleFilterChange("selectedSubCategory", e.target.value)
    }
    label="Category"
    MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
    sx={{
      backgroundColor: "white",
      borderRadius: 1,
    }}
  >
    <MenuItem value="">All Categories</MenuItem>

    {/* 🔠 Sort the subCategories first */}
    {[...subCategories]
      .sort((a, b) =>
        (a || "").localeCompare(b || "", undefined, { sensitivity: "base" })
      )
      .map((category) => (
        <MenuItem key={category} value={category}>
          {category}
        </MenuItem>
      ))}
  </Select>
</FormControl>


      {/* Investment Range Filter */}
      <FormControl fullWidth sx={{ minWidth: 180 }}>
        <InputLabel>Investment Range</InputLabel>
        <Select
          value={filters.selectedInvestmentRange}
          onChange={(e) =>
            handleFilterChange("selectedInvestmentRange", e.target.value)
          }
          label="Investment Range"
          MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
          }}
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
          MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
          }}
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
        startIcon={<SearchIcon />}
        sx={{
          height: "56px",
          minWidth: isMobile ? "100%" : "180px",
          backgroundColor: "#ff9800",
          textTransform: "none",
          fontWeight: "600",
          fontSize: '1rem',
          color: "white",
          "&:hover": {
            backgroundColor: "#fb8c00",
          },
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
