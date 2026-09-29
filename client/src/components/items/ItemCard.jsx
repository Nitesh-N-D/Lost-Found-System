import { Link } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../utils/formatters";
import Button from "../common/Button";

function ItemCard({ item }) {
  return (
    <article className="item-card group overflow-hidden rounded-[26px] border transition duration-300 hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden bg-stone-100">
        {item.imageUrl ? (
          <img
            alt={item.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
            src={item.imageUrl}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-stone-500">
            No image available
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow text-xs font-semibold uppercase tracking-[0.2em]">
              {item.type}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-stone-900">{item.title}</h3>
          </div>
          <StatusBadge status={item.status} />
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-600">
          {item.description}
        </p>
        <div className="mt-4 flex items-center justify-between text-sm text-stone-500">
          <span>{item.location}</span>
          <span>{formatDate(item.date)}</span>
        </div>
        <Link className="mt-5 inline-block w-full" to={`/items/${item._id}`}>
          <Button className="w-full justify-center">
            {item.status === "open" ? "View and claim" : "View details"}
          </Button>
        </Link>
      </div>
    </article>
  );
}

export default ItemCard;
