// routes/employeeRoutes.js
const express = require("express");
const {
  createEmployee,
  getAllEmployees,
  getEmployeeByEmpId,
  updateEmployeeByEmpId,
  deleteEmployeeByEmpId,
  getEmployeeCount 
} = require("../controllers/employeeController");
const { 
  requestEmployeePasswordReset, 
  verifyEmployeeOTPForReset, 
  resetEmployeePasswordAfterOTP 
} = require("../controllers/employeePasswordResetController");
const { protect, adminOnly,verifyAdmin } = require("../middleware/authMiddleware");

const router = express.Router();


// Create employee (protected - only approved admins/HR)
router.post("/", protect,verifyAdmin, createEmployee);

// Get all employees (protected - only approved admins/HR from same company)
router.get("/", protect,verifyAdmin, getAllEmployees);

//Get employee by ID (protected - admin/HR or employee themselves)
router.get("/:empId", protect, getEmployeeByEmpId);

// Update employee (protected - admin/HR or employee themselves with restrictions)
router.put("/:empId", protect, updateEmployeeByEmpId);

// Delete employee (soft delete - protected, only approved admins/HR)
router.delete("/:empId", protect, deleteEmployeeByEmpId);

// Count Total Employees
router.get("/count", protect , getEmployeeCount);



// Employee password reset routes
router.post("/forgot-password/request-otp", requestEmployeePasswordReset);
router.post("/forgot-password/verify-otp", verifyEmployeeOTPForReset);
router.post("/forgot-password/reset", resetEmployeePasswordAfterOTP);



module.exports = router;