const crypto = require("crypto");
const nodemailer = require("nodemailer");
const OTPModel = require("../models/otpModel"); 

// Generate OTP and Save to Database
const generateOTP = async (email) => {
  const otp = crypto.randomInt(100000, 999999).toString();

  // Save OTP to MongoDB
  await OTPModel.create({ email, otp });

  return otp;
};

// Verify OTP from Database
const verifyOTP = async (email, otp) => {
  const otpRecord = await OTPModel.findOne({ email, otp });

  if (otpRecord) {
    await OTPModel.deleteOne({ email, otp }); // Delete OTP after verification
    return true;
  }
  return false;
};

// Send OTP via Email
const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL, // Use environment variables
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { generateOTP, verifyOTP, sendOTPEmail };
