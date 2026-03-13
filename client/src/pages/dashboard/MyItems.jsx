import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { itemService } from "../../services/itemService";
import ItemCard from "../../components/items/ItemCard";
import EmptyState from "../../components/common/EmptyState";

function MyItems() {
  const [data, setData] = useState({ items: [] });

  useEffect(() => {
    itemService
      .listMine()
      .then((items) =>
        setData({ items: Array.isArray(items) ? items : [] })
      )
      .catch((error) => toast.error(error.message));
  }, []);

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
