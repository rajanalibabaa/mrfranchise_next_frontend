"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";

import CircularProgress from "@mui/material/CircularProgress";


import {
  fetchFilterOptions,
  resetChildCategories,
} from "@/Redux/Slices/filterDropdownData";

// Define the correct order for investment ranges


const BrandTags = React.memo(
  ({
    filters,
    onFilterChange,
   
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

  const result = [];

  for (const group of mainCategories) {
    if (!group?.heading || !Array.isArray(group.industries)) continue;

    const matchedIndustries = group.industries
      .filter((ind) => ind && ind.toLowerCase().includes(term))
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    if (matchedIndustries.length > 0) {
      result.push({ heading: group.heading, industries: matchedIndustries });
    }
  }

  return result;
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
    {filteredMainCategories.map((group) => (
  <React.Fragment key={group.heading}>
    {/* Heading label */}
    <Box
      sx={{
        width: "100%",
        px: 1,
        py: 0.5,
        fontSize: { xs: 10, sm: 11, md: 12 },
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "text.secondary",
        backgroundColor: "#f5f5f5",
        borderRadius: "6px",
        mt: 1,
        pointerEvents: "none",
      }}
    >
      {group.heading}
    </Box>

    {/* Industries under this heading */}
    {group.industries.map((industry) => (
      <Box
        key={industry}
        onClick={() => {
          onFilterChange("maincat", industry);
          onFilterChange("subcat", "");
          onFilterChange("childcat", "");
          onFilterChange("searchTerm", "");
        }}
        sx={{
          px: 1.5,
          py: 0.5,
          borderRadius: "12px",
          fontSize: { xs: 12, sm: 14, md: 16 },
          cursor: "pointer",
          border: "1px solid #ff9800",
          backgroundColor: filters.maincat === industry ? "#4caf50" : "#fff",
          color: filters.maincat === industry ? "#fff" : "#333",
          "&:hover": {
            textDecoration: "underline",
          },
        }}
      >
        {industry} Franchise
      </Box>
    ))}
  </React.Fragment>
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
            onClick={() => {
              onFilterChange("subcat", subCategory);
              onFilterChange("childcat", "");
              onFilterChange("searchTerm", "");
            }}
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
{/* {filters.maincat && filters.subcat && (
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
              onFilterChange("childcat", child);
              onFilterChange("searchTerm", "");
            }}
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: "12px",
                        fontSize: { xs: 12, sm: 14, md: 16 },

              cursor: "pointer",
              border: "1px solid #ff9800",
              backgroundColor:
                filters.childcat === child ? "#ff9800" : "#fff",
              color:
                filters.childcat === child ? "#fff" : "#333",
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
)} */}



  </>
);
  },
);

export default BrandTags;
