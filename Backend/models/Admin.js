
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const AdminSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ["SuperAdmin", "Admin"], default: "Admin" },
//   approved: { type: Boolean, default: false }, // Only SuperAdmin can approve Admins
//   companyName: { type: String, required: true, unique: true },
//   otpVerified: { type: Boolean, default: false }  // ✅ Add this field
// }, { timestamps: true });

// // Hash password before saving (but prevent double hashing)
// AdminSchema.pre("save", async function (next) {
//   console.log("Password before hashing:", this.password);

//   // Prevent double hashing: Check if password is already hashed
//   if (!this.isModified("password") || this.password.startsWith("$2a$")) {
//     return next();
//   }

//   this.password = await bcrypt.hash(this.password, 10);
  
//   console.log("Password after hashing:", this.password);
//   next();
// });


// module.exports = mongoose.model("Admin", AdminSchema);




const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["SuperAdmin", "Admin"], default: "Admin" },
  approved: { type: Boolean, default: false },
  companyName: { 
    type: String, 
    required: function() {
      return this.role === "Admin"; // Only required for Admin role
    },
    unique: true 
  },
  otpVerified: { type: Boolean, default: false }
}, { timestamps: true });

// Hash password before saving (but prevent double hashing)
AdminSchema.pre("save", async function (next) {
  console.log("Password before hashing:", this.password);

  // Prevent double hashing: Check if password is already hashed
  if (!this.isModified("password") || this.password.startsWith("$2a$")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  
  console.log("Password after hashing:", this.password);
  next();
});

module.exports = mongoose.model("Admin", AdminSchema);