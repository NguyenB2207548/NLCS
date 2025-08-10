import { useEffect } from "react";

const PaymentSuccess = () => {
  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");

    if (sessionId) {
      fetch("http://localhost:3000/pay/stripe/confirm-stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
        .then(res => res.json())
        .then(data => {
          console.log(data.message);
        });
    }
  }, []);

  return (
    <div className="container mt-5 text-center">
      <h2>✅ Thanh toán thành công!</h2>
      <p>Thông tin hợp đồng đã được cập nhật.</p>
    </div>
  );
};

export default PaymentSuccess;
