const mongoose = require("mongoose");

const tempLinkSchema = new mongoose.Schema({
  uniqueId: { type: String, unique: true },
  valid: { type: Boolean, default: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60
  }
});

module.exports = mongoose.model("TempLink", tempLinkSchema);
