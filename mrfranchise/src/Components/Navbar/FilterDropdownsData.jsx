"use client";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  useMediaQuery,
  useTheme,
  ListSubheader,
  InputBase,
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
import ClearIcon from "@mui/icons-material/Clear";
import { useSelector, useDispatch } from "react-redux";
import { fetchFilterOptions, clearErrors } from "@/Redux/Slices/filterDropdownData";

const FilterDropdowns = ({ onFilterChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    selectedMainCategory: "",
    selectedState: "",
    selectedInvestmentRange: "",
  });

  const [opened, setOpened] = useState({
    selectedMainCategory: false,
    selectedState: false,
    selectedInvestmentRange: false,
  });

  const [industrySearch, setIndustrySearch] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const isMountedRef = useRef(true);
  const searchInputRef = useRef(null);

  useEffect(() => {
    return () => { isMountedRef.current = false; };
  }, []);

  const { mainCategories, states, investmentRanges, loading, error } =
    useSelector((state) => state.filterDropdown);

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

  const handleOpen = useCallback((name) => {
    setOpened((prev) => ({ ...prev, [name]: true }));
    if (name === "selectedMainCategory") {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, []);

  const handleIndustryClose = useCallback(() => {
    setIndustrySearch("");
  }, []);

  const formattedInvestmentRanges = useMemo(() => {
    if (!investmentRanges || investmentRanges.length === 0) {
      return [{ label: "All Ranges", value: "" }];
    }
    const getRangeValue = (range) => {
      if (range.includes("Below")) return 0;
      if (range === "Rs. 50,000 - 2 L") return 50000;
      const match = range.match(/Rs\.?\s*([\d,\.]+)\s*(L|Cr|Crs)?/i);
      if (!match) return Number.MAX_SAFE_INTEGER;
      const num = parseFloat(match[1].replace(/,/g, ""));
      const unit = match[2] ? match[2].toLowerCase() : "";
      if (unit === "cr") return num * 10000000;
      if (unit === "l") return num * 100000;
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

  // ✅ Filtered grouped items with InputBase search
  const industryMenuItems = useMemo(() => {
    if (!mainCategories || mainCategories.length === 0) return [];

    const term = industrySearch.trim().toLowerCase();
    const items = [];

    for (const group of mainCategories) {
      const filtered = [...(group.industries || [])]
        .filter((ind) => !term || ind.toLowerCase().includes(term))
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

      if (filtered.length === 0) continue;

      items.push(
        <ListSubheader
          key={`heading-${group.heading}`}
          sx={{
            fontWeight: 700,
            fontSize: "0.75rem",
            color: "text.secondary",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            textAlign: "center",
            lineHeight: "2rem",
            backgroundColor: "#f5f5f5",
            pointerEvents: "none",
          }}
        >
          {group.heading}
        </ListSubheader>
      );

      for (const industry of filtered) {
        items.push(
          <MenuItem key={industry} value={industry} sx={{ pl: 3, fontSize: "0.9rem" }}>
            {term ? (
              (() => {
                const idx = industry.toLowerCase().indexOf(term);
                if (idx === -1) return industry;
                return (
                  <>
                    {industry.slice(0, idx)}
                    <span style={{ fontWeight: 700, color: "#ff9800" }}>
                      {industry.slice(idx, idx + term.length)}
                    </span>
                    {industry.slice(idx + term.length)}
                  </>
                );
              })()
            ) : industry}
          </MenuItem>
        );
      }
    }

    if (items.length === 0) {
      items.push(
        <MenuItem key="no-results" disabled sx={{ fontStyle: "italic", color: "text.secondary" }}>
          No industries found
        </MenuItem>
      );
    }

    return items;
  }, [mainCategories, industrySearch]);

  const handleFindBrands = useCallback(() => {
    if (isNavigating) return;

    const { selectedMainCategory, selectedState, selectedInvestmentRange } = filters;
    const queryParams = new URLSearchParams();

    if (selectedMainCategory) queryParams.append("maincat", selectedMainCategory);
    if (selectedState) queryParams.append("state", selectedState);
    if (selectedInvestmentRange) queryParams.append("investmentRange", selectedInvestmentRange);

    const url = queryParams.toString()
      ? `/all-franchise-brands?${queryParams.toString()}`
      : "/all-franchise-brands";

    window.open(url, "_blank", "noopener,noreferrer");
    setIsNavigating(true);
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
      {/* ✅ Industry Filter with InputBase Search */}
      <FormControl fullWidth sx={{ minWidth: 180 }}>
        <InputLabel shrink={opened.selectedMainCategory || !!filters.selectedMainCategory}>
          Investment Industry
        </InputLabel>
        <Select
          value={filters.selectedMainCategory}
          onChange={(e) => {
            handleFilterChange("selectedMainCategory", e.target.value);
            setIndustrySearch("");
          }}
          onOpen={() => handleOpen("selectedMainCategory")}
          onClose={handleIndustryClose}
          label="Industry"
          aria-label="Select Industry"
          displayEmpty
          renderValue={(selected) => {
            if (!opened.selectedMainCategory && !selected)
              return <span style={{ color: "transparent" }}>.</span>;
            return selected ? selected : "All Industries";
          }}
          MenuProps={{
            PaperProps: { style: { maxHeight: 400 } },
            disableAutoFocusItem: true,
          }}
          sx={{ backgroundColor: "white", borderRadius: 1 }}
        >
          {/* ✅ Sticky InputBase search box */}
          <ListSubheader
            onClickCapture={(e) => e.stopPropagation()}
            sx={{
              p: "8px 12px",
              backgroundColor: "white",
              position: "sticky",
              top: 0,
              zIndex: 2,
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1,
                py: 0.5,
                border: "1.5px solid #ff9800",
                borderRadius: "8px",
                backgroundColor: "#fff",
              }}
            >
              <SearchIcon sx={{ color: "#ff9800", fontSize: 18, flexShrink: 0 }} />
              <InputBase
                inputRef={searchInputRef}
                placeholder="Search industry..."
                value={industrySearch}
                onChange={(e) => setIndustrySearch(e.target.value)}
                // ✅ Critical — stop MUI Select swallowing keystrokes
                onKeyDown={(e) => e.stopPropagation()}
                sx={{
                  flex: 1,
                  fontSize: "0.875rem",
                  "& input": { padding: 0 },
                }}
              />
              {/* ✅ Clear button when search has text */}
              {industrySearch && (
                <ClearIcon
                  onMouseDown={(e) => {
                    e.preventDefault(); // prevent dropdown close
                    setIndustrySearch("");
                    searchInputRef.current?.focus();
                  }}
                  sx={{
                    color: "#aaa",
                    fontSize: 16,
                    cursor: "pointer",
                    flexShrink: 0,
                    "&:hover": { color: "#ff9800" },
                  }}
                />
              )}
            </Box>
          </ListSubheader>

          {/* All Industries */}
          <MenuItem value="" sx={{ fontStyle: "italic", color: "text.secondary" }}>
            All Industries
          </MenuItem>

          {industryMenuItems}
        </Select>
      </FormControl>

      {/* Investment Range Filter */}
      <FormControl fullWidth sx={{ minWidth: 180 }}>
        <InputLabel shrink={opened.selectedInvestmentRange || !!filters.selectedInvestmentRange}>
          Investment Range
        </InputLabel>
        <Select
          value={filters.selectedInvestmentRange}
          onChange={(e) => handleFilterChange("selectedInvestmentRange", e.target.value)}
          onOpen={() => handleOpen("selectedInvestmentRange")}
          label="Investment Range"
          aria-label="Select Investment Range"
          displayEmpty
          renderValue={(selected) => {
            if (!opened.selectedInvestmentRange && !selected)
              return <span style={{ color: "transparent" }}>.</span>;
            return selected ? selected : "All Ranges";
          }}
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

      {/* Location Filter */}
      <FormControl fullWidth sx={{ minWidth: 180 }}>
        <InputLabel shrink={opened.selectedState || !!filters.selectedState}>
          Investment Location
        </InputLabel>
        <Select
          value={filters.selectedState}
          onChange={(e) => handleFilterChange("selectedState", e.target.value)}
          onOpen={() => handleOpen("selectedState")}
          label="Location"
          aria-label="Select Location"
          displayEmpty
          renderValue={(selected) => {
            if (!opened.selectedState && !selected)
              return <span style={{ color: "transparent" }}>.</span>;
            return selected ? selected : "All Locations";
          }}
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
        disabled={loading || isNavigating}
      >
        {loading || isNavigating ? (
          <CircularProgress size={24} color="inherit" />
        ) : "Find Brands"}
      </Button>
    </Box>
  );
};

export default React.memo(FilterDropdowns);