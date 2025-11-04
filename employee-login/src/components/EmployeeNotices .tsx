import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Notice {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export function EmployeeNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmployee = localStorage.getItem("employeeData");
    const token = localStorage.getItem("employeeToken");

    if (!storedEmployee || !token) {
      navigate("/login", { replace: true });
      return;
    }

    let employeeData;
    try {
      employeeData = JSON.parse(storedEmployee);
    } catch (err) {
      navigate("/login", { replace: true });
      return;
    }

    if (!employeeData?.email) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchNotices = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/notices/employee/email/${employeeData.email}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        if (!response.ok) {
          throw new Error(`Failed to fetch notices. Status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("Fetched Notices:", data.notices); // ✅ Check if notices are coming
  
        if (!data.notices || data.notices.length === 0) {
          setError("No notices available.");
        } else {
          setNotices(data.notices);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch notices.");
      } finally {
        setLoading(false);
      }
    };
  
    
    fetchNotices();
  }, [navigate]);

  if (loading) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800">Employee Notices</h2>
      </div>
      <div className="p-6 space-y-6">
        {notices.length === 0 ? (
          <p className="text-center text-gray-600">No notices available.</p>
        ) : (
          notices.map((notice) => (
            <div
              key={notice._id}
              className={`p-4 border rounded-lg ${notice.isRead ? "bg-gray-100" : "bg-yellow-100"}`}
            >
              <h3 className="text-lg font-medium text-gray-800">{notice.title}</h3>
              <p className="text-gray-700 mt-2">{notice.content}</p>
              <p className="text-sm text-gray-500 mt-2">{new Date(notice.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
