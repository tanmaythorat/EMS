const Notice = require("../models/Notice");
const Employee = require("../models/Employee");
const Admin = require("../models/Admin");

// Create Notice with email-based recipients
const createNotice = async (req, res) => {
  try {
    // Verify admin permissions
    if (!req.user || req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only admins can create notices" });
    }

    const { title, content, recipientEmails, end_date, priority } = req.body;

    // Validate and convert emails to employee IDs
    const employees = await Employee.find({
      email: { $in: recipientEmails },
      companyName: req.user.companyName,
      is_active: true
    });

    // Check if all emails were found
    if (employees.length !== recipientEmails.length) {
      const foundEmails = employees.map(e => e.email);
      const missingEmails = recipientEmails.filter(email => !foundEmails.includes(email));
      return res.status(400).json({ 
        message: "Some employees not found",
        missingEmails,
        validEmails: foundEmails
      });
    }

    const recipientIds = employees.map(emp => emp._id);

    const newNotice = new Notice({
      title,
      content,
      created_by: req.user._id,
      companyName: req.user.companyName,
      recipients: recipientIds,
      end_date,
      
    });

    await newNotice.save();
    
    // Return notice with populated recipient emails for confirmation
    const populatedNotice = await Notice.findById(newNotice._id)
      .populate('recipients', 'email name');
      
    res.status(201).json({ 
      message: "Notice created successfully", 
      notice: populatedNotice 
    });
  } catch (error) {
    console.error("Error creating notice:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get employees for notice recipient selection
const getEmployeesForNotice = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only admins can access this" });
    }

    const { search } = req.query;
    let query = { 
      companyName: req.user.companyName,
      is_active: true 
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { empId: { $regex: search, $options: 'i' } }
      ];
    }

    const employees = await Employee.find(query)
      .select('name email empId department position')
      .limit(50);

    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees for notice:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// Get All Notices (Admin view)
const getAllNotices = async (req, res) => {
    try {
      if (!req.user || req.user.role !== "Admin") {
        return res.status(403).json({ message: "Only admins can view all notices" });
      }
  
      const notices = await Notice.find({
        companyName: req.user.companyName
      }).sort({ createdAt: -1 }).populate("created_by", "name").populate("recipients", "name email");
  
      res.status(200).json(notices);
    } catch (error) {
      console.error("Error fetching notices:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // Get Notice by ID
const getNoticeById = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only admins can view notices" });
    }

    const { id } = req.params;

    const notice = await Notice.findOne({
      _id: id,
      companyName: req.user.companyName
    })
    .populate("created_by", "name")
    .populate("recipients", "name email");

    if (!notice) {
      return res.status(404).json({ message: "Notice not found or unauthorized" });
    }

    res.status(200).json(notice);
  } catch (error) {
    console.error("Error fetching notice:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Update Notice
const updateNotice = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only admins can update notices" });
    }

    const { id } = req.params;
    const updates = req.body;

    const notice = await Notice.findOneAndUpdate(
      { _id: id, companyName: req.user.companyName },
      updates,
      { new: true }
    );

    if (!notice) {
      return res.status(404).json({ message: "Notice not found or unauthorized" });
    }

    res.status(200).json({ message: "Notice updated successfully", notice });
  } catch (error) {
    console.error("Error updating notice:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Notice (soft delete)
const deleteNotice = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only admins can delete notices" });
    }

    const { id } = req.params;

    const notice = await Notice.findOneAndUpdate(
      { _id: id, companyName: req.user.companyName },
      { is_active: false },
      { new: true }
    );

    if (!notice) {
      return res.status(404).json({ message: "Notice not found or unauthorized" });
    }

    res.status(200).json({ message: "Notice deleted successfully" });
  } catch (error) {
    console.error("Error deleting notice:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const getNoticesForEmployeeByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    // Find the employee by email
    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Fetch notices where the employee is a recipient
    const notices = await Notice.find({
      recipients: employee._id,
      is_active: true
    })
      .sort({ createdAt: -1 })
      .populate("created_by", "name email"); // ✅ Include email

    res.status(200).json({
      employeeEmail: employee.email, // ✅ Include Employee's Email in response
      notices
    });
  } catch (error) {
    console.error("Error fetching notices for employee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



module.exports = {
  createNotice,
  getEmployeesForNotice,
  getAllNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
  getNoticesForEmployeeByEmail
};