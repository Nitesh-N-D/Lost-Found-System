import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { itemService } from "../services/itemService";
import { claimService } from "../services/claimService";
import { usePageMeta } from "../hooks/usePageMeta";
import { useAuth } from "../hooks/useAuth";
import PageLoader from "../components/common/PageLoader";
import StatusBadge from "../components/common/StatusBadge";
import Button from "../components/common/Button";
import SectionHeading from "../components/common/SectionHeading";
import ItemCard from "../components/items/ItemCard";
import { formatDate } from "../utils/formatters";
import { Icon } from "../components/common/Icons";
import icons from "../components/common/iconPaths";

function ItemDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [claimMessage, setClaimMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    itemService
      .getById(id)
      .then((nextData) => {
        if (active) setData(nextData);
      })
      .catch((error) => toast.error(error.message))
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
  if (!data?.item) return null;

  const { item, similarItems = [] } = data;

  const submitClaim = async (event) => {
    event.preventDefault();
    if (!claimMessage.trim()) {
      toast.error("Please describe why this item belongs to you.");
      return;
    }

    try {
      setSubmitting(true);
      await claimService.create(item._id, { message: claimMessage });
      toast.success("Claim submitted. Continue in your dashboard chat.");
      setClaimMessage("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <div className="grid gap-8 xl:grid-cols-[1.15fr,0.85fr]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-[36px] border border-white/10 bg-white/5">
            {item.imageUrl ? (
              <img alt={item.title} className="h-[420px] w-full object-cover" src={item.imageUrl} />
            ) : (
              <div className="flex h-[420px] items-center justify-center bg-slate-900 text-slate-500">
                No image uploaded
              </div>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[item.imageUrl, item.imageUrl, item.imageUrl].map((image, index) => (
              <div
                key={`${image || "placeholder"}-${index}`}
                className="overflow-hidden rounded-[24px] border border-white/10 bg-white/5"
              >
                {image ? (
                  <img alt={`${item.title} preview ${index + 1}`} className="h-28 w-full object-cover" src={image} />
                ) : (
                  <div className="flex h-28 items-center justify-center text-sm text-slate-500">Preview</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[36px] border border-white/10 bg-white/5 p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
                {item.type}
              </span>
              <StatusBadge status={item.status} />
            </div>
            <h1 className="mt-5 text-4xl font-semibold text-white">{item.title}</h1>
            <p className="mt-4 text-base leading-8 text-slate-300">{item.description}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-slate-950/60 p-4">
                <div className="flex items-center gap-3 text-slate-300">
                  <Icon path={icons.location} />
                  <span>{item.location}</span>
                </div>
              </div>
              <div className="rounded-[24px] bg-slate-950/60 p-4">
                <div className="flex items-center gap-3 text-slate-300">
                  <Icon path={icons.calendar} />
                  <span>{formatDate(item.date)}</span>
                </div>
              </div>
              <div className="rounded-[24px] bg-slate-950/60 p-4 text-slate-300">Category: {item.category}</div>
              <div className="rounded-[24px] bg-slate-950/60 p-4 text-slate-300">Owner: {item.reportedBy?.name}</div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              {user ? (
                <form className="space-y-4" onSubmit={submitClaim}>
                  <textarea
                    className="min-h-32 w-full rounded-[24px] border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
                    onChange={(event) => setClaimMessage(event.target.value)}
                    placeholder="Tell the owner why this item is yours."
                    value={claimMessage}
                  />
                  <Button className="w-full justify-center" disabled={submitting || item.status !== "open"} type="submit">
                    {submitting ? "Submitting claim..." : "Claim item"}
                  </Button>
                </form>
              ) : (
                <Link to="/login">
                  <Button className="w-full justify-center">Sign in to claim</Button>
                </Link>
              )}
              <Link to="/dashboard/claims">
                <Button className="w-full justify-center" variant="secondary">
                  Contact owner
                </Button>
              </Link>
              <Button className="w-full justify-center" variant="ghost">
                Report issue
              </Button>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <SectionHeading
              description="Phone access stays locked until a claim is approved."
              eyebrow="Owner info"
              title={item.reportedBy?.name || "Owner details"}
            />
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <Icon path={icons.email} />
                <span>{item.reportedBy?.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon path={icons.phone} />
                <span>{item.reportedBy?.phone || "Phone available after claim approval"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <SectionHeading
          eyebrow="Similar items"
          title="You may also want to inspect these"
          description="Related open items from the same category help users cross-check before claiming."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {similarItems.map((similarItem) => (
            <ItemCard item={similarItem} key={similarItem._id} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default ItemDetails;
