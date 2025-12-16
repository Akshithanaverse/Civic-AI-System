import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["citizen", "admin", "crew"],
      default: "citizen",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
