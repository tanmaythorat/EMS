
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Employee {
  name: string;
  position: string;
  empId: string;
  department: string;
  hireDate: string;
  email: string;
  contact_number: string;
  address: string;
  companyName: string;
  is_active: boolean;

}


export function EmployeeDetails() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from localStorage
    const storedEmployee = localStorage.getItem("employeeData");
    const token = localStorage.getItem("employeeToken");

    if (!storedEmployee || !token) {
      console.error("No valid employee data found in localStorage.");
      setError("No employee data found. Please log in again.");
      setLoading(false);
      navigate("/login", { replace: true }); // Redirect immediately
      return;
    }

    let employeeData: Employee | null = null;
    try {
      employeeData = JSON.parse(storedEmployee);
    } catch (err) {
      console.error("Error parsing employeeData:", err);
      setError("Corrupted employee data. Please log in again.");
      setLoading(false);
      navigate("/login", { replace: true }); // Redirect immediately
      return;
    }

    if (!employeeData?.empId) {
      console.error("Invalid employee data structure:", employeeData);
      setError("Invalid employee data. Please log in again.");
      setLoading(false);
      navigate("/login", { replace: true }); // Redirect immediately
      return;
    }

    console.log("Fetching employee with ID:", employeeData.empId);

    // Fetch employee details from API
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/employee/${employeeData.empId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          console.error("API Error Response:", response.status, response.statusText);
          throw new Error(`Failed to fetch employee details. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Employee Data:", data); // Debugging
        setEmployee(data);
      } catch (err) {
        console.error("Error fetching employee data:", err);
        setError("Failed to fetch employee details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [navigate]);

  if (loading) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  if (!employee) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800">Employee Details</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="mt-1 text-base font-medium text-gray-800">{employee.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Employee ID</label>
              <p className="mt-1 text-base font-medium text-gray-800">{employee.empId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Position</label>
              <p className="mt-1 text-base font-medium text-gray-800">{employee.position}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Company Name</label>
              <p className="mt-1 text-base font-medium text-gray-800">{employee.companyName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Joining Date</label>
              <p className="mt-1 text-base font-medium text-gray-800">
                {new Date(employee.joining_date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Department</label>
              <p className="mt-1 text-base font-medium text-gray-800">{employee.department}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="mt-1 text-base font-medium text-gray-800">{employee.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Contact Number</label>
              <p className="mt-1 text-base font-medium text-gray-800">{employee.contact_number}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Address</label>
              <p className="mt-1 text-base font-medium text-gray-800">{employee.address}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <p className={`mt-1 text-base font-bold ${employee.is_active ? "text-green-600" : "text-red-600"}`}>
                {employee.is_active ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}