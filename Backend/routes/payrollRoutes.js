const express = require("express");
const router = express.Router();
const payrollController = require("../controllers/payrollController");

const { createPayroll, getPayrollByEmployee, updatePayrollStatus,approvePayroll, updatePayroll, deletePayroll, getAllPayrolls,generatePayslip } = payrollController;

console.log("Payroll Controller:", payrollController); // Debugging line
const { protect, adminOnly} = require("../middleware/authMiddleware");



// Create Payroll (Admin Only)
router.post("/", protect, adminOnly, createPayroll);

// Get Payroll by Employee ID (Employee can view their payroll)
router.get("/:empId",protect,  getPayrollByEmployee);

// ✅ Route to update payroll status
router.put("/update-status/:id", protect, adminOnly,updatePayrollStatus);

// Approve Payroll (Admin Only)
router.put("/approve/:payrollId",  approvePayroll);

// Update Payroll (Admin Only)
router.put("/:payrollId", protect, adminOnly, updatePayroll);

// Delete Payroll (Admin Only)
router.delete("/:payrollId", protect, adminOnly, deletePayroll);

// List All Payrolls (Admin Only)
router.get("/",  protect, adminOnly,getAllPayrolls);

// Generate Payslip
router.get("/:empId/payslip", protect, generatePayslip);

module.exports = router;
