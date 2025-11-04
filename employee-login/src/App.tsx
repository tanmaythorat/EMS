// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import { EmployeeDetails } from './components/EmployeeDetails';
// import { MarkAttendance } from './components/MarkAttendance';
// import { ViewAttendance } from './components/ViewAttendance';
// import { ApplyLeave } from './components/ApplyLeave';
// import { ViewPayroll } from './components/ViewPayroll';
// import { Sidebar } from './components/Sidebar';
// import { Navbar } from './components/Navbar';
// import EmployeeLogin from './components/EmployeeLogin';

// // Mock data - replace with API calls
// const employeeDetails = {
//   name: "John Doe",
//   position: "Software Engineer",
//   employeeId: "EMP001",
//   department: "Engineering",
//   joinDate: "2023-01-15",
//   email: "john.doe@company.com"
// };

// function DashboardLayout() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [activeSection, setActiveSection] = useState('dashboard');

//   const renderContent = () => {
//     switch (activeSection) {
//       case 'dashboard':
//         return <EmployeeDetails employee={employeeDetails} />;
//       case 'markAttendance':
//         return <MarkAttendance />;
//       case 'viewAttendance':
//         return <ViewAttendance />;
//       case 'applyLeave':
//         return <ApplyLeave />;
//       case 'viewPayroll':
//         return <ViewPayroll />;
//       default:
//         return <EmployeeDetails employee={employeeDetails} />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex h-screen overflow-hidden">
//         <Sidebar 
//           isSidebarOpen={isSidebarOpen}
//           setIsSidebarOpen={setIsSidebarOpen}
//           activeSection={activeSection}
//           setActiveSection={setActiveSection}
//         />

//         <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
//           <Navbar 
//             setIsSidebarOpen={setIsSidebarOpen}
//             employeeName={employeeDetails.name}
//           />

//           <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
//             <div className="container mx-auto">
//               {renderContent()}
//             </div>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <ToastContainer position="top-right" autoClose={3000} />
//       <Routes>
//         <Route path="/login" element={<EmployeeLogin />} />
//         <Route path="/dashboard/*" element={<DashboardLayout />} />
//         <Route path="/" element={<Navigate to="/login" replace />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;



import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { EmployeeDetails } from "./components/EmployeeDetails";
import { MarkAttendance } from "./components/MarkAttendance";
import { ViewAttendance } from "./components/ViewAttendance";
import { ApplyLeave } from "./components/ApplyLeave";
import { ViewPayroll } from "./components/ViewPayroll";
import { Sidebar } from "./components/Sidebar";
import { Navbar } from "./components/Navbar";
import { EmployeeNotices } from "./components/EmployeeNotices ";
import EmployeeLogin from "./components/EmployeeLogin";
import { Toaster } from "react-hot-toast";

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <EmployeeDetails />;
      case "markAttendance":
        return <MarkAttendance />;
      case "viewAttendance":
        return <ViewAttendance />;
      case "applyLeave":
        <Toaster position="top-right" />
        return <ApplyLeave />;
      case "viewPayroll":
        return <ViewPayroll />;
        case "viewNotices":
          return <EmployeeNotices />;
      default:
        return <EmployeeDetails />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          <Navbar setIsSidebarOpen={setIsSidebarOpen} />

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            <div className="container mx-auto">{renderContent()}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/login" element={<EmployeeLogin />} />
        <Route path="/dashboard/*" element={<DashboardLayout />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
