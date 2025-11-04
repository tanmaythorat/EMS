
// import React, { useEffect, useState } from "react";

// interface AttendanceData {
//   _id: string;
//   date: string;
//   clockIn: string;
//   clockOut?: string;
//   breaks?: Array<{ breakIn: string; breakOut?: string; duration?: number }>;
//   totalBreakDuration?: number;
//   status?: string;
// }

// export function ViewAttendance() {
//   const [attendance, setAttendance] = useState<AttendanceData[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");
//   const [filter, setFilter] = useState<string>("all");
//   const [customStartDate, setCustomStartDate] = useState<string>("");
//   const [customEndDate, setCustomEndDate] = useState<string>("");

//   useEffect(() => {
//     fetchAttendance();
//   }, [filter]);

//   const getAuthHeaders = () => {
//     const token = localStorage.getItem("employeeToken");
//     return { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } };
//   };

//   const fetchAttendance = async () => {
//     setLoading(true);
//     setError("");

//     let url = "${process.env.REACT_APP_API_BASE_URL}/api/attendance/all";
//     if (filter === "today") url = "${process.env.REACT_APP_API_BASE_URL}/api/attendance/today";
//     else if (filter === "week") url = "${process.env.REACT_APP_API_BASE_URL}/api/attendance/history/employee/last-week";
//     else if (filter === "month") url = "${process.env.REACT_APP_API_BASE_URL}/api/attendance/history/employee/last-month";
//     else if (filter === "year") url = "${process.env.REACT_APP_API_BASE_URL}/api/attendance/history/employee/last-year";
//     else if (filter === "custom" && customStartDate && customEndDate) {
//       url = "${process.env.REACT_APP_API_BASE_URL}/api/attendance/history/employee/custom-range";
//     }

//     try {
//       console.log(`Calling API at: ${url}`);
//       const response = filter === "custom"
//         ? await fetch(url, {
//             method: "POST",
//             headers: getAuthHeaders().headers,
//             body: JSON.stringify({ startDate: customStartDate, endDate: customEndDate }),
//           })
//         : await fetch(url, getAuthHeaders());

//       if (response.status === 404) {
//         setAttendance([]); // No records found; set empty array
//         return; // Avoid further processing
//       }

//       if (!response.ok) {
//         throw new Error(`Failed to fetch attendance records: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("Fetched Attendance Data:", data);

//       // Handle single object for today's attendance
//       if (filter === "today" && !Array.isArray(data)) {
//         setAttendance([data]); // Wrap in array for uniform rendering
//       } else {
//         setAttendance(data);
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to fetch attendance records");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatTime = (time?: string) =>
//     time ? new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Not Checked Out";
//   const formatDate = (date: string) =>
//     new Date(date).toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" });
//   const calculateTotalBreak = (breaks?: Array<{ duration?: number }>) =>
//     breaks?.reduce((total, brk) => total + (brk.duration || 0), 0) || 0;

//   return (
//     <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6">
//       <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Employee Attendance Records</h2>

//       <div className="flex flex-wrap justify-center gap-3 mb-6">
//         {["all", "today", "week", "month", "year"].map((option) => (
//           <button
//             key={option}
//             onClick={() => setFilter(option)}
//             className={`px-4 py-2 rounded-md transition duration-300 ${
//               filter === option ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
//             }`}
//           >
//             {option.charAt(0).toUpperCase() + option.slice(1)}
//           </button>
//         ))}
//       </div>

//       <div className="mb-6 flex flex-col md:flex-row items-center justify-center gap-4">
//         <label className="text-gray-700 font-medium">Custom Date Range:</label>
//         <div className="flex gap-2">
//           <input
//             type="date"
//             value={customStartDate}
//             onChange={(e) => setCustomStartDate(e.target.value)}
//             className="border rounded-md p-2"
//           />
//           <input
//             type="date"
//             value={customEndDate}
//             onChange={(e) => setCustomEndDate(e.target.value)}
//             className="border rounded-md p-2"
//           />
//           <button
//             onClick={() => setFilter("custom")}
//             className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//           >
//             Apply
//           </button>
//         </div>
//       </div>

//       {loading && <p className="text-center py-4 text-lg font-semibold">Loading attendance records...</p>}
//       {error && <p className="text-red-500 text-center py-4 text-lg">{error}</p>}

//       {!loading && !error && attendance.length === 0 && (
//         <p className="text-gray-500 text-center py-4 text-lg">
//           No attendance records found for the selected time range.
//         </p>
//       )}

//       {!loading && !error && attendance.length > 0 && (
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse shadow-md">
//             <thead>
//               <tr className="bg-blue-600 text-white">
//                 <th className="border p-3 text-left">Date</th>
//                 <th className="border p-3 text-left">Clock-In</th>
//                 <th className="border p-3 text-left">Clock-Out</th>
//                 <th className="border p-3 text-left">Status</th>
//                 <th className="border p-3 text-left">Total Break</th>
//               </tr>
//             </thead>
//             <tbody>
//               {attendance.map((record) => (
//                 <tr key={record._id} className="border-b hover:bg-gray-100">
//                   <td className="border p-3">{formatDate(record.date)}</td>
//                   <td className="border p-3">{formatTime(record.clockIn)}</td>
//                   <td className="border p-3">{formatTime(record.clockOut)}</td>
//                   <td
//                     className={`border p-3 font-semibold ${
//                       record.status === "absent" ? "text-red-600" : "text-green-600"
//                     }`}
//                   >
//                     {record.status || "Present"}
//                   </td>
//                   <td className="border p-3">{calculateTotalBreak(record.breaks)} minutes</td>
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

interface Break {
  breakIn: string;
  breakOut?: string;
  duration?: number;
}

interface AttendanceRecord {
  _id: string;
  email: string;
  empId: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  status: string;
  breaks: Break[];
  totalBreakDuration: number;
  workingHours: string;
}

export function ViewAttendance() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");

  const [employeeEmail, setEmployeeEmail] = useState<string>("");

  useEffect(() => {
    const storedEmployee = JSON.parse(localStorage.getItem("employeeData") || "{}");
    if (storedEmployee?.email) {
      setEmployeeEmail(storedEmployee.email);
    }
  }, []);

  useEffect(() => {
    if (employeeEmail) {
      fetchAttendance();
    }
  }, [filter, employeeEmail]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("employeeToken");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const fetchAttendance = async () => {
    setLoading(true);
    setError("");

    let url = `${process.env.REACT_APP_API_BASE_URL}/api/attendance`;

    switch (filter) {
      case "today":
        url += `/today/${employeeEmail}`;
        break;
      case "week":
        url += `/last-week/${employeeEmail}`;
        break;
      case "month":
        url += `/last-month/${employeeEmail}`;
        break;
      case "year":
        url += `/last-year/${employeeEmail}`;
        break;
      case "custom":
        if (!customStartDate || !customEndDate) {
          setError("Please select both start and end dates.");
          setLoading(false);
          return;
        }
        url += `/custom-range/${employeeEmail}/${customStartDate}/${customEndDate}`;
        break;
      default:
        url += `/all/${employeeEmail}`;
        break;
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch attendance records: ${response.status}`);
      }

      const data = await response.json();

      if (filter === "today") {
        setAttendance(data.attendance ? [data.attendance] : []);
      } else {
        setAttendance(data.attendances || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch attendance records");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time?: string) =>
    time ? new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Not Checked Out";

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Employee Attendance Records</h2>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {["all", "today", "week", "month", "year"].map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={`px-4 py-2 rounded-md transition duration-300 ${
              filter === option ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-col md:flex-row items-center justify-center gap-4">
        <label className="text-gray-700 font-medium">Custom Date Range:</label>
        <div className="flex gap-2">
          <input
            type="date"
            value={customStartDate}
            onChange={(e) => setCustomStartDate(e.target.value)}
            className="border rounded-md p-2"
          />
          <input
            type="date"
            value={customEndDate}
            onChange={(e) => setCustomEndDate(e.target.value)}
            className="border rounded-md p-2"
          />
          <button
            onClick={() => setFilter("custom")}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>

      {loading && <p className="text-center py-4 text-lg font-semibold">Loading attendance records...</p>}
      {error && <p className="text-red-500 text-center py-4 text-lg">{error}</p>}

      {!loading && !error && attendance.length === 0 && (
        <p className="text-center py-4 text-lg text-gray-500">No attendance records found.</p>
      )}

      {!loading && !error && attendance.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Clock In</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Clock Out</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Break Duration</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Working Hours</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendance.map((record) => (
                <tr key={record._id}>
                  <td className="px-4 py-2 text-sm text-gray-800">{formatDate(record.date)}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{record.status}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{formatTime(record.clockIn)}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{formatTime(record.clockOut)}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {record.totalBreakDuration
                      ? `${Math.floor(record.totalBreakDuration / 60)}h ${record.totalBreakDuration % 60}m`
                      : "0h 0m"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">{record.workingHours || "0h 0m"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
