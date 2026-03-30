"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  fetchFilterOptions,
  resetChildCategories,
  resetDistricts,
  resetCities,
} from "@/Redux/Slices/filterDropdownData";
import Search from "../Navbar/Search";
import { fetchFilteredBrands, setFilter } from "@/Redux/Slices/FilterBrandSlice";

// Define the correct order for investment ranges


const BrandTags = React.memo(
  ({
    filters,
    onFilterChange,
    onClearFilters,
    activeFilterCount,
    resultStats = { showing: 0, total: 0 },
  }) => {
    const dispatch = useDispatch();
    const {
      mainCategories,
      subCategories,
      childCategories,
    
      loading,
      loadingChildCategories,
    
    } = useSelector((state) => state.filterDropdown);

    const mainCategoryRef = useRef(null);
    const subCategoryRef = useRef(null);
   

    const [searchTerms, setSearchTerms] = useState({
      mainCategory: "",
      subCategory: "",
     
    });
    const [expandedSections, setExpandedSections] = useState({
      mainCategory: false,
      subCategory: false,
     
    });

    // Fetch initial filter data
    useEffect(() => {
      dispatch(fetchFilterOptions());
    }, [dispatch]);

    // Fetch subcategories and child categories when main category changes
    useEffect(() => {
      if (filters.maincat) {
        dispatch(fetchFilterOptions({ main: filters.maincat }));
        dispatch(resetChildCategories()); // Reset child categories when main category changes
      } else {
        dispatch(fetchFilterOptions()); // Fetch all filters if main category is cleared
      }
    }, [dispatch, filters.maincat]);

    // Fetch child categories when subcategory changes
    useEffect(() => {
      if (filters.subcat) {
dispatch(fetchFilterOptions({ 
  main: filters.maincat, 
  sub: filters.subcat 
}));      }
    }, [dispatch, filters.subcat]);

   

    // Read URL parameters on mount
    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const maincat = params.get("maincat");
      const subcat = params.get("subcat");


      if (maincat) onFilterChange("maincat", maincat);
      if (subcat) onFilterChange("subcat", subcat);
     
    }, [onFilterChange]);

    const toggleSection = (section) => {
      setExpandedSections((prev) => {
        const newState = { ...prev };
        // If opening this section, close others
        if (!prev[section]) {
          Object.keys(newState).forEach((key) => {
            if (key !== section) newState[key] = false;
          });
        }
        newState[section] = !prev[section];
        return newState;
      });
    };
    

    // Filter and sort options based on search terms (alphabetical order)
    const filteredMainCategories = useMemo(() => {
      const term = (searchTerms.mainCategory || "").toLowerCase();
      return mainCategories
        .filter((main) => {
          if (!main) return false;
          return main.toLowerCase().includes(term);
        })
        .sort((a, b) =>
          (a || "").toLowerCase().localeCompare((b || "").toLowerCase()),
        )
        .slice(0, 100);
    }, [mainCategories, searchTerms.mainCategory]);

    const filteredSubCategories = useMemo(() => {
      const term = (searchTerms.subCategory || "").toLowerCase();
      return subCategories
        .filter((sub) => {
          if (!sub) return false;
          return sub.toLowerCase().includes(term);
        })
        .sort((a, b) =>
          (a || "").toLowerCase().localeCompare((b || "").toLowerCase()),
        )
        .slice(0, 100);
    }, [subCategories, searchTerms.subCategory]);

   
const filteredChildCategories = useMemo(() => {
  if (!Array.isArray(childCategories)) return [];

  return childCategories
    .filter((child) => child)
    .sort((a, b) =>
      (a || "").toLowerCase().localeCompare((b || "").toLowerCase())
    )
    .slice(0, 100);
}, [childCategories]);



useEffect(() => {
  if (loadingChildCategories) return;
  // Avoid empty initial call
  if (!filters.maincat && !filters.subcat && !filters.childcat) return;

  const value = filters.childcat;
  console.log('brandtag', value);

  dispatch(
    fetchFilteredBrands({
      ...filters,
      searchTerm: value,
      page: 1,
      limit: 20,
    })
  );
}, [filters.maincat, loadingChildCategories, filters.subcat, filters.childcat, dispatch]);


  return (
  <>
    
    {/* Breadcrumb Header */}
    <Box mt={{ xs: 1, sm: 1, md: 2 }} >
      
     
      {/* Sub Category */}
     
    </Box>

    {/* MAIN CATEGORY LIST */}
   {!filters.maincat && (
  <>
    {loading ? (
      <CircularProgress size={20} sx={{ color: "#ff9800" }} />
    ) : (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        {filteredMainCategories.map((category) => (
          <Box
            key={category}
            onClick={() => onFilterChange("maincat", category)}
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: "12px",
              fontSize: { xs: 12, sm: 14, md: 16 },
              cursor: "pointer",
              border: "1px solid #ff9800",
              backgroundColor:
                filters.maincat === category ? "#4caf50" : "#fff",
              color:
                filters.maincat === category ? "#fff" : "#333",
              "&:hover": {
                // backgroundColor: "#f5f5f5",
                textDecoration:'underline',
              },
            }}
          >
            {category} Franchise
          </Box>
        ))}
      </Box>
    )}
  </>
)}

    {/* SUB CATEGORY LIST */}
  {filters.maincat && !filters.subcat && (
  <>
    {loading ? (
      <CircularProgress size={20} sx={{ color: "#ff9800" }} />
    ) : (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        {filteredSubCategories.map((subCategory) => (
          <Box
            key={subCategory}
            onClick={() => onFilterChange("subcat", subCategory)}
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: "12px",
                            fontSize: { xs: 12, sm: 14, md: 16 },

              // fontWeight:150,
              cursor: "pointer",
              border: "1px solid #ff9800",
              backgroundColor:
                filters.subcat === subCategory ? "#ff9800" : "#fff",
              //  textDecoration: "underline",
              color:
                filters.subcat === subCategory ? "#fff" : "#333",
              "&:hover": {
                // color: "#f5f5f5",
                textDecoration: "underline",
               
              },
            }}
          >
            {subCategory} Franchise
          </Box>
        ))}
      </Box>
    )}
  </>
)}

{/* CHILD CATEGORY LIST */}
{filters.maincat && filters.subcat && (
  <>
    {loadingChildCategories ? (
      <CircularProgress size={20} sx={{ color: "#ff9800" }} />
    ) : (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          mt: 1,
        }}
      >
        {filteredChildCategories.map((child) => (
          <Box
            key={child}
            onClick={() => {
              dispatch(setFilter({ searchTerm: child }));
              dispatch(fetchFilteredBrands({ searchTerm: child, page: 1, limit: 20 }));
            }}
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: "12px",
                        fontSize: { xs: 12, sm: 14, md: 16 },

              cursor: "pointer",
              border: "1px solid #ff9800",
              backgroundColor:
                filters.searchTerm === child ? "#ff9800" : "#fff",
              color:
                filters.searchTerm === child ? "#fff" : "#333",
              "&:hover": {
                textDecoration: "underline",
                // backgroundColor: "#f5f5f5",
              },
            }}
          >
            {child} Franchise
          </Box>
        ))}
      </Box>
    )}
  </>
)}



  </>
);
  },
);

export default BrandTags;
