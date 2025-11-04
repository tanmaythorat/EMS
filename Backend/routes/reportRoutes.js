const express = require("express");
const router = express.Router();
const {
  getAttendanceSummary,
  exportToCSV,
  getEmployeeAttendanceHistory
} = require("../controllers/reportController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Dashboard summary
router.get("/summary", protect, adminOnly, getAttendanceSummary);

// Export to CSV
router.get("/export", protect, adminOnly, exportToCSV);

// Employee attendance history
router.get("/employee-history", protect, adminOnly, getEmployeeAttendanceHistory);

module.exports = router;