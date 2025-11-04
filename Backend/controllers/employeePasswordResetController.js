const Employee = require('../models/Employee');
const OTP = require('../models/otpModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP via Email
const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
};

// Request OTP for Password Reset
const requestEmployeePasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const employee = await Employee.findOne({ email });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        const otp = generateOTP();
        await OTP.create({ email, otp });
        await sendOTPEmail(email, otp);

        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP', error });
    }
};

// Verify OTP
const verifyEmployeeOTPForReset = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpRecord = await OTP.findOne({ email, otp });

        if (!otpRecord) return res.status(400).json({ message: 'Invalid or expired OTP' });

        // OTP is valid, delete from DB
        await OTP.deleteOne({ email, otp });
        res.status(200).json({ message: 'OTP verified' });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying OTP', error });
    }
};

// Reset Password after OTP Verification
const resetEmployeePasswordAfterOTP = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await Employee.updateOne({ email }, { password: hashedPassword });
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating password', error });
    }
};

module.exports = {
    requestEmployeePasswordReset,
    verifyEmployeeOTPForReset,
    resetEmployeePasswordAfterOTP,
};
