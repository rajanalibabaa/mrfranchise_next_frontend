
"use client";
// File: InternationalCountryDrawer.js
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

const InternationalCountryDrawer = ({
  type,
  selections,
  drawerOpen,
  sortedCountries,
  searchFilters,
  handleInternationalCountrySelection,
  handleSearchChange,
  toggleDrawer,
}) => {
  const allSelected =
    selections.selectedCountries.length === sortedCountries.length;
  const someSelected =
    selections.selectedCountries.length > 0 && !allSelected;

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      {/* Trigger Button */}
      <Button
        variant="outlined"
        color="success"
        fullWidth
        onClick={() => toggleDrawer(type, { countries: true })}
        endIcon={<ChevronDown />}
        sx={{ justifyContent: "space-between" }}
      >
        {selections.selectedCountries.length > 0
          ? `${selections.selectedCountries.length} countries selected`
          : "Select Countries"}
      </Button>

      {/* Drawer */}
      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => toggleDrawer(type, { countries: false })}
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
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Select Countries
          </Typography>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => toggleDrawer(type, { countries: false })}
          >
            Done
          </Button>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search countries..."
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
          onChange={(e) => handleSearchChange("countries", e.target.value)}
          InputProps={{
            startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
          }}
        />

        {/* Select All */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Checkbox
            checked={allSelected}
            indeterminate={someSelected}
            onChange={async () => {
              const updated = allSelected
                ? []
                : sortedCountries.map((c) => c.name);
              await handleInternationalCountrySelection(updated, type);
            }}
          />
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Select All Countries
          </Typography>
        </Box>

        {/* Country List */}
        <Box sx={{ flex: 1, overflow: "auto" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 1,
            }}
          >
            {sortedCountries
              .filter((country) =>
                country.name
                  .toLowerCase()
                  .includes(searchFilters.countries.toLowerCase())
              )
              .map((country) => {
                const isSelected = selections.selectedCountries.includes(
                  country.name
                );
                return (
                  <FormControlLabel
                    key={`country-${country.name}`}
                    control={
                      <Checkbox
                        checked={isSelected}
                        onChange={async () => {
                          const updated = isSelected
                            ? selections.selectedCountries.filter(
                                (c) => c !== country.name
                              )
                            : [
                                ...selections.selectedCountries,
                                country.name,
                              ];
                          await handleInternationalCountrySelection(
                            updated,
                            type
                          );
                        }}
                      />
                    }
                    label={country.name}
                  />
                );
              })}
          </Box>
        </Box>
      </Drawer>

      {/* Accordion: Selected Countries */}
      {selections.selectedCountries.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ChevronDown />}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                View Selected Countries (
                {selections.selectedCountries.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: 1,
                }}
              >
                {selections.selectedCountries.map((country, index) => (
                  <Chip
                    key={`selected-country-${index}`}
                    label={country}
                    onDelete={async () => {
                      const updated = selections.selectedCountries.filter(
                        (_, i) => i !== index
                      );
                      await handleInternationalCountrySelection(
                        updated,
                        type
                      );
                    }}
                    color="success"
                    variant="outlined"
                  />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  );
};

export default InternationalCountryDrawer;