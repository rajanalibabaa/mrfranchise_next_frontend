"use client";

import PaymentButton from "./PaymentButton";

export default function PaymentPage() {
  const dummyUser = {
    _id: "USER_ID_123",
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Buy Plan</h1>

      <div style={{ marginTop: 20 }}>
        <p>Plan: Gold</p>
        <p>Price: ₹500</p>

        <PaymentButton user={dummyUser} />
      </div>
    </div>
  );
}