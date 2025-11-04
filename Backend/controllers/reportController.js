const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");
const { Parser } = require('json2csv');
const moment = require('moment');

// Get Attendance Summary for Dashboard
exports.getAttendanceSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const matchQuery = {};
    if (startDate && endDate) {
      matchQuery.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const summary = await Attendance.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$employee",
          totalDays: { $sum: 1 },
          presentDays: { 
            $sum: { 
              $cond: [{ $in: ["$status", ["present", "late"]] }, 1, 0] 
            } 
          },
          lateDays: { 
            $sum: { 
              $cond: [{ $eq: ["$status", "late"] }, 1, 0] 
            } 
          },
          absentDays: { 
            $sum: { 
              $cond: [{ $eq: ["$status", "absent"] }, 1, 0] 
            } 
          },
          averageWorkingHours: { $avg: "$workingHours" },
          totalOvertime: { $sum: "$overtimeMinutes" }
        }
      },
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "_id",
          as: "employee"
        }
      },
      { $unwind: "$employee" },
      {
        $project: {
          "employee.name": 1,
          "employee.email": 1,
          "employee.department": 1,
          totalDays: 1,
          presentDays: 1,
          lateDays: 1,
          absentDays: 1,
          attendancePercentage: { 
            $multiply: [
              { $divide: ["$presentDays", "$totalDays"] },
              100
            ]
          },
          averageWorkingHours: { $round: ["$averageWorkingHours", 2] },
          totalOvertime: 1
        }
      }
    ]);
    
    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export Attendance to CSV
exports.exportToCSV = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const matchQuery = {};
    if (startDate && endDate) {
      matchQuery.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const attendanceData = await Attendance.find(matchQuery)
      .populate('employee', 'name email department')
      .lean();
    
    if (attendanceData.length === 0) {
      return res.status(404).json({ message: "No attendance data found" });
    }
    
    // Format data for CSV
    const formattedData = attendanceData.map(record => ({
      date: moment(record.date).format('YYYY-MM-DD'),
      employeeName: record.employee.name,
      employeeEmail: record.employee.email,
      department: record.employee.department,
      clockIn: record.clockIn ? moment(record.clockIn).format('HH:mm:ss') : 'N/A',
      clockOut: record.clockOut ? moment(record.clockOut).format('HH:mm:ss') : 'N/A',
      totalBreaks: record.breaks.length,
      totalBreakDuration: record.totalBreakDuration,
      workingHours: record.workingHours ? record.workingHours.toFixed(2) : 'N/A',
      status: record.status,
      lateMinutes: record.lateMinutes || 0,
      earlyDepartureMinutes: record.earlyDepartureMinutes || 0,
      overtimeMinutes: record.overtimeMinutes || 0
    }));
    
    const fields = [
      { label: 'Date', value: 'date' },
      { label: 'Employee Name', value: 'employeeName' },
      { label: 'Employee Email', value: 'employeeEmail' },
      { label: 'Department', value: 'department' },
      { label: 'Clock In', value: 'clockIn' },
      { label: 'Clock Out', value: 'clockOut' },
      { label: 'Total Breaks', value: 'totalBreaks' },
      { label: 'Total Break Duration (mins)', value: 'totalBreakDuration' },
      { label: 'Working Hours', value: 'workingHours' },
      { label: 'Status', value: 'status' },
      { label: 'Late Minutes', value: 'lateMinutes' },
      { label: 'Early Departure Minutes', value: 'earlyDepartureMinutes' },
      { label: 'Overtime Minutes', value: 'overtimeMinutes' }
    ];
    
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(formattedData);
    
    res.header('Content-Type', 'text/csv');
    res.attachment('attendance_report.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Employee Attendance History
exports.getEmployeeAttendanceHistory = async (req, res) => {
  try {
    const { email, startDate, endDate } = req.query;
    
    // Find employee by email
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    
    const matchQuery = { employee: employee._id };
    if (startDate && endDate) {
      matchQuery.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const attendanceHistory = await Attendance.find(matchQuery)
      .sort({ date: -1 });
    
    res.status(200).json(attendanceHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};