const express = require('express');
const router = express.Router();
const superadminController = require('../controllers/superadminController');
const { verifySuperAdmin } = require('../middleware/authMiddleware');

router.post('/create-superadmin', superadminController.createSuperAdmin);
router.get('/pending-admins', verifySuperAdmin, superadminController.getPendingAdmins);
router.put('/approve-admin/:id', verifySuperAdmin, superadminController.approveAdmin);
router.get('/admins', verifySuperAdmin, superadminController.getAllAdmins);
router.delete('/delete-admin/:id', verifySuperAdmin, superadminController.deleteAdmin);

router.get('/dashboard', verifySuperAdmin, (req, res) => {
    res.status(200).json({ message: 'Welcome to Super Admin Dashboard' });
});

module.exports = router;
