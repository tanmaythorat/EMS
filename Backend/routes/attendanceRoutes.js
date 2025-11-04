    const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// Public routes (email-based)
router.post("/clock-in", attendanceController.clockIn);
router.post("/clock-out", attendanceController.clockOut);
router.post("/break-in", attendanceController.breakIn);
router.post("/break-out", attendanceController.breakOut);

router.get("/today/:email",protect, attendanceController.getTodayAttendanceByEmail);
router.get("/today-all",protect, isAdmin, attendanceController.getTodayAllAttendance);

router.get("/all",protect, isAdmin, attendanceController.getAllAttendances);
router.get("/all/:email",protect, attendanceController.getAllAttendanceByEmail);

router.get("/last-week", protect, isAdmin, attendanceController.getLastWeekAttendance);
router.get("/last-week/:email", protect, attendanceController.getLastWeekAttendanceByEmail);

router.get("/last-month", protect, isAdmin, attendanceController.getLastMonthAttendance);
router.get("/last-month/:email", protect, attendanceController.getLastMonthAttendanceByEmail);

router.get("/last-year", protect, isAdmin, attendanceController.getLastYearAttendance);
router.get("/last-year/:email", protect, attendanceController.getLastYearAttendanceByEmail);

router.get("/custom", protect, isAdmin, attendanceController.getCustomAttendance);
router.get("/custom/:email", protect, attendanceController.getCustomAttendanceByEmail);


module.exports = router;


// const express = require("express");
// const router = express.Router();
// const attendanceController = require("../controllers/attendanceController");
// const { protect, isAdmin } = require("../middleware/authMiddleware");

// // POST routes
// router.post("/clock-in", attendanceController.clockIn);
// router.post("/clock-out", protect, attendanceController.clockOut);
// router.post("/break-in", protect, attendanceController.breakIn);
// router.post("/break-out", protect, attendanceController.breakOut);

// // Employee-specific GET routes
// router.get("/today", protect, attendanceController.getTodayAttendanceForEmployee); // Today's attendance for employee
// router.get("/all", protect, attendanceController.getAllAttendanceForEmployee); // All attendance for employee
// router.get("/history/employee/last-week", protect, attendanceController.getLastWeekAttendanceForEmployee); // Last week's attendance for employee
// router.get("/history/employee/last-month", protect, attendanceController.getLastMonthAttendanceForEmployee); // Last month's attendance for employee
// router.get("/history/employee/last-year", protect, attendanceController.getLastYearAttendanceForEmployee); // Last year's attendance for employee
// router.post("/history/employee/custom-range", protect, attendanceController.getCustomRangeAttendanceForEmployee); // Custom range attendance for employee
// router.post("/overview/employee/last-month", protect,attendanceController.getLastMonthOverviewForEmployee);

// // Admin-specific GET routes
// router.get("/today/admin", protect, isAdmin, attendanceController.getTodayAttendanceForAdmin); // Today's attendance for admin
// router.get("/all/admin", protect, isAdmin, attendanceController.getAllAttendanceForAdmin); // All attendance for admin
// router.get("/history/admin/last-week", protect, isAdmin, attendanceController.getLastWeekAttendanceForAdmin); // Last week's attendance for admin
// router.get("/history/admin/last-month", protect, isAdmin, attendanceController.getLastMonthAttendanceForAdmin); // Last month's attendance for admin
// router.get("/history/admin/last-year", protect, isAdmin, attendanceController.getLastYearAttendanceForAdmin); // Last year's attendance for admin
// router.post("/history/admin/custom-range", protect, isAdmin, attendanceController.getCustomRangeAttendanceForAdmin); // Custom range attendance for admin
// router.post("/overview/admin/last-month", protect,isAdmin,attendanceController.getLastMonthOverviewForAdmin);
// router.get("/employee/:email/history", protect, attendanceController.getEmployeeAttendanceByEmail); 
// module.exports = router;