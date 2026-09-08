// Notification Dispatch Engine (Push, SMS, Email)

const notificationLogs = [
  {
    id: "NOTIF-101",
    triggerEvent: "CRITICAL_LAB_RESULT",
    channel: "SMS & Push",
    recipient: "Dr. Maya Nair, MD (Cardiology)",
    recipientPhone: "+1 (555) 234-5678",
    message: "🚨 CRITICAL LAB ALERT: High-Sensitivity Troponin I elevated (0.84 ng/mL) for Eleanor Vance (MRN-84920). Immediate review required.",
    priority: "HIGH",
    status: "Delivered",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: "NOTIF-102",
    triggerEvent: "UNASSIGNED_URGENT_CASE",
    channel: "Push & Email",
    recipient: "On-Duty Attending Pool",
    recipientEmail: "attending-triage@clinix.org",
    message: "⚠️ UNASSIGNED URGENT CASE: High BP Risk patient (BP 148/94 mmHg) registered without assigned attending physician.",
    priority: "URGENT",
    status: "Delivered",
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: "NOTIF-103",
    triggerEvent: "UPCOMING_APPOINTMENT",
    channel: "SMS",
    recipient: "Marcus Sterling",
    recipientPhone: "+1 (555) 890-1234",
    message: "📅 CLINIX REMINDER: Your appointment with Dr. Samuel Okoye is scheduled tomorrow at 10:30 AM. Reply C to confirm.",
    priority: "ROUTINE",
    status: "Delivered",
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
  },
];

const dispatchNotification = async ({ triggerEvent, recipient, contact, message, priority }) => {
  const notifId = `NOTIF-${Math.floor(100 + Math.random() * 900)}`;

  let channel = "Push Notification";
  if (priority === "HIGH" || priority === "STAT") {
    channel = "Push + SMS + Email";
  } else if (contact && contact.includes("@")) {
    channel = "Email";
  } else if (contact && (contact.includes("+") || contact.match(/\d/))) {
    channel = "SMS";
  }

  const logEntry = {
    id: notifId,
    triggerEvent: triggerEvent || "SYSTEM_ALERT",
    channel,
    recipient: recipient || "Clinician On-Duty",
    recipientContact: contact || "System Dispatch",
    message,
    priority: priority || "ROUTINE",
    status: "Delivered",
    timestamp: new Date().toISOString(),
  };

  notificationLogs.unshift(logEntry);

  console.log(`[NOTIFICATION DISPATCHED] [${channel}] Event: ${triggerEvent} -> ${recipient}: "${message}"`);
  return logEntry;
};

const getNotificationLogs = () => notificationLogs;

module.exports = {
  dispatchNotification,
  getNotificationLogs,
};
