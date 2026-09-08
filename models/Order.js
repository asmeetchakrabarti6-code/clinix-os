const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  details: { type: String, default: "" }, // e.g. "500mg BID x 10 days" or "Chest PA & Lat"
  category: { type: String, default: "General" },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    patientName: {
      type: String,
      required: [true, "Patient Name is required"],
    },
    mrn: {
      type: String,
      required: [true, "MRN is required"],
    },
    doctorName: {
      type: String,
      required: [true, "Doctor Name is required"],
    },
    orderType: {
      type: String,
      enum: ["Prescription", "Laboratory", "Imaging"],
      required: true,
    },
    targetDepartment: {
      type: String,
      required: true,
      enum: ["Pharmacy", "Central Laboratory & Pathology", "Radiology & Imaging", "Cardiology Diagnostics"],
    },
    priority: {
      type: String,
      enum: ["Routine", "Urgent", "STAT (Emergency)"],
      default: "Routine",
    },
    status: {
      type: String,
      enum: ["Submitted", "Routed to Department", "Processing", "Completed"],
      default: "Submitted",
    },
    items: [orderItemSchema],
    clinicalNotes: {
      type: String,
      default: "",
    },
    routingTimestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-determine target department before saving if not explicitly set
orderSchema.pre("validate", function (next) {
  if (!this.targetDepartment) {
    if (this.orderType === "Prescription") {
      this.targetDepartment = "Pharmacy";
    } else if (this.orderType === "Laboratory") {
      this.targetDepartment = "Central Laboratory & Pathology";
    } else if (this.orderType === "Imaging") {
      this.targetDepartment = "Radiology & Imaging";
    }
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
