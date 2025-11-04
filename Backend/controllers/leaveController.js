const Leave = require("../models/LeaveModel");
const Employee = require("../models/Employee");

// Apply for Leave (Employee)
const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const empId = req.user.empId;

    // Find Employee
    const employee = await Employee.findOne({ empId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Calculate total days of leave
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; // Including start date

    // Check leave balance if it's a Paid Leave
    if (leaveType === "Paid Leave" && totalDays > employee.remainingLeaves) {
      return res.status(400).json({ message: "Not enough paid leave balance" });
    }

    // Create Leave Request
    const newLeave = new Leave({
      empId,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason,
      status: "Pending",
      pendingLeaves: totalDays,
      appliedAt: new Date(), // Track leave application time
    });

    await newLeave.save();

    res.status(201).json({ message: "Leave request submitted successfully", leave: newLeave });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get Leaves for Logged-in Employee
// const getEmployeeLeaves = async (req, res) => {
//   try {
//     const leaves = await Leave.find({ empId: req.user.empId }).sort({ createdAt: -1 });
//     res.status(200).json(leaves);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

const getEmployeeLeaves = async (req, res) => {
  try {
    const empId = req.user.empId;

    // Fetch applied leaves
    const appliedLeaves = await Leave.find({ empId }).sort({ createdAt: -1 });

    // Fetch employee leave balance
    const employee = await Employee.findOne({ empId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Extract remaining leave balances
    const remainingLeaves = employee.leaveBalance || {
      "Casual Leave": 0,
      "Sick Leave": 0,
      "Earned Leave": 0,
      "Unpaid Leave": "Unlimited",
    };

    // Send response
    res.status(200).json({ appliedLeaves, remainingLeaves });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get All Leave Requests (Admin)
const getAllLeaves = async (req, res) => {
  try {
    const { companyName } = req.user; // Admin's company

    // Step 1: Find all employees under this company
    const employees = await Employee.find({ companyName }).select("empId name");

    // Step 2: Create a map of empId → name
    const empMap = employees.reduce((map, emp) => {
      map[emp.empId] = emp.name;
      return map;
    }, {});

    // Step 3: Fetch leave requests for employees in this company
    const leaves = await Leave.find({ empId: { $in: Object.keys(empMap) } })
      .sort({ createdAt: -1 })
      .populate("approvedBy", "name");

    // Step 4: Attach employee names to the response
    const updatedLeaves = leaves.map(leave => ({
      ...leave._doc,
      empName: empMap[leave.empId] || "Unknown Employee"
    }));

    res.status(200).json(updatedLeaves);
  } catch (error) {
    console.error("❌ Error fetching leaves:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Update Leave Status (Admin Approval/Rejection)
const updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status } = req.body;
    const adminId = req.user._id;
    const adminCompany = req.user.companyName;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leave = await Leave.findById(leaveId);
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    // Find the employee and check if they belong to the same company
    const employee = await Employee.findOne({ empId: leave.empId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (employee.companyName !== adminCompany) {
      return res.status(403).json({ message: "Unauthorized to approve/reject this leave" });
    }

    // If approving, deduct leave from balance
    if (status === "Approved" && leave.leaveType !== "Unpaid Leave") {
      const currentBalance = employee.leaveBalance.get(leave.leaveType) || 0; // Fallback to 0 if undefined
      if (currentBalance >= leave.totalDays) {
        employee.leaveBalance.set(leave.leaveType, currentBalance - leave.totalDays);
      } else {
        return res.status(400).json({ message: "Not enough leave balance" });
      }
    }

    await employee.save();

    // Update leave status
    if (status === "Approved") {
      leave.approvedAt = new Date(); // Add approval timestamp
    } else if (status === "Rejected") {
      leave.rejectedAt = new Date(); // Add rejection timestamp
    }
    leave.status = status;
    leave.approvedBy = adminId;
    await leave.save();

    res.status(200).json({ message: `Leave ${status.toLowerCase()} successfully`, leave });
  } catch (error) {
    console.error("❌ Error updating leave status:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

const getMonthlyLeaveTrends = async (req, res) => {
  try {
    console.log("📌 Fetching Monthly Leave Trends for Admin:", req.user);

    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Unauthorized: Only Admins can view leave trends" });
    }

    if (!req.user.companyName) {
      return res.status(400).json({ message: "Company Name missing for Admin" });
    }

    const leaveData = await Leave.aggregate([
      { $match: { companyName: req.user.companyName } }, // Filter by company name
      {
        $group: {
          _id: { $month: "$startDate" },
          leaves: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Format response to match frontend needs
    const formattedData = leaveData.map(item => ({
      month: new Date(2023, item._id - 1).toLocaleString('en', { month: 'short' }),
      leaves: item.leaves
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("❌ Error fetching monthly leave trends:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { applyLeave, getEmployeeLeaves, getAllLeaves, updateLeaveStatus ,getMonthlyLeaveTrends};
