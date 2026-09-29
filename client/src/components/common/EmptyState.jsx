function EmptyState({ title, description, action = null }) {
  return (
    <div className="rounded-[28px] border border-stone-200 bg-white/5 p-8 text-center shadow-xl shadow-slate-950/10">
      <h3 className="text-xl font-semibold text-stone-900">{title}</h3>
      <p className="mt-3 text-sm text-stone-600">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
