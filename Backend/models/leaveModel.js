const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  empId: { type: String, required: true },  // Employee ID
  leaveType: {
    type: String,
    enum: ["Paid Leave", "Unpaid Leave", "Sick Leave", "Casual Leave", "Paternity Leave", "Compensatory Off"],
    required: true
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalDays: { type: Number, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },

  appliedAt: { type: Date, default: Date.now }, // Track when the leave was applied
  approvedAt: { type: Date }, // Track when the leave was approved
  rejectedAt: { type: Date }, // Track when the leave was rejected
  



  // Leave Tracking
  totalLeaves: { type: Number, default: 0 },  // Annual Quota
  usedLeaves: { type: Number, default: 0 },   // Approved Leaves
  remainingLeaves: { type: Number, default: 0 }, // Remaining Balance
  pendingLeaves: { type: Number, default: 0 }, // Pending Approval

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Leave", leaveSchema);
