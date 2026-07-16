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
  fetchFilterOptions,
  resetChildCategories,
  resetDistricts,
  resetCities,
  resetFranchiseTypes,
} from "@/Redux/Slices/filterDropdownData";

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

let persistedExpandedSections = {
  mainCategory: false,
  subCategory: false,
  modelType: false,
  businessModel: false,
  areaRequired: false,
  location: false,
  investment: false,
};

// ─── Highlighted Text ─────────────────────────────────────────────────────────
const HighlightedText = ({ text, highlight }) => {
  if (!highlight?.trim() || !text) return <>{text}</>;
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span
            key={i}
            style={{
              color: "#ff9800",
              fontWeight: 600,
              fontSize: "inherit",
              lineHeight: "inherit",
            }}
          >
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
};

// ─── Franchise Heading label style ────────────────────────────────────────────
const HeadingLabel = ({
  children,
  color = "text.secondary",
  bg = "#f5f5f5",
}) => (
  <Box
    sx={{
      px: 1,
      py: 0.5,
      fontSize: "0.65rem",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      color,
      backgroundColor: bg,
      borderRadius: "6px",
      mt: 1.5,
      mb: 0.5,
      pointerEvents: "none",
      width: "95%",
    }}
  >
    {children}
  </Box>
);

const AllOption = ({ label }) => (
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
    label={
      <Typography fontSize="0.8125rem" fontWeight={600}>
        {label}
      </Typography>
    }
    sx={{ mb: 0.5, mr: 0 }}
  />
);

const StablePanel = ({ children }) => (
  <Box
    onClick={(e) => e.stopPropagation()}
    onMouseDown={(e) => e.stopPropagation()}
  >
    {children}
  </Box>
);

// ─── Component ────────────────────────────────────────────────────────────────
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
      franchiseModels, // ["FRANCHISE BUSINESS", "DEALERS & DISTRIBUTORS", "CHANNEL PARTNERS"]
      franchiseHeading, // { "CLOUD KITCHEN": [...], "COCO": [...] } — from ?franchiseModel= call
      franchiseTypeData, // flat array — from ?franchiseModel= call
      activeFranchiseModel, // currently fetched model name
      investmentRanges,
      areaRequired,
      states,
      districts,
      cities,
      loading,
      loadingChildCategories,
      loadingDistricts,
      loadingCities,
      loadingFranchiseTypes,
    } = useSelector((state) => state.filterDropdown);

    // ── Refs ───────────────────────────────────────────────────────────────────
    const mainCategoryRef = useRef(null);
    const subCategoryRef = useRef(null);
    const modelTypeRef = useRef(null);
    const businessModelRef = useRef(null);
    const locationRef = useRef(null);
    const investmentRef = useRef(null);
    const areaRequiredRef = useRef(null);
    const industrySearchRef = useRef(null);
    const subCategorySearchRef = useRef(null);
    const stateSearchRef = useRef(null);
    const districtSearchRef = useRef(null);
    const modelTypeSearchRef = useRef(null);

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

    // Initialize from the module-level store instead of hardcoded defaults,
    // so a remount picks up whichever panel was last open.
    const [expandedSections, setExpandedSections] = useState(
      () => persistedExpandedSections,
    );

    // Keep the module-level store in sync any time local state changes.
    useEffect(() => {
      persistedExpandedSections = expandedSections;
    }, [expandedSections]);

    // ── Read URL params on mount ───────────────────────────────────────────────
    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const maincat = params.get("maincat");
      const subcat = params.get("subcat");
      const state = params.get("state");
      const investmentRange = params.get("investmentRange");
      const areaReq = params.get("areaRequired");
      const fModel = params.get("franchiseModel");
      const fType = params.get("franchiseType");

      if (maincat) onFilterChange("maincat", maincat);
      if (subcat) onFilterChange("subcat", subcat);
      if (state) onFilterChange("state", state);
      if (investmentRange) onFilterChange("investmentRange", investmentRange);
      if (areaReq) onFilterChange("areaRequired", areaReq);
      if (fModel) onFilterChange("modelType", fModel);
      if (fType) onFilterChange("franchiseType", fType);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (filters.modelType) {
        if (activeFranchiseModel !== filters.modelType) {
          dispatch(fetchFilterOptions({ franchiseModel: filters.modelType }));
        }
      } else {
        dispatch(resetFranchiseTypes());
      }
    }, [filters.modelType, activeFranchiseModel, dispatch]);

    // ── Helpers ────────────────────────────────────────────────────────────────
    // Only ever called from an AccordionSummary click (see JSX below), so this
    // is the ONLY place that can open/close a panel. Nothing inside
    // AccordionDetails calls this anymore.
    const toggleSection = (section) => {
      setExpandedSections((prev) => {
        const next = { ...prev };
        if (!prev[section]) {
          Object.keys(next).forEach((k) => {
            if (k !== section) next[k] = false;
          });
        }
        next[section] = !prev[section];
        return next;
      });

      if (!expandedSections[section]) {
        setTimeout(() => {
          if (section === "mainCategory") industrySearchRef.current?.focus();
          if (section === "location") stateSearchRef.current?.focus();
          if (section === "modelType") modelTypeSearchRef.current?.focus();
          if (section === "businessModel") modelTypeSearchRef.current?.focus();
        }, 200);
      }
    };

    const updateSearch = (key, value) =>
      setSearchTerms((prev) => ({ ...prev, [key]: value }));

    const norm = (v) => (typeof v === "string" ? v.trim() : v);

    const dedupe = (list) => {
      const seen = new Set();
      const out = [];
      for (const raw of list || []) {
        const val = norm(raw);
        if (!val) continue;
        const key = val.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(val);
      }
      return out;
    };

    // ── Filtered lists ─────────────────────────────────────────────────────────

    const filteredMainCategories = useMemo(() => {
      const term = (searchTerms.mainCategory || "").toLowerCase();
      const result = [];
      for (const group of mainCategories) {
        if (!group?.heading || !Array.isArray(group.industries)) continue;
        const matched = dedupe(group.industries)
          .filter((ind) => ind.toLowerCase().includes(term))
          .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        if (matched.length > 0)
          result.push({ heading: group.heading, industries: matched });
      }
      return result;
    }, [mainCategories, searchTerms.mainCategory]);

    const filteredSubCategories = useMemo(() => {
      const term = (searchTerms.subCategory || "").toLowerCase();
      return dedupe(subCategories)
        .filter((sub) => sub.toLowerCase().includes(term))
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        .slice(0, 100);
    }, [subCategories, searchTerms.subCategory]);

    const filteredInvestmentRanges = useMemo(() => {
      const term = (searchTerms.investmentRange || "").toLowerCase();
      return dedupe(investmentRanges)
        .filter((r) => r.toLowerCase().includes(term))
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
      return dedupe(areaRequired)
        .filter((area) => area.toLowerCase().includes(term))
        .slice(0, 50);
    }, [areaRequired, searchTerms.areaRequired]);

    const filteredStates = useMemo(() => {
      const term = (searchTerms.state || "").toLowerCase();
      return dedupe(states)
        .filter((s) => s.toLowerCase().includes(term))
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        .slice(0, 100);
    }, [states, searchTerms.state]);

    const filteredDistricts = useMemo(() => {
      if (!filters.state) return [];
      const term = (searchTerms.district || "").toLowerCase();
      return dedupe(districts)
        .filter((d) => d.toLowerCase().includes(term))
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        .slice(0, 100);
    }, [filters.state, districts, searchTerms.district]);

    const filteredCities = useMemo(() => {
      if (!filters.district) return [];
      const term = (searchTerms.city || "").toLowerCase();
      return dedupe(cities)
        .filter((c) => c.toLowerCase().includes(term))
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        .slice(0, 100);
    }, [filters.district, cities, searchTerms.city]);

    // Filter franchiseHeading entries by search term (types de-duped per
    // heading for the same reason as everywhere else above).
    const filteredFranchiseHeading = useMemo(() => {
      const term = (searchTerms.modelType || "").toLowerCase();
      const source = franchiseHeading || {};
      const result = {};
      for (const [heading, types] of Object.entries(source)) {
        const cleanTypes = dedupe(types);
        if (!term) {
          if (cleanTypes.length > 0) result[heading] = cleanTypes;
          continue;
        }
        const matchedTypes = cleanTypes.filter((t) =>
          t.toLowerCase().includes(term),
        );
        const headingMatches = heading.toLowerCase().includes(term);
        if (headingMatches) {
          result[heading] = cleanTypes;
        } else if (matchedTypes.length > 0) {
          result[heading] = matchedTypes;
        }
      }
      return result;
    }, [franchiseHeading, searchTerms.modelType]);

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
      <Box
        sx={{
          pr: 2,
          height: "calc(100vh - 120px)",
          width: "100%",
          overflowY: "auto",
        }}
      >
        {/* Result banner */}
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

        {/* Header */}
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

        {/* ── Industries ──────────────────────────────────────────────────────── */}
        <Accordion
          ref={mainCategoryRef}
          expanded={expandedSections.mainCategory}
          disableGutters
          elevation={0}
          sx={{ mb: 2, borderRadius: "5px", "&:before": { display: "none" } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#4caf50" }} />}
            onClick={() => toggleSection("mainCategory")}
            sx={{ px: 1, "&.Mui-expanded": { minHeight: "48px" } }}
          >
            <Typography
              sx={{
                color: "#4caf50",
                fontWeight: "bold",
                fontSize: "0.875rem",
              }}
            >
              Industries
              {filters.maincat && (
                <Box
                  component="span"
                  sx={{
                    ml: 1,
                    fontSize: "0.7rem",
                    color: "#ff9800",
                    fontWeight: 400,
                  }}
                >
                  ({filters.maincat})
                </Box>
              )}
            </Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ p: 0 }}>
            <StablePanel>
              <Box sx={{ px: 1, maxHeight: 320, overflowY: "auto" }}>
                <RadioGroup
                  value={filters.maincat || ""}
                  onChange={(e) => {
                    const val = norm(e.target.value);
                    onFilterChange("maincat", val);
                    onFilterChange("subcat", "");
                    onFilterChange("childcat", "");
                    updateSearch("subCategory", "");
                    if (!val) dispatch(resetChildCategories());
                  }}
                >
                  <AllOption label="All Industries" />

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
                      <HeadingLabel>{group.heading}</HeadingLabel>

                      {group.industries.map((industry) => (
                        <Box key={`cat-container-${group.heading}-${industry}`}>
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

                          {filters.maincat === industry && (
                            <Box ref={subCategoryRef} sx={{ ml: 2, pl: 1 }}>
                              <RadioGroup
                                value={filters.subcat || ""}
                                onChange={(e) => {
                                  const val = norm(e.target.value);
                                  onFilterChange("subcat", val);
                                  onFilterChange("childcat", "");
                                  if (!val) dispatch(resetChildCategories());
                                }}
                              >
                                <AllOption label="All Categories" />

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
                                  <Box
                                    key={`subcat-container-${subCategory}`}
                                    sx={{ mt: 1 }}
                                  >
                                    <FormControlLabel
                                      value={subCategory}
                                      control={
                                        <Radio
                                          size="small"
                                          sx={{
                                            color: "#ff9800",
                                            "&.Mui-checked": {
                                              color: "#4caf50",
                                            },
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
            </StablePanel>
          </AccordionDetails>
        </Accordion>

        {/* ── Business Opportunities (top-level model select) ────────────────── */}
        <Accordion
          ref={modelTypeRef}
          expanded={expandedSections.modelType}
          disableGutters
          elevation={0}
          sx={{ mb: 2, "&:before": { display: "none" } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#4caf50" }} />}
            onClick={() => toggleSection("modelType")}
            sx={{ px: 1, "&.Mui-expanded": { minHeight: "48px" } }}
          >
            <Typography
              sx={{
                color: "#4caf50",
                fontWeight: "bold",
                fontSize: "0.875rem",
              }}
            >
              Business Opportunites{" "}
              {filters.modelType && (
                <Box
                  component="span"
                  sx={{
                    ml: 1,
                    fontSize: "0.7rem",
                    color: "#ff9800",
                    fontWeight: 400,
                  }}
                >
                  ({filters.modelType})
                </Box>
              )}
            </Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ p: 0 }}>
            <StablePanel>
              <Box
                sx={{
                  px: 1.5,
                  pt: 1,
                  pb: 1,
                }}
              >
                <RadioGroup
                  value={filters.modelType || ""}
                  onChange={(e) => {
                    const val = norm(e.target.value);
                    onFilterChange("modelType", val);
                    onFilterChange("franchiseType", null);
                    updateSearch("modelType", "");
                    if (!val) dispatch(resetFranchiseTypes());
                  }}
                >
                  <AllOption label="All Business Opportunities" />

                  {dedupe(franchiseModels).map((model) => (
                    <FormControlLabel
                      key={`model-${model}`}
                      value={model}
                      control={<Radio size="small" sx={{ color: "#ff9800" }} />}
                      label={
                        <Typography fontSize="0.75rem">{model}</Typography>
                      }
                    />
                  ))}
                </RadioGroup>
              </Box>
            </StablePanel>
          </AccordionDetails>
        </Accordion>

        {/* ── Select Business Model (sub-type select, own accordion) ─────────── */}
        <Accordion
          ref={businessModelRef}
          expanded={expandedSections.businessModel}
          disableGutters
          elevation={0}
          sx={{ mb: 2, "&:before": { display: "none" } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#4caf50" }} />}
            onClick={() => toggleSection("businessModel")}
            sx={{ px: 1, "&.Mui-expanded": { minHeight: "48px" } }}
          >
            <Typography
              sx={{
                color: "#4caf50",
                fontWeight: "bold",
                fontSize: "0.875rem",
              }}
            >
              Business Model
              {filters.franchiseType && (
                <Box
                  component="span"
                  sx={{
                    ml: 1,
                    fontSize: "0.7rem",
                    color: "#ff9800",
                    fontWeight: 400,
                  }}
                >
                  ({filters.franchiseType})
                </Box>
              )}
            </Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ p: 0 }}>
            <StablePanel>
              {!filters.modelType ? (
                <Typography
                  fontSize="0.75rem"
                  color="text.secondary"
                  textAlign="center"
                  sx={{ py: 3, px: 2 }}
                >
                  Please select a Business Opportunity first
                </Typography>
              ) : loadingFranchiseTypes ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                  <CircularProgress size={24} sx={{ color: "#ff9800" }} />
                </Box>
              ) : (
                <>
                  {/* <DropdownSearchBox
                    inputRef={modelTypeSearchRef}
                    value={searchTerms.modelType}
                    onChange={(v) => updateSearch("modelType", v)}
                    onClear={() => updateSearch("modelType", "")}
                    placeholder={`Search in ${filters.modelType}...`}
                  /> */}

                  <Box sx={{ px: 1, maxHeight: 340, overflowY: "auto" }}>
                    <RadioGroup
                      value={filters.franchiseType || ""}
                      onChange={(e) => {
                        const val = norm(e.target.value);
                        onFilterChange("franchiseType", val);
                      }}
                    >
                      <AllOption label="All Business Model" />

                      {Object.keys(filteredFranchiseHeading).length === 0 && (
                        <Typography
                          fontSize="0.75rem"
                          color="text.secondary"
                          textAlign="center"
                          sx={{ py: 2 }}
                        >
                          No business models found
                        </Typography>
                      )}

                      {Object.entries(filteredFranchiseHeading).map(
                        ([heading, types]) => (
                          <React.Fragment key={heading}>
                            <Box
                              sx={{
                                px: 1,
                                py: 0.5,
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                color: "#ff9800",
                                backgroundColor: "#fff8f0",
                                borderRadius: "4px",
                                mt: 1.5,
                                mb: 0.5,
                              }}
                            >
                              {heading}
                            </Box>
                            {types.map((type) => (
                              <FormControlLabel
                                key={`${heading}-${type}`}
                                value={type}
                                control={
                                  <Radio
                                    size="small"
                                    sx={{ color: "#ff9800" }}
                                  />
                                }
                                label={
                                  <Typography fontSize="0.8125rem">
                                    {type}
                                  </Typography>
                                }
                                sx={{ mb: 0.5, ml: 0.5 }}
                              />
                            ))}
                          </React.Fragment>
                        ),
                      )}
                    </RadioGroup>
                  </Box>
                </>
              )}
            </StablePanel>
          </AccordionDetails>
        </Accordion>

        {/* ── Investment Range ─────────────────────────────────────────────────── */}
        <Accordion
          ref={investmentRef}
          expanded={expandedSections.investment}
          disableGutters
          elevation={0}
          sx={{ mb: 2, "&:before": { display: "none" } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#4caf50" }} />}
            onClick={() => toggleSection("investment")}
            sx={{ px: 1, "&.Mui-expanded": { minHeight: "48px" } }}
          >
            <Typography
              sx={{
                color: "#4caf50",
                fontWeight: "bold",
                fontSize: "0.875rem",
              }}
            >
              Investment Range
              {filters.investmentRange && (
                <Box
                  component="span"
                  sx={{
                    ml: 1,
                    fontSize: "0.7rem",
                    color: "#ff9800",
                    fontWeight: 400,
                  }}
                >
                  ({filters.investmentRange})
                </Box>
              )}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <StablePanel>
              <Box sx={{ px: 1 }}>
                <RadioGroup
                  value={filters.investmentRange || ""}
                  onChange={(e) =>
                    onFilterChange("investmentRange", norm(e.target.value))
                  }
                >
                  <AllOption label="All Investment Ranges" />

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
            </StablePanel>
          </AccordionDetails>
        </Accordion>

        {/* ── Area Required ────────────────────────────────────────────────────── */}
        <Accordion
          ref={areaRequiredRef}
          expanded={expandedSections.areaRequired}
          disableGutters
          elevation={0}
          sx={{ mb: 2, "&:before": { display: "none" } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#4caf50" }} />}
            onClick={() => toggleSection("areaRequired")}
            sx={{ px: 1, "&.Mui-expanded": { minHeight: "48px" } }}
          >
            <Typography
              sx={{
                color: "#4caf50",
                fontWeight: "bold",
                fontSize: "0.875rem",
              }}
            >
              Area Required
              {filters.areaRequired && (
                <Box
                  component="span"
                  sx={{
                    ml: 1,
                    fontSize: "0.7rem",
                    color: "#ff9800",
                    fontWeight: 400,
                  }}
                >
                  ({filters.areaRequired})
                </Box>
              )}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <StablePanel>
              <Box sx={{ px: 1 }}>
                <RadioGroup
                  value={filters.areaRequired || ""}
                  onChange={(e) =>
                    onFilterChange("areaRequired", norm(e.target.value))
                  }
                >
                  <AllOption label="All Areas" />
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
                  <Typography
                    fontSize="0.75rem"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ py: 1 }}
                  >
                    No results found
                  </Typography>
                )}
              </Box>
            </StablePanel>
          </AccordionDetails>
        </Accordion>

        {/* ── Location ─────────────────────────────────────────────────────────── */}
        <Accordion
          ref={locationRef}
          expanded={expandedSections.location}
          disableGutters
          elevation={0}
          sx={{ mb: 2, "&:before": { display: "none" } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#4caf50" }} />}
            onClick={() => toggleSection("location")}
            sx={{ px: 1, "&.Mui-expanded": { minHeight: "48px" } }}
          >
            <Typography
              sx={{
                color: "#4caf50",
                fontWeight: "bold",
                fontSize: "0.875rem",
              }}
            >
              Location Filters
              {filters.state && (
                <Box
                  component="span"
                  sx={{
                    ml: 1,
                    fontSize: "0.7rem",
                    color: "#ff9800",
                    fontWeight: 400,
                  }}
                >
                  ({filters.state}
                  {filters.district ? ` › ${filters.district}` : ""}
                  {filters.city ? ` › ${filters.city}` : ""})
                </Box>
              )}
            </Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ p: 0 }}>
            <StablePanel>
              {/* <DropdownSearchBox
              inputRef={stateSearchRef}
              value={searchTerms.state}
              onChange={(v) => updateSearch("state", v)}
              onClear={() => updateSearch("state", "")}
              placeholder="Search state..."
            /> */}

              <Box sx={{ px: 1, maxHeight: 360, overflowY: "auto" }}>
                {loading ? (
                  <Box sx={{ p: 2 }}>
                    <CircularProgress size={20} sx={{ color: "#ff9800" }} />
                  </Box>
                ) : (
                  <RadioGroup
                    value={filters.state || ""}
                    onChange={(e) => {
                      const val = norm(e.target.value);
                      onFilterChange("state", val);
                      onFilterChange("district", "");
                      onFilterChange("city", "");
                      updateSearch("district", "");
                      if (!val) dispatch(resetDistricts());
                    }}
                  >
                    <AllOption label="All States" />

                    {filteredStates.length === 0 && (
                      <Typography
                        fontSize="0.75rem"
                        color="text.secondary"
                        textAlign="center"
                        sx={{ py: 2 }}
                      >
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

                        {filters.state === state && (
                          <Box sx={{ ml: 3, mt: 0.5, pl: 1 }}>
                            {/* <DropdownSearchBox
                            inputRef={districtSearchRef}
                            value={searchTerms.district}
                            onChange={(v) => updateSearch("district", v)}
                            onClear={() => updateSearch("district", "")}
                            placeholder="Search district..."
                          /> */}

                            {loadingDistricts ? (
                              <Box sx={{ p: 1 }}>
                                <CircularProgress
                                  size={16}
                                  sx={{ color: "#ff9800" }}
                                />
                              </Box>
                            ) : (
                              <>
                                <RadioGroup
                                  value={filters.district || ""}
                                  onChange={(e) => {
                                    const val = norm(e.target.value);
                                    onFilterChange("district", val);
                                    onFilterChange("city", "");
                                    if (!val) dispatch(resetCities());
                                  }}
                                >
                                  <AllOption label="All Districts" />

                                  {filteredDistricts.length === 0 && (
                                    <Typography
                                      fontSize="0.75rem"
                                      color="text.secondary"
                                      sx={{ py: 1, pl: 1 }}
                                    >
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
                                            "&.Mui-checked": {
                                              color: "#4caf50",
                                            },
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

                                {filters.district && (
                                  <Box sx={{ ml: 2, mt: 1, pl: 1 }}>
                                    {loadingCities ? (
                                      <Box sx={{ p: 1 }}>
                                        <CircularProgress
                                          size={16}
                                          sx={{ color: "#ff9800" }}
                                        />
                                      </Box>
                                    ) : filteredCities.length > 0 ? (
                                      <RadioGroup
                                        value={filters.city || ""}
                                        onChange={(e) =>
                                          onFilterChange(
                                            "city",
                                            norm(e.target.value),
                                          )
                                        }
                                      >
                                        <AllOption label="All Cities" />
                                        {filteredCities.map((city) => (
                                          <FormControlLabel
                                            key={`city-${city}`}
                                            value={city}
                                            control={
                                              <Radio
                                                size="small"
                                                sx={{
                                                  color: "#ff9800",
                                                  "&.Mui-checked": {
                                                    color: "#4caf50",
                                                  },
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
                                      <Typography
                                        fontSize="0.75rem"
                                        color="text.secondary"
                                        sx={{ py: 1, pl: 1 }}
                                      >
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
            </StablePanel>
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: 2 }} />
      </Box>
    );
  },
);

export default FillterPannel;
