// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { CheckCircle, XCircle, User, List } from 'lucide-react';
// import { useNavigate } from "react-router-dom";

// interface Employee {
//   _id: string;
//   empId: string;
//   name: string;
//   email: string;
// }

// interface Break {
//   breakIn: string;
//   breakOut: string | null;
//   duration: number;
//   _id: string;
// }

// interface AttendanceData {
//   _id: string;
//   empId: string;
//   empName: string;
//   email: string;
//   clockIn: string;
//   clockOut: string;
//   totalBreakDuration: number;
//   status: 'present' | 'absent' | 'late' | 'half-day';
//   date: string;
//   breaks: Break[];
//   workingHours?: number;
// }

// interface CombinedData {
//   empId: string;
//   name: string;
//   email: string;
//   date: string;
//   attendance?: AttendanceData;
// }

// const Attendance = () => {
//   const [loading, setLoading] = useState(false);
//   const [combinedData, setCombinedData] = useState<CombinedData[]>([]);
//   const [error, setError] = useState("");
//   const [stats, setStats] = useState({
//     total: 0,
//     present: 0,
//     absent: 0,
//     averageCheckIn: "N/A",
//     averageWorkingHours: "0h 0m",
//     totalBreakTime: "0h 0m"
//   });

//   const navigate = useNavigate();

//   const fetchData = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       // Fetch all employees
//       const empResponse = await fetch("http://localhost:5000/api/employee", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
      
//       if (!empResponse.ok) throw new Error("Failed to fetch employees");
//       const employees: Employee[] = await empResponse.json();

//       // Fetch today's attendance for all employees
//       const todayResponse = await fetch("http://localhost:5000/api/attendance/today-all", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
      
//       if (!todayResponse.ok) throw new Error("Failed to fetch today's attendance");
//       const todayAttendance: AttendanceData[] = await todayResponse.json();

//       const today = new Date();
//       const todayDateString = today.toISOString().split('T')[0];

//       // Combine employee data with attendance records
//       const combined = employees.map(employee => {
//         const attendance = todayAttendance.find(att => att.email === employee.email);
//         return {
//           empId: employee.empId,
//           name: employee.name,
//           email: employee.email,
//           date: attendance?.date || todayDateString,
//           attendance: attendance ? {
//             ...attendance,
//             workingHours: calculateWorkingHours(
//               attendance.clockIn,
//               attendance.clockOut,
//               attendance.totalBreakDuration
//             )
//           } : undefined
//         };
//       });

//       setCombinedData(combined);
//       updateStats(combined, employees.length);
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         setError(err.message);
//         toast.error(err.message || "Failed to load data");
//       } else {
//         setError("An unknown error occurred");
//         toast.error("An unknown error occurred");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateWorkingHours = (clockIn: string, clockOut: string, totalBreakDuration: number) => {
//     if (!clockIn || !clockOut || clockIn === "-" || clockOut === "-") return 0;
//     const start = new Date(clockIn);
//     const end = new Date(clockOut);
//     return (Math.round((end.getTime() - start.getTime()) / (1000 * 60)) - totalBreakDuration) / 60;
//   };

//   const formatWorkingHours = (hours: number) => {
//     if (!hours || hours <= 0) return "-";
//     return `${Math.floor(hours)}h ${Math.round((hours - Math.floor(hours)) * 60)}m`;
//   };

//   const formatBreakDuration = (minutes: number) => {
//     if (!minutes || minutes <= 0) return "-";
//     return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
//   };

//   const calculateAverageCheckIn = (data: CombinedData[]) => {
//     const presentEntries = data.filter(item => item.attendance?.status === "present");
//     if (presentEntries.length === 0) return "N/A";
    
//     const totalMinutes = presentEntries.reduce((sum, entry) => {
//       if (!entry.attendance?.clockIn) return sum;
//       const time = new Date(entry.attendance.clockIn);
//       return sum + time.getHours() * 60 + time.getMinutes();
//     }, 0);
    
//     const avgMinutes = Math.round(totalMinutes / presentEntries.length);
//     return `${Math.floor(avgMinutes / 60).toString().padStart(2, '0')}:${(avgMinutes % 60).toString().padStart(2, '0')}`;
//   };

//   const calculateAverageWorkingHours = (data: CombinedData[]) => {
//     const presentEntries = data.filter(item => 
//       item.attendance?.status === "present" && 
//       item.attendance.workingHours && 
//       item.attendance.workingHours > 0
//     );
    
//     if (presentEntries.length === 0) return "0h 0m";
//     return formatWorkingHours(presentEntries.reduce((sum, entry) => 
//       sum + (entry.attendance?.workingHours || 0), 0) / presentEntries.length);
//   };

//   const calculateTotalBreakTime = (data: CombinedData[]) => {
//     return formatBreakDuration(data.reduce((sum, entry) => 
//       sum + (entry.attendance?.totalBreakDuration || 0), 0));
//   };

//   const updateStats = (data: CombinedData[], totalEmployees: number) => {
//     const presentCount = data.filter(item => item.attendance?.status === "present").length;
//     setStats({
//       total: totalEmployees,
//       present: presentCount,
//       absent: totalEmployees - presentCount,
//       averageCheckIn: calculateAverageCheckIn(data),
//       averageWorkingHours: calculateAverageWorkingHours(data),
//       totalBreakTime: calculateTotalBreakTime(data)
//     });
//   };

//   const formatDate = (dateString: string) => {
//     return dateString ? new Date(dateString).toLocaleDateString() : "-";
//   };

//   const formatTime = (timeString: string) => {
//     return timeString && timeString !== "-" ? 
//       new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-";
//   };

//   const getFirstBreakIn = (breaks: Break[]) => {
//     return breaks?.length > 0 ? formatTime(breaks[0].breakIn) : "-";
//   };

//   const getLastBreakOut = (breaks: Break[]) => {
//     const completedBreaks = breaks?.filter(b => b.breakOut !== null) || [];
//     return completedBreaks.length > 0 ? formatTime(completedBreaks[completedBreaks.length - 1].breakOut || "") : "-";
//   };

//   const handleViewDetailedAttendance = () => {
//     navigate("detailed-attendance");
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold text-gray-800">Today's Attendance</h1>
//         <div className="flex gap-4">
//           <button
//             onClick={fetchData}
//             disabled={loading}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
//           >
//             {loading ? "Refreshing..." : "Refresh"}
//           </button>
//           <button
//             onClick={handleViewDetailedAttendance}
//             disabled={loading}
//             className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
//           >
//             <List className="h-5 w-5" />
//             <span>View Detailed Attendance</span>
//           </button>
//         </div>
//       </div>

//       {error && (
//         <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//           {error}
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Total Employees</p>
//               <p className="text-2xl font-semibold mt-1">{stats.total}</p>
//             </div>
//             <div className="bg-gray-500 p-3 rounded-full">
//               <User className="h-6 w-6 text-white" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Present Today</p>
//               <p className="text-2xl font-semibold mt-1">{stats.present}</p>
//             </div>
//             <div className="bg-green-500 p-3 rounded-full">
//               <CheckCircle className="h-6 w-6 text-white" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Absent Today</p>
//               <p className="text-2xl font-semibold mt-1">{stats.absent}</p>
//             </div>
//             <div className="bg-red-500 p-3 rounded-full">
//               <XCircle className="h-6 w-6 text-white" />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow-md">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Break In</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Break Out</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Break</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working Hours</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {loading ? (
//                 <tr>
//                   <td colSpan={9} className="text-center py-8">
//                     <div className="flex justify-center">
//                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//                     </div>
//                   </td>
//                 </tr>
//               ) : combinedData.length > 0 ? (
//                 combinedData.map((employee) => {
//                   const isPresent = !!employee.attendance;
//                   const breaks = isPresent ? employee.attendance?.breaks || [] : [];
                  
//                   return (
//                     <tr key={employee.empId} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                             <User className="h-5 w-5 text-blue-600" />
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">
//                               {employee.name}
//                             </div>
//                             <div className="text-sm text-gray-500">
//                               ID: {employee.empId}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {formatDate(employee.date)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
//                           isPresent ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                         }`}>
//                           {isPresent ? "Present" : "Absent"}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {isPresent ? formatTime(employee.attendance?.clockIn || "") : "-"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {isPresent ? formatTime(employee.attendance?.clockOut || "") : "-"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {isPresent ? getFirstBreakIn(breaks) : "-"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {isPresent ? getLastBreakOut(breaks) : "-"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {isPresent ? formatBreakDuration(employee.attendance?.totalBreakDuration || 0) : "-"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {isPresent ? formatWorkingHours(employee.attendance?.workingHours || 0) : "-"}
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan={9} className="text-center py-4 text-gray-600">
//                     No employees found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Attendance;




import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CheckCircle, XCircle, User, List } from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface Employee {
  _id: string;
  empId: string;
  name: string;
  email: string;
}

interface Break {
  breakIn: string;
  breakOut: string | null;
  duration: number;
  _id: string;
}

interface AttendanceData {
  _id: string;
  empId: string;
  email: string;
  clockIn: string;
  clockOut: string | null;
  totalBreakDuration: number;
  status: 'present' | 'absent'; // Only these two statuses now
  date: string;
  breaks: Break[];
  workingHours?: number;
}

interface CombinedData {
  empId: string;
  name: string;
  email: string;
  date: string;
  attendance?: AttendanceData;
}

interface AttendanceApiResponse {
  attendances: AttendanceData[];
  totalEmployees?: number;
  presentCount?: number;
  absentCount?: number;
}

const Attendance = () => {
  const [loading, setLoading] = useState(false);
  const [combinedData, setCombinedData] = useState<CombinedData[]>([]);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    averageCheckIn: "N/A",
    averageWorkingHours: "0h 0m",
    totalBreakTime: "0h 0m"
  });

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch all employees
      const empResponse = await fetch(import.meta.env.VITE_API_BASE_URL +"/api/employee", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (!empResponse.ok) throw new Error("Failed to fetch employees");
      const employees: Employee[] = await empResponse.json();

      // Fetch today's attendance for all employees
      const todayResponse = await fetch(import.meta.env.VITE_API_BASE_URL+ "/api/attendance/today-all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (!todayResponse.ok) throw new Error("Failed to fetch today's attendance");
      const todayData: AttendanceApiResponse = await todayResponse.json();
      const todayAttendance = todayData.attendances || [];

      const today = new Date();
      const todayDateString = today.toISOString().split('T')[0];

      // Combine employee data with attendance records
      const combined = employees.map(employee => {
        const attendance = todayAttendance.find(att => att.email === employee.email);
        
        let workingHours = 0;
        if (attendance) {
          workingHours = calculateWorkingHours(
            attendance.clockIn,
            attendance.clockOut,
            attendance.totalBreakDuration
          );
        }

        return {
          empId: employee.empId,
          name: employee.name,
          email: employee.email,
          date: attendance?.date || todayDateString,
          attendance: attendance ? {
            ...attendance,
            status: 'present', // Force status to be present if record exists
            workingHours
          } : undefined
        };
      });

      setCombinedData(combined);
      
      // Update stats
      const presentCount = todayData.presentCount ?? combined.filter(item => item.attendance).length;
      const totalEmployees = todayData.totalEmployees ?? employees.length;
      const absentCount = todayData.absentCount ?? (totalEmployees - presentCount);
      
      updateStats(combined, totalEmployees, presentCount, absentCount);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateWorkingHours = (clockIn: string, clockOut: string | null, totalBreakDuration: number): number => {
    if (!clockIn || !clockOut) return 0;
    
    try {
      const start = new Date(clockIn);
      const end = new Date(clockOut);
      const totalMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
      return (totalMinutes - totalBreakDuration) / 60;
    } catch (error) {
      console.error("Error calculating working hours:", error);
      return 0;
    }
  };

  const formatWorkingHours = (hours: number) => {
    if (!hours || hours <= 0) return "-";
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const formatBreakDuration = (minutes: number) => {
    if (!minutes || minutes <= 0) return "-";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const calculateAverageCheckIn = (data: CombinedData[]) => {
    const presentEntries = data.filter(item => item.attendance);
    if (presentEntries.length === 0) return "N/A";
    
    const totalMinutes = presentEntries.reduce((sum, entry) => {
      if (!entry.attendance?.clockIn) return sum;
      const time = new Date(entry.attendance.clockIn);
      return sum + time.getHours() * 60 + time.getMinutes();
    }, 0);
    
    const avgMinutes = Math.round(totalMinutes / presentEntries.length);
    return `${Math.floor(avgMinutes / 60).toString().padStart(2, '0')}:${(avgMinutes % 60).toString().padStart(2, '0')}`;
  };

  const calculateAverageWorkingHours = (data: CombinedData[]) => {
    const presentEntries = data.filter(item => 
      item.attendance && 
      item.attendance.workingHours && 
      item.attendance.workingHours > 0
    );
    
    if (presentEntries.length === 0) return "0h 0m";
    const totalHours = presentEntries.reduce((sum, entry) => 
      sum + (entry.attendance?.workingHours || 0), 0);
    return formatWorkingHours(totalHours / presentEntries.length);
  };

  const calculateTotalBreakTime = (data: CombinedData[]) => {
    const totalMinutes = data.reduce((sum, entry) => 
      sum + (entry.attendance?.totalBreakDuration || 0), 0);
    return formatBreakDuration(totalMinutes);
  };

  const updateStats = (
    data: CombinedData[], 
    totalEmployees: number,
    presentCount: number,
    absentCount: number
  ) => {
    setStats({
      total: totalEmployees,
      present: presentCount,
      absent: absentCount,
      averageCheckIn: calculateAverageCheckIn(data),
      averageWorkingHours: calculateAverageWorkingHours(data),
      totalBreakTime: calculateTotalBreakTime(data)
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return dateString ? new Date(dateString).toLocaleDateString() : "-";
    } catch {
      return "-";
    }
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "-";
    try {
      return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return "-";
    }
  };

  const getFirstBreakIn = (breaks: Break[]) => {
    return breaks?.length > 0 ? formatTime(breaks[0].breakIn) : "-";
  };

  const getLastBreakOut = (breaks: Break[]) => {
    const completedBreaks = breaks?.filter(b => b.breakOut !== null) || [];
    return completedBreaks.length > 0 ? formatTime(completedBreaks[completedBreaks.length - 1].breakOut) : "-";
  };

  const handleViewDetailedAttendance = () => {
    navigate("detailed-attendance");
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Today's Attendance</h1>
        <div className="flex gap-4">
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <button
            onClick={handleViewDetailedAttendance}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <List className="h-5 w-5" />
            <span>View Detailed Attendance</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Employees</p>
              <p className="text-2xl font-semibold mt-1">{stats.total}</p>
            </div>
            <div className="bg-gray-500 p-3 rounded-full">
              <User className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Present Today</p>
              <p className="text-2xl font-semibold mt-1">{stats.present}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Absent Today</p>
              <p className="text-2xl font-semibold mt-1">{stats.absent}</p>
            </div>
            <div className="bg-red-500 p-3 rounded-full">
              <XCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Break In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Break Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Break</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working Hours</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : combinedData.length > 0 ? (
                combinedData.map((employee) => {
                  const hasAttendance = !!employee.attendance;
                  const breaks = hasAttendance ? employee.attendance?.breaks || [] : [];
                  
                  return (
                    <tr key={`${employee.empId}-${employee.date}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {employee.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {employee.empId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(employee.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          hasAttendance ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {hasAttendance ? "Present" : "Absent"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {hasAttendance ? formatTime(employee.attendance?.clockIn) : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {hasAttendance ? formatTime(employee.attendance?.clockOut) : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {hasAttendance ? getFirstBreakIn(breaks) : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {hasAttendance ? getLastBreakOut(breaks) : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {hasAttendance ? formatBreakDuration(employee.attendance?.totalBreakDuration || 0) : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {hasAttendance ? formatWorkingHours(employee.attendance?.workingHours || 0) : "-"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-600">
                    No attendance records found for today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;