// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Admin = require('../models/Admin');
const Employee = require('../models/Employee'); // Adjust path as needed






// const protect = asyncHandler(async (req, res, next) => {
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//     try {
//       token = req.headers.authorization.split(" ")[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       // Check for Admin or Employee
//       let user = await Admin.findById(decoded.id).select("-password");
//       if (!user) {
//         user = await Employee.findById(decoded.id).select("-password");
//       }

//       if (!user) {
//         res.status(401);
//         throw new Error("Not authorized, token failed");
//       }

//       req.user = user;
//       console.log("Authenticated User:", req.user); // Debugging
//       next();
//     } catch (error) {
//       console.error("Auth Error:", error);
//       res.status(401);
//       throw new Error("Not authorized, token invalid");
//     }
//   } else {
//     res.status(401);
//     throw new Error("Not authorized, no token");
//   }
// });

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      try {
          token = req.headers.authorization.split(" ")[1];
          console.log("📌 Extracted Token:", token); // ✅ Debugging

          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          console.log("📌 Decoded Token:", decoded); // Should log { id: '...', role: '...' }

          let user = await Admin.findById(decoded.id).select("-password");
          if (!user) {
              user = await Employee.findById(decoded.id).select("-password");
          }

          if (!user) {
              console.log("❌ No user found in DB with ID:", decoded.id); // ✅ Debugging
              return res.status(401).json({ message: "Not authorized, token failed" });
          }

          console.log("✅ User found in DB:", user); // ✅ Debugging
          req.user = user;
          next();
      } catch (error) {
          console.error("❌ Auth Error:", error);
          return res.status(401).json({ message: "Not authorized, token invalid" });
      }
  } else {
      console.log("❌ No token found in headers"); // ✅ Debugging
      return res.status(401).json({ message: "Not authorized, no token" });
  }
});




const protectEmp = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check if authorization header exists
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false, 
                message: 'Unauthorized: No token provided' 
            });
        }

        // Extract token
        const token = authHeader.split(' ')[1].trim();

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Invalid or expired token'
            });
        }

        // Fetch employee from DB
        const employee = await Employee.findById(decoded.id);
        if (!employee) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Employee not found'
            });
        }

        // Attach employee to request object
        req.user = employee;
        next();
    } catch (error) {
        console.error("Middleware Error:", error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};


// Superadmin Only Middleware
// Superadmin Only Middleware
const superadminOnly = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "SuperAdmin") {
    next();
  } else {
    res.status(403);
    throw new Error("Access denied. Superadmin only.");
  }
});


// Admin Only Middleware (Includes Superadmin)
const adminOnly = asyncHandler(async (req, res, next) => {
  if (req.user && ["admin", "superadmin"].includes(req.user.role.toLowerCase())) {
    next();
  } else {
    res.status(403);
    throw new Error("Access denied. Admins only.");
  }
});

// Verify Employee Middleware
const verifyEmployee = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "Employee") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Employees only." });
  }
});

// Verify Admin Middleware
const verifyAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && ["Admin", "SuperAdmin"].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && ["admin", "superadmin"].includes(req.user.role.toLowerCase())) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
});


// const verifyAdmin = asyncHandler(async (req, res, next) => {
//   console.log("User in verifyAdmin middleware:", req.user); // Debugging
//   if (req.user && ["Admin", "SuperAdmin"].includes(req.user.role)) {
//     next();
//   } else {
//     res.status(403).json({ message: "Access denied. Admins only." });
//   }
// });

// const isAdmin = asyncHandler(async (req, res, next) => {
//   console.log("Middleware - isAdmin: req.user:", req.user);
//     if (req.user && ["admin", "superadmin"].includes(req.user.role.toLowerCase())) {
//     next();
//   } else {
//     res.status(403).json({ message: "Access denied. Admins only." });
//   }
// });


module.exports = { protect, superadminOnly, adminOnly,protectEmp , verifyAdmin, verifyEmployee, isAdmin};
