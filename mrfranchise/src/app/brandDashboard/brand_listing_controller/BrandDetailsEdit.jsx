"use client";
import React, { useState, useEffect, useRef } from "react";

import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";

import FlagIcon from "@mui/icons-material/Flag";
import { fetchGlobalLocationByPostalCode } from "@/Utils/PincodeFetch.jsx";
import coutryCode from "@/Utils/AllCountryCode.jsx";

const BrandDetailsEdit = ({ data = {}, errors = {}, onChange, isEditing }) => {
  const [pincodeError, setPincodeError] = useState(null);
  const [loadingPincode, setLoadingPincode] = useState(false);
  const [supportedCountries, setSupportedCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryInputValue, setCountryInputValue] = useState("");

  // ✅ Tracks whether the next selectedCountry change came from hydrating
  // already-saved data (initial load) rather than a real user pick, so we
  // can skip the auto pincode-lookup effect for that one render.
  const isInitialCountrySync = useRef(false);

  const formData = {
    companyName: "",
    brandName: "",
    brandCategories: [],
    expansionLocation: [],
    ...data,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

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

  // ✅ FIX: hydrate selectedCountry (and the visible input text) from the
  // already-saved data.country once the countries list has loaded. Without
  // this, selectedCountry stays "" forever on edit/initial load, so the
  // Autocomplete's `value` lookup below always resolves to null and the
  // Country field renders blank even though data.country has a value.
  useEffect(() => {
    if (data.country && supportedCountries.length > 0 && !selectedCountry) {
      const matched = supportedCountries.find(
        (c) => c.name.toLowerCase() === data.country.toLowerCase()
      );
      if (matched) {
        isInitialCountrySync.current = true;
        setSelectedCountry(matched.code);
        setCountryInputValue(matched.name);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.country, supportedCountries]);

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
          onChange("country", result.country);
          onChange("state", result.state);
          onChange("city", result.city);
          onChange("district", result.district);
        } else {
          throw new Error(result.message || "Failed to fetch location details");
        }
      } catch (error) {
        console.error("Location fetch error:", error);
        setPincodeError(error.message);
        onChange("state", "");
        onChange("city", "");
        onChange("district", "");
      } finally {
        setLoadingPincode(false);
      }
    }
  };

  useEffect(() => {
    // ✅ Skip the auto-fetch that would otherwise fire the moment we hydrate
    // selectedCountry from existing saved data — that's not a real user
    // edit, and re-fetching here could needlessly overwrite the already
    // correct saved state/city/district (or flash a loading spinner) on load.
    if (isInitialCountrySync.current) {
      isInitialCountrySync.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (data.pincode && data.pincode.length >= 4 && selectedCountry) {
        fetchLocationDetails();
      }
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const uniqueCountryCodes = coutryCode
    .reduce((acc, current) => {
      const x = acc.find((item) => item.code === current.code);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, [])
    .sort((a, b) => a.name.localeCompare(b.name));

  // Handle country code change
  const handleCountryCodeChange = (field, newValue) => {
    if (newValue) {
      switch (field) {
        case "mobile":
          setMobileCountryCode(newValue);
          if (data.mobileNumber) {
            const numberWithoutCode = data.mobileNumber.replace(/^\+?\d+/, "");
            onChange("mobileNumber", newValue.dial_code + numberWithoutCode);
          }
          break;
        case "whatsapp":
          setWhatsappCountryCode(newValue);
          if (data.whatsappNumber) {
            const numberWithoutCode = data.whatsappNumber.replace(
              /^\+?\d+/,
              ""
            );
            onChange("whatsappNumber", newValue.dial_code + numberWithoutCode);
          }
          break;
        case "ceo":
          setCeoCountryCode(newValue);
          if (data.ceoMobile) {
            const numberWithoutCode = data.ceoMobile.replace(/^\+?\d+/, "");
            onChange("ceoMobile", newValue.dial_code + numberWithoutCode);
          }
          break;
        case "office":
          setOfficeCountryCode(newValue);
          if (data.officeMobile) {
            const numberWithoutCode = data.officeMobile.replace(/^\+?\d+/, "");
            onChange("officeMobile", newValue.dial_code + numberWithoutCode);
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
    const digitsOnly = value.replace(/\D/g, "");

    if (name === "mobileNumber") {
      onChange(name, mobileCountryCode.dial_code + digitsOnly);
    } else if (name === "whatsappNumber") {
      onChange(name, whatsappCountryCode.dial_code + digitsOnly);
    } else if (name === "ceoMobile") {
      onChange(name, ceoCountryCode.dial_code + digitsOnly);
    } else if (name === "officeMobile") {
      onChange(name, officeCountryCode.dial_code + digitsOnly);
    }
  };

  const getDisplayNumber = (fullNumber, countryCode) => {
    if (!fullNumber) return "";
    return fullNumber.replace(new RegExp(`^\\${countryCode.dial_code}`), "");
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
        disabled={true}
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
                disabled={!isEditing}
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
        disabled={true}
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
                disabled={!isEditing}
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
        disabled={true}
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
                disabled={!isEditing}
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
        disabled={true}
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
                disabled={!isEditing}
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
    <Box sx={{ pr: 1, mr: { sm: 0, md: 10 }, ml: { sm: 0, md: 10 } }}>
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
            disabled={true}
            required
          />
        </Grid>

        {/* Email */}
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
            disabled={true}
            required
          />
        </Grid>

        {/* Mobile Number */}
        <Grid item xs={12} sm={6} md={2.4}>
          {renderMobileNumberField()}
        </Grid>

        {/* WhatsApp Number */}
        <Grid item xs={12} sm={6} md={2.4}>
          {renderWhatsAppNumberField()}
        </Grid>
      </Grid>

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
        {/* Company Name */}
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
            disabled={true}
            required
          />
        </Grid>

        {/* Brand Name */}
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
            disabled={true}
            required
          />
        </Grid>

        {/* Tagline */}
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
            disabled={!isEditing}
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
            disabled={!isEditing}
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
            disabled={true}
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
            disabled={true}
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
          gridTemplateColumns: { md: "3fr 1fr", xs: "1fr" },
          gap: 1.5,
        }}
      >
        {/* Head Office Address */}
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
            disabled={!isEditing}
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
                onChange("country", newValue.name);
              } else {
                setSelectedCountry("");
                onChange("country", "");
              }
              onChange("pincode", "");
              onChange("state", "");
              onChange("city", "");
              onChange("district", "");
            }}
            inputValue={countryInputValue}
            onInputChange={(event, newInputValue) => {
              setCountryInputValue(newInputValue);
            }}
            disabled={!isEditing}
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
              onChange("pincode", value);
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
            disabled={!isEditing || !selectedCountry}
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
            disabled={!isEditing}
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
            disabled={!isEditing}
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
            disabled={!isEditing}
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
            disabled={!isEditing}
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
            disabled={!isEditing}
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
            disabled={!isEditing}
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
            label="LinkedIn (optional)"
            name="linkedin"
            value={data.linkedin || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            error={!!errors.linkedin}
            helperText={errors.linkedin}
            disabled={!isEditing}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">@</InputAdornment>
              ),
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
          gridTemplateColumns: { md: "repeat(4, 1fr)", xs: "1fr" },
          gap: 2,
        }}
      ></Grid>
    </Box>
  );
};

export default BrandDetailsEdit;
