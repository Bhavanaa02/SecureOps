import mongoose from "mongoose";

const ScanSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    target: { type: String, required: true },
    score: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Scan || mongoose.model("Scan", ScanSchema);