const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  applyLeave,
  getEmployeeLeaves,
  getAllLeaves,
  updateLeaveStatus,
  getMonthlyLeaveTrends
} = require("../controllers/leaveController");

const router = express.Router();

// Employee applies for leave
router.post("/apply", protect, applyLeave);

// Employee gets their own leave history
router.get("/my-leaves", protect, getEmployeeLeaves);

// Admin gets all leave requests
router.get("/all", protect, adminOnly, getAllLeaves);

// Admin approves/rejects leave request
router.put("/:leaveId/status", protect, adminOnly, updateLeaveStatus);

//Monthly data for graph
router.get("/monthly", protect, getMonthlyLeaveTrends);


module.exports = router;
