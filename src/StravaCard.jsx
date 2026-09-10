import React, { useEffect, useState } from "react";
import { Check, RefreshCw } from "lucide-react";

export default function StravaCard({ onImport }) {
  const [status, setStatus] = useState({ loading: true, connected: false, athlete: null });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function loadStatus() {
    try {
      const response = await fetch("/api/strava", { credentials: "same-origin" });
      const data = await response.json();
      setStatus({ loading: false, connected: Boolean(data.connected), athlete: data.athlete || null });
    } catch {
      setStatus({ loading: false, connected: false, athlete: null });
    }
  }

  useEffect(() => {
    const result = new URLSearchParams(window.location.search).get("strava");
    if (result) {
      const messages = {
        connected: "Strava connected successfully. Tap Sync activities to import your workouts.",
        cancelled: "Strava connection was cancelled.",
        expired: "The Strava connection request expired. Please try again.",
        failed: "Strava could not be connected. Please try again.",
        configuration_error: "Strava setup is not complete yet.",
        signin_required: "Please sign in as a member before connecting Strava.",
      };
      setMessage(messages[result] || "");
      const clean = `${window.location.pathname}${window.location.hash || ""}`;
      window.history.replaceState({}, "", clean);
    }
    loadStatus();
  }, []);

  async function sync() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/strava", { method: "POST", credentials: "same-origin" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Sync failed");
      onImport(data.activities || []);
      setMessage(`${data.activities?.length || 0} Strava activities synced without duplicates.`);
    } catch (error) {
      setMessage(error.message || "Could not sync Strava activities.");
    } finally { setBusy(false); }
  }

  async function disconnect() {
    if (!window.confirm("Disconnect Strava from your New You account? Imported exercise entries will remain in your history.")) return;
    setBusy(true);
    try {
      await fetch("/api/strava", { method: "DELETE", credentials: "same-origin" });
      setStatus({ loading: false, connected: false, athlete: null });
      setMessage("Strava disconnected.");
    } finally { setBusy(false); }
  }

  const athleteName = [status.athlete?.firstname, status.athlete?.lastname].filter(Boolean).join(" ");
  return <div className="nyf-card" style={{ borderColor: "#FC4C02" }}>
    <div className="nyf-section-title" style={{ color: "#C63D00" }}><span style={{ fontWeight: 900 }}>STRAVA</span> Activity connection</div>
    {status.loading ? <p style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>Checking your connection…</p> : status.connected ? <>
      <div className="nyf-product-card" style={{ marginBottom: 10 }}><Check size={15} style={{ color: "var(--success)", verticalAlign: "middle", marginRight: 6 }} />Connected{athleteName ? ` as ${athleteName}` : ""}</div>
      <button className="nyf-btn full" onClick={sync} disabled={busy} style={{ background: "#FC4C02" }}><RefreshCw size={15} /> {busy ? "Syncing…" : "Sync Strava activities"}</button>
      <button className="nyf-btn ghost full" onClick={disconnect} disabled={busy} style={{ marginTop: 8 }}>Disconnect Strava</button>
    </> : <>
      <p style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>Import your authorised Strava workouts into your New You exercise history.</p>
      <button className="nyf-btn full" onClick={() => { window.location.href = "/api/strava-connect"; }} style={{ background: "#FC4C02" }}>Connect with Strava</button>
    </>}
    {message && <p role="status" style={{ fontSize: 11.5, color: "var(--ink-soft)", margin: "10px 0 0" }}>{message}</p>}
    <p style={{ fontSize: 10.5, color: "var(--ink-soft)", margin: "9px 0 0" }}>Only activities you authorise are imported. You can disconnect at any time.</p>
  </div>;
}

