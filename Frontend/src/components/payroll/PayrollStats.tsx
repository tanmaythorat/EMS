import React from 'react';
import { DollarSign } from 'lucide-react';

interface PayrollStatsProps {
  totalPayroll: number;
  totalEmployees: number;
  averageSalary: number;
}

const PayrollStats: React.FC<PayrollStatsProps> = ({ 
  totalPayroll, 
  totalEmployees, 
  averageSalary 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Payroll</p>
            <p className="text-2xl font-semibold mt-1">${totalPayroll.toLocaleString()}</p>
          </div>
          <div className="bg-blue-500 p-3 rounded-full">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Employees</p>
            <p className="text-2xl font-semibold mt-1">{totalEmployees}</p>
          </div>
          <div className="bg-green-500 p-3 rounded-full">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Average Salary</p>
            <p className="text-2xl font-semibold mt-1">${averageSalary.toLocaleString()}</p>
          </div>
          <div className="bg-purple-500 p-3 rounded-full">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollStats;