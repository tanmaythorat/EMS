const mongoose = require("mongoose");

const NoticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  companyName: { type: String, required: true }, // To filter notices by company
  recipients: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Employee",
    required: true 
  }],
  is_active: { type: Boolean, default: true },
  start_date: { type: Date, default: Date.now },
  end_date: { type: Date },

}, { timestamps: true });

module.exports = mongoose.model("Notice", NoticeSchema);