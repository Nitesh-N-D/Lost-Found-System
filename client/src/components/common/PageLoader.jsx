function PageLoader({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
      <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-600 border-t-white" />
      </div>
      <p className="text-sm tracking-[0.02em] text-slate-400">{label}</p>
    </div>
  );
}

export default PageLoader;
