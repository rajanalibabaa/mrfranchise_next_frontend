"use client";

import { useEffect, useState } from "react";
import PaymentButton from "./PaymentButton";

export default function PaymentPage() {
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("paymentSummary");
    if (data) {
      setPaymentData(JSON.parse(data));
    }
  }, []);

  if (!paymentData) return <p>Loading...</p>;

  // ✅ Calculate totals
  const subtotal = paymentData.reduce((sum, g) => sum + g.amount, 0);

  const gst = Math.round(subtotal * 0.18); // 18% GST
  const platformFee = 50; // optional
  const finalAmount = subtotal + gst ;

  return (
    <div style={{ padding: 40 }}>
      <h1>Checkout</h1>

      {paymentData.map((group, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <p><b>{group.planName}</b></p>
          <p>States: {group.totalStates}</p>
          <p>Amount: ₹{group.amount}</p>
        </div>
      ))}

      <hr />

      <h3>Subtotal: ₹{subtotal}</h3>
      <h3>GST (18%): ₹{gst}</h3>
      <h3>Platform Fee: ₹{platformFee}</h3>

      <h2>Total: ₹{finalAmount}</h2>

      {/* ✅ Pass correct data */}
      <PaymentButton
        amount={finalAmount}
        paymentData={paymentData}
      />
    </div>
  );
}