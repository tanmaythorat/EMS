import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';

interface Admin {
  _id: string;
  name: string;
  email: string;
  companyName: string;
  createdAt: string;
  approved: boolean;
}
const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('admin');
  window.location.href = '/super-admin'; // Or your login route
};

const SuperAdminDashboard: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    denied: 0
  });

  const fetchAdmins = async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(import.meta.env.VITE_API_BASE_URL+ '/api/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAdmins(response.data);
      updateStats(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch admins');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStats = (data: Admin[]) => {
    setStats({
      total: data.length,
      pending: data.filter(a => a.approved === false).length,
      approved: data.filter(a => a.approved === true).length,
      denied: 0 // Adjust based on your backend if you have a denied status
    });
  };

  const handleStatusChange = async (adminId: string, approved: boolean) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        import.meta.env.VITE_API_BASE_URL+ `/api/admin/approve/${adminId}`,
        { approved },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAdmins(); // Refresh the list
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update status');
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="p-6">
     <div className="flex justify-between items-center mb-6">
  <h1 className="text-2xl font-semibold text-gray-800">Super Admin Dashboard</h1>
  <div className="flex items-center gap-4">
    <button
      onClick={fetchAdmins}
      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
    >
      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      Refresh
    </button>
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-red-600 hover:text-red-800"
    >
      Logout
    </button>
  </div>
</div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Admins</p>
              <p className="text-2xl font-semibold mt-1">{stats.total}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-full">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Requests</p>
              <p className="text-2xl font-semibold mt-1">{stats.pending}</p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-full">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Approved Admins</p>
              <p className="text-2xl font-semibold mt-1">{stats.approved}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Denied Requests</p>
              <p className="text-2xl font-semibold mt-1">{stats.denied}</p>
            </div>
            <div className="bg-red-500 p-3 rounded-full">
              <XCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Admin Access Requests</h2>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center">
            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-500" />
            <p className="mt-2">Loading admins...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {admins.map((admin) => (
                  <tr key={admin._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{admin.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{admin.companyName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        admin.approved
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {admin.approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!admin.approved && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusChange(admin._id, true)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(admin._id, false)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Deny
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;