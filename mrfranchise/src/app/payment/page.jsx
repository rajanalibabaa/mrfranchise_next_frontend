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
  LinearProgress,
} from "@mui/material";
import {
  ShoppingBagOutlined,
  SecurityOutlined,
  CheckCircleOutline,
  CreditCardOutlined,
  ArrowBackOutlined,
  VerifiedUserOutlined,
  ScheduleOutlined,
  ReceiptOutlined,
  LocalOfferOutlined,
  SecurityUpdateOutlined,
} from "@mui/icons-material";
import { toast } from "react-hot-toast";
import PaymentButton from "./PaymentButton";
import { GSTCalculator } from "@/Utils/gstCalculator";

export default function PaymentPage() {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gstBreakdown, setGstBreakdown] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("paymentSummary");
    if (data) {
      const parsedData = JSON.parse(data);
      setPaymentData(parsedData);
      
      // ✅ Calculate GST breakdown
      calculateGST(parsedData);
    }
    setLoading(false);
  }, []);

 

  const calculateGST = (items) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  // Example:
  // Company State = TN
  // Customer Billing State = TN

  const gstData = GSTCalculator.calculate(
    subtotal,
    "TN", // seller state
    "TN"  // buyer state
  );

  setGstBreakdown(gstData);
};


  const handlePaymentSuccess = (paymentData) => {
    // Save payment success data
    localStorage.setItem("paymentSuccess", JSON.stringify(paymentData));
    
    // Redirect to success page
    toast.success("Payment completed successfully!");
    setTimeout(() => {
      window.location.href = "/brandDashboard";
    }, 2000);
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" 
      }}>
        <Paper sx={{ p: 4, textAlign: "center", maxWidth: 400 }}>
          <ShoppingBagOutlined sx={{ fontSize: 64, color: "#6366f1", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Preparing your order...
          </Typography>
          <LinearProgress sx={{ mt: 2, borderRadius: 10 }} />
        </Paper>
      </Box>
    );
  }

  if (!paymentData || paymentData.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <ShoppingBagOutlined sx={{ fontSize: 64, color: "#9ca3af" }} />
          <Typography variant="h6" gutterBottom sx={{ color: "#6b7280" }}>
            No payment items found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please go back and select your packages.
          </Typography>
        </Paper>
      </Container>
    );
  }

  // Calculate totals
  const subtotal = gstBreakdown?.subtotal || paymentData.reduce((sum, g) => sum + g.amount, 0);
  const finalAmount = gstBreakdown?.subtotal || subtotal;
  const packagesNames = paymentData.map(g => g.planName).join(", ");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative Elements */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "200px",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
        }}
      />

      <Container maxWidth="sm">
        {/* Back Button */}
        <IconButton
          onClick={() => window.history.back()}
          sx={{
            mb: 2,
            bgcolor: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(10px)",
            color: "white",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.3)",
              transform: "translateX(-5px)",
            },
          }}
        >
          <ArrowBackOutlined />
        </IconButton>

        {/* Main Glass Card */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 5,
            overflow: "hidden",
            backdropFilter: "blur(20px)",
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.2)",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 4,
              background: "linear-gradient(135deg, #6366f1, #ec4899)",
              color: "white",
              textAlign: "center",
            }}
          >
            <ShoppingBagOutlined sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h4" fontWeight="700" gutterBottom>
              Order Summary
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Review your packages before payment
            </Typography>
          </Box>

          <Box sx={{ p: 4 }}>
            {/* Order Items */}
            <Stack spacing={2} mb={4}>
              {paymentData.map((group, i) => (
                <Card
                  key={i}
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: "1px solid #e5e7eb",
                    transition: "0.3s",
                    "&:hover": {
                      boxShadow: "0 15px 30px rgba(99,102,241,0.15)",
                      borderColor: "#c7d2fe",
                    },
                  }}
                >
                  <CardContent sx={{ pb: "16px !important" }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography fontWeight={600} variant="h6" sx={{ mb: 0.5 }}>
                          {group.planName}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip
                            label={`${group.totalStates} states`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          <Chip
                            label={`₹${group.amount.toLocaleString()}`}
                            size="small"
                            color="secondary"
                            sx={{ fontWeight: 600 }}
                          />
                        </Stack>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>

            {/* Price Breakdown */}
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
                border: "1px solid #e2e8f0",
                mb: 4,
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                <ReceiptOutlined sx={{ mr: 1, verticalAlign: "middle" }} />
                Price Breakdown
              </Typography>

              <Stack spacing={1.5}>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Subtotal ({paymentData.length} items)</Typography>
                  <Typography>₹{subtotal.toLocaleString()}</Typography>
                </Box>

                <Divider />

                <Box display="flex" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <LocalOfferOutlined sx={{ mr: 0.5, fontSize: 18 }} />
                    <Typography>CGST (9%)</Typography>
                  </Box>
                  <Typography>₹{gstBreakdown?.cgst?.toLocaleString()}</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <LocalOfferOutlined sx={{ mr: 0.5, fontSize: 18 }} />
                    <Typography>SGST (9%)</Typography>
                  </Box>
                  <Typography>₹{gstBreakdown?.sgst?.toLocaleString()}</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Typography fontWeight={600}>Total GST (18%)</Typography>
                  <Typography fontWeight={600}>
                    ₹{gstBreakdown?.totalGST?.toLocaleString()}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box
                  display="flex"
                  justifyContent="space-between"
                  sx={{ pt: 1, pb: 0.5 }}
                >
                  <Typography
                    variant="h5"
                    fontWeight="800"
                    sx={{ color: "#1e293b" }}
                  >
                    Total Amount
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="900"
                    sx={{
                      color: "#6366f1",
                      background: "linear-gradient(135deg, #6366f1, #ec4899)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    ₹{finalAmount.toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Payment Security Badges */}
            <Stack direction="row" spacing={2} mb={4} justifyContent="center">
              <Tooltip title="100% Secure Payment">
                <Chip
                  icon={<SecurityOutlined />}
                  label="Secure"
                  color="success"
                  variant="filled"
                />
              </Tooltip>
              <Tooltip title="Razorpay Verified">
                <Chip
                  icon={<VerifiedUserOutlined />}
                  label="Razorpay"
                  color="primary"
                  variant="outlined"
                />
              </Tooltip>
              <Tooltip title="Instant Activation">
                <Chip
                  icon={<CheckCircleOutline />}
                  label="Instant"
                  color="secondary"
                  variant="outlined"
                />
              </Tooltip>
            </Stack>

            {/* Payment Method */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 3,
                borderRadius: 3,
                background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
                border: "2px solid #0ea5e9",
                mb: 4,
                textAlign: "center",
              }}
            >
              <CreditCardOutlined sx={{ fontSize: 32, color: "#0ea5e9" }} />
              <Box>
                <Typography fontWeight={700} sx={{ color: "#0369a1" }}>
                  Multiple Payment Options
                </Typography>
                <Typography variant="body2" sx={{ color: "#0c4a6e" }}>
                  UPI • Credit/Debit Cards • NetBanking • Wallets
                </Typography>
              </Box>
            </Box>

            {/* ✅ CTA Button with all data */}
            <PaymentButton
              amount={finalAmount}
              packageName={packagesNames}
              packageData={paymentData}
              onSuccess={handlePaymentSuccess}
            />
          </Box>
        </Paper>

        {/* Footer */}
        <Box
          sx={{
            mt: 4,
            p: 3,
            textAlign: "center",
            bgcolor: "rgba(255,255,255,0.5)",
            borderRadius: 3,
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            🔒 Payments secured by Razorpay. GSTIN: 27AABCU9603R1ZM
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}