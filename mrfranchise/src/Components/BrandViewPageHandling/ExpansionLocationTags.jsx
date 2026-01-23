"use client";
import React, { useMemo, useState } from "react";
import { Box, Typography, Button } from "@mui/material";

const ExpansionLocationTags = ({
  brand,
  isMobile,
  isTablet,
  isSmallDesktop,
  isLargeDesktop,
}) => {
  const [showAll, setShowAll] = useState(false);
  
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
      state: state
    }));
  }, [states, subCategory]);

  // Calculate initial tags to show based on device
  const initialTagsToShow = useMemo(() => {
    if (isMobile) {
      // For mobile: Show 3 lines of tags
      // Assuming 2 tags per line on mobile = 6 tags for 3 lines
      return 5;
    }
    if (isTablet) {
      // For tablet: show 8 tags initially
      return 5;
    }
    // For tablet and desktop: show 10 tags initially
    return 10;
  }, [isMobile]);

  const hasMoreTags = stateTags.length > initialTagsToShow;

  // Determine which tags to show
  const visibleTags = useMemo(() => {
    return showAll ? stateTags : stateTags.slice(0, initialTagsToShow);
  }, [stateTags, showAll, initialTagsToShow]);

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
                  component="span"
                  sx={{
                    color: "#333",
                    fontSize: isMobile ? "0.875rem" : "0.9375rem",
                    fontWeight: 400,
                    lineHeight: 1.6,
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