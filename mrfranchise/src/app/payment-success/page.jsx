"use client";

import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Container,
  Grid,
  Divider,
  Button,
  alpha,
  Fade,
  Grow,
  Zoom,
} from "@mui/material";

import {
  CheckCircle,
  DownloadOutlined,
  EmailOutlined,
  ReceiptLongOutlined,
  CelebrationOutlined,
  ArrowForwardOutlined,
  VerifiedOutlined,
  AccessTimeOutlined,
  PaymentOutlined,
  LocalOfferOutlined,
  HomeOutlined,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import Navbar from "@/Components/Navbar/NavBar";
import Footer from "@/Components/Footers/Footer";

export default function PaymentSuccessPage() {
  const [data, setData] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const successData = localStorage.getItem("paymentSuccess");

    if (!successData) {
      window.location.href = "/advertise";
      return;
    }

    setData(JSON.parse(successData));
    setShowConfetti(true);

    // Block back navigation
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };
  }, []);

  if (!data) return null;

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <Navbar />
      
      {/* Confetti Background Animation */}
      {showConfetti && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            zIndex: 1,
            overflow: "hidden",
            "& > div": {
              position: "absolute",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              animation: "confetti-fall 3s ease-out forwards",
            },
            "@keyframes confetti-fall": {
              "0%": { transform: "translateY(-100vh) rotate(0deg)", opacity: 1 },
              "100%": { transform: "translateY(100vh) rotate(720deg)", opacity: 0 },
            },
          }}
        >
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ["#4285f4", "#34a853", "#fbbc04", "#ea4335"][
                  Math.floor(Math.random() * 4)
                ],
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </Box>
      )}

      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f8f9fa",
          py: 6,
          position: "relative",
          zIndex: 2,
        }}
      >
        <Box sx={{ maxWidth: 900, mx: "auto", px: 2 }}>
          {/* Success Header */}
          <Zoom in timeout={500}>
            <Box sx={{ textAlign: "center", mb: 6 }}>
              <Box
                sx={{
                  position: "relative",
                  display: "inline-flex",
                  mb: 3,
                }}
              >
                {/* Success Icon with Pulse Animation */}
                <Box
                  sx={{
                    position: "absolute",
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    bgcolor: alpha("#34a853", 0.1),
                    animation: "pulse 2s ease-in-out infinite",
                    "@keyframes pulse": {
                      "0%, 100%": { transform: "scale(1)", opacity: 0.5 },
                      "50%": { transform: "scale(1.1)", opacity: 0.2 },
                    },
                  }}
                />
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    bgcolor: "#34a853",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 40px rgba(52, 168, 83, 0.3)",
                    position: "relative",
                  }}
                >
                  <CheckCircle sx={{ fontSize: 70, color: "white" }} />
                </Box>
              </Box>

              <Fade in timeout={800}>
                <Typography
                  variant="h3"
                  fontWeight={600}
                  color="text.primary"
                  gutterBottom
                >
                  Payment Successful!
                </Typography>
              </Fade>

              <Fade in timeout={1000}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  Your franchise packages are now active
                </Typography>
              </Fade>

              <Fade in timeout={1200}>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="center"
                  sx={{ mt: 3 }}
                >
                  <Chip
                    icon={<CelebrationOutlined />}
                    label="Instant Activation"
                    sx={{
                      bgcolor: alpha("#fbbc04", 0.1),
                      color: "#f9ab00",
                      fontWeight: 500,
                      px: 2,
                      py: 2.5,
                      fontSize: "0.95rem",
                    }}
                  />
                  <Chip
                    icon={<VerifiedOutlined />}
                    label="Payment Verified"
                    sx={{
                      bgcolor: alpha("#34a853", 0.1),
                      color: "#34a853",
                      fontWeight: 500,
                      px: 2,
                      py: 2.5,
                      fontSize: "0.95rem",
                    }}
                  />
                </Stack>
              </Fade>
            </Box>
          </Zoom>

          <Grid container spacing={4}>
            {/* Left Column - Payment Details */}
            <Grid item xs={12} md={7}>
              <Grow in timeout={1000}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: "1px solid #e8eaed",
                    overflow: "hidden",
                    mb: 3,
                  }}
                >
                  {/* Header */}
                  <Box
                    sx={{
                      p: 3,
                      borderBottom: "1px solid #e8eaed",
                      bgcolor: "white",
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          bgcolor: alpha("#4285f4", 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ReceiptLongOutlined sx={{ color: "#4285f4", fontSize: 24 }} />
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight={500}>
                          Transaction Details
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <AccessTimeOutlined sx={{ fontSize: 14, color: "#5f6368" }} />
                          <Typography variant="caption" color="text.secondary">
                            {currentDate}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>

                  {/* Payment Info Grid */}
                  <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            p: 2.5,
                            borderRadius: 2,
                            bgcolor: "#fafafa",
                            border: "1px solid #e8eaed",
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <PaymentOutlined sx={{ color: "#5f6368", fontSize: 20 }} />
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Payment ID
                              </Typography>
                              <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5 }}>
                                {data?.payment?.paymentId || "N/A"}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            p: 2.5,
                            borderRadius: 2,
                            bgcolor: "#fafafa",
                            border: "1px solid #e8eaed",
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <ReceiptLongOutlined sx={{ color: "#5f6368", fontSize: 20 }} />
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Order ID
                              </Typography>
                              <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5 }}>
                                {data?.payment?.orderId || "N/A"}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            p: 2.5,
                            borderRadius: 2,
                            bgcolor: alpha("#34a853", 0.05),
                            border: `1px solid ${alpha("#34a853", 0.2)}`,
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <LocalOfferOutlined sx={{ color: "#34a853", fontSize: 20 }} />
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Amount Paid
                              </Typography>
                              <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{ mt: 0.5, color: "#34a853" }}
                              >
                                ₹{data?.payment?.amount?.toLocaleString() || "0"}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            p: 2.5,
                            borderRadius: 2,
                            bgcolor: alpha("#4285f4", 0.05),
                            border: `1px solid ${alpha("#4285f4", 0.2)}`,
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <VerifiedOutlined sx={{ color: "#4285f4", fontSize: 20 }} />
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Payment Status
                              </Typography>
                              <Typography
                                variant="body2"
                                fontWeight={700}
                                sx={{ mt: 0.5, color: "#34a853" }}
                              >
                                {data?.payment?.status || "SUCCESS"}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Grow>

              {/* Purchased Packages */}
              <Grow in timeout={1200}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: "1px solid #e8eaed",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      p: 3,
                      borderBottom: "1px solid #e8eaed",
                      bgcolor: "white",
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          bgcolor: alpha("#fbbc04", 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <LocalOfferOutlined sx={{ color: "#fbbc04", fontSize: 24 }} />
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight={500}>
                          Purchased Packages
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {data?.package?.data?.packages?.length || 0} package(s) activated
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Box sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      {data?.package?.data?.packages?.map((pkg, i) => (
                        <Zoom key={i} in timeout={1400 + i * 100}>
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
                              <Box display="flex" justifyContent="space-between" alignItems="start">
                                <Box>
                                  <Typography variant="h6" fontWeight={600} gutterBottom>
                                    {pkg.packagesName}
                                  </Typography>
                                  <Stack direction="row" spacing={1}>
                                    <Chip
                                      label={pkg.packagesType}
                                      size="small"
                                      sx={{
                                        bgcolor: alpha("#4285f4", 0.1),
                                        color: "#4285f4",
                                        fontWeight: 500,
                                        height: 24,
                                      }}
                                    />
                                    <Chip
                                      icon={<CheckCircle sx={{ fontSize: 16 }} />}
                                      label="Active"
                                      size="small"
                                      sx={{
                                        bgcolor: alpha("#34a853", 0.1),
                                        color: "#34a853",
                                        fontWeight: 500,
                                        height: 24,
                                      }}
                                    />
                                  </Stack>
                                </Box>
                              </Box>

                              <Divider />

                              <Grid container spacing={2}>
                                <Grid item xs={12}>
                                  <Typography variant="caption" color="text.secondary">
                                    Plan ID
                                  </Typography>
                                  <Typography variant="body2" fontWeight={500} sx={{ mt: 0.5 }}>
                                    {pkg.planUniqueId}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Stack>
                          </Paper>
                        </Zoom>
                      ))}
                    </Stack>
                  </Box>
                </Paper>
              </Grow>
            </Grid>

        
          </Grid>
        </Box>
      </Box>

      <Footer />
    </>
  );
}