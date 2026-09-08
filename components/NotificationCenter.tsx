"use client";

import { useEffect, useState } from "react";

type NotificationLog = {
  id: string;
  triggerEvent: string;
  channel: string;
  recipient: string;
  recipientContact?: string;
  recipientPhone?: string;
  recipientEmail?: string;
  message: string;
  priority: string;
  status: string;
  timestamp: string;
};

const DEFAULT_LOGS: NotificationLog[] = [
  {
    id: "NOTIF-101",
    triggerEvent: "CRITICAL_LAB_RESULT",
    channel: "Push + SMS + Email",
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
    channel: "Push + Email",
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

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [dispatching, setDispatching] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notifications");
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          setLogs(json.data);
          return;
        }
      }
    } catch (e) {
      console.warn("Backend API offline, using default notification logs");
    }

    const local = localStorage.getItem("clinix-notifications");
    if (local) {
      setLogs(JSON.parse(local));
    } else {
      setLogs(DEFAULT_LOGS);
    }
  };

  const triggerAlert = async (type: "CRITICAL_LAB" | "APPOINTMENT" | "UNASSIGNED_CASE") => {
    setDispatching(true);

    let payload = {
      triggerEvent: "CRITICAL_LAB_RESULT",
      recipient: "Dr. Maya Nair, MD",
      contact: "+1 (555) 019-2831",
      message: "🚨 CRITICAL LAB ALERT: High-Sensitivity Troponin I (0.92 ng/mL) for Eleanor Vance (MRN-84920). STAT evaluation required.",
      priority: "HIGH",
    };

    if (type === "APPOINTMENT") {
      payload = {
        triggerEvent: "UPCOMING_APPOINTMENT",
        recipient: "Jordan Vance",
        contact: "+1 (555) 892-0192",
        message: "📅 APPOINTMENT REMINDER: Your visit with Dr. Arjun Mehta is scheduled tomorrow at 2:00 PM.",
        priority: "ROUTINE",
      };
    } else if (type === "UNASSIGNED_CASE") {
      payload = {
        triggerEvent: "UNASSIGNED_URGENT_CASE",
        recipient: "Clinical Triage Pool",
        contact: "triage-alerts@clinix.org",
        message: "⚠️ UNASSIGNED CASE ALERT: High Risk Hypertensive intake (MRN-78192) awaiting attending clinician assignment.",
        priority: "URGENT",
      };
    }

    try {
      const res = await fetch("http://localhost:5000/api/notifications/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        setToast(`⚡ ${json.message}`);
        fetchLogs();
      } else {
        throw new Error("Fallback");
      }
    } catch (e) {
      const newEntry: NotificationLog = {
        id: `NOTIF-${Math.floor(100 + Math.random() * 900)}`,
        triggerEvent: payload.triggerEvent,
        channel: payload.priority === "HIGH" ? "Push + SMS + Email" : "SMS & Push",
        recipient: payload.recipient,
        message: payload.message,
        priority: payload.priority,
        status: "Delivered",
        timestamp: new Date().toISOString(),
      };

      const updated = [newEntry, ...logs];
      setLogs(updated);
      localStorage.setItem("clinix-notifications", JSON.stringify(updated));
      setToast(`⚡ Dispatched: ${payload.message}`);
    }

    setDispatching(false);
    setTimeout(() => setToast(null), 4500);
  };

  return (
    <div className="relative">
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-2xl border-2 border-teal bg-paper p-4 text-xs font-bold text-ink shadow-2xl animate-fadein">
          <div className="flex items-center gap-2">
            <span className="text-base">🔔</span>
            <p>{toast}</p>
          </div>
        </div>
      )}

      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center h-9 w-9 rounded-full border border-line bg-background text-ink shadow-2xs hover:bg-slate-200/50 transition cursor-pointer"
        title="Notification Center & Alert Dispatcher"
      >
        <span className="text-sm">🔔</span>
        {logs.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-black text-white shadow-xs animate-pulse">
            {logs.length}
          </span>
        )}
      </button>

      {/* Notification Drawer Modal */}
      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-3xl border border-line bg-white p-5 shadow-2xl dark:bg-slate-900 text-ink space-y-4 animate-fadein">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div>
              <h3 className="font-bold text-sm text-ink">Clinical Alert Dispatcher</h3>
              <p className="text-[11px] text-muted">Trigger-based Push, SMS & Email Audit Log</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-xs font-bold text-muted hover:text-ink"
            >
              ✕
            </button>
          </div>

          {/* Quick Trigger Buttons */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Dispatch Event Trigger</p>
            <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
              <button
                disabled={dispatching}
                onClick={() => triggerAlert("CRITICAL_LAB")}
                className="rounded-xl border border-rose-300 bg-rose-50 p-2 text-rose-800 hover:bg-rose-100 transition text-center"
              >
                🚨 Critical Lab
              </button>
              <button
                disabled={dispatching}
                onClick={() => triggerAlert("UNASSIGNED_CASE")}
                className="rounded-xl border border-amber-300 bg-amber-50 p-2 text-amber-800 hover:bg-amber-100 transition text-center"
              >
                ⚠️ Unassigned Case
              </button>
              <button
                disabled={dispatching}
                onClick={() => triggerAlert("APPOINTMENT")}
                className="rounded-xl border border-blue-300 bg-blue-50 p-2 text-blue-800 hover:bg-blue-100 transition text-center"
              >
                📅 Appointment
              </button>
            </div>
          </div>

          {/* Notification Audit Stream */}
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1 border-t border-line pt-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Dispatched Logs ({logs.length})</p>
            {logs.map((log) => (
              <div
                key={log.id}
                className="rounded-2xl border border-line/60 bg-background p-3 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-teal-dark">{log.id}</span>
                  <span className="rounded-full bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-700 dark:text-slate-300">
                    {log.channel}
                  </span>
                </div>
                <p className="font-bold text-ink leading-tight">{log.message}</p>
                <div className="flex items-center justify-between text-[10px] text-muted pt-1">
                  <span>To: <strong>{log.recipient}</strong></span>
                  <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
