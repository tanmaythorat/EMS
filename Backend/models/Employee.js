// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// // Updated Employee Schema
// const EmployeeSchema = new mongoose.Schema({
//   empId: { type: String, unique: true, required: true }, // Unique Employee ID for attendance
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ["hr", "employee"], default: "employee" },
//   companyName: { type: String, required: true },
//   created_by: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
//   department: { type: String },
//   position: { type: String },
//   joining_date: { type: Date, default: Date.now },
//   contact_number: { type: String },
//   address: { type: String },
//   is_active: { type: Boolean, default: true },
//   firstLogin: { type: Boolean, default: true } , // Track first login
//   leaveBalance: {
//     "Casual Leave": { type: Number, default: 5 }, 
//     "Sick Leave": { type: Number, default: 7 }, 
//     "Earned Leave": { type: Number, default: 10 },
//     "Unpaid Leave": { type: String, default: "Unlimited" },
//   },
// }, { timestamps: true });


// // Hash password before saving
// EmployeeSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// module.exports = mongoose.model("Employee", EmployeeSchema);



const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Updated Employee Schema
const EmployeeSchema = new mongoose.Schema({
  empId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["hr", "employee"], default: "employee" },
  companyName: { type: String, required: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  department: { type: String },
  position: { type: String },
  joining_date: { type: Date, default: Date.now },
  contact_number: {
    type: String,
    validate: {
      validator: function (value) {
        return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(value);
      },
      message: "Invalid phone number format.",
    },
  },
    // Updated address fields
  temporary_address: { type: String },
  permanent_address: { type: String },
  date_of_birth: {
    type: Date,
    validate: {
      validator: function (value) {
        const today = new Date();
        return value < today; // Date should be in the past
      },
      message: "Date of birth must be in the past.",
    },
  },  is_active: { type: Boolean, default: true },
  firstLogin: { type: Boolean, default: true },
  leaveBalance: {
    type: Map, // Allows for dynamic leave categories
    of: Number,
    default: {
      "Casual Leave": 5,
      "Sick Leave": 7,
      "Earned Leave": 10,
    },
  },
}, { timestamps: true });


// Hash password before saving
EmployeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Employee", EmployeeSchema);