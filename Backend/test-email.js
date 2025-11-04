require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // Use 587 if 465 does not work
  secure: true, // Use false if using port 587
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const mailOptions = {
  from: process.env.EMAIL,
  to: "your-test-email@gmail.com", // Change this to your actual email
  subject: "Test Email",
  text: "This is a test email from Nodemailer!",
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("❌ Email send error:", error);
  } else {
    console.log("✅ Email sent successfully:", info.response);
  }
});
