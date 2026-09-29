import { classNames } from "../../utils/classNames";

const styles = {
  open: "bg-emerald-50 text-emerald-800",
  claimed: "bg-amber-50 text-amber-800",
  closed: "bg-stone-100 text-stone-700",
  pending: "bg-sky-50 text-sky-800",
  approved: "bg-emerald-50 text-emerald-800",
  rejected: "bg-rose-50 text-rose-800",
};

function StatusBadge({ status }) {
  return (
    <span
      className={classNames(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize",
        styles[status] || "bg-stone-100 text-stone-700"
      )}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
