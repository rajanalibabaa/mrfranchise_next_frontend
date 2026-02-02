"use client";
import React, { useState, useEffect, useRef } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { useRouter, Link as RouterLink } from "next/navigation";
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
} from "@mui/icons-material";
import { categories } from "./BrandCategories";
import LoginPage from "@/Components/LoginPage/LoginPage";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../Redux/Slices/LoadingSlice";
import RegisterationMediaHandling from "../Registration/RegisterationMediaHandling";
import FlagIcon from "@mui/icons-material/Flag";
import Navbar from "../../Components/Navbar/NavBar";
import Footer from "../../Components/Footers/Footer";
import { API_BASE_URL } from "../../Api/api";
import InvestorRegisterPreferences from "./InvestorRegisterPreferences";

const InvestorRegister = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm({
    defaultValues: {
      category: [],
      country: "",
      preferredState: "",
      preferredCity: "",
      preferredDistrict: "",
    },
  });

  const navigate = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [phonePrefix, setPhonePrefix] = useState("");
  const [countryCodes, setCountryCodes] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const dropdownRef = useRef(null);
  const [countries, setCountries] = useState([]);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [showWhatsappSnackbar, setShowWhatsappSnackbar] = useState(false);
  const [isCategoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [propertyCountries, setPropertyCountries] = useState(["India"]);
  const [propertyStates, setPropertyStates] = useState([]);
  const [propertyCities, setPropertyCities] = useState([]);
  const propertyCountry = watch("propertyCountry");
  const propertyState = watch("propertyState");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Domestic country
  const [indiaData, setIndiaData] = useState([]);

  const [preferredStates, setPreferredStates] = useState([]);
  const [preferredCities, setPreferredCities] = useState([]);
  const [preferredDistricts, setPreferredDistricts] = useState([]);

  // International country
  const [intlCountries, setIntlCountries] = useState([]);
  const [intlStates, setIntlStates] = useState([]);
  const [intlCities, setIntlCities] = useState([]);
  const [loadingPincode, setLoadingPincode] = useState(false);
  const [pincodeError, setPincodeError] = useState("");
  const preferredStateValue = watch("preferredState");
  const preferredDistrictValue = watch("preferredDistrict");
  const preferredLocationType = watch("preferredLocationType");
  const [loginOpen, setLoginOpen] = useState(false);
  const [preferences, setPreferences] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState("Food & Beverages");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedChild, setSelectedChild] = useState("");
  const propertyTypeValue = useWatch({ control, name: "propertyType" });

  // console.log("Selected Main Category:", selectedMainCategory);
  // console.log("Selected Sub Category:", selectedSubCategory);

  // OTP verification state
  const [otpModal, setOtpModal] = useState({
    open: false,
    type: null,
    otp: "",
    loading: false,
    verified: false,
  });

  // Email verification state
  const [verificationState, setVerificationState] = useState({
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
  });

  const [otpInput, setOtpInput] = useState("");
  const [otpToken, setOtpToken] = useState(null);
  const [formData, setFormData] = useState(null);


  // const [snackbar, setSnackbar] = useState({
  //   open: false,
  //   message: "",
  //   severity: "info",
  // });

  const FORM_DATA_KEY = "investor_form_data";

  const initialFormData = {
    firstName: "",
    email: "",
    mobileNumber: "",
    whatsappNumber: "",
    address: "",
    pincode: "",
    country: "",
    state: "",
    city: "",
    categories: [],
    investmentRange: "",
    investmentAmount: "",
    occupation: "",
    otherOccupation: "",
    propertyType: "",
    propertySize: "",
    propertyCountry: "",
    propertyState: "",
    propertyCity: "",
    preferredState: "",
    preferredDistrict: "",
    preferredCity: "",
    terms: false,
  };
  // console.log(propertyCountry)

  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/positions")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setPropertyCountries(data.data.map((c) => c.name));
      });
    setValue("propertyCountry", "");
    setValue("propertyState", "");
    setValue("propertyCity", "");
    setPropertyStates([]);
    setPropertyCities([]);
  }, [setValue]);

  useEffect(() => {
    if (!propertyCountry) {
      setPropertyStates([]);
      setValue("propertyState", "");
      setValue("propertyCity", "");
      setPropertyCities([]);
      return;
    }
    fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: propertyCountry.trim() }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data && data.data.states)
          setPropertyStates(data.data.states.map((s) => s.name));
        else setPropertyStates([]);
      });
    setValue("propertyState", "");
    setValue("propertyCity", "");
    setPropertyCities([]);
  }, [propertyCountry, setValue]);

  useEffect(() => {
    if (!propertyCountry || !propertyState) {
      setValue("propertyCity", "");
      setPropertyCities([]);
      return;
    }

    if (propertyCountry === "India" && indiaData.length > 0) {
      const stateObj = indiaData.find((s) => s.name === propertyState);
      if (stateObj) {
        const uniqueCities = Array.from(
          new Set((stateObj.cities || []).map((city) => city.name))
        );
        setPropertyCities(uniqueCities);
      } else {
        setPropertyCities([]);
      }
      setValue("propertyCity", "");
    } else {
      fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: propertyCountry.trim(),
          state: propertyState.trim(),
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
      setValue("propertyCity", "");
    }
  }, [propertyCountry, propertyState, setValue, indiaData]);

  useEffect(() => {
    const savedData = localStorage.getItem(FORM_DATA_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.preferences) setPreferences(parsed.preferences);
      reset({ ...initialFormData, ...parsed });
    }
  }, [reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem(
        FORM_DATA_KEY,
        JSON.stringify({ ...value, preferences })
      );
    });
    return () => subscription.unsubscribe();
  }, [watch, preferences]);

  useEffect(() => {
    const currentData = JSON.parse(localStorage.getItem(FORM_DATA_KEY) || "{}");
    localStorage.setItem(
      FORM_DATA_KEY,
      JSON.stringify({ ...currentData, preferences })
    );
  }, [preferences]);

  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/codes")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setCountryCodes(data.data);
      });
  }, []);

  useEffect(() => {
    const country = watch("country");
    if (!country) {
      setPhonePrefix("");
      return;
    }
    const found = countryCodes.find(
      (c) => c.name === country || c.iso2 === country || c.iso3 === country
    );
    setPhonePrefix(found ? found.dial_code : "");
  }, [watch("country"), countryCodes]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get(
          "https://raw.githubusercontent.com/prasad-gowda/india-state-district-cities/master/India-state-district-city.json"
        );
        setIndiaData(res.data);
        setPreferredStates(res.data.map((state) => state.name));
      } catch (err) {
        setIndiaData([]);
        setPreferredStates([]);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    if (
      preferredLocationType === "domestic" &&
      preferredStateValue &&
      indiaData.length > 0
    ) {
      const stateObj = indiaData.find((s) => s.name === preferredStateValue);
      if (stateObj) {
        setPreferredDistricts(stateObj.districts || []);
        setPreferredCities([]);
      } else {
        setPreferredDistricts([]);
        setPreferredCities([]);
      }
      setValue("preferredDistrict", "");
      setValue("preferredCity", "");
    } else if (preferredLocationType === "domestic") {
      setPreferredDistricts([]);
      setPreferredCities([]);
    }
  }, [preferredStateValue, indiaData, setValue, preferredLocationType]);

  useEffect(() => {
    if (
      preferredLocationType === "domestic" &&
      preferredStateValue &&
      preferredDistrictValue &&
      indiaData.length > 0
    ) {
      const stateObj = indiaData.find((s) => s.name === preferredStateValue);
      if (stateObj) {
        const filteredCities = (stateObj.cities || [])
          .filter((city) => city.district === preferredDistrictValue)
          .map((city) => city.name);
        setPreferredCities(filteredCities);
      } else {
        setPreferredCities([]);
      }
    } else if (preferredLocationType === "domestic") {
      setPreferredCities([]);
    }
  }, [
    preferredStateValue,
    preferredDistrictValue,
    indiaData,
    preferredLocationType,
  ]);

  useEffect(() => {
    if (preferredLocationType === "international") {
      fetch("https://countriesnow.space/api/v0.1/countries/positions")
        .then((res) => res.json())
        .then((data) => {
          if (data.data) setIntlCountries(data.data.map((c) => c.name));
        });
      setValue("preferredState", "");
      setValue("preferredDistrict", "");
      setValue("preferredCity", "");
      setIntlStates([]);
      setIntlCities([]);
    }
  }, [preferredLocationType, setValue]);

  useEffect(() => {
    if (preferredLocationType === "international" && preferredStateValue) {
      fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: preferredStateValue }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.data && data.data.states)
            setIntlStates(data.data.states.map((s) => s.name));
        });
      setValue("preferredDistrict", "");
      setValue("preferredCity", "");
      setIntlCities([]);
    }
  }, [preferredStateValue, preferredLocationType, setValue]);

  useEffect(() => {
    if (
      preferredLocationType === "international" &&
      preferredStateValue &&
      preferredDistrictValue
    ) {
      fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: preferredStateValue,
          state: preferredDistrictValue,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.data) setIntlCities(data.data);
        });
      setValue("preferredCity", "");
    }
  }, [
    preferredDistrictValue,
    preferredStateValue,
    preferredLocationType,
    setValue,
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isCategoryDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setCategoryDropdownOpen(false);
      }
    };

    if (isCategoryDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCategoryDropdownOpen]);

  const occupationValue = useWatch({
    control,
    name: "occupation",
    defaultValue: "",
  });

  const [otpStates, setOtpStates] = useState({
    email: {
      sent: false,
      verified: false,
      loading: false,
      token: "",
    },
    mobile: {
      sent: false,
      verified: false,
      loading: false,
      token: "",
    },
    whatsapp: {
      sent: false,
      verified: false,
      loading: false,
      token: "",
    },
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const openLoginPopup = () => {
    document.activeElement.blur();
    setLoginOpen(true);
  };

  const closeLoginPopup = () => {
    setRegistrationSuccess(false); // NEW: close login dialog
    setLoginOpen(false);
  };

  const closeOtpModal = () => {
    setOtpModal({
      open: false,
      type: null,
      otp: "",
      loading: false,
      verified: false,
    });
  };


 // Handle verification dialog open/close
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
          [field === "email" ? "email" : "phone"]: watch(field),
          type: field,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
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
          identifier: watch(field),
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
          "success"
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

  const handleResendOtp = (field) => {
    handleSendOtp(field);
  };

  // Verify OTP (for modal)
  const verifyOtp = async () => {
    setOtpModal((prev) => ({ ...prev, loading: true }));
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOtpModal((prev) => ({ ...prev, verified: true, loading: false }));
      showSnackbar("OTP verified successfully!", "success");
    } catch (error) {
      setOtpModal((prev) => ({ ...prev, loading: false }));
      showSnackbar("OTP verification failed", "error");
    }
  };

  const onSubmit = async (data) => {
  if (!preferences.length) {
    showSnackbar(
      "Please add at least one preference before submitting.",
      "error"
    );
    return;
  }

  if (!verificationState.email.verified) {
    showSnackbar("Please verify your email before submitting.", "error");
    return;
  }
  
  const formatNumber = (num) => {
    if (!num) return "";
    const trimmed = num.trim();
    return trimmed.startsWith(phonePrefix)
      ? trimmed
      : `${phonePrefix}${trimmed}`;
  };

  const formattedData = {
    firstName: data.firstName || "",
    email: data.email || "",
    mobileNumber: formatNumber(data.mobileNumber),
    whatsappNumber: formatNumber(data.whatsappNumber),
    address: data.address || "",
    pincode: data.pincode || "",
    country: data.country || "India",
    state: data.state || "",
    city: data.city || "",
    occupation: data.occupation || "",
    ...(data.occupation === "Other" && {
      specifyOccupation: data.otherOccupation || "",
    }),
    preferences: preferences.map((pref) => {
      const isInternational = pref.locationType === "international";
      
      // Determine what to use based on location type
      let preferredCountry = "";
      let preferredState = "";
      let preferredDistrict = "";
      let preferredCity = "";
      
      if (isInternational) {
        // For international locations
        preferredCountry = pref.preferredCountry || ""; // This contains country name for international
        preferredState =pref.preferredState || ""; // This contains state name for international
        preferredCity = pref.preferredCity || "";
      } else {
        // For domestic (India) locations
        preferredCountry = "India"; // Always India for domestic
        preferredState = pref.preferredState || "";
        preferredDistrict = pref.preferredDistrict || "";
        preferredCity = pref.preferredCity || "";
      }
      
      return {
        category: Array.isArray(pref.category)
          ? pref.category.map((c) => ({
              main: c.main || "",
              sub: c.sub || "",
            }))
          : typeof pref.category === "string"
          ? [
              (() => {
                const [main, sub] = pref.category
                  .split(">")
                  .map((s) => s.trim());
                return { main, sub };
              })(),
            ]
          : [],
        investmentRange: pref.investmentRange,
        investmentAmount: pref.investmentAmount,
        propertyPreferred: [
          {
            propertyType: pref.propertyType,
            ...(pref.propertyType === "Own Property" && {
              propertySize: pref.propertySize,
              propertyCountry: pref.propertyCountry || "",
              propertyState: pref.propertyState || "",
              propertyCity: pref.propertyCity || "",
            }),
          },
        ],
        // Send proper location data based on type
        ...(isInternational
          ? {
              preferredCountry: preferredCountry,
              preferredState: preferredState,
              preferredCity: preferredCity,
              locationType: "international",
            }
          : {
              preferredCountry: preferredCountry, // Will be "India"
              preferredState: preferredState,
              preferredDistrict: preferredDistrict,
              preferredCity: preferredCity,
              locationType: "domestic",
            }),
      };
    }),
  };


    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/investor/createInvestor`,
        formattedData,
        { headers: { "Content-Type": "application/json" } }
      );
      
      if (response.status === 201) {
        localStorage.removeItem(FORM_DATA_KEY);
        setFormData(initialFormData);
        // console.log("Submitting formattedData:", formattedData);
        if (formattedData.firstName) {
          localStorage.setItem("investorName", formattedData.firstName);
        }
        if (formattedData.email) {
          localStorage.setItem("investorEmail", formattedData.email);
        }
        if (data.mobileNumber) {
          localStorage.setItem("investorMobile", data.mobileNumber);
        }
         setPreferences([]); // NEW: clear preferences
        reset(initialFormData); // NEW: reset form
        setRegistrationSuccess(true); // NEW: show login dialog    
        showSnackbar(
          "Registration successful! Redirecting to login...",
          "success"
        );
        setLoginOpen(true);
        setTimeout(() => {
          dispatch(hideLoading());
        }, 2000);
      } else {
        dispatch(hideLoading());
        showSnackbar(
          "An unexpected error occurred. Please try again.",
          "error"
        );
      }
      localStorage.removeItem(FORM_DATA_KEY);
    } catch (error) {
      console.error("Registration error:", error);
      dispatch(hideLoading());
      if (error.response?.data?.errors) {
        console.error("Validation errors:", error.response.data.errors);
        showSnackbar(error.response.data.errors.join(", "), "error");
      } else if (
        error.response?.status === 409 ||
        error.response?.data?.message === "User already registered"
      ) {
        showSnackbar(
          "This user is already registered. Please log in.",
          "error"
        );
      } else {
        showSnackbar(
          error.response?.data?.message ||
            "An unexpected error occurred. Please try again.",
          "error"
        );
      }
    }
  };

  useEffect(() => {
    const savedData = localStorage.getItem(FORM_DATA_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData.preferences) {
        setPreferences(parsedData.preferences);
      }
    }
  }, []);

  useEffect(() => {
    const currentData = JSON.parse(localStorage.getItem(FORM_DATA_KEY) || "{}");
    localStorage.setItem(
      FORM_DATA_KEY,
      JSON.stringify({
        ...currentData,
        preferences,
      })
    );
  }, [preferences]);

  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries")
      .then((res) => res.json())
      .then((data) => {
        if (data.data)
          setCountries(
            data.data.map((c) => ({ name: c.country, code: c.iso2 }))
          );
      });
  }, []);

  const pincode = watch("pincode");

  useEffect(() => {
    const pincode = watch("pincode");
    const country = watch("country");
    if (!pincode || !country) return;

    const selectedCountryObj = countries.find((c) => c.name === country);
    const countryCode = selectedCountryObj?.code || "IN";
    setPincodeError("");
    setLoadingPincode(false);

    if (
      (countryCode === "IN" && pincode.length === 6) ||
      (countryCode !== "IN" && pincode.length >= 3)
    ) {
      setLoadingPincode(true);

      const fetchLocation = async () => {
        try {
          if (countryCode === "IN") {
            const res = await fetch(
              `https://api.postalpincode.in/pincode/${pincode}`
            );
            const data = await res.json();
            if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length) {
              const po = data[0].PostOffice[0];
              setValue("state", po.State || "");
              setValue("city", po.District || po.Block || "");
              setPincodeError("");
            } else {
              setValue("state", "");
              setValue("city", "");
              setPincodeError("Invalid Indian pincode");
            }
          } else {
            const code = countryCode.toLowerCase();
            const res = await fetch(
              `https://api.zippopotam.us/${code}/${pincode}`
            );
            if (!res.ok) throw new Error("Not found");
            const data = await res.json();
            setValue("state", data.places?.[0]?.state || "");
            setValue("city", data.places?.[0]?.["place name"] || "");
            setPincodeError("");
          }
        } catch (err) {
          setValue("state", "");
          setValue("city", "");
          setPincodeError("Postal code not found for selected country");
        } finally {
          setLoadingPincode(false);
        }
      };

      fetchLocation();
    } else {
      setValue("state", "");
      setValue("city", "");
      if (countryCode === "IN" && pincode.length > 0 && pincode.length < 6) {
        setPincodeError("Enter 6-digit pincode");
      }
    }
  }, [watch("pincode"), watch("country")]);

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
        }}
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
          <form onSubmit={handleSubmit(onSubmit)}>
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
            <Grid spacing={3}>
              {/* First Name */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="firstName"
                  control={control}
                  rules={{ required: "First name is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value || ""}
                      label="First Name"
                      fullWidth
                      variant="outlined"
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message || " "}
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
                  )}
                />
              </Grid>

              {/* Email */}
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
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value || ""}
                      label="Email"
                      type="email"
                      fullWidth
                      variant="outlined"
                      error={!!errors.email}
                      helperText={errors.email?.message || " "}
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
                                onClick={async () => {
                                  handleVerificationDialog("email", true);
                                  await handleSendOtp("email");
                                }}
                                disabled={
                                  !field.value || verificationState.email.loading
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
                  )}
                />
              </Grid>
  
                {/* Mobile Number */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="mobileNumber"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value || ""}
                        label="Mobile Number"
                        fullWidth
                        variant="outlined"
                        error={!!errors.mobileNumber}
                        helperText={errors.mobileNumber?.message || " "}
                        inputProps={{
                          maxLength: 10,
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                        }}
                        onInput={(e) => {
                          e.target.value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10);
                          setWhatsappEnabled(false);
                        }}
                        onBlur={(e) => {
                          if (e.target.value.length === 10) {
                            setShowWhatsappSnackbar(true);
                            setWhatsappEnabled(false);
                          }
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
                    )}
                  />
                </Grid>

                {/* WhatsApp Number */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="whatsappNumber"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value || ""}
                        label="WhatsApp Number"
                        fullWidth
                        variant="outlined"
                        error={!!errors.whatsappNumber}
                        helperText={errors.whatsappNumber?.message || " "}
                        inputProps={{
                          maxLength: 10,
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                        }}
                        onInput={(e) => {
                          e.target.value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10);
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
                    )}
                  />
                </Grid>
                </Grid>
              <Grid
                container
                spacing={2}
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "flex-start",
                }}
              >
                <Grid size={4} mt={1}>
                  <Controller
                    name="country"
                    defaultValue="India"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        options={countries}
                        getOptionLabel={(option) => option.name || ""}
                        isOptionEqualToValue={(option, value) =>
                          option.name === value
                        }
                        value={
                          countries.find((c) => c.name === field.value) || null
                        }
                        onChange={(_, newValue) => {
                          field.onChange(newValue ? newValue.name : "");
                          setSelectedCountry(newValue ? newValue.name : "");
                          setValue("state", "");
                          setValue("city", "");
                          setValue("pincode", "");
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Country"
                            variant="outlined"
                            error={!!errors.country}
                            helperText={errors.country?.message || " "}
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                        fullWidth
                        sx={{
                          borderRadius: "8px",
                          backgroundColor: "background.paper",
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Address */}
                <Grid size={8} md={8}>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value || ""}
                        label="Address"
                        fullWidth
                        variant="outlined"
                        error={!!errors.address}
                        helperText={errors.address?.message || " "}
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
                            mt: 1,
                          },
                        }}
                      />
                    )}
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
                  <Controller
                    name="pincode"
                    control={control}
                    render={({ field }) => {
                      const selectedCountryObj = countries.find(
                        (c) => c.name === watch("country")
                      );
                      const selectedCountryCode =
                        selectedCountryObj?.code || "IN";
                      return (
                        <TextField
                          {...field}
                          label={
                            selectedCountryCode === "IN"
                              ? "Pincode"
                              : "Postal Code"
                          }
                          fullWidth
                          variant="outlined"
                          required
                          error={!!errors.pincode || !!pincodeError}
                          helperText={
                            errors.pincode?.message ||
                            pincodeError ||
                            (selectedCountryCode === "IN" ? "" : "")
                          }
                          inputProps={{
                            maxLength: selectedCountryCode === "IN" ? 6 : 10,
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                          }}
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, selectedCountryCode === "IN" ? 6 : 10);
                            field.onChange(value);
                            setPincodeError("");
                          }}
                          disabled={!selectedCountryCode}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Tooltip
                                  title={selectedCountryObj?.name || "Country"}
                                >
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
                      );
                    }}
                  />
                </Grid>

                {/* State */}
                <Grid item xs={12} md={4}>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="State"
                        fullWidth
                        variant="outlined"
                        value={watch("state") || ""}
                        InputProps={{ readOnly: true }}
                        error={!!errors.state}
                        helperText={errors.state?.message || " "}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            backgroundColor: "action.hover",
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* City */}
                <Grid item xs={12} md={4}>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="City"
                        fullWidth
                        variant="outlined"
                        value={watch("city") || ""}
                        InputProps={{ readOnly: true }}
                        error={!!errors.city}
                        helperText={errors.city?.message || " "}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            backgroundColor: "action.hover",
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              {/* Occupation */}
              <Grid item xs={12}>
                <Controller
                  name="occupation"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Occupation"
                      fullWidth
                      variant="outlined"
                      value={field.value || ""}
                      error={!!errors.occupation}
                      helperText={errors.occupation?.message || " "}
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
                        textAlign: "left",
                      }}
                    >
                      <MenuItem value="">Select Occupation</MenuItem>
                      <MenuItem value="Student">Student</MenuItem>
                      <MenuItem value="Salaried Professional">
                        Salaried Professional
                      </MenuItem>
                      <MenuItem value="Business Owner/ Self-Employed">
                        Business Owner/ Self-Employed
                      </MenuItem>
                      <MenuItem value="Retired">Retired</MenuItem>
                      <MenuItem value="Freelancer/ Consultant">
                        Freelancer/ Consultant
                      </MenuItem>
                      <MenuItem value="Homemaker">Homemaker</MenuItem>
                      <MenuItem value="Investor">Investor</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>

              {/* Other Occupation */}
              {occupationValue === "Other" && (
                <Grid item xs={12}>
                  <Controller
                    name="otherOccupation"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Specify Occupation"
                        fullWidth
                        variant="outlined"
                        error={!!errors.otherOccupation}
                        helperText={errors.otherOccupation?.message || " "}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              )}
            </Grid>

            {/* Preferences Section - Now in separate component */}
            <InvestorRegisterPreferences
              control={control}
              watch={watch}
              setValue={setValue}
              errors={errors}
              clearErrors={clearErrors}
              preferences={preferences}
              setPreferences={setPreferences}
              selectedMainCategory={selectedMainCategory}
              setSelectedMainCategory={setSelectedMainCategory}
              selectedSubCategory={selectedSubCategory}
              setSelectedSubCategory={setSelectedSubCategory}
              selectedChild={selectedChild}
              setSelectedChild={setSelectedChild}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              categories={categories}
              showSnackbar={showSnackbar}
              indiaData={indiaData}
              preferredStates={preferredStates}
              preferredCities={preferredCities}
              preferredDistricts={preferredDistricts}
              intlCountries={intlCountries}
              intlStates={intlStates}
              intlCities={intlCities}
              propertyCountries={propertyCountries}
              propertyStates={propertyStates}
              propertyCities={propertyCities}
              propertyCountry={propertyCountry}
              propertyState={propertyState}
            />

            {/* Terms and Submit Section */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: 4,
                p: 3,
              }}
            >
              <FormControlLabel
                control={
                  <Controller
                    name="terms"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        color="primary"
                        checked={field.value || false}
                      />
                    )}
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
              {errors.terms && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                  You must accept the terms
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={preferences.length === 0}
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  minWidth: "200px",
                  borderRadius: "8px",
                  py: 1.5,
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  backgroundColor: "#7ad03a",
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
                    "&:hover": {
                      textDecoration: "underline",
                    },
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
            PaperProps={{
              sx: {
                borderRadius: "16px",
                p: 3,
              },
            }}
          >
            <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
              Verify Email
            </DialogTitle>
            <DialogContent>
              <Box sx={{ minWidth: 300, pt: 1 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  We've sent a 6-digit OTP to {watch("email")}
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    onClick={() => handleResendOtp("email")}
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
                      "&:hover": {
                        backgroundColor: "#5a9e2a",
                      },
                    }}
                  >
                    {verificationState.email.loading ? "Verifying..." : "Verify"}
                  </Button>
                </Box>
              </Box>
            </DialogContent>
          </Dialog>

          {/* Login Popup Dialog */}
          <Dialog
            open={registrationSuccess || loginOpen} // CHANGED
            onClose={closeLoginPopup}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: "16px",
              },
            }}
          >
            <LoginPage open={registrationSuccess || loginOpen} onClose={closeLoginPopup} />
          </Dialog>

          {/* OTP Verification Modal */}
          <Dialog
            open={otpModal.open}
            onClose={closeOtpModal}
            PaperProps={{
              sx: {
                borderRadius: "16px",
                p: 3,
              },
            }}
          >
            <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
              Verify{" "}
              {otpModal.type === "email"
                ? "Email"
                : otpModal.type === "mobile"
                ? "Mobile Number"
                : "WhatsApp Number"}
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Enter OTP"
                type="text"
                fullWidth
                variant="outlined"
                value={otpModal.otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtpModal((prev) => ({ ...prev, otp: value }));
                }}
                disabled={otpModal.verified}
                InputProps={{
                  endAdornment: otpModal.verified && (
                    <InputAdornment position="end">
                      <CheckCircle color="success" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                  mt: 2,
                }}
              />
            </DialogContent>
            <DialogActions
              sx={{ justifyContent: "center", gap: 2, px: 3, pb: 3 }}
            >
              <Button
                onClick={closeOtpModal}
                variant="outlined"
                sx={{ borderRadius: "8px", px: 3 }}
              >
                Cancel
              </Button>
              <Button
                onClick={verifyOtp}
                disabled={otpModal.verified || otpModal.loading}
                color="primary"
                variant="contained"
                sx={{ borderRadius: "8px", px: 3 }}
              >
                {otpModal.loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : otpModal.verified ? (
                  "Verified"
                ) : (
                  "Verify"
                )}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar for notifications */}
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

          {/* WhatsApp Snackbar */}
          <Snackbar
            open={showWhatsappSnackbar}
            autoHideDuration={6000}
            onClose={() => setShowWhatsappSnackbar(false)}
            anchorOrigin={{ vertical: "center", horizontal: "center" }}
            sx={{
              width: "100%",
              maxWidth: "700px",
              mb: 12,
            }}
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
                      setValue("whatsappNumber", watch("mobileNumber"));
                      setShowWhatsappSnackbar(false);
                      setWhatsappEnabled(true);
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
                    onClick={() => {
                      setShowWhatsappSnackbar(false);
                      setWhatsappEnabled(true);
                    }}
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

