"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Typography,
  StepConnector,
  stepConnectorClasses,
  styled,
  Chip,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Snackbar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Skeleton,
} from "@mui/material";
import { useTheme } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BrandDetails from "./BrandDetails";
import Uploads from "./BrandRegisterUploads";
import {
  validateBrandDetails,
  validateFranchiseDetails,
  validateExpansionLocationDetails,
} from "./BrandRegisterValidation";
import axios from "axios";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircularProgress from "@mui/material/CircularProgress";
import BrandExpansionLocationDetails from "./BrandExpansionLocationDetails";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useDispatch } from "react-redux";
import { showLoading } from "@/Redux/Slices/loadingSlice";
import FranchiseDetails from "./FranchiseDetails";
import MembershipPayments from "@/app/advertisewithus/MembershipPayment";

const FORM_DATA_KEY = "brandRegistrationFormData";
const FORM_STEP_KEY = "brandRegistrationActiveStep";

const steps = [
  "Brand Details",
  "Franchise Details",
  "Expansion Locations",
  "Uploads",
];

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(255,128,0) 0%,rgb(255,165,0) 50%,rgb(255,200,0) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(255,128,0) 0%,rgb(255,165,0) 50%,rgb(255,200,0) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 35,
  height: 35,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(255,128,0) 0%, rgb(255,165,0) 50%, rgb(255,200,0) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(255,128,0) 0%, rgb(255,165,0) 50%, rgb(255,200,0) 100%)",
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {props.icon}
    </ColorlibStepIconRoot>
  );
}

const countries = [
  { code: "IN", name: "India" },
  { code: "US", name: "USA" },
  { code: "GB", name: "UK" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
];

const initialFormData = {
  brandDetails: {
    fullName: "",
    email: "",
    mobileNumber: "",
    whatsappNumber: "",
    companyName: "",
    brandName: "",
    tagLine: "",
    ceoMobile: "",
    ceoEmail: "",
    ceoName: "",
    officeEmail: "",
    officeMobile: "",
    headOfficeAddress: "",
    country: "",
    state: "",
    district: "",
    city: "",
    pincode: "",
    website: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    gstNumber: "",
    pancardNumber: "",
    awardText: [],
  },
  franchiseDetails: {
    brandCategories: {
      groupId: "",
      main: "",
      sub: "",
      child: "",
    },
    brandDescription: "",
    fico: [],
    establishedYear: "",
    franchiseSinceYear: "",
    companyOwnedOutlets: "",
    franchiseOutlets: "",
    totalOutlets: "",
    aidFinancing: "",
    franchiseDevelopment: "",
    consultationOrAssistance: "",
    trainingSupport: "",
    uniqueSellingPoints: [],
    franchiseTags: {
      PrimaryClassifications: [],
      // productServiceTypes: [],
      TargetAudience: [],
      ServiceModel: [],
      PricingValue: [],
      AmbienceExperience: [],
      FeaturesAmenities: [],
      TechnologyIntegration: [],
      SustainabilityEthics: [],
      BusinessOperations: [],
    },
  },

  expansionLocationData: {
    isInternationalExpansion: null,
    currentOutletLocations: {
      domestic: {
        locations: [],
      },
      international: {
        locations: [],
      },
    },
    expansionLocations: {
      domestic: {
        locations: [],
      },
      international: {
        locations: [],
      },
    },
  },

  uploads: {
    franchisePromotionVideo: [],
    pancard: [],
    gstCertificate: [],
    brandLogo: [],
    exteriorOutlet: [],
    interiorOutlet: [],
    awardDoc: [], // Added for awards section
    businessPlan: [], // Added for business plan section
  },
};

const BrandRegisterForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
 
const [formData, setFormData] = useState(initialFormData);
const [activeStep, setActiveStep] = useState(0);

//   const [formData, setFormData] = useState(() => {
//     const savedData = localStorage.getItem(FORM_DATA_KEY);
//     return savedData ? JSON.parse(savedData) : initialFormData;
//   });

  // console.log("Initial Form Data:", formData);


  useEffect(() => {
  if (typeof window === "undefined") return;

  const savedData = localStorage.getItem(FORM_DATA_KEY);
  const savedStep = localStorage.getItem(FORM_STEP_KEY);

  if (savedData) {
    try {
      setFormData(JSON.parse(savedData));
    } catch (e) {
      console.error("Invalid form data in localStorage", e);
    }
  }

  if (savedStep) {
    setActiveStep(Number(savedStep));
  }
}, []);



  const [validationErrors, setValidationErrors] = useState({
    brandDetails: {},
    franchiseDetails: {},
    uploads: {},
  });

//   const [activeStep, setActiveStep] = useState(() => {
//     const savedStep = localStorage.getItem(FORM_STEP_KEY);
//     return savedStep ? parseInt(savedStep) : 0;
//   });

  const [openPreview, setOpenPreview] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // Add loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // State to show AdvertiseWithUs component instead of form
  const [MembershipPayment, setMembershipPayment] = useState(false);

  useEffect(() => {
    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(formData));
    localStorage.setItem(FORM_STEP_KEY, activeStep.toString());
  }, [formData, activeStep]);

  // console.log("Form Data:", formData);
  const validateUploadsDetails = (data, pancardNumbers, gstNumber) => {
    const errors = {};
    // if (data.brandLogo.length === 0) {
    //   errors.brandLogo = "Brand logo is required";
    // }

    // if (data.franchisePromotionVideo.length === 0)
    //   errors.franchisePromotionVideo = "Franchise promotion video is required";

    // if (data.pancard.length === 0) errors.pancard = "PAN card is required";
    // if (data.gstCertificate.length === 0) errors.gstCertificate = "GST certificate is required";

    // // PAN number validation
    // const pancardNumber = String(pancardNumbers || "")
    //   .trim()
    //   .toUpperCase();

    // if (!pancardNumber) {
    //   errors.pancardNumber = "PAN number is required";
    // } else if (pancardNumber.length !== 10) {
    //   errors.pancardNumber = "PAN number must be exactly 10 characters";
    // }

    // if (!data.exteriorOutlet || data.exteriorOutlet.length < 3) {
    //   errors.exteriorOutlet = `Minimum 3 exterior images required (${
    //     data.exteriorOutlet?.length || 0
    //   } uploaded)`;
    // } else if (data.exteriorOutlet.length > 5) {
    //   errors.exteriorOutlet = `Maximum 5 exterior images allowed (${data.exteriorOutlet.length} uploaded)`;
    // }

    // if (!data.interiorOutlet || data.interiorOutlet.length < 3) {
    //   errors.interiorOutlet = `Minimum 3 interior images required (${
    //     data.interiorOutlet?.length || 0
    //   } uploaded)`;
    // } else if (data.interiorOutlet.length > 5) {
    //   errors.interiorOutlet = `Maximum 5 interior images allowed (${data.interiorOutlet.length} uploaded)`;
    // }

    // const gst = String(gstNumber || "")
    //   .trim()
    //   .toUpperCase();

    // if (!gst) {
    //   errors.gstNumber = "GST number is required";
    // } else if (gst.length !== 15) {
    //   errors.gstNumber = "GST number must be 15 characters";
    // }
    // //  else if (!isValidGST(gst)) {
    // //   errors.gstNumber = "Invalid GST number format (Expected: 22AAAAA0000A1Z5)";
    // // }

    return errors;
  };

  const validateStep = useCallback(
    (step) => {
      const errors = {};
      let isValid = true;

      console.log("Validating step:", errors);

      switch (step) {
        case 0:
          errors.brandDetails = validateBrandDetails(
            formData.brandDetails || {}
          );
          isValid = Object.keys(errors.brandDetails).length === 0;
          break;
        case 1:
          errors.franchiseDetails = validateFranchiseDetails(
            formData.franchiseDetails || {}
          );
          isValid = Object.keys(errors.franchiseDetails).length === 0;
          break;
        case 2:
          errors.expansionLocationData = validateExpansionLocationDetails(
            formData.expansionLocationData || {}
          );
          isValid = Object.keys(errors.expansionLocationData).length === 0;
          break;
        case 3:
          errors.uploads = validateUploadsDetails(
            formData.uploads,
            formData.brandDetails.pancardNumber,
            formData.brandDetails.gstNumber
          );
          isValid = Object.keys(errors.uploads).length === 0;
          break;
        default:
          break;
      }

      setValidationErrors(errors);

      if (!isValid) {
        setSnackbar({
          open: true,
          message: "Please fill all required field correctly",
          severity: "error",
        });
      }

      return isValid;
    },
    [formData]
  );

  const handleNext = () => {
    const isValid = validateStep(activeStep);
    if (isValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleHomeClick = () => {
    dispatch(showLoading());
    router.push("/");
  };

  const handleSubmit = async (selectedMembership, selectedListing) => {
    const isValid = validateStep(activeStep);

    if (isValid) {
      try {
        setIsSubmitting(true);
        setSubmitSuccess(false);

        const formDataSend = new FormData();

        // Append brand details
        formDataSend.append(
          "brandDetails",
          JSON.stringify({
            fullName: formData.brandDetails.fullName,
            brandName: formData.brandDetails.brandName,
            ceoEmail: formData.brandDetails.ceoEmail,
            ceoMobile: formData.brandDetails.ceoMobile,
            ceoName: formData.brandDetails.ceoName,
            tagLine: formData.brandDetails.tagLine,
            companyName: formData.brandDetails.companyName,
            email: formData.brandDetails.email,
            mobileNumber: formData.brandDetails.mobileNumber,
            country:
              countries.find((c) => c.code === formData.brandDetails.country)
                ?.name || formData.brandDetails.country,
            whatsappNumber: formData.brandDetails.whatsappNumber,
            officeEmail: formData.brandDetails.officeEmail,
            officeMobile: formData.brandDetails.officeMobile,
            headOfficeAddress: formData.brandDetails.headOfficeAddress,
            state: formData.brandDetails.state,
            district: formData.brandDetails.district,
            city: formData.brandDetails.city,
            pincode: formData.brandDetails.pincode,
            website: formData.brandDetails.website,
            facebook: formData.brandDetails.facebook,
            instagram: formData.brandDetails.instagram,
            linkedin: formData.brandDetails.linkedin,
            gstNumber: formData.brandDetails.gstNumber,
            pancardNumber: formData.brandDetails.pancardNumber,
            awardText: formData.brandDetails.awardText || [], // Include award texts
            paymentPackage: selectedMembership?.tier.toLowerCase(),
            listingPackages: {
              periodMonths: selectedListing?.periodMonths,
              amount: selectedListing?.amount,
            },
          })
        );

        // Append franchise details
        formDataSend.append(
          "franchiseDetails",
          JSON.stringify({
            brandCategories: formData.franchiseDetails.brandCategories,
            brandDescription: formData.franchiseDetails.brandDescription,
            fico: formData.franchiseDetails.fico,
            establishedYear: formData.franchiseDetails.establishedYear,
            franchiseSinceYear: formData.franchiseDetails.franchiseSinceYear,
            companyOwnedOutlets: formData.franchiseDetails.companyOwnedOutlets,
            franchiseOutlets: formData.franchiseDetails.franchiseOutlets,
            totalOutlets: formData.franchiseDetails.totalOutlets,
            aidFinancing: formData.franchiseDetails.aidFinancing,
            franchiseDevelopment:
              formData.franchiseDetails.franchiseDevelopment,
            consultationOrAssistance:
              formData.franchiseDetails.consultationOrAssistance,
            trainingSupport: formData.franchiseDetails.trainingSupport,
            uniqueSellingPoints: formData.franchiseDetails.uniqueSellingPoints,
            franchiseTags: formData.franchiseDetails.franchiseTags,
          })
        );

        // Append expansion location data
        formDataSend.append(
          "expansionLocationData",
          JSON.stringify({
            isInternationalExpansion:
              formData.expansionLocationData.isInternationalExpansion,
            currentOutletLocations:
              formData.expansionLocationData.currentOutletLocations,
            expansionLocations:
              formData.expansionLocationData.expansionLocations,
          })
        );

        // Append all files
        const fileFields = {
          brandLogo: formData.uploads.brandLogo,
          gstCertificate: formData.uploads.gstCertificate,
          pancard: formData.uploads.pancard,
          exteriorOutlet: formData.uploads.exteriorOutlet,
          interiorOutlet: formData.uploads.interiorOutlet,
          franchisePromotionVideo: formData.uploads.franchisePromotionVideo,
          awardDoc: formData.uploads.awardDoc || [], // Include award documents
          businessPlan: formData.uploads.businessPlan,
        };

        Object.entries(fileFields).forEach(([fieldName, files]) => {
          if (files && files.length > 0) {
            files.forEach((file) => {
              formDataSend.append(fieldName, file);
            });
          }
        });

        // console.log("sending form data", formDataSend);

        const response = await axios.post(
          "http://localhost:5000/api/v1/brandlisting/createBrandListing",
          formDataSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200 && response.data) {
          setSubmitSuccess(true);
          setSnackbar({
            open: true,
            message: "Form submitted successfully!",
            severity: "success",
          });

          // console.log("Form data submitted successfully:", response.data);
          localStorage.removeItem(FORM_DATA_KEY);
          localStorage.removeItem(FORM_STEP_KEY);
          setFormData(initialFormData);
          setActiveStep(0);
          setOpenPreview(false);
          setTimeout(() => {
            router.push("/contactus");
          }, 1500);
        } else {
          throw new Error("Submission failed. Please try again.");
        }
      } catch (error) {
        console.error("Submission error:", error);
        setSubmitSuccess(false);
        setSnackbar({
          open: true,
          message:
            error.response?.data?.message ||
            "Submission failed. Please try again.",
          severity: "error",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlepakagesDetails = () => {
    const isValid = validateStep(3); 
    if (isValid) {
      setMembershipPayment(true);
    }
  };

  const handleBrandDetailsChange = (update) => {
    setFormData((prev) => ({
      ...prev,
      brandDetails: {
        ...prev.brandDetails,
        ...update,
      },
    }));
  };

  const handleFranchiseDetailsChange = (updatedData) => {
    setFormData((prev) => ({
      ...prev,
      franchiseDetails: {
        ...prev.franchiseDetails,
        ...updatedData,
      },
    }));
  };

  const handleUploadsChange = (updatedData) => {
    setFormData((prev) => ({
      ...prev,
      uploads: {
        ...prev.uploads,
        ...updatedData,
      },
    }));
  };

  const handleGstNumberChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      brandDetails: {
        ...prev.brandDetails,
        gstNumber: value,
      },
    }));
  };

  const handlePancardNumberChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      brandDetails: {
        ...prev.brandDetails,
        pancardNumber: value,
      },
    }));
  };

  const handlePreviewOpen = () => {
    setOpenPreview(true);
  };

  const handlePreviewClose = () => {
    setOpenPreview(false);
  };

  const handleCancel = () => {
    // Show confirmation dialog
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel? All form data will be lost."
    );

    if (confirmCancel) {
      // Clear local storage
      localStorage.removeItem(FORM_DATA_KEY);
      localStorage.removeItem(FORM_STEP_KEY);

      // Reset form
      setFormData(initialFormData);
      setActiveStep(0);
      setValidationErrors({
        brandDetails: {},
        franchiseDetails: {},
        uploads: {},
      });

      // Show success message
      setSnackbar({
        open: true,
        message: "Form has been cleared",
        severity: "info",
      });

      // Navigate to home page after a short delay
      setTimeout(() => {
        router.push("/"); // Replace "/" with your actual home route
      }, 1000);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <BrandDetails
            data={formData.brandDetails}
            errors={validationErrors.brandDetails}
            onChange={handleBrandDetailsChange}
          />
        );
      case 1:
        return (
          <FranchiseDetails
            data={formData.franchiseDetails}
            errors={validationErrors.franchiseDetails}
            onChange={handleFranchiseDetailsChange}
          />
        );
      case 2:
        return (
          <BrandExpansionLocationDetails
            data={formData.expansionLocationData}
            errors={validationErrors.expansionLocationData || {}}
            onChange={(newData) =>
              setFormData((prev) => ({
                ...prev,
                expansionLocationData: {
                  ...prev.expansionLocationData,
                  ...newData,
                },
              }))
            }
          />
        );
      case 3:
        return (
          <Uploads
            data={formData.uploads}
            errors={validationErrors.uploads}
            onChange={handleUploadsChange}
            gstNumber={formData.brandDetails.gstNumber}
            pancardNumber={formData.brandDetails.pancardNumber}
            awardText={formData.brandDetails.awardText}
            onAwardTextChange={(texts) =>
              handleBrandDetailsChange({ awardText: texts })
            }
            onGstNumberChange={handleGstNumberChange}
            onPancardNumberChange={handlePancardNumberChange}
          />
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  const formatFieldName = (name) => {
    return name
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/Gst/i, "GST")
      .replace(/Pancard/i, "PAN Card");
  };

  const renderPreviewContent = () => {
    const {
      brandDetails = {},
      franchiseDetails = {},
      expansionLocationData = {},
      uploads = {},
    } = formData;

    // Helper function to render file previews
    const renderFilePreviews = (files) => {
      if (!files || !Array.isArray(files) || files.length === 0) {
        return (
          <Typography variant="body2" color="textSecondary">
            No files uploaded
          </Typography>
        );
      }

      return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
          {files.map((file, index) => {
            // Handle case where file is already a URL string
            if (typeof file === "string") {
              const fileName = file.split("/").pop();
              const isImage = fileName.match(/\.(jpeg|jpg|gif|png)$/i);
              const isVideo = fileName.match(/\.(mp4|mov|avi)$/i);

              return (
                <Box key={index} sx={{ width: 150 }}>
                  {isImage ? (
                    <img
                      src={file}
                      loading="lazy"
                      alt={`Preview ${index}`}
                      style={{ width: "100%", height: "auto", borderRadius: 4 }}
                    />
                  ) : isVideo ? (
                    <video controls style={{ width: "100%", borderRadius: 4 }}>
                      <source src={file} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <Paper sx={{ p: 1, textAlign: "center" }}>
                      <Typography variant="caption">{fileName}</Typography>
                    </Paper>
                  )}
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{ display: "block", mt: 0.5 }}
                  >
                    {fileName}
                  </Typography>
                </Box>
              );
            }

            // Handle case where file is a File object
            if (file instanceof File) {
              const url = URL.createObjectURL(file);
              const fileName = file.name;
              const isImage = fileName.match(/\.(jpeg|jpg|gif|png)$/i);
              const isVideo = fileName.match(/\.(mp4|mov|avi)$/i);

              return (
                <Box key={index} sx={{ width: 150 }}>
                  {isImage ? (
                    <img
                      src={url}
                      loading="lazy"
                      alt={`Preview ${index}`}
                      style={{ width: "100%", height: "auto", borderRadius: 4 }}
                    />
                  ) : isVideo ? (
                    <video controls style={{ width: "100%", borderRadius: 4 }}>
                      <source src={url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <Paper sx={{ p: 1, textAlign: "center" }}>
                      <Typography variant="caption">{fileName}</Typography>
                    </Paper>
                  )}
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{ display: "block", mt: 0.5 }}
                  >
                    {fileName}
                  </Typography>
                </Box>
              );
            }

            // Fallback for other cases
            return (
              <Box key={index} sx={{ width: 150 }}>
                <Paper sx={{ p: 1, textAlign: "center" }}>
                  <Typography variant="caption">
                    Unsupported file type
                  </Typography>
                </Paper>
              </Box>
            );
          })}
        </Box>
      );
    };

    // Improved location rendering with proper formatting
    const renderLocationDetails = (location, index) => (
      <Paper key={index} sx={{ p: 2, mb: 2, border: "1px solid #e0e0e0" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2">
              <strong>Country:</strong> {location.country || "Not specified"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2">
              <strong>State:</strong> {location.state || "Not specified"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2">
              <strong>District:</strong> {location.district || "Not specified"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2">
              <strong>City:</strong> {location.city || "Not specified"}
            </Typography>
          </Grid>
          {location.pincode && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2">
                <strong>Pincode:</strong> {location.pincode}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
    );

    const renderExpansionDetails = () => {
      const {
        isInternationalExpansion,
        currentOutletLocations = {},
        expansionLocations = {},
      } = expansionLocationData;

      // Helper function to count locations and sub-items
      const countLocationDetails = (locations) => {
        if (!locations || !Array.isArray(locations))
          return {
            countries: 0,
            states: 0,
            districts: 0,
            cities: 0,
          };

        const countrySet = new Set();
        const stateSet = new Set();
        const districtSet = new Set();
        let cityCount = 0;

        locations.forEach((location) => {
          if (location.country) countrySet.add(location.country);
          if (location.state) stateSet.add(location.state);

          if (location.districts && Array.isArray(location.districts)) {
            location.districts.forEach((district) => {
              if (district.district) districtSet.add(district.district);

              if (district.cities && Array.isArray(district.cities)) {
                cityCount += district.cities.length;
              }
            });
          }

          // Count international states and cities
          if (location.states && Array.isArray(location.states)) {
            location.states.forEach((state) => {
              stateSet.add(state.state || state.name || "Unnamed state");
              if (state.cities && Array.isArray(state.cities)) {
                cityCount += state.cities.length;
              }
            });
          }
        });

        return {
          countries: countrySet.size,
          states: stateSet.size,
          districts: districtSet.size,
          cities: cityCount,
        };
      };

      // Count current locations
      const currentDomesticCounts = countLocationDetails(
        currentOutletLocations?.domestic?.locations || []
      );
      const currentInternationalCounts = countLocationDetails(
        currentOutletLocations?.international?.locations || []
      );

      // Count expansion locations
      const expansionDomesticCounts = countLocationDetails(
        expansionLocations?.domestic?.locations || []
      );
      const expansionInternationalCounts = countLocationDetails(
        expansionLocations?.international?.locations || []
      );

      return (
        <Accordion defaultExpanded sx={{ mb: 3 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="bold" color="#5bb949">
              Expansion & Location Details
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" gutterBottom>
                <strong>International Expansion Planned:</strong>
                {isInternationalExpansion ? " Yes" : " No"}
              </Typography>
            </Box>

            {/* Current Outlet Locations */}
            <Accordion sx={{ mb: 3 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Current Outlet Locations
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {/* Domestic Locations Summary */}
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: "110px" }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Domestic Locations
                      </Typography>
                      <Box>
                        <Typography variant="body2">
                          <strong>Countries:</strong>{" "}
                          {currentDomesticCounts.countries}
                        </Typography>
                        <Typography variant="body2">
                          <strong>States:</strong>{" "}
                          {currentDomesticCounts.states}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Districts:</strong>{" "}
                          {currentDomesticCounts.districts}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Cities:</strong>{" "}
                          {currentDomesticCounts.cities}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>

                  {/* International Locations Summary */}
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: "110px" }}>
                      <Typography variant="subtitle2" gutterBottom>
                        International Locations
                      </Typography>
                      <Box>
                        <Typography variant="body2">
                          <strong>Countries:</strong>{" "}
                          {currentInternationalCounts.countries}
                        </Typography>

                        <Typography variant="body2">
                          <strong>States/Regions:</strong>{" "}
                          {currentInternationalCounts.states}
                        </Typography>

                        <Typography variant="body2">
                          <strong>Cities:</strong>{" "}
                          {currentInternationalCounts.cities}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Expansion Locations */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Planned Expansion Locations
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {/* Domestic Expansion Summary */}
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: "110px" }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Domestic Expansion
                      </Typography>
                      <Box>
                        <Typography variant="body2">
                          <strong>Countries:</strong>{" "}
                          {expansionDomesticCounts.countries}
                        </Typography>
                        <Typography variant="body2">
                          <strong>States:</strong>{" "}
                          {expansionDomesticCounts.states}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Districts:</strong>{" "}
                          {expansionDomesticCounts.districts}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Cities:</strong>{" "}
                          {expansionDomesticCounts.cities}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>

                  {/* International Expansion Summary */}
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: "110px" }}>
                      <Typography variant="subtitle2" gutterBottom>
                        International Expansion
                      </Typography>
                      <Box>
                        <Typography variant="body2">
                          <strong>Countries:</strong>{" "}
                          {expansionInternationalCounts.countries}
                        </Typography>
                        {expansionInternationalCounts.states > 0 && (
                          <Typography variant="body2">
                            <strong>States/Regions:</strong>{" "}
                            {expansionInternationalCounts.states}
                          </Typography>
                        )}
                        {expansionInternationalCounts.cities > 0 && (
                          <Typography variant="body2">
                            <strong>Cities:</strong>{" "}
                            {expansionInternationalCounts.cities}
                          </Typography>
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </AccordionDetails>
        </Accordion>
      );
    };
    // Brand details section
    const renderBrandDetails = () => (
      <Accordion defaultExpanded sx={{ mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" fontWeight="bold" color="#5bb949">
            Brand Details
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small">
              <TableBody>
                {Object.entries(brandDetails).map(([key, value]) => {
                  if (key === "awardText") {
                    return (
                      <TableRow key={key}>
                        <TableCell sx={{ fontWeight: "bold", width: "30%" }}>
                          Awards
                        </TableCell>
                        <TableCell>
                          {value?.length > 0 ? (
                            <Box
                              sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                            >
                              {value.map((award, idx) => (
                                <Chip
                                  key={idx}
                                  label={award}
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          ) : (
                            "None"
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  }

                  if (typeof value !== "object" || value === null) {
                    return (
                      <TableRow key={key}>
                        <TableCell sx={{ fontWeight: "bold", width: "30%" }}>
                          {formatFieldName(key)}
                        </TableCell>
                        <TableCell>{value || "Not provided"}</TableCell>
                      </TableRow>
                    );
                  }
                  return <Skeleton/>;
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    );

    // Franchise details section
    const renderFranchiseDetails = () => (
      <Accordion defaultExpanded sx={{ mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" fontWeight="bold" color="#5bb949">
            Franchise Details
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small">
              <TableBody>
                {Object.entries(franchiseDetails).map(([key, value]) => {
                  if (key === "brandCategories") {
                    return (
                      <TableRow key={key}>
                        <TableCell sx={{ fontWeight: "bold", width: "30%" }}>
                          Brand Categories
                        </TableCell>
                        <TableCell>
                          {value.main && (
                            <Box>
                              <Typography>
                                <strong>Main:</strong> {value.main}
                              </Typography>
                              {value.sub && (
                                <Typography>
                                  <strong>Sub:</strong> {value.sub}
                                </Typography>
                              )}
                              {value.child && (
                                <Typography>
                                  <strong>Child:</strong> {value.child}
                                </Typography>
                              )}
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  }

                  if (key === "fico") {
                    return (
                      <TableRow key={key}>
                        <TableCell sx={{ fontWeight: "bold", width: "30%" }}>
                          FICO Models
                        </TableCell>
                        <TableCell>
                          {value?.length > 0 ? (
                            <Box sx={{ mt: 1 }}>
                              {value.map((model, idx) => (
                                <Accordion key={idx} sx={{ mb: 2 }}>
                                  <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                  >
                                    <Typography>
                                      FICO Model {idx + 1}
                                    </Typography>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <Grid container spacing={2}>
                                      {Object.entries(model).map(
                                        ([field, val]) => (
                                          <Grid item xs={12} sm={6} key={field}>
                                            <Typography variant="body2">
                                              <strong>
                                                {formatFieldName(field)}:
                                              </strong>{" "}
                                              {val || "Not specified"}
                                            </Typography>
                                          </Grid>
                                        )
                                      )}
                                    </Grid>
                                  </AccordionDetails>
                                </Accordion>
                              ))}
                            </Box>
                          ) : (
                            "No FICO models added"
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  }

                  if (typeof value !== "object" || value === null) {
                    return (
                      <TableRow key={key}>
                        <TableCell sx={{ fontWeight: "bold", width: "30%" }}>
                          {formatFieldName(key)}
                        </TableCell>
                        <TableCell>
                          {Array.isArray(value) ? (
                            value.length > 0 ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 1,
                                }}
                              >
                                {value.map((item, idx) => (
                                  <Chip
                                    key={idx}
                                    label={item}
                                    variant="outlined"
                                  />
                                ))}
                              </Box>
                            ) : (
                              "None"
                            )
                          ) : (
                            value || "Not provided"
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  }
                  return <Skeleton/>;
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    );

    // Uploads section
    const renderUploads = () => (
      <Accordion defaultExpanded sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" fontWeight="bold" color="#5bb949">
            Uploads
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableBody>
                {Object.entries(uploads).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell sx={{ fontWeight: "bold", width: "30%" }}>
                      {formatFieldName(key)}
                    </TableCell>
                    <TableCell>{renderFilePreviews(value)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    );

    return (
      <Box sx={{ p: 2 }}>
        {renderBrandDetails()}
        {renderFranchiseDetails()}
        {renderExpansionDetails()}
        {renderUploads()}
      </Box>
    );
  };
  return (
    <>
      {/* If MembershipPayment is true, render AdvertiseWithUs and pass handleSubmit directly */}
      {MembershipPayment ? (
        <MembershipPayments
          handleSubmit={handleSubmit}
          snackbar={snackbar}
          handleCloseSnackbar={handleCloseSnackbar}
          isSubmitting={isSubmitting}
          submitSuccess={submitSuccess}
          setSnackbar={setSnackbar}
          formData={formData}
          onBack={() => setMembershipPayment(false)} // Button to go back to form
        />
      ) : (
        // Otherwise, render the form as normal
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              p: 0,
            }}
          >
            <Box
              sx={{ display: "grid", gridTemplateColumns: "auto 1fr" }}
              mb={1}
              mt={1}
            >
              <Button
                onClick={handleHomeClick}
                sx={{
                  backgroundColor: "#7ad03a",
                  color: "white",
                  height: "40px",
                  pr: 3,
                  pl: 2,
                  py: 0,
                  mt: 2,

                  ml: { md: 6, xs: 3 },
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                  display: "flex", // Ensure flex layout
                  gap: 1, // Adds spacing (theme.spacing(1) = 8px by default)
                  alignItems: "center", // Vertically center items
                  "&:hover": {
                    backgroundColor: "#5db024",
                    transform: "scale(1.05)",
                    boxShadow: "0px 6px 14px rgba(0, 0, 0, 0.2)",
                  },
                  "&:active": {
                    transform: "scale(0.97)",
                  },
                }}
              >
                <HomeOutlinedIcon fontSize="small" /> Home
              </Button>

              {/* Stepper ==> To Navigate The Particular Page */}
              <Stepper
                activeStep={activeStep}
                alternativeLabel
                connector={<ColorlibConnector />}
              >
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      StepIconComponent={ColorlibStepIcon}
                      onClick={() => setActiveStep(index)}
                      sx={{
                        cursor: "pointer",
                        transition: "transform 0.3s ease, color 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.1)",
                          color: "primary.main", // or any custom color
                        },
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                mt: 0,
                overflow: "auto",
              }}
              // maxHeight={"calc(100vh - 200px)"}
            >
              <Box sx={{ p: 2 }}>{getStepContent(activeStep)}</Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                pt: 2,
                pb: 2,
                borderTop: "1px solid #e0e0e0",
              }}
            >
              <Button
                disabled={activeStep === 0 || isSubmitting}
                onClick={handleBack}
                sx={{
                  background:
                    "linear-gradient(to bottom right,rgb(246, 175, 33), #FF9A5A)",
                  border: 0,
                  mr: 2,
                  borderRadius: "12px",
                  color: "black",
                  cursor: "pointer",
                  display: "inline-block",
                  fontFamily:
                    '-apple-system, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                  fontSize: "16px",
                  fontWeight: 500,
                  lineHeight: 0,
                  outline: "transparent",
                  px: "1rem", // padding-left and padding-right
                  py: "0.2rem",
                  textAlign: "center",
                  textDecoration: "none",
                  transition: "box-shadow .2s ease-in-out",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  touchAction: "manipulation",
                  whiteSpace: "nowrap",
                  "&:not([disabled]):focus": {
                    boxShadow:
                      "0 0 .25rem rgba(0, 0, 0, 0.5), -.125rem -.125rem 1rem rgb(246, 175, 33), .125rem .125rem 1rem rgba(255, 154, 90, 0.5)",
                  },
                  "&:not([disabled]):hover": {
                    boxShadow:
                      "0 0 .25rem rgba(0, 0, 0, 0.5), -.125rem -.125rem 1rem rgb(246, 175, 33), .125rem .125rem 1rem rgba(255, 154, 90, 0.5)",
                  },
                }}
              >
                Back
              </Button>

              <Button
                variant="outlined"
                onClick={handlePreviewOpen}
                sx={{
                  backgroundColor: "#7ad03a",
                  borderRadius: "100px",
                  mr: 2,
                  color: "black",
                  fontFamily:
                    "CerebriSans-Regular, -apple-system, system-ui, Roboto, sans-serif",
                  padding: "7px 20px",
                  fontSize: "16px",
                  textTransform: "none", // Prevents uppercase transformation
                  transition: "all 250ms",
                  border: 0,
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  touchAction: "manipulation",
                  "&:hover": {
                    transform: "scale(1.05) rotate(-1deg)",
                    backgroundColor: "#5db024", // Maintain same background on hover
                  },
                  "&:active": {
                    transform: "scale(1) rotate(0deg)", // Reset on click
                  },
                }}
                disabled={isSubmitting}
              >
                Preview
              </Button>

              <Button
                variant="outlined"
                sx={{
                  backgroundColor: "#7ad03a",
                  borderRadius: "100px",

                  mr: 2,
                  color: "black",
                  fontFamily:
                    "CerebriSans-Regular, -apple-system, system-ui, Roboto, sans-serif",
                  padding: "7px 20px",
                  fontSize: "16px",
                  textTransform: "none", // Prevents uppercase transformation
                  transition: "all 250ms",
                  border: 0,
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  touchAction: "manipulation",
                  "&:hover": {
                    transform: "scale(1.05) rotate(-1deg)",
                    backgroundColor: "#5db024", // Maintain same background on hover
                  },
                  "&:active": {
                    transform: "scale(1) rotate(0deg)", // Reset on click
                  },
                }}
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  sx={{
                    background:
                      "linear-gradient(to bottom right,rgb(82, 209, 105),rgb(132, 237, 47))",
                    border: 0,
                    mr: 2,
                    borderRadius: "12px",
                    color: "#FFFFFF",
                    cursor: "pointer",
                    display: "inline-block",
                    fontFamily:
                      '-apple-system, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                    fontSize: "16px",
                    fontWeight: 500,
                    lineHeight: 0,
                    outline: "transparent",
                    px: "1rem", // padding-left and padding-right
                    textAlign: "center",
                    textDecoration: "none",
                    transition: "box-shadow .2s ease-in-out",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    touchAction: "manipulation",
                    whiteSpace: "nowrap",
                    "&:not([disabled]):focus": {
                      boxShadow:
                        "0 0 .25rem rgba(0, 0, 0, 0.5), -.125rem -.125rem 1rem rgb(82, 209, 105), .125rem .125rem 1rem rgba(192, 230, 123, 0.5)",
                    },
                    "&:not([disabled]):hover": {
                      boxShadow:
                        "0 0 .25rem rgba(0, 0, 0, 0.5), -.125rem -.125rem 1rem rgb(82, 209, 105), .125rem .125rem 1rem rgba(175, 203, 122, 0.5)",
                    },
                  }}
                  onClick={handlepakagesDetails}
                  // disabled={isSubmitting}
                  // startIcon={
                  //   isSubmitting ? (
                  //     <CircularProgress size={20} color="inherit" />
                  //   ) : submitSuccess ? (
                  //     <CheckCircleIcon />
                  //   ) : null
                  // }
                  //  {isSubmitting
                  //   ? "Submitting..."
                  //   : submitSuccess
                  //   ? "Submitted!"
                  //   : "Submit"}
                >
                  Go to package details
                </Button>
              ) : (
                <Button
                  variant="contained"
                  sx={{
                    background:
                      "linear-gradient(to bottom right,rgb(246, 175, 33), #FF9A5A)",
                    border: 0,
                    mr: 2,
                    borderRadius: "12px",
                    color: "#FFFFFF",
                    cursor: "pointer",
                    display: "inline-block",
                    fontFamily:
                      '-apple-system, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                    fontSize: "16px",
                    fontWeight: 500,
                    lineHeight: 0,
                    outline: "transparent",
                    px: "1rem", // padding-left and padding-right
                    textAlign: "center",
                    textDecoration: "none",
                    transition: "box-shadow .2s ease-in-out",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    touchAction: "manipulation",
                    whiteSpace: "nowrap",
                    "&:not([disabled]):focus": {
                      boxShadow:
                        "0 0 .25rem rgba(0, 0, 0, 0.5), -.125rem -.125rem 1rem rgb(246, 175, 33), .125rem .125rem 1rem rgba(255, 154, 90, 0.5)",
                    },
                    "&:not([disabled]):hover": {
                      boxShadow:
                        "0 0 .25rem rgba(0, 0, 0, 0.5), -.125rem -.125rem 1rem rgb(246, 175, 33), .125rem .125rem 1rem rgba(255, 154, 90, 0.5)",
                    },
                  }}
                  onClick={handleNext}
                  disabled={isSubmitting}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>

          {/* Preview Dialog */}
          <Dialog
            open={openPreview}
            onClose={handlePreviewClose}
            maxWidth="lg" // Changed from "md" to "lg" for wider view
            fullWidth
            scroll="paper"
            sx={{
              "& .MuiDialog-paper": {
                width: "90%", // Take up 90% of screen width
                maxWidth: "1200px", // Set a maximum width
                height: "90vh", // Take up 90% of viewport height
              },
            }}
          >
            <DialogTitle
              sx={{
                borderBottom: "1px solid #e0e0e0",
                position: "sticky",
                top: 0,
                backgroundColor: "background.paper",
                zIndex: 1,
                color: "#f9a505",
              }}
            >
              Form Data Preview
            </DialogTitle>
            <DialogContent dividers sx={{ overflowY: "auto" }}>
              {renderPreviewContent()}
            </DialogContent>
            <DialogActions
              sx={{
                borderTop: "1px solid #e0e0e0",
                position: "sticky",
                bottom: 0,
                backgroundColor: "background.paper",
                zIndex: 1,
              }}
            >
              {activeStep === steps.length - 1 && (
                <Button
                  variant="contained"
                  onClick={handlepakagesDetails}
                  disabled={isSubmitting}
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : submitSuccess ? (
                      <CheckCircleIcon />
                    ) : null
                  }
                  sx={{
                    background:
                      "linear-gradient(to bottom right,rgb(82, 209, 105),rgb(132, 237, 47))",
                    mr: 1,
                  }}
                >
                  {isSubmitting
                    ? "Submitting..."
                    : submitSuccess
                    ? "Submitted!"
                    : "Submit from Preview"}
                </Button>
              )}
              <Button
                onClick={handlePreviewClose}
                variant="contained"
                color="error"
                disabled={isSubmitting} // Disable close button during submission
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              sx={{ width: "100%" }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      )}
      {/* <Footer /> */}
    </>
  );
};
export default BrandRegisterForm;
