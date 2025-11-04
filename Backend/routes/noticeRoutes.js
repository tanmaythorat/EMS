const express = require("express");
const {
  createNotice,
  getAllNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
  getEmployeesForNotice,
  getNoticesForEmployeeByEmail
} = require("../controllers/noticeController");
const { protect, verifyAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin routes
router.post("/", protect, verifyAdmin, createNotice);
router.get("/admin", protect, verifyAdmin, getAllNotices);
router.get("/employees", protect, verifyAdmin, getEmployeesForNotice); // New endpoint
router.get("/:id", protect, verifyAdmin, getNoticeById); 
router.put("/:id", protect, verifyAdmin, updateNotice);
router.delete("/:id", protect, verifyAdmin, deleteNotice);
router.get("/employee/email/:email", protect, getNoticesForEmployeeByEmail);


module.exports = router;