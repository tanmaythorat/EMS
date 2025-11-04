const express = require("express");
const {createSuperAdmin ,approveAdmin, getAllAdmins, getAdminById, deleteAdmin } = require("../controllers/adminController");
const { protect, superadminOnly, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create-superadmin", createSuperAdmin); // ✅ Route to create SuperAdmin


router.patch("/approve/:id", protect, superadminOnly, approveAdmin);
router.get("/all", protect, adminOnly, getAllAdmins);
router.get("/:id", protect, adminOnly, getAdminById);
router.delete("/:id", protect, superadminOnly, deleteAdmin);

module.exports = router;
