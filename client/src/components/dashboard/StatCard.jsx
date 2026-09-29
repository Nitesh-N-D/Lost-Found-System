function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-[28px] border border-stone-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 shadow-xl shadow-slate-950/10">
      <p className="text-sm font-medium text-stone-500">{label}</p>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">{value}</p>
      {hint ? <p className="mt-3 max-w-xs text-sm leading-6 text-stone-500">{hint}</p> : null}
    </div>
  );
}

export default StatCard;
