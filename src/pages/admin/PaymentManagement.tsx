import { useState } from 'react';

const paymentLogData = [
  { id: 1, studentName: 'John Doe', matricNumber: 'F/C/19/3030', feeType: 'School Fees', amount: 50000, date: '2023-10-26' },
  { id: 2, studentName: 'Jane Smith', matricNumber: 'F/C/19/3031', feeType: 'Acceptance Fees', amount: 25000, date: '2023-10-25' },
];

const PaymentManagement = () => {
  const [paymentLogs, setPaymentLogs] = useState(paymentLogData);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredLogs = paymentLogs.filter(log =>
    Object.values(log).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Payment Management</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, matric number, fee type..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 border rounded"
        />
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Student Name</th>
            <th className="py-2">Matric Number</th>
            <th className="py-2">Fee Type</th>
            <th className="py-2">Amount</th>
            <th className="py-2">Date Paid</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((log) => (
            <tr key={log.id} className="text-center border-b">
              <td className="py-2">{log.studentName}</td>
              <td className="py-2">{log.matricNumber}</td>
              <td className="py-2">{log.feeType}</td>
              <td className="py-2">₦{log.amount.toLocaleString()}</td>
              <td className="py-2">{log.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentManagement;
