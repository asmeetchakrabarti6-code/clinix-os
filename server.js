const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Clinix Backend API is running seamlessly",
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("<h1>ClinixOS Express & Mongoose API Server</h1><p>Access CPOE Smart Order endpoints at <code>/api/orders</code> and Users at <code>/api/users</code></p>");
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 [Server Running] Express listening on http://localhost:${PORT}`);
  console.log(`🔗 [API Route] Users CRUD available at http://localhost:${PORT}/api/users`);
  console.log(`🔗 [API Route] CPOE Orders available at http://localhost:${PORT}/api/orders`);
});
