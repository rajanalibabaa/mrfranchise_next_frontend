"use client";
import React from "react";
import { alpha } from "@mui/material/styles";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

const getSectionIcon = (title = "") => {
  const text = title.toLowerCase();

  if (text.includes("brand")) return <StorefrontOutlinedIcon sx={{ fontSize: 18 }} />;
  if (text.includes("company")) return <BusinessOutlinedIcon sx={{ fontSize: 18 }} />;
  if (text.includes("industry")) return <BusinessOutlinedIcon sx={{ fontSize: 18 }} />;
  if (text.includes("tag")) return <LocalOfferOutlinedIcon sx={{ fontSize: 18 }} />;
  if (text.includes("category")) return <CategoryOutlinedIcon sx={{ fontSize: 18 }} />;

  return <CategoryOutlinedIcon sx={{ fontSize: 18 }} />;
};

const getInitials = (text = "") => {
  return text
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
};

const SuggestionSection = ({
  title,
  items = [],
  labelKey,
  handleSelectedSuggestionData,
}) => {
  if (!items.length) return null;

  return (
    <Box
      sx={{
        mt: 1.5,
        mx: 1.5,
        border: "1px solid",
        borderColor: "#E5E7EB",
        borderRadius: 2.5,
        overflow: "hidden",
        bgcolor: "#fff",
        boxShadow: "0 4px 14px rgba(129, 59, 31, 0.04)",
      }}
    >
      {/* Section Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.75,
          py: 1.2,
          borderBottom: "1px solid",
          borderColor: "#EEF2F7",
          background:
            "linear-gradient(180deg, #FAFBFC 0%, #F5F7FA 100%)",
        }}
      >
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: alpha("#0F172A", 0.05),
            color: "#334155",
          }}
        >
          {getSectionIcon(title)}
        </Box>

        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color: "#0F172A",
            fontSize: "0.78rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* Items */}
      <Box sx={{ p: 0.8 }}>
        {items.map((item, index) => {
          const label = item?.[labelKey] || "";

          return (
            <ListItem
              key={item?.id || item?.uuid || `${title}-${label}-${index}`}
              disablePadding
              sx={{ mb: index !== items.length - 1 ? 0.6 : 0 }}
            >
              <ListItemButton
                onClick={() => handleSelectedSuggestionData(item)}
                sx={{
                  borderRadius: 2,
                  px: 1.2,
                  py: 1,
                  border: "1px solid transparent",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: alpha("#0F172A", 0.03),
                    borderColor: alpha("#0F172A", 0.08),
                    transform: "translateX(2px)",
                  },
                }}
              >
                <ListItemAvatar sx={{ minWidth: 44 }}>
                  <Avatar
                    src={item?.logo || ""}
                    alt={label}
                    variant="rounded"
                    sx={{
                      width: 34,
                      height: 34,
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      bgcolor: item?.logo ? "#fff" : "#F3F4F6",
                      color: "#334155",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    {!item?.logo ? getInitials(label) : null}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontSize: "0.93rem",
                    fontWeight: 500,
                    color: "#111827",
                    noWrap: true,
                  }}
                />

                <ArrowForwardIosRoundedIcon
                  sx={{
                    fontSize: 14,
                    color: "#94A3B8",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </Box>
    </Box>
  );
};

export default SuggestionSection;