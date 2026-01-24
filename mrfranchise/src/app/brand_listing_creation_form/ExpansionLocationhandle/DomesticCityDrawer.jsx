"use client";

// File: DomesticCityDrawer.js
import React from "react";
import {
  Box,
  Typography,
  Button,
  Checkbox,
  TextField,
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  FormControlLabel,
  Skeleton,
} from "@mui/material";
import { ChevronDown, Search } from "lucide-react";

const DomesticCityDrawer = ({
  type,
  selections,
  drawerOpen,
  statesData,
  searchFilters,
  handleDomesticCitySelection,
  handleSearchChange,
  handleSelectAllCities,
  toggleDrawer,
}) => {
  if (selections.selectedDistricts.length === 0) return <Skeleton/>;

  // Group districts by state
  const districtsByState = selections.selectedDistricts.reduce(
    (acc, { state, district }) => {
      if (!acc[state]) acc[state] = [];
      acc[state].push(district);
      return acc;
    },
    {}
  );

  // Group selected cities by district key
  const citiesByDistrict = selections.selectedCities.reduce(
    (acc, { state, district, city }) => {
      const key = `${state}-${district}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(city);
      return acc;
    },
    {}
  );

  const totalCities = selections.selectedDistricts.reduce(
    (total, { state, district }) => {
      const stateData = statesData.find((s) => s.name === state);
      const cities =
        stateData?.cities?.filter((c) => c.district === district) || [];
      return total + cities.length;
    },
    0
  );

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      {/* Trigger Button */}
      <Button
        variant="outlined"
        color="warning"
        fullWidth
        onClick={() => toggleDrawer(type, { cities: true })}
        endIcon={<ChevronDown />}
        sx={{ justifyContent: "space-between" }}
      >
        {selections.selectedCities.length > 0
          ? `${selections.selectedCities.length} cities selected`
          : "Select Cities"}
      </Button>

      {/* Drawer */}
      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => toggleDrawer(type, { cities: false })}
        PaperProps={{
          sx: {
            width: "98%",
            height: "100vh",
            p: 2,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "#ff9800", fontWeight: 700 }}
          >
            Select Cities
          </Typography>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => toggleDrawer(type, { cities: false })}
          >
            Done
          </Button>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search cities..."
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
          onChange={(e) => handleSearchChange("cities", e.target.value)}
          InputProps={{
            startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
          }}
        />

        {/* Select All Cities Checkbox */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Checkbox
            checked={selections.selectedCities.length === totalCities}
            indeterminate={
              selections.selectedCities.length > 0 &&
              selections.selectedCities.length < totalCities
            }
            onChange={() => {
              selections.selectedDistricts.forEach(
                ({ state, district }) => {
                  const stateData = statesData.find(
                    (s) => s.name === state
                  );
                  const cities =
                    stateData?.cities
                      ?.filter((c) => c.district === district)
                      .map((c) => c.name) || [];
                  handleSelectAllCities(
                    state,
                    district,
                    cities,
                    selections.selectedCities.length !== totalCities,
                    type
                  );
                }
              );
            }}
          />
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Select All Cities
          </Typography>
        </Box>

        {/* City List */}
        <Box sx={{ flex: 1, overflow: "auto" }}>
          {Object.entries(districtsByState).map(
            ([stateName, districts]) => {
              const state = statesData.find((s) => s.name === stateName);
              if (!state) return <Skeleton/>;

              return districts.map((districtName) => {
                const districtKey = `${stateName}-${districtName}`;
                const cities = state.cities
                  .filter((c) => c.district === districtName)
                  .map((c) => c.name)
                  .filter((c) =>
                    c.toLowerCase().includes(searchFilters.cities)
                  )
                  .sort();

                if (cities.length === 0) return null;

                const selectedCities = citiesByDistrict[districtKey] || [];
                const allSelected = cities.every((city) =>
                  selectedCities.includes(city)
                );

                return (
                  <Box key={`cities-section-${districtKey}`} sx={{ mb: 4 }}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <Checkbox
                        checked={allSelected}
                        indeterminate={
                          selectedCities.length > 0 && !allSelected
                        }
                        onChange={() =>
                          handleSelectAllCities(
                            stateName,
                            districtName,
                            cities,
                            !allSelected,
                            type
                          )
                        }
                      />
                      <Typography
                        variant="subtitle1"
                        sx={{ color: "orange", ml: 1 }}
                      >
                        {stateName} - {districtName}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(5, 1fr)",
                        gap: 1,
                        ml: 4,
                      }}
                    >
                      {cities.map((city) => (
                        <FormControlLabel
                          key={`city-${districtKey}-${city}`}
                          control={
                            <Checkbox
                              checked={selectedCities.includes(city)}
                              onChange={() =>
                                handleDomesticCitySelection(
                                  stateName,
                                  districtName,
                                  city,
                                  !selectedCities.includes(city),
                                  type
                                )
                              }
                            />
                          }
                          label={city}
                        />
                      ))}
                    </Box>
                  </Box>
                );
              });
            }
          )}
        </Box>
      </Drawer>

      {/* Accordion for Selected Cities */}
      {selections.selectedCities.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ChevronDown />}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                View Selected Cities ({selections.selectedCities.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {Object.entries(citiesByDistrict).map(([key, cities]) => {
                const [state, district] = key.split("-");
                return (
                  <Box key={`selected-cities-${key}`} sx={{ mb: 4 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "orange", mb: 1 }}
                    >
                      {state} - {district}
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: 1,
                        ml: 2,
                      }}
                    >
                      {cities.map((city, i) => (
                        <Chip
                          key={`selected-city-${key}-${city}-${i}`}
                          label={city}
                          onDelete={() =>
                            handleDomesticCitySelection(
                              state,
                              district,
                              city,
                              false,
                              type
                            )
                          }
                          color="success"
                          variant="outlined"
                          sx={{ mb: 1 }}
                        />
                      ))}
                    </Box>
                  </Box>
                );
              })}
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  );
};

export default DomesticCityDrawer;