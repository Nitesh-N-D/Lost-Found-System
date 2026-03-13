import { Link } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../utils/formatters";
import Button from "../common/Button";

function ItemCard({ item }) {
  return (
    <article className="group overflow-hidden rounded-[30px] border border-white/10 bg-white/5 shadow-xl shadow-slate-950/10 transition duration-300 hover:-translate-y-1 hover:border-white/20">
      <div className="relative h-56 overflow-hidden bg-slate-900">
        {item.imageUrl ? (
          <img
            alt={item.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
            src={item.imageUrl}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500">
            No image available
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">
              {item.type}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">{item.title}</h3>
          </div>
          <StatusBadge status={item.status} />
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-300">
          {item.description}
        </p>
        <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
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
