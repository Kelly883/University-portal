import { useState } from 'react';

const feesData = [
  { id: 1, name: 'School Fees', amount: 50000, paid: false },
  { id: 2, name: 'Acceptance Fees', amount: 25000, paid: false },
  { id: 3, name: 'Departmental Fees', amount: 10000, paid: false },
];

const PaymentPortal = () => {
  const [fees, setFees] = useState(feesData);
  const [paymentHistory, setPaymentHistory] = useState([]);

  const handlePayment = (feeId) => {
    const feeToPay = fees.find(fee => fee.id === feeId);
    // Mock payment gateway integration
    console.log(`Processing payment of ${feeToPay.amount} for ${feeToPay.name}`);
    setFees(fees.map(fee => fee.id === feeId ? { ...fee, paid: true } : fee));
    setPaymentHistory([...paymentHistory, { ...feeToPay, date: new Date().toLocaleDateString() }]);
  };

  const nextFeeToPay = fees.find(fee => !fee.paid);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Fee Payment</h1>

      {/* Fees to be Paid */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Pay Your Fees</h2>
        {nextFeeToPay ? (
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-bold">{nextFeeToPay.name}</h3>
            <p>Amount: ₦{nextFeeToPay.amount.toLocaleString()}</p>
            <div className="mt-4">
              <button onClick={() => handlePayment(nextFeeToPay.id)} className="px-4 py-2 bg-green-500 text-white rounded mr-2">Pay with Flutterwave</button>
              <button onClick={() => handlePayment(nextFeeToPay.id)} className="px-4 py-2 bg-blue-500 text-white rounded">Pay with Paystack</button>
            </div>
          </div>
        ) : (
          <p>All fees have been paid.</p>
        )}
      </div>

      {/* Payment History */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
        <button onClick={() => alert('Downloading payment history...')} className="mb-4 px-4 py-2 bg-gray-500 text-white rounded">Download History</button>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Fee Type</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Date Paid</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.map((payment) => (
              <tr key={payment.id} className="text-center border-b">
                <td className="py-2">{payment.name}</td>
                <td className="py-2">₦{payment.amount.toLocaleString()}</td>
                <td className="py-2">{payment.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentPortal;
