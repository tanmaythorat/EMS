import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import DashboardStats from '../components/dashboard/DashboardStats';
import EmployeeList from '../components/employees/EmployeeList';
import AttendanceView from '../components/attendance/AttendanceView';
import LeaveManagement from '../components/leave/LeaveManagement';
import PayrollList from '../components/payroll/PayrollList';
import EmployeeRelations from '../components/relations/EmployeeRelations';
import TrainingPrograms from '../components/training/TrainingPrograms';
import Settings from '../components/settings/Settings';
import AddPayrollForm from '../components/payroll/AddPayrollForm';
import NoticeList from '../components/Notice/NoticeList';
import NoticeForm from '../components/Notice/NoticeForm';
import NoticeDetail from '../components/Notice/NoticeDetail';
import DetailedAttendance from '../components/attendance/DetailedAttendance';
import EmployeeAttendance from '../components/attendance/EmployeeAttendance';
import NoticeEdit from '../components/Notice/NoticeEdit';

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <Routes>
            <Route index element={<DashboardStats />} />
            <Route path="employees" element={<EmployeeList />} />
            {/* <Route path="attendance" element={<AttendanceView />} /> */}
            <Route path="attendance">
              <Route index element={<AttendanceView />} />
              <Route path="detailed-attendance" element={<DetailedAttendance />} />
              <Route path="employee-attendance/:email" element={<EmployeeAttendance />} />
            </Route>
            <Route path="leave" element={<LeaveManagement />} />
            <Route path="payroll">
              <Route index element={<PayrollList />} />
              <Route path="add" element={<AddPayrollForm />} />
            </Route>
            <Route path="notices">
              <Route index element={<NoticeList />} /> {/* List of all notices */}
              <Route path="new" element={<NoticeForm />} /> {/* Create new notice */}
              <Route path=":id" element={<NoticeDetail />} /> {/* View single notice */}
              <Route path=":id/edit" element={<NoticeEdit />} /> Edit notice
            </Route>
            <Route path="relations" element={<EmployeeRelations />} />
            <Route path="training" element={<TrainingPrograms />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;