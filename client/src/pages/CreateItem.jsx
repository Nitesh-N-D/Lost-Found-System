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
  const [duplicateCandidate, setDuplicateCandidate] = useState(null);
  const [pendingForm, setPendingForm] = useState(null);

  usePageMeta({
    title: "Report an item | Lost & Found",
    description: "Create a polished lost or found item report with image upload and verification-ready details.",
  });

  const previewUrl = useMemo(() => (image ? URL.createObjectURL(image) : ""), [image]);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    setDuplicateCandidate(null);
    setPendingForm(null);
  };

  const publishItem = async (normalizedForm) => {
    setSubmitting(true);
    try {
      const result = await itemService.list({
        type: normalizedForm.type,
        category: normalizedForm.category,
        location: normalizedForm.location,
        status: "open",
        limit: 24,
      });
      const words = (value) => new Set(String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/).filter(Boolean));
      const similarity = (left, right) => {
        const a = words(left);
        const b = words(right);
        if (!a.size || !b.size) return 0;
        return [...a].filter((word) => b.has(word)).length / Math.max(a.size, b.size);
      };
      const duplicate = (result?.items || []).find((item) =>
        item.type === normalizedForm.type && similarity(item.title, normalizedForm.title) >= 0.55
      );
      if (duplicate) {
        setDuplicateCandidate(duplicate);
        setPendingForm(normalizedForm);
        return;
      }
    } catch {
      toast("Similar reports could not be checked. You can still publish your report.");
    } finally {
      setSubmitting(false);
    }

    await publishItem(normalizedForm);
  };

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
                onChange={(event) => updateField(field.name, event.target.value)}
                required
                type={field.type}
                value={form[field.name]}
              />
            </label>
          ))}

          <label className="space-y-2">
            <span className="text-sm text-stone-500">Type</span>
            <select className="form-control w-full rounded-[16px] border px-4 py-3 outline-none" name="type" onChange={(event) => updateField("type", event.target.value)} value={form.type}>
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
              onChange={(event) => updateField("description", event.target.value)}
              required
              value={form.description}
            />
            <span className="text-xs text-stone-500">{form.description.length}/1000 characters</span>
          </label>

          {duplicateCandidate ? (
            <div className="md:col-span-2 rounded-2xl border border-amber-300 bg-amber-50 p-4" role="alert">
              <p className="font-semibold text-stone-900">A similar open report may already exist</p>
              <p className="mt-1 text-sm leading-6 text-stone-700">
                “{duplicateCandidate.title}” is listed as a {duplicateCandidate.type} report in {duplicateCandidate.location}. This is only a warning; the reports may refer to different items.
              </p>
              <Link className="mt-2 inline-flex text-sm font-semibold text-emerald-900 underline underline-offset-4" rel="noreferrer" target="_blank" to={"/items/" + duplicateCandidate._id}>
                Review existing report
              </Link>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button disabled={submitting} onClick={() => { const formToPublish = pendingForm; setDuplicateCandidate(null); setPendingForm(null); if (formToPublish) publishItem(formToPublish); }} type="button">
                  Publish anyway
                </Button>
                <Button onClick={() => { setDuplicateCandidate(null); setPendingForm(null); }} type="button" variant="secondary">
                  Edit report
                </Button>
              </div>
            </div>
          ) : null}
          <div className="md:col-span-2">
            <Button className="w-full justify-center" disabled={submitting} type="submit">
              {submitting ? "Checking for similar reports..." : "Publish item"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateItem;
