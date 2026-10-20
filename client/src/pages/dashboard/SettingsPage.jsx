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
    inAppMatches: user?.notificationPreferences?.inAppMatches !== false,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const profile = await authService.updateProfile({\n        name: form.name,\n        phone: form.phone,\n        bio: form.bio,\n        notificationPreferences: { inAppMatches: form.inAppMatches },\n      });
      updateUser(profile);
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-[32px] border border-stone-200 bg-white p-6">
      <h1 className="text-3xl font-semibold text-stone-900">Profile settings</h1>
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        {[
          { name: "name", placeholder: "Name" },
          { name: "phone", placeholder: "Phone number" },
        ].map((field) => (
          <input
            key={field.name}
            className="w-full rounded-[20px] border border-stone-200 bg-white px-4 py-3 text-stone-900 outline-none focus:border-cyan-400/50"
            onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))}
            placeholder={field.placeholder}
            value={form[field.name]}
          />
        ))}
        <textarea
          className="min-h-32 w-full rounded-[24px] border border-stone-200 bg-white px-4 py-3 text-stone-900 outline-none focus:border-cyan-400/50"
          onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
          placeholder="Short bio"
          value={form.bio}
        />
        <label className="flex items-start gap-3 rounded-2xl border border-stone-200 p-4 text-sm text-stone-700">
          <input
            checked={form.inAppMatches}
            className="mt-1"
            onChange={(event) => setForm((current) => ({ ...current, inAppMatches: event.target.checked }))}
            type="checkbox"
          />
          <span>
            <span className="block font-semibold text-stone-900">In-app match notifications</span>
            <span className="mt-1 block leading-6 text-stone-500">Show an inbox alert when a new report may match one of your open reports.</span>
          </span>
        </label>
        <Button disabled={saving} type="submit">
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </div>
  );
}

export default SettingsPage;
