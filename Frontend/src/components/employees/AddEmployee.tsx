 import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, EyeOff, ArrowLeft, Check, X } from "lucide-react";

interface EmployeeData {
  name: string;
  email: string;
  password: string;
  role: string;
  department: string;
  position: string;
  contact_number: string;
  temporary_address: string;   // New field
  permanent_address: string;   // New field
  date_of_birth: string;       // New field
  hireDate: string;
}

const departments = ["HR", "IT", "Finance", "Marketing", "Sales", "Operations"];
const roles = ["employee", "hr"];

const AddEmployee = () => {
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState<EmployeeData>({
    name: "",
    email: "",
    password: "",
    role: "employee",
    department: "",
    position: "",
    contact_number: "",
    temporary_address: "",    // Added temporary address
    permanent_address: "",    // Added permanent address
    date_of_birth: new Date().toISOString().split("T")[0],  // Added date of birth
    hireDate: new Date().toISOString().split("T")[0],
  });

  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    show: false,
    success: false,
    message: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      if (
        !employeeData.name ||
        !employeeData.email ||
        !employeeData.password ||
        !employeeData.department ||
        !employeeData.position
      ) {
        throw new Error("Please fill all required fields");
      }

      const payload = {
        name: employeeData.name,
        email: employeeData.email,
        password: employeeData.password,
        role: employeeData.role,
        department: employeeData.department,
        position: employeeData.position,
        contact_number: employeeData.contact_number,
        temporary_address: employeeData.temporary_address,  // New field
        permanent_address: employeeData.permanent_address,  // New field
        date_of_birth: employeeData.date_of_birth,           // New field        joining_date: employeeData.hireDate,
      };

      await axios.post(import.meta.env.VITE_API_BASE_URL+ "/api/employee/", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setSubmitStatus({
        show: true,
        success: true,
        message: "Employee added successfully!",
      });

      setEmployeeData({
        name: "",
        email: "",
        password: "",
        role: "employee",
        department: "",
        position: "",
        contact_number: "",
        temporary_address: "",      // New field
        permanent_address: "",      // New field
        date_of_birth: "",          // New field
        hireDate: new Date().toISOString().split("T")[0],
      });

      setTimeout(
        () => setSubmitStatus({ show: false, success: false, message: "" }),
        3000
      );
    } catch (error: any) {
      console.error("Error adding employee:", error);
      setSubmitStatus({
        show: true,
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Error adding employee. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Add New Employee</h2>
            <p className="text-sm text-gray-500">
              Complete the form to onboard a new team member
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="mr-1 h-5 w-5" />
            Back
          </button>
        </div>

        {submitStatus.show && (
          <div
            className={`p-4 mx-6 mt-4 rounded ${
              submitStatus.success
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <div className="flex items-center">
              {submitStatus.success ? (
                <Check className="h-5 w-5 mr-2" />
              ) : (
                <X className="h-5 w-5 mr-2" />
              )}
              <span>{submitStatus.message}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center">
              <span className="bg-blue-100 text-blue-800 p-2 rounded-full mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={employeeData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@company.com"
                  value={employeeData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contact_number"
                  placeholder="+1234567890"
                  value={employeeData.contact_number}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Temporary Address
    </label>
    <input
      type="text"
      name="temporary_address"
      placeholder="Temporary Address"
      value={employeeData.temporary_address}
      onChange={handleChange}
      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Permanent Address
    </label>
    <input
      type="text"
      name="permanent_address"
      placeholder="Permanent Address"
      value={employeeData.permanent_address}
      onChange={handleChange}
      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>


</div>

<div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Date of Birth
    </label>
    <input
      type="date"
      name="date_of_birth"
      value={employeeData.date_of_birth}
      onChange={handleChange}
      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
              

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={employeeData.password}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
                <div className="mt-1 flex items-center">
                  <div className="flex space-x-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 w-10 rounded-sm ${
                          employeeData.password.length >= i * 3
                            ? employeeData.password.length >= 8
                              ? "bg-green-500"
                              : "bg-yellow-500"
                            : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-xs text-gray-500">
                    {employeeData.password.length >= 8
                      ? "Strong password"
                      : "Minimum 8 characters"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center">
              <span className="bg-blue-100 text-blue-800 p-2 rounded-full mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                  <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                </svg>
              </span>
              Employment Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  name="department"
                  value={employeeData.department}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="position"
                  placeholder="Software Engineer"
                  value={employeeData.position}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Joining Date
                </label>
                <input
                  type="date"
                  name="hireDate"
                  value={employeeData.hireDate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={employeeData.role}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  Add Employee
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;