
"use client";
// File: InternationalCityDrawer.js
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
} from "@mui/material";
import { ChevronDown, Search } from "lucide-react";

const InternationalCityDrawer = ({
  type,
  selections,
  drawerOpen,
  citiesData,
  searchFilters,
  handleInternationalCitySelection,
  handleSelectAllStateCities,
  handleSearchChange,
  toggleDrawer,
}) => {
  if (Object.keys(selections.selectedStates).length === 0) return null;

  // Calculate total cities
  const totalCities = Object.entries(selections.selectedStates).reduce(
    (total, [country, states]) =>
      total +
      states.reduce((acc, state) => {
        const stateKey = `${country}-${state}`;
        const cities = citiesData[stateKey] || [];
        return acc + cities.length;
      }, 0),
    0
  );

  const selectedCityCount = Object.values(selections.selectedCities).flat()
    .length;

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      {/* Trigger Button */}
      <Button
        variant="outlined"
        color="warning"
        fullWidth
        onClick={() => toggleDrawer(type, { intCities: true })}
        endIcon={<ChevronDown />}
        sx={{ justifyContent: "space-between" }}
      >
        {selectedCityCount > 0
          ? `${selectedCityCount} cities selected`
          : "Select Cities"}
      </Button>

      {/* Drawer UI */}
      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => toggleDrawer(type, { intCities: false })}
        PaperProps={{
          sx: {
            width: "98%",
            height: "100vh",
            borderRadius: 0,
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
            fontWeight={700}
            sx={{ color: "#ff9800" }}
          >
            Select Cities
          </Typography>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => toggleDrawer(type, { intCities: false })}
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
          onChange={(e) => handleSearchChange("intCities", e.target.value)}
          InputProps={{
            startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
          }}
        />

        {/* Select All Cities */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Checkbox
            checked={
              selectedCityCount > 0 && selectedCityCount === totalCities
            }
            indeterminate={
              selectedCityCount > 0 && selectedCityCount < totalCities
            }
            onChange={() => {
              const shouldSelectAll = selectedCityCount !== totalCities;

              Object.entries(selections.selectedStates).forEach(
                ([country, states]) => {
                  states.forEach((state) => {
                    const stateKey = `${country}-${state}`;
                    const cities = citiesData[stateKey] || [];
                    handleSelectAllStateCities(
                      country,
                      state,
                      cities,
                      shouldSelectAll,
                      type
                    );
                  });
                }
              );
            }}
          />
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Select All Cities
          </Typography>
        </Box>

        {/* Country / State Sections */}
        <Box sx={{ flex: 1, overflow: "auto" }}>
          {Object.entries(selections.selectedStates).map(
            ([country, states]) =>
              states.map((state) => {
                const stateKey = `${country}-${state}`;
                const cities = citiesData[stateKey] || [];

                const filteredCities = cities
                  .filter((city) =>
                    city
                      .toLowerCase()
                      .includes(searchFilters.intCities.toLowerCase())
                  )
                  .sort((a, b) => a.localeCompare(b));

                const selectedCities =
                  selections.selectedCities[stateKey] || [];
                const allSelected = filteredCities.every((city) =>
                  selectedCities.includes(city)
                );

                if (filteredCities.length === 0) return null;

                return (
                  <Box key={`cities-section-${stateKey}`} sx={{ mb: 4 }}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <Checkbox
                        checked={allSelected}
                        indeterminate={
                          selectedCities.length > 0 && !allSelected
                        }
                        onChange={() =>
                          handleSelectAllStateCities(
                            country,
                            state,
                            filteredCities,
                            !allSelected,
                            type
                          )
                        }
                      />
                      <Typography
                        variant="subtitle1"
                        sx={{ color: "orange", ml: 1 }}
                      >
                        {country} - {state}
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
                      {filteredCities.map((city) => {
                        const isSelected = selectedCities.includes(city);
                        return (
                          <FormControlLabel
                            key={`city-${stateKey}-${city}`}
                            control={
                              <Checkbox
                                checked={isSelected}
                                onChange={() =>
                                  handleInternationalCitySelection(
                                    country,
                                    state,
                                    city,
                                    !isSelected,
                                    type
                                  )
                                }
                              />
                            }
                            label={city}
                          />
                        );
                      })}
                    </Box>
                  </Box>
                );
              })
          )}
        </Box>
      </Drawer>

      {/* Accordion for Selected Cities */}
      {selectedCityCount > 0 && (
        <Box sx={{ mt: 2 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ChevronDown />}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                View Selected Cities ({selectedCityCount})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {Object.entries(selections.selectedCities).map(
                ([stateKey, cities]) => {
                  const [country, state] = stateKey.split("-");
                  return (
                    <Box key={`selected-cities-${stateKey}`} sx={{ mb: 4 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ color: "orange", mb: 1 }}
                      >
                        {country} - {state}
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
                        {cities.map((city, index) => (
                          <Chip
                            key={`selected-city-${stateKey}-${city}-${index}`}
                            label={city}
                            onDelete={() =>
                              handleInternationalCitySelection(
                                country,
                                state,
                                city,
                                false,
                                type
                              )
                            }
                            color="success"
                            variant="outlined"
                            sx={{
                              "& .MuiChip-label": {
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  );
                }
              )}
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  );
};

export default InternationalCityDrawer;