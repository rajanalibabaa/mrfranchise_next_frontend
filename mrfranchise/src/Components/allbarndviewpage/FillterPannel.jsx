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
import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  fetchFilterOptions,
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

const FilterPanel = React.memo(
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

    // Fetch initial filter data
    useEffect(() => {
      dispatch(fetchFilterOptions());
    }, [dispatch]);

    // Fetch subcategories and child categories when main category changes
    useEffect(() => {
      if (filters.maincat) {
        dispatch(fetchFilterOptions({ main: filters.maincat }));
        dispatch(resetChildCategories()); // Reset child categories when main category changes
      } else {
        dispatch(fetchFilterOptions()); // Fetch all filters if main category is cleared
      }
    }, [dispatch, filters.maincat]);

    // Fetch child categories (productTags) when subcategory changes
    useEffect(() => {
      if (filters.subcat && filters.maincat) {
        dispatch(fetchFilterOptions({ 
          sub: filters.subcat,
          main: filters.maincat 
        }));
      }
    }, [dispatch, filters.subcat, filters.maincat]);

    // Fetch districts when state changes
    useEffect(() => {
      if (filters.state) {
        dispatch(fetchFilterOptions({ state: filters.state }));
        dispatch(resetCities()); // Reset cities when state changes
      } else {
        dispatch(resetDistricts()); // Reset districts when state is cleared
      }
    }, [dispatch, filters.state]);

    // Fetch cities when district changes
    useEffect(() => {
      if (filters.district && filters.state) {
        dispatch(fetchFilterOptions({ 
          district: filters.district,
          state: filters.state 
        }));
      }
    }, [dispatch, filters.district, filters.state]);

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
        // If opening this section, close others
        if (!prev[section]) {
          Object.keys(newState).forEach((key) => {
            if (key !== section) newState[key] = false;
          });
        }
        newState[section] = !prev[section];
        return newState;
      });
    };

    // Filter and sort options based on search terms (alphabetical order)
    const filteredMainCategories = useMemo(() => {
      const term = (searchTerms.mainCategory || "").toLowerCase();
      return mainCategories
        .filter((main) => {
          if (!main) return false;
          return main.toLowerCase().includes(term);
        })
        .sort((a, b) =>
          (a || "").toLowerCase().localeCompare((b || "").toLowerCase()),
        )
        .slice(0, 100);
    }, [mainCategories, searchTerms.mainCategory]);

    const filteredSubCategories = useMemo(() => {
      const term = (searchTerms.subCategory || "").toLowerCase();
      return subCategories
        .filter((sub) => {
          if (!sub) return false;
          return sub.toLowerCase().includes(term);
        })
        .sort((a, b) =>
          (a || "").toLowerCase().localeCompare((b || "").toLowerCase()),
        )
        .slice(0, 100);
    }, [subCategories, searchTerms.subCategory]);

    const filteredModelTypes = useMemo(() => {
      const term = (searchTerms.modelType || "").toLowerCase().trim();
      return franchiseModels
        .filter((type) => {
          if (!type) return false;
          return type.toLowerCase().includes(term);
        })
        .sort((a, b) =>
          (a || "").toLowerCase().localeCompare((b || "").toLowerCase()),
        );
    }, [franchiseModels, searchTerms.modelType]);

    // FIXED: Maintain the original order for investment ranges
    const filteredInvestmentRanges = useMemo(() => {
      const term = (searchTerms.investmentRange || "").toLowerCase();

      // First filter by search term
      const filtered = investmentRanges.filter((range) => {
        if (!range) return false;
        return range.toLowerCase().includes(term);
      });

      // Sort by predefined order, not alphabetically
      return filtered.sort((a, b) => {
        const indexA = INVESTMENT_RANGE_ORDER.indexOf(a);
        const indexB = INVESTMENT_RANGE_ORDER.indexOf(b);

        // If both are in the predefined order, sort by that order
        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB;
        }

        // If only one is in predefined order, put it first
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;

        // If neither is in predefined order, sort alphabetically
        return a.toLowerCase().localeCompare(b.toLowerCase());
      });
    }, [investmentRanges, searchTerms.investmentRange]);

    const filteredAreaRequired = useMemo(() => {
      const term = (searchTerms.areaRequired || "").toLowerCase();
      return areaRequired
        .filter((area) => {
          if (!area) return false;
          return area.toLowerCase().includes(term);
        })
        .slice(0, 50);
    }, [areaRequired, searchTerms.areaRequired]);

    const filteredStates = useMemo(() => {
      const term = (searchTerms.state || "").toLowerCase();
      return states
        .filter((stateItem) => {
          if (!stateItem) return false;
          return stateItem.toLowerCase().includes(term);
        })
        .sort((a, b) =>
          (a || "").toLowerCase().localeCompare((b || "").toLowerCase()),
        )
        .slice(0, 100);
    }, [states, searchTerms.state]);

    const filteredDistricts = useMemo(() => {
      if (!filters.state) return [];
      const term = (searchTerms.district || "").toLowerCase();
      return districts
        .filter((d) => {
          if (!d) return false;
          return d.toLowerCase().includes(term);
        })
        .sort((a, b) =>
          (a || "").toLowerCase().localeCompare((b || "").toLowerCase()),
        )
        .slice(0, 100);
    }, [filters.state, districts, searchTerms.district]);

    const filteredCities = useMemo(() => {
      if (!filters.district) return [];
      const term = (searchTerms.city || "").toLowerCase();
      return cities
        .filter((city) => {
          if (!city) return false;
          return city.toLowerCase().includes(term);
        })
        .sort((a, b) =>
          (a || "").toLowerCase().localeCompare((b || "").toLowerCase()),
        )
        .slice(0, 100);
    }, [filters.district, cities, searchTerms.city]);

    return (
      <Box sx={{ pr: 2, height: "calc(100vh - 120px)", width: "100%", overflowY: "auto" }}>
        <Typography
          variant="body2"
          sx={{
            color: "#000000ff",
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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          mt={3}
          sx={{ background: "white", p: 1, borderRadius: "5px" }}
        >
          <Typography variant="h6" sx={{ color: "#000000ff" }}>
            Filters
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={onClearFilters}
            disabled={activeFilterCount === 0}
            startIcon={<ClearIcon />}
            sx={{ color: "#ff0000ff", borderColor: "#ff0000ff" }}
          >
            Clear
          </Button>
        </Box>

        {/* Main Category Filter */}
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
            sx={{
              px: 1,
              "&.Mui-expanded": { minHeight: "48px" },
            }}
          >
            <Typography
              sx={{
                color: "#4caf50",
                fontWeight: "bold",
                fontSize: "0.875rem",
              }}
            >
              Industries
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <Box sx={{ px: 1 }}>
              <RadioGroup
                value={filters.maincat || ""}
                onChange={(e) => {
                  onFilterChange("maincat", e.target.value);
                  onFilterChange("subcat", ""); // Reset subcategory when main category changes
                  onFilterChange("childcat", ""); // Reset child category
                  if (!e.target.value) {
                    dispatch(resetChildCategories());
                    dispatch(fetchFilterOptions());
                  }
                }}
              >
                {filteredMainCategories.map((category) => (
                  <Box key={`cat-container-${category}`} sx={{ mb: 0 }}>
                    <FormControlLabel
                      key={`cat-${category}`}
                      value={category}
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
                          {category} Franchise
                        </Typography>
                      }
                      sx={{ mb: 0, mr: 0 }}
                    />

                    {/* Show subcategories when this main category is selected */}
                    {filters.maincat === category && (
                      <Box
                        ref={subCategoryRef}
                        sx={{
                          ml: 2,
                          pl: 1,
                        }}
                      >
                        <RadioGroup
                          value={filters.subcat || ""}
                          onChange={(e) => {
                            onFilterChange("subcat", e.target.value);
                            onFilterChange("childcat", ""); // Reset child category when subcategory changes
                            if (!e.target.value) {
                              dispatch(resetChildCategories());
                            }
                          }}
                        >
                          {filteredSubCategories.map((subCategory) => (
                            <Box
                              key={`subcat-container-${subCategory}`}
                              sx={{
                                mt: 1,
                              }}
                            >
                              <FormControlLabel
                                key={`subcat-${subCategory}`}
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
                                    {subCategory} Franchise 
                                  </Typography>
                                }
                                sx={{ mb: 0, mr: 0 }}
                              />

                              {/* Product Tags (Child categories) when this specific subcategory is selected */}
                              {filters.subcat === subCategory && (
                                <Box
                                  sx={{
                                    ml: 2,
                                    mt: 1,
                                    pl: 1,
                                  }}
                                >
                                  {loadingChildCategories ? (
                                    <Box sx={{ p: 1 }}>
                                      <CircularProgress
                                        size={16}
                                        sx={{ color: "#ff9800" }}
                                      />
                                    </Box>
                                  ) : childCategories && childCategories.length > 0 ? (
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
                                                "&.Mui-checked": {
                                                  color: "#4caf50",
                                                },
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
              </RadioGroup>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Model Type Filter */}
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
            sx={{
              px: 1,
              "&.Mui-expanded": { minHeight: "48px" },
            }}
          >
            <Typography
              sx={{
                color: "#4caf50",
                fontWeight: "bold",
                fontSize: "0.875rem",
              }}
            >
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
                    label={<Typography fontSize="0.8125rem">{type}</Typography>}
                    sx={{ mb: 0, mr: 0 }}
                  />
                ))}
              </RadioGroup>
            </Box>
          </AccordionDetails>
        </Accordion> 

        {/* Investment Range Filter */}
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
            sx={{
              px: 1,
              "&.Mui-expanded": { minHeight: "48px" },
            }}
          >
            <Typography
              sx={{
                color: "#4caf50",
                fontWeight: "bold",
                fontSize: "0.875rem",
              }}
            >
              Investment Range
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <Box sx={{ px: 1 }}>
              <RadioGroup
                value={filters.investmentRange || ""}
                onChange={(e) =>
                  onFilterChange("investmentRange", e.target.value)
                }
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
                      <Typography fontSize="0.8125rem">{range}</Typography>
                    }
                    sx={{ mb: 0, mr: 0 }}
                  />
                ))}
              </RadioGroup>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Area Required Filter */}
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
            sx={{
              px: 1,
              "&.Mui-expanded": { minHeight: "48px" },
            }}
          >
            <Typography
              sx={{
                color: "#4caf50",
                fontWeight: "bold",
                fontSize: "0.875rem",
              }}
            >
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
                  label={
                    <Typography fontSize="0.8125rem">All Areas</Typography>
                  }
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
                    label={<Typography fontSize="0.8125rem">{area}</Typography>}
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
          </AccordionDetails>
        </Accordion> 

        {/* Location Filters */}
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
            sx={{
              px: 1,
              "&.Mui-expanded": { minHeight: "48px" },
            }}
          >
            <Typography
              sx={{
                color: "#4caf50",
                fontWeight: "bold",
                fontSize: "0.875rem",
              }}
            >
              Location Filters
            </Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ p: 0 }}>
            <Box sx={{ px: 1 }}>
              {loading ? (
                <Box sx={{ p: 2 }}>
                  <CircularProgress size={20} sx={{ color: "#ff9800" }} />
                </Box>
              ) : (
                <RadioGroup
                  value={filters.state || ""}
                  onChange={(e) => {
                    onFilterChange("state", e.target.value);
                    onFilterChange("district", ""); // Reset district
                    onFilterChange("city", ""); // Reset city
                    if (!e.target.value) {
                      dispatch(resetDistricts());
                    }
                  }}
                >
                  {filteredStates.map((state) => (
                    <Box key={`state-box-${state}`} sx={{ mb: 0.5 }}>
                      <FormControlLabel
                        key={`state-${state}`}
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
                          <Typography fontSize="0.8125rem">{state}</Typography>
                        }
                        sx={{ mb: 0, mr: 0 }}
                      />

                      {filters.state === state && (
                        <Box
                          sx={{
                            ml: 3,
                            mt: 0.5,
                            pl: 1,
                          }}
                        >
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
                                  onFilterChange("district", e.target.value);
                                  onFilterChange("city", ""); // Reset city
                                  if (!e.target.value) {
                                    dispatch(resetCities());
                                  }
                                }}
                              >
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
                                        {district}
                                      </Typography>
                                    }
                                    sx={{ mb: 0.5, mr: 0 }}
                                  />
                                ))}
                              </RadioGroup>

                              {/* Show cities when district is selected */}
                              {filters.district && (
                                <Box
                                  sx={{
                                    ml: 2,
                                    mt: 1,
                                    pl: 1,
                                  }}
                                >
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
                                        onFilterChange("city", e.target.value)
                                      }
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
                                              {city}
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
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: 2 }} />
      </Box>
    );
  },
);

export default FilterPanel; 