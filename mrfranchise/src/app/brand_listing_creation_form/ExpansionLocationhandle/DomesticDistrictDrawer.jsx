"use client";

// File: DomesticDistrictDrawer.js
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

const DomesticDistrictDrawer = ({
  type,
  selections,
  drawerOpen,
  districtsData, // Changed from statesData to districtsData
  searchFilters,
  handleDomesticDistrictSelection,
  handleSearchChange,
  handleSelectAllDistricts,
  toggleDrawer,
}) => {
  if (selections.selectedStates.length === 0) return null;

  // Group selected districts by state
  const districtsByState = selections.selectedDistricts.reduce(
    (acc, { state, district }) => {
      if (!acc[state]) acc[state] = [];
      acc[state].push(district);
      return acc;
    },
    {}
  );

  // Calculate total available districts
  const totalDistricts = selections.selectedStates.reduce(
    (total, stateName) => {
      return total + (districtsData[stateName]?.length || 0);
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
        onClick={() => toggleDrawer(type, { districts: true })}
        endIcon={<ChevronDown />}
        sx={{ justifyContent: "space-between" }}
      >
        {selections.selectedDistricts.length > 0
          ? `${selections.selectedDistricts.length} cities selected`
          : "Select Cities"}
      </Button>

      {/* Drawer for District Selection */}
      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => toggleDrawer(type, { districts: false })}
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
            Select Cities
          </Typography>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => toggleDrawer(type, { districts: false })}
          >
            Done
          </Button>
        </Box>

        {/* Search Field */}
        <TextField
          fullWidth
          placeholder="Search districts..."
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
          onChange={(e) => handleSearchChange("districts", e.target.value)}
          InputProps={{
            startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
          }}
        />

        {/* Select All */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Checkbox
            checked={
              selections.selectedDistricts.length > 0 &&
              selections.selectedDistricts.length === totalDistricts
            }
            indeterminate={
              selections.selectedDistricts.length > 0 &&
              selections.selectedDistricts.length < totalDistricts
            }
            onChange={() => {
              selections.selectedStates.forEach((stateName) => {
                const stateDistricts = districtsData[stateName] || [];
                handleSelectAllDistricts(
                  stateName,
                  stateDistricts,
                  selections.selectedDistricts.length !== totalDistricts,
                  type
                );
              });
            }}
          />
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Select All cities
          </Typography>
        </Box>

        {/* District Checkboxes */}
        <Box sx={{ flex: 1, overflow: "auto" }}>
          {selections.selectedStates.map((stateName) => {
            const stateDistricts = (districtsData[stateName] || [])
              .filter((d) =>
                d.toLowerCase().includes(searchFilters.districts.toLowerCase())
              )
              .sort((a, b) => a.localeCompare(b));

            if (stateDistricts.length === 0) return null;

            const selectedDistrictsForState = selections.selectedDistricts
              .filter((d) => d.state === stateName)
              .map((d) => d.district);

            const allSelected = stateDistricts.every((d) =>
              selectedDistrictsForState.includes(d)
            );

            return (
              <Box key={`districts-section-${stateName}`} sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Checkbox
                    checked={allSelected}
                    indeterminate={
                      selectedDistrictsForState.length > 0 && !allSelected
                    }
                    onChange={() =>
                      handleSelectAllDistricts(
                        stateName,
                        stateDistricts,
                        !allSelected,
                        type
                      )
                    }
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "orange", ml: 1 }}
                  >
                    {stateName}
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
                  {stateDistricts.map((district) => {
                    const isSelected = selectedDistrictsForState.includes(district);
                    return (
                      <FormControlLabel
                        key={`district-${stateName}-${district}`}
                        control={
                          <Checkbox
                            checked={isSelected}
                            onChange={() =>
                              handleDomesticDistrictSelection(
                                stateName,
                                district,
                                !isSelected,
                                type
                              )
                            }
                          />
                        }
                        label={district}
                      />
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Drawer>

      {/* Accordion for Selected Districts */}
      {selections.selectedDistricts.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ChevronDown />}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                View Selected cities ({selections.selectedDistricts.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {Object.entries(districtsByState).map(
                ([state, districts]) => (
                  <Box key={`selected-districts-${state}`} sx={{ mb: 4 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "orange", mb: 1 }}
                    >
                      {state}
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
                      {districts.map((district, index) => (
                        <Chip
                          key={`selected-district-${state}-${district}-${index}`}
                          label={district}
                          onDelete={() =>
                            handleDomesticDistrictSelection(
                              state,
                              district,
                              false,
                              type
                            )
                          }
                          variant="outlined"
                          sx={{ mb: 1 }}
                        />
                      ))}
                    </Box>
                  </Box>
                )
              )}
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  );
};

export default DomesticDistrictDrawer;