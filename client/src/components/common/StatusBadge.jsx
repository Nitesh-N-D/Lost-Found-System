import { classNames } from "../../utils/classNames";

const styles = {
  open: "bg-emerald-500/15 text-emerald-300",
  claimed: "bg-amber-500/15 text-amber-200",
  closed: "bg-slate-500/20 text-slate-200",
  pending: "bg-sky-500/15 text-sky-200",
  approved: "bg-emerald-500/15 text-emerald-300",
  rejected: "bg-rose-500/15 text-rose-200",
};

function StatusBadge({ status }) {
  return (
    <span
      className={classNames(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize",
        styles[status] || "bg-slate-500/20 text-slate-200"
      )}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
