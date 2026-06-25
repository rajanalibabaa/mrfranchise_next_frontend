"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { getUserId } from "@/Utils/autherId";
import { toast } from "react-hot-toast"; // For notifications
import { CircularProgress, Button } from "@mui/material";

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

        onSuccess?.({
          package: response.data,

          offline: true,
        });

        return;
      }

      // ===============================
      // ONLINE FLOW START
      // ===============================

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

 const {
  orderId,
  key,
  currency,
  amount: orderAmount,
} = paymentData.data;


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

    color:"#6366f1"

  },


  handler: async function(response){


    console.log(
      "RAZORPAY RESPONSE",
      response
    );


    try {


      const verifyResponse = await axios.post(

        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payment/verify`,

        {

          razorpay_order_id:
          response.razorpay_order_id,


          razorpay_payment_id:
          response.razorpay_payment_id,


          razorpay_signature:
          response.razorpay_signature,

        }

      );


      if(verifyResponse.data.success){


        toast.success(
          "Payment successful"
        );


        onSuccess?.(
          verifyResponse.data
        );


      }


    }
    catch(err){

      console.log(
        "VERIFY ERROR",
        err
      );

      toast.error(
        "Payment verification failed"
      );

    }


  },


  modal: {

    ondismiss:()=>{

      toast.error(
        "Payment cancelled"
      );

    }

  }


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
  );
}
