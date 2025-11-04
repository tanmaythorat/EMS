import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Download, Filter, Plus, CheckCircle, Trash2 } from 'lucide-react';
import PayrollStats from './PayrollStats';
import PayrollTable from './PayrollTable';

interface PayrollData {
  _id: string;
  empId: string;
  empName: string;
  baseSalary: number;
  deductions: {
    tax: number;
    unpaidLeavePenalty: number;
    otherDeductions: number;
  };
  bonuses: {
    performanceBonus: number;
    overtimePay: number;
  };
  netSalary: number;
  status: 'Pending' | 'Processed' | 'Cancelled';
  paymentDate: string;
}

const PayrollList: React.FC = () => {
  const navigate = useNavigate();
  const [payrollData, setPayrollData] = useState<PayrollData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalPayroll: 0,
    totalEmployees: 0,
    averageSalary: 0
  });

  // Configure axios instance with auth token
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL+ '/api',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

  const fetchPayrollData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.get('/payroll');
      setPayrollData(response.data);
      
      // Calculate statistics
      const totalPayroll = response.data.reduce(
        (sum: number, payroll: PayrollData) => sum + payroll.netSalary, 0
      );
      const totalEmployees = response.data.length;
      const averageSalary = totalEmployees > 0 
        ? totalPayroll / totalEmployees 
        : 0;

      setStats({
        totalPayroll,
        totalEmployees,
        averageSalary
      });
      
    } catch (err) {
      setError('Failed to fetch payroll data. Please try again.');
      console.error('Error fetching payroll data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrollData();
  }, []);

  const handleCreatePayroll = () => {
    navigate('add');
  };

  const handleGeneratePayslips = async () => {
    try {
      const response = await api.post('/payroll/generate-payslips');
      if (response.status === 200) {
        alert('Payslips generated successfully!');
        fetchPayrollData();
      }
    } catch (err) {
      setError('Failed to generate payslips');
      console.error('Error generating payslips:', err);
    }
  };

  const handleApprovePayroll = async (payrollId: string) => {
    try {
      const response = await api.put(`/payroll/approve/${payrollId}`);
      if (response.status === 200) {
        alert('Payroll approved successfully!');
        fetchPayrollData();
      }
    } catch (err) {
      setError('Failed to approve payroll');
      console.error('Error approving payroll:', err);
    }
  };

  const handleDeletePayroll = async (payrollId: string) => {
    if (window.confirm('Are you sure you want to delete this payroll record?')) {
      try {
        const response = await api.delete(`/payroll/${payrollId}`);
        if (response.status === 200) {
          alert('Payroll deleted successfully!');
          fetchPayrollData();
        }
      } catch (err) {
        setError('Failed to delete payroll');
        console.error('Error deleting payroll:', err);
      }
    }
  };

  // Format currency with ₹ symbol and Indian number formatting
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Payroll Management</h1>
        <div className="flex gap-4">
          <button 
            onClick={handleCreatePayroll}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Create Payroll
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            onClick={() => fetchPayrollData()}
          >
            <Filter className="h-5 w-5 text-gray-500" />
            <span>Refresh</span>
          </button>
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
            onClick={handleGeneratePayslips}
          >
            <Download className="h-5 w-5" />
            Generate Payslips
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <PayrollStats 
        totalPayroll={formatCurrency(stats.totalPayroll)}
        totalEmployees={stats.totalEmployees}
        averageSalary={formatCurrency(stats.averageSalary)}
      />

      <PayrollTable 
        data={payrollData.map(payroll => ({
          id: payroll._id,
          employeeName: payroll.empName || `Employee ${payroll.empId}`,
          employeeId: payroll.empId,
          salary: formatCurrency(payroll.baseSalary),
          bonus: formatCurrency(payroll.bonuses.performanceBonus + payroll.bonuses.overtimePay),
          deductions: formatCurrency(payroll.deductions.tax + payroll.deductions.unpaidLeavePenalty + payroll.deductions.otherDeductions),
          netPay: formatCurrency(payroll.netSalary),
          status: payroll.status,
          paymentDate: payroll.paymentDate
        }))} 
        loading={loading}
        onApprove={handleApprovePayroll}
        onDelete={handleDeletePayroll}
      />
    </div>
  );
};

export default PayrollList;