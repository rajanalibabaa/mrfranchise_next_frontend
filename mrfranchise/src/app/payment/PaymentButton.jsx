"use client";

import { createPayment, verifyPayment } from "@/lib/paymentapi";
import {getUserId,getToken} from '@/Utils/autherId'

export default function PaymentButton({ user }) {
  const handlePayment = async () => {
    try {
      // 🔥 STEP 1: CREATE ORDER
      const orderRes = await createPayment({
        userId: getUserId(),
        planId: "PLAN123",
        brandOwnerId: "",
        packageName: "Gold Plan",
        amount: 500,
      });

      console.log("ORDER RESPONSE:", orderRes);

      if (!orderRes.success) {
        alert(orderRes.message);
        return;
      }

      const { orderId, key, amount } = orderRes.data;

      // 🔥 STEP 2: OPEN RAZORPAY
      const options = {
        key,
        amount,
        currency: "INR",
        order_id: orderId,

        name: "Mr Franchise",
        description: "Plan Purchase",

        handler: async function (response) {
          console.log("RAZORPAY RESPONSE:", response);

          // 🔥 STEP 3: VERIFY
          const verifyRes = await verifyPayment(response);

          if (verifyRes.success) {
            alert("Payment Success ✅");
            window.location.href = "/payment/success";
          } else {
            alert("Verification failed ❌");
          }
        },

        modal: {
          ondismiss: function () {
            alert("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <button onClick={handlePayment}>
      Pay ₹500
    </button>
  );
}