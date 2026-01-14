import mongoose from "mongoose";

const TempLinkSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("TempLink", TempLinkSchema);
