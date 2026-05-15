const BASE_URL = "http://localhost:5000/api";

export const createPayment = async (payload) => {
  const res = await fetch(`${BASE_URL}/v1/payment/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-idempotency-key": Date.now().toString(), // optional
    },
    body: JSON.stringify(payload),
  });

  return res.json();
};

export const verifyPayment = async (payload) => {
  const res = await fetch(`${BASE_URL}/v1/payment/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return res.json();
};

export const getPaymentHistory = async (userId) => {
  const res = await fetch(
    `${BASE_URL}/v1/payment/history?userId=${userId}`
  );
  return res.json();
};

export const deletePayment = async (id) => {
  const res = await fetch(`${BASE_URL}/v1/payment/${id}`, {
    method: "DELETE",
  });
  return res.json();
};