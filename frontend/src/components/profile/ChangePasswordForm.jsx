import { useState } from "react";
import Field from "./Field";
import Section from "./Section";
import api from "../../services/api";

export default function ChangePasswordForm() {
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
      await api.put("/auth/me/password", { currentPassword, newPassword });
      setMsg({ type: "success", text: "Password changed successfully" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || err.message });
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
            disabled={saving}
            placeholder="••••••••"
            className="w-full bg-[#0e0e0e] border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#CAFF00]/40 transition-colors placeholder-white/20 disabled:opacity-50"
          />
        </Field>
        <Field label="New Password">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={saving}
            placeholder="••••••••"
            className="w-full bg-[#0e0e0e] border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#CAFF00]/40 transition-colors placeholder-white/20 disabled:opacity-50"
          />
        </Field>
        <Field label="Confirm New Password">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={saving}
            placeholder="••••••••"
            className="w-full bg-[#0e0e0e] border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#CAFF00]/40 transition-colors placeholder-white/20 disabled:opacity-50"
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