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
  Public,
  Map,
  LocationCity,
  ArrowBack,
  FiberManualRecord,
  LocationOff,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const ExpansionLocationGridInternational = ({ data }) => {
  const [expandedCountry, setExpandedCountry] = useState(null);
  const [expandedDistrict, setExpandedDistrict] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!data || !Array.isArray(data.country)) return null;

  const visibleCountries = data.country;
  const hasData = data.country.length > 0;

  const toggleCountry = (countryIndex) => {
    if (expandedCountry === countryIndex) {
      setExpandedCountry(null);
      setExpandedDistrict(null);
    } else {
      setExpandedCountry(countryIndex);
      setExpandedDistrict(null);
    }
  };

  const toggleDistrict = (countryIndex, distIndex) => {
    const districtKey = `${countryIndex}-${distIndex}`;
    setExpandedDistrict(
      expandedDistrict === districtKey ? null : districtKey
    );
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
          <Typography variant="body1">
            No international locations available
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: isMobile ? "block" : "flex",
            height: isMobile ? "auto" : "400px",
            overflow: isMobile ? "visible" : "hidden",
          }}
        >
          {/* Unified scroll container */}
          <Box
            sx={{
              display: isMobile ? "block" : "flex",
              flex: 1,
              overflow: isMobile ? "visible" : "auto",
              "&::-webkit-scrollbar": {
                height: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0,0,0,0.2)",
                borderRadius: "4px",
              },
            }}
          >
            {/* Countries Column */}
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
                  bgcolor: "#7ad03a",
                  zIndex: 2,
                  borderBottom: "1px solid #e0e0e0",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Public sx={{ mr: 1, color: "#fff" }} />
                Countries
              </Typography>
              <Box sx={{ p: 1 }}>
                {visibleCountries.map((countryItem, countryIndex) => (
                  <Card
                    key={`country-${countryIndex}`}
                    onClick={() => toggleCountry(countryIndex)}
                    sx={{
                      mb: 1,
                      cursor: "pointer",
                      borderRadius: "6px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      borderLeft: `4px solid ${
                        expandedCountry === countryIndex
                          ? theme.palette.primary.main
                          : "transparent"
                      }`,
                      bgcolor:
                        expandedCountry === countryIndex
                          ? "rgba(25, 118, 210, 0.08)"
                          : "background.paper",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        py: 1.5,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography fontWeight={600}>
                          {countryItem.states || "Unknown Country"}
                        </Typography>
                        {countryItem.region && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {countryItem.region}
                          </Typography>
                        )}
                      </Box>
                      <Chip
                        label={countryItem.district?.length || 0}
                        size="small"
                        color={
                          expandedCountry === countryIndex
                            ? "primary"
                            : "default"
                        }
                      />
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>

            {/* Districts Column */}
            <Box
              sx={{
                width: isMobile ? "100%" : "300px",
                minWidth: isMobile ? "100%" : "300px",
                borderRight: isMobile ? "none" : "1px solid #e0e0e0",
                bgcolor:
                  expandedCountry !== null
                    ? "background.paper"
                    : "rgba(0,0,0,0.02)",
                display: isMobile
                  ? expandedCountry !== null
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
                <Map sx={{ mr: 1, color: "#fff" }} />
                Districts/States
                {isMobile && expandedCountry !== null && (
                  <IconButton
                    size="small"
                    onClick={() => setExpandedCountry(null)}
                    sx={{ ml: "auto" }}
                  >
                    <ArrowBack fontSize="small" />
                  </IconButton>
                )}
              </Typography>
              <Box sx={{ p: 1 }}>
                {expandedCountry !== null &&
                Array.isArray(data.country[expandedCountry].district) ? (
                  data.country[expandedCountry].district.length > 0 ? (
                    data.country[expandedCountry].district.map(
                      (distItem, distIndex) => {
                        const districtKey = `${expandedCountry}-${distIndex}`;
                        return (
                          <Card
                            key={`district-${districtKey}`}
                            onClick={() =>
                              toggleDistrict(expandedCountry, distIndex)
                            }
                            sx={{
                              mb: 1,
                              cursor: "pointer",
                              borderRadius: "6px",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                              borderLeft: `4px solid ${
                                expandedDistrict === districtKey
                                  ? theme.palette.secondary.main
                                  : "transparent"
                              }`,
                              bgcolor:
                                expandedDistrict === districtKey
                                  ? "rgba(255, 152, 0, 0.08)"
                                  : "background.paper",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                transform: "translateY(-1px)",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                              },
                            }}
                          >
                            <CardContent
                              sx={{
                                py: 1.5,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="subtitle1">
                                {distItem.district || "N/A"}
                              </Typography>
                              <Chip
                                label={distItem.cities?.length || 0}
                                size="small"
                                color={
                                  expandedDistrict === districtKey
                                    ? "secondary"
                                    : "default"
                                }
                              />
                            </CardContent>
                          </Card>
                        );
                      }
                    )
                  ) : (
                    <Box sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        <LocationOff
                          sx={{
                            fontSize: 40,
                            color: "action.disabled",
                            mb: 1,
                          }}
                        />
                        <br />
                        No districts/states available
                      </Typography>
                    </Box>
                  )
                ) : (
                  <Box sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      {expandedCountry === null ? (
                        <>
                          <ArrowBack
                            sx={{
                              fontSize: 40,
                              color: "action.disabled",
                              mb: 1,
                            }}
                          />
                          <br />
                          Select a country
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
            <Box
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
                Cities
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
                }}
              >
                {expandedDistrict !== null ? (
                  (() => {
                    const [countryIdx, districtIdx] = expandedDistrict
                      .split("-")
                      .map(Number);
                    const cities =
                      data.country[countryIdx]?.district[districtIdx]?.cities;

                    return Array.isArray(cities) && cities.length > 0 ? (
                      cities.map((city, cityIndex) => (
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
                          <CardContent
                            sx={{
                              py: 1.5,
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
                            <Typography variant="body2">{city}</Typography>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Box sx={{ p: 2, textAlign: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                          <LocationOff
                            sx={{
                              fontSize: 40,
                              color: "action.disabled",
                              mb: 1,
                            }}
                          />
                          <br />
                          No cities available
                        </Typography>
                      </Box>
                    );
                  })()
                ) : (
                  <Box sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      {expandedCountry === null ? (
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
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ExpansionLocationGridInternational;