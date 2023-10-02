const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  complaintTitle: {
    type: String,
    required: true,
  },
  complaintAgainst: {
    type: String,
    required: true,
  },
  complaintDetail: {
    type: String,
    required: true,
  },
});

const complaint = mongoose.model("Complaint", complaintSchema)

module.exports = complaint