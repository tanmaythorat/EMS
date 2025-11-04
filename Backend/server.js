require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const employeeRoutes = require('./routes/employeeRoutes');
const reportRoutes = require('./routes/reportRoutes');
const payrollRoutes = require("./routes/payrollRoutes");

const leaveRoutes = require('./routes/LeaveRoutes');
const attendance = require('./routes/attendanceRoutes');
const noticeRoutes = require('./routes/noticeRoutes');

dotenv.config();
const app = express();

app.use(express.json());
// app.use(cors());

// ✅ Improved CORS
app.use(cors({
  origin: process.env.CLIENT_URL?.split(",") || ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
}));


app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/attendance', attendance);
app.use('/api/reports',reportRoutes);
app.use('/api/payroll', payrollRoutes);
app.use("/api/notices", noticeRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })


// mongoose.connect("mongodb://localhost:27017/HR", { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
