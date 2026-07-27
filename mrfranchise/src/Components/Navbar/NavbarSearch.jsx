"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Autocomplete from "@mui/material/Autocomplete";
import CloseIcon from "@mui/icons-material/Close";
import { fetchFilterOptions } from "@/Redux/Slices/filterDropdownData";
import { resetFilters } from "@/Redux/Slices/FilterBrandSlice";
import Search from "./Search";
import { useRouter } from "next/navigation";
const NavbarSearch = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [tab, setTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // Get filter options from Redux store
  const filterState = useSelector((state) => state.filterDropdown);
  
  // Destructure with default empty arrays
  const {
    mainCategories = [],
    subCategories = [],
    childCategories = [],
    investmentRanges = [],
    states = [],
    districts = [],
    cities = [],
    loading: dropdownLoading,
    error: dropdownError,
  } = filterState;

  // Debug logging
 

  // Selected filters state
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedChildCategory, setSelectedChildCategory] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedInvestmentRange, setSelectedInvestmentRange] = useState("");

  // Search terms for filter dropdowns
  const [searchTerms, setSearchTerms] = useState({
    mainCategory: "",
    subCategory: "",
    childCategory: "",
    state: "",
    district: "",
    city: "",
    investment: "",
  });

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch initial filter options when component mounts
  useEffect(() => {
    if (open) {
      dispatch(fetchFilterOptions());
    }
  }, [dispatch, open]);

  // Fetch sub-categories when main category is selected
useEffect(() => {
  if (selectedMainCategory?.industry) {
    dispatch(
      fetchFilterOptions({
        main: selectedMainCategory.industry,
      })
    );

    setSelectedSubCategory("");
    setSelectedChildCategory("");
  }
}, [selectedMainCategory, dispatch]);

  // Fetch child-categories when sub-category is selected
  useEffect(() => {
    if (selectedSubCategory) {
      dispatch(fetchFilterOptions({ sub: selectedSubCategory }));
      setSelectedChildCategory("");
    }
  }, [selectedSubCategory, dispatch]);

  // Fetch districts when state is selected
  useEffect(() => {
    if (selectedState) {
      dispatch(fetchFilterOptions({ state: selectedState }));
      setSelectedDistrict("");
      setSelectedCity("");
    }
  }, [selectedState, dispatch]);

  // Fetch cities when district is selected
  useEffect(() => {
    if (selectedDistrict) {
      dispatch(fetchFilterOptions({ district: selectedDistrict }));
      setSelectedCity("");
    }
  }, [selectedDistrict, dispatch]);

  // Filter main categories based on search term
const filteredMainCategories = useMemo(() => {
  const term = (searchTerms.mainCategory || "").toLowerCase();

  return mainCategories.flatMap((group) => {
    if (!group?.heading || !Array.isArray(group.industries)) return [];

    return group.industries
      .filter((industry) =>
        industry.toLowerCase().includes(term)
      )
      .sort((a, b) => a.localeCompare(b))
      .map((industry) => ({
        heading: group.heading,
        industry,
      }));
  });
}, [mainCategories, searchTerms.mainCategory]);

  // Filter sub categories based on search term (NOT dependent on selectedMainCategory for initial display)
  const filteredSubCategories = useMemo(() => {
    const term = searchTerms.subCategory.toLowerCase();
    const subs = Array.isArray(subCategories) ? subCategories : [];
    
    
    const filtered = subs
      .filter((sub) => sub && sub.toString().toLowerCase().includes(term))
      .slice(0, 100);
    
    return filtered;
  }, [subCategories, searchTerms.subCategory]);

  // Filter child categories based on selected sub category and search term
  const filteredChildCategories = useMemo(() => {
    if (!selectedSubCategory) return [];
    const term = searchTerms.childCategory.toLowerCase();
    const children = Array.isArray(childCategories) ? childCategories : [];
    
    return children
      .filter((child) => child && child.toString().toLowerCase().includes(term))
      .slice(0, 100);
  }, [selectedSubCategory, childCategories, searchTerms.childCategory]);

  // Filter states based on search term
  const filteredStates = useMemo(() => {
    const term = searchTerms.state.toLowerCase();
    const stateList = Array.isArray(states) ? states : [];
    
    return stateList
      .filter((state) => state && state.toString().toLowerCase().includes(term))
      .slice(0, 100);
  }, [states, searchTerms.state]);

  // Filter districts based on selected state and search term
  const filteredDistricts = useMemo(() => {
    if (!selectedState) return [];
    const term = searchTerms.district.toLowerCase();
    const districtList = Array.isArray(districts) ? districts : [];
    
    return districtList
      .filter((district) => district && district.toString().toLowerCase().includes(term))
      .slice(0, 100);
  }, [selectedState, districts, searchTerms.district]);

  // Filter cities based on selected district and search term
  const filteredCities = useMemo(() => {
    if (!selectedDistrict) return [];
    const term = searchTerms.city.toLowerCase();
    const cityList = Array.isArray(cities) ? cities : [];
    
    return cityList
      .filter((city) => city && city.toString().toLowerCase().includes(term))
      .slice(0, 100);
  }, [selectedDistrict, cities, searchTerms.city]);

  // Filter investment ranges based on search term
  const filteredInvestmentRanges = useMemo(() => {
    const term = searchTerms.investment.toLowerCase();
    const ranges = Array.isArray(investmentRanges) ? investmentRanges : [];
    
    return ranges
      .filter((range) => range && range.toString().toLowerCase().includes(term))
      .slice(0, 50);
  }, [investmentRanges, searchTerms.investment]);

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    // Reset relevant selections when changing tabs
    if (newValue !== 0) {
      setSelectedMainCategory("");
      setSelectedSubCategory("");
      setSelectedChildCategory("");
    }
    if (newValue !== 1) {
      setSelectedState("");
      setSelectedDistrict("");
      setSelectedCity("");
    }
    if (newValue !== 2) {
      setSelectedInvestmentRange("");
    }
  };

  const handleSearchChange = (key, value) => {
    setSearchTerms((prev) => ({ ...prev, [key]: value }));
  };

  const handleExplore = async () => {
    setLoading(true);
    dispatch(resetFilters());

    // Collect filters into query params
    const queryParams = new URLSearchParams();

    if (searchTerm) queryParams.append("searchTerm", searchTerm);
    if (selectedMainCategory?.industry)
  queryParams.append(
    "maincat",
    selectedMainCategory.industry
  );
    if (selectedSubCategory) queryParams.append("subcat", selectedSubCategory);
    if (selectedChildCategory)
      queryParams.append("childcat", selectedChildCategory);
    if (selectedState) queryParams.append("state", selectedState);
    if (selectedDistrict) queryParams.append("district", selectedDistrict);
    if (selectedCity) queryParams.append("city", selectedCity);
    if (selectedInvestmentRange)
      queryParams.append("investmentRange", selectedInvestmentRange);

    // Open new tab with filters in URL
    //  window.open(`/all-franchise-brands?${queryParams.toString()}`, "_blank", "noopener,noreferrer");
     router.push(`/all-franchise-brands?${queryParams.toString()}`);


    handleClose();
    setLoading(false);
  };

  const handleClearAll = () => {
    setSearchTerm("");
    setSelectedMainCategory("");
    setSelectedSubCategory("");
    setSelectedChildCategory("");
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedInvestmentRange("");
    setSearchTerms({
      mainCategory: "",
      subCategory: "",
      childCategory: "",
      state: "",
      district: "",
      city: "",
      investment: "",
    });
  };

  // Custom Listbox component
  const CustomListbox = React.forwardRef(function CustomListbox(props, ref) {
    const { children, ...other } = props;

    return (
      <ul
        ref={ref}
        {...other}
        style={{
          listStyle: "none",
          margin: 0,
          padding: 8,
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: 1,
          backgroundColor: "#e0e0e0",
          maxHeight: 200,
          overflow: "auto",
        }}
      >
        {children}
      </ul>
    );
  });

  // Loading state display
  if (dropdownLoading && !mainCategories.length) {
    return (
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogContent sx={{ p: 3, background: "#d5e7ddac", textAlign: "center" }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography>Loading filter options...</Typography>
        </DialogContent>
      </Dialog>
    );
  }

  // Error state display
  if (dropdownError && !mainCategories.length) {
    return (
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogContent sx={{ p: 3, background: "#d5e7ddac", textAlign: "center" }}>
          <Typography color="error" sx={{ mb: 2 }}>
            Error loading filter options: {dropdownError}
          </Typography>
          <Button
            variant="contained"
            onClick={() => dispatch(fetchFilterOptions())}
          >
            Retry
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogContent
        sx={{ p: 3, background: "#d5e7ddac", position: "relative" }}
      >
        {/* Close Button */}
        <Box>
          <IconButton
            onClick={handleClose}
            aria-label="close"
            sx={{
              position: "absolute",
              top: { xs: -5, md: 8 },
              right: { xs: -5, md: 8 },
              color: "error.main",
              "&:hover": {
                backgroundColor: "error.main",
                color: "#fff",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Search Input */}
        <Box display="flex" justifyContent="center" mb={2}>
          <Search handleClose={handleClose} />
        </Box>

        {/* Active Filters */}
        <Box
          display="flex"
          justifyContent="center"
          flexWrap="wrap"
          gap={1}
          mb={2}
        >
          {selectedMainCategory && (
            <Chip
              label={`Industry: ${selectedMainCategory}`}
              onDelete={() => {
                setSelectedMainCategory("");
                setSelectedSubCategory("");
                setSelectedChildCategory("");
              }}
            />
          )}
          {selectedSubCategory && (
            <Chip
              label={`Category: ${selectedSubCategory}`}
              onDelete={() => {
                setSelectedSubCategory("");
                setSelectedChildCategory("");
              }}
            />
          )}
          {selectedChildCategory && (
            <Chip
              label={`Sub-Category: ${selectedChildCategory}`}
              onDelete={() => setSelectedChildCategory("")}
            />
          )}
          {selectedState && (
            <Chip
              label={`State: ${selectedState}`}
              onDelete={() => {
                setSelectedState("");
                setSelectedDistrict("");
                setSelectedCity("");
              }}
            />
          )}
          {selectedDistrict && (
            <Chip
              label={`District: ${selectedDistrict}`}
              onDelete={() => {
                setSelectedDistrict("");
                setSelectedCity("");
              }}
            />
          )}
          {selectedCity && (
            <Chip
              label={`City: ${selectedCity}`}
              onDelete={() => setSelectedCity("")}
            />
          )}
          {selectedInvestmentRange && (
            <Chip
              label={`Investment: ${selectedInvestmentRange}`}
              onDelete={() => setSelectedInvestmentRange("")}
            />
          )}
        </Box>

        <Typography align="center" color="text.secondary" sx={{ mb: 2 }}>
          Or Explore By
        </Typography>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={handleTabChange}
          centered
          textColor="error"
          sx={{
            mb: 2,
            "& .MuiTab-root": {
              minWidth: "auto",
              px: { xs: 1, md: 5 },
              fontSize: { xs: "0.75rem", md: "1rem" },
            },
          }}
        >
          <Tab label="Categories" />
          <Tab label="Location" />
          <Tab label="Investment" />
        </Tabs>

        {/* TAB 1 — CATEGORIES */}
        {tab === 0 && (
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            flexWrap="wrap"
            gap={2}
            justifyContent="center"
            mb={3}
          >
            <FormControl
  sx={{
    minWidth: { xs: "100%", md: 600 },
    width: { xs: "100%", md: "auto" },
  }}
>
  <Autocomplete
    size="small"
    options={filteredMainCategories}
    value={selectedMainCategory}
    loading={dropdownLoading}
    ListboxComponent={CustomListbox}

    groupBy={(option) => option.heading}

    getOptionLabel={(option) => option?.industry || ""}

    isOptionEqualToValue={(option, value) =>
      option?.industry === value?.industry
    }

    onChange={(event, value) => {
      setSelectedMainCategory(value);
      setSelectedSubCategory("");
      setSelectedChildCategory("");
    }}

    inputValue={searchTerms.mainCategory}

    onInputChange={(event, value) => {
      handleSearchChange("mainCategory", value);
    }}

    renderOption={(props, option) => (
      <li {...props} key={`${option.heading}-${option.industry}`}>
        {option.industry}
      </li>
    )}

    renderInput={(params) => (
      <TextField
        {...params}
        label="Industry"
        helperText={`${filteredMainCategories.length} options available`}
        error={!!dropdownError}
      />
    )}
  />
</FormControl>

            <FormControl sx={{ minWidth: { xs: "100%", md: 600 }, width: { xs: "100%", md: "auto" } }}>
              <Autocomplete
                options={filteredSubCategories}
                value={selectedSubCategory}
                onChange={(_, v) => {
                  setSelectedSubCategory(v);
                  setSelectedChildCategory("");
                }}
                inputValue={searchTerms.subCategory}
                onInputChange={(_, v) => handleSearchChange("subCategory", v)}
                ListboxComponent={CustomListbox}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Category"
                    helperText={
                      selectedMainCategory 
                        ? `Showing categories for "${selectedMainCategory}" (${filteredSubCategories.length} options)` 
                        : `${filteredSubCategories.length} options available - select an industry to filter`
                    }
                    disabled={false} // Changed: Always enabled to show all categories initially
                    error={!!dropdownError}
                  />
                )}
                loading={dropdownLoading}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
                getOptionLabel={(option) => option || ""}
                isOptionEqualToValue={(option, value) => option === value}
                size="small"
              />
            </FormControl>
          </Box>
        )}

        {/* TAB 2 — LOCATION */}
        {tab === 1 && (
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            flexWrap="wrap"
            gap={2}
            justifyContent="center"
            mb={3}
          >
            <FormControl sx={{ minWidth: { xs: "100%", md: 600 }, width: { xs: "100%", md: "auto" } }}>
              <Autocomplete
                options={filteredStates}
                value={selectedState}
                onChange={(_, v) => {
                  setSelectedState(v);
                  setSelectedDistrict("");
                  setSelectedCity("");
                }}
                inputValue={searchTerms.state}
                onInputChange={(_, v) => handleSearchChange("state", v)}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="State" 
                    helperText={`${filteredStates.length} options available`}
                    error={!!dropdownError}
                  />
                )}
                loading={dropdownLoading}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
                getOptionLabel={(option) => option || ""}
                isOptionEqualToValue={(option, value) => option === value}
                size="small"
              />
            </FormControl>

            <FormControl sx={{ minWidth: { xs: "100%", md: 600 }, width: { xs: "100%", md: "auto" } }}>
              <Autocomplete
                options={filteredDistricts}
                value={selectedDistrict}
                onChange={(_, v) => {
                  setSelectedDistrict(v);
                  setSelectedCity("");
                }}
                inputValue={searchTerms.district}
                onInputChange={(_, v) => handleSearchChange("district", v)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="District"
                    disabled={!selectedState}
                    helperText={selectedState ? `${filteredDistricts.length} options available` : "Select a State first"}
                    error={!!dropdownError}
                  />
                )}
                loading={dropdownLoading}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
                getOptionLabel={(option) => option || ""}
                isOptionEqualToValue={(option, value) => option === value}
                size="small"
              />
            </FormControl>
          </Box>
        )}

        {/* TAB 3 — INVESTMENT */}
        {tab === 2 && (
          <Box display="flex" justifyContent="center" mb={3}>
            <FormControl sx={{ minWidth: { xs: "100%", md: 600 }, width: { xs: "100%", md: "auto" } }}>
              <Autocomplete
                options={filteredInvestmentRanges}
                value={selectedInvestmentRange}
                onChange={(_, v) => setSelectedInvestmentRange(v)}
                inputValue={searchTerms.investment}
                onInputChange={(_, v) => handleSearchChange("investment", v)}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Investment Range" 
                    helperText={`${filteredInvestmentRanges.length} options available`}
                    error={!!dropdownError}
                  />
                )}
                loading={dropdownLoading}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
                getOptionLabel={(option) => option || ""}
                isOptionEqualToValue={(option, value) => option === value}
                size="small"
              />
            </FormControl>
          </Box>
        )}

        {/* Action Buttons */}
        <Box display="flex" justifyContent="center" gap={2} mt={2}>
          <Button
            variant="contained"
            onClick={handleExplore}
            disabled={loading}
            sx={{
              backgroundColor: "#7ad03a",
              "&:hover": { backgroundColor: "rgb(104,159,56)" },
              minWidth: 120,
            }}
          >
            {loading ? <CircularProgress size={24} /> : "Explore"}
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleClearAll}
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            Clear All
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NavbarSearch;