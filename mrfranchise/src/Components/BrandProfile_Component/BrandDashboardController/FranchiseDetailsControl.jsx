"use client";
import React, { useState } from "react";

import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Autocomplete from "@mui/material/Autocomplete";

import categories from "../../../Pages/Registration/BrandLIstingRegister/BrandCategories";
// import  Editor  from "@tinymce/tinymce-react/editor";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoOutlined  from "@mui/icons-material/InfoOutlined";

const FranchiseDetailsControl = ({ 
  data = {}, 
  errors = {}, 
  onChange = () => {},
  onNestedChange = () => {},
  onArrayChange = () => {},
  onObjectChange = () => {},
  isEditing = false ,
  initialData = {},
}) => {
  // Define fee unit options
  const royaltyFeeUnits = [
    { value: "select", label: "Select" },
    { value: "%", label: "%" },
    { value: "000", label: "Thousands" },
    { value: "00000", label: "Lakhs" },
    { value: "No Fee", label: "No Fee" }
  ];

  const otherFeeUnits = [
    { value: "select", label: "Select" },
    { value: "000", label: "Thousands" },
    { value: "00000", label: "Lakhs" },
    { value: "No Fee", label: "No Fee" }
  ];

  const [currentFicoModel, setCurrentFicoModel] = React.useState({
    investmentRange: "",
    areaRequired: "",
    franchiseModel: "",
    franchiseType: "",
    franchiseFee: "",
    franchiseFeeUnit: "select",
    royaltyFee: "",
    royaltyFeeUnit: "select",
    interiorCost: "",
    interiorCostUnit: "select",
    stockInvestment: "",
    stockInvestmentUnit: "select",
    otherCost: "",
    otherCostUnit: "select",
    roi: "",
    payBackPeriod: "",
    breakEven: "",
    requireWorkingCapital: "",
    requireWorkingCapitalUnit: "select",
    marginOnSales: "",
    agreementPeriod: "",
  });

  const [noFees, setNoFees] = useState({
    franchiseFee: false,
    interiorCost: false,
    stockInvestment: false,
    otherCost: false,
    requireWorkingCapital: false,
    royaltyFee: false,
    roi: false,
  });

  const [savedFicoModels, setSavedFicoModels] = React.useState([]);
  const [currentUSP, setCurrentUSP] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
      
    // setData(prev => ({
    //   ...prev,
    //   [name]: value
    // }));

        if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }

    if (name === "companyOwnedOutlets" || name === "franchiseOutlets") {
      const companyOwned =
        name === "companyOwnedOutlets"
          ? parseInt(value || 0)
          : parseInt(data.companyOwnedOutlets || 0);
      const franchise =
        name === "franchiseOutlets"
          ? parseInt(value || 0)
          : parseInt(data.franchiseOutlets || 0);
      const total = companyOwned + franchise;

      onChange({
        [name]: value,
        totalOutlets: total.toString(),
      });
    } else {
      onChange({ [name]: value });
    }
  };
   
   const validateForm = () => {
    const newErrors = {};
    
    if (!data.establishedYear) {
      newErrors.establishedYear = 'Year is required';
    } else if (data.establishedYear < new Date().getFullYear() - 225 || 
               data.establishedYear > new Date().getFullYear()) {
      newErrors.establishedYear = 'Invalid year';
    }
    
    if (!data.franchiseSinceYear) {
      newErrors.franchiseSinceYear = 'Year is required';
    } else if (data.franchiseSinceYear < new Date().getFullYear() - 225 || 
               data.franchiseSinceYear > new Date().getFullYear()) {
      newErrors.franchiseSinceYear = 'Invalid year';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Save changes
  const handleSave = () => {
    if (validateForm()) {
      // Here you would typically send the data to your API
      // console.log('Saving data:', data);
      setIsEditing(false);
    }
  };
  
  // Cancel editing
  const handleCancel = () => {
    setData(initialData);
    setErrors({});
    setIsEditing(false);
  };

  const handleFicoChange = (e) => {
    const { name, value } = e.target;

    // Skip update if the field is in "No Fee" mode
    if (noFees[name]) {
      return;
    }

    setCurrentFicoModel((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      // If ROI is being changed, calculate Payback Period
      if (name === "roi" && !noFees.roi) {
        const roi = parseFloat(value);
        if (!isNaN(roi) && roi > 0) {
          const totalMonths = (100 / roi) * 12;
          const years = Math.floor(totalMonths / 12);
          const months = Math.round(totalMonths % 12);
          updated.payBackPeriod = `${years} year${years !== 1 ? "s" : ""} ${months} month${months !== 1 ? "s" : ""}`;
        } else {
          updated.payBackPeriod = "";
        }
      }

      return updated;
    });
  };

  const handleFeeUnitChange = (field) => (e) => {
    const { value } = e.target;
    
    if (value === "No Fee") {
      // Set the field to "No Fee" and disable it
      setNoFees(prev => ({
        ...prev,
        [field]: true
      }));
      
      setCurrentFicoModel(prev => ({
        ...prev,
        [field]: "No Fee",
        [`${field}Unit`]: "No Fee"
      }));
    } else if (value === "select") {
      // Reset to select state
      setNoFees(prev => ({
        ...prev,
        [field]: false
      }));
      
      setCurrentFicoModel(prev => ({
        ...prev,
        [field]: "",
        [`${field}Unit`]: "select"
      }));
    } else {
      // Update the unit and enable the field
      setNoFees(prev => ({
        ...prev,
        [field]: false
      }));
      
      setCurrentFicoModel(prev => ({
        ...prev,
        [`${field}Unit`]: value
      }));
    }
  };


  const handleNoFeeToggle = (field) => (event) => {
    const checked = event.target.checked;
    
    // Update the noFees state
    setNoFees(prev => ({
      ...prev,
      [field]: checked
    }));

    // Update the currentFicoModel state
    setCurrentFicoModel(prev => {
      const newValue = checked ? 'No Fee' : '';
      const newUnit = checked ? 'No Fee' : 'select';
      
      // Calculate payback period if ROI is being affected
      if (field === 'roi') {
        let payBackPeriod = '';
        
        if (!checked && newValue && !isNaN(parseFloat(newValue))) {
          const roiValue = parseFloat(newValue);
          if (roiValue > 0) {
            const totalMonths = (100 / roiValue) * 12;
            const years = Math.floor(totalMonths / 12);
            const months = Math.round(totalMonths % 12);
            payBackPeriod = `${years} year${years !== 1 ? 's' : ''} ${months} Month${months !== 1 ? 's' : ''}`;
          }
        }
        
        return {
          ...prev,
          [field]: newValue,
          [`${field}Unit`]: newUnit,
          payBackPeriod: payBackPeriod
        };
      }
      
      return {
        ...prev,
        [field]: newValue,
        [`${field}Unit`]: newUnit
      };
    });
  };

  const handleAddFicoModel = () => {
    if (!isEditing) return;

    // Validate the model before adding
    const requiredFields = [
      'investmentRange',
      'areaRequired',
      'franchiseModel',
      'franchiseType',
      'agreementPeriod',
      'breakEven',
      'marginOnSales'
    ];

    // Check required non-fee fields
    for (const field of requiredFields) {
      if (!currentFicoModel[field]) {
        alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return;
      }
    }

    // Check fee units are selected (not "select")
    const feeUnitsToCheck = [
      'franchiseFeeUnit',
      'royaltyFeeUnit',
      'interiorCostUnit',
      'stockInvestmentUnit',
      'otherCostUnit',
      'requireWorkingCapitalUnit'
    ];

    for (const unit of feeUnitsToCheck) {
      const fieldName = unit.replace('Unit', '');
      if (currentFicoModel[unit] === "select" && !noFees[fieldName]) {
        const displayName = fieldName.replace(/([A-Z])/g, ' $1').toLowerCase();
        alert(`Please select a unit for ${displayName} or mark as "No Fee"`);
        return;
      }
    }

    // Check fee fields have values if not marked as "No Fee"
    const feeFields = [
      'franchiseFee',
      'royaltyFee',
      'interiorCost',
      'stockInvestment',
      'otherCost',
      'requireWorkingCapital',
      'roi',
      'payBackPeriod'
    ];

    for (const field of feeFields) {
      if (!currentFicoModel[field] && !noFees[field] && field !== 'payBackPeriod') {
        alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} or mark as "No Fee"`);
        return;
      }
    }

    const formattedFicoModel = {
      ...currentFicoModel,
      franchiseFee: noFees.franchiseFee ? "No Fee" : `${currentFicoModel.franchiseFee}${currentFicoModel.franchiseFeeUnit === "No Fee" ? "" : currentFicoModel.franchiseFeeUnit}`,
      royaltyFee: noFees.royaltyFee ? "No Fee" : `${currentFicoModel.royaltyFee}${currentFicoModel.royaltyFeeUnit === "No Fee" ? "" : currentFicoModel.royaltyFeeUnit}`,
      interiorCost: noFees.interiorCost ? "No Fee" : `${currentFicoModel.interiorCost}${currentFicoModel.interiorCostUnit === "No Fee" ? "" : currentFicoModel.interiorCostUnit}`,
      stockInvestment: noFees.stockInvestment ? "No Fee" : `${currentFicoModel.stockInvestment}${currentFicoModel.stockInvestmentUnit === "No Fee" ? "" : currentFicoModel.stockInvestmentUnit}`,
      otherCost: noFees.otherCost ? "No Fee" : `${currentFicoModel.otherCost}${currentFicoModel.otherCostUnit === "No Fee" ? "" : currentFicoModel.otherCostUnit}`,
      requireWorkingCapital: noFees.requireWorkingCapital ? "No Fee" : `${currentFicoModel.requireWorkingCapital}${currentFicoModel.requireWorkingCapitalUnit === "No Fee" ? "" : currentFicoModel.requireWorkingCapitalUnit}`,
      roi: noFees.roi ? "No Fee" : currentFicoModel.roi,
      payBackPeriod: noFees.roi ? "No Fee" : currentFicoModel.payBackPeriod
    };

    const updatedFico = [...(data.fico || []), formattedFicoModel];
    onArrayChange("fico", updatedFico);
    setSavedFicoModels(updatedFico);

    // Reset the form
    setCurrentFicoModel({
      investmentRange: "",
      areaRequired: "",
      franchiseModel: "",
      franchiseType: "",
      franchiseFee: "",
      franchiseFeeUnit: "select",
      royaltyFee: "",
      royaltyFeeUnit: "select",
      interiorCost: "",
      interiorCostUnit: "select",
      stockInvestment: "",
      stockInvestmentUnit: "select",
      otherCost: "",
      otherCostUnit: "select",
      roi: "",
      payBackPeriod: "",
      breakEven: "",
      requireWorkingCapital: "",
      requireWorkingCapitalUnit: "select",
      marginOnSales: "",
      agreementPeriod: "",
    });
    setNoFees({
      franchiseFee: false,
      interiorCost: false,
      stockInvestment: false,
      otherCost: false,
      requireWorkingCapital: false,
      royaltyFee: false,
      roi: false,
    });
  };

  const handleDeleteFicoModel = (index) => {
    if (!isEditing) return;
    
    const updatedFico = [...(data.fico || [])];
    updatedFico.splice(index, 1);
    onArrayChange("fico", updatedFico);
    setSavedFicoModels(updatedFico);
  };

  const franchiseTypes = [
    "Single Unit",
    "Multi unit ",
    "Master Franchise",
    "City Franchise",
    "Area Franchise",
    "District Franchise",
    "State Franchise",
  ];

  const franchiseModels = ["FOFO ", "FOCO ", "FICO ", "COCO ", "KIOSK","SHOPPING SHOP","CLOUD KITCHEN"];

  const investmentRanges = [
    { label: "Below ₹50K", value: "Below-50,000" },
    { label: "₹50K - ₹2 Lakhs", value: "Rs.50,000-2L" },
    { label: "₹2 - ₹5 Lakhs", value: "Rs.2L-5L" },
    { label: "₹5 - ₹10 Lakhs", value: "Rs.5L-10L" },
    { label: "₹10 - ₹20 Lakhs", value: "Rs.10L-20L" },
    { label: "₹20 - ₹30 Lakhs", value: "Rs.20L-30L" },
    { label: "₹30 - ₹50 Lakhs", value: "Rs.30L-50L" },
    { label: "₹50 Lakhs - ₹1 Crore", value: "Rs.50L-1Cr" },
    { label: "₹1 - ₹2 Crores", value: "Rs.1Cr-2Cr" },
    { label: "₹2 - ₹5 Crores", value: "Rs.2Cr-5Cr" },
    { label: "Above ₹5 Crores", value: "Rs.5Cr-above" },
  ];

  const aidFinancing = ["Yes", "No"];

  const agreementPeriods = [
    "1 Year",
    "3 Years",
    "5 Years",
    "7 Years",
    "10 Years",
  ];

  const [selectedCategory, setSelectedCategory] = useState({
    groupId: data.brandCategories?.groupId || "",
    main: data.brandCategories?.main || "",
    sub: data.brandCategories?.sub || "",
    child: data.brandCategories?.child || "",
  });

  const handleMainCategoryChange = (e) => {
    if (!isEditing) return;
    
    const mainCategory = e.target.value;
    const newCategory = {
      groupId: "",
      main: mainCategory,
      sub: "",
      child: "",
    };

    setSelectedCategory(newCategory);
    onNestedChange("brandCategories", "main", mainCategory);
  };

  const handleSubCategoryChange = (e) => {
    if (!isEditing) return;
    
    const subCategory = e.target.value;
    const group = categories
      .find((cat) => cat.name === selectedCategory.main)
      ?.children?.find((sub) => sub.name === subCategory);

    const newCategory = {
      groupId: group?.groupId || "",
      main: selectedCategory.main,
      sub: subCategory,
      child: "",
    };

    setSelectedCategory(newCategory);
    onNestedChange("brandCategories", "sub", subCategory);
  };

  const handleChildCategoryChange = (e) => {
    if (!isEditing) return;
    
    const childCategory = e.target.value;
    const newCategory = {
      ...selectedCategory,
      child: childCategory,
    };

    setSelectedCategory(newCategory);
    onNestedChange("brandCategories", "child", childCategory);
  };

  const handleDescriptionChange = (content) => {
    onChange({ brandDescription: content });
  };

  const handleAddUSP = () => {
    if (!isEditing) return;
    
    const trimmedUSP = currentUSP.trim();
    if (!trimmedUSP) return;

    const existingUSPs = (data.uniqueSellingPoints || []).map((usp) =>
      usp.toLowerCase().trim()
    );

    if (existingUSPs.includes(trimmedUSP.toLowerCase())) {
      return;
    }

    const updatedUSPs = [...(data.uniqueSellingPoints || []), trimmedUSP];
    onArrayChange("uniqueSellingPoints", updatedUSPs);
    setCurrentUSP("");
  };

  const handleRemoveUSP = (index) => {
    if (!isEditing) return;
    
    const updatedUSPs = [...(data.uniqueSellingPoints || [])];
    updatedUSPs.splice(index, 1);
    onArrayChange("uniqueSellingPoints", updatedUSPs);
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    return value !== "No Fee" ? `${value}.Rs` : value;
  };

  return (
    <Box sx={{ pr: 1, mr: { sm: 0, md: 10 }, ml: { sm: 0, md: 10 } }}>
      {/* Brand Categories Section */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: "#ff9800" }}>
        Brand Categories
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{
          mt: 3,
          display: "grid",
          gridTemplateColumns: { md: "repeat(4, 1fr)", xs: "1fr" },
          gap: 2,
          mb: 2,
        }}
      >
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="medium" disabled={!isEditing}>
            <InputLabel>Industries</InputLabel>
            <Select
              value={selectedCategory.main || ""}
              label="Industries"
              onChange={handleMainCategoryChange}
              error={!!errors.mainCategory}
            >
              {categories.map((category) => (
                <MenuItem key={category.name} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {errors.mainCategory && (
              <FormHelperText error>{errors.mainCategory}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="medium" disabled={!isEditing}>
            <InputLabel>Main Category</InputLabel>
            <Select
              value={selectedCategory.sub || ""}
              label="Main Category"
              onChange={handleSubCategoryChange}
              error={!!errors.subCategory}
            >
              {selectedCategory.main &&
                categories
                  .find((cat) => cat.name === selectedCategory.main)
                  ?.children?.map((subCategory) => (
                    <MenuItem key={subCategory.name} value={subCategory.name}>
                      {subCategory.name}
                    </MenuItem>
                  ))}
            </Select>
            {errors.subCategory && (
              <FormHelperText error>{errors.subCategory}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="medium" disabled={!isEditing}>
            <InputLabel>Sub Category</InputLabel>
            <Select
              value={selectedCategory.child || ""}
              label="Sub Category"
              onChange={handleChildCategoryChange}
              error={!!errors.childCategory}
            >
              {selectedCategory.sub &&
                categories
                  .find((cat) => cat.name === selectedCategory.main)
                  ?.children?.find((sub) => sub.name === selectedCategory.sub)
                  ?.children?.map((child, index) => (
                    <MenuItem key={index} value={child}>
                      {child}
                    </MenuItem>
                  ))}
            </Select>
            {errors.childCategory && (
              <FormHelperText error>{errors.childCategory}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>
     
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: "#ff9800" }}>
        Establishment & Franchise year Details
      </Typography>

      <Grid container spacing={2} sx={{
        display: "grid",
        gridTemplateColumns: { md: "repeat(4, 1fr)", xs: "1fr" },
      }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Autocomplete
            freeSolo
            disabled={!isEditing}
            options={Array.from(
              { length: 226 },
              (_, i) => String(new Date().getFullYear() - i)
            )}
            value={data.establishedYear ? String(data.establishedYear) : null}
            getOptionLabel={(option) => option}
            onChange={(event, newValue) => {
              handleChange({
                target: {
                  name: "establishedYear",
                  value: newValue ? Number(newValue) : ""
                }
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Year Commenced Operations"
                variant="outlined"
                size="medium"
                required
                error={!!errors.establishedYear}
                helperText={errors.establishedYear && (
                  <Typography variant="caption" color="error">
                    {errors.establishedYear}
                  </Typography>
                )}
                inputProps={{
                  ...params.inputProps,
                  type: "number",
                  min: new Date().getFullYear() - 225,
                  max: new Date().getFullYear()
                }}
              />
            )}
            PaperComponent={({ children }) => (
              <Paper
                sx={{
                  width: 390,
                  maxHeight: 300,
                  "& .MuiAutocomplete-listbox": {
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "4px",
                    padding: "4px"
                  }
                }}
              >
                {children}
              </Paper>
            )}
            renderOption={(props, option) => (
              <MenuItem
                {...props}
                key={option}
                sx={{
                  minWidth: 0,
                  padding: "6px 4px",
                  display: "flex",
                  justifyContent: "center"
                }}
              >
                {option}
              </MenuItem>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Autocomplete
            freeSolo
            disabled={!isEditing}
            options={Array.from(
              { length: 226 },
              (_, i) => String(new Date().getFullYear() - i)
            )}
            value={data.franchiseSinceYear ? String(data.franchiseSinceYear) : null}
            getOptionLabel={(option) => option}
            onChange={(event, newValue) => {
              handleChange({
                target: {
                  name: "franchiseSinceYear",
                  value: newValue ? Number(newValue) : ""
                }
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Year Commenced Franchising"
                variant="outlined"
                size="medium"
                required
                error={!!errors.franchiseSinceYear}
                helperText={errors.franchiseSinceYear && (
                  <Typography variant="caption" color="error">
                    {errors.franchiseSinceYear}
                  </Typography>
                )}
                inputProps={{
                  ...params.inputProps,
                  type: "number",
                  min: new Date().getFullYear() - 225,
                  max: new Date().getFullYear()
                }}
              />
            )}
            PaperComponent={({ children }) => (
              <Paper
                sx={{
                  width: 390,
                  maxHeight: 300,
                  "& .MuiAutocomplete-listbox": {
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "4px",
                    padding: "4px"
                  }
                }}
              >
                {children}
              </Paper>
            )}
            renderOption={(props, option) => (
              <MenuItem
                {...props}
                key={option}
                sx={{
                  minWidth: 0,
                  padding: "6px 4px",
                  display: "flex",
                  justifyContent: "center"
                }}
              >
                {option}
              </MenuItem>
            )}
          />
        </Grid>
      </Grid>

    {/* Franchise Network */}
<Typography variant="h6" fontWeight={700} sx={{ color: "#ff9800" }}>
  Franchise Network
</Typography>

<Grid container spacing={2} sx={{
  mt: 3,
  display: "grid",
  gridTemplateColumns: { md: "repeat(4, 1fr)", xs: "1fr" },
}}>
  <Grid item xs={12} sm={6} md={2.4}>
    <Autocomplete
      freeSolo
      disabled={!isEditing}
      options={Array.from({ length: 10001 }, (_, i) => String(i))}
      value={data.companyOwnedOutlets ? String(data.companyOwnedOutlets) : "0"}
      getOptionLabel={(option) => option}
      onChange={(event, newValue) => {
        handleChange({
          target: {
            name: "companyOwnedOutlets",
            value: newValue ? Number(newValue) : 0
          }
        });
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Company Owned Outlets"
          variant="outlined"
          size="medium"
          required
          error={!!errors.companyOwnedOutlets}
          helperText={errors.companyOwnedOutlets && (
            <Typography variant="caption" color="error">
              {errors.companyOwnedOutlets}
            </Typography>
          )}
          inputProps={{
            ...params.inputProps,
            type: "number",
            min: 0,
            max: 10000
          }}
        />
      )}
      PaperComponent={({ children }) => (
        <Paper
          sx={{
            width: 390,
            maxHeight: 300,
            "& .MuiAutocomplete-listbox": {
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "4px",
              padding: "4px"
            }
          }}
        >
          {children}
        </Paper>
      )}
      renderOption={(props, option) => (
        <MenuItem
          {...props}
          key={option}
          sx={{
            minWidth: 0,
            padding: "6px 4px",
            display: "flex",
            justifyContent: "center"
          }}
        >
          {option}
        </MenuItem>
      )}
    />
  </Grid>

  <Grid item xs={12} sm={6} md={2.4}>
    <Autocomplete
      freeSolo
      disabled={!isEditing}
      options={Array.from({ length: 10001 }, (_, i) => String(i))}
      value={data.franchiseOutlets ? String(data.franchiseOutlets) : "0"}
      getOptionLabel={(option) => option}
      onChange={(event, newValue) => {
        handleChange({
          target: {
            name: "franchiseOutlets",
            value: newValue ? Number(newValue) : 0
          }
        });
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Franchise Outlets"
          variant="outlined"
          size="medium"
          required
          error={!!errors.franchiseOutlets}
          helperText={errors.franchiseOutlets && (
            <Typography variant="caption" color="error">
              {errors.franchiseOutlets}
            </Typography>
          )}
          inputProps={{
            ...params.inputProps,
            type: "number",
            min: 0,
            max: 10000
          }}
        />
      )}
      PaperComponent={({ children }) => (
        <Paper
          sx={{
            width: 390,
            maxHeight: 300,
            "& .MuiAutocomplete-listbox": {
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "4px",
              padding: "4px"
            }
          }}
        >
          {children}
        </Paper>
      )}
      renderOption={(props, option) => (
        <MenuItem
          {...props}
          key={option}
          sx={{
            minWidth: 0,
            padding: "6px 4px",
            display: "flex",
            justifyContent: "center"
          }}
        >
          {option}
        </MenuItem>
      )}
    />
  </Grid>

  <Grid item xs={12} sm={6} md={2.4}>
    <TextField
      fullWidth
      label="Total Outlets"
      name="totalOutlets"
      value={data.totalOutlets || ""}
      type="number"
      InputProps={{ readOnly: true }}
      variant="filled"
      error={!!errors.totalOutlets}
      helperText={errors.totalOutlets}
      required
      disabled
    />
  </Grid>
</Grid>

      {/* Franchise Details Section */}
      <Typography variant="h6" fontWeight={700} sx={{ mt: 2, color: "#ff9800" }}>
        Franchise Business Models
      </Typography>

      {errors.fico && typeof errors.fico === "string" && (
        <Typography color="error" sx={{ mb: 2 }}>
          {errors.fico}
        </Typography>
      )}

      {/* Current FICO Model Form - Only show when editing */}
      {isEditing && (
        <Grid container spacing={2} sx={{
          display: "grid",
          gridTemplateColumns: { md: "repeat(4, 1fr)", xs: "1fr" },
          gap: 2,
          mb: 2,
          mt: 2,
        }}>
          {/* Column 1 - Franchise Model */}
          <Grid item>
            <FormControl fullWidth error={!!errors.franchiseModel} required size="medium">
              <InputLabel>Franchise Model</InputLabel>
              <Select
                value={currentFicoModel.franchiseModel}
                onChange={handleFicoChange}
                name="franchiseModel"
                label="Franchise Model"
              >
                {franchiseModels.map((model) => (
                  <MenuItem key={model} value={model}>
                    {model}
                  </MenuItem>
                ))}
              </Select>
              {errors.franchiseModel && (
                <FormHelperText error>{errors.franchiseModel}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Column 2 - Franchise Type */}
          <Grid item>
            <FormControl fullWidth error={!!errors.franchiseType} required size="medium">
              <InputLabel>Franchise Type</InputLabel>
              <Select
                value={currentFicoModel.franchiseType}
                onChange={handleFicoChange}
                name="franchiseType"
                label="Franchise Type*"
              >
                {franchiseTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {errors.franchiseType && (
                <FormHelperText error>{errors.franchiseType}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Column 3 - Investment Range */}
          <Grid item>
            <FormControl fullWidth error={!!errors.investmentRange} required size="medium">
              <InputLabel>Investment Range</InputLabel>
              <Select
                value={currentFicoModel.investmentRange}
                onChange={handleFicoChange}
                name="investmentRange"
                label="Investment Range*"
              >
                {investmentRanges.map((range) => (
                  <MenuItem key={range.value} value={range.value}>
                    {range.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.investmentRange && (
                <FormHelperText error>{errors.investmentRange}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Column 4 - Area Required */}
          <Grid item>
            <FormControl fullWidth size="medium" required error={!!errors.areaRequired}>
              <InputLabel>Area Required</InputLabel>
              <Select
                label="Area Required"
                name="areaRequired"
                value={currentFicoModel.areaRequired || ""}
                onChange={handleFicoChange}
                endAdornment={
                  <InputAdornment position="end" sx={{ mr: 2 }}>
                    Sq.Ft
                  </InputAdornment>
                }
              >
                <MenuItem value="No Space Required">No Space Required</MenuItem>
                <MenuItem value="100-200 Sq. Ft.">100-200 Sq. Ft.</MenuItem>
                <MenuItem value="200-500 Sq. Ft.">200-500 Sq. Ft.</MenuItem>
                <MenuItem value="500-1,000 Sq. Ft.">500-1,000 Sq. Ft.</MenuItem>
                <MenuItem value="1,000-2,000 Sq. Ft.">
                  1,000-2,000 Sq. Ft.
                </MenuItem>
                <MenuItem value="2,000-3,000 Sq. Ft.">
                  2,000-3,000 Sq. Ft.
                </MenuItem>
                <MenuItem value="3,000-5,000 Sq. Ft.">
                  3,000-5,000 Sq. Ft.
                </MenuItem>
                <MenuItem value="5,000-7,000 Sq. Ft.">
                  5,000-7,000 Sq. Ft.
                </MenuItem>
                <MenuItem value="7,000-10,000 Sq. Ft.">
                  7,000-10,000 Sq. Ft.
                </MenuItem>
                <MenuItem value="10,000-15,000 Sq. Ft.">
                  10,000-15,000 Sq. Ft.
                </MenuItem>
              </Select>
              {errors.areaRequired && (
                <FormHelperText error>{errors.areaRequired}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Column 5 agreementPeriod */}
          <Grid item>
            <FormControl fullWidth error={!!errors.agreementPeriod} required size="medium">
              <InputLabel>Agreement Period </InputLabel>
              <Select
                label="Agreement Period "
                name="agreementPeriod"
                value={currentFicoModel.agreementPeriod || ""}
                onChange={handleFicoChange}
                renderValue={(selected) => (selected ? `${selected} ` : "")}
                endAdornment={
                  <InputAdornment position="end" sx={{ mr: 2 }}>
                    Years
                  </InputAdornment>
                }
                MenuProps={{
                  PaperProps: {
                    sx: {
                      width: 250,
                      maxHeight: 300,
                      "& .MuiList-root": {
                        display: "grid",
                        gridTemplateColumns: "repeat(5, 1fr)",
                        gap: "4px",
                        padding: "4px",
                      },
                    },
                  },
                }}
              >
                {Array.from({ length: 50 }, (_, i) => i + 1).map((year) => (
                  <MenuItem
                    key={year}
                    value={year}
                    sx={{
                      minWidth: 0,
                      padding: "6px 4px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {year}
                  </MenuItem>
                ))}
              </Select>
              {errors.agreementPeriod && (
                <FormHelperText error>{errors.agreementPeriod}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Column 6 - Franchise Fee */}
          <Grid item>
            <FormControl fullWidth>
              <TextField
                fullWidth
                size="medium"
                label="Franchise Fee"
                name="franchiseFee"
                value={currentFicoModel.franchiseFee}
                onChange={handleFicoChange}
                error={!!errors.franchiseFee}
                helperText={errors.franchiseFee}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Select
                        value={currentFicoModel.franchiseFeeUnit}
                        onChange={handleFeeUnitChange('franchiseFee')}
                        sx={{
                          "& .MuiSelect-select": {
                            padding: "8px 8px",
                            fontSize: "0.875rem",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                        }}
                      >
                        {otherFeeUnits.map((unit) => (
                          <MenuItem 
                            key={unit.value} 
                            value={unit.value}
                          >
                            {unit.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </InputAdornment>
                  ),
                  readOnly: noFees.franchiseFee,
                }}
                required
                disabled={noFees.franchiseFee}
              />
            </FormControl>
          </Grid>

          {/* Column 7 - Interior Cost */}
          <Grid item>
            <FormControl fullWidth>
              <TextField
                fullWidth
                size="medium"
                label="Interior Cost"
                name="interiorCost"
                value={currentFicoModel.interiorCost}
                onChange={handleFicoChange}
                error={!!errors.interiorCost}
                helperText={errors.interiorCost}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Select
                        value={currentFicoModel.interiorCostUnit}
                        onChange={handleFeeUnitChange('interiorCost')}
                        sx={{
                          "& .MuiSelect-select": {
                            padding: "8px 8px",
                            fontSize: "0.875rem",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                        }}
                      >
                        {otherFeeUnits.map((unit) => (
                          <MenuItem 
                            key={unit.value} 
                            value={unit.value}
                          >
                            {unit.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </InputAdornment>
                  ),
                  readOnly: noFees.interiorCost,
                }}
                required
                disabled={noFees.interiorCost}
              />
            </FormControl>
          </Grid>

          {/* Column 8 - Stock Investment */}
          <Grid item>
            <FormControl fullWidth>
              <TextField
                fullWidth
                size="medium"
                label="Stock Investment"
                name="stockInvestment"
                value={currentFicoModel.stockInvestment}
                onChange={handleFicoChange}
                error={!!errors.stockInvestment}
                helperText={errors.stockInvestment}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Select
                        value={currentFicoModel.stockInvestmentUnit}
                        onChange={handleFeeUnitChange('stockInvestment')}
                        sx={{
                          "& .MuiSelect-select": {
                            padding: "8px 8px",
                            fontSize: "0.875rem",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                        }}
                      >
                        {otherFeeUnits.map((unit) => (
                          <MenuItem 
                            key={unit.value} 
                            value={unit.value}
                          >
                            {unit.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </InputAdornment>
                  ),
                  readOnly: noFees.stockInvestment,
                }}
                required
                disabled={noFees.stockInvestment}
              />
            </FormControl>
          </Grid>

          {/* Column 9 - Other Cost */}
          <Grid item>
            <FormControl fullWidth>
              <TextField
                fullWidth
                size="medium"
                label="Required Additional Cost"
                name="otherCost"
                value={currentFicoModel.otherCost}
                onChange={handleFicoChange}
                error={!!errors.otherCost}
                helperText={errors.otherCost}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Select
                        value={currentFicoModel.otherCostUnit}
                        onChange={handleFeeUnitChange('otherCost')}
                        sx={{
                          "& .MuiSelect-select": {
                            padding: "8px 8px",
                            fontSize: "0.875rem",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                        }}
                      >
                        {otherFeeUnits.map((unit) => (
                          <MenuItem 
                            key={unit.value} 
                            value={unit.value}
                          >
                            {unit.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </InputAdornment>
                  ),
                  readOnly: noFees.otherCost,
                }}
                required
                disabled={noFees.otherCost}
              />
            </FormControl>
          </Grid>

          {/* Column 10 - Required Investment Capital */}
          <Grid item>
            <FormControl fullWidth>
              <TextField
                fullWidth
                size="medium"
                label="Annual Working Capital"
                name="requireWorkingCapital"
                value={currentFicoModel.requireWorkingCapital}
                onChange={handleFicoChange}
                error={!!errors.requireWorkingCapital}
                helperText={errors.requireWorkingCapital}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Select
                        value={currentFicoModel.requireWorkingCapitalUnit}
                        onChange={handleFeeUnitChange('requireWorkingCapital')}
                        sx={{
                          "& .MuiSelect-select": {
                            padding: "8px 8px",
                            fontSize: "0.875rem",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                        }}
                      >
                        {otherFeeUnits.map((unit) => (
                          <MenuItem 
                            key={unit.value} 
                            value={unit.value}
                          >
                            {unit.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </InputAdornment>
                  ),
                  readOnly: noFees.requireWorkingCapital,
                }}
                required
                disabled={noFees.requireWorkingCapital}
              />
            </FormControl>
          </Grid>

          {/* Column 11 - Royalty Fee */}
          <Grid item>
            <FormControl fullWidth>
              <TextField
                fullWidth
                size="medium"
                label="Royalty Fee"
                name="royaltyFee"
                value={currentFicoModel.royaltyFee}
                onChange={handleFicoChange}
                error={!!errors.royaltyFee}
                helperText={errors.royaltyFee}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Select
                        value={currentFicoModel.royaltyFeeUnit}
                        onChange={handleFeeUnitChange('royaltyFee')}
                        sx={{
                          "& .MuiSelect-select": {
                            padding: "8px 8px",
                            fontSize: "0.875rem",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                        }}
                      >
                        {royaltyFeeUnits.map((unit) => (
                          <MenuItem 
                            key={unit.value} 
                            value={unit.value}
                          >
                            {unit.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </InputAdornment>
                  ),
                  readOnly: noFees.royaltyFee,
                }}
                required
                disabled={noFees.royaltyFee}
              />
            </FormControl>
          </Grid>

          {/* Column 12 - Break Even */}
          <Grid item>
            <FormControl fullWidth size="medium" required error={!!errors.breakEven}>
              <InputLabel>Break Even (months)</InputLabel>
              <Select
                label="Break Even (months)*"
                name="breakEven"
                value={currentFicoModel.breakEven || ""}
                onChange={handleFicoChange}
              >
                <MenuItem value="0 to 6 Months">0 to 6 Months</MenuItem>
                <MenuItem value="6 to 12 Months">6 to 12 Months</MenuItem>
                <MenuItem value="12 to 18 Months">12 to 18 Months</MenuItem>
                <MenuItem value="18 to 24 Months">18 to 24 Months</MenuItem>
                <MenuItem value="24 to 36 Months">24 to 36 Months</MenuItem>
                <MenuItem value="36 to 48 Months">36 to 48 Months</MenuItem>
                <MenuItem value="48 to 60 Months">48 to 60 Months</MenuItem>
              </Select>
              {errors.breakEven && (
                <FormHelperText error>{errors.breakEven}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Column 13 - ROI */}
          <Grid item>
            <FormControl fullWidth size="medium" required error={!!errors.roi}>
              <InputLabel>ROI (%)</InputLabel>
              <Select
                label="ROI (%)"
                name="roi"
                value={currentFicoModel.roi || ""}
                onChange={handleFicoChange}
                renderValue={(selected) => (selected ? `${selected} %` : "")}
                disabled={noFees.roi}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      width: 390,
                      maxHeight: 300,
                      "& .MuiList-root": {
                        display: "grid",
                        gridTemplateColumns: "repeat(10, 1fr)",
                        gap: "4px",
                        padding: "4px",
                      },
                    },
                  },
                }}
              >
                {Array.from({ length: 99 }, (_, i) => (
                  <MenuItem
                    key={i + 1}
                    value={`${i + 1}`}
                    sx={{
                      minWidth: 0,
                      padding: "6px 4px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {i + 1}
                  </MenuItem>
                ))}
              </Select>
              {errors.roi && <FormHelperText error>{errors.roi}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* Column 14 - PayBack Period */}
          <Grid item>
            <TextField
              fullWidth
              size="medium"
              label="PayBack Period"
              name="payBackPeriod"
              value={currentFicoModel.payBackPeriod}
              onChange={handleFicoChange}
              error={!!errors.payBackPeriod}
              helperText={errors.payBackPeriod}
              InputProps={{
                readOnly: true,
              }}
              required
              disabled={noFees.roi}
            />
          </Grid>

          <Grid item>
            <FormControl fullWidth size="medium" required error={!!errors.marginOnSales}>
              <InputLabel>MarginOnSales (%)</InputLabel>
              <Select
                label="Margin ON Sales (%)"
                name="marginOnSales"
                value={currentFicoModel.marginOnSales || ""}
                onChange={handleFicoChange}
                renderValue={(selected) => (selected ? `${selected} %` : "")}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      width: 390,
                      maxHeight: 300,
                      "& .MuiList-root": {
                        display: "grid",
                        gridTemplateColumns: "repeat(10, 1fr)",
                        gap: "4px",
                        padding: "4px",
                      },
                    },
                  },
                }}
              >
                {Array.from({ length: 99 }, (_, i) => (
                  <MenuItem
                    key={i + 1}
                    value={`${i + 1}`}
                    sx={{
                      minWidth: 0,
                      padding: "6px 4px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {i + 1}
                  </MenuItem>
                ))}
              </Select>
              {errors.marginOnSales && (
                <FormHelperText error>{errors.marginOnSales}</FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>
      )}

      {/* Add Button - Only show when editing */}
      {isEditing && (
        <Grid item xs={12} mt={1} sx={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button
            variant="contained"
            aria-label="add-fico-model"
            onClick={handleAddFicoModel}
            size="large"
            sx={{
              backgroundColor: '#7ad03a',
              color: "#fff",
              "&:hover": { backgroundColor: "#388e3c" },
              padding: "8px 70px",
            }}
          >
            {data.fico?.length > 0 ? "Add more Models" : "Add Models"}
          </Button>
        </Grid>
      )}

      {data.fico?.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
              Saved Franchise Models
            </Typography>

            <Box sx={{ width: "100%", overflowX: "auto", margin: "0 auto" }}>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table
                  stickyHeader
                  aria-label="saved franchise models"
                  size="medium"
                  sx={{
                    fontSize: "1rem",
                    "& th, & td": {
                      padding: "12px 16px",
                      fontSize: "1rem",
                      whiteSpace: "nowrap"
                    }
                  }}
                >
                  <TableHead>
                    <TableRow>
                      {[
                        "Industries", "Main Category", "Sub Category", 
                        "Established Year", "Franchise Since Year",
                        "Company Owned", "Franchise Outlets", "Total Outlets",
                        "Model Type", "Franchise Type", "Investment Range", "Area Required",
                        "Agreement Period", "Franchise Fee", "Interior Cost", "Stock Cost",
                        "Additional Cost", "Annual Working Capital", "Royalty Fee", "Break Even",
                        "ROI (%)", "Payback", "Margin On Sales", ...(isEditing ? ["Actions"] : [])
                      ].map((label, i) => (
                        <TableCell
                          key={i}
                          sx={{
                            fontWeight: "bold",
                            backgroundColor: "#f5f5f5"
                          }}
                        >
                          {label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {data.fico?.map((model, index) => (
                      <TableRow
                        key={index}
                        hover
                        sx={{ "&:last-child td, &:last-child th": { border: 0 }, fontSize: "0.75rem" }}
                      >
                        {/* Brand Categories */}
                        <TableCell>{data.brandCategories?.main || ""}</TableCell>
                        <TableCell>{data.brandCategories?.sub || ""}</TableCell>
                        <TableCell>{data.brandCategories?.child || ""}</TableCell>
                        
                        {/* Establishment & Franchise Year */}
                        <TableCell>{data.establishedYear || ""}</TableCell>
                        <TableCell>{data.franchiseSinceYear || ""}</TableCell>
                        
                        {/* Franchise Network */}
                        <TableCell>{data.companyOwnedOutlets || ""}</TableCell>
                        <TableCell>{data.franchiseOutlets || ""}</TableCell>
                        <TableCell>{data.totalOutlets || ""}</TableCell>
                        
                        {/* Franchise Model Details */}
                        <TableCell>{model.franchiseModel}</TableCell>
                        <TableCell>{model.franchiseType}</TableCell>
                        <TableCell>{model.investmentRange}</TableCell>
                        <TableCell>{model.areaRequired}</TableCell>
                        <TableCell>{model.agreementPeriod}</TableCell>
                        <TableCell>{formatCurrency(model.franchiseFee)}</TableCell>
                        <TableCell>{formatCurrency(model.interiorCost)}</TableCell>
                        <TableCell>{formatCurrency(model.stockInvestment)}</TableCell>
                        <TableCell>{formatCurrency(model.otherCost)}</TableCell>
                        <TableCell>{formatCurrency(model.requireWorkingCapital)}</TableCell>
                        <TableCell>
                          {model.royaltyFee && model.royaltyFee !== "No Fee" 
                            ? `${model.royaltyFee}${model.royaltyFeeUnit === "%" ? "%" : ""}`
                            : model.royaltyFee}
                        </TableCell>
                        <TableCell>{model.breakEven}</TableCell>
                        <TableCell>{model.roi}%</TableCell>
                        <TableCell>{model.payBackPeriod}</TableCell>
                        <TableCell>{model.marginOnSales}%</TableCell>
                        {isEditing && (
                          <TableCell>
                            <IconButton
                              onClick={() => handleDeleteFicoModel(index)}
                              color="error"
                              size="small"
                              aria-label="delete"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Box>
      )}

      <Divider
        sx={{
          my: 2,
          mt: 4,
          backgroundColor: "rgba(0, 0, 0, 0.08)",
          height: "1px",
        }}
      />

      {/* Support and Training Section */}
      <Grid item xs={12}>
        <Typography variant="h6" color="#ff9800" sx={{ fontWeight: "bold" }}>
          Support and Training
        </Typography>

        <Grid gap={1} item xs={12}>
          {/* Financial Operating Procedure */}
          <Grid item xs={12}>
            <FormControl
              component="fieldset"
              fullWidth
              error={!!errors.aidFinancing}
              required
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { md: "center" },
                gap: 1,
                p: 1,
              }}
              disabled={!isEditing}
            >
              <Box sx={{ mr: { md: "220px" }, minWidth: { md: "300px" } }}>
                <FormLabel
                  component="legend"
                  sx={{
                    fontWeight: "bold",
                    color: errors.aidFinancing ? "error.main" : "text.primary",
                  }}
                >
                  Do you provide aid in financing?
                </FormLabel>
              </Box>
              <RadioGroup row sx={{ display: "flex", ml:5, gap: 15 }}>
                {aidFinancing.map((type) => (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={
                      <Radio
                        color={errors.aidFinancing ? "error" : "primary"}
                      />
                    }
                    label={type}
                    checked={data.aidFinancing === type}
                    onChange={() =>
                      handleChange({
                        target: { name: "aidFinancing", value: type },
                      })
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
            {errors.aidFinancing && (
                <FormHelperText
                  error
                  sx={{ ml: { md: 2 }, mt: { xs: 0, md: 0 } }}
                >
                  {errors.aidFinancing}
                </FormHelperText>
              )}
          </Grid>

          <Grid item xs={12}>
            <FormControl
              component="fieldset"
              fullWidth
              error={!!errors.franchiseDevelopment}
              required
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { md: "center" },
                gap: 1,
                p: 1,
              }}
              disabled={!isEditing}
            >
              <Box sx={{ mr: { md: "77px" }, minWidth: { md: "300px" } }}>
                <FormLabel
                  component="legend"
                  sx={{
                    fontWeight: "bold",
                    color: errors.franchiseDevelopment
                      ? "error.main"
                      : "text.primary",
                  }}
                >
                  Would you like consultation for franchise development?
                </FormLabel>
              </Box>
              <RadioGroup row sx={{ display: "flex", ml: 5, gap: 15 }}>
                {aidFinancing.map((type) => (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={
                      <Radio
                        color={
                          errors.franchiseDevelopment ? "error" : "primary"
                        }
                      />
                    }
                    label={type}
                    checked={data.franchiseDevelopment === type}
                    onChange={() =>
                      handleChange({
                        target: { name: "franchiseDevelopment", value: type },
                      })
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
              {errors.franchiseDevelopment && (
                <FormHelperText
                  error
                  sx={{ ml: { md: 2 }, mt: { xs: 0, md: 0 } }}
                >
                  {errors.franchiseDevelopment}
                </FormHelperText>
              )}
          </Grid>

          <Grid item xs={12}>
            <FormControl
              component="fieldset"
              fullWidth
              error={!!errors.consultationOrAssistance}
              required
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { md: "center" },
                gap: 1,
                p: 1,
              }}
              disabled={!isEditing}
            >
              <Box sx={{ mr: { md: "6px" }, minWidth: { md: "300px" } }}>
                <FormLabel
                  component="legend"
                  sx={{
                    fontWeight: "bold",
                    color: errors.consultationOrAssistance
                      ? "error.main"
                      : "text.primary",
                  }}
                >
                  Would you like consultation for marketing recruitment
                  franchise?
                </FormLabel>
              </Box>
              <RadioGroup row sx={{ display: "flex", ml: 5, gap: 15 }}>
                {aidFinancing.map((type) => (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={
                      <Radio
                        color={
                          errors.consultationOrAssistance ? "error" : "primary"
                        }
                      />
                    }
                    label={type}
                    checked={data.consultationOrAssistance === type}
                    onChange={() =>
                      handleChange({
                        target: {
                          name: "consultationOrAssistance",
                          value: type,
                        },
                      })
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
            {errors.consultationOrAssistance && (
                <FormHelperText
                  error
                  sx={{ ml: { md: 2 }, mt: { xs: 0, md: 0 } }}
                >
                  {errors.consultationOrAssistance}
                </FormHelperText>
              )}
          </Grid>

        {/* Training Support - Checkbox Group */}
        <Grid item xs={12}>
          <FormControl
            component="fieldset"
            fullWidth
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              p: 1,
            }}
            disabled={!isEditing}
          >
            <Box sx={{ 
              minWidth: { md: "210px" },
              alignSelf: "flex-start",
              pt: 1.2,
              mr:{md:6}
            }}>
              <FormLabel
                component="legend"
                sx={{
                  fontWeight: "bold",
                }}
              >
                Training Support Provider:
              </FormLabel>
            </Box>
            
            <FormGroup
              sx={{ ml: { md: 5 },
                display: "flex",
                flexDirection: "row",
              }}
            >
              {[
                "Outlet Setup",
                "Staff Training",
                "Staff Recruitment", 
                "Operations Support",
                "Marketing Support",
              ].map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={data.trainingSupport?.includes(option) || false}
                      onChange={(e) => {
                        const newValue = e.target.checked
                          ? [...(data.trainingSupport || []), option]
                          : (data.trainingSupport || []).filter(v => v !== option);
                        handleChange({
                          target: { name: "trainingSupport", value: newValue },
                        });
                      }}
                      name="trainingSupport"
                      color="primary"
                    />
                  }
                  label={ 
                    <Typography variant="body2" sx={{ width: "145px" }}>
                      {option}
                    </Typography>
                  }
                  sx={{
                    minWidth: "60px",
                  }}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Typography
          variant="h6"
          color="#ff9800"
          sx={{ mb: 2, mt: 4, fontWeight: "bold" }}
        >
          Brand Description
        </Typography>

        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
            Unique Selling Points (USP):
            <Tooltip
              title={
                <span style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>
                  Highlight what makes your brand or business unique. Try to list
                  2–5 bullet points that make you stand out.
                </span>
              }
              placement="right-start"
              arrow
              enterTouchDelay={0}
            >
              <IconButton
                size="small"
                aria-label="USP information"
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
            {errors.uniqueSellingPoints && typeof errors.uniqueSellingPoints === 'string' && (
              <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                {errors.uniqueSellingPoints}
              </Typography>
            )}
          </Typography>

          {/* USP Input and Add Button - Only show when editing */}
          {isEditing && (
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                value={currentUSP}
                onChange={(e) => setCurrentUSP(e.target.value)}
                placeholder="Add a unique selling point"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddUSP();
                  }
                }}
                error={!!errors.uniqueSellingPoints}
                helperText={
                  errors.uniqueSellingPoints && typeof errors.uniqueSellingPoints === 'string' 
                    ? errors.uniqueSellingPoints 
                    : null
                }
              />
              <Button
                variant="contained"
                aria-label="add-usp"
                onClick={handleAddUSP}
                disabled={!currentUSP.trim()}
                sx={{
                  backgroundColor: '#7ad03a',
                  color: "white",
                  "&:hover": { backgroundColor: "#388e3c" },
                  py:2,
                  px:6
                }}
              >
                Add
              </Button>
            </Box>
          )}

          {/* Display added USPs */}
          {data.uniqueSellingPoints?.length > 0 && (
            <Paper sx={{ p: 2, mb: 3, border: "1px solid #e0e0e0" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                Added USPs:
              </Typography>
              <List dense sx={{ maxHeight: 200, overflow: "auto" }}>
                {data.uniqueSellingPoints.map((usp, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      isEditing && (
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleRemoveUSP(index)}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                      )
                    }
                    sx={{
                      py: 0.5,
                      borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                      "&:last-child": { borderBottom: "none" },
                    }}
                  >
                    <ListItemText
                      primary={`${index + 1}. ${usp}`}
                      primaryTypographyProps={{ variant: "body2" }}
                      secondary={
                        errors[`uniqueSellingPoints[${index}]`] && (
                          <Typography variant="caption" color="error">
                            {errors[`uniqueSellingPoints[${index}]`]}
                          </Typography>
                        )
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Grid>
        
        <Box sx={{ mt: 2, mb: 4 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
            Brand Description:
            {errors.brandDescription && (
              <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                {errors.brandDescription}
              </Typography>
            )}
          </Typography>
          {/* <Editor
            apiKey="ax88nfnpet4akyi1bpe4gmsnhxabsp2ia0qoitvfd4qjki8v"
            value={data.brandDescription || ""}
            init={{
              height: 400,
              menubar: true,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image',
                'charmap', 'preview', 'anchor', 'searchreplace',
                'visualblocks', 'code', 'fullscreen', 'insertdatetime',
                'media', 'table', 'help'
              ],
              toolbar:
                "undo redo | formatselect | bold italic backcolor | " +
                "alignleft aligncenter alignright alignjustify | " +
                "bullist numlist outdent indent | removeformat | help | image",
              images_upload_url: "/api/upload-image",
              automatic_uploads: true,
            }}
            onEditorChange={handleDescriptionChange}
            disabled={!isEditing}
          /> */}
        </Box>
      </Grid>
    </Box>
  );
};

export default FranchiseDetailsControl;