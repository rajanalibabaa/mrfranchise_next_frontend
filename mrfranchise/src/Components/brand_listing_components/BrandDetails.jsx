"use client";
import React, { useState, useEffect } from "react";
import {
  TextField,
  Grid,
  Typography,
  InputAdornment,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Autocomplete,
  Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import FlagIcon from "@mui/icons-material/Flag";

import { fetchGlobalLocationByPostalCode } from "@/Utils/PincodeFetch.jsx";
import {getSupportedCountries} from "@/Utils/countries";

const BrandDetails = ({ data = {}, errors = {}, onChange }) => {
  const [showWhatsappSnackbar, setShowWhatsappSnackbar] = useState(false);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const countryCode = getSupportedCountries();

  const formData = {
    companyName: "",
    brandName: "",
    brandCategories: [],
    expansionLocation: [],
    ...data,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });

     if (errors[name]) {
    errors[name] = ""; // optional: if using local state for errors
  }
  };
  const [pincodeError, setPincodeError] = useState(null);
  const [loadingPincode, setLoadingPincode] = useState(false);

  // Inside your BrandDetails component, add these state variables
  const [supportedCountries, setSupportedCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryInputValue, setCountryInputValue] = useState("");

  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setSupportedCountries(
            data.data.map((c) => ({
              name: c.country,
              code: c.iso2,
              dial_code: c.phone_code ? `+${c.phone_code}` : "",
            }))
          );
        }
      });
  }, []);
  useEffect(() => {
    if (
      data.mobileNumber?.length === 10 &&
      !whatsappEnabled &&
      !data.whatsappNumber
    ) {
      setShowWhatsappSnackbar(true);
    }
  }, [data.mobileNumber, whatsappEnabled, data.whatsappNumber]);

  // Inside your BrandDetails component

  const fetchLocationDetails = async () => {
    if (data.pincode && data.pincode.length >= 4 && selectedCountry) {
      setLoadingPincode(true);
      setPincodeError(null);

      try {
        const result = await fetchGlobalLocationByPostalCode(
          data.pincode,
          selectedCountry
        );

        if (result.status === "success") {
          onChange({
            country: result.country,
            state: result.state,
            city: result.city,
            district: result.district,
          });
        } else {
          throw new Error(result.message || "Failed to fetch location details");
        }
      } catch (error) {
        console.error("Location fetch error:", error);
        setPincodeError(error.message);
        onChange({
          state: "",
          city: "",
          district: "",
        });
      } finally {
        setLoadingPincode(false);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (data.pincode && data.pincode.length >= 4 && selectedCountry) {
        fetchLocationDetails();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [data.pincode, selectedCountry]);

  // State for country codes
  const [mobileCountryCode, setMobileCountryCode] = useState({
    code: "IN",
    dial_code: "+91",
  });
  const [whatsappCountryCode, setWhatsappCountryCode] = useState({
    code: "IN",
    dial_code: "+91",
  });
  const [ceoCountryCode, setCeoCountryCode] = useState({
    code: "IN",
    dial_code: "+91",
  });
  const [officeCountryCode, setOfficeCountryCode] = useState({
    code: "IN",
    dial_code: "+91",
  });

  // Filter country codes to remove duplicates and sort
  // const uniqueCountryCodes = countryCode
  //   .reduce((acc, current) => {
  //     const x = acc.find((item) => item.code === current.code);
  //     if (!x) {
  //       return acc.concat([current]);
  //     } else {
  //       return acc;
  //     }
  //   }, [])
  //   .sort((a, b) => a.name.localeCompare(b.name));

  const uniqueCountryCodes = Array.isArray(countryCode)
  ? countryCode
      .reduce((acc, current) => {
        if (!acc.some(item => item.code === current.code)) {
          acc.push(current);
        }
        return acc;
      }, [])
      .sort((a, b) => a.name.localeCompare(b.name))
  : [];


  // Handle country code change
  const handleCountryCodeChange = (field, newValue) => {
    if (newValue) {
      switch (field) {
        case "mobile":
          setMobileCountryCode(newValue);
          // Update the full mobile number with new dial code
          if (data.mobileNumber) {
            const numberWithoutCode = data.mobileNumber.replace(/^\+?\d+/, "");
            onChange({
              mobileNumber: newValue.dial_code + numberWithoutCode,
            });
          }
          break;
        case "whatsapp":
          setWhatsappCountryCode(newValue);
          // Update the full whatsapp number with new dial code
          if (data.whatsappNumber) {
            const numberWithoutCode = data.whatsappNumber.replace(
              /^\+?\d+/,
              ""
            );
            onChange({
              whatsappNumber: newValue.dial_code + numberWithoutCode,
            });
          }
          break;
        case "ceo":
          setCeoCountryCode(newValue);
          // Update the full ceo mobile number with new dial code
          if (data.ceoMobile) {
            const numberWithoutCode = data.ceoMobile.replace(/^\+?\d+/, "");
            onChange({
              ceoMobile: newValue.dial_code + numberWithoutCode,
            });
          }
          break;
        case "office":
          setOfficeCountryCode(newValue);
          // Update the full office mobile number with new dial code
          if (data.officeMobile) {
            const numberWithoutCode = data.officeMobile.replace(/^\+?\d+/, "");
            onChange({
              officeMobile: newValue.dial_code + numberWithoutCode,
            });
          }
          break;
        default:
          break;
      }
    }
  };

  // Handle mobile number change - ensure it includes the country code
  const handleMobileNumberChange = (e) => {
    const { name, value } = e.target;


    
    // Remove any non-digit characters
    const digitsOnly = value.replace(/\D/g, "");

    // For mobileNumber field, we'll prepend the country code
    if (name === "mobileNumber") {
      onChange({
        [name]: mobileCountryCode.dial_code + digitsOnly,
      });
    }
    // For whatsappNumber field
    else if (name === "whatsappNumber") {
      onChange({
        [name]: whatsappCountryCode.dial_code + digitsOnly,
      });
    }
    // For ceoMobile field
    else if (name === "ceoMobile") {
      onChange({
        [name]: ceoCountryCode.dial_code + digitsOnly,
      });
    }
    // For officeMobile field
    else if (name === "officeMobile") {
      onChange({
        [name]: officeCountryCode.dial_code + digitsOnly,
      });
    }

    if (errors[name]) {
      errors[name] = ""; // optional: if using local state for errors
    }
  };

  const getDisplayNumber = (fullNumber, countryCode) => {
    if (!fullNumber) return "";
    // Remove the country code if it exists at the start
    return fullNumber.replace(new RegExp(`^\\${countryCode.dial_code}`), "");
  };

  // OTP Verification States
  const [verificationState, setVerificationState] = useState({
    email: {
      verified: false,
      otpSent: false,
      showDialog: false,
      loading: false,
      error: null,
    },
    mobileNumber: {
      verified: false,
      otpSent: false,
      showDialog: false,
      loading: false,
      error: null,
    },
  });

  const [otpInput, setOtpInput] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Handle OTP verification dialog open/close
  const handleVerificationDialog = (field, open) => {
    setVerificationState((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        showDialog: open,
        error: null,
      },
    }));
    setOtpInput("");
  };

  const [otpToken, setOtpToken] = useState(null); // Add this state for token storage

  // OTP Verification Functions - Fixed Version
  const handleSendOtp = async (field) => {
    setVerificationState((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        loading: true,
        error: null,
      },
    }));

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/otpverify/send-otp-email`,
        {
          [field === "email" ? "email" : "phone"]: data[field],
          type: field,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Modified success check to match backend response
      if (response.data.token) {
        setOtpToken(response.data.token);

        setVerificationState((prev) => ({
          ...prev,
          [field]: {
            ...prev[field],
            otpSent: true,
            loading: false,
            verified: false,
          },
        }));

        setSnackbar({
          open: true,
          message: `OTP sent successfully to your ${field}`,
          severity: "success",
        });
      } else {
        throw new Error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error(`Error sending OTP for ${field}:`, error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to send OTP";

      setVerificationState((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          loading: false,
          error: errorMessage,
        },
      }));

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleVerifyOtp = async (field) => {
    if (!otpInput || otpInput.length !== 6) {
      setVerificationState((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          error: "Please enter a valid 6-digit OTP",
        },
      }));
      return;
    }

    setVerificationState((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        loading: true,
        error: null,
      },
    }));

    try {

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/otpverify/verify-otp`,
        {
          identifier: data[field],
          otp: otpInput,
          type: field,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${otpToken}`,
          },
        }
      );

      // Modified success check to match backend response
      if (
        response.data.message &&
        response.data.message.includes("verified successfully")
      ) {
        setVerificationState((prev) => ({
          ...prev,
          [field]: {
            ...prev[field],
            verified: true,
            showDialog: false,
            loading: false,
          },
        }));

        setSnackbar({
          open: true,
          message:
            response.data.message ||
            `${
              field === "email" ? "Email" : "Mobile number"
            } verified successfully!`,
          severity: "success",
        });

        setOtpInput("");
      } else {
        throw new Error(response.data.error || "OTP verification failed");
      }
    } catch (error) {
      console.error(
        `Error verifying OTP for ${field}:`,
        error.response?.data || error
      );

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "OTP verification failed";

      setVerificationState((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          loading: false,
          error: errorMessage,
        },
      }));

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };
  // Resend OTP
  const handleResendOtp = (field) => {
    handleSendOtp(field);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const renderMobileNumberField = () => (
    <Grid item xs={12} sm={6} md={2.4}>
      <TextField
        fullWidth
        label="Mobile Number"
        name="mobileNumber"
        value={getDisplayNumber(data.mobileNumber, mobileCountryCode)}
        onChange={handleMobileNumberChange}
        error={!!errors.mobileNumber}
        helperText={errors.mobileNumber}
        variant="outlined"
        size="medium"
        inputProps={{ maxLength: 15 }}
        placeholder="Enter mobile number"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Autocomplete
                options={uniqueCountryCodes}
                getOptionLabel={(option) => `${option.dial_code}`}
                value={mobileCountryCode}
                onChange={(event, newValue) =>
                  handleCountryCodeChange("mobile", newValue)
                }
                clearIcon={null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    sx={{ width: 70 }}
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: true,
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props} fontSize={12}>
                    {option.dial_code} <br />({option.code})
                  </Box>
                )}
              />
            </InputAdornment>
          ),
         
        }}
        required
      />
    </Grid>
  );
  const renderWhatsAppNumberField = () => (
    <Grid item xs={12} sm={6} md={2.4}>
      <TextField
        fullWidth
        label="WhatsApp Number"
        name="whatsappNumber"
        value={getDisplayNumber(data.whatsappNumber, whatsappCountryCode)}
        onChange={handleMobileNumberChange}
        error={!!errors.whatsappNumber}
        helperText={errors.whatsappNumber}
        variant="outlined"
        size="medium"
        inputProps={{ maxLength: 15 }}
        placeholder="Enter WhatsApp number"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Autocomplete
                options={uniqueCountryCodes}
                getOptionLabel={(option) => `${option.dial_code}`}
                value={whatsappCountryCode}
                onChange={(event, newValue) =>
                  handleCountryCodeChange("whatsapp", newValue)
                }
                isOptionEqualToValue={(option, value) =>
                  option.dial_code === value.dial_code
                }
                clearIcon={null}
                sx={{ width: 100 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    sx={{ width: 70 }}
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: true,
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    {option.dial_code} ({option.code})
                  </Box>
                )}
              />
            </InputAdornment>
          ),
        }}
      />
    </Grid>
  );

  // CEO Mobile Field
  const renderCeoMobileField = () => (
    <Grid item xs={12} sm={6} md={2}>
      <TextField
        fullWidth
        label="CEO/MD/Owner Mobile No"
        name="ceoMobile"
        value={getDisplayNumber(data.ceoMobile, ceoCountryCode)}
        onChange={handleMobileNumberChange}
        variant="outlined"
        size="medium"
        inputProps={{ maxLength: 15 }}
        placeholder="Enter mobile number"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Autocomplete
                options={uniqueCountryCodes}
                getOptionLabel={(option) => `${option.dial_code}`}
                value={ceoCountryCode}
                onChange={(event, newValue) =>
                  handleCountryCodeChange("ceo", newValue)
                }
                clearIcon={null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    sx={{ width: 70 }}
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: true,
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props} fontSize={12}>
                    {option.dial_code}
                    <br /> ({option.code})
                  </Box>
                )}
              />
            </InputAdornment>
          ),
        }}
        error={!!errors.ceoMobile}
        helperText={errors.ceoMobile}
        required
      />
    </Grid>
  );

  // Office Mobile Field
  const renderOfficeMobileField = () => (
    <Grid item xs={12} sm={6} md={2.4}>
      <TextField
        fullWidth
        label="Office Mobile Number (Optional)"
        name="officeMobile"
        value={getDisplayNumber(data.officeMobile, officeCountryCode)}
        onChange={handleMobileNumberChange}
        variant="outlined"
        size="medium"
        inputProps={{ maxLength: 15 }}
        placeholder="Enter mobile number"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Autocomplete
                options={uniqueCountryCodes}
                getOptionLabel={(option) => `${option.dial_code}`}
                value={officeCountryCode}
                onChange={(event, newValue) =>
                  handleCountryCodeChange("office", newValue)
                }
                clearIcon={null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    sx={{ width: 70 }}
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: true,
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props} fontSize={12}>
                    {option.dial_code}
                    <br /> ({option.code})
                  </Box>
                )}
              />
            </InputAdornment>
          ),
        }}
        error={!!errors.officeMobile}
        helperText={errors.officeMobile}
      />
    </Grid>
  );

  return (
    <Box
      sx={{
        // overflowY: "auto",
        // mr: { sm: 0, md: 25 },
        // ml: { sm: 0, md: 25 },
        // mt: 0,
        // maxWidth: "100%",
        pr: 1,
        mr: { sm: 0, md: 10 },
        ml: { sm: 0, md: 10 },
      }}
    >
      {/* Brand Details Section */}
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ mb: 3, color: "#ff9800" }}
      >
        Login Credentials
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{
          mt: 3,
          display: "grid",
          gridTemplateColumns: { md: "repeat(4, 0.7fr)", xs: "1fr" },
          gap: 2,
          mb: 2,
        }}
      >
        {/* Full Name */}
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={data.fullName || ""}
            onChange={handleChange}
            error={!!errors.fullName}
            helperText={errors.fullName}
            variant="outlined"
            size="medium"
            required
          />
        </Grid>
        {/* Email with Verification */}
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={data.email || ""}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            variant="outlined"
            size="medium"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {verificationState.email.verified ? (
                    <Box
                      display="flex"
                      alignItems="center"
                      color="success.main"
                    >
                      <CheckCircleIcon fontSize="medium" />
                      <Typography variant="caption" sx={{ ml: 0.5 }}>
                        Verified
                      </Typography>
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      size="medium"
                      onClick={async () => {
                        // First open the dialog
                        handleVerificationDialog("email", true);
                        // Then immediately send OTP
                        await handleSendOtp("email");
                      }}
                      disabled={!data.email || verificationState.email.loading}
                      startIcon={
                        verificationState.email.loading ? (
                          <CircularProgress size={14} />
                        ) : (
                          <SendIcon fontSize="medium" />
                        )
                      }
                    >
                      Verify
                    </Button>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Mobile Number with Verification */}
        <Grid item xs={12} sm={6} md={2.4}>
          {renderMobileNumberField()}
        </Grid>

        {/* WhatsApp Number */}
        <Grid item xs={12} sm={6} md={2.4}>
          {renderWhatsAppNumberField()}
        </Grid>
      </Grid>

      {/* OTP Verification Dialogs */}
      {/* Email Verification Dialog */}
      <Dialog
        open={verificationState.email.showDialog}
        onClose={() => handleVerificationDialog("email", false)}
      >
        <DialogTitle>Verify Email</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 300, pt: 1 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              We've sent a 6-digit OTP to {data.email}
            </Typography>
            <TextField
              fullWidth
              label="Enter OTP"
              value={otpInput}
              onChange={(e) =>
                setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              variant="outlined"
              size="medium"
              inputProps={{ maxLength: 6 }}
              error={!!verificationState.email.error}
              helperText={verificationState.email.error}
            />
            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Button
                onClick={() => handleResendOtp("email")}
                disabled={verificationState.email.loading}
                sx={{ color: "#ff9800" }}
              >
                {verificationState.email.loading ? "Sending..." : "Resend OTP"}
              </Button>
              <Button
                variant="contained"
                onClick={() => handleVerifyOtp("email")}
                disabled={
                  otpInput.length !== 6 || verificationState.email.loading
                }
                startIcon={
                  verificationState.email.loading ? (
                    <CircularProgress size={14} />
                  ) : null
                }
                sx={{ bgcolor: "green" }}
              >
                {verificationState.email.loading ? "Verifying..." : "Verify"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Mobile Verification Dialog */}
      <Dialog
        open={verificationState.mobileNumber.showDialog}
        onClose={() => handleVerificationDialog("mobileNumber", false)}
      >
        <DialogTitle>Verify Mobile Number</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 300, pt: 1 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              We've sent a 6-digit OTP to +91 {data.mobileNumber}
            </Typography>
            <TextField
              fullWidth
              label="Enter OTP"
              value={otpInput}
              onChange={(e) =>
                setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              variant="outlined"
              size="medium"
              inputProps={{ maxLength: 6 }}
              error={!!verificationState.mobileNumber.error}
              helperText={verificationState.mobileNumber.error}
            />
            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Button
                onClick={() => handleResendOtp("mobileNumber")}
                disabled={verificationState.mobileNumber.loading}
                sx={{ color: "#ff9800" }}
              >
                {verificationState.mobileNumber.loading
                  ? "Sending..."
                  : "Resend OTP"}
              </Button>
              <Button
                variant="contained"
                onClick={() => handleVerifyOtp("mobileNumber")}
                disabled={
                  otpInput.length !== 6 ||
                  verificationState.mobileNumber.loading
                }
                startIcon={
                  verificationState.mobileNumber.loading ? (
                    <CircularProgress size={14} />
                  ) : null
                }
                sx={{ bgcolor: "green" }}
              >
                {verificationState.mobileNumber.loading
                  ? "Verifying..."
                  : "Verify"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ mb: 3, color: "#ff9800" }}
      >
        Brand Details
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{
          mt: 2,
          display: "grid",
          gridTemplateColumns: { md: "repeat(4, 1fr)", xs: "1fr" },
          mb: 2,
        }}
      >
        {/* Company Name - 1 column */}
        <Grid item xs={12} md={1}>
          <TextField
            fullWidth
            label="Company Name"
            name="companyName"
            value={formData.companyName || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            error={!!errors.companyName}
            helperText={errors.companyName}
            required
          />
        </Grid>

        {/* Brand Name - 1 column */}
        <Grid item xs={12} md={1}>
          <TextField
            fullWidth
            label="Brand Name"
            name="brandName"
            value={formData.brandName || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            error={!!errors.brandName}
            helperText={errors.brandName}
            required
          />
        </Grid>

        {/* Tagline - spans 2 columns */}
        <Grid item size={{ xs: 12, md: 24 }}>
          <TextField
            fullWidth
            label="Tagline"
            name="tagLine"
            value={formData.tagLine || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            error={!!errors.tagLine}
            helperText={errors.tagLine}
            required
          />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        sx={{
          mt: 2,
          display: "grid",
          gridTemplateColumns: { md: "repeat(4, 1fr)", xs: "1fr" },

          mb: 2,
        }}
      >
        {/* CEO Name */}
        <Grid item xs={12} md={1}>
          <TextField
            fullWidth
            label="CEO/MD/Owner Name"
            name="ceoName"
            value={data.ceoName || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            error={!!errors.ceoName}
            helperText={errors.ceoName}
            required
          />
        </Grid>

        {/* CEO Email */}
        <Grid item xs={12} md={1}>
          <TextField
            fullWidth
            label="CEO/MD/Owner Email"
            name="ceoEmail"
            type="email"
            value={data.ceoEmail || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            error={!!errors.ceoEmail}
            helperText={errors.ceoEmail}
            required
          />
        </Grid>

        {/* CEO Mobile */}
        <Grid item xs={12} md={2}>
          {renderCeoMobileField()}
        </Grid>
      </Grid>

      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ mb: 3, color: "#ff9800" }}
      >
        Head Office Location{" "}
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{
          mt: 2,
          display: "grid",
          gridTemplateColumns: { md: "repeat(4, 1fr)", xs: "1fr" },
          gap: 2,
          mb: 2,
        }}
      >
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Office Email (Optional)"
            name="officeEmail"
            value={data.officeEmail || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            error={!!errors.officeEmail}
            helperText={errors.officeEmail}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          {renderOfficeMobileField()}
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        sx={{
          mt: 2,
          display: "grid",
          gridTemplateColumns: { md: "3fr 1fr", xs: "1fr" }, // 3:1 ratio on desktop
          gap: 1.5,
        }}
      >
        {/* Head Office Address - spans 3 columns */}
        <Grid item size={{ xs: 12, md: 12.05 }}>
          <TextField
            fullWidth
            label="Head Office Address"
            name="headOfficeAddress"
            value={data.headOfficeAddress || ""}
            onChange={handleChange}
            error={!!errors.headOfficeAddress}
            helperText={errors.headOfficeAddress}
            variant="outlined"
            size="medium"
            required
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Autocomplete
            options={supportedCountries}
            getOptionLabel={(option) => option.name}
            value={
              supportedCountries.find((c) => c.code === selectedCountry) || null
            }
            onChange={(event, newValue) => {
              if (newValue) {
                setSelectedCountry(newValue.code);
                onChange({ country: newValue.name });
              } else {
                setSelectedCountry("");
                onChange({ country: "" });
              }
              // Clear pincode-related fields when country changes
              onChange({
                pincode: "",
                state: "",
                city: "",
                district: "",
              });
                if (errors?.country) errors.country = "";
            }}
            inputValue={countryInputValue}
            onInputChange={(event, newInputValue) => {
              setCountryInputValue(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Country"
                variant="outlined"
                size="medium"
                required
                error={!!errors.country}
                helperText={errors.country || "Select your country first"}
              />
            )}
            renderOption={(props, option) => {
              const { key, ...rest } = props;
              return (
                <Box component="li" key={key} {...rest}>
                  <FlagIcon sx={{ mr: 1 }} />
                  {option.name}
                </Box>
              );
            }}
          />
        </Grid>
        {/* Pincode - spans 1 column */}
        {/* <Grid item sx={{ ml:{ md:1 }}} >

    <TextField
      fullWidth
      label="Pincode"
      name="pincode"
      value={data.pincode || ""}
      onChange={(e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
        onChange({ pincode: value });
      }}
      error={!!errors.pincode || !!pincodeError}
      helperText={errors.pincode || pincodeError}
      variant="outlined"
      size="medium"
      required
      InputProps={{
        endAdornment: loadingPincode ? (
          <InputAdornment position="end">
            <CircularProgress size={20} />
          </InputAdornment>
        ) : null,
      }}
    />
  </Grid> */}
      </Grid>

      <Grid
        container
        spacing={2}
        sx={{
          mt: 2,
          display: "grid",
          gridTemplateColumns: { md: "repeat(4, 1fr)", xs: "1fr" },
          gap: 2,
        }}
      >
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label={selectedCountry === "IN" ? "Pincode" : "Postal Code"}
            name="pincode"
            value={data.pincode || ""}
            onChange={(e) => {
              const value = e.target.value
                .replace(/\D/g, "")
                .slice(0, selectedCountry === "IN" ? 6 : 10);
              onChange({ pincode: value });
               if (errors?.pincode) errors.pincode = "";
   
            }}
            error={!!errors.pincode || !!pincodeError}
            helperText={
              errors.pincode ||
              pincodeError ||
              (selectedCountry === "IN" ? "6-digit pincode" : "Postal code")
            }
            variant="outlined"
            size="medium"
            required
            // disabled={!selectedCountry}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip
                    title={
                      supportedCountries.find((c) => c.code === selectedCountry)
                        ?.name || "Country"
                    }
                  >
                    <FlagIcon
                      color={selectedCountry ? "primary" : "disabled"}
                    />
                  </Tooltip>
                </InputAdornment>
              ),
              endAdornment: loadingPincode ? (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ) : null,
            }}
          />
        </Grid>
        {/* <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Pincode"
            name="pincode"
            value={data.pincode || ""}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              onChange({ pincode: value });
            }}
            error={!!errors.pincode || !!pincodeError}
            helperText={errors.pincode || pincodeError}
            variant="outlined"
            size="medium"
            required
            InputProps={{
              endAdornment: loadingPincode ? (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ) : null,
            }}
          />
        </Grid> */}

        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="State"
            name="state"
            value={data.state || ""}
            onChange={handleChange}
            error={!!errors.state}
            helperText={errors.state}
            variant="outlined"
            size="medium"
            required
            InputProps={{
              readOnly: !!data.state,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="District"
            name="district"
            value={data.district || ""}
            onChange={handleChange}
            error={!!errors.district}
            helperText={errors.district}
            variant="outlined"
            size="medium"
            required
            InputProps={{
              readOnly: !!data.district,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={data.city || ""}
            onChange={handleChange}
            error={!!errors.city}
            helperText={errors.city}
            variant="outlined"
            size="medium"
            required
            InputProps={{
              readOnly: !!data.city,
            }}
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        sx={{
          mt: 2,
          display: "grid",
          gridTemplateColumns: { md: "repeat(4, 0.7fr)", xs: "1fr" },
          gap: 2,
        }}
      >
        {/* Email */}

        {/* Website */}
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Website "
            name="website"
            value={data.website || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            error={!!errors.website}
            helperText={errors.website}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">https://</InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Facebook */}
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Facebook (optional)"
            name="facebook"
            value={data.facebook || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            error={!!errors.facebook}
            helperText={errors.facebook}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">@</InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Instagram */}
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Instagram (optional)"
            name="instagram"
            value={data.instagram || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            error={!!errors.instagram}
            helperText={errors.instagram}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">@</InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* LinkedIn */}
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="LinkedIn   (optional)"
            name="linkedin"
            value={data.linkedin || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            error={!!errors.linkedin}
            helperText={errors.linkedin}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">@</InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* Communication Information Section */}

      <Grid
        container
        spacing={2}
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "repeat(4, 1fr)", xs: "1fr" },
          gap: 2,
        }}
      ></Grid>

      <Snackbar
        open={showWhatsappSnackbar}
        autoHideDuration={null}
        onClose={() => setShowWhatsappSnackbar(false)}
        anchorOrigin={{ vertical: "center", horizontal: "center" }}
        sx={{
          width: "100%",
          maxWidth: "700px",
          mb: 12,
        }}
      >
        <Alert
          severity="info"
          // icon={<WhatsApp fontSize="inherit" />}
          sx={{
            width: "100%",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            alignItems: "center",
          }}
          action={
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                color="success"
                variant="contained"
                size="medium"
                onClick={() => {
                  onChange({ whatsappNumber: data.mobileNumber || "" });
                  setWhatsappEnabled(false);
                  setShowWhatsappSnackbar(false);
                }}
                sx={{ borderRadius: "8px" }}
              >
                Yes
              </Button>
              <Button
                color="inherit"
                variant="outlined"
                size="small"
                onClick={() => {
                  setWhatsappEnabled(true);
                  setShowWhatsappSnackbar(false);
                }}
                sx={{ borderRadius: "8px" }}
              >
                No
              </Button>
            </Box>
          }
        >
          Is your WhatsApp number same as your mobile number?
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BrandDetails;
