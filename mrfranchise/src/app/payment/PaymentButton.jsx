"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { getUserId } from "@/Utils/autherId";
import { toast } from "react-hot-toast"; // For notifications
import {
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

import { useRouter } from "next/navigation";

export default function PaymentButton({
  amount,
  packageName,
  packageData,
  onSuccess,
  paymentMode = "online",
}) {
  const [brandData, setBrandData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [limitPopup, setLimitPopup] = useState(false);
  const uuid = getUserId();
  const [offlineDialog, setOfflineDialog] = useState(false);
  const [offlineData, setOfflineData] = useState(null);
  const router = useRouter();

  // ✅ Enhanced Brand Data Fetching
  const fetchBrandData = useCallback(async () => {
    if (!uuid) return;

    try {
      setLoading(true);
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/brandlisting/getBrandById/${uuid}`;
      const { data } = await axios.get(url, {
        timeout: 10000, // 10s timeout
      });

      const brand = data?.data;

      if (!brand?.brandDetails) {
        throw new Error("Brand information not found");
      }

      setBrandData({
        name: brand?.brandDetails?.brandName || "MrFranchise User",
        email: brand?.brandDetails?.email || "",
        phone: brand?.brandDetails?.mobileNumber || "",
        brandID: brand?.brandID || uuid,
      });
    } catch (err) {
      console.error("Brand Fetch Error:", err);
      toast.error("Failed to load your details. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, [uuid]);

  useEffect(() => {
    fetchBrandData();
  }, [fetchBrandData]);

  // ✅ Load Razorpay SDK
  const loadRazorpayScript = useCallback(async () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        setRazorpayLoaded(true);
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        setRazorpayLoaded(true);
        resolve(true);
      };
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const handleOfflineClose = () => {
    setOfflineDialog(false);

    router.push("/advertisewithus"); // your advertise page route
  };

  // ✅ Secure Payment Handler
  const handlePayment = useCallback(async () => {
    try {
      setPaymentLoading(true);

      // ===============================
      // OFFLINE FLOW
      // ===============================
      if (paymentMode === "offline") {
        const packagePayload = {
          brandOwnerId: uuid,

          packages: packageData.map((pkgGroup) => ({
            packagesType: pkgGroup.packagesType,

            packagesName: pkgGroup.planName,

            planUniqueId: pkgGroup.planUniqueId,

            InvestmetPackages: [
              {
                InvestmetRageLabel: pkgGroup.investmentRangeLabel,

                investmentranges:
                  pkgGroup.items?.map((item) => ({
                    selectedPlanInvestmetrange: item.range,

                    selectedPlanState: item.states || [],
                  })) || [],

                TotalLeads:
                  pkgGroup.packagesType === "LISTING"
                    ? 0
                    : Number(pkgGroup.totalLeads || 0),

                remainingLeads:
                  pkgGroup.packagesType === "LISTING"
                    ? 0
                    : Number(pkgGroup.selectedLeads || 0),

                TotalAmount: Number(pkgGroup.amount),

                Validity: pkgGroup.validityDays || 30,

                PackageStartDate: new Date(),

                PackageEndDate: new Date(
                  Date.now() + Number(pkgGroup.validityDays || 30) * 86400000,
                ),

                isActive: false,

                isPending: true,

                // REMOVE THIS
                // paymentId:data.data.paymentId
                // orderId:data.data.orderId
              },
            ],
          })),
        };

        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/brand-packages-plans/create`,

          packagePayload,
        );

        toast.success("Offline payment submitted");

        setOfflineData({
          message: "Offline payment submitted successfully",

          package: response.data,
        });

        setOfflineDialog(true);

        // IMPORTANT
        // do not call onSuccess here

        return;
      }

      // ===============================
      // ONLINE FLOW START
      // ===============================
      if (Number(amount) > 500000) {
        setLimitPopup(true);

        return;
      }

      const payload = {
        brandOwnerId: uuid,

        paymentMode: "online",

        email: brandData.email,

        phone: brandData.phone,

        name: brandData.name,

        packages: packageData,

        totalAmount: amount,
      };

      const orderResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payment/create`,

        payload,
      );

      const paymentData = orderResponse.data;

      if (!paymentData.success) {
        toast.error("Order creation failed");

        return;
      }

      const { orderId, key, currency, amount: orderAmount } = paymentData.data;

      // Load Razorpay
      const loaded = await loadRazorpayScript();

      if (!loaded) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      // Open Razorpay Checkout

      const options = {
        key: key,

        amount: orderAmount,

        currency: currency || "INR",

        name: "Mr Franchise",

        description: packageName || "Franchise Package",

        order_id: orderId,

        prefill: {
          name: brandData.name,

          email: brandData.email,

          contact: brandData.phone,
        },

        theme: {
          color: "#6366f1",
        },

        handler: async function (response) {
          console.log("RAZORPAY RESPONSE", response);

          try {
            const verifyResponse = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payment/verify`,

              {
                razorpay_order_id: response.razorpay_order_id,

                razorpay_payment_id: response.razorpay_payment_id,

                razorpay_signature: response.razorpay_signature,
              },
            );

            if (verifyResponse.data.success) {
              // CREATE BRAND PACKAGE AFTER ONLINE PAYMENT SUCCESS

              const packagePayload = {
                brandOwnerId: uuid,

                packages: packageData.map((pkgGroup) => ({
                  packagesType: pkgGroup.packagesType,

                  packagesName: pkgGroup.planName,

                  planUniqueId: pkgGroup.planUniqueId,

                  InvestmetPackages: [
                    {
                      InvestmetRageLabel: pkgGroup.investmentRangeLabel,

                      investmentranges:
                        pkgGroup.items?.map((item) => ({
                          selectedPlanInvestmetrange: item.range,

                          selectedPlanState: item.states || [],
                        })) || [],

                      TotalLeads:
                        pkgGroup.packagesType === "LISTING"
                          ? 0
                          : Number(pkgGroup.selectedLeads || 0),

                      remainingLeads:
                        pkgGroup.packagesType === "LISTING"
                          ? 0
                          : Number(pkgGroup.selectedLeads || 0),

                      TotalAmount: Number(pkgGroup.amount),

                      Validity: pkgGroup.validityDays || 30,

                      PackageStartDate: new Date(),

                      PackageEndDate: new Date(
                        Date.now() +
                          Number(pkgGroup.validityDays || 30) * 86400000,
                      ),

                      paymentId: verifyResponse.data.data?.paymentId || "",

                      orderId: verifyResponse.data.data?.orderId || "",

                      isActive: false,

                      isPending: true,
                    },
                  ],
                })),
              };

              const packageCreateResponse = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/brand-packages-plans/create`,

                packagePayload,
              );

              console.log("ONLINE PACKAGE CREATED", packageCreateResponse.data);

              toast.success("Payment and package created successfully");

              onSuccess?.({
                payment: verifyResponse.data,

                package: packageCreateResponse.data,
              });
            }
          } catch (err) {
            console.log("VERIFY ERROR", err);

            toast.error("Payment verification failed");
          }
        },

        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();

      // Razorpay code here
    } catch (error) {
      console.log(error);

      toast.error("Payment failed");
    } finally {
      setPaymentLoading(false);
    }
  }, [paymentMode, packageData, uuid, amount, brandData, onSuccess]);

  // ✅ Show loading state
  if (loading) {
    return (
      <Button fullWidth disabled sx={{ minHeight: 56 }}>
        <CircularProgress size={24} sx={{ color: "white", mr: 1 }} />
        Loading your details...
      </Button>
    );
  }

  return (
    <>
      <Button
        fullWidth
        onClick={handlePayment}
        disabled={paymentLoading || !brandData}
        sx={{
          minHeight: 56,
          fontSize: "16px",
          fontWeight: 700,
          background: "linear-gradient(135deg, #ff9800, rgb(250, 163, 13))",
          color: "white",
          borderRadius: "14px",
          boxShadow: "0 20px 40px rgba(99,102,241,0.4)",
          textTransform: "none",
          "&:hover": {
            background: "linear-gradient(135deg, #ff99009d, #ff990081)",
            transform: "translateY(-2px)",
            boxShadow: "0 25px 50px rgba(236,72,153,0.5)",
          },
          "&:disabled": {
            background: "rgba(215, 216, 255, 0.4)",
            transform: "none",
          },
        }}
      >
        {paymentLoading ? (
          <>
            <CircularProgress size={20} />
            Processing...
          </>
        ) : paymentMode === "offline" ? (
          "Submit Offline Payment"
        ) : (
          `Pay ₹${amount?.toLocaleString()}`
        )}
      </Button>
      <Dialog
        open={limitPopup}
        onClose={() => setLimitPopup(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            padding: "10px",
          },
        }}
      >
        {/* Header */}

        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight: 700,
          }}
        >
          <Box>⚠️ Payment Limit Notice</Box>

          <IconButton onClick={() => setLimitPopup(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Typography
            textAlign="center"
            sx={{
              fontSize: "15px",
              color: "#555",
              lineHeight: 1.7,
            }}
          >
            For security and compliance reasons,
            <br />
            online payments above
            <br />
            <Box
              component="span"
              sx={{
                color: "#f57c00",
                fontWeight: 800,
                fontSize: "18px",
              }}
            >
              ₹5,00,000
            </Box>
            <br />
            cannot be processed directly.
            <br />
            <br />
            Please contact our support team for high-value payments.
          </Typography>

          <Box
            mt={3}
            sx={{
              background: "#f8f9fa",

              borderRadius: "14px",

              padding: "15px",
            }}
          >
            <Typography
              display="flex"
              alignItems="center"
              gap={1}
              fontSize="14px"
              mb={1}
            >
              <EmailIcon fontSize="small" sx={{ color: "#1976d2" }} />

              <a
                href="mailto:support@cholabiz.com"
                style={{
                  textDecoration: "none",
                  color: "#1976d2",
                }}
              >
                support@cholabiz.com
              </a>
            </Typography>

            <Typography
              display="flex"
              alignItems="center"
              gap={1}
              fontSize="14px"
              mb={1}
            >
              <EmailIcon fontSize="small" sx={{ color: "#1976d2" }} />

              <a
                href="mailto:accounts@mrfranchise.in"
                style={{
                  textDecoration: "none",
                  color: "#1976d2",
                }}
              >
                accounts@mrfranchise.in
              </a>
            </Typography>

            <Typography
              display="flex"
              alignItems="center"
              gap={1}
              fontSize="14px"
            >
              <PhoneIcon fontSize="small" sx={{ color: "#2e7d32" }} />
              <a
                href="tel:+917418054477"
                style={{
                  textDecoration: "none",
                  color: "#2e7d32",
                }}
              >
                +91 7418054477
              </a>
              &nbsp; | &nbsp;
              <a
                href="tel:+919841323388"
                style={{
                  textDecoration: "none",
                  color: "#2e7d32",
                }}
              >
                +91 9841323388
              </a>
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
            pb: 3,
          }}
        >
          <Button
            variant="contained"
            onClick={() => setLimitPopup(false)}
            sx={{
              borderRadius: "12px",

              px: 5,

              textTransform: "none",

              fontWeight: 700,

              background: "linear-gradient(135deg,#d32f2f,#ff5252)",

              "&:hover": {
                background: "linear-gradient(135deg,#b71c1c,#ff1744)",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={offlineDialog}
        onClose={handleOfflineClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "24px",
            padding: "10px",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 800,
          }}
        >
          <Box>🎉 Offline Payment Submitted</Box>

          <IconButton onClick={handleOfflineClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              fontSize: "16px",
              color: "#555",
              lineHeight: 1.8,
            }}
          >
            Your offline payment request has been submitted successfully.
          </Typography>

          <Box
            mt={3}
            sx={{
              background: "#f8fafc",
              borderRadius: "16px",
              padding: "16px",
            }}
          >
            <Typography fontWeight={700}>Payment Status</Typography>

            <Typography>🕒 Pending Verification</Typography>
          </Box>

         

          <Box
            mt={3}
            sx={{
              background: "linear-gradient(135deg,#eff6ff,#eef2ff)",
              padding: "16px",
              borderRadius: "16px",
            }}
          >
            <Typography fontWeight={700} color="#2563eb">
              📩 Submit Payment Details
            </Typography>

            <Typography mt={1} fontSize="14px" color="#475569">
              Please send your payment details and transaction proof through
              email. Our team will verify and activate your package quickly.
            </Typography>

            <Typography mt={2} fontWeight={700}>
              accounts@mrfranchise.in | accounts@cholabiz.com
            </Typography>
             <Typography
  display="flex"
  alignItems="center"
  gap={1}
  fontSize="14px"
>
  Submit in WhatsApp :

  <a
    href="https://wa.me/917418054477"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      textDecoration: "none",
      color: "#2e7d32",
      fontWeight: 600,
    }}
  >
    +91 7418054477
  </a>

  &nbsp; | &nbsp;

  <a
    href="https://wa.me/919841323388"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      textDecoration: "none",
      color: "#2e7d32",
      fontWeight: 600,
    }}
  >
    +91 9841323388
  </a>

</Typography>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
            pb: 3,
          }}
        >
          <Button
            variant="contained"
            onClick={handleOfflineClose}
            sx={{
              borderRadius: "14px",
              px: 6,
              fontWeight: 700,
              textTransform: "none",
              background: "linear-gradient(135deg,#2563eb,#6366f1)",
            }}
          >
            Continue to Advertise
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
