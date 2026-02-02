"use client";

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

const DomesticStateDrawer = ({
  type,
  selections,
  drawerOpen,
  sortedStates,
  handleDomesticStateSelection,
  handleSearchChange,
  toggleDrawer,
}) => {
  const allStatesSelected =
    selections.selectedStates.length === sortedStates.length;
  const someStatesSelected =
    selections.selectedStates.length > 0 && !allStatesSelected;

  return (
    <Box sx={{ mt: 4, mb: 3 }}>
      {/* Trigger Button */}
      <Button
        variant="outlined"
        fullWidth
        color="warning"
        onClick={() => toggleDrawer(type, { states: true })}
        endIcon={<ChevronDown />}
        sx={{ justifyContent: "space-between" }}
      >
        {selections.selectedStates.length > 0
          ? `${selections.selectedStates.length} states selected`
          : "Select States"}
      </Button>

      {/* Main State Drawer */}
      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => toggleDrawer(type, { states: false })}
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
            mb: 3,
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
            onClick={() => toggleDrawer(type, { states: false })}
          >
            Done
          </Button>
        </Box>

        {/* Search Field */}
        <TextField
          placeholder="Search states..."
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
          onChange={(e) => handleSearchChange("states", e.target.value)}
          InputProps={{
            startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
          }}
        />

        {/* Select All */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Checkbox
            checked={allStatesSelected}
            indeterminate={someStatesSelected}
            onChange={() => {
              handleDomesticStateSelection(
                allStatesSelected ? [] : sortedStates.map((s) => s.name),
                type
              );
            }}
          />
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Select All States
          </Typography>
        </Box>

        {/* States Grid */}
        <Box sx={{ flex: 1, overflow: "auto", mt: 1 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 1,
              px: 5,
            }}
          >
            {sortedStates.map((state) => {
              const isSelected = selections.selectedStates.includes(
                state.name
              );
              return (
                <FormControlLabel
                  key={`state-${state.name}`}
                  control={
                    <Checkbox
                      checked={isSelected}
                      onChange={() => {
                        const updated = isSelected
                          ? selections.selectedStates.filter(
                              (s) => s !== state.name
                            )
                          : [...selections.selectedStates, state.name];
                        handleDomesticStateSelection(updated, type);
                      }}
                    />
                  }
                  label={state.name}
                />
              );
            })}
          </Box>
        </Box>
      </Drawer>

      {/* Selected States Accordion */}
      {selections.selectedStates.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ChevronDown />}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                View Selected States ({selections.selectedStates.length})
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
                {selections.selectedStates.map((state, index) => (
                  <Chip
                    key={`selected-state-${index}`}
                    label={state}
                    onDelete={() => {
                      const updated = selections.selectedStates.filter(
                        (_, i) => i !== index
                      );
                      handleDomesticStateSelection(updated, type);
                    }}
                    variant="outlined"
                    sx={{ mb: 1 }}
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

export default DomesticStateDrawer;