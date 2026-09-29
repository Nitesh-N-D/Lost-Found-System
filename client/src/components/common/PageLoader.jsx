function PageLoader({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
      <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-stone-200 bg-white">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-emerald-100 border-t-emerald-800" />
      </div>
      <p className="text-sm tracking-[0.02em] text-stone-500">{label}</p>
    </div>
  );
}

export default PageLoader;
