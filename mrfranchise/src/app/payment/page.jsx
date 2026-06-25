"use client";

import { useEffect, useState } from "react";
import React from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
  Chip,
  Stack,
  alpha,
  LinearProgress,
  Button,
  IconButton,
  Fade,
  Grow,
  Slide,
} from "@mui/material";
import {
  ShoppingBagOutlined,
  SecurityOutlined,
  CheckCircleOutline,
  ArrowBackOutlined,
  VerifiedUserOutlined,
  ReceiptOutlined,
  LocalOfferOutlined,
  InfoOutlined,
  PaymentOutlined,
  LockOutlined,
  FlashOnOutlined,
  WorkspacePremiumOutlined,
} from "@mui/icons-material";
import { toast } from "react-hot-toast";
import PaymentButton from "./PaymentButton";
import { GSTCalculator } from "@/Utils/gstCalculator";
import Navbar from "@/Components/Navbar/NavBar";
import Footer from "@/Components/Footers/Footer";

export default function PaymentPage() {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gstBreakdown, setGstBreakdown] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("paymentSummary");
    if (data) {
      const parsedData = JSON.parse(data);
      setPaymentData(parsedData);
      calculateGST(parsedData);
    }
    setLoading(false);
  }, []);

  const calculateGST = (items) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const gstData = GSTCalculator.calculate(subtotal, "TN", "TN");
    setGstBreakdown(gstData);
  };

  const handlePaymentSuccess = (paymentData) => {
    localStorage.setItem("paymentSuccess", JSON.stringify(paymentData));
    localStorage.removeItem("paymentSummary");
    toast.success("Payment completed successfully!");
    window.location.replace("/payment-success");
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f8f9fa",
        }}
      >
        <Stack spacing={3} alignItems="center" sx={{ maxWidth: 400 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #4285f4 0%, #34a853 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "pulse 2s ease-in-out infinite",
              "@keyframes pulse": {
                "0%, 100%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.05)" },
              },
            }}
          >
            <ShoppingBagOutlined sx={{ fontSize: 40, color: "white" }} />
          </Box>
          <Typography variant="h5" fontWeight={500} color="text.primary">
            Preparing checkout
          </Typography>
          <LinearProgress
            sx={{
              width: 300,
              height: 4,
              borderRadius: 10,
              bgcolor: "#e8eaed",
              "& .MuiLinearProgress-bar": {
                background: "linear-gradient(90deg, #4285f4, #34a853, #fbbc04, #ea4335)",
                backgroundSize: "200% 100%",
                animation: "gradient 2s linear infinite",
              },
              "@keyframes gradient": {
                "0%": { backgroundPosition: "0% 0%" },
                "100%": { backgroundPosition: "200% 0%" },
              },
            }}
          />
        </Stack>
      </Box>
    );
  }

  if (!paymentData || paymentData.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 4,
            border: "1px solid #e8eaed",
          }}
        >
          <ShoppingBagOutlined sx={{ fontSize: 80, color: "#dadce0", mb: 2 }} />
          <Typography variant="h5" fontWeight={500} gutterBottom color="text.primary">
            No items found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Please select your packages to continue
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.history.back()}
            sx={{
              textTransform: "none",
              borderRadius: 3,
              px: 4,
              py: 1.5,
              bgcolor: "#4285f4",
              "&:hover": { bgcolor: "#1967d2" },
            }}
          >
            Go Back
          </Button>
        </Paper>
      </Container>
    );
  }

  const subtotal = gstBreakdown?.subtotal || paymentData.reduce((sum, g) => sum + g.amount, 0);
  const finalAmount = gstBreakdown?.finalAmount || subtotal;
  const packagesNames = paymentData.map((g) => g.planName).join(", ");

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f8f9fa",
          py: 4,
          mt:{xs:0,sm:0,md:17}
        }}
      >
        <Container maxWidth="lg">
          {/* Header */}
          <Fade in timeout={500}>
            <Box sx={{ mb: 4 }}>
              <IconButton
                onClick={() => window.history.back()}
                sx={{
                  mb: 2,
                  bgcolor: "white",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                  "&:hover": {
                    bgcolor: "#f8f9fa",
                    transform: "translateX(-4px)",
                  },
                  transition: "all 0.2s",
                }}
              >
                <ArrowBackOutlined />
              </IconButton>

              <Typography variant="h4" fontWeight={500} color="text.primary" sx={{ mb: 1 }}>
                Checkout
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Review your order and complete payment
              </Typography>
            </Box>
          </Fade>

          <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
            {/* Left Column - Order Details */}
            <Box sx={{ flex: 1 }}>
              <Grow in timeout={700}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: "1px solid #e8eaed",
                    overflow: "hidden",
                    mb: 3,
                  }}
                >
                  {/* Items Header */}
                  <Box
                    sx={{
                      p: 3,
                      borderBottom: "1px solid #e8eaed",
                      bgcolor: "white",
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          bgcolor: alpha("#4285f4", 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ShoppingBagOutlined sx={{ color: "#4285f4" }} />
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight={500}>
                          Order Items
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {paymentData.length} package{paymentData.length > 1 ? "s" : ""} selected
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  {/* Items List */}
                  <Box sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      {paymentData.map((group, i) => (
                        <Slide key={i} in direction="up" timeout={800 + i * 100}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 3,
                              borderRadius: 2.5,
                              border: "1px solid #e8eaed",
                              bgcolor: "#fafafa",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                bgcolor: "white",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                transform: "translateY(-2px)",
                              },
                            }}
                          >
                            <Stack spacing={2}>
                              <Stack direction="row" justifyContent="space-between" alignItems="start">
                                <Box>
                                  <Typography variant="h6" fontWeight={500} sx={{ mb: 0.5 }}>
                                    {group.planName}
                                  </Typography>
                                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                                    <Chip
                                      label={`${group.totalStates} States`}
                                      size="small"
                                      sx={{
                                        height: 24,
                                        bgcolor: alpha("#34a853", 0.1),
                                        color: "#34a853",
                                        fontWeight: 500,
                                        border: "none",
                                      }}
                                    />
                                    <Chip
                                      icon={<WorkspacePremiumOutlined sx={{ fontSize: 16 }} />}
                                      label="Premium"
                                      size="small"
                                      sx={{
                                        height: 24,
                                        bgcolor: alpha("#fbbc04", 0.1),
                                        color: "#f9ab00",
                                        fontWeight: 500,
                                        border: "none",
                                      }}
                                    />
                                  </Stack>
                                </Box>
                                <Typography variant="h6" fontWeight={600} color="text.primary">
                                  ₹{group.amount.toLocaleString()}
                                </Typography>
                              </Stack>
                            </Stack>
                          </Paper>
                        </Slide>
                      ))}
                    </Stack>
                  </Box>
                </Paper>
              </Grow>

              {/* Trust Indicators */}
              <Grow in timeout={900}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid #e8eaed",
                    bgcolor: alpha("#4285f4", 0.02),
                  }}
                >
                  <Stack direction="row" spacing={3} justifyContent="space-around" flexWrap="wrap">
                    {[
                      { icon: <LockOutlined />, label: "Secure Payment", color: "#4285f4" },
                      { icon: <FlashOnOutlined />, label: "Instant Activation", color: "#34a853" },
                      { icon: <VerifiedUserOutlined />, label: "100% Safe", color: "#fbbc04" },
                    ].map((item, i) => (
                      <Stack key={i} alignItems="center" spacing={1}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            bgcolor: alpha(item.color, 0.1),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {React.cloneElement(item.icon, { sx: { color: item.color } })}
                        </Box>
                        <Typography variant="caption" fontWeight={500} color="text.secondary">
                          {item.label}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Paper>
              </Grow>
            </Box>

            {/* Right Column - Price Summary */}
            <Box sx={{ width: { xs: "100%", md: 420 } }}>
              <Grow in timeout={1000}>
                <Paper
                  elevation={0}
                  sx={{
                    position: "sticky",
                    top: 100,
                    borderRadius: 3,
                    border: "1px solid #e8eaed",
                    overflow: "hidden",
                  }}
                >
                  {/* Summary Header */}
                  <Box
                    sx={{
                      p: 3,
                      borderBottom: "1px solid #e8eaed",
                      bgcolor: "white",
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          bgcolor: alpha("#34a853", 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ReceiptOutlined sx={{ color: "#34a853" }} />
                      </Box>
                      <Typography variant="h6" fontWeight={500}>
                        Order Summary
                      </Typography>
                    </Stack>
                  </Box>

                  {/* Price Breakdown */}
                  <Box sx={{ p: 3 }}>
                    <Stack spacing={2.5}>
                      {/* Subtotal */}
                      <Box display="flex" justifyContent="space-between">
                        <Typography color="text.secondary">
                          Subtotal ({paymentData.length} item{paymentData.length > 1 ? "s" : ""})
                        </Typography>
                        <Typography fontWeight={500}>₹{subtotal.toLocaleString()}</Typography>
                      </Box>

                      <Divider />

                      {/* GST Breakdown */}
                      <Box>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                          <LocalOfferOutlined sx={{ fontSize: 18, color: "#5f6368" }} />
                          <Typography variant="body2" fontWeight={500} color="text.secondary">
                            Tax Breakdown
                          </Typography>
                        </Stack>

                        <Stack spacing={1.5} sx={{ pl: 3.5 }}>
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              CGST (9%)
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              ₹{gstBreakdown?.cgst?.toLocaleString()}
                            </Typography>
                          </Box>
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              SGST (9%)
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              ₹{gstBreakdown?.sgst?.toLocaleString()}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>

                      <Divider />

                      {/* Total */}
                      <Box
                        sx={{
                          p: 2.5,
                          borderRadius: 2,
                          bgcolor: alpha("#4285f4", 0.05),
                          border: `1px solid ${alpha("#4285f4", 0.2)}`,
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="h6" fontWeight={500}>
                            Total
                          </Typography>
                          <Typography variant="h5" fontWeight={600} sx={{ color: "#4285f4" }}>
                            ₹{finalAmount.toLocaleString()}
                          </Typography>
                        </Stack>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                          Inclusive of all taxes
                        </Typography>
                      </Box>

                      {/* Payment Button */}
                      <PaymentButton
                        amount={finalAmount}
                        packageName={packagesNames}
                        packageData={paymentData}
                        onSuccess={handlePaymentSuccess}
                      />
                      <Divider />

<Button>Payment Done in Offline</Button>
                      {/* Payment Methods */}
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "#fafafa",
                          border: "1px solid #e8eaed",
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                          <PaymentOutlined sx={{ fontSize: 18, color: "#5f6368" }} />
                          <Typography variant="caption" fontWeight={500} color="text.secondary">
                            PAYMENT OPTIONS
                          </Typography>
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          UPI • Cards • Net Banking • Wallets
                        </Typography>
                      </Box>

                      {/* Security Note */}
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: alpha("#34a853", 0.05),
                        }}
                      >
                        <SecurityOutlined sx={{ fontSize: 18, color: "#34a853" }} />
                        <Typography variant="caption" color="text.secondary">
                          Protected by bank-grade 256-bit encryption
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Paper>
              </Grow>

              {/* Help Section */}
              <Grow in timeout={1200}>
                <Paper
                  elevation={0}
                  sx={{
                    mt: 3,
                    p: 2.5,
                    borderRadius: 3,
                    border: "1px solid #e8eaed",
                    bgcolor: alpha("#ea4335", 0.02),
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <InfoOutlined sx={{ color: "#ea4335" }} />
                    <Box>
                      <Typography variant="body2" fontWeight={500} gutterBottom>
                        Need assistance?
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Our support team is available 24/7
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grow>
            </Box>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
}