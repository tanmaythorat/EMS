const User = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifySuperAdmin } = require('../middleware/authMiddleware');

// ✅ Create Super Admin
exports.createSuperAdmin = async (req, res) => {
    try {
        const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
        if (existingSuperAdmin) {
            return res.status(400).json({ message: 'Super Admin already exists' });
        }

        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const superAdmin = new User({
            name,
            email,
            password: hashedPassword,
            role: 'superadmin'
        });

        await superAdmin.save();
        res.status(201).json({ message: 'Super Admin created successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// ✅ Get All Pending Admin Requests (Dummy Function for Now)
exports.getPendingAdmins = async (req, res) => {
    try {
        const pendingAdmins = await User.find({ role: 'admin', isApproved: false });
        res.status(200).json(pendingAdmins);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// ✅ Approve Admin (Dummy Function for Now)
exports.approveAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndUpdate(id, { isApproved: true });
        res.status(200).json({ message: 'Admin approved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// ✅ Get All Admins
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' });
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// ✅ Delete Admin
exports.deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
