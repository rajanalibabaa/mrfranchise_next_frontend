"use client";

import { getUserId } from "@/Utils/autherId";
import axios from "axios";

export default function PaymentButton({  amount = 500, packageName = "Gold Plan" }) {

  const handlePayment = async () => {
    try {
      // ✅ 1. Create order from backend
      const { data } = await axios.post(
        
        "http://localhost:5000/api/v1/payment/create",
        {
          brandOwnerId: getUserId(),
          amount,
          packageName,
        }
      );

      const { orderId, key, currency } = data.data;

      // ✅ 2. Load Razorpay script
      const loadScript = () =>
        new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });

      const res = await loadScript();
      if (!res) {
        alert("Razorpay SDK failed to load");
        return;
      }

      // ✅ 3. Open Razorpay UI
      const options = {
        key,
        amount,
        currency,
        name: "Mr Franchise",
        description: packageName,
        order_id: orderId,

        handler: async function (response) {
          // ✅ 4. Verify payment
          await axios.post(
            "http://localhost:5000/api/v1/payment/verify",
            response
          );

          alert("Payment Success ✅");
        },

        prefill: {
          name: "Test User",
          email: "test@email.com",
          contact: "9999999999",
        },

        theme: {
          color: "#ff9800",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
  console.log("FULL ERROR:", err); // 🔥 always prints something

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

  return (
    <button onClick={handlePayment}>
      Pay ₹{amount}
    </button>
  );
}