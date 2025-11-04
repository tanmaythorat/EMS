// const jwt = require('jsonwebtoken');

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
// };

// module.exports = generateToken;


const jwt = require('jsonwebtoken');

// Updated generateToken function
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role }, // Include role in the token payload
    process.env.JWT_SECRET,
    { expiresIn: '1h' } // Token expiry (adjust as needed)
  );
};

module.exports = generateToken;