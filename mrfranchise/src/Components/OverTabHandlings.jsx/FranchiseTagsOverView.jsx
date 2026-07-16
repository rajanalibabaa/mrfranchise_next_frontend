
"use client";
import React from "react";
import {
  Box,
  Typography,
  Divider,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const FranchiseTagsOverView = ({ serviceTags }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  if (!Array.isArray(serviceTags) || serviceTags.length === 0) return null;

  // console.log("serviceTags", serviceTags);

  return (
    <Box
      sx={{
        mb: 2,
        mt: 2,
        borderRadius: 2,
        width: "100%",
        px: { xs: 0, sm: 2, md: 0 },
      }}
    >
      {/* Optional Title Section */}
      {/* 
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ 
          mb: 1.5, 
          color: "#7ad03a",
          fontSize: { xs: '1rem', sm: '1.25rem' }
        }}
      >
        Tags
      </Typography>
      */}

      {/* Main Container */}
      <Box
        sx={{
          borderRadius: { xs: 2, md: 4 },
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Box>
            {serviceTags.map((item, index) => {
              const tags = Array.isArray(item?.tags) ? item.tags : [];
              if (tags.length === 0) return null;

              return (
                <Box
                  key={item._id || index}
                  sx={{
                    "&:last-child td, &:last-child th": { borderBottom: 0 },
                    backgroundColor: "#ffffffff",
                    "&:hover": {
                      cursor: "pointer",
                    },
                    // Responsive flex direction
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    // Add gap between items on mobile
                    mb: { xs: 0, sm: 0 },
                    // Add border on mobile for separation
                    borderRadius: { xs: 0, sm: 0 },
                    boxShadow: { 
                      xs: "0 1px 3px rgba(0,0,0,0.08)", 
                      sm: "none" 
                    },
                  }}
                >
                  {/* LEFT CELL - PARENT/CATEGORY */}
                  <Box
                    sx={{
                      // Responsive width
                      width: { xs: "100%", sm: "35%", md: "30%", lg: "25%" },
                      py: { xs: 1.5, sm: 2 },
                      px: { xs: 2, sm: 3 },
                      backgroundColor: "#ffffff",
                      border: "none",
                      // Responsive border
                      borderRight: { xs: "none", sm: "1px solid #e0e0e0" },
                      borderBottom: { xs: "1px solid #e0e0e0", sm: "none" },
                      fontWeight: 600,
                      color: "#000000",
                      textTransform: "capitalize",
                      verticalAlign: "top",
                    }}
                  >
                    <Box
                      sx={{
                        height: { xs: "34px", sm: "38px" },
                        backgroundColor: "white",
                        border: "1px solid #e0e0e0",
                        borderLeft: { xs: "4px solid #7ad03a", sm: "5px solid #7ad03a" },
                        borderRadius: "4px",
                        color: "#000000ff",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        pl: { xs: 1.5, sm: 2 },
                        fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                        "&:hover": {
                          backgroundColor: "#ffffffff",
                          color: "#000000ff",
                          borderLeft: "2px solid #5fb52a",
                        },
                      }}
                    >
                      {item.parent}
                    </Box>
                  </Box>

                  {/* RIGHT CELL - TAGS */}
                  <Box
                    sx={{
                      // Responsive width
                      width: { xs: "100%", sm: "65%", md: "70%", lg: "75%" },
                      py: { xs: 1.5, sm: 2 },
                      px: { xs: 2, sm: 3 },
                      verticalAlign: "top",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: { xs: 0.75, sm: 1 },
                        alignItems: "center",
                        // Justify content on mobile
                        justifyContent: { xs: "flex-start", sm: "flex-start" },
                      }}
                    >
                      {tags.map((tag, i) => (
                        <Chip
                          key={i}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{
                            // Responsive height
                            height: { xs: "32px", sm: "36px", md: "38px" },
                            backgroundColor: "#ffffffff",
                            border: "1px solid #e0e0e0",
                            borderLeft: { 
                              xs: "4px solid #ff9800", 
                              sm: "5px solid #ff9800" 
                            },
                            borderRadius: "4px",
                            color: "#000000ff",
                            fontWeight: 500,
                            // Limit max width on mobile
                            maxWidth: { xs: "calc(50% - 8px)", sm: "none" },
                            "&:hover": {
                              backgroundColor: "#fff3e0",
                              color: "#333333",
                              borderLeft: "2px solid #ff9800",
                            },
                            "& .MuiChip-label": {
                              padding: { xs: "0 8px", sm: "0 10px" },
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              fontSize: { 
                                xs: "0.7rem", 
                                sm: "0.75rem", 
                                md: "0.8125rem" 
                              },
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FranchiseTagsOverView;