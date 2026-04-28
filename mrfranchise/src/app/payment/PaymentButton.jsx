"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getUserId } from "@/Utils/autherId";

export default function PaymentButton({ amount, packageName }) {
  const [brandData, setBrandData] = useState(null);

  const uuid = getUserId();

  // ✅ 1. Fetch brand details
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/brandlisting/getBrandById/${uuid}`;
        const { data } = await axios.get(url);

        // 🔥 adjust based on your API response structure
        const brand = data?.data;
console.log('brnad',brand);

        setBrandData({
          name: brand?.brandDetails?.fullName || "MrFranchise User",
          email: brand?.brandDetails?.email || "support@mrfranchise.in", 
          phone: brand?.brandDetails?.mobileNumber|| "9841323388" ,
          brandID: brand?.brandID || null
        });

      } catch (err) {
        console.error("Brand Fetch Error:", err);
      }
    };

    if (uuid) fetchBrand();
  }, [uuid]);

  // ✅ Load Razorpay script
  const loadScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  // ✅ 2. Handle Payment
  const handlePayment = async () => {
    try {
      if (!brandData) {
        alert("User data loading... please wait");
        return;
      }

      // ✅ Create order
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payment/create`,
        {
          brandOwnerId: uuid,
          amount,
          packageName,
          email: brandData.email,
          phone: brandData.phone,
          name: brandData.name,
          brandID: brandData.brandID,
        }
      );

      const { orderId, key, currency } = data.data;

      const res = await loadScript();
      if (!res) {
        alert("Razorpay SDK failed to load");
        return;
      }

      // ✅ Razorpay options
      const options = {
        key,
        amount: data.data.amount, // ⚠️ always in paise
        currency,
        name: "Mr Franchise",
        description: packageName,
        order_id: orderId,

        handler: async function (response) {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payment/verify`,
            response
          );

          alert("Payment Success ✅");
        },

        prefill: {
          name: brandData.name,
          email: brandData.email,
          contact: brandData.phone,

        },

        theme: {
          color: "#ff9800",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.log("FULL ERROR:", err);

      if (err.response) {
        console.log("STATUS:", err.response.status);
        console.log("DATA:", err.response.data);
      } else if (err.request) {
        console.log("NO RESPONSE:", err.request);
      } else {
        console.log("ERROR MESSAGE:", err.message);
      }
    }
  };

  // ✅ Disable until data loaded
  return (
    <button onClick={handlePayment} disabled={!brandData}>
      {brandData ? `Pay ₹${amount}` : "Loading user..."}
    </button>
  );
}