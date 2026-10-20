import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { savedItemService } from "../../services/savedItemService";
import ItemCard from "../../components/items/ItemCard";
import EmptyState from "../../components/common/EmptyState";
import PageLoader from "../../components/common/PageLoader";
import { usePageMeta } from "../../hooks/usePageMeta";
import { Link } from "react-router-dom";

function SavedItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  usePageMeta({
    title: "Saved listings | Lost & Found",
    description: "Keep track of lost and found listings you want to revisit.",
  });

  useEffect(() => {
    let active = true;
    savedItemService.list()
      .then((result) => {
        if (active) setItems(Array.isArray(result) ? result : []);
      })
      .catch((error) => {
        if (active) {
          setLoadError(true);
          toast.error(error.message || "Saved listings could not be loaded.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  if (loading) return <PageLoader label="Loading saved listings..." />;
  if (loadError) return <p className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">Saved listings could not be loaded. Refresh the page to try again.</p>;

  return (
    <div className="space-y-7">
      <div>
        <p className="eyebrow text-xs font-semibold uppercase tracking-[0.3em]">Your collection</p>
        <h1 className="mt-3 text-3xl font-semibold text-stone-900">Saved listings</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">Keep useful listings close while you compare details or wait for an update.</p>
      </div>
      {items.length ? (
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item) => <ItemCard item={item} key={item._id} />)}
        </div>
      ) : (
        <EmptyState
          description="Open any listing and select “Save listing” to keep it here for later."
          title="No saved listings yet"
        />
      )}
      <Link className="inline-flex rounded-full border border-stone-200 px-5 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50" to="/">Browse listings</Link>
    </div>
  );
}

export default SavedItems;
