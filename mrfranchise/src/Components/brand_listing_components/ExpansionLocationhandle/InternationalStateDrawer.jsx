"use client";

// File: InternationalStateDrawer.js
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

const InternationalStateDrawer = ({
  type,
  selections,
  drawerOpen,
  statesData,
  searchFilters,
  handleInternationalStateSelection,
  handleSelectAllStates,
  handleSearchChange,
  toggleDrawer,
}) => {
  if (selections.selectedCountries.length === 0) return <Skeleton/>;

  // Group selected states by country
  const statesByCountry = selections.selectedStates;

  // Calculate total available states
  const totalStates = selections.selectedCountries.reduce(
    (total, country) => {
      const states = statesData[country] || [];
      return total + states.length;
    },
    0
  );

  const selectedCount = Object.values(statesByCountry).reduce(
    (acc, states) => acc + states.length,
    0
  );

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      {/* Trigger Button */}
      <Button
        variant="outlined"
        color="warning"
        fullWidth
        onClick={() => toggleDrawer(type, { intStates: true })}
        endIcon={<ChevronDown />}
        sx={{ justifyContent: "space-between" }}
      >
        {selectedCount > 0
          ? `${selectedCount} states selected`
          : "Select States"}
      </Button>

      {/* Drawer for State Selection */}
      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => toggleDrawer(type, { intStates: false })}
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
            Select States
          </Typography>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => toggleDrawer(type, { intStates: false })}
          >
            Done
          </Button>
        </Box>

        {/* Search Field */}
        <TextField
          fullWidth
          placeholder="Search states..."
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
          onChange={(e) => handleSearchChange("intStates", e.target.value)}
          InputProps={{
            startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
          }}
        />

        {/* Select All */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Checkbox
            checked={selectedCount > 0 && selectedCount === totalStates}
            indeterminate={selectedCount > 0 && selectedCount < totalStates}
            onChange={() => {
              selections.selectedCountries.forEach((country) => {
                const states = (statesData[country] || []).map(
                  (s) => s.name
                );
                handleSelectAllStates(
                  country,
                  states,
                  selectedCount !== totalStates,
                  type
                );
              });
            }}
          />
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Select All States
          </Typography>
        </Box>

        {/* State Checkboxes */}
        <Box sx={{ flex: 1, overflow: "auto" }}>
          {selections.selectedCountries.map((country) => {
            const allStates = statesData[country] || [];
            const filteredStates = allStates
              .filter((s) =>
                s.name
                  .toLowerCase()
                  .includes(searchFilters.intStates.toLowerCase())
              )
              .sort((a, b) => a.name.localeCompare(b.name));

            if (filteredStates.length === 0) return <Skeleton/>;

            const selectedStates = statesByCountry[country] || [];
            const allSelected = filteredStates.every((s) =>
              selectedStates.includes(s.name)
            );

            return (
              <Box key={`states-section-${country}`} sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Checkbox
                    checked={allSelected}
                    indeterminate={
                      selectedStates.length > 0 && !allSelected
                    }
                    onChange={() => {
                      const stateNames = filteredStates.map((s) => s.name);
                      handleSelectAllStates(
                        country,
                        stateNames,
                        !allSelected,
                        type
                      );
                    }}
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "orange", ml: 1 }}
                  >
                    {country}
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
                  {filteredStates.map((state) => {
                    const isSelected = selectedStates.includes(state.name);
                    return (
                      <FormControlLabel
                        key={`state-${country}-${state.name}`}
                        control={
                          <Checkbox
                            checked={isSelected}
                            onChange={() =>
                              handleInternationalStateSelection(
                                country,
                                state.name,
                                !isSelected,
                                type
                              )
                            }
                          />
                        }
                        label={state.name}
                      />
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Drawer>

      {/* Accordion for Selected States */}
      {selectedCount > 0 && (
        <Box sx={{ mt: 2 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ChevronDown />}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                View Selected States ({selectedCount})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {Object.entries(statesByCountry).map(([country, states]) => (
                <Box key={`selected-states-${country}`} sx={{ mb: 4 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "orange", mb: 1 }}
                  >
                    {country}
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
                    {states.map((state, index) => (
                      <Chip
                        key={`selected-state-${country}-${state}-${index}`}
                        label={state}
                        onDelete={() =>
                          handleInternationalStateSelection(
                            country,
                            state,
                            false,
                            type
                          )
                        }
                        variant="outlined"
                        color="success"
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Box>
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  );
};

export default InternationalStateDrawer;