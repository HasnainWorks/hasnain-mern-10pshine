import { useState } from "react";
import Field from "./Field";
import Section from "./Section";

const API = "http://localhost:5000/api";

export default function ChangePasswordForm({ token }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      setMsg({ type: "error", text: "Passwords do not match" });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`${API}/auth/me/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMsg({ type: "success", text: "Password changed successfully" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section title="Change Password" subtitle="Use a strong password you don't use elsewhere">
      <div className="space-y-3">
        <Field label="Current Password">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[#0e0e0e] border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#CAFF00]/40 transition-colors placeholder-white/20"
          />
        </Field>
        <Field label="New Password">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[#0e0e0e] border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#CAFF00]/40 transition-colors placeholder-white/20"
          />
        </Field>
        <Field label="Confirm New Password">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[#0e0e0e] border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#CAFF00]/40 transition-colors placeholder-white/20"
          />
        </Field>

        {msg && (
          <p className={`text-xs font-mono ${msg.type === "success" ? "text-[#CAFF00]" : "text-red-400"}`}>
            {msg.type === "success" ? "✓" : "✗"} {msg.text}
          </p>
        )}

        <div className="flex justify-end pt-1">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-[#CAFF00] text-black text-sm font-black rounded-xl hover:bg-[#d4f95e] disabled:opacity-40 transition-all"
          >
            {saving ? "Updating..." : "Update Password →"}
          </button>
        </div>
      </div>
    </Section>
  );
}