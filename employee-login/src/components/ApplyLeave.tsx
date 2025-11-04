
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// interface Leave {
//   _id?: string;
//   empId: string;
//   leaveType: string;
//   startDate: string;
//   endDate: string;
//   totalDays: number;
//   reason?: string;
//   status: string | null;
//   approvedBy?: string | null;
// }

// export function ApplyLeave() {
//   const [leaveData, setLeaveData] = useState<Leave[]>([]);
//   const [leaveType, setLeaveType] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [reason, setReason] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const employeeData = JSON.parse(localStorage.getItem("employeeData") || "null");
//   const empId = employeeData?.empId;
//   const token = localStorage.getItem("employeeToken");
//   const [remainingLeaves, setRemainingLeaves] = useState<Record<string, number | string>>({});

  


//   const fetchLeaveData = async () => {
//     if (!token) {
//       setError("Authentication error. Please log in.");
//       return;
//     }
  
//     setLoading(true);
//     try {
//       const response = await fetch("${process.env.REACT_APP_API_BASE_URL}/api/leave/my-leaves", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
  
//       if (!response.ok) throw new Error("Failed to fetch leave data");
  
//       const data = await response.json();
//       setLeaveData(data.appliedLeaves || []);
//       setRemainingLeaves(data.remainingLeaves || {});
//     } catch (error) {
//       setError("Error fetching leave data.");
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   useEffect(() => {
//     fetchLeaveData();
//   }, []);

    



//   const handleApplyLeave = async () => {
//     if (!leaveType || !startDate || !endDate || !reason) {
//       toast.error("All fields are required.");
//       return;
//     }
  
//     if (!token) {
//       toast.error("Authentication error. Please log in again.");
//       return;
//     }
  
//     const start = new Date(startDate);
//     const end = new Date(endDate);
  
//     if (start > end) {
//       toast.error("End date cannot be before the start date.");
//       return;
//     }
  
//     const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         "${process.env.REACT_APP_API_BASE_URL}/api/leave/apply",
//         {
//           leaveType,
//           startDate,
//           endDate,
//           totalDays,
//           reason,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
  
//       if (response.status === 200) {
//         toast.success("Leave applied successfully!");
//         setLeaveType(""); // Clear form fields
//         setStartDate("");
//         setEndDate("");
//         setReason("");
//         fetchLeaveData(); // Refresh leave data
//       } else {
//         toast.error(response.data.message || "Failed to apply for leave.");
//       }
//     } catch (error: any) {
//       console.error("Error applying leave:", error.response || error.message);
//       toast.error(error.response?.data?.message || "Error applying leave. Check console for details.");
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   return (
    
//     <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
//       {/* Leave Form */}
//       {/* Remaining Leaves Section */}
// <div className="p-6">
//   <h2 className="text-xl font-semibold text-gray-800">Remaining Leaves</h2>
//   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
//     {Object.entries(remainingLeaves).map(([leaveType, count]) => (
//       <div key={leaveType} className="bg-gray-100 p-4 rounded-lg shadow-md text-center">
//         <h3 className="text-lg font-semibold text-gray-700">{leaveType}</h3>
//         <p className="text-xl font-bold text-indigo-600">{count}</p>
//       </div>
//     ))}
//   </div>
// </div>

//       <div className="p-6 border-b border-gray-200">
//         <h2 className="text-2xl font-semibold text-gray-800">Apply for Leave</h2>
//       </div>
      
//       <div className="p-6">
//         <form className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Leave Type</label>
//               <select
//                 value={leaveType}
//                 onChange={(e) => setLeaveType(e.target.value)}
//                 className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//               >
//                 <option value="">Select Leave Type</option>
//                 <option value="Sick Leave">Sick Leave</option>
//                 <option value="Paid Leave">Paid Leave</option>
//                 <option value="Casual Leave">Casual Leave</option>

//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Start Date</label>
//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">End Date</label>
//               <input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//               />
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Reason</label>
//             <textarea
//               rows={4}
//               value={reason}
//               onChange={(e) => setReason(e.target.value)}
//               className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//               placeholder="Please provide a reason for your leave request..."
//             ></textarea>
//           </div>
//           <div>
//             <button
//               type="button"
//               onClick={handleApplyLeave}
//               className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
//               disabled={loading}
//             >
//               {loading ? "Applying..." : "Submit Leave Request"}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Leave Table */}
//       <LeaveTable leaveData={leaveData} loading={loading} error={error} />
//     </div>
//   );
// }

// interface LeaveTableProps {
//   leaveData: Leave[];
//   loading: boolean;
//   error: string | null;
// }

// const LeaveTable: React.FC<LeaveTableProps> = ({ leaveData, loading, error }) => {
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toISOString().split("T")[0];
//   };

//   return (
//     <div className="p-6 border-t border-gray-200">
//       <h2 className="text-xl font-semibold text-gray-800">Leave History</h2>
//       <div className="overflow-x-auto mt-4">
//         {loading && <p className="text-gray-600">Loading leave data...</p>}
//         {error && <p className="text-red-500">{error}</p>}
//         {!loading && !error && leaveData.length > 0 && (
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead>
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Days</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {leaveData.map((leave) => (
//                 <tr key={leave._id}>
//                   <td className="px-6 py-4 text-gray-800">{leave.leaveType}</td>
//                   <td className="px-6 py-4">{formatDate(leave.startDate)}</td>
//                   <td className="px-6 py-4">{formatDate(leave.endDate)}</td>
//                   <td className="px-6 py-4 text-gray-800">{leave.totalDays}</td>
//                   <td className="px-6 py-4 text-gray-800">{leave.reason}</td>
//                   <td className="px-6 py-4 text-orange-600">{leave.status || "Pending"}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };



import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface Leave {
  _id?: string;
  empId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason?: string;
  status: string | null;
  approvedBy?: string | null; 
  appliedAt?:string;
  approvedAt?:string;
  rejectedAt?:string;
}

export function ApplyLeave() {
  const [leaveData, setLeaveData] = useState<Leave[]>([]);
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const employeeData = JSON.parse(localStorage.getItem("employeeData") || "null");
  const empId = employeeData?.empId;
  const token = localStorage.getItem("employeeToken");
  const [remainingLeaves, setRemainingLeaves] = useState<Record<string, number | string>>({});

  


  const fetchLeaveData = async () => {
    if (!token) {
      setError("Authentication error. Please log in.");
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch("${process.env.REACT_APP_API_BASE_URL}/api/leave/my-leaves", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) throw new Error("Failed to fetch leave data");
  
      const data = await response.json();
      setLeaveData(data.appliedLeaves || []);
      setRemainingLeaves(data.remainingLeaves || {});
    } catch (error) {
      setError("Error fetching leave data.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLeaveData();
  }, []);

    



  const handleApplyLeave = async () => {
    if (!leaveType || !startDate || !endDate || !reason) {
      toast.error("All fields are required.");
      return;
    }
  
    if (!token) {
      toast.error("Authentication error. Please log in again.");
      return;
    }
  
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    if (start > end) {
      toast.error("End date cannot be before the start date.");
      return;
    }
  
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
    setLoading(true);
    try {
      const response = await axios.post(
        "${process.env.REACT_APP_API_BASE_URL}/api/leave/apply",
        {
          leaveType,
          startDate,
          endDate,
          totalDays,
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200) {
        toast.success("Leave applied successfully!");
        setLeaveType(""); // Clear form fields
        setStartDate("");
        setEndDate("");
        setReason("");
        fetchLeaveData(); // Refresh leave data
      } else {
        toast.error(response.data.message || "Failed to apply for leave.");
      }
    } catch (error: any) {
      console.error("Error applying leave:", error.response || error.message);
      toast.error(error.response?.data?.message || "Error applying leave. Check console for details.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      {/* Leave Form */}
      {/* Remaining Leaves Section */}
<div className="p-6">
  <h2 className="text-xl font-semibold text-gray-800">Remaining Leaves</h2>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
    {Object.entries(remainingLeaves).map(([leaveType, count]) => (
      <div key={leaveType} className="bg-gray-100 p-4 rounded-lg shadow-md text-center">
        <h3 className="text-lg font-semibold text-gray-700">{leaveType}</h3>
        <p className="text-xl font-bold text-indigo-600">{count}</p>
      </div>
    ))}
  </div>
</div>

      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800">Apply for Leave</h2>
      </div>
      
      <div className="p-6">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Leave Type</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Leave Type</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Paid Leave">Paid Leave</option>
                <option value="Casual Leave">Casual Leave</option>

              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Please provide a reason for your leave request..."
            ></textarea>
          </div>
          <div>
            <button
              type="button"
              onClick={handleApplyLeave}
              className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              disabled={loading}
            >
              {loading ? "Applying..." : "Submit Leave Request"}
            </button>
          </div>
        </form>
      </div>

      {/* Leave Table */}
      <LeaveTable leaveData={leaveData} loading={loading} error={error} />
    </div>
  );
}

interface LeaveTableProps {
  leaveData: Leave[];
  loading: boolean;
  error: string | null;
}

const LeaveTable: React.FC<LeaveTableProps> = ({ leaveData, loading, error }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6 border-t border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800">Leave History</h2>
      <div className="overflow-x-auto mt-4">
        {loading && <p className="text-gray-600">Loading leave data...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && leaveData.length > 0 && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-9 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-12 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                <th className="px-12 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                <th className="px-9 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Days</th>
                <th className="px-12 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-12 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied At</th>
                <th className="px-12 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved At</th>
                <th className="px-12 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rejected At</th>
              </tr>
            </thead>
            <tbody>
              {leaveData.map((leave) => (
                <tr key={leave._id}>
                  <td className="px-9 py-4 text-gray-800">{leave.leaveType}</td>
                  <td className="px-12 py-4">{formatDate(leave.startDate)}</td>
                  <td className="px-12 py-4">{formatDate(leave.endDate)}</td>
                  <td className="px-9 py-4 text-gray-800">{leave.totalDays}</td>
                  <td className="px-12 py-4 text-gray-800">{leave.reason || "-"}</td>
                  <td className={`px-6 py-4 ${leave.status === "Pending" ? "text-orange-600" : leave.status === "Approved" ? "text-green-600" : "text-red-600"}`}>
                    {leave.status || "Pending"}
                  </td>
                  <td className="px-12 py-4">{leave.appliedAt ? formatDate(leave.appliedAt) : "-"}</td>
                  <td className="px-12 py-4">{leave.approvedAt ? formatDate(leave.approvedAt) : "-"}</td>
                  <td className="px-12 py-4">{leave.rejectedAt ? formatDate(leave.rejectedAt) : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};