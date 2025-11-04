

// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";

// interface PayrollRecord {
//   payDate: string;
//   salary: number;
//   bonuses: number;
//   deductions: number;
//   netSalary: number;
// }

// export function ViewPayroll() {
//   const [payrollData, setPayrollData] = useState<PayrollRecord[]>([]);
//   const [loading, setLoading] = useState(true);

//   const employeeData = JSON.parse(localStorage.getItem("employeeData") || "{}");
//   const employeeId = employeeData?.employeeId;

//   useEffect(() => {
//     if (!employeeId) {
//       toast.error("Employee ID not found!");
//       setLoading(false);
//       return;
//     }

//     const fetchPayroll = async () => {
//       try {
//         const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/payroll/${employeeId}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("employeeToken")}`,
//           },
//         });

//         const data = await response.json();
//         if (response.ok) {
//           setPayrollData(Array.isArray(data) ? data : [data]); // Ensure data is an array
//         } else {
//           toast.error(data.message || "Failed to fetch payroll details");
//         }
//       } catch (error) {
//         toast.error("Network error! Please try again.");
//       }
//       setLoading(false);
//     };

//     fetchPayroll();
//   }, [employeeId]);

//   return (
//     <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
//       <div className="p-6 bg-indigo-600 text-white">
//         <h2 className="text-2xl font-semibold">Payroll History</h2>
//       </div>

//       {loading ? (
//         <div className="p-6 text-center text-gray-600">Loading payroll details...</div>
//       ) : payrollData.length === 0 ? (
//         <div className="p-6 text-center text-gray-600">No payroll records found.</div>
//       ) : (
//         <div className="p-6 overflow-x-auto">
//           <table className="min-w-full border-collapse border border-gray-300 rounded-lg shadow-md">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase border border-gray-300">
//                   Month
//                 </th>
//                 <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase border border-gray-300">
//                   Basic Salary
//                 </th>
//                 <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase border border-gray-300">
//                   Allowances
//                 </th>
//                 <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase border border-gray-300">
//                   Deductions
//                 </th>
//                 <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase border border-gray-300">
//                   Net Salary
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {payrollData.map((record, index) => (
//                 <tr key={index} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 text-center text-sm font-medium text-gray-800">
//                     {new Date(record.payDate).toLocaleString("en-US", { month: "long", year: "numeric" })}
//                   </td>
//                   <td className="px-6 py-4 text-center text-sm text-gray-600">${record.salary}</td>
//                   <td className="px-6 py-4 text-center text-sm text-gray-600">${record.bonuses}</td>
//                   <td className="px-6 py-4 text-center text-sm text-gray-600">${record.deductions}</td>
//                   <td className="px-6 py-4 text-center text-sm font-medium text-indigo-600">${record.netSalary}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface PayrollRecord {
  payDate: string;
  baseSalary: number;
  bonuses: {
    performanceBonus: number;
    overtimePay: number;
  };
  deductions: {
    tax: number;
    unpaidLeavePenalty: number;
    otherDeductions: number;
  };
  netSalary: number;
}

export function ViewPayroll() {
  const [payrollData, setPayrollData] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Retrieve employeeId from localStorage
  const employeeData = JSON.parse(localStorage.getItem("employeeData") || "{}");
const empId = employeeData?.empId; // Access `empId` instead of `employeeId`
console.log("Retrieved Employee ID:", empId);
useEffect(() => {
  if (!empId) {
    console.error("Employee ID not found in localStorage!");
    toast.error("Employee ID not found!");
    setLoading(false);
    return;
  }

  const fetchPayroll = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/payroll/${empId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("employeeToken")}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setPayrollData([data]); // Ensure data consistency
      } else {
        toast.error(data.message || "Failed to fetch payroll details");
      }
    } catch (error) {
      toast.error("Network error! Please try again.");
    }
    setLoading(false);
  };

  fetchPayroll();
}, [empId]);
  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 bg-indigo-600 text-white">
        <h2 className="text-2xl font-semibold">Payroll History</h2>
      </div>

      {loading ? (
        <div className="p-6 text-center text-gray-600">Loading payroll details...</div>
      ) : payrollData.length === 0 ? (
        <div className="p-6 text-center text-gray-600">No payroll records found.</div>
      ) : (
        <div className="p-6 overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase border border-gray-300">
                  Payment Date
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase border border-gray-300">
                  Base Salary
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase border border-gray-300">
                  Bonuses
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase border border-gray-300">
                  Deductions
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase border border-gray-300">
                  Net Salary
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payrollData.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-center text-sm font-medium text-gray-800">
                    {new Date(record.payDate).toLocaleDateString("en-US")}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{record.baseSalary}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">
                    Performance Bonus: {record.bonuses.performanceBonus}, Overtime Pay: {record.bonuses.overtimePay}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">
                    Tax: {record.deductions.tax}, Leave Penalty: {record.deductions.unpaidLeavePenalty}, Other: 
                    {record.deductions.otherDeductions}
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-indigo-600">{record.netSalary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}