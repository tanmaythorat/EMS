const mongoose = require("mongoose");

const PayrollSchema = new mongoose.Schema({
  empId: { type: String, required: true, ref: "Employee",unique: false  },
  baseSalary: { type: Number, required: true },
  deductions: {
    tax: { type: Number, default: 0 },
    unpaidLeavePenalty: { type: Number, default: 0 },
    otherDeductions: { type: Number, default: 0 }
  },
  bonuses: {
    performanceBonus: { type: Number, default: 0 },
    overtimePay: { type: Number, default: 0 }
  },
  netSalary: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Processed", "Paid"], default: "Pending" },
  paymentDate: { type: Date, required: true },
  payrollHistory: [
    {
      netSalary: { type: Number, required: true },
      updatedAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Payroll", PayrollSchema);
