"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { fetchGlobalLocationByPostalCode } from "@/Utils/PincodeFetch.jsx";
import {
  Grid,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Link,
  Autocomplete,
  InputAdornment,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  useMediaQuery,
  useTheme,
  RadioGroup,
  FormControlLabel as MuiFormControlLabel,
  Radio,
  FormControl,
  FormHelperText,
  IconButton,
  ListSubheader,
} from "@mui/material";
import {
  Person,
  PersonOutlined,
  WhatsApp,
  Email,
  Phone,
  Home,
  Work,
  CheckCircle,
  CheckCircleOutline,
  Send,
  FavoriteBorderOutlined,
  HomeWork,
  MeetingRoom,
  InfoOutlined,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { Link as RouterLink } from "next/link";
import { useDispatch } from "react-redux";
import FlagIcon from "@mui/icons-material/Flag";
import Navbar from "@/Components/Navbar/NavBar";
import Footer from "@/Components/Footers/Footer";
import { API_BASE_URL } from "@/Api/api";
import AdSlot from "@/Components/ads/GoogleAd";
import { ADS } from "@/config/ads.config";

const initialFormState = {
  firstName: "",
  email: "",
  mobileNumber: "",
  whatsappNumber: "",
  address: "",
  pincode: "",
  country: "India",
  state: "",
  city: "",
  occupation: "",
  otherOccupation: "",
  terms: false,

  currentPreference: {
    industry: "",
    category: "",
    investmentRange: "",
    investmentAmount: "",
    locationType: "domestic",
    preferredCountry: "India",
    preferredState: "",
    preferredDistrict: "",
    preferredCity: "",
    propertyType: "",
    propertySize: "",
    propertyCountry: "",
    propertyState: "",
    propertyCity: "",
  },

  preferences: [],
};

const initialVerificationState = {
  email: {
    verified: false,
    otpSent: false,
    showDialog: false,
    loading: false,
    error: null,
  },
  mobile: {
    verified: false,
    otpSent: false,
    showDialog: false,
    loading: false,
    error: null,
  },
};

const occupationOptions = [
  "Select Occupation",
  "Student",
  "Salaried Professional",
  "Business Owner/ Self-Employed",
  "Retired",
  "Freelancer/ Consultant",
  "Homemaker",
  "Investor",
  "Other",
];

const investmentAmountOptions = [
  "Select preferred Investment Amount",
  "Below - 50,000",
  "Rs. 50,000 - 2 L",
  "Rs. 2 L - 5 L",
  "Rs. 5 L - 10 L",
  "Rs. 10 L - 20 L",
  "Rs. 20 L - 30 L",
  "Rs. 30 L - 50 L",
  "Rs. 50 L - 1 Cr",
  "Rs. 1 Cr - 2 Crs",
  "Rs. 2 Crs - 5 Crs",
  "Rs. 5Crs - above",
];

const investmentRangeOptions = [
  "Select Preferred Readiness",
  "having amount",
  "take loan",
  "need loan",
];

const propertySizeOptions = [
  "Select Total Area",
  "Below - 100 sq ft",
  "100 sq ft - 200 sq ft",
  "200 sq ft - 500 sq ft",
  "500 sq ft - 1000 sq ft",
  "1000 sq ft - 1500 sq ft",
  "1500 sq ft - 2000 sq ft",
  "2000 sq ft - 3000 sq ft",
  "3000 sq ft - 5000 sq ft",
  "5000 sq ft - 7000 sq ft",
  "7000 sq ft - 10000 sq ft",
  "Above 10000 sq ft",
];

const InvestorRegister = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [verificationState, setVerificationState] = useState(
    initialVerificationState
  );
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [otpInput, setOtpInput] = useState("");
  const [otpToken, setOtpToken] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [showWhatsappSnackbar, setShowWhatsappSnackbar] = useState(false);

  const [countries, setCountries] = useState([]);
  const [countryCodes, setCountryCodes] = useState([]);
  const [phonePrefix, setPhonePrefix] = useState("+91");
  const [indiaData, setIndiaData] = useState([]);
  const [intlCountries, setIntlCountries] = useState([]);
  const [intlStates, setIntlStates] = useState([]);
  const [intlCities, setIntlCities] = useState([]);
  const [propertyCountries, setPropertyCountries] = useState([]);
  const [propertyStates, setPropertyStates] = useState([]);
  const [propertyCities, setPropertyCities] = useState([]);
  const [loadingPincode, setLoadingPincode] = useState(false);
  const [pincodeError, setPincodeError] = useState("");

  // ─── NEW: grouped industry state ─────────────────────────────────────────
  // industryGroups: [{ heading: string, industries: string[] }]
  const [industryGroups, setIndustryGroups] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loadingIndustries, setLoadingIndustries] = useState(true);
  const [loadingIndustryDetails, setLoadingIndustryDetails] = useState(false);
  // ─────────────────────────────────────────────────────────────────────────

  const navigate = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dropdownRef = useRef(null);

  const FORM_DATA_KEY = "investor_form_data";

  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries")
      .then((res) => res.json())
      .then((data) => {
        if (data.data)
          setCountries(data.data.map((c) => ({ name: c.country, code: c.iso2 })));
      });

    fetch("https://countriesnow.space/api/v0.1/countries/codes")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setCountryCodes(data.data);
      });

    const fetchIndiaData = async () => {
      try {
        const res = await axios.get(
          "https://raw.githubusercontent.com/prasad-gowda/india-state-district-cities/master/India-state-district-city.json"
        );
        setIndiaData(res.data);
      } catch (err) {
        console.error("Error fetching India data:", err);
      }
    };
    fetchIndiaData();

    fetch("https://countriesnow.space/api/v0.1/countries/positions")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          const countryNames = data.data.map((c) => c.name);
          setIntlCountries(countryNames);
          setPropertyCountries(countryNames);
        }
      });

    const savedData = localStorage.getItem(FORM_DATA_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }

    fetchIndustries();
  }, []);

  useEffect(() => {
    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    const country = formData.country;
    if (!country) { setPhonePrefix("+91"); return; }
    const found = countryCodes.find(
      (c) => c.name === country || c.iso2 === country || c.iso3 === country
    );
    setPhonePrefix(found ? found.dial_code : "+91");
  }, [formData.country, countryCodes]);

  const getCountryIsoCode = (countryName) => {
    if (!countryName) return "IN";
    const normalized = countryName.trim().toLowerCase();
    if (normalized === "india") return "IN";
    const selectedCountryObj = countries.find(
      (c) =>
        c.name?.toLowerCase() === normalized ||
        c.code?.toLowerCase() === normalized ||
        c.iso2?.toLowerCase() === normalized ||
        c.iso3?.toLowerCase() === normalized
    );
    if (selectedCountryObj?.code) return selectedCountryObj.code.toUpperCase();
    return normalized.length === 2 ? normalized.toUpperCase() : "IN";
  };

  const lookupPincode = async (pincode, country) => {
    const countryCode = getCountryIsoCode(country);
    if (!pincode || !country) return;
    setLoadingPincode(true);
    setPincodeError("");
    try {
      const result = await fetchGlobalLocationByPostalCode(pincode, countryCode);
      if (result.status !== "success") throw new Error(result.message || "No location found");
      setFormData((prev) => ({ ...prev, state: result.state || "", city: result.city || "" }));
    } catch (err) {
      setFormData((prev) => ({ ...prev, state: "", city: "" }));
      setPincodeError(
        countryCode === "IN"
          ? "Invalid Indian pincode"
          : "Postal code not found for selected country"
      );
    } finally {
      setLoadingPincode(false);
    }
  };

  useEffect(() => {
    const pincode = formData.pincode;
    const country = formData.country;
    const countryCode = getCountryIsoCode(country);
    if (!pincode || !country) { setPincodeError(""); return; }
    if (countryCode === "IN" && pincode.length === 6) lookupPincode(pincode, country);
    else if (countryCode !== "IN" && pincode.length >= 3) lookupPincode(pincode, country);
    else if (countryCode === "IN" && pincode.length > 0 && pincode.length < 6)
      setPincodeError("Enter 6-digit pincode");
  }, [formData.pincode, formData.country, countries]);

  const handlePincodeBlur = () => {
    const pincode = formData.pincode;
    const country = formData.country;
    const countryCode = getCountryIsoCode(country);
    if (
      (countryCode === "IN" && pincode.length === 6) ||
      (countryCode !== "IN" && pincode.length >= 3)
    )
      lookupPincode(pincode, country);
  };

  useEffect(() => {
    const country = formData.currentPreference.propertyCountry;
    if (!country) {
      setPropertyStates([]);
      setFormData((prev) => ({
        ...prev,
        currentPreference: { ...prev.currentPreference, propertyState: "", propertyCity: "" },
      }));
      setPropertyCities([]);
      return;
    }
    fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: country.trim() }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data && data.data.states) setPropertyStates(data.data.states.map((s) => s.name));
        else setPropertyStates([]);
      })
      .catch(() => setPropertyStates([]));
  }, [formData.currentPreference.propertyCountry]);

  useEffect(() => {
    const country = formData.currentPreference.propertyCountry;
    const state = formData.currentPreference.propertyState;
    if (!country || !state) {
      setPropertyCities([]);
      setFormData((prev) => ({
        ...prev,
        currentPreference: { ...prev.currentPreference, propertyCity: "" },
      }));
      return;
    }
    if (country === "India" && indiaData.length > 0) {
      const stateObj = indiaData.find((s) => s.name === state);
      if (stateObj) {
        const uniqueCities = Array.from(
          new Set((stateObj.cities || []).map((city) => city.name))
        );
        setPropertyCities(uniqueCities);
      } else setPropertyCities([]);
    } else {
      fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: country.trim(), state: state.trim() }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.data && Array.isArray(data.data)) setPropertyCities(data.data);
          else setPropertyCities([]);
        })
        .catch(() => setPropertyCities([]));
    }
  }, [
    formData.currentPreference.propertyCountry,
    formData.currentPreference.propertyState,
    indiaData,
  ]);

  useEffect(() => {
    const country = formData.currentPreference.preferredCountry;
    if (formData.currentPreference.locationType === "international" && country) {
      fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.data && data.data.states) setIntlStates(data.data.states.map((s) => s.name));
          else setIntlStates([]);
        })
        .catch(() => setIntlStates([]));
    }
  }, [formData.currentPreference.preferredCountry, formData.currentPreference.locationType]);

  useEffect(() => {
    const country = formData.currentPreference.preferredCountry;
    const state = formData.currentPreference.preferredState;
    if (formData.currentPreference.locationType === "international" && country && state) {
      fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, state }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.data) setIntlCities(data.data);
          else setIntlCities([]);
        })
        .catch(() => setIntlCities([]));
    }
  }, [
    formData.currentPreference.preferredCountry,
    formData.currentPreference.preferredState,
    formData.currentPreference.locationType,
  ]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      currentPreference: { ...prev.currentPreference, [field]: value },
    }));
  };
// Helper to extract clean name (text inside brackets if present, otherwise full name)
// Helper to get display name (text BEFORE bracket)
const getDisplayName = (name) => {
  if (!name) return name;
  return name.split("(")[0].trim();
};

// Helper to extract clean name (text INSIDE brackets, or full name if no brackets)
const extractCleanName = (name) => {
  if (!name) return name;
  const match = name.match(/\(([^)]+)\)/);
  return match ? match[1] : name;
};

const getIndianStates = () => indiaData.map((state) => state.name) || [];

const getIndianDistricts = (stateName) => {
  if (!stateName) return [];
  const stateObj = indiaData.find((s) => s.name === stateName);
  if (!stateObj) return [];
  return stateObj.districts || [];
};

const getIndianCities = (stateName, districtValue) => {
  if (!stateName || !districtValue) return [];

  const stateObj = indiaData.find((s) => s.name === stateName);
  if (!stateObj) return [];
  if (!stateObj.cities || !Array.isArray(stateObj.cities)) return [];

  // KEY FIX:
  // District stored value = "Kanchipuram (Kancheepuram)"  (raw from districts array)
  // city.district in JSON = "Kanchipuram"                 (only text BEFORE bracket)
  // So we MUST use getDisplayName() to match city.district

  const displayDistrict = getDisplayName(districtValue); // "Kanchipuram"
  const cleanDistrict = extractCleanName(districtValue);  // "Kancheepuram"

  console.log("Matching district:", {
    raw: districtValue,
    display: displayDistrict,
    clean: cleanDistrict,
    totalCities: stateObj.cities.length,
    sampleCityDistricts: stateObj.cities.slice(0, 5).map(c => c.district)
  });

  const filtered = stateObj.cities.filter((city) => {
    const cd = (city.district || "").trim();
    return (
      cd === displayDistrict ||                                    // ✅ PRIMARY: "Kanchipuram"
      cd === cleanDistrict ||                                      // "Kancheepuram"
      cd === districtValue ||                                      // exact raw match
      cd.toLowerCase() === displayDistrict.toLowerCase() ||       // case-insensitive
      cd.toLowerCase() === cleanDistrict.toLowerCase()
    );
  });

  console.log("Filtered cities count:", filtered.length);

  const cityNames = filtered.map((city) => city.name);
  return [...new Set(cityNames)];
};

  // ─── UPDATED: fetchIndustries ─────────────────────────────────────────────
  // Backend now returns: { success, data: { Industry: [{ heading, industries }] } }
  const fetchIndustries = async () => {
    try {
      setLoadingIndustries(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/getIndustryByIndustryName`
      );
      const result = await response.json();

      if (result.success && Array.isArray(result.data?.Industry)) {
        // Store grouped structure: [{ heading, industries: string[] }]
        setIndustryGroups(result.data.Industry);

        // Auto-select Food & Beverages if present (search across all groups)
        let defaultIndustry = null;
        for (const group of result.data.Industry) {
          const found = group.industries?.find(
            (ind) =>
              ind.toLowerCase().includes("food") ||
              ind.toLowerCase().includes("beverage")
          );
          if (found) { defaultIndustry = found; break; }
        }
        if (defaultIndustry) {
          handlePreferenceChange("industry", defaultIndustry);
          fetchIndustryDetails(defaultIndustry);
        }
      }
    } catch (error) {
      console.error("Error fetching industries:", error);
      showSnackbar("Failed to load industries", "error");
    } finally {
      setLoadingIndustries(false);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

  const fetchIndustryDetails = async (industryName) => {
    if (!industryName) return;
    try {
      setLoadingIndustryDetails(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/getIndustryByIndustryName?industry=${encodeURIComponent(industryName)}`
      );
      const result = await response.json();
      if (result.success && result.data) {
        // Normalize: backend may return strings or objects — always store strings
        const raw = result.data.categories || [];
        const normalized = raw.map((c) =>
          typeof c === "string" ? c : c?.name || c?.category || c?.label || String(c)
        );
        setCategoryOptions(normalized);
      }
    } catch (error) {
      console.error("Error fetching industry details:", error);
      showSnackbar("Failed to load industry details", "error");
    } finally {
      setLoadingIndustryDetails(false);
    }
  };

  const handleIndustryChange = (value) => {
    handlePreferenceChange("industry", value);
    handlePreferenceChange("category", "");
    if (value) fetchIndustryDetails(value);
  };

  const handleAddPreference = () => {
    const pref = formData.currentPreference;
    const errors = [];
    if (!pref.industry) errors.push("Industry");
    if (!pref.category) errors.push("Category");
    if (!pref.investmentRange) errors.push("Investment Range");
    if (!pref.investmentAmount) errors.push("Investment Amount");
    if (!pref.locationType) errors.push("Location Type");
    if (!pref.propertyType) errors.push("Property Type");
    if (pref.locationType === "domestic") {
      if (!pref.preferredState) errors.push("Preferred State");
      if (!pref.preferredDistrict) errors.push("Preferred District");
      if (!pref.preferredCity) errors.push("Preferred City");
    } else if (pref.locationType === "international") {
      if (!pref.preferredCountry) errors.push("Preferred Country");
      if (!pref.preferredState) errors.push("Preferred State");
      if (!pref.preferredCity) errors.push("Preferred City");
    }
    if (pref.propertyType === "Own Property") {
      if (!pref.propertySize) errors.push("Property Size");
      if (!pref.propertyCountry) errors.push("Property Country");
      if (!pref.propertyState) errors.push("Property State");
      if (!pref.propertyCity) errors.push("Property City");
    }
    if (errors.length > 0) {
      showSnackbar(`Please fill required fields: ${errors.join(", ")}`, "error");
      return;
    }
    const isDuplicate = formData.preferences.some(
      (existingPref) =>
        existingPref.industry === pref.industry &&
        existingPref.category === pref.category &&
        existingPref.investmentAmount === pref.investmentAmount &&
        existingPref.locationType === pref.locationType &&
        existingPref.preferredState === pref.preferredState &&
        existingPref.propertyType === pref.propertyType
    );
    if (isDuplicate) {
      showSnackbar("This preference already exists!", "warning");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      preferences: [...prev.preferences, { ...pref }],
      currentPreference: {
        ...initialFormState.currentPreference,
        locationType: pref.locationType,
      },
    }));
    showSnackbar("Preference added successfully!", "success");
  };

  const handleRemovePreference = (index) => {
    if (window.confirm("Are you sure you want to remove this preference?")) {
      setFormData((prev) => ({
        ...prev,
        preferences: prev.preferences.filter((_, i) => i !== index),
      }));
      showSnackbar("Preference removed", "info");
    }
  };

  const handleEditPreference = (index) => {
    const prefToEdit = formData.preferences[index];
    setFormData((prev) => ({
      ...prev,
      currentPreference: { ...prefToEdit },
      preferences: prev.preferences.filter((_, i) => i !== index),
    }));
    showSnackbar("Preference loaded for editing", "info");
  };

  const handleVerificationDialog = (field, open) => {
    setVerificationState((prev) => ({
      ...prev,
      [field]: { ...prev[field], showDialog: open, error: null },
    }));
    setOtpInput("");
  };

  const handleSendOtp = async (field) => {
    const identifier = field === "email" ? formData.email : formData.mobileNumber;
    if (!identifier) { showSnackbar(`Please enter ${field} first`, "error"); return; }
    setVerificationState((prev) => ({
      ...prev,
      [field]: { ...prev[field], loading: true, error: null },
    }));
    try {
      const response = await axios.post(
        `${API_BASE_URL}/otpverify/send-otp-email`,
        { [field === "email" ? "email" : "phone"]: identifier, type: field },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data.token) {
        setOtpToken(response.data.token);
        setVerificationState((prev) => ({
          ...prev,
          [field]: { ...prev[field], otpSent: true, loading: false, verified: false },
        }));
        showSnackbar(`OTP sent successfully to your ${field}`, "success");
      } else {
        throw new Error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to send OTP";
      setVerificationState((prev) => ({
        ...prev,
        [field]: { ...prev[field], loading: false, error: errorMessage },
      }));
      showSnackbar(errorMessage, "error");
    }
  };

  const handleVerifyOtp = async (field) => {
    if (!otpInput || otpInput.length !== 6) {
      setVerificationState((prev) => ({
        ...prev,
        [field]: { ...prev[field], error: "Please enter a valid 6-digit OTP" },
      }));
      return;
    }
    setVerificationState((prev) => ({
      ...prev,
      [field]: { ...prev[field], loading: true, error: null },
    }));
    try {
      const response = await axios.post(
        `${API_BASE_URL}/otpverify/verify-otp`,
        {
          identifier: field === "email" ? formData.email : formData.mobileNumber,
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
      if (response.data.message?.includes("verified successfully")) {
        setVerificationState((prev) => ({
          ...prev,
          [field]: { ...prev[field], verified: true, showDialog: false, loading: false },
        }));
        showSnackbar(
          response.data.message ||
            `${field === "email" ? "Email" : "Mobile number"} verified successfully!`,
          "success"
        );
        setOtpInput("");
      } else {
        throw new Error(response.data.error || "OTP verification failed");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "OTP verification failed";
      setVerificationState((prev) => ({
        ...prev,
        [field]: { ...prev[field], loading: false, error: errorMessage },
      }));
      showSnackbar(errorMessage, "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = [];
    if (!formData.firstName.trim()) validationErrors.push("First Name");
    if (!formData.email.trim()) validationErrors.push("Email");
    if (!verificationState.email.verified) validationErrors.push("Email verification");
    if (!formData.mobileNumber.trim() || formData.mobileNumber.length !== 10)
      validationErrors.push("Mobile Number (10 digits)");
    if (!formData.address.trim()) validationErrors.push("Address");
    if (!formData.pincode.trim()) validationErrors.push("Pincode/Postal Code");
    if (!formData.country.trim()) validationErrors.push("Country");
    if (formData.occupation === "" || formData.occupation === "Select Occupation")
      validationErrors.push("Occupation");
    if (formData.occupation === "Other" && !formData.otherOccupation.trim())
      validationErrors.push("Specify Occupation");
    if (!formData.terms) validationErrors.push("Terms and Conditions");
    if (formData.preferences.length === 0)
      validationErrors.push("At least one investment preference");
    if (validationErrors.length > 0) {
      showSnackbar(`Please complete: ${validationErrors.join(", ")}`, "error");
      return;
    }
    const formattedData = {
      firstName: formData.firstName.trim(),
      email: formData.email.trim(),
      mobileNumber: `${phonePrefix}${formData.mobileNumber}`,
      whatsappNumber: formData.whatsappNumber
        ? `${phonePrefix}${formData.whatsappNumber}`
        : "",
      address: formData.address.trim(),
      pincode: formData.pincode.trim(),
      country: formData.country,
      state: formData.state || "",
      city: formData.city || "",
      occupation: formData.occupation,
      ...(formData.occupation === "Other" && {
        specifyOccupation: formData.otherOccupation.trim(),
      }),
      preferences: formData.preferences.map((pref) => {
        const isInternational = pref.locationType === "international";
        let locationData = {};
        if (isInternational) {
          locationData = {
            preferredCountry: pref.preferredCountry || "",
            preferredState: pref.preferredState || "",
            preferredCity: pref.preferredCity || "",
            locationType: "international",
          };
        } else {
          locationData = {
            preferredCountry: "India",
            preferredState: pref.preferredState || "",
preferredDistrict: getDisplayName(pref.preferredDistrict) || "", // ← send clean name            preferredCity: pref.preferredCity || "",
            locationType: "domestic",
          };
        }
        return {
          category: [{ main: pref.industry || "", sub: pref.category || "" }],
          investmentRange: pref.investmentRange || "",
          investmentAmount: pref.investmentAmount || "",
          propertyPreferred: [
            {
              propertyType: pref.propertyType || "",
              ...(pref.propertyType === "Own Property" && {
                propertySize: pref.propertySize || "",
                propertyCountry: pref.propertyCountry || "",
                propertyState: pref.propertyState || "",
                propertyCity: pref.propertyCity || "",
              }),
            },
          ],
          ...locationData,
        };
      }),
    };
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/investor/createInvestor`,
        formattedData,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 201) {
        localStorage.removeItem(FORM_DATA_KEY);
        setFormData(initialFormState);
        setRegistrationSuccess(true);
        if (formattedData.firstName) localStorage.setItem("investorName", formattedData.firstName);
        if (formattedData.email) localStorage.setItem("investorEmail", formattedData.email);
      } else {
        showSnackbar("An unexpected error occurred. Please try again.", "error");
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.status === 409) {
        showSnackbar("This user is already registered. Please log in.", "error");
      } else if (error.response?.data?.errors) {
        showSnackbar(error.response.data.errors.join(", "), "error");
      } else {
        showSnackbar(
          error.response?.data?.message || "An unexpected error occurred. Please try again.",
          "error"
        );
      }
    }
  };

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };
  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));
  const openLoginPopup = () => setLoginOpen(true);
  const closeLoginPopup = () => { setLoginOpen(false); setRegistrationSuccess(false); };
  const handleSuccessRedirect = () => { setRegistrationSuccess(false); navigate.push("/"); };

  // ─── Build flat + grouped MenuItems for the Industry select ──────────────
  const buildIndustryMenuItems = () => {
    if (loadingIndustries) {
      return [
        <MenuItem key="loading" disabled>
          <CircularProgress size={16} sx={{ mr: 1 }} /> Loading industries…
        </MenuItem>,
      ];
    }
    if (!industryGroups.length) {
      return [<MenuItem key="none" disabled>No industries available</MenuItem>];
    }

    const items = [
      <MenuItem key="__placeholder" value="">
        <em>Select Industry</em>
      </MenuItem>,
    ];

    industryGroups.forEach((group) => {
      // Section header (non-selectable) — styled like the screenshot
      items.push(
        <ListSubheader
          key={`header-${group.heading}`}
          sx={{
            fontWeight: 700,
            fontSize: "0.7rem",
            letterSpacing: "0.08em",
            color: "text.secondary",
            textTransform: "uppercase",
            lineHeight: "2rem",
            backgroundColor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
            px: 2,
          }}
        >
          {group.heading}
        </ListSubheader>
      );

      // Industry items under this heading
      (group.industries || []).forEach((industry) => {
        items.push(
          <MenuItem key={industry} value={industry} sx={{ pl: 3 }}>
            {industry}
          </MenuItem>
        );
      });
    });

    return items;
  };
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      <Box sx={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1000 }}>
        <Navbar />
      </Box>

      <Typography
        variant="h3"
        gutterBottom
        fontWeight="bold"
        sx={{
          color: "#7ad03a",
          mb: -3,
          mt: { xs: 12, md: 15, lg: 25, sm: 20 },
          textAlign: "center",
          textDecoration: "underline",
          fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
        }}
      >
        Investor Registration
      </Typography>

      <Box
        sx={{
          minHeight: "100vh",
          flexDirection: isMobile ? "column" : "row",
          display: "flex",
          justifyContent: "space-evenly",
          marginLeft: { xs: "0" },
          width: { xs: "70%", lg: "100%", md: "100%", sm: "100%" },
        }}
      >
        <Box
          ref={dropdownRef}
          sx={{
            p: 4,
            ml: "20px",
            width: "100%",
            maxWidth: "1030px",
            position: "relative",
            borderColor: "divider",
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* ── Personal Details ───────────────────────────────────────── */}
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                mt: 1,
                fontWeight: "bold",
                color: "text.primary",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <PersonOutlined color="primary" /> Personal Details
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 3,
                mb: 4,
              }}
            >
              {/* First Name */}
              <Box sx={{ gridColumn: { xs: "span 1", sm: "span 2", md: "span 3" } }}>
                <TextField
                  label="First Name"
                  fullWidth
                  variant="outlined"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
              </Box>

              {/* Email */}
              <Box>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        {verificationState.email.verified ? (
                          <Box display="flex" alignItems="center" color="success.main">
                            <CheckCircleOutline fontSize="medium" />
                            <Typography variant="caption" sx={{ ml: 0.5 }}>
                              Verified
                            </Typography>
                          </Box>
                        ) : (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              handleVerificationDialog("email", true);
                              handleSendOtp("email");
                            }}
                            disabled={!formData.email || verificationState.email.loading}
                            startIcon={
                              verificationState.email.loading ? (
                                <CircularProgress size={14} />
                              ) : (
                                <Send fontSize="small" />
                              )
                            }
                          >
                            Verify
                          </Button>
                        )}
                      </InputAdornment>
                    ),
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
              </Box>

              {/* Mobile */}
              <Box>
                <TextField
                  label="Mobile Number"
                  fullWidth
                  variant="outlined"
                  value={formData.mobileNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                    handleInputChange("mobileNumber", value);
                  }}
                  inputProps={{ maxLength: 10, inputMode: "numeric" }}
                  onBlur={() => {
                    if (formData.mobileNumber.length === 10) setShowWhatsappSnackbar(true);
                  }}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color="action" />
                        <Typography variant="body1" sx={{ ml: 1 }}>
                          {phonePrefix}
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
              </Box>

              {/* WhatsApp */}
              <Box>
                <TextField
                  label="WhatsApp Number"
                  fullWidth
                  variant="outlined"
                  value={formData.whatsappNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                    handleInputChange("whatsappNumber", value);
                  }}
                  inputProps={{ maxLength: 10, inputMode: "numeric" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color="action" />
                        <Typography variant="body1" sx={{ ml: 1 }}>
                          {phonePrefix}
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
              </Box>

              {/* Country */}
              <Box>
                <Autocomplete
                  options={countries.map((c) => c.name)}
                  value={formData.country}
                  onChange={(_, newValue) => {
                    handleInputChange("country", newValue || "India");
                    handleInputChange("state", "");
                    handleInputChange("city", "");
                    handleInputChange("pincode", "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Country"
                      variant="outlined"
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                  fullWidth
                  sx={{ borderRadius: "8px", backgroundColor: "background.paper" }}
                />
              </Box>

              {/* Address */}
              <Box sx={{ gridColumn: { xs: "span 1", sm: "span 2", md: "span 2" } }}>
                <TextField
                  label="Address"
                  fullWidth
                  variant="outlined"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Home color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
              </Box>

              {/* Pincode */}
              <Box>
                <TextField
                  label={formData.country === "India" ? "Pincode" : "Postal Code"}
                  fullWidth
                  variant="outlined"
                  value={formData.pincode}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, formData.country === "India" ? 6 : 10);
                    handleInputChange("pincode", value);
                  }}
                  required
                  error={!!pincodeError}
                  helperText={pincodeError}
                  inputProps={{
                    maxLength: formData.country === "India" ? 6 : 10,
                    inputMode: "numeric",
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Tooltip title={formData.country}>
                          <FlagIcon />
                        </Tooltip>
                      </InputAdornment>
                    ),
                    endAdornment: loadingPincode ? (
                      <InputAdornment position="end">
                        <CircularProgress size={20} />
                      </InputAdornment>
                    ) : null,
                  }}
                  onBlur={handlePincodeBlur}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
              </Box>

              {/* State */}
              <Box>
                <TextField
                  label="State"
                  fullWidth
                  variant="outlined"
                  value={formData.state}
                  InputProps={{ readOnly: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: "action.hover",
                    },
                  }}
                />
              </Box>

              {/* City */}
              <Box>
                <TextField
                  label="City"
                  fullWidth
                  variant="outlined"
                  value={formData.city}
                  InputProps={{ readOnly: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: "action.hover",
                    },
                  }}
                />
              </Box>

              {/* Occupation */}
              <Box sx={{ gridColumn: { xs: "span 1", sm: "span 2", md: "span 3" } }}>
                <TextField
                  select
                  label="Occupation"
                  fullWidth
                  variant="outlined"
                  value={formData.occupation}
                  onChange={(e) => handleInputChange("occupation", e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Work color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                >
                  {occupationOptions.map((option) => (
                    <MenuItem key={option} value={option === "Select Occupation" ? "" : option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {formData.occupation === "Other" && (
                <Box sx={{ gridColumn: { xs: "span 1", sm: "span 2", md: "span 3" } }}>
                  <TextField
                    label="Specify Occupation"
                    fullWidth
                    variant="outlined"
                    value={formData.otherOccupation}
                    onChange={(e) => handleInputChange("otherOccupation", e.target.value)}
                    required
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                  />
                </Box>
              )}
            </Box>

            {/* ── Preferences ────────────────────────────────────────────── */}
            <Box sx={{ mt: 6 }}>
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
                  title="You can add multiple preferences to get more offers from us!"
                  placement="right-start"
                  arrow
                  enterTouchDelay={0}
                >
                  <IconButton
                    size="small"
                    aria-label="info"
                    sx={{
                      color: "warning.main",
                      "&:hover": { backgroundColor: "info.main", color: "white" },
                      marginLeft: "5px",
                    }}
                  >
                    <InfoOutlined fontSize="medium" />
                  </IconButton>
                </Tooltip>
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(4, 1fr)",
                  },
                  gap: 3,
                  mb: 4,
                }}
              >
                {/* ── Industry (grouped) ── */}
                <Box>
                  <TextField
                    select
                    label="Industry"
                    fullWidth
                    variant="outlined"
                    value={formData.currentPreference.industry}
                    onChange={(e) => handleIndustryChange(e.target.value)}
                    disabled={loadingIndustries}
                    sx={{ borderRadius: "8px" }}
                    SelectProps={{
                      // Allow ListSubheader to render correctly inside Select
                      MenuProps: {
                        PaperProps: {
                          sx: {
                            maxHeight: 360,
                            "& .MuiListSubheader-root": {
                              pointerEvents: "none", // makes headers non-clickable
                            },
                          },
                        },
                      },
                    }}
                  >
                    {buildIndustryMenuItems()}
                  </TextField>
                </Box>

                {/* ── Category ── */}
                <Box sx={{ width: "100%", minWidth: 0 }}>
                  <TextField
                    select
                    label="Category"
                    fullWidth
                    variant="outlined"
                    value={formData.currentPreference.category}
                    onChange={(e) => handlePreferenceChange("category", e.target.value)}
                    disabled={
                      !formData.currentPreference.industry || loadingIndustryDetails
                    }
                    sx={{
                      borderRadius: "8px",
                      "& .MuiSelect-select": {
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      },
                    }}
                    SelectProps={{
                      renderValue: (selected) => {
                        if (!selected)
                          return <span style={{ color: "#999" }}>Select Category</span>;
                        return (
                          <Box
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              width: "100%",
                              display: "block",
                            }}
                            title={selected}
                          >
                            {selected}
                          </Box>
                        );
                      },
                      MenuProps: {
                        PaperProps: {
                          sx: {
                            maxHeight: 300,
                            "& .MuiMenuItem-root": {
                              whiteSpace: "normal",
                              minHeight: "48px",
                            },
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Category</em>
                    </MenuItem>
                    {categoryOptions.map((category, idx) => {
                      const label =
                        typeof category === "string"
                          ? category
                          : category?.name || category?.category || category?.label || String(category);
                      return (
                        <MenuItem
                          key={`${label}-${idx}`}
                          value={label}
                          sx={{ whiteSpace: "normal", py: 1, maxWidth: "400px" }}
                        >
                          {label}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                  {loadingIndustryDetails && (
                    <FormHelperText>Loading categories…</FormHelperText>
                  )}
                </Box>

                {/* ── Investment Amount ── */}
                <Box>
                  <TextField
                    select
                    label="Preferred Investment Amount"
                    fullWidth
                    variant="outlined"
                    value={formData.currentPreference.investmentAmount}
                    onChange={(e) =>
                      handlePreferenceChange("investmentAmount", e.target.value)
                    }
                    sx={{ borderRadius: "8px" }}
                  >
                    {investmentAmountOptions.map((option) => (
                      <MenuItem
                        key={option}
                        value={option === "Select preferred Investment Amount" ? "" : option}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                {/* ── Investment Readiness ── */}
                <Box>
                  <TextField
                    select
                    label="Preferred Investment Readiness"
                    fullWidth
                    variant="outlined"
                    value={formData.currentPreference.investmentRange}
                    onChange={(e) =>
                      handlePreferenceChange("investmentRange", e.target.value)
                    }
                    sx={{ borderRadius: "8px" }}
                  >
                    {investmentRangeOptions.map((option) => (
                      <MenuItem
                        key={option}
                        value={option === "Select Preferred Readiness" ? "" : option}
                      >
                        {option
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                {/* ── Location Type ── */}
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                    Preferred Location Type
                  </Typography>
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      value={formData.currentPreference.locationType}
                      onChange={(e) => {
                        const value = e.target.value;
                        handlePreferenceChange("locationType", value);
                        handlePreferenceChange(
                          "preferredCountry",
                          value === "international" ? "" : "India"
                        );
                        handlePreferenceChange("preferredState", "");
                        handlePreferenceChange("preferredDistrict", "");
                        handlePreferenceChange("preferredCity", "");
                      }}
                    >
                      <MuiFormControlLabel value="domestic" control={<Radio />} label="India" />
                      <MuiFormControlLabel
                        value="international"
                        control={<Radio />}
                        label="International"
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>

                {/* ── Location Fields ── */}
                {formData.currentPreference.locationType && (
                  <>
                    {formData.currentPreference.locationType === "international" ? (
                      <>
                        <Box>
                          <TextField
                            select
                            label="Country"
                            fullWidth
                            variant="outlined"
                            value={formData.currentPreference.preferredCountry}
                            onChange={(e) => {
                              handlePreferenceChange("preferredCountry", e.target.value);
                              handlePreferenceChange("preferredState", "");
                              handlePreferenceChange("preferredCity", "");
                            }}
                            sx={{ borderRadius: "8px" }}
                          >
                            <MenuItem value="">Select Country</MenuItem>
                            {intlCountries.map((country) => (
                              <MenuItem key={country} value={country}>
                                {country}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Box>
                        <Box>
                          <TextField
                            select
                            label="State"
                            fullWidth
                            variant="outlined"
                            value={formData.currentPreference.preferredState}
                            onChange={(e) => {
                              handlePreferenceChange("preferredState", e.target.value);
                              handlePreferenceChange("preferredCity", "");
                            }}
                            disabled={!formData.currentPreference.preferredCountry}
                            sx={{ borderRadius: "8px" }}
                          >
                            <MenuItem value="">Select State</MenuItem>
                            {intlStates.map((state) => (
                              <MenuItem key={state} value={state}>
                                {state}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Box>
                        <Box>
                          <TextField
                            select
                            label="City"
                            fullWidth
                            variant="outlined"
                            value={formData.currentPreference.preferredCity}
                            onChange={(e) =>
                              handlePreferenceChange("preferredCity", e.target.value)
                            }
                            disabled={!formData.currentPreference.preferredState}
                            sx={{ borderRadius: "8px" }}
                          >
                            <MenuItem value="">Select City</MenuItem>
                            {intlCities.map((city) => (
                              <MenuItem key={city} value={city}>
                                {city}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box>
                          <TextField
                            select
                            label="State"
                            fullWidth
                            variant="outlined"
                            value={formData.currentPreference.preferredState}
                            onChange={(e) => {
                              handlePreferenceChange("preferredState", e.target.value);
                              handlePreferenceChange("preferredDistrict", "");
                              handlePreferenceChange("preferredCity", "");
                            }}
                            sx={{ borderRadius: "8px" }}
                          >
                            <MenuItem value="">Select State</MenuItem>
                            {getIndianStates().map((state) => (
                              <MenuItem key={state} value={state}>
                                {state}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Box>
    <Box>
  <TextField
    select
    label="District"
    fullWidth
    variant="outlined"
    value={formData.currentPreference.preferredDistrict}
    onChange={(e) => {
      handlePreferenceChange("preferredDistrict", e.target.value);
      handlePreferenceChange("preferredCity", "");
    }}
    disabled={!formData.currentPreference.preferredState}
    sx={{ borderRadius: "8px" }}
  >
    <MenuItem value="">Select District</MenuItem>
    {getIndianDistricts(formData.currentPreference.preferredState).map((district) => {
      const displayName = getDisplayName(district); // "Kanchipuram"
      return (
        // value = raw "Kanchipuram (Kancheepuram)" → stored in preferredDistrict
        // label = "Kanchipuram" → shown to user
        <MenuItem key={district} value={district}>
          {displayName}
        </MenuItem>
      );
    })}
  </TextField>
</Box>
                        <Box>
                          <TextField
                            select
                            label="City"
                            fullWidth
                            variant="outlined"
                            value={formData.currentPreference.preferredCity}
                            onChange={(e) =>
                              handlePreferenceChange("preferredCity", e.target.value)
                            }
                            disabled={!formData.currentPreference.preferredDistrict}
                            sx={{ borderRadius: "8px" }}
                          >
                            <MenuItem value="">Select City</MenuItem>
                            {getIndianCities(
                              formData.currentPreference.preferredState,
                              formData.currentPreference.preferredDistrict
                            ).map((city) => (
                              <MenuItem key={city} value={city}>
                                {city}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Box>
                      </>
                    )}
                  </>
                )}

                {/* ── Property Type ── */}
                <Box sx={{ gridColumn: { xs: "span 1", sm: "span 2", md: "span 4" } }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                    Property Type
                  </Typography>
                  <RadioGroup
                    row
                    value={formData.currentPreference.propertyType}
                    onChange={(e) => {
                      const value = e.target.value;
                      handlePreferenceChange("propertyType", value);
                      if (value !== "Own Property") {
                        handlePreferenceChange("propertySize", "");
                        handlePreferenceChange("propertyCountry", "");
                        handlePreferenceChange("propertyState", "");
                        handlePreferenceChange("propertyCity", "");
                      }
                    }}
                    sx={{ gap: 3 }}
                  >
                    <MuiFormControlLabel
                      value="Own Property"
                      control={<Radio color="primary" />}
                      label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <HomeWork color="primary" />
                          <Typography>Own Property</Typography>
                        </Box>
                      }
                    />
                    <MuiFormControlLabel
                      value="Rental Property"
                      control={<Radio color="primary" />}
                      label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <MeetingRoom color="primary" />
                          <Typography>Rental Property</Typography>
                        </Box>
                      }
                    />
                  </RadioGroup>
                </Box>

                {/* ── Own Property fields ── */}
                {formData.currentPreference.propertyType === "Own Property" && (
                  <>
                    <Box>
                      <TextField
                        select
                        label="Property Size"
                        fullWidth
                        variant="outlined"
                        value={formData.currentPreference.propertySize}
                        onChange={(e) =>
                          handlePreferenceChange("propertySize", e.target.value)
                        }
                        sx={{ borderRadius: "8px" }}
                      >
                        {propertySizeOptions.map((option) => (
                          <MenuItem
                            key={option}
                            value={option === "Select Total Area" ? "" : option}
                          >
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                    <Box>
                      <Autocomplete
                        freeSolo
                        options={propertyCountries}
                        value={formData.currentPreference.propertyCountry}
                        onChange={(_, newValue) => {
                          handlePreferenceChange("propertyCountry", newValue || "");
                          handlePreferenceChange("propertyState", "");
                          handlePreferenceChange("propertyCity", "");
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Property Country"
                            required
                            fullWidth
                            variant="outlined"
                            sx={{ borderRadius: "8px" }}
                          />
                        )}
                      />
                    </Box>
                    <Box>
                      <Autocomplete
                        freeSolo
                        options={propertyStates}
                        value={formData.currentPreference.propertyState}
                        onChange={(_, newValue) => {
                          handlePreferenceChange("propertyState", newValue || "");
                          handlePreferenceChange("propertyCity", "");
                        }}
                        disabled={!formData.currentPreference.propertyCountry}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Property State"
                            fullWidth
                            variant="outlined"
                            sx={{ borderRadius: "8px" }}
                          />
                        )}
                      />
                    </Box>
                    <Box>
                      <Autocomplete
                        freeSolo
                        options={propertyCities}
                        value={formData.currentPreference.propertyCity}
                        onChange={(_, newValue) => {
                          handlePreferenceChange("propertyCity", newValue || "");
                        }}
                        disabled={!formData.currentPreference.propertyState}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            label="Property City"
                            variant="outlined"
                            sx={{ borderRadius: "8px" }}
                          />
                        )}
                      />
                    </Box>
                  </>
                )}
              </Box>

              {/* Add Preference Button */}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Button
                  onClick={handleAddPreference}
                  sx={{
                    borderRadius: "8px",
                    backgroundColor: "#7ad03a",
                    color: "#fff",
                    px: 4,
                    py: 1.5,
                    fontWeight: "bold",
                    "&:hover": { backgroundColor: "#5a9e2a" },
                  }}
                >
                  Add Preference
                </Button>
              </Box>

              {/* Preferences Table */}
              {formData.preferences.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Your Investment Preferences
                  </Typography>
                  <Box sx={{ overflowX: "auto" }}>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        borderRadius: "12px",
                        overflow: "hidden",
                      }}
                    >
                      <thead>
                        <tr style={{ backgroundColor: "#7ad03a", color: "white" }}>
                          {[
                            "#",
                            "Industry",
                            "Category",
                            "Investment Amount",
                            "Location Type",
                            "State/Country",
                            "District/State",
                            "City",
                            "Property Type",
                            "Actions",
                          ].map((h) => (
                            <th
                              key={h}
                              style={{ padding: "12px", textAlign: "left", fontWeight: "bold" }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {formData.preferences.map((pref, idx) => (
                          <tr key={idx} style={{ borderBottom: "1px solid #e0e0e0" }}>
                            <td style={{ padding: "12px" }}>{idx + 1}</td>
                            <td style={{ padding: "12px" }}>{pref.industry}</td>
                            <td style={{ padding: "12px" }}>{pref.category}</td>
                            <td style={{ padding: "12px" }}>{pref.investmentAmount}</td>
                           <td style={{ padding: "12px" }}>
  {pref.locationType === "domestic"
    ? getDisplayName(pref.preferredDistrict)  // ← show "Kanchipuram" not "Kanchipuram (Kancheepuram)"
    : pref.preferredState}
</td>
                            <td style={{ padding: "12px" }}>
                              {pref.locationType === "domestic"
                                ? pref.preferredState
                                : pref.preferredCountry}
                            </td>
                            <td style={{ padding: "12px" }}>
                              {pref.locationType === "domestic"
                                ? pref.preferredDistrict
                                : pref.preferredState}
                            </td>
                            <td style={{ padding: "12px" }}>{pref.preferredCity}</td>
                            <td style={{ padding: "12px" }}>{pref.propertyType}</td>
                            <td style={{ padding: "12px" }}>
                              <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                  size="small"
                                  color="primary"
                                  onClick={() => handleEditPreference(idx)}
                                  startIcon={<EditIcon />}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="small"
                                  color="error"
                                  onClick={() => handleRemovePreference(idx)}
                                  startIcon={<DeleteIcon />}
                                >
                                  Remove
                                </Button>
                              </Box>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                </Box>
              )}
            </Box>

            {/* ── Terms & Submit ─────────────────────────────────────────── */}
            <Box
              sx={{
                mt: 4,
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.terms}
                    onChange={(e) => handleInputChange("terms", e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{" "}
                    <Link
                      component={RouterLink}
                      to="/termsandconditions"
                      color="primary"
                      sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                    >
                      terms and conditions
                    </Link>
                  </Typography>
                }
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!formData.terms}
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  minWidth: "200px",
                  borderRadius: "8px",
                  py: 1.5,
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  backgroundColor: "#7ad03a",
                  "&:hover": { backgroundColor: "#5a9e2a" },
                  "&:disabled": { backgroundColor: "#cccccc", color: "#666666" },
                }}
              >
                REGISTER
              </Button>
              <Typography sx={{ mt: 2, textAlign: "center" }}>
                Already have an account?{" "}
                <Box
                  component="span"
                  onClick={openLoginPopup}
                  sx={{
                    cursor: "pointer",
                    color: "primary.main",
                    fontWeight: 500,
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Sign In
                </Box>
              </Typography>
            </Box>
          </form>

          {/* ── Email OTP Dialog ─────────────────────────────────────────── */}
          <Dialog
            open={verificationState.email.showDialog}
            onClose={() => handleVerificationDialog("email", false)}
            PaperProps={{ sx: { borderRadius: "16px", p: 3 } }}
          >
            <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
              Verify Email
            </DialogTitle>
            <DialogContent>
              <Box sx={{ minWidth: 300, pt: 1 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  We've sent a 6-digit OTP to {formData.email}
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
                  sx={{ borderRadius: "8px" }}
                />
                <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                  <Button
                    onClick={() => handleSendOtp("email")}
                    disabled={verificationState.email.loading}
                    sx={{ color: "primary.main" }}
                  >
                    {verificationState.email.loading ? "Sending…" : "Resend OTP"}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleVerifyOtp("email")}
                    disabled={otpInput.length !== 6 || verificationState.email.loading}
                    startIcon={
                      verificationState.email.loading ? <CircularProgress size={14} /> : null
                    }
                    sx={{
                      borderRadius: "8px",
                      backgroundColor: "#7ad03a",
                      "&:hover": { backgroundColor: "#5a9e2a" },
                    }}
                  >
                    {verificationState.email.loading ? "Verifying…" : "Verify"}
                  </Button>
                </Box>
              </Box>
            </DialogContent>
          </Dialog>

          {/* ── Registration Success Dialog ──────────────────────────────── */}
          <Dialog
            open={registrationSuccess}
            onClose={handleSuccessRedirect}
            PaperProps={{ sx: { borderRadius: "16px", p: 3 } }}
          >
            <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
              Registration Successful!
            </DialogTitle>
            <DialogContent>
              <Box sx={{ textAlign: "center", py: 2 }}>
                <CheckCircleOutline sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Welcome, {formData.firstName}!
                </Typography>
                <Typography variant="body1">
                  Your investor registration has been completed successfully.
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
                  You can now login to your account.
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
              <Button
                variant="contained"
                onClick={handleSuccessRedirect}
                sx={{
                  borderRadius: "8px",
                  backgroundColor: "#7ad03a",
                  "&:hover": { backgroundColor: "#5a9e2a" },
                  px: 4,
                }}
              >
                Continue to Home
              </Button>
            </DialogActions>
          </Dialog>

          {/* ── WhatsApp Snackbar ────────────────────────────────────────── */}
          <Snackbar
            open={showWhatsappSnackbar}
            autoHideDuration={6000}
            onClose={() => setShowWhatsappSnackbar(false)}
            anchorOrigin={{ vertical: "center", horizontal: "center" }}
            sx={{ width: "100%", maxWidth: "700px", mb: 12 }}
          >
            <Alert
              onClose={() => setShowWhatsappSnackbar(false)}
              severity="info"
              icon={<WhatsApp fontSize="inherit" />}
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
                      handleInputChange("whatsappNumber", formData.mobileNumber);
                      setShowWhatsappSnackbar(false);
                      showSnackbar("WhatsApp number auto-filled.", "success");
                    }}
                    sx={{ borderRadius: "8px" }}
                  >
                    Yes
                  </Button>
                  <Button
                    color="inherit"
                    variant="outlined"
                    size="small"
                    onClick={() => setShowWhatsappSnackbar(false)}
                    sx={{ borderRadius: "8px" }}
                  >
                    No
                  </Button>
                </Box>
              }
            >
              Is your WhatsApp number same as your phone number?
            </Alert>
          </Snackbar>

          {/* ── General Snackbar ─────────────────────────────────────────── */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              sx={{
                width: "100%",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>

        {!isMobile && <Box />}
      </Box>

      <Box>
        <Footer />
      </Box>
    </>
  );
};

export default InvestorRegister;
