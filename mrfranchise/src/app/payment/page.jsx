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
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  CheckBox,
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
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);

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
                background:
                  "linear-gradient(90deg, #4285f4, #34a853, #fbbc04, #ea4335)",
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
          <Typography
            variant="h5"
            fontWeight={500}
            gutterBottom
            color="text.primary"
          >
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

  const subtotal =
    gstBreakdown?.subtotal || paymentData.reduce((sum, g) => sum + g.amount, 0);
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
          mt: { xs: 0, sm: 0, md: 17 },
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

              <Typography
                variant="h4"
                fontWeight={500}
                color="text.primary"
                sx={{ mb: 1 }}
              >
                Checkout
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Review your order and complete payment
              </Typography>
            </Box>
          </Fade>

          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
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
                          {paymentData.length} package
                          {paymentData.length > 1 ? "s" : ""} selected
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  {/* Items List */}
                  <Box sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      {paymentData.map((group, i) => (
                        <Slide
                          key={i}
                          in
                          direction="up"
                          timeout={800 + i * 100}
                        >
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
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="start"
                              >
                                <Box>
                                  <Typography
                                    variant="h6"
                                    fontWeight={500}
                                    sx={{ mb: 0.5 }}
                                  >
                                    {group.planName}
                                  </Typography>
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{ mb: 1 }}
                                  >
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
                                      icon={
                                        <WorkspacePremiumOutlined
                                          sx={{ fontSize: 16 }}
                                        />
                                      }
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
                                <Typography
                                  variant="h6"
                                  fontWeight={600}
                                  color="text.primary"
                                >
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
                  <Stack
                    direction="row"
                    spacing={3}
                    justifyContent="space-around"
                    flexWrap="wrap"
                  >
                    {[
                      {
                        icon: <LockOutlined />,
                        label: "Secure Payment",
                        color: "#4285f4",
                      },
                      {
                        icon: <FlashOnOutlined />,
                        label: "Instant Activation",
                        color: "#34a853",
                      },
                      {
                        icon: <VerifiedUserOutlined />,
                        label: "100% Safe",
                        color: "#fbbc04",
                      },
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
                          {React.cloneElement(item.icon, {
                            sx: { color: item.color },
                          })}
                        </Box>
                        <Typography
                          variant="caption"
                          fontWeight={500}
                          color="text.secondary"
                        >
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
                          Subtotal ({paymentData.length} item
                          {paymentData.length > 1 ? "s" : ""})
                        </Typography>
                        <Typography fontWeight={500}>
                          ₹{subtotal.toLocaleString()}
                        </Typography>
                      </Box>
                      <Divider />
                      {/* GST Breakdown */}
                      <Box>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{ mb: 2 }}
                        >
                          <LocalOfferOutlined
                            sx={{ fontSize: 18, color: "#5f6368" }}
                          />
                          <Typography
                            variant="body2"
                            fontWeight={500}
                            color="text.secondary"
                          >
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
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="h6" fontWeight={500}>
                            Total
                          </Typography>
                          <Typography
                            variant="h5"
                            fontWeight={600}
                            sx={{ color: "#4285f4" }}
                          >
                            ₹{finalAmount.toLocaleString()}
                          </Typography>
                        </Stack>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          Inclusive of all taxes
                        </Typography>
                      </Box>
<Box
  sx={{
    mt: 2,
    p: 2.5,
    borderRadius: 3,
    border: acceptedTerms
      ? "1px solid #22c55e"
      : "1px solid #dbe3ef",
    background: acceptedTerms
      ? "linear-gradient(135deg,#f0fdf4,#ffffff)"
      : "linear-gradient(135deg,#f8fafc,#ffffff)",
    boxShadow: acceptedTerms
      ? "0 8px 25px rgba(34,197,94,0.12)"
      : "0 4px 15px rgba(15,23,42,0.05)",
    transition: "all .3s ease",
    "&:hover":{
      boxShadow:"0 8px 30px rgba(15,23,42,0.10)"
    }
  }}
>

<Stack 
 direction="row" 
 alignItems="flex-start"
 spacing={1.5}
>


<Checkbox
 checked={acceptedTerms}
 onChange={(e)=>setAcceptedTerms(e.target.checked)}
 sx={{
   p:0,
   mt:0.3,
   color:"#2563eb",

   "&.Mui-checked":{
     color:"#16a34a"
   }
 }}
/>


<Box flex={1}>


<Stack
 direction="row"
 alignItems="center"
 spacing={1}
>

<VerifiedUserOutlined
 sx={{
   fontSize:18,
   color: acceptedTerms ? "#16a34a":"#2563eb"
 }}
/>


<Typography
 sx={{
   fontSize:"0.85rem",
   fontWeight:700,
   color:"#0f172a"
 }}
>
 Accept Terms & Conditions
</Typography>


</Stack>



<Typography
 sx={{
   mt:1,
   fontSize:"0.75rem",
   lineHeight:1.6,
   color:"#64748b"
 }}
>

I confirm that I have reviewed and accepted MR FRANCHISE Business Expansion Partnership Terms, Privacy Policy and Refund Policy.


<Typography
 component="span"
 onClick={()=>setOpenTerms(true)}
 sx={{
   ml:0.8,
   color:"#2563eb",
   cursor:"pointer",
   fontWeight:700,
   fontSize:"0.75rem",

   "&:hover":{
     textDecoration:"underline"
   }
 }}
>
 View Terms
</Typography>


</Typography>



{
acceptedTerms && (

<Box
 sx={{
  mt:1.5,
  px:1.5,
  py:0.8,
  borderRadius:2,
  bgcolor:"#dcfce7",
  display:"inline-flex",
  alignItems:"center"
 }}
>

<Typography
 sx={{
  fontSize:"0.7rem",
  color:"#15803d",
  fontWeight:700
 }}
>
✓ Terms Accepted
</Typography>


</Box>

)


}


</Box>


</Stack>


</Box>


{/* Payment Button only after accept */}

{
 acceptedTerms && (

 <>
 
 <PaymentButton
    amount={finalAmount}
    packageName={packagesNames}
    packageData={paymentData}
    paymentMode="online"
    onSuccess={handlePaymentSuccess}
 />


 <Divider sx={{my:2}}/>


 <PaymentButton
    amount={finalAmount}
    packageName={packagesNames}
    packageData={paymentData}
    paymentMode="offline"
    onSuccess={handlePaymentSuccess}
 />

 </>

 )
}
                      {/* Payment Methods */}
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "#fafafa",
                          border: "1px solid #e8eaed",
                        }}
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{ mb: 1 }}
                        >
                          <PaymentOutlined
                            sx={{ fontSize: 18, color: "#5f6368" }}
                          />
                          <Typography
                            variant="caption"
                            fontWeight={500}
                            color="text.secondary"
                          >
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
                        <SecurityOutlined
                          sx={{ fontSize: 18, color: "#34a853" }}
                        />
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
      <Dialog
        open={openTerms}
        onClose={() => setOpenTerms(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        {/* HEADER */}

        <Box
          sx={{
            background: "#0f172a",
            color: "white",
            p: 3,
          }}
        >
          <Typography variant="h5" fontWeight={700}>
            MR FRANCHISE
          </Typography>

          <Typography
            variant="subtitle2"
            sx={{
              mt: 0.5,
              opacity: 0.8,
            }}
          >
            BUSINESS EXPANSION PARTNERSHIP TERMS & CONDITIONS
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 2,
              opacity: 0.9,
            }}
          >
            Operated By:
            <br />
            <b>CHOLA BUSINESS AUTOMATION PRIVATE LIMITED</b>
            
          </Typography>
        </Box>

        {/* CONTENT */}

        <DialogContent
          sx={{
            p: 4,
            background: "#f8fafc",
            maxHeight: "65vh",
          }}
        >
          {[
            {
              title: "1. ACCEPTANCE OF TERMS",
              text: `By selecting a plan, submitting information, executing an order, making payment, or using any services offered through MR FRANCHISE, the Brand confirms that it has read, understood, and agreed to these Terms & Conditions.

The individual accepting these Terms represents and warrants that he/she has authority to bind the Brand and its affiliates.`,
            },

            {
              title: "2. NATURE OF SERVICES",
              text: `MR FRANCHISE is a business expansion platform providing marketing, promotion, investor enquiry generation, investor matching, lead generation, business networking, visibility enhancement, consulting, campaign management and related business expansion services.

Services may include:

• Franchise Expansion
• Dealer Expansion
• Distributor Expansion
• Channel Partner Expansion
• Service Partner Expansion
• Master Franchise Expansion
• Business Opportunity Promotion
• Investor Acquisition Campaigns
• Digital Marketing Activities
• Events, Exhibitions, Conferences and Networking Activities`,
            },

            {
              title: "3. NO GUARANTEE OF BUSINESS RESULTS",
              text: `MR FRANCHISE does not guarantee:

• Franchise sales
• Franchise appointments
• Dealer appointments
• Distributor appointments
• Revenue generation
• Profitability
• Investor conversion
• Business expansion success

MR FRANCHISE only provides contracted business expansion and investor enquiry generation services.`,
            },

            {
              title: "4. BRAND INFORMATION REQUIREMENT",
              text: `The Brand shall provide:

• Brand profile
• Company profile
• Logos
• Photographs
• Product information
• Opportunity details
• Investment details
• Territory details
• Marketing materials
• Contact details
• Required approvals

within three (3) calendar days from payment.`,
            },

            {
              title: "5. CAMPAIGN COMMENCEMENT",
              text: `Campaign commencement may occur through:

• Profile creation
• Profile publication
• Campaign setup
• Advertisement preparation
• Marketing planning
• Portal listing
• Investor matching preparation`,
            },

            {
              title: "6. LEAD DELIVERY POLICY",
              text: `Investor enquiries may originate through:

• Website enquiries
• Digital campaigns
• Social media
• Events
• Exhibitions
• Email campaigns
• Call campaigns

Investor enquiries represent expressions of interest only and are not investment commitments.`,
            },

            {
              title: "7. INVESTOR DELIVERY GUARANTEE",
              text: `Where a plan specifies committed investor enquiries, MR FRANCHISE shall use commercially reasonable efforts to deliver the committed quantity.

If delivery is incomplete, campaign duration may be extended until completion.`,
            },

            {
              title: "8. MONEY BACK GUARANTEE POLICY",
              text: `Eligibility requires:

• Complete information submitted within 3 days
• Brand cooperation
• Investor follow-up within 48 hours
• Proper records maintained
• Claims submitted within required period`,
            },

            {
              title: "9. REFUND POLICY",
              text: `Unless required by law or approved:

• Registration fees are non-refundable
• Listing fees are non-refundable
• Promotion fees are non-refundable
• Marketing fees are non-refundable
• Campaign setup fees are non-refundable`,
            },

            {
              title: "10. PAYMENT TERMS",
              text: `All payments shall be made in advance.

Taxes shall be additional wherever applicable.

MR FRANCHISE may revise plans, pricing and deliverables.`,
            },

            {
              title: "11. DATA USAGE AUTHORIZATION",
              text: `The Brand authorizes MR FRANCHISE to:

• Store information
• Process information
• Publish information
• Promote information
• Advertise information

across digital platforms, websites, applications and marketing channels.`,
            },

            {
              title: "12. GOVERNING LAW AND JURISDICTION",
              text: `These Terms shall be governed by the laws of India.

Disputes shall be resolved through arbitration in Chennai, Tamil Nadu, India.

Courts at Chennai shall have exclusive jurisdiction.`,
            },

            {
              title: "13. MANDATORY CHECKBOX ACCEPTANCE",
              text: `Before payment, the Brand confirms:

☑ Agreement to Website Terms of Use

☑ Agreement to Privacy Policy

☑ Agreement to Refund & Cancellation Policy

☑ Agreement to Investor Delivery Policy

☑ Understanding that MR FRANCHISE does not guarantee sales, revenue or profitability

☑ Authorization to process and promote submitted information

☑ Agreement to Business Expansion Partnership Terms & Conditions`,
            },
          ].map((section, index) => (
            <Box
              key={index}
              sx={{
                mb: 3,
                p: 2.5,
                background: "white",
                borderRadius: 2,
                border: "1px solid #e5e7eb",
              }}
            >
              <Typography
                fontWeight={700}
                sx={{
                  color: "#0f172a",
                  mb: 1,
                }}
              >
                {section.title}
              </Typography>

              <Typography
                sx={{
                  whiteSpace: "pre-line",
                  lineHeight: 1.8,
                  fontSize: "0.9rem",
                  color: "#475569",
                }}
              >
                {section.text}
              </Typography>
            </Box>
          ))}
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <Button
            variant="contained"
            onClick={() => setOpenTerms(false)}
            sx={{
              borderRadius: 2,
              px: 4,
              textTransform: "none",
              backgroundColor:"green"
            }}
          >
            I Understand
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
