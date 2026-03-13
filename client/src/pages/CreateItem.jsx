import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { itemService } from "../services/itemService";
import { usePageMeta } from "../hooks/usePageMeta";
import Button from "../components/common/Button";

const initialForm = {
  title: "",
  description: "",
  category: "",
  type: "lost",
  location: "",
  date: "",
};

function CreateItem() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  usePageMeta({
    title: "Report an item | Lost & Found",
    description: "Create a polished lost or found item report with image upload and verification-ready details.",
  });

  const previewUrl = useMemo(() => (image ? URL.createObjectURL(image) : ""), [image]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    if (image) payload.append("image", image);

    try {
      setSubmitting(true);
      await itemService.create(payload);
      toast.success("Item reported successfully.");
      navigate("/dashboard/items");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:px-10">
      <div className="rounded-[36px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-8 shadow-2xl shadow-slate-950/20 md:p-10">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            Item reporting
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Report a lost or found item</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            Fill out clear details so claimants and admins can verify ownership faster.
          </p>
        </div>

        <form className="mt-10 grid gap-6 md:grid-cols-2" onSubmit={handleSubmit}>
          {[
            { label: "Title", name: "title", type: "text" },
            { label: "Category", name: "category", type: "text" },
            { label: "Location", name: "location", type: "text" },
            { label: "Date", name: "date", type: "date" },
          ].map((field) => (
            <label className="space-y-2" key={field.name}>
              <span className="text-sm text-slate-400">{field.label}</span>
              <input
                className="w-full rounded-[18px] border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-white/30"
                name={field.name}
                onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))}
                required
                type={field.type}
                value={form[field.name]}
              />
            </label>
          ))}

          <label className="space-y-2">
            <span className="text-sm text-slate-400">Type</span>
            <select
              className="w-full rounded-[18px] border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-white/30"
              name="type"
              onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
              value={form.type}
            >
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-400">Image</span>
            <label className="flex min-h-[170px] cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-white/15 bg-slate-950/60 p-5 text-center text-sm text-slate-500 transition hover:border-white/25 hover:bg-slate-900">
              <span>Click to upload or drag and drop</span>
              {previewUrl ? (
                <img alt="Preview" className="mt-4 h-28 rounded-2xl object-cover" src={previewUrl} />
              ) : null}
              <input
                accept="image/*"
                className="hidden"
                onChange={(event) => setImage(event.target.files?.[0] || null)}
                type="file"
              />
            </label>
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm text-slate-400">Description</span>
            <textarea
              className="min-h-40 w-full rounded-[22px] border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-white/30"
              name="description"
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              required
              value={form.description}
            />
          </label>

          <div className="md:col-span-2">
            <Button className="w-full justify-center" disabled={submitting} type="submit">
              {submitting ? "Publishing item..." : "Publish item"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateItem;
