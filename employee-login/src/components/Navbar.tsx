// import React from 'react';
// import { LogOut, Menu } from 'lucide-react';

// interface NavbarProps {
//   setIsSidebarOpen: (isOpen: boolean) => void;
//   employeeName: string;
// }

// export function Navbar({ setIsSidebarOpen, employeeName }: NavbarProps) {
//   return (
//     <header className="bg-white shadow-sm">
//       <div className="flex items-center justify-between px-6 h-16">
//         <button
//           onClick={() => setIsSidebarOpen(true)}
//           className="lg:hidden"
//         >
//           <Menu className="w-6 h-6 text-gray-600" />
//         </button>
//         <div className="flex items-center space-x-4">
//           <span className="text-sm text-gray-600">Welcome, {employeeName}</span>
//           <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
//             <LogOut className="w-4 h-4 mr-1" />
//             Logout
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// }


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";

interface NavbarProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export function Navbar({ setIsSidebarOpen }: NavbarProps) {
  const [employeeName, setEmployeeName] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const employeeData = JSON.parse(localStorage.getItem("employeeData") || "{}");
    if (employeeData?.name) {
      setEmployeeName(employeeData.name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // Clear all stored data
    navigate("/"); // Redirect to home page
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 h-16">
        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden">
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Welcome, {employeeName || "Guest"}</span>
          <button onClick={handleLogout} className="flex items-center text-sm text-gray-600 hover:text-gray-900">
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
