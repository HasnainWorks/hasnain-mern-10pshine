import { useState } from "react";
import Field from "./Field";
import Section from "./Section";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function EditInfoForm({ profile, onUpdate }) {
  const { updateUser } = useAuth();
  const [name, setName] = useState(profile?.name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const { data } = await api.put("/auth/me", { name, email });
      updateUser({ id: data.id, name: data.name, email: data.email });
      setMsg({ type: "success", text: "Profile updated successfully" });
      onUpdate(data);
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section title="Personal Info" subtitle="Update your name and email">
      <div className="space-y-3">
        <Field label="Full Name">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
            className="w-full bg-[#0e0e0e] border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#CAFF00]/40 transition-colors disabled:opacity-50"
          />
        </Field>
        <Field label="Email Address">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={saving}
            className="w-full bg-[#0e0e0e] border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#CAFF00]/40 transition-colors disabled:opacity-50"
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
            {saving ? "Saving..." : "Save Changes →"}
          </button>
        </div>
      </div>
    </Section>
  );
}