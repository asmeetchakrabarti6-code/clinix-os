const Order = require("../models/Order");

// Helper to determine department routing
const routeDepartment = (orderType, items = []) => {
  if (orderType === "Prescription") return "Pharmacy";
  if (orderType === "Imaging") return "Radiology & Imaging";
  if (orderType === "Laboratory") {
    const isCardiac = items.some(
      (i) => i.name.toLowerCase().includes("troponin") || i.name.toLowerCase().includes("ecg")
    );
    return isCardiac ? "Cardiology Diagnostics" : "Central Laboratory & Pathology";
  }
  return "Central Laboratory & Pathology";
};

// @desc    Submit new CPOE Order (routes to department)
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const {
      patientName,
      mrn,
      doctorName,
      orderType,
      priority,
      items,
      clinicalNotes,
    } = req.body;

    if (!patientName || !mrn || !doctorName || !orderType || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required order fields (patientName, mrn, doctorName, orderType, items)",
      });
    }

    const targetDepartment = routeDepartment(orderType, items);
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrderData = {
      orderId,
      patientName,
      mrn,
      doctorName,
      orderType,
      targetDepartment,
      priority: priority || "Routine",
      status: "Routed to Department",
      items,
      clinicalNotes: clinicalNotes || "",
      routingTimestamp: new Date(),
    };

    // Attempt DB save if connected
    if (require("mongoose").connection.readyState === 1) {
      const newOrder = await Order.create(newOrderData);
      return res.status(201).json({
        success: true,
        message: `Order ${newOrder.orderId} digitally routed to ${targetDepartment}`,
        data: newOrder,
      });
    }

    // In-memory fallback response if database server is offline
    res.status(201).json({
      success: true,
      message: `Order ${orderId} digitally routed to ${targetDepartment} (Local Mode)`,
      data: newOrderData,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to submit order",
      error: error.message,
    });
  }
};

// @desc    Get all CPOE Orders (supports filter by department, type, status)
// @route   GET /api/orders
const getOrders = async (req, res) => {
  try {
    const { department, orderType, status, mrn } = req.query;
    const filter = {};

    if (department) filter.targetDepartment = department;
    if (orderType) filter.orderType = orderType;
    if (status) filter.status = status;
    if (mrn) filter.mrn = mrn;

    if (require("mongoose").connection.readyState === 1) {
      const orders = await Order.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: orders.length,
        data: orders,
      });
    }

    // Return empty list if DB offline so frontend uses local storage seamlessly
    res.status(200).json({
      success: true,
      count: 0,
      data: [],
      notice: "Database offline — using local state",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error fetching orders",
      error: error.message,
    });
  }
};

// @desc    Get single order by ID or orderId
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      $or: [{ _id: req.params.id }, { orderId: req.params.id }],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid Order ID",
      error: error.message,
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status || order.status;
    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to '${order.status}'`,
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
};
