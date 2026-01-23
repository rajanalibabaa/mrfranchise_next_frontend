"use client";

import { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
import { useParams,useRouter} from "next/navigation"
import { useTheme, keyframes } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";
import Slide from "@mui/material/Slide";
import Zoom from "@mui/material/Zoom";
import Grow from "@mui/material/Grow";

import ArrowBack from "@mui/icons-material/ArrowBack";
import CheckCircle from "@mui/icons-material/CheckCircle";
import LocalOffer from "@mui/icons-material/LocalOffer";
import Rocket from "@mui/icons-material/Rocket";
import Star from "@mui/icons-material/Star";
import FlashOn from "@mui/icons-material/FlashOn";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircularProgress from "@mui/material/CircularProgress";
// Keyframe animations
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const glowAnimation = keyframes`
  0%, 100% { text-shadow: 0 0 5px rgba(255, 152, 0, 0.5); }
  50% { text-shadow: 0 0 20px rgba(255, 152, 0, 0.8), 0 0 30px rgba(76, 175, 80, 0.6); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shimmerAnimation = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const PaymentPage = ({
  onSubmit,
  selectedMembership,
  selectedListing,
  selectedPlan,
  onBack,
  snackbar,
  handleCloseSnackbar,
  isSubmitting,
  setSnackbar,
  submitSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [showQR, setShowQR] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const theme = useTheme();

  const location =useParams ();
  const navigate = useRouter();

  // const { selectedPlan } = location.state || {};

  const membership = selectedPlan;

  // Orange and Green color scheme
  const primaryOrange = "#FF6B35";
  const darkOrange = "#E65100";

  const primaryGreen = "#4CAF50";
  const darkGreen = "#388E3C";

  const handleBack = () => {
    // If a parent provided an onBack callback (inline rendering), use it.
    // Otherwise, fall back to navigation history.
    if (typeof onBack === "function") {
      onBack();
      return;
    }
    navigate(-1);
  };

  const handleSubmit = () => {
    onSubmit(selectedMembership, selectedListing);
  };

  // GUARD CLAUSE: Show fallback if no membership is selected
  if (!membership) {
    return (
      <Box sx={{ p: 6, textAlign: "center" }}>
        <Typography
          fontWeight={700}
          fontSize="1.2rem"
          sx={{
            animation: `${glowAnimation} 2s ease-in-out infinite`,
            background: `linear-gradient(45deg, ${primaryOrange} 30%, ${primaryGreen} 90%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            backgroundSize: "200% 200%",
            animation: `${gradientShift} 3s ease infinite`,
          }}
        >
          No membership selected. Please go back and choose a membership plan.
        </Typography>
        <Button
          onClick={handleBack}
          sx={{
            mt: 3,
            animation: `${pulseAnimation} 2s ease-in-out infinite`,
            background: `linear-gradient(45deg, ${primaryOrange} 0%, ${primaryGreen} 100%)`,
            backgroundSize: "200% 200%",
            animation: `${gradientShift} 3s ease infinite, ${pulseAnimation} 2s ease-in-out infinite`,
            "&:hover": {
              background: `linear-gradient(45deg, ${darkOrange} 0%, ${darkGreen} 100%)`,
            },
          }}
          variant="contained"
        >
          Go Back
        </Button>
      </Box>
    );
  }

  // Calculate amounts with GST (18%)
  const bannerTotal = 0;
  const subtotal = (membership.price || 0) + bannerTotal;
  const gstAmount = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + gstAmount;

  const [upiId] = useState(`UPI${Math.floor(100000 + Math.random() * 900000)}`);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentSubmit = () => {
    if (paymentMethod === "upi") {
      setShowQR(true);
      setTimeout(() => {
        setPaymentSuccess(true);
        setTimeout(() => {
          handleSubmit({
            membership,
            banners: [],
            paymentMethod,
            upiId,
            gstAmount,
            totalAmount,
            subtotal,
          });
        }, 1500);
      }, 5000);
    } else {
      handleSubmit({
        membership,
        banners: [],
        paymentMethod,
        cardDetails: paymentMethod === "credit_card" ? cardDetails : null,
        gstAmount,
        totalAmount,
        subtotal,
      });
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    }
    return value;
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #FFF8F0 0%, #F8FFE8 100%)",
        minHeight: "100vh",
      }}
    >
      {/* <Box>
        <Navbar />
      </Box> */}
      <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
        <Slide direction="right" in={true} timeout={500}>
          <Button
            startIcon={<ArrowBack sx={{ color: primaryOrange }} />}
            onClick={handleBack}
            sx={{
              mb: 3,
              color: primaryOrange,
              fontWeight: 600,
              "&:hover": {
                transform: "translateX(-5px)",
                transition: "transform 0.3s ease",
                backgroundColor: "rgba(255, 107, 53, 0.1)",
              },
            }}
          >
            Back to selection
          </Button>
        </Slide>

        <Fade in={true} timeout={800}>
          <Typography
            variant="h3"
            sx={{
              mb: 3,
              fontWeight: 900,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              background: `linear-gradient(135deg, ${primaryOrange} 0%, ${primaryGreen} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              backgroundSize: "200% 200%",
              animation: `${gradientShift} 4s ease infinite, ${glowAnimation} 3s ease-in-out infinite`,
              textAlign: "center",
            }}
          >
            <LocalOffer sx={{ fontSize: 48, color: primaryOrange }} />
            Complete Your Payment
            <Rocket
              sx={{
                fontSize: 48,
                color: primaryGreen,
                animation: `${floatAnimation} 3s ease-in-out infinite`,
              }}
            />
          </Typography>
        </Fade>

        {!paymentSuccess ? (
          <>
            {/* Order Summary */}
            <Grow in={true} timeout={1000}>
              <Paper
                elevation={8}
                sx={{
                  p: 4,
                  mb: 4,
                  borderRadius: 4,
                  background: `linear-gradient(135deg, #FFFFFF 0%, #FFF8F0 100%)`,
                  border: `2px solid ${primaryOrange}20`,
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "6px",
                    background: `linear-gradient(90deg, ${primaryOrange} 0%, ${primaryGreen} 100%)`,
                    animation: `${gradientShift} 3s ease infinite`,
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Star
                    sx={{
                      color: primaryOrange,
                      mr: 2,
                      fontSize: 32,
                      animation: `${floatAnimation} 2s ease-in-out infinite`,
                    }}
                  />
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      background: `linear-gradient(135deg, ${primaryOrange} 0%, ${darkOrange} 100%)`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    Order Summary
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                      p: 2,
                      backgroundColor: "rgba(255, 107, 53, 0.05)",
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        color: darkOrange,
                      }}
                    >
                      {membership.tier} Membership
                    </Typography>
                    <Typography
                      fontWeight={800}
                      sx={{
                        fontSize: "1.3rem",
                        animation: `${pulseAnimation} 2s ease-in-out infinite`,
                        background: `linear-gradient(135deg, ${primaryGreen} 0%, ${darkGreen} 100%)`,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      ₹{(membership.price || 0).toLocaleString()}
                    </Typography>
                  </Box>

                  {!membership.isListingPackage && (
                    <>
                      <Typography
                        variant="h6"
                        sx={{
                          mt: 2,
                          mb: 2,
                          fontWeight: 700,
                          color: primaryOrange,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <FlashOn sx={{ fontSize: 20 }} />
                        Package Details:
                      </Typography>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            backgroundColor: "rgba(76, 175, 80, 0.05)",
                            borderRadius: 2,
                            textAlign: "center",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Duration
                          </Typography>
                          <Typography
                            variant="h6"
                            fontWeight={700}
                            color={primaryGreen}
                          >
                            {membership.totalMonths} months
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            p: 2,
                            backgroundColor: "rgba(255, 107, 53, 0.05)",
                            borderRadius: 2,
                            textAlign: "center",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Monthly Leads
                          </Typography>
                          <Typography
                            variant="h6"
                            fontWeight={700}
                            color={primaryOrange}
                          >
                            {membership.perMonthLead}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            p: 2,
                            backgroundColor: "rgba(76, 175, 80, 0.05)",
                            borderRadius: 2,
                            textAlign: "center",
                            gridColumn: "1 / -1",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Total Leads
                          </Typography>
                          <Typography
                            variant="h6"
                            fontWeight={700}
                            color={primaryGreen}
                          >
                            {membership.totalLeads}
                          </Typography>
                        </Box>
                      </Box>
                    </>
                  )}
                </Box>

                <Divider sx={{ my: 3, borderColor: `${primaryOrange}20` }} />

                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Typography fontWeight={600}>Subtotal:</Typography>
                    <Typography fontWeight={700} color={primaryOrange}>
                      ₹{subtotal.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Typography fontWeight={600}>GST (18%):</Typography>
                    <Typography fontWeight={700} color={primaryGreen}>
                      ₹{gstAmount.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3, borderColor: `${primaryOrange}20` }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    backgroundColor: "rgba(255, 107, 53, 0.1)",
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 900,
                      background: `linear-gradient(135deg, ${primaryOrange} 0%, ${primaryGreen} 100%)`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    Total Amount:
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight={900}
                    sx={{
                      background: `linear-gradient(135deg, ${primaryGreen} 0%, ${darkGreen} 100%)`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                      animation: `${pulseAnimation} 2s ease-in-out infinite`,
                    }}
                  >
                    ₹{totalAmount.toLocaleString()}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  sx={{
                    background:
                      "linear-gradient(to bottom right,rgb(82, 209, 105),rgb(132, 237, 47))",
                    border: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "12px",
                    color: "#FFFFFF",
                    cursor: "pointer",
                    display: "block",
                    margin: "0 auto",
                    fontFamily:
                      '-apple-system, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                    fontSize: "16px",
                    fontWeight: 500,
                    lineHeight: 0,
                    outline: "transparent",
                    px: 10, // padding-left and padding-right
                    py: 3, // padding-top and padding-bottom
                    mt: 4,
                    textAlign: "center",
                    textDecoration: "none",
                    transition: "box-shadow .2s ease-in-out",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    touchAction: "manipulation",
                    whiteSpace: "nowrap",
                    "&:not([disabled]):focus": {
                      boxShadow:
                        "0 0 .25rem rgba(0, 0, 0, 0.5), -.125rem -.125rem 1rem rgb(82, 209, 105), .125rem .125rem 1rem rgba(192, 230, 123, 0.5)",
                    },
                    "&:not([disabled]):hover": {
                      boxShadow:
                        "0 0 .25rem rgba(0, 0, 0, 0.5), -.125rem -.125rem 1rem rgb(82, 209, 105), .125rem .125rem 1rem rgba(175, 203, 122, 0.5)",
                    },
                  }}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : submitSuccess ? (
                      <CheckCircleIcon />
                    ) : null
                  }
                >
                  {isSubmitting
                    ? "paying..."
                    : submitSuccess
                    ? "Payment Successful"
                    : "Confirm and Pay"}
                </Button>
              </Paper>
            </Grow>

            <Zoom
              in={true}
              timeout={1200}
              mt={10}
              onClick={() => navigate("/contactus")}
            >
              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  py: 3,
                  borderRadius: 3,
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  //data occur with mail at updations @ mrfranchise
                  // onClick: () => navigate("/contactus"),
                  background: `linear-gradient(135deg, ${primaryOrange} 0%, ${primaryGreen} 100%)`,
                  backgroundSize: "200% 200%",
                  animation: `${gradientShift} 3s ease infinite, ${pulseAnimation} 2s ease-in-out infinite`,
                  boxShadow: `0 8px 30px ${primaryOrange}40`,
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: `0 12px 40px ${primaryOrange}60`,
                    background: `linear-gradient(135deg, ${darkOrange} 0%, ${darkGreen} 100%)`,
                  },
                  transition: "all 0.3s ease",
                }}
              >
                🎯 Please Contact support@mrfranchise.in To Buy 🎯
              </Button>
            </Zoom>
          </>
        ) : (
          /* Payment Success Screen */
          <Zoom in={true} timeout={1000}>
            <Paper
              elevation={8}
              sx={{
                p: 5,
                textAlign: "center",
                borderRadius: 4,
                background: `linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(255, 107, 53, 0.05) 100%)`,
                border: `3px solid ${primaryGreen}30`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  animation: `${floatAnimation} 2s ease-in-out infinite`,
                }}
              >
                <CheckCircle
                  sx={{
                    fontSize: 120,
                    color: primaryGreen,
                    mb: 3,
                    filter: `drop-shadow(0 0 20px ${primaryGreen}40)`,
                  }}
                />
              </Box>

              <Typography
                variant="h2"
                sx={{
                  mb: 3,
                  fontWeight: 900,
                  background: `linear-gradient(135deg, ${primaryGreen} 0%, ${darkGreen} 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  animation: `${glowAnimation} 2s ease-in-out infinite`,
                }}
              >
                Payment Successful!
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${primaryOrange} 0%, ${primaryGreen} 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                🎉 Your payment of ₹{totalAmount.toLocaleString()} has been
                received! 🎉
              </Typography>

              <Box
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  p: 4,
                  borderRadius: 3,
                  textAlign: "left",
                  mb: 4,
                  border: `2px solid ${primaryOrange}20`,
                  boxShadow: `0 8px 30px ${primaryGreen}20`,
                  backdropFilter: "blur(10px)",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    mb: 3,
                    fontWeight: 700,
                    color: primaryOrange,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Star sx={{ fontSize: 28, color: primaryOrange }} />
                  Transaction Details:
                </Typography>

                {[
                  {
                    label: "Transaction ID:",
                    value: upiId,
                    color: primaryGreen,
                  },
                  {
                    label: "Payment Method:",
                    value: "UPI / Google Pay",
                    color: primaryOrange,
                  },
                  {
                    label: "Subtotal:",
                    value: `₹${subtotal.toLocaleString()}`,
                    color: primaryGreen,
                  },
                  {
                    label: "GST (18%):",
                    value: `₹${gstAmount.toLocaleString()}`,
                    color: primaryOrange,
                  },
                ].map((item, index) => (
                  <Fade in={true} timeout={800 + index * 200} key={item.label}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                        p: 1,
                        borderRadius: 1,
                        "&:hover": {
                          backgroundColor: "rgba(255, 107, 53, 0.05)",
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        color="text.primary"
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color={item.color}
                      >
                        {item.value}
                      </Typography>
                    </Box>
                  </Fade>
                ))}

                <Divider sx={{ my: 3, borderColor: `${primaryOrange}30` }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    backgroundColor: "rgba(76, 175, 80, 0.1)",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h5" fontWeight={900} color={darkGreen}>
                    Total Paid:
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight={900}
                    sx={{
                      background: `linear-gradient(135deg, ${primaryGreen} 0%, ${darkGreen} 100%)`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                      animation: `${pulseAnimation} 2s ease-in-out infinite`,
                    }}
                  >
                    ₹{totalAmount.toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                size="large"
                onClick={() =>
                  handleSubmit({
                    membership,
                    banners: [],
                    paymentMethod,
                    upiId,
                    gstAmount,
                    totalAmount,
                    subtotal,
                  })
                }
                sx={{
                  px: 8,
                  py: 2,
                  borderRadius: 3,
                  fontWeight: 800,
                  fontSize: "1.2rem",
                  background: `linear-gradient(135deg, ${primaryOrange} 0%, ${primaryGreen} 100%)`,
                  backgroundSize: "200% 200%",
                  animation: `${gradientShift} 3s ease infinite`,
                  boxShadow: `0 8px 30px ${primaryGreen}40`,
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: `0 12px 40px ${primaryGreen}60`,
                    background: `linear-gradient(135deg, ${darkOrange} 0%, ${darkGreen} 100%)`,
                  },
                  transition: "all 0.3s ease",
                }}
              >
                🚀 Continue to Dashboard 🚀
              </Button>
            </Paper>
          </Zoom>
        )}
      </Box>

      {/* <Snackbar
                open={snackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              >
                <Alert
                  onClose={handleCloseSnackbar}
                  severity={snackbar.severity}
                  sx={{ width: "100%" }}
                >
                  {snackbar.message}
                </Alert>
              </Snackbar> */}
    </Box>
  );
};

export default PaymentPage;
