"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
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
import { showLoading, hideLoading } from "../../Redux/Slices/loadingSlice";
import RegisterationMediaHandling from "../Registration/RegisterationMediaHandling";
import FlagIcon from "@mui/icons-material/Flag";
import Navbar from "../../Components/Navbar/NavBar";
import Footer from "../../Components/Footers/Footer";
import { API_BASE_URL } from "../../Api/api";

const initialFormState = {
  // Personal Details
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

  // Preferences (for current preference being added)
  currentPreference: {
    industry: "",
    category: "",
    investmentRange: "",
    investmentAmount: "",
    locationType: "domestic", // 'domestic' or 'international'
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

  // List of added preferences
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
    initialVerificationState,
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

  // Data states
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
  const [industryOptions, setIndustryOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loadingIndustries, setLoadingIndustries] = useState(true);
  const [loadingIndustryDetails, setLoadingIndustryDetails] = useState(false);

  const navigate = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dropdownRef = useRef(null);

  const FORM_DATA_KEY = "investor_form_data";

  // Fetch initial data
  useEffect(() => {
    // Fetch countries
    fetch("https://countriesnow.space/api/v0.1/countries")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setCountries(
            data.data.map((c) => ({ name: c.country, code: c.iso2 })),
          );
        }
      });

    // Fetch country codes for phone prefixes
    fetch("https://countriesnow.space/api/v0.1/countries/codes")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setCountryCodes(data.data);
      });

    // Fetch India state data
    const fetchIndiaData = async () => {
      try {
        const res = await axios.get(
          "https://raw.githubusercontent.com/prasad-gowda/india-state-district-cities/master/India-state-district-city.json",
        );
        setIndiaData(res.data);
      } catch (err) {
        console.error("Error fetching India data:", err);
      }
    };
    fetchIndiaData();

    // Fetch international countries
    fetch("https://countriesnow.space/api/v0.1/countries/positions")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          const countryNames = data.data.map((c) => c.name);
          setIntlCountries(countryNames);
          setPropertyCountries(countryNames);
        }
      });

    // Load saved form data
    const savedData = localStorage.getItem(FORM_DATA_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }

    // Fetch industries
    fetchIndustries();
  }, []);

  // Save form data to localStorage
  useEffect(() => {
    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(formData));
  }, [formData]);

  // Update phone prefix when country changes
  useEffect(() => {
    const country = formData.country;
    if (!country) {
      setPhonePrefix("+91");
      return;
    }
    const found = countryCodes.find(
      (c) => c.name === country || c.iso2 === country || c.iso3 === country,
    );
    setPhonePrefix(found ? found.dial_code : "+91");
  }, [formData.country, countryCodes]);

  // Handle pincode lookup
  useEffect(() => {
    const pincode = formData.pincode;
    const country = formData.country;

    if (!pincode || !country || pincode.length < 3) {
      setPincodeError("");
      return;
    }

    const selectedCountryObj = countries.find((c) => c.name === country);
    const countryCode = selectedCountryObj?.code || "IN";

    if (
      (countryCode === "IN" && pincode.length === 6) ||
      (countryCode !== "IN" && pincode.length >= 3)
    ) {
      setLoadingPincode(true);
      setPincodeError("");

      const fetchLocation = async () => {
        try {
          if (countryCode === "IN") {
            const res = await fetch(
              `https://api.postalpincode.in/pincode/${pincode}`,
            );
            const data = await res.json();
            if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length) {
              const po = data[0].PostOffice[0];
              setFormData((prev) => ({
                ...prev,
                state: po.State || "",
                city: po.District || po.Block || "",
              }));
            } else {
              setFormData((prev) => ({
                ...prev,
                state: "",
                city: "",
              }));
              setPincodeError("Invalid Indian pincode");
            }
          } else {
            const code = countryCode.toLowerCase();
            const res = await fetch(
              `https://api.zippopotam.us/${code}/${pincode}`,
            );
            if (!res.ok) throw new Error("Not found");
            const data = await res.json();
            setFormData((prev) => ({
              ...prev,
              state: data.places?.[0]?.state || "",
              city: data.places?.[0]?.["place name"] || "",
            }));
          }
        } catch (err) {
          setFormData((prev) => ({
            ...prev,
            state: "",
            city: "",
          }));
          setPincodeError("Postal code not found for selected country");
        } finally {
          setLoadingPincode(false);
        }
      };

      fetchLocation();
    } else {
      if (countryCode === "IN" && pincode.length > 0 && pincode.length < 6) {
        setPincodeError("Enter 6-digit pincode");
      }
    }
  }, [formData.pincode, formData.country, countries]);

  // Fetch property states when property country changes
  useEffect(() => {
    const country = formData.currentPreference.propertyCountry;
    if (!country) {
      setPropertyStates([]);
      setFormData((prev) => ({
        ...prev,
        currentPreference: {
          ...prev.currentPreference,
          propertyState: "",
          propertyCity: "",
        },
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
        if (data.data && data.data.states) {
          setPropertyStates(data.data.states.map((s) => s.name));
        } else {
          setPropertyStates([]);
        }
      })
      .catch(() => setPropertyStates([]));
  }, [formData.currentPreference.propertyCountry]);

  // Fetch property cities when property state changes
  useEffect(() => {
    const country = formData.currentPreference.propertyCountry;
    const state = formData.currentPreference.propertyState;

    if (!country || !state) {
      setPropertyCities([]);
      setFormData((prev) => ({
        ...prev,
        currentPreference: {
          ...prev.currentPreference,
          propertyCity: "",
        },
      }));
      return;
    }

    if (country === "India" && indiaData.length > 0) {
      const stateObj = indiaData.find((s) => s.name === state);
      if (stateObj) {
        const uniqueCities = Array.from(
          new Set((stateObj.cities || []).map((city) => city.name)),
        );
        setPropertyCities(uniqueCities);
      } else {
        setPropertyCities([]);
      }
    } else {
      fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: country.trim(),
          state: state.trim(),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.data && Array.isArray(data.data)) {
            setPropertyCities(data.data);
          } else {
            setPropertyCities([]);
          }
        })
        .catch(() => {
          setPropertyCities([]);
        });
    }
  }, [
    formData.currentPreference.propertyCountry,
    formData.currentPreference.propertyState,
    indiaData,
  ]);

  // Fetch international states when preferred country changes
  useEffect(() => {
    const country = formData.currentPreference.preferredCountry;
    if (
      formData.currentPreference.locationType === "international" &&
      country
    ) {
      fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.data && data.data.states) {
            setIntlStates(data.data.states.map((s) => s.name));
          } else {
            setIntlStates([]);
          }
        })
        .catch(() => setIntlStates([]));
    }
  }, [
    formData.currentPreference.preferredCountry,
    formData.currentPreference.locationType,
  ]);

  // Fetch international cities when preferred state changes
  useEffect(() => {
    const country = formData.currentPreference.preferredCountry;
    const state = formData.currentPreference.preferredState;

    if (
      formData.currentPreference.locationType === "international" &&
      country &&
      state
    ) {
      fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country,
          state,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.data) {
            setIntlCities(data.data);
          } else {
            setIntlCities([]);
          }
        })
        .catch(() => setIntlCities([]));
    }
  }, [
    formData.currentPreference.preferredCountry,
    formData.currentPreference.preferredState,
    formData.currentPreference.locationType,
  ]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      currentPreference: {
        ...prev.currentPreference,
        [field]: value,
      },
    }));
  };

  // Get Indian states and districts
  const getIndianStates = () => {
    return indiaData.map((state) => state.name) || [];
  };

  const getIndianDistricts = (stateName) => {
    if (!stateName) return [];
    const stateObj = indiaData.find((s) => s.name === stateName);
    return stateObj?.districts || [];
  };

  const getIndianCities = (stateName, districtName) => {
    if (!stateName || !districtName) return [];
    const stateObj = indiaData.find((s) => s.name === stateName);
    if (!stateObj?.cities) return [];

    return stateObj.cities
      .filter((city) => city.district === districtName)
      .map((city) => city.name);
  };

  // Fetch industries
  const fetchIndustries = async () => {
    try {
      setLoadingIndustries(true);
      const response = await fetch(
        `http://localhost:5000/api/v1/admin/getIndustryByIndustryName`,
      );
      const result = await response.json();

      if (result.success && result.data?.Industry) {
        setIndustryOptions(result.data.Industry);
        // Set default to Food & Beverages if exists
        const foodBeverage = result.data.Industry.find(
          (ind) =>
            ind.toLowerCase().includes("food") ||
            ind.toLowerCase().includes("beverage"),
        );
        if (foodBeverage) {
          handlePreferenceChange("industry", foodBeverage);
          fetchIndustryDetails(foodBeverage);
        }
      }
    } catch (error) {
      console.error("Error fetching industries:", error);
      showSnackbar("Failed to load industries", "error");
    } finally {
      setLoadingIndustries(false);
    }
  };

  // Fetch industry details
  const fetchIndustryDetails = async (industryName) => {
    if (!industryName) return;

    try {
      setLoadingIndustryDetails(true);
      const response = await fetch(
        `http://localhost:5000/api/v1/admin/getIndustryByIndustryName?industry=${encodeURIComponent(industryName)}`,
      );
      const result = await response.json();

      if (result.success && result.data) {
        setCategoryOptions(result.data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching industry details:", error);
      showSnackbar("Failed to load industry details", "error");
    } finally {
      setLoadingIndustryDetails(false);
    }
  };

  // Handle industry change
  const handleIndustryChange = (value) => {
    handlePreferenceChange("industry", value);
    handlePreferenceChange("category", "");
    if (value) {
      fetchIndustryDetails(value);
    }
  };

  // Add preference
  // Add preference with proper validation
  const handleAddPreference = () => {
    const pref = formData.currentPreference;
    const errors = [];

    // Basic required fields (always required)
    if (!pref.industry) errors.push("Industry");
    if (!pref.category) errors.push("Category");
    if (!pref.investmentRange) errors.push("Investment Range");
    if (!pref.investmentAmount) errors.push("Investment Amount");
    if (!pref.locationType) errors.push("Location Type");
    if (!pref.propertyType) errors.push("Property Type");

    // Location-specific validation
    if (pref.locationType === "domestic") {
      if (!pref.preferredState) errors.push("Preferred State");
      if (!pref.preferredDistrict) errors.push("Preferred District");
      if (!pref.preferredCity) errors.push("Preferred City");
    } else if (pref.locationType === "international") {
      if (!pref.preferredCountry) errors.push("Preferred Country");
      if (!pref.preferredState) errors.push("Preferred State");
      if (!pref.preferredCity) errors.push("Preferred City");
    }

    // Property-specific validation (only for Own Property)
    if (pref.propertyType === "Own Property") {
      if (!pref.propertySize) errors.push("Property Size");
      if (!pref.propertyCountry) errors.push("Property Country");
      if (!pref.propertyState) errors.push("Property State");
      if (!pref.propertyCity) errors.push("Property City");
    }

    // Note: For "Rental Property", no property fields are required

    if (errors.length > 0) {
      showSnackbar(
        `Please fill required fields: ${errors.join(", ")}`,
        "error",
      );
      return;
    }

    // Check if this preference already exists (optional but recommended)
    const isDuplicate = formData.preferences.some(
      (existingPref) =>
        existingPref.industry === pref.industry &&
        existingPref.category === pref.category &&
        existingPref.investmentAmount === pref.investmentAmount &&
        existingPref.locationType === pref.locationType &&
        existingPref.preferredState === pref.preferredState &&
        existingPref.propertyType === pref.propertyType,
    );

    if (isDuplicate) {
      showSnackbar("This preference already exists!", "warning");
      return;
    }

    // Add to preferences list
    setFormData((prev) => ({
      ...prev,
      preferences: [...prev.preferences, { ...pref }],
      currentPreference: {
        ...initialFormState.currentPreference,
        locationType: pref.locationType, // Keep same location type for convenience
      },
    }));

    showSnackbar("Preference added successfully!", "success");
  };

  // Remove preference
  const handleRemovePreference = (index) => {
    if (window.confirm("Are you sure you want to remove this preference?")) {
      setFormData((prev) => ({
        ...prev,
        preferences: prev.preferences.filter((_, i) => i !== index),
      }));
      showSnackbar("Preference removed", "info");
    }
  };

  // Edit preference
  const handleEditPreference = (index) => {
    const prefToEdit = formData.preferences[index];
    setFormData((prev) => ({
      ...prev,
      currentPreference: { ...prefToEdit },
      preferences: prev.preferences.filter((_, i) => i !== index),
    }));
    showSnackbar("Preference loaded for editing", "info");
  };

  // Handle OTP verification
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

  const handleSendOtp = async (field) => {
    const identifier =
      field === "email" ? formData.email : formData.mobileNumber;

    if (!identifier) {
      showSnackbar(`Please enter ${field} first`, "error");
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
        `${API_BASE_URL}/otpverify/send-otp-email`,
        {
          [field === "email" ? "email" : "phone"]: identifier,
          type: field,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

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
        showSnackbar(`OTP sent successfully to your ${field}`, "success");
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
      showSnackbar(errorMessage, "error");
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
        `${API_BASE_URL}/otpverify/verify-otp`,
        {
          identifier:
            field === "email" ? formData.email : formData.mobileNumber,
          otp: otpInput,
          type: field,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${otpToken}`,
          },
        },
      );

      if (response.data.message?.includes("verified successfully")) {
        setVerificationState((prev) => ({
          ...prev,
          [field]: {
            ...prev[field],
            verified: true,
            showDialog: false,
            loading: false,
          },
        }));
        showSnackbar(
          response.data.message ||
            `${field === "email" ? "Email" : "Mobile number"} verified successfully!`,
          "success",
        );
        setOtpInput("");
      } else {
        throw new Error(response.data.error || "OTP verification failed");
      }
    } catch (error) {
      console.error(`Error verifying OTP for ${field}:`, error);
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
      showSnackbar(errorMessage, "error");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Personal fields validation with specific error messages
    const validationErrors = [];

    if (!formData.firstName.trim()) {
      validationErrors.push("First Name");
    }

    if (!formData.email.trim()) {
      validationErrors.push("Email");
    }

    if (!verificationState.email.verified) {
      validationErrors.push("Email verification");
    }

    if (!formData.mobileNumber.trim() || formData.mobileNumber.length !== 10) {
      validationErrors.push("Mobile Number (10 digits)");
    }

    if (!formData.address.trim()) {
      validationErrors.push("Address");
    }

    if (!formData.pincode.trim()) {
      validationErrors.push("Pincode/Postal Code");
    }

    if (!formData.country.trim()) {
      validationErrors.push("Country");
    }

    if (
      formData.occupation === "" ||
      formData.occupation === "Select Occupation"
    ) {
      validationErrors.push("Occupation");
    }

    if (formData.occupation === "Other" && !formData.otherOccupation.trim()) {
      validationErrors.push("Specify Occupation");
    }

    if (!formData.terms) {
      validationErrors.push("Terms and Conditions");
    }

    // Check if at least one preference is added
    if (formData.preferences.length === 0) {
      validationErrors.push("At least one investment preference");
    }

    // Show all errors at once
    if (validationErrors.length > 0) {
      showSnackbar(`Please complete: ${validationErrors.join(", ")}`, "error");
      return;
    }

    // Format the data for backend - ONLY use preferences from the list
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

        // Format location data based on type
        let locationData = {};

        if (isInternational) {
          // For international: country, state, city
          locationData = {
            preferredCountry: pref.preferredCountry || "",
            preferredState: pref.preferredState || "",
            preferredCity: pref.preferredCity || "",
            locationType: "international",
          };
        } else {
          // For domestic: India, state, district, city
          locationData = {
            preferredCountry: "India",
            preferredState: pref.preferredState || "",
            preferredDistrict: pref.preferredDistrict || "",
            preferredCity: pref.preferredCity || "",
            locationType: "domestic",
          };
        }

        return {
          category: [
            {
              main: pref.industry || "",
              sub: pref.category || "",
            },
          ],
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

    console.log("Submitting data:", formattedData);

    try {
      dispatch(showLoading());
      const response = await axios.post(
        `http://localhost:5000/api/v1/investor/createInvestor`,
        formattedData,
        { headers: { "Content-Type": "application/json" } },
      );

      if (response.status === 201) {
        // Clear form and localStorage
        localStorage.removeItem(FORM_DATA_KEY);
        setFormData(initialFormState);
        setRegistrationSuccess(true);
        showSnackbar("Registration successful! You can now login.", "success");

        // Store user info if needed
        if (formattedData.firstName) {
          localStorage.setItem("investorName", formattedData.firstName);
        }
        if (formattedData.email) {
          localStorage.setItem("investorEmail", formattedData.email);
        }

        setTimeout(() => {
          dispatch(hideLoading());
        }, 2000);
      } else {
        dispatch(hideLoading());
        showSnackbar(
          "An unexpected error occurred. Please try again.",
          "error",
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      dispatch(hideLoading());

      if (error.response?.status === 409) {
        showSnackbar(
          "This user is already registered. Please log in.",
          "error",
        );
      } else if (error.response?.data?.errors) {
        showSnackbar(error.response.data.errors.join(", "), "error");
      } else {
        showSnackbar(
          error.response?.data?.message ||
            "An unexpected error occurred. Please try again.",
          "error",
        );
      }
    }
  };
  // Snackbar helpers
  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Dialog helpers
  const openLoginPopup = () => {
    setLoginOpen(true);
  };

  const closeLoginPopup = () => {
    setLoginOpen(false);
    setRegistrationSuccess(false);
  };

  return (
    <>
      <Box
        sx={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1000 }}
      >
        <Navbar />
      </Box>

      <Typography
        variant="h3"
        gutterBottom
        fontWeight="bold"
        sx={{
          color: "#7ad03a",
          mb: -3,
          mt: { xs: 12, md: 15, lg: 15, sm: 20 },
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
          justifyContent: "center",
          alignItems: "flex-start",
          marginLeft: { xs: "0" },
          width: { xs: "70%", lg: "100%", md: "100%", sm: "100%" },
        }}
      >
        <Box
          ref={dropdownRef}
          sx={{
            p: 4,
            ml: "30px",
            width: "100%",
            maxWidth: "1030px",
            position: "relative",
            borderColor: "divider",
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Personal Details Section */}
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

            <Grid container spacing={3}>
              {/* First Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="First Name"
                  fullWidth
                  variant="outlined"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>

              {/* Email with verification */}
              <Grid
                container
                spacing={2}
                sx={{
                  display: "grid",
                  gridTemplateColumns: { md: "repeat(3, 1fr)", xs: "1fr" },
                  gap: 2,
                }}
              >
                <Grid item xs={12} md={6}>
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
                            <Box
                              display="flex"
                              alignItems="center"
                              color="success.main"
                            >
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
                              disabled={
                                !formData.email ||
                                verificationState.email.loading
                              }
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  />
                </Grid>

                {/* Mobile Number */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Mobile Number"
                    fullWidth
                    variant="outlined"
                    value={formData.mobileNumber}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      handleInputChange("mobileNumber", value);
                    }}
                    inputProps={{
                      maxLength: 10,
                      inputMode: "numeric",
                    }}
                    onBlur={() => {
                      if (formData.mobileNumber.length === 10) {
                        setShowWhatsappSnackbar(true);
                      }
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  />
                </Grid>

                {/* WhatsApp Number */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="WhatsApp Number"
                    fullWidth
                    variant="outlined"
                    value={formData.whatsappNumber}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      handleInputChange("whatsappNumber", value);
                    }}
                    inputProps={{
                      maxLength: 10,
                      inputMode: "numeric",
                    }}
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  />
                </Grid>
              </Grid>

              {/* Country */}

              <Grid
                container
                spacing={2}
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "flex-start",
                }}
              >
                <Grid item xs={12} md={4}>
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
                    sx={{
                      borderRadius: "8px",
                      backgroundColor: "background.paper",
                    }}
                  />
                </Grid>

                {/* Address */}
                <Grid item xs={12} md={8}>
                  <TextField
                    label="Address"
                    fullWidth
                    variant="outlined"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Home color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  />
                </Grid>
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
                {/* Pincode */}
                <Grid item xs={12} md={4}>
                  <TextField
                    label={
                      formData.country === "India" ? "Pincode" : "Postal Code"
                    }
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  />
                </Grid>
              </Grid>

              {/* State */}
              <Grid item xs={12} md={4}>
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
              </Grid>

              {/* City */}
              <Grid item xs={12} md={4}>
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
              </Grid>

              {/* Occupation */}
              <Grid item xs={12}>
                <TextField
                  select
                  label="Occupation"
                  fullWidth
                  variant="outlined"
                  value={formData.occupation}
                  onChange={(e) =>
                    handleInputChange("occupation", e.target.value)
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Work color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                >
                  {occupationOptions.map((option) => (
                    <MenuItem
                      key={option}
                      value={option === "Select Occupation" ? "" : option}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Other Occupation */}
              {formData.occupation === "Other" && (
                <Grid item xs={12}>
                  <TextField
                    label="Specify Occupation"
                    fullWidth
                    variant="outlined"
                    value={formData.otherOccupation}
                    onChange={(e) =>
                      handleInputChange("otherOccupation", e.target.value)
                    }
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  />
                </Grid>
              )}
            </Grid>

            {/* Preferences Section */}
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

              <Grid container spacing={3}>
                {/* Industry and Category */}
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Industry"
                    fullWidth
                    variant="outlined"
                    value={formData.currentPreference.industry}
                    onChange={(e) => handleIndustryChange("Food & Beverages")}
                    disabled={loadingIndustries}
                    sx={{ borderRadius: "8px" }}
                  >
                    <MenuItem value="Food & Beverages">
                      Food & Beverages
                    </MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Category"
                    fullWidth
                    variant="outlined"
                    value={formData.currentPreference.category}
                    onChange={(e) =>
                      handlePreferenceChange("category", e.target.value)
                    }
                    disabled={
                      !formData.currentPreference.industry ||
                      loadingIndustryDetails
                    }
                    sx={{ borderRadius: "8px" }}
                  >
                    <MenuItem value="">Select Category</MenuItem>
                    {categoryOptions.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </TextField>
                  {loadingIndustryDetails && (
                    <FormHelperText>Loading categories...</FormHelperText>
                  )}
                </Grid>

                {/* Investment Amount */}
                <Grid item xs={12} md={6}>
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
                        value={
                          option === "Select preferred Investment Amount"
                            ? ""
                            : option
                        }
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Investment Range */}
                <Grid item xs={12} md={6}>
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
                        value={
                          option === "Select Preferred Readiness" ? "" : option
                        }
                      >
                        {option
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Location Type */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 1, fontWeight: 500 }}
                  >
                    Preferred Location Type
                  </Typography>
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      value={formData.currentPreference.locationType}
                      onChange={(e) => {
                        const value = e.target.value;
                        handlePreferenceChange("locationType", value);
                        // Reset location fields
                        handlePreferenceChange(
                          "preferredCountry",
                          value === "international" ? "" : "India",
                        );
                        handlePreferenceChange("preferredState", "");
                        handlePreferenceChange("preferredDistrict", "");
                        handlePreferenceChange("preferredCity", "");
                      }}
                    >
                      <MuiFormControlLabel
                        value="domestic"
                        control={<Radio />}
                        label="India"
                      />
                      <MuiFormControlLabel
                        value="international"
                        control={<Radio />}
                        label="International"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {/* Location Fields */}
                {formData.currentPreference.locationType && (
                  <>
                    {/* For International: Country, State, City */}
                    {formData.currentPreference.locationType ===
                    "international" ? (
                      <>
                        <Grid item xs={12} md={4}>
                          <TextField
                            select
                            label="Country"
                            fullWidth
                            variant="outlined"
                            value={formData.currentPreference.preferredCountry}
                            onChange={(e) => {
                              handlePreferenceChange(
                                "preferredCountry",
                                e.target.value,
                              );
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
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <TextField
                            select
                            label="State"
                            fullWidth
                            variant="outlined"
                            value={formData.currentPreference.preferredState}
                            onChange={(e) => {
                              handlePreferenceChange(
                                "preferredState",
                                e.target.value,
                              );
                              handlePreferenceChange("preferredCity", "");
                            }}
                            disabled={
                              !formData.currentPreference.preferredCountry
                            }
                            sx={{ borderRadius: "8px" }}
                          >
                            <MenuItem value="">Select State</MenuItem>
                            {intlStates.map((state) => (
                              <MenuItem key={state} value={state}>
                                {state}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <TextField
                            select
                            label="City"
                            fullWidth
                            variant="outlined"
                            value={formData.currentPreference.preferredCity}
                            onChange={(e) =>
                              handlePreferenceChange(
                                "preferredCity",
                                e.target.value,
                              )
                            }
                            disabled={
                              !formData.currentPreference.preferredState
                            }
                            sx={{ borderRadius: "8px" }}
                          >
                            <MenuItem value="">Select City</MenuItem>
                            {intlCities.map((city) => (
                              <MenuItem key={city} value={city}>
                                {city}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                      </>
                    ) : (
                      /* For Domestic: State, District, City */
                      <>
                        <Grid item xs={12} md={4}>
                          <TextField
                            select
                            label="State"
                            fullWidth
                            variant="outlined"
                            value={formData.currentPreference.preferredState}
                            onChange={(e) => {
                              handlePreferenceChange(
                                "preferredState",
                                e.target.value,
                              );
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
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <TextField
                            select
                            label="District"
                            fullWidth
                            variant="outlined"
                            value={formData.currentPreference.preferredDistrict}
                            onChange={(e) => {
                              handlePreferenceChange(
                                "preferredDistrict",
                                e.target.value,
                              );
                              handlePreferenceChange("preferredCity", "");
                            }}
                            disabled={
                              !formData.currentPreference.preferredState
                            }
                            sx={{ borderRadius: "8px" }}
                          >
                            <MenuItem value="">Select District</MenuItem>
                            {getIndianDistricts(
                              formData.currentPreference.preferredState,
                            ).map((district) => (
                              <MenuItem key={district} value={district}>
                                {district}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <TextField
                            select
                            label="City"
                            fullWidth
                            variant="outlined"
                            value={formData.currentPreference.preferredCity}
                            onChange={(e) =>
                              handlePreferenceChange(
                                "preferredCity",
                                e.target.value,
                              )
                            }
                            disabled={
                              !formData.currentPreference.preferredDistrict
                            }
                            sx={{ borderRadius: "8px" }}
                          >
                            <MenuItem value="">Select City</MenuItem>
                            {getIndianCities(
                              formData.currentPreference.preferredState,
                              formData.currentPreference.preferredDistrict,
                            ).map((city) => (
                              <MenuItem key={city} value={city}>
                                {city}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                      </>
                    )}
                  </>
                )}

                {/* Property Type */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 1, fontWeight: 500 }}
                  >
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
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <HomeWork color="primary" />
                          <Typography>Own Property</Typography>
                        </Box>
                      }
                    />
                    <MuiFormControlLabel
                      value="Rental Property"
                      control={<Radio color="primary" />}
                      label={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <MeetingRoom color="primary" />
                          <Typography>Rental Property</Typography>
                        </Box>
                      }
                    />
                  </RadioGroup>
                </Grid>

                {/* Property Size (for Own Property) */}
                {formData.currentPreference.propertyType === "Own Property" && (
                  <Grid item xs={12} md={6}>
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
                  </Grid>
                )}

                {/* Property Location (for Own Property) */}
                {formData.currentPreference.propertyType === "Own Property" && (
                  <>
                    <Grid item xs={12} md={4}>
                      <Autocomplete
                        freeSolo
                        options={propertyCountries}
                        value={formData.currentPreference.propertyCountry}
                        onChange={(_, newValue) => {
                          handlePreferenceChange(
                            "propertyCountry",
                            newValue || "",
                          );
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
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Autocomplete
                        freeSolo
                        options={propertyStates}
                        value={formData.currentPreference.propertyState}
                        onChange={(_, newValue) => {
                          handlePreferenceChange(
                            "propertyState",
                            newValue || "",
                          );
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
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Autocomplete
                        freeSolo
                        options={propertyCities}
                        value={formData.currentPreference.propertyCity}
                        onChange={(_, newValue) => {
                          handlePreferenceChange(
                            "propertyCity",
                            newValue || "",
                          );
                        }}
                        disabled={!formData.currentPreference.propertyState}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            variant="outlined"
                            sx={{ borderRadius: "8px" }}
                          />
                        )}
                      />
                    </Grid>
                  </>
                )}
              </Grid>

              {/* Add Preference Button */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                <Button
                  onClick={handleAddPreference}
                  sx={{
                    borderRadius: "8px",
                    backgroundColor: "#7ad03a",
                    color: "#fff",
                    px: 4,
                    py: 1.5,
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#5a9e2a",
                    },
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
                        <tr
                          style={{ backgroundColor: "#7ad03a", color: "white" }}
                        >
                          <th
                            style={{
                              padding: "12px",
                              textAlign: "left",
                              fontWeight: "bold",
                            }}
                          >
                            #
                          </th>
                          <th style={{ padding: "12px", textAlign: "left" }}>
                            Industry
                          </th>
                          <th style={{ padding: "12px", textAlign: "left" }}>
                            Category
                          </th>
                          <th style={{ padding: "12px", textAlign: "left" }}>
                            Investment Amount
                          </th>
                          <th style={{ padding: "12px", textAlign: "left" }}>
                            Location Type
                          </th>
                          <th style={{ padding: "12px", textAlign: "left" }}>
                            State/Country
                          </th>
                          <th style={{ padding: "12px", textAlign: "left" }}>
                            District/State
                          </th>
                          <th style={{ padding: "12px", textAlign: "left" }}>
                            City
                          </th>
                          <th style={{ padding: "12px", textAlign: "left" }}>
                            Property Type
                          </th>
                          <th style={{ padding: "12px", textAlign: "left" }}>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.preferences.map((pref, idx) => (
                          <tr
                            key={idx}
                            style={{ borderBottom: "1px solid #e0e0e0" }}
                          >
                            <td style={{ padding: "12px" }}>{idx + 1}</td>
                            <td style={{ padding: "12px" }}>{pref.industry}</td>
                            <td style={{ padding: "12px" }}>{pref.category}</td>
                            <td style={{ padding: "12px" }}>
                              {pref.investmentAmount}
                            </td>
                            <td style={{ padding: "12px" }}>
                              {pref.locationType === "domestic"
                                ? "India"
                                : "International"}
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
                            <td style={{ padding: "12px" }}>
                              {pref.preferredCity}
                            </td>
                            <td style={{ padding: "12px" }}>
                              {pref.propertyType}
                            </td>
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

            {/* Terms and Submit */}
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
                    onChange={(e) =>
                      handleInputChange("terms", e.target.checked)
                    }
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
                      sx={{
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      terms and conditions
                    </Link>
                  </Typography>
                }
                sx={{ mb: 3 }}
              />
              // Update the submit button - remove the preference check from
              disabled condition
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!formData.terms} // ONLY check terms, NOT preferences
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  minWidth: "200px",
                  borderRadius: "8px",
                  py: 1.5,
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  backgroundColor: "#7ad03a",
                  "&:hover": {
                    backgroundColor: "#5a9e2a",
                  },
                  "&:disabled": {
                    backgroundColor: "#cccccc",
                    color: "#666666",
                  },
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

          {/* Email Verification Dialog */}
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
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    onClick={() => handleSendOtp("email")}
                    disabled={verificationState.email.loading}
                    sx={{ color: "primary.main" }}
                  >
                    {verificationState.email.loading
                      ? "Sending..."
                      : "Resend OTP"}
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
                    sx={{
                      borderRadius: "8px",
                      backgroundColor: "#7ad03a",
                      "&:hover": { backgroundColor: "#5a9e2a" },
                    }}
                  >
                    {verificationState.email.loading
                      ? "Verifying..."
                      : "Verify"}
                  </Button>
                </Box>
              </Box>
            </DialogContent>
          </Dialog>

          {/* WhatsApp Snackbar */}
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
                      handleInputChange(
                        "whatsappNumber",
                        formData.mobileNumber,
                      );
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

          {/* General Snackbar */}
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

        {!isMobile && (
          <Box sx={{ marginTop: { sm: "35px" } }}>
            <RegisterationMediaHandling />
          </Box>
        )}
      </Box>

      <Box>
        <Footer />
      </Box>
    </>
  );
};

export default InvestorRegister;
