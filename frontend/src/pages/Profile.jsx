import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStats from "../components/profile/ProfileStats";
import EditInfoForm from "../components/profile/EditInfoForm";
import ChangePasswordForm from "../components/profile/ChangePasswordForm";
import DangerZone from "../components/profile/DangerZone";

const API = "http://localhost:5000/api";

export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (updated) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
      <p className="text-white/20 text-sm animate-pulse">Loading profile...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white">

      {/* Top Nav */}
      <div className="border-b border-white/[0.06] px-8 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm"
        >
          ← Back to Dashboard
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-[#CAFF00] text-black w-6 h-6 rounded flex items-center justify-center font-black text-xs">
            →
          </div>
          <span className="font-black text-base tracking-tight">Noted.</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <ProfileHeader profile={profile} />
        <ProfileStats stats={profile?.stats} />
        <EditInfoForm profile={profile} token={token} onUpdate={handleUpdate} />
        <ChangePasswordForm token={token} />
        <DangerZone token={token} />
      </div>

      
    </div>
  );
}