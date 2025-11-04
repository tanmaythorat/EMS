const express = require("express");
const { 
  registerAdmin, 
  loginAdmin, 
  requestPasswordReset, 
  verifyOTPForReset, 
  resetPasswordAfterOTP 
} = require("../controllers/authController");

const { 
  loginEmployee,
} = require('../controllers/employeeController');
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { protectEmp } = require('../middleware/authMiddleware');

// const { loginEmployee, changePassword } = require("../controllers/employeeController");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Forgot Password Flow
router.post("/forgot-password/request-otp", requestPasswordReset); // Send OTP
router.post("/forgot-password/verify-otp", verifyOTPForReset); // Verify OTP
router.post("/forgot-password/reset", resetPasswordAfterOTP); // Reset password after OTP
// router.post("/employee/login", loginEmployee);
// router.post("/employee/change-password", changePassword);

router.post('/employee/login', loginEmployee);
// router.post('/employee/change-password', protect, changePassword);

module.exports = router;
