import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Clock, DollarSign } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

interface Stats {
  totalEmployees: number;
  activeEmployees: number;
  totalAttendance: number;
  pendingLeaves: number;
  approvedLeaves: number;
  totalPayroll: number;
}

const DashboardStats: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchDashboardData(token);
    }
  }, [navigate]);

  const fetchDashboardData = async (token: string) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [employeesRes, attendanceRes, leaveRes, payrollRes] = await Promise.all([
        axios.get(import.meta.env.VITE_API_BASE_URL+ "/api/employee/", { headers }),
        axios.get(import.meta.env.VITE_API_BASE_URL+ "/api/attendance/all/", { headers }),
        axios.get(import.meta.env.VITE_API_BASE_URL+ "/api/leave/all", { headers }),
        axios.get(import.meta.env.VITE_API_BASE_URL+ "/api/payroll/", { headers }),
      ]);

      const totalEmployees = employeesRes.data.length;
      const activeEmployees = employeesRes.data.filter(emp => emp.is_active).length;
      const totalAttendance = attendanceRes.data.length;
      const pendingLeaves = leaveRes.data.filter(leave => leave.status === "Pending").length;
      const approvedLeaves = leaveRes.data.filter(leave => leave.status === "Approved").length;
      const totalPayroll = payrollRes.data.length;

      setStats({
        totalEmployees,
        activeEmployees,
        totalAttendance,
        pendingLeaves,
        approvedLeaves,
        totalPayroll,
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard stats. Please try again.');
      setLoading(false);
    }
  };

  const attendanceData = [
    { month: 'Jan', present: 40, absent: 5 },
    { month: 'Feb', present: 42, absent: 3 },
    { month: 'Mar', present: 38, absent: 7 },
    { month: 'Apr', present: 45, absent: 2 },
  ];

  const leaveData = [
    { month: 'Jan', leaves: 2 },
    { month: 'Feb', leaves: 3 },
    { month: 'Mar', leaves: 1 },
    { month: 'Apr', leaves: 4 },
  ];

  if (loading) {
    return <div className="p-6 flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[{
          title: 'Total Employees', value: stats?.totalEmployees, icon: Users, color: 'bg-blue-500'
        }, {
          title: 'Active Employees', value: stats?.activeEmployees, icon: Calendar, color: 'bg-green-500'
        }, {
          title: 'Pending Leaves', value: stats?.pendingLeaves, icon: Clock, color: 'bg-yellow-500'
        }, {
          title: 'Total Payrolls', value: stats?.totalPayroll, icon: DollarSign, color: 'bg-purple-500'
        }].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className="text-2xl font-semibold mt-1">{stat.value || 0}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Attendance Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="present" fill="#3B82F6" />
              <Bar dataKey="absent" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Leave Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={leaveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="leaves" stroke="#8B5CF6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;