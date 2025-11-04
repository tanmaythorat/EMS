// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { ChevronLeft, User, CheckCircle, XCircle, Filter, CalendarDays, CalendarCheck, CalendarClock, CalendarRange } from 'lucide-react';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// interface AttendanceRecord {
//   _id: string;
//   empId: string;
//   empName: string;
//   date: string;
//   clockIn: string;
//   clockOut: string | null;
//   status: 'present' | 'absent';
//   totalBreakDuration: number;
//   workingHours: number;
// }

// const validateAttendanceRecord = (record: any): AttendanceRecord => {
//   return {
//     ...record,
//     workingHours: typeof record.workingHours === 'number' 
//       ? record.workingHours
//       : parseFloat(record.workingHours) || 0,
//     totalBreakDuration: typeof record.totalBreakDuration === 'number'
//       ? record.totalBreakDuration
//       : parseInt(record.totalBreakDuration) || 0,
//     clockOut: record.clockOut || null
//   };
// };

// const EmployeeAttendance = () => {
//   const { email } = useParams<{ email: string }>();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [employeeName, setEmployeeName] = useState("");
//   const [employeeId, setEmployeeId] = useState("");
//   const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
//   const [filter, setFilter] = useState<string>("all");
//   const [customRange, setCustomRange] = useState<{
//     start: Date | null;
//     end: Date | null;
//   }>({ start: null, end: null });

//   const fetchAttendanceData = async (endpoint = "all") => {
//     try {
//       let url = `http://localhost:5000/api/attendance/${endpoint}/${email}`;
      
//       if (endpoint === "custom" && customRange.start && customRange.end) {
//         const params = new URLSearchParams({
//           startDate: customRange.start.toISOString(),
//           endDate: customRange.end.toISOString()
//         });
//         url = `http://localhost:5000/api/attendance/custom/${email}?${params}`;
//       }
      
//       const response = await fetch(url, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
      
//       if (!response.ok) throw new Error(`Failed to fetch ${endpoint} attendance`);
      
//       const data = await response.json();
//       const attendanceData = (Array.isArray(data) ? data : data.attendances || [])
//         .map(validateAttendanceRecord);
      
//       if (attendanceData.length > 0 && endpoint === "all") {
//         setEmployeeName(attendanceData[0].empName || "Unknown");
//         setEmployeeId(attendanceData[0].empId || "N/A");
//       }
      
//       return attendanceData;
//     } catch (err) {
//       console.error(`Error fetching ${endpoint} attendance:`, err);
//       throw err;
//     }
//   };

//   const loadInitialData = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const data = await fetchAttendanceData("all");
//       setAttendance(data);
//     } catch (err: unknown) {
//       const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = async (newFilter: string) => {
//     setFilter(newFilter);
//     setLoading(true);
    
//     try {
//       const data = await fetchAttendanceData(newFilter === "custom" ? "custom" : newFilter);
//       setAttendance(data);
//     } catch (err: unknown) {
//       const errorMessage = err instanceof Error ? err.message : "Failed to fetch filtered data";
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCustomRangeApply = () => {
//     if (customRange.start && customRange.end) {
//       handleFilterChange("custom");
//     } else {
//       toast.warning("Please select both start and end dates");
//     }
//   };

//   const formatDate = (dateString: string) => {
//     try {
//       return new Date(dateString).toLocaleDateString();
//     } catch {
//       return "-";
//     }
//   };

//   const formatTime = (timeString: string | null) => {
//     if (!timeString) return "-";
//     try {
//       return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch {
//       return "-";
//     }
//   };

//   const formatDuration = (minutes: number) => {
//     if (!minutes) return "-";
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return `${hours}h ${mins}m`;
//   };

//   useEffect(() => {
//     loadInitialData();
//   }, [email]);

//   const statusStats = {
//     present: attendance.filter(a => a.status === "present").length,
//     absent: attendance.filter(a => a.status === "absent").length
//   };

//   return (
//     <div className="p-6">
//       <div className="flex items-center mb-6">
//         <button 
//           onClick={() => navigate(-1)}
//           className="mr-4 p-2 rounded-full hover:bg-gray-100"
//         >
//           <ChevronLeft className="h-5 w-5 text-gray-600" />
//         </button>
//         <div>
//           <h1 className="text-2xl font-semibold text-gray-800">Employee Attendance</h1>
//           <div className="flex items-center mt-1 text-sm text-gray-600">
//             <User className="h-4 w-4 mr-1" />
//             {employeeName} (ID: {employeeId})
//           </div>
//         </div>
//       </div>

//       {error && (
//         <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//           {error}
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Total Records</p>
//               <p className="text-2xl font-semibold mt-1">{attendance.length}</p>
//             </div>
//             <div className="bg-blue-100 p-3 rounded-full">
//               <CalendarDays className="h-6 w-6 text-blue-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Present Days</p>
//               <p className="text-2xl font-semibold mt-1">{statusStats.present}</p>
//             </div>
//             <div className="bg-green-100 p-3 rounded-full">
//               <CheckCircle className="h-6 w-6 text-green-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Absent Days</p>
//               <p className="text-2xl font-semibold mt-1">{statusStats.absent}</p>
//             </div>
//             <div className="bg-red-100 p-3 rounded-full">
//               <XCircle className="h-6 w-6 text-red-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div className="flex items-center">
//             <Filter className="h-5 w-5 text-gray-500 mr-2" />
//             <h3 className="font-medium">Filter Attendance</h3>
//           </div>
          
//           <div className="flex flex-wrap gap-2">
//             <button
//               onClick={() => handleFilterChange("all")}
//               className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
//             >
//               <CalendarDays className="h-4 w-4" />
//               <span>All Records</span>
//             </button>
            
//             <button
//               onClick={() => handleFilterChange("last-week")}
//               className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === "last-week" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
//             >
//               <CalendarCheck className="h-4 w-4" />
//               <span>Last Week</span>
//             </button>
            
//             <button
//               onClick={() => handleFilterChange("last-month")}
//               className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === "last-month" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
//             >
//               <CalendarClock className="h-4 w-4" />
//               <span>Last Month</span>
//             </button>
            
//             <button
//               onClick={() => handleFilterChange("last-year")}
//               className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === "last-year" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
//             >
//               <CalendarRange className="h-4 w-4" />
//               <span>Last Year</span>
//             </button>
//           </div>
//         </div>
        
//         {filter === "custom" && (
//           <div className="mt-4 flex flex-col md:flex-row md:items-center gap-4">
//             <div className="flex items-center gap-2">
//               <label className="text-sm text-gray-600">From:</label>
//               <DatePicker
//                 selected={customRange.start}
//                 onChange={(date) => setCustomRange({...customRange, start: date})}
//                 selectsStart
//                 startDate={customRange.start}
//                 endDate={customRange.end}
//                 className="border rounded-lg px-3 py-2 text-sm"
//                 placeholderText="Start date"
//               />
//             </div>
            
//             <div className="flex items-center gap-2">
//               <label className="text-sm text-gray-600">To:</label>
//               <DatePicker
//                 selected={customRange.end}
//                 onChange={(date) => setCustomRange({...customRange, end: date})}
//                 selectsEnd
//                 startDate={customRange.start}
//                 endDate={customRange.end}
//                 minDate={customRange.start}
//                 className="border rounded-lg px-3 py-2 text-sm"
//                 placeholderText="End date"
//               />
//             </div>
            
//             <button
//               onClick={handleCustomRangeApply}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               Apply
//             </button>
            
//             <button
//               onClick={() => {
//                 setFilter("all");
//                 setCustomRange({ start: null, end: null });
//               }}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
//             >
//               Clear
//             </button>
//           </div>
//         )}
//       </div>

//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Break</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working Hours</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {loading ? (
//                 <tr>
//                   <td colSpan={6} className="text-center py-8">
//                     <div className="flex justify-center">
//                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//                     </div>
//                   </td>
//                 </tr>
//               ) : attendance.length > 0 ? (
//                 attendance.map((record) => (
//                   <tr key={record._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatDate(record.date)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
//                         record.status === "present" 
//                           ? "bg-green-100 text-green-800" 
//                           : "bg-red-100 text-red-800"
//                       }`}>
//                         {record.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatTime(record.clockIn)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatTime(record.clockOut)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatDuration(record.totalBreakDuration)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {record.workingHours.toFixed(2)} hours
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={6} className="text-center py-8 text-gray-500">
//                     No attendance records found
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

// export default EmployeeAttendance;




import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ChevronLeft, User, CheckCircle, XCircle, Filter, CalendarDays, CalendarCheck, CalendarClock, CalendarRange } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface AttendanceRecord {
  _id: string;
  empId: string;
  empName: string;
  date: string;
  clockIn: string;
  clockOut: string | null;
  status: 'present' | 'absent';
  totalBreakDuration: number;
  workingHours: number;
}

const validateAttendanceRecord = (record: any): AttendanceRecord => {
  return {
    ...record,
    workingHours: typeof record.workingHours === 'number' 
      ? record.workingHours
      : parseFloat(record.workingHours) || 0,
    totalBreakDuration: typeof record.totalBreakDuration === 'number'
      ? record.totalBreakDuration
      : parseInt(record.totalBreakDuration) || 0,
    clockOut: record.clockOut || null
  };
};

const EmployeeAttendance = () => {
  const { email } = useParams<{ email: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [customRange, setCustomRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });

  const fetchAttendanceData = async (endpoint = "all") => {
    try {
      let url = import.meta.env.VITE_API_BASE_URL+ `/api/attendance/${endpoint}/${email}`;
      
      if (endpoint === "custom" && customRange.start && customRange.end) {
        const params = new URLSearchParams({
          startDate: customRange.start.toISOString(),
          endDate: customRange.end.toISOString()
        });
        url = import.meta.env.VITE_API_BASE_URL+ `/api/attendance/custom/${email}?${params}`;
      }
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (!response.ok) throw new Error(`Failed to fetch ${endpoint} attendance`);
      
      const data = await response.json();
      const attendanceData = (Array.isArray(data) ? data : data.attendances || [])
        .map(validateAttendanceRecord);
      
      if (attendanceData.length > 0 && endpoint === "all") {
        setEmployeeName(attendanceData[0].employee.name || "Unknown");
        setEmployeeId(attendanceData[0].empId || "N/A");
      }
      
      return attendanceData;
    } catch (err) {
      console.error(`Error fetching ${endpoint} attendance:`, err);
      throw err;
    }
  };

  const loadInitialData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAttendanceData("all");
      setAttendance(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (newFilter: string) => {
    setFilter(newFilter);
    setLoading(true);
    
    try {
      const data = await fetchAttendanceData(newFilter === "custom" ? "custom" : newFilter);
      setAttendance(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch filtered data";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomRangeApply = () => {
    if (customRange.start && customRange.end) {
      handleFilterChange("custom");
    } else {
      toast.warning("Please select both start and end dates");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
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

  const formatDuration = (minutes: number) => {
    if (!minutes) return "-";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  useEffect(() => {
    loadInitialData();
  }, [email]);

  const statusStats = {
    present: attendance.filter(a => a.status === "present").length,
    absent: attendance.filter(a => a.status === "absent").length
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Employee Attendance</h1>
          <div className="flex items-center mt-1 text-sm text-gray-600">
            <User className="h-4 w-4 mr-1" />
            {employeeName} (ID: {employeeId})
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Records</p>
              <p className="text-2xl font-semibold mt-1">{attendance.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <CalendarDays className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Present Days</p>
              <p className="text-2xl font-semibold mt-1">{statusStats.present}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Absent Days</p>
              <p className="text-2xl font-semibold mt-1">{statusStats.absent}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="font-medium">Filter Attendance</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange("all")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
            >
              <CalendarDays className="h-4 w-4" />
              <span>All Records</span>
            </button>
            
            <button
              onClick={() => handleFilterChange("last-week")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === "last-week" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
            >
              <CalendarCheck className="h-4 w-4" />
              <span>Last Week</span>
            </button>
            
            <button
              onClick={() => handleFilterChange("last-month")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === "last-month" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
            >
              <CalendarClock className="h-4 w-4" />
              <span>Last Month</span>
            </button>
            
            <button
              onClick={() => handleFilterChange("last-year")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === "last-year" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
            >
              <CalendarRange className="h-4 w-4" />
              <span>Last Year</span>
            </button>

            <button
              onClick={() => setFilter("custom")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === "custom" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
            >
              <CalendarRange className="h-4 w-4" />
              <span>Custom Range</span>
            </button>
          </div>
        </div>
        
        {filter === "custom" && (
          <div className="mt-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">From:</label>
                <DatePicker
                  selected={customRange.start}
                  onChange={(date) => setCustomRange(prev => ({...prev, start: date}))}
                  selectsStart
                  startDate={customRange.start}
                  endDate={customRange.end}
                  className="border rounded-lg px-3 py-2 text-sm w-full md:w-auto"
                  placeholderText="Select start date"
                  dateFormat="MMMM d, yyyy"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">To:</label>
                <DatePicker
                  selected={customRange.end}
                  onChange={(date) => setCustomRange(prev => ({...prev, end: date}))}
                  selectsEnd
                  startDate={customRange.start}
                  endDate={customRange.end}
                  minDate={customRange.start}
                  className="border rounded-lg px-3 py-2 text-sm w-full md:w-auto"
                  placeholderText="Select end date"
                  dateFormat="MMMM d, yyyy"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <button
                onClick={handleCustomRangeApply}
                disabled={!customRange.start || !customRange.end}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  customRange.start && customRange.end 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                Apply Range
              </button>
              
              <button
                onClick={() => {
                  setFilter("all");
                  setCustomRange({ start: null, end: null });
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Clear All Filters
              </button>

              {customRange.start && customRange.end && (
                <div className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {customRange.start.toLocaleDateString()} → {customRange.end.toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Break</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working Hours</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : attendance.length > 0 ? (
                attendance.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(record.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        record.status === "present" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(record.clockIn)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(record.clockOut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDuration(record.totalBreakDuration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.workingHours.toFixed(2)} hours
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No attendance records found
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

export default EmployeeAttendance;