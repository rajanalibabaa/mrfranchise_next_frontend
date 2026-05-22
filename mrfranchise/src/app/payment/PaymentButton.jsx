"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { getUserId } from "@/Utils/autherId";
import { toast } from "react-hot-toast"; // For notifications
import { CircularProgress, Button } from "@mui/material";

export default function PaymentButton({ amount, packageName, packageData, onSuccess }) {
  const [brandData, setBrandData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const uuid = getUserId();

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
        name: brand?.brandDetails?.fullName || "MrFranchise User",
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

  // ✅ Secure Payment Handler
  const handlePayment = useCallback(async () => {
    // ✅ Validation
    if (loading) {
      toast.error("Please wait, loading your details...");
      return;
    }

    if (!brandData?.email || !brandData?.phone || !brandData?.name) {
      toast.error("Complete your profile to proceed with payment");
      return;
    }

    if (!amount || amount <= 0) {
      toast.error("Invalid payment amount");
      return;
    }

    try {
      setPaymentLoading(true);

      // ✅ 1. Load Razorpay SDK
      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        toast.error("Payment gateway failed to load. Please try again.");
        return;
      }

      const firstPackage = packageData?.[0];
const firstItem = firstPackage?.items?.[0];

const payload = {
  brandOwnerId: uuid,

  email: brandData.email,
  phone: brandData.phone,
  name: brandData.name,
  brandID: brandData.brandID,

  // =========================
  // TOTALS
  // =========================
  totalAmount: packageData.reduce(
    (sum, pkg) => sum + Number(pkg.amount || 0),
    0
  ),

  totalLeads: packageData.reduce(
    (sum, pkg) => sum + Number(pkg.totalLeads || 0),
    0
  ),

  // =========================
  // ALL PACKAGES
  // =========================
  packages: packageData.map((pkg) => ({
    groupKey: pkg.groupKey,

    packagesType: pkg.packagesType,

    packageName: pkg.planName,

    planId: pkg.planId,

    planPackageId: pkg.planPackageId,

    planUniqueId: pkg.planUniqueId,

    investmentRangeLabel:
      pkg.investmentRangeLabel,

    amount: Number(pkg.amount || 0),

    totalLeads: Number(pkg.totalLeads || 0),

    selectedLeads: Number(
      pkg.selectedLeads || 0
    ),

    totalStates: Number(
      pkg.totalStates || 0
    ),

    uniqueStates: pkg.uniqueStates || [],

    validityDays:
      Number(pkg.validityDays || 30),

    pricePerState:
      Number(pkg.pricePerState || 0),

    // =========================
    // ALL ITEMS
    // =========================
    items:
      pkg.items?.map((item) => ({
        id: item.id,

        investmentRangeLabel:
          item.investmentRangeLabel,

        range: item.range,

        selectedLeads: Number(
          item.selectedLeads || 0
        ),

        states: Array.isArray(item.states)
          ? item.states
          : [],

        amount: Number(item.amount || 0),
      })) || [],
  })),

  // =========================
  // GST
  // =========================
  billingState: "TN",
  companyState: "TN",

  gstNumber: "",
  pan: "",
};

console.log("PAYLOAD:", payload);



      // ✅ 2. Create Payment Order (Pass ALL required fields)
      const orderResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payment/create`,payload,
        {
          headers: {
            "Content-Type": "application/json",
            // Add client-side signature if implemented
            // "X-Client-Signature": clientSignature,
            // "X-Timestamp": Date.now(),
          },
          timeout: 15000,
        }
      );

      const { data } = orderResponse;

      if (!data.success) {
        toast.error(data.message || "Failed to create payment order");
        return;
      }

      const { orderId, key, currency, amount: orderAmount } = data.data;

      // ✅ 3. Razorpay Checkout Options (Enhanced)
      const options = {
        key,
        amount: orderAmount, // Always in paise from backend
        currency,
        name: "Mr Franchise",
description: `Purchase: ${packageData.length} Package(s)`,
        order_id: orderId,
        image: "/logo.png", // Your logo
        prefill: {
          name: brandData.name,
          email: brandData.email,
          contact: brandData.phone.replace(/[^0-9]/g, ""), // Clean phone
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: async function () {
            toast("Payment cancelled", { icon: "❌" });
          },
        },
        handler: async function (response) {
          try {
            // ✅ 4. Verify Payment (Critical Security Step)
            const verifyResponse = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { timeout: 10000 }
            );

           if (verifyResponse.data.success) {

  // =========================
  // CREATE BRAND PACKAGE
  // =========================

const packagePayload = {
  brandOwnerId: uuid,

  packages: packageData.map(
    (pkgGroup) => ({
      packagesType:
        pkgGroup?.packagesType,

      packagesName:
        pkgGroup?.planName,

      planUniqueId:
        pkgGroup?.planUniqueId,

      InvestmetPackages: [
        {
          // ✅ LABEL
          InvestmetRageLabel:
            pkgGroup?.investmentRangeLabel,

          // ✅ RANGE + STATES
          investmentranges:
            pkgGroup?.items.map(
              (item) => ({
                selectedPlanInvestmetrange:
                  item?.range || "",

                selectedPlanState:
                  Array.isArray(
                    item?.states
                  )
                    ? item.states
                    : [],
              })
            ) || [],

          // ✅ TOTAL LEADS
          TotalLeads:
          pkgGroup?.packagesType ===
          "LISTING"
            ? 0
            : Number(
                pkgGroup?.totalLeads || 0
              ),

          // ✅ REMAINING LEADS
         remainingLeads:
          pkgGroup?.packagesType ===
          "LISTING"
            ? 0
            : Number(
                pkgGroup?.selectedLeads || 0
              ),

          // ✅ AMOUNT
          TotalAmount:
            pkgGroup?.amount || 0,

          // ✅ VALIDITY
          Validity:
            pkgGroup?.validityDays ||
            30,

          // ✅ DATES
          PackageStartDate:
            new Date(),

          PackageEndDate:
            new Date(
              Date.now() +
                Number(
                  pkgGroup?.validityDays ||
                    30
                ) *
                  24 *
                  60 *
                  60 *
                  1000
            ),

          CurrentDate:
            new Date(),

          RenewalEndDate:
            new Date(
              Date.now() +
                Number(
                  pkgGroup?.validityDays ||
                    30
                ) *
                  24 *
                  60 *
                  60 *
                  1000
            ),

          // ✅ STATUS
          isPaused: false,

          pauseHistory: [],

          isExperied: false,

          isActive: false,

          isPending: false,

          // ✅ PAYMENT
          paymentId:
            verifyResponse.data.data
              .paymentId,

          orderId:
            verifyResponse.data.data
              .orderId,
        },
      ],
    })
  ),
};

console.log(
  "PACKAGE PAYLOAD:",
  packagePayload
);

  
  // =========================
  // CREATE PACKAGE API
  // =========================

  const packageResponse =
    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/brand-packages-plans/create`,
      packagePayload,
      {
        headers: {
          "Content-Type":
            "application/json",
        },
      }
    );

  console.log(
    "PACKAGE RESPONSE:",
    packageResponse.data
  );

  // =========================
  // SUCCESS
  // =========================

  toast.success(
    "Payment Successful! 🎉"
  );

  onSuccess?.({
    payment:
      verifyResponse.data.data,

    package:
      packageResponse.data,
  });
}
          } catch (verifyErr) {
            toast.error("Payment verification failed. Please contact support.");
            console.error("Verification Error:", verifyErr);
          }
        },
        notes: {
          packageName,
          brandOwnerId: uuid,
        },
      };

      // ✅ 5. Open Razorpay Checkout
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Payment Error:", err);
      alert(err?.response?.data?.message);
  console.log(
    "BACKEND RESPONSE:",
    err?.response?.data
  );

      // Enhanced Error Handling
      if (err.code === "ECONNABORTED") {
        toast.error("Payment request timed out. Please try again.");
      } else if (err.response?.status === 400) {
        toast.error(err.response.data.message || "Invalid payment details");
      } else if (err.response?.status === 429) {
        toast.error("Too many payment attempts. Please wait.");
      } else {
        toast.error("Payment failed. Please try again.");
      }
    } finally {
      setPaymentLoading(false);
    }
  }, [brandData, amount, packageName, packageData, uuid, loading, loadRazorpayScript, onSuccess]);

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
    <Button
      fullWidth
      onClick={handlePayment}
      disabled={paymentLoading || !brandData}
      sx={{
        minHeight: 56,
        fontSize: "16px",
        fontWeight: 700,
        background: "linear-gradient(135deg, #6366f1, #ec4899)",
        color: "white",
        borderRadius: "14px",
        boxShadow: "0 20px 40px rgba(99,102,241,0.4)",
        textTransform: "none",
        "&:hover": {
          background: "linear-gradient(135deg, #5855eb, #db2777)",
          transform: "translateY(-2px)",
          boxShadow: "0 25px 50px rgba(236,72,153,0.5)",
        },
        "&:disabled": {
          background: "rgba(99,102,241,0.4)",
          transform: "none",
        },
      }}
    >
      {paymentLoading ? (
        <>
          <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
          Processing Payment...
        </>
      ) : (
        `Pay ₹${amount?.toLocaleString()}`
      )}
    </Button>
  );
}