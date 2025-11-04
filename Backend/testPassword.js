const bcrypt = require("bcryptjs");

async function hashNewPassword() {
  const newPassword = "password123"; // Use the actual password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  console.log("New Hashed Password:", hashedPassword);
}

hashNewPassword();
