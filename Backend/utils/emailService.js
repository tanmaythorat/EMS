const nodemailer = require('nodemailer');

// No fixed credentials - uses admin's email dynamically
const sendInvitation = async (adminEmail, adminPassword, employeeEmail, tempPassword) => {
  try {
    // Create transporter with logged-in admin's credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: adminEmail,
        pass: adminPassword // Use admin's email app password
      }
    });

    await transporter.sendMail({
      from: `"HR Team" <${adminEmail}>`,
      to: employeeEmail,
      subject: 'Your Account Credentials',
      text: `Email: ${employeeEmail}\nTemp Password: ${tempPassword}`,
    });
    
    console.log('Email sent from:', adminEmail);
  } catch (error) {
    console.error('Email failed:', error.message);
  }
};

module.exports = { sendInvitation };