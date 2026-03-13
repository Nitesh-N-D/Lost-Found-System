function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 shadow-xl shadow-slate-950/10">
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-white">{value}</p>
      {hint ? <p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">{hint}</p> : null}
    </div>
  );
}

export default StatCard;
