import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String, required: true },
    category: { type: String, required: true },
    location: {
      lat: Number,
      lng: Number,
      address: String,
    },
    images: [String],
    status: {
      type: String,
      enum: ["pending", "assigned", "resolved"],
      default: "pending",
    },
    severityScore: { type: Number, default: 1 },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Issue", issueSchema);
