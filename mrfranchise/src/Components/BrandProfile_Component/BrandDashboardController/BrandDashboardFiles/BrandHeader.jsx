"use client";
import React from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";

import { useMediaQuery, useTheme } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";

const StatCard = ({ icon: Icon, title, value, borderColor }) => (
  <Card
    sx={{
      minWidth: 90,
      textAlign: "center",
      boxShadow: 1,
      borderRadius: "10px",
      borderLeft: `3px solid ${borderColor}`,
      p: 1,
    }}
  >
    <Box
      sx={{
        width: 30,
        height: 30,
        borderRadius: "50%",
        bgcolor: borderColor,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mx: "auto",
        mb: 0.5,
      }}
    >
      <Icon sx={{ fontSize: 16 }} />
    </Box>

    <Typography variant="caption" sx={{ color: "#777" }}>
      {title}
    </Typography>
    <Typography variant="h6" fontWeight="bold" sx={{ m: 0, lineHeight: 1 }}>
      {value}
    </Typography>
  </Card>
);

const BrandHeader = ({ brandData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  //  console.log("===brandData=== :",brandData)
  return (
    <Card
      sx={{
        mb: 2,
        p: isMobile ? 1.5 : 2,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center",
        gap: 2,
        boxShadow: 1,
        borderRadius: "12px",
      }}
    >
      {/* Brand Info */}
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1.5, flexGrow: 1 }}
      >
        <Avatar
          src={brandData?.uploads?.logo || "/default-brand.png"}
          sx={{
            width: isMobile ? 55 : 70,
            height: isMobile ? 55 : 70,
            border: "2px solid #3498db",
          }}
        />

        <Box sx={{ overflow: "hidden" }}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            fontWeight={600}
            noWrap
            sx={{ lineHeight: 1.2 }}
          >
            {brandData?.brandDetails?.brandName || "Brand Name"}
          </Typography>

          <Typography variant="caption" sx={{ color: "#777" }}>
            Member ID: {brandData?.brandID || "N/A"}
          </Typography>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={1} sx={{ width: isMobile ? "100%" : "auto" }}>
        <Grid item xs={4}>
          <StatCard
            icon={VisibilityIcon}
            title="Views"
            value={brandData.totalViewCount || 0}
            borderColor="#1976d2"
          />
        </Grid>
        <Grid item xs={4}>
          <StatCard
            icon={FavoriteIcon}
            title="Likes"
            value={brandData.totalLikedCount || 0}
            borderColor="#e53935"
          />
        </Grid>
        <Grid item xs={4}>
          <StatCard
            icon={BookmarkIcon}
            title="Sortlist"
            value={brandData.totalSortlistCount || 0}
            borderColor="#43a047"
          />
        </Grid>
      </Grid>
    </Card>
  );
};

export default BrandHeader;
