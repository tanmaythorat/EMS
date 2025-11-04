// import { useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "../styles/EmployeeLogin.css";
// import { useNavigate } from "react-router-dom";

// interface Employee {
//   empId: string;
//   name: string;
//   email: string;
//   role: string;
//   [key: string]: any; // Allows additional fields if needed
// }

// const EmployeeLogin = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate(); // ✅ Use navigate at the top level

//   const handleLogin = async (): Promise<void> => {
//     setLoading(true);
//     console.log("🔹 Sending login request with:", { email, password });

//     try {
//       const response = await axios.post<{
//         token: string;
//         employee: Employee;
//       }>(
//         "${process.env.REACT_APP_API_BASE_URL}/api/auth/employee/login",
//         { email, password },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//           withCredentials: true,
//         }
//       );

//       console.log("✔️ Login successful:", response.data);
//       toast.success("Login successful!");

//       const { token, employee } = response.data;
//       if (!token || !employee) {
//         throw new Error("Invalid response from server.");
//       }

//       localStorage.setItem("employeeToken", token);
//       localStorage.setItem("employeeData", JSON.stringify(employee));

//       navigate("/dashboard"); // ✅ Navigate after login success
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         console.error("❌ Login error:", error.response?.data || error.message);
//         toast.error(error.response?.data?.message || "Invalid email or password!");
//       } else {
//         console.error("❌ Unexpected error:", error);
//         toast.error("Something went wrong. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-card">
//         <div className="left-section">
//           <img
//             src="https://cdn.vectorstock.com/i/2000v/51/87/student-avatar-user-profile-icon-vector-47025187.avif"
//             alt="User"
//           />
//           <h2>WELCOME</h2>
//           <p>Login to mark attendance and apply for leave.</p>
//         </div>

//         <div className="right-section">
//           <h3>Employee Login</h3>

//           <input
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           <input
//             type="password"
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />

//           <button onClick={handleLogin} disabled={loading}>
//             {loading ? "Logging in..." : "LOGIN"}
//           </button>

//           <p className="forgot-password">Forgot Password?</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeLogin;



import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/EmployeeLogin.css";
import { useNavigate } from "react-router-dom";

interface Employee {
  empId: string;
  name: string;
  email: string;
  role: string;
  [key: string]: any;
}

const EmployeeLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleLogin = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await axios.post<{
        token: string;
        employee: Employee;
      }>(
        "${process.env.REACT_APP_API_BASE_URL}/api/auth/employee/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );

      const { token, employee } = response.data;
      localStorage.setItem("employeeToken", token);
      localStorage.setItem("employeeData", JSON.stringify(employee));
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Invalid email or password!");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Handlers
  const handleForgotPassword = () => setShowForgotPassword(true);
  const handleCloseModal = () => setShowForgotPassword(false);

  const requestOTP = async () => {
    try {
      await axios.post("${process.env.REACT_APP_API_BASE_URL}/api/employee/forgot-password/request-otp", { email });
      toast.success("OTP sent to your email.");
      setStep(2);
    } catch (error) {
      toast.error("Failed to send OTP. Please check your email.");
    }
  };

  const verifyOTP = async () => {
    try {
      await axios.post("${process.env.REACT_APP_API_BASE_URL}/api/employee/forgot-password/verify-otp", { email, otp });
      toast.success("OTP verified!");
      setStep(3);
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const resetPassword = async () => {
    try {
      await axios.post("${process.env.REACT_APP_API_BASE_URL}/api/employee/forgot-password/reset", { email, newPassword });
      toast.success("Password reset successfully!");
      setShowForgotPassword(false);
    } catch (error) {
      toast.error("Failed to reset password.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="left-section">
          <img
            src="https://cdn.vectorstock.com/i/2000v/51/87/student-avatar-user-profile-icon-vector-47025187.avif"
            alt="User"
          />
          <h2>WELCOME</h2>
          <p>Login to mark attendance and apply for leave.</p>
        </div>

        <div className="right-section">
          <h3>Employee Login</h3>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "LOGIN"}
          </button>

          <p className="forgot-password" onClick={handleForgotPassword}>
            Forgot Password?
          </p>

          {showForgotPassword && (
            <div className="modal">
              <div className="modal-content">
                <h3>Forgot Password</h3>

                {step === 1 && (
                  <>
                    <p>Enter your email to receive OTP:</p>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button onClick={requestOTP}>Send OTP</button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <p>Enter the OTP sent to your email:</p>
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <button onClick={verifyOTP}>Verify OTP</button>
                  </>
                )}

                {step === 3 && (
                  <>
                    <p>Set your new password:</p>
                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button onClick={resetPassword}>Reset Password</button>
                  </>
                )}

                <button className="close-btn" onClick={handleCloseModal}>
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;
