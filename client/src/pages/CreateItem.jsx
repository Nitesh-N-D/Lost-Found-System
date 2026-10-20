import { useEffect, useMemo, useState } from "react";
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

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

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

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const handleImageChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    if (!selectedFile) {
      setImage(null);
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.has(selectedFile.type)) {
      setImage(null);
      event.target.value = "";
      toast.error("Choose a JPEG, PNG, WebP, or GIF image.");
      return;
    }

    if (selectedFile.size > MAX_IMAGE_SIZE) {
      setImage(null);
      event.target.value = "";
      toast.error("Images must be 5 MB or smaller.");
      return;
    }

    setImage(selectedFile);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const normalizedForm = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      location: form.location.trim(),
    };

    if (normalizedForm.title.length < 3 || normalizedForm.description.length < 10
      || normalizedForm.category.length < 2 || normalizedForm.location.length < 2
      || !normalizedForm.date) {
      toast.error("Please complete all fields with valid details before publishing.");
      return;
    }

    const payload = new FormData();
    Object.entries(normalizedForm).forEach(([key, value]) => payload.append(key, value));
    if (image) payload.append("image", image);

    try {
      setSubmitting(true);
      await itemService.create(payload);
      toast.success("Item reported successfully.");
      navigate("/dashboard/items");
    } catch (error) {
      toast.error(error?.message || "We couldn’t publish your report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:px-10">
      <div className="surface-card rounded-[32px] border p-6 sm:p-8 md:p-10">
        <div className="max-w-2xl">
          <p className="eyebrow text-xs font-semibold uppercase">Item reporting</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">Report a lost or found item</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">Fill out clear details so claimants and admins can verify ownership faster.</p>
        </div>

        <form className="mt-10 grid gap-6 md:grid-cols-2" onSubmit={handleSubmit}>
          {[
            { label: "Title", name: "title", type: "text", minLength: 3, maxLength: 120 },
            { label: "Category", name: "category", type: "text", minLength: 2, maxLength: 50 },
            { label: "Location", name: "location", type: "text", minLength: 2, maxLength: 120 },
            { label: "Date", name: "date", type: "date" },
          ].map((field) => (
            <label className="space-y-2" key={field.name}>
              <span className="text-sm text-stone-500">{field.label}</span>
              <input
                className="form-control w-full rounded-[16px] border px-4 py-3 outline-none"
                maxLength={field.maxLength}
                minLength={field.minLength}
                name={field.name}
                onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))}
                required
                type={field.type}
                value={form[field.name]}
              />
            </label>
          ))}

          <label className="space-y-2">
            <span className="text-sm text-stone-500">Type</span>
            <select className="form-control w-full rounded-[16px] border px-4 py-3 outline-none" name="type" onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))} value={form.type}>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </label>

          <div className="space-y-2">
            <span className="text-sm text-stone-600" id="image-upload-label">Image (optional)</span>
            <label className="flex min-h-[170px] cursor-pointer flex-col items-center justify-center rounded-[22px] border border-dashed border-stone-300 bg-stone-50 p-5 text-center text-sm text-stone-600 transition hover:border-emerald-700 hover:bg-emerald-50">
              <span>{image ? image.name : "Choose a JPEG, PNG, WebP, or GIF image (max 5 MB)"}</span>
              {previewUrl ? <img alt="Selected item preview" className="mt-4 h-28 rounded-2xl object-cover" src={previewUrl} /> : null}
              <input accept="image/jpeg,image/png,image/webp,image/gif" aria-labelledby="image-upload-label" className="sr-only" onChange={handleImageChange} type="file" />
            </label>
          </div>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm text-stone-600">Description</span>
            <textarea
              className="form-control min-h-40 w-full rounded-[18px] border px-4 py-3 outline-none"
              maxLength={1000}
              minLength={10}
              name="description"
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              required
              value={form.description}
            />
            <span className="text-xs text-stone-500">{form.description.length}/1000 characters</span>
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
