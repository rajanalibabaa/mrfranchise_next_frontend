"use client";
import React, { useState, useEffect, useCallback } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { TbPhotoEdit } from "react-icons/tb";
import Navbar from "@/Components/Navbar/NavBar";
import InvestorDashboardLayout from "../sidebar";
import Footer from "@/Components/Footers/Footer";

const ManageProfile = () => {
  // State management
  const [originalData, setOriginalData] = useState(null);
  const [investorData, setInvestorData] = useState({
    firstName: "",
    email: "",
    mobileNumber: "",
    whatsappNumber: "",
    country: "",
    occupation: "",
    state: "",
    city: "",
    address: "",
    pincode: "",
    preferences: [],
    profileImage: "",
    investorID: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otpStep, setOtpStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [requestOTP, setRequestOTP] = useState(false);
  const [errorMSG, setErrorMSG] = useState("");
  const [indiaData, setIndiaData] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({
    firstName: "",
    mobileNumber: "",
    whatsappNumber: "",
    state: "",
    city: "",
    address: "",
    pincode: "",
    occupation: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [imagesizeError, setImagesizeError] = useState("");
  const [isImageRemoved, setIsImageRemoved] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Industry and Category states
  const [industryData, setIndustryData] = useState({});
  const [allIndustries, setAllIndustries] = useState([]);
  const [loadingIndustry, setLoadingIndustry] = useState(false);

  // Location data states
  const [countries, setCountries] = useState([]);
  const [intlStates, setIntlStates] = useState({});
  const [intlCities, setIntlCities] = useState({});
  const [stateSuggestions, setStateSuggestions] = useState([]);
  const [districtSuggestions, setDistrictSuggestions] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  // Navigation and Redux
  const navigate = useRouter();
  const investorUUID = useSelector((state) => state.auth?.investorUUID);
  const AccessToken = useSelector((state) => state.auth?.AccessToken);

  // Helper functions
  const formatNumber = useCallback((num) => {
    if (!num) return "";
    return num.replace(/^(\+91)?/, "").trim();
  }, []);

  // Filter suggestions helper
  const filterSuggestions = useCallback((input, data) => {
    if (!input || !data) return [];
    return data
      .filter((item) => item.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 5);
  }, []);

  // Fetch industry details
  const fetchIndustryDetails = async (industryName) => {
    if (!industryName) return;

    try {
      setLoadingIndustry(true);
      const response = await axios.get(
        `http://localhost:5000/api/v1/admin/getIndustryByIndustryName`,
        {
          params: { industry: industryName },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AccessToken}`,
          },
        },
      );

      if (response.data?.success && response.data?.data) {
        const data = response.data.data;
        setIndustryData((prev) => ({
          ...prev,
          [industryName]: {
            industry: data.industry || industryName,
            categories: data.categories || [],
          },
        }));
      } else {
        // Fallback if no specific data
        setIndustryData((prev) => ({
          ...prev,
          [industryName]: {
            industry: industryName,
            categories: [],
          },
        }));
      }
    } catch (error) {
      console.error("Error fetching industry details:", error);
      setIndustryData((prev) => ({
        ...prev,
        [industryName]: {
          industry: industryName,
          categories: [],
        },
      }));
    } finally {
      setLoadingIndustry(false);
    }
  };

  // Fetch all industries list
  const fetchAllIndustries = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/admin/getAllIndustries`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AccessToken}`,
          },
        },
      );

      if (response.data?.success && response.data?.data) {
        const industries = response.data.data.map(
          (ind) => ind.industry || ind.name,
        );
        setAllIndustries(industries);
        return industries;
      }
      const defaultIndustries = ["Food & Beverages"];
      setAllIndustries(defaultIndustries);
      return defaultIndustries;
    } catch (error) {
      console.error("Error fetching industries list:", error);
      const defaultIndustries = ["Food & Beverages"];
      setAllIndustries(defaultIndustries);
      return defaultIndustries;
    }
  };

  // Handle avatar file change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 50 * 1024; // 50KB in bytes

      if (file.size > maxSize) {
        setImagesizeError(
          "Oops! Upload failed — please use an image under 50KB.",
        );
        return;
      }

      if (!file.type.match("image.*")) {
        setImagesizeError("Please upload an image file (JPEG, PNG, etc.)");
        return;
      }

      setImagesizeError("");
      setAvatarFile(file);
      setIsImageRemoved(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("");
    setImagesizeError("");
    setIsImageRemoved(true);
  };

  // Location data handling for India
  const getDistrictsForState = useCallback(
    (stateName) => {
      if (!stateName) return [];
      const stateObj = indiaData.find((s) => s.name === stateName);
      return stateObj?.districts || [];
    },
    [indiaData],
  );

  const getCitiesForDistrict = useCallback(
    (stateName, districtName) => {
      if (!stateName || !districtName) return [];
      const stateObj = indiaData.find((s) => s.name === stateName);
      if (!stateObj) return [];
      return (stateObj.cities || [])
        .filter((city) => city.district === districtName)
        .map((city) => city.name);
    },
    [indiaData],
  );

  // Fetch international states from API
  const fetchInternationalStates = async (country) => {
    if (!country) {
      return;
    }

    try {
      const response = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/states",
        { country },
      );
      const states =
        response.data?.data?.states?.map((state) => state.name) || [];
      setIntlStates((prev) => ({
        ...prev,
        [country]: states,
      }));
    } catch (error) {
      console.error("Error fetching international states:", error);
      setIntlStates((prev) => ({
        ...prev,
        [country]: [],
      }));
    }
  };

  // Fetch international cities from API
  const fetchInternationalCities = async (country, state) => {
    if (!country || !state) {
      return;
    }

    try {
      const response = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        { country, state },
      );
      const cities = response.data?.data || [];
      setIntlCities((prev) => ({
        ...prev,
        [`${country}-${state}`]: cities,
      }));
    } catch (error) {
      console.error("Error fetching international cities:", error);
      setIntlCities((prev) => ({
        ...prev,
        [`${country}-${state}`]: [],
      }));
    }
  };

  // Fetch all countries from API
  const fetchAllCountries = async () => {
    try {
      const response = await axios.get(
        "https://countriesnow.space/api/v0.1/countries",
      );
      if (response.data?.data) {
        const countryNames = response.data.data.map((c) => c.country).sort();
        setCountries(countryNames);
        return countryNames;
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
      return [];
    }
  };

  // Data fetching
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch India data
        const indiaRes = await axios.get(
          "https://raw.githubusercontent.com/prasad-gowda/india-state-district-cities/master/India-state-district-city.json",
        );
        setIndiaData(indiaRes.data);

        // Fetch all countries
        await fetchAllCountries();
      } catch (err) {
        console.error("Error fetching location data:", err);
        setSnackbar({
          open: true,
          message:
            "Failed to load location data. Some features may not work properly.",
          severity: "warning",
        });
      }
    };

    fetchInitialData();
  }, []);

  // Fetch industry data on component mount
  useEffect(() => {
    if (AccessToken) {
      fetchAllIndustries();
    }
  }, [AccessToken]);

  // Main data fetching effect
  useEffect(() => {
    const fetchData = async () => {
      if (!investorUUID || !AccessToken) {
        setLoading(false);
        navigate("/loginpage");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/v1/investor/getInvestorByUUID/${investorUUID}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${AccessToken}`,
            },
          },
        );

        if (response.data?.data) {
          const data = response.data.data;

          // Transform the data to match our component structure
          const formattedData = {
            ...data,
            mobileNumber: formatNumber(data.mobileNumber),
            whatsappNumber: formatNumber(data.whatsappNumber),
            occupation: data.occupation || "",
            investorID: data.inveterID || "",
            profileImage: data.profileImage || "",

            // Transform preferences - handle both old (main/sub) and new (industry/category) structures
            preferences: data.preferences?.map((pref, index) => {
              // Transform categories from backend structure (main/sub) to frontend structure (industry/category)
              const transformedCategories = Array.isArray(pref.category)
                ? pref.category.map((cat) => ({
                    industry: cat.main || "", // Use main as industry
                    category: cat.sub || "", // Use sub as category
                  }))
                : [{ industry: "", category: "" }];

              return {
                ...pref,
                _id: pref._id || `pref-${Date.now()}-${index}`,
                category: transformedCategories,
                locationType:
                  pref.locationType === "international"
                    ? "International"
                    : "Domestic",
                propertyPreferred: Array.isArray(pref.propertyPreferred)
                  ? pref.propertyPreferred
                  : [
                      {
                        propertyType: "",
                        propertySize: "",
                        propertyCountry: "",
                        propertyState: "",
                        propertyCity: "",
                      },
                    ],
              };
            }) || [
              {
                investmentRange: "",
                investmentAmount: "",
                locationType: "Domestic",
                preferredCountry: "India", // Default for domestic
                preferredState: "",
                preferredDistrict: "",
                preferredCity: "",
                category: [
                  {
                    industry: "",
                    category: "",
                  },
                ],
                propertyPreferred: [
                  {
                    propertyType: "",
                    propertySize: "",
                    propertyCountry: "",
                    propertyState: "",
                    propertyCity: "",
                  },
                ],
                _id: `pref-${Date.now()}`,
              },
            ],
          };

          setInvestorData(formattedData);
          setOriginalData(formattedData);
          setAvatarPreview(data.profileImage || "");

          // Pre-fetch industry details for all existing categories
          if (formattedData.preferences) {
            for (const pref of formattedData.preferences) {
              if (pref.category) {
                for (const cat of pref.category) {
                  if (cat.industry && !industryData[cat.industry]) {
                    await fetchIndustryDetails(cat.industry);
                  }
                }
              }
            }
          }

          // Pre-fetch international location data if needed
          if (data.preferences) {
            for (const pref of data.preferences) {
              if (
                pref.locationType === "international" &&
                pref.preferredCountry
              ) {
                await fetchInternationalStates(pref.preferredCountry);
                if (pref.preferredState) {
                  await fetchInternationalCities(
                    pref.preferredCountry,
                    pref.preferredState,
                  );
                }
              }
            }
          }
        } else {
          throw new Error("No data received from server");
        }
      } catch (error) {
        console.error("Error fetching investor data:", error);
        setSnackbar({
          open: true,
          message: "Failed to load profile data. Please try again later.",
          severity: "error",
        });
        if (error.response?.status === 401) {
          navigate("/loginpage");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [investorUUID, AccessToken, navigate, formatNumber]);

  // OTP handling
  const handleEditToggle = () => {
    setOtpDialogOpen(true);
    setOtpStep(1);
    setOtp("");
    setOtpError("");
    setErrorMSG("");
  };

  const handleRequestOtp = async () => {
    if (!investorData.email) return;
    setErrorMSG("");
    setRequestOTP(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/otp/existingEmailOTP",
        { email: investorData.email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AccessToken}`,
          },
        },
      );

      if (response.data.success) {
        setOtpStep(2);
        setSnackbar({
          open: true,
          message: "OTP sent successfully!",
          severity: "success",
        });
      } else {
        setErrorMSG(
          response.data.message || "Failed to send OTP. Please try again.",
        );
      }
    } catch (error) {
      console.error("OTP request error:", error);
      setErrorMSG(
        error.response?.data?.message ||
          "An error occurred while requesting OTP. Please try again later.",
      );
    } finally {
      setRequestOTP(false);
    }
  };

  const handleOtpVerify = async () => {
    if (!otp) {
      setOtpError("Please enter the OTP");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    setOtpError("");
    setErrorMSG("");
    setRequestOTP(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/otp/verifyExistingEmailOTP",
        {
          email: investorData.email,
          verifyOTP: otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AccessToken}`,
          },
        },
      );

      if (response.data.success) {
        setEditMode(true);
        setOtpDialogOpen(false);
        setSnackbar({
          open: true,
          message: "OTP verified successfully! You can now edit your profile.",
          severity: "success",
        });
      } else {
        setOtpError(response.data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setOtpError(
        error.response?.data?.message ||
          "An error occurred during OTP verification. Please try again.",
      );
    } finally {
      setRequestOTP(false);
    }
  };

  // Validate all fields
  const validateFields = useCallback(() => {
    const errors = {
      firstName: "",
      mobileNumber: "",
      whatsappNumber: "",
      state: "",
      city: "",
      address: "",
      pincode: "",
      occupation: "",
    };
    let isValid = true;

    // Validate firstName
    if (!investorData.firstName?.trim()) {
      errors.firstName = "First name is required";
      isValid = false;
    } else if (investorData.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters";
      isValid = false;
    }

    // Validate mobileNumber
    const mobileNumber = formatNumber(investorData.mobileNumber);
    if (!mobileNumber) {
      errors.mobileNumber = "Mobile number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(mobileNumber)) {
      errors.mobileNumber = "Mobile number must be 10 digits";
      isValid = false;
    }

    // Validate whatsappNumber
    const whatsappNumber = formatNumber(investorData.whatsappNumber);
    if (!whatsappNumber) {
      errors.whatsappNumber = "WhatsApp number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(whatsappNumber)) {
      errors.whatsappNumber = "WhatsApp number must be 10 digits";
      isValid = false;
    }

    // Validate state
    if (!investorData.state?.trim()) {
      errors.state = "State is required";
      isValid = false;
    }

    // Validate city
    if (!investorData.city?.trim()) {
      errors.city = "City is required";
      isValid = false;
    }

    // Validate address
    if (!investorData.address?.trim()) {
      errors.address = "Address is required";
      isValid = false;
    }

    // Validate pincode
    if (!investorData.pincode) {
      errors.pincode = "Pincode is required";
      isValid = false;
    } else if (!/^\d{6}$/.test(investorData.pincode)) {
      errors.pincode = "Pincode must be 6 digits";
      isValid = false;
    }

    // Validate occupation
    if (!investorData.occupation) {
      errors.occupation = "Occupation is required";
      isValid = false;
    }

    // Validate preferences
    if (!investorData.preferences || investorData.preferences.length === 0) {
      setSnackbar({
        open: true,
        message: "At least one preference is required",
        severity: "error",
      });
      isValid = false;
    } else {
      for (const pref of investorData.preferences) {
        if (!pref.investmentRange) {
          setSnackbar({
            open: true,
            message: "Investment range is required for all preferences",
            severity: "error",
          });
          isValid = false;
          break;
        }

        if (!pref.investmentAmount) {
          setSnackbar({
            open: true,
            message: "Investment amount is required for all preferences",
            severity: "error",
          });
          isValid = false;
          break;
        }

        if (!pref.locationType) {
          setSnackbar({
            open: true,
            message: "Location type is required for all preferences",
            severity: "error",
          });
          isValid = false;
          break;
        }

        if (pref.locationType === "Domestic") {
          if (!pref.preferredState) {
            setSnackbar({
              open: true,
              message: "Preferred state is required for domestic preferences",
              severity: "error",
            });
            isValid = false;
            break;
          }

          if (!pref.preferredDistrict) {
            setSnackbar({
              open: true,
              message:
                "Preferred district is required for domestic preferences",
              severity: "error",
            });
            isValid = false;
            break;
          }

          if (!pref.preferredCity) {
            setSnackbar({
              open: true,
              message: "Preferred city is required for domestic preferences",
              severity: "error",
            });
            isValid = false;
            break;
          }
        } else if (pref.locationType === "International") {
          if (!pref.preferredCountry) {
            setSnackbar({
              open: true,
              message:
                "Preferred country is required for international preferences",
              severity: "error",
            });
            isValid = false;
            break;
          }

          if (!pref.preferredState) {
            setSnackbar({
              open: true,
              message:
                "Preferred state/province is required for international preferences",
              severity: "error",
            });
            isValid = false;
            break;
          }

          if (!pref.preferredCity) {
            setSnackbar({
              open: true,
              message:
                "Preferred city is required for international preferences",
              severity: "error",
            });
            isValid = false;
            break;
          }
        }

        if (!pref.category || pref.category.length === 0) {
          setSnackbar({
            open: true,
            message: "At least one category is required for each preference",
            severity: "error",
          });
          isValid = false;
          break;
        }

        for (const cat of pref.category) {
          if (!cat.industry) {
            setSnackbar({
              open: true,
              message: "Industry is required for all categories",
              severity: "error",
            });
            isValid = false;
            break;
          }

          if (!cat.category) {
            setSnackbar({
              open: true,
              message: "Category is required for all categories",
              severity: "error",
            });
            isValid = false;
            break;
          }
        }

        // Validate property preferences
        if (!pref.propertyPreferred || pref.propertyPreferred.length === 0) {
          setSnackbar({
            open: true,
            message: "At least one property preference is required",
            severity: "error",
          });
          isValid = false;
          break;
        }

        for (const prop of pref.propertyPreferred) {
          if (!prop.propertyType) {
            setSnackbar({
              open: true,
              message: "Property type is required for all property preferences",
              severity: "error",
            });
            isValid = false;
            break;
          }

          if (prop.propertyType === "Own Property" && !prop.propertySize) {
            setSnackbar({
              open: true,
              message:
                "Property size is required when property type is Own Property",
              severity: "error",
            });
            isValid = false;
            break;
          }
        }
      }
    }

    setFieldErrors(errors);
    return isValid;
  }, [investorData, formatNumber]);

  // Get only changed fields
  const getChangedFields = useCallback(() => {
    if (!originalData) return {};

    const changes = {};

    // Basic fields
    const fieldsToCheck = [
      "firstName",
      "email",
      "mobileNumber",
      "whatsappNumber",
      "country",
      "state",
      "city",
      "address",
      "pincode",
      "occupation",
    ];

    fieldsToCheck.forEach((field) => {
      if (investorData[field] !== originalData[field]) {
        changes[field] = investorData[field];
      }
    });

    // Handle phone numbers - add +91 prefix for backend
    const currentMobile = formatNumber(investorData.mobileNumber);
    const originalMobile = formatNumber(originalData.mobileNumber);
    if (currentMobile !== originalMobile) {
      changes.mobileNumber = "+91" + currentMobile;
    }

    const currentWhatsapp = formatNumber(investorData.whatsappNumber);
    const originalWhatsapp = formatNumber(originalData.whatsappNumber);
    if (currentWhatsapp !== originalWhatsapp) {
      changes.whatsappNumber = "+91" + currentWhatsapp;
    }

    // Handle preferences if changed
    const normalizedOriginalPrefs = originalData.preferences.map((pref) => ({
      ...pref,
      locationType: pref.locationType.toLowerCase(),
      // Transform categories to match backend structure (main/sub without child)
      category: pref.category.map((cat) => ({
        main: cat.industry || "",
        sub: cat.category || "",
        child: "", // Ensure child is empty
      })),
    }));

    const normalizedCurrentPrefs = investorData.preferences.map((pref) => ({
      ...pref,
      locationType: pref.locationType.toLowerCase(),
      // Set preferredCountry to India for domestic
      preferredCountry:
        pref.locationType === "Domestic" ? "India" : pref.preferredCountry,
      // Transform categories to match backend structure
      category: pref.category.map((cat) => ({
        main: cat.industry || "",
        sub: cat.category || "",
        child: "", // Ensure child is empty
      })),
      propertyPreferred: pref.propertyPreferred || [],
    }));

    if (
      JSON.stringify(normalizedCurrentPrefs) !==
      JSON.stringify(normalizedOriginalPrefs)
    ) {
      changes.preferences = normalizedCurrentPrefs;
    }

    // Handle profile image changes
    if (avatarFile) {
      changes.profileImage = avatarFile;
    } else if (isImageRemoved) {
      changes.removeProfileImage = true;
    }

    return changes;
  }, [originalData, investorData, avatarFile, isImageRemoved, formatNumber]);

  // Form handling
  const handleSave = async () => {
    if (!validateFields()) {
      return;
    }

    setIsSubmitting(true);

    const changedFields = getChangedFields();

    // If nothing changed, just exit edit mode
    if (
      Object.keys(changedFields).length === 0 &&
      !avatarFile &&
      !isImageRemoved
    ) {
      setEditMode(false);
      setSnackbar({
        open: true,
        message: "No changes detected",
        severity: "info",
      });
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();

    // Append only changed fields
    Object.entries(changedFields).forEach(([key, value]) => {
      if (key === "profileImage") {
        formData.append(key, value);
      } else if (key === "preferences") {
        formData.append(key, JSON.stringify(value));
      } else if (key !== "removeProfileImage") {
        formData.append(key, value);
      }
    });

    if (changedFields.removeProfileImage) {
      formData.append("removeProfileImage", "true");
    }

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/v1/investor/updateInvestor/${investorUUID}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${AccessToken}`,
          },
        },
      );

      if (response.data.success) {
        const updatedData = response.data.data;

        // Transform the updated data back to frontend structure
        const newOriginalData = {
          ...originalData,
          ...updatedData,
          mobileNumber: formatNumber(updatedData.mobileNumber),
          whatsappNumber: formatNumber(updatedData.whatsappNumber),
          profileImage: updatedData.profileImage || "",
          preferences:
            updatedData.preferences?.map((pref) => {
              // Transform categories from backend (main/sub) to frontend (industry/category)
              const transformedCategories = Array.isArray(pref.category)
                ? pref.category.map((cat) => ({
                    industry: cat.main || "",
                    category: cat.sub || "",
                  }))
                : [{ industry: "", category: "" }];

              return {
                ...pref,
                locationType:
                  pref.locationType === "international"
                    ? "International"
                    : "Domestic",
                category: transformedCategories,
                propertyPreferred: pref.propertyPreferred || [],
              };
            }) || [],
        };

        setOriginalData(newOriginalData);
        setInvestorData(newOriginalData);

        if (avatarFile) {
          setAvatarPreview(URL.createObjectURL(avatarFile));
        } else if (isImageRemoved) {
          setAvatarPreview("");
        }

        setAvatarFile(null);
        setIsImageRemoved(false);
        setEditMode(false);

        setSnackbar({
          open: true,
          message: "Profile successfully updated!",
          severity: "success",
        });
      } else {
        throw new Error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving investor data:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          "Failed to update profile. Please try again.",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preference handling
  const handlePreferenceChange = async (index, key, value) => {
    const newPrefs = [...(investorData.preferences || [])];
    newPrefs[index] = { ...newPrefs[index], [key]: value };

    // Reset location fields when location type changes
    if (key === "locationType") {
      if (value === "Domestic") {
        newPrefs[index] = {
          ...newPrefs[index],
          preferredCountry: "India",
          preferredState: "",
          preferredDistrict: "",
          preferredCity: "",
        };
      } else if (value === "International") {
        newPrefs[index] = {
          ...newPrefs[index],
          preferredCountry: "",
          preferredState: "",
          preferredDistrict: "",
          preferredCity: "",
        };
      }
    }

    setInvestorData({ ...investorData, preferences: newPrefs });
  };

  // Handle international country change
  const handleIntlCountryChange = async (prefIndex, countryName) => {
    const newPrefs = [...(investorData.preferences || [])];
    newPrefs[prefIndex] = {
      ...newPrefs[prefIndex],
      preferredCountry: countryName,
      preferredState: "",
      preferredCity: "",
    };
    setInvestorData({ ...investorData, preferences: newPrefs });

    // Fetch states for the selected country
    await fetchInternationalStates(countryName);
  };

  // Handle international state change
  const handleIntlStateChange = async (prefIndex, stateName) => {
    const newPrefs = [...(investorData.preferences || [])];
    newPrefs[prefIndex] = {
      ...newPrefs[prefIndex],
      preferredState: stateName,
      preferredCity: "",
    };
    setInvestorData({ ...investorData, preferences: newPrefs });

    // Fetch cities for the selected state
    const pref = newPrefs[prefIndex];
    await fetchInternationalCities(pref.preferredCountry, stateName);
  };

  // Handle industry change in category
  const handleIndustryChange = async (prefIndex, catIndex, industryName) => {
    const newPrefs = [...(investorData.preferences || [])];
    const newCategories = [...(newPrefs[prefIndex].category || [])];
    newCategories[catIndex] = {
      ...newCategories[catIndex],
      industry: industryName,
      category: "", // Reset category when industry changes
    };
    newPrefs[prefIndex].category = newCategories;
    setInvestorData({ ...investorData, preferences: newPrefs });

    // Fetch categories for the selected industry if not already fetched
    if (industryName && !industryData[industryName]) {
      await fetchIndustryDetails(industryName);
    }
  };

  // Handle category change
  const handleCategoryChange = (prefIndex, catIndex, value) => {
    const newPrefs = [...(investorData.preferences || [])];
    const newCategories = [...(newPrefs[prefIndex].category || [])];
    newCategories[catIndex] = {
      ...newCategories[catIndex],
      category: value,
    };
    newPrefs[prefIndex].category = newCategories;
    setInvestorData({ ...investorData, preferences: newPrefs });
  };

  // Property preference handling
  const handlePropertyPreferenceChange = (prefIndex, propIndex, key, value) => {
    const newPrefs = [...(investorData.preferences || [])];
    const newProps = [...(newPrefs[prefIndex].propertyPreferred || [])];
    newProps[propIndex] = { ...newProps[propIndex], [key]: value };
    newPrefs[prefIndex].propertyPreferred = newProps;
    setInvestorData({ ...investorData, preferences: newPrefs });
  };

  const addPreference = async () => {
    const newPrefs = [...(investorData.preferences || [])];
    newPrefs.push({
      investmentRange: "",
      investmentAmount: "",
      locationType: "Domestic",
      preferredCountry: "India",
      preferredState: "",
      preferredDistrict: "",
      preferredCity: "",
      category: [
        {
          industry: "",
          category: "",
        },
      ],
      propertyPreferred: [
        {
          propertyType: "",
          propertySize: "",
          propertyCountry: "",
          propertyState: "",
          propertyCity: "",
        },
      ],
      _id: `pref-${Date.now()}`,
    });
    setInvestorData({ ...investorData, preferences: newPrefs });
  };

  const removePreference = (index) => {
    const newPrefs = [...(investorData.preferences || [])];
    if (newPrefs.length > 1) {
      newPrefs.splice(index, 1);
      setInvestorData({ ...investorData, preferences: newPrefs });
    } else {
      setSnackbar({
        open: true,
        message: "At least one preference is required",
        severity: "error",
      });
    }
  };

  // State change handler for domestic
  const handleStateChange = (prefIndex, stateName) => {
    const newPrefs = [...(investorData.preferences || [])];
    newPrefs[prefIndex] = {
      ...newPrefs[prefIndex],
      preferredState: stateName,
      preferredDistrict: "",
      preferredCity: "",
    };
    setInvestorData({ ...investorData, preferences: newPrefs });
    setStateSuggestions([]);
  };

  // District change handler for domestic
  const handleDistrictChange = (prefIndex, districtName) => {
    const newPrefs = [...(investorData.preferences || [])];
    newPrefs[prefIndex] = {
      ...newPrefs[prefIndex],
      preferredDistrict: districtName,
      preferredCity: "",
    };
    setInvestorData({ ...investorData, preferences: newPrefs });
    setDistrictSuggestions([]);
  };

  // City change handler for domestic
  const handleCityChange = (prefIndex, cityName) => {
    const newPrefs = [...(investorData.preferences || [])];
    newPrefs[prefIndex] = {
      ...newPrefs[prefIndex],
      preferredCity: cityName,
    };
    setInvestorData({ ...investorData, preferences: newPrefs });
    setCitySuggestions([]);
  };

  // Render international location fields
  const renderInternationalLocationFields = (pref, prefIndex) => {
    const countryStates = intlStates[pref.preferredCountry] || [];
    const cities =
      intlCities[`${pref.preferredCountry}-${pref.preferredState}`] || [];

    return (
      <>
        <TextField
          size="small"
          label="Preferred Country"
          value={pref.preferredCountry || ""}
          onChange={async (e) => {
            await handleIntlCountryChange(prefIndex, e.target.value);
          }}
          disabled={!editMode}
          select
          fullWidth
          required
          error={editMode && !pref.preferredCountry}
          helperText={
            editMode && !pref.preferredCountry ? "This field is required" : ""
          }
        >
          <MenuItem value="">Select Country</MenuItem>
          {countries.map((country) => (
            <MenuItem key={country} value={country}>
              {country}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          size="small"
          label="Preferred State/Province"
          value={pref.preferredState || ""}
          onChange={async (e) => {
            await handleIntlStateChange(prefIndex, e.target.value);
          }}
          disabled={!editMode || !pref.preferredCountry}
          select
          fullWidth
          required
          error={editMode && !pref.preferredState}
          helperText={
            editMode && !pref.preferredState ? "This field is required" : ""
          }
          sx={{ mt: 2 }}
        >
          <MenuItem value="">Select State/Province</MenuItem>
          {countryStates.map((state) => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          size="small"
          label="Preferred City"
          value={pref.preferredCity || ""}
          onChange={(e) =>
            handlePreferenceChange(prefIndex, "preferredCity", e.target.value)
          }
          disabled={!editMode || !pref.preferredState}
          select
          fullWidth
          required
          error={editMode && !pref.preferredCity}
          helperText={
            editMode && !pref.preferredCity ? "This field is required" : ""
          }
          sx={{ mt: 2 }}
        >
          <MenuItem value="">Select City</MenuItem>
          {cities.map((city) => (
            <MenuItem key={city} value={city}>
              {city}
            </MenuItem>
          ))}
        </TextField>
      </>
    );
  };

  // Render domestic location fields
  const renderDomesticLocationFields = (pref, prefIndex) => {
    const districts = getDistrictsForState(pref.preferredState);
    const cities = getCitiesForDistrict(
      pref.preferredState,
      pref.preferredDistrict,
    );

    return (
      <>
        <TextField
          size="small"
          label="Preferred State"
          value={pref?.preferredState || ""}
          onChange={(e) => {
            handleStateChange(prefIndex, e.target.value);
            setStateSuggestions(
              filterSuggestions(
                e.target.value,
                indiaData.map((state) => state.name),
              ),
            );
            setActiveSuggestionIndex(-1);
          }}
          onFocus={() => {
            if (pref?.preferredState) {
              setStateSuggestions(
                filterSuggestions(
                  pref.preferredState,
                  indiaData.map((state) => state.name),
                ),
              );
            }
          }}
          onBlur={() => setTimeout(() => setStateSuggestions([]), 200)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveSuggestionIndex((prev) =>
                Math.min(prev + 1, stateSuggestions.length - 1),
              );
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveSuggestionIndex((prev) => Math.max(prev - 1, -1));
            } else if (e.key === "Enter" && activeSuggestionIndex >= 0) {
              e.preventDefault();
              handleStateChange(
                prefIndex,
                stateSuggestions[activeSuggestionIndex],
              );
              setStateSuggestions([]);
            }
          }}
          disabled={!editMode || indiaData.length === 0}
          fullWidth
          required
          error={editMode && !pref.preferredState}
          helperText={
            editMode && !pref.preferredState ? "This field is required" : ""
          }
        />

        {stateSuggestions.length > 0 && (
          <Paper
            elevation={3}
            sx={{ mt: 0.5, maxHeight: 200, overflow: "auto" }}
          >
            {stateSuggestions.map((state, index) => (
              <MenuItem
                key={state}
                selected={index === activeSuggestionIndex}
                onClick={() => {
                  handleStateChange(prefIndex, state);
                  setStateSuggestions([]);
                }}
                sx={{ fontSize: "0.875rem" }}
              >
                {state}
              </MenuItem>
            ))}
          </Paper>
        )}

        <TextField
          size="small"
          label="Preferred District"
          value={pref.preferredDistrict || ""}
          onChange={(e) => {
            handleDistrictChange(prefIndex, e.target.value);
            setDistrictSuggestions(
              filterSuggestions(e.target.value, districts),
            );
            setActiveSuggestionIndex(-1);
          }}
          onFocus={() => {
            if (pref?.preferredDistrict && pref.preferredState) {
              setDistrictSuggestions(
                filterSuggestions(pref.preferredDistrict, districts),
              );
            }
          }}
          onBlur={() => setTimeout(() => setDistrictSuggestions([]), 200)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveSuggestionIndex((prev) =>
                Math.min(prev + 1, districtSuggestions.length - 1),
              );
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveSuggestionIndex((prev) => Math.max(prev - 1, -1));
            } else if (e.key === "Enter" && activeSuggestionIndex >= 0) {
              e.preventDefault();
              handleDistrictChange(
                prefIndex,
                districtSuggestions[activeSuggestionIndex],
              );
              setDistrictSuggestions([]);
            }
          }}
          disabled={!editMode || !pref.preferredState}
          fullWidth
          required
          error={editMode && !pref.preferredDistrict}
          helperText={
            editMode && !pref.preferredDistrict ? "This field is required" : ""
          }
          sx={{ mt: 2 }}
        />

        {districtSuggestions.length > 0 && (
          <Paper
            elevation={3}
            sx={{ mt: 0.5, maxHeight: 200, overflow: "auto" }}
          >
            {districtSuggestions.map((district, index) => (
              <MenuItem
                key={district}
                selected={index === activeSuggestionIndex}
                onClick={() => {
                  handleDistrictChange(prefIndex, district);
                  setDistrictSuggestions([]);
                }}
                sx={{ fontSize: "0.875rem" }}
              >
                {district}
              </MenuItem>
            ))}
          </Paper>
        )}

        <TextField
          size="small"
          label="Preferred City"
          value={pref.preferredCity || ""}
          onChange={(e) => {
            handleCityChange(prefIndex, e.target.value);
            setCitySuggestions(filterSuggestions(e.target.value, cities));
            setActiveSuggestionIndex(-1);
          }}
          onFocus={() => {
            if (
              pref?.preferredCity &&
              pref.preferredState &&
              pref.preferredDistrict
            ) {
              setCitySuggestions(filterSuggestions(pref.preferredCity, cities));
            }
          }}
          onBlur={() => setTimeout(() => setCitySuggestions([]), 200)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveSuggestionIndex((prev) =>
                Math.min(prev + 1, citySuggestions.length - 1),
              );
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveSuggestionIndex((prev) => Math.max(prev - 1, -1));
            } else if (e.key === "Enter" && activeSuggestionIndex >= 0) {
              e.preventDefault();
              handleCityChange(
                prefIndex,
                citySuggestions[activeSuggestionIndex],
              );
              setCitySuggestions([]);
            }
          }}
          disabled={!editMode || !pref.preferredDistrict}
          fullWidth
          required
          error={editMode && !pref.preferredCity}
          helperText={
            editMode && !pref.preferredCity ? "This field is required" : ""
          }
          sx={{ mt: 2 }}
        />

        {citySuggestions.length > 0 && (
          <Paper
            elevation={3}
            sx={{ mt: 0.5, maxHeight: 200, overflow: "auto" }}
          >
            {citySuggestions.map((city, index) => (
              <MenuItem
                key={city}
                selected={index === activeSuggestionIndex}
                onClick={() => {
                  handleCityChange(prefIndex, city);
                  setCitySuggestions([]);
                }}
                sx={{ fontSize: "0.875rem" }}
              >
                {city}
              </MenuItem>
            ))}
          </Paper>
        )}
      </>
    );
  };

  // Render helpers
  const renderField = (label, key, isReadOnly = false) => {
    const value = investorData[key];
    const isPhoneField = key === "mobileNumber" || key === "whatsappNumber";
    const isReadOnlyField = isReadOnly || key === "country" || key === "email";
    const isOccupationField = key === "occupation";
    const isPincodeField = key === "pincode";
    const isAddressField = key === "address";

    let displayValue = "";
    if (Array.isArray(value)) {
      displayValue = value.join(", ");
    } else if (typeof value === "object" && value !== null) {
      displayValue = JSON.stringify(value);
    } else {
      displayValue = value || "";
    }

    return (
      <Box mb={2}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          {label}
        </Typography>
        {editMode && !isReadOnlyField ? (
          <Box display="flex" alignItems="center">
            {isPhoneField && <Typography sx={{ mr: 1 }}>+91</Typography>}
            {isOccupationField ? (
              <TextField
                select
                fullWidth
                variant="outlined"
                size="small"
                value={value || ""}
                onChange={(e) => {
                  setInvestorData({ ...investorData, [key]: e.target.value });
                  setFieldErrors({ ...fieldErrors, [key]: "" });
                }}
                error={!!fieldErrors[key]}
                helperText={fieldErrors[key]}
                required
              >
                <MenuItem value="Investor">Investor</MenuItem>
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
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            ) : isPincodeField ? (
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={value || ""}
                onChange={(e) => {
                  const input = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setInvestorData({ ...investorData, [key]: input });
                  setFieldErrors({ ...fieldErrors, [key]: "" });
                }}
                error={!!fieldErrors[key]}
                helperText={fieldErrors[key]}
                inputProps={{ maxLength: 6 }}
                required
              />
            ) : isAddressField ? (
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={value || ""}
                onChange={(e) => {
                  setInvestorData({ ...investorData, [key]: e.target.value });
                  setFieldErrors({ ...fieldErrors, [key]: "" });
                }}
                error={!!fieldErrors[key]}
                helperText={fieldErrors[key]}
                required
                multiline
                rows={3}
              />
            ) : (
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={value || ""}
                onChange={(e) => {
                  setInvestorData({ ...investorData, [key]: e.target.value });
                  setFieldErrors({ ...fieldErrors, [key]: "" });
                }}
                error={!!fieldErrors[key]}
                helperText={fieldErrors[key]}
                required={!isPhoneField}
                inputProps={isPhoneField ? { maxLength: 10 } : {}}
              />
            )}
          </Box>
        ) : (
          <Typography
            variant="body1"
            sx={{
              backgroundColor: "#f5f5f5",
              p: 1,
              borderRadius: 1,
              whiteSpace: "pre-wrap",
              minHeight: isAddressField ? "60px" : "auto",
              display: "flex",
              alignItems: isAddressField ? "flex-start" : "center",
            }}
          >
            {isPhoneField ? `+91 ${displayValue}` : displayValue || "-----"}
          </Typography>
        )}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!investorData || Object.keys(investorData).length === 0) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" gutterBottom>
          Unable to load profile. Please try again later.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/loginpage")}
          sx={{ mt: 2 }}
        >
          Back to Login
        </Button>
      </Box>
    );
  }

  const handleOpenSnackbar = () => {
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleConfirm = async () => {
    try {
      setSnackbarOpen(false);

      const response = await axios.patch(
        `http://localhost:5000/api/v1/investor/deleteInvestorProfileImage/${investorUUID}`,
        { removeProfileImage: true },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AccessToken}`,
          },
        },
      );

      if (response.data.success) {
        const updatedData = {
          ...originalData,
          profileImage: "",
        };
        setOriginalData(updatedData);
        setInvestorData(updatedData);
        setAvatarPreview("");
        setAvatarFile(null);
        setIsImageRemoved(true);

        setSnackbar({
          open: true,
          message: "Profile image removed successfully!",
          severity: "success",
        });
      } else {
        throw new Error(
          response.data.message || "Failed to remove profile image",
        );
      }
    } catch (error) {
      console.error("Error removing profile image:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || "Failed to remove profile image",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex" }}>
        <InvestorDashboardLayout />
        <Box px={2} py={4} width="100%">
          <Typography
            variant="h6"
            fontWeight={600}
            mb={3}
            sx={{
              textAlign: "center",
              color: "#ffffff",
              backgroundColor: "#689f38",
              padding: "5px",
              borderRadius: "6px",
            }}
          >
            Manage Profile
          </Typography>

          <Box display="flex" justifyContent="center">
            <Paper
              elevation={4}
              sx={{
                padding: 4,
                borderRadius: 4,
                width: "100%",
                maxWidth: 700,
                position: "relative",
              }}
            >
              {editMode && (
                <IconButton
                  onClick={() => {
                    if (isSubmitting) return;
                    setEditMode(false);
                    setInvestorData(originalData);
                    setAvatarFile(null);
                    setAvatarPreview(originalData.profileImage || "");
                    setIsImageRemoved(false);
                    setImagesizeError("");
                  }}
                  sx={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    color: "text.secondary",
                    "&:hover": {
                      color: "error.main",
                      backgroundColor: "rgba(244, 67, 54, 0.08)",
                    },
                  }}
                  disabled={isSubmitting}
                >
                  <CloseIcon />
                </IconButton>
              )}

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Typography variant="h5" fontWeight={500}>
                  Investor Profile
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={editMode ? <SaveIcon /> : <EditIcon />}
                  onClick={editMode ? handleSave : handleEditToggle}
                  sx={{
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 600,
                    px: 2.5,
                    py: 1,
                  }}
                  disabled={isSubmitting}
                >
                  {editMode ? (isSubmitting ? "Saving..." : "Save") : "Edit"}
                </Button>
              </Box>

              <Box display="flex" alignItems="center" mb={3}>
                {editMode ? (
                  <Box width="100%">
                    <Box display="flex" alignItems="center">
                      {/* Avatar Display */}
                      <Avatar
                        alt="Investor Avatar"
                        src={
                          avatarPreview ||
                          (isImageRemoved ? "" : investorData.profileImage)
                        }
                        sx={{
                          width: 80,
                          height: 80,
                          mx: 2,
                        }}
                      />

                      {/* Action Buttons */}
                      <Box display="flex">
                        {/* Edit Button */}
                        <Box mx={1}>
                          <input
                            id={`avatar-upload-${investorUUID}`}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleAvatarChange}
                            disabled={isSubmitting}
                          />
                          <IconButton
                            component="label"
                            htmlFor={`avatar-upload-${investorUUID}`}
                            size="medium"
                            color="primary"
                            sx={{
                              backgroundColor: "rgba(25, 118, 210, 0.08)",
                              "&:hover": {
                                backgroundColor: "rgba(25, 118, 210, 0.12)",
                              },
                            }}
                            disabled={isSubmitting}
                          >
                            <TbPhotoEdit />
                          </IconButton>
                        </Box>

                        {/* Delete Button - Only show if there's an image to delete */}
                        {(avatarPreview || investorData.profileImage) &&
                          !isImageRemoved && (
                            <Box mx={1}>
                              <IconButton
                                size="medium"
                                color="error"
                                onClick={handleRemoveAvatar}
                                sx={{
                                  backgroundColor: "rgba(244, 67, 54, 0.08)",
                                  "&:hover": {
                                    backgroundColor: "rgba(244, 67, 54, 0.12)",
                                  },
                                }}
                                disabled={isSubmitting}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          )}
                      </Box>

                      <Typography variant="h6" ml={2}>
                        {investorData.investorID}
                      </Typography>
                    </Box>

                    {/* Instruction text */}
                    <Typography
                      variant="caption"
                      display="block"
                      mt={1}
                      ml={2}
                      color="text.secondary"
                    >
                      Click edit icon to change photo (max 50KB)
                    </Typography>

                    {/* Error message */}
                    {imagesizeError && (
                      <Box mt={1} ml={2}>
                        <MuiAlert
                          severity="error"
                          sx={{ width: "fit-content" }}
                        >
                          {imagesizeError}
                        </MuiAlert>
                      </Box>
                    )}
                  </Box>
                ) : (
                  /* View Mode */
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        position: "relative",
                        display: "inline-block",
                        mr: 2,
                      }}
                    >
                      <Avatar
                        alt="Investor Avatar"
                        src={investorData.profileImage}
                        sx={{
                          width: 84,
                          height: 84,
                        }}
                      />
                      {investorData.profileImage && (
                        <CloseIcon
                          onClick={handleOpenSnackbar}
                          sx={{
                            position: "absolute",
                            top: "4px",
                            right: "4px",
                            fontSize: 18,
                            backgroundColor: "#fff",
                            borderRadius: "50%",
                            padding: "2px",
                            cursor: "pointer",
                            boxShadow: 1,
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                              backgroundColor: "#f44336",
                              color: "#fff",
                            },
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="h6">
                      {investorData.investorID}
                    </Typography>
                  </Box>
                )}
              </Box>

              {renderField("First Name", "firstName")}
              {renderField("Email", "email", true)}
              {renderField("Mobile Number", "mobileNumber")}
              {renderField("Whatsapp Number", "whatsappNumber")}
              {renderField("Country", "country", true)}
              {renderField("State", "state")}
              {renderField("City", "city")}
              {renderField("Address", "address")}
              {renderField("Pincode", "pincode")}
              {renderField("Occupation", "occupation")}

              <Box mt={4}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Preferences
                </Typography>

                {(investorData.preferences || []).map((pref, prefIndex) => (
                  <Paper
                    key={pref._id}
                    elevation={2}
                    sx={{
                      p: 2,
                      mb: 3,
                      borderRadius: 2,
                      backgroundColor: "#f9f9f9",
                      position: "relative",
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        Preference #{prefIndex + 1}
                      </Typography>
                      {editMode && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removePreference(prefIndex)}
                          disabled={
                            investorData.preferences.length <= 1 || isSubmitting
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>

                    <Box display="flex" flexDirection="column" gap={1}>
                      {/* Investment Range */}
                      <TextField
                        size="small"
                        label="Investment Range"
                        value={pref.investmentRange || ""}
                        onChange={(e) =>
                          handlePreferenceChange(
                            prefIndex,
                            "investmentRange",
                            e.target.value,
                          )
                        }
                        disabled={!editMode}
                        select
                        required
                        error={editMode && !pref.investmentRange}
                        helperText={
                          editMode && !pref.investmentRange
                            ? "This field is required"
                            : ""
                        }
                      >
                        <MenuItem value="">Select Investment Range</MenuItem>
                        <MenuItem value="having amount">
                          Having Investment Amount Ready
                        </MenuItem>
                        <MenuItem value="take loan">
                          Planning to take a Loan
                        </MenuItem>
                        <MenuItem value="need loan">
                          Need Loan Assistance
                        </MenuItem>
                      </TextField>

                      {/* Investment Amount */}
                      <TextField
                        size="small"
                        label="Investment Amount"
                        value={pref.investmentAmount || ""}
                        onChange={(e) =>
                          handlePreferenceChange(
                            prefIndex,
                            "investmentAmount",
                            e.target.value,
                          )
                        }
                        disabled={!editMode}
                        select
                        required
                        error={editMode && !pref.investmentAmount}
                        helperText={
                          editMode && !pref.investmentAmount
                            ? "This field is required"
                            : ""
                        }
                      >
                        <MenuItem value="">Select Investment Amount</MenuItem>
                        <MenuItem value="Below - 50,000">
                          Below - Rs.50 K
                        </MenuItem>
                        <MenuItem value="Rs. 50,000 - 2 L">
                          Rs.50 K - 2 L
                        </MenuItem>
                        <MenuItem value="Rs. 2 L - 5 L">Rs.2 L - 5 L</MenuItem>
                        <MenuItem value="Rs. 5 L - 10 L">
                          Rs.5 L - 10 L
                        </MenuItem>
                        <MenuItem value="Rs. 10 L - 20 L">
                          Rs.10 L - 20 L
                        </MenuItem>
                        <MenuItem value="Rs. 20 L - 30 L">
                          Rs.20 L - 30 L
                        </MenuItem>
                        <MenuItem value="Rs. 30 L - 50 L">
                          Rs.30 L - 50 L
                        </MenuItem>
                        <MenuItem value="Rs. 50 L - 1 Cr">
                          Rs.50 L - 1 Cr
                        </MenuItem>
                        <MenuItem value="Rs. 1 Cr - 2 Cr">
                          Rs.1 Cr - 2 Cr
                        </MenuItem>
                        <MenuItem value="Rs. 2 Cr - 5 Cr">
                          Rs.2 Cr - 5 Cr
                        </MenuItem>
                        <MenuItem value="Rs. 5 Cr - Above">
                          Rs.5 Cr - Above
                        </MenuItem>
                      </TextField>

                      {/* Location Type */}
                      <TextField
                        size="small"
                        label="Location Type"
                        value={pref.locationType || ""}
                        onChange={(e) =>
                          handlePreferenceChange(
                            prefIndex,
                            "locationType",
                            e.target.value,
                          )
                        }
                        disabled={!editMode}
                        select
                        fullWidth
                        required
                        error={editMode && !pref.locationType}
                        helperText={
                          editMode && !pref.locationType
                            ? "This field is required"
                            : ""
                        }
                      >
                        <MenuItem value="Domestic">Domestic</MenuItem>
                        <MenuItem value="International">International</MenuItem>
                      </TextField>

                      {/* Location Selection */}
                      {pref.locationType === "Domestic"
                        ? renderDomesticLocationFields(pref, prefIndex)
                        : renderInternationalLocationFields(pref, prefIndex)}

                      {/* Category Selection */}
                      <Box mt={1}>
                        <Typography fontWeight={600} mb={1}>
                          Category
                        </Typography>

                        {pref.category?.map((cat, catIndex) => {
                          const currentIndustryData = industryData[
                            cat.industry
                          ] || { categories: [] };
                          const categories =
                            currentIndustryData.categories || [];

                          return (
                            <Box
                              key={catIndex}
                              display="flex"
                              gap={0.5}
                              alignItems="center"
                              mb={1}
                              sx={{ marginLeft: { xs: "-12px" } }}
                            >
                              {editMode ? (
                                <>
                                  {/* Industry Field */}
                                  <TextField
                                    size="small"
                                    placeholder="Industry"
                                    value={cat.industry || ""}
                                    onChange={async (e) => {
                                      const industryName = e.target.value;

                                      await handleIndustryChange(
                                        prefIndex,
                                        catIndex,
                                        industryName,
                                      );
                                    }}
                                    sx={{ flex: 1 }}
                                    select
                                    required
                                    error={editMode && !cat.industry}
                                    helperText={
                                      editMode && !cat.industry
                                        ? "Required"
                                        : ""
                                    }
                                    disabled={isSubmitting}
                                  >
                                    <MenuItem value="">
                                      Select Industry
                                    </MenuItem>
                                    {allIndustries.map((industry) => (
                                      <MenuItem key={industry} value={industry}>
                                        {industry}
                                      </MenuItem>
                                    ))}
                                  </TextField>

                                  {/* Category Field */}
                                  <TextField
                                    size="small"
                                    placeholder="Category"
                                    value={cat.category || ""}
                                    onChange={(e) =>
                                      handleCategoryChange(
                                        prefIndex,
                                        catIndex,
                                        e.target.value,
                                      )
                                    }
                                    sx={{ flex: 1 }}
                                    select
                                    required
                                    error={editMode && !cat.category}
                                    helperText={
                                      editMode && !cat.category
                                        ? "Required"
                                        : ""
                                    }
                                    disabled={!cat.industry || isSubmitting}
                                  >
                                    <MenuItem value="">
                                      Select Category
                                    </MenuItem>
                                    {categories.map((category) => (
                                      <MenuItem key={category} value={category}>
                                        {category}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                </>
                              ) : (
                                <>
                                  <Typography
                                    sx={{
                                      flex: 1,
                                      bgcolor: "#e0e0e0",
                                      p: 1,
                                      borderRadius: 1,
                                    }}
                                  >
                                    {cat.industry || "N/A"}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      flex: 1,
                                      bgcolor: "#e0e0e0",
                                      p: 1,
                                      borderRadius: 1,
                                    }}
                                  >
                                    {cat.category || "N/A"}
                                  </Typography>
                                </>
                              )}
                            </Box>
                          );
                        })}
                      </Box>

                      {/* Property Preferences */}
                      <Box mt={2}>
                        <Typography fontWeight={600} mb={1}>
                          Property Preferences
                        </Typography>

                        {(pref.propertyPreferred || []).map(
                          (prop, propIndex) => (
                            <Box
                              key={propIndex}
                              mb={2}
                              sx={{
                                p: 2,
                                border: "1px solid #e0e0e0",
                                borderRadius: 1,
                              }}
                            >
                              <Box
                                display="flex"
                                flexDirection="column"
                                gap={1}
                              >
                                {/* Property Type */}
                                <TextField
                                  size="small"
                                  label="Property Type"
                                  value={prop.propertyType || ""}
                                  onChange={(e) =>
                                    handlePropertyPreferenceChange(
                                      prefIndex,
                                      propIndex,
                                      "propertyType",
                                      e.target.value,
                                    )
                                  }
                                  disabled={!editMode}
                                  select
                                  required
                                  error={editMode && !prop.propertyType}
                                  helperText={
                                    editMode && !prop.propertyType
                                      ? "This field is required"
                                      : ""
                                  }
                                >
                                  <MenuItem value="">
                                    Select Property Type
                                  </MenuItem>
                                  <MenuItem value="Own Property">
                                    Own Property
                                  </MenuItem>
                                  <MenuItem value="Rental Property">
                                    Rental Property
                                  </MenuItem>
                                </TextField>

                                {/* Property Size - Only show if property type is Own Property */}
                                {prop.propertyType === "Own Property" && (
                                  <TextField
                                    size="small"
                                    label="Property Size"
                                    value={prop.propertySize || ""}
                                    onChange={(e) =>
                                      handlePropertyPreferenceChange(
                                        prefIndex,
                                        propIndex,
                                        "propertySize",
                                        e.target.value,
                                      )
                                    }
                                    disabled={!editMode}
                                    select
                                    required
                                    error={editMode && !prop.propertySize}
                                    helperText={
                                      editMode && !prop.propertySize
                                        ? "This field is required"
                                        : ""
                                    }
                                  >
                                    <MenuItem value="">
                                      Select Total Area
                                    </MenuItem>
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

                                {/* Location fields */}
                                <TextField
                                  size="small"
                                  label="Country"
                                  value={prop.propertyCountry || ""}
                                  onChange={(e) =>
                                    handlePropertyPreferenceChange(
                                      prefIndex,
                                      propIndex,
                                      "propertyCountry",
                                      e.target.value,
                                    )
                                  }
                                  disabled={!editMode}
                                  select
                                  fullWidth
                                >
                                  <MenuItem value="">Select Country</MenuItem>
                                  {countries.map((country) => (
                                    <MenuItem key={country} value={country}>
                                      {country}
                                    </MenuItem>
                                  ))}
                                </TextField>

                                <TextField
                                  size="small"
                                  label="State"
                                  value={prop.propertyState || ""}
                                  onChange={(e) =>
                                    handlePropertyPreferenceChange(
                                      prefIndex,
                                      propIndex,
                                      "propertyState",
                                      e.target.value,
                                    )
                                  }
                                  disabled={!editMode}
                                  fullWidth
                                />

                                <TextField
                                  size="small"
                                  label="City"
                                  value={prop.propertyCity || ""}
                                  onChange={(e) =>
                                    handlePropertyPreferenceChange(
                                      prefIndex,
                                      propIndex,
                                      "propertyCity",
                                      e.target.value,
                                    )
                                  }
                                  disabled={!editMode}
                                  fullWidth
                                />
                              </Box>
                            </Box>
                          ),
                        )}
                      </Box>
                    </Box>
                  </Paper>
                ))}

                {editMode && (
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addPreference}
                    sx={{ mt: 2 }}
                    disabled={isSubmitting}
                  >
                    Add Preference
                  </Button>
                )}
              </Box>
            </Paper>
          </Box>

          {/* OTP Verification Dialog */}
          <Dialog
            open={otpDialogOpen}
            onClose={() => !requestOTP && setOtpDialogOpen(false)}
            disableEscapeKeyDown={requestOTP}
          >
            <DialogTitle>OTP Verification</DialogTitle>
            <DialogContent>
              {otpStep === 1 && (
                <>
                  <Typography>
                    Please request OTP to verify your email to enable editing.
                  </Typography>
                  {errorMSG && (
                    <Typography color="error" mt={1}>
                      {errorMSG}
                    </Typography>
                  )}
                </>
              )}

              {otpStep === 2 && (
                <>
                  <Typography>Enter the OTP sent to your email:</Typography>
                  <TextField
                    autoFocus
                    fullWidth
                    margin="dense"
                    label="OTP"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      setOtpError("");
                    }}
                    error={!!otpError}
                    helperText={otpError}
                    disabled={requestOTP}
                    inputProps={{ maxLength: 6 }}
                  />
                </>
              )}
            </DialogContent>
            <DialogActions>
              {otpStep === 1 && (
                <Button
                  onClick={handleRequestOtp}
                  disabled={requestOTP}
                  variant="contained"
                >
                  {requestOTP ? "Requesting..." : "Request OTP"}
                </Button>
              )}
              {otpStep === 2 && (
                <>
                  <Button
                    onClick={() => setOtpStep(1)}
                    disabled={requestOTP}
                    variant="outlined"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleOtpVerify}
                    disabled={requestOTP}
                    variant="contained"
                  >
                    {requestOTP ? "Verifying..." : "Verify OTP"}
                  </Button>
                </>
              )}
            </DialogActions>
          </Dialog>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            <MuiAlert
              elevation={6}
              variant="filled"
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              sx={{ width: "100%" }}
            >
              {snackbar.message}
            </MuiAlert>
          </Snackbar>

          {/* Confirmation Dialog for Image Removal */}
          <Dialog open={snackbarOpen} onClose={handleCloseSnackbar}>
            <DialogTitle>Confirm Removal</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to remove your profile image?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseSnackbar} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                color="error"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Removing..." : "Remove"}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default ManageProfile;
