import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Trash2, Edit } from 'lucide-react';

interface Employee {
  _id: string;
  empId: string;
  name: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  contact_number: string;
  address: string;
  role: string;
  is_active: boolean;
  joining_date: string;
  leaveBalance: {
    "Casual Leave": number;
    "Sick Leave": number;
    "Earned Leave": number;
    "Unpaid Leave": string;
  };
}

const EmployeeView: React.FC = () => {
  const { empId } = useParams<{ empId: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(import.meta.env.VITE_API_BASE_URL+ `/api/employee/${empId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEmployee(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching employee:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load employee details');
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [empId, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      try {
        setIsDeleting(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        await axios.delete(import.meta.env.VITE_API_BASE_URL+ `/api/employee/${empId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Show success message and redirect after a short delay
        setError(null);
        setIsDeleting(false);
        navigate('/dashboard/employees', { state: { message: 'Employee deleted successfully!' }
        });
        window.location.reload();
      } catch (err) {
        console.error('Error deleting employee:', err);
        setError(err.response?.data?.message || err.message || 'Failed to delete employee');
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-1" /> Back to list
        </button>
      </div>
    );
  }

  if (!employee) {
    return null;
  }

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft className="mr-1" /> Back to list
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Employee Details</h2>
          <span className={`px-3 py-1 text-sm rounded-full ${
            employee.is_active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {employee.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                <span className="text-3xl text-gray-600 font-medium">
                  {employee.name.split(' ').map((n) => n[0]).join('')}
                </span>
              </div>
              <h3 className="text-xl font-semibold">{employee.name}</h3>
              <p className="text-gray-500">{employee.position}</p>
              <p className="text-gray-500">{employee.department} Department</p>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-3">Basic Information</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Employee ID</p>
                    <p>{employee.empId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{employee.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Joining Date</p>
                    <p>{formatDate(employee.joining_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Salary</p>
                    <p>${employee.salary.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p>{employee.contact_number || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p>{employee.address || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p>{employee.role}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-medium text-gray-800 mb-3">Leave Balance</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-600">Casual Leave</p>
                  <p className="text-xl font-semibold">{employee.leaveBalance["Casual Leave"]}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-600">Sick Leave</p>
                  <p className="text-xl font-semibold">{employee.leaveBalance["Sick Leave"]}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-purple-600">Earned Leave</p>
                  <p className="text-xl font-semibold">{employee.leaveBalance["Earned Leave"]}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm text-yellow-600">Unpaid Leave</p>
                  <p className="text-xl font-semibold">{employee.leaveBalance["Unpaid Leave"]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2 disabled:opacity-50"
          >
            {isDeleting ? (
              'Deleting...'
            ) : (
              <>
                <Trash2 className="h-5 w-5" />
                Delete Employee
              </>
            )}
          </button>
          <button
            onClick={() => navigate(`/employees/edit/${employee.empId}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <Edit className="h-5 w-5" />
            Edit Employee
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeView;