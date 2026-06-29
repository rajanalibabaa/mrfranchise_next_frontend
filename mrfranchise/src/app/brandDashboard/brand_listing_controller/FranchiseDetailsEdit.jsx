"use client";
import React, { useState, useEffect } from "react";

import Chip from "@mui/material/Chip";
import Drawer from "@mui/material/Drawer";
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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Stack from "@mui/material/Stack";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import InputBase from "@mui/material/InputBase";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";


// ✅ Reusable Search Box component to use inside all 3 dropdowns
const DropdownSearchBox = ({ value, onChange, onClear, placeholder, inputRef }) => (
  <Box
    onKeyDown={(e) => e.stopPropagation()}
    onMouseDown={(e) => e.stopPropagation()}
    onClick={(e) => e.stopPropagation()}
    sx={{
      position: "sticky",
      top: 0,
      zIndex: 10,
      bgcolor: "background.paper",
      px: 1.5,
      py: 1,
      borderBottom: "1px solid #f0f0f0",
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        border: "1.5px solid #ff9800",
        borderRadius: "8px",
        px: 1.2,
        py: 0.6,
        gap: 1,
        backgroundColor: "#fff",
      }}
    >
      <SearchIcon sx={{ color: "#ff9800", fontSize: 20, flexShrink: 0 }} />
      <InputBase
        inputRef={inputRef}
        fullWidth
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.stopPropagation()}
        sx={{
          fontSize: "0.9rem",
          flex: 1,
          "& input": { padding: 0 },
        }}
      />
      {value && (
        <Close
          onMouseDown={(e) => {
            e.preventDefault();
            onClear();
          }}
          sx={{
            color: "#aaa",
            fontSize: 18,
            cursor: "pointer",
            flexShrink: 0,
            "&:hover": { color: "#ff9800" },
          }}
        />
      )}
    </Box>
  </Box>
);


const FranchiseDetailsEdit = ({
  data = {},
  errors = {},
  onChange = () => {},
  onArrayChange = () => {},
  onObjectChange = () => {},
  isEditing = false,
}) => {
  // Define fee unit options
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

  // console.log("")

  // State for API data
  const [industriesWithHeadings, setIndustriesWithHeadings] = useState([]); // NEW
  const [industryData, setIndustryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingIndustryDetails, setLoadingIndustryDetails] = useState(false);

  // State for FICO model
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

  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [currentUSP, setCurrentUSP] = useState("");

  // States for product and service tags
  const [showSelectedBar, setShowSelectedBar] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [serviceTagDrawerOpen, setServiceTagDrawerOpen] = useState(false);
  const [tempProductTags, setTempProductTags] = useState([]);
  const [tempServiceTags, setTempServiceTags] = useState([]);
  const [showSelectedServiceTags, setShowSelectedServiceTags] = useState(false);
   const [industrySearch, setIndustrySearch] = useState("");
    const [categorySearch, setCategorySearch] = useState("");
    const [franchiseTypeSearch, setFranchiseTypeSearch] = useState("");
  // Service tag groups will be populated from API data
  const [serviceTagGroups, setServiceTagGroups] = useState({});

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // Fetch industries on component mount
  useEffect(() => {
    fetchIndustries();
    fetchIndustryDetails();
  }, []);

  // Fetch industries list
  const fetchIndustries = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/getIndustryByIndustryName`,
      );
      const result = await response.json();

      if (result.success && result.data?.Industry) {
        setIndustriesWithHeadings(result.data.Industry); // ← Store grouped data
      }
    } catch (error) {
      console.error("Error fetching industries:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch industry details when an industry is selected
  const fetchIndustryDetails = async (industryName) => {
    if (!industryName) return;

    try {
      setLoadingIndustryDetails(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/getIndustryByIndustryName?industry=${encodeURIComponent(industryName)}`,
      );
      const result = await response.json();

      if (result.success && result.data) {
        const apiData = result.data;

        // Normalize categories (extract string values)
        let normalizedCategories = [];
        if (Array.isArray(apiData.categories)) {
          normalizedCategories = apiData.categories
            .map((cat) => cat?.category || cat) // handle both object and string
            .filter(Boolean);
        }

        // Normalize productTags
        const normalizedProductTags = Array.isArray(apiData.productTags)
          ? apiData.productTags
              .map((pt) => ({
                parent: pt?.parent || "",
                tags: Array.isArray(pt?.tags)
                  ? pt.tags.map((t) => t?.tag || t).filter(Boolean)
                  : [],
                id: pt?.id,
              }))
              .filter((pt) => pt.parent)
          : [];

        // Normalize serviceTags
        const normalizedServiceTags = Array.isArray(apiData.serviceTags)
          ? apiData.serviceTags
              .map((st) => ({
                parent: st?.parent || "",
                tags: Array.isArray(st?.tags)
                  ? st.tags.map((t) => t?.tag || t).filter(Boolean)
                  : [],
                id: st?.id,
              }))
              .filter((st) => st.parent)
          : [];

        setIndustryData({
          ...apiData,
          categories: normalizedCategories,
          productTags: normalizedProductTags,
          serviceTags: normalizedServiceTags,
        });

        // Reset selected category
        const newCategory = {
          groupId: "",
          main: apiData.industry || industryName,
          sub: "",
          productTags: [],
          serviceTags: [],
        };

        setSelectedCategory(newCategory);

        onChange({
          brandCategories: { ...newCategory, child: "" },
          franchiseTags: {},
        });
      } else {
        console.error("API returned no data");
        setIndustryData(null);
      }
    } catch (error) {
      console.error("Error fetching industry details:", error);
      setIndustryData(null);
    } finally {
      setLoadingIndustryDetails(false);
    }
  };

  // Initialize selected category from data
  const [selectedCategory, setSelectedCategory] = useState({
    groupId: data.brandCategories?.groupId || "",
    main: data.brandCategories?.main || "",
    sub: data.brandCategories?.sub || "",
    productTags: data.brandCategories?.productTags || [],
    serviceTags: data.brandCategories?.serviceTags || [],
  });

  // Calculate totals for display
  const totalProductTags = selectedCategory.productTags.reduce(
    (acc, curr) => acc + curr.tags.length,
    0,
  );
  const totalServiceTags = selectedCategory.serviceTags.reduce(
    (acc, curr) => acc + curr.tags.length,
    0,
  );

  // Update service tag groups when industry data changes
  useEffect(() => {
    if (industryData && industryData.serviceTags) {
      const groups = {};
      industryData.serviceTags.forEach((serviceTagGroup) => {
        groups[serviceTagGroup.parent] = serviceTagGroup.tags;
      });
      setServiceTagGroups(groups);
    }
  }, [industryData]);

  // Franchise types and models
  const franchiseTypes = {
  "CHANNEL PARTNERS": {
    "CHANNEL PARTNERS": [
      "AUTHORIZED CHANNEL PARTNER",
      "CHANNEL PARTNERS",
      "AREA CHANNEL PARTNERS",
      "CITY CHANNEL PARTNERS",
      "DISTRICT CHANNEL PARTNERS",
      "STATE CHANNEL PARTNERS",
      "IMPLEMENTATION PARTNER",
      "MASTER CHANNEL PARTNER",
      "REFERRAL CHANNEL PARTNER",
      "STRATEGIC ALLIANCE PARTNER",
      "VALUE-ADDED RESELLER (VAR)",
    ],
  },

  "DEALERS & DISTRIBUTORS": {
    "C&F Agent": ["C&F Agent"],

    DEALER: [
      "AUTHORIZED DEALER",
      "DEALER",
      "AREA DEALER",
      "CITY DEALER",
      "DISTRICT DEALER",
      "STATE DEALER",
    ],

    DISTRIBUTOR: [
      "DISTRIBUTOR",
      "AREA DISTRIBUTOR",
      "CITY DISTRIBUTOR",
      "DISTRICT DISTRIBUTOR",
      "STATE DISTRIBUTOR",
      "EXCLUSIVE DISTRIBUTOR",
      "MASTER DISTRIBUTOR",
      "REGIONAL DISTRIBUTOR",
      "RETAIL DISTRIBUTOR",
    ],

    "IMPORTER / EXPORTER": [
      "EXPORTER",
      "IMPORTER",
    ],

    STOCKIST: [
      "STOCKIST",
      "AREA STOCKIST",
      "CITY STOCKIST",
      "DISTRICT STOCKIST",
      "STATE STOCKIST",
      "SUPER STOCKIST",
    ],

    "WHOLESALE SELLER": [
      "WHOLESALE SELLER",
      "AREA WHOLESALE SELLER",
      "CITY WHOLESALE SELLER",
      "DISTRICT WHOLESALE SELLER",
      "STATE WHOLESALE SELLER",
    ],
  },

"FRANCHISE BUSINESS": {
  "CLOUD KITCHEN": ["CLOUD KITCHEN"],

  "COMPANY OWNED COMPANY OPERAT ED (COCO)": [
    "COCO - Area Franchise",
    "COCO - City Franchise",
    "COCO - District Franchise",
    "COCO - Master Franchise",
    "COCO - Multi Unit",
    "COCO - Single Unit",
    "COCO - State Franchise",
  ],

  "COMPANY OWNED FRANCHISE OPERATED (COFO)": [
    "COFO - Area Franchise",
    "COFO - City Franchise",
    "COFO - District Franchise",
    "COFO - Master Franchise",
    "COFO - Multi Unit",
    "COFO - Single Unit",
    "COFO - State Franchise",
  ],

  "FRANCHISE INVESTED COMPANY OPERATED (FICO)": [
    "FICO - Area Franchise",
    "FICO - City Franchise",
    "FICO - District Franchise",
    "FICO - Master Franchise",
    "FICO - Multi Unit",
    "FICO - Single Unit",
    "FICO - State Franchise",
  ],

  "FRANCHISE OWNED COMPANY OPERATED (FOCO)": [
    "FOCO - Area Franchise",
    "FOCO - City Franchise",
    "FOCO - District Franchise",
    "FOCO - Master Franchise",
    "FOCO - Multi Unit",
    "FOCO - Single Unit",
    "FOCO - State Franchise",
  ],

  "FRANCHISE OWNED FRANCHISE OPERATED (FOFO)": [
    "FOFO - Area Franchise",
    "FOFO - City Franchise",
    "FOFO - District Franchise",
    "FOFO - Master Franchise",
    "FOFO - Multi Unit",
    "FOFO - Single Unit",
    "FOFO - State Franchise",
  ],

  KIOSK: ["KIOSK"],

  "SERVICE PARTNERS": [
    "SERVICE PARTNERS",
    "SERVICE PARTNERS - Area Franchise",
    "SERVICE PARTNERS - City Franchise",
    "SERVICE PARTNERS - District Franchise",
    "SERVICE PARTNERS - State Franchise",
  ],

  "SHOP IN SHOP": ["SHOP IN SHOP"],
}
};
  const franchiseModels = [
    "FRANCHISE BUSINESS",
    "DEALERS & DISTRIBUTORS",
    "CHANNEL PARTNERS",
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

  const aidFinancingOptions = ["Yes", "No"];

  // Load edit data when editIndex changes
  useEffect(() => {
    if (editIndex !== null && data.fico && data.fico[editIndex]) {
      const model = data.fico[editIndex];
      setCurrentFicoModel({
        investmentRange: model.investmentRange || "",
        areaRequired: model.areaRequired || "",
        franchiseModel: model.franchiseModel || "",
        franchiseType: model.franchiseType || "",
        franchiseFee: model.franchiseFee?.replace(/[^0-9.]/g, "") || "",
        franchiseFeeUnit: model.franchiseFee?.includes("No Fee")
          ? "No Fee"
          : model.franchiseFee?.match(/%|000|00000/)
            ? model.franchiseFee?.match(/%|000|00000/)[0]
            : "select",
        royaltyFee: model.royaltyFee?.replace(/[^0-9.]/g, "") || "",
        royaltyFeeUnit: model.royaltyFee?.includes("No Fee")
          ? "No Fee"
          : model.royaltyFee?.match(/%|000|00000/)
            ? model.royaltyFee?.match(/%|000|00000/)[0]
            : "select",
        interiorCost: model.interiorCost?.replace(/[^0-9.]/g, "") || "",
        interiorCostUnit: model.interiorCost?.includes("No Fee")
          ? "No Fee"
          : model.interiorCost?.match(/000|00000/)
            ? model.interiorCost?.match(/000|00000/)[0]
            : "select",
        stockInvestment: model.stockInvestment?.replace(/[^0-9.]/g, "") || "",
        stockInvestmentUnit: model.stockInvestment?.includes("No Fee")
          ? "No Fee"
          : model.stockInvestment?.match(/000|00000/)
            ? model.stockInvestment?.match(/000|00000/)[0]
            : "select",
        otherCost: model.otherCost?.replace(/[^0-9.]/g, "") || "",
        otherCostUnit: model.otherCost?.includes("No Fee")
          ? "No Fee"
          : model.otherCost?.match(/000|00000/)
            ? model.otherCost?.match(/000|00000/)[0]
            : "select",
        roi: model.roi?.replace(/[^0-9.]/g, "") || "",
        payBackPeriod: model.payBackPeriod || "",
        breakEven: model.breakEven || "",
        requireWorkingCapital:
          model.requireWorkingCapital?.replace(/[^0-9.]/g, "") || "",
        requireWorkingCapitalUnit: model.requireWorkingCapital?.includes(
          "No Fee",
        )
          ? "No Fee"
          : model.requireWorkingCapital?.match(/000|00000/)
            ? model.requireWorkingCapital?.match(/000|00000/)[0]
            : "select",
        marginOnSales: model.marginOnSales?.replace(/[^0-9.]/g, "") || "",
        agreementPeriod: model.agreementPeriod || "",
      });
      setNoFees({
        franchiseFee: model.franchiseFee?.includes("No Fee") || false,
        interiorCost: model.interiorCost?.includes("No Fee") || false,
        stockInvestment: model.stockInvestment?.includes("No Fee") || false,
        otherCost: model.otherCost?.includes("No Fee") || false,
        requireWorkingCapital:
          model.requireWorkingCapital?.includes("No Fee") || false,
        royaltyFee: model.royaltyFee?.includes("No Fee") || false,
        roi: model.roi?.includes("No Fee") || false,
      });
    }
  }, [editIndex, data.fico]);

  // Handlers for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
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
      onChange(name, value);
      onChange("totalOutlets", total.toString());
    } else {
      onChange(name, value);
    }
  };

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
          updated.payBackPeriod = `${years} year${
            years !== 1 ? "s" : ""
          } ${months} month${months !== 1 ? "s" : ""}`;
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

  const handleNoFeeToggle = (field) => (event) => {
    const checked = event.target.checked;
    setNoFees((prev) => ({
      ...prev,
      [field]: checked,
    }));
    setCurrentFicoModel((prev) => {
      const newValue = checked ? "No Fee" : "";
      const newUnit = checked ? "No Fee" : "select";
      if (field === "roi") {
        let payBackPeriod = "";
        if (!checked && newValue && !isNaN(parseFloat(newValue))) {
          const roiValue = parseFloat(newValue);
          if (roiValue > 0) {
            const totalMonths = (100 / roiValue) * 12;
            const years = Math.floor(totalMonths / 12);
            const months = Math.round(totalMonths % 12);
            payBackPeriod = `${years} year${
              years !== 1 ? "s" : ""
            } ${months} Month${months !== 1 ? "s" : ""}`;
          }
        }
        return {
          ...prev,
          [field]: newValue,
          [`${field}Unit`]: newUnit,
          payBackPeriod: payBackPeriod,
        };
      }
      return {
        ...prev,
        [field]: newValue,
        [`${field}Unit`]: newUnit,
      };
    });
  };

  // Validate FICO model
  const validateFicoModel = () => {
    const requiredFields = [
      "investmentRange",
      "areaRequired",
      "franchiseModel",
      "franchiseType",
      "agreementPeriod",
      "breakEven",
      "marginOnSales",
    ];
    for (const field of requiredFields) {
      if (!currentFicoModel[field]) {
        return `Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`;
      }
    }
    const feeUnitsToCheck = [
      "franchiseFeeUnit",
      "royaltyFeeUnit",
      "interiorCostUnit",
      "stockInvestmentUnit",
      "otherCostUnit",
      "requireWorkingCapitalUnit",
    ];
    for (const unit of feeUnitsToCheck) {
      const fieldName = unit.replace("Unit", "");
      if (currentFicoModel[unit] === "select" && !noFees[fieldName]) {
        const displayName = fieldName.replace(/([A-Z])/g, " $1").toLowerCase();
        return `Please select a unit for ${displayName} or mark as "No Fee"`;
      }
    }
    const feeFields = [
      "franchiseFee",
      "royaltyFee",
      "interiorCost",
      "stockInvestment",
      "otherCost",
      "requireWorkingCapital",
      "roi",
      "payBackPeriod",
    ];
    for (const field of feeFields) {
      if (
        !currentFicoModel[field] &&
        !noFees[field] &&
        field !== "payBackPeriod"
      ) {
        return `Please fill in ${field
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()} or mark as "No Fee"`;
      }
    }
    return null;
  };

  // Add or update FICO model
  const handleAddOrUpdateFicoModel = () => {
    const validationError = validateFicoModel();
    if (validationError) {
      alert(validationError);
      return;
    }

    const formattedFicoModel = {
      ...currentFicoModel,
      franchiseFee: noFees.franchiseFee
        ? "No Fee"
        : `${currentFicoModel.franchiseFee}${
            currentFicoModel.franchiseFeeUnit === "No Fee"
              ? ""
              : currentFicoModel.franchiseFeeUnit
          }`,
      royaltyFee: noFees.royaltyFee
        ? "No Fee"
        : `${currentFicoModel.royaltyFee}${
            currentFicoModel.royaltyFeeUnit === "No Fee"
              ? ""
              : currentFicoModel.royaltyFeeUnit
          }`,
      interiorCost: noFees.interiorCost
        ? "No Fee"
        : `${currentFicoModel.interiorCost}${
            currentFicoModel.interiorCostUnit === "No Fee"
              ? ""
              : currentFicoModel.interiorCostUnit
          }`,
      stockInvestment: noFees.stockInvestment
        ? "No Fee"
        : `${currentFicoModel.stockInvestment}${
            currentFicoModel.stockInvestmentUnit === "No Fee"
              ? ""
              : currentFicoModel.stockInvestmentUnit
          }`,
      otherCost: noFees.otherCost
        ? "No Fee"
        : `${currentFicoModel.otherCost}${
            currentFicoModel.otherCostUnit === "No Fee"
              ? ""
              : currentFicoModel.otherCostUnit
          }`,
      requireWorkingCapital: noFees.requireWorkingCapital
        ? "No Fee"
        : `${currentFicoModel.requireWorkingCapital}${
            currentFicoModel.requireWorkingCapitalUnit === "No Fee"
              ? ""
              : currentFicoModel.requireWorkingCapitalUnit
          }`,
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

    onArrayChange("fico", updatedFico);
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
    onArrayChange("fico", updatedFico);
    setConfirmDeleteOpen(false);
    setDeleteIndex(null);
  };

  const resetFicoForm = () => {
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
    setEditIndex(null);
  };

  const handleCancelEdit = () => {
    resetFicoForm();
    setEditIndex(null);
  };

  // Handlers for brand categories
  const handleMainCategoryChange = (e) => {
    const selectedIndustry = e.target.value;
    console.log("Selected Industry:", selectedIndustry); // Debugging line

    if (!selectedIndustry) return;

    fetchIndustryDetails(selectedIndustry); // ← Fetch details for the actual industry

    const newCategory = {
      groupId: "",
      main: selectedIndustry,
      sub: "",
      productTags: [],
      serviceTags: [],
    };

    setSelectedCategory(newCategory);
    setTempProductTags([]);
    setTempServiceTags([]);
    setServiceTagGroups({});

    onChange({
      brandCategories: { ...newCategory, child: "" },
      franchiseTags: {},
    });

    if (errors.mainCategory) errors.mainCategory = "";
  };

  const handleSubCategoryChange = (e) => {
    const subCategory = e.target.value;

    const newCategory = {
      groupId: "",
      main: selectedCategory.main,
      sub: subCategory,
      productTags: selectedCategory.productTags,
      serviceTags: selectedCategory.serviceTags,
    };
    setSelectedCategory(newCategory);

    // Transform existing data for validation
    const allProductTags = selectedCategory.productTags.flatMap((g) => g.tags);
    const childString = allProductTags.join(", ");

    const franchiseTags = {};
    selectedCategory.serviceTags.forEach(({ parent, tags }) => {
      const key = Object.keys(reverseMap).find((k) => reverseMap[k] === parent);
      if (key) {
        franchiseTags[key] = tags;
      }
    });

    onChange({
      brandCategories: {
        ...newCategory,
        child: childString,
      },
      franchiseTags: franchiseTags,
    });

    errors.subCategory = "";
  };

  // Drawer handlers for product tags
  const handleOpenDrawer = () => {
    if (!selectedCategory.sub || !selectedCategory.main) return;
    setTempProductTags(selectedCategory.productTags || []);
    setDrawerOpen(true);
  };

  const handleChildToggle = (parent, child) => {
    setTempProductTags((prev) => {
      let newPrev = [...prev];
      let group = newPrev.find((g) => g.parent === parent);
      let newTags;
      if (group) {
        newTags = [...group.tags];
        const idx = newTags.indexOf(child);
        if (idx > -1) {
          newTags.splice(idx, 1);
        } else {
          newTags.push(child);
        }
        const groupIndex = newPrev.findIndex((g) => g.parent === parent);
        newPrev[groupIndex] = { ...group, tags: newTags };
      } else {
        newTags = [child];
        newPrev.push({ parent, tags: newTags });
      }
      if (newTags.length === 0 && group) {
        newPrev = newPrev.filter((g) => g.parent !== parent);
      }
      return newPrev;
    });
  };

  const handleDone = () => {
    const updatedProductTags = tempProductTags.filter((g) => g.tags.length > 0);
    const newCategory = {
      ...selectedCategory,
      productTags: updatedProductTags,
    };
    setSelectedCategory(newCategory);
    onObjectChange("brandCategories", newCategory);
    setDrawerOpen(false);
  };

  // Drawer handlers for service tags
  const handleOpenServiceTagDrawer = () => {
    setTempServiceTags(selectedCategory.serviceTags || []);
    setServiceTagDrawerOpen(true);
  };

  const handleServiceTagToggle = (parent, tag) => {
    setTempServiceTags((prev) => {
      let newPrev = [...prev];
      let group = newPrev.find((g) => g.parent === parent);
      let newTags;
      if (group) {
        newTags = [...group.tags];
        const idx = newTags.indexOf(tag);
        if (idx > -1) {
          newTags.splice(idx, 1);
        } else {
          newTags.push(tag);
        }
        const groupIndex = newPrev.findIndex((g) => g.parent === parent);
        newPrev[groupIndex] = { ...group, tags: newTags };
      } else {
        newTags = [tag];
        newPrev.push({ parent, tags: newTags });
      }
      if (newTags.length === 0 && group) {
        newPrev = newPrev.filter((g) => g.parent !== parent);
      }
      return newPrev;
    });
  };

  const handleServiceTagDone = () => {
    const updatedServiceTags = tempServiceTags.filter((g) => g.tags.length > 0);
    const newCategory = {
      ...selectedCategory,
      serviceTags: updatedServiceTags,
    };
    setSelectedCategory(newCategory);
    onObjectChange("brandCategories", newCategory);
    setServiceTagDrawerOpen(false);
  };

  // Handlers for USP and description
  const handleDescriptionChange = (e) => {
    onChange("brandDescription", e.target.value);
  };

  const handleAddUSP = () => {
    const trimmedUSP = currentUSP.trim();
    if (!trimmedUSP) return;
    const existingUSPs = (data.uniqueSellingPoints || []).map((usp) =>
      usp.toLowerCase().trim(),
    );
    if (existingUSPs.includes(trimmedUSP.toLowerCase())) {
      return;
    }
    const updatedUSPs = [...(data.uniqueSellingPoints || []), trimmedUSP];
    onArrayChange("uniqueSellingPoints", updatedUSPs);
    setCurrentUSP("");
  };

  const handleRemoveUSP = (index) => {
    const updatedUSPs = [...(data.uniqueSellingPoints || [])];
    updatedUSPs.splice(index, 1);
    onArrayChange("uniqueSellingPoints", updatedUSPs);
  };

  const handleTrainingSupportChange = (option, checked) => {
    const newValue = checked
      ? [...(data.trainingSupport || []), option]
      : (data.trainingSupport || []).filter((v) => v !== option);
    onArrayChange("trainingSupport", newValue);
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    return value !== "No Fee" ? `${value}.Rs` : value;
  };

  return (
    <Box sx={{ pr: 1, mr: { sm: 0, md: 10 }, ml: { sm: 0, md: 10 } }}>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this franchise model?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Brand Categories Section */}
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ mb: 3, color: "#ff9800" }}
      >
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
          <FormControl
            fullWidth
            size="medium"
            error={Boolean(errors.mainCategory)}
          >
            <InputLabel id="industries-label">Industries</InputLabel>
              <Select
              labelId="industries-label"
              id="industries-select"
              value={selectedCategory.main || ""}
              label="Industries"
              onChange={handleMainCategoryChange}
              sx={{ minHeight: 56 }}
              MenuProps={{
                PaperProps: { sx: { maxHeight: 400 } },
                disableAutoFocusItem: true,
              }}
              disabled={loading}
              onClose={() => setIndustrySearch("")}
            >
              {/* ✅ Search Box */}
              <DropdownSearchBox
                value={industrySearch}
                onChange={setIndustrySearch}
                onClear={() => setIndustrySearch("")}
                placeholder="Search industries…"
              />
            
              {/* Menu Items */}
              {loading ? (
                <MenuItem value="" disabled>Loading industries...</MenuItem>
              ) : industriesWithHeadings.length === 0 ? (
                <MenuItem value="" disabled>No industries available</MenuItem>
              ) : (
                (() => {
                  const lower = industrySearch.toLowerCase().trim();
                  const filtered = industriesWithHeadings.flatMap((group, groupIndex) => {
                    const matchedIndustries = (group.industries || []).filter(
                      (name) => name.toLowerCase().includes(lower)
                    );
                    if (lower && matchedIndustries.length === 0) return [];
                    return [
                      <MenuItem
                        key={`heading-${groupIndex}`}
                        sx={{
                          fontWeight: 700,
                          backgroundColor: "#f8f8f8",
                          color: "#ff9800",
                          fontSize: "0.75rem",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          textAlign: "center",
                          justifyContent: "center",
                          pointerEvents: "none",
                          cursor: "default",
                          mt: groupIndex > 0 ? 1 : 0,
                          opacity: 1,
                        }}
                      >
                        {group.heading}
                      </MenuItem>,
                      ...matchedIndustries.map((industryName, idx) => (
                        <MenuItem
                          key={`industry-${groupIndex}-${idx}`}
                          value={industryName}
                          sx={{ pl: 3 }}
                        >
                          {/* ✅ Highlight matched text */}
                          {lower ? (() => {
                            const i = industryName.toLowerCase().indexOf(lower);
                            if (i === -1) return industryName;
                            return (
                              <>
                                {industryName.slice(0, i)}
                                <span style={{ fontWeight: 700, color: "#ff9800" }}>
                                  {industryName.slice(i, i + lower.length)}
                                </span>
                                {industryName.slice(i + lower.length)}
                              </>
                            );
                          })() : industryName}
                        </MenuItem>
                      )),
                    ];
                  });
                  return filtered.length > 0 ? filtered : (
                    <MenuItem disabled>
                      <Typography variant="body2" color="text.secondary">No results found</Typography>
                    </MenuItem>
                  );
                })()
              )}
            </Select>
            {errors.mainCategory && (
              <FormHelperText error>{errors.mainCategory}</FormHelperText>
            )}
          </FormControl>
        </Grid>
       <Grid item xs={12} sm={4}>
                <FormControl
                  fullWidth
                  size="medium"
                  error={Boolean(errors.subCategory)}
                >
                  <InputLabel id="main-cat-label">Main Category</InputLabel>
                  <Select
  value={selectedCategory.sub || ""}
  label="Main Category"
  onChange={handleSubCategoryChange}
  disabled={!selectedCategory.main || loadingIndustryDetails}
  MenuProps={{
    PaperProps: { sx: { maxHeight: 400 } },
    disableAutoFocusItem: true,
  }}
  onClose={() => setCategorySearch("")}
>
  {/* ✅ Search Box */}
  <DropdownSearchBox
    value={categorySearch}
    onChange={setCategorySearch}
    onClear={() => setCategorySearch("")}
    placeholder="Search categories…"
  />

  {loadingIndustryDetails ? (
    <MenuItem value="" disabled>Loading categories...</MenuItem>
  ) : !industryData?.categories?.length ? (
    <MenuItem value="" disabled>No categories available</MenuItem>
  ) : (
    (() => {
      const lower = categorySearch.toLowerCase().trim();
      const filtered = industryData.categories.filter((cat) =>
        cat.toLowerCase().includes(lower)
      );
      return filtered.length > 0 ? (
        filtered.map((category, index) => (
          <MenuItem key={`${category}-${index}`} value={category}>
            {lower ? (() => {
              const i = category.toLowerCase().indexOf(lower);
              if (i === -1) return category;
              return (
                <>
                  {category.slice(0, i)}
                  <span style={{ fontWeight: 700, color: "#ff9800" }}>
                    {category.slice(i, i + lower.length)}
                  </span>
                  {category.slice(i + lower.length)}
                </>
              );
            })() : category}
          </MenuItem>
        ))
      ) : (
        <MenuItem disabled>
          <Typography variant="body2" color="text.secondary">No results found</Typography>
        </MenuItem>
      );
    })()
  )}
</Select>
                  {errors.subCategory && (
                    <FormHelperText error>{errors.subCategory}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            id="sub-cat-button"
            variant="outlined"
            onClick={handleOpenDrawer}
            disabled={!isEditing || !selectedCategory.sub}
            error={Boolean(errors.productTags)}
            sx={{
              height: 56,
              color: errors.productTags ? "error.main" : "#ff9800",
              borderColor: errors.productTags ? "error.main" : "inherit",
              width: "100%",
              justifyContent: "flex-start",
              textTransform: "none",
            }}
          >
            <AddIcon sx={{ mr: 1 }} />{" "}
            {totalProductTags
              ? `${totalProductTags} Tags selected`
              : " Select Product Tags"}
          </Button>
          {errors.productTags && (
            <FormHelperText error>{errors.productTags}</FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} md={3}>
          <Button
            id="service-tag-button"
            variant="outlined"
            onClick={handleOpenServiceTagDrawer}
            disabled={!isEditing || !selectedCategory.sub}
            error={Boolean(errors.serviceTags)}
            sx={{
              color: errors.serviceTags ? "error.main" : "#ff9800",
              borderColor: errors.serviceTags ? "error.main" : "inherit",
              height: 56,
              width: "100%",
              justifyContent: "flex-start",
              textTransform: "none",
            }}
          >
            <AddIcon sx={{ mr: 1 }} />{" "}
            {totalServiceTags
              ? `${totalServiceTags} Tags selected`
              : "Select Service Tags"}
          </Button>
          {errors.serviceTags && (
            <FormHelperText error>{errors.serviceTags}</FormHelperText>
          )}
        </Grid>
      </Grid>

      {/* View Selected Product Tags Section */}
      {!!totalProductTags && (
        <Box sx={{ mt: 2, width: "100%" }}>
          <Box
            onClick={() => setShowSelectedBar((v) => !v)}
            sx={{
              px: 2,
              py: 1,
              mb: 3,
              bgcolor: "grey.100",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              View Selected Product Tags
            </Typography>
            {showSelectedBar ? <ExpandLess /> : <ExpandMore />}
          </Box>
          <Collapse in={showSelectedBar}>
            <Box sx={{ px: 2, py: 2 }}>
              {selectedCategory.productTags.map(
                ({ parent, tags }) =>
                  tags.length > 0 && (
                    <Box key={parent} sx={{ mb: 2 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        sx={{ color: "#ff9800", mb: 1 }}
                      >
                        {parent}:
                      </Typography>
                      <Stack direction="row" flexWrap="wrap" gap={1}>
                        {tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    </Box>
                  ),
              )}
            </Box>
          </Collapse>
        </Box>
      )}

      {/* View Selected Service Tags Section */}
      {!!totalServiceTags && (
        <Box sx={{ mt: 2, width: "100%" }}>
          <Box
            onClick={() => setShowSelectedServiceTags((v) => !v)}
            sx={{
              px: 2,
              py: 1,
              mb: 3,
              bgcolor: "grey.100",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              View Selected Service Tags
            </Typography>
            {showSelectedServiceTags ? <ExpandLess /> : <ExpandMore />}
          </Box>
          <Collapse in={showSelectedServiceTags}>
            <Box sx={{ px: 2, py: 2 }}>
              {selectedCategory.serviceTags.map(
                ({ parent, tags }) =>
                  tags.length > 0 && (
                    <Box key={parent} sx={{ mb: 2 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        sx={{ color: "#ff9800", mb: 1 }}
                      >
                        {parent}:
                      </Typography>
                      <Stack direction="row" flexWrap="wrap" gap={1}>
                        {tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    </Box>
                  ),
              )}
            </Box>
          </Collapse>
        </Box>
      )}

      {/* Drawer for Product Tags */}
      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { height: "95vh" } }}
      >
        <AppBar position="sticky" color="default" elevation={1}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ color: "#ff9800" }}>
              All Product Tags - Browse All Categories
            </Typography>
            <IconButton aria-label="close" onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 2, overflowY: "auto", height: "calc(80vh - 64px)" }}>
          {industryData && industryData.productTags ? (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: "#ff9800",
                  borderBottom: "2px solid #ff9800",
                  pb: 1,
                }}
              >
                {selectedCategory.main} - {selectedCategory.sub}
              </Typography>
              {industryData.productTags
                .filter((pt) => pt.parent)
                .map((productTagGroup) => (
                  <Box key={productTagGroup.parent} sx={{ mb: 3, ml: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: "text.primary",
                        borderBottom: "1px solid #e0e0e0",
                        pb: 0.5,
                      }}
                    >
                      {productTagGroup.parent}
                    </Typography>
                    <Grid container spacing={1} sx={{ ml: 1 }}>
                      {productTagGroup.tags?.map((tag) => {
                        const isChecked =
                          tempProductTags
                            .find((g) => g.parent === productTagGroup.parent)
                            ?.tags.includes(tag) || false;
                        return (
                          <Grid item xs={12} sm={6} md={4} lg={3} key={tag}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={isChecked}
                                  onChange={() =>
                                    handleChildToggle(
                                      productTagGroup.parent,
                                      tag,
                                    )
                                  }
                                  color="primary"
                                />
                              }
                              label={tag}
                              sx={{
                                width: "100%",
                                "& .MuiFormControlLabel-label": {
                                  fontSize: "0.9rem",
                                },
                              }}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                ))}
            </Box>
          ) : (
            <Typography sx={{ textAlign: "center", py: 4 }}>
              No product tags available. Please select a main category first.
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            p: 2,
            bgcolor: "background.paper",
            borderTop: "1px solid rgba(0,0,0,0.12)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body1" fontWeight={500}>
            {tempProductTags.reduce((acc, g) => acc + g.tags.length, 0)} tag(s)
            selected
          </Typography>
          <Box>
            <Button
              onClick={() => setDrawerOpen(false)}
              sx={{ mr: 2 }}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleDone}
              sx={{ backgroundColor: "#ff9800", color: "#fff" }}
            >
              Done
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Drawer for Service Tags */}
      <Drawer
        anchor="top"
        open={serviceTagDrawerOpen}
        onClose={() => setServiceTagDrawerOpen(false)}
        PaperProps={{ sx: { height: "95vh" } }}
      >
        <AppBar position="sticky" color="default" elevation={1}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ color: "#ff9800" }}>
              All Service Tags
            </Typography>
            <IconButton
              aria-label="close"
              onClick={() => setServiceTagDrawerOpen(false)}
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 2, overflowY: "auto", height: "calc(80vh - 64px)" }}>
          {Object.entries(serviceTagGroups).length > 0 ? (
            Object.entries(serviceTagGroups).map(([groupLabel, options]) => (
              <Box key={groupLabel} sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, mb: 1, color: "#ff9800" }}
                >
                  {groupLabel}
                </Typography>
                <Grid container spacing={1}>
                  {options.map((opt) => {
                    const isChecked =
                      tempServiceTags
                        .find((g) => g.parent === groupLabel)
                        ?.tags.includes(opt) || false;
                    return (
                      <Grid item xs={12} sm={6} md={3} key={opt}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isChecked}
                              onChange={() =>
                                handleServiceTagToggle(groupLabel, opt)
                              }
                              color="primary"
                            />
                          }
                          label={<Typography variant="body2">{opt}</Typography>}
                          sx={{
                            width: "100%",
                            margin: 0,
                            "& .MuiFormControlLabel-label": {
                              width: "100%",
                            },
                          }}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            ))
          ) : (
            <Typography sx={{ textAlign: "center", py: 4 }}>
              No service tags available. Please select an industry first.
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            p: 2,
            bgcolor: "background.paper",
            borderTop: "1px solid rgba(0,0,0,0.12)",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography>
            {tempServiceTags.reduce((acc, g) => acc + g.tags.length, 0)} tag(s)
            selected
          </Typography>
          <Box>
            <Button
              onClick={() => setServiceTagDrawerOpen(false)}
              sx={{ mr: 2 }}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleServiceTagDone}
              sx={{ backgroundColor: "#ff9800", color: "#fff" }}
            >
              Done
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Establishment & Franchise year Details */}
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ mb: 3, color: "#ff9800" }}
      >
        Establishment & Franchise year Details
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "repeat(4, 1fr)", xs: "1fr" },
        }}
      >
        <Grid item xs={12} sm={6} md={2.4}>
          <Autocomplete
            freeSolo
            options={Array.from({ length: 226 }, (_, i) =>
              String(new Date().getFullYear() - i),
            )}
            value={data.establishedYear ? String(data.establishedYear) : null}
            getOptionLabel={(option) => option}
            onChange={(event, newValue) => {
              onChange("establishedYear", newValue ? Number(newValue) : "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Year Commenced Operations"
                variant="outlined"
                size="medium"
                required
                error={!!errors.establishedYear}
                helperText={
                  errors.establishedYear && (
                    <Typography variant="caption" color="error">
                      {errors.establishedYear}
                    </Typography>
                  )
                }
                inputProps={{
                  ...params.inputProps,
                  type: "number",
                  min: new Date().getFullYear() - 225,
                  max: new Date().getFullYear(),
                  readOnly: !isEditing,
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
                    padding: "4px",
                  },
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
                  justifyContent: "center",
                }}
              >
                {option}
              </MenuItem>
            )}
            disabled={!isEditing}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Autocomplete
            freeSolo
            options={Array.from({ length: 226 }, (_, i) =>
              String(new Date().getFullYear() - i),
            )}
            value={
              data.franchiseSinceYear ? String(data.franchiseSinceYear) : null
            }
            getOptionLabel={(option) => option}
            onChange={(event, newValue) => {
              onChange("franchiseSinceYear", newValue ? Number(newValue) : "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Year Commenced Franchising"
                variant="outlined"
                size="medium"
                required
                error={!!errors.franchiseSinceYear}
                helperText={
                  errors.franchiseSinceYear && (
                    <Typography variant="caption" color="error">
                      {errors.franchiseSinceYear}
                    </Typography>
                  )
                }
                inputProps={{
                  ...params.inputProps,
                  type: "number",
                  min: new Date().getFullYear() - 225,
                  max: new Date().getFullYear(),
                  readOnly: !isEditing,
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
                    padding: "4px",
                  },
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
                  justifyContent: "center",
                }}
              >
                {option}
              </MenuItem>
            )}
            disabled={!isEditing}
          />
        </Grid>
      </Grid>

      {/* Franchise Network */}
      <Typography variant="h6" fontWeight={700} sx={{ color: "#ff9800" }}>
        Franchise Network
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{
          mt: 3,
          display: "grid",
          gridTemplateColumns: { md: "repeat(4, 1fr)", xs: "1fr" },
        }}
      >
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Company Owned Outlets"
            name="companyOwnedOutlets"
            value={data.companyOwnedOutlets || ""}
            onChange={handleChange}
            placeholder="0"
            type="number"
            inputProps={{ min: 0, readOnly: !isEditing }}
            error={!!errors.companyOwnedOutlets}
            helperText={errors.companyOwnedOutlets}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Franchise Outlets"
            name="franchiseOutlets"
            value={data.franchiseOutlets || ""}
            onChange={handleChange}
            placeholder="0"
            type="number"
            inputProps={{ min: 0, readOnly: !isEditing }}
            error={!!errors.franchiseOutlets}
            helperText={errors.franchiseOutlets}
            required
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
          />
        </Grid>
      </Grid>

      {/* Franchise Business Models */}
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ mt: 2, color: "#ff9800" }}
      >
        Franchise Business Models
      </Typography>
      {errors.fico && typeof errors.fico === "string" && (
        <Typography color="error" sx={{ mb: 2 }}>
          {errors.fico}
        </Typography>
      )}

      {/* Current FICO Model Form - Only show when editing */}
      {isEditing && (
        <Box sx={{ mb: 4 }}>
          <Grid
            container
            spacing={2}
            sx={{
              display: "grid",
              gridTemplateColumns: { md: "repeat(4, 1fr)", xs: "1fr" },
              gap: 2,
              mb: 2,
              mt: 2,
            }}
          >
            {/* Column 1 - Franchise Model */}
            <Grid item>
              <FormControl
                fullWidth
                error={!!errors.franchiseModel}
                required
                size="medium"
              >
                <InputLabel>Business Opportunites</InputLabel>
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
          <FormControl
            fullWidth
            error={!!errors.franchiseType}
            required
            size="medium"
          >
            <InputLabel>Business Model</InputLabel>
          <Select
  value={currentFicoModel.franchiseType}
  onChange={handleFicoChange}
  name="franchiseType"
  label="Business Model & Type"
  disabled={!currentFicoModel.franchiseModel}
  MenuProps={{
    PaperProps: { sx: { maxHeight: 400 } },
    disableAutoFocusItem: true,
  }}
  onClose={() => setFranchiseTypeSearch("")}
>
  {/* ✅ Search Box */}
  <DropdownSearchBox
    value={franchiseTypeSearch}
    onChange={setFranchiseTypeSearch}
    onClear={() => setFranchiseTypeSearch("")}
    placeholder="Search model type…"
  />

  {!currentFicoModel.franchiseModel ? (
    <MenuItem disabled>
      <Typography variant="body2" color="text.secondary">
        Select a Business Network first
      </Typography>
    </MenuItem>
  ) : (
    (() => {
      const lower = franchiseTypeSearch.toLowerCase().trim();
      const groups = franchiseTypes[currentFicoModel.franchiseModel] || {};
      const result = [];

      Object.entries(groups).forEach(([groupLabel, items]) => {
        const matchedItems = items.filter((type) =>
          type.toLowerCase().includes(lower)
        );
        if (lower && matchedItems.length === 0) return;

        result.push(
          <MenuItem
            key={`group-${groupLabel}`}
            disabled
            sx={{
              fontWeight: 700,
              fontSize: "0.75rem",
              color: "#ff9800 !important",
              backgroundColor: "#f8f8f8",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textAlign: "center",
              justifyContent: "center",
              opacity: "1 !important",
              pointerEvents: "none",
              mt: 0.5,
            }}
          >
            {groupLabel}
          </MenuItem>
        );

        matchedItems.forEach((type) => {
          result.push(
            <MenuItem key={type} value={type} sx={{ pl: 3 }}>
              {lower ? (() => {
                const i = type.toLowerCase().indexOf(lower);
                if (i === -1) return type;
                return (
                  <>
                    {type.slice(0, i)}
                    <span style={{ fontWeight: 700, color: "#ff9800" }}>
                      {type.slice(i, i + lower.length)}
                    </span>
                    {type.slice(i + lower.length)}
                  </>
                );
              })() : type}
            </MenuItem>
          );
        });
      });

      return result.length > 0 ? result : (
        <MenuItem disabled>
          <Typography variant="body2" color="text.secondary">No results found</Typography>
        </MenuItem>
      );
    })()
  )}
</Select>
            {errors.franchiseType && (
              <FormHelperText error>{errors.franchiseType}</FormHelperText>
            )}
          </FormControl>
        </Grid>
            {/* Column 3 - Investment Range */}
            <Grid item>
              <FormControl
                fullWidth
                error={!!errors.investmentRange}
                required
                size="medium"
              >
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
                  <FormHelperText error>
                    {errors.investmentRange}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* Column 4 - Area Required */}
            <Grid item>
              <FormControl
                fullWidth
                size="medium"
                required
                error={!!errors.areaRequired}
              >
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
                  <MenuItem value="No Space Required">
                    No Space Required
                  </MenuItem>
                  <MenuItem value="100 - 200 Sq. Ft.">100-200 Sq. Ft.</MenuItem>
                  <MenuItem value="200 - 500 Sq. Ft.">200-500 Sq. Ft.</MenuItem>
                  <MenuItem value="500 - 1,000 Sq. Ft.">
                    500-1,000 Sq. Ft.
                  </MenuItem>
                  <MenuItem value="1,000 - 2,000 Sq. Ft.">
                    1,000-2,000 Sq. Ft.
                  </MenuItem>
                  <MenuItem value="2,000 - 3,000 Sq. Ft.">
                    2,000-3,000 Sq. Ft.
                  </MenuItem>
                  <MenuItem value="3,000 - 5,000 Sq. Ft.">
                    3,000-5,000 Sq. Ft.
                  </MenuItem>
                  <MenuItem value="5,000 - 7,000 Sq. Ft.">
                    5,000-7,000 Sq. Ft.
                  </MenuItem>
                  <MenuItem value="7,000 - 10,000 Sq. Ft.">
                    7,000-10,000 Sq. Ft.
                  </MenuItem>
                  <MenuItem value="10,000 - 15,000 Sq. Ft.">
                    10,000-15,000 Sq. Ft.
                  </MenuItem>
                </Select>
                {errors.areaRequired && (
                  <FormHelperText error>{errors.areaRequired}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* Column 5 - Agreement Period */}
            <Grid item>
              <FormControl
                fullWidth
                error={!!errors.agreementPeriod}
                required
                size="medium"
              >
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
                  <FormHelperText error>
                    {errors.agreementPeriod}
                  </FormHelperText>
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
                          onChange={handleFeeUnitChange(
                            "requireWorkingCapital",
                          )}
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
              <FormControl
                fullWidth
                size="medium"
                required
                error={!!errors.breakEven}
              >
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
              <FormControl
                fullWidth
                size="medium"
                required
                error={!!errors.roi}
              >
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
                {errors.roi && (
                  <FormHelperText error>{errors.roi}</FormHelperText>
                )}
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
              <FormControl
                fullWidth
                size="medium"
                required
                error={!!errors.marginOnSales}
              >
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
          <Grid
            item
            xs={12}
            mt={1}
            sx={{ display: "flex", justifyContent: "space-evenly", gap: 2 }}
          >
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

      {/* Display saved FICO models - ALWAYS SHOW THE TABLE */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          Saved Franchise Models{" "}
          {data.fico?.length > 0 && `(${data.fico.length})`}
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
                  whiteSpace: "nowrap",
                },
              }}
            >
              <TableHead>
                <TableRow>
                  {[
                    "Model Type",
                    "Franchise Type",
                    "Investment Range",
                    "Area Required",
                    "Agreement Period",
                    "Franchise Fee",
                    "Interior Cost",
                    "Stock Cost",
                    "Additional Cost",
                    "Annual Working Capital",
                    "Royalty Fee",
                    "Break Even",
                    "ROI (%)",
                    "Payback",
                    "Margin On Sales",
                    "Actions",
                  ].map((label, i) => (
                    <TableCell
                      key={i}
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: "#f5f5f5",
                      }}
                    >
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.fico && data.fico.length > 0 ? (
                  data.fico.map((model, index) => (
                    <TableRow
                      key={index}
                      hover
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        fontSize: "0.75rem",
                      }}
                    >
                      <TableCell>{model.franchiseModel || "N/A"}</TableCell>
                      <TableCell>{model.franchiseType || "N/A"}</TableCell>
                      <TableCell>{model.investmentRange || "N/A"}</TableCell>
                      <TableCell>{model.areaRequired || "N/A"}</TableCell>
                      <TableCell>{model.agreementPeriod || "N/A"}</TableCell>
                      <TableCell>
                        {formatCurrency(model.franchiseFee)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(model.interiorCost)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(model.stockInvestment)}
                      </TableCell>
                      <TableCell>{formatCurrency(model.otherCost)}</TableCell>
                      <TableCell>
                        {formatCurrency(model.requireWorkingCapital)}
                      </TableCell>
                      <TableCell>
                        {model.royaltyFee && model.royaltyFee !== "No Fee"
                          ? `${model.royaltyFee}${
                              model.royaltyFeeUnit === "%" ? "%" : ""
                            }`
                          : model.royaltyFee}
                      </TableCell>
                      <TableCell>{model.breakEven}</TableCell>
                      <TableCell>{model.roi}%</TableCell>
                      <TableCell>{model.payBackPeriod}</TableCell>
                      <TableCell>{model.marginOnSales}%</TableCell>
                      <TableCell>
                        {isEditing && (
                          <>
                            <IconButton
                              onClick={() => handleEditFicoModel(index)}
                              color="primary"
                              size="small"
                              aria-label="edit"
                              sx={{ mr: 1 }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteFicoModel(index)}
                              color="error"
                              size="small"
                              aria-label="delete"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={16}
                      align="center"
                      sx={{
                        py: 4,
                        color: "text.secondary",
                        fontStyle: "italic",
                      }}
                    >
                      No franchise models added yet.{" "}
                      {isEditing &&
                        "Use the form above to add your first franchise model."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

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
              <RadioGroup
                row
                sx={{ display: "flex", ml: 5, gap: 15 }}
                value={data.aidFinancing || ""}
                onChange={(e) => onChange("aidFinancing", e.target.value)}
              >
                {aidFinancingOptions.map((type) => (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={
                      <Radio
                        color={errors.aidFinancing ? "error" : "primary"}
                        disabled={!isEditing}
                      />
                    }
                    label={type}
                    checked={data.aidFinancing === type}
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
              <RadioGroup
                row
                sx={{ display: "flex", ml: 5, gap: 15 }}
                value={data.franchiseDevelopment || ""}
                onChange={(e) =>
                  onChange("franchiseDevelopment", e.target.value)
                }
              >
                {aidFinancingOptions.map((type) => (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={
                      <Radio
                        color={
                          errors.franchiseDevelopment ? "error" : "primary"
                        }
                        disabled={!isEditing}
                      />
                    }
                    label={type}
                    checked={data.franchiseDevelopment === type}
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
              <RadioGroup
                row
                sx={{ display: "flex", ml: 5, gap: 15 }}
                value={data.consultationOrAssistance || ""}
                onChange={(e) =>
                  onChange("consultationOrAssistance", e.target.value)
                }
              >
                {aidFinancingOptions.map((type) => (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={
                      <Radio
                        color={
                          errors.consultationOrAssistance ? "error" : "primary"
                        }
                        disabled={!isEditing}
                      />
                    }
                    label={type}
                    checked={data.consultationOrAssistance === type}
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
            >
              <Box
                sx={{
                  minWidth: { md: "210px" },
                  alignSelf: "flex-start",
                  pt: 1.2,
                  mr: { md: 6 },
                }}
              >
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
                sx={{ ml: { md: 5 }, display: "flex", flexDirection: "row" }}
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
                        checked={
                          data.trainingSupport?.includes(option) || false
                        }
                        onChange={(e) =>
                          handleTrainingSupportChange(option, e.target.checked)
                        }
                        name="trainingSupport"
                        color="primary"
                        disabled={!isEditing}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ width: "145px" }}>
                        {option}
                      </Typography>
                    }
                    sx={{ minWidth: "60px" }}
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
                  Highlight what makes your brand or business unique. Try to
                  list 2–5 bullet points that make you stand out.
                </span>
              }
              placement="right-start"
              arrow
              enterTouchDelay={0}
            >
              <IconButton
                size="small"
                aria-label="info"
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
            {errors.uniqueSellingPoints &&
              typeof errors.uniqueSellingPoints === "string" && (
                <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                  {errors.uniqueSellingPoints}
                </Typography>
              )}
          </Typography>
          {/* USP Input and Add Button */}
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
                  errors.uniqueSellingPoints &&
                  typeof errors.uniqueSellingPoints === "string"
                    ? errors.uniqueSellingPoints
                    : null
                }
              />
              <Button
                variant="contained"
                onClick={handleAddUSP}
                disabled={!currentUSP.trim()}
                sx={{
                  backgroundColor: "#7ad03a",
                  color: "white",
                  "&:hover": { backgroundColor: "#388e3c" },
                  py: 2,
                  px: 6,
                }}
              >
                Add
              </Button>
            </Box>
          )}
          {/* Display added USPs */}
          {data.uniqueSellingPoints?.length > 0 && (
            <Paper sx={{ p: 2, mb: 3, border: "1px solid #e0e0e0" }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
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
          <TextField
            multiline
            minRows={8}
            fullWidth
            value={data.brandDescription || ""}
            onChange={handleDescriptionChange}
            variant="outlined"
            placeholder="Enter brand description here..."
            error={!!errors.brandDescription}
            helperText={errors.brandDescription}
            InputProps={{
              readOnly: !isEditing,
            }}
          />
        </Box>
      </Grid>
    </Box>
  );
};

export default FranchiseDetailsEdit;
