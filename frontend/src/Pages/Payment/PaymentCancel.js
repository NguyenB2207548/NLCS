import React from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentCancel = () => {
  const [params] = useSearchParams();
  const contractID = params.get("contractID");

  return (
    <div className="container mt-5 text-center">
      <h2 className="text-danger">❌ Thanh toán thất bại hoặc đã bị hủy</h2>
      {contractID && (
        <p>Mã hợp đồng: <strong>{contractID}</strong></p>
      )}
      <p>Vui lòng thử lại hoặc chọn phương thức thanh toán khác.</p>
    </div>
  );
};

export default PaymentCancel;
