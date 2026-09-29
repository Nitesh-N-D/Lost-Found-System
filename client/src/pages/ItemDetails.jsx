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
      <Link className="mt-7 inline-flex rounded-full bg-emerald-900 px-5 py-3 text-sm font-medium text-stone-900" to="/">Back to listings</Link>
    </div>
  );

  const { item, similarItems = [] } = data;
  const itemImages = [item.imageUrl, ...(Array.isArray(item.gallery) ? item.gallery : [])]
    .filter((image, index, images) => image && images.indexOf(image) === index);

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
      toast.error(error?.message || "We couldn’t submit your claim. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <div className="grid gap-8 xl:grid-cols-[1.15fr,0.85fr]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-[36px] border border-stone-200 bg-white">
            {itemImages[0] ? (
              <img alt={item.title} className="h-[320px] w-full object-cover sm:h-[420px]" src={itemImages[0]} />
            ) : (
              <div className="flex h-[420px] items-center justify-center bg-stone-100 text-stone-500">
                No image uploaded
              </div>
            )}
          </div>
          {itemImages.length > 1 ? <div className="grid gap-4 sm:grid-cols-3">
            {itemImages.slice(1, 4).map((image, index) => (
              <div
                key={`${image || "placeholder"}-${index}`}
                className="overflow-hidden rounded-[24px] border border-stone-200 bg-white"
              >
                {image ? (
                  <img alt={`${item.title} preview ${index + 1}`} className="h-28 w-full object-cover" src={image} />
                ) : (
                  <div className="flex h-28 items-center justify-center text-sm text-stone-500">Preview</div>
                )}
              </div>
            ))}
          </div> : null}
        </div>

        <div className="space-y-6">
          <div className="rounded-[36px] border border-stone-200 bg-white p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
                {item.type}
              </span>
              <StatusBadge status={item.status} />
            </div>
            <h1 className="mt-5 text-4xl font-semibold text-stone-900">{item.title}</h1>
            <p className="mt-4 text-base leading-8 text-stone-600">{item.description}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-stone-50 p-4">
                <div className="flex items-center gap-3 text-stone-600">
                  <Icon path={icons.location} />
                  <span>{item.location}</span>
                </div>
              </div>
              <div className="rounded-[24px] bg-stone-50 p-4">
                <div className="flex items-center gap-3 text-stone-600">
                  <Icon path={icons.calendar} />
                  <span>{formatDate(item.date)}</span>
                </div>
              </div>
              <div className="rounded-[24px] bg-stone-50 p-4 text-stone-600">Category: {item.category}</div>
              <div className="rounded-[24px] bg-stone-50 p-4 text-stone-600">Owner: {item.reportedBy?.name}</div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              {user ? (
                <form className="space-y-4" onSubmit={submitClaim}>
                  <textarea
                    className="min-h-32 w-full rounded-[24px] border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-cyan-400/50"
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

          <div className="surface-card rounded-[30px] border p-6">
            <SectionHeading
              description="Add a few identifying details to your claim to start a private conversation. Contact information is only shared after a claim is approved."
              eyebrow="Connect safely"
              title={`A note for ${item.reportedBy?.name || "the reporter"}`}
            />
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
