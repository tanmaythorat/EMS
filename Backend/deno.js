const Employee = require("../models/Employee");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Function to generate the next sequential empId
const generateEmpId = async () => {
  const lastEmployee = await Employee.findOne().sort({ empId: -1 });
  return lastEmployee ? lastEmployee.empId + 1 : 1001;
};

// Create Employee (Admin only)
const createEmployee = async (req, res) => {
  try {
    const { name, email, password, role, department, position, salary, contact_number, address } = req.body;
    
    const creator = await Admin.findById(req.user.id);
    if (!creator || creator.role !== "Admin") {
      return res.status(403).json({ message: "Only Admins can create employees." });
    }

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: "Employee already exists." });
    }

    const empId = await generateEmpId();

    const employee = new Employee({
      empId,
      name,
      email,
      password,
      role,
      company_id: creator.company_id,
      created_by: req.user.id,
      department,
      position,
      salary,
      contact_number,
      address
    });

    await employee.save();
    
    res.status(201).json({ 
      message: "Employee created successfully.",
      employee: {
        empId,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        department: employee.department,
        position: employee.position
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Employee by empId
const getEmployeeByEmpId = async (req, res) => {
  try {
    const { empId } = req.params;
    const employee = await Employee.findOne({ empId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const requester = await Admin.findById(req.user.id);
    if (!requester || requester.company_id.toString() !== employee.company_id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Employee by empId
const updateEmployeeByEmpId = async (req, res) => {
  try {
    const { empId } = req.params;
    const updates = req.body;
    const employee = await Employee.findOne({ empId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const requester = await Admin.findById(req.user.id);
    if (!requester || requester.company_id.toString() !== employee.company_id.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this employee" });
    }

    Object.assign(employee, updates);
    await employee.save();

    res.json({ message: "Employee updated successfully", employee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Employee by empId (Soft delete)
const deleteEmployeeByEmpId = async (req, res) => {
  try {
    const { empId } = req.params;
    const requester = await Admin.findById(req.user.id);
    if (!requester) {
      return res.status(403).json({ message: "Unauthorized." });
    }

    const employee = await Employee.findOne({ empId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    if (requester.company_id.toString() !== employee.company_id.toString()) {
      return res.status(403).json({ message: "Unauthorized. Employee is not in your company." });
    }

    employee.is_active = false;
    await employee.save();

    res.json({ message: "Employee deactivated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEmployee,
  getEmployeeByEmpId,
  updateEmployeeByEmpId,
  deleteEmployeeByEmpId
};
