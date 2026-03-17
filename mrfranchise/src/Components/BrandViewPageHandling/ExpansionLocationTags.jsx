

"use client";
import React, { useMemo, useState, useCallback } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setFilter } from "@/Redux/Slices/FilterBrandSlice"; // Adjust the import path as needed

const ExpansionLocationTags = ({
  brand,
  isMobile,
  isTablet,
  isSmallDesktop,
  isLargeDesktop,
}) => {
  const [showAll, setShowAll] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  // Extract categories with null checks
  const mainCategory = brand?.[0]?.brandfranchisedetails?.franchiseDetails?.brandCategories?.main || "Business";
  const subCategory = brand?.[0]?.brandfranchisedetails?.franchiseDetails?.brandCategories?.sub || "Business";
  
  // Process only state data with null checks
  const states = useMemo(() => {
    try {
      const locations = brand?.[0]?.brandexpansionlocationdatas?.expansionLocations?.domestic?.locations || [];
      
      // Extract unique states
      const stateSet = new Set();
      const uniqueStates = [];
      
      locations.forEach((loc) => {
        const state = loc?.state;
        if (state && !stateSet.has(state)) {
          stateSet.add(state);
          uniqueStates.push(state);
        }
      });
      
      return uniqueStates;
    } catch (error) {
      console.error("Error processing location data:", error);
      return ["Delhi", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Punjab", "Uttar Pradesh", "Rajasthan", "Maharashtra", "Karnataka", "Tamil Nadu"];
    }
  }, [brand]);

  // Create formatted state tags
  const stateTags = useMemo(() => {
    if (!states.length) return [];
    
    return states.map((state, index) => ({
      id: `${state}-${index}`,
      label: `${subCategory} Franchise in ${state}`,
      state: state,
      mainCategory: mainCategory,
      subCategory: subCategory
    }));
  }, [states, subCategory, mainCategory]);

  // Calculate initial tags to show based on device
  const initialTagsToShow = useMemo(() => {
    // if (isMobile) {
    //   return 5; // For mobile: Show 5 tags initially
    // }
    // if (isTablet) {
    //   return 8; // For tablet: show 8 tags initially
    // }
    // if (isSmallDesktop) {
    //   return 10; // For small desktop: show 10 tags initially
    // }
    // return 12; // For large desktop: show 12 tags initially
  }, [isMobile, isTablet, isSmallDesktop]);

  const hasMoreTags = stateTags.length > initialTagsToShow;

  // Determine which tags to show
  const visibleTags = useMemo(() => {
    return showAll ? stateTags : stateTags.slice(0, initialTagsToShow);
  }, [stateTags, showAll, initialTagsToShow]);

  // Handle tag click - set filters and navigate to new tab
  const handleTagClick = useCallback((e, tag) => {
    e.preventDefault();
    
    // Create URL with query parameters
    const url = new URL('/all-franchise-brands', window.location.origin);
    
    // Add query parameters
    url.searchParams.append('page', '1');
    url.searchParams.append('maincat', tag.mainCategory);
    url.searchParams.append('subcat', tag.subCategory);
    url.searchParams.append('state', tag.state);
    
    // Open in new tab
    window.open(url.toString(), '_blank');
    
    // Optional: You can still dispatch to Redux for the current tab if needed
    // This will update the current tab's filters as well
    dispatch(setFilter({ filterName: "page", value: 1 }));
    dispatch(setFilter({ filterName: "maincat", value: tag.mainCategory }));
    dispatch(setFilter({ filterName: "subcat", value: tag.subCategory }));
    dispatch(setFilter({ filterName: "state", value: tag.state }));
    dispatch(setFilter({ filterName: "district", value: null }));
    dispatch(setFilter({ filterName: "city", value: null }));
  }, [dispatch]);

  // Alternative: Handle with router and new tab
  const handleTagClickWithRouter = useCallback((e, tag) => {
    e.preventDefault();
    
    // First dispatch filters for current tab (optional)
    dispatch(setFilter({ filterName: "page", value: 1 }));
    dispatch(setFilter({ filterName: "maincat", value: tag.mainCategory }));
    dispatch(setFilter({ filterName: "subcat", value: tag.subCategory }));
    dispatch(setFilter({ filterName: "state", value: tag.state }));
    dispatch(setFilter({ filterName: "district", value: null }));
    dispatch(setFilter({ filterName: "city", value: null }));
    
    // Create the URL for new tab
    const queryParams = new URLSearchParams({
      page: '1',
      maincat: tag.mainCategory,
      subcat: tag.subCategory,
      state: tag.state
    }).toString();
    
    // Open in new tab
    window.open(`/all-franchise-brands?${queryParams}`, '_blank');
  }, [dispatch]);

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: "white",
        borderRadius: 3,
      }}
    >
      {/* Title - "Tags:" with bold */}
      <Typography 
        variant="body2" 
        component="span"
        sx={{ 
          mr: 1,
          color: "#f7a853ff",
          fontWeight: 600,
          fontSize: isMobile ? "0.875rem" : "0.9375rem",
        }}
      >
        Tags:
      </Typography>

      {/* Tags Display */}
      {stateTags.length > 0 ? (
        <>
          {/* Tags Container */}
          <Box component="span" sx={{ display: "inline" }}>
            {visibleTags.map((tag, index) => (
              <React.Fragment key={tag.id}>
                <Typography
                  component="a"
                  href="#"
                  onClick={(e) => handleTagClick(e, tag)}
                  target="_blank" // This attribute helps with accessibility
                  rel="noopener noreferrer"
                  sx={{
                    color: "#333",
                    fontSize: isMobile ? "0.875rem" : "0.9375rem",
                    fontWeight: 400,
                    lineHeight: 1.6,
                    cursor: "pointer",
                    textDecoration: "none",
                    "&:hover": {
                      color: "#f7a853ff",
                      textDecoration: "underline",
                    },
                  }}
                >
                  {tag.label}
                </Typography>
                
                {/* Add separator | except for last item */}
                {index < visibleTags.length - 1 && (
                  <Typography
                    component="span"
                    sx={{
                      color: "#333",
                      mx: 1,
                      fontSize: isMobile ? "0.875rem" : "0.9375rem",
                      fontWeight: 400,
                    }}
                  >
                    |{" "}
                  </Typography>
                )}
              </React.Fragment>
            ))}
            
            {/* Show More/Less Button */}
            {hasMoreTags && (
              <>
                {visibleTags.length > 0 && (
                  <Typography
                    component="span"
                    sx={{
                      color: "#333",
                      mx: 1,
                      fontSize: isMobile ? "0.875rem" : "0.9375rem",
                      fontWeight: 400,
                    }}
                  >
                    |{" "}
                  </Typography>
                )}
                
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setShowAll(!showAll)}
                  sx={{
                    textTransform: "none",
                    fontSize: isMobile ? "0.875rem" : "0.9375rem",
                    color: "#1976d2",
                    fontWeight: 400,
                    minWidth: "auto",
                    p: 0,
                    verticalAlign: "baseline",
                    "&:hover": {
                      backgroundColor: "transparent",
                      textDecoration: "underline",
                    },
                  }}
                >
                  {showAll ? "Show less..." : "Show more..."}
                </Button>
              </>
            )}
          </Box>
        </>
      ) : (
        /* Empty State */
        <Typography
          component="span"
          variant="body2"
          sx={{
            color: "text.secondary",
            fontStyle: "italic",
            fontSize: isMobile ? "0.875rem" : "0.9375rem",
          }}
        >
          No franchise locations available
        </Typography>
      )}
    </Box>
  );
};

export default React.memo(ExpansionLocationTags);
