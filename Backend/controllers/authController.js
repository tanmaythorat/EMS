// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const Admin = require("../models/Admin");
// const OTPService = require("../services/otpService"); // Ensure OTPService is correctly imported
// const { sendOTPEmail } = require("../services/otpService"); 
// const OTPModel = require("../models/otpModel"); 

// // Admin Signup (Registration)
// const registerAdmin = async (req, res) => {
//   try {
//     const { name, email, password, role, company_id } = req.body;

//     // Check if admin already exists
//     const existingAdmin = await Admin.findOne({ email });
//     if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new admin
//     const newAdmin = new Admin({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       company_id,
//       approved: false, // Default: Needs approval
//     });

//     await newAdmin.save();
//     res.status(201).json({ message: "Admin registered successfully, pending approval." });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Admin Login
// const loginAdmin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const admin = await Admin.findOne({ email });
//     if (!admin) return res.status(404).json({ message: "Admin not found" });
//     if (!admin.approved) return res.status(403).json({ message: "Admin not approved by SuperAdmin" });

//     // Check password
//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     // Generate Token
//     const token = jwt.sign(
//       { id: admin._id, role: admin.role, company_id: admin.company_id },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({ token, admin });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// const requestPasswordReset = async (req, res) => {
//   try {
//       console.log("📥 Forgot Password Request:", req.body);

//       const { email } = req.body;
//       if (!email) {
//           console.log("❌ Email is missing");
//           return res.status(400).json({ message: "Email is required" });
//       }

//       const otp = Math.floor(100000 + Math.random() * 900000);
//       console.log("🔢 Generated OTP:", otp);

//       try {
//           await OTPModel.create({ email, otp, createdAt: new Date() });
//           console.log("✅ OTP saved in DB");
//       } catch (dbError) {
//           console.error("❌ Error saving OTP to DB:", dbError);
//           return res.status(500).json({ message: "Database error" });
//       }

//       await sendOTPEmail(email, otp); // ✅ Fix: Use sendOTPEmail
//       console.log("📧 Email sent successfully");

//       res.status(200).json({ message: "OTP sent successfully" });
//   } catch (error) {
//       console.error("❌ Error in requestPasswordReset:", error);
//       res.status(500).json({ message: "Internal server error" });
//   }
// };




// const verifyOTPForReset = async (req, res) => {
//   try {
//       const { email, otp } = req.body;

//       const admin = await Admin.findOne({ email });
//       if (!admin) return res.status(404).json({ message: "Admin not found" });

//       const isValid = await OTPService.verifyOTP(email, otp);
//       if (!isValid) return res.status(400).json({ message: "Invalid OTP" });

//       // ✅ Ensure OTP verification status is saved in the database
//       await Admin.findOneAndUpdate(
//           { email }, 
//           { otpVerified: true }, 
//           { new: true } 
//       );

//       res.json({ message: "OTP verified successfully, proceed to reset password" });
//   } catch (error) {
//       console.error("Error in verifyOTPForReset:", error);
//       res.status(500).json({ message: "Internal server error" });
//   }
// };


// // Reset Password After OTP Verification
// const resetPasswordAfterOTP = async (req, res) => {
//   try {
//       const { email, newPassword } = req.body;

//       const admin = await Admin.findOne({ email });
//       if (!admin) return res.status(404).json({ message: "Admin not found" });

//       // ✅ Check if OTP was verified in the database
//       if (!admin.otpVerified) {
//           return res.status(400).json({ message: "OTP verification required before resetting password" });
//       }

//       // Hash new password and update
//       const hashedPassword = await bcrypt.hash(newPassword, 10);

//       // ✅ Reset password and clear OTP verification flag in one update
//       await Admin.findOneAndUpdate(
//           { email },
//           { password: hashedPassword, otpVerified: false }
//       );

//       res.json({ message: "Password reset successfully" });
//   } catch (error) {
//       console.error("❌ Error in resetPasswordAfterOTP:", error);
//       res.status(500).json({ message: "Internal server error" });
//   }
// };





// module.exports = { registerAdmin, 
//   loginAdmin,
//   requestPasswordReset,
//   verifyOTPForReset,
//   resetPasswordAfterOTP,
//   };



const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const OTPService = require("../services/otpService");
const { sendOTPEmail } = require("../services/otpService");
const OTPModel = require("../models/otpModel");

// Admin Signup (Registration)
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role, companyName } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

    // Check if company already exists
    const existingCompany = await Admin.findOne({ companyName });
    if (existingCompany) return res.status(400).json({ message: "Company name already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      role,
      companyName, // ✅ Changed from company_id
      approved: false, // Default: Needs approval
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully, pending approval." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    if (!admin.approved) return res.status(403).json({ message: "Admin not approved by SuperAdmin" });

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate Token
    const token = jwt.sign(
      { id: admin._id, role: admin.role, companyName: admin.companyName }, // ✅ Changed from company_id
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Request Password Reset
const requestPasswordReset = async (req, res) => {
  try {
    console.log("📥 Forgot Password Request:", req.body);

    const { email } = req.body;
    if (!email) {
      console.log("❌ Email is missing");
      return res.status(400).json({ message: "Email is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("🔢 Generated OTP:", otp);

    try {
      await OTPModel.create({ email, otp, createdAt: new Date() });
      console.log("✅ OTP saved in DB");
    } catch (dbError) {
      console.error("❌ Error saving OTP to DB:", dbError);
      return res.status(500).json({ message: "Database error" });
    }

    await sendOTPEmail(email, otp); // ✅ Fix: Use sendOTPEmail
    console.log("📧 Email sent successfully");

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ Error in requestPasswordReset:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Verify OTP for Reset
const verifyOTPForReset = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isValid = await OTPService.verifyOTP(email, otp);
    if (!isValid) return res.status(400).json({ message: "Invalid OTP" });

    // ✅ Ensure OTP verification status is saved in the database
    await Admin.findOneAndUpdate(
      { email }, 
      { otpVerified: true }, 
      { new: true } 
    );

    res.json({ message: "OTP verified successfully, proceed to reset password" });
  } catch (error) {
    console.error("Error in verifyOTPForReset:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Reset Password After OTP Verification
const resetPasswordAfterOTP = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // ✅ Check if OTP was verified in the database
    if (!admin.otpVerified) {
      return res.status(400).json({ message: "OTP verification required before resetting password" });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // ✅ Reset password and clear OTP verification flag in one update
    await Admin.findOneAndUpdate(
      { email },
      { password: hashedPassword, otpVerified: false }
    );

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("❌ Error in resetPasswordAfterOTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { 
  registerAdmin, 
  loginAdmin,
  requestPasswordReset,
  verifyOTPForReset,
  resetPasswordAfterOTP,
};
