"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import InputBase from "@mui/material/InputBase";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import Close from "@mui/icons-material/Close";

import {
  resetChildCategories,
  resetDistricts,
  resetCities,
} from "@/Redux/Slices/filterDropdownData";

// Define the correct order for investment ranges
const INVESTMENT_RANGE_ORDER = [
  "Below - 50k",
  "Rs. 50k - 2 Lakhs",
  "Rs. 2 Lakhs - 5 Lakhs",
  "Rs. 5 Lakhs - 10 Lakhs",
  "Rs. 10 Lakhs - 20 Lakhs",
  "Rs. 20 Lakhs - 30 Lakhs",
  "Rs. 30 Lakhs - 50 Lakhs",
  "Rs. 50 Lakhs - 1 Crore",
  "Rs. 1 Crores - 2 Crores",
  "Rs. 2 Crores - 5 Crores",
  "Rs. 5 Crores - above",
];

// ─── Highlighted Text Component ───────────────────────────────────────────────
// ─── Highlighted Text Component ───────────────────────────────────────────────
const HighlightedText = ({ text, highlight }) => {
  if (!highlight?.trim() || !text) return <>{text}</>;

  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span
            key={i}
            style={{
              color: "#ff9800",
              fontWeight: 600,
              // Ensure same size as normal text
              fontSize: "inherit",
              lineHeight: "inherit",
            }}
          >
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

// ─── Reusable Search Box ───────────────────────────────────────────────────────
const DropdownSearchBox = ({ value, onChange, onClear, placeholder, inputRef }) => (
  <Box
    onKeyDown={(e) => e.stopPropagation()}
    onMouseDown={(e) => e.stopPropagation()}
    onClick={(e) => e.stopPropagation()}
    sx={{
      position: "sticky",
      top: 0,
      zIndex: 10,
      bgcolor: "background.paper",
      px: 1.5,
      py: 1,
      borderBottom: "1px solid #f0f0f0",
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        border: "1.5px solid #ff9800",
        borderRadius: "8px",
        px: 1.2,
        py: 0.6,
        gap: 1,
        backgroundColor: "#fff",
      }}
    >
      <SearchIcon sx={{ color: "#ff9800", fontSize: 20, flexShrink: 0 }} />
      <InputBase
        inputRef={inputRef}
        fullWidth
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.stopPropagation()}
        sx={{
          fontSize: "0.9rem",
          flex: 1,
          "& input": { padding: 0 },
        }}
      />
      {value && (
        <Close
          onMouseDown={(e) => {
            e.preventDefault();
            onClear();
          }}
          sx={{
            color: "#aaa",
            fontSize: 18,
            cursor: "pointer",
            flexShrink: 0,
            "&:hover": { color: "#ff9800" },
          }}
        />
      )}
    </Box>
  </Box>
);

// ─── Component ─────────────────────────────────────────────────────────────────
const FillterPannel = React.memo(
  ({
    filters,
    onFilterChange,
    onClearFilters,
    activeFilterCount,
    resultStats = { showing: 0, total: 0 },
  }) => {
    const dispatch = useDispatch();
    const {
      mainCategories,
      subCategories,
      childCategories,
      franchiseModels,
      investmentRanges,
      areaRequired,
      states,
      districts,
      cities,
      loading,
      loadingChildCategories,
      loadingDistricts,
      loadingCities,
    } = useSelector((state) => state.filterDropdown);

    const mainCategoryRef = useRef(null);
    const subCategoryRef = useRef(null);
    const modelTypeRef = useRef(null);
    const locationRef = useRef(null);
    const investmentRef = useRef(null);
    const areaRequiredRef = useRef(null);

    // Search input refs (for auto-focus on accordion open)
    const industrySearchRef = useRef(null);
    const subCategorySearchRef = useRef(null);
    const stateSearchRef = useRef(null);
    const districtSearchRef = useRef(null);

    const [searchTerms, setSearchTerms] = useState({
      mainCategory: "",
      subCategory: "",
      modelType: "",
      investmentRange: "",
      areaRequired: "",
      state: "",
      district: "",
      city: "",
    });

    const [expandedSections, setExpandedSections] = useState({
      mainCategory: false,
      subCategory: false,
      modelType: false,
      areaRequired: false,
      location: false,
      investment: false,
    });

    // Read URL parameters on mount
    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const maincat = params.get("maincat");
      const subcat = params.get("subcat");
      const state = params.get("state");
      const investmentRange = params.get("investmentRange");
      const areaRequiredParam = params.get("areaRequired");

      if (maincat) onFilterChange("maincat", maincat);
      if (subcat) onFilterChange("subcat", subcat);
      if (state) onFilterChange("state", state);
      if (investmentRange) onFilterChange("investmentRange", investmentRange);
      if (areaRequiredParam) onFilterChange("areaRequired", areaRequiredParam);
    }, [onFilterChange]);

    const toggleSection = (section) => {
      setExpandedSections((prev) => {
        const newState = { ...prev };
        if (!prev[section]) {
          Object.keys(newState).forEach((key) => {
            if (key !== section) newState[key] = false;
          });
        }
        newState[section] = !prev[section];
        return newState;
      });

      // Auto-focus the relevant search box after accordion opens
      if (!expandedSections[section]) {
        setTimeout(() => {
          if (section === "mainCategory") industrySearchRef.current?.focus();
          if (section === "location") stateSearchRef.current?.focus();
        }, 200);
      }
    };

    const updateSearch = (key, value) =>
      setSearchTerms((prev) => ({ ...prev, [key]: value }));

    // ── Filtered lists ──────────────────────────────────────────────────────────
    const filteredMainCategories = useMemo(() => {
      const term = (searchTerms.mainCategory || "").toLowerCase();
      const result = [];
      for (const group of mainCategories) {
        if (!group?.heading || !Array.isArray(group.industries)) continue;
        const matchedIndustries = group.industries
          .filter((ind) => ind && ind.toLowerCase().includes(term))
          .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        if (matchedIndustries.length > 0)
          result.push({ heading: group.heading, industries: matchedIndustries });
      }
      return result;
    }, [mainCategories, searchTerms.mainCategory]);

    const filteredSubCategories = useMemo(() => {
      const term = (searchTerms.subCategory || "").toLowerCase();
      return subCategories
        .filter((sub) => sub && sub.toLowerCase().includes(term))
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        .slice(0, 100);
    }, [subCategories, searchTerms.subCategory]);

    const filteredModelTypes = useMemo(() => {
      const term = (searchTerms.modelType || "").toLowerCase().trim();
      return franchiseModels
        .filter((type) => type && type.toLowerCase().includes(term))
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    }, [franchiseModels, searchTerms.modelType]);

    const filteredInvestmentRanges = useMemo(() => {
      const term = (searchTerms.investmentRange || "").toLowerCase();
      return investmentRanges
        .filter((range) => range && range.toLowerCase().includes(term))
        .sort((a, b) => {
          const iA = INVESTMENT_RANGE_ORDER.indexOf(a);
          const iB = INVESTMENT_RANGE_ORDER.indexOf(b);
          if (iA !== -1 && iB !== -1) return iA - iB;
          if (iA !== -1) return -1;
          if (iB !== -1) return 1;
          return a.toLowerCase().localeCompare(b.toLowerCase());
        });
    }, [investmentRanges, searchTerms.investmentRange]);

    const filteredAreaRequired = useMemo(() => {
      const term = (searchTerms.areaRequired || "").toLowerCase();
      return areaRequired
        .filter((area) => area && area.toLowerCase().includes(term))
        .slice(0, 50);
    }, [areaRequired, searchTerms.areaRequired]);

    const filteredStates = useMemo(() => {
      const term = (searchTerms.state || "").toLowerCase();
      return states
        .filter((s) => s && s.toLowerCase().includes(term))
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        .slice(0, 100);
    }, [states, searchTerms.state]);

    const filteredDistricts = useMemo(() => {
      if (!filters.state) return [];
      const term = (searchTerms.district || "").toLowerCase();
      return districts
        .filter((d) => d && d.toLowerCase().includes(term))
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        .slice(0, 100);
    }, [filters.state, districts, searchTerms.district]);

    const filteredCities = useMemo(() => {
      if (!filters.district) return [];
      const term = (searchTerms.city || "").toLowerCase();
      return cities
        .filter((c) => c && c.toLowerCase().includes(term))
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        .slice(0, 100);
    }, [filters.district, cities, searchTerms.city]);

    // ── Render ──────────────────────────────────────────────────────────────────
    return (
      <Box
        sx={{ pr: 2, height: "calc(100vh - 120px)", width: "100%", overflowY: "auto" }}
      >
        {/* Result count banner */}
        <Typography
          variant="body2"
          sx={{
            color: "#000",
            background: "#7cd13b",
            display: "block",
            textAlign: "center",
            padding: "10px",
            borderRadius: "5px",
            mb: 1,
            mt: 4,
          }}
        >
          Showing {resultStats.showing || 0} of {resultStats.total || 0} brands
        </Typography>

        {/* Header row */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          mt={3}
          sx={{ background: "white", p: 1, borderRadius: "5px" }}
        >
          <Typography variant="h6" sx={{ color: "#000" }}>
            Filters
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={onClearFilters}
            disabled={activeFilterCount === 0}
            startIcon={<ClearIcon />}
            sx={{ color: "#f00", borderColor: "#f00" }}
          >
            Clear
          </Button>
        </Box>

        {/* ── Industries Filter ─────────────────────────────────────────────── */}
        <Accordion
          ref={mainCategoryRef}
          expanded={expandedSections.mainCategory}
          onChange={() => toggleSection("mainCategory")}
          disableGutters
          elevation={0}
          sx={{ mb: 2, borderRadius: "5px", "&:before": { display: "none" } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#4caf50" }} />}
            sx={{ px: 1, "&.Mui-expanded": { minHeight: "48px" } }}
          >
            <Typography sx={{ color: "#4caf50", fontWeight: "bold", fontSize: "0.875rem" }}>
              Industries
            </Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ p: 0 }}>
            {/* Search box for industries */}
            <DropdownSearchBox
              inputRef={industrySearchRef}
              value={searchTerms.mainCategory}
              onChange={(v) => updateSearch("mainCategory", v)}
              onClear={() => updateSearch("mainCategory", "")}
              placeholder="Search industry..."
            />

            <Box sx={{ px: 1, maxHeight: 320, overflowY: "auto" }}>
              <RadioGroup
                value={filters.maincat || ""}
                onChange={(e) => {
                  onFilterChange("maincat", e.target.value);
                  onFilterChange("subcat", "");
                  onFilterChange("childcat", "");
                  updateSearch("subCategory", ""); // clear sub-search on industry change
                  if (!e.target.value) dispatch(resetChildCategories());
                }}
              >
                {filteredMainCategories.length === 0 && (
                  <Typography
                    fontSize="0.75rem"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ py: 2 }}
                  >
                    No industries found
                  </Typography>
                )}

                {filteredMainCategories.map((group) => (
                  <React.Fragment key={`heading-${group.heading}`}>
                    {/* Group heading */}
                    <Box
                      sx={{
                        width: "93%",
                        px: 1,
                        py: 0.5,
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "text.secondary",
                        backgroundColor: "#f5f5f5",
                        borderRadius: "6px",
                        mt: 1,
                        pointerEvents: "none",
                      }}
                    >
                      {group.heading}
                    </Box>

                    {/* Industries */}
                    {group.industries.map((industry) => (
                      <Box key={`cat-container-${industry}`} sx={{ mb: 0 }}>
                        <FormControlLabel
                          value={industry}
                          control={
                            <Radio
                              size="small"
                              sx={{
                                color: "#ff9800",
                                "&.Mui-checked": { color: "#4caf50" },
                                padding: "6px",
                              }}
                            />
                          }
                          label={
                            <Typography fontSize="0.8125rem">
                              <HighlightedText 
                                text={`${industry} Franchise`} 
                                highlight={searchTerms.mainCategory} 
                              />
                            </Typography>
                          }
                          sx={{ mb: 0, mr: 0 }}
                        />

                        {/* Inline subcategory panel when this industry is selected */}
                        {filters.maincat === industry && (
                          <Box ref={subCategoryRef} sx={{ ml: 2, pl: 1 }}>
                            {/* Search box for subcategories */}
                            <DropdownSearchBox
                              inputRef={subCategorySearchRef}
                              value={searchTerms.subCategory}
                              onChange={(v) => updateSearch("subCategory", v)}
                              onClear={() => updateSearch("subCategory", "")}
                              placeholder="Search subcategory..."
                            />

                            <RadioGroup
                              value={filters.subcat || ""}
                              onChange={(e) => {
                                onFilterChange("subcat", e.target.value);
                                onFilterChange("childcat", "");
                                if (!e.target.value) dispatch(resetChildCategories());
                              }}
                            >
                              {filteredSubCategories.length === 0 && (
                                <Typography
                                  fontSize="0.75rem"
                                  color="text.secondary"
                                  sx={{ py: 1, pl: 1 }}
                                >
                                  No subcategories found
                                </Typography>
                              )}

                              {filteredSubCategories.map((subCategory) => (
                                <Box key={`subcat-container-${subCategory}`} sx={{ mt: 1 }}>
                                  <FormControlLabel
                                    value={subCategory}
                                    control={
                                      <Radio
                                        size="small"
                                        sx={{
                                          color: "#ff9800",
                                          "&.Mui-checked": { color: "#4caf50" },
                                          padding: "6px",
                                        }}
                                      />
                                    }
                                    label={
                                      <Typography fontSize="0.8125rem">
                                        <HighlightedText 
                                          text={`${subCategory} Franchise`} 
                                          highlight={searchTerms.subCategory} 
                                        />
                                      </Typography>
                                    }
                                    sx={{ mb: 0, mr: 0 }}
                                  />

                                  {/* Child categories */}
                                  {filters.subcat === subCategory && (
                                    <Box sx={{ ml: 2, mt: 1, pl: 1 }}>
                                      {loadingChildCategories ? (
                                        <Box sx={{ p: 1 }}>
                                          <CircularProgress size={16} sx={{ color: "#ff9800" }} />
                                        </Box>
                                      ) : childCategories?.length > 0 ? (
                                        <RadioGroup
                                          value={filters.childcat || ""}
                                          onChange={(e) =>
                                            onFilterChange("childcat", e.target.value)
                                          }
                                        >
                                          {childCategories.map((childCategory) => (
                                            <FormControlLabel
                                              key={`childcat-${childCategory}`}
                                              value={childCategory}
                                              control={
                                                <Radio
                                                  size="small"
                                                  sx={{
                                                    color: "#ff9800",
                                                    "&.Mui-checked": { color: "#4caf50" },
                                                    padding: "6px",
                                                  }}
                                                />
                                              }
                                              label={
                                                <Typography fontSize="0.8125rem">
                                                  {childCategory}
                                                </Typography>
                                              }
                                              sx={{ mb: 0.5, mr: 0 }}
                                            />
                                          ))}
                                        </RadioGroup>
                                      ) : (
                                        <Typography
                                          fontSize="0.75rem"
                                          color="text.secondary"
                                          sx={{ py: 1, pl: 1 }}
                                        >
                                          No tags available
                                        </Typography>
                                      )}
                                    </Box>
                                  )}
                                </Box>
                              ))}
                            </RadioGroup>
                          </Box>
                        )}
                      </Box>
                    ))}
                  </React.Fragment>
                ))}
              </RadioGroup>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* ── Model Type Filter ─────────────────────────────────────────────── */}
        <Accordion
          ref={modelTypeRef}
          expanded={expandedSections.modelType}
          onChange={() => toggleSection("modelType")}
          disableGutters
          elevation={0}
          sx={{ mb: 2, "&:before": { display: "none" } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#4caf50" }} />}
            sx={{ px: 1, "&.Mui-expanded": { minHeight: "48px" } }}
          >
            <Typography sx={{ color: "#4caf50", fontWeight: "bold", fontSize: "0.875rem" }}>
              Model Type
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <Box sx={{ px: 1 }}>
              <RadioGroup
                value={filters.modelType || ""}
                onChange={(e) => onFilterChange("modelType", e.target.value)}
              >
                {filteredModelTypes.map((type) => (
                  <FormControlLabel
                    key={`modeltype-${type}`}
                    value={type}
                    control={
                      <Radio
                        size="small"
                        sx={{
                          color: "#ff9800",
                          "&.Mui-checked": { color: "#4caf50" },
                          padding: "6px",
                        }}
                      />
                    }
                    label={
                      <Typography fontSize="0.8125rem">
                        <HighlightedText 
                          text={type} 
                          highlight={searchTerms.modelType} 
                        />
                      </Typography>
                    }
                    sx={{ mb: 0, mr: 0 }}
                  />
                ))}
              </RadioGroup>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* ── Investment Range Filter ───────────────────────────────────────── */}
        <Accordion
          ref={investmentRef}
          expanded={expandedSections.investment}
          onChange={() => toggleSection("investment")}
          disableGutters
          elevation={0}
          sx={{ mb: 2, "&:before": { display: "none" } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#4caf50" }} />}
            sx={{ px: 1, "&.Mui-expanded": { minHeight: "48px" } }}
          >
            <Typography sx={{ color: "#4caf50", fontWeight: "bold", fontSize: "0.875rem" }}>
              Investment Range
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <Box sx={{ px: 1 }}>
              <RadioGroup
                value={filters.investmentRange || ""}
                onChange={(e) => onFilterChange("investmentRange", e.target.value)}
              >
                {filteredInvestmentRanges.map((range) => (
                  <FormControlLabel
                    key={`range-${range}`}
                    value={range}
                    control={
                      <Radio
                        size="small"
                        sx={{
                          color: "#ff9800",
                          "&.Mui-checked": { color: "#4caf50" },
                          padding: "6px",
                        }}
                      />
                    }
                    label={
                      <Typography fontSize="0.8125rem">
                        <HighlightedText 
                          text={range} 
                          highlight={searchTerms.investmentRange} 
                        />
                      </Typography>
                    }
                    sx={{ mb: 0, mr: 0 }}
                  />
                ))}
              </RadioGroup>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* ── Area Required Filter ──────────────────────────────────────────── */}
        <Accordion
          ref={areaRequiredRef}
          expanded={expandedSections.areaRequired}
          onChange={() => toggleSection("areaRequired")}
          disableGutters
          elevation={0}
          sx={{ mb: 2, "&:before": { display: "none" } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#4caf50" }} />}
            sx={{ px: 1, "&.Mui-expanded": { minHeight: "48px" } }}
          >
            <Typography sx={{ color: "#4caf50", fontWeight: "bold", fontSize: "0.875rem" }}>
              Area Required
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <Box sx={{ px: 1 }}>
              <RadioGroup
                value={filters.areaRequired || ""}
                onChange={(e) => onFilterChange("areaRequired", e.target.value)}
              >
                <FormControlLabel
                  value=""
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: "#ff9800",
                        "&.Mui-checked": { color: "#4caf50" },
                        padding: "6px",
                      }}
                    />
                  }
                  label={<Typography fontSize="0.8125rem">All Areas</Typography>}
                  sx={{ mb: 0, mr: 0 }}
                />
                {filteredAreaRequired.map((area) => (
                  <FormControlLabel
                    key={`area-${area}`}
                    value={area}
                    control={
                      <Radio
                        size="small"
                        sx={{
                          color: "#ff9800",
                          "&.Mui-checked": { color: "#4caf50" },
                          padding: "6px",
                        }}
                      />
                    }
                    label={
                      <Typography fontSize="0.8125rem">
                        <HighlightedText 
                          text={area} 
                          highlight={searchTerms.areaRequired} 
                        />
                      </Typography>
                    }
                    sx={{ mb: 0, mr: 0 }}
                  />
                ))}
              </RadioGroup>
              {filteredAreaRequired.length === 0 && (
                <Typography fontSize="0.75rem" color="text.secondary" textAlign="center" sx={{ py: 1 }}>
                  No results found
                </Typography>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* ── Location Filters ──────────────────────────────────────────────── */}
        <Accordion
          ref={locationRef}
          expanded={expandedSections.location}
          onChange={() => toggleSection("location")}
          disableGutters
          elevation={0}
          sx={{ mb: 2, "&:before": { display: "none" } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#4caf50" }} />}
            sx={{ px: 1, "&.Mui-expanded": { minHeight: "48px" } }}
          >
            <Typography sx={{ color: "#4caf50", fontWeight: "bold", fontSize: "0.875rem" }}>
              Location Filters
            </Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ p: 0 }}>
            {/* Search box for states */}
            <DropdownSearchBox
              inputRef={stateSearchRef}
              value={searchTerms.state}
              onChange={(v) => updateSearch("state", v)}
              onClear={() => updateSearch("state", "")}
              placeholder="Search state..."
            />

            <Box sx={{ px: 1, maxHeight: 360, overflowY: "auto" }}>
              {loading ? (
                <Box sx={{ p: 2 }}>
                  <CircularProgress size={20} sx={{ color: "#ff9800" }} />
                </Box>
              ) : (
                <RadioGroup
                  value={filters.state || ""}
                  onChange={(e) => {
                    onFilterChange("state", e.target.value);
                    onFilterChange("district", "");
                    onFilterChange("city", "");
                    updateSearch("district", ""); // clear district search on state change
                    if (!e.target.value) dispatch(resetDistricts());
                  }}
                >
                  {filteredStates.length === 0 && (
                    <Typography fontSize="0.75rem" color="text.secondary" textAlign="center" sx={{ py: 2 }}>
                      No states found
                    </Typography>
                  )}

                  {filteredStates.map((state) => (
                    <Box key={`state-box-${state}`} sx={{ mb: 0.5 }}>
                      <FormControlLabel
                        value={state}
                        control={
                          <Radio
                            size="small"
                            sx={{
                              color: "#ff9800",
                              "&.Mui-checked": { color: "#4caf50" },
                              padding: "6px",
                            }}
                          />
                        }
                        label={
                          <Typography fontSize="0.8125rem">
                            <HighlightedText 
                              text={state} 
                              highlight={searchTerms.state} 
                            />
                          </Typography>
                        }
                        sx={{ mb: 0, mr: 0 }}
                      />

                      {/* Inline district panel when this state is selected */}
                      {filters.state === state && (
                        <Box sx={{ ml: 3, mt: 0.5, pl: 1 }}>
                          {/* Search box for districts */}
                          <DropdownSearchBox
                            inputRef={districtSearchRef}
                            value={searchTerms.district}
                            onChange={(v) => updateSearch("district", v)}
                            onClear={() => updateSearch("district", "")}
                            placeholder="Search district..."
                          />

                          {loadingDistricts ? (
                            <Box sx={{ p: 1 }}>
                              <CircularProgress size={16} sx={{ color: "#ff9800" }} />
                            </Box>
                          ) : (
                            <>
                              <RadioGroup
                                value={filters.district || ""}
                                onChange={(e) => {
                                  onFilterChange("district", e.target.value);
                                  onFilterChange("city", "");
                                  if (!e.target.value) dispatch(resetCities());
                                }}
                              >
                                {filteredDistricts.length === 0 && (
                                  <Typography fontSize="0.75rem" color="text.secondary" sx={{ py: 1, pl: 1 }}>
                                    No districts found
                                  </Typography>
                                )}

                                {filteredDistricts.map((district) => (
                                  <FormControlLabel
                                    key={`district-${district}`}
                                    value={district}
                                    control={
                                      <Radio
                                        size="small"
                                        sx={{
                                          color: "#ff9800",
                                          "&.Mui-checked": { color: "#4caf50" },
                                          padding: "6px",
                                        }}
                                      />
                                    }
                                    label={
                                      <Typography fontSize="0.8125rem">
                                        <HighlightedText 
                                          text={district} 
                                          highlight={searchTerms.district} 
                                        />
                                      </Typography>
                                    }
                                    sx={{ mb: 0.5, mr: 0 }}
                                  />
                                ))}
                              </RadioGroup>

                              {/* Cities when district is selected */}
                              {filters.district && (
                                <Box sx={{ ml: 2, mt: 1, pl: 1 }}>
                                  {loadingCities ? (
                                    <Box sx={{ p: 1 }}>
                                      <CircularProgress size={16} sx={{ color: "#ff9800" }} />
                                    </Box>
                                  ) : filteredCities.length > 0 ? (
                                    <RadioGroup
                                      value={filters.city || ""}
                                      onChange={(e) => onFilterChange("city", e.target.value)}
                                    >
                                      {filteredCities.map((city) => (
                                        <FormControlLabel
                                          key={`city-${city}`}
                                          value={city}
                                          control={
                                            <Radio
                                              size="small"
                                              sx={{
                                                color: "#ff9800",
                                                "&.Mui-checked": { color: "#4caf50" },
                                                padding: "6px",
                                              }}
                                            />
                                          }
                                          label={
                                            <Typography fontSize="0.8125rem">
                                              <HighlightedText 
                                                text={city} 
                                                highlight={searchTerms.city} 
                                              />
                                            </Typography>
                                          }
                                          sx={{ mb: 0.5, mr: 0 }}
                                        />
                                      ))}
                                    </RadioGroup>
                                  ) : (
                                    <Typography fontSize="0.75rem" color="text.secondary" sx={{ py: 1, pl: 1 }}>
                                      No cities available
                                    </Typography>
                                  )}
                                </Box>
                              )}
                            </>
                          )}
                        </Box>
                      )}
                    </Box>
                  ))}
                </RadioGroup>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: 2 }} />
      </Box>
    );
  },
);

export default FillterPannel;