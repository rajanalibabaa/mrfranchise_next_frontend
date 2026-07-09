"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  Stack,
  Divider,
  Tooltip,
  alpha,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CategoryIcon from "@mui/icons-material/Category";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { getInitials, getAvatarColor } from "./LeadCard_marketplace";

const EXCLUDED_KEYS = [
  "_id","__v","investorId","brandId","city",
  "brandName","status","uuid","brandsSent","updatedAt",
];

const DETAIL_FIELDS = [
  { key: "investorName",    label: "Investor Name",   icon: <PersonIcon /> },
  { key: "investorPhone",   label: "Phone",            icon: <PhoneIcon /> },
  { key: "investorEmail",   label: "Email",            icon: <EmailIcon /> },
  { key: "investorEnquiryModel", label: "Business Type", icon: <StorefrontIcon /> },
  { key: "industry",        label: "Industry",         icon: <BusinessIcon /> },
  { key: "category",        label: "Category",         icon: <CategoryIcon /> },
  { key: "investmentRange", label: "Investment Range", icon: <AttachMoneyIcon /> },
  { key: "state",           label: "State",            icon: <LocationOnIcon /> },
  { key: "district",        label: "District",         icon: <LocationOnIcon /> },
  { key: "createdAt",       label: "Applied On",       icon: <CalendarTodayIcon /> },
];

function DetailRow({ icon, label, value, fieldKey }) {
  const handleCopy = (text) => navigator.clipboard.writeText(text);

  const displayValue =
    fieldKey === "createdAt"
      ? new Date(value).toLocaleString("en-US", {
          month: "long", day: "numeric", year: "numeric",
          hour: "2-digit", minute: "2-digit",
        })
      : String(value);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        py: 1.5,
        px: 2,
        borderRadius: 2,
        mb: 1,
        transition: "background 0.2s",
        "&:hover": { background: "#f8fafc" },
      }}
    >
      <Box sx={{ color: "#6366f1", mr: 2, display: "flex", alignItems: "center" }}>
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="caption"
          color="#94a3b8"
          fontWeight={600}
          textTransform="uppercase"
          letterSpacing={0.5}
        >
          {label}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
          <Typography fontWeight={600} color="#1e293b" fontSize={15} sx={{ flex: 1, wordBreak: "break-word" }}>
            {displayValue}
          </Typography>

          {/* Phone actions */}
          {fieldKey === "investorPhone" && (
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Call">
                <IconButton size="small" color="primary" component="a" href={`tel:${value}`}>
                  <PhoneIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Copy Number">
                <IconButton size="small" onClick={() => handleCopy(value)}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          )}

          {/* Email actions */}
          {fieldKey === "investorEmail" && (
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Send Email">
                <IconButton size="small" color="primary" component="a" href={`mailto:${value}`}>
                  <EmailIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Copy Email">
                <IconButton size="small" onClick={() => handleCopy(value)}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default function LeadDetailDialog({ open, onClose, selected }) {
  if (!selected) return null;

  const avatarColor = getAvatarColor(selected.investorName);
  const detailFieldKeys = DETAIL_FIELDS.map((f) => f.key);

  const extraEntries = Object.entries(selected).filter(
    ([key]) => !EXCLUDED_KEYS.includes(key) && !detailFieldKeys.includes(key)
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          color: "#fff",
          p: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Avatar
          sx={{
            width: 56,
            height: 56,
            background: `linear-gradient(135deg, ${avatarColor}, ${alpha(avatarColor, 0.6)})`,
            fontWeight: 700,
            fontSize: 20,
          }}
        >
          {getInitials(selected.investorName)}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight={700}>
            {selected.investorName}
          </Typography>
          <Typography variant="body2" sx={{ color: "#94a3b8" }}>
            Applied on{" "}
            {new Date(selected.createdAt).toLocaleDateString("en-US", {
              weekday: "long", month: "long", day: "numeric", year: "numeric",
            })}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#94a3b8" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Primary fields */}
          {DETAIL_FIELDS.map(({ key, label, icon }) => {
            const value = selected[key];
            if (!value) return null;
            return (
              <DetailRow key={key} fieldKey={key} icon={icon} label={label} value={value} />
            );
          })}

          {/* Extra fields */}
          {extraEntries.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" fontWeight={700} color="#64748b" mb={1.5}>
                Additional Info
              </Typography>
              {extraEntries.map(([key, value]) => (
                <Box
                  key={key}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 1,
                    px: 2,
                    borderRadius: 2,
                    mb: 0.5,
                    "&:hover": { background: "#f8fafc" },
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="#64748b"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {key.replace(/([A-Z])/g, " $1")}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="#1e293b"
                    fontWeight={500}
                    sx={{ textAlign: "right", maxWidth: "60%", wordBreak: "break-word" }}
                  >
                    {String(value)}
                  </Typography>
                </Box>
              ))}
            </>
          )}
        </Box>
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{ p: 2, borderTop: "1px solid #e2e8f0" }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            background: "#ef4444",
            "&:hover": { background: "#dc2626" },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}