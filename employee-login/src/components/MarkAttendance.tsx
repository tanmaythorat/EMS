
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// interface BreakData {
//   breakIn: string;
//   breakOut?: string;
//   duration?: number;
// }

// interface AttendanceData {
//   clockIn?: string;
//   clockOut?: string;
//   breaks: BreakData[];
// }

// export function MarkAttendance() {
//   const [employee, setEmployee] = useState<{ email: string } | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null);
//   const [hasClockedIn, setHasClockedIn] = useState<boolean>(false);

//   useEffect(() => {
//     const storedEmployee = JSON.parse(localStorage.getItem("employeeData") || "null");
//     if (storedEmployee?.email) {
//       setEmployee(storedEmployee);
//     }
//   }, []);

//   const getAuthHeaders = () => {
//     const token = localStorage.getItem("employeeToken");
//     return { headers: { Authorization: `Bearer ${token}` } };
//   };

//   const fetchTodayAttendance = async (email: string) => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/attendance/today`, {
//         params: { email },
//         ...getAuthHeaders(),
//       });
//       if (response.status === 200) {
//         setAttendanceData(response.data.attendance || response.data);
//       }
//     } catch (error: any) {
//       console.log("Skipping attendance fetch until clock-in.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markAttendance = async (endpoint: string, successMessage: string) => {
//     if (!employee) {
//       toast.error("No employee data found.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_BASE_URL}/api/attendance/${endpoint}`,
//         { email: employee.email },
//         getAuthHeaders()
//       );

//       if (response.status === 200 || response.status === 201) {
//         toast.success(successMessage);

//         // For "Clock In," update state and fetch attendance
//         if (endpoint === "clock-in") {
//           setHasClockedIn(true);
//           fetchTodayAttendance(employee.email); // Fetch today's attendance after clocking in
//         } else {
//           setAttendanceData(response.data.attendance || response.data);
//         }
//       }
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Error marking attendance.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     console.log("Updated Attendance Data:", attendanceData);
//   }, [attendanceData]);

//   const isClockedIn = !!attendanceData?.clockIn && !attendanceData?.clockOut;
//   const hasActiveBreak = (attendanceData?.breaks ?? []).some((b) => !b.breakOut);

//   return (
//     <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
//       <h2 className="text-2xl font-semibold text-gray-800">Mark Attendance</h2>
//       {employee && <p className="text-gray-600 mt-2">Employee Email: {employee.email}</p>}

//       {!hasClockedIn && (
//         <p className="text-gray-500 mt-4">Please clock in to view today's attendance.</p>
//       )}

//       {hasClockedIn && attendanceData && (
//         <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow">
//           <p><strong>Today's Attendance:</strong></p>
//           <p>Clock In: {attendanceData.clockIn || "Not clocked in yet"}</p>
//           <p>Clock Out: {attendanceData.clockOut || "Not clocked out yet"}</p>
//           <p>Breaks:</p>
//           <ul>
//             {(attendanceData.breaks || []).map((breakData, index) => (
//               <li key={index}>
//                 Break In: {breakData.breakIn}, Break Out: {breakData.breakOut || "Ongoing"}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mt-4">
//         <button
//           onClick={() => markAttendance("clock-in", "Clocked in successfully!")}
//           disabled={loading || isClockedIn}
//           className={`px-8 py-4 rounded-lg font-medium ${
//             isClockedIn ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
//           }`}
//         >
//           {loading ? "Processing..." : "Clock In"}
//         </button>

//         <button
//           onClick={() => markAttendance("break-in", "Break started successfully!")}
//           disabled={loading || !isClockedIn || hasActiveBreak}
//           className={`px-8 py-4 rounded-lg font-medium ${
//             !isClockedIn || hasActiveBreak ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600 text-white"
//           }`}
//         >
//           {loading ? "Processing..." : "Break In"}
//         </button>

//         <button
//           onClick={() => markAttendance("break-out", "Break ended successfully!")}
//           disabled={loading || !hasActiveBreak}
//           className={`px-8 py-4 rounded-lg font-medium ${
//             !hasActiveBreak ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
//           }`}
//         >
//           {loading ? "Processing..." : "Break Out"}
//         </button>

//         <button
//           onClick={() => markAttendance("clock-out", "Clocked out successfully!")}
//           disabled={loading || !isClockedIn}
//           className={`px-8 py-4 rounded-lg font-medium ${
//             !isClockedIn ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 text-white"
//           }`}
//         >
//           {loading ? "Processing..." : "Clock Out"}
//         </button>
//       </div>
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface BreakData {
  breakIn: string;
  breakOut?: string;
  duration?: number;
}

interface AttendanceData {
  clockIn?: string;
  clockOut?: string;
  breaks: BreakData[];
}

export function MarkAttendance() {
  const [employee, setEmployee] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null);
  const [hasClockedIn, setHasClockedIn] = useState<boolean>(false);

  useEffect(() => {
    const storedEmployee = JSON.parse(localStorage.getItem("employeeData") || "null");
    if (storedEmployee?.email) {
      setEmployee(storedEmployee);
    }
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("employeeToken");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  const fetchTodayAttendance = async (email: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/attendance/today/${email}`, getAuthHeaders());
      if (response.status === 200) {
        setAttendanceData(response.data.attendance || response.data);
      }
    } catch (error: any) {
      console.log("Skipping attendance fetch until clock-in.");
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (endpoint: string, successMessage: string) => {
    if (!employee?.email) {
      toast.error("No employee data found.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/attendance/${endpoint}`,
        { email: employee.email }, // ✅ Send email
        getAuthHeaders()
      );

      if (response.status === 200 || response.status === 201) {
        toast.success(successMessage);

        if (endpoint === "clock-in") {
          setHasClockedIn(true);
          fetchTodayAttendance(employee.email);
        } else {
          setAttendanceData(response.data.attendance || response.data);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error marking attendance.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employee?.email) {
      fetchTodayAttendance(employee.email);
    }
  }, [employee]);

  const isClockedIn = !!attendanceData?.clockIn && !attendanceData?.clockOut;
  const hasActiveBreak = (attendanceData?.breaks ?? []).some((b) => !b.breakOut);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800">Mark Attendance</h2>
      {employee && <p className="text-gray-600 mt-2">Employee Email: {employee.email}</p>}

      {!attendanceData?.clockIn && (
        <p className="text-gray-500 mt-4">Please clock in to view today's attendance.</p>
      )}

      {attendanceData && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow">
          <p><strong>Today's Attendance:</strong></p>
          <p>Clock In: {attendanceData.clockIn || "Not clocked in yet"}</p>
          <p>Clock Out: {attendanceData.clockOut || "Not clocked out yet"}</p>
          <p>Breaks:</p>
          <ul>
            {(attendanceData.breaks || []).map((breakData, index) => (
              <li key={index}>
                Break In: {breakData.breakIn}, Break Out: {breakData.breakOut || "Ongoing"}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mt-4">
        <button
          onClick={() => markAttendance("clock-in", "Clocked in successfully!")}
          disabled={loading || isClockedIn}
          className={`px-8 py-4 rounded-lg font-medium ${
            isClockedIn ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {loading ? "Processing..." : "Clock In"}
        </button>

        <button
          onClick={() => markAttendance("break-in", "Break started successfully!")}
          disabled={loading || !isClockedIn || hasActiveBreak}
          className={`px-8 py-4 rounded-lg font-medium ${
            !isClockedIn || hasActiveBreak ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600 text-white"
          }`}
        >
          {loading ? "Processing..." : "Break In"}
        </button>

        <button
          onClick={() => markAttendance("break-out", "Break ended successfully!")}
          disabled={loading || !hasActiveBreak}
          className={`px-8 py-4 rounded-lg font-medium ${
            !hasActiveBreak ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {loading ? "Processing..." : "Break Out"}
        </button>

        <button
          onClick={() => markAttendance("clock-out", "Clocked out successfully!")}
          disabled={loading || !isClockedIn}
          className={`px-8 py-4 rounded-lg font-medium ${
            !isClockedIn ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          {loading ? "Processing..." : "Clock Out"}
        </button>
      </div>
    </div>
  );
}
