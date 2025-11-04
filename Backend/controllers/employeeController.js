// controllers/employeeController.js
const Employee = require("../models/Employee");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Counter = require("../models/Counter"); // Import the Counter model


// Function to generate the next sequential empId
const generateEmpId = async (companyName) => {
  const lastEmployee = await Employee.findOne({ companyName }).sort({ empId: -1 });

  const lastEmpId = lastEmployee ? parseInt(lastEmployee.empId, 10) : 1000;

  return (lastEmpId + 1).toString();
};



// Create Employee (Admin only)
// Create Employee (Admin only)

// const createEmployee = async (req, res) => {
//   try {
//     console.log("📌 Request received to create an employee", req.body);
//     console.log("🔍 Admin creating employee:", req.user); // Log the authenticated admin

//     // Ensure only an admin can create employees
//     if (!req.user || req.user.role !== "Admin") {
//       console.log("❌ Unauthorized: User is not an admin");
//       return res.status(403).json({ message: "Unauthorized: Only admins can create employees" });
//     }

//     // Find admin in the database (this should not be necessary because req.user is already available)
//     const admin = await Admin.findById(req.user._id);
//     if (!admin) {
//       console.log("❌ Admin not found in DB, ID:", req.user._id);
//       return res.status(404).json({ message: "Admin not found" });
//     }

//     console.log("✅ Admin Found:", admin);

//     // Generate unique empId using Counter model
//     const counter = await Counter.findOneAndUpdate(
//       { name: "empId" },
//       { $inc: { seq: 1 } }, // Increment empId by 1
//       { new: true, upsert: true } // Create counter if it doesn’t exist
//     );

//     // Assign admin's company ID to employee
//     const empId = counter.seq;
//     const newEmployee = new Employee({
//       empId,
//       name: req.body.name,
//       email: req.body.email,
//       password: req.body.password,
//       role: req.body.role,
//       department: req.body.department,
//       position: req.body.position,
//       contact_number: req.body.contact_number,
//       address: req.body.address,
//       companyName: admin.companyName, // ✅ Assign admin's company to the employee
//       created_by: admin._id, // ✅ Track which admin created the employee
//     });

//     await newEmployee.save();
//     res.status(201).json({ message: "Employee created successfully", employee: newEmployee });
//   } catch (error) {
//     console.error("❌ Error creating employee:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const createEmployee = async (req, res) => {
  try {
    console.log("📌 Request received to create an employee", { name: req.body.name, email: req.body.email });

    // Ensure only an admin can create employees
    if (!req.user || req.user.role !== "Admin") {
      console.log("❌ Unauthorized: User is not an admin");
      return res.status(403).json({ message: "Unauthorized: Only admins can create employees" });
    }

    // Use req.user directly (authentication middleware already validated)
    const admin = req.user;

    // Generate unique empId using Counter model
    const counter = await Counter.findOneAndUpdate(
      { name: "empId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true } // Create counter if it doesn’t exist
    );
    if (!counter || !counter.seq) {
      console.error("❌ Counter not initialized.");
      return res.status(500).json({ message: "Internal server error: Failed to generate empId." });
    }
    const empId = `${counter.seq}`;

    // Create employee
    const newEmployee = new Employee({
      empId,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      department: req.body.department,
      position: req.body.position,
      contact_number: req.body.contact_number,
      temporary_address: req.body.temporary_address,
      permanent_address: req.body.permanent_address,
      date_of_birth: req.body.date_of_birth,
      companyName: admin.companyName,
      created_by: admin._id,
    });

    await newEmployee.save();
    res.status(201).json({ message: "Employee created successfully", employee: newEmployee });
  } catch (error) {
    console.error("❌ Error creating employee:", error.message);
    if (error.code === 11000) {
      return res.status(409).json({ message: "Duplicate entry: Email or empId already exists." });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};


// Employee Login
const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find employee
    const employee = await Employee.findOne({ email });
    if (!employee || !employee.is_active) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      { 
        id: employee._id, 
        role: employee.role,
        companyName: employee.companyName // ✅ Ensure the correct company identifier
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    

    // 4. Return token (without password)
    const employeeData = employee.toObject();
    delete employeeData.password;
    
    res.json({ 
      token,
      employee: employeeData
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get All Employees (Admin/HR of the same company)


const getAllEmployees = async (req, res) => {
  try {
    console.log("📌 Fetching employees for Admin:", req.user);

    // Ensure only Admins & SuperAdmins can fetch employees
    if (!["Admin", "SuperAdmin"].includes(req.user.role)) {
      console.log("❌ Unauthorized access attempt:", req.user.role);
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Ensure req.user has a valid company identifier
    if (!req.user.companyName) {
      console.log("❌ Admin does not have a company assigned:", req.user);
      return res.status(400).json({ message: "Invalid admin data, missing company information" });
    }

    // Fetch employees that belong to the same company as the admin
    const employees = await Employee.find({
      companyName: req.user.companyName, // ✅ Match the correct field name
      is_active: true
    });

    console.log(`✅ Found ${employees.length} employees for company: ${req.user.companyName}`);
    res.status(200).json(employees);
  } catch (error) {
    console.error("❌ Error fetching employees:", error);
    res.status(500).json({ message: "Server error" });
  }
};




// Get Employee by empId
const getEmployeeByEmpId = async (req, res) => {
  try {
    const { empId } = req.params;

    // Fetch the requested employee's data
    const employee = await Employee.findOne({ empId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Allow SuperAdmins to access any employee
    if (req.user.role.toLowerCase() === "superadmin") {
      return res.json(employee);
    }

    // If the requester is an Employee, ensure they can only access their own data
    if (req.user.role.toLowerCase() === "employee" && req.user.empId !== employee.empId) {
      return res.status(403).json({ 
        message: "Unauthorized access - Employees can only view their own data"
      });
    }

    // If the requester is an Admin, ensure they can only access employees within their own company
    if (req.user.role.toLowerCase() === "admin") {
      if (req.user.companyName.toString() !== employee.companyName.toString()) {
        return res.status(403).json({ 
          message: "Unauthorized access - Admins can only view employees from their own company"
        });
      }
    }

    // Ensure all required fields are present in the response
    const responseData = {
      ...employee.toObject(),
      salary: employee.salary || 0,
      contact_number: employee.contact_number || '',
      address: employee.address || '',
      leaveBalance: employee.leaveBalance || {
        "Casual Leave": 0,
        "Sick Leave": 0,
        "Earned Leave": 0,
        "Unpaid Leave": "0"
      }
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const updateEmployeeByEmpId = async (req, res) => {
  try {
    const { empId } = req.params;
    const updates = req.body;
    const employee = await Employee.findOne({ empId });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Get the requester (Admin or Employee)
    let requester;
    if (req.user.role === "Admin") {
      requester = await Admin.findById(req.user.id);
    } else if (req.user.role === "Employee") {
      requester = await Employee.findById(req.user.id);
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    // Authorization checks
    const isAdminAuthorized =
      requester?.role === "Admin" && requester.companyName === employee.companyName;
    const isEmployeeUpdatingSelf = requester?.empId === employee.empId;

    if (!isAdminAuthorized && !isEmployeeUpdatingSelf) {
      return res.status(403).json({ message: "Unauthorized to update this employee" });
    }

    // Prevent updating restricted fields
    const restrictedFields = ["empId", "companyName", "created_by"];
    restrictedFields.forEach(field => delete updates[field]);

    // Apply updates
    Object.assign(employee, updates);
    await employee.save();

    res.json({ message: "Employee updated successfully", employee });
  } catch (error) {
    console.error("❌ Error updating employee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteEmployeeByEmpId = async (req, res) => {
  try {
    const { empId } = req.params;

    // Find the employee
    const employee = await Employee.findOne({ empId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    // Ensure the requester is an Admin
    const admin = await Admin.findById(req.user.id);
    if (!admin || admin.role !== "Admin") {
      return res.status(403).json({ message: "Unauthorized. Only admins can delete employees." });
    }

    // Ensure Admin and Employee belong to the same company
    if (admin.companyName !== employee.companyName) {
      return res.status(403).json({ message: "Unauthorized. Employee is not in your company." });
    }

    // Soft delete: Set `is_active = false` instead of removing
    employee.is_active = false;
    await employee.save();

    res.json({ message: "Employee deactivated successfully." });
  } catch (error) {
    console.error("❌ Error deleting employee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Get Total Employee Count for a Specific Admin/Company
const getEmployeeCount = async (req, res) => {
  try {
    console.log("📌 Fetching Employee Count for Admin:", req.user);

    // Ensure the user is an Admin
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Unauthorized: Only Admins can view employee count" });
    }

    // Ensure company_id exists
    if (!req.user.company_id) {
      return res.status(400).json({ message: "Company ID missing for Admin" });
    }

    // Count employees belonging to the logged-in admin’s company
    const employeeCount = await Employee.countDocuments({ company_id: req.user.company_id });

    console.log("✅ Total Employees:", employeeCount);
    res.status(200).json({ totalEmployees: employeeCount });
  } catch (error) {
    console.error("❌ Error fetching employee count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};






module.exports = {
  createEmployee,
  loginEmployee,
  getAllEmployees,
  getEmployeeByEmpId,
  updateEmployeeByEmpId,
  deleteEmployeeByEmpId,
  getEmployeeCount
};