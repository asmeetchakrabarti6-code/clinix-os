const express = require("express");
const router = express.Router();
const { dispatchNotification, getNotificationLogs } = require("../services/notificationService");

// GET /api/notifications - Get dispatch audit logs
router.get("/", (req, res) => {
  const logs = getNotificationLogs();
  res.status(200).json({
    success: true,
    count: logs.length,
    data: logs,
  });
});

// POST /api/notifications/dispatch - Trigger event notification
router.post("/dispatch", async (req, res) => {
  try {
    const { triggerEvent, recipient, contact, message, priority } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message content is required for notification dispatch",
      });
    }

    const logEntry = await dispatchNotification({
      triggerEvent,
      recipient,
      contact,
      message,
      priority,
    });

    res.status(201).json({
      success: true,
      message: `Trigger alert dispatched via ${logEntry.channel}`,
      data: logEntry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to dispatch notification",
      error: error.message,
    });
  }
});

module.exports = router;
