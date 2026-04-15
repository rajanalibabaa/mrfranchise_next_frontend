"use client";
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  TextField,
  InputAdornment,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  DialogContentText,
  Alert,
  Chip,
    Accordion,          
  AccordionSummary, 
  AccordionDetails 
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';import axios from "axios";  
import Snackbar from "@mui/material/Snackbar"; 
import { getToken } from "@/Utils/autherId";


const PaymentBrandUpdate = ({ 
  uuid: propUuid,
  isEditing = false,
  onDataLoaded = () => {}
}) => {
  const [effectiveUuid, setEffectiveUuid] = useState(null);
  const [data, setData] = useState({
    fico: [],
    brandCategories: {},
    establishedYear: '',
    franchiseSinceYear: '',
    companyOwnedOutlets: '',
    franchiseOutlets: '',
    totalOutlets: '',
    aidFinancing: '',
    franchiseDevelopment: '',
    consultationOrAssistance: '',
    trainingSupport: [],
    uniqueSellingPoints: [],
    brandDescription: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpSendError, setOtpSendError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [expanded, setExpanded] = useState("panel1");
  const [expansionData, setExpansionData] = useState({
  domesticLocations: [],
  internationalLocations: null
});
  const [saveStatus, setSaveStatus] = useState({
    loading: false,
    success: false,
    error: "",
  });

  // Initialize UUID
  useEffect(() => {
    const uuid = propUuid || 
                 localStorage.getItem('brandUUID') || 
                 localStorage.getItem('investorUUID');
    console.log('PaymentBrandUpdate - Using UUID:', uuid);
    setEffectiveUuid(uuid);
  }, [propUuid]);

  // Fetch data when effectiveUuid changes
  useEffect(() => {
    if (effectiveUuid) {
      fetchBrandData();
    } else {
      setLoading(false);
      setError('No UUID found. Please login again.');
    }
  }, [effectiveUuid]);

  // Fee unit options
  const royaltyFeeUnits = [
    { value: "select", label: "Select" },
    { value: "%", label: "%" },
    { value: "Thousands", label: "Thousands" },
    { value: "Lakhs", label: "Lakhs" },
    { value: "No Fee", label: "No Fee" },
  ];
  
  const otherFeeUnits = [
    { value: "select", label: "Select" },
    { value: "Thousands", label: "Thousands" },
    { value: "Lakhs", label: "Lakhs" },
    { value: "No Fee", label: "No Fee" },
  ];

  const franchiseTypes = [
    "Single Unit", "Multi Unit", "Master Franchise", "City Franchise",
    "Area Franchise", "District Franchise", "State Franchise",
  ];

  const franchiseModels = [
    "FOFO", "FOCO", "FICO", "COCO", "KIOSK", "SHOP IN SHOP", "CLOUD KITCHEN",
  ];

  const investmentRanges = [
    { label: "Below ₹50K", value: "Below - 50k" },
    { label: "₹50K - ₹2 Lakhs", value: "Rs. 50k - 2 Lakhs" },
    { label: "₹2 - ₹5 Lakhs", value: "Rs. 2 Lakhs - 5 Lakhs" },
    { label: "₹5 - ₹10 Lakhs", value: "Rs. 5 Lakhs - 10 Lakhs" },
    { label: "₹10 - ₹20 Lakhs", value: "Rs. 10 Lakhs - 20 Lakhs" },
    { label: "₹20 - ₹30 Lakhs", value: "Rs. 20 Lakhs - 30 Lakhs" },
    { label: "₹30 - ₹50 Lakhs", value: "Rs. 30 Lakhs - 50 Lakhs" },
    { label: "₹50 Lakhs - ₹1 Crore", value: "Rs. 50 Lakhs - 1 Crore" },
    { label: "₹1 - ₹2 Crores", value: "Rs. 1 Crore - 2 Crores" },
    { label: "₹2 - ₹5 Crores", value: "Rs. 2 Crore - 5 Crores" },
    { label: "Above ₹5 Crores", value: "Rs. 5 Crores - above" },
  ];

  // FICO form state
  const [currentFicoModel, setCurrentFicoModel] = useState({
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
  const handleAccordionChange = (panel) => (event, isExpanded) => {
  setExpanded(isExpanded ? panel : false);
};

  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // Function to fetch brand data - FIXED: Added setOriginalData in the main success block
  const fetchBrandData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/brandlisting/getBrandById/${effectiveUuid}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('API Response:', result);
      sessionStorage.setItem("investmentrange", JSON.stringify(result.data?.franchiseDetails?.fico[0]?.investmentRange || [])); 
      sessionStorage.setItem("domesticlocations", JSON.stringify(result.data?.expansionlocationdata?.expansionLocations?.domestic?.locations || [])); 
      if (result.success && result.data) {
        const brandData = result.data;
        const franchiseDetails = brandData.franchiseDetails || {};
        
        setData({
          fico: franchiseDetails.fico || [],
          brandCategories: franchiseDetails.brandCategories || {},
          establishedYear: franchiseDetails.establishedYear || '',
          franchiseSinceYear: franchiseDetails.franchiseSinceYear || '',
          companyOwnedOutlets: franchiseDetails.companyOwnedOutlets || '',
          franchiseOutlets: franchiseDetails.franchiseOutlets || '',
          totalOutlets: franchiseDetails.totalOutlets || '',
          aidFinancing: franchiseDetails.aidFinancing || '',
          franchiseDevelopment: franchiseDetails.franchiseDevelopment || '',
          consultationOrAssistance: franchiseDetails.consultationOrAssistance || '',
          trainingSupport: franchiseDetails.trainingSupport || [],
          uniqueSellingPoints: franchiseDetails.uniqueSellingPoints || [],
          brandDescription: franchiseDetails.brandDescription || ''
        });
     if (brandData.expansionlocationdata) {
  setExpansionData({
    domesticLocations: brandData.expansionlocationdata.expansionLocations?.domestic?.locations || [],
    internationalLocations: brandData.expansionlocationdata.expansionLocations?.international || null
  });
}
        // CRITICAL FIX: Set originalData here too!
        setOriginalData(brandData);
        console.log('OriginalData set with email:', brandData?.brandDetails?.email);
        
        onDataLoaded(brandData);
      } else if (result.data) {
        const brandData = result.data;
        const franchiseDetails = brandData.franchiseDetails || {};
        
        setData({
          fico: franchiseDetails.fico || [],
          brandCategories: franchiseDetails.brandCategories || {},
          establishedYear: franchiseDetails.establishedYear || '',
          franchiseSinceYear: franchiseDetails.franchiseSinceYear || '',
          companyOwnedOutlets: franchiseDetails.companyOwnedOutlets || '',
          franchiseOutlets: franchiseDetails.franchiseOutlets || '',
          totalOutlets: franchiseDetails.totalOutlets || '',
          aidFinancing: franchiseDetails.aidFinancing || '',
          franchiseDevelopment: franchiseDetails.franchiseDevelopment || '',
          consultationOrAssistance: franchiseDetails.consultationOrAssistance || '',
          trainingSupport: franchiseDetails.trainingSupport || [],
          uniqueSellingPoints: franchiseDetails.uniqueSellingPoints || [],
          brandDescription: franchiseDetails.brandDescription || ''
        });
        if (brandData.expansionlocationdata) {
        setExpansionData({
          domesticLocations: brandData.expansionlocationdata.expansionLocations?.domestic?.locations || [],
          internationalLocations: brandData.expansionlocationdata.expansionLocations?.international || null
        });
      }
        setOriginalData(brandData); 
        onDataLoaded(brandData);
        console.log('Data loaded despite message:', result.message);
      } else {
        throw new Error(result.message || 'Failed to fetch brand data');
      }
    } catch (err) {
      console.error('Error fetching brand data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const sendOtp = async () => {
    console.log('sendOtp called, originalData:', originalData);
    console.log('Email:', originalData?.brandDetails?.email);
    
    if (!originalData?.brandDetails?.email) {
      setOtpSendError("Email not found in profile.");
      return;
    }

    const email = originalData.brandDetails.email;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/otpverify/send-otp-email`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.token) {
        setOtpToken(response.data.token);
      }
      setOtpSent(true);
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleEditClick = async () => {
    console.log('handleEditClick called, originalData:', originalData);
    
    if (!originalData?.brandDetails?.email) {
      setOtpSendError("No email available for verification.");
      return;
    }

    setShowOtpDialog(true);
    setOtpSending(true);
    setOtpSendError("");
    setOtpSent(false);

    try {
      await sendOtp();
      setOtpSent(true);
    } catch (err) {
      setOtpSendError(err.message);
    } finally {
      setOtpSending(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setOtpError("Enter a valid 6-digit OTP");
      return;
    }

    setOtpVerifying(true);
    setOtpError("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/otpverify/verify-otp`,
        {
          identifier: originalData.brandDetails.email,
          otp,
          type: "email",
        },
        {
          headers: {
            Authorization: `Bearer ${otpToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success === true || response.data.message?.includes("verified successfully")) {
        setIsEditingMode(true);
        setShowOtpDialog(false);
        setOtp("");
      } else {
        setOtpError("Invalid or expired OTP.");
      }
    } catch (err) {
      setOtpError(err.response?.data?.error || "Verification failed");
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleSaveAllData = async () => {
    if (!effectiveUuid) {
      setSaveStatus({ loading: false, success: false, error: "UUID missing." });
      return;
    }

    setSaveStatus({ loading: true, success: false, error: "" });

    try {
      const payload = new FormData();
      payload.append(
        "franchiseDetails",
        JSON.stringify({
          fico: data.fico,
        })
      );

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/brandlisting/updateBrandListingByUUID/${effectiveUuid}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setSaveStatus({ loading: false, success: true, error: "" });
        fetchBrandData();
        setTimeout(() => {
          setSaveStatus(prev => ({ ...prev, success: false }));
        }, 3000);
      } else {
        throw new Error(response.data.message || "Update failed");
      }
    } catch (err) {
      setSaveStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || err.message || "Save failed.",
      });
    }
  };

  const handleArrayChange = (field, value) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Load edit data when editIndex changes
  useEffect(() => {
    if (editIndex !== null && data.fico && data.fico[editIndex]) {
      const model = data.fico[editIndex];

      const parseUnit = (value) => {
        if (!value) return "select";
        if (value === "No Fee") return "No Fee";
        if (value.endsWith("%")) return "%";
        if (value.endsWith("Thousands")) return "Thousands";
        if (value.endsWith("Lakhs")) return "Lakhs";
        return "select"; 
      };

      const parseValue = (value) => {
        if (!value || value === "No Fee") return "";
        return value
          .replace(/Thousands$/, "")
          .replace(/Lakhs$/, "")
          .replace(/%$/, "")
          .trim();
      };
      
      setCurrentFicoModel({
        investmentRange: model.investmentRange || "",
        areaRequired: model.areaRequired || "",
        franchiseModel: model.franchiseModel || "",
        franchiseType: model.franchiseType || "",
        franchiseFee: parseValue(model.franchiseFee) || "",
        franchiseFeeUnit: parseUnit(model.franchiseFee),
        royaltyFee: parseValue(model.royaltyFee) || "",
        royaltyFeeUnit: parseUnit(model.royaltyFee),
        interiorCost: parseValue(model.interiorCost) || "",
        interiorCostUnit: parseUnit(model.interiorCost),
        stockInvestment: parseValue(model.stockInvestment) || "",
        stockInvestmentUnit: parseUnit(model.stockInvestment),
        otherCost: parseValue(model.otherCost) || "",
        otherCostUnit: parseUnit(model.otherCost),
        roi: parseValue(model.roi) || "",
        payBackPeriod: model.payBackPeriod || "",
        breakEven: model.breakEven || "",
        requireWorkingCapital: parseValue(model.requireWorkingCapital) || "",
        requireWorkingCapitalUnit: parseUnit(model.requireWorkingCapital),
        marginOnSales: parseValue(model.marginOnSales) || "",
        agreementPeriod: model.agreementPeriod || "",
      });
      
      setNoFees({
        franchiseFee: model.franchiseFee === "No Fee",
        interiorCost: model.interiorCost === "No Fee",
        stockInvestment: model.stockInvestment === "No Fee",
        otherCost: model.otherCost === "No Fee",
        requireWorkingCapital: model.requireWorkingCapital === "No Fee",
        royaltyFee: model.royaltyFee === "No Fee",
        roi: model.roi === "No Fee",
      });
    }
  }, [editIndex, data.fico]);

  const handleFicoChange = (e) => {
    const { name, value } = e.target;
    if (noFees[name]) {
      return;
    }
    setCurrentFicoModel((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };
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
      setNoFees((prev) => ({
        ...prev,
        [field]: true,
      }));
      setCurrentFicoModel((prev) => ({
        ...prev,
        [field]: "No Fee",
        [`${field}Unit`]: "No Fee",
      }));
    } else if (value === "select") {
      setNoFees((prev) => ({
        ...prev,
        [field]: false,
      }));
      setCurrentFicoModel((prev) => ({
        ...prev,
        [field]: "",
        [`${field}Unit`]: "select",
      }));
    } else {
      setNoFees((prev) => ({
        ...prev,
        [field]: false,
      }));
      setCurrentFicoModel((prev) => ({
        ...prev,
        [`${field}Unit`]: value,
      }));
    }
  };

  const validateFicoModel = () => {
    const requiredFields = [
      "investmentRange", "areaRequired", "franchiseModel", "franchiseType",
      "agreementPeriod", "breakEven", "marginOnSales",
    ];
    for (const field of requiredFields) {
      if (!currentFicoModel[field]) {
        return `Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`;
      }
    }
    const feeUnitsToCheck = [
      "franchiseFeeUnit", "royaltyFeeUnit", "interiorCostUnit",
      "stockInvestmentUnit", "otherCostUnit", "requireWorkingCapitalUnit",
    ];
    for (const unit of feeUnitsToCheck) {
      const fieldName = unit.replace("Unit", "");
      if (currentFicoModel[unit] === "select" && !noFees[fieldName]) {
        const displayName = fieldName.replace(/([A-Z])/g, " $1").toLowerCase();
        return `Please select a unit for ${displayName} or mark as "No Fee"`;
      }
    }
    const feeFields = [
      "franchiseFee", "royaltyFee", "interiorCost", "stockInvestment",
      "otherCost", "requireWorkingCapital", "roi",
    ];
    for (const field of feeFields) {
      if (!currentFicoModel[field] && !noFees[field]) {
        return `Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()} or mark as "No Fee"`;
      }
    }
    return null;
  };

  const handleAddOrUpdateFicoModel = () => {
    const validationError = validateFicoModel();
    if (validationError) {
      alert(validationError);
      return;
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
      payBackPeriod: noFees.roi ? "No Fee" : currentFicoModel.payBackPeriod,
    };
    
    let updatedFico;
    if (editIndex !== null) {
      updatedFico = [...(data.fico || [])];
      updatedFico[editIndex] = formattedFicoModel;
    } else {
      updatedFico = [...(data.fico || []), formattedFicoModel];
    }
    
    handleArrayChange("fico", updatedFico);
    resetFicoForm();
  };

  const handleEditFicoModel = (index) => {
    setEditIndex(index);
  };

  const handleDeleteFicoModel = (index) => {
    setDeleteIndex(index);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    const updatedFico = [...(data.fico || [])];
    updatedFico.splice(deleteIndex, 1);
    handleArrayChange("fico", updatedFico);
    setConfirmDeleteOpen(false);
    setDeleteIndex(null);
  };

  const resetFicoForm = () => {
    setCurrentFicoModel({
      investmentRange: "", areaRequired: "", franchiseModel: "", franchiseType: "",
      franchiseFee: "", franchiseFeeUnit: "select", royaltyFee: "", royaltyFeeUnit: "select",
      interiorCost: "", interiorCostUnit: "select", stockInvestment: "", stockInvestmentUnit: "select",
      otherCost: "", otherCostUnit: "select", roi: "", payBackPeriod: "", breakEven: "",
      requireWorkingCapital: "", requireWorkingCapitalUnit: "select", marginOnSales: "", agreementPeriod: "",
    });
    setNoFees({
      franchiseFee: false, interiorCost: false, stockInvestment: false,
      otherCost: false, requireWorkingCapital: false, royaltyFee: false, roi: false,
    });
    setEditIndex(null);
  };

  const handleCancelEdit = () => {
    resetFicoForm();
    setEditIndex(null);
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    return value !== "No Fee" ? `${value}` : value;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading brand data: {error}
        </Alert>
        <Button variant="contained" onClick={fetchBrandData}>
          Retry
        </Button>
      </Box>
    );
  }

  return (

    <Box>
      
      {/* Edit/Save/Cancel Buttons */}
      {!isEditingMode ? (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button variant="outlined" onClick={handleEditClick}>
            Edit FICO Models
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveAllData}
            disabled={saveStatus.loading}
          >
            {saveStatus.loading ? <CircularProgress size={24} /> : "Save Changes"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setIsEditingMode(false);
              fetchBrandData();
            }}
          >
            Cancel
          </Button>
        </Box>
      )}
      

      {/* OTP Verification Dialog */}
      <Dialog open={showOtpDialog} onClose={() => setShowOtpDialog(false)}>
        <DialogTitle>Verify OTP</DialogTitle>
        <DialogContent>
          {otpSending && !otpSent && (
            <Box textAlign="center" mb={2}>
              <CircularProgress size={24} />
              <DialogContentText sx={{ mt: 1 }}>
                Sending OTP to {originalData?.brandDetails?.email}...
              </DialogContentText>
            </Box>
          )}

          {otpSendError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {otpSendError}
            </Alert>
          )}

          {otpSent && (
            <Alert severity="success" sx={{ mb: 2 }}>
              OTP has been sent to {originalData?.brandDetails?.email}
            </Alert>
          )}

          <TextField
            autoFocus
            margin="dense"
            label="OTP *"
            type="text"
            fullWidth
            variant="outlined"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
              setOtpError("");
            }}
            error={!!otpError}
            helperText={otpError || "Enter 6-digit verification code"}
            placeholder="Enter 6-digit code"
            disabled={otpSending || otpVerifying}
            inputProps={{ maxLength: 6 }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setShowOtpDialog(false);
              setOtp("");
              setOtpError("");
              setOtpSent(false);
            }}
            disabled={otpVerifying}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              setOtpSending(true);
              setOtpSendError("");
              setOtpSent(false);
              try {
                await sendOtp();
                setOtpSent(true);
              } catch (err) {
                setOtpSendError(err.message);
              } finally {
                setOtpSending(false);
              }
            }}
            disabled={otpSending || otpVerifying}
            variant="outlined"
            sx={{ ml: "auto" }}
          >
            {otpSending ? <CircularProgress size={20} /> : "Resend OTP"}
          </Button>
          <Button
            onClick={verifyOtp}
            color="primary"
            variant="contained"
            disabled={!otp || otp.length !== 6 || otpSending || otpVerifying}
          >
            {otpVerifying ? <CircularProgress size={20} /> : "Verify"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this franchise model?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h6" fontWeight={700} sx={{ mt: 2, color: "#ff9800" }}>
        Franchise Business Models
      </Typography>
      {errors.fico && typeof errors.fico === "string" && (
        <Typography color="error" sx={{ mb: 2 }}>
          {errors.fico}
        </Typography>
      )}

      {/* Current FICO Model Form - Only show when editing */}
      {isEditingMode && (
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} sx={{ display: "grid", gridTemplateColumns: { md: "repeat(4, 1fr)", xs: "1fr" }, gap: 2, mb: 2, mt: 2 }}>
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
                  <MenuItem value="100 - 200 Sq. Ft.">100-200 Sq. Ft.</MenuItem>
                  <MenuItem value="200 - 500 Sq. Ft.">200-500 Sq. Ft.</MenuItem>
                  <MenuItem value="500 - 1,000 Sq. Ft.">500-1,000 Sq. Ft.</MenuItem>
                  <MenuItem value="1,000 - 2,000 Sq. Ft.">1,000-2,000 Sq. Ft.</MenuItem>
                  <MenuItem value="2,000 - 3,000 Sq. Ft.">2,000-3,000 Sq. Ft.</MenuItem>
                  <MenuItem value="3,000 - 5,000 Sq. Ft.">3,000-5,000 Sq. Ft.</MenuItem>
                  <MenuItem value="5,000 - 7,000 Sq. Ft.">5,000-7,000 Sq. Ft.</MenuItem>
                  <MenuItem value="7,000 - 10,000 Sq. Ft.">7,000-10,000 Sq. Ft.</MenuItem>
                  <MenuItem value="10,000 - 15,000 Sq. Ft.">10,000-15,000 Sq. Ft.</MenuItem>
                </Select>
                {errors.areaRequired && (
                  <FormHelperText error>{errors.areaRequired}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* Column 5 - Agreement Period */}
            <Grid item>
              <FormControl fullWidth error={!!errors.agreementPeriod} required size="medium">
                <InputLabel>Agreement Period</InputLabel>
                <Select
                  label="Agreement Period"
                  name="agreementPeriod"
                  value={currentFicoModel.agreementPeriod || ""}
                  onChange={handleFicoChange}
                  renderValue={(selected) => (selected ? `${selected}` : "")}
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
                    <MenuItem key={year} value={year}>
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
                          onChange={handleFeeUnitChange("franchiseFee")}
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
                            <MenuItem key={unit.value} value={unit.value}>
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
                          onChange={handleFeeUnitChange("interiorCost")}
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
                            <MenuItem key={unit.value} value={unit.value}>
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
                          onChange={handleFeeUnitChange("stockInvestment")}
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
                            <MenuItem key={unit.value} value={unit.value}>
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
                          onChange={handleFeeUnitChange("otherCost")}
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
                            <MenuItem key={unit.value} value={unit.value}>
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
                          onChange={handleFeeUnitChange("requireWorkingCapital")}
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
                            <MenuItem key={unit.value} value={unit.value}>
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
                          onChange={handleFeeUnitChange("royaltyFee")}
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
                            <MenuItem key={unit.value} value={unit.value}>
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
                    <MenuItem key={i + 1} value={`${i + 1}`}>
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
            {/* Column 15 - Margin on Sales */}
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
                    <MenuItem key={i + 1} value={`${i + 1}`}>
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

          {/* Add/Update/Cancel Buttons */}
          <Grid item xs={12} mt={1} sx={{ display: "flex", justifyContent: "space-evenly", gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleAddOrUpdateFicoModel}
              size="large"
              sx={{
                backgroundColor: "#7ad03a",
                color: "#fff",
                "&:hover": { backgroundColor: "#388e3c" },
                padding: "8px 70px",
              }}
            >
              {editIndex !== null ? "Update Model" : "Add Model"}
            </Button>
            {editIndex !== null && (
              <Button
                variant="outlined"
                onClick={handleCancelEdit}
                size="large"
                sx={{ padding: "8px 70px" }}
              >
                Cancel
              </Button>
            )}
          </Grid>
        </Box>
      )}

      {/* Display saved FICO models */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          Saved Franchise Models {data.fico?.length > 0 && `(${data.fico.length})`}
        </Typography>
        <Box sx={{ width: "100%", overflowX: "auto", margin: "0 auto" }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="saved franchise models" size="medium">
              <TableHead>
                <TableRow>
                  {[
                    "Model Type", "Franchise Type", "Investment Range", "Area Required",
                    "Agreement Period", "Franchise Fee", "Interior Cost", "Stock Cost",
                    "Additional Cost", "Annual Working Capital", "Royalty Fee", "Break Even",
                    "ROI (%)", "Payback", "Margin On Sales", "Actions"
                  ].map((label, i) => (
                    <TableCell key={i} sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.fico && data.fico.length > 0 ? (
                  data.fico.map((model, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{model.franchiseModel || "N/A"}</TableCell>
                      <TableCell>{model.franchiseType || "N/A"}</TableCell>
                      <TableCell>{model.investmentRange || "N/A"}</TableCell>
                      <TableCell>{model.areaRequired || "N/A"}</TableCell>
                      <TableCell>{model.agreementPeriod || "N/A"}</TableCell>
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
                      <TableCell>
                        {isEditingMode && (
                          <>
                            <IconButton onClick={() => handleEditFicoModel(index)} color="primary" size="small">
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteFicoModel(index)} color="error" size="small">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={16} align="center" sx={{ py: 4, color: 'text.secondary', fontStyle: 'italic' }}>
                      No franchise models added yet. {isEditingMode && "Use the form above to add your first franchise model."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      {/* Expansion Locations Accordion */}
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleAccordionChange("panel2")}
        sx={{ mt: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold" sx={{ color: "#ff9800" }}>
            Expansion Locations
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#ff9800' }}>
              📍 Expansion Locations
            </Typography>

            {/* Domestic Locations */}
            <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold', color: '#333' }}>
              🇮🇳 Domestic Expansion Locations
            </Typography>
            
            {expansionData.domesticLocations && expansionData.domesticLocations.length > 0 ? (
              <TableContainer sx={{ maxHeight: 400, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>State</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Districts</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expansionData.domesticLocations.map((location, index) => (
                      <TableRow key={index} hover>
                        <TableCell sx={{ verticalAlign: 'top', fontWeight: 500 }}>
                          {location.state || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {location.districts && location.districts.length > 0 ? (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {location.districts.map((district, idx) => (
                                <Chip 
                                  key={idx} 
                                  label={typeof district === 'object' ? (district.district || district.name || JSON.stringify(district)) : district} 
                                  size="small" 
                                  sx={{ 
                                    backgroundColor: '#e3f2fd',
                                    fontSize: '0.75rem',
                                    height: '24px'
                                  }} 
                                />
                              ))}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              All Districts
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info" sx={{ mt: 1 }}>
                No domestic expansion locations specified.
              </Alert>
            )}

            {/* International Locations */}
            <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 'bold', color: '#333' }}>
              🌍 International Expansion Locations
            </Typography>
            
            {expansionData.internationalLocations ? (
              <TableContainer sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Table size="small">
                  <TableBody>
                    {Object.entries(expansionData.internationalLocations).map(([country, data]) => (
                      <TableRow key={country} hover>
                        <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>
                          {country}
                        </TableCell>
                        <TableCell>
                          {data && typeof data === 'object' ? (
                            <Box>
                              {data.locations && data.locations.length > 0 && (
                                <Box sx={{ mb: 1 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Locations:
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                    {data.locations.map((loc, idx) => (
                                      <Chip key={idx} label={loc} size="small" />
                                    ))}
                                  </Box>
                                </Box>
                              )}
                              {data.districts && data.districts.length > 0 && (
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    Districts:
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                    {data.districts.map((district, idx) => (
                                      <Chip key={idx} label={district} size="small" />
                                    ))}
                                  </Box>
                                </Box>
                              )}
                            </Box>
                          ) : (
                            <Typography variant="body2">{String(data)}</Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info" sx={{ mt: 1 }}>
                No international expansion locations specified.
              </Alert>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
      <Snackbar
        open={saveStatus.success || !!saveStatus.error}
        autoHideDuration={6000}
        onClose={() => setSaveStatus((prev) => ({ ...prev, success: false, error: "" }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={saveStatus.success ? "success" : "error"} sx={{ width: "100%" }}>
          {saveStatus.success ? "FICO models saved successfully!" : saveStatus.error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PaymentBrandUpdate;