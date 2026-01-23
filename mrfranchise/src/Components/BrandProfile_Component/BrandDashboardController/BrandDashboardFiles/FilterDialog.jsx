// components/FilterDialog.js
"use client";
import React from "react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useMediaQuery, useTheme } from "@mui/material";
import Close from "@mui/icons-material/Close";

const colors = {
  cardBackground: "#ffffff",
  textPrimary: "#2c3e50",
  textSecondary: "#7f8c8d",
  divider: "#ecf0f1",
  accent: "#3498db",
  secondary: "#34495e",
};

const FilterDialog = ({
  open,
  onClose,

  dateFilter,
  setDateFilter,

  dateFilters,
  onReset,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          minHeight: isMobile ? "100vh" : "auto",
          maxHeight: isMobile ? "100vh" : "80vh",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: isMobile ? 2 : 3,
          pb: isMobile ? 1 : 2,
          borderBottom: `1px solid ${colors.divider}`,
          backgroundColor: colors.cardBackground,
        }}
      >
        <DialogTitle
          sx={{
            color: colors.textPrimary,
            backgroundColor: colors.cardBackground,
            p: 0,
            fontSize: isMobile ? "1.25rem" : "1.5rem",
            fontWeight: 600,
          }}
        >
          Filter Leads
        </DialogTitle>
        <IconButton
          onClick={onClose}
          sx={{
            color: colors.textSecondary,
            p: isMobile ? 1 : 1.5,
          }}
          size={isMobile ? "small" : "medium"}
        >
          <Close fontSize={isMobile ? "medium" : "large"} />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent
        sx={{
          backgroundColor: colors.cardBackground,
          p: isMobile ? 2 : 3,
          "&:first-of-type": {
            pt: isMobile ? 2 : 3,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? 2 : 3,
          }}
        >
          {/* Investment Range Filter - Commented but kept for future use */}
          {/* <FormControl fullWidth size={isMobile ? "small" : "medium"}>
            <InputLabel 
              sx={{ 
                color: colors.textSecondary,
                fontSize: isMobile ? "0.875rem" : "1rem",
              }}
            >
              Investment Range
            </InputLabel>
            <Select
              label="Investment Range"
              value={investmentFilter}
              onChange={(e) => setInvestmentFilter(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.divider },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: colors.accent },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: colors.accent },
              }}
            >
              <MenuItem value="all">All Ranges</MenuItem>
              {uniqueInvestmentRanges.map((range) => (
                <MenuItem key={range} value={range}>
                  {range}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}

          {/* Category Filter - Commented but kept for future use */}
          {/* <FormControl fullWidth size={isMobile ? "small" : "medium"}>
            <InputLabel 
              sx={{ 
                color: colors.textSecondary,
                fontSize: isMobile ? "0.875rem" : "1rem",
              }}
            >
              Category
            </InputLabel>
            <Select
              label="Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.divider },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: colors.accent },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: colors.accent },
              }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {uniqueCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}

          {/* Location Filter - Commented but kept for future use */}
          {/* <FormControl fullWidth size={isMobile ? "small" : "medium"}>
            <InputLabel 
              sx={{ 
                color: colors.textSecondary,
                fontSize: isMobile ? "0.875rem" : "1rem",
              }}
            >
              Location
            </InputLabel>
            <Select
              label="Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.divider },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: colors.accent },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: colors.accent },
              }}
            >
              <MenuItem value="all">All Locations</MenuItem>
              {uniqueLocations.map((location) => (
                <MenuItem key={location} value={location}>
                  {location}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}

          {/* Date Filter - Active */}
          <FormControl fullWidth size={isMobile ? "small" : "medium"}>
            <InputLabel
              sx={{
                color: colors.textSecondary,
                fontSize: isMobile ? "0.875rem" : "1rem",
              }}
            >
              Time Period
            </InputLabel>
            <Select
              label="Time Period"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.divider,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.accent,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.accent,
                },
              }}
            >
              {dateFilters.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  sx={{
                    fontSize: isMobile ? "0.875rem" : "1rem",
                    py: isMobile ? 1 : 1.5,
                  }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      {/* Footer Actions */}
      <DialogActions
        sx={{
          backgroundColor: colors.cardBackground,
          p: isMobile ? 2 : 3,
          pt: isMobile ? 1 : 2,
          gap: isMobile ? 1 : 2,
          borderTop: `1px solid ${colors.divider}`,
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <Button
          onClick={onReset}
          sx={{
            color: colors.textSecondary,
            fontSize: isMobile ? "0.875rem" : "1rem",
            py: isMobile ? 1 : 1.25,
            width: isMobile ? "100%" : "auto",
            order: isMobile ? 2 : 1,
          }}
          size={isMobile ? "medium" : "large"}
        >
          Reset Filters
        </Button>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            backgroundColor: colors.accent,
            color: "#fff",
            fontSize: isMobile ? "0.875rem" : "1rem",
            py: isMobile ? 1 : 1.25,
            px: isMobile ? 3 : 4,
            width: isMobile ? "100%" : "auto",
            order: isMobile ? 1 : 2,
            "&:hover": {
              backgroundColor: colors.secondary,
              transform: isMobile ? "none" : "translateY(-1px)",
            },
            transition: "all 0.2s ease",
            boxShadow: "0 2px 8px rgba(52, 152, 219, 0.3)",
          }}
          size={isMobile ? "medium" : "large"}
        >
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;
