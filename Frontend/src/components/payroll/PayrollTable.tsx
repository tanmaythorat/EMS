import React from 'react';
import { CheckCircle, Trash2 } from 'lucide-react';

interface PayrollTableProps {
  data: {
    id: string;
    employeeName: string;
    employeeId: string;
    salary: string;
    bonus: string;
    deductions: string;
    netPay: string;
    status: string;
    paymentDate: string;
  }[];
  loading: boolean;
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
}

const PayrollTable: React.FC<PayrollTableProps> = ({ data, loading, onApprove, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading payroll data...</div>;
  }

  if (data.length === 0) {
    return <div className="text-center py-8">No payroll records found</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bonus</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.id}>
              <td className="px-6 py-4 whitespace-nowrap">{row.employeeName}</td>
              <td className="px-6 py-4 whitespace-nowrap">{row.employeeId}</td>
              <td className="px-6 py-4 whitespace-nowrap">{row.salary}</td>
              <td className="px-6 py-4 whitespace-nowrap">{row.bonus}</td>
              <td className="px-6 py-4 whitespace-nowrap">{row.deductions}</td>
              <td className="px-6 py-4 whitespace-nowrap font-semibold">{row.netPay}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(row.status)}`}>
                  {row.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{new Date(row.paymentDate).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                {row.status === 'Pending' && (
                  <button
                    onClick={() => onApprove(row.id)}
                    className="text-green-600 hover:text-green-900 flex items-center gap-1"
                    title="Approve Payroll"
                  >
                    <CheckCircle className="h-5 w-5" />
                    Approve
                  </button>
                )}
                <button
                  onClick={() => onDelete(row.id)}
                  className="text-red-600 hover:text-red-900 flex items-center gap-1"
                  title="Delete Payroll"
                >
                  <Trash2 className="h-5 w-5" />
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayrollTable;