const mongoose = require("mongoose");

const supervisorSchema = new mongoose.Schema({
  adminEmail: {
    type: String,
    default: "",
  },
  supervisorEmail: {
    type: String,
    default: "",
  },
  supervisorPassword: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    default: "",
  },
});

const Supervisor = mongoose.model("Supervisor", supervisorSchema);

module.exports = Supervisor;
