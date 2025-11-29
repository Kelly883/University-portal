import React from 'react';
import useFlutterwave from '../hooks/useFlutterwave';
import usePaystack from '../hooks/usePaystack';
import './PaymentPortalPage.css';

const PaymentPortalPage: React.FC = () => {
  // Mock data - in a real application, this would come from an API
  const transactions = [
    { id: 1, date: '2023-10-28', description: 'Tuition Fee', amount: 5000, status: 'Completed' },
    { id: 2, date: '2023-09-15', description: 'Library Fee', amount: 50, status: 'Completed' },
  ];

  const flutterwaveConfig = {
    publicKey: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: Date.now().toString(),
    amount: 5000,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: 'user@gmail.com',
      phone_number: '070********',
      name: 'john doe',
    },
    customizations: {
      title: 'My store',
      description: 'Payment for items in cart',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  };

  const paystackConfig = {
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email: 'user@example.com',
    amount: 20000,
    ref: new Date().getTime().toString(),
  };

  const handleFlutterwavePayment = useFlutterwave(flutterwaveConfig);
  const handlePaystackPayment = usePaystack(paystackConfig);


  const handleDownloadReceipt = (transactionId: number) => {
    // In a real application, you would generate and download a receipt
    alert(`Downloading receipt for transaction ${transactionId}`);
  };

  return (
    <div className="payment-portal-page">
      <h1>Payment Portal</h1>

      <div className="payment-buttons">
        <button onClick={handleFlutterwavePayment}>Pay with Flutterwave</button>
        <button onClick={handlePaystackPayment}>Pay with Paystack</button>
      </div>

      <div className="transaction-history">
        <h2>Transaction History</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.date}</td>
                <td>{transaction.description}</td>
                <td>${transaction.amount}</td>
                <td>{transaction.status}</td>
                <td>
                  <button onClick={() => handleDownloadReceipt(transaction.id)}>Download Receipt</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentPortalPage;
