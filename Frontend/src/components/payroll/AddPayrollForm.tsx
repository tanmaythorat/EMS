import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface FormData {
  empId: string;
  baseSalary: string;
  deductions: {
    tax: string;
    unpaidLeavePenalty: string;
    otherDeductions: string;
  };
  bonuses: {
    performanceBonus: string;
    overtimePay: string;
  };
  paymentDate: string;
}

interface Employee {
  _id: string;
  empId: string;
  name: string;
  companyName: string;
}

const AddPayrollForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    empId: "",
    baseSalary: "",
    deductions: {
      tax: "",
      unpaidLeavePenalty: "",
      otherDeductions: ""
    },
    bonuses: {
      performanceBonus: "",
      overtimePay: ""
    },
    paymentDate: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isEmployeeLoading, setIsEmployeeLoading] = useState(false);

  // Fetch employees when component mounts
  React.useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsEmployeeLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(import.meta.env.VITE_API_BASE_URL+ "/api/employees", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error("Failed to load employee data");
      } finally {
        setIsEmployeeLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.') as [
        keyof Pick<FormData, 'deductions' | 'bonuses'>,
        keyof FormData['deductions'] | keyof FormData['bonuses']
      ];
      
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      const key = name as keyof Omit<FormData, 'deductions' | 'bonuses'>;
      setFormData(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  const calculateNetSalary = () => {
    const base = Number(formData.baseSalary) || 0;
    const tax = Number(formData.deductions.tax) || 0;
    const leavePenalty = Number(formData.deductions.unpaidLeavePenalty) || 0;
    const otherDeductions = Number(formData.deductions.otherDeductions) || 0;
    const performanceBonus = Number(formData.bonuses.performanceBonus) || 0;
    const overtimePay = Number(formData.bonuses.overtimePay) || 0;

    const totalDeductions = tax + leavePenalty + otherDeductions;
    const totalBonuses = performanceBonus + overtimePay;
    
    return base - totalDeductions + totalBonuses;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    if (!formData.empId || !formData.baseSalary || !formData.paymentDate) {
      setError("Employee ID, Base Salary, and Payment Date are required!");
      return;
    }
  
    try {
      setIsLoading(true);
      const netSalary = calculateNetSalary();
      
      const payrollData = {
        empId: formData.empId,
        baseSalary: Number(formData.baseSalary),
        deductions: {
          tax: Number(formData.deductions.tax) || 0,
          unpaidLeavePenalty: Number(formData.deductions.unpaidLeavePenalty) || 0,
          otherDeductions: Number(formData.deductions.otherDeductions) || 0
        },
        bonuses: {
          performanceBonus: Number(formData.bonuses.performanceBonus) || 0,
          overtimePay: Number(formData.bonuses.overtimePay) || 0
        },
        netSalary,
        paymentDate: formData.paymentDate,
        status: "Pending", // Default status
        payrollHistory: [{ 
          date: new Date().toISOString(),
          netSalary,
          status: "Pending"
        }]
      };

      const token = localStorage.getItem('token');
      const response = await axios.post(
        import.meta.env.VITE_API_BASE_URL+ "/api/payroll", 
        payrollData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        toast.success("Payroll created successfully!");
        navigate("/dashboard/payroll");
      }
    } catch (error: any) {
      console.error("Payroll creation error:", error);
      
      if (error.response) {
        // Handle specific error cases
        if (error.response.status === 404) {
          setError("Employee not found. Please verify the Employee ID.");
        } else if (error.response.status === 400) {
          setError(error.response.data.message || "Invalid payroll data");
        } else if (error.response.status === 403) {
          setError("You don't have permission to create payroll for this employee");
        } else {
          setError("Failed to create payroll. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Add New Payroll</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Employee ID Input */}
<div className="col-span-1">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Employee ID:
  </label>
  {isEmployeeLoading ? (
    <div className="p-2 bg-gray-100 rounded">Loading employees...</div>
  ) : (
    <input
      type="text"
      name="empId"
      value={formData.empId}
      onChange={handleChange}
      className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500"
      required
      placeholder="Enter Employee ID"
    />
  )}
</div>

          {/* Base Salary */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Salary:
            </label>
            <input
              type="number"
              name="baseSalary"
              value={formData.baseSalary}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500"
              required
              min="0"
              step="0.01"
            />
          </div>

          {/* Payment Date */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Date:
            </label>
            <input
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Deductions Section */}
          <div className="col-span-2 border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Deductions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax:
                </label>
                <input
                  type="number"
                  name="deductions.tax"
                  value={formData.deductions.tax}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unpaid Leave Penalty:
                </label>
                <input
                  type="number"
                  name="deductions.unpaidLeavePenalty"
                  value={formData.deductions.unpaidLeavePenalty}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Other Deductions:
                </label>
                <input
                  type="number"
                  name="deductions.otherDeductions"
                  value={formData.deductions.otherDeductions}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Bonuses Section */}
          <div className="col-span-2 border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Bonuses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Performance Bonus:
                </label>
                <input
                  type="number"
                  name="bonuses.performanceBonus"
                  value={formData.bonuses.performanceBonus}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Overtime Pay:
                </label>
                <input
                  type="number"
                  name="bonuses.overtimePay"
                  value={formData.bonuses.overtimePay}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Net Salary Display */}
          <div className="col-span-2 p-4 bg-gray-50 rounded">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Calculated Net Salary:
            </h3>
            <p className="text-xl font-semibold">
              ${calculateNetSalary().toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard/payroll")}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              "Create Payroll"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPayrollForm;