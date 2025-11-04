import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/HomePage';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import ForgotPassword from './components/auth/ForgotPassword';
import Dashboard from './pages/Dashboard';
import SuperAdminLogin from './components/superadmin/SuperAdminLogin';
import SuperAdminDashboard from './components/superadmin/SuperAdminDashboard';
import EmployeeView from './components/employees/EmployeeView';
import EmployeeEdit from './components/employees/EmployeeEdit';
import AddEmployee from './components/employees/AddEmployee';
import DetailedAttendance from './components/attendance/DetailedAttendance';
import EmployeeAttendance from './components/attendance/EmployeeAttendance';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
        <Route path="/" element={<Homepage />} />  
          <Route path="/login" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Login to HRMS</h1>
                <LoginForm />
              </div>
            </div>
          } />
          <Route path="/signup" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
                <SignupForm />
              </div>
            </div>
          } />
          <Route path="/forgot-password" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <ForgotPassword />
              </div>
            </div>
          } />
          <Route path="/super-admin" element={<SuperAdminLogin />} />
          <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/employees/view/:empId" element={<EmployeeView />} />
          <Route path="/employees/edit/:empId" element={<EmployeeEdit />} />
          <Route path="/employees/add" element={<AddEmployee />} />
          {/* <Route path="/attendance/detailed-attendance" element={<DetailedAttendance />} />
          <Route path="/employee-attendance/:empId" element={<EmployeeAttendance />} />           */}

        </Routes>
      </div>
    </Router>
  );
}

export default App;