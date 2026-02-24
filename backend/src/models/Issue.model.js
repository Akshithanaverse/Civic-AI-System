import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    location: {
      lat: Number,
      lng: Number,
      address: String
    },
    images: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ["pending", "assigned", "in_progress", "resolved", "rejected"],
      default: "pending"
    },
    severityScore: {
      type: Number,
      default: 1
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    aiCategory: String,
    aiConfidence: Number,
    aiGeneratedDescription: String,
    aiSeverityScore: Number,
    is_miscategorized: Boolean,
  },
  { timestamps: true }
);

export default mongoose.model("Issue", issueSchema);
