const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["Patient", "Doctor", "Clinician", "Admin"],
      default: "Patient",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    mrn: {
      type: String,
      trim: true,
      default: "",
    },
    age: {
      type: Number,
      min: 0,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Non-binary", "Other"],
      default: "Other",
    },
    address: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
