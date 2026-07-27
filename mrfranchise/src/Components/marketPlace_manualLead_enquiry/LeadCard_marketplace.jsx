"use client";

import React from "react";
import {
  Card,
  CardContent,
  Avatar,
  Box,
  Typography,
  Button,
  Tooltip,
  Fade,
  alpha,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VisibilityIcon from "@mui/icons-material/Visibility";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BusinessIcon from "@mui/icons-material/Business";
import CategoryIcon from "@mui/icons-material/Category";

// ─── Helpers ───────────────────────────────────────────────────────────────────
export const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const getAvatarColor = (name) => {
  if (!name) return "#6366f1";
  const colors = [
    "#6366f1","#8b5cf6","#06b6d4","#10b981",
    "#f59e0b","#ef4444","#ec4899","#3b82f6",
    "#14b8a6","#f97316",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

export const maskName = (name) =>
  name ? name.slice(0, 2) + "••••••" + name.slice(-2) : "N/A";

// ─── InfoRow ───────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
      <Box sx={{ color: "#94a3b8", display: "flex", alignItems: "center" }}>
        {icon}
      </Box>
      <Typography variant="body2" color="#64748b" fontSize={13}>
        <Box component="span" fontWeight={600} color="#334155">
          {label}:{" "}
        </Box>
        {value}
      </Typography>
    </Box>
  );
}

// ─── LeadCard ──────────────────────────────────────────────────────────────────
export default function LeadCard({ item, index, onUnlock }) {
  const avatarColor = getAvatarColor(item.investorName);

  return (
    <Fade in timeout={300 + index * 50}>
      <Card
        sx={{
          borderRadius: 4,
          height: "100%",
          border: "1px solid transparent",
          background:
            "linear-gradient(white, white) padding-box, linear-gradient(135deg, #f1f5f9, #e2e8f0) border-box",
          boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
          maxWidth:'350px', 
          transition: "all 0.3s ease-in-out",
          display: "flex",
          flexDirection: "column",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
            background:
              "linear-gradient(white, white) padding-box, linear-gradient(135deg, #ff9800, #10d406) border-box",
          },
        }}
      >
        <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                background: `linear-gradient(135deg, ${avatarColor}, ${alpha(avatarColor, 0.7)})`,
                fontWeight: 700,
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              {getInitials(item.investorName)}
            </Avatar>

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Tooltip title={item.investorName}>
                <Typography
                  fontWeight={700}
                  fontSize={16}
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    color: "#1e293b",
                  }}
                >
                  {maskName(item.investorName)}
                </Typography>
              </Tooltip>
              <Typography
                variant="caption"
                color="#64748b"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <CalendarTodayIcon sx={{ fontSize: 12 }} />
                {new Date(item.createdAt).toLocaleDateString("en-CA")}
              </Typography>
            </Box>
          </Box>

          {/* Details */}
          <Box sx={{ flex: 1 }}>
            <InfoRow
              icon={<StorefrontIcon sx={{ fontSize: 15 }} />}
              label="Business Type"
              value={item.investorEnquiryModel}
            />
            <InfoRow
              icon={<AttachMoneyIcon sx={{ fontSize: 15 }} />}
              label="Investment"
              value={item.investmentRange}
            />
            <InfoRow
              icon={<BusinessIcon sx={{ fontSize: 15 }} />}
              label="Industry"
              value={item.industry}
            />
            <InfoRow
              icon={<CategoryIcon sx={{ fontSize: 15 }} />}
              label="Category"
              value={item.category}
            />
          </Box>
        </CardContent>

        {/* Unlock Button */}
        <Box sx={{ p: 2, pt: 0 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<VisibilityIcon />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              color: "#fff",
              background: "linear-gradient(135deg, #ff9800, #f57c00)",
              boxShadow: "none",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(135deg, #f57c00, #e65100)",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 16px rgba(255,152,0,0.35)",
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              onUnlock(item);
            }}
          >
            Unlock Investor Details
          </Button>
        </Box>
      </Card>
    </Fade>
  );
}