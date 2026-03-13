import { useState } from "react";
import toast from "react-hot-toast";
import { authService } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/common/Button";

function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const profile = await authService.updateProfile(form);
      updateUser(profile);
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
      <h1 className="text-3xl font-semibold text-white">Profile settings</h1>
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        {[
          { name: "name", placeholder: "Name" },
          { name: "phone", placeholder: "Phone number" },
        ].map((field) => (
          <input
            key={field.name}
            className="w-full rounded-[20px] border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400/50"
            onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))}
            placeholder={field.placeholder}
            value={form[field.name]}
          />
        ))}
        <textarea
          className="min-h-32 w-full rounded-[24px] border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400/50"
          onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
          placeholder="Short bio"
          value={form.bio}
        />
        <Button disabled={saving} type="submit">
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </div>
  );
}

export default SettingsPage;
