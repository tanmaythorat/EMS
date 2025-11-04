const Admin = require("../models/Admin"); 
const mongoose = require("mongoose");
const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

// Helper function to get today's date at midnight
const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};





const formatAttendanceResponse = async (attendance) => {
  if (!attendance) {
    return {
      error: "No attendance record found",
      employee: {
        name: "Unknown",
        empId: "N/A",
        email: "N/A"
      }
    };
  }

  try {
    const employee = await Employee.findOne({ email: attendance.email });
    return {
      ...attendance.toObject(),
      employee: {
        name: employee?.name || "Unknown",
        empId: employee?.empId || "N/A",
        email: attendance.email
      },
      totalBreakDuration: attendance.totalBreakDuration || 0,
      workingHours: attendance.workingHours || 0
    };
  } catch (error) {
    console.error("Error formatting attendance response:", error);
    return {
      ...attendance.toObject(),
      employee: {
        name: "Unknown",
        empId: "N/A",
        email: attendance.email || "N/A"
      },
      totalBreakDuration: 0,
      workingHours: 0
    };
  }
};


// Clock In



// Helper function to get start of day in UTC
const getStartOfDayUTC = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
};

// In your clockIn function:
const clockIn = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const todayStart = getStartOfDayUTC();
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    // Check for existing attendance using proper date range
    const existing = await Attendance.findOne({
      email,
      date: { $gte: todayStart, $lt: todayEnd }
    });

    if (existing) {
      const response = await formatAttendanceResponse(existing);
      return res.status(200).json({
        message: "Already clocked in today",
        clockInTime: existing.clockIn,
        attendance: response
      });
    }

    // Create new attendance with proper UTC date
    const newAttendance = await Attendance.create({
      email,
      empId: employee.empId,
      clockIn: new Date(),
      date: todayStart, // Use UTC date
      status: "present"
    });

    const response = await formatAttendanceResponse(newAttendance);
    return res.status(201).json({
      message: "Clock in successful",
      attendance: response
    });

  } catch (error) {
    console.error("Clock-in error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// Enhanced Clock Out Function
 
const clockOut = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Get start and end of current day in UTC
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setUTCDate(todayEnd.getUTCDate() + 1);

    // Find today's attendance record
    const attendance = await Attendance.findOne({
      email,
      date: { $gte: todayStart, $lt: todayEnd }
    });

    if (!attendance) {
      return res.status(400).json({ 
        message: "Please clock in first before clocking out",
        solution: "Make sure you've clocked in today"
      });
    }

    // Check if already clocked out
    if (attendance.clockOut) {
      const response = await formatAttendanceResponse(attendance);
      return res.status(400).json({
        message: "You have already clocked out today",
        clockOutTime: attendance.clockOut,
        attendance: response
      });
    }

    // Calculate work duration
    const clockOutTime = new Date();
    const workDurationMs = clockOutTime - attendance.clockIn;
    const workDurationHours = workDurationMs / (1000 * 60 * 60);

    // Update status if worked less than 4 hours
    const status = workDurationHours < 4 ? "half-day" : attendance.status;

    // Perform the update
    const updatedAttendance = await Attendance.findOneAndUpdate(
      { _id: attendance._id },
      { 
        $set: { 
          clockOut: clockOutTime,
          status: status,
          updatedAt: new Date()
        } 
      },
      { new: true, runValidators: true }
    );

    const response = await formatAttendanceResponse(updatedAttendance);
    res.status(200).json({
      message: "Clock out successful",
      clockOutTime: updatedAttendance.clockOut,
      workDuration: `${workDurationHours.toFixed(2)} hours`,
      attendance: response
    });

  } catch (error) {
    console.error("Clock-out error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};



// Break In (Optional)
const breakIn = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Get start and end of current day in UTC
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setUTCDate(todayEnd.getUTCDate() + 1);

    // Find today's attendance record
    const attendance = await Attendance.findOne({
      email,
      date: { $gte: todayStart, $lt: todayEnd }
    });

    if (!attendance) {
      return res.status(400).json({ 
        message: "Please clock in first before taking a break",
        solution: "Make sure you've successfully clocked in today"
      });
    }

    // Check if already on break (has break without breakOut)
    const activeBreak = attendance.breaks.find(b => !b.breakOut);
    if (activeBreak) {
      return res.status(400).json({ 
        message: "You already have an active break",
        breakStartedAt: activeBreak.breakIn
      });
    }

    // Add new break entry
    const newBreak = {
      breakIn: new Date(),
      breakOut: null,
      duration: 0
    };
    
    attendance.breaks.push(newBreak);
    await attendance.save();

    const response = await formatAttendanceResponse(attendance);
    res.status(200).json({
      message: "Break started successfully",
      breakStartedAt: newBreak.breakIn,
      attendance: response
    });

  } catch (error) {
    console.error("Break-in error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
// Break Out (Optional)
const breakOut = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Get start and end of current day in UTC
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setUTCDate(todayEnd.getUTCDate() + 1);

    // Find today's attendance record
    const attendance = await Attendance.findOne({
      email,
      date: { $gte: todayStart, $lt: todayEnd }
    });

    if (!attendance) {
      return res.status(400).json({ 
        message: "No active attendance record found",
        solution: "Please ensure you've clocked in today before taking breaks"
      });
    }

    // Find the most recent break that hasn't been ended
    const activeBreak = attendance.breaks.reduce((latest, current) => {
      if (!current.breakOut) {
        if (!latest || current.breakIn > latest.breakIn) {
          return current;
        }
      }
      return latest;
    }, null);

    if (!activeBreak) {
      return res.status(400).json({ 
        message: "No active break to end",
        solution: "You need to start a break before ending one",
        availableBreaks: attendance.breaks.length
      });
    }

    // Calculate break duration
    const breakOutTime = new Date();
    activeBreak.breakOut = breakOutTime;
    activeBreak.duration = Math.round(
      (breakOutTime - activeBreak.breakIn) / (1000 * 60) // in minutes
    );

    // Update total break duration
    attendance.totalBreakDuration = attendance.breaks.reduce(
      (total, brk) => total + (brk.duration || 0), 
      0
    );

    await attendance.save();

    const response = await formatAttendanceResponse(attendance);
    res.status(200).json({
      message: "Break ended successfully",
      breakDuration: `${activeBreak.duration} minutes`,
      totalBreakDuration: `${attendance.totalBreakDuration} minutes`,
      attendance: response
    });

  } catch (error) {
    console.error("Break-out error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


// 1. Get Today's Attendance (for all employees)
const getTodayAllAttendance = async (req, res) => {
  try {
    const todayStart = getStartOfDayUTC();
    const todayEnd = new Date(todayStart);
    todayEnd.setUTCDate(todayEnd.getUTCDate() + 1);

    const attendances = await Attendance.find({
      date: { $gte: todayStart, $lt: todayEnd }
    });

    const formattedAttendances = await Promise.all(
      attendances.map(att => formatAttendanceResponse(att))
    );

    res.status(200).json({
      message: "Today's attendance records",
      count: formattedAttendances.length,
      attendances: formattedAttendances
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get Today's Attendance by Email
const getTodayAttendanceByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const todayStart = getStartOfDayUTC();
    const todayEnd = new Date(todayStart);
    todayEnd.setUTCDate(todayEnd.getUTCDate() + 1);

    const attendance = await Attendance.findOne({
      email,
      date: { $gte: todayStart, $lt: todayEnd }
    });

    if (!attendance) {
      return res.status(404).json({ 
        message: "No attendance record found for today",
        hasClockedIn: false
      });
    }

    const response = await formatAttendanceResponse(attendance);
    res.status(200).json({
      message: "Today's attendance record found",
      hasClockedIn: true,
      attendance: response
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Get All Attendance Records
const getAllAttendances = async (req, res) => {
  try {
    const attendances = await Attendance.find().sort({ date: -1 });

    const formattedAttendances = await Promise.all(
      attendances.map(att => formatAttendanceResponse(att))
    );

    res.status(200).json({
      message: "All attendance records",
      count: formattedAttendances.length,
      attendances: formattedAttendances
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Get All Attendance by Email
const getAllAttendanceByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const attendances = await Attendance.find({ email }).sort({ date: -1 });

    if (!attendances.length) {
      return res.status(404).json({ message: "No attendance records found" });
    }

    const formattedAttendances = await Promise.all(
      attendances.map(att => formatAttendanceResponse(att))
    );

    res.status(200).json({
      message: "All attendance records for employee",
      count: formattedAttendances.length,
      attendances: formattedAttendances
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Get Last Week's Attendance
const getLastWeekAttendance = async (req, res) => {
  try {
    const weekStart = new Date();
    weekStart.setUTCDate(weekStart.getUTCDate() - 7);
    weekStart.setUTCHours(0, 0, 0, 0);

    const attendances = await Attendance.find({
      date: { $gte: weekStart }
    }).sort({ date: -1 });

    const formattedAttendances = await Promise.all(
      attendances.map(att => formatAttendanceResponse(att))
    );

    res.status(200).json({
      message: "Last week's attendance records",
      count: formattedAttendances.length,
      attendances: formattedAttendances
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Get Last Week's Attendance by Email
const getLastWeekAttendanceByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const weekStart = new Date();
    weekStart.setUTCDate(weekStart.getUTCDate() - 7);
    weekStart.setUTCHours(0, 0, 0, 0);

    const attendances = await Attendance.find({
      email,
      date: { $gte: weekStart }
    }).sort({ date: -1 });

    if (!attendances.length) {
      return res.status(404).json({ message: "No attendance records found for last week" });
    }

    const formattedAttendances = await Promise.all(
      attendances.map(att => formatAttendanceResponse(att))
    );

    res.status(200).json({
      message: "Last week's attendance records",
      count: formattedAttendances.length,
      attendances: formattedAttendances
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 7. Get Last Month's Attendance
const getLastMonthAttendance = async (req, res) => {
  try {
    const monthStart = new Date();
    monthStart.setUTCMonth(monthStart.getUTCMonth() - 1);
    monthStart.setUTCHours(0, 0, 0, 0);

    const attendances = await Attendance.find({
      date: { $gte: monthStart }
    }).sort({ date: -1 });

    const formattedAttendances = await Promise.all(
      attendances.map(att => formatAttendanceResponse(att))
    );

    res.status(200).json({
      message: "Last month's attendance records",
      count: formattedAttendances.length,
      attendances: formattedAttendances
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 8. Get Last Month's Attendance by Email
const getLastMonthAttendanceByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const monthStart = new Date();
    monthStart.setUTCMonth(monthStart.getUTCMonth() - 1);
    monthStart.setUTCHours(0, 0, 0, 0);

    const attendances = await Attendance.find({
      email,
      date: { $gte: monthStart }
    }).sort({ date: -1 });

    if (!attendances.length) {
      return res.status(404).json({ message: "No attendance records found for last month" });
    }

    const formattedAttendances = await Promise.all(
      attendances.map(att => formatAttendanceResponse(att))
    );

    res.status(200).json({
      message: "Last month's attendance records",
      count: formattedAttendances.length,
      attendances: formattedAttendances
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 9. Get Last Year's Attendance
const getLastYearAttendance = async (req, res) => {
  try {
    const yearStart = new Date();
    yearStart.setUTCFullYear(yearStart.getUTCFullYear() - 1);
    yearStart.setUTCHours(0, 0, 0, 0);

    const attendances = await Attendance.find({
      date: { $gte: yearStart }
    }).sort({ date: -1 });

    const formattedAttendances = await Promise.all(
      attendances.map(att => formatAttendanceResponse(att))
    );

    res.status(200).json({
      message: "Last year's attendance records",
      count: formattedAttendances.length,
      attendances: formattedAttendances
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 10. Get Last Year's Attendance by Email
const getLastYearAttendanceByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const yearStart = new Date();
    yearStart.setUTCFullYear(yearStart.getUTCFullYear() - 1);
    yearStart.setUTCHours(0, 0, 0, 0);

    const attendances = await Attendance.find({
      email,
      date: { $gte: yearStart }
    }).sort({ date: -1 });

    if (!attendances.length) {
      return res.status(404).json({ message: "No attendance records found for last year" });
    }

    const formattedAttendances = await Promise.all(
      attendances.map(att => formatAttendanceResponse(att))
    );

    res.status(200).json({
      message: "Last year's attendance records",
      count: formattedAttendances.length,
      attendances: formattedAttendances
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 11. Get Custom Date Range Attendance
const getCustomAttendance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        message: "Both startDate and endDate are required",
        example: "?startDate=2023-01-01&endDate=2023-01-31"
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);

    const attendances = await Attendance.find({
      date: { $gte: start, $lte: end }
    }).sort({ date: -1 });

    const formattedAttendances = await Promise.all(
      attendances.map(att => formatAttendanceResponse(att))
    );

    res.status(200).json({
      message: `Attendance records from ${startDate} to ${endDate}`,
      count: formattedAttendances.length,
      attendances: formattedAttendances
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 12. Get Custom Date Range Attendance by Email
const getCustomAttendanceByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        message: "Both startDate and endDate are required",
        example: "?startDate=2023-01-01&endDate=2023-01-31"
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);

    const attendances = await Attendance.find({
      email,
      date: { $gte: start, $lte: end }
    }).sort({ date: -1 });

    if (!attendances.length) {
      return res.status(404).json({ 
        message: `No attendance records found for ${email} from ${startDate} to ${endDate}`
      });
    }

    const formattedAttendances = await Promise.all(
      attendances.map(att => formatAttendanceResponse(att))
    );

    res.status(200).json({
      message: `Attendance records for ${email} from ${startDate} to ${endDate}`,
      count: formattedAttendances.length,
      attendances: formattedAttendances
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  clockIn,
  clockOut,
  breakIn,
  breakOut,
  getTodayAllAttendance,
  getTodayAttendanceByEmail,
  getAllAttendances,
  getAllAttendanceByEmail,
  getLastWeekAttendance,
  getLastWeekAttendanceByEmail,
  getLastMonthAttendance,
  getLastMonthAttendanceByEmail,
  getLastYearAttendance,
  getLastYearAttendanceByEmail,
  getCustomAttendance,
  getCustomAttendanceByEmail
};








// const Attendance = require("../models/Attendance");
// const Employee = require("../models/Employee");

// // Helper function to check if date is today
// const isToday = (date) => {
//   const today = new Date();
//   return (
//     date.getDate() === today.getDate() &&
//     date.getMonth() === today.getMonth() &&
//     date.getFullYear() === today.getFullYear()
//   );
// };


// // Clock In
// // const clockIn = async (req, res) => {
// //   try {
// //     const { email } = req.body;

// //     // Fetch employee details using email
// //     const employee = await Employee.findOne({ email });
// //     if (!employee) {
// //       return res.status(404).json({ message: "Employee not found" });
// //     }

// //     // Use employee's empId for attendance
// //     const empId = employee.empId;

// //     const today = new Date();
// //     today.setHours(0, 0, 0, 0);

// //     const existingAttendance = await Attendance.findOne({
// //       empId,
// //       date: { $gte: today },
// //     });

// //     if (existingAttendance) {
// //       return res.status(400).json({ message: "Already clocked in today" });
// //     }

// //     const attendance = new Attendance({
// //       empId,
// //       clockIn: new Date(),
// //       status: "present",
// //     });

// //     await attendance.save();

// //     res.status(201).json({
// //       message: "Clock in successful",
// //       attendance,
// //     });
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // };

// const clockIn = async (req, res) => {
//   try {
//     const { email, customDate } = req.body; // Add `customDate` for flexible date handling

//     // Fetch employee details using email
//     const employee = await Employee.findOne({ email });
//     if (!employee) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     const empId = employee.empId;

//     // Handle custom date or default to today
//     const date = customDate ? new Date(customDate) : new Date();
//     date.setHours(0, 0, 0, 0); // Normalize the date to midnight

//     // Check if attendance already exists for the same empId and date
//     const existingAttendance = await Attendance.findOne({ empId, date });
//     if (existingAttendance) {
//       return res.status(400).json({ message: "Attendance already exists for this date" });
//     }

//     // Create new attendance record
//     const attendance = new Attendance({
//       empId,
//       date, // Use the normalized date
//       clockIn: new Date(),
//       status: "present",
//     });

//     await attendance.save();

//     res.status(201).json({
//       message: `Clock in successful for ${date.toDateString()}`,
//       attendance,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };




// // Clock Out
// const clockOut = async (req, res) => {
//   try {
//     const { email, customDate } = req.body; // Add `customDate` to handle flexible dates

//     // Fetch employee details using email
//     const employee = await Employee.findOne({ email });
//     if (!employee) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     const empId = employee.empId;

//     // Handle custom date or default to today
//     const date = customDate ? new Date(customDate) : new Date();
//     date.setHours(0, 0, 0, 0); // Normalize the date to midnight for consistency

//     // Find attendance record for the given empId and date
//     const attendance = await Attendance.findOne({
//       empId,
//       date,
//     });

//     if (!attendance) {
//       return res.status(400).json({ message: "Attendance record not found for this date" });
//     }

//     if (attendance.clockOut) {
//       return res.status(400).json({ message: "Already clocked out for this date" });
//     }

//     // Update clockOut time
//     attendance.clockOut = new Date(); // Current timestamp for clock-out
//     await attendance.save();

//     res.status(200).json({
//       message: `Clock-out successful for ${date.toDateString()}`,
//       attendance,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Break In
// const breakIn = async (req, res) => {
//   try {
//     const { email } = req.body;

//     // Fetch employee details using email
//     const employee = await Employee.findOne({ email });
//     if (!employee) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     // Use employee's empId for attendance
//     const empId = employee.empId;

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     // Find attendance using empId
//     const attendance = await Attendance.findOne({
//       empId,
//       date: { $gte: today },
//     });

//     if (!attendance) {
//       return res.status(400).json({ message: "Please clock in first" });
//     }

//     // Check if already has a completed break today
//     if (attendance.breaks.length > 0) {
//       const hasCompletedBreak = attendance.breaks.some((b) => b.breakOut !== null);
//       if (hasCompletedBreak) {
//         return res.status(400).json({ message: "Only one break allowed per day" });
//       }

//       // Check if already on break (has break without breakOut)
//       const hasActiveBreak = attendance.breaks.some((b) => b.breakOut === null);
//       if (hasActiveBreak) {
//         return res.status(400).json({ message: "Already on break" });
//       }
//     }

//     // Add break entry
//     attendance.breaks.push({
//       breakIn: new Date(),
//       breakOut: null,
//       duration: 0,
//     });

//     await attendance.save();

//     res.status(200).json({
//       message: "Break started",
//       attendance,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Break Out
// const breakOut = async (req, res) => {
//   try {
//     const { email } = req.body;

//     // Fetch employee details using email
//     const employee = await Employee.findOne({ email });
//     if (!employee) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     // Use employee's empId for attendance
//     const empId = employee.empId;

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     // Find attendance using empId
//     const attendance = await Attendance.findOne({
//       empId,
//       date: { $gte: today },
//     });

//     if (!attendance) {
//       return res.status(400).json({ message: "No active attendance record found" });
//     }

//     // Find the active break
//     const activeBreak = attendance.breaks.find((b) => b.breakOut === null);
//     if (!activeBreak) {
//       return res.status(400).json({ message: "No active break found" });
//     }

//     // Set breakOut time and calculate duration
//     activeBreak.breakOut = new Date();
//     activeBreak.duration = Math.round(
//       (activeBreak.breakOut - activeBreak.breakIn) / (1000 * 60)
//     );

//     // Generate warning if break duration exceeds 60 minutes
//     let warning = null;
//     if (activeBreak.duration > 60) {
//       warning = {
//         message: `Warning: Your break exceeded 60 minutes (${activeBreak.duration} minutes)`,
//         type: "warning",
//         duration: activeBreak.duration,
//       };
//     }

//     await attendance.save();

//     const response = {
//       message: "Break ended",
//       attendance,
//       warning,
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get Today's Attendance for emplpoyee
// // const getTodayAttendanceForEmployee = async (req, res) => {
// //   try {
// //     const { email } = req.user; // Assuming logged-in employee's email is in req.user

// //     const employee = await Employee.findOne({ email });
// //     if (!employee) {
// //       return res.status(404).json({ message: "Employee not found" });
// //     }

// //     const empId = employee.empId;
// //     const today = new Date();
// //     today.setHours(0, 0, 0, 0); // Normalize to midnight

// //     const attendance = await Attendance.findOne({
// //       empId,
// //       date: today, // Exact match for today's attendance
// //     });

// //     if (!attendance) {
// //       return res.status(404).json({ message: "No attendance record found for today" });
// //     }

// //     res.status(200).json(attendance);
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // };
// const getTodayAttendanceForEmployee = async (req, res) => {
//   try {
//     const { email } = req.user; // Get email from authenticated user

//     const employee = await Employee.findOne({ email });
//     if (!employee) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     const empId = employee.empId;

//     // Get today's date in LOCAL timezone and convert it to UTC
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const todayUTC = today.toISOString().split("T")[0]; // Get YYYY-MM-DD in UTC format

//     // Get start and end of the day in UTC
//     const startOfDay = new Date(`${todayUTC}T00:00:00.000Z`);
//     const endOfDay = new Date(`${todayUTC}T23:59:59.999Z`);

//     const attendance = await Attendance.findOne({
//       empId,
//       date: { $gte: startOfDay, $lte: endOfDay }, // Query for today's records
//     });

//     if (!attendance) {
//       return res.status(404).json({ message: "No attendance record found for today" });
//     } 

//     res.status(200).json(attendance);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };





// // Get Today's Attendance for emplpoyee
// const getTodayAttendanceForAdmin = async (req, res) => {
//   try {
//     const { companyName } = req.user; // Assuming logged-in admin's company

//     const employees = await Employee.find({ companyName }).select("empId name");
//     const empIds = employees.map(emp => emp.empId);

//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Normalize to midnight

//     const attendances = await Attendance.find({
//       empId: { $in: empIds },
//       date: today,
//     });

//     const attendanceMap = attendances.map(attendance => ({
//       empId: attendance.empId,
//       name: employees.find(emp => emp.empId === attendance.empId)?.name || "Unknown",
//       date: attendance.date,
//       clockIn: attendance.clockIn,
//       clockOut: attendance.clockOut,
//       status: attendance.status,
//     }));

//     res.status(200).json({
//       message: "Today's attendance fetched successfully",
//       data: attendanceMap,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get  All Attendance For Employee
// const getAllAttendanceForEmployee = async (req, res) => {
//   try {
//     const { email } = req.user;

//     const employee = await Employee.findOne({ email });
//     if (!employee) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     const empId = employee.empId;
//     const attendances = await Attendance.find({ empId }).sort({ date: -1 });

//     if (!attendances.length) {
//       return res.status(404).json({ message: "No attendance records found" });
//     }

//     res.status(200).json(attendances);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// // get all Attendace For Admins
// const getAllAttendanceForAdmin = async (req, res) => {
//   try {
//     const { companyName } = req.user;

//     const employees = await Employee.find({ companyName }).select("empId name");
//     const empIds = employees.map(emp => emp.empId);

//     const attendances = await Attendance.find({ empId: { $in: empIds } }).sort({ date: -1 });

//     const attendanceMap = attendances.map(attendance => ({
//       empId: attendance.empId,
//       name: employees.find(emp => emp.empId === attendance.empId)?.name || "Unknown",
//       date: attendance.date,
//       clockIn: attendance.clockIn,
//       clockOut: attendance.clockOut,
//       status: attendance.status,
//     }));

//     res.status(200).json(attendanceMap);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// //get last week attendance for employee
// const getLastWeekAttendanceForEmployee = async (req, res) => {
//   try {
//     const { email } = req.user; // Logged-in employee's email

//     const employee = await Employee.findOne({ email });
//     if (!employee) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     const empId = employee.empId;

//     const oneWeekAgo = new Date();
//     oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Start of last week

//     const attendances = await Attendance.find({
//       empId,
//       date: { $gte: oneWeekAgo, $lte: new Date() },
//     }).sort({ date: -1 });

//     if (!attendances.length) {
//       return res.status(404).json({ message: "No attendance records found for the last week" });
//     }

//     res.status(200).json(attendances);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// //get last week attendance for Admin
// const getLastWeekAttendanceForAdmin = async (req, res) => {
//   try {
//     const { companyName } = req.user; // Admin's company name

//     const employees = await Employee.find({ companyName }).select("empId name");
//     const empIds = employees.map((emp) => emp.empId);

//     const oneWeekAgo = new Date();
//     oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Start of last week

//     const attendances = await Attendance.find({
//       empId: { $in: empIds },
//       date: { $gte: oneWeekAgo, $lte: new Date() },
//     }).sort({ date: -1 });

//     const attendanceMap = attendances.map((attendance) => ({
//       empId: attendance.empId,
//       name: employees.find((emp) => emp.empId === attendance.empId)?.name || "Unknown",
//       date: attendance.date,
//       clockIn: attendance.clockIn,
//       clockOut: attendance.clockOut,
//       status: attendance.status,
//     }));

//     if (!attendanceMap.length) {
//       return res.status(404).json({ message: "No attendance records found for the last week" });
//     }

//     res.status(200).json(attendanceMap);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// //get last Month attendance for Employee
// const getLastMonthAttendanceForEmployee = async (req, res) => {
//   try {
//     const { email } = req.user; // Logged-in employee's email

//     const employee = await Employee.findOne({ email });
//     if (!employee) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     const empId = employee.empId;

//     const oneMonthAgo = new Date();
//     oneMonthAgo.setDate(1); // Start of last month
//     oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1); // Move back one month
//     const lastMonthEnd = new Date();
//     lastMonthEnd.setDate(0); // End of last month

//     const attendances = await Attendance.find({
//       empId,
//       date: { $gte: oneMonthAgo, $lte: lastMonthEnd },
//     }).sort({ date: -1 });

//     if (!attendances.length) {
//       return res.status(404).json({ message: "No attendance records found for last month" });
//     }

//     res.status(200).json(attendances);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// //get Last Month Attendace For Admin
// const getLastMonthAttendanceForAdmin = async (req, res) => {
//   try {
//     const { companyName } = req.user; // Admin's company name

//     const employees = await Employee.find({ companyName }).select("empId name");
//     const empIds = employees.map((emp) => emp.empId);

//     const oneMonthAgo = new Date();
//     oneMonthAgo.setDate(1); // Start of last month
//     oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1); // Move back one month
//     const lastMonthEnd = new Date();
//     lastMonthEnd.setDate(0); // End of last month

//     const attendances = await Attendance.find({
//       empId: { $in: empIds },
//       date: { $gte: oneMonthAgo, $lte: lastMonthEnd },
//     }).sort({ date: -1 });

//     const attendanceMap = attendances.map((attendance) => ({
//       empId: attendance.empId,
//       name: employees.find((emp) => emp.empId === attendance.empId)?.name || "Unknown",
//       date: attendance.date,
//       clockIn: attendance.clockIn,
//       clockOut: attendance.clockOut,
//       status: attendance.status,
//     }));

//     if (!attendanceMap.length) {
//       return res.status(404).json({ message: "No attendance records found for last month" });
//     }

//     res.status(200).json(attendanceMap);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// //get last Year attendance for Employee
// const getLastYearAttendanceForEmployee = async (req, res) => {
//   try {
//     const { email } = req.user; // Logged-in employee's email

//     const employee = await Employee.findOne({ email });
//     if (!employee) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     const empId = employee.empId;

//     const oneYearAgo = new Date();
//     oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1); // Start of last year
//     oneYearAgo.setMonth(0, 1); // January 1st of last year
//     const lastYearEnd = new Date();
//     lastYearEnd.setFullYear(lastYearEnd.getFullYear() - 1);
//     lastYearEnd.setMonth(11, 31); // December 31st of last year

//     const attendances = await Attendance.find({
//       empId,
//       date: { $gte: oneYearAgo, $lte: lastYearEnd },
//     }).sort({ date: -1 });

//     if (!attendances.length) {
//       return res.status(404).json({ message: "No attendance records found for last year" });
//     }

//     res.status(200).json(attendances);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// //get last year Attendance for Admin
// const getLastYearAttendanceForAdmin = async (req, res) => {
//   try {
//     const { companyName } = req.user; // Admin's company name

//     const employees = await Employee.find({ companyName }).select("empId name");
//     const empIds = employees.map((emp) => emp.empId);

//     const oneYearAgo = new Date();
//     oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1); // Start of last year
//     oneYearAgo.setMonth(0, 1); // January 1st of last year
//     const lastYearEnd = new Date();
//     lastYearEnd.setFullYear(lastYearEnd.getFullYear() - 1);
//     lastYearEnd.setMonth(11, 31); // December 31st of last year

//     const attendances = await Attendance.find({
//       empId: { $in: empIds },
//       date: { $gte: oneYearAgo, $lte: lastYearEnd },
//     }).sort({ date: -1 });

//     const attendanceMap = attendances.map((attendance) => ({
//       empId: attendance.empId,
//       name: employees.find((emp) => emp.empId === attendance.empId)?.name || "Unknown",
//       date: attendance.date,
//       clockIn: attendance.clockIn,
//       clockOut: attendance.clockOut,
//       status: attendance.status,
//     }));

//     if (!attendanceMap.length) {
//       return res.status(404).json({ message: "No attendance records found for last year" });
//     }

//     res.status(200).json(attendanceMap);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // get Custom range attendance for emplopyee
// const getCustomRangeAttendanceForEmployee = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.body; // Custom range dates
//     const { email } = req.user; // Logged-in employee's email

//     // Verify the employee exists
//     const employee = await Employee.findOne({ email });
//     if (!employee) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     const empId = employee.empId;

//     // Fetch attendance records for the custom range
//     const attendances = await Attendance.find({
//       empId,
//       date: { $gte: new Date(startDate), $lte: new Date(endDate) }, // Match date range
//     }).sort({ date: -1 });

//     if (!attendances || attendances.length === 0) {
//       return res.status(404).json({ message: "No attendance records found for the given range" });
//     }

//     res.status(200).json({
//       message: "Attendance records fetched successfully",
//       attendances,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // get custom range attendace for Admin
// const getCustomRangeAttendanceForAdmin = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.body; // Custom range dates
//     const { companyName } = req.user; // Admin's company name

//     // Fetch all employees under the admin's company
//     const employees = await Employee.find({ companyName }).select("empId name");
//     if (!employees || employees.length === 0) {
//       return res.status(404).json({ message: "No employees found in your company" });
//     }

//     const empIds = employees.map((emp) => emp.empId);

//     // Fetch attendance records for the custom range
//     const attendances = await Attendance.find({
//       empId: { $in: empIds },
//       date: { $gte: new Date(startDate), $lte: new Date(endDate) }, // Match date range
//     }).sort({ date: -1 });

//     if (!attendances || attendances.length === 0) {
//       return res.status(404).json({ message: "No attendance records found for the given range" });
//     }

//     // Map attendance records with employee names
//     const attendanceMap = attendances.map((attendance) => ({
//       empId: attendance.empId,
//       name: employees.find((emp) => emp.empId === attendance.empId)?.name || "Unknown",
//       date: attendance.date,
//       clockIn: attendance.clockIn,
//       clockOut: attendance.clockOut,
//       status: attendance.status,
//     }));

//     res.status(200).json({
//       message: "Attendance records fetched successfully",
//       attendanceMap,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // get attendace OverView For Employee
// const getLastMonthOverviewForEmployee = async (req, res) => {
//   try {
//     const { email } = req.user; // Logged-in employee's email

//     // Verify the employee exists
//     const employee = await Employee.findOne({ email });
//     if (!employee) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     const empId = employee.empId;

//     // Calculate the date range for the last month
//     const now = new Date();
//     const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1); // First day of last month
//     const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0); // Last day of last month

//     // Aggregate attendance data for the employee
//     const overview = await Attendance.aggregate([
//       {
//         $match: {
//           empId,
//           date: { $gte: startOfLastMonth, $lte: endOfLastMonth },
//         },
//       },
//       {
//         $group: {
//           _id: "$status", // Group by attendance status
//           count: { $sum: 1 }, // Count occurrences of each status
//         },
//       },
//     ]);

//     if (!overview.length) {
//       return res.status(404).json({ message: "No attendance data found for last month" });
//     }

//     res.status(200).json({
//       message: "Attendance overview for last month fetched successfully",
//       overview,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // get attendace OverView For Admin
// const getLastMonthOverviewForAdmin = async (req, res) => {
//   try {
//     const { companyName } = req.user; // Admin's company name

//     // Fetch all employees under the admin's company
//     const employees = await Employee.find({ companyName }).select("empId name");
//     if (!employees || employees.length === 0) {
//       return res.status(404).json({ message: "No employees found in your company" });
//     }

//     const empIds = employees.map((emp) => emp.empId);

//     // Calculate the date range for the last month
//     const now = new Date();
//     const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1); // First day of last month
//     const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0); // Last day of last month

//     // Aggregate attendance data for all employees in the company
//     const overview = await Attendance.aggregate([
//       {
//         $match: {
//           empId: { $in: empIds },
//           date: { $gte: startOfLastMonth, $lte: endOfLastMonth },
//         },
//       },
//       {
//         $group: {
//           _id: "$status", // Group by attendance status
//           count: { $sum: 1 }, // Count occurrences of each status
//         },
//       },
//     ]);

//     if (!overview.length) {
//       return res.status(404).json({ message: "No attendance data found for last month" });
//     }

//     res.status(200).json({
//       message: "Attendance overview for last month fetched successfully",
//       overview,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// //get employee by email for admin
// const getEmployeeAttendanceByEmail = async (req, res) => {
//   try {
//     const { email } = req.params; // Employee's email provided in the URL
//     const { companyName } = req.user; // Admin's company name

//     // Verify that the employee belongs to the admin's company
//     const employee = await Employee.findOne({ email, companyName });
//     if (!employee) {
//       return res.status(404).json({ message: "Employee not found or does not belong to your company" });
//     }

//     const empId = employee.empId;

//     // Fetch the employee's attendance history
//     const attendances = await Attendance.find({ empId }).sort({ date: -1 });

//     if (!attendances.length) {
//       return res.status(404).json({ message: "No attendance records found for this employee" });
//     }

//     res.status(200).json({
//       message: `Attendance history for ${employee.name} fetched successfully`,
//       attendances,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// module.exports = {
//   clockIn,
//   clockOut,
//   breakIn,
//   breakOut,
//   getTodayAttendanceForEmployee,
//   getTodayAttendanceForAdmin,
//   getAllAttendanceForEmployee,
//   getAllAttendanceForAdmin,
//   getLastWeekAttendanceForEmployee,
//   getLastWeekAttendanceForAdmin,
//   getLastMonthAttendanceForEmployee,
//   getLastMonthAttendanceForAdmin,
//   getLastYearAttendanceForEmployee,
//   getLastYearAttendanceForAdmin,
//   getCustomRangeAttendanceForEmployee,
//   getCustomRangeAttendanceForAdmin,
//   getLastMonthOverviewForEmployee,
//   getLastMonthOverviewForAdmin,
//   getEmployeeAttendanceByEmail

// };





