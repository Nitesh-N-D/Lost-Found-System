import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { itemService } from "../../services/itemService";
import ItemCard from "../../components/items/ItemCard";
import EmptyState from "../../components/common/EmptyState";

function MyItems() {
  const [data, setData] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    itemService
      .listMine()
      .then((items) =>
        setData({ items: Array.isArray(items) ? items : [] })
      )
      .catch((error) => { setLoadError(true); toast.error(error.message); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-stone-500">Loading your reports...</p>;
  if (loadError) return <p className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">Your reports could not be loaded. Refresh the page to try again.</p>;

  return data.items.length === 0 ? (
    <EmptyState
      description="Add a lost or found report to start your recovery workflow."
      title="No items yet"
    />
  ) : (
    <div className="grid gap-6 md:grid-cols-2">
      {data.items.map((item) => (
        <ItemCard item={item} key={item._id} />
      ))}
    </div>
  );
}

export default MyItems;
