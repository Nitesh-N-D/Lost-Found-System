import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { itemService } from "../services/itemService";
import { itemReportService } from "../services/itemReportService";
import { claimService } from "../services/claimService";
import { usePageMeta } from "../hooks/usePageMeta";
import { useAuth } from "../hooks/useAuth";
import PageLoader from "../components/common/PageLoader";
import StatusBadge from "../components/common/StatusBadge";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import SectionHeading from "../components/common/SectionHeading";
import ItemCard from "../components/items/ItemCard";
import { formatDate } from "../utils/formatters";
import { Icon } from "../components/common/Icons";
import icons from "../components/common/iconPaths";

function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [claimMessage, setClaimMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("incorrect_information");
  const [reportDetails, setReportDetails] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    itemService
      .getById(id)
      .then((nextData) => {
        if (active) setData(nextData);
      })
      .catch((error) => { if (active) toast.error(error?.message || "We couldn’t load this item."); })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  usePageMeta({
    title: data?.item?.title ? `${data.item.title} | Lost & Found` : "Item details | Lost & Found",
    description: data?.item?.description || "Explore item details, owner info, and claim actions.",
    image: data?.item?.imageUrl,
  });

  if (loading) return <PageLoader label="Loading item details..." />;
  if (!data?.item) return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="eyebrow text-xs font-semibold uppercase">Item unavailable</p>
      <h1 className="mt-4 text-3xl font-semibold text-stone-900">We couldn’t find that report.</h1>
      <p className="mt-3 text-stone-600">It may have been removed or the link may be incorrect.</p>
      <Link className="mt-7 inline-flex rounded-full bg-emerald-900 px-5 py-3 text-sm font-medium text-white" to="/">Back to listings</Link>
    </div>
  );

  const { item, similarItems = [] } = data;
  const itemImages = [item.imageUrl, ...(Array.isArray(item.gallery) ? item.gallery : [])]
    .filter((image, index, images) => image && images.indexOf(image) === index);
  const isOwner = Boolean(user?._id && item.reportedBy?._id)
    && String(user._id) === String(item.reportedBy._id);
  const isOpen = item.status === "open";

  const submitClaim = async (event) => {
    event.preventDefault();
    const message = claimMessage.trim();
    if (message.length < 10) {
      toast.error("Please provide at least 10 characters explaining why this item belongs to you.");
      return;
    }

    try {
      setSubmitting(true);
      const claim = await claimService.create(item._id, { message });
      toast.success("Claim submitted. You can continue the conversation in your dashboard.");
      setClaimMessage("");
      if (claim?._id) navigate(`/dashboard/chat/${claim._id}`);
      else navigate("/dashboard/claims");
    } catch (error) {
      toast.error(error?.message || "We couldn’t submit your claim. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const submitReport = async (event) => {
    event.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setReportSubmitting(true);
      await itemReportService.create(item._id, {
        reason: reportReason,
        details: reportDetails.trim(),
      });
      toast.success("Thanks. Your listing report was sent to the moderation team.");
      setReportOpen(false);
      setReportReason("incorrect_information");
      setReportDetails("");
    } catch (error) {
      toast.error(error?.message || "We couldn’t submit your report. Please try again.");
    } finally {
      setReportSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <div className="grid gap-8 xl:grid-cols-[1.15fr,0.85fr]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-[36px] border border-stone-200 bg-white">
            {itemImages[0] ? (
              <img alt={item.title} className="h-[320px] w-full object-cover sm:h-[420px]" loading="eager" src={itemImages[0]} />
            ) : (
              <div className="flex h-[420px] items-center justify-center bg-stone-100 text-stone-500">No image uploaded</div>
            )}
          </div>
          {itemImages.length > 1 ? <div className="grid gap-4 sm:grid-cols-3">
            {itemImages.slice(1, 4).map((image, index) => (
              <div key={image} className="overflow-hidden rounded-[24px] border border-stone-200 bg-white">
                <img alt={`${item.title} preview ${index + 1}`} className="h-28 w-full object-cover" loading="lazy" src={image} />
              </div>
            ))}
          </div> : null}
        </div>

        <div className="space-y-6">
          <div className="rounded-[36px] border border-stone-200 bg-white p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">{item.type}</span>
              <StatusBadge status={item.status} />
            </div>
            <h1 className="mt-5 text-4xl font-semibold text-stone-900">{item.title}</h1>
            <p className="mt-4 text-base leading-8 text-stone-600">{item.description}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-stone-50 p-4"><div className="flex items-center gap-3 text-stone-600"><Icon path={icons.location} /><span>{item.location}</span></div></div>
              <div className="rounded-[24px] bg-stone-50 p-4"><div className="flex items-center gap-3 text-stone-600"><Icon path={icons.calendar} /><span>{formatDate(item.date)}</span></div></div>
              <div className="rounded-[24px] bg-stone-50 p-4 text-stone-600">Category: {item.category}</div>
              <div className="rounded-[24px] bg-stone-50 p-4 text-stone-600">Reported by: {item.reportedBy?.name || "Community member"}</div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              {user ? (
                isOwner ? (
                  <p className="rounded-2xl bg-stone-50 p-4 text-sm text-stone-600">This is your listing. You can manage claims from your dashboard.</p>
                ) : (
                  <form className="space-y-4" onSubmit={submitClaim}>
                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-stone-700">Ownership details</span>
                      <textarea
                        className="min-h-32 w-full rounded-[24px] border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-emerald-500"
                        maxLength={500}
                        minLength={10}
                        onChange={(event) => setClaimMessage(event.target.value)}
                        placeholder="Describe identifying details that help verify your claim (10–500 characters)."
                        required
                        value={claimMessage}
                      />
                    </label>
                    <Button className="w-full justify-center" disabled={submitting || !isOpen} type="submit">
                      {submitting ? "Submitting claim..." : isOpen ? "Claim item" : "Claims are closed"}
                    </Button>
                  </form>
                )
              ) : (
                <Link to="/login"><Button className="w-full justify-center">Sign in to claim</Button></Link>
              )}
              {user ? (
                <Link to="/dashboard/claims"><Button className="w-full justify-center" variant="secondary">View my claims and chats</Button></Link>
              ) : null}
              <Button className="w-full justify-center" onClick={() => user ? setReportOpen(true) : navigate("/login")} type="button" variant="ghost">{user ? "Report issue" : "Sign in to report issue"}</Button>
            </div>
          </div>

          <div className="surface-card rounded-[30px] border p-6">
            <SectionHeading
              description="Add identifying details to a claim to start a private conversation. Contact information is only shared after a claim is approved."
              eyebrow="Connect safely"
              title={`A note for ${item.reportedBy?.name || "the reporter"}`}
            />
          </div>
        </div>
      </div>

      <section className="mt-16">
        <SectionHeading eyebrow="Similar items" title="You may also want to inspect these" description="Related open items from the same category help users cross-check before claiming." />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {similarItems.map((similarItem) => <ItemCard item={similarItem} key={similarItem._id} />)}
        </div>
      </section>

      <Modal open={reportOpen} onClose={() => setReportOpen(false)} title="Report this listing">
        <form className="space-y-4" onSubmit={submitReport}>
          <p className="text-sm leading-6 text-stone-600">
            Tell the moderation team what looks wrong. Reports are attached to this listing and reviewed by an administrator.
          </p>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-stone-700">Reason</span>
            <select
              className="form-control w-full rounded-[16px] border px-4 py-3 outline-none"
              onChange={(event) => setReportReason(event.target.value)}
              value={reportReason}
            >
              <option value="incorrect_information">Incorrect information</option>
              <option value="possible_scam">Possible scam or misleading listing</option>
              <option value="inappropriate_content">Inappropriate content</option>
              <option value="duplicate_listing">Duplicate listing</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-stone-700">Additional details (optional)</span>
            <textarea
              className="form-control min-h-28 w-full rounded-[16px] border px-4 py-3 outline-none"
              maxLength={500}
              onChange={(event) => setReportDetails(event.target.value)}
              placeholder="Share details that will help the moderation team review the report."
              value={reportDetails}
            />
            <span className="text-xs text-stone-500">{reportDetails.length}/500 characters</span>
          </label>
          <div className="flex justify-end gap-3">
            <Button disabled={reportSubmitting} onClick={() => setReportOpen(false)} type="button" variant="secondary">Cancel</Button>
            <Button disabled={reportSubmitting} type="submit">{reportSubmitting ? "Submitting..." : "Submit report"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ItemDetails;
