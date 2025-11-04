// const Payroll = require("../models/payrollModel");
// const Employee = require("../models/Employee");

// // Calculate net salary
// const calculateNetSalary = (baseSalary, deductions, bonuses) => {
//   const totalDeductions = deductions.tax + deductions.unpaidLeavePenalty + deductions.otherDeductions;
//   const totalBonuses = bonuses.performanceBonus + bonuses.overtimePay;
//   return baseSalary - totalDeductions + totalBonuses;
// };

// // Create Payroll Entry
// const createPayroll = async (req, res) => {
//   try {
//     const { empId, baseSalary, deductions, bonuses, paymentDate } = req.body;

//     console.log("Received empId:", empId); // Debugging log

//     // Validate empId before proceeding
//     if (!empId) {
//       return res.status(400).json({ message: "Employee ID is required" });
//     }

//     const employee = await Employee.findOne({ empId });

//     if (!employee) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     const netSalary = calculateNetSalary(baseSalary, deductions, bonuses);

//     const payroll = new Payroll({
//       empId,
//       baseSalary,
//       deductions,
//       bonuses,
//       netSalary,
//       paymentDate,
//       payrollHistory: [{ netSalary }],
//     });

//     await payroll.save();
//     res.status(201).json({ message: "Payroll created successfully", payroll });
//   } catch (error) {
//     console.error("Error creating payroll:", error);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };


// // Get Payroll by Employee ID
// const getPayrollByEmployee = async (req, res) => {
//   try {
//     const { empId } = req.params;

//     // Restrict access - Employee can only view their own payroll
//     if (req.user.role === "employee" && req.user.empId !== empId) {
//       return res.status(403).json({ message: "Access denied. You can only view your payroll." });
//     }

//     // Fetch payroll only for the given Employee ID
//     const payroll = await Payroll.findOne({ empId });

//     if (!payroll) {
//       return res.status(404).json({ message: "Payroll not found" });
//     }

//     res.status(200).json(payroll);
//   } catch (error) {
//     console.error("Error fetching payroll:", error);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// // Update Payroll Status
// const updatePayrollStatus = async (req, res) => {
//     try {
//       const { id } = req.params;
//       const { status } = req.body;
  
//       // Check if payroll exists
//       const payroll = await Payroll.findById(id);
//       if (!payroll) return res.status(404).json({ message: "Payroll not found" });
  
//       // Update status
//       payroll.status = status;
//       await payroll.save();
  
//       res.status(200).json({ message: "Payroll status updated", payroll });
//     } catch (error) {
//       res.status(500).json({ message: "Server Error", error: error.message });
//     }
//   };

  
// // Approve Payroll
// const approvePayroll = async (req, res) => {
//   try {
//     const { payrollId } = req.params;
//     const payroll = await Payroll.findById(payrollId);
//     if (!payroll) return res.status(404).json({ message: "Payroll not found" });
//     payroll.status = "Processed";
//     await payroll.save();
//     res.status(200).json({ message: "Payroll approved", payroll });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// // Update Payroll
// const updatePayroll = async (req, res) => {
//   try {
//     const { payrollId } = req.params;
//     const updates = req.body;
//     const payroll = await Payroll.findByIdAndUpdate(payrollId, updates, { new: true });
//     if (!payroll) return res.status(404).json({ message: "Payroll not found" });
//     res.status(200).json({ message: "Payroll updated", payroll });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// // Delete Payroll
// const deletePayroll = async (req, res) => {
//   try {
//     const { payrollId } = req.params;
//     const payroll = await Payroll.findByIdAndDelete(payrollId);
//     if (!payroll) return res.status(404).json({ message: "Payroll not found" });
//     res.status(200).json({ message: "Payroll deleted" });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// // Get All Payrolls
// const getAllPayrolls = async (req, res) => {
//     try {
//       const payrolls = await Payroll.find();
//       res.status(200).json(payrolls);
//     } catch (error) {
//       res.status(500).json({ message: "Server Error", error: error.message });
//     }
//   };
  

// module.exports = {
//     createPayroll,
//     getPayrollByEmployee,
//     updatePayrollStatus,
//     approvePayroll,
//     updatePayroll,
//     deletePayroll,
//     getAllPayrolls
//   };
  

const Payroll = require("../models/payrollModel");
const Employee = require("../models/Employee");
const PDFDocument = require('pdfkit');

// Calculate net salary
const calculateNetSalary = (baseSalary, deductions, bonuses) => {
  const totalDeductions = deductions.tax + deductions.unpaidLeavePenalty + deductions.otherDeductions;
  const totalBonuses = bonuses.performanceBonus + bonuses.overtimePay;
  return baseSalary - totalDeductions + totalBonuses;
};

// Create Payroll Entry
const createPayroll = async (req, res) => {
  try {
    const { empId, baseSalary, deductions, bonuses, paymentDate } = req.body;
    const adminCompany = req.user.companyName; // Get admin's company

    // Validate empId before proceeding
    if (!empId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    // Check if Employee exists in the same company as the admin
    const employee = await Employee.findOne({ empId, companyName: adminCompany });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found or unauthorized" });
    }

    const netSalary = calculateNetSalary(baseSalary, deductions, bonuses);

    const payroll = new Payroll({
      empId,
      baseSalary,
      deductions,
      bonuses,
      netSalary,
      paymentDate,
      payrollHistory: [{ netSalary }],
    });

    await payroll.save();
    res.status(201).json({ message: "Payroll created successfully", payroll });
  } catch (error) {
    console.error("Error creating payroll:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



// Get Payroll by Employee ID
const getPayrollByEmployee = async (req, res) => {
  try {
    const { empId } = req.params;

    // Fetch Employee
    const employee = await Employee.findOne({ empId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Restrict Access:
    // 1. If an employee is requesting, they can only see their own payroll
    if (req.user.role === "employee" && req.user.empId !== empId) {
      return res.status(403).json({ message: "Access denied. You can only view your payroll." });
    }

    // 2. If an admin is requesting, they can only access payrolls of employees from their company
    if (req.user.role === "admin" && req.user.companyName !== employee.companyName) {
      return res.status(403).json({ message: "Unauthorized access to payroll" });
    }

    // Fetch payroll
    const payroll = await Payroll.findOne({ empId });

    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    res.status(200).json(payroll);
  } catch (error) {
    console.error("Error fetching payroll:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// Update Payroll Status
const updatePayrollStatus = async (req, res) => {
  try {
    const { id } = req.params;  // Make sure this is payrollId, not employeeId
    const { status } = req.body;

    // Check if payroll exists
    const payroll = await Payroll.findById(id); // ✅ Ensure `id` is an ObjectId
    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    // Update status
    payroll.status = status;
    await payroll.save();

    res.status(200).json({ message: "Payroll status updated", payroll });
  } catch (error) {
    console.error("Error updating payroll status:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

  
// Approve Payroll
const approvePayroll = async (req, res) => {
  try {
    const { payrollId } = req.params;
    const payroll = await Payroll.findById(payrollId);
    if (!payroll) return res.status(404).json({ message: "Payroll not found" });
    payroll.status = "Processed";
    await payroll.save();
    res.status(200).json({ message: "Payroll approved", payroll });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update Payroll
const updatePayroll = async (req, res) => {
  try {
    const { payrollId } = req.params;
    const updates = req.body;
    const payroll = await Payroll.findByIdAndUpdate(payrollId, updates, { new: true });
    if (!payroll) return res.status(404).json({ message: "Payroll not found" });
    res.status(200).json({ message: "Payroll updated", payroll });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete Payroll
const deletePayroll = async (req, res) => {
  try {
    const { payrollId } = req.params;
    const payroll = await Payroll.findByIdAndDelete(payrollId);
    if (!payroll) return res.status(404).json({ message: "Payroll not found" });
    res.status(200).json({ message: "Payroll deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get All Payrolls
const getAllPayrolls = async (req, res) => {
  try {
    const { companyName } = req.user; // Get the companyName from the authenticated admin

    // Fetch employees belonging to the admin's company
    const employees = await Employee.find({ companyName }, "empId");
    const empIds = employees.map(emp => emp.empId); // Extract only empIds

    // Fetch payrolls only for employees of the admin's company
    const payrolls = await Payroll.find({ empId: { $in: empIds } });

    res.status(200).json(payrolls);
  } catch (error) {
    console.error("Error fetching payrolls:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// Generate Payslip Function
const generatePayslip = async (req, res) => {
  try {
    const { empId } = req.params;

    // Fetch Employee
    const employee = await Employee.findOne({ empId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Restrict Access: Employees can only view their own payslip
    if (req.user.role === "employee" && req.user.empId !== empId) {
      return res.status(403).json({ message: "Access denied. You can only view your own payslip." });
    }

    // Fetch Payroll
    const payroll = await Payroll.findOne({ empId });
    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    // Create PDF Document
    const doc = new PDFDocument();
    const fileName = `Payslip_${empId}_${payroll.paymentDate}.pdf`;

    // Set response type to PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    doc.pipe(res);

    // Add content to PDF
    doc.fontSize(20).text("Payslip", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Employee ID: ${employee.empId}`);
    doc.text(`Name: ${employee.name}`);
    doc.text(`Company: ${employee.companyName}`);
    doc.text(`Base Salary: ${payroll.baseSalary}`);
    doc.text(`Deductions: ${JSON.stringify(payroll.deductions)}`);
    doc.text(`Bonuses: ${JSON.stringify(payroll.bonuses)}`);
    doc.text(`Net Salary: ${payroll.netSalary}`);
    doc.text(`Payment Date: ${payroll.paymentDate}`);

    // Finish the document
    doc.end();
  } catch (error) {
    console.error("Error generating payslip:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


module.exports = {
    createPayroll,
    getPayrollByEmployee,
    updatePayrollStatus,
    approvePayroll,
    updatePayroll,
    deletePayroll,
    generatePayslip,
    getAllPayrolls
  };
  