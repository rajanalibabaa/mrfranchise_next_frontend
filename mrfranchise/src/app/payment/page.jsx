"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
  Chip,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Stack,
  alpha,
} from "@mui/material";
import {
  ShoppingBagOutlined,
  SecurityOutlined,
  CheckCircleOutline,
  CreditCardOutlined,
  ArrowBackOutlined,
  VerifiedUserOutlined,
  ScheduleOutlined,
} from "@mui/icons-material";
import PaymentButton from "./PaymentButton";

export default function PaymentPage() {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem("paymentSummary");
    if (data) {
      setPaymentData(JSON.parse(data));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f5f7fa 0%, #e9edf2 100%)" }}>
        <Typography>Loading your order...</Typography>
      </Box>
    );
  }

  if (!paymentData) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography>No payment data found. Please go back and try again.</Typography>
        </Paper>
      </Container>
    );
  }

  // Calculate totals
  const subtotal = paymentData.reduce((sum, g) => sum + g.amount, 0);
  const gst = Math.round(subtotal * 0.18);
  const finalAmount = subtotal + gst;
  const packagesNames = paymentData.map(g => g.planName).join(", ");

  return (
 <Box
  sx={{
    minHeight: "100vh",
    background:
      "white",
    py: 4,
  }}
>
  <Container maxWidth="sm">
    {/* Back Button */}
    <IconButton
      onClick={() => window.history.back()}
      sx={{
        mb: 2,
        bgcolor: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        "&:hover": {
          transform: "translateX(-5px) scale(1.08)",
        },
        transition: "0.3s",
      }}
    >
      <ArrowBackOutlined />
    </IconButton>

    {/* Glass Card */}
    <Paper
      sx={{
        borderRadius: 5,
        overflow: "hidden",
        backdropFilter: "blur(20px)",
        background: "rgba(255,255,255,0.75)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.15)",
        border: "1px solid rgba(255,255,255,0.3)",
        animation: "fadeIn 0.6s ease",
        "@keyframes fadeIn": {
          from: { opacity: 0, transform: "translateY(20px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          background:
            "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)",
          color: "white",
        }}
      >
        <Typography variant="h5" fontWeight="700">
          Complete Payment
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>
          Secure & fast checkout
        </Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Order Items */}
        <Stack spacing={2} mb={3}>
          {paymentData.map((group, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                p: 2,
                borderRadius: 3,
                background:
                  "linear-gradient(135deg, #ffffff, #eef2ff)",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow:
                    "0 15px 30px rgba(99,102,241,0.2)",
                },
              }}
            >
              <Box>
                <Typography fontWeight={600}>
                  {group.planName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {group.totalStates} states
                </Typography>
              </Box>

              <Typography fontWeight="700" color="#4f46e5">
                ₹{group.amount.toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Stack>

        {/* Price Box */}
        <Box
          sx={{
            p: 3,
            borderRadius: 4,
            background:
              "linear-gradient(135deg, #eef2ff, #fdf4ff)",
            boxShadow:
              "inset 0 0 20px rgba(99,102,241,0.1)",
            mb: 3,
          }}
        >
          <Box display="flex" justifyContent="space-between">
            <Typography>Subtotal</Typography>
            <Typography>₹{subtotal.toLocaleString()}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography>GST</Typography>
            <Typography>₹{gst.toLocaleString()}</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="space-between">
            <Typography fontWeight="600">Total</Typography>
            <Typography
              sx={{
                fontSize: "22px",
                fontWeight: "800",
                // background:
                //   "linear-gradient(135deg, #6366f1, #ec4899)",
                // WebkitBackgroundClip: "text",
                // WebkitTextFillColor: "transparent",
                // animation: "glow 2s infinite alternate",
                // "@keyframes glow": {
                //   from: { textShadow: "0 0 10px #6366f1" },
                //   to: { textShadow: "0 0 20px #ec4899" },
                // },
              }}
            >
              ₹{finalAmount.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        {/* Payment Method */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            borderRadius: 3,
            background:
              "linear-gradient(135deg, #ffffff, #f0f9ff)",
            border: "1px solid #e0e7ff",
            mb: 3,
            "&:hover": {
              boxShadow:
                "0 10px 30px rgba(99,102,241,0.25)",
            },
          }}
        >
          <CreditCardOutlined sx={{ color: "#6366f1" }} />
          <Box>
            <Typography fontWeight={600}>
              Razorpay
            </Typography>
            <Typography variant="caption">
              UPI • Cards • NetBanking
            </Typography>
          </Box>
        </Box>

        {/* CTA Button */}
        <Box
          sx={{
            "& button": {
              width: "100%",
              padding: "14px",
              fontSize: "16px",
              borderRadius: "14px",
              fontWeight: "700",
              background:
                "linear-gradient(135deg, #6366f1, #ec4899)",
              color: "#fff",
              boxShadow:
                "0 20px 40px rgba(99,102,241,0.4)",
              transition: "0.3s",
              "&:hover": {
                transform: "translateY(-3px) scale(1.02)",
                boxShadow:
                  "0 25px 50px rgba(236,72,153,0.5)",
              },
            },
          }}
        >
          <PaymentButton
            amount={finalAmount}
            packageName={packagesNames}
          />
        </Box>
      </Box>
    </Paper>
  </Container>
</Box>
  );
}