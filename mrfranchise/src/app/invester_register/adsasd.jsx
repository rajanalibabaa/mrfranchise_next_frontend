"use client";

import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormLabel,
  FormHelperText,
  Button,
  Typography,
  Box,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  FormControlLabel,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import {
  FavoriteBorderOutlined,
  HomeWork,
  MeetingRoom,
  InfoOutlined,
} from "@mui/icons-material";
import { DeleteIcon } from "lucide-react";
import { EditIcon } from "lucide-react";
import { Controller } from "react-hook-form";

const InvestorRegisterPreferences = ({
  control,
  watch,
  setValue,
  errors,
  clearErrors,
  preferences,
  setPreferences,
  selectedMainCategory,
  setSelectedMainCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  selectedChild,
  setSelectedChild,
  selectedCategories,
  setSelectedCategories,
  categories,
  showSnackbar,
  indiaData,
  preferredStates,
  // preferredCities,
  preferredDistricts,
  intlCountries,
  intlStates,
  intlCities,
  propertyCountries,
  propertyStates,
  propertyCities,
  propertyCountry,
  propertyState,
}) => {
  const preferredLocationType = watch("preferredLocationType");
  const preferredStateValue = watch("preferredState");
  const preferredDistrictValue = watch("preferredDistrict");
  const propertyTypeValue = watch("propertyType");

  // State for fetched industry data
  const [industryData, setIndustryData] = useState(null);
  const [loadingIndustryDetails, setLoadingIndustryDetails] = useState(false);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loadingIndustries, setLoadingIndustries] = useState(true);

  // Fetch industries on component mount
  useEffect(() => {
    fetchIndustries();
  }, []);

  // Fetch all industries list
  const fetchIndustries = async () => {
    try {
      setLoadingIndustries(true);
      const response = await fetch(
        `http://localhost:5000/api/v1/admin/getIndustryByIndustryName`
      );
      const result = await response.json();
      
      if (result.success && result.data) {
        // Extract industry names from the Industry array
        const industries = result.data.Industry || [];
        setIndustryOptions(industries);
        
        // If "Food & Beverages" exists, fetch its details
        const foodBeverage = industries.find(ind => 
          ind.toLowerCase().includes("food") || 
          ind.toLowerCase().includes("beverage")
        );
        
        if (foodBeverage) {
          fetchIndustryDetails(foodBeverage);
        } else if (industries.length > 0) {
          // Fallback to first industry if Food & Beverages not found
          fetchIndustryDetails(industries[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching industries:', error);
      showSnackbar("Failed to load industries", "error");
    } finally {
      setLoadingIndustries(false);
    }
  };

  // Fetch industry details when industry changes
  const fetchIndustryDetails = async (industryName) => {
    if (!industryName) return;
    
    try {
      setLoadingIndustryDetails(true);
      const response = await fetch(
        `http://localhost:5000/api/v1/admin/getIndustryByIndustryName?industry=${encodeURIComponent(industryName)}`
      );
      const result = await response.json();
     
      if (result.success && result.data) {
        const industryData = result.data;
        setIndustryData(industryData);
        
        // Set categories from the fetched data
        setCategoryOptions(industryData.categories || []);
        
        // If this is the initial load and we have "Food & Beverages"
        if (industryName.includes("Food") || industryName.includes("Beverage")) {
          setSelectedMainCategory("Food & Beverages");
          setValue("industry", industryName);
        }
        
        console.log("Fetched industry details:", industryData);
      }
    } catch (error) {
      console.error('Error fetching industry details:', error);
      showSnackbar("Failed to load industry details", "error");
    } finally {
      setLoadingIndustryDetails(false);
    }
  };

  // Handle industry change
  const handleIndustryChange = (e) => {
    const industryName = "Food & Beverages";
    setSelectedMainCategory(industryName);
    setValue("industry", industryName);
    setSelectedSubCategory("");
    setSelectedChild("");
    setCategoryOptions([]); // Clear categories until new ones are loaded
    
    // Fetch categories for the selected industry
    if (industryName) {
      fetchIndustryDetails(industryName);
    }
  };

  const handleAddPreference = () => {
    const propertyType = watch("propertyType");
    const isOwnProperty = propertyType === "Own Property";

    const pref = {
      category: selectedCategories,
      investmentRange: watch("investmentRange"),
      investmentAmount: watch("investmentAmount"),
      preferredState: watch("preferredState"),
      preferredDistrict: watch("preferredDistrict"),
      // preferredCity: watch("preferredCity"),
      propertyType,
      locationType: watch("preferredLocationType"),
      ...(isOwnProperty && {
        propertySize: watch("propertySize"),
        propertyCountry: watch("propertyCountry"),
        propertyState: watch("propertyState"),
        propertyCity: watch("propertyCity"),
      }),
    };

    if (
      // !pref.category.length ||
      !pref.investmentRange ||
      !pref.investmentAmount ||
      !pref.preferredState ||
      !pref.preferredDistrict ||
      // !pref.preferredCity ||
      !pref.propertyType ||
      !pref.propertyType ||
      (isOwnProperty &&
        (!pref.propertySize ||
          !pref.propertyCountry ||
          !pref.propertyState ||
          !pref.propertyCity))
    ) {
      showSnackbar("Please fill all preference fields before adding.", "error");
      return;
    }

    setPreferences([...preferences, pref]);
    setValue("investmentRange", "");
    setValue("investmentAmount", "");
    setValue("preferredState", "");
    setValue("preferredDistrict", "");
    if (preferredLocationType === "international") {
      setValue("preferredCity", ""); // Only clear city for international
    }    
    setValue("preferredLocationType", "");
    setValue("propertyType", "");
    setValue("propertySize", "");
    setValue("propertyCountry", "");
    setValue("propertyState", "");
    setValue("propertyCity", "");
    setSelectedCategories([]);
    setValue("category", []);
    setSelectedCategories([]);
    setSelectedMainCategory("");
    setSelectedSubCategory("");
    setSelectedChild("");
    clearErrors([
      "preferredState",
      "preferredDistrict",
      ...(preferredLocationType === "international" ? ["preferredCity"] : []),
      "propertyType",
      "propertySize",
      "investmentRange",
      "investmentAmount",
      "category",
      "propertyCountry",
      "propertyState",
      "propertyCity",
    ]);
    showSnackbar("Preference added!", "success");
    setTimeout(() => {
      showSnackbar(
        "Add Multiple preferences to get more offers from us!",
        "info"
      );
    }, 2000);
  };

  const handleRemovePreference = (idx) => {
    if (window.confirm("Are you sure you want to remove this preference?")) {
      setPreferences(preferences.filter((_, i) => i !== idx));
    }
  };

  const handleEditPreference = (idx) => {
    const pref = preferences[idx];
    if (pref.category && pref.category.length > 0) {
      const selectedCat = pref.category[0];
      setSelectedMainCategory(selectedCat.main || "");
      setSelectedSubCategory(selectedCat.sub || "");
      setSelectedChild(selectedCat.child || "");
      setSelectedCategories(pref.category);
      setValue("category", pref.category);
    }

    setValue("investmentRange", pref.investmentRange || "");
    setValue("investmentAmount", pref.investmentAmount || "");
    setValue("preferredState", pref.preferredState || "");
    setValue("preferredDistrict", pref.preferredDistrict || "");
    setValue("preferredCity", pref.preferredCity || "");
    setValue("propertyType", pref.propertyType || "");
    setValue("propertySize", pref.propertySize || "");
    setValue("propertyCountry", pref.propertyCountry || "");
    setValue("propertyState", pref.propertyState || "");
    setValue("propertyCity", pref.propertyCity || "");

    setPreferences(preferences.filter((_, i) => i !== idx));
  };

  return (
    <>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: "bold",
          color: "text.primary",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <FavoriteBorderOutlined color="primary" /> Preferences
        <Tooltip
          title={
            <span style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>
              You can add multiple preferences to get more offers from us!
            </span>
          }
          placement="right-start"
          arrow
          enterTouchDelay={0}
        >
          <IconButton
            size="small"
            sx={{
              color: "warning.main",
              "&:hover": {
                backgroundColor: "info.main",
                color: "white",
              },
              marginLeft: "5px",
            }}
          >
            <InfoOutlined fontSize="medium" />
          </IconButton>
        </Tooltip>
      </Typography>

      {/* Category Selection */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ fontWeight: 500, mb: 1 }}
        >
          Investment Categories
        </Typography>

        <Grid
          container
          spacing={2}
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "repeat(3, 1fr)", xs: "1fr" },
            gap: 2,
          }}
        >
          {/* Main Category Dropdown - Industry */}
      <FormControl fullWidth sx={{ minWidth: 120 }}>
  <InputLabel>Industry</InputLabel>
  <Select
    value={selectedMainCategory}
    onChange={handleIndustryChange}
    label="Industry"
    sx={{ borderRadius: "8px" }}
    // disabled={loadingIndustries}
 
  >
    <MenuItem value="Food & Beverages">Food & Beverages</MenuItem>

  </Select>

</FormControl>


          {/* Subcategory Dropdown - Category */}
          <FormControl
            fullWidth
            sx={{ minWidth: 120 }}
          
          >
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedSubCategory || ""}
              onChange={(e) => {
                setSelectedSubCategory(e.target.value);
                setSelectedChild("");
              }}
              label="Category"
              sx={{ borderRadius: "8px" }}
              endAdornment={
                loadingIndustryDetails ? (
                  <CircularProgress size={20} sx={{ mr: 2 }} />
                ) : null
              }
            >
              <MenuItem value="">Select Category</MenuItem>
              {categoryOptions.map((category, index) => (
                <MenuItem key={index} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
            {loadingIndustryDetails && (
              <FormHelperText>Loading categories...</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Box>

      <Grid spacing={3}>
        {/* Investment Amount */}
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ fontWeight: 500, mb: 1 }}
        >
          Investment Range
        </Typography>
        <Grid item xs={12} md={6}>
          <Controller
            name="investmentAmount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="Preferred Investment Amount"
                variant="outlined"
                value={field.value || ""}
                error={!!errors.investmentAmount}
                helperText={errors.investmentAmount?.message || " "}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              >
                <MenuItem value="">Select preferred Investment Amount</MenuItem>
                <MenuItem value="Below - 50,000">Below - Rs.50 K</MenuItem>
                <MenuItem value="Rs. 50,000 - 2 L">Rs.50 K - 2 L</MenuItem>
                <MenuItem value="Rs. 2 L - 5 L">Rs.2 L - 5 L</MenuItem>
                <MenuItem value="Rs. 5 L - 10 L">Rs.5 L - 10 L</MenuItem>
                <MenuItem value="Rs. 10 L - 20 L">Rs.10 L - 20 L</MenuItem>
                <MenuItem value="Rs. 20 L - 30 L">Rs.20 L - 30 L</MenuItem>
                <MenuItem value="Rs. 30 L - 50 L">Rs.30 L - 50 L</MenuItem>
                <MenuItem value="Rs. 50 L - 1 Cr">Rs.50 L - 1 Cr</MenuItem>
                <MenuItem value="Rs. 1 Cr - 2 Crs">Rs.1 Cr - 2 Cr</MenuItem>
                <MenuItem value="Rs. 2 Crs - 5 Crs">Rs.2 Cr - 5 Cr</MenuItem>
                <MenuItem value="Rs. 5Crs - above">Rs.5 Cr - Above</MenuItem>
              </TextField>
            )}
          />
        </Grid>

        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ fontWeight: 500, mb: 1 }}
        >
          Preferred Location
        </Typography>
        <Grid item xs={12}>
          <Controller
            name="preferredLocationType"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <FormControl
                component="fieldset"
                error={!!errors.preferredLocationType}
              >
                <RadioGroup row {...field}>
                  <FormControlLabel
                    value="domestic"
                    control={<Radio />}
                    label="India"
                  />
                  <FormControlLabel
                    value="international"
                    control={<Radio />}
                    label="International"
                  />
                </RadioGroup>
                <FormHelperText>
                  {errors.preferredLocationType?.message || " "}
                </FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
        <Grid
          container
          spacing={2}
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "repeat(3, 1fr)", xs: "1fr" },
            gap: 2,
          }}
        >
          {/* Preferred Location */}
          <Grid item xs={12} md={4}>
            <Controller
              name="preferredState"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label={
                    preferredLocationType === "international"
                      ? "Country"
                      : "Preferred State"
                  }
                  variant="outlined"
                  disabled={preferredLocationType === ""}
                  error={!!errors.preferredState}
                  helperText={errors.preferredState?.message || " "}
                  onChange={(e) => {
                    field.onChange(e);
                    setValue("preferredDistrict", "");
                    setValue("preferredCity", "");
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                >
                  <MenuItem value="">
                    Select{" "}
                    {preferredLocationType === "international"
                      ? "Country"
                      : "State"}
                  </MenuItem>
                  {(preferredLocationType === "international"
                    ? intlCountries
                    : preferredStates
                  ).map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          {/* Preferred District/State */}
          <Grid item xs={12} md={4}>
            <Controller
              name="preferredDistrict"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label={
                    preferredLocationType === "international"
                      ? "State"
                      : "Preferred District"
                  }
                  variant="outlined"
                  disabled={
                    preferredLocationType === "" || !watch("preferredState")
                  }
                  error={!!errors.preferredDistrict}
                  helperText={errors.preferredDistrict?.message || " "}
                  onChange={(e) => {
                    field.onChange(e);
                    setValue("preferredCity", "");
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                >
                  <MenuItem value="">
                    Select{" "}
                    {preferredLocationType === "international"
                      ? "State"
                      : "District"}
                  </MenuItem>
                  {(preferredLocationType === "international"
                    ? intlStates
                    : preferredDistricts
                  ).map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          {/* Preferred City */}
          {preferredLocationType === "international" && (
          <Grid item xs={12} md={4}>
            <Controller
              name="preferredCity"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Preferred City"
                  variant="outlined"
                  disabled={
                    preferredLocationType === "" || !watch("preferredDistrict")
                  }
                  error={!!errors.preferredCity}
                  helperText={errors.preferredCity?.message || " "}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                >
                  <MenuItem value="">Select City</MenuItem>
                  {intlCities.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          )}
        </Grid>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ fontWeight: 500, mb: 1 }}
        >
          Preferred Readiness
        </Typography>
        <Grid item xs={12} md={6}>
          <Controller
            name="investmentRange"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="Preferred Investment Readiness"
                variant="outlined"
                value={field.value || ""}
                error={!!errors.investmentRange}
                helperText={errors.investmentRange?.message || " "}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              >
                <MenuItem value="">Select Preferred Readiness</MenuItem>
                <MenuItem value="having amount">
                  Having Investment Amount Ready
                </MenuItem>
                <MenuItem value="take loan">
                  Planning to take a Loan
                </MenuItem>
                <MenuItem value="need loan">Need Loan Assistance</MenuItem>
              </TextField>
            )}
          />
        </Grid>
        {/* Property Type */}
        <Grid
          container
          spacing={2}
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "repeat(2, 1fr)", xs: "1fr" },
            gap: 2,
          }}
        >
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
              Property Type
            </Typography>
            <Controller
              name="propertyType"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  row
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    if (e.target.value !== "Own Property") {
                      setValue("propertySize", "");
                      setValue("propertyCountry", "");
                      setValue("propertyState", "");
                      setValue("propertyCity", "");
                    }
                  }}
                  sx={{ gap: 3 }}
                >
                  <FormControlLabel
                    value="Own Property"
                    control={<Radio color="primary" />}
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <HomeWork color="primary" />
                        <Typography>Own Property</Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="Rental Property"
                    control={<Radio color="primary" />}
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <MeetingRoom color="primary" />
                        <Typography>Rental Property</Typography>
                      </Box>
                    }
                  />
                </RadioGroup>
              )}
            />
          </Grid>

          {/* Property Size - Only show for Own Property */}
          {watch("propertyType") === "Own Property" && (
            <Grid item xs={12} md={6}>
              <Controller
                name="propertySize"
                control={control}
                rules={{
                  required:
                    watch("propertyType") === "Own Property"
                      ? "Property size is required"
                      : false,
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Property Size"
                    variant="outlined"
                    error={!!errors.propertySize}
                    helperText={errors.propertySize?.message || " "}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  >
                    <MenuItem value="">Select Total Area</MenuItem>
                    <MenuItem value="Below - 100 sq ft">
                      Below - 100 sq ft
                    </MenuItem>
                    <MenuItem value="100 sq ft - 200 sq ft">
                      100 sq ft - 200 sq ft
                    </MenuItem>
                    <MenuItem value="200 sq ft - 500 sq ft">
                      200 sq ft - 500 sq ft
                    </MenuItem>
                    <MenuItem value="500 sq ft - 1000 sq ft">
                      500 sq ft - 1000 sq ft
                    </MenuItem>
                    <MenuItem value="1000 sq ft - 1500 sq ft">
                      1000 sq ft - 1500 sq ft
                    </MenuItem>
                    <MenuItem value="1500 sq ft - 2000 sq ft">
                      1500 sq ft - 2000 sq ft
                    </MenuItem>
                    <MenuItem value="2000 sq ft - 3000 sq ft">
                      2000 sq ft - 3000 sq ft
                    </MenuItem>
                    <MenuItem value="3000 sq ft - 5000 sq ft">
                      3000 sq ft - 5000 sq ft
                    </MenuItem>
                    <MenuItem value="5000 sq ft - 7000 sq ft">
                      5000 sq ft - 7000 sq ft
                    </MenuItem>
                    <MenuItem value="7000 sq ft - 10000 sq ft">
                      7000 sq ft - 10000 sq ft
                    </MenuItem>
                    <MenuItem value="Above 10000 sq ft">
                      Above 10000 sq ft
                    </MenuItem>
                  </TextField>
                )}
              />
            </Grid>
          )}
        </Grid>

        {watch("propertyType") === "Own Property" && (
          <Grid
            container
            spacing={2}
            sx={{
              display: "grid",
              gridTemplateColumns: { md: "repeat(3, 1fr)", xs: "1fr" },
              gap: 2,
              mt: 2,
            }}
          >
            <Grid item xs={12} md={4}>
              <Controller
                name="propertyCountry"
                control={control}
                rules={{ required: "Country is required" }}
                render={({ field }) => (
                  <Autocomplete
                    freeSolo
                    options={propertyCountries}
                    value={field.value || ""}
                    onChange={(_, newValue) => {
                      field.onChange(newValue || "");
                      setValue("propertyState", "");
                      setValue("propertyCity", "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Property Country"
                        error={!!errors.propertyCountry}
                        helperText={errors.propertyCountry?.message}
                        fullWidth
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="propertyState"
                control={control}
                rules={{ required: "State is required" }}
                render={({ field }) => (
                  <Autocomplete
                    freeSolo
                    options={propertyStates}
                    value={field.value || ""}
                    onChange={(_, newValue) => {
                      field.onChange(newValue || "");
                      setValue("propertyCity", "");
                    }}
                    disabled={!watch("propertyCountry")}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Property State"
                        error={!!errors.propertyState}
                        helperText={errors.propertyState?.message}
                        fullWidth
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="propertyCity"
                control={control}
                rules={{ required: "City is required" }}
                render={({ field }) => (
                  <Autocomplete
                    freeSolo
                    options={propertyCities}
                    value={field.value || ""}
                    onChange={(_, newValue) =>
                      field.onChange(newValue || "")
                    }
                    disabled={!watch("propertyState")}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Property City"
                        error={!!errors.propertyCity}
                        helperText={errors.propertyCity?.message}
                        fullWidth
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>
          </Grid>
        )}
      </Grid>

      {/* Add Preference Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 3,
          mr: { xs: "40px", sm: "55px" },
        }}
      >
        <Button
          onClick={handleAddPreference}
          sx={{
            borderRadius: "8px",
            backgroundColor: "#7ad03a",
            color: "#fff",
            px: 4,
            py: 1.5,
            fontWeight: "bold",
          }}
        >
          Add Preference
        </Button>
      </Box>

      {/* Preferences Table */}
      {preferences.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Your Investment Preferences
          </Typography>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: "12px",
              overflowX: "auto",
              width: "100%",
              WebkitOverflowScrolling: "touch",
              "&::-webkit-scrollbar": {
                height: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#555",
                borderRadius: "8px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#333",
              },
            }}
          >
            <Table size="small" aria-label="added preferences table">
              <TableHead>
                <TableRow sx={{ bgcolor: "#7ad03a", alignContent: "center" }}>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "primary.contrastText",
                    }}
                  >
                    #
                  </TableCell>
                  <TableCell sx={{ color: "primary.contrastText" }}>
                    Industry
                  </TableCell>
                  <TableCell sx={{ color: "primary.contrastText" }}>
                    Category
                  </TableCell>
                  <TableCell sx={{ color: "primary.contrastText" }}>
                    Investment Range
                  </TableCell>
                  <TableCell sx={{ color: "primary.contrastText" }}>
                    Preferred State
                  </TableCell>
                  <TableCell sx={{ color: "primary.contrastText" }}>
                    Preferred District
                  </TableCell>
                  <TableCell sx={{ color: "primary.contrastText" }}>
                    Preferred City
                  </TableCell>
                  <TableCell sx={{ color: "primary.contrastText" }}>
                    Property Country
                  </TableCell>
                  <TableCell sx={{ color: "primary.contrastText" }}>
                    Property State
                  </TableCell>
                  <TableCell sx={{ color: "primary.contrastText" }}>
                    Property City
                  </TableCell>
                  <TableCell sx={{ color: "primary.contrastText" }}>
                    Investment Amount
                  </TableCell>
                  <TableCell sx={{ color: "primary.contrastText" }}>
                    Property Type
                  </TableCell>
                  <TableCell sx={{ color: "primary.contrastText" }}>
                    Property Size
                  </TableCell>
                  <TableCell sx={{ color: "primary.contrastText" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {preferences.map((pref, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minWidth: 150,
                      }}
                    >
                      {pref.category?.map((cat, i) => (
                        <Typography key={i}>{cat.main}</Typography>
                      ))}
                    </TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minWidth: 150,
                      }}
                    >
                      {pref.category?.map((cat, i) => (
                        <Typography key={i}>{cat.sub}</Typography>
                      ))}
                    </TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minWidth: 150,
                      }}
                    >
                      <Typography>{pref.investmentAmount}</Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minWidth: 150,
                      }}
                    >
                      <Typography>{pref.preferredState}</Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minWidth: 150,
                      }}
                    >
                      <Typography>{pref.preferredDistrict}</Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minWidth: 150,
                      }}
                    >
                      <Typography>{pref.preferredCity}</Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minWidth: 150,
                      }}
                    >
                      <Typography>{pref.propertyCountry}</Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minWidth: 150,
                      }}
                    >
                      <Typography>{pref.propertyState}</Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minWidth: 150,
                      }}
                    >
                      <Typography>{pref.propertyCity}</Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minWidth: 150,
                      }}
                    >
                      <Typography>{pref.investmentRange}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          minWidth: 150,
                        }}
                      >
                        {pref.propertyType}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minWidth: 150,
                      }}
                    >
                      <Typography>
                        {pref.propertyType === "Own Property"
                          ? pref.propertySize
                          : "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          color="primary"
                          onClick={() => handleEditPreference(idx)}
                          aria-label="edit preference"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleRemovePreference(idx)}
                          aria-label="remove preference"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </>
  );
};

export default InvestorRegisterPreferences;

