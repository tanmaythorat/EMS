const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// ✅ Create SuperAdmin (Only Once)
const createSuperAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ✅ Check if a SuperAdmin already exists
    const existingSuperAdmin = await Admin.findOne({ role: "SuperAdmin" });
    if (existingSuperAdmin) {
      return res.status(400).json({ message: "SuperAdmin already exists!" });
    }

    // ✅ Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create SuperAdmin
    const superAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      role: "SuperAdmin",
      approved: true, // SuperAdmin is always approved
    });

    await superAdmin.save();
    res.status(201).json({ message: "SuperAdmin created successfully!" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SuperAdmin Approves Admins
// const approveAdmin = async (req, res) => {
//   try {
//     const token = req.header("Authorization")?.split(" ")[1]; // Get token from header
//     if (!token) {
//       return res.status(401).json({ message: "Unauthorized. Token required" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const superAdmin = await Admin.findById(decoded.id);

//     if (!superAdmin || superAdmin.role !== "SuperAdmin") {
//       return res.status(403).json({ message: "Access denied. SuperAdmin only" });
//     }

//     const { id } = req.params; // Admin ID to approve
//     const admin = await Admin.findById(id);
//     if (!admin) return res.status(404).json({ message: "Admin not found" });

//     admin.approved = true;
//     await admin.save();

//     res.json({ message: "Admin approved successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// SuperAdmin Approves Admins
const approveAdmin = async (req, res) => {
  try {
    const { id } = req.params; // Get admin ID from request URL

    // ✅ Ensure Only SuperAdmin Can Approve
    if (!req.user || req.user.role.toLowerCase() !== "superadmin") {
      return res.status(403).json({ message: "Access denied. Only SuperAdmins can approve admins." });
    }

    // ✅ Find Admin
    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // ✅ Check if Already Approved
    if (admin.approved) {
      return res.status(400).json({ message: "Admin is already approved." });
    }

    // ✅ Approve the Admin
    admin.approved = true;
    await admin.save();

    res.json({ message: "Admin approved successfully", admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Get All Admin  
const getAllAdmins = async (req, res) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1]; // Get token from header
    if (!token) {
      return res.status(401).json({ message: "Unauthorized. Token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const superAdmin = await Admin.findById(decoded.id);

    if (!superAdmin || superAdmin.role !== "SuperAdmin") {
      return res.status(403).json({ message: "Access denied. SuperAdmin only" });
    }

    const admins = await Admin.find();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Admin by ID
const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Admin
const deleteAdmin = async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSuperAdmin ,approveAdmin ,getAllAdmins, getAdminById, deleteAdmin };
