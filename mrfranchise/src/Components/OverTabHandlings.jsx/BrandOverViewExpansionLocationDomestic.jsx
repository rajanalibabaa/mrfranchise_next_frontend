"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Place,
  Map,
  LocationCity,
  ArrowBack,
  FiberManualRecord,
  LocationOff,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const ExpansionLocationGrid = ({ data }) => {
  const [expandedState, setExpandedState] = useState(0);
  const [expandedDistrict, setExpandedDistrict] = useState(
    data?.locations?.[0]?.districts?.length > 0 ? "0-0" : null
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!data || !Array.isArray(data.locations)) return null;

  const visibleLocations = data.locations;
  const hasData = data.locations.length > 0;

  const toggleState = (stateIndex) => {
    if (expandedState === stateIndex) {
      setExpandedState(null);
      setExpandedDistrict(null);
    } else {
      setExpandedState(stateIndex);
      setExpandedDistrict(null);
    }
  };

  const toggleDistrict = (stateIndex, distIndex) => {
    const districtKey = `${stateIndex}-${distIndex}`;
    setExpandedDistrict(
      expandedDistrict === districtKey ? null : districtKey
    );
  };

  // Function to render items with fallback to parent name
  const renderItemsWithFallback = (items, parentName) => {
    if (Array.isArray(items) && items.length > 0) {
      return items;
    }
    return [parentName]; // Return parent name as single item if no items exist
  };

  // Function to get cities or fallback to district name
 // Function to get cities or fallback to district name
// Function to get cities or fallback to district name
const getCitiesOrDistrict = (stateIndex, districtIndex) => {
  const state = data.locations[stateIndex];
  if (!state || !state.districts || !state.districts[districtIndex]) return [];
  
  const district = state.districts[districtIndex];
  if (Array.isArray(district.cities)) {
    return district.cities.length > 0 
      ? district.cities 
      : [district.district || "Unknown District"];
  }
  return [district.district || "Unknown District"];
};
  return (
    <Box
      sx={{
        mt: 2,
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {!hasData ? (
        <Box
          sx={{
            p: 3,
            textAlign: "center",
            color: "text.secondary",
          }}
        >
          <Typography variant="body1">No locations available</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: isMobile ? "block" : "flex",
            height: isMobile ? "auto" : "400px",
          }}
        >
          {/* Unified scroll container for desktop */}
          <Box
            sx={{
              display: isMobile ? "block" : "flex",
              flex: 1,
              "&::-webkit-scrollbar": {
                height: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0,0,0,0.2)",
                borderRadius: "4px",
              },
            }}
          >
            {/* States Column */}
            <Box
              sx={{
                width: isMobile ? "100%" : "300px",
                minWidth: isMobile ? "100%" : "300px",
                borderRight: isMobile ? "none" : "1px solid #e0e0e0",
                bgcolor: "background.paper",
              }}
            >
              <Typography
  variant="subtitle1"
  sx={{
    p: 2,
    position: "sticky",
    top: 0,
    bgcolor: "#7cd13b",
    zIndex: 2,
    borderBottom: "1px solid #e0e0e0",
    display: "flex",
    alignItems: "center",   // vertical center
    justifyContent: "center", // horizontal center
  }}
>
  <Place sx={{ mr: 1, color: "#ffffffff" }} />
  States
</Typography>

              <Box
                sx={{
                  p: 1,
                  maxHeight: "calc(75vh - 200px)",
                  overflowY: "auto",
                }}
              >
                {/* {renderItemsWithFallback(visibleLocations, "Country").map((loc, stateIndex) => (
                  <Card
                    key={`state-${stateIndex}`}
                    onClick={() => toggleState(stateIndex)}
                    sx={{
                      mb: 1,
                      cursor: "pointer",
                      borderRadius: "6px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      borderLeft: `4px solid ${
                        expandedState === stateIndex
                          ? theme.palette.primary.main
                          : "transparent"
                      }`,
                      bgcolor:
                        expandedState === stateIndex
                          ? "rgba(25, 118, 210, 0.08)"
                          : "background.paper",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        p: 0.8,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography fontWeight={600}>
                        {typeof loc === 'string' ? loc : (loc.state || "Unknown State")}
                      </Typography>
                    </Box>
                  </Card>
                ))} */}
{renderItemsWithFallback(visibleLocations, "Country").map((loc, stateIndex) => {
  const isEven = stateIndex % 2 === 0;

  const baseBgColor = isEven
    ? "#eaf6df"   // blue-ish
    : "#eedbbcff";  // green-ish

  const expandedBgColor = isEven
    ? "#white"
    : "#white";

  const borderColor = isEven
    ? "#4caf50"
    : "#ff9800";

  return (
    <Card
      key={`state-${stateIndex}`}
      onClick={() => toggleState(stateIndex)}
      sx={{
        mb: 1,
        cursor: "pointer",
        borderRadius: "6px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",

        // 🔴 alternating background (ALWAYS visible)
        bgcolor:
          expandedState === stateIndex
            ? expandedBgColor
            : baseBgColor,

        // 🔴 alternating border color
        borderLeft: `4px solid ${
          expandedState === stateIndex ? borderColor : borderColor
        }`,

        transition: "all 0.2s ease",

        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
        },
      }}
    >
      <Box
        sx={{
          p: 0.8,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography fontWeight={600}>
          {typeof loc === "string" ? loc : loc.state || "Unknown State"}
        </Typography>
      </Box>
    </Card>
  );
})}


              </Box>
            </Box>

            {/* Districts Column */}
            <Box
              sx={{
                width: isMobile ? "100%" : "300px",
                minWidth: isMobile ? "100%" : "300px",
                borderRight: isMobile ? "none" : "1px solid #e0e0e0",
                bgcolor:
                  expandedState !== null
                    ? "background.paper"
                    : "rgba(0,0,0,0.02)",
                display: isMobile
                  ? expandedState !== null
                    ? "block"
                    : "none"
                  : "block",
                transition: "background-color 0.3s ease",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  p: 2,
                  position: "sticky",
                  top: 0,
                  bgcolor: "#ff9800",
                  zIndex: 2,
                  borderBottom: "1px solid #e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Map sx={{ mr: 1, color: "#ffffffff" }} />
                Cities
                {isMobile && expandedState !== null && (
                  <IconButton
                    size="small"
                    onClick={() => setExpandedState(null)}
                    sx={{ ml: "auto" }}
                  >
                    <ArrowBack fontSize="small" />
                  </IconButton>
                )}
              </Typography>
              <Box
                sx={{
                  p: 1,
                  maxHeight: "calc(75vh - 200px)",
                  overflowY: "auto",
                }}
              >
                {expandedState !== null ? (
                  renderItemsWithFallback(
                    data.locations[expandedState]?.districts,
                    data.locations[expandedState]?.state || "Unknown State"
                  ).map((dist, distIndex) => {
                    const districtKey = `${expandedState}-${distIndex}`;
                    const isEven = distIndex % 2 === 0;

                    const baseBgColor = isEven
                      ? "#eaf6df"   // blue-ish
                      : "#eedbbcff";  // green-ish

                    const expandedBgColor = isEven
                      ? "#white"
                      : "#white";

                    const borderColor = isEven
                      ? "#4caf50"
                      : "#ff9800";


                    return (
                      <Card
                        key={`district-${districtKey}`}
                        onClick={() =>
                          typeof dist !== 'string' && toggleDistrict(expandedState, distIndex)
                        }
                        sx={{
                          mb: 1,
                          cursor: "pointer",
                          borderRadius: "6px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                          borderLeft: `4px solid ${
                            expandedDistrict === districtKey
                              ? borderColor
                              : borderColor
                          }`,
                          bgcolor:
                            expandedDistrict === districtKey
                              ? expandedBgColor
                              : baseBgColor,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            p: 0.8,
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="subtitle1">
                            {typeof dist === 'string' ? dist : (dist.district || "N/A")}
                          </Typography>
                        </Box>
                      </Card>
                    );
                  })
                ) : (
                  <Box sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      {expandedState === null ? (
                        <>
                          <ArrowBack
                            sx={{
                              fontSize: 40,
                              color: "action.disabled",
                              mb: 1,
                            }}
                          />
                          <br />
                          Select a state
                        </>
                      ) : (
                        "Loading districts..."
                      )}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Cities Column */}
            {/* <Box
              sx={{
                flex: 1,
                bgcolor:
                  expandedDistrict !== null
                    ? "background.paper"
                    : "rgba(0,0,0,0.02)",
                display: isMobile
                  ? expandedDistrict !== null
                    ? "block"
                    : "none"
                  : "block",
                transition: "background-color 0.3s ease",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  p: 2,
                  position: "sticky",
                  top: 0,
                  bgcolor: "#7ad03a",
                  zIndex: 2,
                  borderBottom: "1px solid #e0e0e0",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <LocationCity sx={{ mr: 1, color: "#fff" }} />
                {expandedDistrict !== null 
                  ? `${data.locations[expandedDistrict.split("-")[0]]?.districts[expandedDistrict.split("-")[1]]?.name || 'Selected District'} Cities`
                  : "Cities"}
                {isMobile && expandedDistrict !== null && (
                  <IconButton
                    size="small"
                    onClick={() => setExpandedDistrict(null)}
                    sx={{ ml: "auto" }}
                  >
                    <ArrowBack fontSize="small" />
                  </IconButton>
                )}
              </Typography>
              <Box
                sx={{
                  p: 1,
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? "1fr"
                    : "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: 1,
                  maxHeight: "calc(75vh - 200px)",
                  overflowY: "auto",
                }}
              >
                {expandedDistrict !== null ? (
                  getCitiesOrDistrict(
                    expandedDistrict.split("-")[0],
                    expandedDistrict.split("-")[1]
                  ).map((item, cityIndex) => (
                    <Card
                      key={`city-${cityIndex}`}
                      sx={{
                        borderRadius: "6px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        bgcolor: "background.paper",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          p: 0.8,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <FiberManualRecord
                          sx={{
                            fontSize: 8,
                            color: "primary.main",
                            mr: 1,
                          }}
                        />
                        <Typography variant="body2">{item}</Typography>
                      </Box>
                    </Card>
                  ))
                ) : (
                  <Box sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      {expandedState === null ? (
                        <>
                          <ArrowBack
                            sx={{
                              fontSize: 40,
                              color: "action.disabled",
                              mb: 1,
                            }}
                          />
                          <br />
                          Select a district
                        </>
                      ) : (
                        "Select a district to view cities"
                      )}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box> */}
          </Box>
        </Box>
      )}
      </Box>
  );
};

export default ExpansionLocationGrid;