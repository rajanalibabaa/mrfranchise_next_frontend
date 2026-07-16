"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function CaptchaDialog({
  open,
  captchaText,
  captchaInput,
  setCaptchaInput,
  onRefresh,
  onVerify,
  onClose,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, pr: 6 }}>
        Verify You're Human
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon color="error" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Captcha Display */}
        <Box
          sx={{
            mt: 1,
            p: 3,
            background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
            borderRadius: 2,
            textAlign: "center",
            border: "2px dashed #cbd5e1",
            userSelect: "none",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            letterSpacing={8}
            sx={{
              fontFamily: "monospace",
              color: "#1e293b",
              textShadow: "1px 1px 0 #94a3b8",
              fontSize: { xs: 28, sm: 36 },
            }}
          >
            {captchaText}
          </Typography>
        </Box>

        {/* Input */}
        <TextField
          fullWidth
          label="Enter Captcha"
          value={captchaInput}
          onChange={(e) => setCaptchaInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onVerify()}
          sx={{ mt: 3 }}
          autoComplete="off"
        />

        {/* Refresh */}
        <Button
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
          sx={{ mt: 1.5, textTransform: "none", color: "#6366f1", fontWeight: 600 }}
        >
          Refresh Captcha
        </Button>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button
          onClick={onVerify}
          variant="contained"
          fullWidth
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
            py: 1.2,
            background: "linear-gradient(135deg, #ff9800, #f57c00)",
            "&:hover": {
              background: "linear-gradient(135deg, #f57c00, #e65100)",
            },
          }}
        >
          Verify & Unlock
        </Button>
      </DialogActions>
    </Dialog>
  );
}