const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true
  },
  empId: {
    type: String,
    index: true, // Regular index (not unique)
    default: null // Explicitly allow null
  },
  date: {
    type: Date,
    required: true,
    default: function() {
      // Use UTC date without time component
      const now = new Date();
      return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    }
  },
  clockIn: {
    type: Date,
    required: true
  },
  clockOut: {
    type: Date,
    default: null
  },
  breaks: [{
    breakIn: {
      type: Date,
      required: true
    },
    breakOut: {
      type: Date,
      default: null
    },
    duration: {
      type: Number, // in minutes
      default: 0
    }
  }],
  status: {
    type: String,
    enum: ['present', 'half-day'],
    default: 'present'
  }
}, {
  timestamps: true,

  index: [
    { email: 1, date: -1 }, // For email-specific date queries
    { date: -1 } // For general date queries
  ]

});

// Create only the necessary compound index
AttendanceSchema.index({ email: 1, date: 1 }, { unique: true });

// Calculate break duration when breakOut is set
AttendanceSchema.methods.calculateBreakDuration = function(breakIndex) {
  if (this.breaks[breakIndex].breakOut) {
    const breakIn = this.breaks[breakIndex].breakIn;
    const breakOut = this.breaks[breakIndex].breakOut;
    this.breaks[breakIndex].duration = Math.round((breakOut - breakIn) / (1000 * 60));
  }
  return this.breaks[breakIndex].duration;
};

// Calculate total break duration
AttendanceSchema.methods.calculateTotalBreakDuration = function() {
  return this.breaks.reduce((total, brk) => total + (brk.duration || 0), 0);
};

// Calculate working hours
AttendanceSchema.methods.calculateWorkingHours = function() {
  if (!this.clockOut) return 0;
  
  const totalMs = this.clockOut - this.clockIn;
  const totalMinutes = Math.round(totalMs / (1000 * 60));
  const workingMinutes = totalMinutes - this.totalBreakDuration;
  
  return (workingMinutes / 60).toFixed(2); // Return hours with 2 decimal places
};

// Pre-save hook to auto-calculate durations
AttendanceSchema.pre('save', function(next) {
  // Calculate durations for all breaks
  this.breaks.forEach((_, index) => {
    if (this.breaks[index].breakOut) {
      this.calculateBreakDuration(index);
    }
  });
  
  // Update status if less than 4 working hours (half-day)
  if (this.clockOut && this.workingHours < 4) {
    this.status = 'half-day';
  }
  
  next();
});

// Virtual for total break duration
AttendanceSchema.virtual('totalBreakDuration').get(function() {
  return this.calculateTotalBreakDuration();
});

// Virtual for working hours
AttendanceSchema.virtual('workingHours').get(function() {
  return this.calculateWorkingHours();
});

// Virtual for current status (clocked in/out)
AttendanceSchema.virtual('currentStatus').get(function() {
  if (!this.clockIn) return 'not-started';
  if (this.clockIn && !this.clockOut) return 'clocked-in';
  return 'clocked-out';
});

module.exports = mongoose.model('Attendance', AttendanceSchema);




// const mongoose = require('mongoose');

// const AttendanceSchema = new mongoose.Schema({
//   empId: { type: String, required: true }, // Employee ID
//   date: { type: Date, required: true, default: Date.now }, // Date of attendance
//   clockIn: { type: Date, required: true }, // Clock-in time
//   clockOut: { type: Date }, // Clock-out time
//   breaks: [{ 
//     breakIn: Date, 
//     breakOut: Date, 
//     duration: Number // Break duration in minutes
//   }],
//   status: { 
//     type: String, 
//     enum: ["present", "half-day"], 
//     default: "present" 
//   }
// }, { timestamps: true });

// // Ensure empId and date are unique for each attendance record
// AttendanceSchema.index({ empId: 1, date: 1 }, { unique: true });

// // Method to calculate break duration
// AttendanceSchema.methods.calculateBreakDuration = function(breakIndex) {
//   if (this.breaks[breakIndex].breakOut) {
//     const breakIn = this.breaks[breakIndex].breakIn;
//     const breakOut = this.breaks[breakIndex].breakOut;
//     this.breaks[breakIndex].duration = Math.round((breakOut - breakIn) / (1000 * 60));
//   }
// };

// // Pre-save hook to calculate break durations
// AttendanceSchema.pre('save', function(next) {
//   this.breaks.forEach((brk, index) => {
//     if (brk.breakOut && !brk.duration) {
//       this.calculateBreakDuration(index);
//     }
//   });
//   next();
// });

// // Virtual for total break duration
// AttendanceSchema.virtual('totalBreakDuration').get(function() {
//   return this.breaks.reduce((total, brk) => total + (brk.duration || 0), 0);
// });

// // Virtual for working hours
// AttendanceSchema.virtual('workingHours').get(function() {
//   if (this.clockOut) {
//     const diffMs = this.clockOut - this.clockIn;
//     const diffMins = Math.round(diffMs / (1000 * 60));
//     return (diffMins - this.totalBreakDuration) / 60;
//   }
//   return 0;
// });

// module.exports = mongoose.model('Attendance', AttendanceSchema);